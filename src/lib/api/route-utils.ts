import type { ApiErrorPayload, ProductStatus } from "@/lib/api/contracts";
import { NextResponse } from "next/server";

type ErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
};

export function getCmsApiBaseUrl(): string {
  return (
    process.env.CMS_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3333"
  );
}

export function unauthorizedResponse(message = "Não autenticado.") {
  const payload: ApiErrorPayload = {
    error: {
      code: "UNAUTHORIZED",
      message,
    },
  };

  return NextResponse.json(payload, { status: 401 });
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

export function parsePositiveInt(
  value: string | null,
  fallback: number,
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
}

export function parseStatus(
  value: string | null,
): ProductStatus | "ALL" | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.toUpperCase();

  if (
    normalized === "ACTIVE" ||
    normalized === "DISCONTINUED" ||
    normalized === "ALL"
  ) {
    return normalized;
  }

  return undefined;
}

export function toErrorResponse(error: unknown) {
  if (error instanceof HttpError) {
    const payload: ApiErrorPayload = {
      error: {
        code: error.code,
        message: error.message,
      },
    };

    return NextResponse.json(payload, { status: error.status });
  }

  const payload: ApiErrorPayload = {
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected server error",
    },
  };

  return NextResponse.json(payload, { status: 500 });
}
