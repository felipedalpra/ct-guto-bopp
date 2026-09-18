import type { Metadata } from "next";
import Link from "next/link";
import FormularioLogin from "./FormularioLogin";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

// "convite-invalido" vem do /auth/confirm (token inválido ou já usado, tanto
// de convite quanto de recuperação); "link-invalido" vem de /redefinir-senha
// aberta sem sessão.
const ERROS_DE_LINK = ["convite-invalido", "link-invalido"];

export default async function PaginaLogin({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const linkInvalido = erro !== undefined && ERROS_DE_LINK.includes(erro);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="font-display text-2xl text-sand">Área do Professor</h1>
        <p className="text-sm text-sand/70">
          Entre com o e-mail e a senha que você definiu no convite.
        </p>
      </div>
      {linkInvalido ? (
        <p className="text-sm text-red-400" role="alert">
          Esse link é inválido ou já foi usado. Peça um novo em “Esqueci minha
          senha”.
        </p>
      ) : null}
      <FormularioLogin />
      <Link
        href="/area-do-professor/esqueci-senha"
        className="text-sm text-sand/70 underline-offset-2 hover:text-sand hover:underline"
      >
        Esqueci minha senha
      </Link>
    </div>
  );
}
