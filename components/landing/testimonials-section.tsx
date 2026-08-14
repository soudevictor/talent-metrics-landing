import { Star } from 'lucide-react';
import testimonialsData from '@/data/testimonials.json';
import type { Testimonial } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const testimonials = testimonialsData as Testimonial[];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-24">
      <div className="text-center mb-16">
        <Badge variant="emerald" className="mb-4">
          Depoimentos
        </Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Quem usa,{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            recomenda
          </span>
        </h2>
        <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          Veja como times de RH de todo o Brasil estão revolucionando seus processos seletivos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <Card key={t.id} className="flex flex-col justify-between hover:border-slate-700 transition-all">
            <CardHeader>
              <div className="flex gap-1 text-amber-400 mb-4" aria-label={`Avaliação: ${t.rating} de 5 estrelas`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" aria-hidden="true" />
                ))}
              </div>
              <p className="text-slate-300 text-sm italic leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
            </CardHeader>

            <CardContent className="mt-4 pt-4 border-t border-slate-800/80">
              <p className="text-sm font-bold text-white">{t.author}</p>
              <p className="text-xs text-slate-400">{t.role} • {t.company}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
