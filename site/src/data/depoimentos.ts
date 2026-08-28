/** Textos editoriais da seção de quem treina no CT. */

export const RASCUNHO = false;

export type Depoimento = {
  texto: string;
  autor: string;
  contexto: string;
  perfil: "aluno" | "professor";
};

export const depoimentos: Depoimento[] = [
  {
    texto:
      "Eu já jogava há um tempo, mas parecia que fazia sempre as mesmas coisas. No CT comecei a entender melhor o porquê de cada bola e parei de jogar no automático.",
    autor: "Marina",
    contexto: "Aluna · turma intermediária",
    perfil: "aluno",
  },
  {
    texto:
      "Eu saí do Conexão BT com outra cabeça para dar aula. Hoje eu planejo melhor, observo mais o aluno e consigo explicar a correção sem complicar.",
    autor: "Rafael",
    contexto: "Professor formado no Conexão BT",
    perfil: "professor",
  },
  {
    texto:
      "O melhor é que o Guto lembra do que a gente precisa trabalhar. A aula não começa do zero toda semana e dá para sentir que o treino vai acompanhando a tua evolução.",
    autor: "Bruno",
    contexto: "Aluno · treino competitivo",
    perfil: "aluno",
  },
];
