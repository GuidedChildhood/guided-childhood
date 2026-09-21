// A name the app has not met.
//
// Justin, 21 September 2026, after asking DiGi about a 9 year old called Olga
// while the only child set up was Timbotee: "the reminder on home screen has
// name of another child which is ok but we should be clever enough to ask if
// we want to add another child as noticed new name?"
//
// He is right on both halves. The follow up question SHOULD keep saying Olga,
// because it is a true record of what he asked and rewriting it to name a
// registered child would be a small lie. What was missing is the offer: a
// parent who talks to us about a child we have never heard of should be asked,
// once, quietly, whether we should add them.
//
// ── WHY TWO SIGNALS AND NOT ONE ─────────────────────────────────────────────
//
// A capitalised word is not a name. Half of them are the first word of a
// sentence, and most of the rest are Roblox, Monday, Mum and London. Guessing
// wrong is cheap but it is not free: an offer to add Minecraft as a child is
// the kind of thing that makes a parent trust the rest of the screen less.
//
// So a candidate has to clear all of this:
//
//   1. Not a child we already have, and not one of the words below.
//   2. Not a word that appears in lower case anywhere in the same
//      conversation. If they wrote "football" once, "Football" at the start of
//      a sentence is that same word, not a boy.
//   3. Not preceded by a title (Miss Davies is the teacher) or by a word that
//      makes the thing an object rather than a person (playing Prodigy,
//      an app called Yoto).
//   4. A family cue in the same sentence: an age, a my or our, a she or he, a
//      son or sister. "Olga who is 9" clears it. "Tuesday was hard" does not.
//
// Anything that gets through is offered, never acted on. The parent taps or
// ignores, and nothing about the conversation changes either way.

/** Words that are capitalised in ordinary writing and are never the child. */
const NOT_A_CHILD = new Set([
  // the ordinary words of English that start sentences
  'a', 'an', 'am', 'and', 'any', 'all', 'also', 'as', 'at', 'be', 'been', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'each', 'even', 'every', 'for', 'from', 'get',
  'got', 'had', 'has', 'have', 'he', 'her', 'here', 'hers', 'him', 'his', 'how',
  'i', 'if', 'in', 'is', 'it', 'its', 'just', 'last', 'like', 'make', 'many', 'maybe',
  'me', 'more', 'most', 'much', 'my', 'no', 'not', 'now', 'of', 'ok', 'okay', 'on',
  'one', 'only', 'or', 'our', 'out', 'over', 'please', 'she', 'should', 'so', 'some',
  'sorry', 'still', 'such', 'than', 'thanks', 'thank', 'that', 'the', 'their', 'them',
  'then', 'there', 'these', 'they', 'this', 'those', 'to', 'too', 'two', 'up', 'us',
  'was', 'we', 'well', 'were', 'what', 'when', 'where', 'which', 'while', 'who',
  'why', 'will', 'with', 'would', 'yes', 'you', 'your', 'hi', 'hey', 'hello',
  // time
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
  'september', 'october', 'november', 'december',
  'miss', 'mrs', 'mr', 'ms', 'dr', 'sir', 'madam', 'quick', 'since', 'once', 'after',
  'before', 'during', 'lately', 'recently', 'anyway', 'honestly', 'basically',
  'today', 'tomorrow', 'yesterday', 'tonight', 'morning', 'afternoon', 'evening',
  'night', 'bedtime', 'week', 'weekend', 'weekday', 'holiday', 'holidays', 'term',
  'christmas', 'easter', 'halloween', 'birthday', 'summer', 'autumn', 'winter', 'spring',
  // the people in a family, who are not the child being named
  'mum', 'mummy', 'mom', 'mommy', 'dad', 'daddy', 'nan', 'nana', 'nanny', 'gran',
  'granny', 'grandma', 'grandad', 'grandpa', 'auntie', 'aunt', 'uncle', 'cousin',
  'brother', 'sister', 'son', 'daughter', 'baby', 'twins', 'family',
  // apps, games, devices, brands
  'tiktok', 'instagram', 'insta', 'snapchat', 'snap', 'youtube', 'roblox', 'minecraft',
  'fortnite', 'whatsapp', 'netflix', 'disney', 'xbox', 'playstation', 'nintendo',
  'switch', 'ipad', 'iphone', 'android', 'google', 'apple', 'facebook', 'discord',
  'twitch', 'reddit', 'spotify', 'pinterest', 'bereal', 'messenger', 'zoom', 'alexa',
  'siri', 'chrome', 'safari', 'kindle', 'fifa', 'pokemon', 'lego', 'barbie', 'wifi',
  'internet', 'google', 'youtuber', 'prime', 'amazon', 'ai', 'chatgpt', 'claude',
  // school and places
  'school', 'nursery', 'reception', 'year', 'class', 'teacher', 'homework', 'maths',
  'english', 'science', 'history', 'geography', 'pe', 'club', 'team', 'football',
  'london', 'england', 'scotland', 'wales', 'ireland', 'britain', 'uk', 'america',
  'europe', 'sats', 'ofsted',
  // us
  'digi', 'guided', 'childhood', 'stage', 'passport', 'quest', 'quests', 'moment',
  'moments', 'script', 'scripts', 'lesson', 'lessons', 'star', 'stars', 'pathway',
])
// Deliberately NOT here: ordinary first names that happen to appear in our own
// writing, Olga among them. The first parent this was built for was asking
// about a real 9 year old called Olga, and a family whose child shares a name
// with anything of ours is exactly the family we must not be clever at. The
// Planet Friends (Pebble, Bloop, Orbit, Nova, Cosmo) are not here either: a
// parent typing one of those is talking about a character, but the family cue
// and the lower case rule already handle it, and a real child could be called
// Nova.

