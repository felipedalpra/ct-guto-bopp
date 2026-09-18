import "server-only";
import { site } from "@/data/site";
import { enviarEmail } from "./resend";

/**
 * HTML inline pelo mesmo motivo do convite: Gmail ignora <style> no <head>.
 * Sem o nome do usuário no corpo de propósito — o e-mail sai para um endereço
 * digitado num formulário público, então não há nada dele a interpolar no HTML.
 */
export async function enviarEmailRecuperarSenha({
  destinatario,
  link,
}: {
  destinatario: string;
  link: string;
}): Promise<{ erro: string | null }> {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
  <body style="margin:0; padding:32px 16px; background-color:#ede7db; font-family: Arial, Helvetica, sans-serif; color:#0a1524;">
    <table role="presentation" width="100%" style="max-width:480px; margin:0 auto; background-color:#ffffff; border-radius:12px; overflow:hidden;">
      <tr>
        <td style="padding:32px 28px;">
          <p style="margin:0 0 4px; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#3a5b7d;">${site.nome}</p>
          <h1 style="margin:0 0 20px; font-size:22px; color:#0a1524;">Redefinir senha</h1>
          <p style="margin:0 0 16px; font-size:15px; line-height:1.5;">Recebemos um pedido para redefinir a senha da sua conta na Área do Professor.</p>
          <p style="margin:0 0 28px;">
            <a href="${link}" style="display:inline-block; background-color:#7fcc28; color:#0a1524; font-weight:bold; font-size:15px; padding:12px 24px; border-radius:8px; text-decoration:none;">Escolher nova senha</a>
          </p>
          <p style="margin:0; font-size:13px; color:#6b7280;">Se você não pediu isso, pode ignorar este e-mail — sua senha atual continua valendo.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return enviarEmail({
    destinatario,
    assunto: `Redefinir senha — Área do Professor · ${site.nome}`,
    html,
  });
}
