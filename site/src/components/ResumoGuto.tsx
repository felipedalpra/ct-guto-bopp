import Image from "next/image";
import Link from "next/link";
import { trajetoria } from "@/data/guto";
import Revela from "./Revela";

/**
 * Guto Bopp na home — o teaser de /guto-bopp.
 *
 * O CT é a marca, mas a autoridade é a pessoa: a metodologia se sustenta na
 * trajetória de quem a criou (decisão do cliente registrada no memory.md). Por
 * isso ele aparece cedo na home, com retrato grande e as quatro funções que
 * explicam o método, e não como mais um card no meio do time.
 */
export default function ResumoGuto() {
  return (
    <section className="secao bloco resumo-guto grao" aria-labelledby="resumo-guto-titulo">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell resumo-guto__grade">
        <Revela className="resumo-guto__retrato">
          <div className="autoridade__moldura">
            <Image
              src="/img/guto-bopp.jpg"
              alt="Guto Bopp, fundador do CT Guto Bopp"
              width={1000}
              height={1250}
              sizes="(max-width: 60rem) 88vw, 36vw"
            />
          </div>
          <p className="autoridade__credito">
            <span>Guto Bopp</span>
            Fundador e head coach
          </p>
        </Revela>

        <div className="resumo-guto__texto">
          <Revela>
            <p className="bloco__rotulo">
              <span className="bloco__risco" aria-hidden="true" />
              Quem está por trás
            </p>
            <h2 id="resumo-guto-titulo" className="display resumo-guto__titulo">
              Quem escreveu o método passou por{" "}
              <span className="autoridade__mais">4</span> funções antes
            </h2>
            <p className="resumo-guto__texto-corrido">
              Guto Bopp criou a Metodologia Guto Bopp e o curso Conexão BT, treina os
              atletas do CT e conduz a formação dos professores do time. Cada uma das
              quatro funções abaixo resolveu um problema que a anterior tinha deixado
              aberto — e é essa ordem que explica por que o método é organizado em
              pilares que dependem um do outro.
            </p>
          </Revela>

          {/* As quatro funções são o resumo da trajetória — e o argumento do método. */}
          <Revela como="ol" className="resumo-guto__fases" atraso={100}>
            {trajetoria.map((fase) => (
              <li key={fase.chave}>
                <span className="resumo-guto__papel">{fase.papel}</span>
                <span className="resumo-guto__fase">{fase.titulo}</span>
              </li>
            ))}
          </Revela>

          <Revela atraso={160}>
            <Link className="btn btn--linha" href="/guto-bopp">
              Conhecer o Guto Bopp
            </Link>
          </Revela>
        </div>
      </div>
    </section>
  );
}
