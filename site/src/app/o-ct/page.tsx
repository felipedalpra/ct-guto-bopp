import type { Metadata } from "next";
import Link from "next/link";
import CapaPagina from "@/components/CapaPagina";
import Cena from "@/components/Cena";
import Depoimentos from "@/components/Depoimentos";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import Mapa from "@/components/Mapa";
import Revela from "@/components/Revela";
import Secao, { Blocos, Prosa } from "@/components/Secao";
import { anuncioCt, chegadaPrainha } from "@/data/cenas";
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

      <Secao numero="01" rotulo="Quem somos" titulo="Um time, a mesma aula" estreita>
        <Prosa paragrafos={quemSomos} />
        <Revela como="blockquote" className="autoridade__missao" atraso={120}>
          {missao}
        </Revela>
      </Secao>

      <Secao
        numero="02"
        rotulo="O que o CT entrega"
        titulo="Mais que uma hora de quadra"
        intro="O que separa um CT de um professor com horário livre na quadra."
      >
        {/* O anúncio do CT entra AQUI, e não na seção 01: uma peça 9:16 legível
            passa dos 450px e só encaixa ao lado de conteúdo que chegue perto
            dessa altura. A 01 é prosa de dois parágrafos em coluna de leitura;
            esta lista de quatro entregas mais a nota é o primeiro companheiro
            alto o bastante. O vídeo fica à esquerda para ser lido antes da
            lista — os cards dizem o que o CT entrega, ele mostra onde e com
            quem. O clipe curto da confraternização segue lá embaixo, na seção
            do endereço, como bastidor. */}
        <Cena cena={anuncioCt} lado="esquerda" encaixe="acompanha">
          <>
            {/* `duas` porque a coluna encolheu: no auto-fit padrão as quatro
                entregas caem em 3 + 1 e sobra uma célula vazia emoldurada ao
                lado da última. Em 2 × 2 a grade fecha. */}
            <Blocos itens={entregas} colunas="duas" />

            {/* O que vem depois do curso (acompanhamento, mentoria, formação
                continuada, reciclagem) era mais quatro cards iguais aqui
                dentro, contando de novo o que a página do Conexão BT conta
                inteiro. */}
            <Revela className="secao__nota">
              <p>
                Quem se forma aqui não é solto no mercado depois da formatura.{" "}
                <Link href="/conexao-bt">Ver o que continua depois do curso</Link>
              </p>
            </Revela>
          </>
        </Cena>
      </Secao>

      <Depoimentos numero="03" />

      <Secao
        numero="04"
        rotulo="Onde funciona"
        solto
        titulo="A sede"
        intro={`${site.endereco.local} — ${site.endereco.rua}, ${site.endereco.bairro}, ${site.endereco.cidade}/${site.endereco.estado}. ${site.horario.texto}.`}
      >
        {/* A chegada do CT à Prainha fica exatamente aqui: é a seção que fala de
            onde o CT funciona, e é a única com um companheiro de altura livre —
            o mapa estica para a altura do vídeo e as duas colunas terminam
            juntas, sem sobrar vazio embaixo de nenhuma. */}
        <div className="shell">
          <Cena cena={chegadaPrainha} encaixe="estica">
            <Mapa />
          </Cena>
        </div>
      </Secao>

      <Faq itens={faqAlunos} nome="faq-alunos" />

      <JsonLd nodos={[nodoTrilha(trilha), nodoFaq("/o-ct", faqAlunos)]} />
    </>
  );
}
