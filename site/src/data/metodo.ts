/**
 * Conteúdo de apoio da página /metodo: o que o método resolve, como ele chega
 * na quadra em cada nível, como é uma aula e em que formatos o CT trabalha.
 *
 * ⚠️ RASCUNHO — VALIDAR COM O GUTO.
 * Escrito a partir do briefing (5 pilares, públicos atendidos, formatos citados nas
 * fichas dos professores). Nenhuma duração, preço, frequência ou tamanho de turma
 * foi inventado — o que falta está listado no fim do arquivo.
 */

export const RASCUNHO = true;

/** O problema que o método resolve. Abre a página, antes dos pilares. */
export const oProblema = {
  titulo: "A diferença entre treinar e bater bola",
  paragrafos: [
    "Quase todo mundo que joga Beach Tennis já teve uma aula que era, na prática, uma hora de bola cruzada. Rende suor, rende risada e rende pouca evolução: sem objetivo definido, sem correção que chegue na causa do erro e sem ordem entre uma semana e a outra, o aluno melhora até o ponto em que o talento dele sozinho alcança — e para ali.",
    "A Metodologia Guto Bopp nasceu de mais de 13 anos de quadra justamente para atacar isso. Ela organiza o ensino em cinco pilares que dependem um do outro, na ordem: sem organização não há correção útil, sem base técnica não há tática que se sustente, e sem clareza no fim da aula o aluno não percebe o que evoluiu.",
    "Não é teoria trazida de fora do esporte. É o que Guto Bopp foi construindo como atleta, professor e treinador, escrito de um jeito que outro professor consiga aplicar.",
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
      "Deslocamento na areia — a base que muda tudo em relação à quadra dura",
      "Primeiros golpes com volume de repetição suficiente para virar padrão",
      "Regra e contagem, para o aluno já conseguir jogar ponto",
    ],
  },
  {
    nome: "Intermediário",
    publico: "Já joga, quer sair do platô",
    foco: "Consolidar a técnica e abrir a tática",
    itens: [
      "Correção das causas que travaram a evolução — normalmente base, não golpe",
      "Ampliação do repertório: mais de uma resposta para a mesma bola",
      "Posicionamento de dupla e construção de ponto",
      "Golpes sob pressão, não só na bola fácil",
    ],
  },
  {
    nome: "Avançado e competitivo",
    publico: "Compete ou quer competir",
    foco: "Decisão, consistência e jogo de dupla",
    itens: [
      "Leitura de adversário e escolha de padrão de jogo",
      "Consistência sob pressão — o mesmo gesto no ponto que decide",
      "Trabalho de dupla: função de cada um dentro do ponto",
      "Preparação específica para torneio",
    ],
  },
  {
    nome: "Infantil",
    publico: "Crianças",
    foco: "Coordenação, gosto pelo jogo e base correta",
    itens: [
      "Base técnica desde o começo — corrigir depois custa muito mais",
      "Aula com dinâmica e jogo, sem virar recreação sem objetivo",
      "Coordenação e deslocamento na areia adequados à idade",
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
      "O professor chega com o objetivo do dia definido e a sequência de exercícios montada, encadeada com o que foi trabalhado na aula anterior. Nada é escolhido na hora.",
  },
  {
    fase: "Início",
    titulo: "Aquecimento com intenção",
    texto:
      "O aquecimento já trabalha deslocamento e ritmo na areia, e o objetivo da aula é dito em voz alta: o aluno entra sabendo o que vai treinar.",
  },
  {
    fase: "Miolo",
    titulo: "Trabalho técnico, depois decisão",
    texto:
      "Primeiro o gesto, com volume de repetição e correção na causa do erro. Só depois entram os exercícios com decisão, em que a mesma bola admite mais de uma resposta.",
  },
  {
    fase: "Aplicação",
    titulo: "Ponto jogado, com o tema do dia dentro",
    texto:
      "O que foi treinado é levado para situação de jogo — porque golpe que só funciona no exercício não passou no teste.",
  },
  {
    fase: "Fim",
    titulo: "O que evoluiu, dito com todas as letras",
    texto:
      "A aula fecha retomando o objetivo: o que melhorou, o que ficou pendente e o que treinar até a próxima. É o quinto pilar acontecendo.",
  },
];

/** Formatos de treino, conforme as fichas dos professores e o briefing. */
export const formatos = [
  {
    nome: "Turma",
    texto:
      "Aula em grupo, com alunos de nível compatível. É onde a parte tática e o jogo de dupla rendem mais, porque há gente suficiente para jogar ponto de verdade.",
  },
  {
    nome: "Particular",
    texto:
      "Um professor para um aluno (ou uma dupla). Volume de correção muito maior por hora de quadra — indicado para destravar um ponto específico ou preparar competição.",
  },
  {
    nome: "Infantil",
    texto:
      "Turmas de criança, com a mesma base técnica e a dinâmica ajustada à idade. Vários professores do time atendem esse público.",
  },
  {
    nome: "Atleta",
    texto:
      "Trabalho continuado com quem compete: planejamento por temporada, preparação para torneio e acompanhamento de evolução.",
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
