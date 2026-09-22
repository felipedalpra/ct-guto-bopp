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
  Perfil,
  Trilha,
  TrilhaMaterial,
} from "@/types/area-do-professor";

export const metadata: Metadata = {
  title: "Materiais",
  robots: { index: false, follow: false },
};

export default async function PaginaAreaDoProfessor() {
  const supabase = await createClient();
  const perfil = await obterPerfilAtual();
  const usuarioId = perfil?.id ?? null;

  // O líder não precisa esperar as consultas de progresso, comentários e
  // curtidas da experiência de estudo. A entrada dele é operacional.
  if (perfil?.role === "lider") {
    const [
      { data: materiais },
      { data: trilhas },
      { data: professores },
    ] = await Promise.all([
      supabase.from("materiais").select("*").order("criado_em", { ascending: false }),
      supabase.from("trilhas").select("*").order("criado_em", { ascending: false }),
      supabase.from("profiles").select("*").eq("role", "professor"),
    ]);
    const listaMateriais = (materiais ?? []) as Material[];
    const listaTrilhas = (trilhas ?? []) as Trilha[];
    const listaProfessores = (professores ?? []) as Perfil[];
    const ativos = listaProfessores.filter((professor) => professor.status === "ativo").length;
    const publicados = listaMateriais.filter((material) => material.publicado).length;
    const trilhasPublicadas = listaTrilhas.filter((trilha) => trilha.publicado).length;

    return (
      <div className="painel-lider">
        <section className="painel-lider__abertura">
          <div>
            <p>PAINEL DO CT</p>
            <h1>Olá, {perfil.nome.split(" ")[0]}.</h1>
            <span>Gerencie conteúdos e acompanhe sua rede de professores.</span>
          </div>
          <Link href="/area-do-professor/admin/materiais" className="painel-lider__acao-principal">
            + Publicar material
          </Link>
        </section>

        <section className="painel-lider__metricas" aria-label="Resumo do CT">
          <div><b>{ativos}</b><span>professores ativos</span></div>
          <div><b>{publicados}</b><span>materiais publicados</span></div>
          <div><b>{listaMateriais.length - publicados}</b><span>rascunhos</span></div>
          <div><b>{trilhasPublicadas}</b><span>trilhas no ar</span></div>
        </section>

        <section className="painel-lider__atalhos">
          <Link href="/area-do-professor/admin/materiais">
            <span>01</span><strong>Conteúdos</strong><small>Publicar, revisar e organizar materiais →</small>
          </Link>
          <Link href="/area-do-professor/admin/trilhas">
            <span>02</span><strong>Trilhas</strong><small>Montar jornadas de aprendizagem →</small>
          </Link>
          <Link href="/area-do-professor/admin">
            <span>03</span><strong>Professores</strong><small>Convidar e gerenciar acessos →</small>
          </Link>
        </section>

        <section className="painel-lider__recentes">
          <div className="painel-lider__secao-cabecalho">
            <div><p>ATUALIZAÇÕES</p><h2>Materiais recentes</h2></div>
            <Link href="/area-do-professor/admin/materiais">Ver todos</Link>
          </div>
          {listaMateriais.length === 0 ? (
            <p className="text-sand/60">Nenhum material criado ainda.</p>
          ) : (
            <ul>
              {listaMateriais.slice(0, 4).map((material) => (
                <li key={material.id}>
                  <div><strong>{material.titulo}</strong><span>{material.tipo}</span></div>
                  <em data-publicado={material.publicado}>{material.publicado ? "Publicado" : "Rascunho"}</em>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    );
  }

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
    usuarioId
      ? supabase
          .from("progresso_material")
          .select("material_id")
          .eq("professor_id", usuarioId)
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
        usuarioId && curtidasDoMaterial.some((item) => item.professor_id === usuarioId)
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
              usuarioId={usuarioId}
              podeModerar={false}
            />
          )}
        </Secao>
      ) : null}
    </>
  );
}
