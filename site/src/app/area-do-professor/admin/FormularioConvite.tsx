"use client";

import { useActionState } from "react";
import { convidarProfessor, type EstadoConvite } from "./actions";

export default function FormularioConvite() {
  const [estado, formAction, pendente] = useActionState<
    EstadoConvite,
    FormData
  >(convidarProfessor, null);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <label className="flex flex-1 flex-col gap-1 text-sm text-sand/80">
        Nome
        <input
          name="nome"
          required
          className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      <label className="flex flex-1 flex-col gap-1 text-sm text-sand/80">
        E-mail
        <input
          name="email"
          type="email"
          required
          className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      <button
        type="submit"
        disabled={pendente}
        className="rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright disabled:opacity-60"
      >
        {pendente ? "Convidando…" : "Convidar"}
      </button>
      {estado && "erro" in estado ? (
        <p className="text-sm text-red-400 sm:basis-full" role="alert">
          {estado.erro}
        </p>
      ) : null}
      {estado && "sucesso" in estado ? (
        <p className="text-sm text-lime-ct sm:basis-full">Convite enviado!</p>
      ) : null}
    </form>
  );
}
