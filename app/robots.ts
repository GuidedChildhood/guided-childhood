import type { MetadataRoute } from 'next'

import { SITE_URL as BASE_URL } from '@/lib/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Both /dev and /ref- 404 on the live deployment (app/dev/layout.tsx
        // and middleware.ts). Listed anyway, because belt and braces costs one
        // line and a crawler that finds a stale link should not go looking.
        disallow: ['/dashboard', '/api', '/auth', '/onboarding', '/dev', '/ref-'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
