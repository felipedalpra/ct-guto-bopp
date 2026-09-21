"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Resultado = { erro: string } | { sucesso: true };

async function usuarioAtual() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function revalidarInteracoes() {
  revalidatePath("/area-do-professor", "layout");
}

export async function alternarCurtida(
  materialId: string,
  curtiu: boolean
): Promise<Resultado> {
  const { supabase, user } = await usuarioAtual();
  if (!user) return { erro: "Sua sessão expirou. Entre novamente." };

  const { error } = curtiu
    ? await supabase
        .from("material_curtidas")
        .delete()
        .eq("material_id", materialId)
        .eq("professor_id", user.id)
    : await supabase
        .from("material_curtidas")
        .insert({ material_id: materialId, professor_id: user.id });
  if (error) return { erro: "Não foi possível registrar a curtida." };

  revalidarInteracoes();
  return { sucesso: true };
}

export async function comentarMaterial(
  materialId: string,
  conteudo: string
): Promise<Resultado> {
  const texto = conteudo.trim();
  if (!texto) return { erro: "Escreva um comentário antes de enviar." };
  if (texto.length > 1000) return { erro: "O comentário pode ter até 1.000 caracteres." };

  const { supabase, user } = await usuarioAtual();
  if (!user) return { erro: "Sua sessão expirou. Entre novamente." };
  const { data: perfil } = await supabase
    .from("profiles")
    .select("nome")
    .eq("id", user.id)
    .single();
  if (!perfil) return { erro: "Não foi possível identificar seu perfil." };

  const { error } = await supabase.from("material_comentarios").insert({
    material_id: materialId,
    professor_id: user.id,
    autor_nome: perfil.nome,
    conteudo: texto,
  });
  if (error) return { erro: "Não foi possível publicar o comentário." };

  revalidarInteracoes();
  return { sucesso: true };
}

export async function excluirComentario(comentarioId: string): Promise<Resultado> {
  const { supabase, user } = await usuarioAtual();
  if (!user) return { erro: "Sua sessão expirou. Entre novamente." };

  const { error } = await supabase.from("material_comentarios").delete().eq("id", comentarioId);
  if (error) return { erro: "Não foi possível excluir o comentário." };

  revalidarInteracoes();
  return { sucesso: true };
}
