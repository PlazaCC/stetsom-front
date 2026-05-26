import type {
  LibraryAssetType,
  UploadPresignResponse,
} from "@/lib/api/contracts";
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

/** Derives the library asset type from MIME type for the mock presign response. */
function mimeToAssetType(
  mime: string,
): Exclude<LibraryAssetType, "OTHER" | "MANUAL" | "CATALOG" | "CERTIFICATE"> {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime === "application/pdf") return "PDF";
  if (mime === "model/gltf-binary" || mime === "model/gltf+json")
    return "MODEL3D";
  return "IMAGE";
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return unauthorizedResponse();
    }

    const body = (await request.json()) as Record<string, unknown>;

    // ── Mock mode: return a fake presign pointing to the local mock-s3 sink ──
    if (isMockMode()) {
      const fileName = String(body.fileName ?? "file");
      const mimeType = String(body.mimeType ?? "image/jpeg");
      const mockKey = `mock/${Date.now()}-${fileName}`;

      const mockPresign: UploadPresignResponse = {
        uploadUrl: "/api/upload/mock-s3",
        file_url: `https://assets.stetsom.com.br/${mockKey}`,
        key: mockKey,
        method: "PUT",
        expiresIn: 900,
        headers: { "Content-Type": mimeType },
        assetType: mimeToAssetType(mimeType),
        fileName,
      };

      return NextResponse.json(mockPresign);
    }

    // ── Remote mode: forward to backend for a real S3 presigned URL ──
    const base = getCmsApiBaseUrl();
    const upstream = await fetch(`${base}/api/upload/`, {
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
