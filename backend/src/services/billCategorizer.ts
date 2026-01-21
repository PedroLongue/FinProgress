import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CATEGORIES = [
  "Energia",
  "Água",
  "Gás",
  "Internet",
  "Telefone",
  "Aluguel",
  "Condomínio",
  "Cartão",
  "Impostos",
  "Saúde",
  "Educação",
  "Transporte",
  "Supermercado",
  "Compras",
  "Assinaturas",
  "Streaming",
  "Seguros",
  "Manutenção",
  "Lazer",
  "Outros",
] as const;

export const categorizeBillAI = async (input: {
  title?: string;
  description?: string | null;
  barcode?: string | null;
}) => {
  const prompt = `
Classifique a boleta em UMA categoria da lista.
Se não der para inferir com segurança, use "Outros".

Dados:
- title: ${input.title ?? ""}
- description: ${input.description ?? ""}
- barcode: ${input.barcode ?? ""}
`;

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
    text: {
      format: {
        type: "json_schema",
        name: "bill_category",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            category: { type: "string", enum: [...CATEGORIES] },
            confidence: { type: "number", minimum: 0, maximum: 1 },
            reason: { type: "string" },
          },
          required: ["category", "confidence", "reason"],
        },
      },
    },
  });

  const data = JSON.parse(response.output_text) as {
    category: (typeof CATEGORIES)[number];
    confidence: number;
    reason: string;
  };

  return data;
};
