import type { Metadata } from "next";
import Link from "next/link";
import CapaPagina from "@/components/CapaPagina";
import JsonLd from "@/components/JsonLd";
import Metodo from "@/components/Metodo";
import Niveis from "@/components/Niveis";
import Passos from "@/components/Passos";
import Revela from "@/components/Revela";
import Secao, { Blocos, Prosa } from "@/components/Secao";
import { anatomiaDaAula, formatos, oProblema } from "@/data/metodo";
import { nodoTrilha } from "@/data/schema";
import { site, whatsappMensagens } from "@/data/site";

const trilha = [{ titulo: "Método", href: "/metodo" }];

export const metadata: Metadata = {
  title: "Método dos 5 Pilares",
  description:
    "A Metodologia Guto Bopp, o método de ensino do CT: organização, correção, desenvolvimento técnico, desenvolvimento tático e qualidade da aula — os cinco pilares que sustentam cada treino, do iniciante ao competitivo.",
  alternates: { canonical: "/metodo" },
};

export default function PaginaMetodo() {
  return (
    <>
      <CapaPagina
        sobretitulo="Metodologia Guto Bopp"
        titulo={
          <>
            O Método dos <span className="metodo__cinco">5</span> Pilares
          </>
        }
        intro="Cinco frentes que sustentam cada aula do CT. Não são temas soltos: uma depende da anterior, e é essa ordem que faz o aluno evoluir sem pular etapa."
        trilha={trilha}
      />

      <Secao numero="01" rotulo="Por que existe" titulo={oProblema.titulo} estreita>
        <Prosa paragrafos={oProblema.paragrafos} />
      </Secao>

      <Metodo />

      <Secao
        numero="03"
        rotulo="Na prática"
        titulo="Como é uma aula, do começo ao fim"
        intro="A organização — o primeiro pilar — não é uma ideia abstrata. É esta sequência, repetida em toda aula do CT."
      >
        <Passos
          itens={anatomiaDaAula.map((etapa) => ({
            chave: etapa.fase,
            marcador: etapa.fase,
            titulo: etapa.titulo,
            texto: etapa.texto,
          }))}
        />
      </Secao>

      <Secao
        numero="04"
        rotulo="Por nível"
        titulo="Quatro níveis, quatro pontos de entrada"
        intro="Não existe turma única. O método define por onde cada aluno começa e o que se cobra dele em cada estágio."
        clara
      >
        <Niveis />
      </Secao>

      <Secao
        numero="05"
        rotulo="Formatos"
        titulo="Em que formatos se treina"
        intro="Todos seguem a mesma metodologia; o que muda é a densidade de correção por hora de quadra e o tipo de trabalho que cabe em cada um."
      >
        <Blocos itens={formatos.map((f) => ({ titulo: f.nome, texto: f.texto }))} />
      </Secao>

      <Secao numero="06" rotulo="Adiante" titulo="Quem aplica esse método" estreita>
        <Revela className="prosa">
          <p>
            É esse método que os professores do CT aplicam na aula — todos formados
            dentro dele — e é ele que o Conexão BT ensina a quem já dá aula de Beach
            Tennis.
          </p>
        </Revela>
        <Revela className="adiante__links" atraso={80}>
          <a
            className="btn btn--primario"
            href={site.whatsapp.link(whatsappMensagens.metodo)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Treinar dentro do método
          </a>
          <Link className="btn btn--linha" href="/professores">
            Ver os professores
          </Link>
          <Link className="btn btn--linha" href="/conexao-bt">
            Conhecer o Conexão BT
          </Link>
        </Revela>
      </Secao>

      <JsonLd nodos={[nodoTrilha(trilha)]} />
    </>
  );
}
