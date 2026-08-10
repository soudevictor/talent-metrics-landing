import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlaygroundSection } from '@/components/playground/playground-section';

describe('PlaygroundSection', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders initial empty state with dropzone and aria-live="polite"', () => {
    const { container } = render(<PlaygroundSection />);
    expect(screen.getByTestId('dropzone')).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('aria-live', 'polite');
  });

  it('shows error state with server message when API request returns non-ok response', async () => {
    const mockErrorResponse = { error: 'Cota de requisições excedida na API.' };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve(mockErrorResponse),
      })
    );

    render(<PlaygroundSection jobTitle="Desenvolvedor Frontend" />);

    const input = screen.getByTestId('dropzone-input');
    const file = new File([new ArrayBuffer(100)], 'resume.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText('Cota de requisições excedida na API.')).toBeInTheDocument();
  });

  it('shows success state when API request succeeds', async () => {
    const mockSuccessResponse = {
      score: 95,
      summary: 'Excelente perfil técnico.',
      matchingPoints: ['React', 'TypeScript'],
      improvementPoints: ['Inglês fluente'],
      matchPercentageByRole: { Frontend: 95 },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSuccessResponse),
      })
    );

    render(<PlaygroundSection />);

    const input = screen.getByTestId('dropzone-input');
    const file = new File([new ArrayBuffer(100)], 'resume.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Excelente perfil técnico.')).toBeInTheDocument();
    });

    expect(screen.getByText('Score de Compatibilidade')).toBeInTheDocument();
  });
});
