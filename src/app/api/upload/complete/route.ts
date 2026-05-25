import type { CompleteUploadInput, LibraryAsset } from "@/lib/api/contracts";
import { getCmsApiBaseUrl, toErrorResponse } from "@/lib/api/route-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Não autenticado." } },
        { status: 401 },
      );
    }

    const body = (await request.json()) as CompleteUploadInput;
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
      const data = (await upstream.json()) as Record<string, unknown>;
      return NextResponse.json(data, { status: upstream.status });
    }

    const data = (await upstream.json()) as { asset: LibraryAsset };
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
