import { NextResponse } from "next/server";

type ErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
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
      return {
        code: body.error?.code ?? fallbackCode,
        message: body.error?.message ?? fallbackMessage,
      };
    } catch {
      return {
        code: fallbackCode,
        message: fallbackMessage,
      };
    }
  }

  const text = await response.text().catch(() => "");

  return {
    code: fallbackCode,
    message: text.trim() || fallbackMessage,
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

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpected server error",
      },
    },
    { status: 500 },
  );
}
