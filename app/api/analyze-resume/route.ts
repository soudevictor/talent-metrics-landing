import { ResumeAnalysisSchema } from "@/lib/schemas/resume-schema";
import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);

    if (!payload || !payload.resumeText) {
      return NextResponse.json(
        { error: 'Payload inválido. Envie um JSON com o campo "resumeText".' },
        { status: 400 },
      );
    }

    const { resumeText, jobTitle } = payload;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Chave de API do Groq não configurada no servidor (GROQ_API_KEY).",
        },
        { status: 500 },
      );
    }

    const systemPrompt = `Você é um recrutador sênior e especialista em análise de currículos.
Analise o currículo fornecido e retorne uma avaliação técnica estruturada em formato JSON.
Requisitos obrigatórios:
- Forneça uma nota de 0 a 100 (score) baseada na qualidade geral${
      jobTitle ? ` e no alinhamento técnico com a vaga de "${jobTitle}"` : ""
    }.
- Inclua um resumo executivo claro (summary) com justificativa técnica sobre o perfil.
- Liste os pontos fortes (matchingPoints) e pontos de melhoria (improvementPoints).`;

    const userPromptText = [
      "Por favor, faça a análise completa deste currículo com base no perfil e no texto extraído do currículo fornecido abaixo:",
      `--- TEXTO DO CURRÍCULO ---\n${resumeText}\n---------------------------`,
      jobTitle
        ? `Vaga-alvo informada: "${jobTitle}". Considere este contexto para calcular o alinhamento e a nota.`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      providerOptions: {
        groq: {
          structuredOutputs: false,
        },
      },
      schema: ResumeAnalysisSchema,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPromptText,
        },
      ],
    });

    const validation = ResumeAnalysisSchema.safeParse(object);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Resposta da IA fora do formato esperado." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { ...validation.data, source: "groq-ai" },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Falha ao analisar o currículo com a IA.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
