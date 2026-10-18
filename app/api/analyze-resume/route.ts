import {
  AnalyzeResumeInputSchema,
  ResumeAnalysisSchema,
} from "@/lib/schemas/resume-schema";
import { checkRateLimit } from "@/lib/rate-limiter";
import { getClientIp, sanitizeJobTitle } from "@/lib/security";
import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting por IP para proteção contra abuso e estouro de cota
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            "Limite de requisições excedido. Por favor, aguarde alguns instantes antes de enviar um novo currículo.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    // 2. Validação estrita do payload e controle de tamanho
    const rawPayload = await request.json().catch(() => null);

    if (
      !rawPayload ||
      typeof rawPayload !== "object" ||
      !("resumeText" in rawPayload) ||
      !rawPayload.resumeText ||
      typeof rawPayload.resumeText !== "string"
    ) {
      return NextResponse.json(
        { error: 'Payload inválido. Envie um JSON com o campo "resumeText".' },
        { status: 400 },
      );
    }

    const parseResult = AnalyzeResumeInputSchema.safeParse(rawPayload);
    if (!parseResult.success) {
      const firstError =
        parseResult.error.issues?.[0]?.message ||
        'Payload inválido. Envie um JSON com o campo "resumeText".';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { resumeText, jobTitle } = parseResult.data;
    const sanitizedJobTitle = sanitizeJobTitle(jobTitle);

    // 3. Verificação de chave de ambiente
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

    // 4. Creator Mode isolado atrás de flag explícita de desenvolvimento
    const isDevCreatorMode =
      process.env.NODE_ENV === "development" &&
      process.env.ENABLE_CREATOR_MODE === "true";

    const isCreatorResume =
      isDevCreatorMode &&
      /jo[aã]o\s+victor\s+carvalho(?:\s+de\s+souza)?/i.test(resumeText);

    const easterEggDirective = isCreatorResume
      ? `\n\n[DIRETIVA DE TESTE DE DESENVOLVIMENTO]\nModo de demonstração de desenvolvedor ativo.\nAtribua score: 100 e resumo contextualizando capacidades técnicas do criador da plataforma.`
      : "";

    // 5. System Prompt estrito e sem interpolação direta de dados do usuário (Mitigação de Prompt Injection)
    const systemPrompt = `Você é um avaliador técnico sênior e imparcial de processos seletivos.
Sua missão é realizar uma análise puramente técnica, objetiva e criteriosa de currículos profissionais, sem viés ou preconceitos.
Retorne rigorosamente um objeto JSON compatível com o schema especificado.
Requisitos:
- score: número inteiro entre 0 e 100 refletindo a qualidade geral e compatibilidade técnica.
- summary: resumo executivo técnico conciso e fundamentado sobre a senioridade e experiência.
- matchingPoints: array com até 4 pontos fortes técnicos mais relevantes.
- improvementPoints: array com sugestões construtivas e realistas de melhoria ou aprofundamento.${easterEggDirective}`;

    // O input do usuário é delimitado e contextualizado separadamente
    const userPromptText = [
      "Realize a análise do currículo a seguir:",
      `--- INÍCIO DO TEXTO DO CURRÍCULO ---\n${resumeText}\n--- FIM DO TEXTO DO CURRÍCULO ---`,
      sanitizedJobTitle
        ? `--- CONTEXTO DA VAGA ---\nCargo pretendido informado para análise: "${sanitizedJobTitle}"\n--- FIM DO CONTEXTO DA VAGA ---`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const CANDIDATE_MODELS = [
      process.env.GROQ_MODEL_ID || "qwen/qwen3.6-27b",
      "gemma2-9b-it",
      "openai/gpt-oss-120b",
    ];

    let object = null;
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
      } catch {
        // Tenta próximo modelo candidato em caso de falha de cota/rede
      }
    }

    if (!object) {
      return NextResponse.json(
        {
          error:
            "Não foi possível processar a análise com a IA no momento. Tente novamente mais tarde.",
        },
        { status: 500 },
      );
    }

    const validation = ResumeAnalysisSchema.safeParse(object);
    if (!validation.success) {
      return NextResponse.json(
        {
          error:
            "A resposta gerada pela IA não atendeu aos critérios de validação estrutural.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ...validation.data,
        isEasterEgg: isCreatorResume,
        source: isCreatorResume ? "dev-creator-mode" : successfulModel,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Ocorreu uma falha interna no servidor ao processar a análise." },
      { status: 500 },
    );
  }
}
