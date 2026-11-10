"use server";

import type { PostApiContactBody } from "@/api/stetsom/model";
import { OrvalApiError } from "@/api/stetsom/orval-client";
import { postApiContact } from "@/api/stetsom/server/contact/contact";

export type ContactResult =
  | { ok: true }
  | {
      ok: false;
      code: string;
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
        code:
          err.status === 0
            ? "NETWORK_ERROR"
            : err.status >= 500
              ? "SERVICE_UNAVAILABLE"
              : err.status === 429
                ? "TOO_MANY_REQUESTS"
                : err.code,
        fields: Object.fromEntries(
          Object.entries(err.fields).filter(([key]) =>
            [
              "name",
              "email",
              "phone",
              "message",
              "department",
              "privacy_accepted",
            ].includes(key),
          ),
        ),
      };
    }
    return {
      ok: false,
      code: "NETWORK_ERROR",
      fields: {},
    };
  }
}
