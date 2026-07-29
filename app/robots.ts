import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.guidedchildhood.co.uk'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /dev is 404 on the live deployment (see app/dev/layout.tsx). Listed
        // anyway, because belt and braces costs one line and a crawler that
        // finds a stale link should not go looking.
        disallow: ['/dashboard', '/api', '/auth', '/onboarding', '/dev'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
