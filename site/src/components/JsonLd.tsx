import { grafoBase } from "@/data/schema";

/**
 * Emite um grafo JSON-LD na página.
 *
 * O layout renderiza `<JsonLd base />` uma vez, com os nós que valem para o site
 * inteiro (o CT, o Guto, o WebSite). Cada página acrescenta os seus nós pelo
 * `nodos` — FAQPage, Course, Person, BreadcrumbList — que precisam estar na
 * página em que o conteúdo correspondente realmente aparece.
 *
 * As peças ficam em `src/data/schema.ts`.
 */
export default function JsonLd({
  base = false,
  nodos = [],
}: {
  base?: boolean;
  nodos?: unknown[];
}) {
  const grafo = {
    "@context": "https://schema.org",
    "@graph": base ? [...grafoBase, ...nodos] : nodos,
  };

  return (
    <script
      type="application/ld+json"
      // O conteúdo vem só de constantes do próprio projeto, sem entrada de usuário.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(grafo) }}
    />
  );
}
