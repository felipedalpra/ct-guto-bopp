import { site } from "@/data/site";
import Revela from "./Revela";

/**
 * Mapa da sede.
 *
 * Usa o embed público do Google Maps, que resolve o endereço por texto e não
 * exige chave de API — uma a menos para configurar antes de publicar.
 * `loading="lazy"` mantém o mapa fora do carregamento inicial: ele fica no fim
 * da página e não deve competir com a capa.
 *
 * O endereço também aparece como texto logo acima, na lista de contato: quem
 * bloqueia iframe de terceiros ou usa leitor de tela não perde a informação.
 */
export default function Mapa() {
  const busca = `${site.endereco.local}, ${site.endereco.rua}, ${site.endereco.cidade} - ${site.endereco.estado}`;
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(busca)}&z=16&output=embed`;

  return (
    <Revela className="shell mapa" atraso={80}>
      <div className="mapa__moldura">
        <iframe
          src={embed}
          title={`Mapa com a localização do ${site.nome}, em ${site.endereco.cidade}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <span className="mapa__tinta" aria-hidden="true" />
      </div>

      <div className="mapa__rodape">
        <p className="mapa__endereco">
          <span>{site.endereco.local}</span>
          {site.endereco.rua} · {site.endereco.cidade}/{site.endereco.estado}
        </p>
        <a
          className="mapa__link"
          href={site.endereco.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Traçar rota no Google Maps
        </a>
      </div>
    </Revela>
  );
}
