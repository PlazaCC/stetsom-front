import type { UpdateAdminUserInput } from "@/lib/api/contracts";
import { getCmsProvider } from "@/lib/api/provider";
import { toErrorResponse } from "@/lib/api/route-utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateAdminUserInput;
    const user = await getCmsProvider().updateAdminUser(id, body);
    return NextResponse.json(user);
  } catch (error) {
    return toErrorResponse(error);
  }
}
