import type { ReactNode } from "react";
import Revela from "./Revela";

/**
 * Seção de conteúdo com cabeçalho próprio.
 *
 * Num site institucional a página é longa, e o leitor precisa saber a todo momento
 * em que parte dela está. Por isso toda seção abre igual: um número, uma régua, um
 * rótulo curto e um título — e as superfícies alternam entre escura e areia, para
 * que a fronteira entre uma seção e outra seja visível mesmo de relance.
 *
 * `clara` inverte a superfície. `numero` é o índice da seção dentro da página.
 * `solto` entrega o miolo fora do container de largura — para conteúdo que já
 * traz o próprio `.shell`, como o mapa.
 */
export default function Secao({
  numero,
  rotulo,
  titulo,
  intro,
  clara = false,
  estreita = false,
  solto = false,
  className = "",
  children,
}: {
  numero?: string;
  rotulo?: string;
  titulo?: ReactNode;
  intro?: ReactNode;
  clara?: boolean;
  estreita?: boolean;
  solto?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const temCabecalho = Boolean(rotulo || titulo || intro);

  return (
    <section
      className={`secao bloco ${clara ? "superficie-clara grao" : ""} ${className}`}
    >
      <div className="quadra-linhas" aria-hidden="true" />

      {temCabecalho && (
        <div className={`shell ${estreita ? "bloco__estreito" : ""}`}>
          <Revela como="header" className="bloco__cabecalho">
            {rotulo && (
              <p className={`bloco__rotulo ${clara ? "bloco__rotulo--escuro" : ""}`}>
                {numero && <span className="bloco__numero">{numero}</span>}
                <span className="bloco__risco" aria-hidden="true" />
                {rotulo}
              </p>
            )}
            {titulo && <h2 className="display bloco__titulo">{titulo}</h2>}
            {intro && <p className="bloco__intro">{intro}</p>}
          </Revela>
        </div>
      )}

      {solto ? (
        children
      ) : (
        <div className={`shell ${estreita ? "bloco__estreito" : ""}`}>{children}</div>
      )}
    </section>
  );
}

/** Parágrafos corridos, na medida de leitura. */
export function Prosa({ paragrafos }: { paragrafos: string[] }) {
  return (
    <Revela className="prosa">
      {paragrafos.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </Revela>
  );
}

/** Grade de blocos curtos: título e um parágrafo. */
export function Blocos({
  itens,
  colunas = "auto",
}: {
  itens: { titulo: string; texto: string }[];
  colunas?: "auto" | "duas";
}) {
  return (
    <ul className="blocos" data-colunas={colunas}>
      {itens.map((item, i) => (
        <Revela como="li" key={item.titulo} atraso={i * 60}>
          <h3 className="blocos__titulo">{item.titulo}</h3>
          <p className="blocos__texto">{item.texto}</p>
        </Revela>
      ))}
    </ul>
  );
}
