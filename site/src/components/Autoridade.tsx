import Image from "next/image";
import { site } from "@/data/site";
import Revela from "./Revela";

const diferenciais = [
  "Metodologia própria de ensino",
  "Treinamento técnico e tático",
  "Capacitação de professores",
  "Acompanhamento e mentoria",
  "Formação continuada",
  "Reciclagens e atualização profissional",
];

export default function Autoridade() {
  return (
    <section className="secao autoridade">
      <div className="quadra-linhas" aria-hidden="true" />

      <div className="shell autoridade__grade">
        <Revela className="autoridade__retrato">
          <div className="autoridade__moldura">
            <Image
              src="/img/guto-bopp.jpg"
              alt="Guto Bopp, fundador do CT Guto Bopp"
              width={1000}
              height={1250}
              sizes="(max-width: 900px) 88vw, 40vw"
            />
          </div>
          <p className="autoridade__credito">
            <span>Guto Bopp</span>
            Atleta, professor e treinador
          </p>
        </Revela>

        <div className="autoridade__texto">
          <Revela>
            <p className="eyebrow">Um método construído em quadra</p>
            <h2 className="display autoridade__titulo">
              {site.anosDeExperiencia}
              <span className="autoridade__mais">+</span> anos de areia viraram
              um método
            </h2>
          </Revela>

          <Revela atraso={80}>
            <p>
              Guto Bopp está há mais de {site.anosDeExperiencia} anos dentro do
              Beach Tennis, atuando como atleta, professor e treinador. Foi dessa
              vivência — e não da teoria — que nasceu a Metodologia Guto Bopp.
            </p>
            <p>
              O CT Guto Bopp é um Centro de Treinamento voltado ao desenvolvimento
              de atletas e professores, com metodologia própria baseada em técnica,
              estratégia, didática e planejamento. Mais do que treinar, o CT
              desenvolve pessoas dentro e fora da quadra.
            </p>
          </Revela>

          <Revela como="blockquote" className="autoridade__missao" atraso={140}>
            Desenvolver atletas e professores através de uma metodologia
            estruturada, prática e voltada para a evolução contínua.
          </Revela>

          <Revela como="ul" className="autoridade__lista" atraso={200}>
            {diferenciais.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </Revela>
        </div>
      </div>
    </section>
  );
}
