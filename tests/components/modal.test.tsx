import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Modal } from '@/components/ui/modal';

function ModalHarness() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir modal
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal de teste"
      >
        <button type="button">Ação final</button>
      </Modal>
    </div>
  );
}

describe('Modal', () => {
  it('traps focus, closes on Escape, restores focus and locks body scroll', async () => {
    render(<ModalHarness />);

    const opener = screen.getByRole('button', { name: 'Abrir modal' });
    opener.focus();
    fireEvent.click(opener);

    const dialog = await screen.findByRole('dialog');
    const closeButton = screen.getByRole('button', { name: 'Fechar janela' });
    const lastButton = screen.getByRole('button', { name: 'Ação final' });

    await waitFor(() => expect(closeButton).toHaveFocus());
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(document.body.style.overflow).toBe('hidden');

    lastButton.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(lastButton).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(opener).toHaveFocus());
    expect(document.body.style.overflow).toBe('');
  });
});
