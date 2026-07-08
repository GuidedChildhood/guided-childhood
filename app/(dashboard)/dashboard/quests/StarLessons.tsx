'use client'

import { useEffect, useState } from 'react'

// Star Lessons: send a real lesson to your child as a mission. They open
// it from their quest link, play the kid version with DiGi, and the quiz
// at the end pays stars into the same star bank as their quests.

type Child = { id: string; name: string }
type Lesson = { id: string; module_id: string; title: string; key_stage: string; year_band: string; single_action_outcome: string }
type Mission = { id: string; child_id: string; lesson_id: string; stars: number; status: string; score_correct: number | null; score_total: number | null }

const card: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '20px 22px',
}
const label: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px', color: 'var(--ink)',
}
const input: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid var(--border)',
  fontFamily: 'var(--font-body)', fontSize: '14px', background: '#fff', color: 'var(--ink)', marginTop: '5px',
}

export default function StarLessons() {
  const [children, setChildren] = useState<Child[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [childId, setChildId] = useState('')
  const [lessonId, setLessonId] = useState('')
  const [stars, setStars] = useState(3)
  const [busy, setBusy] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const load = async () => {
    try {
      const res = await fetch('/api/quests/lessons')
      if (!res.ok) return
      const data = await res.json()
      setChildren(data.children ?? [])
      setLessons(data.lessons ?? [])
      setMissions(data.missions ?? [])
      if (!childId && data.children?.[0]) setChildId(data.children[0].id)
      if (!lessonId && data.lessons?.[0]) setLessonId(data.lessons[0].id)
    } finally { setLoaded(true) }
  }
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const send = async () => {
    if (!childId || !lessonId || busy) return
    setBusy(true)
    try {
      await fetch('/api/quests/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, lesson_id: lessonId, stars }),
      })
      await load()
    } finally { setBusy(false) }
  }

  const remove = async (id: string) => {
    setMissions(prev => prev.filter(m => m.id !== id))
    try {
      await fetch('/api/quests/lessons', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    } catch { load() }
  }

  if (!loaded || children.length === 0) return null
  const lessonTitle = (id: string) => lessons.find(l => l.id === id)?.title ?? 'Lesson'
  const childName = (id: string) => children.find(c => c.id === id)?.name ?? ''
  const selected = lessons.find(l => l.id === lessonId)

  return (
    <section style={{ marginTop: '32px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>
        Star lessons
      </div>
      <div style={card}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '16px' }}>
          Send a real lesson as a mission. It appears on their quest link as a big Play button,
          DiGi walks them through it, and the quiz at the end pays the stars straight into their star bank.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <label style={label}>
            Who for
            <select value={childId} onChange={e => setChildId(e.target.value)} style={input}>
              {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label style={label}>
            Stars on offer
            <select value={stars} onChange={e => setStars(Number(e.target.value))} style={input}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>⭐ {n}</option>)}
            </select>
          </label>
        </div>
        <label style={label}>
          The lesson
          <select value={lessonId} onChange={e => setLessonId(e.target.value)} style={input}>
            {lessons.map(l => <option key={l.id} value={l.id}>{l.key_stage} · {l.title}</option>)}
          </select>
        </label>
        {selected && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-muted)', lineHeight: 1.55, margin: '8px 0 0' }}>
            They will be able to say: &ldquo;{selected.single_action_outcome}&rdquo;
          </p>
        )}
        <button
          onClick={send}
          disabled={busy}
          style={{
            marginTop: '14px', padding: '12px 24px', borderRadius: '16px',
            background: 'var(--gold)', color: 'var(--ink)', border: 'none',
            boxShadow: '0 5px 0 var(--gold-hover)', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? 'Sending...' : 'Send the lesson'}
        </button>

        {missions.length > 0 && (
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {missions.map(m => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
                background: 'var(--cream)', border: '1.5px solid var(--border)',
                borderRadius: '14px', padding: '10px 14px',
              }}>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px', color: 'var(--ink)', flex: 1, minWidth: '160px' }}>
                  {lessonTitle(m.lesson_id)}
                  <span style={{ fontWeight: 600, color: 'var(--ink-muted)' }}> · {childName(m.child_id)}</span>
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 600, color: m.status === 'done' ? 'var(--green-dark)' : 'var(--ink-muted)' }}>
                  {m.status === 'done'
                    ? `Done · ${m.score_correct ?? 0} of ${m.score_total ?? 0} right · ⭐ ${m.stars} earned`
                    : `Waiting to play · ⭐ ${m.stars}`}
                </span>
                <button
                  onClick={() => remove(m.id)}
                  aria-label="Remove lesson mission"
                  style={{ background: 'none', border: 'none', color: 'var(--ink-light)', cursor: 'pointer', fontSize: '15px', padding: '2px 4px' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
