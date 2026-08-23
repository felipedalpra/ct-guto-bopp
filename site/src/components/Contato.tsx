import { site } from "@/data/site";
import FormularioContato from "./FormularioContato";
import Mapa from "./Mapa";
import Revela from "./Revela";

/**
 * O fecho do site: um formulário curto e os dados essenciais, nada mais.
 *
 * A versão anterior explicava por escrito o que dizer no WhatsApp — três
 * instruções que o visitante tinha de ler, guardar e repetir por conta própria.
 * O formulário faz as mesmas perguntas e já entrega a resposta pronta, então o
 * texto saiu inteiro: quem chega aqui não veio ler, veio marcar aula.
 */
export default function Contato() {
  return (
    <section className="secao contato grao" id="contato">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell contato__grade">
        <Revela className="contato__chamada">
          <p className="eyebrow">Primeiro saque</p>
          <h2 className="display contato__titulo">Bora treinar</h2>
          <p className="contato__texto">
            Quatro respostas rápidas e o Guto te chama no WhatsApp com horário
            e turma já na mão.
          </p>
          <FormularioContato />
        </Revela>

        <Revela como="dl" className="contato__dados" atraso={120}>
          <div>
            <dt>Onde</dt>
            <dd>
              <a
                href={site.endereco.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.endereco.local}
                <br />
                {site.endereco.rua}
                <br />
                {site.endereco.cidade} · {site.endereco.estado}
              </a>
            </dd>
          </div>
          <div>
            <dt>Quando</dt>
            <dd>{site.horario.texto}</dd>
          </div>
          <div>
            <dt>Instagram</dt>
            <dd>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">
                {site.instagram.handle}
              </a>
            </dd>
          </div>
          <div>
            <dt>Também atendemos</dt>
            <dd>Palmares do Sul · RS, e outras cidades</dd>
          </div>
        </Revela>
      </div>

      <Mapa />
    </section>
  );
}
