"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { exigirLider } from "@/lib/supabase/perfil";
import type { TipoMaterial } from "@/types/area-do-professor";

export type EstadoMaterial = { erro: string } | { sucesso: true } | null;
export type EstadoAcaoMaterial = { erro: string } | { sucesso: true; publicado?: boolean };

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
    // O binário é enviado diretamente do navegador ao Supabase Storage. Assim
    // ele não passa pelo limite de 4,5 MB das Server Actions da Vercel.
    const pathEnviado = String(formData.get("arquivo_path") ?? "");
    const extensao = pathEnviado.split(".").pop()?.toLowerCase() ?? "";
    if (!pathEnviado || !EXTENSOES_PERMITIDAS.includes(extensao)) {
      return { erro: "Não deu para enviar o arquivo. Tente novamente." };
    }
    arquivoPath = pathEnviado;
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
    if (arquivoPath) {
      await supabase.storage.from("materiais").remove([arquivoPath]);
    }
    return { erro: `Não deu para salvar: ${error.message}` };
  }

  revalidatePath("/area-do-professor/admin/materiais");
  return { sucesso: true };
}

export async function alternarPublicado(
  materialId: string,
  publicadoAtual: boolean
): Promise<EstadoAcaoMaterial> {
  await exigirLider();
  const supabase = await createClient();
  const proximoPublicado = !publicadoAtual;
  const { data, error } = await supabase
    .from("materiais")
    .update({ publicado: proximoPublicado })
    .eq("id", materialId)
    .select("id, publicado")
    .maybeSingle();
  if (error) return { erro: `Não deu para atualizar o material: ${error.message}` };
  if (!data || data.publicado !== proximoPublicado) {
    return {
      erro: "O material não foi atualizado. Verifique as permissões do Supabase e tente novamente.",
    };
  }

  revalidatePath("/area-do-professor/admin/materiais");
  revalidatePath("/area-do-professor");
  return { sucesso: true, publicado: data.publicado };
}

export async function excluirMaterial(
  materialId: string,
  arquivoPath: string | null
): Promise<EstadoAcaoMaterial> {
  await exigirLider();
  const supabase = await createClient();

  if (arquivoPath) {
    const { error } = await supabase.storage.from("materiais").remove([arquivoPath]);
    if (error) return { erro: `Não deu para remover o arquivo: ${error.message}` };
  }
  const { error } = await supabase.from("materiais").delete().eq("id", materialId);
  if (error) return { erro: `Não deu para excluir o material: ${error.message}` };

  revalidatePath("/area-do-professor/admin/materiais");
  revalidatePath("/area-do-professor");
  return { sucesso: true };
}
