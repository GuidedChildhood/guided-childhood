import type { MetadataRoute } from 'next'

import { SITE_URL as BASE_URL } from '@/lib/config/site'
import { GUIDES } from '@/lib/content/guides'
import { listedTasters } from '@/lib/magnets/tasters'

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
    { path: '/free/guided-times', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/guides', priority: 0.7, changeFrequency: 'weekly' },
    // Where the parent emails about the child's app and the family agreement
    // land a parent who has no account yet (5 November 2026).
    { path: '/kids-app', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/agreement', priority: 0.6, changeFrequency: 'monthly' },
    // Every guide, from lib/content/guides.ts, so a new one is listed the day
    // it ships (plans/2026-11-02-guides-plan.md).
    ...GUIDES.map(g => ({ path: `/guides/${g.slug}`, priority: 0.7, changeFrequency: 'monthly' as const })),
    // Every promoted free taster, from content/printables/free-tasters.json (11
    // November 2026), so a pack joins the sitemap the day it joins that file.
    // Holds are left out: they work by direct link but are not promoted.
    ...listedTasters().map(t => ({ path: `/free/${t.slug}`, priority: 0.5, changeFrequency: 'monthly' as const })),
  ]

  return routes.map(r => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
