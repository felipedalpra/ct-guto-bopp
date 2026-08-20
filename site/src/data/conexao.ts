/**
 * Conteúdo da página /conexao-bt — a capacitação de professores.
 *
 * ⚠️ RASCUNHO — VALIDAR COM O GUTO.
 * Este é o arquivo mais dependente de informação que ainda não temos: o briefing
 * cita o Conexão BT sem formato, duração, conteúdo, preço ou próxima turma. Os
 * módulos abaixo foram derivados dos 5 pilares (é a estrutura natural do curso, mas
 * é dedução minha) e o restante veio do que o briefing diz sobre o que o CT oferece
 * a professores. Nenhuma carga horária, valor ou data foi inventada.
 *
 * O que É fato do briefing, e por isso aparece como prova social na página: os quatro
 * professores do time passaram pelo Conexão BT, e Guilherme é certificado e auxiliar
 * do curso (ver data/professores.ts).
 */

export const RASCUNHO = true;

/** Por que o curso existe. Abre a página. */
export const porQueExiste = {
  titulo: "Saber jogar não ensina a dar aula",
  paragrafos: [
    "Quase todo professor de Beach Tennis entrou na profissão pelo mesmo caminho: jogava bem, alguém pediu uma aula, e a coisa cresceu. É um começo legítimo — e é o motivo de tanta aula boa de energia e pobre de estrutura.",
    "Enxergar por que o aluno erra, escolher a palavra que ele consegue usar e montar uma sequência que leve a algum lugar: nada disso vem junto com o talento de jogador. O Conexão BT ensina o professor a aplicar os cinco pilares na própria aula, com o próprio aluno.",
  ],
};

/** O que muda na prática — o antes e depois. */
export const oQueMuda = [
  {
    antes: "Aula improvisada na hora",
    depois: "Aula planejada, com objetivo definido antes de entrar em quadra",
  },
  {
    antes: "“Solta mais o braço”",
    depois: "Correção específica, na causa do erro e no tempo do jogo",
  },
  {
    antes: "Aluno que evolui por acaso",
    depois: "Progressão por camadas, cada uma consolidada antes da próxima",
  },
  {
    antes: "Turma que se esvazia sem explicação",
    depois: "Aluno que percebe a evolução e por isso volta na semana seguinte",
  },
  {
    antes: "Cada aula recomeçando do zero",
    depois: "Um plano que liga uma semana à outra e permite cobrar resultado",
  },
];

/** O conteúdo do curso, módulo a módulo — derivado dos 5 pilares. */
export type Modulo = {
  numero: string;
  titulo: string;
  texto: string;
  itens: string[];
};

export const modulos: Modulo[] = [
  {
    numero: "01",
    titulo: "Planejar a aula",
    texto:
      "Como sair do improviso: definir o objetivo, montar a sequência e encaixar a aula de hoje num plano maior.",
    itens: [
      "Objetivo de aula e objetivo de ciclo",
      "Sequência de exercícios encadeada",
      "Como planejar turma com níveis diferentes",
    ],
  },
  {
    numero: "02",
    titulo: "Enxergar e corrigir o erro",
    texto:
      "O módulo que mais muda a aula do professor: separar sintoma de causa e devolver a correção de um jeito aplicável.",
    itens: [
      "Cadeia de causas: da bola que saiu até a empunhadura",
      "Uma correção por vez, e como escolher qual",
      "A frase que o aluno consegue usar no ponto seguinte",
    ],
  },
  {
    numero: "03",
    titulo: "Construir a técnica",
    texto:
      "Em que ordem se ensina, quanto volume cada camada exige e como saber que uma camada está pronta.",
    itens: [
      "Progressão por camadas: base, deslocamento, golpe, finalização",
      "Critérios para avançar de camada",
      "Adaptações para infantil e para quem vem de outro esporte",
    ],
  },
  {
    numero: "04",
    titulo: "Ensinar a decidir",
    texto:
      "Como levar o aluno de reagir à bola para escolher o que fazer com ela.",
    itens: [
      "Exercícios com mais de uma resposta possível",
      "Posicionamento e função dentro da dupla",
      "Como treinar decisão sem virar só jogo solto",
    ],
  },
  {
    numero: "05",
    titulo: "Sustentar a qualidade",
    texto:
      "O pilar que segura o aluno na turma: intensidade, clima e clareza do que foi trabalhado.",
    itens: [
      "Calibrar intensidade por nível",
      "Conduzir o clima da turma",
      "Fechar a aula deixando a evolução explícita",
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
