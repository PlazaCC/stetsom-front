import type { CmsProvider } from "@/lib/api/provider-contract";
import { CATALOG_ROUTE_MAP, forwardRequest } from "@/lib/api/bff-forward";
import { getCmsProvider } from "@/lib/api/provider";
import {
  isMockMode,
  notFoundResponse,
  toErrorResponse,
} from "@/lib/api/route-utils";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// -- Param helpers --

function parseStatus(v: string | null): "ACTIVE" | "DISCONTINUED" | undefined {
  return v === "ACTIVE" || v === "DISCONTINUED" ? v : undefined;
}

function parseNum(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

// -- Mock handler map --

type MockGetHandler = (
  p: CmsProvider,
  r: string[],
  sp: URLSearchParams,
) => Promise<unknown>;

const MOCK_GET: Record<string, MockGetHandler> = {
  page: (p, _, sp) => p.getCatalogPagePayload(sp.get("locale") ?? undefined),

  products: (p, r, sp) => {
    const locale = sp.get("locale") ?? undefined;
    return r[1]
      ? p.getCatalogProductDetail(r[1], locale)
      : p.getCatalogProducts(
          {
            q: sp.get("q") ?? undefined,
            category: sp.get("category") ?? undefined,
            status: parseStatus(sp.get("status")),
            page: parseNum(sp.get("page")),
            pageSize: parseNum(sp.get("pageSize")),
          },
          locale,
        );
  },

  categories: (p, _, sp) =>
    p.getCatalogCategories(sp.get("locale") ?? undefined),
  subcategories: (p, _, sp) =>
    p.getCatalogSubcategories(sp.get("locale") ?? undefined),
};

// -- Route handler --

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> },
) {
  try {
    const { resource } = await params;
    const sp = request.nextUrl.searchParams;

    if (!isMockMode()) {
      // subcategories requires a server-side flatMap transform; always via provider
      if (resource[0] === "subcategories") {
        const result = await getCmsProvider().getCatalogSubcategories(
          sp.get("locale") ?? undefined,
        );
        return NextResponse.json(result);
      }

      const upstreamPath = CATALOG_ROUTE_MAP[resource[0]];
      if (!upstreamPath) return notFoundResponse();
      return forwardRequest(request, upstreamPath, resource);
    }

    const handler = MOCK_GET[resource[0]];
    if (!handler) return notFoundResponse();

    const result = await handler(getCmsProvider(), resource, sp);
    if (result === null) return notFoundResponse();
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
