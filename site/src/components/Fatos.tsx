import { atendimento, fatos } from "@/data/fatos";
import Revela from "./Revela";

/**
 * A faixa de dados da home.
 *
 * Deliberadamente sem título de seção e sem botão: é uma régua de informação, não
 * mais um bloco de discurso. Vem logo depois da bifurcação para que, antes de
 * qualquer texto de convencimento, o visitante já tenha respondido sozinho as três
 * perguntas práticas — atende o meu nível? fica onde? abre a que horas?
 */
export default function Fatos() {
  return (
    <section className="secao fatos" aria-label="O CT Guto Bopp em números">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell">
        <Revela como="ul" className="fatos__grade">
          {fatos.map((fato, i) => (
            <li key={fato.rotulo} style={{ "--i": i } as React.CSSProperties}>
              <p className="fatos__valor">
                {fato.valor}
                {fato.unidade && (
                  <span className="fatos__unidade">{fato.unidade}</span>
                )}
              </p>
              <p className="fatos__rotulo">{fato.rotulo}</p>
              <p className="fatos__detalhe">{fato.detalhe}</p>
            </li>
          ))}
        </Revela>

        <Revela className="fatos__listas" atraso={120}>
          <div className="fatos__lista">
            <h3 className="fatos__lista-titulo">Níveis atendidos</h3>
            <ul>
              {atendimento.niveis.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
          <div className="fatos__lista">
            <h3 className="fatos__lista-titulo">Formatos de treino</h3>
            <ul>
              {atendimento.formatos.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </Revela>
      </div>
    </section>
  );
}
