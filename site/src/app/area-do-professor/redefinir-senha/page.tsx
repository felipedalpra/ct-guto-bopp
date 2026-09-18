import type { Metadata } from "next";
import FormularioRedefinirSenha from "./FormularioRedefinirSenha";

export const metadata: Metadata = {
  title: "Redefinir senha",
  robots: { index: false, follow: false },
};

export default function PaginaRedefinirSenha() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="font-display text-2xl text-sand">Nova senha</h1>
        <p className="text-sm text-sand/70">
          Escolha a nova senha da sua conta na Área do Professor.
        </p>
      </div>
      <FormularioRedefinirSenha />
    </div>
  );
}
