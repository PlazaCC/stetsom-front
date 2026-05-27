import { getCmsProvider } from "@/lib/api/provider";
import { toErrorResponse, unauthorizedResponse } from "@/lib/api/route-utils";
import { verifyAdminToken } from "@/lib/api/verify-admin-token";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  const token = store.get("admin_token")?.value ?? null;
  if (!token) return null;
  return (await verifyAdminToken(token)) ? token : null;
}

export async function GET() {
  const token = await getAdminToken();
  if (!token) return unauthorizedResponse();

  try {
    const provider = getCmsProvider();
    const result = await provider.getAdminPages();
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
