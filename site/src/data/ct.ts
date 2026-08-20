/**
 * Conteúdo da página /o-ct: o que é o Centro de Treinamento, para quem é,
 * o que entrega e onde funciona.
 *
 * ⚠️ RASCUNHO — VALIDAR COM O GUTO.
 * A missão e a lista de diferenciais vêm do briefing, literalmente. O resto foi
 * escrito a partir dele. Nada sobre a estrutura física da sede foi inventado —
 * ainda não recebemos fotos nem descrição do espaço.
 */

export const RASCUNHO = true;

export const missao =
  "Desenvolver atletas e professores através de uma metodologia estruturada, prática e voltada para a evolução contínua.";

/** Quem somos — os parágrafos de abertura da página. */
export const quemSomos = [
  "O CT Guto Bopp é um Centro de Treinamento de Beach Tennis em Porto Alegre, nascido da experiência de Guto Bopp dentro do esporte e da necessidade de transformar essa experiência em um método de ensino que outra pessoa consiga aplicar.",
  "O CT reúne três frentes que se sustentam: o treinamento de alunos e atletas, a capacitação de professores pelo Conexão BT e o acompanhamento contínuo de quem já foi formado. As três correm sobre a mesma base — a Metodologia Guto Bopp, o Método dos 5 Pilares.",
  "Isso muda o que significa treinar aqui. O time não é um grupo de professores independentes dividindo o mesmo espaço: todos passaram pela mesma formação e ensinam pela mesma metodologia, o que faz a aula ter a mesma estrutura seja qual for o professor.",
];

/** O que o CT entrega. Os seis primeiros itens são do briefing, palavra por palavra. */
export type Entrega = { titulo: string; texto: string };

export const entregas: Entrega[] = [
  {
    titulo: "Metodologia própria de ensino",
    texto:
      "O Método dos 5 Pilares, construído em quadra ao longo de mais de 13 anos — e escrito de forma que qualquer professor do time aplique do mesmo jeito.",
  },
  {
    titulo: "Treinamento técnico e tático",
    texto:
      "Do gesto na base até a construção do ponto, do iniciante ao competitivo, em turma ou particular, incluindo infantil.",
  },
  {
    titulo: "Capacitação de professores",
    texto:
      "O Conexão BT, curso para quem já dá aula ou está começando a dar — capacitar professores é metade do trabalho do CT, não um extra.",
  },
  {
    titulo: "Acompanhamento e mentoria",
    texto:
      "Quem se forma não é solto no mercado: segue com acompanhamento próximo e mentoria dentro do CT.",
  },
  {
    titulo: "Formação continuada",
    texto:
      "A formação não termina no curso. O professor do CT continua estudando enquanto dá aula — se ele parar, o repertório que chega no aluno envelhece.",
  },
  {
    titulo: "Reciclagens e atualização profissional",
    texto:
      "Encontros de atualização para revisar o método, corrigir vícios e alinhar o time inteiro.",
  },
  {
    titulo: "Ambiente voltado ao desenvolvimento do Beach Tennis",
    texto:
      "Mais do que treinar, o CT quer formar uma comunidade de profissionais que compartilham a mesma visão sobre ensino e evolução no esporte.",
  },
];

/** Para quem o CT é — os três públicos, com o caminho de cada um. */
export const publicos = [
  {
    chave: "aluno",
    rotulo: "Para quem quer aprender",
    titulo: "Do primeiro dia na areia ao jogo com intenção",
    texto:
      "Não precisa saber jogar para começar. O método define por onde cada um entra conforme o nível, e a base técnica é construída antes da tática — inclusive para crianças.",
    href: "/metodo",
    chamada: "Ver como funciona o treino",
  },
  {
    chave: "atleta",
    rotulo: "Para quem compete",
    titulo: "Consistência quando o ponto decide",
    texto:
      "Trabalho continuado de técnica, tática e jogo de dupla, com preparação específica para torneio e acompanhamento ao longo da temporada.",
    href: "/metodo",
    chamada: "Ver o trabalho com atletas",
  },
  {
    chave: "professor",
    rotulo: "Para quem dá aula",
    titulo: "Uma aula que se sustenta em método",
    texto:
      "O Conexão BT ensina a estruturar a aula, corrigir na causa do erro e aplicar os cinco pilares — com acompanhamento, mentoria e reciclagens depois da formação.",
    href: "/conexao-bt",
    chamada: "Conhecer o Conexão BT",
  },
];

/**
 * ⚠️ Pedir ao Guto para esta página sair do rascunho:
 * - Ano de fundação do CT
 * - Descrição e fotos da sede (quantas quadras, cobertura, estrutura de apoio)
 * - Em quais outras cidades o CT já atua hoje, além de Porto Alegre e Palmares do Sul
 * - Se ele quiser citar números: alunos ativos, professores formados, tempo de casa
 */
