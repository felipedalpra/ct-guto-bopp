"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Cena as DadosCena } from "@/data/cenas";
import Revela from "./Revela";

/**
 * Um vídeo vertical ao lado do conteúdo de uma seção.
 *
 * A diferença para `Aulas` é o papel: lá são três peças numa seção que existe só
 * para elas; aqui é uma peça só, dividindo a linha com o que a seção já mostra.
 * É o que quebra as páginas que descem em parágrafo corrido do topo ao rodapé.
 *
 * ⚠️ A REGRA QUE DECIDE ONDE ISSO PODE ENTRAR: um 9:16 legível passa dos 450px de
 * altura, e um bloco de dois parágrafos tem menos de 300px. Pôr a peça ao lado de
 * texto curto abre um buraco de centenas de pixels embaixo da coluna mais curta —
 * e nem `estreita` (o buraco vai para debaixo do título) nem `float` (o texto
 * acaba antes do vídeo) resolvem. Só existe encaixe ao lado de conteúdo que
 * chegue perto da altura da peça, e é por isso que só há dois modos:
 *
 * - `estica`: o companheiro é elástico e passa a valer exatamente a altura da
 *   peça. É o caso do mapa, que é uma moldura de proporção livre.
 * - `acompanha`: o companheiro é bem mais alto (uma lista longa), e a peça gruda
 *   no topo e acompanha a rolagem em vez de ficar parada deixando vazio embaixo.
 *
 * Reaproveita as classes `.aula__*` para o quadro, o poster e o botão de play —
 * o comportamento é o mesmo, e duplicar aquele CSS só criaria dois lugares para
 * consertar quando o play mudar.
 *
 * Sem autoplay e com `preload="none"`: o arquivo só é buscado depois do clique,
 * então quem não assiste não paga a rede. No celular a peça vai para baixo do
 * conteúdo — ler primeiro, assistir depois.
 */
export default function Cena({
  cena,
  lado = "direita",
  encaixe,
  children,
}: {
  cena: DadosCena;
  lado?: "esquerda" | "direita";
  encaixe: "estica" | "acompanha";
  children: React.ReactNode;
}) {
  const [tocando, setTocando] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  function tocar() {
    setTocando(true);
    // O src acabou de ser aplicado neste render; o play espera o próximo quadro.
    requestAnimationFrame(() => void ref.current?.play().catch(() => {}));
  }

  return (
    <div className="cena" data-lado={lado} data-encaixe={encaixe}>
      <div className="cena__companheiro">{children}</div>

      <Revela como="figure" className="cena__peca" atraso={90}>
        <div className="aula__quadro">
          <video
            ref={ref}
            className="aula__video"
            src={tocando ? cena.arquivo : undefined}
            poster={cena.poster}
            playsInline
            controls={tocando}
            preload="none"
            onEnded={() => setTocando(false)}
          />

          {!tocando && (
            <>
              {/* O poster como <Image>, que o Next otimiza; o atributo poster
                  do vídeo é só o fallback enquanto ele não carrega. */}
              <Image
                className="aula__poster"
                src={cena.poster}
                alt={cena.alt}
                fill
                sizes="(max-width: 48rem) 72vw, 16rem"
              />
              <button type="button" className="aula__play" onClick={tocar}>
                <span className="aula__play-icone" aria-hidden="true" />
                <span className="sr-only">Assistir: {cena.titulo}</span>
              </button>
            </>
          )}
        </div>

        <figcaption className="aula__legenda">
          <span className="aula__titulo">{cena.titulo}</span>
          <span className="aula__texto">{cena.legenda}</span>
        </figcaption>
      </Revela>
    </div>
  );
}
