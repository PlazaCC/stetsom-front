import type { ApiErrorPayload, ProductStatus } from '@/lib/api/contracts'
import { NextResponse } from 'next/server'

export class HttpError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) {
    return fallback
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback
  }

  return Math.floor(parsed)
}

export function parseStatus(value: string | null): ProductStatus | 'ALL' | undefined {
  if (!value) {
    return undefined
  }

  const normalized = value.toUpperCase()

  if (normalized === 'ACTIVE' || normalized === 'DISCONTINUED' || normalized === 'ALL') {
    return normalized
  }

  return undefined
}

export function toErrorResponse(error: unknown) {
  if (error instanceof HttpError) {
    const payload: ApiErrorPayload = {
      error: {
        code: error.code,
        message: error.message,
      },
    }

    return NextResponse.json(payload, { status: error.status })
  }

  const payload: ApiErrorPayload = {
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected server error',
    },
  }

  return NextResponse.json(payload, { status: 500 })
}
