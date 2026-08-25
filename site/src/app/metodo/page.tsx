import type { Metadata } from "next";
import Link from "next/link";
import CapaPagina from "@/components/CapaPagina";
import Cena from "@/components/Cena";
import JsonLd from "@/components/JsonLd";
import Metodo from "@/components/Metodo";
import Niveis from "@/components/Niveis";
import Passos from "@/components/Passos";
import Revela from "@/components/Revela";
import Secao, { Blocos, Prosa } from "@/components/Secao";
import { aulaGuto } from "@/data/cenas";
import { anatomiaDaAula, formatos, oProblema } from "@/data/metodo";
import { nodoTrilha } from "@/data/schema";
import { site, whatsappMensagens } from "@/data/site";

const trilha = [{ titulo: "Método", href: "/metodo" }];

export const metadata: Metadata = {
  title: "Método dos 5 Pilares",
  description:
    "A Metodologia Guto Bopp, organizada no Método dos 5 Pilares: técnica e repetição, correção e intensidade, tática, estratégia e disciplina, criatividade didática, gestão e fidelização.",
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
        intro="Cinco pilares que organizam o trabalho do professor, da técnica à gestão da carreira."
        trilha={trilha}
      />

      <Secao numero="01" rotulo="Por que existe" titulo={oProblema.titulo} estreita>
        <Prosa paragrafos={oProblema.paragrafos} />
      </Secao>

      <Metodo />

      <Secao
        numero="03"
        rotulo="Na prática"
        titulo="Uma aula, do começo ao fim"
        intro="A organização não é abstrata: é esta sequência, repetida em toda aula."
      >
        {/* O vídeo entra ao lado da sequência da aula, e não na abertura da
            página: a abertura tem dois parágrafos, e um 9:16 ao lado deles abria
            um buraco de 300px. Aqui a lista é bem mais alta que a peça, então ela
            acompanha a rolagem em vez de ficar parada — e o assunto casa, porque
            é essa a aula que o vídeo mostra acontecendo. */}
        <Cena cena={aulaGuto} lado="esquerda" encaixe="acompanha">
          <Passos
            itens={anatomiaDaAula.map((etapa) => ({
              chave: etapa.fase,
              marcador: etapa.fase,
              titulo: etapa.titulo,
              texto: etapa.texto,
            }))}
          />
        </Cena>
      </Secao>

      <Secao
        numero="04"
        rotulo="Por nível"
        titulo="Quatro pontos de entrada"
        intro="Não existe turma única."
        clara
      >
        <Niveis />
      </Secao>

      <Secao
        numero="05"
        rotulo="Formatos"
        titulo="Os formatos de treino"
        intro="Mesma metodologia; o que muda é a densidade de correção por hora de quadra."
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
