import { oQueMuda } from "@/data/conexao";
import Revela from "./Revela";

/**
 * O antes e depois da capacitação — o miolo da página /conexao-bt.
 *
 * É a seção que responde "o que eu levo daqui" sem depender de carga horária nem
 * de preço, que o cliente ainda não passou. Cada linha contrapõe um hábito comum
 * do professor de Beach Tennis ao que a metodologia coloca no lugar.
 *
 * Fala com outro público (professor, não aluno) e por isso muda de superfície.
 *
 * O que vem DEPOIS do curso não é dito aqui: tem seção própria na mesma página
 * ("Quatro apoios que continuam depois da formatura"), e repetir no fecho deste
 * bloco era dizer a mesma coisa duas vezes com duas rolagens de distância.
 */
export default function ConexaoBT() {
  return (
    <section className="secao bloco conexao grao">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell">
        <Revela como="header" className="bloco__cabecalho">
          <p className="bloco__rotulo">
            <span className="bloco__numero">02</span>
            <span className="bloco__risco" aria-hidden="true" />
            O que muda
          </p>
          <h2 className="display bloco__titulo">Cinco trocas na sua aula</h2>
          <p className="bloco__intro">
            Cinco trocas concretas. Se você reconhecer a coluna da esquerda na sua
            aula, é exatamente esse o trabalho.
          </p>
        </Revela>

        <Revela como="ul" className="conexao__mudanca" atraso={100}>
          {oQueMuda.map((item) => (
            <li key={item.antes}>
              <span className="conexao__antes">{item.antes}</span>
              <span className="conexao__seta" aria-hidden="true" />
              <span className="conexao__depois">{item.depois}</span>
            </li>
          ))}
        </Revela>

      </div>
    </section>
  );
}
