'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Sixty second setup: what each child needs on which day. This feeds the
// Evening Reset, DiGi's 7pm tap on the shoulder that wins the morning.

const DAYS: { key: string; label: string }[] = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
]

type Child = { id: string; name: string; kit_schedule: Record<string, string[]> | null }

export default function KitTimetable() {
  const [children, setChildren] = useState<Child[]>([])
  const [active, setActive] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('children').select('id, name, kit_schedule').eq('parent_id', user.id)
        .then(({ data }) => setChildren((data ?? []) as Child[]))
    })
  }, [])

  useEffect(() => {
    const child = children[active]
    if (!child) return
    const next: Record<string, string> = {}
    for (const d of DAYS) next[d.key] = ((child.kit_schedule ?? {})[d.key] ?? []).join(', ')
    setValues(next)
    setSaved(false)
  }, [active, children])

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
      setTimeout(() => setSaved(false), 2500)
    } catch { /* non-blocking */ }
    setSaving(false)
  }

  if (children.length === 0) return null

  return (
    <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        The Evening Reset
      </div>
      <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Who needs what, on which day</h3>
      <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '14px' }}>
        Sixty seconds now, then every evening at 7 DiGi reminds you what tomorrow needs: kit, bags, water bottles, lunches. The morning is won the night before.
      </p>

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
              onChange={e => setValues(v => ({ ...v, [d.key]: e.target.value }))}
              style={{ fontSize: '13.5px', padding: '10px 12px' }}
            />
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving} className="btn btn-gold" style={{ fontSize: '13px', padding: '11px 20px' }}>
        {saved ? 'Saved ✓' : `Save ${children[active]?.name ?? ''}'s week`}
      </button>
    </div>
  )
}
