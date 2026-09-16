import type { Metadata } from "next";
import FormularioCompletarCadastro from "./FormularioCompletarCadastro";

export const metadata: Metadata = {
  title: "Completar cadastro",
  robots: { index: false, follow: false },
};

export default function PaginaCompletarCadastro() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="font-display text-2xl text-sand">Bem-vindo(a)!</h1>
        <p className="text-sm text-sand/70">
          Defina uma senha para acessar a Área do Professor.
        </p>
      </div>
      <FormularioCompletarCadastro />
    </div>
  );
}
