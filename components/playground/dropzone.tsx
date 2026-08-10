'use client';

import { useState, useRef, useCallback, type DragEvent, type KeyboardEvent } from 'react';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];
const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
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
      error: `Formato "${extension || 'desconhecido'}" não suportado. Aceitamos apenas .pdf e .docx.`,
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
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
          isDragOver && !disabled
            ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-700 bg-slate-900/40 hover:border-slate-500 hover:bg-slate-900/60',
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
          <div className="flex items-center gap-3 text-slate-200">
            <FileText className="w-8 h-8 text-indigo-400 shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium truncate max-w-[250px]">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">
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
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
              isDragOver ? 'bg-indigo-500/20' : 'bg-slate-800'
            )}>
              <Upload className={cn('w-6 h-6', isDragOver ? 'text-indigo-400' : 'text-slate-400')} />
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-200 font-medium">
                Arraste seu currículo aqui ou{' '}
                <span className="text-indigo-400 underline underline-offset-2">
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
        className="mt-2 text-xs text-slate-500 text-center"
      >
        Formatos aceitos: .pdf, .docx — Tamanho máximo: 5MB
      </p>
    </div>
  );
}
