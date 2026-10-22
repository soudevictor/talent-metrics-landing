import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedSection } from '@/components/ui/animated-section';

const originalIntersectionObserver = globalThis.IntersectionObserver;

describe('AnimatedSection', () => {
  beforeEach(() => {
    // jsdom has no IntersectionObserver by default; make the absence explicit.
    // @ts-expect-error test-only override
    delete globalThis.IntersectionObserver;
  });

  afterEach(() => {
    if (originalIntersectionObserver) {
      globalThis.IntersectionObserver = originalIntersectionObserver;
    }
  });

  it('keeps content visible when IntersectionObserver is unavailable', () => {
    render(
      <AnimatedSection>
        <p>Conteúdo visível sem observer</p>
      </AnimatedSection>,
    );

    expect(screen.getByText('Conteúdo visível sem observer')).toBeVisible();
  });
});
