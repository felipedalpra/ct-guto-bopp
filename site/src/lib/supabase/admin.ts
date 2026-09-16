import "server-only";
import { createClient as criarClienteSupabase } from "@supabase/supabase-js";

/**
 * Cliente com a secret key: ignora RLS por completo. Só para operações que
 * exigem privilégio de admin (convidar usuário) — nunca para ler ou gravar
 * dados de negócio, que devem passar pelo cliente normal (server.ts) e
 * respeitar RLS. Todo chamador precisa checar `role = lider` manualmente
 * antes de usar este cliente (RLS não protege esta chamada — ver Task 15).
 */
export function createAdminClient() {
  return criarClienteSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
