import Image from "next/image";
import Link from "next/link";
import { hrefProfessor, nomeCurto, time } from "@/data/professores";
import { iniciaisDe } from "./Professores";
import Revela from "./Revela";
import Secao from "./Secao";

/**
 * Prova social do Conexão BT — e a única da página que não é rascunho.
 *
 * Todos os professores do time se formaram pela capacitação do CT.
 *
 * Era uma grade de fichas com foto, quadra e lista de certificados de cada um —
 * a mesma coisa que a página /professores mostra inteira, logo ali no menu. Aqui
 * o que precisa ficar de pé é uma frase só: o time inteiro saiu deste curso.
 * Então virou uma fileira de rostos com o nome embaixo. Quem quiser o currículo
 * clica no rosto e cai na ficha, que é onde ele mora.
 */
export default function FormadosPeloCt({ numero }: { numero?: string }) {
  const formados = time;

  return (
    <Secao
      numero={numero}
      rotulo="Quem já passou"
      titulo="O time do CT saiu daqui"
      intro={`Não é depoimento: são os ${time.length} professores que dão aula com o nome do CT, todos formados aqui.`}
    >
      <ul className="rostos">
        {formados.map((pessoa, i) => (
          <Revela como="li" key={pessoa.slug} atraso={i * 60}>
            <Link className="rosto" href={hrefProfessor(pessoa)}>
              <span className="rosto__foto">
                {pessoa.foto ? (
                  <Image
                    src={pessoa.foto}
                    alt=""
                    width={300}
                    height={375}
                    sizes="7rem"
                  />
                ) : (
                  <span className="rosto__iniciais" aria-hidden="true">
                    {iniciaisDe(pessoa.nome)}
                  </span>
                )}
              </span>
              <span className="rosto__nome">{nomeCurto(pessoa.nome)}</span>
            </Link>
          </Revela>
        ))}
      </ul>
    </Secao>
  );
}
