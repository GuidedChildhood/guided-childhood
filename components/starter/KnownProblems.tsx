// What we already know about the parent reading this.
//
// Justin, 10 September 2026: "I love the problem shown, also add known problem
// for our known ideal customer."
//
// ── THESE ARE NOT OUR WORDS ─────────────────────────────────────────────────
//
// Every line here is from THE-STORY section 2, mined from Mumsnet, app store
// reviews and UK surveys on 8 August 2026, with the full sweep in
// research/homepage-audience-language.md. The verbatim is verbatim and the
// numbers are the numbers.
//
// It sits BEFORE we say anything about ourselves, and it makes no claim about
// the product at all. A parent arriving here has just typed their own evening
// into a quiz; the first thing they should meet is other people's evenings,
// said plainly enough that they recognise themselves and stop bracing.
//
// The reason it earns its space on a page we are otherwise cutting hard is
// that it is the only part of the page a parent might repeat to somebody else.
// THE-STORY: "They will repeat one sentence to another parent if we give them
// one worth repeating."

const LINES: { stat: string; said: string }[] = [
  { stat: '9 in 10', said: 'parents argue with their children about screen time' },
  { stat: '54%', said: 'regret giving their child a smartphone' },
  { stat: '47%', said: 'feel their child knows more about technology than they do' },
]

export default function KnownProblems() {
  return (
    <div style={{
      background: 'var(--cream)', border: '2px solid var(--ink)', borderRadius: 18,
      boxShadow: '0 5px 0 var(--ink)', padding: '16px 16px 14px',
    }}>
      <p style={{
        margin: '0 0 9px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
      }}>
        You are not the only one
      </p>

      {/* The verbatim first, because a number is a fact and a sentence is a
          recognition, and recognition is what stops somebody scrolling. */}
      <p style={{
        margin: '0 0 12px', fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'var(--text-lg)', lineHeight: 1.3, color: 'var(--ink)', letterSpacing: '-0.01em',
      }}>
        &ldquo;It is utterly miserable constantly policing screen time.&rdquo;
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {LINES.map(l => (
          <p key={l.stat} style={{ margin: 0, display: 'flex', gap: 9, alignItems: 'baseline', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.4 }}>
            <span style={{
              flexShrink: 0, minWidth: 52,
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)',
            }}>
              {l.stat}
            </span>
            <span>{l.said}</span>
          </p>
        ))}
      </div>

      {/* The tools they already tried, and why this is not one of them. The
          review is real and it is about the category, not about us. */}
      <p style={{ margin: '12px 0 0', paddingTop: 11, borderTop: '1.5px dashed var(--border)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
        The blocking apps get reviews like <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>&ldquo;a huge waste of money time and energy&rdquo;</strong>, because software that decides tonight for you teaches your child nothing for tomorrow.
      </p>

      <p style={{
        margin: '10px 0 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)', lineHeight: 1.5, letterSpacing: '0.02em',
      }}>
        UK surveys, Mumsnet and app store reviews, August 2026.
      </p>
    </div>
  )
}
