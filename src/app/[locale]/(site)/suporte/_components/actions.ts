"use server";

import type { PostApiContactBody } from "@/api/stetsom/model";
import { serverOrvalClient } from "@/api/stetsom/orval-server";

export async function submitContact(input: PostApiContactBody) {
  await serverOrvalClient({
    method: "POST",
    url: "/api/contact/",
    data: input,
  });
}
