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
 *
 * `estreita` é para prosa. Antes limitava a largura e empilhava cabeçalho e texto,
 * o que deixava uns 380px de vazio à direita em toda seção de texto do site. Agora
 * vira DUAS COLUNAS no desktop: cabeçalho à esquerda, prosa à direita, na medida
 * de leitura. O vazio some, a seção encurta e a hierarquia fica mais clara.
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

  const cabecalho = temCabecalho && (
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
  );

  // Prosa: cabeçalho e conteúdo dividem a mesma linha, em duas colunas.
  if (estreita) {
    return (
      <section
        className={`secao bloco ${clara ? "superficie-clara grao" : ""} ${className}`}
      >
        <div className="quadra-linhas" aria-hidden="true" />
        <div className="shell bloco__duas-colunas">
          {cabecalho}
          <div className="bloco__coluna-texto">{children}</div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`secao bloco ${clara ? "superficie-clara grao" : ""} ${className}`}
    >
      <div className="quadra-linhas" aria-hidden="true" />

      {temCabecalho && (
        <div className="shell">
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

      {solto ? children : <div className="shell">{children}</div>}
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

/**
 * Blocos curtos: título e um parágrafo.
 *
 * Duas formas, e o motivo de existirem duas: o site inteiro caía na mesma grade
 * de cartões, seção após seção, e o visitante passava a ler tudo como "mais uma
 * lista". A forma `linhas` conta a mesma coisa como uma tabela de levantamento —
 * índice grande, régua entre um item e outro, sem caixa em volta. Usar formas
 * alternadas entre seções vizinhas é o que faz uma página parecer diagramada em
 * vez de gerada.
 */
export function Blocos({
  itens,
  colunas = "auto",
  forma = "cartoes",
}: {
  itens: { titulo: string; texto: string }[];
  colunas?: "auto" | "duas";
  forma?: "cartoes" | "linhas";
}) {
  if (forma === "linhas") {
    return (
      <ol className="linhas">
        {itens.map((item, i) => (
          <Revela como="li" key={item.titulo} atraso={i * 60}>
            <span className="linhas__indice" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="linhas__titulo">{item.titulo}</h3>
            <p className="linhas__texto">{item.texto}</p>
          </Revela>
        ))}
      </ol>
    );
  }

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
