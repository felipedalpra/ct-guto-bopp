"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Revela o conteúdo quando ele entra na viewport.
 * Um único IntersectionObserver por instância, desconectado no primeiro disparo —
 * a animação só acontece uma vez, para não distrair quem rola a página de volta.
 * Quem pediu menos movimento no sistema recebe o conteúdo já visível (ver globals.css).
 */
export default function Revela({
  children,
  atraso = 0,
  como: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  atraso?: number;
  como?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const alvo = ref.current;
    if (!alvo) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );

    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`revela ${className}`}
      data-visivel={visivel}
      style={{ "--atraso": `${atraso}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
