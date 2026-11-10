import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

type ErrorPayload = {
  error?: {
    code?: string;
    message?: string;
    fields?: Record<string, string>;
  };
};

const SAFE_UPSTREAM_CODES = new Set([
  "BAD_REQUEST",
  "NOT_FOUND",
  "CONFLICT",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "VALIDATION_ERROR",
  "PAYLOAD_TOO_LARGE",
  "TOO_MANY_REQUESTS",
  "SERVICE_UNAVAILABLE",
  "NOT_CONFIGURED",
  "INTERNAL_ERROR",
]);

const SAFE_ERROR_MESSAGES: Record<string, string> = {
  BAD_REQUEST: "Não foi possível processar a solicitação.",
  NOT_FOUND: "Recurso não encontrado.",
  CONFLICT: "Não foi possível concluir porque os dados entram em conflito.",
  UNAUTHORIZED: "Autenticação necessária.",
  FORBIDDEN: "Você não tem permissão para realizar esta ação.",
  VALIDATION_ERROR: "Revise os dados enviados.",
  PAYLOAD_TOO_LARGE: "O arquivo ou conteúdo enviado é muito grande.",
  TOO_MANY_REQUESTS: "Muitas tentativas. Aguarde e tente novamente.",
  SERVICE_UNAVAILABLE: "Serviço temporariamente indisponível.",
  NOT_CONFIGURED: "Serviço temporariamente indisponível.",
  INTERNAL_ERROR: "Não foi possível concluir a operação. Tente novamente.",
};

export function getCmsApiBaseUrl(): string {
  const raw = process.env.CMS_API_BASE_URL;
  if (!raw) return "http://localhost:3333";

  const trimmed = raw.replace(/\/$/, "");
  try {
    const parsed = new URL(trimmed);
    if (!/^https?:$/.test(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }
    return trimmed;
  } catch {
    throw new Error(`CMS_API_BASE_URL inválido: ${raw}`);
  }
}

export function notFoundResponse(message = "Recurso não encontrado.") {
  return NextResponse.json(
    { error: { code: "NOT_FOUND", message } },
    { status: 404 },
  );
}

export function unauthorizedResponse(message = "Não autenticado.") {
  return NextResponse.json(
    { error: { code: "UNAUTHORIZED", message } },
    { status: 401 },
  );
}

export function ensureFound<T>(value: T | null | undefined): T {
  if (value == null) {
    throw new HttpError(404, "NOT_FOUND", "Recurso não encontrado.");
  }

  return value;
}

export async function readUpstreamError(
  response: Response,
  fallbackCode: string,
  fallbackMessage: string,
) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const body = (await response.json()) as ErrorPayload;
      const code =
        body.error?.code && SAFE_UPSTREAM_CODES.has(body.error.code)
          ? body.error.code
          : fallbackCode;
      return { code, message: SAFE_ERROR_MESSAGES[code] ?? fallbackMessage };
    } catch {
      return {
        code: fallbackCode,
        message: fallbackMessage,
      };
    }
  }

  return {
    code: fallbackCode,
    message: fallbackMessage,
  };
}

export function sanitizeUpstreamError(
  payload: unknown,
  fallbackCode = "INTERNAL_ERROR",
): {
  error: { code: string; message: string; fields?: Record<string, string> };
} {
  const candidate =
    payload && typeof payload === "object" && "error" in payload
      ? (payload as { error?: unknown }).error
      : undefined;
  const error = candidate && typeof candidate === "object" ? candidate : {};
  const rawCode =
    "code" in error && typeof error.code === "string" ? error.code : "";
  const code = SAFE_UPSTREAM_CODES.has(rawCode) ? rawCode : fallbackCode;
  const rawFields = "fields" in error && error.fields;
  const fields =
    code === "VALIDATION_ERROR" && rawFields && typeof rawFields === "object"
      ? Object.fromEntries(
          Object.entries(rawFields).filter(
            ([key, value]) =>
              /^[A-Za-z0-9_.-]+$/.test(key) && typeof value === "string",
          ),
        )
      : undefined;
  return {
    error: {
      code,
      message: SAFE_ERROR_MESSAGES[code] ?? SAFE_ERROR_MESSAGES.INTERNAL_ERROR,
      ...(fields && Object.keys(fields).length > 0 ? { fields } : {}),
    },
  };
}

export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function toErrorResponse(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }

  Sentry.captureException(error);

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Não foi possível concluir a operação. Tente novamente.",
      },
    },
    { status: 500 },
  );
}
