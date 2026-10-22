import { DemoBanner } from "@/components/landing/demo-banner";
import { MotionProvider } from "@/components/ui/motion-provider";
import packageJson from "@/package.json";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "TalentMetrics",
  title: "TalentMetrics - Triagem Inteligente de Currículos com IA para RH",
  description:
    "Conheça um projeto demonstrativo de triagem de currículos com scoring objetivo, resumo executivo e apoio de IA generativa para times de RH.",
  other: {
    version: packageJson.version,
  },
  keywords: [
    "RH",
    "Recrutamento",
    "IA",
    "Triagem de Currículos",
    "Talent Metrics",
    "SaaS B2B",
    "Pessoas e Cultura",
  ],
  authors: [{ name: "TalentMetrics Team" }],
  openGraph: {
    title: "TalentMetrics - Triagem Inteligente de Currículos com IA",
    description:
      "Projeto demonstrativo de triagem de currículos com scoring objetivo e apoio de IA generativa.",
    type: "website",
    locale: "pt_BR",
    siteName: "TalentMetrics",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark scroll-smooth`} data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className="min-h-screen bg-canvas text-text-primary antialiased flex flex-col selection:bg-accent/30 selection:text-text-primary"
      >
        <MotionProvider>
          <DemoBanner />
          <main className="flex-1 flex flex-col">{children}</main>
        </MotionProvider>
      </body>
    </html>
  );
}
