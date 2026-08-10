import { PrintBrandHeader, PrintBrandFooter } from '@gc/shared/components/PrintBrand'

// Our family deal, on paper, for the fridge. The same deal both sides already
// see on their screens, laid out big enough to read from across a kitchen:
// jobs earn stars, stars buy screen time, the timer rule, the promises made
// together, and two lines to sign.
//
// One component, two doors. The parent prints it from the dashboard and the
// child prints it from their own app, and because both render this, the sheet
// on the fridge always says the same thing as the app. A deal that only lives
// behind a login gets forgotten by teatime; a deal on the fridge does not.

export type DealQuest = { title: string; emoji?: string | null; stars: number }

export default function FamilyDealSheet({
  childName, starMinutes, recommendedMinutes, timerRule, agreedDate,
  quests = [], promises = [], goal = null,
}: {
  childName: string
  starMinutes: number
  recommendedMinutes: number
  timerRule?: string | null
  agreedDate?: string | null
  quests?: DealQuest[]
  promises?: { title: string; body: string }[]
  goal?: { title: string; starsNeeded: number } | null
}) {
  const kid = childName && childName !== 'Your child' ? childName : 'Our child'

  const mono: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase',
  }
  const card: React.CSSProperties = {
    border: '2px solid var(--border)', borderRadius: 16,
    padding: '16px 18px', background: '#fff', breakInside: 'avoid',
  }

  // The three rules of the deal, in the child's own words, the same three the
  // app shows them.
  const rules = [
    { n: '1', title: 'You do jobs', body: 'Real world jobs and quests your grown up sets, like tidying up or reading.' },
    { n: '2', title: 'Jobs earn stars', body: `Every quest gives you stars. One star is worth ${starMinutes} minutes of screen time.` },
    { n: '3', title: 'Stars buy screen time', body: `You choose when to use them. A good amount of screen a day is about ${recommendedMinutes} minutes.` },
  ]

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <PrintBrandHeader />

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-3xl)', letterSpacing: '-0.02em', lineHeight: 1.05, margin: '18px 0 4px' }}>
        Our family deal
      </h1>
      <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 20px' }}>
        {kid} and their grown up agreed this together. Stick it on the fridge so everyone can see it.
      </p>

      {/* The three rules, numbered big */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {rules.map(r => (
          <div key={r.n} style={{ ...card, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{
              flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: 'var(--terracotta-lt)',
              border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--terracotta-dark)',
            }}>{r.n}</span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', lineHeight: 1.2 }}>{r.title}</span>
              <span style={{ display: 'block', fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 3 }}>{r.body}</span>
            </span>
          </div>
        ))}
      </div>

      {/* The timer rule, the one line that matters most */}
      {timerRule && (
        <div style={{ marginBottom: 20, breakInside: 'avoid' }}>
          <div style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginBottom: 7 }}>The timer rule</div>
          <div style={{ background: 'var(--terracotta-lt)', border: '2px solid var(--terracotta)', borderRadius: 16, padding: '16px 18px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', lineHeight: 1.35, margin: 0 }}>
              {timerRule}
            </p>
            {agreedDate && (
              <p style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', margin: '9px 0 0' }}>
                ✓ Agreed together on {agreedDate}
              </p>
            )}
          </div>
        </div>
      )}

      {/* The jobs that earn, with their star values, so the rate is on the wall */}
      {quests.length > 0 && (
        <div style={{ marginBottom: 20, breakInside: 'avoid' }}>
          <div style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginBottom: 7 }}>The jobs that earn stars</div>
          <div style={{ ...card, padding: '6px 18px' }}>
            {quests.map((q, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '11px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>
                  {q.emoji ? `${q.emoji} ` : ''}{q.title}
                </span>
                <span style={{ ...mono, fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', whiteSpace: 'nowrap' }}>
                  {q.stars} {q.stars === 1 ? 'star' : 'stars'} · {q.stars * starMinutes} min
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What we agreed together, the promises from the first run */}
      {promises.length > 0 && (
        <div style={{ marginBottom: 20, breakInside: 'avoid' }}>
          <div style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginBottom: 7 }}>What we agreed together</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {promises.map((p, i) => (
              <div key={i} style={{ ...card, padding: '13px 16px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', lineHeight: 1.25 }}>{p.title}</div>
                <div style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 3 }}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What they are saving for */}
      {goal && (
        <div style={{ ...card, background: 'var(--tint-sage)', borderColor: '#D6E5DF', marginBottom: 20 }}>
          <div style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginBottom: 5 }}>Saving up for</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', lineHeight: 1.2 }}>{goal.title}</div>
          <div style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', marginTop: 3 }}>{goal.starsNeeded} stars to get there.</div>
        </div>
      )}

      {/* Two signatures, because a deal both sides sign is a deal both sides keep */}
      <div style={{ display: 'flex', gap: 20, marginTop: 26, breakInside: 'avoid' }}>
        {[kid, 'Grown up'].map(who => (
          <div key={who} style={{ flex: 1 }}>
            <div style={{ borderBottom: '2px solid var(--ink)', height: 42 }} />
            <div style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: 7 }}>{who}</div>
          </div>
        ))}
      </div>

      <PrintBrandFooter />
    </div>
  )
}
