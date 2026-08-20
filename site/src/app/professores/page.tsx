import type { Metadata } from "next";
import CapaPagina from "@/components/CapaPagina";
import JsonLd from "@/components/JsonLd";
import Professores from "@/components/Professores";
import Revela from "@/components/Revela";
import Secao, { Prosa } from "@/components/Secao";
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
      <CapaPagina
        sobretitulo="Nosso time"
        titulo="Quem está na areia com você"
        trilha={trilha}
      />

      <Secao
        numero="01"
        rotulo="Como o time se forma"
        titulo="Ninguém entra sem passar pela metodologia"
        estreita
      >
        <Prosa
          paragrafos={[
            "O CT não contrata professor pronto e o deixa dar aula do jeito dele. Todo mundo que está na areia com o nome do CT passou pelo Conexão BT e ensina pelos mesmos cinco pilares.",
            "O que muda de um para o outro é o perfil — quem tem mais traquejo com criança, quem trabalha melhor a parte tática, quem prefere alto rendimento. Por isso vale ler as fichas antes de escolher.",
          ]}        />
      </Secao>

      <Professores />

      <Secao numero="03" rotulo="Onde dão aula" titulo="Dois pontos de aula" clara estreita>
        <Revela className="prosa">
          <p>
            A maior parte do time dá aula na sede, a Prainha Beach Tennis, em Porto
            Alegre. Rafael Cunha atende no Porto Sports, em Palmares do Sul. Está
            fora dessas duas cidades? Pergunte no WhatsApp o que existe perto de você.
          </p>
        </Revela>
      </Secao>

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
