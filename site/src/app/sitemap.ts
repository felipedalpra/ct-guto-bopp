import type { MetadataRoute } from "next";
import { rotas } from "@/data/rotas";
import { professores } from "@/data/professores";
import { site } from "@/data/site";

/**
 * Sitemap.
 *
 * Sai de `data/rotas.ts` e de `data/professores.ts`: página nova entra no menu,
 * no rodapé e aqui de uma vez só. A prioridade desce da home para as seções e
 * das seções para as fichas de professor.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  return [
    {
      url: site.url,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...rotas.map((rota) => ({
      url: `${site.url}${rota.href}`,
      lastModified: agora,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...professores.map((pessoa) => ({
      url: `${site.url}/professores/${pessoa.slug}`,
      lastModified: agora,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
