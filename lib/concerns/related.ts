import { matchScripts, type MatchableScript } from '@/lib/digi/script-match'
import { ONBOARDING_TO_SLUG } from '@/lib/concerns/baseline'

// Grounding a worry nobody wrote a pathway for.
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// Justin, 9 September 2026: "DiGi brain and system searches for relating
// scripts, moments and advice on this entered... DiGi is clever enough to look
// up advice based on our agent and relate it to anything we have."
//
// The quiz offers nine worries and a Something else box, and as of today the
// words a parent types into that box become a real concern they rate at their
// check in. That fixed the tracking. It did not fix the ANSWER: nine worries
// have a hand written pathway behind them, and the tenth, the one they cared
// enough to type, had nothing.
//
// It does not need nothing. The library is 335 scripts, 147 lessons and a
// moments deck, and lib/digi/script-match already finds the right one from a
// sentence a parent typed. It has been doing it since 10 August, but only ever
// for a message sent INTO a DiGi chat. A worry typed at the quiz went into the
// ledger as a label and was never once put through the same search.
//
// So this puts it through. The parent's own words are a query like any other,
// and the answer to "speaking on phone a lot as friend has a new one" is the
// asking for a phone script we already hold, found by the same matcher, on the
// day they arrive rather than the day they think to ask.
//
// ── WHY IT MATCHES ON THE LABEL AND NOT THE SLUG ────────────────────────────
//
// The slug is kebab case and lossy ("speaking-on-phone-a-lot-as-friend"): it
// exists to be a stable key, not to be read. The label is what the parent
// actually typed, punctuation and all, which is exactly the shape the matcher
// was built for.

/** Every slug one of the nine tiles already owns. */
const COVERED = new Set(Object.values(ONBOARDING_TO_SLUG))

export type ConcernRow = { slug: string; label: string; status?: string | null }

/**
 * The worries this family raised in their own words, rather than by ticking a
 * tile we wrote. These are the ones with no pathway behind them, so they are
 * the ones worth searching the library for.
 */
export function ownWordsConcerns(concerns: ConcernRow[]): ConcernRow[] {
  return concerns.filter(c =>
    c.slug &&
    !COVERED.has(c.slug) &&
    (c.status ?? 'open') !== 'settled' &&
    String(c.label ?? '').trim().length > 2,
  )
}

/**
 * Scripts that fit a worry a parent described themselves.
 *
 * `limit` is deliberately small. Handing DiGi ten candidates for a worry we
 * have no pathway for invites it to pad an answer with near misses, and a near
 * miss on the thing they typed reads worse than an honest "we have not written
 * this one yet".
 */
export function scriptsForOwnWorry(
  scripts: MatchableScript[],
  label: string,
  limit = 2,
): MatchableScript[] {
  return matchScripts(scripts, label, limit)
}

/**
 * The grounding block for DiGi's context: what we hold that touches the
 * worries this family wrote themselves.
 *
 * Returns an empty string when there is nothing, so the caller can concatenate
 * it unconditionally and DiGi is never told about an empty list.
 */
export function ownWorryKnowledge(
  concerns: ConcernRow[],
  scripts: MatchableScript[],
): string {
  const own = ownWordsConcerns(concerns)
  if (own.length === 0) return ''

  const lines: string[] = []
  for (const c of own.slice(0, 3)) {
    const hits = scriptsForOwnWorry(scripts, c.label)
    if (hits.length === 0) {
      lines.push(`- "${c.label}" — nothing in the library matches this one yet. Say so plainly if it comes up, then give them the next step from what you know. Never invent a script title or link for it.`)
    } else {
      lines.push(`- "${c.label}" — closest things we hold: ` +
        hits.map(s => `[${s.title}](/dashboard/scripts/${s.sort_order})`).join(', '))
    }
  }

  return '\n\nWORRIES THIS PARENT DESCRIBED IN THEIR OWN WORDS, rather than picking one of ours. ' +
    'There is no written pathway behind these, so they are the ones where you have to do the work. ' +
    'If the parent raises one, use the closest thing we hold below, name it as the closest rather than as the answer, ' +
    'and be honest when we have nothing exact:\n' +
    lines.join('\n')
}
