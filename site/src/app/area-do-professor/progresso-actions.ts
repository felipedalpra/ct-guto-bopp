"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Resultado = { erro: string } | { sucesso: true };

export async function alternarVisto(
  materialId: string,
  vistoAtual: boolean
): Promise<Resultado> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { erro: "Sua sessão expirou. Entre novamente." };

  const { error } = vistoAtual
    ? await supabase
      .from("progresso_material")
      .delete()
      .eq("professor_id", user.id)
      .eq("material_id", materialId)
    : await supabase
      .from("progresso_material")
      .upsert(
        { professor_id: user.id, material_id: materialId },
        { onConflict: "professor_id,material_id" }
      );
  if (error) return { erro: "Não foi possível atualizar o material como visto." };

  revalidatePath("/area-do-professor", "layout");
  return { sucesso: true };
}
