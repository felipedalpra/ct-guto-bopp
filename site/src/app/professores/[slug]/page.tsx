import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CapaPagina from "@/components/CapaPagina";
import FichaProfessor from "@/components/FichaProfessor";
import JsonLd from "@/components/JsonLd";
import { professorPorSlug, professores } from "@/data/professores";
import { nodoProfessor, nodoTrilha } from "@/data/schema";

type Props = { params: Promise<{ slug: string }> };

/** Uma página por professor, gerada no build a partir de data/professores.ts. */
export function generateStaticParams() {
  return professores.map((pessoa) => ({ slug: pessoa.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pessoa = professorPorSlug(slug);
  if (!pessoa) return {};

  return {
    title: `${pessoa.nome} — ${pessoa.papel}`,
    description: `${pessoa.nome}, ${pessoa.papel.toLowerCase()} do CT Guto Bopp em ${pessoa.local}. ${pessoa.diferencial}`,
    alternates: { canonical: `/professores/${pessoa.slug}` },
    openGraph: pessoa.foto ? { images: [pessoa.foto] } : undefined,
  };
}

export default async function PaginaProfessor({ params }: Props) {
  const { slug } = await params;
  const pessoa = professorPorSlug(slug);
  if (!pessoa) notFound();

  const trilha = [
    { titulo: "Professores", href: "/professores" },
    { titulo: pessoa.nome, href: `/professores/${pessoa.slug}` },
  ];

  return (
    <>
      <CapaPagina
        sobretitulo={pessoa.papel}
        titulo={pessoa.nome}
        intro={pessoa.local}
        trilha={trilha}
      />

      <FichaProfessor pessoa={pessoa} />

      <JsonLd nodos={[nodoTrilha(trilha), nodoProfessor(pessoa)]} />
    </>
  );
}
