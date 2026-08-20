import Link from "next/link";
import { frentes, missao } from "@/data/ct";
import Revela from "./Revela";

/**
 * O CT na home — as três frentes.
 *
 * Antes esta seção listava os sete títulos das entregas, sem o texto de nenhuma:
 * sete rótulos soltos que não informavam nada e ainda repetiam o que as outras
 * seções da home já diziam. Agora mostra a estrutura do CT — treinar, formar,
 * acompanhar — com o parágrafo de cada uma, e as sete entregas detalhadas ficam
 * inteiras em /o-ct.
 *
 * Cada frente leva à página que a desenvolve, então este bloco também funciona
 * como o índice real do site.
 */
export default function ResumoCt() {
  return (
    <section
      className="secao bloco resumo-ct acento-ouro"
      aria-labelledby="resumo-ct-titulo"
    >
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell">
        <Revela como="header" className="bloco__cabecalho">
          <p className="bloco__rotulo">
            <span className="bloco__risco" aria-hidden="true" />O centro de treinamento
          </p>
          <h2 id="resumo-ct-titulo" className="display bloco__titulo">
            O CT trabalha em três frentes
          </h2>
          <p className="bloco__intro">{missao}</p>
        </Revela>

        <ul className="frentes">
          {frentes.map((frente, i) => (
            <Revela como="li" key={frente.numero} atraso={i * 80}>
              <article className="frente">
                <span className="frente__numero" aria-hidden="true">
                  {frente.numero}
                </span>
                <h3 className="frente__titulo">
                  {/* O link cobre o cartão inteiro (ver .frente__titulo a::after). */}
                  <Link href={frente.href}>{frente.titulo}</Link>
                </h3>
                <p className="frente__texto">{frente.texto}</p>
                <p className="frente__chamada" aria-hidden="true">
                  {frente.chamada}
                </p>
              </article>
            </Revela>
          ))}
        </ul>
      </div>
    </section>
  );
}
