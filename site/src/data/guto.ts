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
 * A rotina dele hoje. Não repete a lista de serviços do CT (isso é /o-ct):
 * descreve o que ocupa o dia DELE, que é outra informação.
 */
export const atuacao = [
  {
    titulo: "Está em quadra todo dia",
    texto:
      "Continua dando aula, e não só coordenando. Quem escreve o método precisa seguir exposto ao aluno real.",
  },
  {
    titulo: "Treina quem compete",
    texto:
      "Planejamento por temporada, preparação para torneio e decisão sob pressão.",
  },
  {
    titulo: "Conduz o Conexão BT",
    texto:
      "Ele mesmo dá a capacitação, com Guilherme Basso como auxiliar certificado.",
  },
  {
    titulo: "Mantém o padrão do time",
    texto:
      "Acompanha os professores formados, revisa aula e conduz as reciclagens.",
  },
];

/**
 * ⚠️ Pedir ao Guto para esta página sair do rascunho:
 * - Em que ano começou no Beach Tennis, e de onde veio (outro esporte? tênis?)
 * - Ano em que começou a dar aula e em que criou o Conexão BT
 * - Certificações e níveis que ele tem (CBT, CBBT, TOSS, outros)
 * - Resultados como atleta que ele queira citar — torneios, rankings, seleção
 * - Quantos professores já formou e quantos alunos passam pelo CT hoje
 * - Se quiser, uma frase dele em primeira pessoa para abrir a página
 */
