"use client";

import { startTransition, useActionState, useState } from "react";
import { criarMaterial, type EstadoMaterial } from "./actions";
import { createClient } from "@/lib/supabase/client";
import type { TipoMaterial } from "@/types/area-do-professor";

const TIPOS: { valor: TipoMaterial; rotulo: string }[] = [
  { valor: "arquivo", rotulo: "Arquivo" },
  { valor: "video", rotulo: "Vídeo" },
  { valor: "link", rotulo: "Link" },
  { valor: "texto", rotulo: "Aviso em texto" },
];

const TAMANHO_MAXIMO_ARQUIVO = 50 * 1024 * 1024;
const EXTENSOES_PERMITIDAS = ["pdf", "docx", "xlsx", "png", "jpg", "jpeg"];

export default function FormularioMaterial() {
  const [estado, formAction, pendente] = useActionState<
    EstadoMaterial,
    FormData
  >(criarMaterial, null);
  const [tipo, setTipo] = useState<TipoMaterial>("arquivo");
  const [erroUpload, setErroUpload] = useState<string | null>(null);
  const [enviandoArquivo, setEnviandoArquivo] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [arrastandoArquivo, setArrastandoArquivo] = useState(false);

  function selecionarArquivo(arquivo: File | null) {
    setArquivoSelecionado(arquivo);
    setErroUpload(null);
  }

  async function enviarArquivo(evento: React.FormEvent<HTMLFormElement>) {
    if (tipo !== "arquivo") return;

    evento.preventDefault();
    setErroUpload(null);

    const dados = new FormData(evento.currentTarget);
    const arquivo = arquivoSelecionado;
    if (!arquivo || arquivo.size === 0) {
      setErroUpload("Selecione um arquivo.");
      return;
    }
    if (arquivo.size > TAMANHO_MAXIMO_ARQUIVO) {
      setErroUpload("O arquivo passa de 50MB.");
      return;
    }

    const extensao = arquivo.name.split(".").pop()?.toLowerCase() ?? "";
    if (!EXTENSOES_PERMITIDAS.includes(extensao)) {
      setErroUpload("Formato não aceito. Envie PDF, DOCX, XLSX ou imagem.");
      return;
    }

    setEnviandoArquivo(true);
    const arquivoPath = `${crypto.randomUUID()}.${extensao}`;
    const supabase = createClient();
    const { error } = await supabase.storage
      .from("materiais")
      .upload(arquivoPath, arquivo, { contentType: arquivo.type || undefined });
    setEnviandoArquivo(false);

    if (error) {
      setErroUpload(`Não deu para enviar o arquivo: ${error.message}`);
      return;
    }

    dados.delete("arquivo");
    dados.set("arquivo", arquivo);
    dados.set("arquivo_path", arquivoPath);
    startTransition(() => formAction(dados));
  }

  return (
    <form
      action={formAction}
      onSubmit={enviarArquivo}
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
        <label
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed p-5 text-center text-sm transition ${
            arrastandoArquivo
              ? "border-lime-ct bg-lime-ct/10 text-lime-ct"
              : "border-sand/30 bg-navy-900 text-sand/80 hover:border-lime-ct hover:text-sand"
          }`}
          onDragEnter={(evento) => {
            evento.preventDefault();
            setArrastandoArquivo(true);
          }}
          onDragOver={(evento) => evento.preventDefault()}
          onDragLeave={(evento) => {
            if (!evento.currentTarget.contains(evento.relatedTarget as Node)) {
              setArrastandoArquivo(false);
            }
          }}
          onDrop={(evento) => {
            evento.preventDefault();
            setArrastandoArquivo(false);
            selecionarArquivo(evento.dataTransfer.files.item(0));
          }}
        >
          <span className="font-medium">Arraste o arquivo aqui</span>
          <span className="text-xs text-sand/60">
            ou toque para escolher — PDF, DOCX, XLSX ou imagem, até 50 MB
          </span>
          <span className="rounded-md border border-lime-ct/50 px-3 py-1.5 text-xs font-medium text-lime-ct">
            Escolher arquivo
          </span>
          {arquivoSelecionado ? (
            <span className="text-xs text-lime-ct">{arquivoSelecionado.name}</span>
          ) : null}
          <input
            name="arquivo"
            type="file"
            accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
            className="sr-only"
            onChange={(evento) => selecionarArquivo(evento.target.files?.item(0) ?? null)}
          />
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

      {erroUpload ? (
        <p className="text-sm text-red-400" role="alert">
          {erroUpload}
        </p>
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
        disabled={pendente || enviandoArquivo}
        className="self-start rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright disabled:opacity-60"
      >
        {enviandoArquivo
          ? "Enviando arquivo…"
          : pendente
            ? "Salvando…"
            : "Criar material"}
      </button>
    </form>
  );
}
