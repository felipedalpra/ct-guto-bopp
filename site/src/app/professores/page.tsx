import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Professores from "@/components/Professores";
import { time, hrefProfessor } from "@/data/professores";
import { idProfessor, nodoTrilha, urlDe } from "@/data/schema";

const trilha = [{ titulo: "Professores", href: "/professores" }];

export const metadata: Metadata = {
  title: "Professores",
  description:
    "O time do CT Guto Bopp: professores formados dentro da Metodologia Guto Bopp, dando aula de Beach Tennis em Porto Alegre e em Palmares do Sul.",
  alternates: { canonical: "/professores" },
};

export default function PaginaProfessores() {
  return (
    <>
      <Professores abertura trilha={trilha} />

      <JsonLd
        nodos={[
          nodoTrilha(trilha),
          {
            "@type": "ItemList",
            "@id": `${urlDe("/professores")}#time`,
            name: "Professores do CT Guto Bopp",
            itemListElement: time.map((pessoa, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: urlDe(hrefProfessor(pessoa)),
              name: pessoa.nome,
              item: { "@id": idProfessor(pessoa) },
            })),
          },
        ]}
      />
    </>
  );
}
