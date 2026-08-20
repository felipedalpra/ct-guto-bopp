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
  "O que separa Guto de muita gente que joga bem é ter passado pelas quatro funções na ordem, e não apenas em uma delas: competir ensinou o que cobrar de um treino, dar aula todos os dias ensinou a enxergar o erro do outro, treinar atleta obrigou a pensar em meses e não em uma hora de quadra, e formar professor obrigou a escrever o que até ali era intuição. Cada passagem deixou uma marca no método — e é por isso que ele é organizado em pilares encadeados, não numa lista de exercícios.",
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
      "Aqui entra o volume: milhares de horas olhando outra pessoa errar. É desse acúmulo que sai a parte mais difícil de transmitir do método — o repertório de correção. Saber que a bola foi na rede é fácil; saber que ela foi na rede por causa do pé de trás, e não da raquete, exige ter visto o mesmo erro centenas de vezes em gente diferente. Esse banco de padrões é o que vira o segundo pilar.",
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

/**
 * A rotina dele hoje. Não repete a lista de serviços do CT (isso é /o-ct):
 * descreve o que ocupa o dia DELE, que é outra informação.
 */
export const atuacao = [
  {
    titulo: "Está em quadra todo dia",
    texto:
      "Guto continua dando aula, e não só coordenando quem dá. É uma decisão de método: quem escreve a metodologia precisa continuar exposto ao aluno real, senão o material vira teoria e para de acompanhar como o jogo mudou.",
  },
  {
    titulo: "Treina quem compete",
    texto:
      "Trabalho continuado com atletas ao longo da temporada — planejamento por ciclo, preparação para torneio e ajuste fino de decisão sob pressão, que é onde o nível se define entre jogadores tecnicamente parecidos.",
  },
  {
    titulo: "Conduz o Conexão BT",
    texto:
      "Ele mesmo dá a capacitação, com Guilherme Basso como auxiliar certificado. O curso não foi delegado a terceiros porque boa parte do que se ensina ali é leitura de aula ao vivo, difícil de passar por apostila.",
  },
  {
    titulo: "Mantém o padrão do time",
    texto:
      "Acompanha os professores formados, revisa aula e conduz as reciclagens. É a função menos visível e a que sustenta a promessa do CT: que a aula seja a mesma independentemente de com quem o aluno treina.",
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
