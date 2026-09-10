// WHAT A PARENT TYPES, AND WHAT WE THEN CALL IT FOR EVER.
//
// Justin, 10 September 2026: "they can free type in Something else and can have
// spelling mistakes and that carries through every time we reference it, how
// can we fix?"
//
// He is right, and it is worse than cosmetic. seedBaselineConcerns takes the
// typed line as BOTH the label a parent reads on every check in and the slug
// that keys the row, so "wont get of the switch" becomes a permanent title and
// a permanent key, and every screen that mentions the worry mentions the typo:
// the check in, the weekly email, What is working, DiGi's live concerns block,
// the passport stamp when they finally sort it.
//
// ── THE THREE PARTS OF THE FIX, IN ORDER OF HOW MUCH THEY CATCH ─────────────
//
// 1. MOST FREE TEXT IS A WORRY WE ALREADY HAVE, in the parent's own words.
//    "wont get off fortnite" is controller fights. "tikok" is social media.
//    Matching it back to the tile gives us OUR spelling, and it does something
//    better than tidy the words: it puts the row on the same slug as the tile,
//    so it shares history, scripts and the pathway content instead of being a
//    lonely one off nobody has written anything for.
//
// 2. WHAT IS LEFT GETS TIDIED, NOT CORRECTED. Trimmed, spaces collapsed,
//    trailing punctuation dropped, first letter up, capped. We never guess at
//    the spelling of a worry we did not recognise: "Ollie's Discord" is not a
//    mistake, and an app that rewrites a parent's words is worse than one that
//    keeps them exactly.
//
// 3. AND THE PARENT CAN RENAME IT. The only honest cure for a typo in somebody
//    else's words is to let them fix it. That is a screen rather than a
//    function, and it is the next piece of work; this file is what stops most
//    of them being typed in the first place.
//
// Deterministic on purpose. No model call: this runs on the signup path, it has
// to be instant, and a matcher whose answers can change between two runs is not
// something to key a database row on.

/** The tiles we can match back to, with the words parents actually use. */
const MATCHES: { slug: string; label: string; terms: string[] }[] = [
  {
    slug: 'controller-fights',
    label: 'Controller fights',
    terms: ['xbox', 'playstation', 'ps4', 'ps5', 'switch', 'nintendo', 'fortnite',
      'roblox', 'minecraft', 'gaming', 'games', 'game', 'console', 'controller', 'cod'],
  },
  {
    slug: 'social-media',
    label: 'Social media',
    terms: ['tiktok', 'instagram', 'insta', 'snapchat', 'snap', 'youtube', 'facebook',
      'social', 'reels', 'shorts', 'influencer', 'followers', 'likes'],
  },
  {
    slug: 'phones-and-messaging',
    label: 'Phones and messaging',
    terms: ['phone', 'mobile', 'iphone', 'whatsapp', 'messages', 'messaging', 'texting',
      'group chat', 'groupchat'],
  },
  {
    slug: 'bedtime-screens',
    label: 'Bedtime screens',
    terms: ['bedtime', 'bed', 'sleep', 'asleep', 'night', 'nighttime', 'late'],
  },
  {
    slug: 'mood-after-screens',
    label: 'Mood after screens',
    terms: ['mood', 'moody', 'angry', 'anger', 'meltdown', 'tantrum', 'grumpy',
      'irritable', 'shouting', 'temper'],
  },
  {
    slug: 'wont-put-down',
    label: 'Coming off screens',
    terms: ['put it down', 'off the screen', 'screen time', 'screentime', 'hours',
      'addicted', 'obsessed', 'glued', 'come off', 'get off', 'turn it off'],
  },
  {
    slug: 'morning-tv',
    label: 'Morning TV',
    terms: ['morning', 'breakfast', 'before school', 'tv', 'telly'],
  },
  {
    slug: 'ai-chatbots',
    label: 'AI chatbots',
    terms: ['ai', 'chatbot', 'chatgpt', 'character ai', 'characterai', 'bot', 'gemini'],
  },
  {
    slug: 'seen-something',
    label: 'What they come across online',
    terms: ['porn', 'pornography', 'violent', 'violence', 'gore', 'scary', 'inappropriate',
      'adult content', 'nudes', 'stranger', 'grooming', 'self harm', 'suicide'],
  },
]

/** One edit apart, and no further. Enough for a slip, not enough to guess. */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true
  if (Math.abs(a.length - b.length) > 1) return false
  // Walk both, allowing exactly one insertion, deletion or substitution.
  let i = 0, j = 0, edits = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue }
    if (++edits > 1) return false
    if (a.length > b.length) i++
    else if (a.length < b.length) j++
    else { i++; j++ }
  }
  return edits + (a.length - i) + (b.length - j) <= 1
}

/**
 * Which known worry this text is, or null when it is genuinely their own.
 *
 * A term matches when it appears in the text, or when a word of the text is one
 * edit from it. The one edit rule is deliberately limited to terms of five
 * letters or more: at four letters "bed" and "bad", "game" and "gate" are one
 * edit apart and the match would be a coin toss.
 */
export function matchWorry(raw: string): { slug: string; label: string } | null {
  const text = raw.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
  if (!text) return null
  const words = text.split(' ')

  for (const m of MATCHES) {
    for (const term of m.terms) {
      if (term.includes(' ')) {
        if (text.includes(term)) return { slug: m.slug, label: m.label }
        continue
      }
      if (words.includes(term)) return { slug: m.slug, label: m.label }
      if (term.length >= 5 && words.some(w => w.length >= 5 && withinOneEdit(w, term))) {
        return { slug: m.slug, label: m.label }
      }
    }
  }
  return null
}

/**
 * Their words, presentable, with the meaning untouched.
 *
 * Trimmed, spaces collapsed, trailing punctuation dropped, first letter up,
 * capped at 80. SHOUTING is brought down because a label is not a raised voice,
 * but nothing inside a normally typed line is changed: an app that corrects a
 * parent's spelling of their own child's game is an app that has stopped
 * listening.
 */
export function tidyWorry(raw: string): string {
  let s = (raw ?? '').replace(/\s+/g, ' ').trim().replace(/[.,;:!?]+$/, '').slice(0, 80)
  if (!s) return ''
  const letters = s.replace(/[^A-Za-z]/g, '')
  if (letters.length > 3 && letters === letters.toUpperCase()) s = s.toLowerCase()
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** The kebab key, from whatever we settled on rather than from what was typed. */
export function worrySlug(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
}

/**
 * What a typed worry becomes: a known one where we recognise it, their own
 * tidied words where we do not.
 *
 * `matched` is returned rather than inferred so the caller can tell a parent
 * what happened. Quietly filing "wont get off fortnite" under Controller fights
 * is right; doing it without saying so is how a parent comes to believe the app
 * lost their answer.
 */
export function resolveWorry(raw: string): { slug: string; label: string; matched: boolean } {
  const tidy = tidyWorry(raw)
  if (!tidy) return { slug: '', label: '', matched: false }
  const hit = matchWorry(tidy)
  if (hit) return { ...hit, matched: true }
  return { slug: worrySlug(tidy), label: tidy, matched: false }
}
