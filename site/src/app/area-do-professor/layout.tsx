import type { Metadata } from "next";
import SubNav from "@/components/area-do-professor/SubNav";
import { obterPerfilAtual } from "@/lib/supabase/perfil";
import { sair } from "./actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// O projeto Supabase está em São Paulo. Mantendo estas páginas na mesma região
// evitamos uma travessia internacional a cada troca de aba autenticada.
export const preferredRegion = "gru1";

export default async function LayoutAreaDoProfessor({
  children,
}: {
  children: React.ReactNode;
}) {
  const perfil = await obterPerfilAtual();

  return (
    <div className="area-do-professor-shell min-h-screen bg-navy-900 text-sand">
      {perfil ? (
        <header className="flex items-center justify-between border-b border-sand/10 px-4 py-3 sm:px-8">
          <span className="font-display text-sm uppercase tracking-wide text-sand/70">
            Área do Professor
          </span>
          <div className="flex items-center gap-4 text-sm">
            <span>{perfil.nome}</span>
            {perfil.role === "lider" ? (
              <a
                href="/area-do-professor/admin"
                className="text-lime-ct hover:underline"
              >
                Professores
              </a>
            ) : null}
            <form action={sair}>
              <button type="submit" className="text-sand/70 hover:text-sand">
                Sair
              </button>
            </form>
          </div>
        </header>
      ) : null}
      {perfil ? <SubNav role={perfil.role} /> : null}
      <main className="px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
