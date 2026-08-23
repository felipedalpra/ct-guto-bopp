import Link from "next/link";
import CartazTurma from "./CartazTurma";
import ContagemTurma from "./ContagemTurma";
import Revela from "./Revela";
import { proximaTurma, turmaAberta } from "@/data/turma";
import { site } from "@/data/site";

/**
 * O anúncio da turma com data marcada.
 *
 * O resto da página /conexao-bt explica o curso sem depender de calendário — foi
 * escrita assim de propósito, porque turma sem data é o estado normal dela. Este
 * bloco é o oposto: existe só enquanto houver uma turma marcada, e some sozinho
 * depois do último dia (ver `turmaAberta`).
 *
 * ⚠️ A página é estática, então quem apaga o bloco depois da data é o próximo
 * build. O aviso flutuante (`AvisoTurma`) checa a data no navegador e por isso
 * se cala sozinho no mesmo dia — é ele que incomodaria se ficasse para trás.
 *
 * Mora só na /conexao-bt. Na home quem avisa é o cartão flutuante — repetir o
 * anúncio nos dois lugares na mesma visita é o caminho curto para virar ruído.
 */
export default function TurmaConexao({ numero }: { numero?: string }) {
  if (!turmaAberta()) return null;

  const t = proximaTurma;

  return (
    <section className="secao bloco turma" aria-labelledby="turma-titulo">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell turma__miolo">
        <Revela className="turma__texto">
          <p className="bloco__rotulo">
            {numero && <span className="bloco__numero">{numero}</span>}
            <span className="bloco__risco" aria-hidden="true" />
            Turma marcada
          </p>

          <h2 id="turma-titulo" className="display turma__titulo">
            {t.dias} {t.mes}
          </h2>

          <ContagemTurma />

          <p className="turma__intro">{t.chamada}</p>

          <dl className="turma__ficha">
            <div>
              <dt>Onde</dt>
              <dd>
                {t.local}, {t.cidade}
              </dd>
            </div>
            <div>
              <dt>Carga</dt>
              <dd>
                {t.carga} {t.formato}
              </dd>
            </div>
            <div>
              <dt>Nível</dt>
              <dd>{t.nivel}</dd>
            </div>
          </dl>

          <div className="turma__acoes">
            <a
              className="btn btn--primario"
              href={site.whatsapp.link(t.mensagem)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Garantir minha vaga
            </a>
            <Link className="btn btn--linha" href="/metodo">
              Ver o método que o curso ensina
            </Link>
          </div>
        </Revela>

        <Revela className="turma__cartaz" atraso={110}>
          <CartazTurma />
        </Revela>
      </div>
    </section>
  );
}
