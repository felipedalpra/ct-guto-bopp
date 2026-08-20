import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CapaPagina from "@/components/CapaPagina";
import JsonLd from "@/components/JsonLd";
import Passos from "@/components/Passos";
import Revela from "@/components/Revela";
import Secao, { Blocos, Prosa } from "@/components/Secao";
import { apresentacao, atuacao, principios, trajetoria } from "@/data/guto";
import { missao } from "@/data/ct";
import { idPessoa, nodoTrilha, urlDe } from "@/data/schema";
import { site } from "@/data/site";

const trilha = [{ titulo: "Guto Bopp", href: "/guto-bopp" }];

export const metadata: Metadata = {
  title: "Guto Bopp — atleta, professor e treinador",
  description:
    "Quem é Guto Bopp: mais de 13 anos dentro do Beach Tennis como atleta, professor e treinador, criador da Metodologia Guto Bopp — o Método dos 5 Pilares — e do curso Conexão BT.",
  alternates: { canonical: "/guto-bopp" },
  openGraph: { images: ["/img/guto-bopp.jpg"] },
};

export default function PaginaGuto() {
  return (
    <>
      <CapaPagina
        sobretitulo="Fundador e head coach do CT"
        titulo="Guto Bopp"
        intro="Atleta, professor e treinador de Beach Tennis há mais de 13 anos. Criador da Metodologia Guto Bopp e do curso Conexão BT."
        trilha={trilha}
      />

      <Secao numero="01" rotulo="Quem é" titulo="Atleta, professor, treinador e formador">
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
            <Prosa paragrafos={[...apresentacao]} />
            <Revela como="blockquote" className="autoridade__missao" atraso={120}>
              {missao}
            </Revela>
          </div>
        </div>
      </Secao>

      <Secao
        numero="02"
        rotulo="Trajetória"
        titulo="Como cada função virou uma parte do método"
        intro="Cada fase resolveu um problema que a anterior tinha deixado aberto — e é essa ordem que explica por que o método tem a cara que tem."
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

      <Secao
        numero="03"
        rotulo="Filosofia de ensino"
        titulo="Cinco princípios que o CT cobra de todo professor"
        intro="Cinco princípios que estão por trás de decisões concretas do método — e que o CT cobra de todo professor do time."
      >
        <Blocos itens={principios} />
      </Secao>

      <Secao
        numero="04"
        rotulo="No dia a dia"
        titulo="A rotina dele no CT hoje"
        clara
      >
        <Blocos itens={atuacao} />
      </Secao>

      <Secao numero="05" rotulo="Adiante" titulo="Por onde continuar" estreita>
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
