'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { preparePhoto } from '@/lib/school/photo'

// SNAP IT OR PASTE IT.
//
// Justin, 17 September 2026: "Is there a way without having to set up forward?"
//
// Yes, and this is it. No address, no rule, no email provider, nothing to set
// up at all. Point the camera at the letter, or paste the text, and the same
// DiGi extraction that reads forwarded emails reads this instead.
//
// It also reaches what forwarding never can. A large share of primary school
// communication is paper: the letter in the book bag, the note stapled into the
// reading record, the trip slip, the sheet by the door at pickup. No forwarding
// rule in the world catches those, and a parent holding one is the exact moment
// this is useful.
//
// WHY IT SHOWS WHAT IT FOUND BEFORE SAVING, when the email path does not.
// The email path runs while the parent is somewhere else, so it saves and then
// tells them. Here the parent is standing in the kitchen holding the letter,
// which is the one moment they can confirm a date better than we can read it.
// Four reminders written silently off a misread date would be worse than the
// pile of paper it replaced. So: here is what I read, untick anything wrong,
// add the rest.
//
// Each confirmed item is saved through the existing POST /api/school/actions,
// one call per item, because that route already owns validation, the case
// insensitive same day dedupe and the per child ownership check. A second
// writer for school actions is exactly the drift this codebase keeps warning
// about.

type Found = {
  kind: string
  title: string
  detail?: string | null
  due_date?: string | null
}

const KIND_EMOJI: Record<string, string> = {
  kit: '🎒', payment: '💷', homework: '📖', event: '📅', deadline: '⏰', notice: '📌',
}

const cardStyle: React.CSSProperties = {
  background: '#fff', border: 'var(--edge)', boxShadow: 'var(--lift)',
  borderRadius: 'var(--radius-card)', padding: '22px', marginBottom: '20px',
}

const primaryButton: React.CSSProperties = {
  background: 'var(--terracotta)', border: 'var(--edge)', boxShadow: 'var(--lift)',
  borderRadius: 'var(--radius-btn)', padding: '12px 22px', cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 900,
  color: 'var(--ink)',
}

const quietButton: React.CSSProperties = {
  background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-pill)',
  padding: '11px 18px', cursor: 'pointer', fontFamily: 'var(--font-display)',
  fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink-soft)',
}

