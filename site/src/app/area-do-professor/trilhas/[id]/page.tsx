// site/src/app/area-do-professor/trilhas/[id]/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { obterPerfilAtual } from "@/lib/supabase/perfil";
import CartaoMaterial from "@/components/area-do-professor/CartaoMaterial";
import type {
  ComentarioMaterial,
  InteracoesDoMaterial,
  Material,
  Trilha,
  TrilhaMaterial,
} from "@/types/area-do-professor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("trilhas")
    .select("titulo")
    .eq("id", id)
    .single();

  return {
    title: data?.titulo ?? "Trilha",
    robots: { index: false, follow: false },
  };
}

export default async function PaginaTrilha({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const perfil = await obterPerfilAtual();

  const { data: trilha } = await supabase
    .from("trilhas")
    .select("*")
    .eq("id", id)
    .single();

  if (!trilha) {
    redirect("/area-do-professor");
  }

  const [
    { data: trilhaMateriais },
    { data: progresso },
    { data: curtidas },
    { data: comentarios },
  ] = await Promise.all([
    supabase
      .from("trilha_materiais")
      .select("trilha_id, material_id, ordem, materiais(*)")
      .eq("trilha_id", id)
      .order("ordem", { ascending: true }),
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

  type LinhaComMaterial = TrilhaMaterial & { materiais: Material | null };
  // Supabase infere selects de relação aninhada (materiais(*)) como any[] sem
  // tipos de Database gerados — o cast direto falha (TS2352), daí o duplo cast.
  const materiaisOrdenados = ((trilhaMateriais ?? []) as unknown as LinhaComMaterial[])
    .map((linha) => linha.materiais)
    .filter((material): material is Material => material !== null);

  return (
    <div className="trilha-detalhe">
      <Link href="/area-do-professor" className="trilha-detalhe__voltar">
        ← Voltar para Materiais
      </Link>
      <h1 className="display trilha-detalhe__titulo">{(trilha as Trilha).titulo}</h1>
      {(trilha as Trilha).descricao ? (
        <p className="trilha-detalhe__descricao">{(trilha as Trilha).descricao}</p>
      ) : null}

      {materiaisOrdenados.length === 0 ? (
        <p className="text-sand/60">Essa trilha ainda não tem materiais.</p>
      ) : (
        <ul className="materiais-tipo-grade trilha-detalhe__grade">
          {materiaisOrdenados.map((material) => (
            <CartaoMaterial
              key={material.id}
              material={material}
              visto={vistos.has(material.id)}
              interacoes={interacoes(material.id)}
              usuarioId={user?.id ?? null}
              podeModerar={perfil?.role === "lider"}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
