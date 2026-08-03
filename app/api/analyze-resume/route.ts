import { NextRequest, NextResponse } from 'next/server';
import { ResumeAnalysisSchema } from '@/lib/schemas/resume-schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // Stub response simulating AI parsing & evaluation
    const mockAnalysis = {
      score: 88,
      summary: 'Profissional com sólida experiência em desenvolvimento de software e liderança técnica.',
      matchingPoints: [
        'Domínio avançado de TypeScript e ecossistema React/Next.js',
        'Experiência comprovada em arquitetura baseada em microsserviços',
        'Forte alinhamento com metodologias ágeis e CI/CD',
      ],
      improvementPoints: [
        'Adicionar métricas quantitativas de impacto nos projetos anteriores',
        'Incluir certificações relevantes na seção de educação',
      ],
      matchPercentageByRole: {
        'Desenvolvedor Senior Fullstack': 92,
        'Arquiteto de Software': 85,
        'Tech Lead': 80,
      },
    };

    // Validate payload shape against Zod schema
    const validationResult = ResumeAnalysisSchema.safeParse(mockAnalysis);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Formato de resposta inválido', details: validationResult.error.flatten() },
        { status: 500 }
      );
    }

    return NextResponse.json(validationResult.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno ao processar currículo' },
      { status: 500 }
    );
  }
}
