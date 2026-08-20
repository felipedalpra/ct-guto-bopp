import Link from "next/link";
import CapaPagina from "@/components/CapaPagina";
import { rotas } from "@/data/rotas";

/**
 * Página não encontrada.
 *
 * Com o site dividido em várias rotas, o 404 deixa de ser hipótese: link antigo
 * para uma âncora da versão de página única, professor que saiu do time, endereço
 * digitado errado. Em vez de um beco sem saída, ela devolve o mapa do site.
 */
export default function NaoEncontrada() {
  return (
    <>
      <CapaPagina
        sobretitulo="Erro 404"
        titulo="Essa página saiu da quadra"
        intro="O endereço que você abriu não existe (ou mudou de lugar). Siga por um destes caminhos:"
      />

      <section className="secao erro">
        <div className="quadra-linhas" aria-hidden="true" />
        <div className="shell">
          <ul className="erro__lista">
            {rotas.map((rota) => (
              <li key={rota.href}>
                <Link href={rota.href}>
                  <span className="erro__rotulo">{rota.rotulo}</span>
                  <span className="erro__resumo">{rota.resumo}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link className="btn btn--linha erro__voltar" href="/">
            Voltar para o início
          </Link>
        </div>
      </section>
    </>
  );
}
