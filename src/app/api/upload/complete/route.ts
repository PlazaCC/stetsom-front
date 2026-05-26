import type { CompleteUploadInput, LibraryAsset } from "@/lib/api/contracts";
import {
  getCmsApiBaseUrl,
  isMockMode,
  readUpstreamError,
  toErrorResponse,
  unauthorizedResponse,
} from "@/lib/api/route-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return unauthorizedResponse();
    }

    const body = (await request.json()) as CompleteUploadInput;

    // ── Mock mode: return a synthetic asset without hitting the backend ──
    if (isMockMode()) {
      const now = new Date().toISOString();
      const mockAsset: LibraryAsset = {
        id: `mock-${Date.now()}`,
        name: body.name,
        file_url: body.file_url,
        type: body.type,
        size_bytes: body.size_bytes,
        width: body.width,
        height: body.height,
        alt: body.alt,
        product_id: body.product_id,
        revision: body.revision,
        created_at: now,
        created_by: "mock-user",
      };

      return NextResponse.json({ asset: mockAsset }, { status: 201 });
    }

    // ── Remote mode: register the uploaded asset in the library ──
    const base = getCmsApiBaseUrl();
    const upstream = await fetch(`${base}/api/upload/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!upstream.ok) {
      const error = await readUpstreamError(
        upstream,
        "UPLOAD_COMPLETE_FAILED",
        "Falha ao registrar upload.",
      );

      return NextResponse.json({ error }, { status: upstream.status });
    }

    const data = (await upstream.json()) as { asset: LibraryAsset };
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
