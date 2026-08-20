/**
 * Vídeos de aula gravados na quadra do CT.
 *
 * Fonte: os três vídeos que o cliente mandou, todos da mesma sessão de
 * capacitação (Guto conduzindo, professores sentados assistindo). Cortados em
 * 15s cada e guardados em `public/video/aulas/`.
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
    titulo: "Explicação em quadra",
    legenda: "Correção falada com a turma parada — uma coisa por vez.",
  },
  {
    id: "aula-3",
    arquivo: "/video/aulas/aula-3.mp4",
    poster: "/video/aulas/aula-3.jpg",
    titulo: "Sequência de exercício",
    legenda: "A cesta de bolas e o exercício encadeado que vem depois.",
  },
];
