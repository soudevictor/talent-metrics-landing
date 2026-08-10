'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * AnimatedSection — scroll-triggered fade-in + lift animation.
 *
 * WHY the isMounted pattern?
 * `useReducedMotion()` returns `null` on the server (no window.matchMedia) but
 * resolves to `true|false` on the client. If we render `motion.div` with
 * `initial` values derived from that hook during SSR, the server generates
 * different inline styles than what the client expects → hydration mismatch.
 *
 * Solution: render a plain <div> on the server AND on the first synchronous
 * client render (isMounted = false). Both outputs are identical, so React
 * hydrates without errors. After the first effect fires we swap to motion.div —
 * at that point we are past the hydration phase so React doesn't compare the
 * output against the server HTML.
 */
export function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // SSR + first synchronous client render → plain div (no inline styles).
  // This ensures the hydrated DOM matches the server-rendered HTML exactly.
  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  // After hydration: if the user prefers reduced motion, keep a plain div.
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
