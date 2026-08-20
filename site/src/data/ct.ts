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
  "O CT Guto Bopp é um Centro de Treinamento de Beach Tennis com sede na Prainha Beach Tennis, em Porto Alegre, e atuação também no Porto Sports, em Palmares do Sul. Atende do infantil ao competitivo, em turma, aula particular e treino de atleta, e capacita professores pelo curso Conexão BT.",
  "A diferença entre um CT e um professor com horário livre na quadra está em o que acontece quando o professor não é o mesmo. Aqui o time não é um grupo de profissionais independentes dividindo o espaço: os quatro professores passaram pela mesma capacitação, aplicam os mesmos cinco pilares e seguem sendo acompanhados depois de formados. Na prática, a aula de segunda com um professor tem a mesma estrutura da aula de quinta com outro — mesmo objetivo declarado no começo, mesma lógica de correção, mesmo fechamento.",
  "Isso importa mais do que parece para quem treina. Significa que a evolução do aluno não depende de conseguir horário com uma pessoa específica, que trocar de turma não recomeça o trabalho do zero, e que a criança que entra no infantil vai encontrar a mesma base técnica quando subir de nível.",
];

/**
 * As três frentes do CT — o resumo estrutural que vai para a home.
 *
 * A home mostra COMO o CT se organiza (estas três frentes); a página /o-ct mostra
 * o que cada uma entrega em detalhe (a lista `entregas`, abaixo). A separação
 * existe para a mesma informação não aparecer duas vezes com palavras diferentes.
 */
export type Frente = {
  numero: string;
  titulo: string;
  texto: string;
  href: string;
  chamada: string;
};

export const frentes: Frente[] = [
  {
    numero: "01",
    titulo: "Treinar",
    texto:
      "Do infantil ao competitivo, em turma ou particular. O método define um ponto de entrada para cada estágio — não existe turma única.",
    href: "/metodo",
    chamada: "Ver como funciona o treino",
  },
  {
    numero: "02",
    titulo: "Formar",
    texto:
      "O Conexão BT capacita professores a aplicar a metodologia na própria aula. Os quatro do time passaram por ele.",
    href: "/conexao-bt",
    chamada: "Conhecer o Conexão BT",
  },
  {
    numero: "03",
    titulo: "Acompanhar",
    texto:
      "Quem se forma não é solto no mercado: segue com mentoria, formação continuada e reciclagens.",
    href: "/o-ct",
    chamada: "Conhecer o CT",
  },
];

/** O que o CT entrega. Os seis primeiros itens são do briefing, palavra por palavra. */
export type Entrega = { titulo: string; texto: string };

export const entregas: Entrega[] = [
  {
    titulo: "Metodologia própria de ensino",
    texto:
      "O Método dos 5 Pilares não é uma lista de boas intenções: define a ordem em que se ensina, o que precisa estar consolidado antes de avançar e o que se cobra do aluno em cada estágio. Está escrito, e por isso pode ser aplicado igual por qualquer professor do time — e auditado quando não está sendo.",
  },
  {
    titulo: "Treinamento técnico e tático",
    texto:
      "As duas metades do jogo, na ordem: primeiro o gesto (empunhadura, posição de espera, deslocamento na areia, finalização) e só depois a decisão (posicionamento de dupla, construção de ponto, leitura de adversário). Quem inverte essa ordem joga bem contra quem é pior, e trava contra quem não é.",
  },
  {
    titulo: "Capacitação de professores",
    texto:
      "O Conexão BT, para quem já dá aula ou está começando a dar. Não é um extra do CT: metade do trabalho daqui é formar quem ensina, e é por isso que a capacitação tem página, curso e turma próprios em vez de virar um workshop ocasional.",
  },
  {
    titulo: "Acompanhamento e mentoria",
    texto:
      "Depois do curso, o professor leva caso real — o aluno que travou num golpe, a turma que não engatou, o pai que questiona o método no infantil — e resolve junto com o CT. É a parte que um curso fechado em si mesmo não entrega, porque os problemas difíceis só aparecem meses depois, com aluno de verdade.",
  },
  {
    titulo: "Formação continuada",
    texto:
      "Conteúdo novo depois da formatura, enquanto o professor dá aula. O Beach Tennis muda rápido: material, padrão de jogo e o nível médio do adversário não são os mesmos de cinco anos atrás. Professor que parou de estudar entrega ao aluno o repertório que tinha quando parou.",
  },
  {
    titulo: "Reciclagens e atualização profissional",
    texto:
      "Encontros periódicos com o time inteiro para revisar o método e corrigir vício — que todo professor cria, sozinho e sem perceber. É o mecanismo que mantém a aula igual entre professores diferentes ao longo do tempo, e não só no dia da formatura.",
  },
  {
    titulo: "Ambiente voltado ao desenvolvimento do Beach Tennis",
    texto:
      "O CT trata aluno, atleta e professor como parte da mesma estrutura, e não como três serviços separados: o método que o aluno recebe é o mesmo que o professor aprende a aplicar, e a capacitação existe justamente para que ele não pare no autor. A ambição declarada é uma comunidade que compartilha a mesma visão de ensino, não uma agenda de quadra cheia.",
  },
];

/**
 * ⚠️ Pedir ao Guto para esta página sair do rascunho:
 * - Ano de fundação do CT
 * - Descrição e fotos da sede (quantas quadras, cobertura, estrutura de apoio)
 * - Em quais outras cidades o CT já atua hoje, além de Porto Alegre e Palmares do Sul
 * - Se ele quiser citar números: alunos ativos, professores formados, tempo de casa
 */
