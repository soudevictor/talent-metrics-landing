/**
 * Rate Limiter em memória para proteção contra DoS e abuso de chamadas de IA.
 * Utiliza o algoritmo de janela deslizante (sliding window) baseado em timestamp.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 10; // 10 requisições por minuto por IP

/**
 * Limpa periodicamente entradas antigas para evitar vazamento de memória.
 */
function cleanupExpiredEntries(now: number) {
  if (rateLimitMap.size > 1000) {
    for (const [key, record] of rateLimitMap.entries()) {
      const active = record.timestamps.filter((t) => now - t < WINDOW_MS);
      if (active.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, { timestamps: active });
      }
    }
  }
}

export function checkRateLimit(identifier: string): {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  cleanupExpiredEntries(now);

  const record = rateLimitMap.get(identifier) ?? { timestamps: [] };
  const recentTimestamps = record.timestamps.filter((t) => now - t < WINDOW_MS);

  if (recentTimestamps.length >= MAX_REQUESTS) {
    const oldest = recentTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  recentTimestamps.push(now);
  rateLimitMap.set(identifier, { timestamps: recentTimestamps });

  return {
    success: true,
    remaining: MAX_REQUESTS - recentTimestamps.length,
    retryAfterSeconds: 0,
  };
}
