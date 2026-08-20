import Link from "next/link";
import { pilares } from "@/data/pilares";
import Revela from "./Revela";

/**
 * Os cinco pilares em lista seca — o teaser de /metodo na home.
 * O diagrama de quadra e a descrição de cada pilar ficam na página do método;
 * aqui a lista só mostra que o método existe e tem nome.
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
            Cinco frentes que sustentam cada aula do CT. Não são temas soltos: uma
            depende da anterior, e é essa ordem que faz o aluno evoluir sem pular
            etapa.
          </p>
          <Link className="btn btn--linha" href="/metodo">
            Ver o método completo
          </Link>
        </Revela>

        <Revela como="ol" className="resumo-metodo__lista" atraso={100}>
          {pilares.map((pilar) => (
            <li key={pilar.numero}>
              <span className="resumo-metodo__numero">{pilar.numero}</span>
              <span className="resumo-metodo__nome">{pilar.nome}</span>
              <span className="resumo-metodo__resumo">{pilar.resumo}</span>
            </li>
          ))}
        </Revela>
      </div>
    </section>
  );
}
