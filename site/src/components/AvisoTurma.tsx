"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CartazTurma from "./CartazTurma";
import { diasParaTurma, proximaTurma, turmaAberta } from "@/data/turma";
import { site } from "@/data/site";

/**
 * O aviso da turma para quem acabou de chegar.
 *
 * Popup é a coisa mais fácil de fazer errado num site, então este segue quatro
 * regras que resolvem o que costuma irritar:
 *
 * 1. Não bloqueia. É um cartão no canto, sem cortina por cima da página: dá para
 *    continuar lendo e ignorar. Nada de foco preso nem de rolagem travada.
 * 2. Não aparece de cara. Espera a pessoa se situar — 7 segundos ou 35% de
 *    rolagem, o que vier antes.
 * 3. Aparece uma vez. Fechou (ou clicou), não volta: fica marcado no navegador,
 *    com chave por turma, então a turma seguinte pode avisar de novo.
 * 4. Cala a boca sozinho. Passada a data da turma, nem chega a montar — e a
 *    conta é feita no navegador, então independe de novo build.
 *
 * Não aparece na /conexao-bt: quem está lendo a página do curso já viu o anúncio
 * inteiro no topo dela.
 */
const CHAVE = "ct.aviso-turma.2026-09";
const ESPERA_MS = 7000;
const ROLAGEM = 0.35;

export default function AvisoTurma() {
  const caminho = usePathname();
  const [visivel, setVisivel] = useState(false);
  const [saindo, setSaindo] = useState(false);

  const naPaginaDoCurso = caminho === "/conexao-bt";

  const fechar = useCallback(() => {
    setSaindo(true);
    try {
      localStorage.setItem(CHAVE, "visto");
    } catch {
      // Navegador com armazenamento bloqueado: o aviso volta na próxima visita,
      // o que é bem menos grave do que quebrar a página.
    }
    // Deixa a animação de saída terminar antes de tirar do DOM.
    window.setTimeout(() => setVisivel(false), 320);
  }, []);

  useEffect(() => {
    if (naPaginaDoCurso || !turmaAberta()) return;

    try {
      if (localStorage.getItem(CHAVE)) return;
    } catch {
      // segue o jogo
    }

    let cronometro = 0;

    const mostrar = () => {
      window.clearTimeout(cronometro);
      window.removeEventListener("scroll", aoRolar);
      setVisivel(true);
    };

    function aoRolar() {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total > ROLAGEM) mostrar();
    }

    cronometro = window.setTimeout(mostrar, ESPERA_MS);
    window.addEventListener("scroll", aoRolar, { passive: true });

    return () => {
      window.clearTimeout(cronometro);
      window.removeEventListener("scroll", aoRolar);
    };
  }, [naPaginaDoCurso]);

  useEffect(() => {
    if (!visivel) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [visivel, fechar]);

  if (!visivel) return null;

  const dias = diasParaTurma();
  const urgencia =
    dias > 1 ? `Faltam ${dias} dias` : dias === 1 ? "É amanhã" : "Começa hoje";

  return (
    <div
      className="aviso"
      data-saindo={saindo}
      role="dialog"
      aria-labelledby="aviso-titulo"
    >
      <button
        type="button"
        className="aviso__fechar"
        onClick={fechar}
        aria-label="Fechar aviso da turma"
      >
        <span aria-hidden="true">×</span>
      </button>

      <p className="aviso__urgencia">
        <span className="turma__pulso" aria-hidden="true" />
        {urgencia}
      </p>

      <p id="aviso-titulo" className="aviso__titulo">
        Turma do <strong>Conexão BT</strong> em {proximaTurma.mes.replace("de ", "")}
      </p>

      <CartazTurma compacto />

      <div className="aviso__acoes">
        <a
          className="btn btn--primario aviso__btn"
          href={site.whatsapp.link(proximaTurma.mensagem)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={fechar}
        >
          Quero minha vaga
        </a>
        <Link className="aviso__link" href="/conexao-bt" onClick={fechar}>
          Ver o curso
        </Link>
      </div>
    </div>
  );
}
