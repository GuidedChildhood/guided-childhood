'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CHALLENGE_OPTIONS, type ChallengeId } from '@/lib/content/stages'

// The monthly wellbeing check in. Once a month we ask how the parent is doing,
// what has got better, and anything new, in the same concern language as the
// starter quiz. This is the mission made real: the parent's own wellbeing
// tracked, not only the child's. Warm, quick, never a form to dread.

const MOODS: { value: number; face: string; label: string }[] = [
  { value: 1, face: '😔', label: 'A real struggle' },
  { value: 2, face: '😕', label: 'Hard going' },
  { value: 3, face: '😐', label: 'Getting by' },
  { value: 4, face: '🙂', label: 'Mostly good' },
  { value: 5, face: '😄', label: 'Really good' },
]

export default function WellbeingCheckin({ firstName }: { firstName: string }) {
  const router = useRouter()
  const [mood, setMood] = useState<number | null>(null)
  const [fixed, setFixed] = useState<ChallengeId[]>([])
  const [newConcerns, setNewConcerns] = useState<ChallengeId[]>([])
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggle = (
    list: ChallengeId[],
    set: (v: ChallengeId[]) => void,
    id: ChallengeId,
  ) => set(list.includes(id) ? list.filter(x => x !== id) : [...list, id])

  async function submit() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/wellbeing/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentMood: mood, fixed, newConcerns, note }),
      })
      if (!res.ok) throw new Error('save failed')
      setDone(true)
    } catch {
      setError('That did not save. Have another go in a moment.')
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div style={{ background: 'var(--deep-teal)', borderRadius: '20px', padding: '36px 28px', textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>💛</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: 10 }}>
          Thank you for checking in
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: 380, margin: '0 auto 22px' }}>
          We have got this month. You are doing the hard part, and you are not doing it alone. See you back here next month.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="btn btn-gold"
          style={{ display: 'inline-flex' }}
        >
          Back to home
        </button>
      </div>
    )
  }

  const chip = (id: ChallengeId, active: boolean, icon: string, label: string, onClick: () => void) => (
    <button
      key={id}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: active ? 'var(--terracotta)' : 'var(--cream)',
        color: active ? '#fff' : 'var(--ink)',
        border: `1.5px solid ${active ? 'var(--terracotta)' : 'var(--border)'}`,
        borderRadius: '100px', padding: '9px 15px', cursor: 'pointer',
        fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
        transition: 'all 0.12s',
      }}
    >
      <span>{icon}</span>{label}
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Mood */}
      <section>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>
          How have you been this month, {firstName}?
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '14px' }}>
          You, not your child. This one is just for you.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {MOODS.map(m => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              style={{
                flex: '1 1 90px', minWidth: 90,
                background: mood === m.value ? 'var(--stage-4)' : 'var(--cream)',
                border: `2px solid ${mood === m.value ? 'var(--terracotta)' : 'var(--border)'}`,
                borderRadius: '16px', padding: '14px 8px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              }}
            >
              <span style={{ fontSize: '26px', lineHeight: 1 }}>{m.face}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.3 }}>
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* What got better */}
      <section>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>
          What has got a little better?
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '14px' }}>
          Tick anything that feels easier than last month. Nothing yet is fine too.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CHALLENGE_OPTIONS.map(o => chip(o.value, fixed.includes(o.value), o.icon, o.label, () => toggle(fixed, setFixed, o.value)))}
        </div>
      </section>

      {/* Anything new */}
      <section>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>
          Anything new come up?
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '14px' }}>
          New worries we should fold into your pathway.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CHALLENGE_OPTIONS.map(o => chip(o.value, newConcerns.includes(o.value), o.icon, o.label, () => toggle(newConcerns, setNewConcerns, o.value)))}
        </div>
      </section>

      {/* Note */}
      <section>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>
          Anything you want to say?
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '14px' }}>
          Optional. A line for yourself, or for DiGi to pick up next time.
        </p>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="This month has been..."
          style={{
            width: '100%', borderRadius: '14px', border: '1.5px solid var(--border)',
            padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: '14px',
            color: 'var(--ink)', resize: 'vertical', background: 'var(--cream)',
          }}
        />
      </section>

      {error && (
        <p style={{ fontSize: '13px', color: 'var(--terracotta-dark)', margin: 0 }}>{error}</p>
      )}

      <button
        onClick={submit}
        disabled={saving || mood === null}
        className="btn btn-gold"
        style={{ display: 'flex', width: '100%', justifyContent: 'center', opacity: mood === null ? 0.55 : 1 }}
      >
        {saving ? 'Saving...' : 'Save this month'}
      </button>
    </div>
  )
}
