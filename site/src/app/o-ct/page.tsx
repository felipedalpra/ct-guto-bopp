import type { Metadata } from "next";
import Link from "next/link";
import CapaPagina from "@/components/CapaPagina";
import Depoimentos from "@/components/Depoimentos";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import Mapa from "@/components/Mapa";
import Revela from "@/components/Revela";
import Secao, { Blocos, Prosa } from "@/components/Secao";
import { entregas, missao, publicos, quemSomos } from "@/data/ct";
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

      <Secao numero="01" rotulo="Quem somos" titulo="Três frentes, uma base só" estreita>
        <Prosa paragrafos={quemSomos} />
        <Revela como="blockquote" className="autoridade__missao" atraso={120}>
          {missao}
        </Revela>
      </Secao>

      <Secao
        numero="02"
        rotulo="Para quem é"
        titulo="Três públicos, três caminhos"
        intro="O CT não atende só quem quer aprender a jogar. Encontre o seu ponto de entrada."
        clara
      >
        <ul className="publicos">
          {publicos.map((publico, i) => (
            <Revela como="li" key={publico.chave} atraso={i * 80}>
              <article className="publico">
                <p className="publico__rotulo">{publico.rotulo}</p>
                <h3 className="publico__titulo">
                  <Link href={publico.href}>{publico.titulo}</Link>
                </h3>
                <p className="publico__texto">{publico.texto}</p>
                <p className="publico__chamada" aria-hidden="true">
                  {publico.chamada}
                </p>
              </article>
            </Revela>
          ))}
        </ul>
      </Secao>

      <Secao
        numero="03"
        rotulo="O que o CT entrega"
        titulo="Sete coisas, não uma aula solta"
        intro="É o que separa um centro de treinamento de um professor com horário livre na quadra."
      >
        <Blocos itens={entregas} />
      </Secao>

      <Depoimentos numero="04" />

      <Secao
        numero="05"
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
