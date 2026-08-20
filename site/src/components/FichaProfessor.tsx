import Image from "next/image";
import Link from "next/link";
import type { Professor } from "@/data/professores";
import { IconeInstagram, IconeWhatsApp } from "./icones";
import { iniciaisDe } from "./Professores";
import Revela from "./Revela";

/**
 * Ficha de um professor — a página /professores/[slug].
 *
 * É a página que responde a busca pelo nome da pessoa ("Mariana Widholzer beach
 * tennis"), e por isso traz a ficha inteira: onde atua, experiência, formação,
 * o que faz diferente e o WhatsApp direto dela — sem passar pelo CT.
 */
export default function FichaProfessor({ pessoa }: { pessoa: Professor }) {
  const primeiroNome = pessoa.nome.split(" ")[0];

  return (
    <section className="secao ficha">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell ficha__grade">
        <Revela className="ficha__retrato">
          <div className="ficha__moldura">
            {pessoa.foto ? (
              <Image
                src={pessoa.foto}
                alt={`${pessoa.nome}, ${pessoa.papel.toLowerCase()} do CT Guto Bopp`}
                width={900}
                height={1125}
                sizes="(max-width: 60rem) 88vw, 26rem"
                priority
              />
            ) : (
              // Foto ainda não enviada (ficha do Mateus veio sem imagem).
              <div className="ficha__sem-foto" aria-hidden="true">
                <span>{iniciaisDe(pessoa.nome)}</span>
              </div>
            )}
          </div>

          <div className="ficha__acoes">
            <p className="ficha__acoes-titulo">
              Agende sua aula com {primeiroNome}
            </p>

            {pessoa.whatsappE164 && (
              <a
                className="btn btn--primario ficha__zap"
                href={`https://wa.me/${pessoa.whatsappE164.replace("+", "")}?text=${encodeURIComponent(
                  `Olá, ${primeiroNome}! Vim pelo site do CT Guto Bopp e quero agendar uma aula.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconeWhatsApp />
                Falar com {primeiroNome}
              </a>
            )}

            {pessoa.instagram && (
              <a
                className="ficha__insta"
                href={`https://instagram.com/${pessoa.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconeInstagram />
                <span aria-hidden="true">@{pessoa.instagram}</span>
                <span className="sr-only">
                  Ver o Instagram de {pessoa.nome}, @{pessoa.instagram}
                </span>
              </a>
            )}
          </div>
        </Revela>

        <div className="ficha__texto">
          <Revela>
            <ul className="ficha__tags">
              {pessoa.atende.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="ficha__diferencial">{pessoa.diferencial}</p>
          </Revela>

          {pessoa.frase && (
            <Revela como="blockquote" className="ficha__frase" atraso={80}>
              {pessoa.frase}
            </Revela>
          )}

          <Revela como="dl" className="ficha__dados" atraso={140}>
            <div>
              <dt>Onde dá aula</dt>
              <dd>{pessoa.local}</dd>
            </div>
            <div>
              <dt>Experiência</dt>
              <dd>{pessoa.desde}</dd>
            </div>
            <div>
              <dt>Formação</dt>
              <dd>
                <ul>
                  {pessoa.formacao.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </Revela>

          <Revela className="ficha__navegar" atraso={200}>
            <Link className="btn btn--linha" href="/professores">
              Ver o time inteiro
            </Link>
            <Link className="ficha__metodo" href="/metodo">
              Conhecer o Método dos 5 Pilares
            </Link>
          </Revela>
        </div>
      </div>
    </section>
  );
}
