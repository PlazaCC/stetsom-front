import type { CmsProvider } from "@/lib/api/provider-contract";
import { createRemoteCmsProvider } from "@/lib/api/providers/remote-provider";

let providerCache: CmsProvider | null = null;

/**
 * Retorna o provider remoto (Fastify API).
 * O provider mock foi removido — toda a comunicação vai para CMS_API_BASE_URL.
 */
export function getCmsProvider(): CmsProvider {
  if (providerCache) {
    return providerCache;
  }

  providerCache = createRemoteCmsProvider();
  return providerCache;
}
