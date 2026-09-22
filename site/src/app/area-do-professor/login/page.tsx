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
    <div className="login-professor relative isolate -mx-4 -my-8 flex min-h-[calc(100svh-4.5rem)] items-center justify-center overflow-hidden px-4 py-10 sm:-mx-8 sm:px-8">
      <div className="absolute inset-0 -z-20 bg-navy-900" aria-hidden="true">
        <video
          className="login-professor__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/ct/prainha.jpg"
        >
          <source src="/video/ct/prainha.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="login-professor__veu absolute inset-0 -z-10" aria-hidden="true" />

      <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-sand/15 bg-navy-900/80 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-lime-ct">
            CT Guto Bopp
          </p>
          <h1 className="font-display text-3xl text-sand">Área do Professor</h1>
          <p className="mt-2 text-sm leading-6 text-sand/75">
            Entre com o e-mail e a senha que você definiu no convite.
          </p>
        </div>
        {linkInvalido ? (
          <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200" role="alert">
            Esse link é inválido ou já foi usado. Peça um novo em “Esqueci minha
            senha”.
          </p>
        ) : null}
        <FormularioLogin />
        <Link
          href="/area-do-professor/esqueci-senha"
          className="text-sm text-sand/75 underline-offset-2 hover:text-sand hover:underline"
        >
          Esqueci minha senha
        </Link>
      </div>
    </div>
  );
}
