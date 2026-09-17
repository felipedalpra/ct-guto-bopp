"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function alternarVisto(materialId: string, vistoAtual: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (vistoAtual) {
    await supabase
      .from("progresso_material")
      .delete()
      .eq("professor_id", user.id)
      .eq("material_id", materialId);
  } else {
    await supabase
      .from("progresso_material")
      .upsert({ professor_id: user.id, material_id: materialId });
  }

  revalidatePath("/area-do-professor", "layout");
}
