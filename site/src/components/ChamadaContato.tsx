import Link from "next/link";
import { site, whatsappMensagens } from "@/data/site";
import Revela from "./Revela";
import { Trajetoria } from "./motivos";

/**
 * Fechamento da home: o CTA de WhatsApp com o endereço em uma linha.
 * O mapa, os horários e a lista completa de contatos ficam em /contato — aqui
 * a home só precisa dar o próximo passo sem obrigar a mudar de página.
 */
export default function ChamadaContato() {
  return (
    <section className="secao chamada grao" aria-labelledby="chamada-titulo">
      <div className="quadra-linhas" aria-hidden="true" />
      <Trajetoria className="chamada__trajetoria" />

      <Revela className="shell chamada__conteudo">
        <p className="eyebrow">Primeiro passo</p>
        <h2 id="chamada-titulo" className="display chamada__titulo">
          Vamos treinar?
        </h2>
        <p className="chamada__texto">
          A primeira conversa é direta no WhatsApp: você diz em que nível está e a
          gente combina horário e formato de treino.
        </p>

        <div className="chamada__acoes">
          <a
            className="btn btn--primario"
            href={site.whatsapp.link(whatsappMensagens.geral)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar no WhatsApp
          </a>
          <Link className="btn btn--linha" href="/contato">
            Ver onde treinamos
          </Link>
        </div>

        <p className="chamada__endereco">
          {site.endereco.local} · {site.endereco.rua}, {site.endereco.cidade}/
          {site.endereco.estado} — {site.horario.texto}
        </p>
      </Revela>
    </section>
  );
}
