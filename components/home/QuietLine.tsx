import Link from 'next/link'

// One line, one tap, and it only exists when there is something behind it.
//
// Justin, 12 August 2026, on the Home clean up: "they should be some link or
// one line to click for these when they pop up, but not taking up too much
// space."
//
// ── THE RULE THIS ENCODES ───────────────────────────────────────────────────
//
// The blocks it replaces were not wrong, they were the wrong SIZE. The
// community bite, the welcome beat and the day checkup all carry something a
// parent might want, and each of them took a card's worth of screen to say it
// whether or not that was the day for it. Four such cards is most of a phone
// screen spent on maybes, sitting between a parent and the two things they
// actually opened the app for.
//
// So the content does not go: it shrinks to the smallest honest form, which is
// a sentence that says what is behind it and a tap that gets there. If nothing
// is behind it, nothing renders at all, which is the other half of the rule.
// A line that says "nothing new" is still a line.
//
// Deliberately plainer than FoldSection. That expands in place and belongs to a
// section a parent owns, like the school drawer. This is a pointer to somewhere
// else, and dressing it up as a card is how we ended up here.

export default function QuietLine({
  eyebrow, label, href, icon,
}: {
  /** Two or three words in mono, so the eye can sort these at a glance. */
  eyebrow: string
  /** The one sentence. What is behind the tap, in a parent's words. */
  label: string
  href: string
  /** Optional, small, and never load bearing. */
  icon?: string
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block', marginBottom: '10px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: '#fff', border: '1.5px solid var(--border)',
        borderRadius: '14px', padding: '11px 14px',
      }}>
        {icon && (
          <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', lineHeight: 1 }}>{icon}</span>
        )}
        <span style={{
          flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
        }}>
          {eyebrow}
        </span>
        <span style={{
          flex: 1, minWidth: 0, fontSize: 'var(--text-base)', color: 'var(--ink)',
          lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {label}
        </span>
        <span aria-hidden style={{ flexShrink: 0, color: 'var(--ink-light)', fontSize: 'var(--text-md)' }}>›</span>
      </div>
    </Link>
  )
}
