# Área do Professor — Redesign visual + Trilhas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the professor-facing screens of the Área do Professor to match the
public site's visual language, and add **trilhas** (materials grouped like courses,
with per-professor manual progress), per
`docs/superpowers/specs/2026-09-17-area-do-professor-redesign-trilhas-design.md`.

**Architecture:** The public site's header (`<Cabecalho />`) is already rendered by
the root layout for every route, including `/area-do-professor/**` — no work needed
there. The professor-facing content (the "Materiais" list and a new trilha detail
page) adopts the site's existing `Secao`/`Revela`/`.quadra-linhas` visual system
(new BEM-style CSS classes added to `globals.css`, following the codebase's existing
convention — no CSS modules, no new libraries). The líder's admin screens
(`admin/page.tsx`, `admin/materiais/page.tsx`) stay in the plain Tailwind-utility
style already established in Fase 1 — that wasn't part of the complaint, and mixing
both systems there would cost more than it's worth. New data: `trilhas`,
`trilha_materiais` (N:N — a material can belong to several trilhas), and
`progresso_material` (per-material, not per-trilha, so marking a material "visto"
counts wherever it appears — see design doc for why).

**Tech Stack:** Next.js 16, TypeScript, Tailwind 4 + hand-written CSS
(`globals.css`), `@supabase/ssr`/`@supabase/supabase-js` (already installed).

**Read first:** `site/AGENTS.md` (Next 16 breaking changes), and
`docs/superpowers/specs/2026-09-17-area-do-professor-redesign-trilhas-design.md`
(the approved design this plan implements).

---

## Fase A — Migrations (manual, Supabase MCP can't reach this project)

### Task 1: SQL para trilhas, trilha_materiais e progresso_material

**Files:** none (SQL runs manually in the Supabase SQL Editor — the MCP connector
in this environment only reaches a different Supabase account, see `memory.md`)

- [ ] **Step 1: Entregar o SQL pronto para o Felipe rodar**

```sql
create table public.trilhas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  publicado boolean not null default false,
  criado_em timestamptz not null default now()
);

create table public.trilha_materiais (
  trilha_id uuid not null references public.trilhas(id) on delete cascade,
  material_id uuid not null references public.materiais(id) on delete cascade,
  ordem integer not null default 0,
  primary key (trilha_id, material_id)
);

create table public.progresso_material (
  professor_id uuid not null references auth.users(id) on delete cascade,
  material_id uuid not null references public.materiais(id) on delete cascade,
  concluido_em timestamptz not null default now(),
  primary key (professor_id, material_id)
);

alter table public.trilhas enable row level security;
alter table public.trilha_materiais enable row level security;
alter table public.progresso_material enable row level security;

-- trilhas: líder vê tudo, professor só vê publicado = true
create policy "lider_ve_tudo_trilhas" on public.trilhas
  for select using (public.is_lider_ativo());

create policy "professor_ve_publicado_trilhas" on public.trilhas
  for select using (publicado = true and public.usuario_ativo());

create policy "lider_gerencia_trilhas" on public.trilhas
  for all using (public.is_lider_ativo()) with check (public.is_lider_ativo());

-- trilha_materiais: mesma visibilidade da trilha (join)
create policy "ve_trilha_materiais_se_ve_trilha" on public.trilha_materiais
  for select using (
    exists (
      select 1 from public.trilhas t
      where t.id = trilha_id
        and (public.is_lider_ativo() or (t.publicado = true and public.usuario_ativo()))
    )
  );

create policy "lider_gerencia_trilha_materiais" on public.trilha_materiais
  for all using (public.is_lider_ativo()) with check (public.is_lider_ativo());

-- progresso_material: cada professor só lê/escreve as próprias linhas
create policy "professor_ve_proprio_progresso" on public.progresso_material
  for select using (professor_id = auth.uid());

create policy "professor_grava_proprio_progresso" on public.progresso_material
  for insert with check (professor_id = auth.uid());

create policy "professor_apaga_proprio_progresso" on public.progresso_material
  for delete using (professor_id = auth.uid());
```

Isso reaproveita as funções `is_lider_ativo()` e `usuario_ativo()` já criadas na
Fase 2 original (ver `docs/superpowers/plans/2026-09-16-area-do-professor.md`,
Task 19) — não precisa recriar.

- [ ] **Step 2: Confirmar no painel**

No SQL Editor do projeto `ct-guto-bopp`, rodar o bloco acima. Depois, em
**Table Editor**, confirmar que `trilhas`, `trilha_materiais` e
`progresso_material` aparecem com RLS ativado (ícone de cadeado).

---

## Fase B — Tipos e ação de progresso

### Task 2: Tipos compartilhados

**Files:**
- Modify: `site/src/types/area-do-professor.ts`

- [ ] **Step 1: Adicionar os tipos novos**

```ts
export type Trilha = {
  id: string;
  titulo: string;
  descricao: string | null;
  publicado: boolean;
  criado_em: string;
};

export type TrilhaMaterial = {
  trilha_id: string;
  material_id: string;
  ordem: number;
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
git commit -m "Adiciona os tipos de trilha e trilha_material"
```

