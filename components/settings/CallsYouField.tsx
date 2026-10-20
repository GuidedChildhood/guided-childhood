'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CALLS_CHOICES, CALLS_MAX } from '@/lib/kid/calls-grown-up'

// "What does Teo call you?" (13 October 2026, migration 376).
//
// Justin chose that the child's app names the grown up "if it is set on the
// account". This is where it is set: one tap on Mum or Dad (or their own word),
// saved there and then, the child's home reads it on the next open ("2 waiting
// for Dad to say yes", "Dad said yes!") and every note the grown up sends says
// it too ("Dad asked", "Dad says well done"). Empty keeps "Mum or Dad".
//
// Its own read and its own save, apart from the form's Save button, so a
// database before migration 376 cannot break saving the name or the birthday:
// the field simply does not draw until the column exists.

const label: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600,
  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px',
}

export default function CallsYouField({ childId, childName }: { childId: string; childName: string }) {
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [value, setValue] = useState('')
  const [other, setOther] = useState(false)
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    let live = true
    supabase.from('children').select('calls_grown_up').eq('id', childId).maybeSingle()
      .then(({ data, error }) => {
        if (!live || error) return
        const v = ((data as { calls_grown_up?: string | null } | null)?.calls_grown_up ?? '').trim()
        setValue(v)
        setOther(v.length > 0 && !(CALLS_CHOICES as readonly string[]).includes(v))
        setReady(true)
      })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId])

  async function save(next: string) {
    const v = next.trim().slice(0, CALLS_MAX)
    setValue(v)
    setState('saving')
    const { error } = await supabase.from('children').update({ calls_grown_up: v || null }).eq('id', childId)
    setState(error ? 'error' : 'saved')
    if (!error) setTimeout(() => setState(s => (s === 'saved' ? 'idle' : s)), 2200)
  }

  if (!ready) return null
  const name = childName && childName !== 'Your child' ? childName : 'your child'
  const chip = (on: boolean): React.CSSProperties => ({
    padding: '8px 14px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
    border: 'var(--edge)', background: on ? 'var(--terracotta)' : '#fff',
    boxShadow: on ? '0 3px 0 var(--ink)' : 'none',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)',
  })

  return (
    <div data-calls-you>
      <span style={label}>What does {name} call you?</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {CALLS_CHOICES.map(c => (
          <button key={c} type="button" onClick={() => { setOther(false); save(value === c ? '' : c) }} style={chip(!other && value === c)}>
            {c}
          </button>
        ))}
        <button type="button" onClick={() => setOther(true)} style={chip(other)}>
          Something else
        </button>
      </div>
      {other && (
        <input
          className="input"
          style={{ marginTop: 10 }}
          value={value}
          maxLength={CALLS_MAX}
          placeholder="Grandma, Papa, Auntie Jo..."
          onChange={e => setValue(e.target.value)}
          onBlur={e => save(e.target.value)}
        />
      )}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginTop: '6px' }}>
        {state === 'saving' ? 'Saving' : state === 'saved' ? 'Saved ✓' : state === 'error' ? 'That did not save. Try again.' : `Their app says this when you say yes or send a note. Leave it empty for "Mum or Dad".`}
      </p>
    </div>
  )
}
