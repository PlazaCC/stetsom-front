"use server";

import type { PostApiContactBody } from "@/api/stetsom/model";
import { OrvalApiError } from "@/api/stetsom/orval-client";
import { postApiContact } from "@/api/stetsom/server/contact/contact";

export type ContactResult =
  | { ok: true }
  | {
      ok: false;
      code: string;
      message: string;
      fields: Record<string, string>;
    };

export async function submitContact(
  input: PostApiContactBody,
): Promise<ContactResult> {
  try {
    await postApiContact(input);
    return { ok: true };
  } catch (err) {
    if (err instanceof OrvalApiError) {
      return {
        ok: false,
        code: err.code,
        message: err.message,
        fields: err.fields,
      };
    }
    return {
      ok: false,
      code: "NETWORK_ERROR",
      message: "Não foi possível conectar ao serviço.",
      fields: {},
    };
  }
}
