import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Caminhos from "@/components/Caminhos";
import ResumoGuto from "@/components/ResumoGuto";
import ResumoCt from "@/components/ResumoCt";
import ResumoMetodo from "@/components/ResumoMetodo";
import ResumoProfessores from "@/components/ResumoProfessores";
import Depoimentos from "@/components/Depoimentos";
import ChamadaContato from "@/components/ChamadaContato";

/**
 * Home.
 *
 * Não é a landing page com tudo empilhado: aqui cada área aparece no tamanho de
 * um resumo e o conteúdo denso vive na página dela. A ordem segue a decisão que
 * o visitante precisa tomar — quem é o CT, qual o método, quem dá aula, e só
 * então o contato.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Caminhos />
      <ResumoGuto />
      <ResumoMetodo />
      <ResumoCt />
      <ResumoProfessores />
      <Depoimentos />
      <ChamadaContato />
    </>
  );
}
