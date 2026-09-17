import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Material, Trilha, TrilhaMaterial } from "@/types/area-do-professor";
import { adicionarMaterialNaTrilha, removerMaterialDaTrilha } from "../actions";

export const metadata: Metadata = {
  title: "Gerenciar trilha",
  robots: { index: false, follow: false },
};

export default async function PaginaAdminTrilha({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: trilha } = await supabase
    .from("trilhas")
    .select("*")
    .eq("id", id)
    .single();

  if (!trilha) {
    redirect("/area-do-professor/admin/trilhas");
  }

  const [{ data: trilhaMateriais }, { data: todosMateriais }] = await Promise.all([
    supabase
      .from("trilha_materiais")
      .select("trilha_id, material_id, ordem, materiais(*)")
      .eq("trilha_id", id)
      .order("ordem", { ascending: true }),
    supabase.from("materiais").select("*").order("titulo", { ascending: true }),
  ]);

  type LinhaComMaterial = TrilhaMaterial & { materiais: Material | null };
  // Supabase infere selects de relação aninhada (materiais(*)) como any[] sem
  // tipos de Database gerados — o cast direto falha (TS2352), daí o duplo cast.
  const linhas = ((trilhaMateriais ?? []) as unknown as LinhaComMaterial[]);
  const idsNaTrilha = new Set(linhas.map((linha) => linha.material_id));
  const disponiveis = ((todosMateriais ?? []) as Material[]).filter(
    (material) => !idsNaTrilha.has(material.id)
  );

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="font-display text-2xl">{(trilha as Trilha).titulo}</h1>
        <p className="text-sm text-sand/70">
          {(trilha as Trilha).publicado ? "Publicada" : "Rascunho"} — gerencie os
          materiais desta trilha e a ordem deles.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg">Materiais nesta trilha</h2>
        {linhas.length === 0 ? (
          <p className="text-sand/60">Nenhum material adicionado ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {linhas
              .filter((linha) => linha.materiais !== null)
              .map((linha) => (
                <li
                  key={linha.material_id}
                  className="flex items-center justify-between rounded-lg border border-sand/10 bg-navy-800 p-4"
                >
                  <span>
                    <span className="mr-2 text-sand/50">#{linha.ordem}</span>
                    {linha.materiais!.titulo}
                  </span>
                  <form
                    action={removerMaterialDaTrilha.bind(
                      null,
                      id,
                      linha.material_id
                    )}
                  >
                    <button
                      type="submit"
                      className="rounded-md border border-red-400/40 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10"
                    >
                      Remover
                    </button>
                  </form>
                </li>
              ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg">Adicionar material</h2>
        {disponiveis.length === 0 ? (
          <p className="text-sand/60">
            Todos os materiais existentes já estão nesta trilha.
          </p>
        ) : (
          <form
            action={adicionarMaterialNaTrilha.bind(null, id)}
            className="flex flex-col gap-3 rounded-lg border border-sand/10 bg-navy-800 p-4 sm:flex-row sm:items-end"
          >
            <label className="flex flex-1 flex-col gap-1 text-sm text-sand/80">
              Material
              <select
                name="material_id"
                required
                className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
              >
                {disponiveis.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.titulo}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-sand/80">
              Ordem
              <input
                name="ordem"
                type="number"
                defaultValue={linhas.length}
                className="w-24 rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
              />
            </label>
            <button
              type="submit"
              className="rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright"
            >
              Adicionar
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
