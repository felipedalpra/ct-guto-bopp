/**
 * Dados estruturados (JSON-LD) — os nós do grafo, montados por página.
 *
 * Serve tanto ao SEO clássico quanto ao GEO: motores de resposta usam esse grafo
 * para saber, sem ambiguidade, o que é o CT, onde fica, quem é o Guto, quais
 * cursos existem e quais perguntas cada página responde.
 *
 * Num site de várias páginas o grafo não pode ser um bloco só: `FAQPage` precisa
 * ficar na página em que as perguntas realmente aparecem, e `Course` na página do
 * curso — senão o Google descarta a marcação. Por isso aqui ficam as *peças*:
 * `grafoBase` vai no layout (todas as páginas) e cada página acrescenta as suas.
 *
 * Regra do arquivo: só descreve fato confirmado pelo cliente. Depoimentos
 * editoriais não entram como `review` ou `aggregateRating` sem avaliações reais
 * verificadas, para não transformar copy do site em prova social estruturada.
 */

import { site } from "./site";
import { proximaTurma, turmaAberta } from "./turma";
import { pilares } from "./pilares";
import { time, type Professor } from "./professores";
import type { Pergunta } from "./faq";

export const idNegocio = `${site.url}/#organizacao`;
export const idPessoa = `${site.url}/#guto-bopp`;

/** Endereço absoluto de uma rota interna. */
export const urlDe = (caminho: string) =>
  caminho === "/" ? site.url : `${site.url}${caminho}`;

/**
 * `@id` estável de cada professor, para os nós se referenciarem entre páginas.
 * O Guto usa o `@id` do fundador — ele é uma pessoa só no grafo, com a página
 * /guto-bopp no lugar de uma ficha em /professores.
 */
export const idProfessor = (p: Professor) =>
  p.slug === "guto-bopp" ? idPessoa : `${site.url}/professores/${p.slug}#pessoa`;

/** O negócio, o fundador e o site. Entra em todas as páginas, via layout. */
export const grafoBase = [
  {
    "@type": ["SportsActivityLocation", "SportsClub"],
    "@id": idNegocio,
    name: site.nome,
    alternateName: site.nomeCompleto,
    description: site.descricao,
    url: site.url,
    slogan: site.lema,
    telephone: site.whatsapp.e164,
    image: `${site.url}/img/logo-ct-guto-bopp.png`,
    logo: `${site.url}/img/logo-ct-guto-bopp.png`,
    sameAs: [site.instagram.url],
    founder: { "@id": idPessoa },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.endereco.rua} - ${site.endereco.bairro}`,
      addressLocality: site.endereco.cidade,
      addressRegion: site.endereco.estado,
      postalCode: site.endereco.cep,
      addressCountry: site.endereco.pais,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.endereco.lat,
      longitude: site.endereco.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: site.horario.abre,
        closes: site.horario.fecha,
      },
    ],
    areaServed: [
      { "@type": "City", name: "Porto Alegre" },
      { "@type": "City", name: "Palmares do Sul" },
      { "@type": "State", name: site.endereco.estadoNome },
    ],
    sport: "Beach Tennis",
    employee: time.map((p) => ({ "@id": idProfessor(p) })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Treinos e capacitação",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Treino de Beach Tennis",
            description:
              "Aulas em turma e particulares para iniciantes, intermediários e avançados, incluindo infantil, dentro da Metodologia Guto Bopp.",
            serviceType: "Aula de Beach Tennis",
            url: urlDe("/metodo"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Conexão BT — capacitação de professores",
            description:
              "Curso de capacitação para professores de Beach Tennis, com acompanhamento, mentoria, formação continuada e reciclagens.",
            serviceType: "Capacitação profissional",
            url: urlDe("/conexao-bt"),
          },
        },
      ],
    },
  },
  {
    "@type": "Person",
    "@id": idPessoa,
    name: "Guto Bopp",
    jobTitle: "Treinador de Beach Tennis",
    description:
      "Atleta, professor e treinador de Beach Tennis há mais de 13 anos. Criador da Metodologia Guto Bopp e do curso Conexão BT.",
    image: `${site.url}/img/guto-bopp.jpg`,
    url: urlDe("/guto-bopp"),
    mainEntityOfPage: urlDe("/guto-bopp"),
    worksFor: { "@id": idNegocio },
    knowsAbout: [
      "Beach Tennis",
      "Treinamento esportivo",
      "Formação de professores de Beach Tennis",
    ],
  },
  {
    "@type": "WebSite",
    "@id": `${site.url}/#site`,
    url: site.url,
    name: site.nome,
    inLanguage: "pt-BR",
    publisher: { "@id": idNegocio },
  },
];

/** O curso Conexão BT. Só na página /conexao-bt. */
export const nodoCurso = {
  "@type": "Course",
  "@id": `${urlDe("/conexao-bt")}#curso`,
  name: "Conexão BT",
  description:
    "Curso teórico e prático de capacitação do CT Guto Bopp para professores iniciantes e intermediários de Beach Tennis, com fundamentos técnicos, táticos e didáticos e aplicação do Método dos 5 Pilares.",
  url: urlDe("/conexao-bt"),
  inLanguage: "pt-BR",
  teaches: pilares.map((p) => p.nome),
  provider: { "@id": idNegocio },
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "Professor de Beach Tennis",
  },
  // A turma com data marcada. Sai do ar junto com a seção, pelo mesmo `turmaAberta()`.
  ...(turmaAberta()
    ? {
        hasCourseInstance: [
          {
            "@type": "CourseInstance",
            courseMode: "onsite",
            name: `Conexão BT — turma de ${proximaTurma.dias} ${proximaTurma.mes}`,
            startDate: iso(proximaTurma.inicio),
            endDate: iso(proximaTurma.fim),
            location: { "@id": idNegocio },
            inLanguage: "pt-BR",
          },
        ],
      }
    : {}),
};

/** AAAA-MM-DD em horário local — o Date.toISOString() converteria para UTC e,
    de madrugada no fuso do Brasil, entregaria o dia anterior. */
function iso(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** As perguntas de uma página. O `@id` fica preso à rota em que elas aparecem. */
export const nodoFaq = (caminho: string, itens: Pergunta[]) => ({
  "@type": "FAQPage",
  "@id": `${urlDe(caminho)}#faq`,
  mainEntity: itens.map((item) => ({
    "@type": "Question",
    name: item.pergunta,
    acceptedAnswer: { "@type": "Answer", text: item.resposta },
  })),
});

/** Um professor. Vai na ficha dele; o `@id` do Guto é o do fundador. */
export const nodoProfessor = (p: Professor) => ({
  "@type": "Person",
  "@id": p.slug === "guto-bopp" ? idPessoa : idProfessor(p),
  name: p.nome,
  jobTitle: p.papel,
  description: p.diferencial,
  url: urlDe(`/professores/${p.slug}`),
  worksFor: { "@id": idNegocio },
  ...(p.foto ? { image: `${site.url}${p.foto}` } : {}),
  ...(p.instagram ? { sameAs: [`https://instagram.com/${p.instagram}`] } : {}),
  knowsAbout: ["Beach Tennis", ...p.atende],
});

/**
 * Trilha de navegação. Num site de várias páginas é ela que diz ao Google
 * onde cada página fica na hierarquia — e é o que vira o caminho exibido
 * no lugar da URL crua no resultado de busca.
 */
export const nodoTrilha = (itens: { titulo: string; href: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [{ titulo: "Início", href: "/" }, ...itens].map(
    (item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.titulo,
      item: urlDe(item.href),
    })
  ),
});
