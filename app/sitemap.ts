import type { MetadataRoute } from 'next'

import { SITE_URL as BASE_URL } from '@/lib/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '', priority: 1, changeFrequency: 'weekly' },
    { path: '/starter-pack', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/scripts', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/pathway', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/get-started', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/join', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/digi-squad', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/ban-workarounds', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/digitalwellbeing', priority: 0.5, changeFrequency: 'monthly' },
    // Public and indexable all along, but missing here, so Google only found
    // them through links (found by the gum SEO build, 21 October 2026).
    // npm run sitemap-guard now fails when a marketing page is in neither
    // this list nor its exclusions.
    { path: '/passport', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/five-questions', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/evidence', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/free', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/free/planet-post', priority: 0.5, changeFrequency: 'monthly' },
  ]

  return routes.map(r => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
