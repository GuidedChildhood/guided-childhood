import { PrintBrandHeader, PrintBrandFooter } from '@gc/shared/components/PrintBrand'
import type { Promise_ } from '@/lib/content/agreement-promises'

// Our family deal, on paper, for the fridge. The same deal both sides already
// see on their screens, laid out big enough to read from across a kitchen.
//
// One component, two doors. The parent prints it from the dashboard and the
// child prints it from their own app, and because both render this, the sheet
// on the fridge always says the same thing as the app. A deal that only lives
// behind a login gets forgotten by teatime; a deal on the fridge does not.
//
// ── THE PROMISES ARE ON IT NOW (14 September 2026) ──────────────────────────
//
// Justin, reviewing the agreement: the child print outs should be "super top
// design", "wired in with children", "live on both apps for referring to" and
// match "best science by age". This sheet printed the three rules, the timer
// rule, the jobs and the goal, and never read the family agreement at all: the
// promises a family had signed were not on the paper the child put on the
// wall. They lead now, each with its icon, the words the family chose, and
// the one line of why. The child's own Planet Friend is on the sheet, the
// review date is printed so the deal knows it has a life, and the science the
// deal rests on is at the foot, named, so a parent can say where it came from.
//
// The Happy Newspaper finish (design-refs/happy-newspaper-notes.md): one
// ribbon heading, circle plates for the icons, ink edges and a ledge, white
// cards on cream. Print drops the colour ground and keeps the shapes.

export type DealQuest = { title: string; emoji?: string | null; stars: number }
export type DealScience = { claim: string; source: string }

