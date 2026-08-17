import { POST } from "@/app/api/analyze-resume/route";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateObject } from "ai";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

vi.mock("@ai-sdk/groq", () => ({
  groq: vi.fn(() => "mock-groq"),
}));

function createMockRequest(options: {
  payload?: unknown;
  payloadError?: boolean;
}): Request {
  const { payload = null, payloadError = false } = options;

  return {
    method: "POST",
    url: "http://localhost:3000/api/analyze-resume",
    headers: new Headers({ "Content-Type": "application/json" }),
    json: payloadError
      ? () => Promise.reject(new Error("Invalid JSON"))
      : () => Promise.resolve(payload),
  } as unknown as Request;
}

describe("POST /api/analyze-resume", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("GROQ_API_KEY", "");
    vi.clearAllMocks();
  });

  it("should return 400 when JSON parsing fails", async () => {
    const request = createMockRequest({ payloadError: true });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/payload inválido/i);
  });

  it("should return 400 when resumeText is missing", async () => {
    const request = createMockRequest({ payload: { jobTitle: "Developer" } });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/payload inválido/i);
  });

  it("should return 500 when GROQ_API_KEY is missing", async () => {
    const request = createMockRequest({
      payload: { resumeText: "Experiência em React" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toMatch(/GROQ_API_KEY/i);
  });

  it("should return 200 with valid analysis when API key is provided and generateObject succeeds", async () => {
    vi.stubEnv("GROQ_API_KEY", "fake-key");

    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        score: 95,
        summary: "Excelente perfil Groq.",
        matchingPoints: ["Next.js", "TypeScript"],
        improvementPoints: [],
      },
    } as never);

    const request = createMockRequest({
      payload: { resumeText: "Experiência em Next.js e TypeScript" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.score).toBe(95);
    expect(data.source).toBe("groq-ai");
  });
});
