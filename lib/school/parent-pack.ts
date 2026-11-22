import { SITE_URL } from '@/lib/config/site'
import { codeFromSchoolName, normaliseLinkCode } from './link'

// THE SCHOOL PARENT PACK: /schools/parent-pack?school=<name or code>.
//
// Justin, 19 November 2026 (plans/2026-11-19-seo-and-app-safety-pages-plan.md,
// Phase 3): a page a school sends parents in its newsletter, with a blurb to
// copy, a QR code and the free tools, and its own tracked link per school.
//
// Two kinds of school. One with a Guided Childhood code (migration 353,
// school_links) gets its real link, /s/<code>, which remembers the school on
// the family's profile when they start: the strongest attribution we have. One
// without gets the name it typed on the page and UTM tags, which PostHog keeps
// (lib/analytics/posthog-policy.ts keeps utm_* and strips everything else), so
// its visits are still counted per school. The name never goes into a URL raw:
// only its slug does, which is a school's name and nothing about a family.
//
// Pure, so `npm run school-pack-test` runs it without a database.

export const PACK_PATH = '/schools/parent-pack'

/** A school name as it may appear on the page: letters, numbers, spaces and a little punctuation, 60 at most. */
export function cleanSchoolName(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null
  const name = raw
    .normalize('NFKC')
    .replace(/[‐-―−-]+/g, ' ')
    .replace(/[^\p{L}\p{N} '’&.,()]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60)
    .trim()
  return name.length >= 2 ? name : null
}

/** The code to look up for a ?school= value: the value itself if it is shaped like one, else one made from it. */
export function candidateCode(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null
  return normaliseLinkCode(raw) ?? codeFromSchoolName(raw)
}

export type PackSchool =
  | { kind: 'none' }
  | { kind: 'linked'; code: string; name: string }
  | { kind: 'named'; slug: string; name: string }

/** The tags every link on a school's pack carries, so PostHog can count it per school. */
export function utmFor(slug: string): string {
  return new URLSearchParams({ utm_source: 'school', utm_medium: 'newsletter', utm_campaign: slug }).toString()
}

/** Any of our own paths, tagged for this school. */
export function trackedPath(path: string, school: PackSchool): string {
  if (school.kind === 'none') return path
  const slug = school.kind === 'linked' ? school.code : school.slug
  return `${path}${path.includes('?') ? '&' : '?'}${utmFor(slug)}`
}

/**
 * The one link the blurb and the QR code carry: where a parent starts. Short
 * on purpose, to print and to scan. A linked school's /s/<code> remembers it on
 * the family's profile; anyone else's /go/<slug> forwards to the stage check
 * with the school's tags (app/go/[school]/route.ts).
 */
export function startLink(school: PackSchool): string {
  if (school.kind === 'linked') return `${SITE_URL}/s/${school.code}`
  if (school.kind === 'named') return `${SITE_URL}/go/${school.slug}`
  return `${SITE_URL}/starter-pack`
}

/** The address of a school's own pack, for the page's "make your link" form and the share line. */
export function packLink(school: PackSchool): string {
  if (school.kind === 'none') return `${SITE_URL}${PACK_PATH}`
  const value = school.kind === 'linked' ? school.code : school.name
  return `${SITE_URL}${PACK_PATH}?school=${encodeURIComponent(value)}`
}

/** The words a school pastes into its newsletter. No dashes, no claim the product cannot show. */
export function blurb(school: PackSchool): string {
  const link = startLink(school)
  return [
    'Many of you ask us about phones, games and apps at home.',
    'Guided Childhood, a UK service for parents of children aged 4 to 16, has free guides to the apps children ask for most: each app\'s own minimum age, the settings to switch on first, and advice for your child\'s exact age.',
    'There is also a free three question check to find where your child is, with no sign up.',
    `Start here: ${link}`,
  ].join(' ')
}
