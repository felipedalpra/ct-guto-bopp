import { depoimentos, RASCUNHO } from "@/data/depoimentos";
import Revela from "./Revela";

/**
 * Depoimentos.
 * Os textos ainda são rascunho (ver src/data/depoimentos.ts). Enquanto forem,
 * um aviso aparece só em desenvolvimento, para não passar batido na revisão,
 * e nada daqui entra nos dados estruturados.
 */
export default function Depoimentos({ numero }: { numero?: string }) {
  return (
    <section
      className="secao bloco superficie-clara depoimentos"
      aria-labelledby="depoimentos-titulo"
    >
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell">
        {RASCUNHO && process.env.NODE_ENV === "development" && (
          <p className="aviso-rascunho">
            Conteúdo provisório: substituir por depoimentos reais antes de publicar
            (src/data/depoimentos.ts).
          </p>
        )}

        <Revela como="header" className="bloco__cabecalho">
          <p className="bloco__rotulo bloco__rotulo--escuro">
            {numero && <span className="bloco__numero">{numero}</span>}
            <span className="bloco__risco" aria-hidden="true" />
            Quem treina aqui
          </p>
          <h2 id="depoimentos-titulo" className="display bloco__titulo">
            O que muda na prática
          </h2>
        </Revela>

        <ul className="depoimentos__grade">
          {depoimentos.map((d, i) => (
            <Revela como="li" key={d.autor + i} atraso={i * 90}>
              <figure className="depoimento" data-perfil={d.perfil}>
                <span className="depoimento__aspas" aria-hidden="true">
                  ”
                </span>
                <blockquote>{d.texto}</blockquote>
                <figcaption>
                  <span className="depoimento__autor">{d.autor}</span>
                  <span className="depoimento__contexto">{d.contexto}</span>
                </figcaption>
              </figure>
            </Revela>
          ))}
        </ul>
      </div>
    </section>
  );
}
