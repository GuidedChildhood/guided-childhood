'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DigiCharacter from '@/components/digi/DigiCharacter'

// The child is played by Oliver, the warm Pixar style DiGi squad boy, so a
// parent is rehearsing with what feels like a real little person rather than a
// chat bubble. Always Oliver, for one familiar face across every rehearsal.
const KID_FACE = '/digi-squad/Oliver.png'

// A rehearsal room for the words. DiGi plays the child so the parent can try
// the line, feel the pushback, and find their footing before the real
// moment. When they are ready, DiGi steps out and coaches them on how it
// went. Practice is the thing that turns a script on a screen into something
// a parent can actually say, calm, at bedtime, to a real child.

type Msg = { role: 'user' | 'assistant'; content: string; coach?: boolean }

type Props = {
  scriptTitle: string
  situation: string
  sayThis: string
  notThis: string
  childName: string | null
  isPaid: boolean
}

export default function RehearseWithDigi({ scriptTitle, situation, sayThis, notThis, childName, isPaid }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [coached, setCoached] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const childLabel = childName && childName !== 'Your child' ? childName : 'your child'
  const kidFace = KID_FACE
  const parentTurns = messages.filter(m => m.role === 'user').length

  const scrollDown = () => requestAnimationFrame(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  })

  // The child can talk back out loud, in a lighter, quicker voice, so a parent
  // hears the pushback the way it lands rather than only reading it. Voice is
  // OFF by default across the platform: the parent turns it on if they want it,
  // it never plays unasked. A ref stops the same reply being spoken twice.
  const [voiceOn, setVoiceOn] = useState(false)
  const spokenRef = useRef<string>('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [suggBusy, setSuggBusy] = useState(false)
  const [suggMsg, setSuggMsg] = useState<string | null>(null)

  const speakChild = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const synth = window.speechSynthesis
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    // A little lighter and quicker than an adult, but not the shrill chipmunk
    // a high pitch gives: a gentler lift reads as a real child, not a robot.
    u.pitch = 1.22
    u.rate = 1.04
    u.lang = 'en-GB'
    const voices = synth.getVoices()
    // Prefer the device's high quality neural voices first (iOS and modern
    // Chrome ship enhanced or natural en voices that sound genuinely human),
    // then a named younger sounding voice, then any English fallback.
    const en = voices.filter(v => v.lang?.startsWith('en'))
    const pick =
      en.find(v => /enhanced|premium|natural|neural/i.test(v.name))
      ?? en.find(v => /child|kid|girl|Serena|Kate|Martha|Ava|Zoe|Google UK English Female/i.test(v.name))
      ?? en.find(v => v.lang === 'en-GB')
      ?? en[0]
    if (pick) u.voice = pick
    synth.speak(u)
  }

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
  }

  // Never leave the child voice talking after the panel unmounts.
  useEffect(() => () => stopSpeaking(), [])

  async function run(mode: 'child' | 'coach', history: Msg[]) {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/scripts/rehearse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode, scriptTitle, situation, sayThis, notThis,
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({} as { error?: string }))
        setError(data.error ?? 'DiGi could not start the rehearsal just now. Try again.')
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''
      let started = false
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        if (!full.trim()) continue
        if (!started) {
          started = true
          setMessages(prev => [...prev, { role: 'assistant', content: full, coach: mode === 'coach' }])
        } else {
          setMessages(prev => {
            const next = [...prev]
            next[next.length - 1] = { role: 'assistant', content: full, coach: mode === 'coach' }
            return next
          })
        }
        scrollDown()
      }
      full += decoder.decode()
      if (!full.trim()) {
        setError('DiGi went quiet. Try that again.')
      } else if (mode === 'child' && voiceOn && spokenRef.current !== full) {
        spokenRef.current = full
        speakChild(full)
      }
    } catch {
      setError('DiGi lost connection. Your line was not lost, try again.')
    } finally {
      setBusy(false)
      scrollDown()
    }
  }

  function start() {
    setOpen(true)
    if (messages.length === 0) run('child', [])
  }

  function sendLine() {
    if (!input.trim() || busy) return
    const next: Msg[] = [...messages, { role: 'user', content: input.trim() }]
    setMessages(next)
    setInput('')
    setSuggestions([])
    setSuggMsg(null)
    scrollDown()
    run('child', next)
  }

  // Stuck for words: DiGi offers three calibrated lines the parent can tap to
  // drop into the box and send or tweak, so they always have a way forward.
  async function getSuggestions() {
    if (suggBusy || busy) return
    setSuggBusy(true)
    setSuggMsg(null)
    try {
      const res = await fetch('/api/scripts/rehearse', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'suggest', scriptTitle, situation, sayThis, notThis, messages: messages.map(m => ({ role: m.role, content: m.content })) }),
      })
      const d = await res.json()
      const opts = Array.isArray(d.options) ? d.options.filter((x: unknown) => typeof x === 'string') : []
      setSuggestions(opts)
      if (opts.length === 0) setSuggMsg(d.error ?? 'DiGi could not think of options just now. Try again in a moment.')
    } catch {
      setSuggestions([])
      setSuggMsg('Could not load options just now. Try again in a moment.')
    }
    setSuggBusy(false)
  }

  function askCoach() {
    if (busy) return
    setCoached(true)
    run('coach', messages)
  }

  function reset() {
    stopSpeaking()
    spokenRef.current = ''
    setMessages([])
    setCoached(false)
    setError('')
    run('child', [])
  }

  // Locked for free accounts: still show the value, route to upgrade.
  if (!isPaid) {
    return (
      <div style={panel}>
        <Eyebrow />
        <h3 style={heading}>Practise it with DiGi first</h3>
        <p style={sub}>
          Rehearse the words out loud in a safe place. DiGi plays {childLabel}, reacting the way a real
          child might, so the real conversation is not the first time you say it. Then DiGi coaches you on how it went.
        </p>
        <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ marginTop: 14, display: 'inline-flex', padding: '11px 20px', fontSize: 13 }}>
          Unlock rehearsals
        </Link>
      </div>
    )
  }

  if (!open) {
    return (
      <div style={panel}>
        <Eyebrow />
        <h3 style={heading}>Practise it with DiGi first</h3>
        <p style={sub}>
          A safe run through before the real moment. DiGi plays {childLabel} and reacts the way a real
          child might, so you can find your footing, then coaches you on how it went.
        </p>
        <button onClick={start} className="btn btn-gold" style={{ marginTop: 14, padding: '12px 22px', fontSize: 13.5, cursor: 'pointer' }}>
          Start a practice run
        </button>
      </div>
    )
  }

  return (
    <div style={{ ...panel, padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(46,40,24,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {coached ? (
            <DigiCharacter size={32} mood="idle" />
          ) : (
            <span
              className={busy ? 'rd-kid-talk' : undefined}
              style={{
                width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                background: 'var(--cream)', border: '2px solid var(--terracotta)', display: 'block',
              }}
            >
              <Image src={kidFace} alt="" width={42} height={42} style={{ objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
            </span>
          )}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
              Rehearsal
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
              {coached ? 'DiGi is coaching you' : `DiGi is playing ${childLabel}`}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setVoiceOn(v => {
              const next = !v
              if (!next) { stopSpeaking(); return next }
              // Turning it on: read the child's latest line out loud right away,
              // so the parent hears what they just switched on.
              const lastChild = [...messages].reverse().find(m => m.role === 'assistant' && !m.coach)
              if (lastChild) { spokenRef.current = lastChild.content; speakChild(lastChild.content) }
              return next
            })}
            style={{ ...ghostBtn, padding: '7px 11px' }}
            title={voiceOn ? 'Turn the voice off' : 'Turn the voice on'}
            aria-label={voiceOn ? 'Turn the voice off' : 'Turn the voice on'}
          >
            {voiceOn ? '🔊 Voice on' : '🔈 Add voice'}
          </button>
          <button onClick={reset} style={ghostBtn} title="Start over">Start over</button>
        </div>
      </div>

      <div ref={scrollRef} style={{ maxHeight: 320, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--cream)' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '82%', padding: '11px 15px', fontSize: 15, lineHeight: 1.5,
              whiteSpace: 'pre-wrap', fontWeight: 500,
              borderRadius: m.role === 'user' ? '18px 18px 5px 18px' : '18px 18px 18px 5px',
              background: m.role === 'user'
                ? 'var(--terracotta)'
                : m.coach ? 'linear-gradient(160deg,#FFF9EC,#FBE9C4)' : 'var(--white,#fff)',
              color: 'var(--ink)',
              border: m.coach ? '1.5px solid rgba(201,154,40,0.3)' : '1px solid rgba(46,40,24,0.08)',
              boxShadow: m.role === 'user' ? '0 2px 0 var(--terracotta-dark)' : '0 2px 10px rgba(26,26,46,0.05)',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '13px 16px', background: 'var(--white,#fff)', borderRadius: '18px 18px 18px 5px', display: 'flex', gap: 5, boxShadow: '0 2px 10px rgba(26,26,46,0.05)' }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ink-light)', animation: `rh-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        {error && <p style={{ fontSize: 13, color: 'var(--danger)', padding: '4px 2px' }}>{error}</p>}
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(46,40,24,0.1)', background: 'var(--white,#fff)' }}>
        {!coached ? (
          <>
            {suggestions.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 7 }}>
                  Evidence led lines · tap one, then Say it
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(s); setSuggestions([]); setSuggMsg(null) }}
                      style={{
                        textAlign: 'left', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
                        borderRadius: 12, padding: '10px 13px', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.45,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {suggMsg && (
              <p style={{ fontSize: 12.5, color: 'var(--ink-muted)', lineHeight: 1.45, margin: '0 0 10px' }}>{suggMsg}</p>
            )}
            <form onSubmit={e => { e.preventDefault(); sendLine() }} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendLine() } }}
                placeholder={`Say your line to ${childLabel}...`}
                rows={1}
                style={{
                  flex: 1, padding: '11px 14px', borderRadius: 12, border: '1.5px solid var(--border)',
                  background: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: 15.5, color: 'var(--ink)',
                  resize: 'none', outline: 'none', lineHeight: 1.5, maxHeight: 120,
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--terracotta)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
              />
              <button type="submit" disabled={busy || !input.trim()} className="btn" style={{ padding: '11px 16px', fontSize: 12.5, flexShrink: 0 }}>
                Say it
              </button>
            </form>
            <button onClick={getSuggestions} disabled={busy || suggBusy} style={{ ...ghostBtn, marginTop: 10, width: '100%', textAlign: 'center', padding: '9px' }}>
              {suggBusy ? 'Thinking of options…' : '💡 Stuck for words? Show me options'}
            </button>
            {parentTurns >= 2 && (
              <button onClick={askCoach} disabled={busy} style={{ ...ghostBtn, marginTop: 10, width: '100%', textAlign: 'center', padding: '9px' }}>
                Ask DiGi how I did
              </button>
            )}
          </>
        ) : (
          <button onClick={reset} disabled={busy} className="btn btn-green" style={{ width: '100%', padding: '12px', fontSize: 13, cursor: 'pointer' }}>
            Practise it again
          </button>
        )}
      </div>

      <style>{`
        @keyframes rh-bounce { 0%,80%,100% { transform: translateY(0) } 40% { transform: translateY(-6px) } }
        @keyframes rd-kid-talk { 0%,100% { transform: translateY(0) scale(1) } 50% { transform: translateY(-2px) scale(1.05) } }
        .rd-kid-talk { animation: rd-kid-talk 0.6s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

const panel: React.CSSProperties = {
  background: 'var(--white,#fff)',
  border: '1.5px solid rgba(46,40,24,0.12)',
  borderRadius: 20,
  padding: 22,
  marginBottom: 18,
  boxShadow: '0 10px 30px -22px rgba(46,40,24,0.5)',
}
const heading: React.CSSProperties = { fontSize: 'clamp(1.15rem,3.4vw,1.35rem)', letterSpacing: '-0.01em', margin: '4px 0 8px', color: 'var(--ink)' }
const sub: React.CSSProperties = { fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }
const ghostBtn: React.CSSProperties = {
  background: 'none', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer',
  fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em',
  color: 'var(--ink-muted)', padding: '7px 12px',
}

function Eyebrow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <DigiCharacter size={26} mood="wave" />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
        Rehearse with DiGi
      </span>
    </div>
  )
}
