import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Material } from "@/types/area-do-professor";
import FormularioMaterial from "./FormularioMaterial";
import AcoesMaterial from "./AcoesMaterial";

export const metadata: Metadata = {
  title: "Materiais — Painel do CT",
  robots: { index: false, follow: false },
};

export default async function PaginaAdminMateriais() {
  const supabase = await createClient();
  const { data: materiais } = await supabase
    .from("materiais")
    .select("*")
    .order("criado_em", { ascending: false });

  const lista = (materiais ?? []) as Material[];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
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

      <ul className="flex flex-col gap-2">
        {lista.map((material) => (
          <li
            key={material.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-sand/10 bg-navy-800 p-4"
          >
            <div>
              <p className="font-medium">{material.titulo}</p>
              <p className="text-sm text-sand/60">
                {material.tipo} · {material.publicado ? "Publicado" : "Rascunho"}
              </p>
            </div>
            <AcoesMaterial
              id={material.id}
              titulo={material.titulo}
              publicado={material.publicado}
              arquivoPath={material.arquivo_path}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
