import type { CreateAdminUserInput } from "@/lib/api/contracts";
import { getCmsProvider } from "@/lib/api/provider";
import { toErrorResponse } from "@/lib/api/route-utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getCmsProvider().getAdminUsers();
    return NextResponse.json(payload);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateAdminUserInput;
    const user = await getCmsProvider().createAdminUser(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
