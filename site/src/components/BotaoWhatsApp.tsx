"use client";

import { useEffect, useState } from "react";
import { site, whatsappMensagens } from "@/data/site";

/**
 * Atalho fixo para o WhatsApp.
 * Aparece depois que a capa sai de cena — na capa o botão principal já está ali —
 * e se recolhe quando a seção de contato entra, para não cobrir os dados.
 */
export default function BotaoWhatsApp() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const contato = document.getElementById("contato");

    const aoRolar = () => {
      const passouDaCapa = window.scrollY > window.innerHeight * 0.85;
      const noContato = contato
        ? contato.getBoundingClientRect().top < window.innerHeight * 0.9
        : false;
      setVisivel(passouDaCapa && !noContato);
    };

    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  return (
    <a
      className="zap"
      data-visivel={visivel}
      href={site.whatsapp.link(whatsappMensagens.geral)}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={visivel ? 0 : -1}
      aria-hidden={!visivel}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.21.89 2.39 1.01 2.55.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z"
        />
      </svg>
      <span>Falar no WhatsApp</span>
    </a>
  );
}
