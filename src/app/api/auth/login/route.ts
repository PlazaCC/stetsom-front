import type { LoginCredentials } from "@/lib/api/contracts";
import { getCmsProvider } from "@/lib/api/provider";
import { toErrorResponse } from "@/lib/api/route-utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginCredentials;
    const payload = await getCmsProvider().login(body);

    const response = NextResponse.json(payload);

    response.cookies.set("admin_token", payload.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}
