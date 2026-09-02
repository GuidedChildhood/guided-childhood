'use client'

import { useState } from 'react'
import type { KidTheme } from '@/lib/kid/theme'
import type { Home, HomeAsk, MissionState, Tier } from '@/lib/planet/logic'
import { MISSION_LINES, missionByKey, type Mission } from '@/lib/planet/missions'
import { CloseCross } from '@/components/kid/HappyNewsBits'

// The MissionBoard (design section 3.2): the real world missions, as cards.
// One at a time at Tier 1, three at Tier 2. Every card names its reward
// before the child starts. The proof is decided by the server: this board
// only reports what the child says and shows what came back.

export type ClaimResult = 'asked' | 'landed' | 'not_yet' | 'not_quite' | 'lesson_first' | null

export default function MissionBoard({ home, board, tier, ask, nowMs, token, theme, leadName, busy, onStart, onClaim, onSeen, onClose }: {
  home: Home
  board: string[]
  tier: Tier
  ask: HomeAsk | null
  nowMs: number
  token: string | null
  theme: KidTheme
  leadName: string
  busy: boolean
  onStart: (key: string) => void
  onClaim: (key: string, code?: string[]) => Promise<ClaimResult>
  onSeen: (key: string) => void
  onClose: () => void
}) {
  const [codes, setCodes] = useState<Record<string, string[]>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})

  const chunky = (fill: 'accent' | 'white', disabled = false): React.CSSProperties => ({
    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', lineHeight: 1.15,
    padding: '12px 16px', borderRadius: 16, cursor: disabled ? 'default' : 'pointer', textDecoration: 'none',
    background: fill === 'accent' ? theme.hex : '#fff', color: fill === 'accent' ? theme.onAccent : 'var(--ink)',
    border: '2px solid var(--ink)', boxShadow: disabled ? 'none' : '0 4px 0 var(--ink)', opacity: disabled ? 0.55 : 1,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  })

  async function claim(m: Mission) {
    const result = await onClaim(m.key, m.proof === 'code' ? codes[m.key] ?? [] : undefined)
    const line =
      result === 'not_yet' ? MISSION_LINES.notYetTimer :
      result === 'not_quite' ? MISSION_LINES.notQuite :
      result === 'lesson_first' ? MISSION_LINES.notYetLesson : ''
    setNotes(n => ({ ...n, [m.key]: line }))
    if (result === 'not_quite') setCodes(c => ({ ...c, [m.key]: [] }))
  }

  function card(key: string) {
    const m = missionByKey(key)
    if (!m) return null
    const st: MissionState | undefined = home.missions.find(x => x.key === key)
    const status = st?.status ?? 'board'
    const timerTotal = (m.timerMinutes ?? 0) * 60000
    const timerLeft = st?.timerEndsAt ? Math.max(0, new Date(st.timerEndsAt).getTime() - nowMs) : 0
    const timerFraction = timerTotal > 0 && st?.timerEndsAt ? Math.max(0, Math.min(1, 1 - timerLeft / timerTotal)) : 0
    const timerDone = st?.status === 'doing' && m.proof === 'timer' && timerLeft <= 0
    // The phone's clock can sit a second behind the server's stamp, so the
    // count never reads more than the mission's own minutes.
    const minutesLeft = Math.min(m.timerMinutes ?? 0, Math.ceil(timerLeft / 60000))
    const askPending = ask?.kind === 'mission' && ask.missionKey === key && ask.status === 'pending'
    const note = notes[key]
    const typed = codes[key] ?? []

    return (
      <div key={key} style={{ background: '#fff', color: 'var(--ink)', border: '2px solid var(--ink)', borderRadius: 18, boxShadow: '0 5px 0 var(--ink)', padding: '14px 14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span aria-hidden style={{ fontSize: 34, lineHeight: 1 }}>{m.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', lineHeight: 1.15 }}>{m.title}</p>
            <p style={{ margin: '3px 0 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              {m.together === 'required' ? MISSION_LINES.withGrownup : MISSION_LINES.grownupInvited}
            </p>
          </div>
        </div>
        <div>
          <span style={{ display: 'inline-block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', background: 'var(--terracotta-lt)', border: '1.5px solid var(--ink)', borderRadius: 999, padding: '4px 10px' }}>
            {MISSION_LINES.rewardPrefix} {m.rewardLabel}
          </span>
        </div>

        {status === 'approved' ? (
          <div style={{ background: 'var(--retro-green)', color: '#fff', border: '2px solid var(--ink)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <p style={{ margin: 0, flex: 1, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', lineHeight: 1.2 }}>{m.rewardLabel}. {MISSION_LINES.landed}</p>
            <button onClick={() => onSeen(key)} style={{ ...chunky('white'), padding: '8px 12px' }}>Yay!</button>
          </div>
        ) : (
          <>
            <ol style={{ margin: 0, paddingLeft: 22, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', lineHeight: 1.35, color: 'var(--ink-soft)' }}>
              {m.steps.map(step => <li key={step}>{step}</li>)}
            </ol>

            {status === 'doing' && m.proof === 'timer' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <svg viewBox="0 0 60 60" width={54} height={54} aria-hidden>
                  <circle cx={30} cy={30} r={24} fill="none" stroke="var(--border)" strokeWidth={8} />
                  <circle cx={30} cy={30} r={24} fill="none" stroke={theme.hex} strokeWidth={8} strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 24}`} strokeDashoffset={`${2 * Math.PI * 24 * (1 - timerFraction)}`} transform="rotate(-90 30 30)" />
                </svg>
                <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink-soft)' }}>
                  {timerDone ? 'The ring is full!' : `${minutesLeft} minute${minutesLeft === 1 ? '' : 's'} to go`}
                </p>
              </div>
            )}

            {status === 'doing' && m.proof === 'code' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                  {MISSION_LINES.tapNumber}: <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 900, color: 'var(--ink)', letterSpacing: 0, textTransform: 'none' }}>{typed.join('') || '…'}</span>
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(d => (
                    <button key={d} onClick={() => setCodes(c => ({ ...c, [key]: [...(c[key] ?? []), d].slice(-4) }))} aria-label={`Tap ${d}`}
                      style={{ width: 40, height: 40, borderRadius: 12, background: '#fff', border: '2px solid var(--ink)', boxShadow: '0 3px 0 var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', cursor: 'pointer', color: 'var(--ink)' }}>
                      {d}
                    </button>
                  ))}
                  <button onClick={() => setCodes(c => ({ ...c, [key]: [] }))} aria-label="Clear" style={{ height: 40, padding: '0 12px', borderRadius: 12, background: '#fff', border: '2px solid var(--ink)', boxShadow: '0 3px 0 var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, cursor: 'pointer', color: 'var(--ink)' }}>
                    ↺
                  </button>
                </div>
              </div>
            )}

            {note && <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', lineHeight: 1.3, color: 'var(--ink)' }}>{note}</p>}
            {status === 'notnow' && !note && <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', lineHeight: 1.3, color: 'var(--ink-soft)' }}>{MISSION_LINES.notNow}</p>}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(status === 'board' || status === 'notnow') && (
                <button onClick={() => onStart(key)} disabled={busy} style={chunky('accent', busy)}>{MISSION_LINES.start}</button>
              )}
              {status === 'doing' && m.proof === 'timer' && (
                <button onClick={() => claim(m)} disabled={busy || !timerDone} style={chunky('accent', busy || !timerDone)}>
                  {timerDone ? MISSION_LINES.weDidIt : MISSION_LINES.keepGoing}
                </button>
              )}
              {status === 'doing' && m.proof === 'code' && (
                <button onClick={() => claim(m)} disabled={busy || typed.length === 0} style={chunky('accent', busy || typed.length === 0)}>{MISSION_LINES.thatIsIt}</button>
              )}
              {status === 'doing' && (m.proof === 'grownup_tap' || m.proof === 'lesson') && (
                <button onClick={() => claim(m)} disabled={busy} style={chunky('accent', busy)}>{MISSION_LINES.weDidIt}</button>
              )}
              {status === 'doing' && m.proof === 'lesson' && token && (
                <a href={`/k/${token}/lessons`} style={chunky('white')}>📚 {MISSION_LINES.learnTab}</a>
              )}
              {status === 'claimed' && (askPending || m.proof === 'grownup_tap') && (
                <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink-soft)' }}>{MISSION_LINES.asked}</p>
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 8, background: 'linear-gradient(180deg, #F7F3EA 0%, #EFE7D8 100%)', borderRadius: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 8px', gap: 10 }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>
          🎯 {tier === 1 ? MISSION_LINES.boardTier1 : MISSION_LINES.board}
        </p>
        <button onClick={onClose} aria-label={MISSION_LINES.close} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}><CloseCross size={38} /></button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {board.map(card)}
        {board.length === 0 && (
          <p style={{ margin: '20px 0', textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink-soft)' }}>
            Every mission has landed. {leadName} will think of more.
          </p>
        )}
      </div>
    </div>
  )
}
