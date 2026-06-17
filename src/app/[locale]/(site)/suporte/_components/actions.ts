"use server";

import type { PostApiContactBody } from "@/api/stetsom/model";
import { OrvalApiError } from "@/api/stetsom/orval-client";
import { serverOrvalClient } from "@/api/stetsom/orval-server";

export type ContactResult = { ok: true } | { ok: false; code: string };

export async function submitContact(
  input: PostApiContactBody,
): Promise<ContactResult> {
  try {
    await serverOrvalClient({
      method: "POST",
      url: "/api/contact",
      data: input,
    });
    return { ok: true };
  } catch (err) {
    if (err instanceof OrvalApiError) return { ok: false, code: err.code };
    return { ok: false, code: "NETWORK_ERROR" };
  }
}
