import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const extractBillFromPdfAI = async (params: { pdfBase64: string }) => {
  const prompt = `
Extraia APENAS os campos abaixo de um PDF de boleto/conta brasileiro.

CAMPOS OBRIGATÓRIOS NA RESPOSTA (sempre retornar, mesmo que null):
- title (string|null): nome curto da conta (ex: "Conta de luz", "Fatura cartão", "Boleto condomínio")
- description (string|null): detalhes úteis (ex: mês/competência, favorecido/empresa, etc.)
- amount (number|null): valor total a pagar (ex: 129.9)
- dueDate (string|null): data de vencimento no formato "YYYY-MM-DD"
- barcode (string|null): código de barras / linha digitável SOMENTE dígitos (remover espaços/pontos)

CAMPOS PROIBIDOS (NÃO retornar):
- category
- status
- qualquer outro campo não listado acima

REGRAS:
- Se não der para extrair um campo com segurança, retorne null.
- amount: número (use ponto como separador decimal).
- dueDate: se houver horário, ignore e mantenha só a data.
- barcode: somente dígitos.
- No campo notes, explique rapidamente o que encontrou e o que ficou incerto.
- confidence (0 a 1) deve refletir o quão confiáveis estão os campos extraídos.
`;

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: prompt },
          {
            type: "input_file",
            filename: "boleto.pdf",
            file_data: `data:application/pdf;base64,${params.pdfBase64}`,
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "bill_extract",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: ["string", "null"] },
            description: { type: ["string", "null"] },
            amount: { type: ["number", "null"] },
            dueDate: { type: ["string", "null"] },
            barcode: { type: ["string", "null"] },
            confidence: { type: "number", minimum: 0, maximum: 1 },
            notes: { type: "string" },
          },
          required: [
            "title",
            "description",
            "amount",
            "dueDate",
            "barcode",
            "confidence",
            "notes",
          ],
        },
      },
    },
  });

  return JSON.parse(response.output_text) as {
    title: string | null;
    description: string | null;
    amount: number | null;
    dueDate: string | null;
    barcode: string | null;
    confidence: number;
    notes: string;
  };
};
