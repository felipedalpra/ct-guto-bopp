/**
 * Vídeos de aula gravados na quadra do CT.
 *
 * Fonte: os vídeos de capacitação que o cliente mandou (Guto conduzindo,
 * professores assistindo). Cortados em 15s cada e guardados em
 * `public/video/aulas/`. Os três são de momentos diferentes da aula — antes eram
 * três trechos quase iguais da mesma sessão.
 *
 * ⚠️ VALIDAR COM O GUTO: as legendas abaixo descrevem o que se vê na imagem, que
 * é seguro, mas ninguém confirmou qual conteúdo estava sendo dado em cada uma.
 * Se ele disser o tema de cada trecho, a legenda fica muito mais útil.
 *
 * Não têm autoplay de propósito: são três vídeos com áudio numa página que já
 * carrega o loop da capa, e o visitante deve escolher qual assistir.
 */

export const RASCUNHO = true;

export type Aula = {
  id: string;
  arquivo: string;
  poster: string;
  titulo: string;
  legenda: string;
};

export const aulas: Aula[] = [
  {
    id: "aula-1",
    arquivo: "/video/aulas/aula-1.mp4",
    poster: "/video/aulas/aula-1.jpg",
    titulo: "Demonstração de golpe",
    legenda: "Guto mostra o movimento antes de soltar a turma para repetir.",
  },
  {
    id: "aula-2",
    arquivo: "/video/aulas/aula-2.mp4",
    poster: "/video/aulas/aula-2.jpg",
    titulo: "Briefing antes do exercício",
    legenda: "Guto explica a tarefa para a turma antes de mandar todo mundo para a quadra.",
  },
  {
    id: "aula-3",
    arquivo: "/video/aulas/aula-3.mp4",
    poster: "/video/aulas/aula-3.jpg",
    titulo: "Correção individual",
    legenda: "No meio do exercício, o ajuste vai um a um — com a cesta de bolas ao lado.",
  },
];
