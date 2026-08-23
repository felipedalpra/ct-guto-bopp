import Image from "next/image";
import Link from "next/link";
import { time, hrefProfessor } from "@/data/professores";
import { iniciaisDe } from "./Professores";
import Revela from "./Revela";
import { Ondas } from "./motivos";

/**
 * O time em faixa — o teaser de /professores na home.
 *
 * Cada rosto leva direto à ficha da pessoa. A home mostra apenas as fotos; a
 * ficha completa — formação, experiência, frase e contato — fica em
 * /professores.
 */
export default function ResumoProfessores() {
  return (
    <section
      className="secao resumo-time areia-fundo"
      aria-labelledby="resumo-time-titulo"
    >
      {/*
        Fundo: a areia da própria quadra do CT, tirada em 4K de um vídeo de aula
        (ver public/img/textura/). Não é banco de imagem — é o chão onde o aluno
        vai treinar, e é o que dá a esta seção uma textura que nenhuma outra tem.
      */}
      <div className="areia-fundo__camada" aria-hidden="true" />
      <Ondas className="areia-fundo__ondas" />
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell">
        <Revela como="header" className="resumo-time__cabecalho">
          <p className="eyebrow">Nosso time</p>
          <h2 id="resumo-time-titulo" className="display resumo-time__titulo">
            Com quem você vai treinar
          </h2>
          <p className="resumo-time__intro">
            Mesma estrutura de aula com todos. O que muda é o perfil.
          </p>
        </Revela>

        <Revela como="ul" className="resumo-time__fila" atraso={100}>
          {time.map((pessoa) => (
            <li key={pessoa.slug}>
              <Link
                className="rosto"
                href={hrefProfessor(pessoa)}
                aria-label={`Ver o perfil de ${pessoa.nome}`}
              >
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
              </Link>
            </li>
          ))}
        </Revela>

      </div>
    </section>
  );
}
