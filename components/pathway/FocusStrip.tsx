import Link from 'next/link'

// The one thing this family is working on, and the door to the words for it.
//
// ── THE COMMENT THAT USED TO BE HERE WAS WRONG (13 August 2026) ─────────────
//
// It argued at length that this strip belonged on the stages road page,
// because on 12 August Justin said: "focus, words for tonight, can be their
// appearance on pathway, not here on home."
//
// That reading of "pathway" was the mistake, and it is a vocabulary mistake
// rather than a design one. Justin, 13 August: "pathway was what I was calling
// today, the things to do today. So anything I asked to be moved to pathway, I
// meant to rotate on the coins on today's things."
//
// So he never asked for the strip to move to another page. He asked for it to
// stop being a fixed banner on Home and start TAKING ITS TURN in the daily
// rotation, which is the `focus` item in lib/home/next-up.ts: on the days it
// comes up it is the thing, and on the other days something else is. That item
// exists and is live. This strip is no longer mounted anywhere.
//
// It is kept rather than deleted for two reasons. CHALLENGE_LABELS below is
// imported by Home, which still needs the onboarding answer as the fallback
// label. And a strip is a smaller thing to reinstate than to reinvent, if the
// rotation ever wants a pinned version of this on a page that is not Home.
//
// What must NOT happen is putting it back at the top of Home as a permanent
// strip. That is the exact thing Justin was complaining about.
//
// Presentational on purpose: the caller works out the label and the
// destination, because the pages already hold different halves of that and
// none of them should gain a query for a strip.

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

/** Re-exported so the pathway page's import does not have to change, and so
 *  anything reaching for the labels still finds them next to the strip that
 *  uses them. The map itself lives in lib/pathway/challenge-labels.ts, out of
 *  this JSX file, because burying it here is how it drifted out of step with
 *  onboarding in the first place and how a check script was unable to notice. */
export { CHALLENGE_LABELS } from '@/lib/pathway/challenge-labels'
