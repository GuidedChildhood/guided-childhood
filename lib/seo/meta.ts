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
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
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
