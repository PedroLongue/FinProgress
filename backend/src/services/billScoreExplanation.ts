import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ScoreExplainInput = {
  score: number;
  totalBills: number;
  totalPaidNotLate: number;
  totalPaidLate: number;
  totalPending: number;
  totalLate: number;
};

type ScoreExplainOutput = {
  title: string;
  summary: string;
  bills: string[];
  nextSteps: string[];
  confidence: number;
  notes: string;
};

export async function explainScoreWithAI(
  input: ScoreExplainInput
): Promise<ScoreExplainOutput> {
  const prompt = `
Gere uma explicação curta do score de boletos para o usuário final (PT-BR).

DADOS (use SOMENTE estes números, não invente nada):
${JSON.stringify(input)}

REGRAS:
- Seja objetivo e claro.
- title: 2 a 5 palavras.
- summary: 1 a 2 frases.
- bills: 2 a 4 bullets, citando números (ex: "3 boletos vencidos").
- nextSteps: 2 a 3 ações práticas, imperativas e curtas.
- Não use moralismo.
- Não mencione "IA", "OpenAI", "modelo" ou "prompt".
- Se totalBills = 0, explique que não há dados suficientes e sugira cadastrar boletos.
- confidence (0 a 1): quanto você confia que a explicação está completa com os dados fornecidos.
`;

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "user",
        content: [{ type: "input_text", text: prompt }],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "score_explanation",
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["title", "summary", "bills", "nextSteps", "confidence"],
          properties: {
            title: { type: "string" },
            summary: { type: "string" },
            bills: {
              type: "array",
              items: { type: "string" },
              minItems: 2,
              maxItems: 4,
            },
            nextSteps: {
              type: "array",
              items: { type: "string" },
              minItems: 2,
              maxItems: 3,
            },
            confidence: { type: "number", minimum: 0, maximum: 1 },
          },
        },
      },
    },
  });

  return JSON.parse(response.output_text) as ScoreExplainOutput;
}