---

### Task 3: Ação de marcar/desmarcar material como visto

**Files:**
- Create: `site/src/app/area-do-professor/progresso-actions.ts`

Fica em `area-do-professor/` (não dentro de `admin/`) porque quem chama essa ação é
o **professor**, na tela de materiais e na tela de trilha — não é uma ação de líder.
`revalidatePath("/area-do-professor", "layout")` revalida a lista de materiais **e**
qualquer `trilhas/[id]` aberta, sem precisar saber de qual página veio a chamada.

- [ ] **Step 1: Escrever a ação**

```ts
// site/src/app/area-do-professor/progresso-actions.ts
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
```

- [ ] **Step 2: Verificar**

```bash
cd site && npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add site/src/app/area-do-professor/progresso-actions.ts
git commit -m "Adiciona a ação de marcar/desmarcar material como visto"
```

---

## Fase C — Componentes visuais novos

### Task 4: `CartaoMaterial` (extrai a renderização de material da página atual)

**Files:**
- Create: `site/src/components/area-do-professor/CartaoMaterial.tsx`

Extrai `ROTULOS_TIPO`, `paraUrlEmbutida` e `VideoEmbutido` de
`site/src/app/area-do-professor/page.tsx` (Fase 1, Task 13) para este componente —
serão usados tanto na lista de materiais soltos quanto dentro de uma trilha, então
precisam viver num lugar só (DRY). O botão de "visto" usa o padrão já usado em
`alternarStatusProfessor`/`alternarPublicado` (Fase 1): `<form action={fn.bind(...)}>`
a partir de um Server Component, sem precisar de `"use client"` aqui.

- [ ] **Step 1: Escrever o componente**

```tsx
// site/src/components/area-do-professor/CartaoMaterial.tsx
import Link from "next/link";
import { alternarVisto } from "@/app/area-do-professor/progresso-actions";
import type { Material } from "@/types/area-do-professor";

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
        className="material-cartao__acao"
      >
        Assistir vídeo
      </a>
    );
  }

  return (
    <div className="material-cartao__video">
      <iframe
        src={embed}
        title={titulo}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default function CartaoMaterial({
  material,
  visto,
}: {
  material: Material;
  visto: boolean;
}) {
  return (
    <li className={`material-cartao${visto ? " material-cartao--visto" : ""}`}>
      <span className="material-cartao__tipo">{ROTULOS_TIPO[material.tipo]}</span>
      <h4 className="material-cartao__titulo">{material.titulo}</h4>
      {material.descricao ? (
        <p className="material-cartao__descricao">{material.descricao}</p>
      ) : null}

      {material.tipo === "arquivo" ? (
        <Link
          href={`/area-do-professor/materiais/${material.id}/download`}
          className="material-cartao__acao"
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
          className="material-cartao__acao"
        >
          Abrir link
        </a>
      ) : null}
      {material.tipo === "texto" && material.corpo_texto ? (
        <p className="material-cartao__texto">{material.corpo_texto}</p>
      ) : null}

      <form action={alternarVisto.bind(null, material.id, visto)}>
        <button
          type="submit"
          className="material-cartao__visto"
          aria-pressed={visto}
        >
          {visto ? "✓ Visto" : "Marcar como visto"}
        </button>
      </form>
    </li>
  );
}
```

- [ ] **Step 2: Adicionar o CSS do cartão**

Acrescentar ao final de `site/src/app/globals.css`:

```css
/* ============================================== área do professor: cartões */

.material-cartao {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  background: var(--color-navy-800);
  border: 1px solid color-mix(in oklab, var(--color-sand) 10%, transparent);
  border-radius: 6px;
  transition: border-color 0.25s;
}

.material-cartao--visto {
  border-color: color-mix(in oklab, var(--color-lime-ct) 45%, transparent);
}

.material-cartao__tipo {
  font-family: var(--font-mono-ct);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-lime-ct);
}

.material-cartao__titulo {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-stretch: 110%;
}

.material-cartao__descricao,
.material-cartao__texto {
  font-size: 0.9375rem;
  color: color-mix(in oklab, var(--color-sand) 78%, transparent);
}

.material-cartao__acao {
  font-size: 0.875rem;
  color: var(--color-lime-ct);
  text-decoration: underline;
  text-underline-offset: 3px;
  align-self: flex-start;
}

.material-cartao__video {
  aspect-ratio: 16 / 9;
  border-radius: 4px;
  overflow: hidden;
}

.material-cartao__video iframe {
  width: 100%;
  height: 100%;
}

.material-cartao__visto {
  margin-block-start: 0.25rem;
  align-self: flex-start;
  padding: 0.4375rem 0.875rem;
  font-family: var(--font-mono-ct);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid color-mix(in oklab, var(--color-sand) 30%, transparent);
  border-radius: 999px;
  background: none;
  color: color-mix(in oklab, var(--color-sand) 85%, transparent);
  cursor: pointer;
  transition: border-color 0.25s, color 0.25s, background-color 0.25s;
}

.material-cartao__visto:hover {
  border-color: var(--color-lime-ct);
  color: var(--color-lime-ct);
}

.material-cartao--visto .material-cartao__visto {
  background: color-mix(in oklab, var(--color-lime-ct) 16%, transparent);
  border-color: var(--color-lime-ct);
  color: var(--color-lime-ct);
}

.materiais-tipo {
  margin-block-start: 2.5rem;
}

.materiais-tipo:first-child {
  margin-block-start: 0;
}

.materiais-tipo__titulo {
  font-family: var(--font-mono-ct);
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--color-sand) 60%, transparent);
  margin-block-end: 1rem;
}

.materiais-tipo-grade {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
}
```

