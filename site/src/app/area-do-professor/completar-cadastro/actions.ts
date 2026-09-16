"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EstadoCompletarCadastro = { erro: string } | null;

export async function definirSenha(
  _estadoAnterior: EstadoCompletarCadastro,
  formData: FormData
): Promise<EstadoCompletarCadastro> {
  const senha = String(formData.get("senha") ?? "");
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (senha.length < 8) {
    return { erro: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (senha !== confirmacao) {
    return { erro: "As senhas não coincidem." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/area-do-professor/login?erro=convite-invalido");
  }

  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) {
    return {
      erro: "Não deu para salvar a senha. Peça um novo convite ao CT.",
    };
  }

  redirect("/area-do-professor");
}
