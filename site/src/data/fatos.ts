/**
 * Os fatos do CT em forma de dado — a faixa que abre a home logo abaixo da
 * bifurcação.
 *
 * Existe para resolver um problema concreto: quem chega pelo Instagram não quer
 * ler manifesto, quer saber se atende o nível dele, onde fica e se cabe no
 * horário. Antes essa informação só existia diluída em parágrafo no meio das
 * páginas internas — ou não aparecia em lugar nenhum da home.
 *
 * Regra dura deste arquivo: só entra número ou fato que o briefing e as fichas
 * sustentam. Nada de estimativa. Onde não há dado (alunos ativos, professores
 * formados, ano de fundação), o campo simplesmente não existe — ver o pedido no
 * fim do arquivo.
 */

import { site } from "./site";
import { time, professoresPendentes } from "./professores";
import { pilares } from "./pilares";

export type Fato = {
  valor: string;
  unidade?: string;
  rotulo: string;
  /** Uma linha de contexto: o dado sozinho não significa nada. */
  detalhe: string;
};

export const fatos: Fato[] = [
  {
    valor: String(site.anosDeExperiencia),
    unidade: "+",
    rotulo: "anos de quadra",
    detalhe:
      "O tempo de Guto Bopp no Beach Tennis como atleta, professor e treinador — a matéria-prima do método.",
  },
  {
    valor: String(pilares.length),
    rotulo: "pilares",
    detalhe:
      "Organização, correção, técnica, tática e qualidade da aula. Cada um depende do anterior.",
  },
  {
    valor: String(time.length),
    rotulo: "professores no time",
    detalhe:
      professoresPendentes > 0
        ? `Guto Bopp mais ${time.length - 1} professores, todos certificados pelo Conexão BT. Outros ${professoresPendentes} entram em breve.`
        : `Guto Bopp mais ${time.length - 1} professores, todos certificados pelo Conexão BT.`,
  },
  {
    valor: "07–20h",
    rotulo: "todos os dias",
    detalhe: `Funcionamento da ${site.endereco.local}, em ${site.endereco.cidade}. O CT também dá aula em Palmares do Sul.`,
  },
];

/** O que o CT atende, em linha reta. Fica ao lado dos números. */
export const atendimento = {
  niveis: ["Infantil", "Iniciante", "Intermediário", "Avançado", "Competitivo"],
  formatos: ["Turma", "Particular", "Treino de atleta", "Capacitação de professor"],
};

/**
 * ⚠️ Números que dariam muito mais força a esta faixa e que ainda faltam:
 * - Quantos alunos treinam no CT hoje
 * - Quantos professores já se formaram pelo Conexão BT
 * - Ano de fundação do CT
 * - Quantas quadras tem a sede
 */
