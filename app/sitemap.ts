import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.guidedchildhood.co.uk'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '', priority: 1, changeFrequency: 'weekly' },
    { path: '/starter-pack', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/schools', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/scripts', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/pathway', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/get-started', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/join', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/digi-squad', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/ban-workarounds', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/digitalwellbeing', priority: 0.5, changeFrequency: 'monthly' },
  ]

  return routes.map(r => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
