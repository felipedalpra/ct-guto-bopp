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

      {material.tipo === "arquivo" ? (
        <Link
          href={`/area-do-professor/materiais/${material.id}/download`}
          className="material-cartao__acao"
        >
          Baixar arquivo
        </Link>
      ) : null}
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
