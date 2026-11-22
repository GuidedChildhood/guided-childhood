import { AGE_NOTES, gapFor, gapSentence, stageFor } from './ages'
import { AGES, type Age, type AppEntry } from './types'

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

const firstControl = (app: AppEntry) => app.controls[0]?.name ?? null

export function minAgeLine(app: AppEntry): string {
  return `${app.name}'s own minimum age in the UK is ${app.minAge.value}${app.minAge.note ? `. ${app.minAge.note.replace(/\.$/, '')}` : ''}.`
}

/** The two sentence direct answer at the top of the page. */
export function directAnswer(app: AppEntry, age: number | null): string {
  const control = firstControl(app)
  const first = control ? `${control} switched on` : 'the strictest privacy settings switched on'
  if (age === null) {
    return `${minAgeLine(app)} Whether it suits your child depends on their age and on what is in place before they start: ${first}, agreed times for using it, and a promise that telling you about a problem will never cost them the device.`
  }
  return `${gapSentence(app, age)} Whether it suits your child depends less on the app than on what is in place first: ${first}, agreed times for using it, and a promise that telling you about a problem will never cost them the device.`
}

/** The ratings as one plain sentence, leaving out any not confirmed at the source. */
export function ratingsLine(app: AppEntry): string {
  const parts: string[] = []
  const { appStore, googlePlay, pegi } = app.ratings
  if (appStore.checked && appStore.value) parts.push(`${appStore.value} on the App Store`)
  if (googlePlay.checked && googlePlay.value) parts.push(`${googlePlay.value} on Google Play`)
  if (pegi.checked && pegi.value && pegi.value.toLowerCase() !== 'none') parts.push(`${pegi.value} from PEGI`)
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
    list.push({ q: `Is ${app.name} safe for a ${age} year old?`, a: directAnswer(app, age) })
    list.push({ q: `What should I do first if my ${age} year old wants ${app.name}?`, a: `${note.thisMonth}${controls[0] ? ` Then set up ${controls[0]} together before they use it on their own.` : ''}` })
  } else {
    list.push({ q: `Is ${app.name} safe for children?`, a: directAnswer(app, null) })
    list.push({ q: `How do I set up ${app.name} for my child?`, a: `${app.setupSteps.steps.slice(0, 3).join(' ')} The full steps are on this page, taken from ${app.maker}'s own help pages.` })
  }
  if (controls.length) list.push({ q: `What parental controls does ${app.name} have?`, a: `${joinAnd(controls)}. Each is explained on this page with a link to ${app.maker}'s own guide.` })
  list.push({ q: `What is ${app.name}'s age rating?`, a: ratingsLine(app) })
  if (app.underAge.text && (age === null || age < app.minAge.value)) {
    list.push({ q: `What can a child under ${app.minAge.value} use instead of ${app.name}?`, a: app.underAge.text })
  }
  return list
}

/** Two or three nearby ages for the "same app, other ages" links. */
export function nearbyAges(age: number): number[] {
  return AGES.filter(a => a !== age && Math.abs(a - age) <= 2)
}

/** A short label for an age against an app, for the hub and the age chooser. */
export function gapLabel(app: AppEntry, age: number): string {
  switch (gapFor(age, app.minAge.value)) {
    case 'designed-for': return 'Allowed, set it up together'
    case 'well-under':
    case 'under': return `Under its age of ${app.minAge.value}`
    case 'nearly': return 'One year to go'
    case 'at': return 'Its minimum age'
    case 'past': return 'Past its minimum age'
  }
}

export { stageFor }

function joinAnd(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}
