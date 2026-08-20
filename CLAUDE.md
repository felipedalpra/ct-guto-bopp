# CLAUDE.md

Project Name: ct-guto-bopp

Repositório: <https://github.com/felipedalpra/ct-guto-bopp> (privado)
Local: `~/Documents/GitHub/ct-guto-bopp` — projeto próprio, **fora** do monorepo Zentri.tech.

## Sobre o projeto

Site / landing page do CT de Beach Tennis do professor **Guto Bopp**.

Público duplo: **atletas e professores** de Beach Tennis. O carro-chefe é a
Metodologia Guto Bopp (Método dos 5 Pilares) e o curso **Conexão BT** — capacitação
para professores, que entra como seção dentro do site do CT.

Objetivo: gerar contato via WhatsApp (treinos e capacitação).

## Status

Fase de planejamento. Stack definida, **mas o código ainda NÃO deve ser criado** —
aguardando o material do cliente. Não inicializar o projeto sem pedido explícito.

**Stack definida (2026-08-19):**
- Next.js (App Router) + TypeScript + Tailwind CSS
- Deploy na Vercel
- Domínio a definir

Aguardando do cliente: logo em alta, paleta confirmada, fotos, as 7 fichas de
professores, nome/descrição dos 5 pilares e os detalhes do Conexão BT.

## ⛔ REGRA OBRIGATÓRIA — Documentar no changelog

**Toda e qualquer alteração neste projeto DEVE ser registrada em [changelog.md](changelog.md).**

Vale para todos: agentes de IA (Claude, Cursor, Copilot, etc.) e pessoas.

- Criou, editou ou apagou arquivo → registra
- Mudou conteúdo, texto, estilo, config ou dependência → registra
- Corrigiu bug → registra
- Só leu / analisou / respondeu pergunta → **não** registra

Como registrar, em `## [Não publicado]`, sob a categoria certa
(`Adicionado`, `Alterado`, `Corrigido`, `Removido`):

```md
- AAAA-MM-DD — descrição curta do que mudou e por quê
```

A entrada no changelog faz parte da tarefa: nenhuma alteração é considerada
concluída sem ela. Se mexeu em vários arquivos pelo mesmo motivo, use UMA
entrada só descrevendo a mudança como um todo.

Decisões, contexto e dados do cliente vão em [memory.md](memory.md) — não no changelog.

## Convenções

- Idioma do site e de todo o conteúdo: **português do Brasil**
- Mobile-first — a maior parte do tráfego virá do Instagram
- Sem overflow horizontal em nenhuma largura de tela
- CTA principal sempre visível: contato via WhatsApp

## Arquivos de acompanhamento

- [memory.md](memory.md) — decisões, contexto e informações do cliente
- [changelog.md](changelog.md) — histórico de mudanças do projeto
- [copy-site.md](copy-site.md) — rascunho dos textos do site, seção a seção
- [README.md](README.md) — visão geral do repositório
