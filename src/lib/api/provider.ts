import type { CmsProvider } from "@/lib/api/provider-contract";
import { createMockCmsProvider } from "@/lib/api/providers/mock-provider";
import { createRemoteCmsProvider } from "@/lib/api/providers/remote-provider";

let providerCache: CmsProvider | null = null;

/**
 * Returns the active CMS provider.
 *
 * - `CMS_API_BASE_URL` set → remote (stetsom-api)
 * - `CMS_FORCE_BFF=1`     → remote even without base URL (for testing, will break)
 * - otherwise              → mock (local data, no network)
 */
export function getCmsProvider(): CmsProvider {
  if (providerCache) return providerCache;

  const hasBaseUrl = !!process.env.CMS_API_BASE_URL;
  const forceBff = process.env.CMS_FORCE_BFF === "1";

  providerCache =
    hasBaseUrl || forceBff
      ? createRemoteCmsProvider()
      : createMockCmsProvider();

  return providerCache;
}
