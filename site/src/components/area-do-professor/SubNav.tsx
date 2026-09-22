"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PapelUsuario } from "@/types/area-do-professor";

const ABAS_PROFESSOR = [
  { href: "/area-do-professor", rotulo: "Início" },
] as const;

const ABAS_LIDER = [
  { href: "/area-do-professor", rotulo: "Visão geral" },
  { href: "/area-do-professor/admin/materiais", rotulo: "Conteúdos" },
  { href: "/area-do-professor/admin/trilhas", rotulo: "Trilhas" },
  { href: "/area-do-professor/admin", rotulo: "Professores" },
] as const;

export default function SubNav({ role }: { role: PapelUsuario }) {
  const caminho = usePathname();
  const router = useRouter();
  const [destino, setDestino] = useState<string | null>(null);

  useEffect(() => setDestino(null), [caminho]);

  const abas = role === "lider" ? ABAS_LIDER : ABAS_PROFESSOR;

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
          prefetch
          aria-current={aba.href === abaAtivaHref ? "page" : undefined}
          aria-busy={destino === aba.href || undefined}
          onMouseEnter={() => router.prefetch(aba.href)}
          onFocus={() => router.prefetch(aba.href)}
          onTouchStart={() => router.prefetch(aba.href)}
          onClick={() => {
            if (aba.href !== caminho) setDestino(aba.href);
          }}
        >
          {destino === aba.href ? (
            <>
              <span className="subnav-professor__carregando" aria-hidden="true" />
              <span className="sr-only">Abrindo </span>
            </>
          ) : null}
          {aba.rotulo}
        </Link>
      ))}
    </nav>
  );
}
