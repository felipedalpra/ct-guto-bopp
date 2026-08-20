"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { aulas } from "@/data/aulas";
import Revela from "./Revela";

/**
 * A quadra em vídeo.
 *
 * Os vídeos do cliente são verticais (filmados no celular), então em vez de
 * lutar contra isso a seção assume o formato: três peças em 9:16, lado a lado.
 *
 * Sem autoplay. São três vídeos COM áudio numa página que já carrega o loop da
 * capa — tocar tudo sozinho seria caro na rede do visitante e irritante no
 * celular. O poster carrega como imagem normal e o `<video>` só recebe `src`
 * depois do primeiro clique, então quem não assiste não baixa nada.
 *
 * Só um toca por vez: começar um pausa o outro.
 */
export default function Aulas() {
  const [tocando, setTocando] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLVideoElement | null>>({});

  function tocar(id: string) {
    // Pausa o que estiver rodando antes de começar outro.
    Object.entries(refs.current).forEach(([outro, el]) => {
      if (outro !== id) el?.pause();
    });
    setTocando(id);
    // O src acabou de ser aplicado neste render; o play espera o próximo quadro.
    requestAnimationFrame(() => void refs.current[id]?.play().catch(() => {}));
  }

  return (
    <section className="secao aulas" aria-labelledby="aulas-titulo">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell aulas__miolo">
        {/*
          O cabeçalho fica AO LADO dos vídeos, não acima. Três peças 9:16 não
          preenchem uma linha de 1248px: sobravam ~376px de vazio à direita.
          Pôr o título nessa faixa resolve o buraco e ainda encurta a seção.
        */}
        <Revela como="header" className="aulas__cabecalho">
          <p className="eyebrow">Dentro da quadra</p>
          <h2 id="aulas-titulo" className="display aulas__titulo">
            Como é uma aula aqui
          </h2>
          <p className="aulas__intro">
            Gravado na quadra do CT, numa sessão do Conexão BT.
          </p>
        </Revela>

        <Revela como="ul" className="aulas__grade" atraso={100}>
          {aulas.map((aula) => {
            const ativo = tocando === aula.id;
            return (
              <li key={aula.id}>
                <figure className="aula">
                  <div className="aula__quadro">
                    <video
                      ref={(el) => {
                        refs.current[aula.id] = el;
                      }}
                      className="aula__video"
                      // Só busca o arquivo depois que a pessoa pede.
                      src={ativo ? aula.arquivo : undefined}
                      poster={aula.poster}
                      playsInline
                      controls={ativo}
                      preload="none"
                      onEnded={() => setTocando(null)}
                    />

                    {!ativo && (
                      <>
                        {/* O poster como <Image>, que o Next otimiza; o
                            atributo poster do vídeo é só o fallback. */}
                        <Image
                          className="aula__poster"
                          src={aula.poster}
                          alt=""
                          fill
                          sizes="(max-width: 48rem) 80vw, 22rem"
                        />
                        <button
                          type="button"
                          className="aula__play"
                          onClick={() => tocar(aula.id)}
                        >
                          <span className="aula__play-icone" aria-hidden="true" />
                          <span className="sr-only">
                            Assistir: {aula.titulo}
                          </span>
                        </button>
                      </>
                    )}
                  </div>

                  <figcaption className="aula__legenda">
                    <span className="aula__titulo">{aula.titulo}</span>
                    <span className="aula__texto">{aula.legenda}</span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </Revela>
      </div>
    </section>
  );
}
