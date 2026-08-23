import Link from "next/link";
import Revela from "./Revela";

/**
 * Chamada para o método na home.
 *
 * A home apresenta a existência do método, mas deixa a explicação dos cinco
 * pilares para a página própria. O convite funciona como uma porta de entrada,
 * sem entregar o conteúdo antes do clique.
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
            A estrutura por trás de cada treino do CT. Conheça o método completo
            antes de escolher como quer evoluir.
          </p>
          <Link className="btn btn--linha" href="/metodo">
            Entrar no Método
          </Link>
        </Revela>
      </div>
    </section>
  );
}
