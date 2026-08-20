import Link from "next/link";
import Revela from "./Revela";

/**
 * A bifurcação da home.
 *
 * O CT fala com dois públicos que querem coisas diferentes — quem quer treinar e
 * quem dá aula. A maior parte do tráfego vem do Instagram e chega sem contexto;
 * esta é a primeira decisão que a home pede, logo abaixo da capa, para que cada
 * um siga por uma trilha própria em vez de rolar a página inteira do outro.
 *
 * Este bloco é NAVEGAÇÃO, não argumento: cada cartão descreve a situação de quem
 * lê ("você já joga e travou"), e não o produto. O que o método é e o que o CT
 * entrega vem mais abaixo, nas seções próprias — antes os textos daqui repetiam
 * palavra por palavra o que o ResumoMetodo e o Conexão BT diziam na sequência.
 */
const caminhos = [
  {
    href: "/metodo",
    numero: "01",
    publico: "Quero treinar",
    titulo: "Nunca joguei, ou joguei e travei",
    texto:
      "Você quer começar do zero, ou já joga há um tempo e sente que parou de evoluir.",
    chamada: "Ver o método",
  },
  {
    href: "/conexao-bt",
    numero: "02",
    publico: "Dou aula de Beach Tennis",
    titulo: "Jogo bem, mas quero ensinar melhor",
    texto:
      "Você já está em quadra dando aula e quer estruturar o que hoje sai por instinto.",
    chamada: "Conhecer o Conexão BT",
  },
];

export default function Caminhos() {
  return (
    <section className="secao caminhos" aria-labelledby="caminhos-titulo">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell">
        <Revela como="header" className="caminhos__cabecalho">
          <p className="eyebrow">Por onde você entra</p>
          <h2 id="caminhos-titulo" className="display caminhos__titulo">
            Você chegou por qual dos dois lados?
          </h2>
        </Revela>

        <ul className="caminhos__grade">
          {caminhos.map((caminho, i) => (
            <Revela como="li" key={caminho.href} atraso={i * 90}>
              <article className="caminho">
                <span className="caminho__numero" aria-hidden="true">
                  {caminho.numero}
                </span>
                <p className="caminho__publico">{caminho.publico}</p>
                <h3 className="caminho__titulo">
                  {/* O link cobre o cartão inteiro (ver .caminho__titulo a::after). */}
                  <Link href={caminho.href}>{caminho.titulo}</Link>
                </h3>
                <p className="caminho__texto">{caminho.texto}</p>
                <p className="caminho__chamada" aria-hidden="true">
                  {caminho.chamada}
                </p>
              </article>
            </Revela>
          ))}
        </ul>
      </div>
    </section>
  );
}
