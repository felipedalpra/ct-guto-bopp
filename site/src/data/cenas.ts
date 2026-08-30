/**
 * Cenas: vídeos verticais que entram DENTRO de uma seção de texto, ao lado da
 * prosa, para quebrar as páginas que hoje são um bloco corrido de parágrafo.
 *
 * Fonte: posts do Instagram do CT e do Prainha, baixados e reencodados para
 * `public/video/`. Nenhum é embed — o site não carrega script do Instagram.
 *
 * ⚠️ VALIDAR COM O GUTO: os clipes vêm de posts públicos, mas confirme que ele
 * quer todos no site institucional e que a autoria está certa (o vídeo curto da
 * confraternização foi postado pelo perfil da arena, não pelo CT; o anúncio
 * oficial é do próprio @ctgutobopp).
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
 * O anúncio oficial da chegada do CT ao Prainha — a peça de vitrine da página.
 *
 * Produção profissional do próprio CT (@ctgutobopp, 25/06/2026), 64s, e a única
 * gravação que temos em que o CT se apresenta inteiro: Guto abre dizendo que o
 * CT chega no Prainha, o tour mostra a estrutura (fachada, quadras cobertas,
 * ginásio, área de convivência), quatro professores falam — quadras e horários,
 * metodologia, nutricionista — e fecha com a equipe reunida.
 *
 * Fica no topo, ao lado do que o CT entrega, porque é ele que dá rosto e lugar
 * à lista: os cards dizem o que existe, o vídeo mostra onde e com quem.
 *
 * Baixado em 1080×1920 (bruto em `Videos/anuncio-ct-prainha/`, fora do
 * versionamento) e reencodado para 540×960.
 *
 * NÃO SERVE DE CAPA — testado, não suposto, para ninguém refazer a conta:
 * - A legenda queimada cobre 62,5s dos 64. Varrendo o quadro inteiro sobra 1,5s
 *   limpo (47,5–48,5s e o último meio segundo). Numa capa mobile de 390×844 a
 *   faixa da legenda cai em y 557–608: o vão entre o parágrafo e o botão.
 * - Recortar acima dela (a legenda fica a 66–70% da altura) joga fora 46% da
 *   largura para voltar ao 9:16, e o que sobra do b-roll é sala vazia e tela de
 *   alambrado — sem areia, sem bola, sem ninguém jogando.
 * - A capa roda muda e em loop, e quatro dos cinco planos são gente falando
 *   para a câmera.
 * O que resolveria a capa é o b-roll da estrutura sem legenda, que só existe no
 * projeto do editor. Pedir junto com o original em alta.
 */
export const anuncioCt: Cena = {
  arquivo: "/video/ct/anuncio.mp4",
  poster: "/video/ct/anuncio.jpg",
  titulo: "O CT se apresenta",
  legenda:
    "A estrutura no Prainha e a equipe inteira, apresentadas por quem dá a aula. Com som e legenda.",
  alt: "Os cinco professores do CT Guto Bopp reunidos na entrada da arena, à noite",
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
