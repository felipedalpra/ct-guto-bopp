"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { enviarEmailRecuperarSenha } from "@/lib/email/recuperar-senha";
import { site } from "@/data/site";

export type EstadoEsqueciSenha = { erro: string } | { sucesso: true } | null;

export async function solicitarRecuperacao(
  _estadoAnterior: EstadoEsqueciSenha,
  formData: FormData
): Promise<EstadoEsqueciSenha> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { erro: "Informe o e-mail da sua conta." };
  }

  // Resposta idêntica exista o e-mail ou não (e mesmo se o envio falhar depois
  // da busca): evita que este formulário público sirva para descobrir quem é
  // professor. Falhas vão para o log do servidor.
  const admin = createAdminClient();
  const { data: perfil } = await admin
    .from("profiles")
    .select("status")
    .eq("email", email)
    .maybeSingle();

  if (!perfil || perfil.status === "revogado") {
    return { sucesso: true };
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
  });

  if (error || !data.properties) {
    console.error("Recuperação de senha: generateLink falhou", error);
    return { sucesso: true };
  }

  const link = `${site.url}/auth/confirm?token_hash=${data.properties.hashed_token}&type=recovery&next=/area-do-professor/redefinir-senha`;
  const { erro: erroEmail } = await enviarEmailRecuperarSenha({
    destinatario: email,
    link,
  });

  if (erroEmail) {
    console.error("Recuperação de senha: e-mail não saiu", erroEmail);
  }

  return { sucesso: true };
}