/** A word before a name that makes it somebody else, or something else. */
const NOT_BEFORE = new Set([
  'miss', 'mrs', 'mr', 'ms', 'dr', 'sir', 'madam', 'coach', 'nurse', 'officer',
  'uncle', 'auntie', 'aunt', 'grandad', 'grandma', 'nan',
  'play', 'plays', 'playing', 'played', 'watch', 'watches', 'watching', 'watched',
  'use', 'uses', 'using', 'used', 'download', 'downloads', 'downloaded', 'install',
  'installed', 'joined', 'called', 'named', 'app', 'apps', 'game', 'games', 'site',
  'channel', 'video', 'show', 'server', 'group', 'chat',
])

/** The sentence is about a person in this family. */
const FAMILY_CUE = new RegExp([
  'who\\s+is\\s+\\d{1,2}',
  'aged?\\s+\\d{1,2}',
  'is\\s+\\d{1,2}\\b',
  '\\d{1,2}\\s*(?:year|yr)s?\\s*old',
  '\\b(?:my|our|she|he|her|hers|him|his|they|them|their)\\b',
  '\\b(?:son|daughter|brother|sister|twin|twins|sibling|child|kid|boy|girl|eldest|youngest|oldest)\\b',
].join('|'), 'i')

// STARTING A SENTENCE IS NOT A NAME.
//
// Half the capitalised words in a message are just the first word of a
// sentence, and a stop list can never hold all of them: Quick, Since, Lately,
// Honestly. The rule that does hold is that a word in that position has to be
// IDENTIFIED as a person, not merely sit in a sentence that mentions one.
// "Olga who is 9" and "Bea and Otto are 7 and 9" are identified. "Since
// September my daughter has been up late" is not, however many family words
// follow it.
const NAMED_PERSON = new RegExp([
  '^(?:\\W|\\w){0,25}?(?:who\\s+)?(?:is|are|was|were|turns|turned)\\s+\\d{1,2}\\b',
  '^(?:\\W|\\w){0,25}?aged?\\s+\\d{1,2}\\b',
  '^\\s*,\\s*\\d{1,2}\\b',
  '^\\s*\\(\\s*\\d{1,2}\\s*\\)',
  '^(?:\\W|\\w){0,25}?\\d{1,2}\\s*(?:year|yr)s?\\s*old',
  "^'s\\b",
].join('|'), 'i')

/** How many we will ever offer at once. Two names is a busy day; three is noise. */
const MAX_NAMES = 2

/** The first word of a name, which is all we ever store or compare. */
function firstWord(name: string): string {
  return String(name ?? '').trim().split(/\s+/)[0]?.toLowerCase() ?? ''
}

/**
 * First names in what the parent wrote that we have never been introduced to.
 *
 * @param texts  what the parent said. Their own words only: DiGi's replies
 *               repeat the name back, which would double count nothing useful
 *               but would also let a name DiGi invented become an offer.
 * @param known  the children we already have, by name. Their spelling wins:
 *               a family with an Ollie never gets offered Ollie.
 */
export function newNamesIn(texts: string[], known: string[] = []): string[] {
  const all = texts.filter(t => typeof t === 'string' && t.trim()).join('\n')
  if (!all) return []

  const knownSet = new Set(known.map(firstWord).filter(Boolean))

  // Every word written in lower case somewhere here. A word that appears both
  // ways is the ordinary word, not a name.
  const lowered = new Set<string>()
  for (const m of all.matchAll(/\b[a-z][a-z']{1,14}\b/g)) lowered.add(m[0])

  const found: string[] = []
  for (const m of all.matchAll(/\b[A-Z][a-z]{1,14}\b/g)) {
    const word = m[0]
    const lower = word.toLowerCase()
    if (knownSet.has(lower) || NOT_A_CHILD.has(lower) || lowered.has(lower)) continue
    if (found.some(f => f.toLowerCase() === lower)) continue

    const index = m.index ?? 0
    const before = all.slice(0, index).trim().split(/\s+/).pop() ?? ''
    if (NOT_BEFORE.has(before.toLowerCase().replace(/[^a-z]/g, ''))) continue

    // The sentence this name sits in, so a cue three sentences away does not
    // vouch for it.
    const start = Math.max(
      all.lastIndexOf('.', index), all.lastIndexOf('?', index),
      all.lastIndexOf('!', index), all.lastIndexOf('\n', index),
    ) + 1
    const endMark = all.slice(index).search(/[.?!\n]/)
    const sentence = all.slice(start, endMark === -1 ? all.length : index + endMark + 1)
    // The name itself must not be the cue: a child called Hershey would
    // otherwise vouch for himself through "her".
    const withoutName = sentence.replace(new RegExp(`\\b${word}\\b`, 'g'), ' ')
    if (!FAMILY_CUE.test(withoutName)) continue

    // First word of the sentence? Then the sentence mentioning a family is not
    // enough: this word has to be the one being introduced.
    const startsSentence = all.slice(start, index).trim() === ''
    if (startsSentence && !NAMED_PERSON.test(all.slice(index + word.length, index + word.length + 40))) continue

    found.push(word)
    if (found.length >= MAX_NAMES) break
  }
  return found
}

/** Where the offer goes: the add child form we already have, name filled in. */
export function addChildHref(name: string): string {
  return `/dashboard/quests?add_child=${encodeURIComponent(name)}`
}
