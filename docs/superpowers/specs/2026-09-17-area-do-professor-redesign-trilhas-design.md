# Área do Professor — Redesign visual + Trilhas

Data: 2026-09-17
Status: aprovado, pronto para plano de implementação

## Contexto

O design de `2026-09-15-area-do-professor-design.md` cobriu só a arquitetura de
backend (Supabase, Auth, RLS, modelo de conteúdo `materiais`). Não teve nenhuma
seção de UI/UX — e isso apareceu na prática: depois do deploy da Fase 1 (código) e
do bootstrap do primeiro líder em produção, o resultado visual é o mínimo possível
(cabeçalho próprio fora do padrão do site, lista plana sem hierarquia, sem clareza
de onde ver/gerenciar materiais). Este documento cobre o redesign visual da Área do
Professor e uma feature nova pedida junto: **trilhas** (materiais organizados tipo
curso, com progresso por professor).

## Escopo

**Entra nesta leva:**
- Redesign visual completo (cabeçalho, navegação interna, cards)
- Trilhas: líder agrupa materiais em trilhas; materiais soltos continuam existindo
  fora de qualquer trilha
- Progresso do professor por material (manual, "marquei como visto")

**Fica de fora, registrado como backlog em `memory.md`** (não veio do briefing do
cliente — é ideia do Felipe, vale validar com o Guto antes de desenhar): curtir
material, compartilhar, comentar, interações entre professores para incentivar
networking na plataforma.

## Navegação e estrutura visual

**Cabeçalho:** reaproveita `<Cabecalho />` (`site/src/components/Cabecalho.tsx`), o
mesmo componente do site público — logo, menu, CTA de WhatsApp — sem componente
próprio. Abaixo dele, dentro do layout da Área do Professor, uma barra fina com o
nome de quem está logado e "Sair" (o que já existe hoje em
`site/src/app/area-do-professor/layout.tsx`); some nas rotas públicas da área
(login, completar-cadastro, acesso-desativado), como já é hoje.

**Sub-navegação (abas), logo abaixo dessa barra, fixa dentro da Área do Professor:**
- **Materiais** — todo mundo. Trilhas em destaque + materiais soltos por tipo (ver
  abaixo). Cobre o que antes seria uma aba "Trilhas" separada — não há necessidade
  de uma aba a mais.
- **Professores** — só líder. É a tela que hoje vive em
  `area-do-professor/admin` (convidar, revogar).
- **Gerenciar Materiais** — só líder. CRUD de materiais (já existe em
  `admin/materiais`) **mais** uma seção nova de CRUD de trilhas, empilhada na mesma
  página (mesmo padrão que "Professores" já usa: formulário + lista na mesma tela).

**Visual dos cards e seções:** reaproveita a linguagem que o site público já usa —
`secao`/`bloco`, rótulo numerado ("01", "02"...), o wrapper `Revela` (anima entrada
ao rolar) e a textura de fundo `quadra-linhas` — em vez de inventar um estilo novo.
O resultado deve parecer uma continuação do site, não um painel admin genérico.

**Nota de nomenclatura (colisão evitada):** o site já tem um componente `Trilha`
(`CapaPagina.tsx`) — é a trilha de navegação tipo breadcrumb ("INÍCIO › PROFESSORES"),
sem relação com a trilha-curso desta feature. A tabela no banco chama-se `trilhas`,
mas nenhum componente React novo se chama `Trilha` isolado — nomes como
`CartaoTrilha`, `PainelTrilha`, `FormularioTrilha` evitam a colisão.

## Tela "Materiais" (professor)

Trilhas em destaque no topo — cards grandes (capa em degradê navy/lime, sem upload
de imagem por ora, título, descrição, barra de progresso "3 de 8 concluídos").
Clicar abre `/area-do-professor/trilhas/[id]`, que lista os materiais da trilha na
ordem definida pelo líder, cada um com checkbox "Marquei como visto".

Abaixo das trilhas, os materiais que não pertencem a nenhuma trilha, agrupados em
seções por tipo (Arquivos / Vídeos / Links / Avisos) — mesma ideia que já existia na
Fase 1, só que agora restrita aos materiais soltos e com hierarquia visual de
verdade em vez de lista plana. Cada material aqui também ganha o checkbox de
"visto", pelo mesmo motivo da trilha: consistência, e dá pro professor rastrear o
que já revisou mesmo fora de uma trilha.

## Modelo de dados novo

Além de `profiles` e `materiais` (já existentes, Fase 1):

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
```

**Por que progresso é por material, não por par trilha+material:** um material pode
estar em várias trilhas (`trilha_materiais` é N:N). Se o progresso fosse por par, o
mesmo PDF marcado como visto numa trilha apareceria como "não visto" em outra
trilha que o reusa — contraintuitivo, já que é o mesmo conteúdo. Rastrear por
material resolve isso e também cobre o "visto" nos materiais soltos, sem tabela
separada.

**RLS:** `trilhas` segue o mesmo padrão de `materiais` — líder vê tudo (inclusive
`publicado = false`), professor só vê `publicado = true`. `trilha_materiais` herda
visibilidade da trilha (join). `progresso_material`: cada professor só lê/escreve
as próprias linhas (`professor_id = auth.uid()`); líder não precisa ver progresso
alheio nesta leva (não pedido).

## Painel do líder — Trilhas

Dentro de "Gerenciar Materiais", nova seção "Trilhas": criar trilha (título,
descrição), publicar/despublicar, e dentro de cada trilha, adicionar/remover
materiais já existentes e definir a ordem por um campo numérico simples (não
drag-and-drop — evita depender de uma biblioteca nova só para isso).

## Fora de escopo (backlog)

Curtir, compartilhar, comentar e interações entre professores (networking) —
registrado em `memory.md`, pendente de um brainstorming próprio e validação com o
Guto antes de desenhar (decisão de produto maior: moderação de comentário,
visibilidade entre professores, possível perfil público).

## Testes a cobrir no plano de implementação

- Líder cria trilha em rascunho, adiciona 2 materiais existentes com ordem —
  professor não vê a trilha até publicar
- Publica a trilha — professor vê o card com "0 de 2 concluídos"
- Professor marca um material como visto dentro da trilha — card atualiza para
  "1 de 2"; o mesmo material aparece "visto" se também aparecer solto ou em outra
  trilha
- Material sem nenhuma trilha continua aparecendo na seção por tipo, abaixo das
  trilhas
- RLS: professor não consegue ver trilha `publicado = false` nem escrever
  `progresso_material` de outro `professor_id` (via SQL editor, simulando
  `auth.uid()`)
