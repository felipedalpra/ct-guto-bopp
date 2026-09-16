import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROTAS_PUBLICAS = [
  "/area-do-professor/login",
  "/area-do-professor/completar-cadastro",
  "/area-do-professor/acesso-desativado",
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { pathname } = request.nextUrl;
  const rotaPublica = ROTAS_PUBLICAS.some((rota) => pathname.startsWith(rota));

  // Não trocar por getUser() aqui: getClaims() verifica o JWT localmente e
  // evita uma chamada de rede a cada requisição autenticada.
  const { data: claimsData } = await supabase.auth.getClaims();
  const usuarioId = claimsData?.claims.sub;

  if (!usuarioId) {
    if (rotaPublica) return supabaseResponse;
    const url = request.nextUrl.clone();
    url.pathname = "/area-do-professor/login";
    return NextResponse.redirect(url);
  }

  if (rotaPublica) return supabaseResponse;

  const { data: perfil } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", usuarioId)
    .single();

  if (!perfil || perfil.status === "revogado") {
    await supabase.auth.signOut();
    const url = request.nextUrl.clone();
    url.pathname = "/area-do-professor/acesso-desativado";
    return NextResponse.redirect(url);
  }

  if (
    pathname.startsWith("/area-do-professor/admin") &&
    perfil.role !== "lider"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/area-do-professor";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
