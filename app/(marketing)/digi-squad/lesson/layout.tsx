import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/seo/meta'

// An early lesson demo, kept for links that still point here. The real lessons
// live in the child app, so this one stays out of the index (it is already
// excluded from the sitemap, scripts/check-sitemap-coverage.mjs).
export const metadata: Metadata = pageMetadata({
  title: 'A DiGi lesson demo',
  description: 'An early demo of a DiGi lesson. The real lessons live in the Guided Childhood child app.',
  path: '/digi-squad/lesson',
  noindex: true,
})

export default function LessonDemoLayout({ children }: { children: React.ReactNode }) {
  return children
}
