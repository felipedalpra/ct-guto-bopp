/**
 * Mapa de rotas do site.
 *
 * Fonte única para o menu do cabeçalho, o rodapé e o sitemap.xml: rota nova
 * entra aqui uma vez e aparece nos três. `rotulo` é o texto curto do menu;
 * `resumo` é a linha que descreve a página no rodapé.
 *
 * As páginas de professor (/professores/[slug]) não entram aqui — são geradas
 * a partir de `data/professores.ts`.
 */

export type Rota = {
  href: string;
  rotulo: string;
  resumo: string;
};

export const rotas: Rota[] = [
  {
    href: "/guto-bopp",
    rotulo: "Guto Bopp",
    resumo: "A trajetória e a filosofia de ensino de quem criou o método.",
  },
  {
    href: "/metodo",
    rotulo: "Método",
    resumo: "O Método dos 5 Pilares, pilar a pilar.",
  },
  {
    href: "/o-ct",
    rotulo: "O CT",
    resumo: "Quem é o Guto Bopp, a história e o que o CT entrega.",
  },
  {
    href: "/conexao-bt",
    rotulo: "Conexão BT",
    resumo: "A capacitação para professores de Beach Tennis.",
  },
  {
    href: "/professores",
    rotulo: "Professores",
    resumo: "O time que está na areia com você.",
  },
  {
    href: "/contato",
    rotulo: "Contato",
    resumo: "Endereço, horários, mapa e WhatsApp.",
  },
];
