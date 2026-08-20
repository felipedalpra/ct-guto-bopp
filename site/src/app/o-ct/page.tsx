import type { Metadata } from "next";
import CapaPagina from "@/components/CapaPagina";
import Depoimentos from "@/components/Depoimentos";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import Mapa from "@/components/Mapa";
import Revela from "@/components/Revela";
import Secao, { Blocos, Prosa } from "@/components/Secao";
import { entregas, missao, quemSomos } from "@/data/ct";
import { faqAlunos } from "@/data/faq";
import { nodoFaq, nodoTrilha } from "@/data/schema";
import { site } from "@/data/site";

const trilha = [{ titulo: "O CT", href: "/o-ct" }];

export const metadata: Metadata = {
  title: "O CT Guto Bopp",
  description:
    "Centro de Treinamento de Beach Tennis em Porto Alegre, fundado por Guto Bopp. Treinamento de atletas, capacitação de professores e acompanhamento contínuo, todos sobre a mesma metodologia.",
  alternates: { canonical: "/o-ct" },
};

export default function PaginaCt() {
  return (
    <>
      <CapaPagina
        sobretitulo="Centro de Treinamento"
        titulo="O CT Guto Bopp"
        intro={`Beach Tennis em ${site.endereco.cidade}, voltado ao desenvolvimento de atletas e de professores — sobre uma metodologia própria, construída em quadra.`}
        trilha={trilha}
      />

      <Secao numero="01" rotulo="Quem somos" titulo="Um time, uma formação, a mesma aula" estreita>
        <Prosa paragrafos={quemSomos} />
        <Revela como="blockquote" className="autoridade__missao" atraso={120}>
          {missao}
        </Revela>
      </Secao>

      <Secao
        numero="02"
        rotulo="O que o CT entrega"
        titulo="O que está incluído em treinar aqui"
        intro="O que separa um CT de um professor com horário livre na quadra."
      >
        <Blocos itens={entregas} />
      </Secao>

      <Depoimentos numero="03" />

      <Secao
        numero="04"
        rotulo="Onde funciona"
        solto
        titulo="A sede"
        intro={`${site.endereco.local} — ${site.endereco.rua}, ${site.endereco.bairro}, ${site.endereco.cidade}/${site.endereco.estado}. ${site.horario.texto}. O CT também atua em outras cidades: um dos professores do time dá aula no Porto Sports, em Palmares do Sul.`}
      >
        <Mapa />
      </Secao>

      <Faq itens={faqAlunos} nome="faq-alunos" />

      <JsonLd nodos={[nodoTrilha(trilha), nodoFaq("/o-ct", faqAlunos)]} />
    </>
  );
}
