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
  isLoading?: boolean;
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

export function Dropzone({ onFileSelect, disabled = false, isLoading = false }: DropzoneProps) {
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
          'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 sm:p-10 transition-colors duration-200 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
          isDragOver && !disabled
            ? 'border-accent bg-accent-glow scale-[1.01]'
            : 'border-border-subtle bg-surface/40 hover:border-border-hover hover:bg-surface',
          disabled && 'opacity-50 pointer-events-none',
          error && 'border-error/50 bg-error/5'
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
          </div>
        ) : (
          <>
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-200',
              isDragOver ? 'bg-accent/10 border-2 border-accent' : 'bg-surface-elevated border-2 border-border-subtle'
            )}>
              <Upload className={cn('w-7 h-7', isDragOver ? 'text-accent' : 'text-text-muted')} />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-text-primary font-medium">
                Arraste seu currículo aqui ou{' '}
                <span className="text-accent underline underline-offset-2">
                  clique para selecionar
                </span>
              </p>
              <p className="text-xs text-text-muted">Apenas PDF · Máx. 5MB</p>
            </div>
          </>
        )}
      </div>

      {selectedFile ? (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={clearFile}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            Remover arquivo selecionado
          </button>
        </div>
      ) : null}

      {/* Error State */}
      {error ? (
        <div
          data-testid="dropzone-error"
          role="alert"
          aria-live="polite"
          className="mt-3 flex items-start gap-2 text-text-primary text-xs sm:text-sm bg-surface/5 border border-border-subtle rounded-lg p-3"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-text-primary" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Loading State */}
      {isLoading && !selectedFile && !error ? (
        <div className="mt-3 flex items-center gap-2 text-text-muted text-xs sm:text-sm">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" role="status" aria-label="Processando..." />
          <span>Processando currículo...</span>
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
