import Image from "next/image";
import { proximaTurma } from "@/data/turma";

/**
 * O cartaz da próxima turma — a peça visual do anúncio.
 *
 * O cliente divulga a turma por uma arte quadrada no Instagram. Reproduzi-la
 * como imagem no site seria texto dentro de JPEG: ilegível no celular, invisível
 * para busca e para leitor de tela. Então o cartaz é desenhado em código, com a
 * mesma hierarquia da arte (curso, nível, os três dados, o lema) e a tipografia
 * do próprio site.
 *
 * `proximaTurma.foto` é opcional: com uma foto, ela entra como fundo por trás do
 * cartaz — o texto continua sendo texto.
 *
 * `compacto` é a versão do aviso flutuante: mesma peça, sem o lema e com o
 * título menor, para caber num cartão de canto de tela.
 */
export default function CartazTurma({ compacto = false }: { compacto?: boolean }) {
  const t = proximaTurma;

  return (
    <div className="cartaz" data-compacto={compacto}>
      {t.foto && (
        <Image
          className="cartaz__foto"
          src={t.foto}
          alt=""
          fill
          sizes="(max-width: 48rem) 92vw, 30rem"
        />
      )}

      <div className="cartaz__miolo">
        <p className="cartaz__curso">Curso de capacitação</p>

        <p className="display cartaz__titulo">
          Conexão <span className="display-italic">BT</span>
        </p>

        <p className="cartaz__nivel">Nível {t.nivel}</p>

        {/* Compacto não cabe em três colunas de duas linhas cada: no cartão do
            aviso, os mesmos três dados viram uma linha só, abreviados. */}
        {compacto ? (
          <ul className="cartaz__dados cartaz__dados--linha">
            <li>25–27 set</li>
            <li>Prainha</li>
            <li>{t.carga}</li>
          </ul>
        ) : (
          <ul className="cartaz__dados">
            <li>
              <span className="cartaz__dado-valor">{t.dias}</span>
              <span className="cartaz__dado-rotulo">{t.mes}</span>
            </li>
            <li>
              <span className="cartaz__dado-valor">Prainha</span>
              <span className="cartaz__dado-rotulo">Beach Tennis</span>
            </li>
            <li>
              <span className="cartaz__dado-valor">{t.carga}</span>
              <span className="cartaz__dado-rotulo">presenciais</span>
            </li>
          </ul>
        )}

        {!compacto && (
          <p className="cartaz__lema">
            Disciplina. <span>Método.</span> Resultado.
          </p>
        )}
      </div>
    </div>
  );
}
