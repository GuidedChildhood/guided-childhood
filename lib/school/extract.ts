import Anthropic from '@anthropic-ai/sdk'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { mergeNearDuplicates } from './merge-items'
import { fixYears } from './fix-years'
import { parseItemArray } from './parse-items'

// THE ONE SCHOOL EXTRACTOR.
//
// This lived inside app/api/school/inbound/route.ts, where it was the only
// caller. On 17 September 2026 a second way in arrived (a photo of a letter, or
// pasted text), and the rule this codebase already keeps for the child
// visibility question applies just as hard here: written twice it would drift,
// and the way it would drift is one route learning about ClassDojo notices or
// getting better at dates while the other quietly does not.
//
// So both ways in call this. The email route passes a subject and a body, the
// catch route passes pasted text or an image, and every one of them comes back
// through the same prompt, the same six kinds and the same validation.
//
// PARENT SIDE ONLY. This imports the Anthropic SDK, so it must never be
// imported from app/k, app/api/kid, lib/kid or components/kid. A guard script
// fails the build if it is (THE-STORY.md section 7).

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

export const SCHOOL_KINDS = ['kit', 'payment', 'homework', 'event', 'deadline', 'notice'] as const
export type SchoolKind = (typeof SCHOOL_KINDS)[number]

export type ExtractedItem = {
  kind: SchoolKind
  title: string
  detail?: string | null
  due_date?: string | null
  /** The date has already gone (lib/school/fix-years.ts). Shown, never ticked for the parent. */
  past?: boolean
}

/** What the Anthropic API accepts. An iPhone HEIC is not on this list, which
 *  is why the photo is converted to JPEG in the browser before it is sent. */
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const
export type AcceptedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number]

