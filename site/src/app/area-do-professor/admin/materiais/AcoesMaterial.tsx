"use client";

import { useState, useTransition } from "react";
import { alternarPublicado, excluirMaterial } from "./actions";

type AcaoPendente = "publicar" | "despublicar" | "excluir" | null;

function Carregando() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function AcoesMaterial({
  id,
  titulo,
  publicado,
  arquivoPath,
}: {
  id: string;
  titulo: string;
  publicado: boolean;
  arquivoPath: string | null;
}) {
  const [acao, setAcao] = useState<AcaoPendente>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const ehExclusao = acao === "excluir";
  const rotuloAcao = acao === "publicar" ? "Publicar" : acao === "despublicar" ? "Despublicar" : "Excluir";

  function confirmar() {
    if (!acao) return;
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = ehExclusao
        ? await excluirMaterial(id, arquivoPath)
        : await alternarPublicado(id, publicado);
      if ("erro" in resultado) setErro(resultado.erro);
    });
  }

  return (
    <>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setAcao(publicado ? "despublicar" : "publicar")}
          disabled={pendente}
          className="inline-flex items-center gap-2 rounded-md border border-lime-ct/40 px-3 py-1 text-sm text-lime-ct hover:bg-lime-ct/10 disabled:cursor-wait disabled:opacity-60"
        >
          {pendente && !ehExclusao ? <Carregando /> : null}
          {publicado ? "Despublicar" : "Publicar"}
        </button>
        <button
          type="button"
          onClick={() => setAcao("excluir")}
          disabled={pendente}
          className="inline-flex items-center gap-2 rounded-md border border-red-400/40 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10 disabled:cursor-wait disabled:opacity-60"
        >
          {pendente && ehExclusao ? <Carregando /> : null}
          Excluir
        </button>
      </div>

      {acao ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-900/80 p-4" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmar-material-titulo"
            className="w-full max-w-md rounded-lg border border-sand/15 bg-navy-800 p-5 shadow-2xl"
          >
            <h2 id="confirmar-material-titulo" className="font-display text-xl">
              {rotuloAcao} material?
            </h2>
            <p className="mt-2 text-sm text-sand/70">
              {ehExclusao
                ? `“${titulo}” e o arquivo vinculado serão removidos permanentemente.`
                : acao === "publicar"
                  ? `“${titulo}” ficará visível para os professores.`
                  : `“${titulo}” deixará de aparecer para os professores.`}
            </p>
            {erro ? <p className="mt-3 text-sm text-red-300">{erro}</p> : null}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={pendente}
                onClick={() => {
                  setAcao(null);
                  setErro(null);
                }}
                className="rounded-md border border-sand/20 px-3 py-2 text-sm hover:bg-sand/10 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmar}
                disabled={pendente}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium disabled:cursor-wait disabled:opacity-60 ${
                  ehExclusao ? "bg-red-400 text-navy-900" : "bg-lime-ct text-navy-900"
                }`}
              >
                {pendente ? <Carregando /> : null}
                {pendente ? `${rotuloAcao}…` : rotuloAcao}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
