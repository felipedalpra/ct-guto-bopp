/**
 * Guto Bopp — trajetória, filosofia e o que ele faz hoje.
 *
 * ⚠️ RASCUNHO — VALIDAR COM O GUTO.
 * O briefing traz uma linha só sobre ele ("mais de 13 anos no Beach Tennis como atleta,
 * professor e treinador"). Todo o texto abaixo foi escrito a partir dessa linha e do
 * resto do briefing, e precisa do aval dele antes de publicar.
 *
 * Regra que guiou a escrita: nenhuma data, número, título, resultado de torneio ou
 * conquista foi inventado — só existe aqui o que o briefing sustenta. As fases da
 * trajetória são qualitativas de propósito, porque não temos os anos.
 * O que falta pedir a ele está listado no fim do arquivo.
 */

export const RASCUNHO = true;

/** Abertura da página: quem ele é, em três parágrafos. */
export const apresentacao = [
  "Guto Bopp está há mais de 13 anos dentro do Beach Tennis. Não em uma função só: jogou, deu aula, treinou atleta e hoje forma professores. É essa soma que sustenta o resto — a Metodologia Guto Bopp não veio de um curso nem de um livro, veio de mais de uma década corrigindo gente na areia e reparando no que funcionava.",
  "O CT Guto Bopp é o lugar onde esse trabalho virou estrutura. Ali ele treina alunos do iniciante ao competitivo, conduz o Conexão BT — a capacitação para professores — e acompanha quem já formou, com mentoria e reciclagem.",
  "A ideia por trás de tudo é simples e exigente ao mesmo tempo: aula boa não é a que cansa, é a que leva a algum lugar. Para isso ela precisa de objetivo, de correção que chegue na causa do erro e de uma ordem que o aluno consiga sentir de uma semana para a outra.",
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
      "Guto entrou no Beach Tennis pela quadra, jogando. É de lá que vem a parte do método que não se aprende em curso: a leitura do ponto, o que passa pela cabeça de quem está atrás da bola e a diferença entre treinar e só bater bola. Competir ensinou o que cobrar de um treino — e o que é perda de tempo.",
  },
  {
    chave: "professor",
    papel: "Professor",
    titulo: "Depois, aprender a ensinar",
    texto:
      "Dar aula é outro esporte. Saber executar o golpe não faz ninguém saber explicar o golpe, nem enxergar por que o aluno erra. Foi dando aula, todos os dias, que Guto foi montando o repertório de correção que hoje está no segundo pilar do método: apontar a causa do erro, não o sintoma, e devolver isso numa frase que o aluno consiga usar no ponto seguinte.",
  },
  {
    chave: "treinador",
    papel: "Treinador",
    titulo: "Então, estruturar o que funcionava",
    texto:
      "Como treinador, a conta muda: não é mais uma aula, é a evolução de alguém ao longo de meses. Isso obrigou a organizar o que até então era intuição — em que ordem se ensina, o que precisa estar consolidado antes do próximo passo, como saber se a semana rendeu. É desse trabalho que sai a Metodologia Guto Bopp.",
  },
  {
    chave: "formador",
    papel: "Formador",
    titulo: "Hoje, formar quem ensina",
    texto:
      "Um método que só o autor aplica não é método — é jeito de dar aula. O passo seguinte foi torná-lo transmissível: escrever, dividir em pilares e ensinar a outros professores. É isso que o Conexão BT faz, e é por isso que o CT tem um time que dá aula do mesmo jeito, e não sete professores independentes dividindo o mesmo espaço.",
  },
];

/** Princípios de ensino. Cada um está atrás de uma decisão concreta do método. */
export type Principio = { titulo: string; texto: string };

export const principios: Principio[] = [
  {
    titulo: "Aula não se improvisa",
    texto:
      "Toda aula é planejada antes de a bola entrar em quadra: objetivo definido, sequência de exercícios encadeada e tempo aproveitado. Chegar e ver o que sai é o oposto do que o CT faz.",
  },
  {
    titulo: "Erro tem causa",
    texto:
      "Corrigir o sintoma faz o aluno repetir o erro com outro nome. O trabalho é achar a causa — empunhadura, posição, decisão — e atacar ela, mesmo quando o sintoma some sozinho.",
  },
  {
    titulo: "Nada de pular etapa",
    texto:
      "A técnica é construída por camadas e cada uma precisa estar consolidada antes da seguinte. Aluno que aprende tática sem base técnica joga bem contra quem é pior que ele, e trava contra quem não é.",
  },
  {
    titulo: "O aluno tem que perceber a evolução",
    texto:
      "Se o aluno sai da quadra sem saber o que melhorou, a aula não fechou. Deixar claro o que foi trabalhado e o que mudou é parte do treino, não gentileza.",
  },
  {
    titulo: "Evolução é contínua, inclusive a do professor",
    texto:
      "Quem ensina também precisa de acompanhamento, mentoria e reciclagem. Professor que parou de estudar entrega ao aluno o repertório que tinha há cinco anos.",
  },
];

/** O que ele faz hoje, no dia a dia do CT. */
export const atuacao = [
  {
    titulo: "Treina atletas",
    texto:
      "Trabalho técnico e tático com quem compete ou quer competir, do desenvolvimento do golpe à construção do ponto.",
  },
  {
    titulo: "Dá aula do iniciante ao avançado",
    texto:
      "Turmas e particulares na sede, incluindo infantil — a mesma metodologia, ajustada ao nível de cada um.",
  },
  {
    titulo: "Forma professores",
    texto:
      "Conduz o Conexão BT, a capacitação do CT para quem já dá aula de Beach Tennis ou está começando a dar.",
  },
  {
    titulo: "Acompanha quem já formou",
    texto:
      "Mentoria, formação continuada e reciclagens para os professores do time e para quem passou pela capacitação.",
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
