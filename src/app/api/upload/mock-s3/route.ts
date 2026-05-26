/**
 * Mock S3 sink — only active in mock mode (no CMS_API_BASE_URL).
 *
 * Accepts any PUT request and returns 200, simulating a successful S3 presigned
 * upload so the full upload flow can be exercised in local dev without a backend.
 * In production (or when CMS_API_BASE_URL is set) this route returns 404.
 */
import { isMockMode } from "@/lib/api/route-utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT() {
  if (!isMockMode()) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Not found." } },
      { status: 404 },
    );
  }

  return new NextResponse(null, { status: 200 });
}
