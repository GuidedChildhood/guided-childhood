'use client'

import { assessJobLoad, jobMinutes, type JobLite } from '@/lib/quests/job-load'
import DigiCharacter from '@/components/digi/DigiCharacter'

// DiGi's read on today's job load: a calm, science grounded check that the day
// is balanced and not a swamp of chores. Responsibility helps a child, in the
// right dose, so this names the sweet spot for their age, shows the real time
// today's jobs ask, and when the day is heavy suggests spreading some across the
// week. Presentational: it takes the jobs due today and the age band.

const TONE: Record<string, { bg: string; border: string; fg: string; label: string }> = {
  light:   { bg: '#EAF3EC', border: '#CFE6D6', fg: '#2F8F6B', label: 'Light' },
  healthy: { bg: '#EAF3EC', border: '#CFE6D6', fg: '#2F8F6B', label: 'Balanced' },
  busy:    { bg: '#FBEEDF', border: '#F1D9BE', fg: '#B7793A', label: 'Busy' },
  over:    { bg: '#F7E3D6', border: '#E8C8B4', fg: '#C0603A', label: 'A lot' },
}

export default function JobBalance({
  childName, ageBand, jobsDueToday, onReview,
}: {
  childName: string
  ageBand: string | null
  jobsDueToday: JobLite[]
  onReview?: () => void
}) {
  const name = childName && childName !== 'Your child' ? childName : 'your child'
  const a = assessJobLoad(ageBand, jobsDueToday)
  const t = TONE[a.status]
  const hrs = Math.floor(a.totalMins / 60)
  const mins = a.totalMins % 60
  const timeStr = hrs > 0 ? (mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`) : `${a.totalMins}m`

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20,
      boxShadow: '0 4px 22px rgba(26,26,46,0.06)', padding: 18, marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ width: 34, height: 34, flexShrink: 0, borderRadius: '50%', background: '#FFF7E8', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 2px 0 rgba(26,26,46,0.10)' }}>
          <DigiCharacter size={22} mood="idle" once />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            Today&apos;s balance
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.2 }}>
            {a.headline}
          </div>
        </div>
        <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: t.fg, background: t.bg, border: `1px solid ${t.border}`, padding: '5px 10px', borderRadius: 100 }}>
          {t.label}
        </span>
      </div>

      {/* The count and time today against the sweet spot for their age. */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-soft)', background: 'var(--cream)', borderRadius: 100, padding: '6px 11px' }}>
          {a.count} job{a.count === 1 ? '' : 's'} · about {timeStr} today
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-muted)', background: 'var(--cream)', borderRadius: 100, padding: '6px 11px' }}>
          Sweet spot for {a.bandLabel}: up to {a.maxJobs} a day
        </span>
      </div>

      <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
        {a.advice.replace('they', name === 'your child' ? 'they' : name)}
      </p>

      {/* The real time each job asks, so the day is never longer than it looks.
          Only when there are jobs, capped so the card stays calm. */}
      {a.count > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginBottom: a.suggestSpread ? 12 : 0 }}>
          {jobsDueToday.slice(0, 8).map((j, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, padding: '3px 0' }}>
              <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.title}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', flexShrink: 0 }}>~{jobMinutes(j)}m</span>
            </div>
          ))}
          {jobsDueToday.length > 8 && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-muted)', fontWeight: 700, marginTop: 3 }}>
              and {jobsDueToday.length - 8} more
            </div>
          )}
        </div>
      )}

      {/* When the day is heavy, the one move that keeps the good and drops the
          swamp: spread some jobs across the week. */}
      {a.suggestSpread && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 14, padding: '11px 13px' }}>
          <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.45 }}>
            <b style={{ fontWeight: 800 }}>Spread it across the week.</b> Move a couple to set days so no single day feels like a lot.
          </span>
          {onReview && (
            <button
              onClick={onReview}
              style={{ flexShrink: 0, background: '#fff', border: '1.5px solid var(--border)', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12.5, color: 'var(--ink)' }}
            >
              Review jobs
            </button>
          )}
        </div>
      )}
    </div>
  )
}
