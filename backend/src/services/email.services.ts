import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) throw new Error("RESEND_API_KEY não definida");

const resend = new Resend(apiKey);

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendEmail(input: SendEmailInput) {
  const from = process.env.RESEND_FROM || "FinFlow <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });

  if (error) {
    const msg =
      typeof error === "string"
        ? error
        : (error as any)?.message || "Erro desconhecido ao enviar e-mail";
    throw new Error(msg);
  }

  return data;
}
