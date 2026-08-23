"use client";

import { useEffect, useState } from "react";
import { diasParaTurma, proximaTurma } from "@/data/turma";

/**
 * "Faltam N dias" — a única urgência real que este anúncio tem.
 *
 * Fica no cliente e só depois de montar: o número depende do dia em que a pessoa
 * abre a página, e uma página estática não sabe disso na hora do build. Até
 * montar não ocupa espaço nenhum, então nada salta quando o texto aparece.
 */
export default function ContagemTurma() {
  const [dias, setDias] = useState<number | null>(null);

  useEffect(() => setDias(diasParaTurma()), []);

  if (dias === null) return null;

  const texto =
    dias > 1
      ? `Faltam ${dias} dias`
      : dias === 1
        ? "É amanhã"
        : dias === 0
          ? "Começa hoje"
          : dias >= -1
            ? "Acontecendo agora"
            : `Turma de ${proximaTurma.dias} ${proximaTurma.mes}`;

  return (
    <p className="turma__contagem">
      <span className="turma__pulso" aria-hidden="true" />
      {texto}
    </p>
  );
}
