/**
 * Conteúdo da página /o-ct: o que é o Centro de Treinamento, para quem é,
 * o que entrega e onde funciona.
 *
 * ⚠️ RASCUNHO — VALIDAR COM O GUTO.
 * A missão e a lista de diferenciais vêm do briefing, literalmente. O resto foi
 * escrito a partir dele. Nada sobre a estrutura física da sede foi inventado —
 * ainda não recebemos fotos nem descrição do espaço.
 */

import { time } from "./professores";

export const RASCUNHO = true;

export const missao =
  "Desenvolver atletas e professores através de uma metodologia estruturada, prática e voltada para a evolução contínua.";

/** Quem somos — os parágrafos de abertura da página. */
export const quemSomos = [
  "O CT Guto Bopp é um Centro de Treinamento de Beach Tennis na Prainha Beach Tennis, em Porto Alegre, com atuação também no Porto Sports, em Palmares do Sul. Atende do infantil ao competitivo e capacita professores pelo Conexão BT.",
  // O número sai do time de verdade: escrito à mão, envelhecia a cada ficha nova.
  `O time não é um grupo de profissionais independentes dividindo o espaço: os ${time.length} professores passaram pela mesma capacitação. Na prática, a aula de segunda com um tem a mesma estrutura da aula de quinta com outro.`,
];

/**
 * As três frentes do CT — o resumo estrutural que vai para a home.
 *
 * A home mostra COMO o CT se organiza (estas três frentes); a página /o-ct mostra
 * o que cada uma entrega em detalhe (a lista `entregas`, abaixo). A separação
 * existe para a mesma informação não aparecer duas vezes com palavras diferentes.
 */
export type Frente = {
  numero: string;
  titulo: string;
  texto: string;
  href: string;
  chamada: string;
};

export const frentes: Frente[] = [
  {
    numero: "01",
    titulo: "Treinar",
    texto:
      "Do infantil ao competitivo, em turma ou particular. O método define um ponto de entrada para cada estágio — não existe turma única.",
    href: "/metodo",
    chamada: "Ver como funciona o treino",
  },
  {
    numero: "02",
    titulo: "Formar",
    texto:
      `O Conexão BT capacita professores a aplicar a metodologia na própria aula. Os ${time.length} do time passaram por ele.`,
    href: "/conexao-bt",
    chamada: "Conhecer o Conexão BT",
  },
  {
    numero: "03",
    titulo: "Acompanhar",
    texto:
      "Quem se forma não é solto no mercado: mentoria, formação continuada e reciclagem seguem depois do curso.",
    href: "/o-ct",
    chamada: "Conhecer o CT",
  },
];

/**
 * O que o CT entrega, na página /o-ct.
 *
 * Eram sete itens em fila, e quatro deles (acompanhamento, mentoria, formação
 * continuada, reciclagem) descreviam o pós-curso do Conexão BT — assunto de uma
 * página inteira, contado ali com mais detalhe. Aqui ficou só o que é do CT, e o
 * pós-curso virou uma linha com link. O briefing continua coberto: nada sumiu do
 * site, só parou de ser dito duas vezes.
 */
export type Entrega = { titulo: string; texto: string };

export const entregas: Entrega[] = [
  {
    titulo: "Metodologia própria de ensino",
    texto:
      "O Método dos 5 Pilares define a ordem em que se ensina e o que se cobra em cada estágio. Está escrito, então qualquer professor do time aplica igual.",
  },
  {
    titulo: "Treinamento técnico e tático",
    texto:
      "Primeiro o gesto, depois a decisão. Quem inverte essa ordem joga bem contra quem é pior, e trava contra quem não é.",
  },
  {
    titulo: "Capacitação de professores",
    texto:
      "O Conexão BT, para quem já dá aula ou está começando. Metade do trabalho do CT é formar quem ensina — e o acompanhamento continua depois da formatura.",
  },
  {
    titulo: "Ambiente de desenvolvimento",
    texto:
      "Aluno, atleta e professor fazem parte da mesma estrutura, não de três serviços separados.",
  },
];

/**
 * ⚠️ Pedir ao Guto para esta página sair do rascunho:
 * - Ano de fundação do CT
 * - Descrição e fotos da sede (quantas quadras, cobertura, estrutura de apoio)
 * - Em quais outras cidades o CT já atua hoje, além de Porto Alegre e Palmares do Sul
 * - Se ele quiser citar números: alunos ativos, professores formados, tempo de casa
 */
