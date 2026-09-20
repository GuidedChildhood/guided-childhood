'use client'

import { useEffect, useState } from 'react'

// The parent's control for a child's three kinds of time (migration 223):
// free time that is always theirs, earned time from stars, and protected
// windows no stars can buy. One card per child inside their device time box,
// same quiet details pattern as Who starts the timer. Saves per child, so
// siblings each keep their own bedtime and baseline.

type Settings = {
  coreMinutesDaily: number
  bedtimeStart: string | null
  bedtimeEnd: string | null
  protectMealtimes: boolean
  protectSchoolHours: boolean
  starMinutes: number
  /** Read only context from the route: what this child's age starts them on. */
  ageBand?: string | null
  guideBedtime?: { start: string; end: string } | null
  guideDailyMinutes?: number
}

const CORE_PRESETS = [0, 15, 20, 30]
// What one star buys. 5 is the rate every family started on; more minutes per
// star is part of the fade, handing a bigger block of trust per star as the
// child grows.
const RATE_PRESETS = [5, 10, 15]

export default function TimeTiersCard({ childId, childName }: { childId: string; childName: string }) {
  const [s, setS] = useState<Settings | null>(null)
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  // What the picker currently reads, before it is let go. Null means "show
  // what is saved". See the note on the time inputs for why this exists.
  const [draftStart, setDraftStart] = useState<string | null>(null)
  const [draftEnd, setDraftEnd] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetch(`/api/quests/time/settings?childId=${childId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (alive && d) setS(d as Settings) })
      .catch(() => { /* the card simply stays closed on a failed read */ })
    return () => { alive = false }
  }, [childId])

  async function save(next: Settings) {
    setS(next); setSaved(false); setBusy(true)
    try {
      const r = await fetch('/api/quests/time/settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, ...next }),
      })
      if (r.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    } catch { /* non blocking, the next change tries again */ }
    setBusy(false)
  }

  if (!s) return null
  const bedtimeOff = s.bedtimeStart !== null && s.bedtimeStart === s.bedtimeEnd

  return (
    <details style={{ marginBottom: '11px', background: 'var(--cream)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '9px 12px' }}>
      <summary style={{ cursor: 'pointer', listStyle: 'none', fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink)' }}>
        Their time, three kinds{' '}
        <span style={{ fontWeight: 700, color: 'var(--terracotta-dark)' }}>
          {s.coreMinutesDaily > 0 ? `${s.coreMinutesDaily}m free` : 'Earned only'}
          {!bedtimeOff && s.bedtimeStart ? ` · screens rest ${s.bedtimeStart}` : ''} ›
        </span>
      </summary>
      <div style={{ marginTop: '9px' }}>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 9px' }}>
          Free time is always theirs, no stars needed, so the screen never becomes the prize.
          Earned time comes from stars on top. Protected time cannot be bought at all, though a
          start inside it still comes to you as an ask, your call every time.
        </p>

        {/* Free time each day */}
        {/* ── THE AGE GUIDE, BESIDE THE CHOICE ────────────────────────────
            Justin, 16 September 2026, asked that these options relate to the
            recommendation. They are deliberately NOT the same number: free
            time is the unconditional floor, and the guide is the healthy
            TOTAL for the age including everything earned on top. Setting the
            floor to the whole guide would delete the earning, which is the
            one mechanic nobody else has.
            So the guide sits beside the choice as context rather than as a
            cap, which is what a parent choosing blind actually needed. */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '6px' }}>
          FREE TIME EACH DAY
        </div>
        {s.guideDailyMinutes ? (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 6px' }}>
            The healthy guide at this age is about {s.guideDailyMinutes >= 60
              ? `${Math.round(s.guideDailyMinutes / 60 * 10) / 10} hours`
              : `${s.guideDailyMinutes} minutes`} a day in total. Free time is the part that is always theirs; the rest is earned on top.
          </p>
        ) : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '11px' }}>
          {CORE_PRESETS.map(m => (
            <button key={m} disabled={busy} onClick={() => save({ ...s, coreMinutesDaily: m })}
              aria-pressed={s.coreMinutesDaily === m} style={{
                flex: '1 1 3em', padding: '8px 4px', borderRadius: '11px', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700,
                background: s.coreMinutesDaily === m ? 'var(--terracotta-lt)' : '#fff',
                color: s.coreMinutesDaily === m ? 'var(--terracotta-dark)' : 'var(--ink-muted)',
                border: s.coreMinutesDaily === m ? '2px solid var(--terracotta)' : 'var(--edge)',
              }}>{m === 0 ? 'Off' : `${m}m`}</button>
          ))}
        </div>

        {/* What one star buys */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '6px' }}>
          ONE STAR BUYS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '11px' }}>
          {RATE_PRESETS.map(m => (
            <button key={m} disabled={busy} onClick={() => save({ ...s, starMinutes: m })}
              aria-pressed={s.starMinutes === m} style={{
                flex: '1 1 3em', padding: '8px 4px', borderRadius: '11px', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700,
                background: s.starMinutes === m ? 'var(--terracotta-lt)' : '#fff',
                color: s.starMinutes === m ? 'var(--terracotta-dark)' : 'var(--ink-muted)',
                border: s.starMinutes === m ? '2px solid var(--terracotta)' : 'var(--edge)',
              }}>{m} min</button>
          ))}
        </div>

        {/* The bedtime window */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '6px' }}>
          SCREENS REST FOR THE NIGHT
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 6px' }}>
          An hour before bed, not at bed. The light and the last scroll are what
          make it hard to drop off, so the hour before is the one that counts.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
          {/* ── COMMITS ON BLUR, NEVER ON EVERY CHANGE ──────────────────────
              Justin's own account, 16 September 2026: bedtime_start saved as
              09:57, which is the minute he was looking at this screen, leaving
              a 13 to 15 year old with screens "resting" for 21 hours a day.
              He had not typed a bedtime. He had tapped the field.
              On iOS the time picker opens at the CURRENT time and every scroll
              fires a change, so an onChange save writes now the instant the
              field is touched. There is no undo on a screen like this, and the
              damage is silent: nobody reads a bedtime window until a child
              complains they cannot start anything.
              So the value is held locally while the picker is open and written
              once, when the field is let go. */}
          <input type="time" value={bedtimeOff ? '' : (draftStart ?? s.bedtimeStart ?? '')} disabled={busy}
            onChange={e => setDraftStart(e.target.value)}
            onBlur={() => {
              const v = draftStart
              setDraftStart(null)
              if (v && v !== s.bedtimeStart) save({ ...s, bedtimeStart: v, bedtimeEnd: bedtimeOff || !s.bedtimeEnd ? '07:00' : s.bedtimeEnd })
            }}
            style={{ flex: '1 1 0', minWidth: 0, padding: '7px 9px', borderRadius: '11px', border: 'var(--edge)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', background: '#fff' }} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', fontWeight: 600 }}>to</span>
          <input type="time" value={bedtimeOff ? '' : (draftEnd ?? s.bedtimeEnd ?? '')} disabled={busy}
            onChange={e => setDraftEnd(e.target.value)}
            onBlur={() => {
              const v = draftEnd
              setDraftEnd(null)
              if (v && v !== s.bedtimeEnd) save({ ...s, bedtimeEnd: v })
            }}
            style={{ flex: '1 1 0', minWidth: 0, padding: '7px 9px', borderRadius: '11px', border: 'var(--edge)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', background: '#fff' }} />
        </div>
        {/* Screens rest an hour BEFORE bed, which is what the guidance says
            and what DiGi's weekly plan has always told this parent. The button
            puts the age window back in one tap, so a mis-set field is a
            moment's fix rather than a thing to work out. */}
        {s.guideBedtime && !bedtimeOff
          && (s.bedtimeStart !== s.guideBedtime.start || s.bedtimeEnd !== s.guideBedtime.end) ? (
          <button disabled={busy}
            onClick={() => save({ ...s, bedtimeStart: s.guideBedtime!.start, bedtimeEnd: s.guideBedtime!.end })}
            style={{ padding: '6px 11px', borderRadius: '11px', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 700, background: '#fff', color: 'var(--ink)', border: 'var(--edge)', marginBottom: '7px', marginRight: '6px' }}>
            Use {s.guideBedtime.start} for their age
          </button>
        ) : null}
        <button disabled={busy}
          onClick={() => save(bedtimeOff
            ? { ...s, bedtimeStart: s.guideBedtime?.start ?? '19:00', bedtimeEnd: s.guideBedtime?.end ?? '07:00' }
            : { ...s, bedtimeStart: '00:00', bedtimeEnd: '00:00' })}
          style={{ padding: '6px 11px', borderRadius: '11px', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 700, background: '#fff', color: 'var(--ink-muted)', border: 'var(--edge)', marginBottom: '11px' }}>
          {bedtimeOff ? 'Turn the bedtime window on' : 'No bedtime window'}
        </button>

        {/* Mealtimes and school hours */}
        {([
          { key: 'protectMealtimes' as const, label: 'Screens rest at mealtimes', hint: 'Breakfast, lunch and tea windows.' },
          { key: 'protectSchoolHours' as const, label: 'Screens rest in school hours', hint: 'Weekdays in term time, 08:45 to 15:15.' },
        ]).map(t => (
          <button key={t.key} disabled={busy} onClick={() => save({ ...s, [t.key]: !s[t.key] })}
            aria-pressed={s[t.key]} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '8px 11px', borderRadius: '11px', cursor: 'pointer', marginBottom: '6px',
              background: s[t.key] ? 'var(--terracotta-lt)' : '#fff',
              border: s[t.key] ? '2px solid var(--terracotta)' : 'var(--edge)',
            }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{t.label}{s[t.key] ? ' ✓' : ''}</span>
            <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4 }}>{t.hint}</span>
          </button>
        ))}

        {saved && (
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--terracotta-dark)', margin: '7px 0 0' }}>
            Saved for {childName} ✓
          </p>
        )}
      </div>
    </details>
  )
}
