import "server-only";

/**
 * Envia e-mail via API HTTP do Resend, sem depender do editor de templates
 * do Supabase Auth (que reescrevia o HTML de forma inconsistente e travava
 * com "ends in a non-text context" — ver memory.md). Usa fetch puro porque
 * é uma chamada REST simples; não justifica adicionar o SDK do Resend.
 */
export async function enviarEmail({
  destinatario,
  assunto,
  html,
}: {
  destinatario: string;
  assunto: string;
  html: string;
}): Promise<{ erro: string | null }> {
  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "onboarding@resend.dev",
      to: destinatario,
      subject: assunto,
      html,
    }),
  });

  if (!resposta.ok) {
    const corpo = await resposta.text();
    return { erro: `Resend recusou o envio (${resposta.status}): ${corpo}` };
  }

  return { erro: null };
}
