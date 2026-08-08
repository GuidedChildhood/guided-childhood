'use client'

import { useEffect, useState } from 'react'

// Who is here, who pays, and are they coming back.
//
// Justin: "have all stats on insight board, users login patterns of users, non
// paid and any other useful stats we could see on dashboard."
//
// Same rule as the checks panel next to it: say the uncomfortable number
// plainly. A dormant count that is quietly the largest number on the board is
// the single most useful thing here, so it is not buried under the total.

type Stats = {
  total: number
  onboarded: number
  optedOut: number
  founders: number
  states: Record<string, number>
  logins: { day: number; week: number; month: number; older: number; never: number; known: number } | null
  newSignups: { day: number; week: number; month: number }
  asked: { paidWeek: number; paidTotal: number; freeWeek: number; freeTotal: number }
  emails: { last7: number; total: number; topKeys: [string, number][] }
  conversion: number
  truncated: boolean
}

const card: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
  padding: '20px 22px', marginBottom: 22, boxShadow: '0 3px 0 rgba(26,26,46,0.05)',
}

const label: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

function Figure({ n, of, sub }: { n: number; of?: number; sub: string }) {
  const pct = of && of > 0 ? Math.round((n / of) * 100) : null
  return (
    <div style={{ minWidth: 96 }}>
      <div style={{ fontSize: '1.7rem', fontWeight: 900, lineHeight: 1.1 }}>
        {n}
        {pct != null && <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink-muted)', marginLeft: 6 }}>{pct}%</span>}
      </div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.35 }}>{sub}</div>
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: '22px 30px', marginBottom: 18 }}>{children}</div>
}

export default function MembersPanel() {
  const [s, setS] = useState<Stats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/members')
      .then(r => r.ok ? r.json() : Promise.reject(new Error(String(r.status))))
      .then(setS)
      .catch(() => setError('Could not load the member figures.'))
  }, [])

  if (error) return <div style={card}><p style={label}>Members</p><p style={{ color: 'var(--ink-muted)' }}>{error}</p></div>
  if (!s) return <div style={card}><p style={label}>Members</p><p style={{ color: 'var(--ink-muted)' }}>Counting…</p></div>

  const dormant = s.logins ? s.logins.older + s.logins.never : null
  const notPaying = s.total - (s.states.active ?? 0)

  return (
    <div style={card}>
      <p style={label}>Members</p>
      <h2 style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.02em', margin: '2px 0 16px' }}>
        Who is here, and are they coming back
      </h2>

      <Row>
        <Figure n={s.total} sub="registered" />
        <Figure n={s.onboarded} of={s.total} sub="finished onboarding" />
        <Figure n={s.states.active ?? 0} of={s.total} sub="paying" />
        <Figure n={notPaying} of={s.total} sub="not paying" />
        <Figure n={s.founders} sub="founder places used" />
      </Row>

      <p style={{ ...label, marginBottom: 10 }}>Signing in</p>
      {s.logins ? (
        <>
          <Row>
            <Figure n={s.logins.day} of={s.logins.known} sub="today" />
            <Figure n={s.logins.week} of={s.logins.known} sub="this week" />
            <Figure n={s.logins.month} of={s.logins.known} sub="this month" />
            <Figure n={s.logins.older} of={s.logins.known} sub="over a month ago" />
            <Figure n={s.logins.never} of={s.logins.known} sub="never signed back in" />
          </Row>
          {dormant != null && dormant > 0 && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginTop: -6, marginBottom: 18 }}>
              <strong>{dormant}</strong> of {s.logins.known} have not opened it in over a month. That is the number the win back
              emails exist for, and the one worth watching week to week.
            </p>
          )}
        </>
      ) : (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginBottom: 18 }}>
          Sign in dates are unavailable right now, so this section is blank rather than showing zeroes.
          It reads auth.users through the service key.
        </p>
      )}

      <p style={{ ...label, marginBottom: 10 }}>Where everyone sits</p>
      <Row>
        <Figure n={s.states.trialing ?? 0} sub="in trial" />
        <Figure n={s.states.trial_ending ?? 0} sub="trial ending" />
        <Figure n={s.states.lapsed ?? 0} sub="lapsed, free tier" />
        <Figure n={s.states.past_due ?? 0} sub="card failed" />
        <Figure n={s.optedOut} sub="opted out of email" />
      </Row>

      <p style={{ ...label, marginBottom: 10 }}>Asking DiGi</p>
      <Row>
        <Figure n={s.asked.paidWeek} of={s.states.active ?? 0} sub="paying, this week" />
        <Figure n={s.asked.freeWeek} of={notPaying} sub="not paying, this week" />
        <Figure n={s.asked.paidTotal} sub="paying, ever" />
        <Figure n={s.asked.freeTotal} sub="not paying, ever" />
      </Row>

      <p style={{ ...label, marginBottom: 10 }}>New, and email</p>
      <Row>
        <Figure n={s.newSignups.day} sub="joined today" />
        <Figure n={s.newSignups.week} sub="joined this week" />
        <Figure n={s.newSignups.month} sub="joined this month" />
        <Figure n={s.emails.last7} sub="emails sent, 7 days" />
        <Figure n={s.conversion} sub="percent paying" />
      </Row>

      {s.emails.topKeys.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <p style={{ ...label, marginBottom: 8 }}>Most sent this week</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 8px' }}>
            {s.emails.topKeys.map(([key, n]) => (
              <span key={key} style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 10, padding: '4px 9px',
              }}>{key} · {n}</span>
            ))}
          </div>
        </div>
      )}

      {s.truncated && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: 12 }}>
          Sign in figures cover the first 10,000 accounts. Past that they need a database view rather than the auth API.
        </p>
      )}
    </div>
  )
}
