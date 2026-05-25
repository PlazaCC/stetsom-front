import { getCmsProvider } from "@/lib/api/provider";
import { HttpError, toErrorResponse } from "@/lib/api/route-utils";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> },
) {
  try {
    const { resource } = await params;
    const provider = getCmsProvider();
    const sp = request.nextUrl.searchParams;
    const locale = sp.get("locale") ?? undefined;

    switch (resource[0]) {
      case "page":
        return NextResponse.json(await provider.getCatalogPagePayload(locale));

      case "products": {
        if (resource[1]) {
          const detail = await provider.getCatalogProductDetail(
            resource[1],
            locale,
          );
          if (!detail)
            throw new HttpError(404, "NOT_FOUND", "Product not found");
          return NextResponse.json(detail);
        }
        const q = sp.get("q") ?? undefined;
        const category = sp.get("category") ?? undefined;
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
          await provider.getCatalogProducts(
            { q, category, status, page, pageSize },
            locale,
          ),
        );
      }

      case "categories":
        return NextResponse.json(await provider.getCatalogCategories(locale));

      case "subcategories":
        return NextResponse.json(
          await provider.getCatalogSubcategories(locale),
        );

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
