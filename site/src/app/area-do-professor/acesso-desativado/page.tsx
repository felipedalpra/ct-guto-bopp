import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Acesso desativado",
  robots: { index: false, follow: false },
};

export default function PaginaAcessoDesativado() {
  const mensagem =
    "Olá! Meu acesso à Área do Professor está desativado, poderia reativar?";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-2xl text-sand">Acesso desativado</h1>
      <p className="text-sm text-sand/70">
        Seu acesso à Área do Professor foi desativado. Fale com o CT para
        reativar.
      </p>
      <a
        href={site.whatsapp.link(mensagem)}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto rounded-md bg-lime-ct px-4 py-2 font-medium text-navy-900 transition hover:bg-lime-bright"
      >
        Falar no WhatsApp
      </a>
    </div>
  );
}
