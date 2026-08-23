import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/data/site";
import BotaoWhatsApp from "@/components/BotaoWhatsApp";
import Cabecalho from "@/components/Cabecalho";
import JsonLd from "@/components/JsonLd";
import Rodape from "@/components/Rodape";
import "./globals.css";

/* Archivo variável no eixo de largura: a versão expandida carrega o peso atlético
   do logotipo, sem cair nas condensadas de pôster que todo site esportivo usa. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

const titulo = "CT Guto Bopp — Centro de Treinamento de Beach Tennis";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: titulo,
    template: "%s · CT Guto Bopp",
  },
  description: site.descricao,
  keywords: [
    "beach tennis Porto Alegre",
    "aula de beach tennis Porto Alegre",
    "centro de treinamento beach tennis",
    "capacitação de professores de beach tennis",
    "curso para professor de beach tennis",
    "Conexão BT",
    "Metodologia Guto Bopp",
    "treino de beach tennis RS",
  ],
  authors: [{ name: "Guto Bopp" }],
  creator: "CT Guto Bopp",
  icons: {
    icon: {
      url: "/img/favicon.png",
      type: "image/png",
      sizes: "64x64",
    },
    shortcut: {
      url: "/img/favicon.png",
      type: "image/png",
    },
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.nome,
    title: titulo,
    description: site.descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: titulo,
    description: site.descricao,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "sports",
};

export const viewport: Viewport = {
  themeColor: "#0a1524",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${instrument.variable} ${plexMono.variable}`}
    >
      <body>
        <a href="#conteudo" className="pular-para-conteudo">
          Ir para o conteúdo
        </a>
        {/*
          Cabeçalho, rodapé e botão de WhatsApp vivem no layout: são iguais em
          todas as rotas, e no App Router o layout não remonta a cada navegação —
          o menu e o estado de rolagem sobrevivem à troca de página.
        */}
        <Cabecalho />
        <main id="conteudo">{children}</main>
        <Rodape />
        <BotaoWhatsApp />
        {/* Nós do grafo que valem para o site inteiro; cada página soma os seus. */}
        <JsonLd base />
      </body>
    </html>
  );
}
