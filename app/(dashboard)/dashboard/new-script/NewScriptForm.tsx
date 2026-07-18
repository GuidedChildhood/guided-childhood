'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// The founder writes a new script from the dashboard. Core fields are required,
// the deeper three are optional. On save it lands at the end of the shelf and
// we jump to it. Pre-filled from a parent request when one sent us here.

const STAGES: [string, string][] = [
  ['foundation', 'Foundation · 4 to 7'],
  ['builder', 'Builder · 8 to 10'],
  ['explorer', 'Explorer · 11 to 13'],
  ['shaper', 'Shaper · 13 to 15'],
  ['independent', 'Independent · 16+'],
]

const label: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }
const field: React.CSSProperties = { width: '100%', padding: '11px 13px', borderRadius: 12, border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }

export default function NewScriptForm({ prefillSituation }: { prefillSituation?: string }) {
  const router = useRouter()
  const [f, setF] = useState({
    stage_id: 'builder', category: '', title: '', situation: prefillSituation ?? '',
    say_this: '', not_this: '', why_it_works: '', tonight: '',
    if_they_push_back: '', check_back: '', for_your_child: '', is_free: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const save = async () => {
    if (saving) return
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/scripts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? 'Could not save'); return }
      router.push(`/dashboard/scripts/${d.sort_order}`)
    } catch { setError('Could not save, try again.') } finally { setSaving(false) }
  }

  const ta = (k: keyof typeof f, rows = 2) => (
    <textarea value={f[k] as string} onChange={set(k)} rows={rows} style={{ ...field, resize: 'vertical', lineHeight: 1.5 }} />
  )

  return (
    <div>
      <label style={label}>Stage</label>
      <select value={f.stage_id} onChange={set('stage_id')} style={field}>
        {STAGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>

      <label style={label}>Category (e.g. screen-time, social-media)</label>
      <input value={f.category} onChange={set('category')} style={field} placeholder="screen-time" />

      <label style={label}>Title</label>
      <input value={f.title} onChange={set('title')} style={field} placeholder="The morning TV standoff" />

      <label style={label}>Situation</label>
      {ta('situation')}

      <label style={label}>Say this</label>
      {ta('say_this', 3)}

      <label style={label}>Not this</label>
      {ta('not_this', 2)}

      <label style={label}>Why it works</label>
      {ta('why_it_works', 3)}

      <label style={label}>Try tonight</label>
      {ta('tonight', 2)}

      <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0 16px', paddingTop: 16 }}>
        <p style={{ fontSize: 12.5, color: 'var(--ink-muted)', marginBottom: 14 }}>The deeper three (optional).</p>
        <label style={label}>If they push back</label>
        {ta('if_they_push_back', 2)}
        <label style={label}>Check back</label>
        {ta('check_back', 2)}
        <label style={label}>For your child (the note)</label>
        {ta('for_your_child', 2)}
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, cursor: 'pointer', fontSize: 14, color: 'var(--ink)' }}>
        <input type="checkbox" checked={f.is_free} onChange={set('is_free')} /> Free on the free plan
      </label>

      {error && <p style={{ color: 'var(--danger)', fontSize: 13.5, marginBottom: 12 }}>{error}</p>}

      <button onClick={save} disabled={saving} className="btn" style={{ width: '100%', opacity: saving ? 0.7 : 1 }}>
        {saving ? 'Saving…' : 'Add this script'}
      </button>
    </div>
  )
}
