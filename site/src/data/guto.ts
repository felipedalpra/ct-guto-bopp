/**
 * Guto Bopp — trajetória, filosofia e o que ele faz hoje.
 *
 * ⚠️ RASCUNHO — VALIDAR COM O GUTO.
 * O briefing traz uma linha só sobre ele ("mais de 13 anos no Beach Tennis como atleta,
 * professor e treinador"). Todo o texto abaixo foi escrito a partir dessa linha e do
 * resto do briefing, e precisa do aval dele antes de publicar.
 *
 * Os "cinco princípios de ensino" que existiam aqui saíram: eram os cinco pilares
 * do método reescritos com outro nome, e o método tem uma página só dele.
 *
 * Regra que guiou a escrita: nenhuma data, número, título, resultado de torneio ou
 * conquista foi inventado — só existe aqui o que o briefing sustenta. As fases da
 * trajetória são qualitativas de propósito, porque não temos os anos.
 * O que falta pedir a ele está listado no fim do arquivo.
 */

export const RASCUNHO = true;

/** Abertura da página: quem ele é, em três parágrafos. */
export const apresentacao = [
  "Guto Bopp está há mais de 13 anos dentro do Beach Tennis — e não em uma função só: jogou, deu aula, treinou atleta e hoje forma professores.",
  "É essa soma que sustenta o método. A Metodologia Guto Bopp não veio de um curso nem de um livro: veio de mais de uma década corrigindo gente na areia e reparando no que funcionava.",
];

/** A trajetória em fases. Sem anos: o briefing não trouxe as datas. */
export type Fase = {
  chave: string;
  papel: string;
  titulo: string;
  texto: string;
};

export const trajetoria: Fase[] = [
  {
    chave: "atleta",
    papel: "Atleta",
    titulo: "Primeiro, aprender a competir",
    texto:
      "Guto entrou pela quadra, jogando. Competir ensina o que cobrar de um treino — e o que é perda de tempo.",
  },
  {
    chave: "professor",
    papel: "Professor",
    titulo: "Depois, aprender a ensinar",
    texto:
      "Milhares de horas olhando outra pessoa errar. Saber que a bola foi na rede é fácil; saber que foi por causa do pé de trás exige ter visto o mesmo erro em muita gente diferente.",
  },
  {
    chave: "treinador",
    papel: "Treinador",
    titulo: "Então, estruturar o que funcionava",
    texto:
      "Como treinador a conta muda: não é uma aula, é a evolução de alguém ao longo de meses. Isso obrigou a organizar o que era intuição.",
  },
  {
    chave: "formador",
    papel: "Formador",
    titulo: "Hoje, formar quem ensina",
    texto:
      "Um método que só o autor aplica não é método, é jeito de dar aula. Torná-lo transmissível é o que o Conexão BT faz.",
  },
];

/**
 * A faixa do Guto em quadra, que ocupa o lugar da antiga lista "A rotina dele
 * hoje".
 *
 * A lista tinha quatro itens de texto logo depois dos quatro da trajetória —
 * duas listas seguidas, mesma forma, mesma superfície clara — e três deles
 * repetiam o que /o-ct e /conexao-bt já contam (conduz o curso, acompanha o
 * time, treina quem compete). Sobrou o único ponto que era só dele, e ele virou
 * imagem em vez de item.
 */
export const assinatura = {
  rotulo: "No dia a dia",
  titulo: "Ainda dá aula todo dia",
  texto:
    "Não virou coordenador de prancheta: quem escreve o método continua na areia, exposto ao aluno real. É de lá que o método sai — e é lá que ele é corrigido.",
};

/**
 * ⚠️ Pedir ao Guto para esta página sair do rascunho:
 * - Em que ano começou no Beach Tennis, e de onde veio (outro esporte? tênis?)
 * - Ano em que começou a dar aula e em que criou o Conexão BT
 * - Certificações e níveis que ele tem (CBT, CBBT, TOSS, outros)
 * - Resultados como atleta que ele queira citar — torneios, rankings, seleção
 * - Quantos professores já formou e quantos alunos passam pelo CT hoje
 * - Se quiser, uma frase dele em primeira pessoa para abrir a página
 */
