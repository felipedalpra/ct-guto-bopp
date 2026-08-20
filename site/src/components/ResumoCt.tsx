import Link from "next/link";
import { entregas, missao } from "@/data/ct";
import Revela from "./Revela";

/**
 * O CT na home — o teaser de /o-ct.
 *
 * Não repete a história do Guto (que já veio na seção anterior): mostra o que o
 * centro de treinamento entrega, que é a informação que falta a quem está
 * decidindo se vale a pena atravessar a cidade para treinar aqui.
 */
export default function ResumoCt() {
  return (
    <section className="secao bloco resumo-ct" aria-labelledby="resumo-ct-titulo">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell">
        <Revela como="header" className="bloco__cabecalho">
          <p className="bloco__rotulo">
            <span className="bloco__risco" aria-hidden="true" />O centro de treinamento
          </p>
          <h2 id="resumo-ct-titulo" className="display bloco__titulo">
            Mais do que aula marcada
          </h2>
          <p className="bloco__intro">{missao}</p>
        </Revela>

        <ul className="resumo-ct__entregas">
          {entregas.map((item, i) => (
            <Revela como="li" key={item.titulo} atraso={i * 50}>
              <span className="resumo-ct__marca" aria-hidden="true" />
              {item.titulo}
            </Revela>
          ))}
        </ul>

        <Revela className="resumo-ct__acao" atraso={120}>
          <Link className="btn btn--linha" href="/o-ct">
            Conhecer o CT
          </Link>
        </Revela>
      </div>
    </section>
  );
}
