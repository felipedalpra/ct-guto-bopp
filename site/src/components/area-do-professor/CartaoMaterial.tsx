import Link from "next/link";
import { alternarVisto } from "@/app/area-do-professor/progresso-actions";
import type { Material } from "@/types/area-do-professor";

const ROTULOS_TIPO: Record<Material["tipo"], string> = {
  arquivo: "Arquivo",
  video: "Vídeo",
  link: "Link",
  texto: "Aviso",
};

function paraUrlEmbutida(url: string): string | null {
  try {
    const alvo = new URL(url);
    if (alvo.hostname.includes("youtube.com")) {
      const id = alvo.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (alvo.hostname === "youtu.be") {
      const id = alvo.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (alvo.hostname.includes("vimeo.com")) {
      const id = alvo.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

const EXTENSOES_IMAGEM = ["png", "jpg", "jpeg"];

function extensaoArquivo(caminho: string): string {
  return caminho.split(".").pop()?.toLowerCase() ?? "";
}

/**
 * PDF e imagem o navegador já sabe exibir sozinho, então entram embutidos —
 * o link de baixar continua ali do lado, pra quem quiser salvar. DOCX e XLSX
 * não têm visualizador nativo; exigiria um serviço externo (link público, o
 * que não combina com a signed URL de 60s) ou uma lib de conversão no site,
 * então esses continuam só com o link de download.
 */
function ArquivoPreview({ material }: { material: Material }) {
  const url = `/area-do-professor/materiais/${material.id}/download`;
  const extensao = material.arquivo_path ? extensaoArquivo(material.arquivo_path) : "";

  if (extensao === "pdf") {
    return (
      <div className="material-cartao__arquivo-preview">
        <iframe src={url} title={material.titulo} />
        <Link href={url} className="material-cartao__acao">
          Baixar arquivo
        </Link>
      </div>
    );
  }

  if (EXTENSOES_IMAGEM.includes(extensao)) {
    return (
      <div className="material-cartao__arquivo-preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={material.titulo} />
        <Link href={url} className="material-cartao__acao">
          Baixar arquivo
        </Link>
      </div>
    );
  }

  return (
    <Link href={url} className="material-cartao__acao">
      Baixar arquivo
    </Link>
  );
}

function VideoEmbutido({ url, titulo }: { url: string; titulo: string }) {
  const embed = paraUrlEmbutida(url);

  if (!embed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="material-cartao__acao"
      >
        Assistir vídeo
      </a>
    );
  }

  return (
    <div className="material-cartao__video">
      <iframe
        src={embed}
        title={titulo}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default function CartaoMaterial({
  material,
  visto,
}: {
  material: Material;
  visto: boolean;
}) {
  return (
    <li className={`material-cartao${visto ? " material-cartao--visto" : ""}`}>
      <span className="material-cartao__tipo">{ROTULOS_TIPO[material.tipo]}</span>
      <h4 className="material-cartao__titulo">{material.titulo}</h4>
      {material.descricao ? (
        <p className="material-cartao__descricao">{material.descricao}</p>
      ) : null}

      {material.tipo === "arquivo" ? <ArquivoPreview material={material} /> : null}
      {material.tipo === "video" && material.video_url ? (
        <VideoEmbutido url={material.video_url} titulo={material.titulo} />
      ) : null}
      {material.tipo === "link" && material.link_url ? (
        <a
          href={material.link_url}
          target="_blank"
          rel="noreferrer"
          className="material-cartao__acao"
        >
          Abrir link
        </a>
      ) : null}
      {material.tipo === "texto" && material.corpo_texto ? (
        <p className="material-cartao__texto">{material.corpo_texto}</p>
      ) : null}

      <form action={alternarVisto.bind(null, material.id, visto)}>
        <button
          type="submit"
          className="material-cartao__visto"
          aria-pressed={visto}
        >
          {visto ? "✓ Visto" : "Marcar como visto"}
        </button>
      </form>
    </li>
  );
}
