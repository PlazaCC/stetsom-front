import type { CmsProvider } from "@/lib/api/provider-contract";
import { createMockCmsProvider } from "@/lib/api/providers/mock-provider";
import { createRemoteCmsProvider } from "@/lib/api/providers/remote-provider";

let providerCache: CmsProvider | null = null;

/**
 * Retorna o CMS provider ativo.
 *
 * - `CMS_PROVIDER=mock`  → dados locais (dev sem backend)
 * - qualquer outro valor → provider remoto (stetsom-api)
 */
export function getCmsProvider(): CmsProvider {
  if (providerCache) return providerCache;
  providerCache =
    process.env.CMS_PROVIDER === "mock"
      ? createMockCmsProvider()
      : createRemoteCmsProvider();
  return providerCache;
}
