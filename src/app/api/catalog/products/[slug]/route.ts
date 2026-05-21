import { HttpError, toErrorResponse } from "@/lib/api/route-utils";
import { getCatalogProductDetail } from "@/lib/api/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const payload = await getCatalogProductDetail(slug);

    if (!payload) {
      throw new HttpError(404, "NOT_FOUND", "Product not found");
    }

    return NextResponse.json(payload);
  } catch (error) {
    return toErrorResponse(error);
  }
}
