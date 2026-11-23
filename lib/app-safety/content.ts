import { AGE_NOTES, gapFor, gapSentence, stageFor } from './ages'
import { AGES, aAge, type Age, type AppEntry } from './types'

// THE WORDS ON EVERY APP PAGE, built from the app's facts and the child's age.
//
// The first two sentences are the answer an AI tool can quote whole. They never
// say "yes, it is safe" or "no": the product never allows or denies (non
// negotiable 1), and no page here promises an app is safe. They give the app's
// own rule, where this age sits against it, and what to have in place first.

export const appPath = (slug: string) => `/is-${slug}-safe`
export const agePath = (slug: string, age: number) => `/is-${slug}-safe-for-${age}-year-old`
export const HUB_PATH = '/app-safety-guide'

/** The URL segment back to an app and an age. Null for anything that is not one of ours. */
export function parseSegment(segment: string): { slug: string; age: number | null } | null {
  const withAge = /^is-([a-z0-9-]+?)-safe-for-(\d{1,2})-year-old$/.exec(segment)
  if (withAge) return { slug: withAge[1], age: Number(withAge[2]) }
  const plain = /^is-([a-z0-9-]+?)-safe$/.exec(segment)
  return plain ? { slug: plain[1], age: null } : null
}

/** The setting the direct answer names: the first control, without its bracketed aside. */
export const leadControl = (app: AppEntry): string | null =>
  app.leadControl ?? (app.controls[0] ? app.controls[0].name.replace(/\s*\(.*?\)/g, '') : null)

export function minAgeLine(app: AppEntry): string {
  const note = app.minAge.note ? ` ${app.minAge.note.replace(/\.$/, '')}.` : ''
  if (app.minAge.value === null) return `${app.name} does not set one minimum age.${note}`
  if (!app.minAge.checked) return `${app.name} usually sets ${app.minAge.value} as its minimum age, though we could not yet confirm the UK terms.${note}`
  return `${app.name}'s own minimum age in the UK is ${app.minAge.value}.${note}`
}

/** The two sentence direct answer at the top of the page. */
export function directAnswer(app: AppEntry, age: number | null): string {
  const control = leadControl(app)
  const first = control ? `${control} in place` : 'the strictest privacy settings in place'
  const rest = `${first}, agreed times for using it, and a promise that telling you about a problem will never cost them the device.`
  if (age === null) {
    const unconfirmed = app.minAge.checked ? '' : ', though we could not yet confirm this in its UK terms'
    return `${app.minAge.rule}${unconfirmed}. Whether it suits your child depends on their age and on what is in place before they start: ${rest}`
  }
  const underIt = age < app.minAge.gapAge && !(app.minAge.maxAge !== undefined && age > app.minAge.maxAge)
  return underIt
    ? `${gapSentence(app, age)} If it comes into their life before then, what matters most is what is in place: ${rest}`
    : `${gapSentence(app, age)} Whether it suits your child depends less on the app than on what is in place first: ${rest}`
}

/** The ratings as one plain sentence, leaving out any not confirmed at the source. */
export function ratingsLine(app: AppEntry): string {
  const parts: string[] = []
  const { appStore, googlePlay, pegi } = app.ratings
  if (appStore.checked && appStore.value) parts.push(`${shortRating(appStore.value)} on the App Store`)
  if (googlePlay.checked && googlePlay.value) parts.push(`${shortRating(googlePlay.value)} on Google Play`)
  if (pegi.checked && pegi.value && pegi.value.toLowerCase() !== 'none') parts.push(`${pegi.value.replace(/\s*\(.*$/, '')} from PEGI`)
  if (!parts.length) return `Check the current rating on the App Store and Google Play listings, linked on this page.`
  return `${app.name} is rated ${joinAnd(parts)}. Store ratings describe content, not readiness, and the app's own minimum age can differ from them.`
}

export type Faq = { q: string; a: string }

export function faqs(app: AppEntry, age: number | null): Faq[] {
  const controls = app.controls.map(c => c.name)
  const list: Faq[] = [
    { q: `What age do you have to be to use ${app.name}?`, a: `${minAgeLine(app)} The rule comes from ${app.minAge.sourceName}.` },
  ]
  if (age !== null) {
    const note = AGE_NOTES[age as Age]
    list.push({ q: `Is ${app.name} safe for ${aAge(age)}?`, a: directAnswer(app, age) })
    list.push({ q: `What should I do first if my ${age} year old wants ${app.name}?`, a: `${note.thisMonth}${leadControl(app) ? ` Then set up ${leadControl(app)} together before they use it on their own.` : ''}` })
  } else {
    list.push({ q: `Is ${app.name} safe for children?`, a: directAnswer(app, null) })
    list.push({ q: `How do I set up ${app.name} for my child?`, a: `${app.setupSteps.steps.slice(0, 3).join(' ')} The full steps are on this page, taken from ${app.maker}'s own help pages.` })
  }
  if (controls.length) list.push({ q: `What parental controls does ${app.name} have?`, a: `${joinAnd(controls)}. Each is explained on this page with a link to ${app.maker}'s own guide.` })
  list.push({ q: `What is ${app.name}'s age rating?`, a: ratingsLine(app) })
  if (app.underAge.text && app.minAge.gapAge > 0 && (age === null || age < app.minAge.gapAge)) {
    list.push({ q: `What can a child under ${app.minAge.gapAge} use instead of ${app.name}?`, a: app.underAge.text })
  }
  return list
}

/** Two or three nearby ages for the "same app, other ages" links. */
export function nearbyAges(age: number): number[] {
  return AGES.filter(a => a !== age && Math.abs(a - age) <= 2)
}

/** A short label for an age against an app, for the hub and the age chooser. */
export function gapLabel(app: AppEntry, age: number): string {
  if (app.minAge.maxAge !== undefined && age > app.minAge.maxAge) return 'Moving on from it'
  switch (gapFor(age, app.minAge.gapAge)) {
    case 'designed-for': return 'Open to them, set it up together'
    case 'well-under':
    case 'under': return `Under its age of ${app.minAge.gapAge}`
    case 'nearly': return 'One year to go'
    case 'at': return 'Its minimum age'
    case 'past': return 'Past its minimum age'
  }
}

export { stageFor }

/** "Parental guidance (Parental guidance recommended. Users interact)" becomes "Parental guidance". */
export function shortRating(v: string): string {
  return v.split(/\s*[(;,]/)[0].trim()
}

function joinAnd(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

/**
 * An app page's title: the question a parent types, and nothing after it, so
 * that with the brand it stays under 60 characters (lib/seo/meta.ts). The
 * Ahrefs audit of 23 November 2026 found all 220 cut off in search results.
 */
export function appPageTitle(app: Pick<AppEntry, 'name'>, age?: number | null): string {
  return age ? `Is ${app.name} safe for ${aAge(age)}?` : `Is ${app.name} safe for children?`
}
