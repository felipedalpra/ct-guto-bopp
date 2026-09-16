import { redirect } from "next/navigation";
import { createClient } from "./server";
import type { Perfil } from "@/types/area-do-professor";

export async function obterPerfilAtual(): Promise<Perfil | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function exigirLider(): Promise<Perfil> {
  const perfil = await obterPerfilAtual();
  if (!perfil || perfil.role !== "lider") {
    redirect("/area-do-professor");
  }
  return perfil;
}
