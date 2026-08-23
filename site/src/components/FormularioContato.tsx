"use client";

import { useState } from "react";
import { site, formulario } from "@/data/site";

/**
 * Formulário de contato com o placar do jogo como indicador de progresso.
 *
 * A contagem do tênis — 0, 15, 30, 40, game — é a coisa mais reconhecível do
 * esporte depois da bola, e cai exatamente sobre a forma do formulário: quatro
 * campos, quatro pontos, e o envio fecha o game. Cada resposta faz o número
 * saltar como quem marca ponto.
 *
 * A trajetória da bola por cima da rede não serve aqui: ela já é o gesto do
 * fecho da home e da faixa do Guto (ver motivos.tsx). Repetida uma terceira vez
 * viraria papel de parede — o placar diz a mesma coisa numa gramática que ainda
 * não foi usada.
 *
 * Sem endpoint configurado (ver formulario.endpoint em data/site.ts) nada é
 * enviado: a interface completa funciona, mas os dados não saem do navegador.
 */

const PLACAR = ["0", "15", "30", "40"] as const;

/**
 * O site atende dois públicos, e o formulário precisa separar os dois na entrada:
 * quem quer treinar e quem dá aula e quer o Conexão BT. Antes "Sou professor(a)"
 * era uma das opções de "Seu nível" — o que colocava o professor na mesma régua do
 * aluno iniciante — e logo abaixo vinha "Melhor horário", pergunta que não quer
 * dizer nada para quem procura uma capacitação. A escolha aqui em cima troca as
 * duas perguntas seguintes inteiras.
 */
const OBJETIVOS = [
  { valor: "treinar", rotulo: "Quero treinar" },
  { valor: "conexao-bt", rotulo: "Dou aula — quero o Conexão BT" },
] as const;

const NIVEIS = [
  { valor: "nunca-joguei", rotulo: "Nunca joguei" },
  { valor: "comecando", rotulo: "Estou começando" },
  { valor: "ja-jogo", rotulo: "Já jogo" },
  { valor: "compito", rotulo: "Compito" },
] as const;

const HORARIOS = [
  { valor: "manha", rotulo: "Manhã" },
  { valor: "tarde", rotulo: "Tarde" },
  { valor: "noite", rotulo: "Noite" },
  { valor: "flexivel", rotulo: "Flexível" },
] as const;

const TEMPOS_DE_AULA = [
  { valor: "comecei-agora", rotulo: "Comecei agora" },
  { valor: "ate-2", rotulo: "Até 2 anos" },
  { valor: "2-a-5", rotulo: "2 a 5 anos" },
  { valor: "mais-de-5", rotulo: "Mais de 5 anos" },
] as const;

type Estado = "parado" | "enviando" | "enviado" | "erro";

