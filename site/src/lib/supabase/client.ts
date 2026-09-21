import { createBrowserClient } from "@supabase/ssr";

/** Cliente do navegador para operações que não devem atravessar a Vercel,
 * como o envio de arquivos maiores para o Storage. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
