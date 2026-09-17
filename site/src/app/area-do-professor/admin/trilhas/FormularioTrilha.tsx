"use client";

import { useActionState } from "react";
import { criarTrilha, type EstadoTrilha } from "./actions";

export default function FormularioTrilha() {
  const [estado, formAction, pendente] = useActionState<EstadoTrilha, FormData>(
    criarTrilha,
    null
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-lg border border-sand/10 bg-navy-800 p-4"
    >
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        Título
        <input
          name="titulo"
          required
          className="rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        Descrição
        <textarea
          name="descricao"
          rows={2}
          className="rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      {estado && "erro" in estado ? (
        <p className="text-sm text-red-400" role="alert">
          {estado.erro}
        </p>
      ) : null}
      {estado && "sucesso" in estado ? (
        <p className="text-sm text-lime-ct">Trilha criada!</p>
      ) : null}
      <button
        type="submit"
        disabled={pendente}
        className="self-start rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright disabled:opacity-60"
      >
        {pendente ? "Criando…" : "Criar trilha"}
      </button>
    </form>
  );
}
