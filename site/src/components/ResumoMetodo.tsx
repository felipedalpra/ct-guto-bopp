import Link from "next/link";
import { pilares } from "@/data/pilares";
import Revela from "./Revela";

/**
 * Os cinco pilares na home.
 *
 * Divisão de conteúdo com /metodo, para nada ser dito duas vezes: aqui cada pilar
 * aparece pelo que ele MUDA para o aluno (o resultado), e a página do método
 * explica o que ele é e como aparece na aula (o funcionamento). Antes a home
 * trazia só o resumo de uma linha, que dizia o nome do pilar com outras palavras
 * e não informava nada.
 */
export default function ResumoMetodo() {
  return (
    <section
      className="secao superficie-clara grao resumo-metodo"
      aria-labelledby="resumo-metodo-titulo"
    >
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell resumo-metodo__grade">
        <Revela como="header" className="resumo-metodo__cabecalho">
          <p className="eyebrow eyebrow--escuro">Metodologia Guto Bopp</p>
          <h2 id="resumo-metodo-titulo" className="display resumo-metodo__titulo">
            O Método dos <span className="metodo__cinco">5</span> Pilares
          </h2>
          <p className="resumo-metodo__intro">
            Os cinco pilares são a ordem em que o CT ensina, e cada um resolve um
            problema específico do aluno. É o que cada um entrega:
          </p>
          <Link className="btn btn--linha" href="/metodo">
            Ver como cada pilar funciona na aula
          </Link>
        </Revela>

        <Revela como="ol" className="resumo-metodo__lista" atraso={100}>
          {pilares.map((pilar) => (
            <li key={pilar.numero}>
              <span className="resumo-metodo__numero">{pilar.numero}</span>
              <span className="resumo-metodo__nome">{pilar.nome}</span>
              <span className="resumo-metodo__resumo">{pilar.oQueMuda}</span>
            </li>
          ))}
        </Revela>
      </div>
    </section>
  );
}
