# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Não publicado]

### Adicionado
- 2026-08-20 — Página 404 com o mapa do site, para quem chega por link antigo de âncora ou por endereço digitado errado — risco que não existia enquanto o site era uma página só
- 2026-08-20 — Mapa da sede na seção de contato: embed do Google Maps (sem chave de API), com carregamento adiado, tema escuro casado com a paleta e link para traçar rota. O endereço em texto segue logo acima, para quem bloqueia iframe de terceiros
- 2026-08-20 — Implementação do site em `site/` (Next.js 16 + TypeScript + Tailwind 4): capa com vídeo de fundo, apresentação do Guto, Método dos 5 Pilares desenhado como quadra vista de cima, Conexão BT, professores, depoimentos, FAQ e contato. Conteúdo separado em `src/data/` para o cliente revisar sem mexer em código; paleta e tipografia derivadas da logo G3 (navy, verde-limão, dourado)
- 2026-08-20 — SEO e GEO: metadata + OpenGraph, `sitemap.ts`, `robots.ts` e JSON-LD (SportsActivityLocation, Person, Course, FAQPage, WebSite). Depoimentos ficaram deliberadamente fora dos dados estruturados enquanto forem rascunho
- 2026-08-20 — Assets preparados a partir do material do cliente: logo extraída do PDF vetorial em duas versões (fundo claro e escuro) e fotos recortadas em 4:5 padronizado

- 2026-08-19 — Estrutura inicial do projeto: `CLAUDE.md`, `memory.md`, `changelog.md`
- 2026-08-19 — Regra obrigatória no `CLAUDE.md`: toda alteração (por IA ou pessoa) deve ser documentada neste changelog
- 2026-08-19 — Briefing respondido pelo cliente (docx) adicionado à pasta; conteúdo extraído e consolidado no `memory.md` (posicionamento, contato, identidade visual, pendências)
- 2026-08-19 — Rascunho da copy do site em `copy-site.md` (hero, apresentação, método, quem somos, Conexão BT, professores, rodapé)

### Corrigido
- 2026-08-20 — CEP do endereço estava errado no `site.ts` (placeholder 90650-000); o correto é 91320-000, Vila Jardim — corrigido também nos dados estruturados, que alimentam a ficha do negócio nos buscadores
- 2026-08-20 — Menu de celular não cobria a página e não podia ser fechado: o cabeçalho é `position: fixed` com `backdrop-filter`, o que o tornava bloco de contenção dos filhos `position: fixed` — o `inset: 0` do menu passava a significar "a caixa do cabeçalho" e o overlay tapava o próprio botão. O menu saiu de dentro do `<header>` e ganhou botão de fechar próprio, tecla Esc e devolução de foco
- 2026-08-20 — Ícone de fechar aparecia como `>` em vez de `X`: as regras base do hambúrguer tinham especificidade maior que as do estado aberto
- 2026-08-20 — Ponto final de "Resultado." era cortado em telas de 320–390px; escala do título da capa ajustada para caber a palavra mais longa

### Alterado
- 2026-08-20 — Site reestruturado de landing page única para site institucional multipágina: cada seção virou rota própria (`/metodo`, `/o-ct`, `/conexao-bt`, `/professores`, `/contato`) e cada professor ganhou ficha em `/professores/[slug]`. A home deixou de empilhar tudo e passou a mostrar resumos que levam às páginas — com uma bifurcação logo abaixo da capa entre "quero treinar" e "dou aula", já que o tráfego vem do Instagram e chega sem contexto. O menu troca âncoras por links de rota e marca a página atual; cabeçalho, rodapé e botão de WhatsApp subiram para o layout. Rodapé virou mapa do site, cada página ganhou title/description/canonical próprios, o sitemap passou a listar as 12 rotas e o JSON-LD foi dividido por página (FAQPage e Course precisam ficar onde o conteúdo aparece, mais BreadcrumbList em todas). O FAQ, que era um bloco só, foi separado por público: dúvidas de aluno fecham `/o-ct`, dúvidas de professor fecham `/conexao-bt`
- 2026-08-20 — CTAs dos cards de professor reescritos para deixar a ação explícita: label "Agende sua aula com [nome]" mais botões com ícone do WhatsApp (ação principal, em limão) e do Instagram, no lugar dos links soltos "WhatsApp" e "@handle". A mensagem pré-preenchida do WhatsApp passou a pedir agendamento, e o botão no fim da seção virou "Falar com o CT", para quem não sabe com qual professor começar
- 2026-08-20 — Fotos dos professores deixaram de abrir em preto e branco e ganhar cor no hover (a pedido): agora ficam sempre em cor, e a grade é uniformizada pelo recorte 4:5 e por um ajuste idêntico de contraste/saturação em todas
- 2026-08-19 — Material do cliente recebido (4 fichas de professores, logo em PDF vetorial, foto do Guto); dados extraídos e registrados no `memory.md`, com inventário do que ainda falta
- 2026-08-19 — Fotos de Guilherme e Mariana extraídas de dentro das fichas `.docx` para arquivos de imagem na pasta de cada professor (a da Mariana é uma segunda foto, diferente da que veio solta → `foto-mariana-2.jpg`)

- 2026-08-19 — `README.md` com a visão geral do repositório

### Removido
- 2026-08-20 — `.gitignore`: pasta `Videos/` (material bruto do cliente) e `*.tsbuildinfo` fora do versionamento — cada vídeo passa de 140MB e o GitHub recusa arquivos acima de 100MB; o que for pro site entra otimizado em `site/public/`
- 2026-08-19 — Arquivos temporários do Word (`~$*.docx`) e a pasta vazia `Fotos-professores/`, substituída por `Cadastro professores/`
- 2026-08-19 — Stack definida: Next.js (App Router) + TypeScript + Tailwind, deploy na Vercel; registrada no `CLAUDE.md` e no `memory.md` (sem gerar código ainda, por decisão do cliente)
- 2026-08-19 — Projeto movido para `~/Documents/GitHub/ct-guto-bopp` e publicado no repositório privado `felipedalpra/ct-guto-bopp`; `.gitignore` adicionado
- 2026-08-19 — `memory.md`: registradas as decisões do cliente sobre o texto de abertura da home e sobre o Conexão BT entrar como seção do site do CT
