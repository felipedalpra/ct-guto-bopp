/**
 * Método dos 5 Pilares — Metodologia Guto Bopp.
 *
 * ⚠️ RASCUNHO — VALIDAR COM O GUTO.
 * Nomes e conceitos conforme a apostila do Conexão BT e a apresentação da
 * Licença Oficial do CT Guto Bopp.
 *
 * Cada pilar tem quatro camadas de texto, na ordem em que o leitor as encontra:
 *   resumo     — uma linha, subtítulo do pilar em /metodo
 *   ganho      — o resultado em poucas palavras, para a lista da home
 *   descricao  — o parágrafo do pilar
 *   naAula     — como ele aparece na prática, em quadra
 *   oQueMuda   — o que o aluno ganha quando o pilar está sendo cumprido
 *
 * `zona` posiciona o pilar no diagrama de quadra da seção (coordenadas 0–1,
 * origem no canto superior esquerdo da quadra).
 */

export const RASCUNHO = true;

export type Pilar = {
  numero: string;
  nome: string;
  resumo: string;
  ganho: string;
  descricao: string;
  naAula: string[];
  oQueMuda: string;
  zona: { x: number; y: number };
};

export const pilares: Pilar[] = [
  {
    numero: "01",
    nome: "Técnica e repetição",
    resumo: "Construir o movimento e repetir com eficiência.",
    ganho:
      "O gesto deixa de depender do acaso e ganha consistência.",
    descricao:
      "Construção do movimento e eficiência biomecânica: ativar, executar e reorganizar. A técnica sólida evita que o aluno encontre um teto e pare de evoluir.",
    naAula: [
      "Preparação, ponto de contato e terminação do movimento",
      "Repetições com foco na qualidade do gesto",
      "Reorganização para preparar a próxima bola",
    ],
    oQueMuda:
      "O aluno constrói um padrão técnico mais eficiente e consistente.",
    zona: { x: 0.22, y: 0.2 },
  },
  {
    numero: "02",
    nome: "Correção e intensidade",
    resumo: "Intervir com precisão e aproximar o treino do jogo.",
    ganho:
      "O professor deixa de ser apenas lançador e se torna interventor.",
    descricao:
      "Identificar a causa do erro, corrigir em tempo real e aumentar progressivamente a intensidade para simular situações reais de jogo.",
    naAula: [
      "Diferenciação entre erro técnico, de posicionamento e de tempo de bola",
      "Feedback curto e direto, com apoio visual quando necessário",
      "Velocidade, peso e deslocamento ajustados progressivamente",
    ],
    oQueMuda:
      "O aluno entende o que precisa ajustar e aprende a responder sob uma intensidade próxima à do jogo.",
    zona: { x: 0.75, y: 0.28 },
  },
  {
    numero: "03",
    nome: "Tática, estratégia e disciplina",
    resumo: "Ler o jogo, controlar a bola e decidir melhor.",
    ganho:
      "O aluno joga com controle e propósito.",
    descricao:
      "Leitura de jogo, antecipação, posicionamento da dupla e tomada de decisão. A consistência nasce do controle de bola e da disciplina para escolher a jogada certa.",
    naAula: [
      "Movimentação horizontal em conjunto e transição entre frente e fundo",
      "Bolas de segurança para manter o controle do ponto",
      "Bolas de risco usadas quando há oportunidade clara de acelerar",
    ],
    oQueMuda:
      "O aluno passa a antecipar, escolher padrões e jogar com inteligência e segurança.",
    zona: { x: 0.5, y: 0.5 },
  },
  {
    numero: "04",
    nome: "Criatividade didática",
    resumo: "Criar exercícios que desafiam e fazem evoluir.",
    ganho:
      "A aula mantém o aluno motivado e em evolução.",
    descricao:
      "Planejar exercícios variados, com foco único e progressão semanal, transformando a repetição técnica em situações próximas da pressão do jogo.",
    naAula: [
      "Drills fechados, semiabertos e abertos",
      "Um foco por exercício, sem misturar situações desnecessariamente",
      "Pontuação e alvos visuais para aproximar o treino do jogo",
    ],
    oQueMuda:
      "O aluno entende o objetivo de cada exercício, enfrenta desafios progressivos e percebe evolução real.",
    zona: { x: 0.24, y: 0.74 },
  },
  {
    numero: "05",
    nome: "Gestão e fidelização",
    resumo: "Organizar a carreira e manter o aluno conectado.",
    ganho:
      "A metodologia vira uma carreira sustentável e uma relação contínua com o aluno.",
    descricao:
      "Gestão da carreira, posicionamento profissional, grupos fixos, nivelamento e modelos de recorrência que favorecem a evolução do aluno e a organização do professor.",
    naAula: [
      "Turmas separadas por nível técnico",
      "Aulas fixas e pacotes que favorecem continuidade",
      "Acompanhamento extra-quadra e avaliações periódicas",
    ],
    oQueMuda:
      "O aluno enxerga resultados, permanece conectado ao processo e evolui com acompanhamento contínuo.",
    zona: { x: 0.77, y: 0.8 },
  },
];
