import Link from "next/link";
import type { Trilha } from "@/types/area-do-professor";

export default function CartaoTrilha({
  trilha,
  total,
  concluidos,
}: {
  trilha: Trilha;
  total: number;
  concluidos: number;
}) {
  const percentual = total === 0 ? 0 : Math.round((concluidos / total) * 100);

  return (
    <Link href={`/area-do-professor/trilhas/${trilha.id}`} className="trilha-cartao">
      <span className="trilha-cartao__rotulo">Trilha</span>
      <h3 className="trilha-cartao__titulo">{trilha.titulo}</h3>
      {trilha.descricao ? (
        <p className="trilha-cartao__descricao">{trilha.descricao}</p>
      ) : null}
      <div className="trilha-cartao__progresso">
        <div className="trilha-cartao__progresso-trilho">
          <div
            className="trilha-cartao__progresso-barra"
            style={{ width: `${percentual}%` }}
          />
        </div>
        <span className="trilha-cartao__progresso-texto">
          {concluidos} de {total} concluídos
        </span>
      </div>
    </Link>
  );
}
