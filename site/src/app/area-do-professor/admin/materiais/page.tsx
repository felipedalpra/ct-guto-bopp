import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Material } from "@/types/area-do-professor";
import FormularioMaterial from "./FormularioMaterial";
import AcoesMaterial from "./AcoesMaterial";
import {
  ArquivoPreview,
  VideoEmbutido,
  ROTULOS_TIPO,
} from "@/components/area-do-professor/CartaoMaterial";

export const metadata: Metadata = {
  title: "Materiais — Painel do CT",
  robots: { index: false, follow: false },
};

const normalizar = (titulo: string) => titulo.trim().toLowerCase();

const formatarData = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  });

export default async function PaginaAdminMateriais() {
  const supabase = await createClient();
  const { data: materiais, error } = await supabase
    .from("materiais")
    .select("*")
    .order("criado_em", { ascending: false });

  const lista = (materiais ?? []) as Material[];
  const contagemTitulos = new Map<string, number>();
  for (const material of lista) {
    const chave = normalizar(material.titulo);
    contagemTitulos.set(chave, (contagemTitulos.get(chave) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl">Materiais</h1>
          <a
            href="/area-do-professor/admin"
            className="text-sm text-sand/60 hover:underline"
          >
            ← Voltar ao painel
          </a>
        </div>
        <a
          href="/area-do-professor/admin/trilhas"
          className="text-lime-ct hover:underline"
        >
          Gerenciar trilhas →
        </a>
      </div>

      <FormularioMaterial />

      {error ? (
        <p className="rounded-lg border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200" role="alert">
          Não foi possível carregar os materiais agora. Atualize a página ou tente novamente em alguns instantes.
        </p>
      ) : null}

      <p className="text-sm text-sand/60">
        {lista.length} {lista.length === 1 ? "material" : "materiais"} · do mais recente ao mais antigo
      </p>

      <ul className="grid gap-4 md:grid-cols-2">
        {lista.map((material) => {
          const repetido = (contagemTitulos.get(normalizar(material.titulo)) ?? 0) > 1;
          return (
            <li key={material.id} className="material-cartao">
              <div className="flex flex-wrap items-center gap-2">
                <span className="material-cartao__tipo">{ROTULOS_TIPO[material.tipo]}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    material.publicado
                      ? "bg-lime-ct/15 text-lime-ct"
                      : "bg-sand/10 text-sand/70"
                  }`}
                >
                  {material.publicado ? "Publicado" : "Rascunho"}
                </span>
                {repetido ? (
                  <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-xs text-amber-300">
                    Título repetido
                  </span>
                ) : null}
              </div>
              <h2 className="material-cartao__titulo">{material.titulo}</h2>
              <p className="text-xs text-sand/50">Enviado em {formatarData(material.criado_em)}</p>
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
                  className="material-cartao__acao break-all"
                >
                  {material.link_url}
                </a>
              ) : null}
              {material.tipo === "texto" && material.corpo_texto ? (
                <p className="material-cartao__texto line-clamp-6">{material.corpo_texto}</p>
              ) : null}

              <div className="mt-auto flex flex-col gap-2 pt-3">
                <AcoesMaterial
                  id={material.id}
                  titulo={material.titulo}
                  publicado={material.publicado}
                  arquivoPath={material.arquivo_path}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
