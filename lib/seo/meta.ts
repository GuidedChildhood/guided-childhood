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

/** Google shows roughly the first 155 characters of a description. */
export const DESC_MAX = 155

/**
 * A description that fits in a search result (27 November 2026). A crawl of
 * the 276 sitemap pages found 115 descriptions past 155 characters, which
 * Google cuts off mid sentence with an ellipsis. Cut at the last whole word
 * that fits and end on a full stop, so it reads as finished. A page whose own
 * line is short enough is left exactly as written.
 */
export function fitDescription(text: string): string {
  const t = text.trim()
  if (t.length <= DESC_MAX) return t
  // The last whole sentence that fits, when that still says enough (80
  // characters or more). A sentence cut short ("If it comes into.") reads as
  // broken in a result; a shorter complete one reads as meant.
  const window = t.slice(0, DESC_MAX + 1)
  const ends = [...window.matchAll(/[.!?](?=\s|$)/g)].map(m => (m.index ?? 0) + 1).filter(i => i <= DESC_MAX)
  const lastEnd = ends.length ? ends[ends.length - 1] : 0
  if (lastEnd >= 80) return t.slice(0, lastEnd)
  // Next best, the end of a clause: "before they start: Linked." reads as
  // broken, "before they start." does not.
  // A colon or semicolon first, since what follows one is a list or a new
  // thought; a comma only when there is neither.
  const breaks = (re: RegExp) => [...window.matchAll(re)].map(m => m.index ?? 0).filter(i => i >= 80 && i < DESC_MAX)
  const strong = breaks(/[:;](?=\s)/g)
  const clauses = strong.length ? strong : breaks(/,(?=\s)/g)
  if (clauses.length) return `${t.slice(0, clauses[clauses.length - 1])}.`
  const cut = t.slice(0, DESC_MAX)
  const atWord = cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,:;]+$/, '').replace(/[.!?]+$/, '')
  return `${atWord}.`
}

export function pageMetadata(input: PageMetaInput): Metadata {
  const url = absoluteUrl(input.path)
  const description = fitDescription(input.description)
  const image = input.image ?? DEFAULT_SHARE_IMAGE
  return {
    // The brand goes after the page's own words only while the whole still
    // fits: a parent searching reads the question, so the brand is what gives
    // way, never the question (shownTitle above).
    title: input.absoluteTitle || input.title.length + BRAND_SUFFIX.length > TITLE_MAX ? { absolute: input.title } : input.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description,
      url,
      siteName: 'Guided Childhood',
      locale: 'en_GB',
      type: input.type ?? 'website',
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description,
      images: [image],
    },
    ...(input.noindex ? { robots: { index: false, follow: true } } : {}),
  }
}
