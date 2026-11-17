import Link from 'next/link'
import PassportCover from '@/components/passport/PassportCover'
import StageSticker from '@/components/passport/StageSticker'
import { STAGE_STICKERS } from '@/lib/pathway/stage-stickers'

// THE REAL PASSPORT AND THE STICKERS, DRAWN, ONE BUTTON
// (Justin's brief on PR 1312, 16 October 2026: "ability to order the real
// passport and stickers").
//
// Justin, 17 November 2026: the card showed the wrong things. A yellow shop
// photograph titled "Digital Literacy Passport", which is not the passport,
// and a generic sticker sheet of blobs and a flame, which are not the
// stickers. The passport is the app's burgundy book and the stickers are the
// five Planet Friends, one per stage. So both are now drawn from the same
// components the rest of the app uses (PassportCover, StageSticker): the
// friends already stamped show in colour on the cover and on the sheet, and
// the rest wait as outlines. A parent sees the object they will hold.
//
// It sits on the page, never inside the stamp moment (31 July: an offer in the
// same breath as a child's achievement makes the achievement look like the
// setup for a sale). Printing the colour stickers at home is free and sits
// beside the order, because the paper has to work for a family who never buys.

export default function PassportOrderCard({ kid, childId, stamped }: { kid: string; childId: string | null; stamped: number[] }) {
  const q = childId ? `?child=${encodeURIComponent(childId)}` : ''
  const href = `/dashboard/keepsakes${q}#p-passport_printed`
  const printHref = `/dashboard/keepsakes/passport-print/stickers${q}`
  const recordHref = `/dashboard/keepsakes/passport-print/record${q}`
  const cap: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'var(--ink)', margin: '8px 0 0', textAlign: 'center',
  }
  return (
    <section data-block="order" style={{
      background: 'var(--terracotta-lt)', border: 'var(--edge)', boxShadow: 'var(--lift)',
      borderRadius: 'var(--radius-card)', padding: 16, margin: '6px 0 18px',
    }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ flexShrink: 0, padding: '4px 2px 0' }}>
          <PassportCover kid={kid === 'Your child' ? null : kid} stamped={stamped} width={112} tilt={-3} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ ...cap, textAlign: 'left', margin: '0 0 6px' }}>The passport · £14</p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: 0 }}>
            The burgundy book from the app, printed with {kid === 'Your child' ? 'your child' : kid}&rsquo;s name and a page for every stage.
          </p>
        </div>
      </div>
      <div style={{ background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '10px 8px 8px', marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 4, justifyItems: 'center' }}>
          {STAGE_STICKERS.map(s => (
            <div key={s.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
              <StageSticker s={s} earned={stamped.includes(s.n)} size={40} showName={false} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xs)', color: stamped.includes(s.n) ? 'var(--ink)' : 'var(--ink-muted)', marginTop: 4 }}>{s.friend}</span>
            </div>
          ))}
        </div>
        <p style={cap}>The five stickers · £4</p>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.25 }}>
        {kid}&rsquo;s passport, on paper
      </h3>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
        One Planet Friend sticker for each stage. When a stage is done in the app, its sticker goes in the book, and it says what {kid === 'Your child' ? 'your child' : kid} learnt.
        {stamped.length > 0 ? ` ${stamped.length} of 5 earned so far.` : ' The first one comes with the first stage done.'}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <Link href={href} className="btn btn-gold" style={{ display: 'inline-flex', minHeight: 44 }}>
          Order the passport and stickers
        </Link>
        <Link href={printHref} style={{
          display: 'inline-flex', alignItems: 'center', minHeight: 44, fontFamily: 'var(--font-display)', fontWeight: 800,
          color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3,
        }}>
          Print the stickers free
        </Link>
        <Link href={recordHref} style={{
          display: 'inline-flex', alignItems: 'center', minHeight: 44, fontFamily: 'var(--font-display)', fontWeight: 800,
          color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3,
        }}>
          Print the record book free
        </Link>
      </div>
    </section>
  )
}
