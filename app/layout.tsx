import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DemoBanner } from '@/components/landing/demo-banner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TalentMetrics - Triagem Inteligente de Currículos com IA para RH',
  description: 'Automatize a pré-seleção de candidatos, identifique os melhores talentos em segundos e elimine viés com inteligência artificial generativa de alta precisão.',
  keywords: ['RH', 'Recrutamento', 'IA', 'Triagem de Currículos', 'Talent Metrics', 'SaaS B2B', 'Pessoas e Cultura'],
  authors: [{ name: 'TalentMetrics Team' }],
  openGraph: {
    title: 'TalentMetrics - Triagem Inteligente de Currículos com IA',
    description: 'Acelere seu processo seletivo em até 10x com análises objetivas de currículos alimentadas por Inteligência Artificial.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'TalentMetrics',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark scroll-smooth`}>
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
        <DemoBanner />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
