import FreeDoor from './FreeDoor'

// ── THE ONE BLOCK, AFTER THE FIRST CHECK IN ─────────────────────────────────
//
// Justin, 13 August 2026: "One block, shown AFTER the first check in, not at
// sign up. By then they have given something and seen something back, so the
// offer lands on a moment of value rather than a wall. Two doors and nothing
// else."
//
// The doors themselves are not new. They were the last screen of onboarding,
// written carefully, and almost nobody reached them: onboarding_complete is
// written four screens earlier, so any reload deleted the one screen in the
// product that asks for money. See lib/access.ts and migration 191. The copy
// is carried across rather than rewritten, because the copy was never the
// problem.
//
// Presentational and propped so /ref-choose can draw it at 390 and 1280 with
// no database and no Stripe, the same way every other fiddly surface here is
// checked.

const CARD: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)',
  borderRadius: 20, padding: '28px 24px',
  boxShadow: '0 4px 24px rgba(26,26,46,0.07)',
}

const EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px',
}

const PAY_BTN: React.CSSProperties = {
  display: 'block', width: '100%', padding: '17px 28px',
  background: 'var(--terracotta)', color: 'var(--ink)',
  border: 'none', borderRadius: 16,
  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)',
  letterSpacing: '0.08em', textTransform: 'uppercase',
  cursor: 'pointer', boxShadow: '0 5px 0 var(--terracotta-dark)', textAlign: 'center',
}

export default function TwoDoors({
  remaining,
  cap,
  freeDays,
  trialDays,
  next,
}: {
  /** Founder places genuinely left, read from Stripe on the server. */
  remaining: number
  /** FOUNDER_CAP, so the copy and the gate cannot drift. */
  cap: number
  /** Free days actually still owed, so both cards agree with the receipt. */
  freeDays: number
  /** TRIAL_DAYS, the length of the offer itself. */
  trialDays: number
  /** Where they were headed when the block caught them. */
  next: string
}) {
  const soldOut = remaining <= 0

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: '12px' }}>
          Founding members · {cap} places
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--ink)', marginBottom: '10px' }}>
          Two ways in. Pick one.
        </h1>
        {/* WHY NOW, in one line, because a block with no reason attached is
            just a toll gate. They have this second told us where things are,
            and that reading is the first mark on a line they will watch move. */}
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '26px' }}>
          That first check in is your starting point. Everything from here is measured against it.
        </p>

        <div style={CARD}>
          {!soldOut ? (
            <>
              <div style={{ ...EYEBROW, color: 'var(--terracotta-dark)' }}>
                Option one · Founder
              </div>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.7, marginBottom: '20px' }}>
                Add your card now to hold one of the {cap} founder places and lock in £7.99 a month for life. You keep the free days you have left: nothing is charged for {freeDays} {freeDays === 1 ? 'more day' : 'more days'}, and you can cancel any time before then.
              </p>

              {/* THE SCARCITY IS TRUE, which is the only reason it is here.
                  Fifty places, enforced in the checkout route against a live
                  Stripe count, gone for good after that. */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                border: '1.5px solid var(--border)',
                borderRadius: '100px', padding: '7px 16px', marginBottom: '24px',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--terracotta)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
                  {remaining} of {cap} places left
                </span>
              </div>

              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="tier" value="founder" />
                <input type="hidden" name="from" value="choose" />
                <input type="hidden" name="next" value={next} />
                <button type="submit" style={PAY_BTN}>Hold my founder place</button>
              </form>
            </>
          ) : (
            <>
              <div style={{ ...EYEBROW, color: 'var(--terracotta-dark)' }}>
                Option one · Keep everything
              </div>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.7, marginBottom: '20px' }}>
                The {cap} founder places have been claimed. Your free days are already running. Add your card to carry straight on after them: nothing charged for {freeDays} {freeDays === 1 ? 'more day' : 'more days'}, cancel any time.
              </p>
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="tier" value="standard" />
                <input type="hidden" name="from" value="choose" />
                <input type="hidden" name="next" value={next} />
                <button type="submit" style={PAY_BTN}>Keep my access</button>
              </form>
            </>
          )}
        </div>

        {/* BOTH DOORS ARE CARDS, which is the shape Justin asked for on the
            onboarding version and the reason it carries over unchanged: a bare
            button under a card does not read as a choice, it reads as the way
            out of the thing above it, and a parent who would have paid never
            actually weighs the two. The free door keeps its own case rather
            than being an apology, and it says plainly what it costs. */}
        <FreeDoor days={freeDays} trialDays={trialDays} next={next} />
      </div>
    </div>
  )
}
