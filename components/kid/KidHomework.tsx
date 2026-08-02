'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { playKidSound } from '@/lib/sound/kidSounds'

// The homework screen: a note in term time, what is coming up in the holidays.
//
// Both faces complete the same step, and both complete by the child doing
// something real rather than claiming something. In term time that is writing
// the homework down; in the holidays it is reading the summary. Neither is sent
// to a grown up to approve. Homework is between a child and their school, and an
// approval gate here would turn one more part of their day into an inspection.

type Coming = { label: string; subjects: { subject: string; objectives: string[] }[] }

const SUBJECT_LABEL: Record<string, string> = {
  maths: 'Maths',
  english: 'English',
  reading: 'Reading',
  science: 'Science',
  writing: 'Writing',
}

export default function KidHomework({
  token, childName, note, holidayTitle, coming,
}: {
  token: string
  childName?: string
  note: string
  /** The holiday they are on, when they are. Null in term time. */
  holidayTitle: string | null
  /** Next term's objectives. Null when we cannot place the child. */
  coming: Coming | null
}) {
  const router = useRouter()
  const [text, setText] = useState(note)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // The holiday face only wins when there is something real to show. A holiday
  // with no objectives we can place falls back to the note, because an empty
  // "here is what is coming" screen is worse than the plain version.
  const showComing = holidayTitle !== null && coming !== null

  async function save(body: string) {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/kid/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, note: body }),
      })
      const d = await res.json().catch(() => null)
      if (!res.ok || !d?.ok) {
        setError('That did not save. Have another go.')
        setBusy(false)
        return
      }
      playKidSound('star')
      // Back to the list, where the row is now ticked. Refreshed rather than
      // pushed so the five a day re-reads the day instead of showing a cached
      // one with the step still open.
      router.push(`/k/${token}`)
      router.refresh()
    } catch {
      setError('That did not save. Have another go.')
      setBusy(false)
    }
  }

  const CARD: React.CSSProperties = {
    background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 22,
    padding: '16px 18px', marginBottom: 14, boxShadow: '0 5px 0 rgba(26,26,46,0.08)',
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)', padding: '22px 16px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Link href={`/k/${token}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', textDecoration: 'none', marginBottom: 16 }}>
          ← Back
        </Link>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 7vw, 2.1rem)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 6px', color: 'var(--ink)' }}>
          {showComing ? 'What is coming up' : 'Your homework'}
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 18px' }}>
          {showComing
            ? `It is ${holidayTitle}, so there is no homework. Here is a quick look at what you will be doing when you go back. Nothing to do now.`
            : 'Write down what you have been set, so it is all in one place and you can see it later.'}
        </p>

        {showComing && coming ? (
          <>
            <section style={CARD}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 10 }}>
                {coming.label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {coming.subjects.map(s => (
                  <div key={s.subject}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 5px' }}>
                      {SUBJECT_LABEL[s.subject] ?? s.subject}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {s.objectives.map((o, i) => (
                        <li key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>{o}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
              You do not have to know any of this yet. That is what next term is for.
            </p>
            <button
              onClick={() => save(`Read what is coming up: ${coming.label}`)}
              disabled={busy}
              style={{
                display: 'flex', justifyContent: 'center', width: '100%', padding: '15px 20px',
                border: 'none', borderRadius: 16, cursor: busy ? 'default' : 'pointer',
                background: 'var(--terracotta)', color: 'var(--ink)',
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
                boxShadow: '0 5px 0 var(--terracotta-dark)', opacity: busy ? 0.6 : 1,
              }}
            >
              {busy ? 'Saving...' : 'Got it, I have read that'}
            </button>
          </>
        ) : (
          <>
            <section style={CARD}>
              <label htmlFor="hw" style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8 }}>
                Today&apos;s homework
              </label>
              <textarea
                id="hw"
                value={text}
                onChange={e => setText(e.target.value)}
                rows={7}
                placeholder={'Maths sheet, questions 1 to 10\nRead two pages\nSpellings for Friday'}
                style={{
                  width: '100%', boxSizing: 'border-box', resize: 'vertical',
                  border: '1.5px solid rgba(26,26,46,0.12)', borderRadius: 14,
                  padding: '12px 13px', background: 'var(--cream)', color: 'var(--ink)',
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', lineHeight: 1.5,
                }}
              />
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '8px 0 0' }}>
                Only you and your grown up can see this. Nobody marks it.
              </p>
            </section>
            {error && (
              <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--danger, #B4453C)', margin: '0 0 12px' }}>
                {error}
              </p>
            )}
            <button
              onClick={() => save(text)}
              disabled={busy || text.trim().length === 0}
              style={{
                display: 'flex', justifyContent: 'center', width: '100%', padding: '15px 20px',
                border: 'none', borderRadius: 16,
                cursor: busy || text.trim().length === 0 ? 'default' : 'pointer',
                background: text.trim().length === 0 ? 'var(--cream)' : 'var(--terracotta)',
                color: text.trim().length === 0 ? 'var(--ink-muted)' : 'var(--ink)',
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
                boxShadow: text.trim().length === 0 ? 'none' : '0 5px 0 var(--terracotta-dark)',
                opacity: busy ? 0.6 : 1,
              }}
            >
              {busy ? 'Saving...' : 'Save it'}
            </button>
            {text.trim().length === 0 && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textAlign: 'center', margin: '10px 0 0' }}>
                {childName ? `Write something first, ${childName}.` : 'Write something first.'}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
