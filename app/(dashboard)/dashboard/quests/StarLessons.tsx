'use client'

import { useEffect, useState } from 'react'

// Star Lessons: send a real lesson to your child as a mission. They open
// it from their quest link, play the kid version with DiGi, and the quiz
// at the end pays stars into the same star bank as their quests.
//
// The lesson list leads with the ones that fit the chosen child's age, so a
// parent is not scrolling a whole curriculum to find the right one, with a
// quiet option to open up every age when they want to.

type Child = { id: string; name: string; age_band: string | null }
type Lesson = { id: string; module_id: string; title: string; key_stage: string; year_band: string; single_action_outcome: string }
type Mission = { id: string; child_id: string; lesson_id: string; stars: number; status: string; score_correct: number | null; score_total: number | null }

// Age band to the key stages that fit it, and a plain year range for the
// label. Matched on the digit in the lesson's key stage, so KS1 and Key
// Stage 1 both work.
const AGE_META: Record<string, { nums: string[]; range: string }> = {
  '4-7':   { nums: ['1'],      range: 'Reception to Year 2' },
  '8-10':  { nums: ['2'],      range: 'Year 3 to Year 6' },
  '11-13': { nums: ['3'],      range: 'Year 7 to Year 8' },
  '13-15': { nums: ['3', '4'], range: 'Year 9 to Year 10' },
  '16+':   { nums: ['4', '5'], range: 'Year 11 and above' },
}
const ksDigit = (s: string) => (s.match(/\d/)?.[0] ?? '')

export default function StarLessons() {
  const [children, setChildren] = useState<Child[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [childId, setChildId] = useState('')
  const [lessonId, setLessonId] = useState('')
  const [stars, setStars] = useState(3)
  const [showAllAges, setShowAllAges] = useState(false)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
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
    } finally { setLoaded(true) }
  }
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const child = children.find(c => c.id === childId) ?? null
  const ageMeta = child?.age_band ? AGE_META[child.age_band] : undefined
  const ageLessons = ageMeta ? lessons.filter(l => ageMeta.nums.includes(ksDigit(l.key_stage))) : lessons
  const shownLessons = showAllAges || ageLessons.length === 0 ? lessons : ageLessons

  // Keep the selected lesson valid for the current child and filter. When the
  // list changes and the selection falls out of it, land on the first one.
  useEffect(() => {
    if (shownLessons.length === 0) { setLessonId(''); return }
    if (!shownLessons.some(l => l.id === lessonId)) setLessonId(shownLessons[0].id)
  }, [shownLessons, lessonId])

  const send = async () => {
    if (!childId || !lessonId || busy) return
    setBusy(true)
    setSent(false)
    try {
      await fetch('/api/quests/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, lesson_id: lessonId, stars }),
      })
      await load()
      setSent(true)
      setTimeout(() => setSent(false), 2600)
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
  const fieldLabel: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: '7px',
  }
  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '13px 14px', borderRadius: '14px', border: '1.5px solid var(--border)',
    fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, background: '#fff', color: 'var(--ink)',
    appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23999\' stroke-width=\'2\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
  }

  return (
    <section style={{ marginTop: '36px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <span style={{
          width: 40, height: 40, borderRadius: '12px', background: 'var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0,
          boxShadow: '0 3px 0 var(--gold-hover)',
        }}>🎬</span>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
            Star lessons
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--ink)', margin: '2px 0 0' }}>
            Send a lesson as a mission
          </h3>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '22px', padding: 'clamp(20px, 4vw, 26px)' }}>
        <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '22px' }}>
          It lands on their quest link as a big play button. DiGi walks them through it, and the quiz at the end pays the stars straight into their star bank.
        </p>

        {/* Who for + stars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          <div>
            <span style={fieldLabel}>Who for</span>
            <select value={childId} onChange={e => setChildId(e.target.value)} style={selectStyle}>
              {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <span style={fieldLabel}>Stars on offer</span>
            <select value={stars} onChange={e => setStars(Number(e.target.value))} style={selectStyle}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>⭐ {n}</option>)}
            </select>
          </div>
        </div>

        {/* Lesson picker, age aware */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '7px' }}>
            <span style={{ ...fieldLabel, marginBottom: 0 }}>
              {showAllAges || !ageMeta ? 'The lesson' : `Lessons for ${child?.name}`}
              {ageMeta && !showAllAges && (
                <span style={{ color: 'var(--terracotta)', marginLeft: '6px' }}>{ageMeta.range}</span>
              )}
            </span>
            {ageMeta && ageLessons.length > 0 && (
              <button
                onClick={() => setShowAllAges(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--terracotta-dark)', padding: 0 }}
              >
                {showAllAges ? `Just ${child?.name}'s age` : 'See all ages'}
              </button>
            )}
          </div>
          <select value={lessonId} onChange={e => setLessonId(e.target.value)} style={selectStyle}>
            {shownLessons.map(l => <option key={l.id} value={l.id}>{l.key_stage} · {l.title}</option>)}
          </select>
        </div>

        {/* Preview of what will be sent */}
        {selected && (
          <div style={{ background: 'var(--gold-light, var(--terracotta-lt))', border: '1.5px solid var(--gold)', borderRadius: '16px', padding: '16px 18px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--ink)', color: '#fff', padding: '3px 8px', borderRadius: '100px' }}>
                {selected.key_stage}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
                {selected.title}
              </span>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
              After it, {child?.name} will be able to say: &ldquo;{selected.single_action_outcome}&rdquo;
            </p>
          </div>
        )}

        <button
          onClick={send}
          disabled={busy || !lessonId}
          style={{
            width: '100%', padding: '15px 24px', borderRadius: '16px',
            background: sent ? 'var(--tint-sage)' : 'var(--gold)', color: 'var(--ink)', border: 'none',
            boxShadow: sent ? 'none' : '0 5px 0 var(--gold-hover)', cursor: busy || !lessonId ? 'default' : 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
            opacity: busy || !lessonId ? 0.6 : 1, transition: 'background 0.2s',
          }}
        >
          {busy ? 'Sending...' : sent ? `Sent to ${child?.name} ✓` : `Send the lesson to ${child?.name}`}
        </button>

        {/* Sent missions */}
        {missions.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
              Sent so far
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {missions.map(m => (
                <div key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'var(--cream)', border: '1.5px solid var(--border)',
                  borderRadius: '14px', padding: '12px 14px',
                }}>
                  <span style={{
                    flexShrink: 0, width: 8, height: 8, borderRadius: '50%',
                    background: m.status === 'done' ? 'var(--green-dark, var(--terracotta))' : 'var(--gold)',
                  }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)', flex: 1, minWidth: '140px', lineHeight: 1.3 }}>
                    {lessonTitle(m.lesson_id)}
                    <span style={{ fontWeight: 600, color: 'var(--ink-muted)' }}> · {childName(m.child_id)}</span>
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--ink-muted)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {m.status === 'done'
                      ? `${m.score_correct ?? 0}/${m.score_total ?? 0} · ⭐ ${m.stars}`
                      : `Waiting · ⭐ ${m.stars}`}
                  </span>
                  <button
                    onClick={() => remove(m.id)}
                    aria-label="Remove lesson mission"
                    style={{ background: 'none', border: 'none', color: 'var(--ink-light)', cursor: 'pointer', fontSize: '15px', padding: '2px 4px', flexShrink: 0 }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