export function isAcceptedImageType(value: unknown): value is AcceptedImageType {
  return typeof value === 'string' && (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(value)
}

/**
 * The prompt. Deliberately says "message" rather than "email", because it is
 * now also read against a photo of a letter that came home in a book bag.
 *
 * The app notifier exception is Justin's call from the original build and is
 * kept word for word: ClassDojo, Tapestry, Arbor and the rest mostly say "a
 * message is waiting" without the message, and the honest answer is to tell the
 * parent to go and look rather than to invent an action out of a notification.
 */
function buildPrompt(schoolName: string, subject: string, body: string, hasImage: boolean): string {
  const today = new Date().toISOString().slice(0, 10)
  const source = hasImage
    ? 'this photo of a school letter, note or screen'
    : 'this school message'
  // EVERY DATED THING COUNTS (22 November 2026). Justin snapped a letter with a
  // date in it and got nothing back. The prompt used to ask only for "real
  // actions" and to ignore anything with no action, so an inset day, a term
  // date or a non uniform day, a date with nothing to do but know it, could be
  // dropped. A parent who misses an inset day has been let down as badly as
  // one who misses a payment, so a date a family needs to know is an item.
  return `Read ${source} from ${schoolName} and list everything a parent needs to do or needs to know about. That means: kit to bring (coat, PE kit, water bottle, wellies), payments due, homework or practice (times tables, reading), deadlines and forms to return, and EVERY dated thing: events, trips, performances, parents evenings, photo days, non uniform days, inset days, school closures, early finishes, the first and last day of term and half term. A date a family needs to know is an item even when there is nothing to do but remember it: use kind "event" for those, or "notice" for a closure or inset day. If the message lists several dates, return one item for each date. Leave out only general news with no date and no action. Exception: if the message is only a notification that a message, post or update is waiting inside an app (ClassDojo, Tapestry, Seesaw, Arbor, ParentPay and similar) and the content itself is not included, return exactly one notice item telling the parent to check that app, naming the sender if given, for example {"kind":"notice","title":"Check ClassDojo message from Miss Smith","detail":"ClassDojo says a new message is waiting in the app.","due_date":null}. One item per piece of work: a project to make and hand in on the same day is ONE homework item, never one to build it and another to hand it in. Put what to bring or make in the detail. Today is ${today}. A date written without a year means the next time that date comes round from today. For a range of days (a trip, a holiday, a book fair week) use the first day as the date and say the range in the detail.${hasImage ? ' Read every date you can see, including dates in tables, lists, small print and handwriting.' : ''}

${subject ? `Subject: ${subject}\n\n` : ''}${body.slice(0, 4000)}

Years: if a year is printed, use it exactly, even if it has passed. If a weekday is written with no year, choose the year in which that date falls on that weekday, and keep the weekday in the detail. Never return a date whose weekday differs from the one written.

Return ONLY a JSON array (empty if no actions): [{"kind":"kit|payment|homework|event|deadline|notice","title":"max 10 words, imperative","detail":"one sentence","due_date":"YYYY-MM-DD or null"}]`
}

/** Only the shapes we can actually store. Anything else is dropped rather than
 *  coerced, because a guessed kind on a school deadline is worse than nothing. */
export function validateItems(raw: unknown): ExtractedItem[] {
  if (!Array.isArray(raw)) return []
  // The year each item's own words name, and a mark on any that have passed.
  return fixYears(mergeNearDuplicates(raw
    .filter((i): i is ExtractedItem =>
      Boolean(i) && typeof i === 'object'
      && (SCHOOL_KINDS as readonly string[]).includes((i as ExtractedItem).kind)
      && typeof (i as ExtractedItem).title === 'string'
      && (i as ExtractedItem).title.trim().length > 1)
    .map(i => ({
      kind: i.kind,
      title: i.title.trim().slice(0, 120),
      detail: typeof i.detail === 'string' ? i.detail.trim().slice(0, 300) : null,
      due_date: typeof i.due_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(i.due_date) ? i.due_date : null,
    }))), new Date().toISOString().slice(0, 10))
}

export type ExtractInput = {
  schoolName: string
  subject?: string
  body?: string
  image?: { mediaType: AcceptedImageType; base64: string }
}

/**
 * Read a school message and return what a parent actually has to do about it.
 *
 * Never throws. Every model in the ladder is tried in turn and an empty array
 * is the answer when none of them can be reached, because on the email path the
 * caller is a webhook that must still return 200, and on the photo path the
 * parent gets "nothing found, add it by hand" rather than an error page.
 *
 * The model is config, never hardcoded: DIGI_MODEL with its fallback ladder
 * behind it (non-negotiable 2 in CLAUDE.md).
 */
export async function extractSchoolItems(input: ExtractInput): Promise<ExtractedItem[]> {
  return (await readSchoolMessage(input)).items
}

/**
 * The same read, saying whether any model answered at all.
 *
 * The photo path needs the difference (17 November 2026, Justin: "make sure
 * all works"). An empty list from a model that read the picture means nothing
 * needed doing. An empty list because no model could be reached means it was
 * never read, and telling a parent holding an inset day letter "nothing in
 * there needed doing" is the worst possible answer. The email webhook keeps
 * using extractSchoolItems, which must never throw or differ.
 */
export async function readSchoolMessage(input: ExtractInput): Promise<{ items: ExtractedItem[]; reached: boolean }> {
  const { schoolName, subject = '', body = '', image } = input
  if (!body.trim() && !image) return { items: [], reached: true }

  const prompt = buildPrompt(schoolName, subject, body, Boolean(image))
  const content: Anthropic.MessageParam['content'] = image
    ? [
        { type: 'image', source: { type: 'base64', media_type: image.mediaType, data: image.base64 } },
        { type: 'text', text: prompt },
      ]
    : prompt

  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  for (const model of models) {
    try {
      const res = await anthropic.messages.create({
        model,
        // Room for a term dates letter: twenty items is about 1,500 tokens.
        max_tokens: 2000,
        messages: [{ role: 'user', content }],
      })
      const text = res.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text).join('')
      // A reply cut short keeps every finished item (lib/school/parse-items.ts).
      return { items: validateItems(parseItemArray(text)), reached: true }
    } catch { /* try the next model in the ladder */ }
  }
  return { items: [], reached: false }
}
