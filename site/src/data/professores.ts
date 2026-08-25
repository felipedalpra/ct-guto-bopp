/**
 * Time de professores do CT Guto Bopp.
 * Fonte: fichas de cadastro em `Cadastro professores/` (ver ../../../memory.md).
 *
 * Previsão do cliente: 7 professores. Recebidos até agora: 6 fichas.
 * Pendências: 1 ficha.
 */

export type Professor = {
  slug: string;
  nome: string;
  papel: string;
  local: string;
  desde: string;
  atende: string[];
  formacao: string[];
  diferencial: string;
  frase?: string;
  instagram?: string;
  whatsappE164?: string;
  foto?: string;
};

/** Guto abre a seção — é o fundador e a origem do método. */
export const fundador: Professor = {
  slug: "guto-bopp",
  nome: "Guto Bopp",
  papel: "Fundador e head coach",
  local: "Prainha Beach Tennis · Porto Alegre",
  desde: "Mais de 13 anos no Beach Tennis",
  atende: ["Atletas", "Professores", "Turmas e particular"],
  formacao: ["Criador da Metodologia Guto Bopp", "Criador do curso Conexão BT"],
  diferencial:
    "Atleta, professor e treinador. Transformou mais de uma década de quadra em um método de ensino estruturado e replicável.",
  instagram: "ctgutobopp",
  // O WhatsApp do fundador é o número principal do CT (ver site.ts).
  whatsappE164: "+5551998086780",
  foto: "/img/guto-bopp.jpg",
};

export const professores: Professor[] = [
  {
    slug: "guilherme-basso",
    nome: "Guilherme Basso Niedersberg",
    papel: "Professor",
    local: "Prainha Beach Tennis · Porto Alegre",
    desde: "5 anos de experiência",
    atende: ["Iniciante", "Intermediário", "Avançado", "Turmas e particular"],
    formacao: [
      "Certificado e auxiliar do Conexão BT",
      "Nível azul CBT",
    ],
    diferencial:
      "Trabalho tático do Beach Tennis, com preferência por alto rendimento.",
    frase: "Sempre em busca de melhorar e obter resultados.",
    instagram: "Gui_NiedersbergBT",
    whatsappE164: "+5551992921014",
    foto: "/img/professores/guilherme.jpg",
  },
  {
    slug: "lucas-constant",
    nome: "Lucas Constant da Silva",
    papel: "Professor",
    local: "Prainha, Maccabi · Porto Alegre · Arena Brisa (Canoas) e Aloha (Novo Hamburgo)",
    desde: "5 anos como professor",
    atende: ["Iniciante", "Intermediário", "Avançado", "Turmas e particular"],
    formacao: [
      "Bacharel em Educação Física",
      "Capacitação CBT nível azul",
    ],
    diferencial:
      "Ex-atleta profissional de badminton, com mais de 20 anos em esportes de raquete. Hoje joga a categoria Pro no Beach Tennis.",
    frase:
      "A nossa evolução no Beach Tennis depende da nossa ambição, constância e repetição no treino.",
    instagram: "lucasconstantbt",
    whatsappE164: "+5551982150313",
    foto: "/img/professores/lucas.jpg",
  },
  {
    slug: "mariana-widholzer",
    nome: "Mariana dos Santos Widholzer",
    papel: "Professora",
    local: "Prainha Beach Tennis · Porto Alegre",
    desde: "Dá aula desde 2023",
    atende: ["Iniciante", "Intermediário", "Infantil", "Turmas e particular"],
    formacao: [
      "CBT níveis verde e amarelo",
      "Capacitação de professores CT Guto Bopp",
    ],
    diferencial:
      "Aulas dinâmicas, com muita técnica, tática e uma boa risada.",
    frase:
      "A leveza sustenta a constância, e é ela que faz com que a gente evolua.",
    instagram: "mariwidholzer",
    whatsappE164: "+5551999802661",
    foto: "/img/professores/mariana.jpg",
  },
  {
    slug: "mateus-kunzler",
    nome: "Mateus Kunzler",
    papel: "Professor",
    local: "Prainha Beach Tennis · Porto Alegre",
    desde: "3 anos como professor",
    atende: ["Iniciante", "Intermediário", "Infantil", "Turmas e particular"],
    formacao: [
      "Educação Física — UFRGS (2013)",
      "Conexão BT com Guto Bopp",
      "Módulos 1 e 2 CBBT",
    ],
    diferencial:
      "Coach da Seleção Gaúcha FGBT em 2024 e 2025, Interclubes e Desafio dos Points. Entusiasta da parte tática do jogo.",
    frase: "A bolinha já está vindo, se desesperar é pior.",
    instagram: "mateuskunzler",
    whatsappE164: "+5551981585243",
    foto: "/img/professores/mateus.jpg",
  },
  {
    slug: "rafael-cunha",
    nome: "Rafael Cunha da Silva",
    papel: "Professor",
    local: "Porto Sports · Palmares do Sul",
    desde: "2 anos como professor",
    atende: ["Iniciante", "Intermediário", "Infantil", "Turmas e particular"],
    formacao: [
      "Graduando em Educação Física — Uniasselvi",
      "Conexão BT com Guto Bopp",
      "Instrutor de Beach Tennis e Beach Tennis Kids (TOSS)",
    ],
    diferencial:
      "Vivência como atleta e como professor, unindo competição a evolução técnica e tomada de decisão.",
    frase:
      "Ensinar Beach Tennis vai muito além de ensinar golpes. Meu objetivo é fazer cada aluno entender o jogo, evoluir dentro da quadra e gostar cada vez mais do esporte.",
    instagram: "rafaelcunhass",
    whatsappE164: "+5551980441255",
    foto: "/img/professores/rafael.jpg",
  },
  {
    slug: "raphael-santanna",
    nome: "Raphael Doernte de Sant'Anna",
    papel: "Professor",
    local: "Curta Beach Sports (Gramado) · Arena Cinco e Complex (Igrejinha) · Arena Yes Play (Taquara)",
    desde: "4 anos como professor",
    atende: [
      "Iniciante",
      "Intermediário até categoria B",
      "Particular",
      "Turmas de até 4",
    ],
    formacao: [
      "Graduação em Fisioterapia e Educação Física",
      "CBT verde e amarelo",
      "Curso de formação com Guto Bopp",
    ],
    diferencial:
      "Ajustes técnicos precisos e criação de pensamento lógico para entender o jogo de forma objetiva.",
    instagram: "raphaelds",
    whatsappE164: "+5551997293371",
    foto: "/img/professores/raphael.jpg",
  },
];

/** Vagas ainda não preenchidas (7 previstos − 6 fichas recebidas). */
export const professoresPendentes = 1;

/** O time inteiro na ordem em que aparece no site: fundador primeiro. */
export const time: Professor[] = [fundador, ...professores];

/**
 * Endereço da pessoa no site.
 *
 * O Guto não tem ficha em /professores/[slug]: ele tem a página /guto-bopp, que é
 * bem mais que uma ficha. Duas páginas sobre a mesma pessoa seriam conteúdo
 * duplicado — então o card dele na grade aponta para a página completa.
 */
export function hrefProfessor(p: Professor): string {
  return p.slug === fundador.slug ? "/guto-bopp" : `/professores/${p.slug}`;
}

/** Busca por slug — usada pelas páginas /professores/[slug]. */
export function professorPorSlug(slug: string): Professor | undefined {
  return professores.find((p) => p.slug === slug);
}
