import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Trilha } from "@/types/area-do-professor";
import FormularioTrilha from "./FormularioTrilha";
import { alternarPublicadoTrilha, excluirTrilha } from "./actions";

export const metadata: Metadata = {
  title: "Trilhas",
  robots: { index: false, follow: false },
};

export default async function PaginaAdminTrilhas() {
  const supabase = await createClient();
  const { data: trilhas } = await supabase
    .from("trilhas")
    .select("*")
    .order("criado_em", { ascending: false });

  const lista = (trilhas ?? []) as Trilha[];

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="font-display text-2xl">Trilhas</h1>
        <p className="text-sm text-sand/70">
          Agrupe materiais em sequências, tipo curso.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg">Nova trilha</h2>
        <FormularioTrilha />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg">Trilhas existentes</h2>
        {lista.length === 0 ? (
          <p className="text-sand/60">Nenhuma trilha criada ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {lista.map((trilha) => (
              <li
                key={trilha.id}
                className="flex items-center justify-between rounded-lg border border-sand/10 bg-navy-800 p-4"
              >
                <div>
                  <Link
                    href={`/area-do-professor/admin/trilhas/${trilha.id}`}
                    className="text-lime-ct hover:underline"
                  >
                    {trilha.titulo}
                  </Link>
                  <p className="text-sm text-sand/60">
                    {trilha.publicado ? "Publicada" : "Rascunho"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form
                    action={alternarPublicadoTrilha.bind(
                      null,
                      trilha.id,
                      trilha.publicado
                    )}
                  >
                    <button
                      type="submit"
                      className="rounded-md border border-lime-ct/40 px-3 py-1 text-sm text-lime-ct hover:bg-lime-ct/10"
                    >
                      {trilha.publicado ? "Despublicar" : "Publicar"}
                    </button>
                  </form>
                  <form action={excluirTrilha.bind(null, trilha.id)}>
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
        )}
      </section>
    </div>
  );
}
