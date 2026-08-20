import type { Pergunta } from "@/data/faq";
import Revela from "./Revela";

/**
 * Perguntas frequentes.
 *
 * Usa <details> nativo: abre sem JavaScript, é acessível por teclado e o texto
 * fica no HTML mesmo fechado — que é o que buscador e motor de resposta leem.
 *
 * Recebe as perguntas por prop porque cada página tem as suas: as de aluno
 * fecham /o-ct, as de professor fecham /conexao-bt. O `nome` do <details>
 * agrupa o acordeão por página — com o mesmo nome nas duas, abrir uma pergunta
 * numa página fecharia a de outra depois de uma navegação de cliente.
 */
export default function Faq({
  itens,
  titulo = "Perguntas frequentes",
  sobretitulo = "Antes de perguntar no WhatsApp",
  nome = "faq",
}: {
  itens: Pergunta[];
  titulo?: string;
  sobretitulo?: string;
  nome?: string;
}) {
  const id = `faq-${nome}`;

  return (
    <section className="secao faq" aria-labelledby={`${id}-titulo`}>
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell faq__grade">
        <Revela como="header" className="faq__cabecalho">
          <p className="eyebrow">{sobretitulo}</p>
          <h2 id={`${id}-titulo`} className="display faq__titulo">
            {titulo}
          </h2>
        </Revela>

        <div className="faq__lista">
          {itens.map((item, i) => (
            <Revela key={item.pergunta} atraso={i * 50}>
              <details className="faq__item" name={nome}>
                <summary>
                  <span>{item.pergunta}</span>
                  <span className="faq__sinal" aria-hidden="true" />
                </summary>
                <p>{item.resposta}</p>
              </details>
            </Revela>
          ))}
        </div>
      </div>
    </section>
  );
}
