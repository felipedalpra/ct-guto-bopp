"use client";

import { useActionState } from "react";
import { solicitarRecuperacao, type EstadoEsqueciSenha } from "./actions";

export default function FormularioEsqueciSenha() {
  const [estado, formAction, pendente] = useActionState<
    EstadoEsqueciSenha,
    FormData
  >(solicitarRecuperacao, null);

  if (estado && "sucesso" in estado) {
    return (
      <p className="text-sm text-sand/80" role="status">
        Se esse e-mail estiver cadastrado, você vai receber um link para
        escolher uma nova senha. Confira também a caixa de spam.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        E-mail
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      {estado && "erro" in estado ? (
        <p className="text-sm text-red-400" role="alert">
          {estado.erro}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pendente}
        className="rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright disabled:opacity-60"
      >
        {pendente ? "Enviando…" : "Enviar link"}
      </button>
    </form>
  );
}
