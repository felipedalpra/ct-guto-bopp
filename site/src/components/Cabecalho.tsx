"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { rotas } from "@/data/rotas";
import { site, whatsappMensagens } from "@/data/site";

export default function Cabecalho() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoAbrir = useRef<HTMLButtonElement>(null);
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const caminho = usePathname();

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Navegar fecha o menu: no App Router o componente não remonta entre rotas,
  // então sem isso o menu ficaria aberto por cima da página nova.
  useEffect(() => {
    setAberto(false);
  }, [caminho]);

  useEffect(() => {
    if (!aberto) return;

    // Trava a rolagem do fundo e devolve a barra de rolagem no fechamento.
    const larguraAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    botaoFechar.current?.focus();

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("keydown", aoTeclar);

    return () => {
      document.body.style.overflow = larguraAnterior;
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  const fechar = () => {
    setAberto(false);
    botaoAbrir.current?.focus();
  };

  /** A ficha de um professor mantém "Professores" marcado no menu. */
  const atual = (href: string) =>
    caminho === href || caminho.startsWith(`${href}/`);

  return (
    <>
      <header className={`cabecalho ${rolou ? "cabecalho--solido" : ""}`}>
        <div className="shell cabecalho__linha">
          <Link href="/" className="cabecalho__logo" aria-label={`${site.nome} — página inicial`}>
            <Image
              src="/img/logo-ct-guto-bopp.png"
              alt={`Logotipo do ${site.nome}`}
              width={1430}
              height={914}
              priority
            />
          </Link>

          <nav className="cabecalho__nav" aria-label="Navegação principal">
            {rotas.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-atual={atual(item.href) || undefined}
                aria-current={atual(item.href) ? "page" : undefined}
              >
                {item.rotulo}
              </Link>
            ))}
          </nav>

          <a
            className="btn btn--primario cabecalho__cta"
            href={site.whatsapp.link(whatsappMensagens.geral)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar no WhatsApp
          </a>

          <button
            ref={botaoAbrir}
            type="button"
            className="cabecalho__menu"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto(true)}
          >
            <span className="sr-only">Abrir menu</span>
            <span className="hamburguer" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      {/*
        O menu fica FORA do <header> de propósito. O cabeçalho é `position: fixed`
        e usa `backdrop-filter` quando rolado — e um elemento com backdrop-filter
        vira bloco de contenção dos descendentes `position: fixed`. Dentro dele,
        o `inset: 0` do menu significaria "a caixa do cabeçalho", não a tela:
        o menu não cobriria a página e ainda taparia o próprio botão de fechar.
      */}
      <div
        id="menu-celular"
        className="menu-celular"
        data-aberto={aberto}
        hidden={!aberto}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <button
          ref={botaoFechar}
          type="button"
          className="menu-celular__fechar"
          onClick={fechar}
        >
          <span className="sr-only">Fechar menu</span>
          <span className="hamburguer hamburguer--x" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>

        <nav aria-label="Navegação do site">
          {rotas.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={atual(item.href) ? "page" : undefined}
              onClick={() => setAberto(false)}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="menu-celular__num">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.rotulo}
            </Link>
          ))}
        </nav>

        <a
          className="btn btn--primario"
          href={site.whatsapp.link(whatsappMensagens.geral)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setAberto(false)}
        >
          Falar no WhatsApp
        </a>
      </div>
    </>
  );
}
