import type { CmsProvider } from '@/lib/api/provider-contract';
import { createMockCmsProvider } from '@/lib/api/providers/mock-provider';
import { createRemoteCmsProvider } from '@/lib/api/providers/remote-provider';

type ProviderKind = 'mock' | 'remote';

let providerCache: CmsProvider | null = null;

function readProviderKind(): ProviderKind {
  const value = process.env.CMS_PROVIDER?.toLowerCase();

  if (value === 'remote') {
    return 'remote';
  }

  return 'mock';
}

export function getCmsProvider(): CmsProvider {
  if (providerCache) {
    return providerCache;
  }

  const kind = readProviderKind();
  providerCache =
    kind === 'remote' ? createRemoteCmsProvider() : createMockCmsProvider();

  return providerCache;
}
