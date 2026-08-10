import type { TermPreview } from '@/lib/learning/term-preview'

// What is coming at school, on the child's own week.
//
// Justin, 10 August 2026: "could we add a diary entry to give a preview note for
// term what's coming up and what the child could be learning?"
//
// The same three subjects the parent's card shows, in the child's register. It
// sits at the top of their week rather than inside a day, because it is not a
// thing happening on a date: it is the shape of the next few months, and putting
// it on a Tuesday would be a lie about when it starts.
//
// ── Not a job, and not a warning ─────────────────────────────────────────────
//
// Nothing to tick, nothing to do, no stars. A child who is told what is coming
// is being let in on it, not set homework about it, and the moment this grows a
// tick box it becomes another thing they are behind on during their holiday.
//
// It also says nothing about how they are doing. We hold no performance data on
// any child, and a preview is exactly where a product would be tempted to imply
// some.

export default function KidTermPreview({
  preview,
  childName,
}: {
  preview: TermPreview
  childName?: string | null
}) {
  const name = childName && childName !== 'Your child' ? childName : null

  return (
    <section style={{
      background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 20,
      padding: '16px 18px', marginBottom: 16, boxShadow: '0 4px 0 rgba(26,26,46,0.08)',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
        marginBottom: 4,
      }}>
        {preview.inHoliday ? 'When you go back' : 'This term'}
      </div>

      <p style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
        color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.2,
      }}>
        Some of what is coming up 🔭
      </p>

      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
        You will meet all of this{name ? `, ${name}` : ''}. Nobody expects you to know it yet.
      </p>

      {/* The same caveat as the parent's card, in the child's register. A child
          who is told "you will do fractions in the spring" and then does not is
          being told the app was wrong, and the app was not: their school simply
          ordered the year differently, which schools are entitled to do. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '0 0 12px' }}>
        Every school does these in its own order, so yours might do them at a different time.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {preview.subjects.map(s => (
          <div key={s.label} style={{
            background: 'var(--cream)', borderRadius: 14, padding: '11px 13px',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
              color: 'var(--ink)', lineHeight: 1.25,
            }}>
              {s.label}
            </div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
              {s.line}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
