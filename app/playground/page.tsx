import type { Metadata } from 'next';
import { PlaygroundClient } from './playground-client';

export const metadata: Metadata = {
  title: 'Playground IA — TalentMetrics | Teste Gratuito de Análise de Currículos',
  description:
    'Teste gratuitamente a ferramenta de triagem de currículos por IA da TalentMetrics. Envie um PDF ou DOCX e receba uma análise completa em segundos.',
  robots: { index: false, follow: true },
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
