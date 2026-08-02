'use client'
import { useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'

// After a parent has the script, DiGi gently asks if it helped. The answer feeds
// the same signal DiGi already leans on (it will not push a script that failed,
// and leans on ones that worked), and it flags scripts that keep failing so they
// can be rewritten. One tap, never a nag.
//
// And then, only on a yes or a sort of, one more question: WHICH line worked.
//
// That second question is the one worth having and the one we never asked. A
// script page rates the whole page, but the thing that actually varies between
// a moment that lands and one that does not is the individual sentence a parent
// said out loud. DiGi offers three in a rehearsal, the parent takes one, and
// until now nothing recorded which.
//
// It is asked HERE rather than at the end of the rehearsal on purpose. At the
// end of a rehearsal nothing has happened yet: the parent has practised against
// a simulated child, so an answer there is a preference, not evidence. Training
// DiGi on it would teach DiGi which lines sound good to a calm parent at a
// laptop, which is close to the opposite of what we want to know. This prompt
// fires after the real moment with the real child, which is the only point at
// which "it worked" means anything.
//
// It only appears when we have at least two of their own lines to offer back.
// One line is not a choice, and a list of lines they never used is a quiz.

type Worked = 'yes' | 'somewhat' | 'no'

export default function ScriptHelpPrompt({ sortOrder, initialWorked }: { sortOrder: number; initialWorked?: Worked | null }) {
  const [worked, setWorked] = useState<Worked | null>(initialWorked ?? null)
  const [saving, setSaving] = useState(false)
  const [lines, setLines] = useState<string[] | null>(null)
  const [chosen, setChosen] = useState<string | null>(null)

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

    // Their own lines, fetched only once a yes makes the follow up worth
    // asking. A no gets nothing extra: a parent telling us it did not work is
    // already doing us a favour and should not then be asked to pick a winner.
    if (w === 'no') return
    try {
      const res = await fetch(`/api/scripts/lines?sortOrder=${sortOrder}`)
      const d = await res.json()
      setLines(Array.isArray(d.lines) ? d.lines : [])
    } catch { setLines([]) }
  }

  const pickLine = async (line: string) => {
    setChosen(line)
    try {
      await fetch('/api/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: sortOrder, worked_line: line }),
      })
    } catch { /* best effort */ }
  }

  const settled = worked
    ? worked === 'yes' ? 'Brilliant. DiGi will lean on this one for you.'
      : worked === 'somewhat' ? 'Good to know. DiGi will help you tweak it next time.'
      : 'Thanks for saying. DiGi will not push this one, and we will make it better.'
    : null

  const askWhich = settled && worked !== 'no' && !chosen && (lines?.length ?? 0) >= 2

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: 'clamp(20px, 5vw, 24px)', boxShadow: '0 4px 0 rgba(26,26,46,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: settled && !askWhich ? 0 : '14px' }}>
        <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter size={26} mood={worked === 'yes' ? 'happy' : 'idle'} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>DiGi</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
            {chosen ? 'Noted. DiGi will start with that one next time.' : askWhich ? 'Which line worked?' : settled ?? 'Did this help?'}
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
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                boxShadow: '0 3px 0 rgba(26,26,46,0.12)', opacity: saving ? 0.7 : 1,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Their own lines, back in their own words. Full sentences rather than
          truncated chips, because a parent recognises what they said by how it
          reads, and a line cut off at forty characters is a guess. */}
      {askWhich && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 2px' }}>
            You took these out of the rehearsal. Whichever one landed is the one DiGi will offer you first next time.
          </p>
          {lines!.map(line => (
            <button
              key={line}
              onClick={() => pickLine(line)}
              style={{
                textAlign: 'left', padding: '11px 14px', borderRadius: '12px', cursor: 'pointer',
                background: 'var(--cream)', border: '1.5px solid var(--border)', color: 'var(--ink)',
                fontSize: 'var(--text-base)', lineHeight: 1.45,
              }}
            >
              &ldquo;{line}&rdquo;
            </button>
          ))}
          <button
            onClick={() => setLines([])}
            style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', padding: '4px 0' }}
          >
            I said something else
          </button>
        </div>
      )}

      {settled && !askWhich && (
        <button
          onClick={() => { setWorked(null); setChosen(null); setLines(null) }}
          style={{ marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'underline', padding: 0 }}
        >
          Change my answer
        </button>
      )}
    </div>
  )
}
