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
// outside the UK the helpline needs swapping for a local one.

export default function BiggerThanThis({ kid }: { kid?: string }) {
  const child = kid && kid.length > 1 ? kid : 'your child'
  return (
    <div className="wow-fu" style={{
      background: 'var(--tint-sage)',
      border: '2px solid var(--ink)',
      borderRadius: 18,
      boxShadow: '0 5px 0 var(--ink)',
      padding: '16px 18px 18px',
      marginTop: 20,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
        marginBottom: 7,
      }}>
        When it is bigger than this
      </div>
      <p style={{ margin: 0, fontSize: 'var(--text-md)', lineHeight: 1.6, color: 'var(--ink)' }}>
        If {child}&apos;s mood is low on most days for a fortnight, if they have stopped
        doing things they used to enjoy, if they are not eating or sleeping, or if they
        have said anything at all about hurting themselves, that is a conversation with
        your GP and not with an app. Ask DiGi and it will tell you the same thing.
      </p>
      <p style={{ margin: '10px 0 0', fontSize: 'var(--text-md)', lineHeight: 1.6, color: 'var(--ink)' }}>
        Your GP, your school&apos;s pastoral lead, or the YoungMinds Parents Helpline on{' '}
        <strong>0808 802 5544</strong>. In an emergency, 111 or 999.
      </p>
    </div>
  )
}