- [ ] **Step 3: Verificar**

```bash
cd site && npx tsc --noEmit
```

Expected: sem erros (o import de `page.tsx` ainda não muda nesta task — isso é a
Task 7).

- [ ] **Step 4: Commit**

```bash
git add site/src/components/area-do-professor/CartaoMaterial.tsx site/src/app/globals.css
git commit -m "Adiciona o componente CartaoMaterial, extraído da página de materiais"
```

---

### Task 5: `CartaoTrilha`

**Files:**
- Create: `site/src/components/area-do-professor/CartaoTrilha.tsx`

Nome deliberadamente **não** é `Trilha` — esse nome já é do componente de
breadcrumb em `CapaPagina.tsx` (trilha de navegação, "Início › Professores"), sem
nenhuma relação com trilha-curso. Ver nota do design doc.

- [ ] **Step 1: Escrever o componente**

```tsx
// site/src/components/area-do-professor/CartaoTrilha.tsx
import Link from "next/link";
import type { Trilha } from "@/types/area-do-professor";

export default function CartaoTrilha({
  trilha,
  total,
  concluidos,
}: {
  trilha: Trilha;
  total: number;
  concluidos: number;
}) {
  const percentual = total === 0 ? 0 : Math.round((concluidos / total) * 100);

  return (
    <Link href={`/area-do-professor/trilhas/${trilha.id}`} className="trilha-cartao">
      <span className="trilha-cartao__rotulo">Trilha</span>
      <h3 className="trilha-cartao__titulo">{trilha.titulo}</h3>
      {trilha.descricao ? (
        <p className="trilha-cartao__descricao">{trilha.descricao}</p>
      ) : null}
      <div className="trilha-cartao__progresso">
        <div className="trilha-cartao__progresso-trilho">
          <div
            className="trilha-cartao__progresso-barra"
            style={{ width: `${percentual}%` }}
          />
        </div>
        <span className="trilha-cartao__progresso-texto">
          {concluidos} de {total} concluídos
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Adicionar o CSS**

Acrescentar ao final de `site/src/app/globals.css`:

```css
.trilhas-grade {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
}

.trilha-cartao {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: linear-gradient(
    145deg,
    var(--color-navy-700),
    var(--color-navy-900)
  );
  border: 1px solid color-mix(in oklab, var(--color-lime-ct) 22%, transparent);
  transition: border-color 0.25s, transform 0.25s;
}

.trilha-cartao:hover,
.trilha-cartao:focus-visible {
  border-color: var(--color-lime-ct);
  transform: translateY(-2px);
}

.trilha-cartao__rotulo {
  font-family: var(--font-mono-ct);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-lime-ct);
}

.trilha-cartao__titulo {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-stretch: 112%;
}

.trilha-cartao__descricao {
  font-size: 0.9375rem;
  color: color-mix(in oklab, var(--color-sand) 78%, transparent);
}

.trilha-cartao__progresso {
  margin-block-start: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.trilha-cartao__progresso-trilho {
  block-size: 4px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--color-sand) 14%, transparent);
  overflow: hidden;
}

.trilha-cartao__progresso-barra {
  block-size: 100%;
  background: var(--color-lime-ct);
  border-radius: 999px;
  transition: width 0.3s;
}

.trilha-cartao__progresso-texto {
  font-family: var(--font-mono-ct);
  font-size: 0.75rem;
  color: color-mix(in oklab, var(--color-sand) 65%, transparent);
}
```

- [ ] **Step 3: Verificar**

```bash
cd site && npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add site/src/components/area-do-professor/CartaoTrilha.tsx site/src/app/globals.css
git commit -m "Adiciona o componente CartaoTrilha"
```

---

## Fase D — Sub-navegação

### Task 6: Componente de abas + integração no layout

**Files:**
- Create: `site/src/components/area-do-professor/SubNav.tsx`
- Modify: `site/src/app/area-do-professor/layout.tsx`

`layout.tsx` já busca `perfil` via `obterPerfilAtual()` (Fase 1, Task 9) — o
`SubNav` recebe `perfil.role` dali direto, sem buscar de novo. Precisa saber a rota
atual para marcar a aba ativa, então é Client Component (mesmo padrão de
`Cabecalho.tsx`, que já usa `usePathname`).

- [ ] **Step 1: Escrever o SubNav**

```tsx
// site/src/components/area-do-professor/SubNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PapelUsuario } from "@/types/area-do-professor";

