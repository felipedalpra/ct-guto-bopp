"use client";

import { useState, useTransition } from "react";
import {
  alternarCurtida,
  comentarMaterial,
  excluirComentario,
} from "@/app/area-do-professor/interacoes-actions";
import type { InteracoesDoMaterial } from "@/types/area-do-professor";

export default function InteracoesMaterial({
  materialId,
  titulo,
  interacoes,
  usuarioId,
  podeModerar,
}: {
  materialId: string;
  titulo: string;
  interacoes: InteracoesDoMaterial;
  usuarioId: string | null;
  podeModerar: boolean;
}) {
  const [comentario, setComentario] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function executar(acao: () => Promise<{ erro: string } | { sucesso: true }>, limpar = false) {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await acao();
      if ("erro" in resultado) setErro(resultado.erro);
      else if (limpar) setComentario("");
    });
  }

  async function compartilhar() {
    const texto = `Material do Conexão BT: ${titulo}`;
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: titulo, text: texto, url });
      else await navigator.clipboard.writeText(url);
    } catch {
      // Cancelar o compartilhamento não precisa virar erro para o professor.
    }
  }

  return (
    <section className="mt-4 border-t border-sand/10 pt-3" aria-label={`Interações sobre ${titulo}`}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pendente}
          onClick={() => executar(() => alternarCurtida(materialId, interacoes.curtiu))}
          className={`rounded-md border px-3 py-1.5 text-sm disabled:opacity-60 ${
            interacoes.curtiu
              ? "border-lime-ct bg-lime-ct/10 text-lime-ct"
              : "border-sand/20 text-sand/75 hover:border-lime-ct/60"
          }`}
        >
          {interacoes.curtiu ? "♥ Curtido" : "♡ Curtir"} ({interacoes.curtidas})
        </button>
        <button
          type="button"
          onClick={compartilhar}
          className="rounded-md border border-sand/20 px-3 py-1.5 text-sm text-sand/75 hover:border-lime-ct/60"
        >
          Compartilhar
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {interacoes.comentarios.map((item) => (
          <article key={item.id} className="rounded-md bg-navy-900/60 p-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <p><strong className="text-sand">{item.autor_nome}</strong><span className="text-sand/50"> · {new Date(item.criado_em).toLocaleDateString("pt-BR")}</span></p>
              {item.professor_id === usuarioId || podeModerar ? (
                <button
                  type="button"
                  disabled={pendente}
                  onClick={() => executar(() => excluirComentario(item.id))}
                  className="text-xs text-red-300 hover:underline"
                >
                  Excluir
                </button>
              ) : null}
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sand/75">{item.conteudo}</p>
          </article>
        ))}
        <form
          onSubmit={(evento) => {
            evento.preventDefault();
            executar(() => comentarMaterial(materialId, comentario), true);
          }}
          className="flex gap-2"
        >
          <label className="sr-only" htmlFor={`comentario-${materialId}`}>Comentar</label>
          <input
            id={`comentario-${materialId}`}
            value={comentario}
            onChange={(evento) => setComentario(evento.target.value)}
            maxLength={1000}
            placeholder="Escreva um comentário…"
            className="min-w-0 flex-1 rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sm text-sand outline-none focus:border-lime-ct"
          />
          <button type="submit" disabled={pendente || !comentario.trim()} className="rounded-md bg-lime-ct px-3 py-2 text-sm font-medium text-navy-900 disabled:opacity-60">
            {pendente ? "Enviando…" : "Comentar"}
          </button>
        </form>
      </div>
      {erro ? <p className="mt-2 text-sm text-red-300" role="alert">{erro}</p> : null}
    </section>
  );
}
