// site/src/app/area-do-professor/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { obterPerfilAtual } from "@/lib/supabase/perfil";
import Secao from "@/components/Secao";
import CartaoTrilha from "@/components/area-do-professor/CartaoTrilha";
import ExploradorMateriais from "@/components/area-do-professor/ExploradorMateriais";
import type {
  ComentarioMaterial,
  InteracoesDoMaterial,
  Material,
  Trilha,
  TrilhaMaterial,
} from "@/types/area-do-professor";

export const metadata: Metadata = {
  title: "Materiais",
  robots: { index: false, follow: false },
};

export default async function PaginaAreaDoProfessor() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const perfil = await obterPerfilAtual();

  const [
    { data: trilhas, error: erroTrilhas },
    { data: trilhaMateriais, error: erroTrilhaMateriais },
    { data: materiais, error: erroMateriais },
    { data: progresso },
    { data: curtidas },
    { data: comentarios },
  ] = await Promise.all([
    supabase.from("trilhas").select("*").order("criado_em", { ascending: false }),
    supabase.from("trilha_materiais").select("trilha_id, material_id, ordem"),
    supabase.from("materiais").select("*").order("criado_em", { ascending: false }),
    user
      ? supabase
          .from("progresso_material")
          .select("material_id")
          .eq("professor_id", user.id)
      : Promise.resolve({ data: [] as { material_id: string }[] }),
    supabase.from("material_curtidas").select("material_id, professor_id"),
    supabase
      .from("material_comentarios")
      .select("*")
      .order("criado_em", { ascending: true }),
  ]);

  const listaTrilhas = (trilhas ?? []) as Trilha[];
  const listaTrilhaMateriais = (trilhaMateriais ?? []) as TrilhaMaterial[];
  const listaMateriais = (materiais ?? []) as Material[];
  const vistos = new Set((progresso ?? []).map((linha) => linha.material_id));
  const curtidasPorMaterial = new Map<string, { professor_id: string }[]>();
  for (const curtida of curtidas ?? []) {
    const lista = curtidasPorMaterial.get(curtida.material_id) ?? [];
    lista.push(curtida);
    curtidasPorMaterial.set(curtida.material_id, lista);
  }
  const comentariosPorMaterial = new Map<string, ComentarioMaterial[]>();
  for (const comentario of (comentarios ?? []) as ComentarioMaterial[]) {
    const lista = comentariosPorMaterial.get(comentario.material_id) ?? [];
    lista.push(comentario);
    comentariosPorMaterial.set(comentario.material_id, lista);
  }
  const interacoes = (materialId: string): InteracoesDoMaterial => {
    const curtidasDoMaterial = curtidasPorMaterial.get(materialId) ?? [];
    return {
      curtidas: curtidasDoMaterial.length,
      curtiu: Boolean(
        user && curtidasDoMaterial.some((item) => item.professor_id === user.id)
      ),
      comentarios: comentariosPorMaterial.get(materialId) ?? [],
    };
  };

  const idsEmTrilha = new Set(listaTrilhaMateriais.map((linha) => linha.material_id));
  const materiaisSoltos = listaMateriais.filter(
    (material) => !idsEmTrilha.has(material.id)
  );

  const numeroSoltos = listaTrilhas.length > 0 ? "02" : "01";
  // Falhas de trilhas não devem esconder os materiais avulsos. A consulta de
  // materiais, por outro lado, precisa ser explícita para não parecer uma lista vazia.
  const erroDeConteudo = erroMateriais;
  const erroDeTrilhas = erroTrilhas || erroTrilhaMateriais;
  const trilhasComProgresso = listaTrilhas.map((trilha) => {
    const itens = listaTrilhaMateriais.filter((item) => item.trilha_id === trilha.id);
    return {
      trilha,
      total: itens.length,
      concluidos: itens.filter((item) => vistos.has(item.material_id)).length,
    };
  });
  const proximaTrilha = trilhasComProgresso.find(({ total, concluidos }) => total > concluidos);
  const materiaisParaExplorar = materiaisSoltos.map((material) => ({
    material,
    visto: vistos.has(material.id),
    interacoes: interacoes(material.id),
  }));

  return (
    <>
      {erroDeConteudo ? (
        <Secao numero="01" rotulo="Materiais" titulo="Não foi possível carregar os materiais">
          <p className="text-sand/70">
            Atualize a página ou tente novamente em alguns instantes. Se o problema continuar, avise o CT.
          </p>
        </Secao>
      ) : null}

      {!erroDeConteudo && erroDeTrilhas ? (
        <p className="mx-auto max-w-6xl px-6 py-4 text-sm text-sand/70" role="alert">
          As trilhas não puderam ser carregadas agora; os materiais disponíveis continuam abaixo.
        </p>
      ) : null}

      {!erroDeConteudo ? (
        <section className="painel-aprendizado">
          <div>
            <p className="painel-aprendizado__sobretitulo">Área do Professor</p>
            <h1>Olá, {perfil?.nome?.split(" ")[0] ?? "professor"}.</h1>
            <p>Seu espaço para estudar a metodologia, acompanhar seu avanço e descobrir o que há de novo no CT.</p>
          </div>
          <div className="painel-aprendizado__numeros">
            <span><b>{vistos.size}</b> materiais vistos</span>
            <span><b>{listaTrilhas.length}</b> trilhas disponíveis</span>
          </div>
          {proximaTrilha ? (
            <Link href={`/area-do-professor/trilhas/${proximaTrilha.trilha.id}`} className="painel-aprendizado__continuar">
              <span>Continue aprendendo</span>
              <strong>{proximaTrilha.trilha.titulo}</strong>
              <small>{proximaTrilha.concluidos} de {proximaTrilha.total} concluídos →</small>
            </Link>
          ) : null}
        </section>
      ) : null}

      {!erroDeConteudo && listaTrilhas.length > 0 ? (
        <Secao
          numero="01"
          rotulo="Trilhas"
          titulo="Trilhas da Metodologia"
          intro="Sequências de materiais organizadas pelo CT — acompanhe seu progresso em cada uma."
        >
          <ul className="trilhas-grade">
            {trilhasComProgresso.map(({ trilha, total, concluidos }) => {
              return (
                <li key={trilha.id}>
                  <CartaoTrilha
                    trilha={trilha}
                    total={total}
                    concluidos={concluidos}
                  />
                </li>
              );
            })}
          </ul>
        </Secao>
      ) : null}

      {!erroDeConteudo ? (
        <Secao
          numero={numeroSoltos}
          rotulo="Materiais"
          titulo="Encontre o que precisa"
          intro="Busque por assunto ou filtre por tipo de conteúdo."
        >
          {materiaisSoltos.length === 0 ? (
            <p className="text-sand/60">Nenhum material publicado ainda.</p>
          ) : (
            <ExploradorMateriais
              materiais={materiaisParaExplorar}
              usuarioId={user?.id ?? null}
              podeModerar={perfil?.role === "lider"}
            />
          )}
        </Secao>
      ) : null}
    </>
  );
}
