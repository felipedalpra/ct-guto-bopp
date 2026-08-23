"use client";

import { useEffect, useRef, useState } from "react";
import { site, formulario } from "@/data/site";

/**
 * Formulário de contato desenhado como um rali.
 *
 * A animação não é enfeite: cada campo preenchido é uma bola devolvida. A bolinha
 * sobe o arco por cima da rede a cada resposta, o traçado vai sendo desenhado
 * atrás dela, e o envio é o ponto — a bola cai na areia e levanta o pó. É o único
 * gesto do esporte na página, pelo mesmo motivo que a Trajetória aparece uma vez
 * só: usado uma vez, é o jogo; repetido, vira decoração.
 *
 * O ponto exato da bolinha vem de getPointAtLength no próprio path do arco, então
 * ela segue a curva de verdade em vez de uma aproximação — e o CSS interpola entre
 * uma posição e a seguinte, dando o salto.
 *
 * Sem endpoint configurado (ver formulario.endpoint em data/site.ts) nada é
 * enviado: a interface completa funciona, mas os dados não saem do navegador.
 */

const CAMPOS_DO_RALI = ["nome", "whatsapp", "perfil", "horario"] as const;

const PERFIS = [
  { valor: "nunca-joguei", rotulo: "Nunca joguei" },
  { valor: "comecando", rotulo: "Estou começando" },
  { valor: "ja-jogo", rotulo: "Já jogo" },
  { valor: "professor", rotulo: "Sou professor(a)" },
] as const;

const HORARIOS = [
  { valor: "manha", rotulo: "Manhã" },
  { valor: "tarde", rotulo: "Tarde" },
  { valor: "noite", rotulo: "Noite" },
  { valor: "flexivel", rotulo: "Flexível" },
] as const;

type Estado = "parado" | "enviando" | "enviado" | "erro";

