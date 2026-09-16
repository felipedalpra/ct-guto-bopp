import type { Metadata } from "next";
import FormularioLogin from "./FormularioLogin";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function PaginaLogin() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="font-display text-2xl text-sand">Área do Professor</h1>
        <p className="text-sm text-sand/70">
          Entre com o e-mail e a senha que você definiu no convite.
        </p>
      </div>
      <FormularioLogin />
    </div>
  );
}