/** "Fri 19 Sep", or nothing at all when there is no date to show. */
function niceDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function SchoolCatch() {
  const router = useRouter()
  const [mode, setMode] = useState<'idle' | 'paste'>('idle')
  const [pasted, setPasted] = useState('')
  const [reading, setReading] = useState(false)
  const [found, setFound] = useState<Found[] | null>(null)
  const [chosen, setChosen] = useState<Set<number>>(new Set())
  const [saving, setSaving] = useState(false)
  const [savedCount, setSavedCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function reset() {
    setMode('idle'); setPasted(''); setFound(null); setChosen(new Set())
    setSavedCount(null); setError(null)
  }

  async function read(payload: { text?: string; image?: { media_type: string; base64: string } }) {
    setReading(true)
    setError(null)
    setSavedCount(null)
    try {
      const res = await fetch('/api/school/catch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || data.ok === false) {
        setError(data.message ?? 'That could not be read. Try again, or add it by hand.')
        return
      }
      const items = (data.items ?? []) as Found[]
      setFound(items)
      // Everything ticked to start with. The parent is confirming, not
      // assembling: the common case is that it read the letter correctly and
      // one tap finishes the job.
      setChosen(new Set(items.map((_, i) => i)))
    } catch {
      setError('That could not be read. Try again, or add it by hand.')
    } finally {
      setReading(false)
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    // Cleared straight away so picking the same photo twice still fires.
    e.target.value = ''
    if (!file) return
    setReading(true)
    setError(null)
    try {
      const photo = await preparePhoto(file)
      await read({ image: { media_type: photo.mediaType, base64: photo.base64 } })
    } catch (err) {
      setReading(false)
      setError(err instanceof Error ? err.message : 'That picture could not be read.')
    }
  }

  async function saveChosen() {
    if (!found) return
    setSaving(true)
    let saved = 0
    try {
      for (const [i, item] of found.entries()) {
        if (!chosen.has(i)) continue
        const res = await fetch('/api/school/actions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind: item.kind,
            title: item.title,
            detail: item.detail ?? null,
            due_date: item.due_date ?? null,
          }),
        })
        if (res.ok) saved += 1
      }
      setSavedCount(saved)
      setFound(null)
      setMode('idle')
      setPasted('')
      // The reminders live on the page above this one, rendered on the server,
      // so the page has to come back for them to appear. Without this the
      // parent is told it saved and then looks at a list that does not have it.
      if (saved > 0) router.refresh()
    } finally {
      setSaving(false)
    }
  }

  function toggle(i: number) {
    setChosen(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
    })
  }

  // Still selling it: nothing read yet and nothing saved yet.
  const pitching = found === null && savedCount === null

  return (
    <div style={cardStyle}>
      {/* THE PITCH GOES AWAY ONCE IT HAS WORKED.
          On a phone the intro is five lines, and leaving it above the results
          pushed the thing the parent actually has to read and check most of the
          way down the screen. It has done its job by then: nobody needs selling
          a feature they are already mid way through using. */}
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
        margin: '0 0 8px',
      }}>
        {pitching ? 'Nothing to set up' : 'From school'}
      </p>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
        color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.25, margin: '0 0 8px',
      }}>
        {pitching ? 'Snap it and DiGi reads it' : 'What DiGi read'}
      </h2>
      {pitching && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 16px' }}>
          Photograph a letter from the book bag, or pick a screenshot you already took of an email or a ClassDojo message. The kit days, payments and deadlines come out of it as reminders.
        </p>
      )}

      {/* ── THE TWO WAYS IN ───────────────────────────────────────────────── */}
      {!found && savedCount === null && (
        <>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={reading}
              style={{ ...primaryButton, cursor: reading ? 'wait' : 'pointer' }}
            >
              {reading ? 'Reading it...' : '📷  Photo or screenshot'}
            </button>
            <button
              onClick={() => setMode(m => (m === 'paste' ? 'idle' : 'paste'))}
              disabled={reading}
              style={{ ...quietButton, cursor: reading ? 'wait' : 'pointer' }}
            >
              Or paste the text
            </button>
          </div>
          {/* NO capture ATTRIBUTE, AND THAT IS THE WHOLE POINT.
              Justin, 17 September 2026: "take a picture is flawed as it opens a
              camera which is good if a physical letter but it does not let you
              screenshot an email."
              Correct, and the earlier comment here claimed otherwise. capture
              is not a hint on a phone: iOS and Android honour it and go
              straight to the camera, so the photo library never opens and a
              screenshot already sitting in Photos is unreachable. Without it,
              the tap raises the system sheet (Photo Library, Take Photo, Choose
              File) and both routes are one tap away.
              This matters more than a paper letter, because a ClassDojo,
              Arbor or Seesaw message lives inside an app and cannot be
              forwarded to anything. A screenshot is the only way in for those,
              and they are a large share of what a school actually sends. */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            style={{ display: 'none' }}
          />

          {mode === 'paste' && (
            <div style={{ marginTop: '14px' }}>
              <textarea
                value={pasted}
                onChange={e => setPasted(e.target.value)}
                placeholder="Paste the email or type what the letter says."
                rows={5}
                style={{
                  width: '100%', border: 'var(--edge)', borderRadius: 'var(--radius-tile)',
                  padding: '12px', fontFamily: 'inherit', fontSize: 'var(--text-base)',
                  color: 'var(--ink)', background: 'var(--cream)', resize: 'vertical',
                }}
              />
              <button
                onClick={() => read({ text: pasted })}
                disabled={reading || pasted.trim().length < 10}
                style={{
                  ...primaryButton, marginTop: '10px',
                  opacity: pasted.trim().length < 10 ? 0.5 : 1,
                  cursor: reading ? 'wait' : pasted.trim().length < 10 ? 'not-allowed' : 'pointer',
                }}
              >
                {reading ? 'Reading it...' : 'Read this'}
              </button>
            </div>
          )}
        </>
      )}

      {error && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: '12px 0 0', fontWeight: 700 }}>
          {error}
        </p>
      )}

      {/* ── WHAT IT FOUND, BEFORE ANYTHING IS SAVED ───────────────────────── */}
      {found && (
        <div style={{ marginTop: '4px' }}>
          {found.length === 0 ? (
            <>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 12px' }}>
                Nothing in there needed doing, so nothing was added. If that looks wrong, try a clearer picture of the part with the dates on it.
              </p>
              <button onClick={reset} style={quietButton}>Try another</button>
            </>
          ) : (
            <>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 12px', fontWeight: 700 }}>
                Here is what it says. Untick anything that is not right.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
                {found.map((item, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <button
                      onClick={() => toggle(i)}
                      style={{
                        width: '100%', textAlign: 'left', cursor: 'pointer',
                        display: 'flex', gap: '10px', alignItems: 'flex-start',
                        background: chosen.has(i) ? 'var(--terracotta-lt)' : 'var(--cream)',
                        border: 'var(--edge)', borderRadius: 'var(--radius-tile)',
                        padding: '12px 14px',
                        opacity: chosen.has(i) ? 1 : 0.55,
                      }}
                    >
                      <span aria-hidden style={{ fontSize: '18px', lineHeight: 1.2 }}>
                        {KIND_EMOJI[item.kind] ?? '📌'}
                      </span>
                      <span style={{ flex: 1 }}>
                        <span style={{
                          display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
                          fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.3,
                        }}>
                          {item.title}
                        </span>
                        {niceDate(item.due_date) && (
                          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: '2px' }}>
                            {niceDate(item.due_date)}
                          </span>
                        )}
                        {item.detail && (
                          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '2px' }}>
                            {item.detail}
                          </span>
                        )}
                      </span>
                      <span aria-hidden style={{
                        fontFamily: 'var(--font-display)', fontWeight: 900,
                        color: chosen.has(i) ? 'var(--terracotta-dark)' : 'var(--ink-light)',
                        fontSize: '18px', lineHeight: 1.2,
                      }}>
                        {chosen.has(i) ? '✓' : '+'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={saveChosen}
                  disabled={saving || chosen.size === 0}
                  style={{ ...primaryButton, opacity: chosen.size === 0 ? 0.5 : 1, cursor: saving ? 'wait' : chosen.size === 0 ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Adding...' : chosen.size === 1 ? 'Add this reminder' : `Add these ${chosen.size}`}
                </button>
                <button onClick={reset} disabled={saving} style={quietButton}>Cancel</button>
              </div>
            </>
          )}
        </div>
      )}

      {savedCount !== null && savedCount > 0 && (
        <div style={{
          background: 'var(--tint-sage)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)',
          padding: '14px 16px', marginTop: '4px',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: '2px' }}>
            {savedCount === 1 ? 'Added. It is in your week.' : `Added all ${savedCount}. They are in your week.`}
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 10px' }}>
            You will get a reminder the night before and again in the morning.
          </p>
          <button onClick={reset} style={quietButton}>Do another</button>
        </div>
      )}
    </div>
  )
}
