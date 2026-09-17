"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { exigirLider } from "@/lib/supabase/perfil";
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

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { nome },
    redirectTo: `${site.url}/area-do-professor/completar-cadastro`,
  });

  if (error) {
    return { erro: `Não deu para convidar: ${error.message}` };
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
