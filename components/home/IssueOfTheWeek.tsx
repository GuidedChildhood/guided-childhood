import Link from 'next/link'
import HappyIcon from '@/components/kid/HappyIcon'
import type { IssueOfWeek } from '@/lib/home/issue-of-week'

// The fix of the week on Home: one device problem for this child's age, why
// it happens, and the exact words that solve it. Server rendered, no script.
//
// Justin, 13 September 2026: the loop must provide real success help. This
// is the success help, one per week, in the order parents at this age raise
// them, never re offered once done. Happy news finish: ink edge, one ledge on
// the shell, the thing to tap in butter, a story icon on a plate.

const BAND_LABEL: Record<string, string> = { '4-7': 'ages 4 to 7', '8-10': 'ages 8 to 10', '11-13': 'ages 11 to 13', '13-15': 'ages 13 to 15', '16+': 'age 16 and up' }

export default function IssueOfTheWeek({ pick }: { pick: IssueOfWeek; childName?: string | null }) {
  return (
    <section aria-label="This week's fix" style={{
      background: '#fff', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-card)',
      padding: '16px 18px', marginBottom: 22,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span aria-hidden style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '50%', background: 'var(--terracotta-lt)', border: 'var(--edge)', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <HappyIcon name="tell" size={30} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>
            {pick.kept ? 'Kept up' : "This week's fix"} · {BAND_LABEL[pick.band] ?? pick.band}
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
            {pick.issue.name}
          </span>
          {/* The name and the button, nothing else. The mechanism, the pathway
              and the prevention line used to print here, about 110 words on a
              Home card a parent gives five seconds. They live on the script
              page one tap away (Justin, 13 September 2026, on the
              recommendations: "Go with recommendations"). */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <Link href={pick.href} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', minHeight: 44,
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)',
              background: 'var(--terracotta)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '9px 16px',
            }}>
              {pick.script ? (pick.kept ? 'Read it again' : 'The words for it') : 'Open it'} <span aria-hidden>→</span>
            </Link>
            {pick.script && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', minWidth: 0 }}>
                {pick.script.title}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
