import { Check } from 'lucide-react';
import Link from 'next/link';
import pricingData from '@/data/pricing.json';
import type { PricingTier } from '@/types';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const plans = pricingData as PricingTier[];

const CONSULTANT_MAILTO =
  'mailto:contato@talentmetrics.example?subject=Interesse%20Plano%20Enterprise&body=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20plano%20Enterprise.';

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Planos claros para escalar seu time
        </h2>
        <p className="mt-4 text-text-muted text-base sm:text-lg max-w-2xl mx-auto">
          Escolha o plano ideal para a sua volumetria de vagas. Sem taxas escondidas.
        </p>
        <p className="mt-2 text-sm text-text-muted/70">
          Valores e planos fictícios, usados apenas para demonstração.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isConsultant = plan.ctaText.includes('Consultor');
          const href = isConsultant ? CONSULTANT_MAILTO : '/playground';
          const ctaClassName = buttonVariants({
            variant: plan.isPopular ? 'primary' : 'outline',
            size: 'lg',
            className: 'w-full',
          });

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col justify-between transition-colors ${
                plan.isPopular
                  ? 'border-accent/50 bg-surface md:scale-[1.02] z-10'
                  : 'border-border-subtle hover:border-border-hover'
              }`}
            >
              <div className="flex-1">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    {plan.isPopular && (
                      <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                        Mais popular
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-text-primary tracking-tight">{plan.price}</span>
                    <span className="text-text-muted text-sm">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 mt-2 flex-1">
                  <p className="text-sm font-semibold text-text-muted">O que está incluído:</p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-base text-text-primary">
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <CardFooter className="mt-8 pt-6 border-t border-border-subtle">
                {isConsultant ? (
                  <a href={href} className={ctaClassName}>
                    {plan.ctaText}
                  </a>
                ) : (
                  <Link href={href} className={ctaClassName}>
                    {plan.ctaText}
                  </Link>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
