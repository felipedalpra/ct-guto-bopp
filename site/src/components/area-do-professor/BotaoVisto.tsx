"use client";

import { useState, useTransition } from "react";
import { alternarVisto } from "@/app/area-do-professor/progresso-actions";

export default function BotaoVisto({ materialId, visto }: { materialId: string; visto: boolean }) {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function alternar() {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await alternarVisto(materialId, visto);
      if ("erro" in resultado) setErro(resultado.erro);
    });
  }

  return (
    <div>
      <button type="button" onClick={alternar} disabled={pendente} className="material-cartao__visto" aria-pressed={visto}>
        {pendente ? "Salvando…" : visto ? "✓ Visto" : "Marcar como visto"}
      </button>
      {erro ? <p className="mt-2 text-sm text-red-300" role="alert">{erro}</p> : null}
    </div>
  );
}
