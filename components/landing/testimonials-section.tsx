import testimonialsData from '@/data/testimonials.json';
import type { Testimonial } from '@/types';
import { Quote } from 'lucide-react';

const testimonials = testimonialsData as Testimonial[];

/* ── Aspas decorativas como elemento gráfico ────────────────────────────── */
function QuoteMark() {
  return (
    <div className="text-accent/20" aria-hidden="true">
      <Quote className="w-12 h-12" />
    </div>
  );
}

/* ── Card de depoimento unificado ───────────────────────────────────────── */
function TestimonialCard({ 
  t, 
  featured = false 
}: { 
  t: Testimonial; 
  featured?: boolean; 
}) {
  return (
    <article className={`relative p-6 sm:p-8 rounded-2xl border bg-surface transition-all duration-300 hover:border-border-hover ${
      featured 
        ? 'border-accent/30 bg-accent/5' 
        : 'border-border-subtle hover:shadow-lg'
    }`}>
      <QuoteMark />
      
      <blockquote className="relative z-10 mt-2">
        <p className={`text-text-primary leading-relaxed italic ${featured ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
          &ldquo;{t.quote}&rdquo;
        </p>
      </blockquote>
      
      <footer className="mt-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center text-accent font-semibold text-sm">
          {t.author.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">{t.author}</p>
          <p className="text-xs text-text-muted">{t.role} · {t.company}</p>
        </div>
      </footer>
    </article>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
          Quem usa,{' '}
          <span className="text-accent">recomenda</span>
        </h2>
        <p className="mt-4 text-text-muted text-base sm:text-lg max-w-2xl mx-auto">
          Veja como times de RH de todo o Brasil estão revolucionando seus processos seletivos.
        </p>
      </div>

      {/* Depoimento em destaque — largura total */}
      <div className="mb-16">
        <TestimonialCard t={testimonials[0]} featured />
      </div>

      {/* Dois depoimentos lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {testimonials.slice(1).map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
      </div>
    </section>
  );
}