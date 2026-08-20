"use client";

import { useState } from "react";
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
export default function Metodo() {
  const [ativo, setAtivo] = useState(0);

  return (
    <section className="secao bloco superficie-clara grao metodo">
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

        <div className="metodo__grade">
          <Revela className="metodo__quadra">
            <Quadra ativo={ativo} aoEscolher={setAtivo} />
            <p className="metodo__legenda">
              Quadra oficial de Beach Tennis · 8 × 16 m
            </p>
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
                    onClick={() => setAtivo(i)}
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
