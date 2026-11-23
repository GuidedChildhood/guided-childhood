import type { Metadata } from 'next'

import { SITE_URL } from '@/lib/config/site'

// ONE WAY TO DESCRIBE A PUBLIC PAGE TO SEARCH AND TO SHARING.
//
// Justin, 19 November 2026: make Google and AI search the main way parents
// find us (plans/2026-11-19-seo-and-app-safety-pages-plan.md).
//
// What was wrong. Most public pages set a title and a description, but only six
// set a canonical, and none set their own Open Graph. Next does not rebuild the
// share card from a page's title: a page that leaves openGraph out inherits the
// root layout's whole object, so every page shared on WhatsApp or LinkedIn
// showed the home page's headline. And a page with no canonical leaves Google
// to guess which of /guides, /guides?utm_source=x and /guides/ is the real one.
//
// So every public page builds its metadata here, from three facts it already
// knows: its title, its description and its path. The title goes through the
// root layout's template ("%s | Guided Childhood") unless `absoluteTitle` says
// the page has written the brand in itself.

export type PageMetaInput = {
  /** The page title, without the brand; the root template adds it. */
  title: string
  /** Under 160 characters, in the parent's words. */
  description: string
  /** The path, starting with a slash: '/guides'. The home page is ''. */
  path: string
  /** True when `title` already carries the brand, so the template is skipped. */
  absoluteTitle?: boolean
  /** A share image path or URL; the site card when left out. */
  image?: string
  /** Pages with no search intent (thanks, private links) stay out of the index. */
  noindex?: boolean
  /** 'article' for guides and the app pages, 'website' otherwise. */
  type?: 'website' | 'article'
}

/** What the root layout's template adds after a page's own title. */
export const BRAND_SUFFIX = ' | Guided Childhood'

/**
 * Where Google stops showing a title in full. The Ahrefs audit of 23 November
 * 2026 found 281 titles past it, the 220 app pages and most free printables
 * among them, each cut off mid question in the results.
 */
export const TITLE_MAX = 60

/** The title as it will show in a browser tab and in search results. */
export function shownTitle(title: string, absolute = false): string {
  return absolute || title.length + BRAND_SUFFIX.length > TITLE_MAX ? title : `${title}${BRAND_SUFFIX}`
}

/** The first candidate that fits under TITLE_MAX on its own, else the shortest. */
export function fitTitle(...candidates: string[]): string {
  return candidates.find(c => c.length <= TITLE_MAX) ?? [...candidates].sort((a, b) => a.length - b.length)[0]
}

/** The site's own share card, 1200 by 630. */
export const DEFAULT_SHARE_IMAGE = '/og.png'

/** The full URL of a path on the live site. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`
}

export function pageMetadata(input: PageMetaInput): Metadata {
  const url = absoluteUrl(input.path)
  const image = input.image ?? DEFAULT_SHARE_IMAGE
  return {
    // The brand goes after the page's own words only while the whole still
    // fits: a parent searching reads the question, so the brand is what gives
    // way, never the question (shownTitle above).
    title: input.absoluteTitle || input.title.length + BRAND_SUFFIX.length > TITLE_MAX ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: 'Guided Childhood',
      locale: 'en_GB',
      type: input.type ?? 'website',
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [image],
    },
    ...(input.noindex ? { robots: { index: false, follow: true } } : {}),
  }
}