export default function FormularioContato() {
  const [dados, setDados] = useState({
    nome: "",
    whatsapp: "",
    objetivo: "",
    nivel: "",
    horario: "",
    tempoDeAula: "",
    ondeDaAula: "",
    mensagem: "",
  });
  const [estado, setEstado] = useState<Estado>("parado");

  const professor = dados.objetivo === "conexao-bt";

  // O quarto ponto é o campo que a escolha do objetivo abriu — nível para quem vai
  // treinar, tempo de casa para quem dá aula. O placar conta os dois igual.
  const detalhe = professor ? dados.tempoDeAula : dados.nivel;
  const pontos = [dados.nome, dados.whatsapp, dados.objetivo, detalhe].filter(
    (v) => v.trim() !== ""
  ).length;

  function alterar(campo: keyof typeof dados, valor: string) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEstado("enviando");

    if (!formulario.endpoint) {
      // Integração ainda não plugada: a interface responde, mas nada é salvo.
      console.warn(
        "[contato] formulario.endpoint não configurado — nenhum dado foi enviado."
      );
      setEstado("enviado");
      return;
    }

    try {
      const resposta = await fetch(formulario.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...dados, origem: "site/contato" }),
      });
      setEstado(resposta.ok ? "enviado" : "erro");
    } catch {
      setEstado("erro");
    }
  }

  if (estado === "enviado") {
    return (
      <div className="jogo jogo--game">
        <Placar pontos={4} game />
        <h2 className="display jogo__game-titulo">
          Recebemos, {dados.nome.split(" ")[0] || "atleta"}.
        </h2>
        <p className="jogo__game-texto">
          O retorno vem pelo WhatsApp. Se quiser adiantar a conversa, é só
          chamar.
        </p>
        <a
          className="btn btn--linha"
          href={site.whatsapp.link(
            professor
              ? `Olá! Sou ${
                  dados.nome || "professor(a)"
                } e acabei de preencher o formulário do site pelo Conexão BT.`
              : `Olá! Acabei de preencher o formulário do site — sou ${
                  dados.nome || "aluno(a) novo(a)"
                }.`
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Chamar agora
        </a>
      </div>
    );
  }

  return (
    <form className="jogo" onSubmit={enviar}>
      <Placar pontos={pontos} />

      <div className="jogo__campos">
        <label className="campo">
          <span className="campo__rotulo">Nome</span>
          <input
            className="campo__entrada"
            type="text"
            name="nome"
            required
            autoComplete="name"
            placeholder="Seu nome"
            value={dados.nome}
            onChange={(e) => alterar("nome", e.target.value)}
          />
        </label>

        <label className="campo">
          <span className="campo__rotulo">WhatsApp</span>
          <input
            className="campo__entrada"
            type="tel"
            name="whatsapp"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="(51) 99999-9999"
            value={dados.whatsapp}
            onChange={(e) => alterar("whatsapp", e.target.value)}
          />
        </label>

        <Escolhas
          rotulo="O que você procura"
          nome="objetivo"
          opcoes={OBJETIVOS}
          valor={dados.objetivo}
          aoEscolher={(v) => alterar("objetivo", v)}
        />

        {professor ? (
          <>
            <Escolhas
              ramo
              rotulo="Há quanto tempo dá aula"
              nome="tempoDeAula"
              opcoes={TEMPOS_DE_AULA}
              valor={dados.tempoDeAula}
              aoEscolher={(v) => alterar("tempoDeAula", v)}
            />

            <label className="campo campo--largo campo--ramo">
              <span className="campo__rotulo">Onde você dá aula</span>
              <input
                className="campo__entrada"
                type="text"
                name="ondeDaAula"
                placeholder="Cidade e arena onde você atende"
                value={dados.ondeDaAula}
                onChange={(e) => alterar("ondeDaAula", e.target.value)}
              />
            </label>
          </>
        ) : dados.objetivo ? (
          <>
            <Escolhas
              ramo
              rotulo="Seu nível"
              nome="nivel"
              opcoes={NIVEIS}
              valor={dados.nivel}
              aoEscolher={(v) => alterar("nivel", v)}
            />

            <Escolhas
              ramo
              rotulo="Melhor horário"
              nome="horario"
              opcoes={HORARIOS}
              valor={dados.horario}
              aoEscolher={(v) => alterar("horario", v)}
            />
          </>
        ) : null}

        <label className="campo campo--largo">
          <span className="campo__rotulo">
            Algo mais <em>opcional</em>
          </span>
          <textarea
            className="campo__entrada campo__area"
            name="mensagem"
            rows={3}
            placeholder={
              professor
                ? "Quantos alunos você atende, o que trava na sua aula hoje…"
                : "Turma ou particular, dias que funcionam, o que você busca…"
            }
            value={dados.mensagem}
            onChange={(e) => alterar("mensagem", e.target.value)}
          />
        </label>
      </div>

      <button
        className="btn btn--primario jogo__enviar"
        type="submit"
        disabled={estado === "enviando"}
      >
        {estado === "enviando" ? "Enviando…" : "Enviar contato →"}
      </button>

      <p className="jogo__nota" role={estado === "erro" ? "alert" : undefined}>
        {estado === "erro" ? (
          <>
            Não conseguimos enviar agora.{" "}
            <a
              href={site.whatsapp.link(
                "Olá! Tentei o formulário do site e não foi. Quero falar sobre os treinos."
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chama no WhatsApp
            </a>{" "}
            que a gente resolve por lá.
          </>
        ) : (
          <>
            Prefere conversa direta?{" "}
            <a
              href={site.whatsapp.link(
                "Olá! Vim pelo site do CT Guto Bopp e quero saber mais sobre os treinos."
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp {site.whatsapp.numero}
            </a>
          </>
        )}
      </p>
    </form>
  );
}

/**
 * O placar. O número troca a cada campo respondido e salta ao entrar — a `key`
 * remonta o elemento, então a animação roda de novo a cada ponto marcado.
 * O traço embaixo mede o game inteiro, para o salto não ser o único sinal.
 */
function Placar({ pontos, game = false }: { pontos: number; game?: boolean }) {
  const valor = game ? "GAME" : PLACAR[Math.min(pontos, 3)];

  return (
    <div className="placar" data-game={game || undefined}>
      <span className="placar__rotulo">
        {game
          ? "Fechou"
          : pontos === 4
            ? "Pronto para sacar"
            : `Ponto ${pontos + 1} de 4`}
      </span>
      <strong
        key={valor}
        className="placar__valor"
        data-longo={valor.length > 2 || undefined}
      >
        {valor}
      </strong>
      <span className="placar__trilho" aria-hidden="true">
        <span
          className="placar__avanco"
          style={{ transform: `scaleX(${(game ? 4 : pontos) / 4})` }}
        />
      </span>
    </div>
  );
}

/** Um grupo de escolha única, em pastilhas — mais rápido no celular que um select. */
function Escolhas({
  rotulo,
  nome,
  opcoes,
  valor,
  aoEscolher,
  ramo = false,
}: {
  rotulo: string;
  nome: string;
  opcoes: readonly { valor: string; rotulo: string }[];
  valor: string;
  aoEscolher: (valor: string) => void;
  /** Campo que só existe depois da escolha do objetivo — entra animado. */
  ramo?: boolean;
}) {
  return (
    <fieldset className={`campo campo--escolhas${ramo ? " campo--ramo" : ""}`}>
      <legend className="campo__rotulo">{rotulo}</legend>
      <div className="pastilhas">
        {opcoes.map((opcao) => (
          <label key={opcao.valor} className="pastilha">
            <input
              type="radio"
              name={nome}
              value={opcao.valor}
              checked={valor === opcao.valor}
              onChange={() => aoEscolher(opcao.valor)}
            />
            <span>{opcao.rotulo}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
