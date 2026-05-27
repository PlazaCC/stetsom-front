import type { PageId } from "@/lib/api/contracts";
import { getCmsProvider } from "@/lib/api/provider";
import {
  HttpError,
  toErrorResponse,
  unauthorizedResponse,
} from "@/lib/api/route-utils";
import { verifyAdminToken } from "@/lib/api/verify-admin-token";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const VALID_PAGE_IDS = new Set<PageId>(["home", "catalog", "about", "support"]);

async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  const token = store.get("admin_token")?.value ?? null;
  if (!token) return null;
  return (await verifyAdminToken(token)) ? token : null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> },
) {
  const token = await getAdminToken();
  if (!token) return unauthorizedResponse();

  try {
    const { pageId } = await params;
    if (!VALID_PAGE_IDS.has(pageId as PageId)) {
      throw new HttpError(
        404,
        "NOT_FOUND",
        `Página "${pageId}" não encontrada.`,
      );
    }

    const provider = getCmsProvider();
    const result = await provider.getAdminPageSections(pageId as PageId);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