export default function FamilyDealSheet({
  childName, starMinutes, recommendedMinutes, timerRule, agreedDate,
  quests = [], promises = [], goal = null,
  typeLabel = null, reviewDate = null, signedByParent = false, signedByChild = false,
  friend = null, science = [],
}: {
  childName: string
  starMinutes: number
  recommendedMinutes: number
  timerRule?: string | null
  /** When the timer rule was agreed, already formatted. */
  agreedDate?: string | null
  quests?: DealQuest[]
  /** The promises of the signed agreement, from lib/content/agreement-promises. */
  promises?: Promise_[]
  goal?: { title: string; starsNeeded: number } | null
  /** "First screens", "Tablet and gaming": the deal's type, for the heading. */
  typeLabel?: string | null
  /** The review date the family picked, already formatted. */
  reviewDate?: string | null
  signedByParent?: boolean
  signedByChild?: boolean
  /** The child's Planet Friend, on the sheet so it is theirs. */
  friend?: { name: string; img: string } | null
  /** The science the deal rests on, two or three lines, each with its source. */
  science?: DealScience[]
}) {
  const kid = childName && childName !== 'Your child' ? childName : 'Our child'

  const mono: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase',
  }
  const card: React.CSSProperties = {
    border: '2px solid var(--ink)', borderRadius: 'var(--radius-btn)',
    padding: '14px 16px', background: '#fff', breakInside: 'avoid',
    boxShadow: '0 4px 0 var(--ink)',
  }
  const plate = (bg: string): React.CSSProperties => ({
    flexShrink: 0, width: 44, height: 44, borderRadius: '50%', background: bg,
    border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 'var(--text-xl)', lineHeight: 1,
  })

  // The three rules of the deal, in the child's own words, the same three the
  // app shows them.
  const rules = [
    { n: '1', title: 'You do jobs', body: 'Real world jobs and quests your grown up sets, like tidying up or reading.' },
    { n: '2', title: 'Jobs earn stars', body: `Every quest gives you stars. One star is worth ${starMinutes} minutes of screen time.` },
    { n: '3', title: 'Stars buy screen time', body: `You choose when to use them. A good amount of screen a day is about ${recommendedMinutes} minutes.` },
  ]

  return (
    <div data-deal-sheet style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <style>{`
        @media print {
          [data-deal-sheet] { --ds-scale: 0.86; }
          [data-deal-sheet] .ds-card { box-shadow: none !important; }
          [data-deal-sheet] .ds-friend { filter: none !important; }
        }
      `}</style>
      <PrintBrandHeader />

      {/* THE HEAD: ribbon, the type, the Friend. */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, margin: '14px 0 6px' }}>
        <div style={{ minWidth: 0 }}>
          <span style={{
            display: 'inline-block', background: 'var(--terracotta)', color: 'var(--ink)', border: '2px solid var(--ink)',
            borderRadius: 6, padding: '6px 14px', boxShadow: '4px 4px 0 var(--ink)',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            Our family deal
          </span>
          {typeLabel && (
            <p style={{ ...mono, fontSize: 'var(--text-xs)', color: 'var(--terracotta-dark)', margin: '12px 0 0' }}>
              {typeLabel} · {kid}&apos;s deal
            </p>
          )}
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0' }}>
            {kid} and their grown up agreed this together. On the fridge so everyone can see it.
          </p>
        </div>
        {friend && (
          <div className="ds-friend" style={{ flexShrink: 0, width: 96, height: 96, borderRadius: '50%', background: 'var(--tint-butter, #FEF7E0)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={friend.img} alt={friend.name} width={80} height={80} style={{ width: 80, height: 80, objectFit: 'contain' }} />
          </div>
        )}
      </div>

      {/* THE PROMISES, FIRST. What the family actually agreed, with the why. */}
      {promises.length > 0 && (
        <div data-promises style={{ margin: '18px 0 20px', breakInside: 'avoid' }}>
          <div style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginBottom: 8 }}>What we promised each other</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {promises.map(p => (
              <div key={p.key} className="ds-card" style={{ ...card, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={plate('var(--terracotta-lt)')} aria-hidden>{p.emoji}</span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', lineHeight: 1.2 }}>{p.title}</span>
                  <span style={{ display: 'block', fontSize: 'var(--text-lg)', fontWeight: 600, lineHeight: 1.45, marginTop: 3 }}>{p.body}</span>
                  {p.why && (
                    <span style={{ display: 'block', ...mono, fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.04em', textTransform: 'none', marginTop: 6 }}>
                      Why: {p.why}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* THE THREE RULES, compact: how the stars work. */}
      <div style={{ marginBottom: 18, breakInside: 'avoid' }}>
        <div style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginBottom: 8 }}>How the stars work</div>
        {/* Three across on paper and at the normal root, stacked once Larger
            Text makes a 7em column wider than a third of a phone. */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 7em), 1fr))', gap: 8 }}>
          {rules.map(r => (
            <div key={r.n} className="ds-card" style={{ ...card, padding: '12px 12px', boxShadow: 'none', borderWidth: 1.5 }}>
              <span style={{ display: 'inline-flex', width: 26, height: 26, borderRadius: '50%', background: 'var(--terracotta)', border: '2px solid var(--ink)', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', marginBottom: 6 }}>{r.n}</span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', lineHeight: 1.2 }}>{r.title}</span>
              <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 3 }}>{r.body}</span>
            </div>
          ))}
        </div>
      </div>

      {/* The timer rule, the one line that matters most */}
      {timerRule && (
        <div style={{ marginBottom: 18, breakInside: 'avoid' }}>
          <div style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginBottom: 7 }}>The timer rule</div>
          <div style={{ background: 'var(--terracotta-lt)', border: '2px solid var(--ink)', borderRadius: 'var(--radius-btn)', padding: '14px 16px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', lineHeight: 1.35, margin: 0 }}>
              {timerRule}
            </p>
            {agreedDate && (
              <p style={{ ...mono, fontSize: 'var(--text-xs)', color: 'var(--terracotta-dark)', margin: '8px 0 0' }}>
                ✓ Agreed together on {agreedDate}
              </p>
            )}
          </div>
        </div>
      )}

      {/* The jobs that earn, with their star values, so the rate is on the wall */}
      {quests.length > 0 && (
        <div style={{ marginBottom: 18, breakInside: 'avoid' }}>
          <div style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginBottom: 7 }}>The jobs that earn stars</div>
          <div className="ds-card" style={{ ...card, padding: '4px 16px', boxShadow: 'none', borderWidth: 1.5 }}>
            {quests.map((q, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px 12px', flexWrap: 'wrap',
                padding: '9px 0', borderTop: i === 0 ? 'none' : '2px dotted rgba(26,26,46,0.18)',
              }}>
                <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, minWidth: 0 }}>
                  {q.emoji ? `${q.emoji} ` : ''}{q.title}
                </span>
                {/* The rate drops under the title when Larger Text leaves no
                    room beside it. */}
                <span style={{ ...mono, fontSize: 'var(--text-xs)', color: 'var(--terracotta-dark)', marginLeft: 'auto', textAlign: 'right' }}>
                  {q.stars} {q.stars === 1 ? 'star' : 'stars'} · {q.stars * starMinutes} min
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What they are saving for */}
      {goal && (
        <div className="ds-card" style={{ ...card, background: 'var(--tint-sage)', marginBottom: 18, boxShadow: 'none', borderWidth: 1.5 }}>
          <div style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginBottom: 4 }}>Saving up for</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', lineHeight: 1.2 }}>{goal.title}</div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: 2 }}>{goal.starsNeeded} stars to get there.</div>
        </div>
      )}

      {/* WHY WE AGREED THIS. The science the deal rests on, named, so a parent
          asked "why" at the table can say where it came from. */}
      {science.length > 0 && (
        <div data-science style={{ marginBottom: 18, breakInside: 'avoid', background: 'var(--cream)', border: '1.5px dashed var(--ink)', borderRadius: 'var(--radius-btn)', padding: '12px 16px' }}>
          <div style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginBottom: 6 }}>Why we agreed this</div>
          <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {science.map((s, i) => (
              <li key={i} style={{ fontSize: 'var(--text-sm)', lineHeight: 1.45, color: 'var(--ink)' }}>
                {s.claim} <span style={{ color: 'var(--ink-muted)' }}>({s.source})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Two signatures, because a deal both sides sign is a deal both sides
          keep. A signed side prints its name on the line. */}
      <div data-signatures style={{ display: 'flex', gap: 20, marginTop: 22, breakInside: 'avoid' }}>
        {[{ who: kid, signed: signedByChild }, { who: 'Grown up', signed: signedByParent }].map(({ who, signed }) => (
          <div key={who} style={{ flex: 1 }}>
            <div style={{ borderBottom: '2px solid var(--ink)', height: 40, display: 'flex', alignItems: 'flex-end', paddingBottom: 4, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)' }}>
              {signed ? `✓ ${who}` : ''}
            </div>
            <div style={{ ...mono, fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: 6 }}>{who}{signed ? ' · signed' : ''}</div>
          </div>
        ))}
      </div>
      {reviewDate && (
        <p data-review style={{ ...mono, fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', margin: '14px 0 0', textAlign: 'center' }}>
          We sit down and look at this again together on {reviewDate}
        </p>
      )}

      <PrintBrandFooter />
    </div>
  )
}
