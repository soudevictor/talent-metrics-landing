import type { Metadata } from 'next';
import { PlaygroundClient } from './playground-client';

export const metadata: Metadata = {
  title: 'Playground IA — TalentMetrics | Demonstração de Análise de Currículos',
  description:
    'Projeto demonstrativo: envie um currículo em PDF e veja uma análise técnica de exemplo com scoring objetivo e sugestões geradas por IA.',
  robots: { index: false, follow: true },
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
