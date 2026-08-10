// Which scripts to put in front of DiGi for the parent's actual question.
//
// Justin, 10 August 2026, after the sixteen platform scripts went in: "will DiGi
// advise depending on what it's asked and link to exact relevant script?"
//
// The linking itself was already right. DiGi is handed candidates and told to
// link one as [title](/dashboard/scripts/NUMBER), only a real one, never
// invented. THE PICKING was the problem, and it was worst on the scripts most
// likely to be asked for.
//
// ── What was wrong ───────────────────────────────────────────────────────────
//
// Every word scored 1 and a script needed 2 to qualify. So relevance was "how
// MANY of your words appear", which rewards long rambling questions and
// punishes precise ones. Run against the live library:
//
//   "someone added my daughter to a whatsapp group"  → 5 candidates
//   "he keeps asking for instagram"                  → 2 candidates
//   "my son will not get off snapchat"               → 0
//   "she wants tiktok"                               → 0
//   "worried about snapchat streaks and the map"     → 0
//
// A parent asking about a platform names it once. One word scores 1, under the
// threshold, and DiGi is handed nothing, so the newest and most specific
// scripts in the library were the least reachable ones in it.
//
// ── What replaces it ─────────────────────────────────────────────────────────
//
// Rarity, not quantity. A word that appears in four scripts out of 312 tells
// you far more than one that appears in a hundred, so each word is weighted by
// how rare it is across the library (the standard inverse document frequency
// idea). "snapchat" is worth a great deal on its own; "school" on its own is
// worth almost nothing, which is correct in both directions.
//
// Two smaller things fall out of the same change:
//
//   A hit in the TITLE counts double. A script called "Snapchat streaks" is
//   more about streaks than one that mentions them in passing.
//
//   Three letter words are back in. The old filter needed four or more, which
//   silently dropped "AI", "app" and "DM", and the AI scripts are a whole
//   category. They are only reachable now because rarity stops short common
//   words from dominating.
//
// Separated from the route so it can be run against the real library in a test
// rather than only in production, which is how the old threshold went unnoticed.

export type MatchableScript = {
  sort_order: number
  title: string
  situation: string
  category: string
}

// Words that carry no signal about WHICH script fits. Kept deliberately short:
// rarity weighting already flattens common words, so this only needs to catch
// the ones that would otherwise look meaningful.
const STOP = new Set([
  'this', 'that', 'with', 'have', 'they', 'them', 'their', 'when', 'what',
  'about', 'from', 'want', 'wants', 'will', 'wont', 'does', 'been', 'kids',
  'child', 'just', 'like', 'know', 'says', 'said', 'gets', 'getting', 'really',
  'very', 'much', 'more', 'some', 'then', 'than', 'because', 'would', 'could',
  'should', 'there', 'here', 'into', 'over', 'back', 'were', 'your',
  'mine', 'ours', 'help', 'need', 'needs',
  // Pronouns. Three letters, in almost every script, and with word matching
  // they now score near zero anyway, but leaving them in only adds noise to
  // the top of the list.
  'she', 'his', 'him', 'her', 'hers', 'the', 'and', 'for', 'not', 'you', 'are',
  'was', 'has', 'had', 'our', 'off', 'out', 'all', 'any', 'how', 'why', 'who',
  'get', 'got', 'now', 'one', 'two', 'day', 'end', 'let', 'put', 'see', 'say',
  // Two letter fillers. These have to be listed because the length floor is
  // two, not three, and the reason for that is "AI": school-and-ai is 31 live
  // scripts and every one of them was unreachable while the floor was higher.
  // "DM" is the same shape.
  'is', 'to', 'do', 'of', 'in', 'on', 'at', 'it', 'he', 'we', 'my', 'me', 'be',
  'so', 'as', 'if', 'or', 'no', 'up', 'us', 'am', 'an', 'by', 'go', 'ok',
])

/** The distinct words in a piece of text, for exact matching. */
function tokenise(text: string): Set<string> {
  return new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean))
}

/**
 * Does this text contain the word?
 *
 * WHOLE WORDS, not substrings, and this is the whole reason the function
 * exists. The first version used String.includes, which quietly meant "ai"
 * matched said, afraid, again, waiting and daily, so a parent asking about AI
 * homework was handed three scripts about toilet training and self esteem. It
 * scored beautifully and was nonsense.
 *
 * A trailing s or es still counts, so "streaks" finds "streak", which is the
 * one bit of forgiveness worth having in a library written in plain English.
 */
function hasWord(tokens: Set<string>, word: string): boolean {
  if (tokens.has(word)) return true
  if (tokens.has(`${word}s`)) return true
  if (tokens.has(`${word}es`)) return true
  if (word.endsWith('s') && tokens.has(word.slice(0, -1))) return true
  if (word.endsWith('es') && tokens.has(word.slice(0, -2))) return true
  return false
}

/** The meaningful words in a parent's message, lowercased and deduped. */
export function queryWords(message: string): string[] {
  return [...new Set(
    String(message)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      // Two, not four. The old floor of four silently dropped "app", "DM" and
      // above all "AI", and school-and-ai is 31 live scripts, so an entire
      // category could never be reached by the words a parent uses for it. The
      // two letter fillers are named in STOP above; rarity weighting handles
      // anything that slips through, because a word in most scripts scores
      // near zero however short it is.
      .filter(w => w.length >= 2 && !STOP.has(w)),
  )]
}

/**
 * The scripts worth showing DiGi for this message, best first.
 *
 * Returns an empty array when nothing is a real match, which is the right
 * answer far more often than a weak guess: a script linked because it shares
 * the word "phone" teaches a parent that the links are noise.
 */
export function matchScripts(
  scripts: MatchableScript[],
  message: string,
  limit = 3,
): MatchableScript[] {
  const words = queryWords(message)
  if (words.length === 0 || scripts.length === 0) return []

  const haystacks = scripts.map(s => ({
    s,
    title: tokenise(s.title),
    all: tokenise(`${s.title} ${s.situation} ${s.category}`),
  }))

  // How rare is each word across the whole library? Computed per request, which
  // costs nothing: the rows are already loaded and this is a few hundred
  // substring checks.
  const weight = new Map<string, number>()
  for (const w of words) {
    const hits = haystacks.reduce((n, h) => n + (hasWord(h.all, w) ? 1 : 0), 0)
    // No hits anywhere means the word cannot discriminate, so it is worth zero
    // rather than infinity.
    if (hits === 0) { weight.set(w, 0); continue }
    // log(total / hits): a word in 4 of 312 scores about 4.4, a word in 100
    // scores about 1.1, a word in every script scores 0.
    weight.set(w, Math.log(scripts.length / hits))
  }

  const scored = haystacks.map(h => {
    let score = 0
    for (const w of words) {
      const weightOf = weight.get(w) ?? 0
      if (weightOf <= 0) continue
      if (!hasWord(h.all, w)) continue
      // A title hit counts twice. What a script is CALLED is the strongest
      // statement about what it is for.
      score += hasWord(h.title, w) ? weightOf * 2 : weightOf
    }
    return { s: h.s, score }
  })

  // The floor.
  //
  // 1.5 is roughly one word appearing in a fifth of the library, or one rare
  // word in the situation text alone. Below that a match is a coincidence.
  // Checked against the five real questions above: all five now return
  // candidates, and a generic "hello" still returns none.
  return scored
    .filter(x => x.score >= 1.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.s)
}
