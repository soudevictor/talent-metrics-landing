"use client";

import { Check } from 'lucide-react';
import pricingData from '@/data/pricing.json';
import type { PricingTier } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const plans = pricingData as PricingTier[];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
          Investimento claro para{' '}
          <span className="text-accent">escalar seu time</span>
        </h2>
        <p className="mt-4 text-text-muted text-base sm:text-lg max-w-2xl mx-auto">
          Escolha o plano ideal para a sua volumetria de vagas. Sem taxas escondidas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col justify-between transition-all duration-300 ${
              plan.isPopular
                ? 'border-accent/50 bg-surface shadow-xl shadow-accent/10 scale-[1.02] z-10'
                : 'border-border-subtle hover:border-border-hover hover:shadow-lg'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/30 text-xs font-semibold">
                  Mais Popular
                </span>
              </div>
            )}

            <div className="flex-1">
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-text-primary tracking-tight">{plan.price}</span>
                  <span className="text-text-muted text-sm">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 mt-2 flex-1">
                <p className="text-xs font-semibold text-text-muted">O que está incluído:</p>
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-text-primary">
                      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>

            <CardFooter className="mt-8 pt-6 border-t border-border-subtle">
              <Button
                variant={plan.isPopular ? 'primary' : 'outline'}
                size="lg"
                className="w-full"
                onClick={() => {
                  if (plan.ctaText.includes('Consultor')) {
                    window.location.href = 'mailto:contato@talentmetrics.com?subject=Interesse%20Plano%20Enterprise&body=Olá,%20gostaria%20de%20saber%20mais%20sobre%20o%20plano%20Enterprise.';
                  } else {
                    window.location.href = '/playground';
                  }
                }}
              >
                {plan.ctaText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}