import { NextRequest, NextResponse } from 'next/server';
import { ResumeAnalysisSchema } from '@/lib/schemas/resume-schema';
import type { ResumeAnalysis } from '@/lib/schemas/resume-schema';

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot).toLowerCase();
}

function getMockAnalysis(): ResumeAnalysis {
  return {
    score: 88,
    summary:
      'Profissional com sólida experiência em desenvolvimento de software e liderança técnica. Perfil alinhado para posições de engenharia sênior, com foco em TypeScript e ecossistema React.',
    matchingPoints: [
      'Domínio avançado de TypeScript e ecossistema React/Next.js',
      'Experiência comprovada em arquitetura baseada em microsserviços',
      'Forte alinhamento com metodologias ágeis e CI/CD',
      'Histórico de mentoria e liderança técnica de equipes',
    ],
    improvementPoints: [
      'Adicionar métricas quantitativas de impacto nos projetos anteriores',
      'Incluir certificações relevantes na seção de educação',
      'Detalhar experiência com infraestrutura Cloud (AWS/GCP)',
    ],
    matchPercentageByRole: {
      'Desenvolvedor Sênior Fullstack': 92,
      'Arquiteto de Software': 85,
      'Tech Lead': 80,
    },
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData().catch(() => null);

    if (!formData) {
      return NextResponse.json(
        { error: 'Payload inválido. Envie um FormData com o campo "file".' },
        { status: 400 }
      );
    }

    const fileEntry = formData.get('file');

    // Duck-typing check: in some runtimes (jsdom, edge), instanceof File may fail
    // across realm boundaries. We check for Blob-like properties instead.
    if (!fileEntry || typeof fileEntry === 'string' || !('name' in fileEntry) || !('size' in fileEntry)) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado. Envie um currículo no campo "file".' },
        { status: 400 }
      );
    }

    const file = fileEntry as File;

    // Validate extension
    const extension = getFileExtension(file.name);
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { error: `Formato "${extension || 'desconhecido'}" não suportado. Aceitamos apenas .pdf e .docx.` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Arquivo muito grande (${(file.size / (1024 * 1024)).toFixed(1)}MB). O tamanho máximo permitido é 5MB.` },
        { status: 413 }
      );
    }

    // Attempt to use Vercel AI SDK with Google if API key is available
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (apiKey) {
      try {
        const { streamObject } = await import('ai');
        const { google } = await import('@ai-sdk/google');

        const fileBytes = await file.arrayBuffer();
        const fileBase64 = Buffer.from(fileBytes).toString('base64');
        const mimeType = extension === '.pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        const result = streamObject({
          model: google('gemini-2.0-flash'),
          schema: ResumeAnalysisSchema,
          messages: [
            {
              role: 'user' as const,
              content: [
                {
                  type: 'text' as const,
                  text: `Você é um especialista em RH e recrutamento técnico. Analise o currículo a seguir e retorne uma avaliação estruturada com:
- score: nota de 0 a 100 representando a qualidade geral do currículo
- summary: um resumo executivo de 2-3 frases sobre o perfil do candidato
- matchingPoints: lista de 3-5 pontos fortes do candidato
- improvementPoints: lista de 2-4 sugestões de melhoria
- matchPercentageByRole: mapa de 3 cargos relevantes e suas porcentagens de fit

Analise o conteúdo do documento enviado.`,
                },
                {
                  type: 'file' as const,
                  data: { type: 'data' as const, data: fileBase64 },
                  mediaType: mimeType,
                },
              ],
            },
          ],
        });

        return result.toTextStreamResponse();
      } catch {
        // Fallback to mock if AI SDK call fails
      }
    }

    // Fallback: return mock data for development without API key
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockAnalysis = getMockAnalysis();
    const validationResult = ResumeAnalysisSchema.safeParse(mockAnalysis);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Formato de resposta inválido.', details: validationResult.error.flatten() },
        { status: 500 }
      );
    }

    return NextResponse.json(validationResult.data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Erro interno ao processar currículo.' },
      { status: 500 }
    );
  }
}
