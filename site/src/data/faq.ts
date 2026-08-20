/**
 * Perguntas frequentes.
 *
 * Serve a dois públicos: quem lê a página e os motores de resposta (Google AI
 * Overviews, ChatGPT, Perplexity), que extraem respostas diretas e citáveis.
 * Por isso cada resposta é auto-contida: repete o sujeito ("O CT Guto Bopp…")
 * em vez de depender do contexto da pergunta.
 *
 * As perguntas são separadas por público porque cada bloco vive numa página
 * diferente: as de aluno fecham /o-ct, as de professor fecham /conexao-bt.
 * Um FAQ único numa página própria diluiria os dois — e o JSON-LD de FAQPage
 * precisa ficar na mesma página em que as perguntas aparecem.
 *
 * Regra: só entra aqui informação confirmada pelo cliente. Nada de estimativa.
 */

export type Pergunta = { pergunta: string; resposta: string };

/** Dúvidas de quem quer treinar. Fecham a página /o-ct. */
export const faqAlunos: Pergunta[] = [
  {
    pergunta: "Onde fica o CT Guto Bopp?",
    resposta:
      "O CT Guto Bopp treina na sede Prainha Beach Tennis, na Av. Saturnino de Brito, 738, em Porto Alegre (RS), das 07h às 20h todos os dias. O centro também atua em outras cidades, e um dos professores do time dá aula no Porto Sports, em Palmares do Sul (RS).",
  },
  {
    pergunta: "Preciso já saber jogar Beach Tennis para treinar no CT?",
    resposta:
      "Não. O CT Guto Bopp atende do iniciante ao avançado, em turmas e aulas particulares, incluindo aulas infantis. O Método dos 5 Pilares define por onde cada aluno começa de acordo com o nível em que está.",
  },
  {
    pergunta: "O que é a Metodologia Guto Bopp?",
    resposta:
      "A Metodologia Guto Bopp é o método de ensino do CT, organizado em cinco pilares: organização, correção, desenvolvimento técnico, desenvolvimento tático e qualidade da aula. Ela nasceu de mais de 13 anos de Guto Bopp dentro do Beach Tennis como atleta, professor e treinador.",
  },
  {
    pergunta: "Como faço para começar a treinar no CT Guto Bopp?",
    resposta:
      "O contato é direto pelo WhatsApp (51) 99808-6780 ou pelo Instagram @ctgutobopp. É por ali que se combina o horário da primeira aula e o formato de treino, em turma ou particular.",
  },
];

/** Dúvidas de quem dá aula. Fecham a página /conexao-bt. */
export const faqProfessores: Pergunta[] = [
  {
    pergunta: "O que é o Conexão BT?",
    resposta:
      "O Conexão BT é o curso de capacitação do CT Guto Bopp voltado a professores de Beach Tennis. Ele ensina o professor a estruturar suas aulas, corrigir com clareza e aplicar a Metodologia Guto Bopp, com acompanhamento, mentoria e reciclagens depois da formação.",
  },
  {
    pergunta: "Sou professor de Beach Tennis. O CT atende quem já dá aula?",
    resposta:
      "Sim. Capacitar professores é uma parte central do trabalho do CT Guto Bopp. Além do curso Conexão BT, o centro oferece acompanhamento, mentoria, formação continuada e reciclagens para professores que já atuam.",
  },
  {
    pergunta: "Preciso de formação em Educação Física para fazer o Conexão BT?",
    resposta:
      "O Conexão BT é voltado a quem já dá aula de Beach Tennis ou está começando a dar. O time formado pelo CT Guto Bopp reúne tanto graduados em Educação Física quanto professores vindos da prática do esporte. Os pré-requisitos de cada turma são combinados direto com o CT pelo WhatsApp (51) 99808-6780.",
  },
];

/** Todas as perguntas, para os pontos que precisam da lista inteira. */
export const faq: Pergunta[] = [...faqAlunos, ...faqProfessores];
