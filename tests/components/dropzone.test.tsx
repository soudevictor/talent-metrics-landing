import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropzone } from '@/components/playground/dropzone';

function createMockFile(name: string, size: number, type: string): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

describe('Dropzone', () => {
  it('should render the dropzone area with accessible description', () => {
    const handleFileSelect = vi.fn();
    render(<Dropzone onFileSelect={handleFileSelect} />);

    const dropzone = screen.getByTestId('dropzone');
    expect(dropzone).toBeInTheDocument();
    expect(dropzone).toHaveAttribute('role', 'button');
    expect(dropzone).toHaveAttribute('tabindex', '0');

    const description = screen.getByText(/Formatos aceitos: .pdf, .docx/i);
    expect(description).toBeInTheDocument();
  });

  it('should accept a valid .pdf file', () => {
    const handleFileSelect = vi.fn();
    render(<Dropzone onFileSelect={handleFileSelect} />);

    const input = screen.getByTestId('dropzone-input');
    const file = createMockFile('curriculo.pdf', 1024 * 100, 'application/pdf');

    fireEvent.change(input, { target: { files: [file] } });

    expect(handleFileSelect).toHaveBeenCalledWith(file);
  });

  it('should accept a valid .docx file', () => {
    const handleFileSelect = vi.fn();
    render(<Dropzone onFileSelect={handleFileSelect} />);

    const input = screen.getByTestId('dropzone-input');
    const file = createMockFile(
      'curriculo.docx',
      1024 * 50,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    fireEvent.change(input, { target: { files: [file] } });

    expect(handleFileSelect).toHaveBeenCalledWith(file);
  });

  it('should reject a .png file and show error', () => {
    const handleFileSelect = vi.fn();
    render(<Dropzone onFileSelect={handleFileSelect} />);

    const input = screen.getByTestId('dropzone-input');
    const file = createMockFile('foto.png', 1024, 'image/png');

    fireEvent.change(input, { target: { files: [file] } });

    expect(handleFileSelect).not.toHaveBeenCalled();
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/não suportado/i);
  });

  it('should reject a .exe file and show error', () => {
    const handleFileSelect = vi.fn();
    render(<Dropzone onFileSelect={handleFileSelect} />);

    const input = screen.getByTestId('dropzone-input');
    const file = createMockFile('virus.exe', 1024, 'application/x-msdownload');

    fireEvent.change(input, { target: { files: [file] } });

    expect(handleFileSelect).not.toHaveBeenCalled();
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/não suportado/i);
  });

  it('should reject a file larger than 5MB and show error', () => {
    const handleFileSelect = vi.fn();
    render(<Dropzone onFileSelect={handleFileSelect} />);

    const input = screen.getByTestId('dropzone-input');
    const oversizedFile = createMockFile('big.pdf', 6 * 1024 * 1024, 'application/pdf');

    fireEvent.change(input, { target: { files: [oversizedFile] } });

    expect(handleFileSelect).not.toHaveBeenCalled();
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/tamanho máximo/i);
  });

  it('should be disabled when disabled prop is true', () => {
    const handleFileSelect = vi.fn();
    render(<Dropzone onFileSelect={handleFileSelect} disabled />);

    const dropzone = screen.getByTestId('dropzone');
    expect(dropzone).toHaveClass('pointer-events-none');
  });
});
