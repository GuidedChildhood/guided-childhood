import { VERDICT_LABEL, VERDICT_TONE, type Pace } from '@/lib/balance/pace'

// The one card that answers the question a parent actually came to the stats
// page with: is this alright, and what should tomorrow look like.
//
// It leads, above the graph, because a graph is something you interpret and
// this is something you read. The big number is the daily average rather than
// the weekly total, since nobody has an instinct for what 210 minutes a week
// means and everybody has one for half an hour a day.

export default function PaceCard({ pace, childName }: { pace: Pace; childName?: string | null }) {
  const tone = VERDICT_TONE[pace.verdict]
  const name = childName && childName !== 'Your child' ? childName : null

  // Is tomorrow's number asking for less than a normal day, or is it just a
  // normal day? buildPace caps the suggestion at the daily guide, so the only
  // way it comes back lower is a week that is genuinely running over. Under the
  // guide the two are equal, and a card that says "aim for" at that point is
  // inviting a family to watch more to reach it.
  const trimming = pace.suggestTomorrow !== null && pace.suggestTomorrow < pace.dailyGuide

  return (
    <div style={{
      background: tone.bg, border: `1.5px solid ${tone.border}`, borderRadius: 20,
      padding: '20px 20px 22px', marginBottom: 16,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.13em', textTransform: 'uppercase', color: tone.ink, marginBottom: 10,
      }}>
        {VERDICT_LABEL[pace.verdict]}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-3xl)',
          color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.03em',
        }}>
          {pace.average}
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>
          minutes a day
        </span>
      </div>
      {/* Which number is whose.
          This read "against a healthy guide of 150 a day for their age", and
          150 is not their age guide. In the summer a 13 year old's guide of 120
          is relaxed by a quarter, and calling the result the age figure makes
          our own holiday slack look like something the research recommends. It
          does not: 120 is the ceiling of the only source we cite that names a
          number for school age children, and in September the same card would
          quietly say 120 with nothing to explain the drop. So both numbers are
          named, each credited to the right thing. */}
      <div style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.4, marginBottom: 14 }}>
        {name ? `${name} so far this week` : 'So far this week'}, against a guide of {pace.termGuide} a day for their age
        {pace.relaxed && <>, relaxed to {pace.dailyGuide} for {pace.holidayTitle}</>}
      </div>

      {/* Tomorrow, which is the only part anyone can act on.

          Two words changed here and they change what the card is for.

          It used to be labelled "aim for tomorrow" over a sentence reading
          "995 minutes left in the week, spread across the 2 days to go". Two
          faults in one box. The sentence contradicted the number directly, since
          995 across 2 days is about 500 a day and the figure beside it said 150.
          And the pair together told a parent whose child had watched eleven
          minutes a day that they had a pot of nearly a thousand minutes to get
          through. Justin, 31 July: "do not try to fill in time as [it]
          encourages more watching".

          So the leftover is gone. It was never real: unspent guide minutes are
          not owed to anybody, and printing them as a balance made a ceiling look
          like a target. What is left is the one number that is genuinely useful,
          what an ordinary day looks like, and it only ever says something
          different from the guide when the week is running over. */}
      {pace.suggestTomorrow !== null && (
        <div style={{
          background: '#fff', borderRadius: 14, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              {trimming ? 'Tomorrow, to level up' : 'A normal day'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', lineHeight: 1.1 }}>
              {pace.suggestTomorrow} min
            </div>
          </div>
          <p style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: 0 }}>
            {trimming
              ? `A little under the usual ${pace.dailyGuide} brings the week back level.`
              : `The same as any other day. Being under it is not time owed back.`}
          </p>
        </div>
      )}

      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, margin: '14px 0 0', fontWeight: 600 }}>
        {pace.line}
      </p>

      {/* Where the extra actually goes, which is the honest answer to "so what
          happens to the time we did not use".

          Nothing happens to it, and that has to be said plainly or the card
          implies a debt. What DOES carry is different and better: screen time a
          child earns beyond the weekly cap banks for the school holidays, never
          expires, and is theirs. That is the thing worth pointing at, because it
          rewards the work rather than the watching. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '10px 0 0' }}>
        The guide is a steer for the age, not a rule and not a target. A heavy Saturday does not break anything. Time earned beyond it is not lost either: it banks for the school holidays, or you can gift it whenever you like.
      </p>
    </div>
  )
}
