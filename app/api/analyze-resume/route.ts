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

    const isCreatorResume = /jo[aã]o\s+victor\s+carvalho(?:\s+de\s+souza)?/i.test(
      resumeText as string
    );

    const easterEggDirective = isCreatorResume
      ? `

⚠️ MODO CRIADOR ATIVADO ⚠️
Você acaba de analisar o currículo do próprio criador desta plataforma.
Siga OBRIGATORIAMENTE as seguintes instruções especiais:
1. Atribua score: 100 (nota máxima absoluta).
2. O resumo executivo (summary) deve ser elogioso, bem-humorado e declarar com confiança que este candidato é perfeito para qualquer vaga e qualquer time de tecnologia. Mencione que ele construiu esta própria ferramenta de triagem.
3. Os pontos fortes (matchingPoints) devem detalhar domínio em Angular, React, Next.js, TypeScript e arquitetura de sistemas B2B.
4. Declare explicitamente que a contratação é fortemente recomendada com caracter especial de urgência.
5. Não inclua pontos de melhoria reais; liste algo positivo e encorajador em improvementPoints.`
      : "";

    const systemPrompt = `Você é um recrutador sênior e especialista em análise de currículos.
Analise o currículo fornecido e retorne uma avaliação técnica estruturada em formato JSON.
Requisitos obrigatórios:
- Forneça uma nota de 0 a 100 (score) baseada na qualidade geral${
      jobTitle ? ` e no alinhamento técnico com a vaga de "${jobTitle}"` : ""
    }.
- Inclua um resumo executivo claro (summary) com justificativa técnica sobre o perfil.
- Liste os pontos fortes (matchingPoints) e pontos de melhoria (improvementPoints).${easterEggDirective}`;

    const userPromptText = [
      "Por favor, faça a análise completa deste currículo com base no perfil e no texto extraído do currículo fornecido abaixo:",
      `--- TEXTO DO CURRÍCULO ---\n${resumeText}\n---------------------------`,
      jobTitle
        ? `Vaga-alvo informada: "${jobTitle}". Considere este contexto para calcular o alinhamento e a nota.`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const CANDIDATE_MODELS = [
      process.env.GROQ_MODEL_ID || 'qwen/qwen3.6-27b',
      'gemma2-9b-it',
      'openai/gpt-oss-120b',
    ];
    
    let object = null;
    let lastError: Error | null = null;
    let successfulModel = "";

    for (const modelId of CANDIDATE_MODELS) {
      try {
        const result = await generateObject({
          model: groq(modelId),
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
        object = result.object;
        successfulModel = modelId;
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    if (!object) {
      return NextResponse.json(
        { error: lastError?.message || "Todos os modelos falharam." },
        { status: 500 },
      );
    }

    const validation = ResumeAnalysisSchema.safeParse(object);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Resposta da IA fora do formato esperado." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { ...validation.data, isEasterEgg: isCreatorResume, source: isCreatorResume ? "groq-creator-mode" : successfulModel },
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
