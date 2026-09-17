"use client";

import { useActionState, useState } from "react";
import { criarMaterial, type EstadoMaterial } from "./actions";
import type { TipoMaterial } from "@/types/area-do-professor";

const TIPOS: { valor: TipoMaterial; rotulo: string }[] = [
  { valor: "arquivo", rotulo: "Arquivo" },
  { valor: "video", rotulo: "Vídeo" },
  { valor: "link", rotulo: "Link" },
  { valor: "texto", rotulo: "Aviso em texto" },
];

export default function FormularioMaterial() {
  const [estado, formAction, pendente] = useActionState<
    EstadoMaterial,
    FormData
  >(criarMaterial, null);
  const [tipo, setTipo] = useState<TipoMaterial>("arquivo");

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
        Descrição (opcional)
        <input
          name="descricao"
          className="rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        Tipo
        <select
          name="tipo"
          value={tipo}
          onChange={(evento) => setTipo(evento.target.value as TipoMaterial)}
          className="rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        >
          {TIPOS.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </label>

      {tipo === "arquivo" ? (
        <label className="flex flex-col gap-1 text-sm text-sand/80">
          Arquivo (PDF, DOCX, XLSX ou imagem, até 20MB)
          <input name="arquivo" type="file" required className="text-sand" />
        </label>
      ) : null}
      {tipo === "video" ? (
        <label className="flex flex-col gap-1 text-sm text-sand/80">
          Link do vídeo (YouTube/Vimeo não-listado)
          <input
            name="video_url"
            type="url"
            required
            className="rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sand outline-none focus:border-lime-ct"
          />
        </label>
      ) : null}
      {tipo === "link" ? (
        <label className="flex flex-col gap-1 text-sm text-sand/80">
          Link
          <input
            name="link_url"
            type="url"
            required
            className="rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sand outline-none focus:border-lime-ct"
          />
        </label>
      ) : null}
      {tipo === "texto" ? (
        <label className="flex flex-col gap-1 text-sm text-sand/80">
          Texto do aviso
          <textarea
            name="corpo_texto"
            required
            rows={4}
            className="rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sand outline-none focus:border-lime-ct"
          />
        </label>
      ) : null}

      {estado && "erro" in estado ? (
        <p className="text-sm text-red-400" role="alert">
          {estado.erro}
        </p>
      ) : null}
      {estado && "sucesso" in estado ? (
        <p className="text-sm text-lime-ct">
          Material criado como rascunho — publique quando quiser.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pendente}
        className="self-start rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright disabled:opacity-60"
      >
        {pendente ? "Salvando…" : "Criar material"}
      </button>
    </form>
  );
}
