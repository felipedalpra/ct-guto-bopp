/**
 * Conteúdo da página /conexao-bt — a capacitação de professores.
 *
 * Conteúdo alinhado à apostila do Conexão BT e à apresentação da Licença Oficial.
 * Informações de turma, investimento e datas ficam na seção específica da página.
 *
 * O que É fato do briefing, e por isso aparece como prova social na página: os quatro
 * professores do time passaram pelo Conexão BT, e Guilherme é certificado e auxiliar
 * do curso (ver data/professores.ts).
 */

export const RASCUNHO = false;

/** Por que o curso existe. Abre a página. */
export const porQueExiste = {
  titulo: "Saber jogar não ensina a dar aula",
  paragrafos: [
    "O Conexão BT existe para profissionalizar a atuação de professores de Beach Tennis e elevar o padrão das aulas. A formação combina aula teórica e prática para ampliar o repertório do professor e tornar suas aulas mais organizadas, dinâmicas e eficientes.",
    "O curso apresenta a Metodologia Guto Bopp e seus cinco pilares, trabalhando fundamentos técnicos, táticos e didáticos, além da organização e do planejamento das aulas. O objetivo é substituir o improviso por excelência didática, com resultados mais sólidos para os alunos e uma carreira mais estruturada para o professor.",
  ],
};

/** O que muda na prática — o antes e depois. */
export const oQueMuda = [
  {
    antes: "Professor como mero lançador de bolas",
    depois: "Professor que observa, intervém e conduz a evolução",
  },
  {
    antes: "Correção genérica, no sintoma do erro",
    depois: "Correção precisa, em tempo real e com feedback direto",
  },
  {
    antes: "Drills repetidos sem progressão",
    depois: "Exercícios fechados, semiabertos e abertos, na hora certa",
  },
  {
    antes: "Aula igual para todos",
    depois: "Estímulo individual dentro de um grupo nivelado",
  },
  {
    antes: "Professor que entrega apenas uma aula avulsa",
    depois: "Profissional que organiza a carreira e fideliza pela evolução",
  },
];

/** O conteúdo do curso, módulo a módulo — conforme os 5 pilares oficiais. */
export type Modulo = {
  numero: string;
  titulo: string;
  texto: string;
  itens: string[];
};

export const modulos: Modulo[] = [
  {
    numero: "01",
    titulo: "Técnica e repetição",
    texto:
      "Construção do movimento e eficiência biomecânica por meio de repetição qualificada.",
    itens: [
      "Preparação, ponto de contato e terminação",
      "Ativação, execução e reorganização",
      "Construção técnica antes dos golpes avançados",
    ],
  },
  {
    numero: "02",
    titulo: "Correção e intensidade",
    texto:
      "Como identificar a causa do erro, corrigir no ato e aproximar o treino da realidade do jogo.",
    itens: [
      "Diagnóstico técnico, de posicionamento e de tempo de bola",
      "Lançamento de bola: segurança, posição, trajetória, velocidade e peso",
      "Intensidade progressiva com deslocamento real",
    ],
  },
  {
    numero: "03",
    titulo: "Tática, estratégia e disciplina",
    texto:
      "Leitura de jogo, sistema de dupla, controle de bola e tomada de decisão.",
    itens: [
      "Movimentação horizontal e transição frente-fundo",
      "Bolas de segurança e bolas de risco",
      "Padrão de jogo e antecipação",
    ],
  },
  {
    numero: "04",
    titulo: "Criatividade didática",
    texto:
      "Como elaborar exercícios variados, objetivos e conectados à realidade do jogo.",
    itens: [
      "Drills fechados, semiabertos e abertos",
      "Planejamento semanal de evolução",
      "Sistemas de pontuação e alvos visuais",
    ],
  },
  {
    numero: "05",
    titulo: "Gestão e fidelização",
    texto:
      "Como organizar a carreira, posicionar a metodologia e manter os alunos conectados.",
    itens: [
      "Grupos fixos e nivelamento técnico",
      "Aulas fixas, recorrência e volume de treinos",
      "Acompanhamento, avaliação e entrega de resultados visíveis",
    ],
  },
];

/** O que vem depois do curso — tudo isso é do briefing. */
export const depoisDoCurso = [
  {
    titulo: "Acompanhamento",
    texto: "O professor formado segue acompanhado na aplicação do método com os próprios alunos.",
  },
  {
    titulo: "Mentoria",
    texto: "Espaço para levar caso real — o aluno que travou, a turma que não engatou.",
  },
  {
    titulo: "Formação continuada",
    texto: "Conteúdo novo depois da capacitação, para o repertório não parar na formatura.",
  },
  {
    titulo: "Reciclagem",
    texto: "Encontros periódicos para revisar o método e corrigir vícios.",
  },
];

/** Para quem é. */
export const paraQuem = {
  serve: [
    "Professor de Beach Tennis já em atuação que quer estruturar a própria aula",
    "Quem está começando a dar aula e não quer aprender no erro, em cima do aluno",
    "Atleta que vai virar professor e precisa da parte didática",
    "Professor de outro esporte migrando para o Beach Tennis",
  ],
  naoServe: [
    "Quem quer aprender a jogar — nesse caso o caminho é o treino, não a capacitação",
    "Quem procura certificação rápida sem aplicar o método em quadra",
  ],
};

/**
 * ⚠️ Pedir ao Guto para esta página sair do rascunho — é o mais urgente do site:
 * - Formato: presencial, online ou híbrido? Onde acontece?
 * - Carga horária e duração (dias, fins de semana, semanas)
 * - Conteúdo real do curso — os módulos acima são dedução a partir dos 5 pilares
 * - Preço e formas de pagamento, ou se prefere "valor no WhatsApp"
 * - Data da próxima turma e quantas vagas
 * - Emite certificado? Reconhecido por qual entidade (CBT, CBBT, FGBT)?
 * - Pré-requisito real para entrar
 * - Quantos professores já se formaram até hoje
 */
