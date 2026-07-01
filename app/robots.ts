import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.guidedchildhood.co.uk'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api', '/auth', '/onboarding'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
