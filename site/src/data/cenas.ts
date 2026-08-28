/**
 * Cenas: vídeos verticais que entram DENTRO de uma seção de texto, ao lado da
 * prosa, para quebrar as páginas que hoje são um bloco corrido de parágrafo.
 *
 * Fonte: posts do Instagram do CT e do Prainha, baixados e reencodados para
 * `public/video/`. Nenhum é embed — o site não carrega script do Instagram.
 *
 * ⚠️ VALIDAR COM O GUTO: os dois clipes vêm de posts públicos, mas confirme que
 * ele quer os dois no site institucional e que a autoria está certa (o vídeo do
 * Prainha foi postado pelo perfil da arena, não pelo CT).
 */

export const RASCUNHO = true;

export type Cena = {
  arquivo: string;
  poster: string;
  titulo: string;
  legenda: string;
  /** Texto alternativo do poster: descreve a imagem parada, não o vídeo. */
  alt: string;
};

/**
 * A chegada do CT ao Prainha, anunciada na confraternização da arena.
 *
 * O original tem 53s e vira churrasco depois da metade — o corte fica só nos
 * 13s do anúncio ("começa uma nova etapa do Prainha… tá chegando o CT do Guto
 * Bopp… vem e começa a treinar"). É gravação de celular em 480p com filtro de
 * VHS: entra como bastidor ao lado do endereço, não como peça de vitrine.
 */
export const chegadaPrainha: Cena = {
  arquivo: "/video/ct/prainha.mp4",
  poster: "/video/ct/prainha.jpg",
  titulo: "O anúncio na arena",
  legenda:
    "A parceria com a Prainha sendo contada para a casa cheia, na confraternização da arena.",
  alt: "Anúncio da chegada do CT Guto Bopp, na confraternização da Prainha Beach Tennis",
};

/**
 * Guto dando aula, na sequência de forehand e saque.
 *
 * Serve à página do método porque mostra o pilar da correção acontecendo: ele
 * para, explica a causa do erro e só então devolve o exercício.
 */
export const aulaGuto: Cena = {
  arquivo: "/video/metodo/aula-guto.mp4",
  poster: "/video/metodo/aula-guto.jpg",
  titulo: "Correção em aula",
  legenda:
    "Guto interrompe o exercício para explicar a decisão antes do golpe — forehand ou saque, a escolha vem primeiro.",
  alt: "Guto Bopp com raquete e bolas na mão, explicando um golpe durante a aula",
};
