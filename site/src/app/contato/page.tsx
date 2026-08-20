import type { Metadata } from "next";
import CapaPagina from "@/components/CapaPagina";
import Contato from "@/components/Contato";
import JsonLd from "@/components/JsonLd";
import { nodoTrilha } from "@/data/schema";
import { site } from "@/data/site";

const trilha = [{ titulo: "Contato", href: "/contato" }];

export const metadata: Metadata = {
  title: "Contato",
  description: `Onde treinar Beach Tennis com o CT Guto Bopp: ${site.endereco.local}, ${site.endereco.rua}, ${site.endereco.cidade} (${site.endereco.estado}). ${site.horario.texto}. WhatsApp ${site.whatsapp.numero}.`,
  alternates: { canonical: "/contato" },
};

export default function PaginaContato() {
  return (
    <>
      <CapaPagina
        sobretitulo="Onde a gente treina"
        titulo="Contato"
        intro={`${site.endereco.local} — ${site.endereco.rua}, ${site.endereco.cidade}/${site.endereco.estado}. ${site.horario.texto}.`}
        trilha={trilha}
      />

      <Contato />

      <JsonLd nodos={[nodoTrilha(trilha)]} />
    </>
  );
}
