// site/src/app/area-do-professor/materiais/[id]/download/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: material } = await supabase
    .from("materiais")
    .select("arquivo_path")
    .eq("id", id)
    .eq("tipo", "arquivo")
    .single();

  if (!material?.arquivo_path) {
    return NextResponse.redirect(new URL("/area-do-professor", request.url));
  }

  const { data, error } = await supabase.storage
    .from("materiais")
    .createSignedUrl(material.arquivo_path, 60);

  if (error || !data) {
    return NextResponse.redirect(new URL("/area-do-professor", request.url));
  }

  return NextResponse.redirect(data.signedUrl);
}
