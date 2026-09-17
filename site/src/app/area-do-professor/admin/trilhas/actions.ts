"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { exigirLider } from "@/lib/supabase/perfil";

export type EstadoTrilha = { erro: string } | { sucesso: true } | null;

export async function criarTrilha(
  _estadoAnterior: EstadoTrilha,
  formData: FormData
): Promise<EstadoTrilha> {
  await exigirLider();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;

  if (!titulo) {
    return { erro: "Preencha o título da trilha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("trilhas").insert({
    titulo,
    descricao,
    publicado: false,
  });

  if (error) {
    return { erro: `Não deu para criar: ${error.message}` };
  }

  revalidatePath("/area-do-professor/admin/trilhas");
  return { sucesso: true };
}

export async function alternarPublicadoTrilha(
  trilhaId: string,
  publicadoAtual: boolean
) {
  await exigirLider();
  const supabase = await createClient();
  await supabase
    .from("trilhas")
    .update({ publicado: !publicadoAtual })
    .eq("id", trilhaId);

  revalidatePath("/area-do-professor", "layout");
}

export async function excluirTrilha(trilhaId: string) {
  await exigirLider();
  const supabase = await createClient();
  await supabase.from("trilhas").delete().eq("id", trilhaId);

  revalidatePath("/area-do-professor", "layout");
}

export async function adicionarMaterialNaTrilha(
  trilhaId: string,
  formData: FormData
) {
  await exigirLider();

  const materialId = String(formData.get("material_id") ?? "");
  const ordemBruta = Number(formData.get("ordem") ?? 0);
  const ordem = Number.isFinite(ordemBruta) ? ordemBruta : 0;
  if (!materialId) return;

  const supabase = await createClient();
  await supabase
    .from("trilha_materiais")
    .upsert({ trilha_id: trilhaId, material_id: materialId, ordem });

  revalidatePath(`/area-do-professor/admin/trilhas/${trilhaId}`);
  revalidatePath("/area-do-professor", "layout");
}

export async function removerMaterialDaTrilha(
  trilhaId: string,
  materialId: string
) {
  await exigirLider();
  const supabase = await createClient();
  await supabase
    .from("trilha_materiais")
    .delete()
    .eq("trilha_id", trilhaId)
    .eq("material_id", materialId);

  revalidatePath(`/area-do-professor/admin/trilhas/${trilhaId}`);
  revalidatePath("/area-do-professor", "layout");
}
