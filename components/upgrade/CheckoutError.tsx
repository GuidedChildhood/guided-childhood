// Why the till would not open, in words a parent can do something with.
//
// Justin, 13 August 2026, holding a blank Chrome error page on the founder
// button: "first we need to diagnose the link to founder member and
// subscriptions not working."
//
// Two separate failures were producing the same nothing. A Stripe call that
// threw came out as HTTP 500 and a white page, and a genuinely sold out
// founder place redirected here with ?error=founder_sold_out onto a page that
// had never read the parameter. So "all fifty places are taken" and "the
// payment system is misconfigured" looked identical, and neither said anything.
//
// THE SPLIT MATTERS. Two of these are the parent's business and the rest are
// ours. A sold out place is real news about the offer. A missing environment
// variable is not something a parent can fix, or should be shown the guts of,
// so those say the honest thing (this is on us, nothing was charged) while the
// checkout route logs the detail where we will actually find it.
//
// Nothing is ever charged on any of these paths, and every one of them says so,
// because the single worst thing a payment error can leave behind is a parent
// wondering whether their card was taken.

const REASONS: Record<string, { title: string; body: string; ours: boolean }> = {
  founder_sold_out: {
    title: 'The founder places have all gone',
    body: 'All fifty are claimed, so that rate has closed. Everything else is exactly as it was and you have not been charged. The standard membership below opens the same product.',
    ours: false,
  },
  use_the_button: {
    title: 'That address is not a page',
    body: 'It is where the payment form submits to, so opening it directly does nothing. Use one of the buttons on this page and it will take you to the card screen.',
    ours: false,
  },
  no_stripe_key: {
    title: 'Payments are not switched on here',
    body: 'That is on us, not you, and nothing has been charged. We have been told and it is a configuration fix rather than a fault with your account.',
    ours: true,
  },
  stripe_unreachable: {
    title: 'We could not reach the payment system',
    body: 'Nothing has been charged and nothing on your account has changed. Try once more in a minute, and if it does the same thing tell us, because that means it is our end.',
    ours: true,
  },
  stripe_refused: {
    title: 'The card screen would not open',
    body: 'Nothing has been charged. This is ours to fix rather than anything about your card, and we have the detail we need. Try again shortly.',
    ours: true,
  },
}

// A tier specific price gap (no_price_founder, no_price_standard) reads as the
// same thing to a parent: that plan cannot be bought right now.
function reasonFor(raw: string) {
  if (REASONS[raw]) return REASONS[raw]
  if (raw.startsWith('no_price_')) {
    return {
      title: 'That plan is not available to buy right now',
      body: 'Nothing has been charged. It is a setting on our side rather than anything to do with your account, and we have been told.',
      ours: true,
    }
  }
  return null
}

export default function CheckoutError({ reason }: { reason: string }) {
  const r = reasonFor(reason)
  if (!r) return null
  return (
    <div
      role="status"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        background: r.ours ? 'var(--danger-bg)' : 'var(--cream)',
        border: `1.5px solid ${r.ours ? 'var(--danger-border)' : 'var(--border)'}`,
        borderRadius: 16, padding: '15px 17px', marginBottom: '22px',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 'var(--text-lg)', lineHeight: 1.25, flexShrink: 0 }}>
        {r.ours ? '🔧' : 'ℹ️'}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>
          {r.title}
        </div>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '4px 0 0' }}>
          {r.body}
        </p>
      </div>
    </div>
  )
}
