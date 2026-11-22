import type { AppEntry } from './types'

// THE APPS, one sourced entry each. Filled from the research in the next
// commit (plans/2026-11-19-seo-and-app-safety-pages-plan.md, Phase 2). Empty,
// the route builds no pages and every address it would serve stays a 404.
export const APPS: AppEntry[] = []

export function appBySlug(slug: string): AppEntry | null {
  return APPS.find(a => a.slug === slug) ?? null
}
