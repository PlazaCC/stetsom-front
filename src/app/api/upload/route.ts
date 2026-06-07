import type { UploadPresignResponse } from "@/api/stetsom/model";
import {
  getCmsApiBaseUrl,
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

    const body = (await request.json()) as Record<string, unknown>;

    const base = getCmsApiBaseUrl();
    const upstream = await fetch(`${base}/api/upload`, {
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
        "UPLOAD_PRESIGN_FAILED",
        "Falha ao gerar URL de upload.",
      );
      return NextResponse.json({ error }, { status: upstream.status });
    }

    const data = (await upstream.json()) as UploadPresignResponse;
    return NextResponse.json(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}
