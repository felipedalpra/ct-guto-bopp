import FormularioContato from "./FormularioContato";
import Revela from "./Revela";

/**
 * O fecho do site: o formulário e nada mais.
 *
 * Aqui já moraram um parágrafo explicando o que dizer no WhatsApp, a lista de
 * endereço/horário/redes e o mapa da sede. Os três saíram: o texto virou os
 * próprios campos, e endereço, horário, WhatsApp e Instagram seguem no rodapé,
 * que aparece logo abaixo em toda página. Repetidos aqui, só davam ao visitante
 * mais coisa para ler antes de fazer a única coisa que a seção pede.
 *
 * O mapa continua em /o-ct, junto do resto sobre o lugar — que é onde ele
 * responde a uma pergunta de verdade.
 */
export default function Contato() {
  return (
    <section className="secao contato grao" id="contato">
      <div className="quadra-linhas" aria-hidden="true" />

      <Revela className="shell">
        <div className="contato__chamada">
          <p className="eyebrow">Primeiro saque</p>
          <h2 className="display contato__titulo">Bora treinar</h2>
          <p className="contato__texto">
            Quatro respostas rápidas e o Guto te chama no WhatsApp com horário e
            turma já na mão.
          </p>
          <FormularioContato />
        </div>
      </Revela>
    </section>
  );
}
