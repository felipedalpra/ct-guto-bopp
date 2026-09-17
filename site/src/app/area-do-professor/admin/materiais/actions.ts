"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { exigirLider } from "@/lib/supabase/perfil";
import type { TipoMaterial } from "@/types/area-do-professor";

export type EstadoMaterial = { erro: string } | { sucesso: true } | null;

// 20MB é o teto definido no design spec; o next.config.ts (Task 1) já libera
// o corpo da Server Action até 21MB para caber a sobrecarga do multipart.
const TAMANHO_MAXIMO_ARQUIVO = 20 * 1024 * 1024;
const EXTENSOES_PERMITIDAS = ["pdf", "docx", "xlsx", "png", "jpg", "jpeg"];

export async function criarMaterial(
  _estadoAnterior: EstadoMaterial,
  formData: FormData
): Promise<EstadoMaterial> {
  await exigirLider();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const tipo = String(formData.get("tipo") ?? "") as TipoMaterial;

  if (!titulo || !tipo) {
    return { erro: "Preencha ao menos título e tipo." };
  }

  const supabase = await createClient();
  let arquivoPath: string | null = null;
  let videoUrl: string | null = null;
  let linkUrl: string | null = null;
  let corpoTexto: string | null = null;

  if (tipo === "arquivo") {
    const arquivo = formData.get("arquivo");
    if (!(arquivo instanceof File) || arquivo.size === 0) {
      return { erro: "Selecione um arquivo." };
    }
    if (arquivo.size > TAMANHO_MAXIMO_ARQUIVO) {
      return { erro: "O arquivo passa de 20MB." };
    }
    const extensao = arquivo.name.split(".").pop()?.toLowerCase() ?? "";
    if (!EXTENSOES_PERMITIDAS.includes(extensao)) {
      return { erro: "Formato não aceito. Envie PDF, DOCX, XLSX ou imagem." };
    }

    arquivoPath = `${randomUUID()}.${extensao}`;
    const { error: erroUpload } = await supabase.storage
      .from("materiais")
      .upload(arquivoPath, arquivo);
    if (erroUpload) {
      return { erro: `Não deu para enviar o arquivo: ${erroUpload.message}` };
    }
  } else if (tipo === "video") {
    videoUrl = String(formData.get("video_url") ?? "").trim();
    if (!videoUrl) return { erro: "Cole o link do vídeo." };
  } else if (tipo === "link") {
    linkUrl = String(formData.get("link_url") ?? "").trim();
    if (!linkUrl) return { erro: "Cole o link." };
  } else if (tipo === "texto") {
    corpoTexto = String(formData.get("corpo_texto") ?? "").trim();
    if (!corpoTexto) return { erro: "Escreva o texto do aviso." };
  }

  const { error } = await supabase.from("materiais").insert({
    titulo,
    descricao,
    tipo,
    arquivo_path: arquivoPath,
    video_url: videoUrl,
    link_url: linkUrl,
    corpo_texto: corpoTexto,
    publicado: false,
  });

  if (error) {
    return { erro: `Não deu para salvar: ${error.message}` };
  }

  revalidatePath("/area-do-professor/admin/materiais");
  return { sucesso: true };
}

export async function alternarPublicado(
  materialId: string,
  publicadoAtual: boolean
) {
  await exigirLider();
  const supabase = await createClient();
  await supabase
    .from("materiais")
    .update({ publicado: !publicadoAtual })
    .eq("id", materialId);
  revalidatePath("/area-do-professor/admin/materiais");
  revalidatePath("/area-do-professor");
}

export async function excluirMaterial(
  materialId: string,
  arquivoPath: string | null
) {
  await exigirLider();
  const supabase = await createClient();

  if (arquivoPath) {
    await supabase.storage.from("materiais").remove([arquivoPath]);
  }
  await supabase.from("materiais").delete().eq("id", materialId);

  revalidatePath("/area-do-professor/admin/materiais");
  revalidatePath("/area-do-professor");
}
