/**
 * Conteúdo de apoio da página /metodo: o que o método resolve, como ele chega
 * na quadra em cada nível, como é uma aula e em que formatos o CT trabalha.
 *
 * Conteúdo alinhado à apostila do Conexão BT e à apresentação da Licença Oficial.
 */

export const RASCUNHO = false;

/** O problema que o método resolve. Abre a página, antes dos pilares. */
export const oProblema = {
  titulo: "A diferença entre treinar e bater bola",
  paragrafos: [
    "Uma aula de Beach Tennis precisa fazer mais do que colocar a bola em movimento. Sem técnica construída por repetição, correção precisa, intensidade progressiva e situações que desenvolvam a decisão, o aluno pode até jogar — mas não entende como evoluir.",
    "A Metodologia Guto Bopp organiza o trabalho do professor em cinco pilares: técnica e repetição; correção e intensidade; tática, estratégia e disciplina; criatividade didática; e gestão e fidelização. A proposta vai da qualidade do movimento ao acompanhamento do aluno e à organização da carreira.",
  ],
};

/** Como o método chega em cada nível. */
export type Nivel = {
  nome: string;
  publico: string;
  foco: string;
  itens: string[];
};

export const niveis: Nivel[] = [
  {
    nome: "Iniciante",
    publico: "Nunca jogou, ou jogou pouco",
    foco: "Base técnica e leitura do espaço",
    itens: [
      "Empunhadura e posição de espera antes de qualquer golpe",
      "Deslocamento na areia — o que mais muda em relação à quadra dura",
      "Regra e contagem, para já conseguir jogar ponto",
    ],
  },
  {
    nome: "Intermediário",
    publico: "Já joga, quer sair do platô",
    foco: "Consolidar a técnica e abrir a tática",
    itens: [
      "Correção das causas que travaram a evolução — normalmente base, não golpe",
      "Mais de uma resposta possível para a mesma bola",
      "Posicionamento de dupla e construção de ponto",
    ],
  },
  {
    nome: "Avançado e competitivo",
    publico: "Compete ou quer competir",
    foco: "Decisão, consistência e jogo de dupla",
    itens: [
      "Leitura de adversário e escolha de padrão de jogo",
      "O mesmo gesto no ponto que decide",
      "Preparação específica para torneio",
    ],
  },
  {
    nome: "Infantil",
    publico: "Crianças",
    foco: "Coordenação, gosto pelo jogo e base correta",
    itens: [
      "Base técnica desde o começo — corrigir depois custa muito mais",
      "Aula com jogo e dinâmica, sem virar recreação sem objetivo",
      "Ambiente em que a criança quer voltar na semana seguinte",
    ],
  },
];

/** Como é uma aula, do começo ao fim. Mostra a organização acontecendo. */
export type Etapa = { fase: string; titulo: string; texto: string };

export const anatomiaDaAula: Etapa[] = [
  {
    fase: "Antes",
    titulo: "A aula é planejada fora da quadra",
    texto:
      "O professor chega com o objetivo do dia e a sequência montada, encaixada no que veio na aula anterior.",
  },
  {
    fase: "Início",
    titulo: "Aquecimento com intenção",
    texto:
      "Já trabalha deslocamento e ritmo na areia, e o objetivo do dia é dito em voz alta.",
  },
  {
    fase: "Miolo",
    titulo: "Trabalho técnico, depois decisão",
    texto:
      "Primeiro o gesto, com repetição e correção na causa. Só depois os exercícios em que a mesma bola admite mais de uma resposta.",
  },
  {
    fase: "Aplicação",
    titulo: "Ponto jogado, com o tema do dia dentro",
    texto:
      "Golpe que só funciona no exercício não passou no teste.",
  },
  {
    fase: "Fim",
    titulo: "O que evoluiu, dito com todas as letras",
    texto:
      "O que melhorou, o que ficou pendente e o que treinar até a próxima.",
  },
];

/** Formatos de treino, conforme as fichas dos professores e o briefing. */
export const formatos = [
  {
    nome: "Turma",
    texto:
      "Grupo de nível compatível. É onde a tática e o jogo de dupla rendem mais, porque há gente para jogar ponto de verdade.",
  },
  {
    nome: "Particular",
    texto:
      "Um professor para um aluno ou uma dupla. Muito mais correção por hora de quadra.",
  },
  {
    nome: "Infantil",
    texto: "Turmas de criança, mesma base técnica, dinâmica ajustada à idade.",
  },
  {
    nome: "Atleta",
    texto:
      "Trabalho continuado com quem compete: planejamento por temporada e preparação para torneio.",
  },
];

/**
 * ⚠️ Pedir ao Guto para esta página sair do rascunho:
 * - Duração da aula e frequência semanal recomendada
 * - Quantos alunos por turma
 * - Valores (aula avulsa, mensal, particular) ou se prefere só "consultar no WhatsApp"
 * - Se há avaliação de nível antes de entrar numa turma
 * - Se os nomes dos níveis acima batem com os que ele usa no dia a dia
 */
