"use client";

import { useEffect, useRef, useState } from "react";
import FormularioContato from "./FormularioContato";
import Revela from "./Revela";

/**
 * O fecho do site: um cartão centralizado com o formulário, e nada mais.
 *
 * Aqui já moraram um título grande, um parágrafo explicando o que dizer no
 * WhatsApp, a lista de endereço/horário/redes e o mapa da sede. Todos saíram. O
 * texto virou os próprios campos; endereço, horário, WhatsApp e Instagram seguem
 * no rodapé, logo abaixo em toda página; o mapa continua em /o-ct, junto do resto
 * sobre o lugar. Quem chega aqui não veio ler — veio marcar aula.
 *
 * Ao lado dos campos, a quadra em movimento: sem o título, a seção ficaria uma
 * caixa de campos flutuando no escuro, e o vídeo devolve a ela o assunto. Roda
 * mudo, em loop, sem controles — imagem de fundo em movimento, não conteúdo para
 * assistir — e só busca o arquivo quando a seção chega perto da tela. Quem pediu
 * menos movimento no sistema fica com o quadro parado e nunca baixa o vídeo.
 */
export default function Contato() {
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
      { rootMargin: "50% 0px" }
    );

    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return (
    <section className="secao contato grao" id="contato">
      <div className="quadra-linhas" aria-hidden="true" />

      <Revela className="shell">
        <div className="cartao">
          <div className="cartao__midia" ref={ref}>
            <video
              className="cartao__video"
              src={carregar ? "/video/contato/turma.mp4" : undefined}
              poster="/video/contato/turma.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
            />
            <span className="cartao__tinta" aria-hidden="true" />
          </div>

          <div className="cartao__corpo">
            <FormularioContato />
          </div>
        </div>
      </Revela>
    </section>
  );
}