const ABAS = [
  { href: "/area-do-professor", rotulo: "Materiais", soLider: false },
  { href: "/area-do-professor/admin", rotulo: "Professores", soLider: true },
  {
    href: "/area-do-professor/admin/materiais",
    rotulo: "Gerenciar Materiais",
    soLider: true,
  },
] as const;

export default function SubNav({ role }: { role: PapelUsuario }) {
  const caminho = usePathname();

  const abas = ABAS.filter((aba) => !aba.soLider || role === "lider");

  const ativa = (href: string) =>
    href === "/area-do-professor"
      ? caminho === href
      : caminho === href || caminho.startsWith(`${href}/`);

  return (
    <nav className="subnav-professor" aria-label="Navegação da Área do Professor">
      {abas.map((aba) => (
        <Link
          key={aba.href}
          href={aba.href}
          aria-current={ativa(aba.href) ? "page" : undefined}
        >
          {aba.rotulo}
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Ler o layout atual antes de editar**

```bash
cd site && cat src/app/area-do-professor/layout.tsx
```

- [ ] **Step 3: Integrar o SubNav no cabeçalho da área**

Editar `site/src/app/area-do-professor/layout.tsx`: importar `SubNav` e
renderizá-lo dentro do bloco `{perfil ? (...) : null}`, logo abaixo do `<header>`
existente (não dentro dele, para poder ocupar a largura toda numa linha própria):

```tsx
import SubNav from "@/components/area-do-professor/SubNav";
```

E, logo depois do `</header>` que já existe (mantendo tudo o que já está lá dentro
do `<header>` — nome, link Painel, Sair — sem alteração):

```tsx
{perfil ? <SubNav role={perfil.role} /> : null}
```

- [ ] **Step 4: Adicionar o CSS do SubNav**

Acrescentar ao final de `site/src/app/globals.css`:

```css
.subnav-professor {
  display: flex;
  gap: 1.5rem;
  padding-inline: 1rem;
  padding-block: 0.75rem;
  overflow-x: auto;
  border-block-end: 1px solid color-mix(in oklab, var(--color-sand) 10%, transparent);
}

@media (min-width: 40rem) {
  .subnav-professor {
    padding-inline: 2rem;
  }
}

.subnav-professor a {
  flex: none;
  font-family: var(--font-mono-ct);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--color-sand) 65%, transparent);
  padding-block: 0.25rem;
  position: relative;
  transition: color 0.25s;
}

.subnav-professor a::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  inset-block-end: -0.75rem;
  block-size: 2px;
  background: var(--color-lime-ct);
  transform: scaleX(0);
  transition: transform 0.25s;
}

.subnav-professor a:hover {
  color: var(--color-sand);
}

.subnav-professor a[aria-current="page"] {
  color: var(--color-lime-ct);
}

.subnav-professor a[aria-current="page"]::after {
  transform: scaleX(1);
}
```

- [ ] **Step 5: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build
```

Expected: sem erros. Rotas de `/area-do-professor/**` continuam `ƒ` (dinâmicas) no
resumo do build.

- [ ] **Step 6: Commit**

```bash
git add site/src/components/area-do-professor/SubNav.tsx site/src/app/area-do-professor/layout.tsx site/src/app/globals.css
git commit -m "Adiciona a sub-navegação por abas da Área do Professor"
```

---

## Fase E — Tela "Materiais" redesenhada

### Task 7: Reescrever a página de materiais

**Files:**
- Modify: `site/src/app/area-do-professor/page.tsx`

Substitui o conteúdo inteiro do arquivo (Fase 1, Task 13) — a renderização de
material virou `CartaoMaterial` (Task 4). Busca trilhas + vínculos + progresso do
professor em paralelo; materiais "soltos" são os que não aparecem em nenhuma linha
de `trilha_materiais`. RLS já filtra `publicado` tanto em `trilhas` quanto em
`materiais`, então a query não precisa repetir esse filtro.

- [ ] **Step 1: Reescrever o arquivo inteiro**

```tsx
// site/src/app/area-do-professor/page.tsx
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Secao from "@/components/Secao";
import CartaoTrilha from "@/components/area-do-professor/CartaoTrilha";
import CartaoMaterial from "@/components/area-do-professor/CartaoMaterial";
import type {
  Material,
  Trilha,
  TrilhaMaterial,
} from "@/types/area-do-professor";

export const metadata: Metadata = {
  title: "Materiais",
  robots: { index: false, follow: false },
};

const ROTULOS_TIPO: Record<Material["tipo"], string> = {
  arquivo: "Arquivos",
  video: "Vídeos",
  link: "Links",
  texto: "Avisos",
};

const ORDEM_TIPOS = ["arquivo", "video", "link", "texto"] as const;

export default async function PaginaAreaDoProfessor() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: trilhas },
    { data: trilhaMateriais },
    { data: materiais },
    { data: progresso },
  ] = await Promise.all([
    supabase.from("trilhas").select("*").order("criado_em", { ascending: false }),
    supabase.from("trilha_materiais").select("trilha_id, material_id, ordem"),
    supabase.from("materiais").select("*").order("criado_em", { ascending: false }),
    user
      ? supabase
          .from("progresso_material")
          .select("material_id")
          .eq("professor_id", user.id)
      : Promise.resolve({ data: [] as { material_id: string }[] }),
  ]);

  const listaTrilhas = (trilhas ?? []) as Trilha[];
  const listaTrilhaMateriais = (trilhaMateriais ?? []) as TrilhaMaterial[];
  const listaMateriais = (materiais ?? []) as Material[];
  const vistos = new Set((progresso ?? []).map((linha) => linha.material_id));

  const idsEmTrilha = new Set(listaTrilhaMateriais.map((linha) => linha.material_id));
  const materiaisSoltos = listaMateriais.filter(
    (material) => !idsEmTrilha.has(material.id)
  );

  const numeroSoltos = listaTrilhas.length > 0 ? "02" : "01";

  return (
    <>
      {listaTrilhas.length > 0 ? (
        <Secao
          numero="01"
          rotulo="Trilhas"
          titulo="Trilhas da Metodologia"
          intro="Sequências de materiais organizadas pelo CT — acompanhe seu progresso em cada uma."
        >
          <ul className="trilhas-grade">
            {listaTrilhas.map((trilha) => {
              const materiaisDaTrilha = listaTrilhaMateriais.filter(
                (linha) => linha.trilha_id === trilha.id
              );
              const concluidos = materiaisDaTrilha.filter((linha) =>
                vistos.has(linha.material_id)
              ).length;
              return (
                <li key={trilha.id}>
                  <CartaoTrilha
                    trilha={trilha}
                    total={materiaisDaTrilha.length}
                    concluidos={concluidos}
                  />
                </li>
              );
            })}
          </ul>
        </Secao>
      ) : null}

      <Secao
        numero={numeroSoltos}
        rotulo="Materiais"
        titulo="Materiais soltos"
        intro="Conteúdos avulsos, fora de qualquer trilha."
      >
        {materiaisSoltos.length === 0 ? (
          <p className="text-sand/60">Nenhum material publicado ainda.</p>
        ) : (
          ORDEM_TIPOS.map((tipo) => {
            const doTipo = materiaisSoltos.filter(
              (material) => material.tipo === tipo
            );
            if (doTipo.length === 0) return null;
            return (
              <div key={tipo} className="materiais-tipo">
                <h3 className="materiais-tipo__titulo">{ROTULOS_TIPO[tipo]}</h3>
                <ul className="materiais-tipo-grade">
                  {doTipo.map((material) => (
                    <CartaoMaterial
                      key={material.id}
                      material={material}
                      visto={vistos.has(material.id)}
                    />
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </Secao>
    </>
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
git commit -m "Redesenha a tela de materiais: trilhas em destaque + soltos por tipo"
```

---

## Fase F — Detalhe de uma trilha

### Task 8: Página de trilha (professor)

**Files:**
- Create: `site/src/app/area-do-professor/trilhas/[id]/page.tsx`

Não reaproveita o componente `Trilha` (breadcrumb) de `CapaPagina.tsx` de
propósito: aquele componente sempre começa com um link "Início" para a home
pública (`/`), o que não faz sentido dentro de uma área logada — um "← Voltar para
Materiais" simples resolve sem o link deslocado. Se `trilha` vier nulo (RLS barrando
uma trilha não publicada, ou id inexistente), volta para `/area-do-professor` —
mesmo padrão de erro silencioso já usado no download de material (Fase 1, Task 14).

- [ ] **Step 1: Escrever a página**

```tsx
// site/src/app/area-do-professor/trilhas/[id]/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CartaoMaterial from "@/components/area-do-professor/CartaoMaterial";
import type { Material, Trilha, TrilhaMaterial } from "@/types/area-do-professor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("trilhas")
    .select("titulo")
    .eq("id", id)
    .single();

  return {
    title: data?.titulo ?? "Trilha",
    robots: { index: false, follow: false },
  };
}

export default async function PaginaTrilha({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: trilha } = await supabase
    .from("trilhas")
    .select("*")
    .eq("id", id)
    .single();

  if (!trilha) {
    redirect("/area-do-professor");
  }

  const [{ data: trilhaMateriais }, { data: progresso }] = await Promise.all([
    supabase
      .from("trilha_materiais")
      .select("trilha_id, material_id, ordem, materiais(*)")
      .eq("trilha_id", id)
      .order("ordem", { ascending: true }),
    user
      ? supabase
          .from("progresso_material")
          .select("material_id")
          .eq("professor_id", user.id)
      : Promise.resolve({ data: [] as { material_id: string }[] }),
  ]);

  const vistos = new Set((progresso ?? []).map((linha) => linha.material_id));

  type LinhaComMaterial = TrilhaMaterial & { materiais: Material | null };
  const materiaisOrdenados = ((trilhaMateriais ?? []) as LinhaComMaterial[])
    .map((linha) => linha.materiais)
    .filter((material): material is Material => material !== null);

  return (
    <div className="trilha-detalhe">
      <Link href="/area-do-professor" className="trilha-detalhe__voltar">
        ← Voltar para Materiais
      </Link>
      <h1 className="display trilha-detalhe__titulo">{(trilha as Trilha).titulo}</h1>
      {(trilha as Trilha).descricao ? (
        <p className="trilha-detalhe__descricao">{(trilha as Trilha).descricao}</p>
      ) : null}

      {materiaisOrdenados.length === 0 ? (
        <p className="text-sand/60">Essa trilha ainda não tem materiais.</p>
      ) : (
        <ul className="materiais-tipo-grade trilha-detalhe__grade">
          {materiaisOrdenados.map((material) => (
            <CartaoMaterial
              key={material.id}
              material={material}
              visto={vistos.has(material.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Adicionar o CSS da página de trilha**

Acrescentar ao final de `site/src/app/globals.css`:

```css
.trilha-detalhe {
  padding-inline: 1rem;
  padding-block: 2.5rem;
  max-inline-size: var(--shell);
  margin-inline: auto;
}

@media (min-width: 40rem) {
  .trilha-detalhe {
    padding-inline: 2rem;
  }
}

.trilha-detalhe__voltar {
  display: inline-block;
  font-family: var(--font-mono-ct);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--color-sand) 65%, transparent);
  margin-block-end: 1.5rem;
}

.trilha-detalhe__voltar:hover {
  color: var(--color-lime-ct);
}

.trilha-detalhe__titulo {
  font-size: clamp(1.9rem, 4.4vw, 3rem);
}

.trilha-detalhe__descricao {
  margin-block-start: 0.5rem;
  max-inline-size: 60ch;
  color: color-mix(in oklab, var(--color-sand) 78%, transparent);
}

.trilha-detalhe__grade {
  margin-block-start: 2rem;
}
```

- [ ] **Step 3: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build
```

Expected: sem erros. `/area-do-professor/trilhas/[id]` aparece como rota `ƒ` no
resumo do build.

- [ ] **Step 4: Commit**

```bash
git add site/src/app/area-do-professor/trilhas site/src/app/globals.css
git commit -m "Adiciona a página de detalhe de uma trilha"
```

---

## Fase G — Painel do líder: CRUD de trilhas

### Task 9: Server Actions de trilha

**Files:**
- Create: `site/src/app/area-do-professor/admin/trilhas/actions.ts`

Mesmo padrão de `admin/materiais/actions.ts` (Fase 1, Task 16): toda ação chama
`exigirLider()` primeiro, usa o cliente normal (`createClient()`, respeita RLS — não
precisa do cliente admin, porque líder já tem policy de `for all` em `trilhas` e
`trilha_materiais`).

- [ ] **Step 1: Escrever as ações**

```ts
// site/src/app/area-do-professor/admin/trilhas/actions.ts
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
  const ordem = Number(formData.get("ordem") ?? 0);
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
```

- [ ] **Step 2: Verificar**

```bash
cd site && npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add site/src/app/area-do-professor/admin/trilhas/actions.ts
git commit -m "Adiciona as Server Actions de CRUD de trilhas"
```

---

### Task 10: Lista + criação de trilhas (líder)

**Files:**
- Create: `site/src/app/area-do-professor/admin/trilhas/FormularioTrilha.tsx`
- Create: `site/src/app/area-do-professor/admin/trilhas/page.tsx`
- Modify: `site/src/app/area-do-professor/admin/materiais/page.tsx`

Mesmo estilo visual (Tailwind puro) das outras telas de líder — Fase 1, Task 15/16
— sem introduzir o sistema BEM aqui, para não misturar dois sistemas visuais na
mesma tela administrativa.

- [ ] **Step 1: Escrever o formulário**

```tsx
// site/src/app/area-do-professor/admin/trilhas/FormularioTrilha.tsx
"use client";

import { useActionState } from "react";
import { criarTrilha, type EstadoTrilha } from "./actions";

export default function FormularioTrilha() {
  const [estado, formAction, pendente] = useActionState<EstadoTrilha, FormData>(
    criarTrilha,
    null
  );

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
          className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-sand/80">
        Descrição
        <textarea
          name="descricao"
          rows={2}
          className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
        />
      </label>
      {estado && "erro" in estado ? (
        <p className="text-sm text-red-400" role="alert">
          {estado.erro}
        </p>
      ) : null}
      {estado && "sucesso" in estado ? (
        <p className="text-sm text-lime-ct">Trilha criada!</p>
      ) : null}
      <button
        type="submit"
        disabled={pendente}
        className="self-start rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright disabled:opacity-60"
      >
        {pendente ? "Criando…" : "Criar trilha"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Escrever a página**

```tsx
// site/src/app/area-do-professor/admin/trilhas/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Trilha } from "@/types/area-do-professor";
import FormularioTrilha from "./FormularioTrilha";
import { alternarPublicadoTrilha, excluirTrilha } from "./actions";

export const metadata: Metadata = {
  title: "Trilhas",
  robots: { index: false, follow: false },
};

export default async function PaginaAdminTrilhas() {
  const supabase = await createClient();
  const { data: trilhas } = await supabase
    .from("trilhas")
    .select("*")
    .order("criado_em", { ascending: false });

  const lista = (trilhas ?? []) as Trilha[];

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="font-display text-2xl">Trilhas</h1>
        <p className="text-sm text-sand/70">
          Agrupe materiais em sequências, tipo curso.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg">Nova trilha</h2>
        <FormularioTrilha />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg">Trilhas existentes</h2>
        {lista.length === 0 ? (
          <p className="text-sand/60">Nenhuma trilha criada ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {lista.map((trilha) => (
              <li
                key={trilha.id}
                className="flex items-center justify-between rounded-lg border border-sand/10 bg-navy-800 p-4"
              >
                <div>
                  <Link
                    href={`/area-do-professor/admin/trilhas/${trilha.id}`}
                    className="text-lime-ct hover:underline"
                  >
                    {trilha.titulo}
                  </Link>
                  <p className="text-sm text-sand/60">
                    {trilha.publicado ? "Publicada" : "Rascunho"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form
                    action={alternarPublicadoTrilha.bind(
                      null,
                      trilha.id,
                      trilha.publicado
                    )}
                  >
                    <button
                      type="submit"
                      className="rounded-md border border-lime-ct/40 px-3 py-1 text-sm text-lime-ct hover:bg-lime-ct/10"
                    >
                      {trilha.publicado ? "Despublicar" : "Publicar"}
                    </button>
                  </form>
                  <form action={excluirTrilha.bind(null, trilha.id)}>
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
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Adicionar o link para "Gerenciar trilhas" no cabeçalho da página**

`site/src/app/area-do-professor/admin/materiais/page.tsx` hoje abre com este bloco
(confirmado lendo o arquivo — usa `<a href>`, não `<Link>`, para o "← Voltar ao
painel"):

```tsx
      <div>
        <h1 className="font-display text-2xl">Materiais</h1>
        <a
          href="/area-do-professor/admin"
          className="text-sm text-sand/60 hover:underline"
        >
          ← Voltar ao painel
        </a>
      </div>
```

Substituir por (acrescenta o link de trilhas na mesma linha, mesmo padrão de tag):

```tsx
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Materiais</h1>
          <a
            href="/area-do-professor/admin"
            className="text-sm text-sand/60 hover:underline"
          >
            ← Voltar ao painel
          </a>
        </div>
        <a
          href="/area-do-professor/admin/trilhas"
          className="text-lime-ct hover:underline"
        >
          Gerenciar trilhas →
        </a>
      </div>
```

- [ ] **Step 4: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build
```

Expected: sem erros.

- [ ] **Step 5: Commit**

```bash
git add site/src/app/area-do-professor/admin/trilhas site/src/app/area-do-professor/admin/materiais/page.tsx
git commit -m "Adiciona a lista e criação de trilhas no painel do líder"
```

---

### Task 11: Gerenciar materiais dentro de uma trilha (líder)

**Files:**
- Create: `site/src/app/area-do-professor/admin/trilhas/[id]/page.tsx`

Formulário de "adicionar material" usa um `<select>` simples com todos os materiais
que ainda não estão nesta trilha — sem biblioteca de busca/autocomplete (YAGNI: o
número de materiais de um CT pequeno não justifica isso).

- [ ] **Step 1: Escrever a página**

```tsx
// site/src/app/area-do-professor/admin/trilhas/[id]/page.tsx
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Material, Trilha, TrilhaMaterial } from "@/types/area-do-professor";
import { adicionarMaterialNaTrilha, removerMaterialDaTrilha } from "../actions";

export const metadata: Metadata = {
  title: "Gerenciar trilha",
  robots: { index: false, follow: false },
};

export default async function PaginaAdminTrilha({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: trilha } = await supabase
    .from("trilhas")
    .select("*")
    .eq("id", id)
    .single();

  if (!trilha) {
    redirect("/area-do-professor/admin/trilhas");
  }

  const [{ data: trilhaMateriais }, { data: todosMateriais }] = await Promise.all([
    supabase
      .from("trilha_materiais")
      .select("trilha_id, material_id, ordem, materiais(*)")
      .eq("trilha_id", id)
      .order("ordem", { ascending: true }),
    supabase.from("materiais").select("*").order("titulo", { ascending: true }),
  ]);

  type LinhaComMaterial = TrilhaMaterial & { materiais: Material | null };
  const linhas = (trilhaMateriais ?? []) as LinhaComMaterial[];
  const idsNaTrilha = new Set(linhas.map((linha) => linha.material_id));
  const disponiveis = ((todosMateriais ?? []) as Material[]).filter(
    (material) => !idsNaTrilha.has(material.id)
  );

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="font-display text-2xl">{(trilha as Trilha).titulo}</h1>
        <p className="text-sm text-sand/70">
          {(trilha as Trilha).publicado ? "Publicada" : "Rascunho"} — gerencie os
          materiais desta trilha e a ordem deles.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg">Materiais nesta trilha</h2>
        {linhas.length === 0 ? (
          <p className="text-sand/60">Nenhum material adicionado ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {linhas
              .filter((linha) => linha.materiais !== null)
              .map((linha) => (
                <li
                  key={linha.material_id}
                  className="flex items-center justify-between rounded-lg border border-sand/10 bg-navy-800 p-4"
                >
                  <span>
                    <span className="mr-2 text-sand/50">#{linha.ordem}</span>
                    {linha.materiais!.titulo}
                  </span>
                  <form
                    action={removerMaterialDaTrilha.bind(
                      null,
                      id,
                      linha.material_id
                    )}
                  >
                    <button
                      type="submit"
                      className="rounded-md border border-red-400/40 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10"
                    >
                      Remover
                    </button>
                  </form>
                </li>
              ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg">Adicionar material</h2>
        {disponiveis.length === 0 ? (
          <p className="text-sand/60">
            Todos os materiais existentes já estão nesta trilha.
          </p>
        ) : (
          <form
            action={adicionarMaterialNaTrilha.bind(null, id)}
            className="flex flex-col gap-3 rounded-lg border border-sand/10 bg-navy-800 p-4 sm:flex-row sm:items-end"
          >
            <label className="flex flex-1 flex-col gap-1 text-sm text-sand/80">
              Material
              <select
                name="material_id"
                required
                className="rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
              >
                {disponiveis.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.titulo}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-sand/80">
              Ordem
              <input
                name="ordem"
                type="number"
                defaultValue={linhas.length}
                className="w-24 rounded-md border border-sand/20 bg-navy-800 px-3 py-2 text-sand outline-none focus:border-lime-ct"
              />
            </label>
            <button
              type="submit"
              className="rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright"
            >
              Adicionar
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verificar**

```bash
cd site && npx tsc --noEmit && npm run build
```

Expected: sem erros. `/area-do-professor/admin/trilhas/[id]` aparece como rota `ƒ`.

- [ ] **Step 3: Commit**

```bash
git add site/src/app/area-do-professor/admin/trilhas/[id]
git commit -m "Adiciona o gerenciamento de materiais dentro de uma trilha"
```

---

## Fase H — Teste manual e fechamento

### Task 12: Teste ponta a ponta e changelog

**Files:**
- Modify: `changelog.md`
- Modify: `memory.md`

- [ ] **Step 1: Rodar as migrations da Task 1** (se ainda não rodadas)

- [ ] **Step 2: `npm run dev` e conferir visualmente**

```bash
cd site && npm run dev
```

Abrir `/area-do-professor` logado como líder: confirmar cabeçalho do site público
no topo, sub-navegação em abas logo abaixo, nenhuma trilha ainda (seção "Materiais
soltos" só, sem a seção "Trilhas" — ela só aparece quando existe ao menos uma
trilha).

- [ ] **Step 3: Criar e publicar uma trilha de teste**

Em "Gerenciar Materiais" → "Gerenciar trilhas →", criar uma trilha, adicionar 2
materiais existentes, publicar. Voltar em "Materiais": a trilha deve aparecer em
destaque com "0 de 2 concluídos".

- [ ] **Step 4: Marcar um material como visto**

Clicar na trilha, marcar um material como visto. Confirmar que o card volta pra
"Materiais" (via SubNav) já mostrando "1 de 2 concluídos" sem precisar recarregar
manualmente (a Server Action já revalida via `revalidatePath`).

- [ ] **Step 5: Conferir RLS pelo SQL Editor**

Simulando `auth.uid()` de um professor de teste (não-líder), confirmar que ele não
vê uma trilha com `publicado = false`, e que tentar inserir uma linha de
`progresso_material` com `professor_id` de outra pessoa falha.

- [ ] **Step 6: Registrar no changelog**

Adicionar em `changelog.md`, seção `### Adicionado` de `[Não publicado]`:

```md
- 2026-09-17 — Redesign visual da Área do Professor + trilhas: cabeçalho do site
  público reaproveitado (já vinha do layout raiz, sem trabalho extra), sub-navegação
  em abas (Materiais/Professores/Gerenciar Materiais, últimas duas só pro líder), e a
  tela de materiais reorganizada em seções (`Secao`/`Revela`, mesma linguagem visual
  do site público) — trilhas em destaque no topo com barra de progresso, materiais
  soltos agrupados por tipo abaixo. Trilhas são a feature nova: o líder agrupa
  materiais existentes em sequências tipo curso (`trilhas`, `trilha_materiais` — N:N,
  um material pode estar em várias trilhas), e o professor marca manualmente cada
  material como visto (`progresso_material`, por material — não por par
  trilha+material, então marcar visto conta em qualquer trilha onde o material
  reaparece). Painel do líder ganhou CRUD de trilhas em
  `admin/trilhas`. Ver `docs/superpowers/specs/2026-09-17-area-do-professor-redesign-trilhas-design.md`
```

- [ ] **Step 7: Atualizar `memory.md`**

Marcar a seção "Redesign visual + trilhas (2026-09-17, em brainstorming)" como
concluída, substituindo por um resumo do resultado do teste ponta a ponta.

- [ ] **Step 8: Commit**

```bash
git add changelog.md memory.md
git commit -m "Registra o redesign da Área do Professor e as trilhas no changelog"
```
