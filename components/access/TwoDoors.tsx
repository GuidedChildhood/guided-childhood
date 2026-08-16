import { PAY_BTN } from './door-button'
import FreeDoor from './FreeDoor'

// ── THE LAST THING IN SIGN UP: TWO PATHS, PICK ONE ──────────────────────────
//
// Justin, 14 August 2026: "At the end of sign up, the parent chooses one of
// exactly two paths." The homepage already sells it in those words on the
// trial card: "The founder rate is claimed at sign up, first 50 families
// only." Until now the app asked days later, or never.
//
// It is still a ROUTE with the middleware in front of it rather than a screen
// inside the wizard, and that distinction is the whole reason this survives.
// A screen here was tried and lost: onboarding_complete is written four
// screens before the end of setup, so a reload deleted the only page in the
// product that asks for money. See lib/access.ts. A parent who closes this tab
// is put straight back on it.
//
// WHAT THE TWO PATHS ACTUALLY DIFFER ON, and it is one thing:
//
//   path one   card now. Four free days, then £7.99 a month, automatically,
//              for life. Holds one of the fifty founder places.
//   path two   no card. The same four free days, then the app closes until
//              they join at the standard rate. No place held, none counted.
//
// The four days themselves are identical, which is why it is said once,
// underneath both, rather than argued twice.
//
// Presentational and propped so /ref-choose can draw it at 390 and 1280 with
// no database and no Stripe, the same way every other fiddly surface here is
// checked.

const CARD: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)',
  borderRadius: 20, padding: '22px 20px',
  boxShadow: '0 4px 24px rgba(26,26,46,0.07)',
  // Equal height whatever the copy does, and the button pinned to the bottom of
  // each, so the two are read as a pair rather than as one card and a follow up.
  display: 'flex', flexDirection: 'column',
}

const EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px',
}

// Both doors' buttons live in components/access/door-button.ts now, so the free
// one cannot drift away from this one again. See the note in that file.

// THE SENTENCE THE LAW AND JUSTIN BOTH ASKED FOR, sitting on the button screen
// rather than in a terms page or a receipt.
//
// Justin, 14 August 2026: "The auto charge must be said plainly right on the
// button screen." It is styled to be read rather than skimmed past, because a
// parent who is surprised by a charge on day five is a chargeback and a
// complaint, and they would be right to make it.
const CHARGE_NOTE: React.CSSProperties = {
  background: 'var(--cream)', border: '1.5px solid var(--border)',
  borderRadius: 14, padding: '13px 16px', marginBottom: '18px',
  fontSize: 'var(--text-md)', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.5,
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
  /** The trial length, so the copy can never disagree with the gate. */
  trialDays: number
  /** Where they were headed when the block caught them. */
  next: string
}) {
  const soldOut = remaining <= 0
  const dayWord = freeDays === 1 ? 'day' : 'days'

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
      <div style={{ maxWidth: 880, width: '100%' }}>

        {/* The eyebrow tells the truth in both states. Leaving it on
            "Founding members" over a card that says the places have gone is a
            small lie, and this screen is asking for a card. */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: '12px' }}>
          {soldOut ? `Founder places · all ${cap} claimed` : `Founding members · ${cap} places`}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--ink)', marginBottom: '10px' }}>
          Two ways in. Pick one.
        </h1>
        {/* WHERE THEY ARE, in one line. Setup is behind them and this is the
            last thing, which is worth saying: a screen asking about money with
            no end in sight reads as the start of a process. */}
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '26px' }}>
          Everything you just set up is saved. This is the last step, and either one takes you straight in.
        </p>

        {/* ── SIDE BY SIDE, AND SMALLER ──────────────────────────────────
            Justin, 16 August 2026: "can we put these side by side as options
            and make a little smaller, although text size is good, just a bit
            simpler."
            Stacked, the founder card came first and the free one read as what
            you do if you say no to it. Side by side they are two options being
            weighed, which is what the screen is for and what the matched
            buttons were already reaching for. Text sizes are untouched: the
            weight came off the padding and the column width, not the words.
            auto-fit with a 300px floor, so a phone still gets one above the
            other and nothing is squeezed. */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '14px', alignItems: 'stretch',
        }}>
        <div style={CARD}>
          {!soldOut ? (
            <>
              <div style={{ ...EYEBROW, color: 'var(--terracotta-dark)' }}>
                Path one · Founder
              </div>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.7, marginBottom: '18px' }}>
                Add your card now to hold one of the {cap} founder places and lock £7.99 a month for life. It is the only way the founder rate is claimed, and it never rises for you.
              </p>

              <p style={CHARGE_NOTE}>
                £7.99 a month starts after your {freeDays} free {dayWord}. Cancel any time before and pay nothing.
              </p>

              {/* THE SCARCITY IS TRUE, which is the only reason it is here.
                  Fifty places, enforced in the checkout route against a live
                  Stripe count, and only a card can hold one. */}
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

              <form action="/api/stripe/checkout" method="POST" style={{ marginTop: 'auto' }}>
                <input type="hidden" name="tier" value="founder" />
                <input type="hidden" name="from" value="choose" />
                <input type="hidden" name="next" value={next} />
                <button type="submit" style={PAY_BTN}>Hold my founder place</button>
              </form>
            </>
          ) : (
            <>
              {/* SOLD OUT, said plainly and once. The card stays because the
                  offer underneath it is still a real one, it is just the
                  standard price now. Pretending the places are open when they
                  are not is the one thing that would make the counter
                  worthless everywhere else it appears. */}
              <div style={{ ...EYEBROW, color: 'var(--terracotta-dark)' }}>
                Path one · Join now
              </div>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.7, marginBottom: '18px' }}>
                The {cap} founder places have all been claimed. Add your card now and everything carries straight on when your free {dayWord} end, at the standard rate.
              </p>

              <p style={CHARGE_NOTE}>
                £12.99 a month starts after your {freeDays} free {dayWord}. Cancel any time before and pay nothing.
              </p>

              <form action="/api/stripe/checkout" method="POST" style={{ marginTop: 'auto' }}>
                <input type="hidden" name="tier" value="standard" />
                <input type="hidden" name="from" value="choose" />
                <input type="hidden" name="next" value={next} />
                <button type="submit" style={PAY_BTN}>Keep my access</button>
              </form>
            </>
          )}
        </div>

        {/* BOTH PATHS ARE CARDS, which is the shape Justin asked for and the
            reason it carries over unchanged: a bare button under a card does
            not read as a choice, it reads as the way out of the thing above
            it, and a parent who would have paid never actually weighs the two.
            The no card path keeps its own case rather than being an apology,
            and it says plainly what it costs. */}
        <FreeDoor days={freeDays} trialDays={trialDays} next={next} />
        </div>

        {/* SAID ONCE, UNDERNEATH BOTH, because it is the one thing that does
            not differ. Justin, 14 August 2026: "The trial itself is identical:
            4 days inside the platform with DiGi on a daily limit and a starter
            set of scripts." Repeating it inside each card would read as two
            different offers being compared on a feature. */}
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.6, textAlign: 'center', margin: '18px 4px 0' }}>
          Either way the {trialDays} days are the same: the platform, DiGi with a daily limit, and a starter set of scripts. Cancelling during them costs nothing, and it is one tap in Settings.
        </p>
      </div>
    </div>
  )
}
