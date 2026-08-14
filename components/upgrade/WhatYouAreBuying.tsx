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
      {/* ── THE SECOND HALF GOES BEHIND A DOOR ────────────────────────────
          Justin, 13 August 2026: "just have the first part here as need to
          open up to find out more."

          Two full paragraphs of argument before a parent has seen a price is
          a wall, and the one above already lands the whole idea: screen time
          becomes the thing they earn. What follows is the part that rewards
          somebody already interested, so it waits to be asked for.

          A details element rather than state, so it needs no client component
          and works with JavaScript off. */}
      <details style={{ marginTop: '4px' }}>
        <summary style={{
          cursor: 'pointer', listStyle: 'none',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
        }}>
          And what that builds &rsaquo;
        </summary>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '10px 0 0' }}>
          That habit builds quietly for years while the lessons do the teaching,
          so social media and AI arrive at the end of a pathway instead of at a
          cliff edge. The point is not a child who is locked out. It is a
          sixteen year old who walks in already knowing how it works on them,
          and a house that got calmer on the way there.
        </p>
      </details>

      {/* ── AND EVERYTHING THAT IS ACTUALLY IN IT ─────────────────────────
          Justin, 13 August 2026: "make sure it lists everything we do: homework
          decoder, lessons, curriculum help, school coach, moments, DiGi
          answering, quests jobs chores, recording screen device timer."

          The page listed five stages, unlimited DiGi, 100 scripts, a tracker
          and a builder, which is most of a parts list and about half the
          product. A parent deciding whether to pay was never told the homework
          decoder, the school coach or the device timer existed at all.

          Plain rows rather than cards, because this is a list being checked
          against a price and eleven cards would bury the button underneath. */}
      <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--terracotta)' }}>
        <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '10px' }}>
          Everything inside
        </p>
        <div style={{ display: 'grid', gap: '7px' }}>
          {[
            ['⭐', 'Quests', 'Jobs and chores earn stars, stars become device minutes, at the rate you set'],
            ['⏱️', 'The screen timer', 'Time earned is time on the clock, so the argument ends before it starts'],
            ['🌙', 'Daily moments', 'The morning, the handover, homework, bedtime, with the exact words for each'],
            ['💬', 'DiGi, answering', 'A real answer at 11pm, calibrated to your child, never a flat yes or no'],
            ['📚', 'Lessons', 'Age banded, on screens, AI and social media, sent to their phone or done together'],
            ['🔍', 'The homework decoder', 'Photograph the sheet, get what it is really asking and how to help'],
            ['🎓', 'Curriculum help', 'What their school year actually covers, and a lesson built to match it'],
            ['🏫', 'The school coach', 'Kit days, trips and payments, remembered for you and for them'],
            ['📊', 'The wellbeing tracker', 'One tap a day, so you can see what is genuinely working'],
            ['🛂', 'The passport to sixteen', 'Filled in together, a stamp each stage'],
            ['🖨️', 'Printables', 'Star charts, planners and craft sheets, made for your child by name'],
          ].map(([icon, name, what]) => (
            <div key={name} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
              <span aria-hidden="true" style={{ flexShrink: 0, lineHeight: 1.35 }}>{icon}</span>
              <span style={{ fontSize: 'var(--text-base)', lineHeight: 1.4, color: 'var(--ink-soft)' }}>
                <strong style={{ color: 'var(--ink)' }}>{name}.</strong> {what}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
