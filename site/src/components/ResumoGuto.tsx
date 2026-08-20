import Image from "next/image";
import Link from "next/link";
import { trajetoria } from "@/data/guto";
import Revela from "./Revela";
import { Raquete } from "./motivos";

/**
 * Guto Bopp na home — o teaser de /guto-bopp.
 *
 * O CT é a marca, mas a autoridade é a pessoa: a metodologia se sustenta na
 * trajetória de quem a criou (decisão do cliente registrada no memory.md).
 *
 * Aqui a foto dele não é uma ilustração ao lado do texto — é o FUNDO da seção,
 * sangrando de borda a borda, com o texto por cima. É a única seção da home
 * construída assim, e isso é proposital: ela precisa parecer diferente das
 * outras porque o assunto dela é uma pessoa, não um serviço.
 *
 * A foto é tratada em duotone navy pelo CSS, para que continue legível como
 * fundo (o retrato original é claro demais para receber texto branco em cima) e
 * para amarrar com a paleta do resto do site.
 */
export default function ResumoGuto() {
  return (
    <section
      className="secao retrato-fundo grao"
      aria-labelledby="resumo-guto-titulo"
    >
      {/* Camada de fundo: retrato + véu. Decorativa — o alt fica vazio. */}
      <div className="retrato-fundo__camada" aria-hidden="true">
        <Image
          src="/img/guto-bopp.jpg"
          alt=""
          fill
          sizes="100vw"
          className="retrato-fundo__foto"
        />
        <div className="retrato-fundo__veu" />
      </div>

      <Raquete className="retrato-fundo__raquete" />

      <div className="shell retrato-fundo__conteudo">
        <Revela>
          <p className="eyebrow">Quem está por trás</p>
          <h2 id="resumo-guto-titulo" className="display retrato-fundo__titulo">
            Quem escreveu o método
            <br />
            passou por <span className="retrato-fundo__n">4</span> funções antes
          </h2>
          <p className="retrato-fundo__texto">
            Cada função resolveu um problema que a anterior deixou aberto. É essa
            ordem que explica por que o método tem a cara que tem.
          </p>
        </Revela>

        {/*
          A numeração aqui carrega informação de verdade: é uma sequência
          cronológica, e a ordem é o argumento da seção.
        */}
        <Revela como="ol" className="fases" atraso={100}>
          {trajetoria.map((fase, i) => (
            <li key={fase.chave} style={{ "--i": i } as React.CSSProperties}>
              <span className="fases__papel">{fase.papel}</span>
              <span className="fases__titulo">{fase.titulo}</span>
            </li>
          ))}
        </Revela>

        <Revela atraso={160}>
          <Link className="btn btn--linha" href="/guto-bopp">
            Conhecer o Guto Bopp
          </Link>
        </Revela>
      </div>
    </section>
  );
}
