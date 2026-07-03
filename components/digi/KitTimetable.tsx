'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { createClient } from '@/lib/supabase/client'
import DigiCharacter, { type DigiMood } from '@/components/digi/DigiCharacter'

// Sixty second setup with DiGi helping: the star talks you through it and a
// live preview shows exactly what tomorrow evening's 7pm nudge will say,
// updating as you type. This feeds the Evening Reset.

const DAYS: { key: string; label: string }[] = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
]

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export type KitChild = { id: string; name: string; kit_schedule: Record<string, string[]> | null }

export default function KitTimetable({ initialChildren }: { initialChildren?: KitChild[] }) {
  const [children, setChildren] = useState<KitChild[]>(initialChildren ?? [])
  const [active, setActive] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialChildren) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('children').select('id, name, kit_schedule').eq('parent_id', user.id)
        .then(({ data }) => setChildren((data ?? []) as KitChild[]))
    })
  }, [initialChildren])

  useEffect(() => {
    const child = children[active]
    if (!child) return
    const next: Record<string, string> = {}
    for (const d of DAYS) next[d.key] = ((child.kit_schedule ?? {})[d.key] ?? []).join(', ')
    setValues(next)
    setSaved(false)
  }, [active, children])

  const hasAnything = useMemo(() => Object.values(values).some(v => v.trim()), [values])

  // What tomorrow's 7pm push will actually say, live as you type.
  const preview = useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const key = DAY_KEYS[tomorrow.getDay()]
    const child = children[active]
    const items = (values[key] ?? '').split(',').map(s => s.trim()).filter(Boolean)
    const kitLine = items.length > 0 && child ? `${child.name}: ${items.join(', ')}. ` : ''
    return `${kitLine}Bags emptied. Water bottles filled. Lunches sorted.`
  }, [values, children, active])

  const digiMood: DigiMood = saved ? 'happy' : hasAnything ? 'speak' : 'wave'
  const digiLine = saved
    ? 'Saved. I will nudge you at 7 every evening, tomorrow already sorted.'
    : hasAnything
      ? 'Keep going. Watch the preview, that is what your 7pm nudge will say.'
      : 'Tell me who needs what on which day. I will do the remembering from tonight.'

  useEffect(() => {
    if (!bubbleRef.current) return
    gsap.fromTo(bubbleRef.current, { scale: 0.85, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.6)' })
  }, [digiLine])

  useEffect(() => {
    if (!previewRef.current) return
    gsap.fromTo(previewRef.current, { opacity: 0.55 }, { opacity: 1, duration: 0.3 })
  }, [preview])

  const save = async () => {
    const child = children[active]
    if (!child) return
    setSaving(true)
    const kit_schedule: Record<string, string[]> = {}
    for (const d of DAYS) {
      const items = values[d.key]?.split(',').map(s => s.trim()).filter(Boolean) ?? []
      if (items.length > 0) kit_schedule[d.key] = items
    }
    try {
      await fetch('/api/school/kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: child.id, kit_schedule }),
      })
      setChildren(cs => cs.map((c, i) => i === active ? { ...c, kit_schedule } : c))
      setSaved(true)
    } catch { /* non-blocking */ }
    setSaving(false)
  }

  if (children.length === 0) return null

  return (
    <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        The Evening Reset
      </div>
      <h3 style={{ fontSize: '1rem', marginBottom: '14px' }}>Who needs what, on which day</h3>

      {/* DiGi helping, reacting to where you are */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
        <div style={{ flexShrink: 0 }}>
          <DigiCharacter mood={digiMood} size={52} />
        </div>
        <div ref={bubbleRef} style={{
          background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px 16px 16px 4px',
          padding: '11px 14px', boxShadow: '0 6px 20px rgba(26,26,46,0.08)',
        }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>{digiLine}</p>
        </div>
      </div>

      {children.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {children.map((c, i) => (
            <button key={c.id} onClick={() => setActive(i)} style={{
              padding: '7px 14px', borderRadius: '100px', cursor: 'pointer',
              border: `1.5px solid ${i === active ? 'var(--terracotta)' : 'var(--border)'}`,
              background: i === active ? 'var(--terracotta)' : '#fff',
              color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px',
            }}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {DAYS.map(d => (
          <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)', width: '80px', flexShrink: 0 }}>
              {d.label}
            </span>
            <input
              className="input"
              placeholder="Swimming kit, hockey stick"
              value={values[d.key] ?? ''}
              onChange={e => { setSaved(false); setValues(v => ({ ...v, [d.key]: e.target.value })) }}
              style={{ fontSize: '13.5px', padding: '10px 12px' }}
            />
          </div>
        ))}
      </div>

      {/* Live preview: tomorrow's 7pm push, exactly as it will arrive */}
      <div ref={previewRef} style={{
        background: 'var(--deep-teal)', borderRadius: '14px', padding: '12px 14px', marginBottom: '14px',
        display: 'flex', gap: '10px', alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '16px', flexShrink: 0 }}>&#11088;</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '3px' }}>
            Tomorrow, 7pm, your phone
          </div>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
            Tonight, five minutes: tomorrow sorted
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.5 }}>{preview}</div>
        </div>
      </div>

      <button onClick={save} disabled={saving} className="btn btn-gold" style={{ fontSize: '13px', padding: '11px 20px' }}>
        {saved ? 'Saved ✓' : `Save ${children[active]?.name ?? ''}'s week`}
      </button>
    </div>
  )
}
