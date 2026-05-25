import type {
  CreateAdminUserInput,
  LibraryAssetType,
  UpdateAdminUserInput,
} from "@/lib/api/contracts";
import { getCmsProvider } from "@/lib/api/provider";
import { toErrorResponse } from "@/lib/api/route-utils";
import { type NextRequest, NextResponse } from "next/server";

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> },
) {
  try {
    const { resource } = await params;
    const provider = getCmsProvider();
    const sp = request.nextUrl.searchParams;

    switch (resource[0]) {
      case "dashboard":
        return NextResponse.json(await provider.getAdminDashboardPayload());

      case "users":
        return NextResponse.json(await provider.getAdminUsers());

      case "banners":
        return NextResponse.json(await provider.getBanners());

      case "library": {
        const type = parseAssetType(sp.get("type"));
        const assets = await provider.getLibraryAssets(
          type ? { type } : undefined,
        );
        return NextResponse.json(assets);
      }

      case "messages":
        return NextResponse.json(await provider.getContactMessages());

      case "audit":
        return NextResponse.json(await provider.getAuditLog());

      case "config":
        return NextResponse.json(await provider.getCmsConfig());

      case "products": {
        const q = sp.get("q") ?? undefined;
        const rawStatus = sp.get("status");
        const status =
          rawStatus === "ACTIVE" || rawStatus === "DISCONTINUED"
            ? rawStatus
            : undefined;
        const page = sp.get("page") ? Number(sp.get("page")) : undefined;
        const pageSize = sp.get("pageSize")
          ? Number(sp.get("pageSize"))
          : undefined;
        return NextResponse.json(
          await provider.getCmsProductsPayload({ q, status, page, pageSize }),
        );
      }

      default:
        return NextResponse.json(
          { error: "Unknown resource" },
          { status: 404 },
        );
    }
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string[] }> },
) {
  try {
    const { resource } = await params;
    const provider = getCmsProvider();

    switch (resource[0]) {
      case "users": {
        const body = (await request.json()) as CreateAdminUserInput;
        const user = await provider.createAdminUser(body);
        return NextResponse.json(user, { status: 201 });
      }

      default:
        return NextResponse.json(
          { error: "Unknown resource" },
          { status: 404 },
        );
    }
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string[] }> },
) {
  try {
    const { resource } = await params;
    if (resource[0] !== "users" || !resource[1]) {
      return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
    }

    const provider = getCmsProvider();
    const body = (await request.json()) as UpdateAdminUserInput;
    const user = await provider.updateAdminUser(resource[1], body);
    return NextResponse.json(user);
  } catch (error) {
    return toErrorResponse(error);
  }
}
