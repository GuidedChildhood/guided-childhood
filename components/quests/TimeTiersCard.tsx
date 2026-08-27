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
    <details style={{ marginBottom: '11px', background: 'var(--cream)', borderRadius: '12px', padding: '9px 12px' }}>
      <summary style={{ cursor: 'pointer', listStyle: 'none', fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink)' }}>
        Their time, three kinds{' '}
        <span style={{ fontWeight: 700, color: 'var(--terracotta-dark)' }}>
          {s.coreMinutesDaily > 0 ? `${s.coreMinutesDaily}m free` : 'Earned only'}
          {!bedtimeOff && s.bedtimeStart ? ` · bed ${s.bedtimeStart}` : ''} ›
        </span>
      </summary>
      <div style={{ marginTop: '9px' }}>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 9px' }}>
          Free time is always theirs, no stars needed, so the screen never becomes the prize.
          Earned time comes from stars on top. Protected time cannot be bought at all, though a
          start inside it still comes to you as an ask, your call every time.
        </p>

        {/* Free time each day */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '6px' }}>
          FREE TIME EACH DAY
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '11px' }}>
          {CORE_PRESETS.map(m => (
            <button key={m} disabled={busy} onClick={() => save({ ...s, coreMinutesDaily: m })}
              aria-pressed={s.coreMinutesDaily === m} style={{
                flex: 1, padding: '8px 4px', borderRadius: '11px', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700,
                background: s.coreMinutesDaily === m ? 'var(--terracotta-lt)' : '#fff',
                color: s.coreMinutesDaily === m ? 'var(--terracotta-dark)' : 'var(--ink-muted)',
                border: s.coreMinutesDaily === m ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
              }}>{m === 0 ? 'Off' : `${m}m`}</button>
          ))}
        </div>

        {/* What one star buys */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '6px' }}>
          ONE STAR BUYS
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '11px' }}>
          {RATE_PRESETS.map(m => (
            <button key={m} disabled={busy} onClick={() => save({ ...s, starMinutes: m })}
              aria-pressed={s.starMinutes === m} style={{
                flex: 1, padding: '8px 4px', borderRadius: '11px', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700,
                background: s.starMinutes === m ? 'var(--terracotta-lt)' : '#fff',
                color: s.starMinutes === m ? 'var(--terracotta-dark)' : 'var(--ink-muted)',
                border: s.starMinutes === m ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
              }}>{m} min</button>
          ))}
        </div>

        {/* The bedtime window */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '6px' }}>
          SCREENS REST FOR THE NIGHT
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
          <input type="time" value={bedtimeOff ? '' : (s.bedtimeStart ?? '')} disabled={busy}
            onChange={e => e.target.value && save({ ...s, bedtimeStart: e.target.value, bedtimeEnd: bedtimeOff || !s.bedtimeEnd ? '07:00' : s.bedtimeEnd })}
            style={{ flex: 1, padding: '7px 9px', borderRadius: '11px', border: '1.5px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', background: '#fff' }} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', fontWeight: 600 }}>to</span>
          <input type="time" value={bedtimeOff ? '' : (s.bedtimeEnd ?? '')} disabled={busy}
            onChange={e => e.target.value && save({ ...s, bedtimeEnd: e.target.value })}
            style={{ flex: 1, padding: '7px 9px', borderRadius: '11px', border: '1.5px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', background: '#fff' }} />
        </div>
        <button disabled={busy}
          onClick={() => save(bedtimeOff ? { ...s, bedtimeStart: '19:00', bedtimeEnd: '07:00' } : { ...s, bedtimeStart: '00:00', bedtimeEnd: '00:00' })}
          style={{ padding: '6px 11px', borderRadius: '11px', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 700, background: '#fff', color: 'var(--ink-muted)', border: '1.5px solid var(--border)', marginBottom: '11px' }}>
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
              border: s[t.key] ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
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
