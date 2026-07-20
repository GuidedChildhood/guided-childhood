'use client'
import { useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'

// After a parent has the script, DiGi gently asks if it helped. The answer feeds
// the same signal DiGi already leans on (it will not push a script that failed,
// and leans on ones that worked), and it flags scripts that keep failing so they
// can be rewritten. One tap, never a nag.

type Worked = 'yes' | 'somewhat' | 'no'

export default function ScriptHelpPrompt({ sortOrder, initialWorked }: { sortOrder: number; initialWorked?: Worked | null }) {
  const [worked, setWorked] = useState<Worked | null>(initialWorked ?? null)
  const [saving, setSaving] = useState(false)

  const rate = async (w: Worked) => {
    if (saving) return
    setSaving(true)
    setWorked(w)
    try {
      await fetch('/api/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: sortOrder, worked: w }),
      })
    } catch { /* best effort */ } finally { setSaving(false) }
  }

  const settled = worked
    ? worked === 'yes' ? 'Brilliant. DiGi will lean on this one for you.'
      : worked === 'somewhat' ? 'Good to know. DiGi will help you tweak it next time.'
      : 'Thanks for saying. DiGi will not push this one, and we will make it better.'
    : null

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: 'clamp(20px, 5vw, 24px)', boxShadow: '0 4px 0 rgba(26,26,46,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: settled ? 0 : '14px' }}>
        <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter size={26} mood={worked === 'yes' ? 'happy' : 'idle'} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>DiGi</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.3 }}>
            {settled ?? 'Did this help?'}
          </div>
        </div>
      </div>
      {!settled && (
        <div style={{ display: 'flex', gap: '8px' }}>
          {([['yes', '👍 It helped'], ['somewhat', '🤏 Sort of'], ['no', '👎 Not really']] as [Worked, string][]).map(([w, label]) => (
            <button
              key={w}
              onClick={() => rate(w)}
              disabled={saving}
              style={{
                flex: 1, padding: '11px 6px', borderRadius: '12px', cursor: saving ? 'default' : 'pointer',
                background: 'var(--cream)', border: '1.5px solid var(--border)', color: 'var(--ink)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
                boxShadow: '0 3px 0 rgba(26,26,46,0.12)', opacity: saving ? 0.7 : 1,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {settled && (
        <button
          onClick={() => setWorked(null)}
          style={{ marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'underline', padding: 0 }}
        >
          Change my answer
        </button>
      )}
    </div>
  )
}
