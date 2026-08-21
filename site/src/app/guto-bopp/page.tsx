import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Assinatura from "@/components/Assinatura";
import CapaPagina from "@/components/CapaPagina";
import JsonLd from "@/components/JsonLd";
import Passos from "@/components/Passos";
import Revela from "@/components/Revela";
import Secao, { Prosa } from "@/components/Secao";
import { apresentacao, trajetoria } from "@/data/guto";
import { idPessoa, nodoTrilha, urlDe } from "@/data/schema";
import { site } from "@/data/site";

const trilha = [{ titulo: "Guto Bopp", href: "/guto-bopp" }];

export const metadata: Metadata = {
  title: "Guto Bopp — atleta, professor e treinador",
  description:
    "Quem é Guto Bopp: mais de 13 anos dentro do Beach Tennis como atleta, professor e treinador, criador da Metodologia Guto Bopp e do curso Conexão BT.",
  alternates: { canonical: "/guto-bopp" },
  openGraph: { images: ["/img/guto-bopp.jpg"] },
};

export default function PaginaGuto() {
  return (
    <>
      <CapaPagina
        sobretitulo="Fundador e head coach do CT"
        titulo="Guto Bopp"
        intro="Atleta, professor e treinador há mais de 13 anos. Criador do método e do Conexão BT."
        trilha={trilha}
      />

      <Secao numero="01" rotulo="Quem é" titulo="Quatro funções, um método">
        <div className="perfil">
          <Revela className="perfil__retrato">
            <div className="autoridade__moldura">
              <Image
                src="/img/guto-bopp.jpg"
                alt="Guto Bopp, fundador do CT Guto Bopp"
                width={1000}
                height={1250}
                sizes="(max-width: 60rem) 88vw, 32vw"
                priority
              />
            </div>
            <p className="autoridade__credito">
              <span>Guto Bopp</span>
              Atleta, professor e treinador
            </p>
          </Revela>

          <div className="perfil__texto">
            {/* A missão do CT ficava aqui também. É uma frase institucional só,
                e agora aparece uma vez, na página do CT. */}
            <Prosa paragrafos={[...apresentacao]} />
          </div>
        </div>
      </Secao>

      <Secao
        numero="02"
        rotulo="Trajetória"
        titulo="Cada função virou uma parte"
        intro="Cada fase resolveu um problema que a anterior deixou aberto."
        clara
      >
        <Passos
          itens={trajetoria.map((fase) => ({
            chave: fase.chave,
            marcador: fase.papel,
            titulo: fase.titulo,
            texto: fase.texto,
          }))}
        />
      </Secao>

      <Assinatura />

      <Secao numero="03" rotulo="Adiante" titulo="Por onde continuar" estreita>
        <Revela className="adiante__links">
          <Link className="btn btn--linha" href="/metodo">
            Ver o Método dos 5 Pilares
          </Link>
          <Link className="btn btn--linha" href="/conexao-bt">
            Conhecer o Conexão BT
          </Link>
          <Link className="btn btn--linha" href="/o-ct">
            Conhecer o CT
          </Link>
        </Revela>
      </Secao>

      <JsonLd
        nodos={[
          nodoTrilha(trilha),
          {
            "@type": "ProfilePage",
            "@id": `${urlDe("/guto-bopp")}#perfil`,
            mainEntity: { "@id": idPessoa },
            about: { "@id": idPessoa },
            url: urlDe("/guto-bopp"),
            inLanguage: "pt-BR",
            name: `Guto Bopp — ${site.nome}`,
          },
        ]}
      />
    </>
  );
}
