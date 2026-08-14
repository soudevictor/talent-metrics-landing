import { Check } from 'lucide-react';
import pricingData from '@/data/pricing.json';
import type { PricingTier } from '@/types';
import { PricingCtaButton } from '@/components/landing/pricing-cta-button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const plans = pricingData as PricingTier[];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-24">
      <div className="text-center mb-16">
        <Badge variant="purple" className="mb-4">
          Planos e Preços
        </Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Investimento claro para{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            escalar seu time
          </span>
        </h2>
        <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          Escolha o plano ideal para a sua volumetria de vagas. Sem taxas escondidas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col justify-between ${
              plan.isPopular
                ? 'border-indigo-500/50 bg-slate-900/80 shadow-2xl shadow-indigo-500/10'
                : 'border-slate-800'
            }`}
          >
            {plan.isPopular ? (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge variant="indigo" className="bg-indigo-600 text-white font-semibold border-none">
                  Mais Popular
                </Badge>
              </div>
            ) : null}

            <div>
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-xs">{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 mt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  O que está incluído:
                </p>
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>

            <CardFooter className="mt-8">
              <PricingCtaButton
                label={plan.ctaText}
                isPopular={plan.isPopular ?? false}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
