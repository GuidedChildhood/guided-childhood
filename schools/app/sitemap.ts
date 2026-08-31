import type { MetadataRoute } from 'next'

// Only the open pages belong in the sitemap: everything else redirects to
// /unlock (which sets noindex), so listing gated routes would just hand
// crawlers a wall of redirects. Keep this list in step with OPEN_PATHS in
// lib/access.ts, minus /unlock itself.

const BASE = 'https://schools.guidedchildhood.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/curriculum`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/philosophy`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/hub/rshe-mapping`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/pricing`, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
