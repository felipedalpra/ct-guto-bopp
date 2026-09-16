# Área do Professor — Design

Data: 2026-09-15
Status: aprovado, pronto para plano de implementação

## Contexto

O site institucional do CT Guto Bopp (Next.js 16 + TypeScript + Tailwind, hoje 100%
estático, sem banco de dados) vai ganhar uma nova área autenticada: a **Área do
Professor**. É um espaço exclusivo para os Professores Licenciados da rede, com
materiais e conteúdos de apoio à Metodologia Guto Bopp. Acesso é só por convite —
não existe cadastro público.

Origem do requisito: material de divulgação do cliente ("4 Área do Professor —
ctgutobopp.com.br"), que define:
- Acesso restrito aos Professores Licenciados com licença ativa
- Materiais didáticos de apoio às aulas
- Conteúdos e atualizações relacionados à metodologia
- Conteúdo de uso profissional, não pode ser compartilhado/reproduzido/comercializado

## Infraestrutura

- **Backend:** Supabase (Postgres + Auth + Storage), projeto dedicado
  `ct-guto-bopp` na organização `projetosFDP`, região `sa-east-1`. Projeto
  isolado dos demais projetos Supabase do desenvolvedor por conter dados
  pessoais de terceiros (telefone/e-mail dos professores).
- **Hosting:** mesmo projeto Vercel do site atual.
- **Sem serviço de e-mail externo** — o Supabase Auth já envia o e-mail de
  convite/definição de senha.

## Papéis e modelo de acesso

- Tabela `profiles` (1:1 com `auth.users`): `id`, `nome`, `email`, `role`
  (`lider` | `professor`), `status` (`ativo` | `revogado`), `criado_em`.
- Guto é o único `lider`, cadastrado manualmente (seed) — não existe fluxo de
  promoção a líder pela interface.
- Trigger no Postgres cria a linha em `profiles` (role `professor`, status
  `ativo`) quando o convite é aceito em `auth.users`.
- **RLS:**
  - Professor: só vê a própria linha em `profiles`; só vê `materiais` com
    `publicado = true`.
  - Líder: leitura/escrita total em `profiles` e `materiais`.
  - `status = revogado`: bloqueado tanto pelo RLS quanto no login (mensagem
    "acesso desativado, fale com o CT"). Revogar é só o líder mudar o status —
    não precisa apagar a conta.

## Convite e proteção de rotas

- Painel administrativo em `/area-do-professor/admin`, acessível só para
  `role = lider`.
- Fluxo de convite: líder informa nome + e-mail → Route Handler no servidor
  chama `supabase.auth.admin.inviteUserByEmail` usando a service role key
  (nunca exposta ao client). Supabase envia o e-mail de convite.
- Professor clica no link → cai em `/area-do-professor/completar-cadastro`,
  define senha, é autenticado e redirecionado para a área.
- Middleware do Next.js protege `/area-do-professor/**`:
  - sem sessão válida → redireciona para login
  - sessão com `status = revogado` → desloga com aviso amigável
  - `/area-do-professor/admin/**` exige `role = lider`

## Conteúdo

- Tabela `materiais`: `id`, `titulo`, `descricao`, `tipo`
  (`arquivo` | `video` | `link` | `texto`), `arquivo_path` (Supabase Storage),
  `video_url`, `link_url`, `corpo_texto`, `publicado` (bool), `criado_em`.
  Um único modelo genérico cobre os 3 formatos pedidos pelo cliente
  (arquivos, vídeos, links/avisos).
- Arquivos: bucket privado `materiais` no Supabase Storage. Download gera uma
  signed URL de curta duração (ex. 60s) por clique no servidor — nunca um link
  público direto.
- Vídeo: professor cola link do YouTube/Vimeo não-listado; a página embute via
  iframe. Sem upload/hospedagem de vídeo própria (custo/banda proibitivos para
  esse volume).
- Painel do líder (`/area-do-professor/admin`):
  - lista de professores com toggle ativo/revogado e botão "convidar"
  - CRUD de materiais (criar, editar, publicar/despublicar, excluir)
- Área do professor (`/area-do-professor`): lista dos materiais publicados,
  mais recentes primeiro.

## Erros e casos de borda

- Convite expirado ou já usado: tela amigável com botão de contato via
  WhatsApp para pedir novo convite (sem reenvio automático nessa v1).
- Login de conta revogada: mensagem clara ("acesso desativado, fale com o
  CT"), sem detalhe técnico.
- Upload de arquivo: validação de tamanho (até 20MB) e tipo (pdf, docx, xlsx,
  imagens).

## Testes (plano manual — projeto sem suíte automatizada hoje)

- Convite ponta a ponta: líder convida → e-mail chega → professor define
  senha → acessa a área.
- RLS: professor não enxerga materiais não publicados nem dados de outro
  professor (validar direto no SQL editor do Supabase).
- Upload/download: arquivo enviado pelo líder aparece e baixa corretamente
  para o professor; signed URL expira.
- Revogação: professor com `status = revogado` não consegue logar.

## Fora de escopo (v1)

- Auto-cadastro público (só convite)
- Reenvio automático de convite expirado
- Upload/hospedagem de vídeo própria
- Múltiplos líderes/admins
- Notificações por e-mail de novo material publicado
