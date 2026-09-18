import Link from 'next/link'
import { CHARACTERS } from '@gc/shared/schools-curriculum'
import { PASSPORT_STAGES } from '@gc/shared/passport-stages'
import { STAGE_NUMBER, pageModules } from '@gc/shared/passport-areas'
import { FriendArt, type Friend } from '@/components/print/kit'
import { EDITIONS } from '@/lib/passport-print'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'

// THE PASSPORT PRINT OUT: the four editions (14 September 2026).
//
// One sheet to fold into a passport and one sheet of stickers, per page the
// school scheme fills. Every lesson on a page earns a sticker for its ring;
// the stamp comes when the page is full. The words on the panels are the
// lessons' own `I can` lines, so the passport promises what the scheme
// teaches. Years 12 and 13 are past the passport, by design.

export const metadata = { title: 'The passport print out' }

const eyebrow: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)' }

export default function PassportPrintIndex() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <Link href="/print" style={{ ...eyebrow, textDecoration: 'none' }}>← The print room</Link>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', margin: '18px 0 4px' }}>Print, fold, cut, stick</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-3)' }}>
          The passport print out
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '640px', marginBottom: '26px' }}>
          One sheet folds into a passport the size of a real one, and one sheet of stickers fills it. Every lesson
          on a page earns a sticker for its ring, and the stamp comes when the page is full. The words on the
          pages are the lessons&rsquo; own, so the passport promises exactly what the scheme teaches. Print in colour
          if you can; it photocopies clean in black and white.
        </p>
        {/* One passport per child, not one for the wall. The name goes on by
            hand because the schools app holds no pupil record and the data
            processing agreement is written on that. */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.6, maxWidth: '640px', margin: '-14px 0 26px' }}>
          Print one per child. A class of thirty is thirty of each sheet. Every child writes their own name on the front, which is why we never ask you for a class list.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
          {EDITIONS.map(e => {
            const friend: Friend = { key: e.friend, ...CHARACTERS[e.friend] }
            const page = PASSPORT_STAGES[e.stage]
            const count = pageModules(e.stage).length
            return (
              <Link className="gc-tap" key={e.stage} href={`/print/passport/${e.stage}`} style={{ textDecoration: 'none', color: 'var(--ink)', background: '#fff', border: `2px solid ${friend.accent}`, borderRadius: 'var(--radius-card)', padding: 'var(--space-4) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', boxShadow: '0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <FriendArt friend={friend} mood="wave" size={16} />
                  <div>
                    <div style={{ ...eyebrow, color: friend.ink }}>Page {STAGE_NUMBER[e.stage]} of 5 · {e.years}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', lineHeight: 1.15 }}>{page.page}</div>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
                  {e.strap}. {count} lesson{count === 1 ? '' : 's'} fill this page, so {count} lesson sticker{count === 1 ? '' : 's'}, four area stickers and {friend.name} for the stamp.
                </p>
                <span style={{ marginTop: 'auto', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: friend.ink }}>Print the two sheets →</span>
              </Link>
            )
          })}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6, marginTop: '22px', maxWidth: '640px' }}>
          Years 12 and 13 sit after the passport: the journey it records is the road to sixteen, and those years are past it. The Asking questions page is filled at home, in the app.
        </p>
        {/* The paid version, offered after the free one and never instead of
            it. A school that has folded the paper passport knows what the
            bound one is worth, and no lesson is ever blocked on our stock. */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 'var(--space-4) var(--space-4)', marginTop: '26px', maxWidth: '640px' }}>
          <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '8px' }}>Want them printed and bound?</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, margin: '0 0 12px' }}>
            We can supply proper booklets with the pages already printed, and sticker sheets to fill them. Ask for a quote and we reply within two working days with a price and a lead time.
          </p>
          <Link href="/supplies" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Ask for a quote ›
          </Link>
        </div>
      </div>
    </main>
  )
}
