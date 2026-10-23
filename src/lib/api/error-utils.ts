import { OrvalApiError, toApiError } from "@/api/stetsom/orval-client";

/** The API owns user-facing messages; fallback is only for network/unknown errors. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const apiError = getApiError(error);
  return apiError.code === "UNKNOWN" ? fallback : apiError.message;
}

export function getApiError(error: unknown): OrvalApiError {
  return error instanceof OrvalApiError ? error : toApiError(error);
}
