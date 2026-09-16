# Área do Professor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the authenticated, invite-only "Área do Professor" for the CT Guto Bopp
site — login, invite flow, role-based access (líder/professor), and a materials
library — per the approved design in
`docs/superpowers/specs/2026-09-15-area-do-professor-design.md`.

**Architecture:** Next.js 16 App Router (already the site's stack) + Supabase
(Postgres + Auth + Storage) as the only backend. All reads happen in Server
Components; all writes happen through Server Actions (`'use server'`) — there is no
client-side Supabase client and no separate API layer. `proxy.ts` (Next 16's renamed
`middleware.ts`) is the single choke point that refreshes the session and enforces
who can see `/area-do-professor/**`.

**Tech Stack:** Next.js 16, TypeScript, Tailwind 4 (existing site tokens), `@supabase/ssr`
0.12.7, `@supabase/supabase-js` 2.116.0, `server-only`.

**Read this first:** the project's `site/AGENTS.md` warns that this Next.js version
(16) has file-convention changes from what most training data assumes —
`middleware.ts` was renamed to `proxy.ts` (confirmed against
`site/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`),
`cookies()` is async, and the default Server Action body limit is 1MB (raised for this
feature in Task 12). The exact `@supabase/ssr` code in this plan was pulled live from
Supabase's own docs during planning (2026-09-16), not from training memory, because
that SDK also changes shape often (see the naming note in Task 2).

---

## Phase split and why

This plan is split into two phases with a hard dependency between them:

- **Fase 1** — all Next.js application code. Builds and type-checks today, with no
  live Supabase project. Every Server Component that touches Supabase calls
  `cookies()` transitively, which makes Next skip static prerendering for that route,
  so `npm run build` succeeds even though the code will only actually *work* once
  real credentials exist.
- **Fase 2** — the Supabase project itself: creating it, running the SQL, wiring the
  three env vars, and the one-time dashboard steps (email template, bootstrapping the
  first líder). **Blocked** until a Supabase organization with a free project slot
  exists for `ct-guto-bopp` (see `memory.md` → "Área do Professor" → "Onde parou" for
  the current blocker: the `projetosFDP` org's 2 free-project slots are both taken).

Do not start Fase 2 until that organization/slot exists. Fase 1 can be fully
implemented and committed regardless.

---

## Fase 1 — Aplicação Next.js

### Task 1: Dependências e configuração de body size

**Files:**
- Modify: `site/package.json`
- Modify: `site/next.config.ts`

- [ ] **Step 1: Instalar as dependências**

```bash
cd site
npm install @supabase/supabase-js@^2.116.0 @supabase/ssr@^0.12.7 server-only@^0.0.1
```

- [ ] **Step 2: Levantar o limite do corpo das Server Actions**

O upload de material (Task 13) manda um arquivo de até 20MB direto pelo `FormData`
de uma Server Action. O limite padrão do Next é 1MB
(`site/node_modules/next/dist/docs/01-app/02-guides/server-actions.md`, seção
"Security" → "Body size limit"). Editar `site/next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // O lockfile do projeto vive em site/; sem isto o Turbopack sobe até a home do usuário.
  turbopack: { root: import.meta.dirname },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      // Upload de material vai até 20MB (ver design spec); a margem cobre a
      // sobrecarga do multipart/form-data.
      bodySizeLimit: "21mb",
    },
  },
};

export default nextConfig;
```

- [ ] **Step 3: Verificar**

```bash
cd site && npm run build
```

Expected: build passa normalmente (nenhuma rota nova ainda existe).

- [ ] **Step 4: Commit**

```bash
git add site/package.json site/package-lock.json site/next.config.ts
git commit -m "Adiciona dependências do Supabase e libera o body size das Server Actions"
```

---

### Task 2: Variáveis de ambiente (placeholders)

**Files:**
- Create: `site/.env.local.example`

Nomenclatura: Supabase renomeou `anon key`/`service_role key` para
**`publishable key`/`secret key`** em projetos novos (confirmado pela própria doc do
Supabase buscada nesta sessão, que já usa `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e
chaves com prefixo `sb_publishable_...`/`sb_secret_...`). Como o projeto ainda não
existe, ele nasce com essa nomenclatura nova — não a antiga citada no `memory.md`.

- [ ] **Step 1: Criar o arquivo de exemplo**

```bash
# site/.env.local.example
# Copiar para site/.env.local (nunca commitado — já está no .gitignore) e preencher
# com os valores do painel do Supabase (Project Settings → API) depois que o
# projeto existir (ver Fase 2 deste plano).
#
# NUNCA cole a secret key no chat com um agente de IA — pegue direto do painel.

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

- [ ] **Step 2: Confirmar que o `.gitignore` cobre `.env.local` mas não o `.example`**

```bash
cd site && git check-ignore -v .env.local.example || echo "OK: não ignorado"
```

Expected: `OK: não ignorado` (o padrão `.env*.local` não bate com `.example`).

- [ ] **Step 3: Commit**

```bash
git add site/.env.local.example
git commit -m "Documenta as variáveis de ambiente que a Área do Professor vai precisar"
```

---

### Task 3: Tipos compartilhados

**Files:**
- Create: `site/src/types/area-do-professor.ts`

- [ ] **Step 1: Escrever os tipos**

```ts
// site/src/types/area-do-professor.ts

export type PapelUsuario = "lider" | "professor";
export type StatusUsuario = "ativo" | "revogado";

export type Perfil = {
  id: string;
  nome: string;
  email: string;
  role: PapelUsuario;
  status: StatusUsuario;
  criado_em: string;
};

export type TipoMaterial = "arquivo" | "video" | "link" | "texto";

export type Material = {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: TipoMaterial;
  arquivo_path: string | null;
  video_url: string | null;
  link_url: string | null;
  corpo_texto: string | null;
  publicado: boolean;
  criado_em: string;
};
```

- [ ] **Step 2: Verificar**

```bash
cd site && npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add site/src/types/area-do-professor.ts
git commit -m "Adiciona os tipos de perfil e material da Área do Professor"
```

---

### Task 4: Cliente Supabase do servidor

**Files:**
- Create: `site/src/lib/supabase/server.ts`

Não existe cliente de navegador (`createBrowserClient`) neste plano: todo mutation
passa por Server Action e toda leitura por Server Component, então não há nenhum
lugar no app que precise falar com o Supabase a partir do browser. Adicionar esse
cliente sem um uso real seria YAGNI.

- [ ] **Step 1: Escrever o cliente**

Padrão oficial do `@supabase/ssr` para Server Components/Actions/Route Handlers
(`cookies()` é assíncrono desde o Next 15 — ver
`site/node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md`):

```ts
// site/src/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado a partir de um Server Component, que não pode escrever
            // cookies. Inofensivo: o proxy.ts (Task 8) já renova a sessão a
            // cada requisição.
          }
        },
      },
    }
  );
}
```

- [ ] **Step 2: Verificar**

```bash
cd site && npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add site/src/lib/supabase/server.ts
git commit -m "Adiciona o cliente Supabase para Server Components e Server Actions"
```

---

### Task 5: Cliente admin (secret key)

**Files:**
- Create: `site/src/lib/supabase/admin.ts`

Este cliente ignora RLS por completo — só serve para `inviteUserByEmail`, que exige
privilégio de admin. `import "server-only"` garante um erro de build se algum dia
esse arquivo for importado por engano a partir de um Client Component.

- [ ] **Step 1: Escrever o cliente**

```ts
// site/src/lib/supabase/admin.ts
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
```

- [ ] **Step 2: Verificar**

```bash
cd site && npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add site/src/lib/supabase/admin.ts
git commit -m "Adiciona o cliente Supabase admin (secret key), restrito a server-only"
```

---

### Task 6: Helpers de perfil e permissão

**Files:**
- Create: `site/src/lib/supabase/perfil.ts`

- [ ] **Step 1: Escrever os helpers**

```ts
// site/src/lib/supabase/perfil.ts
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
```

- [ ] **Step 2: Verificar**

```bash
cd site && npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add site/src/lib/supabase/perfil.ts
git commit -m "Adiciona helpers de perfil e checagem de líder"
```

---

### Task 7: `proxy.ts` — sessão e regras de acesso

**Files:**
- Create: `site/src/lib/supabase/proxy.ts`
- Create: `site/proxy.ts`

Esta é a peça mais sensível do plano — é o único ponto que decide quem entra em
`/area-do-professor/**`. `getClaims()` (em vez de `getUser()`) é o que a doc atual do
Supabase recomenda dentro do proxy: verifica o JWT localmente e evita uma chamada de
rede por requisição. **Não remover a chamada de renovação de sessão** — a própria doc
do Supabase avisa que isso pode deslogar usuários aleatoriamente.

- [ ] **Step 1: Escrever a lógica de sessão e autorização**

```ts
// site/src/lib/supabase/proxy.ts
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
```

- [ ] **Step 2: Escrever o arquivo de proxy na raiz do projeto Next**

`middleware.ts` está descontinuado no Next 16 em favor de `proxy.ts` — mesma API,
arquivo e nome de função diferentes (`export function proxy` em vez de
`middleware`). Confirmado em
`site/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
O `matcher` cobre só `/area-do-professor/**`: o resto do site é estático e não deve
pagar o custo de uma consulta ao Supabase por requisição.

```ts
// site/proxy.ts
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/area-do-professor/:path*"],
};
```

- [ ] **Step 3: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build
```

Expected: sem erros. `/area-do-professor/**` ainda não existe como rota, então o
`matcher` não afeta nada até a Task 9.

- [ ] **Step 4: Commit**

```bash
git add site/src/lib/supabase/proxy.ts site/proxy.ts
git commit -m "Adiciona o proxy que protege a Área do Professor"
```

---

### Task 8: Rota de confirmação de convite

**Files:**
- Create: `site/src/app/auth/confirm/route.ts`

O e-mail de convite do Supabase Auth (`inviteUserByEmail`, assim como recuperação de
senha e magic link) não usa o fluxo OAuth `code` + `exchangeCodeForSession` — usa
`token_hash` + `type` + `verifyOtp`, confirmado contra a doc atual do Supabase para
`type=invite` especificamente. Esta rota fica **fora** de `/area-do-professor/**` de
propósito: precisa rodar sem sessão, então o `matcher` do proxy (Task 7) não a
intercepta.

- [ ] **Step 1: Escrever a rota**

```ts
// site/src/app/auth/confirm/route.ts
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const proximo =
    searchParams.get("next") ?? "/area-do-professor/completar-cadastro";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = proximo;
  redirectTo.search = "";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = "/area-do-professor/login";
  redirectTo.searchParams.set("erro", "convite-invalido");
  return NextResponse.redirect(redirectTo);
}
```

- [ ] **Step 2: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add site/src/app/auth/confirm/route.ts
git commit -m "Adiciona a rota que confirma o link de convite do Supabase Auth"
```

---

### Task 9: Layout da área e ação de sair

**Files:**
- Create: `site/src/app/area-do-professor/layout.tsx`
- Create: `site/src/app/area-do-professor/actions.ts`

- [ ] **Step 1: Escrever a ação de sair**

```ts
// site/src/app/area-do-professor/actions.ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/area-do-professor/login");
}
```

- [ ] **Step 2: Escrever o layout**

Reaproveita os tokens de cor do site (`navy`, `sand`, `lime`, `font-display`) já
definidos em `site/src/app/globals.css`. Quando `perfil` é `null` (páginas de
login/completar-cadastro/acesso-desativado), o cabeçalho não aparece.

```tsx
// site/src/app/area-do-professor/layout.tsx
import type { Metadata } from "next";
import { obterPerfilAtual } from "@/lib/supabase/perfil";
import { sair } from "./actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function LayoutAreaDoProfessor({
  children,
}: {
  children: React.ReactNode;
}) {
  const perfil = await obterPerfilAtual();

  return (
    <div className="min-h-screen bg-navy-900 text-sand">
      {perfil ? (
        <header className="flex items-center justify-between border-b border-sand/10 px-4 py-3 sm:px-8">
          <span className="font-display text-sm uppercase tracking-wide text-sand/70">
            Área do Professor
          </span>
          <div className="flex items-center gap-4 text-sm">
            <span>{perfil.nome}</span>
            {perfil.role === "lider" ? (
              <a
                href="/area-do-professor/admin"
                className="text-lime-ct hover:underline"
              >
                Painel
              </a>
            ) : null}
            <form action={sair}>
              <button type="submit" className="text-sand/70 hover:text-sand">
                Sair
              </button>
            </form>
          </div>
        </header>
      ) : null}
      <main className="px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build
```

Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add site/src/app/area-do-professor/layout.tsx site/src/app/area-do-professor/actions.ts
git commit -m "Adiciona o layout e a ação de sair da Área do Professor"
```

---

### Task 10: Login

**Files:**
- Create: `site/src/app/area-do-professor/login/actions.ts`
- Create: `site/src/app/area-do-professor/login/FormularioLogin.tsx`
- Create: `site/src/app/area-do-professor/login/page.tsx`

- [ ] **Step 1: Escrever a Server Action**

```ts
// site/src/app/area-do-professor/login/actions.ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EstadoLogin = { erro: string } | null;

export async function entrar(
  _estadoAnterior: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("senha") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { erro: "E-mail ou senha incorretos." };
  }

  redirect("/area-do-professor");
}
```

- [ ] **Step 2: Escrever o formulário (Client Component, precisa de `useActionState`)**

```tsx
// site/src/app/area-do-professor/login/FormularioLogin.tsx
"use client";

import { useActionState } from "react";
import { entrar, type EstadoLogin } from "./actions";

export default function FormularioLogin() {
  const [estado, formAction, pendente] = useActionState<EstadoLogin, FormData>(
    entrar,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        E-mail
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        Senha
        <input
          name="senha"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      {estado?.erro ? (
        <p className="text-sm text-red-400" role="alert">
          {estado.erro}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pendente}
        className="rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright disabled:opacity-60"
      >
        {pendente ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Escrever a página**

```tsx
// site/src/app/area-do-professor/login/page.tsx
import type { Metadata } from "next";
import FormularioLogin from "./FormularioLogin";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function PaginaLogin() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="font-display text-2xl text-sand">Área do Professor</h1>
        <p className="text-sm text-sand/70">
          Entre com o e-mail e a senha que você definiu no convite.
        </p>
      </div>
      <FormularioLogin />
    </div>
  );
}
```

- [ ] **Step 4: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build
```

Expected: sem erros. `npm run dev` e abrir `/area-do-professor/login` deve renderizar
o formulário (o submit ainda falha, sem projeto Supabase — isso é esperado até a
Fase 2).

- [ ] **Step 5: Commit**

```bash
git add site/src/app/area-do-professor/login
git commit -m "Adiciona a tela de login da Área do Professor"
```

---

### Task 11: Completar cadastro (definir senha após convite)

**Files:**
- Create: `site/src/app/area-do-professor/completar-cadastro/actions.ts`
- Create: `site/src/app/area-do-professor/completar-cadastro/FormularioCompletarCadastro.tsx`
- Create: `site/src/app/area-do-professor/completar-cadastro/page.tsx`

Quando o professor chega aqui, a Task 8 já rodou `verifyOtp` e ele já tem uma sessão
válida (cookies já setados) — falta só definir a senha.

- [ ] **Step 1: Escrever a Server Action**

```ts
// site/src/app/area-do-professor/completar-cadastro/actions.ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EstadoCompletarCadastro = { erro: string } | null;

export async function definirSenha(
  _estadoAnterior: EstadoCompletarCadastro,
  formData: FormData
): Promise<EstadoCompletarCadastro> {
  const senha = String(formData.get("senha") ?? "");
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (senha.length < 8) {
    return { erro: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (senha !== confirmacao) {
    return { erro: "As senhas não coincidem." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/area-do-professor/login?erro=convite-invalido");
  }

  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) {
    return {
      erro: "Não deu para salvar a senha. Peça um novo convite ao CT.",
    };
  }

  redirect("/area-do-professor");
}
```

- [ ] **Step 2: Escrever o formulário**

```tsx
// site/src/app/area-do-professor/completar-cadastro/FormularioCompletarCadastro.tsx
"use client";

import { useActionState } from "react";
import {
  definirSenha,
  type EstadoCompletarCadastro,
} from "./actions";

export default function FormularioCompletarCadastro() {
  const [estado, formAction, pendente] = useActionState<
    EstadoCompletarCadastro,
    FormData
  >(definirSenha, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        Nova senha
        <input
          name="senha"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        Confirmar senha
        <input
          name="confirmacao"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      {estado?.erro ? (
        <p className="text-sm text-red-400" role="alert">
          {estado.erro}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pendente}
        className="rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright disabled:opacity-60"
      >
        {pendente ? "Salvando…" : "Salvar e entrar"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Escrever a página**

```tsx
// site/src/app/area-do-professor/completar-cadastro/page.tsx
import type { Metadata } from "next";
import FormularioCompletarCadastro from "./FormularioCompletarCadastro";

export const metadata: Metadata = {
  title: "Completar cadastro",
  robots: { index: false, follow: false },
};

export default function PaginaCompletarCadastro() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="font-display text-2xl text-sand">Bem-vindo(a)!</h1>
        <p className="text-sm text-sand/70">
          Defina uma senha para acessar a Área do Professor.
        </p>
      </div>
      <FormularioCompletarCadastro />
    </div>
  );
}
```

- [ ] **Step 4: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build
```

Expected: sem erros.

- [ ] **Step 5: Commit**

```bash
git add site/src/app/area-do-professor/completar-cadastro
git commit -m "Adiciona a tela de completar cadastro após o convite"
```

---

### Task 12: Acesso desativado

**Files:**
- Create: `site/src/app/area-do-professor/acesso-desativado/page.tsx`

- [ ] **Step 1: Escrever a página**

Reaproveita `site.whatsapp.link()` (já usado em `FormularioContato.tsx`) para o CTA.

```tsx
// site/src/app/area-do-professor/acesso-desativado/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Acesso desativado",
  robots: { index: false, follow: false },
};

export default function PaginaAcessoDesativado() {
  const mensagem =
    "Olá! Meu acesso à Área do Professor está desativado, poderia reativar?";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-2xl text-sand">Acesso desativado</h1>
      <p className="text-sm text-sand/70">
        Seu acesso à Área do Professor foi desativado. Fale com o CT para
        reativar.
      </p>
      <Link
        href={site.whatsapp.link(mensagem)}
        className="mx-auto rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright"
      >
        Falar no WhatsApp
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add site/src/app/area-do-professor/acesso-desativado
git commit -m "Adiciona a tela de acesso desativado"
```

---

### Task 13: Área do professor — lista de materiais

**Files:**
- Create: `site/src/app/area-do-professor/page.tsx`

A query não filtra `publicado = true` explicitamente: a RLS de `materiais` (Fase 2,
Task 20) já garante isso para quem não é líder — o líder vê tudo, o professor só vê
o publicado.

Vídeo entra embutido por `<iframe>`, como o design spec pede ("a página embute via
iframe") — não como um link que abre em outra aba. `paraUrlEmbutida` converte a URL
que o líder colou (uma página normal de "assistir", YouTube ou Vimeo) para a URL de
embed; se não reconhecer o domínio, cai de volta para um link simples em vez de
quebrar.

- [ ] **Step 1: Escrever a página**

```tsx
// site/src/app/area-do-professor/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Material } from "@/types/area-do-professor";

export const metadata: Metadata = {
  title: "Materiais",
  robots: { index: false, follow: false },
};

const ROTULOS_TIPO: Record<Material["tipo"], string> = {
  arquivo: "Arquivo",
  video: "Vídeo",
  link: "Link",
  texto: "Aviso",
};

function paraUrlEmbutida(url: string): string | null {
  try {
    const alvo = new URL(url);
    if (alvo.hostname.includes("youtube.com")) {
      const id = alvo.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (alvo.hostname === "youtu.be") {
      const id = alvo.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (alvo.hostname.includes("vimeo.com")) {
      const id = alvo.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function VideoEmbutido({ url, titulo }: { url: string; titulo: string }) {
  const embed = paraUrlEmbutida(url);

  if (!embed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-sm text-lime-ct hover:underline"
      >
        Assistir vídeo
      </a>
    );
  }

  return (
    <div className="mt-3 aspect-video overflow-hidden rounded-md">
      <iframe
        src={embed}
        title={titulo}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

export default async function PaginaAreaDoProfessor() {
  const supabase = await createClient();
  const { data: materiais } = await supabase
    .from("materiais")
    .select("*")
    .order("criado_em", { ascending: false });

  const lista = (materiais ?? []) as Material[];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-2xl">Materiais da Metodologia</h1>
      {lista.length === 0 ? (
        <p className="text-sand/60">Nenhum material publicado ainda.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {lista.map((material) => (
            <li
              key={material.id}
              className="rounded-lg border border-sand/10 bg-navy-800 p-4"
            >
              <span className="text-xs uppercase tracking-wide text-lime-ct">
                {ROTULOS_TIPO[material.tipo]}
              </span>
              <h2 className="font-display text-lg">{material.titulo}</h2>
              {material.descricao ? (
                <p className="text-sm text-sand/70">{material.descricao}</p>
              ) : null}
              {material.tipo === "arquivo" ? (
                <Link
                  href={`/area-do-professor/materiais/${material.id}/download`}
                  className="mt-2 inline-block text-sm text-lime-ct hover:underline"
                >
                  Baixar arquivo
                </Link>
              ) : null}
              {material.tipo === "video" && material.video_url ? (
                <VideoEmbutido url={material.video_url} titulo={material.titulo} />
              ) : null}
              {material.tipo === "link" && material.link_url ? (
                <a
                  href={material.link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-lime-ct hover:underline"
                >
                  Abrir link
                </a>
              ) : null}
              {material.tipo === "texto" && material.corpo_texto ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-sand/80">
                  {material.corpo_texto}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add site/src/app/area-do-professor/page.tsx
git commit -m "Adiciona a lista de materiais da Área do Professor"
```

---

### Task 14: Download de arquivo (signed URL)

**Files:**
- Create: `site/src/app/area-do-professor/materiais/[id]/download/route.ts`

Nunca expõe um link público direto — cada clique gera uma signed URL de 60s, como
define o design spec. A RLS de `materiais` (Fase 2) já bloqueia um professor de
enxergar a linha de um material não publicado; se `material` vier nulo aqui, é
porque a RLS barrou ou o id não existe — os dois casos voltam para a lista.

- [ ] **Step 1: Escrever a rota**

```ts
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
```

- [ ] **Step 2: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add site/src/app/area-do-professor/materiais
git commit -m "Adiciona o download de material via signed URL"
```

---

### Task 15: Painel do líder — convite e gestão de professores

**Files:**
- Create: `site/src/app/area-do-professor/admin/layout.tsx`
- Create: `site/src/app/area-do-professor/admin/actions.ts`
- Create: `site/src/app/area-do-professor/admin/FormularioConvite.tsx`
- Create: `site/src/app/area-do-professor/admin/page.tsx`

O `proxy.ts` (Task 7) já bloqueia `/area-do-professor/admin/**` para quem não é
líder — este layout é defesa em profundidade, redundante de propósito (se o proxy
tiver um bug de matcher, isto ainda protege). O ponto que realmente importa é dentro
de `convidarProfessor`: a secret key ignora RLS, então `exigirLider()` **tem** que
rodar antes de tocar no `createAdminClient()` (é a checagem que o `memory.md` já
tinha sinalizado como obrigatória).

- [ ] **Step 1: Escrever o layout de defesa em profundidade**

```tsx
// site/src/app/area-do-professor/admin/layout.tsx
import { exigirLider } from "@/lib/supabase/perfil";

export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigirLider();

  return <div className="mx-auto flex max-w-4xl flex-col gap-8">{children}</div>;
}
```

- [ ] **Step 2: Escrever as Server Actions**

```ts
// site/src/app/area-do-professor/admin/actions.ts
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
```

- [ ] **Step 3: Escrever o formulário de convite**

```tsx
// site/src/app/area-do-professor/admin/FormularioConvite.tsx
"use client";

import { useActionState } from "react";
import { convidarProfessor, type EstadoConvite } from "./actions";

export default function FormularioConvite() {
  const [estado, formAction, pendente] = useActionState<
    EstadoConvite,
    FormData
  >(convidarProfessor, null);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <label className="flex flex-1 flex-col gap-1 text-sm text-sand/80">
        Nome
        <input
          name="nome"
          required
          className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      <label className="flex flex-1 flex-col gap-1 text-sm text-sand/80">
        E-mail
        <input
          name="email"
          type="email"
          required
          className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      <button
        type="submit"
        disabled={pendente}
        className="rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright disabled:opacity-60"
      >
        {pendente ? "Convidando…" : "Convidar"}
      </button>
      {estado && "erro" in estado ? (
        <p className="text-sm text-red-400 sm:basis-full" role="alert">
          {estado.erro}
        </p>
      ) : null}
      {estado && "sucesso" in estado ? (
        <p className="text-sm text-lime-ct sm:basis-full">Convite enviado!</p>
      ) : null}
    </form>
  );
}
```

- [ ] **Step 4: Escrever a página**

```tsx
// site/src/app/area-do-professor/admin/page.tsx
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Perfil } from "@/types/area-do-professor";
import FormularioConvite from "./FormularioConvite";
import { alternarStatusProfessor } from "./actions";

export const metadata: Metadata = {
  title: "Painel do CT",
  robots: { index: false, follow: false },
};

export default async function PaginaAdmin() {
  const supabase = await createClient();
  const { data: professores } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "professor")
    .order("criado_em", { ascending: false });

  const lista = (professores ?? []) as Perfil[];

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="font-display text-2xl">Painel do CT</h1>
        <p className="text-sm text-sand/70">
          Convide professores e gerencie o acesso deles.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg">Convidar professor</h2>
        <FormularioConvite />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg">Professores</h2>
        {lista.length === 0 ? (
          <p className="text-sand/60">Nenhum professor convidado ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {lista.map((professor) => (
              <li
                key={professor.id}
                className="flex items-center justify-between rounded-lg border border-sand/10 bg-navy-800 p-4"
              >
                <div>
                  <p>{professor.nome}</p>
                  <p className="text-sm text-sand/60">{professor.email}</p>
                </div>
                <form
                  action={alternarStatusProfessor.bind(
                    null,
                    professor.id,
                    professor.status
                  )}
                >
                  <button
                    type="submit"
                    className={
                      professor.status === "ativo"
                        ? "rounded-md border border-red-400/40 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10"
                        : "rounded-md border border-lime-ct/40 px-3 py-1 text-sm text-lime-ct hover:bg-lime-ct/10"
                    }
                  >
                    {professor.status === "ativo" ? "Revogar" : "Reativar"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <a
        href="/area-do-professor/admin/materiais"
        className="text-lime-ct hover:underline"
      >
        Gerenciar materiais →
      </a>
    </div>
  );
}
```

- [ ] **Step 5: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build
```

Expected: sem erros.

- [ ] **Step 6: Commit**

```bash
git add site/src/app/area-do-professor/admin/layout.tsx site/src/app/area-do-professor/admin/actions.ts site/src/app/area-do-professor/admin/FormularioConvite.tsx site/src/app/area-do-professor/admin/page.tsx
git commit -m "Adiciona o painel do líder: convidar e gerenciar professores"
```

---

### Task 16: Painel do líder — CRUD de materiais

**Files:**
- Create: `site/src/app/area-do-professor/admin/materiais/actions.ts`
- Create: `site/src/app/area-do-professor/admin/materiais/FormularioMaterial.tsx`
- Create: `site/src/app/area-do-professor/admin/materiais/page.tsx`

- [ ] **Step 1: Escrever as Server Actions**

```ts
// site/src/app/area-do-professor/admin/materiais/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { exigirLider } from "@/lib/supabase/perfil";
import type { TipoMaterial } from "@/types/area-do-professor";

export type EstadoMaterial = { erro: string } | { sucesso: true } | null;

// 20MB é o teto definido no design spec; o next.config.ts (Task 1) já libera
// o corpo da Server Action até 21MB para caber a sobrecarga do multipart.
const TAMANHO_MAXIMO_ARQUIVO = 20 * 1024 * 1024;
const EXTENSOES_PERMITIDAS = ["pdf", "docx", "xlsx", "png", "jpg", "jpeg"];

export async function criarMaterial(
  _estadoAnterior: EstadoMaterial,
  formData: FormData
): Promise<EstadoMaterial> {
  await exigirLider();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const tipo = String(formData.get("tipo") ?? "") as TipoMaterial;

  if (!titulo || !tipo) {
    return { erro: "Preencha ao menos título e tipo." };
  }

  const supabase = await createClient();
  let arquivoPath: string | null = null;
  let videoUrl: string | null = null;
  let linkUrl: string | null = null;
  let corpoTexto: string | null = null;

  if (tipo === "arquivo") {
    const arquivo = formData.get("arquivo");
    if (!(arquivo instanceof File) || arquivo.size === 0) {
      return { erro: "Selecione um arquivo." };
    }
    if (arquivo.size > TAMANHO_MAXIMO_ARQUIVO) {
      return { erro: "O arquivo passa de 20MB." };
    }
    const extensao = arquivo.name.split(".").pop()?.toLowerCase() ?? "";
    if (!EXTENSOES_PERMITIDAS.includes(extensao)) {
      return { erro: "Formato não aceito. Envie PDF, DOCX, XLSX ou imagem." };
    }

    arquivoPath = `${randomUUID()}.${extensao}`;
    const { error: erroUpload } = await supabase.storage
      .from("materiais")
      .upload(arquivoPath, arquivo);
    if (erroUpload) {
      return { erro: `Não deu para enviar o arquivo: ${erroUpload.message}` };
    }
  } else if (tipo === "video") {
    videoUrl = String(formData.get("video_url") ?? "").trim();
    if (!videoUrl) return { erro: "Cole o link do vídeo." };
  } else if (tipo === "link") {
    linkUrl = String(formData.get("link_url") ?? "").trim();
    if (!linkUrl) return { erro: "Cole o link." };
  } else if (tipo === "texto") {
    corpoTexto = String(formData.get("corpo_texto") ?? "").trim();
    if (!corpoTexto) return { erro: "Escreva o texto do aviso." };
  }

  const { error } = await supabase.from("materiais").insert({
    titulo,
    descricao,
    tipo,
    arquivo_path: arquivoPath,
    video_url: videoUrl,
    link_url: linkUrl,
    corpo_texto: corpoTexto,
    publicado: false,
  });

  if (error) {
    return { erro: `Não deu para salvar: ${error.message}` };
  }

  revalidatePath("/area-do-professor/admin/materiais");
  return { sucesso: true };
}

export async function alternarPublicado(
  materialId: string,
  publicadoAtual: boolean
) {
  await exigirLider();
  const supabase = await createClient();
  await supabase
    .from("materiais")
    .update({ publicado: !publicadoAtual })
    .eq("id", materialId);
  revalidatePath("/area-do-professor/admin/materiais");
  revalidatePath("/area-do-professor");
}

export async function excluirMaterial(
  materialId: string,
  arquivoPath: string | null
) {
  await exigirLider();
  const supabase = await createClient();

  if (arquivoPath) {
    await supabase.storage.from("materiais").remove([arquivoPath]);
  }
  await supabase.from("materiais").delete().eq("id", materialId);

  revalidatePath("/area-do-professor/admin/materiais");
  revalidatePath("/area-do-professor");
}
```

- [ ] **Step 2: Escrever o formulário de criação**

```tsx
// site/src/app/area-do-professor/admin/materiais/FormularioMaterial.tsx
"use client";

import { useActionState, useState } from "react";
import { criarMaterial, type EstadoMaterial } from "./actions";
import type { TipoMaterial } from "@/types/area-do-professor";

const TIPOS: { valor: TipoMaterial; rotulo: string }[] = [
  { valor: "arquivo", rotulo: "Arquivo" },
  { valor: "video", rotulo: "Vídeo" },
  { valor: "link", rotulo: "Link" },
  { valor: "texto", rotulo: "Aviso em texto" },
];

export default function FormularioMaterial() {
  const [estado, formAction, pendente] = useActionState<
    EstadoMaterial,
    FormData
  >(criarMaterial, null);
  const [tipo, setTipo] = useState<TipoMaterial>("arquivo");

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-lg border border-sand/10 bg-navy-800 p-4"
    >
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        Título
        <input
          name="titulo"
          required
          className="rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        Descrição (opcional)
        <input
          name="descricao"
          className="rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        Tipo
        <select
          name="tipo"
          value={tipo}
          onChange={(evento) => setTipo(evento.target.value as TipoMaterial)}
          className="rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        >
          {TIPOS.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </label>

      {tipo === "arquivo" ? (
        <label className="flex flex-col gap-1 text-sm text-sand/80">
          Arquivo (PDF, DOCX, XLSX ou imagem, até 20MB)
          <input name="arquivo" type="file" required className="text-sand" />
        </label>
      ) : null}
      {tipo === "video" ? (
        <label className="flex flex-col gap-1 text-sm text-sand/80">
          Link do vídeo (YouTube/Vimeo não-listado)
          <input
            name="video_url"
            type="url"
            required
            className="rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sand outline-none focus:border-lime-ct"
          />
        </label>
      ) : null}
      {tipo === "link" ? (
        <label className="flex flex-col gap-1 text-sm text-sand/80">
          Link
          <input
            name="link_url"
            type="url"
            required
            className="rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sand outline-none focus:border-lime-ct"
          />
        </label>
      ) : null}
      {tipo === "texto" ? (
        <label className="flex flex-col gap-1 text-sm text-sand/80">
          Texto do aviso
          <textarea
            name="corpo_texto"
            required
            rows={4}
            className="rounded-md border border-sand/20 bg-navy-900 px-3 py-2 text-sand outline-none focus:border-lime-ct"
          />
        </label>
      ) : null}

      {estado && "erro" in estado ? (
        <p className="text-sm text-red-400" role="alert">
          {estado.erro}
        </p>
      ) : null}
      {estado && "sucesso" in estado ? (
        <p className="text-sm text-lime-ct">
          Material criado como rascunho — publique quando quiser.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pendente}
        className="self-start rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright disabled:opacity-60"
      >
        {pendente ? "Salvando…" : "Criar material"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Escrever a página**

```tsx
// site/src/app/area-do-professor/admin/materiais/page.tsx
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Material } from "@/types/area-do-professor";
import FormularioMaterial from "./FormularioMaterial";
import { alternarPublicado, excluirMaterial } from "./actions";

export const metadata: Metadata = {
  title: "Materiais — Painel do CT",
  robots: { index: false, follow: false },
};

export default async function PaginaAdminMateriais() {
  const supabase = await createClient();
  const { data: materiais } = await supabase
    .from("materiais")
    .select("*")
    .order("criado_em", { ascending: false });

  const lista = (materiais ?? []) as Material[];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl">Materiais</h1>
        <a
          href="/area-do-professor/admin"
          className="text-sm text-sand/60 hover:underline"
        >
          ← Voltar ao painel
        </a>
      </div>

      <FormularioMaterial />

      <ul className="flex flex-col gap-2">
        {lista.map((material) => (
          <li
            key={material.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-sand/10 bg-navy-800 p-4"
          >
            <div>
              <p className="font-medium">{material.titulo}</p>
              <p className="text-sm text-sand/60">
                {material.tipo} · {material.publicado ? "Publicado" : "Rascunho"}
              </p>
            </div>
            <div className="flex gap-2">
              <form
                action={alternarPublicado.bind(
                  null,
                  material.id,
                  material.publicado
                )}
              >
                <button
                  type="submit"
                  className="rounded-md border border-lime-ct/40 px-3 py-1 text-sm text-lime-ct hover:bg-lime-ct/10"
                >
                  {material.publicado ? "Despublicar" : "Publicar"}
                </button>
              </form>
              <form
                action={excluirMaterial.bind(
                  null,
                  material.id,
                  material.arquivo_path
                )}
              >
                <button
                  type="submit"
                  className="rounded-md border border-red-400/40 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10"
                >
                  Excluir
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build && npm run lint
```

Expected: sem erros nos três comandos.

- [ ] **Step 5: Commit**

```bash
git add site/src/app/area-do-professor/admin/materiais
git commit -m "Adiciona o CRUD de materiais do painel do líder"
```

---

### Task 17: Registrar a Fase 1 no changelog e na memória

**Files:**
- Modify: `changelog.md`
- Modify: `memory.md`

Regra do `CLAUDE.md`: toda alteração precisa de entrada no changelog.

- [ ] **Step 1: Adicionar entrada em `changelog.md`, seção `## [Não publicado]` → `### Adicionado`**

```md
- 2026-09-16 — Área do Professor, Fase 1 (código Next.js completo, sem projeto Supabase ainda): login, convite/completar cadastro via link do Supabase Auth, `proxy.ts` protegendo `/area-do-professor/**` por sessão/status/papel, lista de materiais para o professor, painel do líder com convite/revogação de acesso e CRUD de materiais (arquivo até 20MB, vídeo, link, aviso em texto), download de arquivo por signed URL de 60s. `npm run build` passa sem `.env.local` porque toda página autenticada usa `cookies()`, o que tira a rota da pré-renderização — falta plugar um projeto Supabase real (ver plano `docs/superpowers/plans/2026-09-16-area-do-professor.md`, Fase 2, e o bloqueio em `memory.md`)
```

- [ ] **Step 2: Atualizar a seção "Área do Professor" em `memory.md`**

Substituir o bloco de pendências atual (que só falava do bloqueio) por uma nota de
progresso, mantendo o registro do bloqueio do Supabase intacto:

```md
**Onde parou (2026-09-16):** a Fase 1 (todo o código Next.js — login, convite,
proxy.ts, lista de materiais, painel do líder, CRUD de materiais) está implementada
e commitada, seguindo `docs/superpowers/plans/2026-09-16-area-do-professor.md`.
`npm run build` passa mesmo sem projeto Supabase, porque toda página autenticada usa
`cookies()`. **O que falta é só a Fase 2 desse plano** — criar o projeto Supabase,
rodar as migrations e plugar as credenciais reais — e isso continua bloqueado pelo
mesmo motivo de 2026-09-15: os 2 projetos free da conta/org `projetosFDP` estão
ocupados (`prospect-gold`, `crm-mobiplus`), e o Felipe decidiu usar uma
conta/organização separada para este cliente em vez de pausar os outros dois ou
fazer upgrade — só que essa organização ainda não existe (confirmado de novo em
2026-09-16 via `list_organizations`).

Nota de nomenclatura: o Supabase renomeou `anon key`/`service_role key` para
`publishable key`/`secret key` em projetos novos — o plano já usa os nomes novos
(`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`), não os antigos
citados nas pendências de 2026-09-15 abaixo.
```

- [ ] **Step 3: Commit**

```bash
git add changelog.md memory.md
git commit -m "Registra a conclusão da Fase 1 da Área do Professor no changelog e na memória"
```

---

## Fase 2 — Backend Supabase

**Bloqueado até existir uma organização/projeto Supabase dedicado para o
`ct-guto-bopp`.** Não executar nenhuma destas tasks antes disso — a Task 18 depende
de um `organization_id` que ainda não existe.

### Task 18: Criar o projeto Supabase

- [ ] Confirmar o `organization_id` da organização/conta separada (fora de
      `projetosFDP`) com o Felipe.
- [ ] Rodar `mcp__claude_ai_Supabase__confirm_cost` e depois
      `mcp__claude_ai_Supabase__create_project` com `name: "ct-guto-bopp"`,
      `region: "sa-east-1"`, `organization_id` confirmado.
- [ ] Guardar o `project_id`/`ref` retornado — usado nas próximas tasks.

### Task 19: Extensão e funções de apoio (evitam RLS recursiva)

Uma policy de RLS em `profiles` que consulta a própria `profiles` dentro do `USING`
entra em recursão infinita. O jeito documentado pelo próprio Supabase para checar
"esse usuário é líder?" dentro de uma policy da tabela `profiles` é uma função
`SECURITY DEFINER`: ela roda com o dono da função (que no Supabase tem `BYPASSRLS`),
então a consulta interna não reaciona a mesma policy.

- [ ] **Aplicar via `mcp__claude_ai_Supabase__apply_migration`** (nome sugerido:
      `0001_area_do_professor_funcoes`):

```sql
create extension if not exists pgcrypto;

create or replace function public.is_lider_ativo()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'lider' and status = 'ativo'
  );
$$;

create or replace function public.usuario_ativo()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and status = 'ativo'
  );
$$;
```

### Task 20: Tabelas, RLS e trigger de novo usuário

- [ ] **Aplicar via `mcp__claude_ai_Supabase__apply_migration`** (nome sugerido:
      `0002_area_do_professor_tabelas`):

```sql
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  email text not null,
  role text not null default 'professor' check (role in ('lider', 'professor')),
  status text not null default 'ativo' check (status in ('ativo', 'revogado')),
  criado_em timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "professor vê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "lider vê todos os perfis"
  on public.profiles for select
  using (public.is_lider_ativo());

create policy "lider atualiza qualquer perfil"
  on public.profiles for update
  using (public.is_lider_ativo());

create or replace function public.lidar_com_novo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome, email, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', new.email),
    new.email,
    'professor',
    'ativo'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row
  execute function public.lidar_com_novo_usuario();

create table public.materiais (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  tipo text not null check (tipo in ('arquivo', 'video', 'link', 'texto')),
  arquivo_path text,
  video_url text,
  link_url text,
  corpo_texto text,
  publicado boolean not null default false,
  criado_em timestamptz not null default now()
);

alter table public.materiais enable row level security;

create policy "professor ativo vê materiais publicados"
  on public.materiais for select
  using (publicado = true and public.usuario_ativo());

create policy "lider gerencia todos os materiais"
  on public.materiais for all
  using (public.is_lider_ativo())
  with check (public.is_lider_ativo());

insert into storage.buckets (id, name, public)
values ('materiais', 'materiais', false)
on conflict (id) do nothing;

create policy "usuario ativo baixa arquivos de materiais"
  on storage.objects for select
  using (bucket_id = 'materiais' and public.usuario_ativo());

create policy "lider gerencia arquivos de materiais"
  on storage.objects for all
  using (bucket_id = 'materiais' and public.is_lider_ativo())
  with check (bucket_id = 'materiais' and public.is_lider_ativo());
```

- [ ] Rodar `mcp__claude_ai_Supabase__get_advisors` (tipo `security`) depois de
      aplicar, e resolver qualquer alerta antes de seguir.

### Task 21: Template de e-mail de convite (manual, painel do Supabase)

O Supabase manda o e-mail de convite pelo template "Invite user". Por padrão ele
não aponta para a rota de confirmação da Task 8 — isso é configuração manual, não
tem endpoint na MCP para isso:

- [ ] No painel: **Authentication → Email Templates → Invite user**.
- [ ] Trocar o link do template para:
      `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next={{ .RedirectTo }}`
- [ ] Em **Authentication → URL Configuration**, confirmar que `Site URL` é
      `https://ctgutobopp.com.br` (ou o domínio real, se já definido — ver pendência
      de domínio em `memory.md`) e que essa URL está na lista de `Redirect URLs`.

### Task 22: Variáveis de ambiente reais

- [ ] `mcp__claude_ai_Supabase__get_project_url` → preencher
      `NEXT_PUBLIC_SUPABASE_URL` em `site/.env.local`.
- [ ] `mcp__claude_ai_Supabase__get_publishable_keys` → preencher
      `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- [ ] **Secret key:** o Felipe pega direto em **Project Settings → API** no painel
      do Supabase e cola em `site/.env.local` como `SUPABASE_SECRET_KEY` — nunca
      colada no chat com o agente (regra já registrada em `memory.md`).
- [ ] Repetir as três variáveis nas **Environment Variables** do projeto na Vercel
      (Production **e** Preview), sem marcar nenhuma como "expor no client" além das
      duas que já começam com `NEXT_PUBLIC_`.

### Task 23: Bootstrap do primeiro líder (o Guto)

Problema do ovo e da galinha: o painel de convite (Task 15) só funciona para quem já
é líder, mas o primeiro líder ainda não existe. O painel do Supabase resolve isso
sem precisar de script:

- [ ] No painel: **Authentication → Users → Invite user**, com o e-mail do Guto.
- [ ] O Guto recebe o e-mail, clica, cai em `/auth/confirm` → `/completar-cadastro`,
      define a senha (a trigger da Task 20 já criou a linha em `profiles` com
      `role = 'professor'`).
- [ ] Rodar via `mcp__claude_ai_Supabase__execute_sql`:
      ```sql
      update public.profiles set role = 'lider' where email = '<email-do-guto>';
      ```
- [ ] O Guto faz logout/login (ou só recarrega `/area-do-professor`) e o link
      "Painel" aparece no cabeçalho.

### Task 24: Teste manual ponta a ponta

Segue o roteiro já definido no design spec (`### Testes`):

- [ ] **Convite ponta a ponta:** líder convida um e-mail de teste pelo painel → o
      e-mail chega → o link cai em `/completar-cadastro` → definir senha → cai
      logado em `/area-do-professor`.
- [ ] **RLS:** com a sessão do professor de teste, tentar (via SQL editor,
      simulando `auth.uid()`, ou só checando pela UI) que ele não vê materiais com
      `publicado = false` nem a linha de `profiles` de outro professor.
- [ ] **Upload/download:** líder publica um material tipo arquivo → professor
      consegue baixar (URL assinada funciona) → esperar a URL expirar (60s) e
      confirmar que o link antigo não funciona mais.
- [ ] **Revogação:** líder revoga o professor de teste → ele tenta logar de novo →
      cai em `/acesso-desativado`, não em `/area-do-professor`.
- [ ] **Admin gate:** professor de teste (não-líder) tenta acessar
      `/area-do-professor/admin` diretamente pela URL → é redirecionado para
      `/area-do-professor`.

### Task 25: Registrar a Fase 2 no changelog e limpar a pendência da memória

**Files:**
- Modify: `changelog.md`
- Modify: `memory.md`

- [ ] Adicionar entrada em `changelog.md` descrevendo a criação do projeto, as
      migrations aplicadas e o resultado do teste ponta a ponta.
- [ ] Em `memory.md`, marcar a pendência do bloqueio Supabase como resolvida e
      remover as pendências já cobertas por este plano (manter só o que ainda for
      real — ex.: se sobrar algo do teste manual para revisar).
- [ ] Commit dessas duas edições.
