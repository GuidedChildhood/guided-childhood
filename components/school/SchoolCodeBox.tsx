'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// "DOES YOUR SCHOOL PAY FOR GUIDED CHILDHOOD?" (Justin, 27 November 2026).
//
// The school pass is only for families whose school pays. Most of them come in
// through the school's link and are recorded at sign up. This is for a parent
// who came through the front door instead: they type the code from the
// school's letter. The sign up form is unchanged, so a family with no school
// never meets a question about one; they see this small box only on Settings
// and on the upgrade page, where it is the answer to "why is this locked?".
//
// Once linked it shows the school's name and whether family access is on, and
// never offers a second school (the account keeps the first, as the link does).

type Mine = { linked: string | null; pass: boolean }

export default function SchoolCodeBox({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const [mine, setMine] = useState<Mine | null>(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    fetch('/api/school-link/mine').then(r => (r.ok ? r.json() : null)).then(d => {
      if (live && d && 'linked' in d) setMine({ linked: d.linked ?? null, pass: Boolean(d.pass) })
    }).catch(() => { /* the box simply does not show */ })
    return () => { live = false }
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (code.trim().length < 3 || busy) return
    setBusy(true); setErr(null)
    try {
      const res = await fetch('/api/school-link/mine', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }),
      })
      const d = await res.json().catch(() => ({}))
      if (res.ok || res.status === 409) {
        setMine({ linked: d.linked ?? null, pass: Boolean(d.pass) })
        if (res.status === 409) setErr(d.error ?? null)
        else router.refresh()
      } else setErr(d.error ?? 'That did not save. Try again in a moment.')
    } catch { setErr('That did not save. Try again in a moment.') } finally { setBusy(false) }
  }

  if (!mine) return null

  const card: React.CSSProperties = {
    background: 'var(--tint-butter)', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
    padding: compact ? '14px 16px' : '18px 18px', margin: '0 0 20px',
  }

  if (mine.linked) {
    return (
      <div style={card} data-school-code>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: 0 }}>
          Through {mine.linked}
        </p>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '4px 0 0' }}>
          {mine.pass
            ? 'Your school pays for family access: lessons, homework help, the star chart and the school calendar are yours free, with ten scripts and ten DiGi chats.'
            : 'Your school has not switched on family access yet. Everything works as normal in the meantime.'}
        </p>
        {err && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', margin: '6px 0 0' }}>{err}</p>}
      </div>
    )
  }

  return (
    <form onSubmit={save} style={card} data-school-code>
      <label htmlFor="school-code" style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
        Does your school pay for Guided Childhood?
      </label>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '4px 0 10px' }}>
        Type the code from the school&rsquo;s letter, or paste its link. If your school pays, lessons, homework help and the star chart are free for your family.
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          id="school-code"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="st-marys-primary"
          autoComplete="off"
          style={{
            flex: '1 1 200px', minHeight: 48, padding: '10px 14px', border: 'var(--edge)', borderRadius: 'var(--radius-tile)',
            fontSize: 'var(--text-md)', fontFamily: 'var(--font-body)', background: 'var(--white)', color: 'var(--ink)',
          }}
        />
        <button type="submit" disabled={busy || code.trim().length < 3} style={{
          minHeight: 48, padding: '0 20px', background: 'var(--terracotta)', border: 'var(--edge)', boxShadow: 'var(--lift)',
          borderRadius: 'var(--radius-btn)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
          color: 'var(--ink)', cursor: busy ? 'wait' : 'pointer', opacity: code.trim().length < 3 ? 0.6 : 1,
        }}>
          {busy ? 'Checking' : 'Add my school'}
        </button>
      </div>
      {err && <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)', margin: '8px 0 0' }}>{err}</p>}
    </form>
  )
}
