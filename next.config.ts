import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const storageHostname = process.env.STORAGE_PUBLIC_HOSTNAME?.trim()

const nextConfig: NextConfig = {
  images: storageHostname
    ? {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: storageHostname,
            port: '',
            pathname: '/**',
          },
        ],
      }
    : undefined,
}

export default withNextIntl(nextConfig)
