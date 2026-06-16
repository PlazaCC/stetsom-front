import { OrvalApiError, toApiError } from "@/api/stetsom/orval-client";

/**
 * Maps the typed contract error codes to user-facing messages. We branch on
 * `OrvalApiError.code` (never on the raw `message`, which is display-only).
 */
const CODE_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: "Sua sessão expirou. Faça login novamente.",
  FORBIDDEN: "Você não tem permissão para esta ação.",
  NOT_FOUND: "Registro não encontrado.",
  CONFLICT: "Já existe um registro com esses dados.",
  VALIDATION_ERROR: "Dados inválidos. Verifique os campos e tente novamente.",
  INVALID_UPLOAD: "Arquivo inválido: tipo ou tamanho não permitido.",
  SERVICE_UNAVAILABLE:
    "Serviço temporariamente indisponível. Tente novamente em instantes.",
  NOT_CONFIGURED:
    "Serviço temporariamente indisponível. Tente novamente em instantes.",
  TOO_MANY_REQUESTS:
    "Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.",
};

/**
 * Resolve a user-facing message from an unknown thrown value by branching on the
 * contract error code. Falls back to the caller's message for unmapped codes.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const apiError = error instanceof OrvalApiError ? error : toApiError(error);
  return CODE_MESSAGES[apiError.code] ?? fallback;
}