export default function FormularioContato() {
  const [dados, setDados] = useState({
    nome: "",
    whatsapp: "",
    perfil: "",
    horario: "",
    mensagem: "",
  });
  const [estado, setEstado] = useState<Estado>("parado");

  const arco = useRef<SVGPathElement>(null);
  const [bola, setBola] = useState({ x: 40, y: 168 });
  const [comprimento, setComprimento] = useState(0);

  const respondidos = CAMPOS_DO_RALI.filter((c) => dados[c].trim() !== "").length;
  // No envio a bola completa o arco, independente do que faltou preencher.
  const progresso =
    estado === "enviado" ? 1 : respondidos / CAMPOS_DO_RALI.length;

  useEffect(() => {
    const path = arco.current;
    if (!path) return;
    setComprimento(path.getTotalLength());
  }, []);

  useEffect(() => {
    const path = arco.current;
    if (!path || comprimento === 0) return;
    const ponto = path.getPointAtLength(comprimento * progresso);
    setBola({ x: ponto.x, y: ponto.y });
  }, [progresso, comprimento]);

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
      <div className="rali rali--ponto">
        <QuadraDoRali
          refArco={arco}
          bola={bola}
          comprimento={comprimento}
          progresso={progresso}
          ponto
        />
        <p className="rali__ponto-rotulo">Ponto</p>
        <h3 className="display rali__ponto-titulo">
          Recebemos, {dados.nome.split(" ")[0] || "atleta"}.
        </h3>
        <p className="rali__ponto-texto">
          A resposta vem pelo WhatsApp. Se quiser adiantar a conversa, é só chamar.
        </p>
        <a
          className="btn btn--linha"
          href={site.whatsapp.link(
            `Olá! Acabei de preencher o formulário do site — sou ${
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
    <form className="rali" onSubmit={enviar} noValidate={false}>
      <QuadraDoRali
        refArco={arco}
        bola={bola}
        comprimento={comprimento}
        progresso={progresso}
      />

      <div className="rali__campos">
        <label className="campo">
          <span className="campo__rotulo">Seu nome</span>
          <input
            className="campo__entrada"
            type="text"
            name="nome"
            required
            autoComplete="name"
            placeholder="Como te chamamos"
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
            placeholder="(51) 90000-0000"
            value={dados.whatsapp}
            onChange={(e) => alterar("whatsapp", e.target.value)}
          />
        </label>

        <Escolhas
          rotulo="Seu nível"
          nome="perfil"
          opcoes={PERFIS}
          valor={dados.perfil}
          aoEscolher={(v) => alterar("perfil", v)}
        />

        <Escolhas
          rotulo="Melhor horário"
          nome="horario"
          opcoes={HORARIOS}
          valor={dados.horario}
          aoEscolher={(v) => alterar("horario", v)}
        />

        <label className="campo campo--largo">
          <span className="campo__rotulo">
            Algo mais <em>opcional</em>
          </span>
          <textarea
            className="campo__entrada campo__area"
            name="mensagem"
            rows={2}
            placeholder="Turma ou particular, dias que funcionam, o que você busca…"
            value={dados.mensagem}
            onChange={(e) => alterar("mensagem", e.target.value)}
          />
        </label>
      </div>

      <div className="rali__rodape">
        <button
          className="btn btn--primario rali__enviar"
          type="submit"
          disabled={estado === "enviando"}
        >
          {estado === "enviando" ? "Sacando…" : "Sacar"}
        </button>
        <p className="rali__nota" role={estado === "erro" ? "alert" : undefined}>
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
              Preferir conversa direta?{" "}
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
      </div>
    </form>
  );
}

/** Um grupo de escolha única, em pastilhas — mais rápido no celular que um select. */
function Escolhas({
  rotulo,
  nome,
  opcoes,
  valor,
  aoEscolher,
}: {
  rotulo: string;
  nome: string;
  opcoes: readonly { valor: string; rotulo: string }[];
  valor: string;
  aoEscolher: (valor: string) => void;
}) {
  return (
    <fieldset className="campo campo--escolhas">
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

/**
 * A quadra vista de lado: areia, rede e o arco do golpe.
 * O traçado só existe até onde o rali chegou — o resto fica pontilhado, à espera.
 */
function QuadraDoRali({
  refArco,
  bola,
  comprimento,
  progresso,
  ponto = false,
}: {
  refArco: React.RefObject<SVGPathElement | null>;
  bola: { x: number; y: number };
  comprimento: number;
  progresso: number;
  ponto?: boolean;
}) {
  return (
    <svg
      className="rali__quadra"
      viewBox="0 0 600 200"
      fill="none"
      aria-hidden="true"
    >
      <line x1="0" y1="176" x2="600" y2="176" stroke="currentColor" opacity="0.28" />
      <line x1="300" y1="176" x2="300" y2="96" stroke="currentColor" opacity="0.5" />
      <line
        x1="286"
        y1="96"
        x2="314"
        y2="96"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />

      {/* O arco inteiro, à espera. */}
      <path
        ref={refArco}
        className="rali__arco"
        d="M40 168C40 168 150 24 300 24s260 144 260 144"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 8"
        opacity="0.28"
      />
      {/* O trecho já percorrido, sólido. */}
      {comprimento > 0 && (
        <path
          className="rali__arco-feito"
          d="M40 168C40 168 150 24 300 24s260 144 260 144"
          stroke="var(--color-lime-ct)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: comprimento,
            strokeDashoffset: comprimento * (1 - progresso),
          }}
        />
      )}

      <g
        className="rali__bola"
        style={{ transform: `translate(${bola.x}px, ${bola.y}px)` }}
      >
        {ponto && <circle className="rali__poeira" r="9" fill="var(--color-sand)" />}
        <circle r="7" fill="var(--color-lime-ct)" />
        <path
          d="M-7 0a7 7 0 0 1 14 0"
          stroke="var(--color-navy-900)"
          strokeWidth="1.5"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}
