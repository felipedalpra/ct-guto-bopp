import { site, whatsappMensagens } from "@/data/site";
import Mapa from "./Mapa";
import Revela from "./Revela";

export default function Contato() {
  return (
    <section className="secao contato grao">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell contato__grade">
        <Revela className="contato__chamada">
          <h2 className="display contato__titulo">Vamos treinar?</h2>
          <p className="contato__texto">
            A primeira conversa é direta no WhatsApp: você diz em que nível está
            e a gente combina horário e formato de treino.
          </p>
          <a
            className="btn btn--primario contato__cta"
            href={site.whatsapp.link(whatsappMensagens.geral)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar no WhatsApp
          </a>
        </Revela>

        <Revela como="dl" className="contato__dados" atraso={100}>
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
            <dt>WhatsApp</dt>
            <dd>
              <a
                href={site.whatsapp.link(whatsappMensagens.geral)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.whatsapp.numero}
              </a>
            </dd>
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
