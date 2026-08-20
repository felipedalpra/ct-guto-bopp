/**
 * ⚠️ CONTEÚDO PROVISÓRIO — NÃO PUBLICAR SEM SUBSTITUIR.
 *
 * O material do cliente não trouxe nenhum depoimento real. Os textos abaixo são
 * rascunhos de estrutura, escritos para dimensionar o layout, e devem ser trocados
 * por depoimentos verdadeiros (com autorização de quem falou) antes do site ir ao ar.
 *
 * Enquanto `RASCUNHO` for `true`, a seção mostra um aviso visível em ambiente de
 * desenvolvimento e os depoimentos ficam FORA dos dados estruturados de SEO —
 * publicar review falso em JSON-LD é violação das diretrizes do Google.
 */

export const RASCUNHO = true;

export type Depoimento = {
  texto: string;
  autor: string;
  contexto: string;
  perfil: "aluno" | "professor";
};

export const depoimentos: Depoimento[] = [
  {
    texto:
      "Eu jogava havia dois anos e sentia que tinha travado. Em três meses de treino com método, entendi o que estava errado no meu posicionamento e comecei a ganhar pontos que antes eu só corria atrás.",
    autor: "Nome do aluno",
    contexto: "Aluno · turma intermediária",
    perfil: "aluno",
  },
  {
    texto:
      "O Conexão BT mudou a forma como eu monto minha aula. Antes eu improvisava a sequência; hoje chego na quadra com objetivo definido e o aluno percebe a diferença.",
    autor: "Nome do professor",
    contexto: "Professor formado no Conexão BT",
    perfil: "professor",
  },
  {
    texto:
      "O que me segurou aqui foi o acompanhamento. Não é aula solta, é alguém olhando a tua evolução semana a semana e ajustando o que precisa.",
    autor: "Nome do aluno",
    contexto: "Aluna · treino de alto rendimento",
    perfil: "aluno",
  },
];
