import type { MetadataRoute } from 'next'

import { SITE_URL as BASE_URL } from '@/lib/config/site'
import { GUIDES } from '@/lib/content/guides'
import { listedTasters } from '@/lib/magnets/tasters'
import { APPS } from '@/lib/app-safety/apps'
import { agePath, appPath } from '@/lib/app-safety/content'
import { AGES } from '@/lib/app-safety/types'

export default function sitemap(): MetadataRoute.Sitemap {
  // lastModified only where we know it. Every entry used to say "changed
  // today" on every deploy, which teaches Google to ignore the field for the
  // whole site. A page with a real date (a guide's `updated`) says so; the
  // rest leave it out, which Google reads as "no claim" (19 November 2026).
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; updated?: string }[] = [
    { path: '', priority: 1, changeFrequency: 'weekly' },
    { path: '/starter-pack', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/scripts', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/pathway', priority: 0.7, changeFrequency: 'monthly' },
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
    { path: '/free/family-week', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/free/guided-times', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/guides', priority: 0.7, changeFrequency: 'weekly' },
    // Where the parent emails about the child's app and the family agreement
    // land a parent who has no account yet (5 November 2026).
    { path: '/kids-app', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/agreement', priority: 0.6, changeFrequency: 'monthly' },
    // Every guide, from lib/content/guides.ts, so a new one is listed the day
    // it ships (plans/2026-11-02-guides-plan.md).
    ...GUIDES.map(g => ({ path: `/guides/${g.slug}`, priority: 0.7, changeFrequency: 'monthly' as const, updated: g.updated })),
    // Every promoted free taster, from content/printables/free-tasters.json (11
    // November 2026), so a pack joins the sitemap the day it joins that file.
    // Holds are left out: they work by direct link but are not promoted.
    ...listedTasters().map(t => ({ path: `/free/${t.slug}`, priority: 0.5, changeFrequency: 'monthly' as const })),
    // The app safety pages (19 November 2026): the hub, one page per app and
    // one per app and age, from lib/app-safety/apps.ts, each dated by when its
    // facts were last checked against the company's own pages.
    { path: '/app-safety-guide', priority: 0.8, changeFrequency: 'weekly' },
    ...APPS.flatMap(a => [
      { path: appPath(a.slug), priority: 0.8, changeFrequency: 'monthly' as const, updated: a.checked },
      ...AGES.map(age => ({ path: agePath(a.slug, age), priority: 0.6, changeFrequency: 'monthly' as const, updated: a.checked })),
    ]),
  ]

  return routes.map(r => ({
    url: `${BASE_URL}${r.path}`,
    ...(r.updated ? { lastModified: new Date(r.updated) } : {}),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
