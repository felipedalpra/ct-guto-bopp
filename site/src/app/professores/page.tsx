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
        intro="Professores formados dentro da Metodologia Guto Bopp, atuando em Porto Alegre e em Palmares do Sul. Toque em um nome para ver a ficha completa e falar direto com a pessoa."
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
            "O CT não contrata professor pronto e o deixa dar aula do jeito dele. Todo mundo que está na areia com o nome do CT passou pela capacitação — o Conexão BT — e ensina pelos mesmos cinco pilares.",
            "Na prática isso quer dizer que a estrutura da aula é a mesma seja qual for o professor: objetivo definido antes de entrar em quadra, correção na causa do erro e um fechamento em que o aluno sai sabendo o que evoluiu. O que muda de um para o outro é o perfil — quem tem mais traquejo com criança, quem trabalha melhor a parte tática, quem prefere alto rendimento.",
            "Por isso vale ler as fichas antes de escolher. E se ainda estiver em dúvida, o CT indica.",
          ]}
        />
      </Secao>

      <Professores />

      <Secao
        numero="03"
        rotulo="Onde dão aula"
        titulo="Porto Alegre e Palmares do Sul"
        clara
        estreita
      >
        <Revela className="prosa">
          <p>
            A maior parte do time dá aula na sede, a Prainha Beach Tennis, na Av.
            Saturnino de Brito, 738, em Porto Alegre — todos os dias, das 07h às 20h.
          </p>
          <p>
            Rafael Cunha atende no Porto Sports, em Palmares do Sul, no litoral. O CT
            também atua em outras cidades; se você está fora de Porto Alegre, pergunte
            no WhatsApp o que existe perto de você.
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
