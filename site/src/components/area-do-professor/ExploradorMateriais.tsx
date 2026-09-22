"use client";

import { useMemo, useState } from "react";
import CartaoMaterial from "./CartaoMaterial";
import type { InteracoesDoMaterial, Material } from "@/types/area-do-professor";

const FILTROS: { valor: Material["tipo"] | "todos"; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "video", rotulo: "Vídeos" },
  { valor: "arquivo", rotulo: "Arquivos" },
  { valor: "link", rotulo: "Links" },
  { valor: "texto", rotulo: "Avisos" },
];

export default function ExploradorMateriais({
  materiais,
  usuarioId,
  podeModerar,
}: {
  materiais: {
    material: Material;
    visto: boolean;
    interacoes: InteracoesDoMaterial;
  }[];
  usuarioId: string | null;
  podeModerar: boolean;
}) {
  const [filtro, setFiltro] = useState<Material["tipo"] | "todos">("todos");
  const [busca, setBusca] = useState("");
  const materiaisFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return materiais.filter(({ material }) => {
      const correspondeAoTipo = filtro === "todos" || material.tipo === filtro;
      const correspondeABusca =
        !termo ||
        material.titulo.toLocaleLowerCase("pt-BR").includes(termo) ||
        material.descricao?.toLocaleLowerCase("pt-BR").includes(termo);
      return correspondeAoTipo && correspondeABusca;
    });
  }, [busca, filtro, materiais]);

  return (
    <div className="explorador-materiais">
      <div className="explorador-materiais__controles">
        <label className="explorador-materiais__busca">
          <span className="sr-only">Buscar material</span>
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar material"
          />
        </label>
        <div className="explorador-materiais__filtros" aria-label="Filtrar materiais">
          {FILTROS.map((opcao) => (
            <button
              key={opcao.valor}
              type="button"
              aria-pressed={filtro === opcao.valor}
              onClick={() => setFiltro(opcao.valor)}
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>
      </div>

      {materiaisFiltrados.length === 0 ? (
        <p className="explorador-materiais__vazio">Nenhum material encontrado.</p>
      ) : (
        <ul className="materiais-tipo-grade">
          {materiaisFiltrados.map(({ material, visto, interacoes }) => (
            <CartaoMaterial
              key={material.id}
              material={material}
              visto={visto}
              interacoes={interacoes}
              usuarioId={usuarioId}
              podeModerar={podeModerar}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
