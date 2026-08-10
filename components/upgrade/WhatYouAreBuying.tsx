// WHAT THE MONEY IS ACTUALLY FOR, above the price rather than below it.
//
// Justin, 8 August 2026: "should we have here the big quest idea of rewarding
// offline chores and play with stars to use their device, creating healthy
// balance and habits as they navigate the pathway to social media at 16,
// trusted, safe and confident."
//
// Yes, and the page was weaker for missing it. Everything else on it is a
// parts list: five stages, unlimited DiGi, 100 scripts, a tracker, a builder.
// All true, none of it says what happens to your child. The stars loop is the
// most distinctive thing the product does and the only part a parent cannot
// get anywhere else, and it was not mentioned on the one page where somebody
// decides to pay.
//
// ITS OWN COMPONENT RATHER THAN INLINE JSX, and that is the whole reason this
// file exists. /dashboard/upgrade returns "You already have everything" before
// it renders any of this whenever hasFullAccess is true, and the founder
// address is permanently allowlisted, so Justin cannot open this page on his
// own account and neither could I. Copy that nobody can look at is copy that
// ships unread. Pulled out here, app/ref-upgrade-block renders it at the real
// column width with no auth, so it can actually be checked on a phone.

export default function WhatYouAreBuying() {
  return (
    <div style={{
      background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
      borderRadius: '18px', padding: '18px 20px', marginBottom: '24px',
    }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '8px' }}>
        What you are really buying
      </p>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
        color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em', margin: '0 0 10px',
      }}>
        A sixteen year old who can handle it
      </h2>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 10px' }}>
        Screen time stops being the argument and becomes the thing they earn.
        Jobs done, time outside, a book, a hand with the tea, all of it turns
        into stars, and stars turn into time on the device. You are not
        policing a timer any more, you are running a household where the good
        stuff pays.
      </p>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
        That habit builds quietly for years while the lessons do the teaching,
        so social media and AI arrive at the end of a pathway instead of at a
        cliff edge. The point is not a child who is locked out. It is a
        sixteen year old who walks in already knowing how it works on them,
        and a house that got calmer on the way there.
      </p>
    </div>
  )
}
