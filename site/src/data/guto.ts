/**
 * Guto Bopp — trajetória, filosofia e o que ele faz hoje.
 *
 * Conteúdo alinhado à apresentação oficial do CT e à apostila do Conexão BT.
 *
 * Os "cinco princípios de ensino" que existiam aqui saíram: eram os cinco pilares
 * do método reescritos com outro nome, e o método tem uma página só dele.
 *
 * Regra que guiou a escrita: nenhuma data, número, título, resultado de torneio ou
 * conquista foi inventado — só existe aqui o que o briefing sustenta. As fases da
 * trajetória são qualitativas de propósito, porque não temos os anos.
 * O que falta pedir a ele está listado no fim do arquivo.
 */

export const RASCUNHO = false;

/** Abertura da página: quem ele é, em três parágrafos. */
export const apresentacao = [
  "Guto Bopp constrói sua trajetória no Beach Tennis há mais de 13 anos, como treinador, gestor esportivo e incentivador da modalidade. Nesse caminho, contribuiu para o crescimento do esporte no Rio Grande do Sul e no Brasil.",
  "Foi fundador do Point Sul, o primeiro clube indoor de Beach Tennis do país, liderou a Seleção Gaúcha em conquistas como o tetracampeonato da Copa das Federações e somou quatro títulos no Interclubes FGT. Também atuou como Coordenador Técnico da Federação Gaúcha de Tênis e hoje coordena projetos e acompanha atletas e profissionais na Arena Dom Pedro.",
  "A Metodologia Guto Bopp transforma essa experiência em uma forma estruturada de ensinar: técnica e repetição, correção e intensidade, tática, estratégia e disciplina, criatividade didática, gestão e fidelização. Guto possui capacitação nível Azul pela CBT e segue atuando na formação de professores e no desenvolvimento do Beach Tennis.",
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
      "A experiência como atleta trouxe a visão de jogo e o critério para reconhecer o que realmente contribui para a evolução.",
  },
  {
    chave: "professor",
    papel: "Professor",
    titulo: "Depois, aprender a ensinar",
    texto:
      "Como treinador, Guto desenvolveu o olhar para identificar a causa do erro e transformar a correção em uma orientação aplicável.",
  },
  {
    chave: "treinador",
    papel: "Treinador",
    titulo: "Então, estruturar o que funcionava",
    texto:
      "Na coordenação técnica e na gestão esportiva, organizou processos para acompanhar a evolução de atletas, equipes e profissionais.",
  },
  {
    chave: "formador",
    papel: "Formador",
    titulo: "Hoje, formar quem ensina",
    texto:
      "Hoje, o Conexão BT torna essa experiência transmissível: forma professores para aplicar oficialmente a metodologia com mais organização, repertório e eficiência.",
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
