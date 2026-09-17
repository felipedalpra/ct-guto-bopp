import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Material } from "@/types/area-do-professor";
import FormularioMaterial from "./FormularioMaterial";
import { alternarPublicado, excluirMaterial } from "./actions";

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
      <div>
        <h1 className="font-display text-2xl">Materiais</h1>
        <a
          href="/area-do-professor/admin"
          className="text-sm text-sand/60 hover:underline"
        >
          ← Voltar ao painel
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
            <div className="flex gap-2">
              <form
                action={alternarPublicado.bind(
                  null,
                  material.id,
                  material.publicado
                )}
              >
                <button
                  type="submit"
                  className="rounded-md border border-lime-ct/40 px-3 py-1 text-sm text-lime-ct hover:bg-lime-ct/10"
                >
                  {material.publicado ? "Despublicar" : "Publicar"}
                </button>
              </form>
              <form
                action={excluirMaterial.bind(
                  null,
                  material.id,
                  material.arquivo_path
                )}
              >
                <button
                  type="submit"
                  className="rounded-md border border-red-400/40 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10"
                >
                  Excluir
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
