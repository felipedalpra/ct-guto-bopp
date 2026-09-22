import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { exigirLider } from "@/lib/supabase/perfil";
import type { ComentarioMaterial, Material, Perfil } from "@/types/area-do-professor";

export const metadata: Metadata = {
  title: "Interações — Painel do CT",
  robots: { index: false, follow: false },
};

type RegistroMaterial = { material_id: string; professor_id: string };

function nomes(ids: string[], porId: Map<string, string>) {
  return ids.map((id) => porId.get(id) ?? "Professor removido").join(", ");
}

export default async function PaginaInteracoes() {
  // Esta página consulta os registros com a chave administrativa somente após
  // confirmar o líder. Assim, a RLS dos professores continua restrita às suas
  // próprias atividades, mas o responsável pelo CT pode acompanhá-las.
  await exigirLider();
  const supabase = createAdminClient();
  const [
    { data: materiais, error: erroMateriais },
    { data: progresso, error: erroProgresso },
    { data: curtidas, error: erroCurtidas },
    { data: comentarios, error: erroComentarios },
    { data: professores, error: erroProfessores },
  ] = await Promise.all([
    supabase.from("materiais").select("*").order("criado_em", { ascending: false }),
    supabase.from("progresso_material").select("material_id, professor_id"),
    supabase.from("material_curtidas").select("material_id, professor_id"),
    supabase.from("material_comentarios").select("*").order("criado_em", { ascending: true }),
    supabase.from("profiles").select("id, nome, role, status, email, criado_em"),
  ]);

  const erro = erroMateriais || erroProgresso || erroCurtidas || erroComentarios || erroProfessores;
  const nomesPorProfessor = new Map(
    ((professores ?? []) as Perfil[]).map((professor) => [professor.id, professor.nome])
  );
  const vistosPorMaterial = new Map<string, string[]>();
  for (const visto of (progresso ?? []) as RegistroMaterial[]) {
    const lista = vistosPorMaterial.get(visto.material_id) ?? [];
    lista.push(visto.professor_id);
    vistosPorMaterial.set(visto.material_id, lista);
  }
  const curtidasPorMaterial = new Map<string, string[]>();
  for (const curtida of (curtidas ?? []) as RegistroMaterial[]) {
    const lista = curtidasPorMaterial.get(curtida.material_id) ?? [];
    lista.push(curtida.professor_id);
    curtidasPorMaterial.set(curtida.material_id, lista);
  }
  const comentariosPorMaterial = new Map<string, ComentarioMaterial[]>();
  for (const comentario of (comentarios ?? []) as ComentarioMaterial[]) {
    const lista = comentariosPorMaterial.get(comentario.material_id) ?? [];
    lista.push(comentario);
    comentariosPorMaterial.set(comentario.material_id, lista);
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <Link href="/area-do-professor" className="text-sm text-sand/60 hover:underline">
          ← Voltar à visão geral
        </Link>
        <h1 className="mt-3 font-display text-2xl">Interações dos materiais</h1>
        <p className="mt-1 text-sm text-sand/70">
          Acompanhe quem viu, curtiu e comentou cada publicação.
        </p>
      </section>

      {erro ? (
        <p className="rounded-lg border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200" role="alert">
          Não foi possível carregar todas as interações agora. Atualize a página ou tente novamente em alguns instantes.
        </p>
      ) : null}

      {(materiais ?? []).length === 0 ? (
        <p className="text-sand/60">Nenhum material criado ainda.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {((materiais ?? []) as Material[]).map((material) => {
            const vistos = vistosPorMaterial.get(material.id) ?? [];
            const curtidasDoMaterial = curtidasPorMaterial.get(material.id) ?? [];
            const comentariosDoMaterial = comentariosPorMaterial.get(material.id) ?? [];

            return (
              <li key={material.id} className="rounded-lg border border-sand/10 bg-navy-800 p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div>
                    <h2 className="font-display text-lg">{material.titulo}</h2>
                    <p className="text-xs uppercase tracking-wider text-sand/55">
                      {material.tipo} · {material.publicado ? "Publicado" : "Rascunho"}
                    </p>
                  </div>
                  <div className="flex gap-3 text-sm text-sand/75">
                    <span>{vistos.length} viram</span>
                    <span>{curtidasDoMaterial.length} curtiram</span>
                    <span>{comentariosDoMaterial.length} comentários</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <h3 className="font-medium text-sand">Quem viu</h3>
                    <p className="mt-1 text-sand/70">{vistos.length ? nomes(vistos, nomesPorProfessor) : "Ninguém marcou como visto ainda."}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sand">Quem curtiu</h3>
                    <p className="mt-1 text-sand/70">{curtidasDoMaterial.length ? nomes(curtidasDoMaterial, nomesPorProfessor) : "Nenhuma curtida ainda."}</p>
                  </div>
                </div>

                <div className="mt-4 border-t border-sand/10 pt-4">
                  <h3 className="font-medium text-sand">Comentários</h3>
                  {comentariosDoMaterial.length === 0 ? (
                    <p className="mt-1 text-sm text-sand/70">Nenhum comentário ainda.</p>
                  ) : (
                    <ul className="mt-3 space-y-3">
                      {comentariosDoMaterial.map((comentario) => (
                        <li key={comentario.id} className="rounded-md bg-navy-900/60 p-3 text-sm">
                          <p className="text-sand"><strong>{comentario.autor_nome}</strong><span className="text-sand/50"> · {new Date(comentario.criado_em).toLocaleDateString("pt-BR")}</span></p>
                          <p className="mt-1 whitespace-pre-wrap text-sand/75">{comentario.conteudo}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
