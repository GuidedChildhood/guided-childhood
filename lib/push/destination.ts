// WHERE A REMINDER SHOULD OPEN.
//
// Justin, 5 November 2026, after a homework reminder he had asked DiGi for
// opened DiGi's chat: "can it include a relevant link, in this case the
// homework helper, so they can see what homework it could be or where to find
// it ... maybe each reminder can link to the part of the service it is about."
//
// A reminder's words are the parent's own ("remind me about homework at
// five"), so the place it opens is read from those words: the first topic
// that matches wins, most specific first, and anything unmatched still opens
// DiGi, which is where the reminder was made. The push body gains one short
// line saying where the tap goes, so a parent knows before they tap.
//
// Pure, so the cron, the Home card fallback and the guard all read the same
// map (scripts/check-push-destinations.mjs).

export type Destination = { href: string; label: string }

const TOPICS: { words: RegExp; href: string; label: string }[] = [
  { words: /\b(homework|spellings?|times tables?|reading book|reading record|maths|revision|revise|project due)\b/i, href: '/dashboard/homework', label: 'the homework helper' },
  { words: /\b(school|pe kit|p\.e\.|uniform|packed lunch|trip|parents'? evening|non uniform|dress up day|school bag|book bag)\b/i, href: '/dashboard/school', label: 'the school diary' },
  { words: /\b(timer|screen time|screens? off|switch off|turn off|tablet|ipad|xbox|playstation|switch|console|gaming|games?|youtube|tv)\b/i, href: '/dashboard/quests/timer', label: 'the screen timer' },
  { words: /\b(bedtime|bed time|wind down|sleep|lights out|charg(e|ing)|phone (down|downstairs)|night)\b/i, href: '/dashboard/tonight', label: "tonight's plan" },
  { words: /\b(jobs?|chores?|stars?|quests?|rewards?|star chart|pocket money)\b/i, href: '/dashboard/quests', label: 'the jobs and stars' },
  { words: /\b(check ?in|how (it|did it) go|how it went|follow up)\b/i, href: '/dashboard/checkin', label: 'the check in' },
  { words: /\b(lessons?|module)\b/i, href: '/dashboard/lessons', label: 'the lessons' },
  { words: /\b(scripts?|what to say|the words)\b/i, href: '/dashboard/scripts', label: 'the scripts' },
  { words: /\b(agreement|family deal|the deal|contract)\b/i, href: '/dashboard/agreement', label: 'the family agreement' },
  { words: /\b(phone|parental controls?|screen ?time settings|device settings|set ?up)\b/i, href: '/dashboard/devices', label: 'the device guides' },
]

const DIGI: Destination = { href: '/dashboard/digi', label: 'DiGi' }

/** The page a reminder about these words should open, child scoped when there is a child. */
export function destinationFor(text: string | null | undefined, childId?: string | null): Destination {
  const t = String(text ?? '')
  const hit = TOPICS.find(topic => topic.words.test(t))
  if (!hit) return DIGI
  const href = childId ? `${hit.href}?child=${encodeURIComponent(childId)}` : hit.href
  return { href, label: hit.label }
}

/** The reminder's own words, then where the tap goes, kept to push length. */
export function reminderBody(text: string, dest: Destination): string {
  const words = text.trim().replace(/\s+/g, ' ')
  const tail = ` Tap to open ${dest.label}.`
  const room = 170 - tail.length
  return (words.length > room ? `${words.slice(0, room - 1).trimEnd()}…` : words) + tail
}
