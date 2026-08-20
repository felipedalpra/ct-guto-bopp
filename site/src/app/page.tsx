import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Caminhos from "@/components/Caminhos";
import Fatos from "@/components/Fatos";
import ResumoGuto from "@/components/ResumoGuto";
import ResumoCt from "@/components/ResumoCt";
import ResumoMetodo from "@/components/ResumoMetodo";
import ResumoProfessores from "@/components/ResumoProfessores";
import Aulas from "@/components/Aulas";
import ChamadaContato from "@/components/ChamadaContato";

/**
 * Home.
 *
 * Não é a landing page com tudo empilhado, e também não é um índice de chamadas:
 * cada bloco entrega conteúdo de verdade e tem forma própria, para que a página
 * não pareça a mesma seção repetida seis vezes.
 *
 * A ordem responde às perguntas na sequência em que o visitante as faz:
 *   Hero        — o que é isto aqui
 *   Caminhos    — eu venho treinar ou eu dou aula (o tráfego vem do Instagram,
 *                 sem contexto, e os dois públicos querem coisas diferentes)
 *   Fatos       — atende meu nível? fica onde? que horas abre?
 *   Guto        — por que eu confiaria neste método
 *   Método      — o que cada pilar muda para mim
 *   Aulas       — como isso parece na quadra (o texto afirma, o vídeo mostra)
 *   CT          — como o centro se organiza
 *   Professores — com quem eu vou treinar
 *   Contato     — o próximo passo
 *
 * Cada seção mostra uma camada de conteúdo que NÃO se repete na página interna:
 * a home traz o resultado e o dado, a página interna traz o funcionamento.
 *
 * Depoimentos saíram daqui enquanto forem rascunho (ver src/data/depoimentos.ts):
 * "Nome do aluno" na home é o oposto do que esta página precisa provar.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Caminhos />
      <Fatos />
      <ResumoGuto />
      <ResumoMetodo />
      <Aulas />
      <ResumoCt />
      <ResumoProfessores />
      <ChamadaContato />
    </>
  );
}
