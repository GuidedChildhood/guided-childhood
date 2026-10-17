import Link from 'next/link'

// THE REAL PASSPORT AND THE STICKERS, AS PICTURES, ONE BUTTON
// (Justin's brief on PR 1312, 16 October 2026: "ability to order the real
// passport and stickers", the Polarsteps book shown as the thing itself).
//
// The two shop photographs already in public/shop, side by side, and one
// button to the keepsakes page with this child chosen. It sits on the page,
// never inside the stamp moment (31 July: an offer in the same breath as a
// child's achievement makes the achievement look like the setup for a sale).

export default function PassportOrderCard({ kid, childId, stampedCount }: { kid: string; childId: string | null; stampedCount: number }) {
  const href = `/dashboard/keepsakes${childId ? `?child=${encodeURIComponent(childId)}` : ''}#p-passport_printed`
  const pic: React.CSSProperties = {
    width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block',
    borderRadius: 'var(--radius-tile)', border: 'var(--edge)', background: 'var(--terracotta-lt)',
  }
  return (
    <section data-block="order" style={{
      background: 'var(--terracotta-lt)', border: 'var(--edge)', boxShadow: 'var(--lift)',
      borderRadius: 'var(--radius-card)', padding: 16, margin: '6px 0 18px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <figure style={{ margin: 0 }}>
          <img src="/shop/passport_printed.webp" alt="The printed digital literacy passport, open on its stamp pages" width={320} height={320} style={pic} />
          <figcaption style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)', marginTop: 6 }}>
            The passport · £14
          </figcaption>
        </figure>
        <figure style={{ margin: 0 }}>
          <img src="/shop/sticker_sheet.webp" alt="The Planet Friends sticker sheet" width={320} height={320} style={pic} />
          <figcaption style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)', marginTop: 6 }}>
            The stickers · £4
          </figcaption>
        </figure>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.25 }}>
        {kid}&rsquo;s passport, on paper
      </h3>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
        {stampedCount > 0
          ? `Printed with ${kid}'s name and every stamp so far. The sticker sheet adds each new stamp as it lands.`
          : `Printed with ${kid}'s name, ready for the first stamp. The sticker sheet adds each stamp as it lands.`}
      </p>
      <Link href={href} className="btn btn-gold" style={{ display: 'inline-flex', minHeight: 44 }}>
        Order the passport and stickers
      </Link>
    </section>
  )
}
