// When a worry is bigger than an app.
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// A clinical review of the reveal on 9 September 2026 called this the duty of
// care gap on the page, and it was right. The page speaks to a parent who is
// worried about their child's mood, sells them daily mood rating, tells them
// worries settle over weeks, and never once said when a worry is bigger than
// anything we do.
//
// The failure mode is specific and foreseeable rather than theoretical. A
// parent watches the line for six weeks BECAUSE the product told them to
// expect movement over weeks, and feels they are doing something because they
// are tapping every day, while a depressive episode or self harm goes
// unaddressed. The tracking itself manufactures the sense of action that
// delays the GP visit. A product that asks a parent to rate their child's mood
// every day has to say where its own edge is.
//
// It sits under the answers rather than in a footer, because the parent who
// needs it is reading the mood section, not the small print. It is deliberately
// calm and not alarming: the point is to be there when it is needed, not to
// frighten the much larger number of parents for whom none of this applies.
//
// The numbers are UK and were current at the time of writing. If this ships
// outside the UK they need swapping for local ones. Note 111 does not cover
// Northern Ireland.
//
// It deliberately does NOT say "ask DiGi and it will tell you the same thing",
// which the first version did. That sentence contradicted the one before it
// ("not with an app") and staked a safeguarding promise on model output, which
// is a thing you can only ever test probabilistically. A commitment made on a
// safety block has to be one you can guarantee.

export default function BiggerThanThis({ kid, urgent = false }: {
  kid?: string
  /** Set when the parent has typed something that needs help before it needs a
   *  product. The block then leads the page instead of sitting under it. */
  urgent?: boolean
}) {
  const child = kid && kid.length > 1 ? kid : 'your child'
  return (
    <div className="wow-fu" style={{
      background: urgent ? 'var(--stage-3)' : 'var(--tint-sage)',
      border: '2px solid var(--ink)',
      borderRadius: 18,
      boxShadow: '0 5px 0 var(--ink)',
      padding: '16px 18px 18px',
      marginTop: urgent ? 0 : 20,
      marginBottom: urgent ? 24 : 0,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
        marginBottom: 7,
      }}>
        When it is bigger than this
      </div>

      {/* ── SELF HARM IS TIERED ON ITS OWN ─────────────────────────────────
          The first version listed anything about hurting themselves in the
          same sentence as not eating or sleeping, under one instruction to
          book a GP appointment. Those are not the same urgency and a parent
          reading fast will take the calmest reading available to them. */}
      <p style={{ margin: 0, fontSize: 'var(--text-md)', lineHeight: 1.6, color: 'var(--ink)' }}>
        If {child} has said anything at all about hurting themselves or about not wanting
        to be here, or you have found marks you cannot explain, do not wait for it to show
        up in a check in. Ring your GP today and ask for an urgent appointment. If you think
        {' '}{child} is not safe right now, call 999 or go to your nearest A and E.
      </p>

      <p style={{ margin: '10px 0 0', fontSize: 'var(--text-md)', lineHeight: 1.6, color: 'var(--ink)' }}>
        If {child}&apos;s mood is low on most days for a fortnight, if they have stopped doing
        things they used to enjoy, or if they are not eating or sleeping, book a GP appointment
        and speak to your school&apos;s pastoral lead. That is a conversation with people who
        know {child}, not with an app.
      </p>

      {/* ── A ROUTE THAT IS OPEN AT THE HOUR THIS HAPPENS ──────────────────
          The first version named only the YoungMinds parents helpline, which
          runs on weekdays in the daytime. Our own testimonial on this page is
          about a Sunday evening. A frightened parent phoning that number at
          nine on a Sunday gets nothing, at the exact moment we have just told
          them it is bigger than an app. Childline and SHOUT are open at that
          hour, and the child gets a number of their own.

          111 was listed beside 999 under the word emergency, which is wrong in
          both directions: it sends non emergencies to 999 and holds real
          emergencies in a queue. */}
      <p style={{ margin: '10px 0 0', fontSize: 'var(--text-md)', lineHeight: 1.6, color: 'var(--ink)' }}>
        For {child}, any time of day or night: <strong>Childline on 0800 1111</strong>, or text
        {' '}<strong>SHOUT to 85258</strong>. For you: the YoungMinds Parents Helpline on{' '}
        <strong>0808 802 5544</strong>, open weekdays in the daytime. NHS 111 when it is urgent
        but not an emergency. 999 if it is.
      </p>
    </div>
  )
}
