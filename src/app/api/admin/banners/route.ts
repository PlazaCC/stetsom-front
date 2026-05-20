import { getCmsProvider } from "@/lib/api/provider";
import { toErrorResponse } from "@/lib/api/route-utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const banners = await getCmsProvider().getBanners();
    return NextResponse.json(banners);
  } catch (error) {
    return toErrorResponse(error);
  }
}
