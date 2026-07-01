import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const exit = searchParams.get("exit") === "true";

  const draft = await draftMode();

  if (exit) {
    draft.disable();
    return NextResponse.redirect(new URL("/admin/produtos", request.url));
  }

  draft.enable();

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  return NextResponse.redirect(
    new URL(`/produtos/${slug}?preview=true`, request.url),
  );
}
