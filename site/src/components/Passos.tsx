import Revela from "./Revela";

/**
 * Sequência numerada — usada onde a ordem é o conteúdo: a anatomia de uma aula,
 * a trajetória do Guto, os módulos do curso. A linha vertical que liga os passos
 * é decorativa e vem do CSS.
 */
export default function Passos({
  itens,
}: {
  itens: { chave: string; marcador: string; titulo: string; texto: string; lista?: string[] }[];
}) {
  return (
    <ol className="passos">
      {itens.map((item, i) => (
        <Revela como="li" key={item.chave} atraso={i * 70} className="passo">
          <span className="passo__marcador">{item.marcador}</span>
          <div className="passo__corpo">
            <h3 className="passo__titulo">{item.titulo}</h3>
            <p className="passo__texto">{item.texto}</p>
            {item.lista && (
              <ul className="passo__lista">
                {item.lista.map((linha) => (
                  <li key={linha}>{linha}</li>
                ))}
              </ul>
            )}
          </div>
        </Revela>
      ))}
    </ol>
  );
}
