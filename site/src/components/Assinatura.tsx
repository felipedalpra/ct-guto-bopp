"use client";

import { useEffect, useRef, useState } from "react";
import { assinatura } from "@/data/guto";
import { Trajetoria } from "./motivos";
import Revela from "./Revela";

/**
 * A faixa do Guto em quadra — full-bleed, com vídeo ambiente atrás do texto.
 *
 * Substituiu a lista "A rotina dele hoje", que eram quatro itens de texto logo
 * depois de outros quatro da trajetória: duas listas seguidas, na mesma forma, na
 * mesma superfície clara. A informação que importava ali era uma só — ele continua
 * dando aula todo dia — e ela vale mais mostrada do que enumerada.
 *
 * O vídeo é a única peça horizontal do site: as gravações do cliente são verticais
 * em 4K, e um recorte 16:9 na altura certa preserva cabeça, raquete e a turma
 * sentada assistindo ao fundo (é uma sessão do Conexão BT). Roda mudo, em loop e
 * sem controles — é imagem de fundo em movimento, não conteúdo para assistir.
 *
 * Só busca o arquivo quando a faixa chega perto da viewport: no meio de uma página
 * interna, baixar 1,2 MB para quem talvez nem role até aqui seria caro. Quem pediu
 * menos movimento no sistema fica só com o quadro parado, sem nunca carregar o
 * vídeo.
 */
export default function Assinatura() {
  const ref = useRef<HTMLDivElement>(null);
  const [carregar, setCarregar] = useState(false);

  useEffect(() => {
    const alvo = ref.current;
    if (!alvo) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setCarregar(true);
        observador.disconnect();
      },
      // Começa a buscar meia tela antes de aparecer, para não entrar em branco.
      { rootMargin: "50% 0px" },
    );

    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return (
    <section className="secao assinatura" aria-labelledby="assinatura-titulo">
      <div className="assinatura__fundo" ref={ref}>
        <video
          className="assinatura__video"
          src={carregar ? "/video/guto/faixa.mp4" : undefined}
          poster="/video/guto/faixa.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          // Decorativo: o conteúdo está no texto por cima.
          aria-hidden="true"
          tabIndex={-1}
        />
        <span className="assinatura__tinta" aria-hidden="true" />
      </div>

      <Trajetoria className="assinatura__trajetoria" />

      <div className="shell assinatura__miolo">
        <Revela>
          <p className="eyebrow">{assinatura.rotulo}</p>
          <h2 id="assinatura-titulo" className="display assinatura__titulo">
            {assinatura.titulo}
          </h2>
          <p className="assinatura__texto">{assinatura.texto}</p>
        </Revela>
      </div>
    </section>
  );
}
