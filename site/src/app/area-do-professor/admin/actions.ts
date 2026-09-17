"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { exigirLider } from "@/lib/supabase/perfil";
import { enviarEmailConvite } from "@/lib/email/convite";
import { site } from "@/data/site";

export type EstadoConvite = { erro: string } | { sucesso: true } | null;

export async function convidarProfessor(
  _estadoAnterior: EstadoConvite,
  formData: FormData
): Promise<EstadoConvite> {
  // Obrigatório antes de tocar no cliente admin: a secret key ignora RLS, então
  // essa checagem é a única coisa que impede qualquer usuário autenticado de
  // convidar gente.
  await exigirLider();

  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!nome || !email) {
    return { erro: "Preencha nome e e-mail." };
  }

  // Gera só o link (sem passar pelo editor de templates do Supabase Auth,
  // que reescrevia o HTML e travava com "ends in a non-text context" — ver
  // memory.md). O e-mail é nosso: convite.ts monta o HTML e resend.ts manda.
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "invite",
    email,
    options: {
      data: { nome },
      redirectTo: `${site.url}/area-do-professor/completar-cadastro`,
    },
  });

  if (error || !data.properties) {
    return { erro: `Não deu para convidar: ${error?.message ?? "erro desconhecido"}` };
  }

  const link = `${site.url}/auth/confirm?token_hash=${data.properties.hashed_token}&type=invite&next=/area-do-professor/completar-cadastro`;
  const { erro: erroEmail } = await enviarEmailConvite({ nome, destinatario: email, link });

  if (erroEmail) {
    return { erro: `Convite criado, mas o e-mail não saiu: ${erroEmail}` };
  }

  revalidatePath("/area-do-professor/admin");
  return { sucesso: true };
}

export async function alternarStatusProfessor(
  profissionalId: string,
  statusAtual: "ativo" | "revogado"
) {
  await exigirLider();

  const supabase = await createClient();
  const novoStatus = statusAtual === "ativo" ? "revogado" : "ativo";

  await supabase
    .from("profiles")
    .update({ status: novoStatus })
    .eq("id", profissionalId);

  revalidatePath("/area-do-professor/admin");
}
