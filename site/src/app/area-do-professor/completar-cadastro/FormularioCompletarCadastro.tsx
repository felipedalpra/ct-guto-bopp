"use client";

import { useActionState } from "react";
import {
  definirSenha,
  type EstadoCompletarCadastro,
} from "./actions";

export default function FormularioCompletarCadastro() {
  const [estado, formAction, pendente] = useActionState<
    EstadoCompletarCadastro,
    FormData
  >(definirSenha, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        Nova senha
        <input
          name="senha"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        Confirmar senha
        <input
          name="confirmacao"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      {estado?.erro ? (
        <p className="text-sm text-red-400" role="alert">
          {estado.erro}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pendente}
        className="rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright disabled:opacity-60"
      >
        {pendente ? "Salvando…" : "Salvar e entrar"}
      </button>
    </form>
  );
}
