import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/analyze-resume/route';

/**
 * jsdom's FormData and Node's Request parser reject non-native File objects.
 * We mock the entire Request, including formData() returning a mock FormData
 * with a custom .get() that returns our test File-like objects.
 */

interface MockFileOptions {
  name: string;
  size: number;
}

function createFilelike({ name, size }: MockFileOptions): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type: 'application/octet-stream' });
}

function createMockFormData(file?: File): { get: (key: string) => File | null } {
  return {
    get: (key: string) => {
      if (key === 'file' && file) return file;
      return null;
    },
  };
}

function createMockRequest(options: {
  formData?: { get: (key: string) => File | null } | null;
  formDataError?: boolean;
}): Request {
  const { formData = null, formDataError = false } = options;

  return {
    method: 'POST',
    url: 'http://localhost:3000/api/analyze-resume',
    headers: new Headers(),
    formData: formDataError
      ? () => Promise.reject(new Error('Invalid body'))
      : () => Promise.resolve(formData),
  } as unknown as Request;
}

describe('POST /api/analyze-resume', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv('GOOGLE_GENERATIVE_AI_API_KEY', '');
  });

  it('should return 400 when FormData parsing fails', async () => {
    const request = createMockRequest({ formDataError: true });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/payload inválido/i);
  });

  it('should return 400 when no file field is provided', async () => {
    const mockFormData = createMockFormData();
    const request = createMockRequest({ formData: mockFormData });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/nenhum arquivo/i);
  });

  it('should return 400 for unsupported file extension (.png)', async () => {
    const file = createFilelike({ name: 'photo.png', size: 1024 });
    const mockFormData = createMockFormData(file);
    const request = createMockRequest({ formData: mockFormData });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/não suportado/i);
  });

  it('should return 400 for unsupported file extension (.exe)', async () => {
    const file = createFilelike({ name: 'virus.exe', size: 512 });
    const mockFormData = createMockFormData(file);
    const request = createMockRequest({ formData: mockFormData });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/não suportado/i);
  });

  it('should return 413 for file exceeding 5MB', async () => {
    const file = createFilelike({ name: 'big.pdf', size: 6 * 1024 * 1024 });
    const mockFormData = createMockFormData(file);
    const request = createMockRequest({ formData: mockFormData });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(413);
    expect(data.error).toMatch(/muito grande/i);
  });

  it('should return 200 with valid mock analysis for a .pdf file (no API key)', async () => {
    const file = createFilelike({ name: 'curriculo.pdf', size: 1024 * 100 });
    const mockFormData = createMockFormData(file);
    const request = createMockRequest({ formData: mockFormData });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('score');
    expect(data).toHaveProperty('summary');
    expect(data).toHaveProperty('matchingPoints');
    expect(data).toHaveProperty('improvementPoints');
    expect(data.score).toBeGreaterThanOrEqual(0);
    expect(data.score).toBeLessThanOrEqual(100);
    expect(Array.isArray(data.matchingPoints)).toBe(true);
    expect(Array.isArray(data.improvementPoints)).toBe(true);
  });

  it('should return 200 with valid mock analysis for a .docx file (no API key)', async () => {
    const file = createFilelike({ name: 'curriculo.docx', size: 1024 * 50 });
    const mockFormData = createMockFormData(file);
    const request = createMockRequest({ formData: mockFormData });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('score');
    expect(data).toHaveProperty('summary');
    expect(Array.isArray(data.matchingPoints)).toBe(true);
  });
});
