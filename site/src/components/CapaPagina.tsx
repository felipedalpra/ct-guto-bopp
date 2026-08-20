import Link from "next/link";
import type { ReactNode } from "react";

export type ItemTrilha = { titulo: string; href: string };

/**
 * Abertura de uma página interna.
 *
 * A home tem a capa em vídeo; as outras páginas precisam de um começo próprio que
 * (1) abra espaço abaixo do cabeçalho fixo, (2) diga em uma frase do que trata a
 * página e (3) mostre a trilha de volta — sem trilha, quem cai numa página interna
 * vindo do Google não sabe que existe um site em volta.
 *
 * O `id="conteudo"` do atalho de teclado fica no <main> do layout, não aqui.
 */
export default function CapaPagina({
  sobretitulo,
  titulo,
  intro,
  trilha = [],
  children,
}: {
  sobretitulo: string;
  titulo: ReactNode;
  intro?: ReactNode;
  trilha?: ItemTrilha[];
  children?: ReactNode;
}) {
  return (
    <section className="capa-pagina grao">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell capa-pagina__conteudo">
        <nav className="trilha" aria-label="Trilha de navegação">
          <ol>
            <li>
              <Link href="/">Início</Link>
            </li>
            {trilha.map((item, i) => {
              const ultimo = i === trilha.length - 1;
              return (
                <li key={item.href}>
                  {ultimo ? (
                    <span aria-current="page">{item.titulo}</span>
                  ) : (
                    <Link href={item.href}>{item.titulo}</Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <p className="eyebrow capa-pagina__sobretitulo">{sobretitulo}</p>
        <h1 className="display capa-pagina__titulo">{titulo}</h1>
        {intro && <p className="capa-pagina__intro">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
