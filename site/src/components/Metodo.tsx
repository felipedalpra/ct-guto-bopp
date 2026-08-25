"use client";

import { useEffect, useRef, useState } from "react";
import { pilares } from "@/data/pilares";
import { site, whatsappMensagens } from "@/data/site";
import Revela from "./Revela";

/**
 * Método dos 5 Pilares — o elemento de assinatura do site.
 *
 * O título e a introdução do método são o <h1> da página /metodo (ver
 * CapaPagina lá); aqui fica só o diagrama e a lista.
 *
 * A quadra de Beach Tennis (8 × 16 m, uma linha de fundo e a rede no meio — sem
 * áreas de saque) é o único diagrama do esporte, e aqui ela vira o índice do método:
 * cada pilar ocupa uma posição na quadra. O diagrama e a lista compartilham a mesma
 * seleção; a lista é a versão acessível e é ela que carrega o texto lido por buscador
 * e leitor de tela. O diagrama é decorativo e espelha a escolha feita na lista.
 */
/** Um segundo em cada pilar enquanto a seção passa sozinha. */
const PASSO = 1000;

export default function Metodo() {
  const [ativo, setAtivo] = useState(0);
  const [visivel, setVisivel] = useState(false);
  const [pausado, setPausado] = useState(false);
  /* Escolher um pilar encerra o passeio: depois de um toque, ninguém quer o
     painel sendo trocado por baixo da leitura um segundo depois. */
  const [sozinho, setSozinho] = useState(true);
  const secaoRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const secao = secaoRef.current;
    if (!secao) return;

    /* A seção é mais alta que a tela (quadra + cinco pilares), então exigir uma
       fração dela visível nunca dava verdadeiro e o passeio não começava —
       principalmente no celular. O que vale é a seção cruzar o miolo da tela. */
    const observador = new IntersectionObserver(
      ([entrada]) => setVisivel(entrada.isIntersecting),
      { threshold: 0, rootMargin: "-20% 0px -20% 0px" }
    );
    observador.observe(secao);

    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (!sozinho || !visivel || pausado) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ciclo = window.setInterval(() => {
      setAtivo((atual) => (atual + 1) % pilares.length);
    }, PASSO);

    return () => window.clearInterval(ciclo);
  }, [pausado, sozinho, visivel]);

  const escolher = (i: number) => {
    setSozinho(false);
    setAtivo(i);
  };

  return (
    <section
      ref={secaoRef}
      className="secao bloco superficie-clara grao metodo"
    >
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell">
        <Revela como="header" className="bloco__cabecalho">
          <p className="bloco__rotulo bloco__rotulo--escuro">
            <span className="bloco__numero">02</span>
            <span className="bloco__risco" aria-hidden="true" />
            Os cinco pilares
          </p>
          <h2 className="display bloco__titulo">
            Cada pilar depende do anterior
          </h2>
          <p className="bloco__intro">
            Toque em um pilar para abrir. Cada um traz o que é, como aparece na aula e
            o que muda para o aluno quando ele está sendo cumprido.
          </p>
        </Revela>

        {/* O ponteiro só segura o passeio em cima do diagrama e da lista — era a
            seção inteira, então um cursor parado em qualquer canto (título, botão,
            margem) travava tudo no primeiro pilar. */}
        <div
          className="metodo__grade"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
          onFocus={() => setPausado(true)}
          onBlur={(evento) => {
            if (
              !(evento.relatedTarget instanceof Node) ||
              !evento.currentTarget.contains(evento.relatedTarget)
            ) {
              setPausado(false);
            }
          }}
        >
          <Revela className="metodo__quadra">
            <Quadra ativo={ativo} aoEscolher={escolher} />
          </Revela>

          <Revela como="ol" className="metodo__lista" atraso={120}>
            {pilares.map((pilar, i) => {
              const aberto = i === ativo;
              return (
                <li key={pilar.numero} className="pilar" data-aberto={aberto}>
                  <button
                    type="button"
                    className="pilar__botao"
                    aria-expanded={aberto}
                    aria-controls={`pilar-${pilar.numero}`}
                    onClick={() => escolher(i)}
                  >
                    <span className="pilar__numero">{pilar.numero}</span>
                    <span className="pilar__nome">{pilar.nome}</span>
                    <span className="pilar__resumo">{pilar.resumo}</span>
                  </button>
                  <div id={`pilar-${pilar.numero}`} className="pilar__corpo">
                    <div className="pilar__miolo">
                      <p className="pilar__descricao">{pilar.descricao}</p>

                      <div className="pilar__pratica">
                        <h4 className="pilar__legenda">Como aparece na aula</h4>
                        <ul className="pilar__itens">
                          {pilar.naAula.map((linha) => (
                            <li key={linha}>{linha}</li>
                          ))}
                        </ul>
                      </div>

                      <p className="pilar__ganho">
                        <span className="pilar__legenda">O que muda para o aluno</span>
                        {pilar.oQueMuda}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </Revela>
        </div>

        <Revela className="metodo__rodape">
          <a
            className="btn btn--primario"
            href={site.whatsapp.link(whatsappMensagens.metodo)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Treinar dentro do método
          </a>
        </Revela>
      </div>
    </section>
  );
}

function Quadra({
  ativo,
  aoEscolher,
}: {
  ativo: number;
  aoEscolher: (i: number) => void;
}) {
  // A quadra tem proporção 1:2. O viewBox usa 400 × 800 e as zonas dos pilares
  // chegam em coordenadas 0–1, convertidas aqui.
  const L = 400;
  const A = 800;
  const margem = 44;

  const px = (x: number) => margem + x * (L - margem * 2);
  const py = (y: number) => margem + y * (A - margem * 2);
  const pontos = pilares.map((pilar) => [px(pilar.zona.x), py(pilar.zona.y)]);

  /* O risco é um traço só, desenhado uma vez e revelado por partes: o `d` cobre
     os cinco pilares e o que muda a cada passo é quanto dele está visível.
     Antes o traço inteiro era remontado a cada troca (`key={ativo}`) e voltava a
     ser desenhado do pilar 1 — de longe parecia piscar, não avançar.
     Por isso o comprimento acumulado é medido aqui, e não com getTotalLength():
     o valor precisa existir na primeira renderização, sem depender do DOM. */
  const rastro = pontos
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`)
    .join(" ");

  const trechos = pontos.slice(1).map(([x, y], i) => {
    const [xa, ya] = pontos[i];
    return Math.hypot(x - xa, y - ya);
  });
  const total = trechos.reduce((soma, t) => soma + t, 0);
  const percorrido = trechos
    .slice(0, ativo)
    .reduce((soma, t) => soma + t, 0);

  return (
    <svg
      className="quadra"
      viewBox={`0 0 ${L} ${A}`}
      role="img"
      aria-label="Diagrama de uma quadra de Beach Tennis com a posição dos cinco pilares do método."
    >
      {/* areia */}
      <rect x="0" y="0" width={L} height={A} className="quadra__areia" />

      {/* linhas de marcação */}
      <rect
        x={margem}
        y={margem}
        width={L - margem * 2}
        height={A - margem * 2}
        className="quadra__linha"
      />
      <line
        x1={margem - 22}
        y1={A / 2}
        x2={L - margem + 22}
        y2={A / 2}
        className="quadra__rede"
      />
      <circle cx={margem - 22} cy={A / 2} r="4" className="quadra__poste" />
      <circle cx={L - margem + 22} cy={A / 2} r="4" className="quadra__poste" />

      {/* No pilar 1 o traço volta a zero sem transição: animar a volta faria o
          risco desandar de trás para a frente, como se estivesse apagando. */}
      <path
        d={rastro}
        className="quadra__rastro"
        data-reinicio={ativo === 0}
        style={{ strokeDasharray: total, strokeDashoffset: total - percorrido }}
        aria-hidden="true"
      />

      {/* pilares */}
      {pilares.map((pilar, i) => {
        const cx = px(pilar.zona.x);
        const cy = py(pilar.zona.y);
        const atual = i === ativo;
        return (
          <g
            key={pilar.numero}
            className="quadra__no"
            data-ativo={atual}
            onClick={() => aoEscolher(i)}
          >
            <circle cx={cx} cy={cy} r="26" className="quadra__halo" />
            <circle cx={cx} cy={cy} r="17" className="quadra__disco" />
            <text x={cx} y={cy} className="quadra__num">
              {pilar.numero}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
