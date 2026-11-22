import Link from 'next/link'
import StageSticker from '@/components/passport/StageSticker'
import { ruleLines, STAGE_DONE_LINE, type StageSticker as Sticker } from '@/lib/pathway/stage-stickers'
import type { PageCount } from '@/lib/pathway/page-count'

// THE STICKER ON THE PAGE, IN TWO STATES (Justin, 17 November 2026).
//
// Not yet: what this page's Planet Friend sticker stands for, and the one rule
// that earns it, with this child's own counts. Under it, "along the way": the
// moments sorted, the stars, the time off screen and the balance this week,
// each a door to the screen it comes from. Those are the detailed app record
// and they are labelled as not needed for the sticker, because the stamp rule
// (lib/pathway/stamped.ts) does not read them and the page must not promise
// what the code does not check.
//
// Done: "Stage done, sticker added to your passport", the sticker in colour,
// what it says was learnt, and the button to print it for the paper book. The
// child sees the same words in their own app when the stamp lands.

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const card: React.CSSProperties = {
  background: 'var(--white)', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-card)',
  padding: '16px 18px', margin: '0 0 14px',
}

export type AlongTheWay = { key: string; label: string; value: string; href: string }

export function StageEarnCard({ s, count, kid, along, recordHref = null }: { s: Sticker; count: PageCount; kid: string; along: AlongTheWay[]
  /** The printed record book, every step of this stage on paper to tick and sign. */
  recordHref?: string | null }) {
  const lines = ruleLines(count, kid)
  return (
    <section data-block="earn" style={card}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
        <StageSticker s={s} earned={false} size={72} showName={false} />
        <div style={{ minWidth: 0 }}>
          <p style={{ ...mono, margin: '0 0 3px' }}>Earns the {s.friend} sticker</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', margin: 0, lineHeight: 1.4 }}>
            &ldquo;{s.learnt}&rdquo;
          </p>
        </div>
      </div>
      <p style={{ ...mono, margin: '0 0 6px', color: 'var(--ink)' }}>What earns it</p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {lines.map(l => (
          <li key={l.key} data-rule={l.key} data-done={l.done ? '1' : '0'} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', borderTop: '1px solid var(--border)' }}>
            <span aria-hidden style={{
              flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
              background: l.done ? 'var(--tint-green)' : 'transparent',
              border: l.done ? '1.5px solid var(--sage-ink)' : '1.5px dashed var(--ink-muted)',
              color: 'var(--sage-ink)', fontWeight: 900, fontSize: 12,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>{l.done ? '✓' : ''}</span>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.4 }}>{l.label}</span>
          </li>
        ))}
      </ul>
      {recordHref && (
        <Link href={recordHref} data-record style={{
          display: 'inline-flex', alignItems: 'center', minHeight: 44, marginTop: 6,
          fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3,
        }}>
          Print every step to tick off at home
        </Link>
      )}
      {along.length > 0 && (
        <div data-along style={{ marginTop: 14 }}>
          <p style={{ ...mono, margin: '0 0 2px', color: 'var(--ink)' }}>Along the way</p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', margin: '0 0 8px', lineHeight: 1.45 }}>
            The everyday work that makes the lessons stick. It is not needed for the sticker.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
            {along.map(a => (
              <Link key={a.key} href={a.href} data-along-item={a.key} style={{
                display: 'block', minHeight: 44, padding: '9px 11px', borderRadius: 'var(--radius-tile)',
                background: 'var(--cream)', border: '1.5px solid var(--border)', textDecoration: 'none', color: 'var(--ink)',
              }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', lineHeight: 1.15 }}>{a.value}</span>
                <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--ink-soft)', lineHeight: 1.35, marginTop: 2 }}>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export function StageDoneCard({ s, kid, printHref }: { s: Sticker; kid: string; printHref: string }) {
  return (
    <section data-block="stage-done" style={{ ...card, background: 'var(--tint-green)', textAlign: 'center' }}>
      <p style={{ ...mono, margin: '0 0 10px', color: 'var(--sage-ink)' }}>{s.page} · Stage {s.n} of 5</p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <StageSticker s={s} earned size={112} showName={false} />
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.2 }}>
        {STAGE_DONE_LINE}
      </h2>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 4px' }}>
        {kid === 'Your child' ? 'Your child' : kid} earned {s.friend}. The sticker says:
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.4, margin: '0 auto 14px', maxWidth: '34ch' }}>
        &ldquo;{s.learnt}&rdquo;
      </p>
      <Link href={printHref} className="btn btn-gold" style={{ display: 'inline-flex', minHeight: 44 }}>
        Print the colour sticker
      </Link>
    </section>
  )
}
