import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlaygroundSection } from '@/components/playground/playground-section';

vi.mock('pdfjs-dist', () => ({
  version: '4.0.0',
  GlobalWorkerOptions: {},
  getDocument: vi.fn().mockReturnValue({
    promise: Promise.resolve({
      numPages: 1,
      getPage: vi.fn().mockResolvedValue({
        getTextContent: vi.fn().mockResolvedValue({
          items: [{ str: 'Mocked PDF Text' }],
        }),
      }),
    }),
  }),
}));

describe('PlaygroundSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
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

  it('preserves isEasterEgg from the API response and renders the creator badge', async () => {
    const mockSuccessResponse = {
      score: 100,
      summary: 'Perfil do criador.',
      matchingPoints: ['Next.js'],
      improvementPoints: [],
      matchPercentageByRole: { Frontend: 100 },
      isEasterEgg: true,
      source: 'qwen/qwen3.6-27b',
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

    expect(await screen.findByText(/Modo Criador Ativado/i)).toBeInTheDocument();
  });

  it('shows a progressive loading state while the request is pending', async () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));

    const { unmount } = render(<PlaygroundSection />);

    const input = screen.getByTestId('dropzone-input');
    const file = new File([new ArrayBuffer(100)], 'resume.pdf', { type: 'application/pdf' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(await screen.findByText(/Analisando currículo/i)).toBeInTheDocument();
    expect(screen.getByText(/O progresso para em 92%/i)).toBeInTheDocument();

    unmount();
  });

  it('shows a timeout message when the request is aborted after 45 seconds', async () => {
    vi.useFakeTimers();

    const abortingFetch = vi.fn(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        })
    );
    vi.stubGlobal('fetch', abortingFetch);

    render(<PlaygroundSection />);

    const input = screen.getByTestId('dropzone-input');
    const file = new File([new ArrayBuffer(100)], 'resume.pdf', { type: 'application/pdf' });
    fireEvent.change(input, { target: { files: [file] } });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText(/Analisando currículo/i)).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(45_000);
    });

    expect(screen.getByRole('alert')).toHaveTextContent(
      /demorou mais que o esperado/i
    );
  });
});
