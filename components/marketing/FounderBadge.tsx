'use client'

import { useEffect, useState } from 'react'

// The founding rate badge on the home page, reading the real seat count.
//
// Justin, 12 August 2026, going through the go live: "have got built in when we
// reach 50 sign ups of founder rate it will revert to standard price and give
// them the options of annual and monthly, also that the homepage will update?"
//
// ── THREE OF THOSE WERE TRUE. THIS ONE WAS NOT ──────────────────────────────
//
// The cap is genuinely enforced: app/api/stripe/checkout counts the seats held
// in Stripe, active or trialing, and refuses the 51st. The upgrade page reads
// the same count on every load, so the founder block disappears by itself and
// the plan chooser retitles from "Or the standard rate" to "Choose your plan".
// Yearly at 99 and monthly at 12.99 are already sitting there.
//
// THE HOME PAGE WAS THE HOLE, and it was the worst place to have one. The badge
// was a hardcoded sentence. After the fiftieth sale the shopfront would have
// gone on advertising 7.99 for life to every stranger who landed, while
// checkout refused to sell it. Not untidy: a price we would not honour, on the
// first thing a new parent reads.
//
// ── WHY IT READS IN THE BROWSER ─────────────────────────────────────────────
//
// Same trade as HeaderActions next door, and the same reason. Counting seats
// server side means a Stripe round trip in front of the landing page on every
// cold visit. The home page is static and it is the page strangers meet first,
// so it stays that way: the HTML ships instantly with the honest opening line,
// and the exact number arrives a moment later.
//
// ── WHAT IT SAYS, AND WHY THE FIRST LINE IS NOT A NUMBER ────────────────────
//
// Before the count lands it reads "First 50 families, 7.99 a month for life",
// which is true whatever the count turns out to be. It never renders a guessed
// number that then corrects itself, because a price that changes as you look at
// it is worse than a price that arrives a second late.
//
// Then: plenty left, it names the offer. Under ten, it says how many, because
// that is when a real number does the work. Gone, the badge stops selling the
// founder rate entirely and points at what is actually for sale.
//
// Fails to the plain line. A Stripe blip leaves the page saying the true,
// non numeric version rather than an empty box or a wrong count.

type Spots = { remaining: number; sold_out: boolean }

// Redesigned 29 Aug 2026 after Justin's screenshot: the old pill put the mono
// label beside the sentence, so on a phone with larger text the price wrapped
// mid number and the £ sign was missing entirely. The industry anatomy for a
// founder price: the price is the typographic hero, anchored against the real
// standard rate (£12.99, stated in the terms) with a strikethrough, scarcity
// on its own quiet line above. Stacked, so it can never wrap mid price.
const WRAP: React.CSSProperties = {
  display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
  gap: '5px', background: 'var(--cream)', border: '1.5px solid var(--terracotta)',
  borderRadius: '18px', padding: '12px 22px 13px', marginBottom: '22px',
  textAlign: 'center',
}
const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700,
  letterSpacing: '.09em', textTransform: 'uppercase',
  color: 'var(--terracotta-dark)',
}
const PRICE_ROW: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)',
  fontSize: 'var(--text-base)', lineHeight: 1.3,
  display: 'flex', alignItems: 'baseline', gap: '7px',
  flexWrap: 'wrap', justifyContent: 'center',
}
const ANCHOR: React.CSSProperties = {
  color: 'var(--ink-muted)', textDecoration: 'line-through',
  textDecorationThickness: '1.5px', fontWeight: 700, fontSize: 'var(--text-sm)',
}
const HERO_PRICE: React.CSSProperties = {
  fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-.02em',
  color: 'var(--terracotta-dark)', lineHeight: 1,
}
const TEXT: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800,
  color: 'var(--ink)',
}

export default function FounderBadge() {
  const [spots, setSpots] = useState<Spots | null>(null)

  useEffect(() => {
    let live = true
    fetch('/api/founder-spots')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (live && d && typeof d.remaining === 'number') {
          setSpots({ remaining: d.remaining, sold_out: !!d.sold_out })
        }
      })
      .catch(() => { /* the plain line stands, and it is still true */ })
    return () => { live = false }
  }, [])

  // Sold out: stop advertising something nobody can buy.
  if (spots?.sold_out) {
    return (
      <div className="fu" style={{ ...WRAP, borderColor: 'var(--border)' }}>
        <span style={{ ...LABEL, color: 'var(--ink-muted)' }}>Founding rate</span>
        <span style={TEXT}>All 50 places taken. Yearly or monthly from here</span>
      </div>
    )
  }

  const few = spots !== null && spots.remaining > 0 && spots.remaining < 10

  return (
    <div className="fu" style={WRAP}>
      <span style={LABEL}>
        {few
          ? `Founding rate · only ${spots!.remaining} of 50 places left`
          : 'Founding rate · first 50 families'}
      </span>
      <span style={PRICE_ROW}>
        <s style={ANCHOR}>£12.99</s>
        <span style={HERO_PRICE}>£7.99</span>
        <span>a month for life</span>
      </span>
    </div>
  )
}
