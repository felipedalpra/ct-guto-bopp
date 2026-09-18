import type { Metadata } from "next";
import Link from "next/link";
import FormularioEsqueciSenha from "./FormularioEsqueciSenha";

export const metadata: Metadata = {
  title: "Esqueci minha senha",
  robots: { index: false, follow: false },
};

export default function PaginaEsqueciSenha() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="font-display text-2xl text-sand">Esqueci minha senha</h1>
        <p className="text-sm text-sand/70">
          Informe o e-mail da sua conta e enviaremos um link para escolher uma
          nova senha.
        </p>
      </div>
      <FormularioEsqueciSenha />
      <Link
        href="/area-do-professor/login"
        className="text-sm text-sand/70 underline-offset-2 hover:text-sand hover:underline"
      >
        Voltar para o login
      </Link>
    </div>
  );
}
