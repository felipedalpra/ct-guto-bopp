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
import { depoisDoCurso, modulos, paraQuem, porQueExiste } from "@/data/conexao";
import { faqProfessores } from "@/data/faq";
import { nodoCurso, nodoFaq, nodoTrilha } from "@/data/schema";
import { site, whatsappMensagens } from "@/data/site";

const trilha = [{ titulo: "Conexão BT", href: "/conexao-bt" }];

export const metadata: Metadata = {
  title: "Conexão BT — capacitação de professores",
  description:
    "O curso de capacitação do CT Guto Bopp para professores de Beach Tennis: planejar a aula, corrigir na causa do erro e aplicar os 5 pilares, com acompanhamento, mentoria e reciclagens depois da formação.",
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
        intro="A capacitação do CT Guto Bopp para professores de Beach Tennis. Para quem já está em quadra e quer estruturar a própria aula, corrigir com clareza e evoluir como profissional dentro da Metodologia Guto Bopp."
        trilha={trilha}
      />

      <Secao numero="01" rotulo="Por que existe" titulo={porQueExiste.titulo} estreita>
        <Prosa paragrafos={porQueExiste.paragrafos} />
      </Secao>

      <ConexaoBT />

      <Secao
        numero="03"
        rotulo="Conteúdo"
        titulo="Os cinco módulos"
        intro="Um módulo por pilar da metodologia, na mesma ordem em que eles se sustentam — porque é assim que o professor vai aplicar depois."
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

      <Secao numero="04" rotulo="Para quem é" titulo="Se você se encaixa aqui">
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
        titulo="O curso acaba, o acompanhamento não"
        intro="É o que distingue a capacitação do CT de um workshop de fim de semana: quem se forma continua dentro da estrutura."
        clara
      >
        <Blocos itens={depoisDoCurso} />
      </Secao>

      <FormadosPeloCt numero="06" />

      <Secao
        numero="07"
        rotulo="Próxima turma"
        titulo="Formato, valor e datas"
        estreita
      >
        <Revela className="prosa">
          <p>
            Formato, carga horária, investimento e data da próxima turma são combinados
            direto com o CT — inclusive porque parte da capacitação é ajustada ao ponto
            em que cada professor está.
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
        titulo="Sobre a capacitação"
      />

      <JsonLd
        nodos={[nodoTrilha(trilha), nodoCurso, nodoFaq("/conexao-bt", faqProfessores)]}
      />
    </>
  );
}
