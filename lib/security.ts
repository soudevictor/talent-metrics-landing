/**
 * Utilitários de segurança para sanitização de inputs e mitigação de Prompt Injection.
 */

/**
 * Sanitiza o cargo-alvo removendo caracteres de quebra de linha,
 * caracteres de controle e limitando o tamanho para evitar injeções de prompt.
 */
export function sanitizeJobTitle(rawTitle?: string): string {
  if (!rawTitle) return "";

  return rawTitle
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[<>{}\\]/g, "")
    .trim()
    .slice(0, 120);
}

/**
 * Obtém o identificador do cliente (IP) a partir da requisição HTTP.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}
