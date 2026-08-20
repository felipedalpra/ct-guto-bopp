import Link from "next/link";
import Revela from "./Revela";

/**
 * A bifurcação da home.
 *
 * O CT fala com dois públicos que querem coisas diferentes — quem quer treinar e
 * quem dá aula. A maior parte do tráfego vem do Instagram e chega sem contexto;
 * esta é a primeira decisão que a home pede, logo abaixo da capa, para que cada
 * um siga por uma trilha própria em vez de rolar a página inteira do outro.
 */
const caminhos = [
  {
    href: "/metodo",
    numero: "01",
    publico: "Quero treinar",
    titulo: "O Método dos 5 Pilares",
    texto:
      "Do iniciante ao avançado, em turma ou particular. Cinco frentes que definem por onde você começa e como evolui sem pular etapa.",
    chamada: "Ver o método",
  },
  {
    href: "/conexao-bt",
    numero: "02",
    publico: "Dou aula de Beach Tennis",
    titulo: "Conexão BT",
    texto:
      "A capacitação do CT para professores: estruturar a aula, corrigir com clareza e seguir com acompanhamento, mentoria e reciclagens.",
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
            Dois lados da mesma quadra
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
