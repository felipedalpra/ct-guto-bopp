import Image from "next/image";
import Link from "next/link";
import { hrefProfessor, time } from "@/data/professores";
import { iniciaisDe } from "./Professores";
import Revela from "./Revela";
import Secao from "./Secao";

/**
 * Prova social do Conexão BT — e a única da página que não é rascunho.
 *
 * Todos os professores do time se formaram pela capacitação do CT: está nas fichas
 * que o cliente enviou (ver data/professores.ts). Em vez de um depoimento genérico,
 * a seção mostra as pessoas, o que elas fazem hoje e onde dão aula — quem duvida
 * pode conferir no Instagram de cada uma.
 */
export default function FormadosPeloCt({ numero }: { numero?: string }) {
  // O Guto conduz o curso; quem passou por ele são os outros.
  const formados = time.filter((p) =>
    p.formacao.some((f) => /conex[ãa]o bt|capacita[çc][ãa]o de professores/i.test(f))
  );

  if (formados.length === 0) return null;

  return (
    <Secao
      numero={numero}
      rotulo="Quem já passou"
      titulo="O time do CT saiu daqui"
      intro="Todo professor que dá aula no CT Guto Bopp se formou pela capacitação. Não é depoimento: é o time inteiro, com nome, quadra e Instagram."
    >
      <ul className="formados">
        {formados.map((pessoa, i) => (
          <Revela como="li" key={pessoa.slug} atraso={i * 70}>
            <article className="formado">
              <span className="formado__foto">
                {pessoa.foto ? (
                  <Image
                    src={pessoa.foto}
                    alt=""
                    width={300}
                    height={375}
                    sizes="5rem"
                  />
                ) : (
                  <span className="formado__iniciais" aria-hidden="true">
                    {iniciaisDe(pessoa.nome)}
                  </span>
                )}
              </span>

              <div className="formado__corpo">
                <h3 className="formado__nome">
                  <Link href={hrefProfessor(pessoa)}>{pessoa.nome}</Link>
                </h3>
                <p className="formado__local">{pessoa.local}</p>
                <ul className="formado__formacao">
                  {pessoa.formacao.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </article>
          </Revela>
        ))}
      </ul>
    </Secao>
  );
}
