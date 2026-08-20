"use client";

import { useState } from "react";
import { niveis } from "@/data/metodo";
import Revela from "./Revela";

/**
 * Os níveis atendidos, em abas.
 *
 * São quatro blocos de conteúdo parecidos e mutuamente exclusivos: empilhados,
 * viram uma parede de listas em que ninguém acha o próprio nível. Em abas, o
 * visitante encontra o dele na primeira linha e lê só aquilo.
 *
 * Os painéis escondidos continuam no HTML (só o `hidden` os oculta), então o
 * texto dos quatro níveis segue disponível para buscador e leitor de tela.
 */
export default function Niveis() {
  const [ativo, setAtivo] = useState(0);

  return (
    <Revela className="niveis">
      <div className="niveis__abas" role="tablist" aria-label="Níveis atendidos">
        {niveis.map((nivel, i) => (
          <button
            key={nivel.nome}
            type="button"
            role="tab"
            id={`aba-${i}`}
            aria-selected={i === ativo}
            aria-controls={`painel-${i}`}
            tabIndex={i === ativo ? 0 : -1}
            className="niveis__aba"
            data-ativo={i === ativo}
            onClick={() => setAtivo(i)}
          >
            {nivel.nome}
          </button>
        ))}
      </div>

      {niveis.map((nivel, i) => (
        <div
          key={nivel.nome}
          role="tabpanel"
          id={`painel-${i}`}
          aria-labelledby={`aba-${i}`}
          hidden={i !== ativo}
          className="niveis__painel"
        >
          <div className="niveis__ficha">
            <div>
              <h3 className="niveis__legenda">Para quem</h3>
              <p>{nivel.publico}</p>
            </div>
            <div>
              <h3 className="niveis__legenda">Foco do trabalho</h3>
              <p>{nivel.foco}</p>
            </div>
          </div>

          <ul className="niveis__itens">
            {nivel.itens.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </Revela>
  );
}
