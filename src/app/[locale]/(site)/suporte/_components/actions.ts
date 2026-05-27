"use server";

import { getCmsProvider } from "@/lib/api/provider";
import type { ContactFormInput } from "@/lib/api/contracts";

export async function submitContact(input: ContactFormInput) {
  await getCmsProvider().submitContact(input);
}
