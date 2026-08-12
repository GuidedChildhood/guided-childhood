import Link from 'next/link'

// The one thing this family is working on, and the door to the words for it.
//
// ── IT LIVES ON THE PATHWAY, NOT ON HOME (12 August 2026) ────────────────────
//
// Justin: "focus, words for tonight, can be their appearance on pathway, not
// here on home."
//
// He is right and the reason is what each page is for. Home is today: what is
// due, what is waiting, what to tap now. The pathway is the journey: where this
// family started, what they are working on, how far they have come. A strip
// that names the one open concern and offers the words for it is a sentence
// about the journey, and on Home it was one more thing between a parent and the
// thing they opened the app to do.
//
// It also lands better there. On the pathway it sits with the stages and the
// stamps, where a parent is already reading about progress, so "working on it"
// and "getting better" mean something next to a road that shows the same shape.
//
// Presentational on purpose: the page works out the label and the destination,
// because both pages already hold different halves of that and neither should
// gain a query for a strip.

export default function FocusStrip({
  label, improving, scriptHref, hasConcern,
}: {
  /** What they are working on. The concern's own label, or the challenge they
   *  picked at onboarding before any concern exists. */
  label: string
  improving: boolean
  /** Where the words live. The daily loop's script step when there is one, so
   *  the strip lands on the script chosen for today rather than the library. */
  scriptHref: string
  /** A real logged concern, rather than the onboarding answer. It changes the
   *  tail of the sentence, because "working on it" is a claim we can only make
   *  about something they actually flagged. */
  hasConcern: boolean
}) {
  if (!label) return null
  return (
    <Link href={scriptHref} style={{ textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
        borderRadius: '14px', padding: '11px 14px',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', flexShrink: 0 }}>
          Your focus
        </span>
        <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
          <span style={{ fontWeight: 600, color: improving ? 'var(--stage-1-text)' : 'var(--ink-muted)' }}>
            {' '}· {hasConcern ? (improving ? 'getting better' : 'working on it') : 'your starting focus'}
          </span>
        </span>
        <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)', whiteSpace: 'nowrap' }}>
          The words for tonight →
        </span>
      </div>
    </Link>
  )
}

/** The onboarding challenge, in the words a parent would use, for families who
 *  have not flagged a concern yet. Kept beside the strip because it is only
 *  ever read to fill it. */
export const CHALLENGE_LABELS: Record<string, string> = {
  bedtime: 'Bedtime and screens', homework: 'Homework and focus',
  mood_after_screens: 'Mood after screens', something_else: '',
  screens_takeover: 'Screens are taking over', mood_changes: 'Mood changes after phone use',
  gaming: 'Gaming concerns', online_safety: 'Online safety worries',
  start_conversation: 'Starting the conversation', asking_for_phone: 'Asking for a phone',
}
