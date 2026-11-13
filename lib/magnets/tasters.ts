// The free tasters (11 November 2026).
//
// Justin, 9 November: "Tasters free, full on Etsy." Two or three pages of a
// paid pack, given for an email on /free/<slug>; the full pack stays on Etsy
// and free inside the app. One source of truth for all of it:
// content/printables/free-tasters.json. The Saturday post engine reads the same
// file (slug, title, ages, url, status), scripts/build-tasters.mjs builds the
// PDFs from it, and this file turns each row into a magnet so the gate, the
// capture API and the email read the very same slug.
//
// Pure: no database, no React, so the test and the guards import it.

import data from '@/content/printables/free-tasters.json'
import type { Magnet } from './registry'

export type TasterStatus = 'live' | 'no-listing' | 'hold'

export type Taster = {
  slug: string
  title: string
  ages: string
  agesMin: number
  agesMax: number
  url: string
  status: TasterStatus
  holdReason?: string
  season: string | null
  etsyListing: string | null
  /** The full pack is free to print inside the app (lib/printables/registry.ts). */
  inApp: boolean
  service: string
  source: string
  pages: number[]
  pageCount: number
  blurb: string
  pageNotes: { h: string; b: string }[]
  /**
   * The taster series (13 November 2026): one email per taster page, a subject
   * and one tip, written from the pack's own guide pages. Packs without it get
   * a plain version built from pageNotes, so every taster has a series.
   */
  series?: { subject: string; tip: string }[]
}

export const TASTERS: Taster[] = (data as { tasters: Taster[] }).tasters

/** The magnet slug a taster is saved under: magnet:taster-<slug> on the lead. */
export const TASTER_MAGNET_PREFIX = 'taster-'

export function tasterMagnetSlug(slug: string): string {
  return `${TASTER_MAGNET_PREFIX}${slug}`
}

export function getTaster(slug: string | null | undefined): Taster | null {
  if (!slug) return null
  return TASTERS.find(t => t.slug === slug) ?? null
}

/** The taster behind a magnet slug, or null when the magnet is not a taster. */
export function tasterFromMagnetSlug(magnetSlug: string | null | undefined): Taster | null {
  if (!magnetSlug || !magnetSlug.startsWith(TASTER_MAGNET_PREFIX)) return null
  return getTaster(magnetSlug.slice(TASTER_MAGNET_PREFIX.length))
}

export function etsyUrl(t: Pick<Taster, 'etsyListing'>): string | null {
  return t.etsyListing ? `https://www.etsy.com/uk/listing/${t.etsyListing}` : null
}

export function tasterPdf(slug: string): string {
  return `/printables/free/tasters/${slug}-taster-a4.pdf`
}

export function tasterPreview(slug: string, n: number): string {
  return `/printables/free/tasters/${slug}-taster-p${n}.png`
}

/**
 * The tasters the site promotes, in the file's order: live first, then the
 * packs with no listing yet. A hold is left out (it still works by direct
 * link), because a hold means not for promotion: a retired character, the
 * wrong audience, or below the age the product serves.
 */
export function listedTasters(): Taster[] {
  const rank: Record<TasterStatus, number> = { live: 0, 'no-listing': 1, hold: 2 }
  return TASTERS.filter(t => t.status !== 'hold')
    .map((t, i) => ({ t, i }))
    .sort((a, b) => rank[a.t.status] - rank[b.t.status] || a.i - b.i)
    .map(x => x.t)
}

/** The subject and tip for page n (1 based) of a taster's series. */
export function seriesPage(t: Taster, n: number): { subject: string; tip: string } {
  const own = t.series?.[n - 1]
  if (own) return own
  const note = t.pageNotes[n - 1]
  return {
    subject: `${t.title}, page ${n}: ${note?.h ?? 'your next page'}`,
    tip: note?.b ?? 'Print it, and do it together.',
  }
}

/** Where the rest of the pack lives, in one plain line. Never promises what is not there. */
export function fullPackLine(t: Pick<Taster, 'etsyListing' | 'inApp'>): string {
  if (t.etsyListing && t.inApp) return 'The full pack is on Etsy, and free to print inside the Guided Childhood app.'
  if (t.etsyListing) return 'The full pack is on Etsy.'
  if (t.inApp) return 'The full pack is free to print inside the Guided Childhood app.'
  return 'There are more free printables at guidedchildhood.com/free.'
}

/** A taster as a magnet, so the gate, the API and the email treat it like any other. */
export function tasterMagnet(t: Taster): Magnet {
  const etsy = etsyUrl(t)
  const n = t.pages.length
  return {
    slug: tasterMagnetSlug(t.slug),
    eyebrow: 'Free taster',
    title: `${t.title}: the free taster`,
    intro: t.blurb,
    numbered: false,
    items: [],
    close: fullPackLine(t),
    filename: `${t.slug}-free-taster`,
    staticPdf: tasterPdf(t.slug),
    emailBlurb: etsy
      ? `It is ${n} pages from the ${t.pageCount} page pack, for ages ${t.ages}, to print tonight. No login needed. The full pack is on Etsy whenever you want the rest.`
      : `It is ${n} pages from the ${t.pageCount} page pack, for ages ${t.ages}, to print tonight. No login needed.`,
  }
}
