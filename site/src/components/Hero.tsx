"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { site, whatsappMensagens } from "@/data/site";

/**
 * Capa.
 *
 * O vídeo é a camada de cima, não a base: por baixo dele fica um fundo próprio
 * (gradiente + marcação de quadra + grão). Se o arquivo ainda não existe, falhar
 * ao carregar, ou o visitante pedir menos movimento, a capa continua completa —
 * o vídeo só entra quando começa a tocar de verdade.
 * Para publicar o vídeo real: ver public/video/README.md.
 */
export default function Hero() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;

    const menosMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (menosMovimento) return;

    // Safari/iOS só considera o autoplay não-interativo quando o vídeo está
    // explicitamente mudo também como propriedade (e não apenas como atributo).
    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute("muted", "");

    const mostrar = () => el.setAttribute("data-tocando", "true");
    el.addEventListener("playing", mostrar);
    void el.play().catch(() => {
      /* Sem autoplay (ou sem arquivo): o fundo da capa segue no lugar. */
    });

    return () => el.removeEventListener("playing", mostrar);
  }, []);

  return (
    <section id="topo" className="hero grao">
      <div className="hero__fundo" aria-hidden="true">
        <video
          ref={video}
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/img/capa-poster.jpg"
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero__veu" />
      </div>

      <div className="shell hero__conteudo">
        <p className="eyebrow hero__local">
          Porto Alegre · RS — Centro de Treinamento de Beach Tennis
        </p>

        <h1 className="display hero__titulo">
          {["Disciplina", "Método", "Resultado"].map((palavra, i) => (
            <span key={palavra} style={{ "--i": i } as React.CSSProperties}>
              {palavra}
              <b aria-hidden="true">.</b>
            </span>
          ))}
        </h1>

        <p className="hero__texto">
          No CT Guto Bopp, mais de 13 anos de experiência do Guto viram método,
          treino e evolução — do primeiro contato ao competitivo.
        </p>

        <div className="hero__acoes">
          <a
            className="btn btn--primario"
            href={site.whatsapp.link(whatsappMensagens.treinos)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Começar a treinar
          </a>
          <Link className="btn btn--linha" href="/metodo">
            Ver o método
          </Link>
        </div>
      </div>

      {/* Régua da capa: onde e quando, tratados como legenda de levantamento. */}
      <div className="hero__regua">
        <div className="shell hero__regua-linha">
          <span>{site.endereco.local}</span>
          <span>{site.horario.texto}</span>
        </div>
      </div>
    </section>
  );
}
