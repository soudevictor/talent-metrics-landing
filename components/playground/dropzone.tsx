'use client';

import { useState, useRef, useCallback, type DragEvent, type KeyboardEvent } from 'react';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACCEPTED_EXTENSIONS = ['.pdf'];
const ACCEPTED_MIME_TYPES = ['application/pdf'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const FORMATS_DESCRIPTION_ID = 'dropzone-formats-description';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot).toLowerCase();
}

function validateFile(file: File): { valid: boolean; error?: string } {
  const extension = getFileExtension(file.name);

  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Formato "${extension || 'desconhecido'}" não suportado. Aceitamos apenas .pdf.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `O arquivo tem ${sizeMB}MB. O tamanho máximo permitido é 5MB.`,
    };
  }

  return { valid: true };
}

export function Dropzone({ onFileSelect, disabled = false }: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const result = validateFile(file);

      if (!result.valid) {
        setError(result.error ?? 'Arquivo inválido.');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const file = event.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [disabled, handleFile]
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFile(file);
      }
      // Reset the input so re-selecting the same file triggers onChange
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [handleFile]
  );

  const openFileDialog = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openFileDialog();
      }
    },
    [openFileDialog]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
  }, []);

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-describedby={FORMATS_DESCRIPTION_ID}
        aria-label="Área de upload de currículo. Arraste um arquivo ou clique para selecionar."
        onClick={openFileDialog}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-testid="dropzone"
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 sm:p-10 transition-all duration-200 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
          isDragOver && !disabled
            ? 'border-accent bg-accent-glow scale-[1.01]'
            : 'border-border-subtle bg-surface/40 hover:border-border-hover hover:bg-surface',
          disabled && 'opacity-50 pointer-events-none',
          error && 'border-red-500/50 bg-red-500/5'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_MIME_TYPES.join(',')}
          onChange={handleInputChange}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          data-testid="dropzone-input"
        />

        {selectedFile ? (
          <div className="flex items-center gap-3 text-text-primary">
            <FileText className="w-8 h-8 text-accent shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium truncate max-w-[250px]">{selectedFile.name}</p>
              <p className="text-xs text-text-muted">
                {(selectedFile.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              aria-label="Remover arquivo selecionado"
              className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
              isDragOver ? 'bg-accent-glow' : 'bg-surface-elevated'
            )}>
              <Upload className={cn('w-6 h-6', isDragOver ? 'text-accent' : 'text-text-muted')} />
            </div>
            <div className="text-center">
              <p className="text-sm text-text-primary font-medium">
                Arraste seu currículo aqui ou{' '}
                <span className="text-accent underline underline-offset-2">
                  clique para selecionar
                </span>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Error State */}
      {error ? (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2 text-red-400 text-xs sm:text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Accessible format description */}
      <p
        id={FORMATS_DESCRIPTION_ID}
        className="mt-2 text-xs text-text-muted/60 text-center"
      >
        Formato aceito: apenas .pdf — Tamanho máximo: 5MB
      </p>
    </div>
  );
}
