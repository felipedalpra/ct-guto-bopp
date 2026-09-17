"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PapelUsuario } from "@/types/area-do-professor";

const ABAS = [
  { href: "/area-do-professor", rotulo: "Materiais", soLider: false },
  { href: "/area-do-professor/admin", rotulo: "Professores", soLider: true },
  {
    href: "/area-do-professor/admin/materiais",
    rotulo: "Gerenciar Materiais",
    soLider: true,
  },
] as const;

export default function SubNav({ role }: { role: PapelUsuario }) {
  const caminho = usePathname();

  const abas = ABAS.filter((aba) => !aba.soLider || role === "lider");

  const bate = (href: string) =>
    href === "/area-do-professor"
      ? caminho === href
      : caminho === href || caminho.startsWith(`${href}/`);

  // Prefixo mais específico vence: em /area-do-professor/admin/materiais,
  // tanto "/area-do-professor/admin" (Professores) quanto
  // "/area-do-professor/admin/materiais" (Gerenciar Materiais) batem por
  // prefixo — só a aba mais longa deve ficar marcada como atual.
  const abaAtivaHref = abas.reduce<string | null>((melhor, aba) => {
    if (!bate(aba.href)) return melhor;
    if (!melhor || aba.href.length > melhor.length) return aba.href;
    return melhor;
  }, null);

  return (
    <nav className="subnav-professor" aria-label="Navegação da Área do Professor">
      {abas.map((aba) => (
        <Link
          key={aba.href}
          href={aba.href}
          aria-current={aba.href === abaAtivaHref ? "page" : undefined}
        >
          {aba.rotulo}
        </Link>
      ))}
    </nav>
  );
}
