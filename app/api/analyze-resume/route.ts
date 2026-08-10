import type { ResumeAnalysis } from "@/lib/schemas/resume-schema";
import { ResumeAnalysisSchema } from "@/lib/schemas/resume-schema";
import { NextResponse } from "next/server";
import zlib from "zlib";

const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return "";
  return filename.slice(lastDot).toLowerCase();
}

function extractTextFromDocx(buffer: Buffer): string {
  try {
    let offset = 0;
    while (offset < buffer.length - 30) {
      if (
        buffer[offset] === 0x50 &&
        buffer[offset + 1] === 0x4b &&
        buffer[offset + 2] === 0x03 &&
        buffer[offset + 3] === 0x04
      ) {
        const compMethod = buffer.readUInt16LE(offset + 8);
        const compSize = buffer.readUInt32LE(offset + 18);
        const filenameLen = buffer.readUInt16LE(offset + 26);
        const extraLen = buffer.readUInt16LE(offset + 28);

        const filename = buffer.toString(
          "utf-8",
          offset + 30,
          offset + 30 + filenameLen,
        );
        const dataStart = offset + 30 + filenameLen + extraLen;

        if (
          filename === "word/document.xml" &&
          dataStart + compSize <= buffer.length
        ) {
          const compData = buffer.subarray(dataStart, dataStart + compSize);
          let xml = "";
          if (compMethod === 8) {
            xml = zlib.inflateRawSync(compData).toString("utf-8");
          } else if (compMethod === 0) {
            xml = compData.toString("utf-8");
          }

          const matches = xml.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
          if (matches) {
            const text = matches
              .map((m) => m.replace(/<[^>]+>/g, ""))
              .join(" ")
              .trim();
            if (text) return text;
          }
          const textClean = xml
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          if (textClean) return textClean;
        }

        offset = dataStart + compSize;
      } else {
        offset++;
      }
    }
  } catch (err) {
    console.warn("[DOCX_EXTRACTION_WARN]:", err);
  }

  const rawText = buffer
    .toString("utf-8")
    .replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return rawText || "Conteúdo do arquivo DOCX";
}

function getMockAnalysis(): ResumeAnalysis {
  return {
    score: 88,
    summary:
      "Profissional com sólida experiência em desenvolvimento de software e liderança técnica. Perfil alinhado para posições de engenharia sênior, com foco em TypeScript e ecossistema React.",
    matchingPoints: [
      "Domínio avançado de TypeScript e ecossistema React/Next.js",
      "Experiência comprovada em arquitetura baseada em microsserviços",
      "Forte alinhamento com metodologias ágeis e CI/CD",
      "Histórico de mentoria e liderança técnica de equipes",
    ],
    improvementPoints: [
      "Adicionar métricas quantitativas de impacto nos projetos anteriores",
      "Incluir certificações relevantes na seção de educação",
      "Detalhar experiência com infraestrutura Cloud (AWS/GCP)",
    ],
    matchPercentageByRole: {
      "Desenvolvedor Sênior Fullstack": 92,
      "Arquiteto de Software": 85,
      "Tech Lead": 80,
    },
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData().catch(() => null);

    if (!formData) {
      return NextResponse.json(
        { error: 'Payload inválido. Envie um FormData com o campo "file".' },
        { status: 400 },
      );
    }

    const fileEntry = formData.get("file");
    const jobTitleEntry = formData.get("jobTitle");
    const jobTitle =
      typeof jobTitleEntry === "string" ? jobTitleEntry.trim() : "";

    if (
      !fileEntry ||
      typeof fileEntry === "string" ||
      !("name" in fileEntry) ||
      !("size" in fileEntry)
    ) {
      return NextResponse.json(
        {
          error: 'Nenhum arquivo enviado. Envie um currículo no campo "file".',
        },
        { status: 400 },
      );
    }

    const file = fileEntry as File;

    const extension = getFileExtension(file.name);
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        {
          error: `Formato "${extension || "desconhecido"}" não suportado. Aceitamos apenas .pdf e .docx.`,
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `Arquivo muito grande (${(file.size / (1024 * 1024)).toFixed(1)}MB). O tamanho máximo permitido é 5MB.`,
        },
        { status: 413 },
      );
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (apiKey) {
      try {
        const { generateObject } = await import("ai");
        const { google } = await import("@ai-sdk/google");

        const fileBytes = await file.arrayBuffer();
        const buffer = Buffer.from(fileBytes);

        const systemPrompt = `Você é um recrutador sênior e especialista em análise de currículos.
Analise o currículo fornecido e retorne uma avaliação técnica estruturada.
Requisitos obrigatórios:
- Forneça uma nota de 0 a 100 (score) baseada na qualidade geral${
          jobTitle
            ? ` e no alinhamento técnico com a vaga de "${jobTitle}"`
            : ""
        }.
- Inclua um resumo executivo claro (summary) com justificativa técnica sobre o perfil.
- Liste os pontos fortes (matchingPoints) e pontos de melhoria (improvementPoints).`;

        const userPromptText = [
          "Por favor, faça a análise completa deste currículo com base no perfil.",
          jobTitle
            ? `Vaga-alvo informada: "${jobTitle}". Considere este contexto para calcular o alinhamento e a nota.`
            : "",
        ]
          .filter(Boolean)
          .join("\n");

        const messageContent: Array<
          | { type: "text"; text: string }
          | { type: "file"; mediaType: string; data: Buffer }
        > = [
          {
            type: "text",
            text: userPromptText,
          },
        ];

        if (extension === ".pdf") {
          messageContent.push({
            type: "file",
            mediaType: "application/pdf",
            data: buffer,
          });
        } else if (extension === ".docx") {
          const docxText = extractTextFromDocx(buffer);
          messageContent.push({
            type: "text",
            text: `Conteúdo bruto extraído do arquivo (.docx):\n\n${docxText}`,
          });
        }

        const { object } = await generateObject({
          model: google("gemini-2.0-flash"),
          schema: ResumeAnalysisSchema,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: messageContent,
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
          { ...validation.data, source: "gemini-ai" },
          { status: 200 },
        );
      } catch (aiError) {
        console.error("[API_ANALYZE_ERROR]:", aiError);
        return NextResponse.json(
          {
            error:
              aiError instanceof Error
                ? aiError.message
                : "Falha ao analisar o currículo com a IA.",
          },
          { status: 500 },
        );
      }
    }

    // Fallback mock — strictly for when no GOOGLE_GENERATIVE_AI_API_KEY is present
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));

    const mockAnalysis = getMockAnalysis();
    const validationResult = ResumeAnalysisSchema.safeParse(mockAnalysis);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Formato de resposta inválido.",
          details: validationResult.error.flatten(),
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { ...validationResult.data, source: "mock" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao processar currículo." },
      { status: 500 },
    );
  }
}
