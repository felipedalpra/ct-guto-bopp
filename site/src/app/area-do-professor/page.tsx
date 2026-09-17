// site/src/app/area-do-professor/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Material } from "@/types/area-do-professor";

export const metadata: Metadata = {
  title: "Materiais",
  robots: { index: false, follow: false },
};

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
        className="mt-2 inline-block text-sm text-lime-ct hover:underline"
      >
        Assistir vídeo
      </a>
    );
  }

  return (
    <div className="mt-3 aspect-video overflow-hidden rounded-md">
      <iframe
        src={embed}
        title={titulo}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

export default async function PaginaAreaDoProfessor() {
  const supabase = await createClient();
  const { data: materiais } = await supabase
    .from("materiais")
    .select("*")
    .order("criado_em", { ascending: false });

  const lista = (materiais ?? []) as Material[];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-2xl">Materiais da Metodologia</h1>
      {lista.length === 0 ? (
        <p className="text-sand/60">Nenhum material publicado ainda.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {lista.map((material) => (
            <li
              key={material.id}
              className="rounded-lg border border-sand/10 bg-navy-800 p-4"
            >
              <span className="text-xs uppercase tracking-wide text-lime-ct">
                {ROTULOS_TIPO[material.tipo]}
              </span>
              <h2 className="font-display text-lg">{material.titulo}</h2>
              {material.descricao ? (
                <p className="text-sm text-sand/70">{material.descricao}</p>
              ) : null}
              {material.tipo === "arquivo" ? (
                <Link
                  href={`/area-do-professor/materiais/${material.id}/download`}
                  className="mt-2 inline-block text-sm text-lime-ct hover:underline"
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
                  className="mt-2 inline-block text-sm text-lime-ct hover:underline"
                >
                  Abrir link
                </a>
              ) : null}
              {material.tipo === "texto" && material.corpo_texto ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-sand/80">
                  {material.corpo_texto}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
