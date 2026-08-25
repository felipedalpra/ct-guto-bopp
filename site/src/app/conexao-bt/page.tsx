import type { Metadata } from "next";
import Link from "next/link";
import CapaPagina from "@/components/CapaPagina";
import ConexaoBT from "@/components/ConexaoBT";
import Faq from "@/components/Faq";
import FormadosPeloCt from "@/components/FormadosPeloCt";
import JsonLd from "@/components/JsonLd";
import Passos from "@/components/Passos";
import Revela from "@/components/Revela";
import Secao, { Blocos, Prosa } from "@/components/Secao";
import TurmaConexao from "@/components/TurmaConexao";
import { depoisDoCurso, modulos, paraQuem, porQueExiste } from "@/data/conexao";
import { faqProfessores } from "@/data/faq";
import { nodoCurso, nodoFaq, nodoTrilha } from "@/data/schema";
import { site, whatsappMensagens } from "@/data/site";

const trilha = [{ titulo: "Conexão BT", href: "/conexao-bt" }];

export const metadata: Metadata = {
  title: "Conexão BT — capacitação de professores",
  description:
    "Curso teórico e prático de capacitação para professores iniciantes e intermediários de Beach Tennis. Apresenta a Metodologia Guto Bopp e seus 5 pilares, dos fundamentos técnicos à gestão e fidelização.",
  alternates: { canonical: "/conexao-bt" },
};

export default function PaginaConexaoBt() {
  return (
    <>
      <CapaPagina
        sobretitulo="Para quem dá aula"
        titulo={
          <>
            Conexão <span className="display-italic">BT</span>
          </>
        }
        intro="Curso teórico e prático para professores iniciantes e intermediários que querem ensinar com mais organização, repertório e eficiência."
        trilha={trilha}
      />

      {/* Fica ANTES do "por que existe": quem chega pelo anúncio da turma vem
          atrás da data, não de argumentação. */}
      <TurmaConexao />

      <Secao numero="01" rotulo="Por que existe" titulo={porQueExiste.titulo} estreita>
        <Prosa paragrafos={porQueExiste.paragrafos} />
      </Secao>

      <ConexaoBT />

      <Secao
        numero="03"
        rotulo="Conteúdo"
        titulo="Os cinco pilares"
        intro="O curso apresenta os cinco pilares da Metodologia Guto Bopp e sua aplicação na prática."
        clara
      >
        <Passos
          itens={modulos.map((m) => ({
            chave: m.numero,
            marcador: m.numero,
            titulo: m.titulo,
            texto: m.texto,
            lista: m.itens,
          }))}
        />
      </Secao>

      <Secao numero="04" rotulo="Para quem é" titulo="Para quem serve, e para quem não">
        <div className="serve">
          <Revela className="serve__coluna" >
            <h3 className="serve__titulo serve__titulo--sim">O curso é para</h3>
            <ul className="serve__lista serve__lista--sim">
              {paraQuem.serve.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Revela>

          <Revela className="serve__coluna" atraso={90}>
            <h3 className="serve__titulo serve__titulo--nao">O curso não é para</h3>
            <ul className="serve__lista serve__lista--nao">
              {paraQuem.naoServe.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Revela>
        </div>
      </Secao>

      <Secao
        numero="05"
        rotulo="Depois da formação"
        titulo="Depois da formatura"
        intro="O que distingue isto de um workshop de fim de semana."
        clara
      >
        <Blocos itens={depoisDoCurso} forma="linhas" />
      </Secao>

      <FormadosPeloCt numero="06" />

      <Secao
        numero="07"
        rotulo="Próxima turma"
        titulo="Formato e valor"
        estreita
      >
        <Revela className="prosa">
          <p>
            A próxima turma é presencial, na Prainha, em 25, 26 e 27 de setembro:
            três dias, mais de 20 horas de quadra, nível iniciante/intermediário.
            O investimento é combinado direto com o CT.
          </p>
          <p>
            Chame no WhatsApp dizendo há quanto tempo você dá aula e onde: a resposta
            vem com o formato que faz sentido para o seu caso.
          </p>
        </Revela>
        <Revela className="adiante__links" atraso={80}>
          <a
            className="btn btn--primario"
            href={site.whatsapp.link(whatsappMensagens.conexaoBT)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar sobre o Conexão BT
          </a>
          <Link className="btn btn--linha" href="/metodo">
            Ver o método que o curso ensina
          </Link>
        </Revela>
      </Secao>

      <Faq
        itens={faqProfessores}
        nome="faq-professores"
        sobretitulo="Dúvidas de quem dá aula"
        titulo="Dúvidas do curso"
      />

      <JsonLd
        nodos={[nodoTrilha(trilha), nodoCurso, nodoFaq("/conexao-bt", faqProfessores)]}
      />
    </>
  );
}
