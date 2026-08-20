import Image from "next/image";
import Link from "next/link";
import { time, hrefProfessor, professoresPendentes } from "@/data/professores";
import { iniciaisDe } from "./Professores";
import Revela from "./Revela";

/**
 * O time em faixa — o teaser de /professores na home.
 * Cada rosto leva direto à ficha da pessoa; a grade com as fichas resumidas
 * fica em /professores.
 */
export default function ResumoProfessores() {
  return (
    <section className="secao resumo-time" aria-labelledby="resumo-time-titulo">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell">
        <Revela como="header" className="resumo-time__cabecalho">
          <p className="eyebrow">Nosso time</p>
          <h2 id="resumo-time-titulo" className="display resumo-time__titulo">
            Quem está na areia com você
          </h2>
          <p className="resumo-time__intro">
            Professores formados dentro da Metodologia Guto Bopp, atuando em Porto
            Alegre e em Palmares do Sul.
            {professoresPendentes > 0 &&
              ` Mais ${professoresPendentes} chegando.`}
          </p>
        </Revela>

        <Revela como="ul" className="resumo-time__fila" atraso={100}>
          {time.map((pessoa) => (
            <li key={pessoa.slug}>
              <Link className="rosto" href={hrefProfessor(pessoa)}>
                <span className="rosto__foto">
                  {pessoa.foto ? (
                    <Image
                      src={pessoa.foto}
                      alt=""
                      width={400}
                      height={500}
                      sizes="9rem"
                    />
                  ) : (
                    <span className="rosto__iniciais" aria-hidden="true">
                      {iniciaisDe(pessoa.nome)}
                    </span>
                  )}
                </span>
                <span className="rosto__nome">{pessoa.nome}</span>
                <span className="rosto__papel">{pessoa.papel}</span>
              </Link>
            </li>
          ))}
        </Revela>

        <Revela className="resumo-time__rodape" atraso={160}>
          <Link className="btn btn--linha" href="/professores">
            Ver o time inteiro
          </Link>
        </Revela>
      </div>
    </section>
  );
}
