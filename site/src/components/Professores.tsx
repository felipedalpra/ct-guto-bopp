import Image from "next/image";
import Link from "next/link";
import {
  time,
  hrefProfessor,
  professoresPendentes,
  type Professor,
} from "@/data/professores";
import { site, whatsappMensagens } from "@/data/site";
import Revela from "./Revela";

/**
 * Time do CT — a grade de /professores.
 *
 * A grade é a vitrine: foto, nome, onde atua e o diferencial em uma linha. A
 * ficha completa (formação, experiência, frase) vive em /professores/[slug],
 * que é a página que o Google indexa quando alguém procura o professor pelo nome.
 *
 * As fotos recebidas são fotos de ação, cada uma com fundo, luz e enquadramento
 * diferentes. Todas ficam em cor; o que costura a grade é o recorte 4:5 igual para
 * todas e um ajuste leve e idêntico de contraste e saturação (ver .card__foto).
 */
export default function Professores() {
  return (
    <section className="secao bloco professores">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell">
        <Revela como="header" className="bloco__cabecalho">
          <p className="bloco__rotulo">
            <span className="bloco__numero">01</span>
            <span className="bloco__risco" aria-hidden="true" />O time
          </p>
          <h2 className="display bloco__titulo">Conheça nossos professores</h2>
          <p className="bloco__intro">
            Todos formados pela Metodologia Guto Bopp. Toque em um nome para ver
            a ficha e falar direto com a pessoa.
          </p>
        </Revela>

        <ul className="professores__grade">
          {time.map((pessoa, i) => (
            <Revela como="li" key={pessoa.slug} atraso={i * 70}>
              <Card pessoa={pessoa} destaque={i === 0} />
            </Revela>
          ))}

          {professoresPendentes > 0 && (
            <Revela como="li" atraso={time.length * 70}>
              <div className="card-vaga">
                <p className="card-vaga__titulo">
                  {professoresPendentes === 1
                    ? "Mais um professor chegando"
                    : `Mais ${professoresPendentes} professores chegando`}
                </p>
                <p>
                  O time do CT está em formação. Quer fazer parte? Comece pelo
                  Conexão BT.
                </p>
                <Link className="card-vaga__link" href="/conexao-bt">
                  Conhecer o Conexão BT
                </Link>
              </div>
            </Revela>
          )}
        </ul>

        <Revela className="professores__rodape">
          <p className="professores__ajuda">
            Não sabe com quem começar? O CT indica o professor certo para o seu
            nível e horário.
          </p>
          <a
            className="btn btn--linha"
            href={site.whatsapp.link(whatsappMensagens.professores)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar com o CT
          </a>
        </Revela>
      </div>
    </section>
  );
}

/** Iniciais para o lugar da foto que ainda não chegou. */
export function iniciaisDe(nome: string) {
  return nome
    .split(" ")
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}

function Card({ pessoa, destaque }: { pessoa: Professor; destaque?: boolean }) {
  const href = hrefProfessor(pessoa);

  return (
    <article className="card" data-destaque={destaque || undefined}>
      <div className="card__foto">
        {pessoa.foto ? (
          <Image
            src={pessoa.foto}
            alt={`${pessoa.nome}, ${pessoa.papel.toLowerCase()} do CT Guto Bopp`}
            width={900}
            height={1125}
            sizes="(max-width: 40rem) 88vw, (max-width: 64rem) 44vw, 24rem"
          />
        ) : (
          // Foto ainda não enviada (ficha do Mateus veio sem imagem).
          <div className="card__sem-foto" aria-hidden="true">
            <span>{iniciaisDe(pessoa.nome)}</span>
          </div>
        )}
        <span className="card__papel">{pessoa.papel}</span>
      </div>

      <div className="card__corpo">
        <h3 className="card__nome">
          {/*
            O link cobre o card inteiro (ver .card__nome a::after no CSS): a área
            de clique fica do tamanho do card sem aninhar links, e o leitor de
            tela continua anunciando um único link, com o nome da pessoa.
          */}
          <Link href={href}>{pessoa.nome}</Link>
        </h3>
        <p className="card__local">{pessoa.local}</p>

        <ul className="card__tags">
          {pessoa.atende.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <p className="card__diferencial">{pessoa.diferencial}</p>

        <p className="card__perfil" aria-hidden="true">
          Ver o perfil
        </p>
      </div>
    </article>
  );
}
