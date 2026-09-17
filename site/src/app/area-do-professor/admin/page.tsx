import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Perfil } from "@/types/area-do-professor";
import FormularioConvite from "./FormularioConvite";
import { alternarStatusProfessor } from "./actions";

export const metadata: Metadata = {
  title: "Painel do CT",
  robots: { index: false, follow: false },
};

export default async function PaginaAdmin() {
  const supabase = await createClient();
  const { data: professores } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "professor")
    .order("criado_em", { ascending: false });

  const lista = (professores ?? []) as Perfil[];

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="font-display text-2xl">Painel do CT</h1>
        <p className="text-sm text-sand/70">
          Convide professores e gerencie o acesso deles.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg">Convidar professor</h2>
        <FormularioConvite />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg">Professores</h2>
        {lista.length === 0 ? (
          <p className="text-sand/60">Nenhum professor convidado ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {lista.map((professor) => (
              <li
                key={professor.id}
                className="flex items-center justify-between rounded-lg border border-sand/10 bg-navy-800 p-4"
              >
                <div>
                  <p>{professor.nome}</p>
                  <p className="text-sm text-sand/60">{professor.email}</p>
                </div>
                <form
                  action={alternarStatusProfessor.bind(
                    null,
                    professor.id,
                    professor.status
                  )}
                >
                  <button
                    type="submit"
                    className={
                      professor.status === "ativo"
                        ? "rounded-md border border-red-400/40 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10"
                        : "rounded-md border border-lime-ct/40 px-3 py-1 text-sm text-lime-ct hover:bg-lime-ct/10"
                    }
                  >
                    {professor.status === "ativo" ? "Revogar" : "Reativar"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <a
        href="/area-do-professor/admin/materiais"
        className="text-lime-ct hover:underline"
      >
        Gerenciar materiais →
      </a>
    </div>
  );
}
