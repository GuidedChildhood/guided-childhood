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

const WRAP: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '9px',
  background: 'var(--cream)', border: '1.5px solid var(--terracotta)',
  borderRadius: '100px', padding: '8px 16px', marginBottom: '22px',
}
const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '.66rem', fontWeight: 700,
  letterSpacing: '.09em', textTransform: 'uppercase',
  color: 'var(--terracotta-dark)', whiteSpace: 'nowrap',
}
// .96rem, not .86rem, and that number came from main rather than from here.
// While this component was replacing the hardcoded badge on the home page,
// main bumped that sentence up a size because it was reading small next to the
// headline. Carrying it across is the reason the merge conflict was worth
// reading instead of resolving by picking a side.
const TEXT: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontSize: '.96rem', fontWeight: 800,
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
      <span style={LABEL}>Founding rate</span>
      <span style={TEXT}>
        {few
          ? `Only ${spots!.remaining} of the 50 places left, 7.99 a month for life`
          : 'First 50 families, 7.99 a month for life'}
      </span>
    </div>
  )
}
