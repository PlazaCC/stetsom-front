import { ADMIN_ROUTE_MAP, forwardRequest } from "@/lib/api/bff-forward";
import type {
  CmsConfig,
  CreateAdminUserInput,
  CreateBannerInput,
  CreateCmsProductInput,
  LibraryAssetType,
  PageId,
  UpdateAdminUserInput,
  UpdateCmsProductInput,
} from "@/lib/api/contracts";
import { getCmsProvider } from "@/lib/api/provider";
import type { CmsProvider } from "@/lib/api/provider-contract";
import {
  HttpError,
  ensureFound,
  getProxyUpstreamPath,
  isMockMode,
  toErrorResponse,
  unauthorizedResponse,
} from "@/lib/api/route-utils";
import { verifyAdminToken } from "@/lib/api/verify-admin-token";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// -- Auth guard --

/** Returns the admin token value, or null if absent. Single cookies() read per request. */
async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get("admin_token")?.value ?? null;
}

async function ensureAdminToken(): Promise<string | null> {
  const token = await getAdminToken();
  if (!token) return null;
  return (await verifyAdminToken(token)) ? token : null;
}

// -- Param helpers --

const VALID_ASSET_TYPES = new Set<LibraryAssetType>([
  "IMAGE",
  "PDF",
  "VIDEO",
  "MODEL3D",
  "MANUAL",
  "CATALOG",
  "CERTIFICATE",
  "OTHER",
]);

function parseAssetType(value: string | null): LibraryAssetType | undefined {
  if (!value) return undefined;
  const upper = value.toUpperCase() as LibraryAssetType;
  return VALID_ASSET_TYPES.has(upper) ? upper : undefined;
}

function parseStatus(v: string | null): "ACTIVE" | "DISCONTINUED" | undefined {
  return v === "ACTIVE" || v === "DISCONTINUED" ? v : undefined;
}

