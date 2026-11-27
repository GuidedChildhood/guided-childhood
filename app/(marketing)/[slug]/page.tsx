import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import AppSafetyPage from '@/components/app-safety/AppSafetyPage'
import { APPS, appBySlug } from '@/lib/app-safety/apps'
import { agePath, appPageTitle, appPath, directAnswer, parseSegment } from '@/lib/app-safety/content'
import { AGES, type Age } from '@/lib/app-safety/types'
import { pageMetadata } from '@/lib/seo/meta'

// THE APP SAFETY PAGES: /is-<app>-safe and /is-<app>-safe-for-<age>-year-old.
//
// Next cannot put a parameter inside a segment (is-[app]-safe), so this one
// top level segment is built for exactly the pages in lib/app-safety/apps.ts
// and nothing else: generateStaticParams lists them all, every one is static
// HTML made at build, and dynamicParams = false makes any other top level
// address a 404, exactly as it was before this route existed. Static routes
// (/guides, /join and the rest) always win over a dynamic one, so none of them
// can be shadowed.

export const dynamicParams = false

export function generateStaticParams() {
  return APPS.flatMap(app => [
    { slug: appPath(app.slug).slice(1) },
    ...AGES.map(age => ({ slug: agePath(app.slug, age).slice(1) })),
  ])
}

function resolve(segment: string) {
  const parsed = parseSegment(segment)
  if (!parsed) return null
  const app = appBySlug(parsed.slug)
  if (!app) return null
  if (parsed.age !== null && !(AGES as readonly number[]).includes(parsed.age)) return null
  return { app, age: parsed.age as Age | null }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const hit = resolve((await params).slug)
  if (!hit) return {}
  const { app, age } = hit
  return pageMetadata({
    // The question a parent types, and nothing after it: with the template's
    // " | Guided Childhood" every app title stays under 60 characters, where
    // Google stops cutting it off (Ahrefs audit, 23 November 2026: 281 titles
    // too long, these 220 among them). `npm run seo-titles` holds the line.
    title: appPageTitle(app, age),
    description: directAnswer(app, age),
    path: age ? agePath(app.slug, age) : appPath(app.slug),
    type: 'article',
  })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const hit = resolve((await params).slug)
  if (!hit) notFound()
  return <AppSafetyPage app={hit.app} age={hit.age} />
}

