import Image from "next/image";
import Link from "next/link";
import { rotas } from "@/data/rotas";
import { time, hrefProfessor, nomeCurto } from "@/data/professores";
import { site, whatsappMensagens } from "@/data/site";

/**
 * Rodapé.
 *
 * Numa página só o rodapé era uma assinatura; com o site dividido em páginas ele
 * vira o mapa do site — é a partir dele que o visitante que chegou pelo Google
 * numa página interna descobre o resto, e é onde o rastreador encontra todas as
 * rotas a partir de qualquer página.
 */
export default function Rodape() {
  const ano = new Date().getFullYear();

  return (
    <footer className="rodape">
      <div className="shell rodape__mapa">
        <div className="rodape__marca">
          <Link href="/" aria-label={`${site.nome} — página inicial`}>
            <Image
              src="/img/logo-ct-guto-bopp.png"
              alt={site.nome}
              width={1430}
              height={914}
              className="rodape__logo"
            />
          </Link>
          <p className="rodape__lema">{site.lema}</p>
          <p className="rodape__sobre">{site.descricao}</p>
        </div>

        <nav className="rodape__colunas" aria-label="Mapa do site">
          <div className="rodape__coluna">
            <h2 className="rodape__titulo">Navegar</h2>
            <ul>
              <li>
                <Link href="/">Início</Link>
              </li>
              {rotas.map((rota) => (
                <li key={rota.href}>
                  <Link href={rota.href}>{rota.rotulo}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rodape__coluna">
            <h2 className="rodape__titulo">Professores</h2>
            <ul>
              {time.map((pessoa) => (
                <li key={pessoa.slug}>
                  <Link href={hrefProfessor(pessoa)}>{nomeCurto(pessoa.nome)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rodape__coluna">
            <h2 className="rodape__titulo">Onde e quando</h2>
            <ul>
              <li>
                <a href={site.endereco.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {site.endereco.local}
                  <br />
                  {site.endereco.rua}
                  <br />
                  {site.endereco.cidade} · {site.endereco.estado}
                </a>
              </li>
              <li className="rodape__nota">{site.horario.texto}</li>
              <li>
                <a
                  href={site.whatsapp.link(whatsappMensagens.geral)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site.whatsapp.numero}
                </a>
              </li>
              <li>
                <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">
                  {site.instagram.handle}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="shell rodape__creditos">
        <p>
          © {ano} {site.nome}. Todos os direitos reservados.
        </p>
        <p>{site.nomeCompleto}</p>
        <p className="rodape__assinatura">
          Site desenvolvido por{" "}
          <a href="https://www.zentritechoficial.com.br/" target="_blank" rel="noopener">
            Zentri.tech
          </a>
        </p>
      </div>
    </footer>
  );
}