function parseNum(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

// -- Mock handler maps --

type MockGetHandler = (
  p: CmsProvider,
  r: string[],
  sp: URLSearchParams,
) => Promise<unknown>;
type MockPostHandler = (p: CmsProvider, body: unknown) => Promise<unknown>;
type MockPatchHandler = (
  p: CmsProvider,
  r: string[],
  body: unknown,
) => Promise<unknown>;
type MockDeleteHandler = (p: CmsProvider, r: string[]) => Promise<unknown>;

const MOCK_GET: Record<string, MockGetHandler> = {
  dashboard: (p) => p.getAdminDashboardPayload(),
  users: (p) => p.getAdminUsers(),
  banners: (p) => p.getBanners(),
  library: (p, _, sp) => {
    const type = parseAssetType(sp.get("type"));
    return p.getLibraryAssets(type ? { type } : undefined);
  },
  messages: (p) => p.getContactMessages(),
  audit: (p) => p.getAuditLog(),
  config: (p) => p.getCmsConfig(),
  products: (p, r, sp) =>
    r[1]
      ? p.getCmsProductDetail(r[1])
      : p.getCmsProductsPayload({
          q: sp.get("q") ?? undefined,
          status: parseStatus(sp.get("status")),
          page: parseNum(sp.get("page")),
          pageSize: parseNum(sp.get("pageSize")),
        }),
  pages: (p, r) =>
    r[1] ? p.getAdminPageSections(r[1] as PageId) : p.getAdminPages(),
};

const MOCK_POST: Record<string, MockPostHandler> = {
  users: (p, body) => p.createAdminUser(body as CreateAdminUserInput),
  products: (p, body) => p.createCmsProduct(body as CreateCmsProductInput),
  banners: (p, body) => p.createBanner(body as CreateBannerInput),
};

const MOCK_PATCH: Record<string, MockPatchHandler> = {
  users: (p, r, body) => {
    if (!r[1]) throw new HttpError(404, "NOT_FOUND", "Resource ID required.");
    return p.updateAdminUser(r[1], body as UpdateAdminUserInput);
  },
  products: (p, r, body) => {
    if (!r[1]) throw new HttpError(404, "NOT_FOUND", "Resource ID required.");
    return p.updateCmsProduct(r[1], body as UpdateCmsProductInput);
  },
  banners: (p, r, body) => {
    if (!r[1]) throw new HttpError(404, "NOT_FOUND", "Resource ID required.");
    return p.updateBanner(r[1], body as Partial<CreateBannerInput>);
  },
  config: (_, __, body) =>
    getCmsProvider().updateCmsConfig(body as Partial<CmsConfig>),
  messages: (p, r, body) => {
    if (!r[1]) throw new HttpError(404, "NOT_FOUND", "Resource ID required.");
    const { is_read } = body as { is_read: boolean };
    return p.markMessageRead(r[1], is_read);
  },
  pages: (p, r, body) => {
    // r = ["pages", "sections", ":sectionId"]
    const sectionId = r[2];
    if (!sectionId)
      throw new HttpError(404, "NOT_FOUND", "Section ID required.");
    const { data } = body as { data: Record<string, unknown> };
    return p.updatePageSection(sectionId, data);
  },
};

const MOCK_DELETE: Record<string, MockDeleteHandler> = {
  products: (p, r) => {
    if (!r[1]) throw new HttpError(404, "NOT_FOUND", "Resource ID required.");
    return p.deleteCmsProduct(r[1]);
  },
  banners: (p, r) => {
    if (!r[1]) throw new HttpError(404, "NOT_FOUND", "Resource ID required.");
    return p.deleteBanner(r[1]);
  },
};

// -- Route handlers --

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> },
) {
  const token = await ensureAdminToken();
  if (!token) return unauthorizedResponse();

  try {
    const { resource } = await params;

    if (!isMockMode()) {
      const adjustedResource =
        resource[0] === "products"
          ? [resource[0], "admin", ...resource.slice(1)]
          : resource;
      const upstreamPath = getProxyUpstreamPath(
        ADMIN_ROUTE_MAP,
        adjustedResource,
      );
      return forwardRequest(request, upstreamPath, adjustedResource, token);
    }

    const handler = MOCK_GET[resource[0]];
    const result = ensureFound(
      handler
        ? await handler(
            getCmsProvider(),
            resource,
            request.nextUrl.searchParams,
          )
        : null,
    );
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> },
) {
  const token = await ensureAdminToken();
  if (!token) return unauthorizedResponse();

  try {
    const { resource } = await params;

    if (!isMockMode()) {
      const upstreamPath = getProxyUpstreamPath(ADMIN_ROUTE_MAP, resource);
      return forwardRequest(request, upstreamPath, resource, token);
    }

    const handler = MOCK_POST[resource[0]];
    if (!handler)
      throw new HttpError(404, "NOT_FOUND", "Recurso não encontrado.");

    const body = await request.json();
    const result = await handler(getCmsProvider(), body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> },
) {
  const token = await ensureAdminToken();
  if (!token) return unauthorizedResponse();

  try {
    const { resource } = await params;

    if (!isMockMode()) {
      const upstreamPath = getProxyUpstreamPath(ADMIN_ROUTE_MAP, resource);
      return forwardRequest(request, upstreamPath, resource, token);
    }

    const handler = MOCK_PATCH[resource[0]];
    if (!handler)
      throw new HttpError(404, "NOT_FOUND", "Recurso não encontrado.");

    const body = await request.json();
    const result = await handler(getCmsProvider(), resource, body);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> },
) {
  const token = await ensureAdminToken();
  if (!token) return unauthorizedResponse();

  try {
    const { resource } = await params;

    if (!isMockMode()) {
      const upstreamPath = getProxyUpstreamPath(ADMIN_ROUTE_MAP, resource);
      return forwardRequest(request, upstreamPath, resource, token);
    }

    const handler = MOCK_DELETE[resource[0]];
    if (!handler)
      throw new HttpError(404, "NOT_FOUND", "Recurso não encontrado.");

    await handler(getCmsProvider(), resource);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
