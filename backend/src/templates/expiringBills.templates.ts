export type ExpiringBillsTemplateType = {
  name?: string;
  description: string;
  amount: number;
  dueDate: string;
  link?: string;
  daysLeft?: number;
};

export function expiringBills(params: ExpiringBillsTemplateType) {
  const greetingName = params.name?.trim()
    ? "Olá, " + params.name.trim()
    : "Olá";

  const amountBRL = params.amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const daysLeftLine =
    typeof params.daysLeft === "number"
      ? `<li><strong>Faltam:</strong> ${params.daysLeft} dia(s)</li>`
      : "";

  const linkHtml = params.link
    ? `<p style="margin:16px 0 0 0;">
         <a href="${params.link}" style="display:inline-block;text-decoration:none;">
           Ver detalhes no FinProgress
         </a>
       </p>`
    : "";

  const subject = `FinProgress: boleto perto do vencimento (${params.dueDate})`;

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.45; color: #111;">
    <h2 style="margin:0 0 12px 0;">${greetingName}</h2>

    <p style="margin:0 0 12px 0;">
      Este é um lembrete de que você tem um boleto próximo do vencimento.
    </p>

    <ul style="margin:0; padding-left:18px;">
      <li><strong>Descrição:</strong> ${params.description}</li>
      <li><strong>Valor:</strong> ${amountBRL}</li>
      <li><strong>Vencimento:</strong> ${params.dueDate}</li>
      ${daysLeftLine}
    </ul>

    ${linkHtml}

    <p style="margin:16px 0 0 0; color:#666; font-size:12px;">
      Mensagem automática do FinProgress. Se você já pagou, pode ignorar este aviso.
    </p>
  </div>
  `;

  const text = `${greetingName}

Este é um lembrete de que você tem um boleto próximo do vencimento.

- Descrição: ${params.description}
- Valor: ${amountBRL}
- Vencimento: ${params.dueDate}${
    typeof params.daysLeft === "number"
      ? `\n- Faltam: ${params.daysLeft} dia(s)`
      : ""
  }${params.link ? `\n\nVer detalhes: ${params.link}` : ""}

Mensagem automática do FinProgress. Se você já pagou, pode ignorar este aviso.
`;

  return { subject, html, text };
}
