import Link from 'next/link'
import { PAGE } from '@gc/shared/page-scale'

// THE BAR ON A STANDALONE LESSON (24 September 2026).
//
// A standalone lesson is free because it sits outside the scheme, not because
// it is a sample of it (lib/taster.ts says why). So this is not the taster's
// bar: no module count, no lead form, and no letter selling the rest of the
// scheme to whoever fills it in. It says what the lesson is, opens it, and
// names who made it, once and quietly. Rendered only without a school code,
// the same as the taster's.

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}

export default function StandaloneBar({ moduleId }: { moduleId: string }) {
  return (
    <section style={{
      background: '#fff', border: '2px solid var(--terracotta)',
      borderRadius: 'var(--radius-card)', padding: 'clamp(20px, 4vw, 30px)', marginBottom: '28px',
    }}>
      <p style={{ ...eyebrow, marginBottom: '10px' }}>Free standalone lesson</p>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)',
        ...PAGE.section, marginBottom: 'var(--space-3)',
      }}>
        Teach it free. It stands on its own.
      </h2>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
        color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '20px', maxWidth: '56ch',
      }}>
        This lesson is not part of our scheme of work, so nothing here is counted, mapped or
        tracked. Read the plan, play the slides and print the pack, with any Year 8 or Year 9 class.
      </p>
      {/* The gold Teach button sits just below this bar on the lesson page,
          so the bar offers the other thing a teacher needs: the paper. */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: '16px' }}>
        <Link href={`/print/${moduleId}`} className="btn btn-outline">Open the printable pack</Link>
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
        Made by Guided Childhood, who write a full digital literacy scheme for schools.{' '}
        <Link href="/" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>See the scheme</Link>
      </p>
    </section>
  )
}
