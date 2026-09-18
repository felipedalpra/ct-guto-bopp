"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EstadoRedefinirSenha = { erro: string } | null;

export async function redefinirSenha(
  _estadoAnterior: EstadoRedefinirSenha,
  formData: FormData
): Promise<EstadoRedefinirSenha> {
  const senha = String(formData.get("senha") ?? "");
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (senha.length < 8) {
    return { erro: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (senha !== confirmacao) {
    return { erro: "As senhas não coincidem." };
  }

  // A sessão vem do /auth/confirm (verifyOtp com o token de recuperação).
  // Sem ela — link já usado, expirado ou página aberta direto — não há o que
  // redefinir.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/area-do-professor/login?erro=link-invalido");
  }

  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) {
    return {
      erro: "Não deu para salvar a senha. Peça um novo link em “Esqueci minha senha”.",
    };
  }

  redirect("/area-do-professor");
}
