import type { LibraryAssetType } from "@/lib/api/contracts";
import { getCmsProvider } from "@/lib/api/provider";
import { toErrorResponse } from "@/lib/api/route-utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const VALID_TYPES: LibraryAssetType[] = [
  "IMAGE",
  "PDF",
  "VIDEO",
  "MODEL3D",
  "OTHER",
];

function parseAssetType(value: string | null): LibraryAssetType | undefined {
  if (!value) return undefined;
  const upper = value.toUpperCase() as LibraryAssetType;
  return VALID_TYPES.includes(upper) ? upper : undefined;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = parseAssetType(searchParams.get("type"));
    const assets = await getCmsProvider().getLibraryAssets(
      type ? { type } : undefined,
    );
    return NextResponse.json(assets);
  } catch (error) {
    return toErrorResponse(error);
  }
}
