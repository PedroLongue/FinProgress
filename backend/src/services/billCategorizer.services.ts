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
Você é um classificador financeiro. Sua tarefa é classificar a BOLETA/FATURA em EXATAMENTE UMA categoria da lista abaixo.

Categorias permitidas:
- Internet
- Energia
- Água
- Telefone
- Gás
- Condomínio
- Aluguel
- Streaming/Assinaturas
- Cartão de Crédito
- Impostos/Taxas
- Saúde
- Educação
- Transporte
- Seguros
- Outros

REGRAS (obrigatórias, em ordem de prioridade):
1) Classifique pela NATUREZA DO SERVIÇO cobrado, NÃO pela forma de pagamento.
   - Menções a "cartão", "cadastro do cartão", "recorrência", "PIX", "boleto", "QR code" são MEIO DE PAGAMENTO e NÃO definem categoria.
2) Dê mais peso para evidências como:
   - "O QUE ESTÁ SENDO COBRADO", item/serviço, plano, velocidade (MB/Mbps), "banda larga", "fibra", "provedor"
   - beneficiário/empresa (CNPJ), razão social
3) Se houver sinais fortes de Internet (ex.: internet, banda larga, fibra, MB/Mbps, plano, provedor, "340MB"), classifique como "Internet".
4) Só use "Cartão de Crédito" se o documento for claramente uma FATURA DE CARTÃO (banco/cartão) com lista de compras/lançamentos, limite/parcelas e total da fatura.
5) Se não houver evidência suficiente para uma categoria específica, use "Outros".

FORMATO DE SAÍDA:
Responda somente com JSON válido, sem texto extra:
{
  "categoria": "<uma das categorias permitidas>",
  "confianca": "alta" | "media" | "baixa",
  "evidencias": ["<até 3 trechos curtos dos dados>"]
}

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
