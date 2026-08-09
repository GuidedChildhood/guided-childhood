import { STEPS, type StepKey } from '@/lib/kid/five-a-day'

// What the child actually did, where a grown up can see it.
//
// Justin, 9 August 2026: "we need to make this really work and add a reminder
// somewhere and track if done somehow."
//
// The track half turned out to be the bigger hole. The five a day has run since
// it shipped and **the parent had no view of it anywhere in the app**. A child
// ticks five things a day, every day, and until this nobody ever saw one of
// them. Every other thing a child does here reaches a grown up: jobs go through
// approval, lesson passes land on the passport, an ask arrives as a push. The
// five a day, which is the thing they do most, went nowhere.
//
// ── What this deliberately is not ────────────────────────────────────────────
//
// Not a compliance report. There is no percentage, no target, no red for a day
// that was not finished, and no comparison between children. A parent reading
// "3 of 5" should feel told, not armed. Days a child did not finish show what
// they DID do, because four things done is four things done and printing it as
// a failure is how a good habit becomes another thing to be nagged about.
//
// Not a surveillance feed either. It shows what the child chose to write down
// themselves through the confirm sheet, which is the child telling their grown
// up, not the app reporting on them.

export type FiveADayDay = {
  /** ISO date, UK. */
  day: string
  steps: StepKey[]
  done: StepKey[]
  complete: boolean
  /** Per step, what they said they did. */
  notes: Record<string, string>
}

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function shortDay(iso: string, today: string): string {
  if (iso === today) return 'Today'
  const d = new Date(`${iso}T12:00:00Z`)
  return WEEKDAY[d.getUTCDay()] ?? iso.slice(5)
}

export default function FiveADayReport({
  childName,
  days,
  today,
}: {
  childName: string
  /** Newest first. Empty when this child has no app or has never opened it. */
  days: FiveADayDay[]
  /** Today in the UK, so the newest row can be named rather than dated. */
  today: string
}) {
  // Nothing to report is not a thing to report on. A family whose child has no
  // app of their own would otherwise get an empty card explaining its own
  // emptiness on every visit, forever.
  if (days.length === 0) return null

  const todayRow = days[0]?.day === today ? days[0] : null
  const label = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const }

  return (
    <section style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px',
      padding: '20px 18px', marginTop: '18px', boxShadow: '0 4px 24px rgba(26,26,46,0.07)',
    }}>
      <div style={{ ...label, color: 'var(--terracotta-dark)', marginBottom: '4px' }}>
        Their five a day
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.2 }}>
        What {childName} has been doing
      </h3>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
        Five small things a day, mostly off the screen. This is what they ticked, and what they said they did.
      </p>

      {/* Today, in full. The only day worth the room, because it is the one a
          parent can still say something about over tea. */}
      {todayRow && (
        <div style={{ background: 'var(--cream)', borderRadius: '16px', padding: '14px 15px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
              Today
            </span>
            <span style={{ ...label, color: 'var(--ink-muted)', flexShrink: 0 }}>
              {todayRow.done.length} of {todayRow.steps.length}
            </span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayRow.steps.map(key => {
              const def = STEPS[key]
              const done = todayRow.done.includes(key)
              const note = todayRow.notes[key]
              return (
                <li key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', lineHeight: 1.4, opacity: done ? 1 : 0.4 }}>
                    {done ? '✅' : def.emoji}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{
                      display: 'block', fontSize: 'var(--text-md)', lineHeight: 1.35,
                      fontWeight: done ? 700 : 500,
                      color: done ? 'var(--ink)' : 'var(--ink-muted)',
                    }}>
                      {def.label}
                    </span>
                    {/* The child's own words, which is the whole point of the
                        confirm sheet. A step confirmed without picking an idea
                        shows nothing here rather than a placeholder: they did
                        it their own way, and that is a complete answer. */}
                    {done && note && (
                      <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 1 }}>
                        {note}
                      </span>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* The run behind it. Counts, not ticks and crosses, so a four out of five
          day reads as four things done rather than one thing missed. */}
      <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '8px' }}>
        The last {days.length === 1 ? 'day' : `${days.length} days`}
      </div>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {[...days].reverse().map(d => (
          <div key={d.day} style={{
            flex: '1 1 44px', minWidth: 44, textAlign: 'center',
            background: d.complete ? 'var(--tint-sage)' : 'var(--cream)',
            border: `1.5px solid ${d.complete ? '#2F8F6B' : 'var(--border)'}`,
            borderRadius: 13, padding: '9px 4px',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1 }}>
              {d.complete ? '⭐' : d.done.length}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', marginTop: 4 }}>
              {shortDay(d.day, today)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
