'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { card, cardPad, eyebrow } from '@/components/scripts/card-system'
import { characterByKey } from '@/lib/content/stage-characters'

// The child is played by Pebble, the youngest Planet Friend, so a parent is
// rehearsing with what feels like a real little person rather than a chat
// bubble. One familiar face across every rehearsal, from the one source of
// truth.
const KID_FACE = characterByKey('pebble')?.cutout ?? '/digi-squad/DiGi-star.svg'

// A rehearsal room for the words, in the same conversation grammar as the
// DiGi chat: the scenario pinned in the blue pill at the top, the child's
// replies as clean ink on white streaming in below, the parent's lines in
// blue pills on the right. While DiGi thinks the parent always sees what is
// happening: the star, three dots, one quiet line. Below the conversation
// sit ready made reply chips plus a free text bar, and both send through the
// exact same rehearse call.

export type Msg = { role: 'user' | 'assistant'; content: string; coach?: boolean }

// Fixture seeding for the reference page only: lets a screenshot show the
// open conversation, the thinking state and the chips without a server.
// Purely initial state, it changes no behaviour.
export type RehearseFixture = {
  open?: boolean
  messages?: Msg[]
  busy?: boolean
  coached?: boolean
}

type Props = {
  scriptTitle: string
  situation: string
  sayThis: string
  notThis: string
  childName: string | null
  isPaid: boolean
  fixture?: RehearseFixture
}

export default function RehearseWithDigi({ scriptTitle, situation, sayThis, notThis, childName, isPaid, fixture }: Props) {
  const [open, setOpen] = useState(fixture?.open ?? false)
  const [messages, setMessages] = useState<Msg[]>(fixture?.messages ?? [])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(fixture?.busy ?? false)
  const [coached, setCoached] = useState(fixture?.coached ?? false)
  // Finished for today: the panel folds away to a quiet done card instead of
  // sitting open forever, and can always be run again.
  const [doneOnce, setDoneOnce] = useState(false)
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

  // One door for every parent line: the free text bar and the chips both come
  // through here, into the exact same rehearse call.
  function sendText(text: string) {
    if (!text.trim() || busy) return
    const next: Msg[] = [...messages, { role: 'user', content: text.trim() }]
    setMessages(next)
    setInput('')
    setSuggestions([])
    setSuggMsg(null)
    scrollDown()
    run('child', next)
  }

  function sendLine() {
    sendText(input)
  }

  // Stuck for words: DiGi offers three calibrated lines that land as chips the
  // parent can tap to say, so they always have a way forward.
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

  // The ready made replies under the conversation: the script's own line
  // first, then two warm openers, until DiGi's calibrated suggestions
  // replace them. Client side only, every chip sends the same call.
  const quickChips = suggestions.length > 0
    ? suggestions
    : [sayThis, 'I hear you. Tell me more about that.', 'I can see this feels really unfair to you.']

  // Locked for free accounts: still show the value, route to upgrade.
  if (!isPaid) {
    return (
      <div style={{ ...card, padding: cardPad }}>
        <Eyebrow />
        <h3 style={heading}>Practise it with DiGi first</h3>
        <p style={sub}>
          Rehearse the words out loud in a safe place. DiGi plays {childLabel}, reacting the way a real
          child might, so the real conversation is not the first time you say it. Then DiGi coaches you on how it went.
        </p>
        <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ marginTop: 16, display: 'inline-flex', padding: '11px 20px', fontSize: 13 }}>
          Unlock rehearsals
        </Link>
      </div>
    )
  }

  if (!open) {
    // After a finished rehearsal the card rests quiet and small: a tick, a warm
    // line, and the door to run it again. It never sits open once done.
    if (doneOnce) {
      return (
        <div style={{ ...card, padding: cardPad, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span aria-hidden style={{ fontSize: '1.4rem', flexShrink: 0 }}>✅</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>Rehearsed and ready</div>
            <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>The words are warmed up for the real moment.</div>
          </div>
          <button onClick={start} style={ghostBtn}>Run it again</button>
        </div>
      )
    }
    return (
      <div style={{ ...card, padding: cardPad }}>
        <Eyebrow />
        <h3 style={heading}>Practise it with DiGi first</h3>
        <p style={sub}>
          A safe run through before the real moment. DiGi plays {childLabel} and reacts the way a real
          child might, so you can find your footing, then coaches you on how it went.
        </p>
        <button onClick={start} className="btn btn-gold" style={{ marginTop: 16, padding: '12px 22px', fontSize: 13.5, cursor: 'pointer' }}>
          Start a practice run
        </button>
      </div>
    )
  }

  return (
    <div style={{ ...card, padding: 0, overflow: 'hidden' }}>

      {/* Header: who is speaking, and the quiet controls */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {coached ? (
            <DigiCharacter size={32} mood="idle" once />
          ) : (
            <span
              className={busy ? 'rd-kid-talk' : undefined}
              style={{
                width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                background: 'var(--cream)', border: '2px solid var(--terracotta)', display: 'block',
              }}
            >
              <Image src={kidFace} alt="" width={38} height={38} style={{ objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
            </span>
          )}
          <div>
            <div style={{ ...eyebrow, fontSize: 9.5, color: 'var(--terracotta-dark)' }}>
              Rehearsal
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
              {coached ? 'DiGi is coaching you' : `DiGi is playing ${childLabel}`}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
            style={{ ...ghostBtn, padding: '7px 10px' }}
            title={voiceOn ? 'Turn the voice off' : 'Turn the voice on'}
            aria-label={voiceOn ? 'Turn the voice off' : 'Turn the voice on'}
          >
            {voiceOn ? '🔊 Voice on' : '🔈 Add voice'}
          </button>
          <button onClick={reset} style={ghostBtn} title="Start over">Start over</button>
          <button
            onClick={() => { stopSpeaking(); setDoneOnce(true); setOpen(false) }}
            style={{ ...ghostBtn, background: 'var(--terracotta-lt)', borderColor: 'var(--terracotta)', color: 'var(--ink)' }}
            title="Finish the rehearsal"
          >
            Done ✓
          </button>
        </div>
      </div>

      {/* The scenario, pinned at the top in the blue pill, exactly like the
          question pill in the DiGi chat. It stays put while the conversation
          scrolls beneath it, so the parent never loses what they are
          rehearsing. */}
      <div style={{ padding: '14px 18px 12px', background: '#fff' }}>
        <div style={{ background: '#DCE7FB', color: '#1B2A4A', borderRadius: 18, padding: '12px 16px' }}>
          <div style={{ ...eyebrow, fontSize: 9, color: '#1B2A4A', opacity: 0.65, marginBottom: 4 }}>
            You are rehearsing
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, lineHeight: 1.5 }}>
            {situation}
          </div>
        </div>
      </div>

      {/* The same conversation grammar as the DiGi chat: the parent's words
          in the soft blue pill on the right, the child's voice as clean ink
          text on white, streaming in as DiGi types. Coach asides keep their
          butter card so they read as a whisper from the side, not a turn in
          the role play. */}
      <div ref={scrollRef} style={{ maxHeight: 340, overflowY: 'auto', padding: '4px 18px 16px', display: 'flex', flexDirection: 'column', gap: 12, background: '#fff' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'user' ? (
              <div style={{
                maxWidth: '82%', padding: '12px 16px', fontSize: 15, lineHeight: 1.5,
                whiteSpace: 'pre-wrap', borderRadius: '18px 18px 6px 18px',
                background: '#DCE7FB', color: '#1B2A4A',
                fontFamily: 'var(--font-display)', fontWeight: 700,
              }}>
                {m.content}
              </div>
            ) : m.coach ? (
              <div style={{
                maxWidth: '86%', padding: '12px 15px', fontSize: 14.5, lineHeight: 1.55,
                whiteSpace: 'pre-wrap', fontWeight: 500, borderRadius: 16,
                background: 'linear-gradient(180deg,#FFF9EC,#FCEFD2)', color: 'var(--ink)',
                border: '1.5px solid rgba(201,154,40,0.3)',
              }}>
                {m.content}
              </div>
            ) : (
              <p style={{
                maxWidth: '90%', margin: 0, fontSize: 15.5, lineHeight: 1.6,
                whiteSpace: 'pre-wrap', fontWeight: 500,
                fontFamily: 'var(--font-body)', color: 'var(--ink)',
              }}>
                {m.content}
              </p>
            )}
          </div>
        ))}

        {/* Never a dead pause: while DiGi thinks the parent sees the star,
            three moving dots, and one quiet line saying what is happening. */}
        {busy && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DigiCharacter size={28} mood="thinking" />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--cream)', borderRadius: 100, padding: '9px 14px' }}>
              <span style={{ display: 'inline-flex', gap: 4 }} aria-hidden>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ink-light)', animation: `rh-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </span>
              <span style={{ fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.3 }}>
                {coached
                  ? 'DiGi is thinking about how it went...'
                  : `DiGi is thinking about ${childLabel === 'your child' ? "your child's" : `${childLabel}'s`} answer...`}
              </span>
            </div>
          </div>
        )}
        {error && <p style={{ fontSize: 14, color: 'var(--danger)', padding: '4px 2px', margin: 0 }}>{error}</p>}
      </div>

      <div style={{ padding: '12px 16px 14px', borderTop: '1px solid var(--border)', background: 'var(--white,#fff)' }}>
        {!coached ? (
          <>
            {/* Ready made replies, Cleo style: tap one and it is said. The
                script's own line always leads until DiGi's calibrated
                suggestions take their place. */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ ...eyebrow, fontSize: 9.5, letterSpacing: '0.08em', color: 'var(--ink-muted)', marginBottom: 7 }}>
                {suggestions.length > 0 ? 'Lines from DiGi · tap one to say it' : 'Tap a line to say it, or try your own'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {quickChips.map((s, i) => (
                  <button
                    key={`${suggestions.length > 0 ? 'sugg' : 'base'}-${i}`}
                    onClick={() => sendText(s)}
                    disabled={busy}
                    style={{
                      textAlign: 'left', background: 'var(--terracotta-lt)', border: '1.5px solid rgba(201,154,40,0.45)',
                      borderRadius: 14, padding: '10px 14px', cursor: busy ? 'default' : 'pointer',
                      fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', lineHeight: 1.45,
                      opacity: busy ? 0.55 : 1,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {suggMsg && (
              <p style={{ fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.45, margin: '0 0 10px' }}>{suggMsg}</p>
            )}
            <form onSubmit={e => { e.preventDefault(); sendLine() }} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendLine() } }}
                placeholder="Try your own words..."
                rows={1}
                style={{
                  flex: 1, padding: '11px 16px', borderRadius: 100, border: '1.5px solid var(--border)',
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
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={getSuggestions} disabled={busy || suggBusy} style={{ ...ghostBtn, flex: 1, textAlign: 'center', padding: '9px' }}>
                {suggBusy ? 'Thinking of lines…' : '💡 More lines from DiGi'}
              </button>
              {parentTurns >= 2 && (
                <button onClick={askCoach} disabled={busy} style={{ ...ghostBtn, flex: 1, textAlign: 'center', padding: '9px' }}>
                  Ask DiGi how I did
                </button>
              )}
            </div>
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

const heading: React.CSSProperties = { fontSize: 'clamp(1.15rem,3.4vw,1.35rem)', letterSpacing: '-0.01em', margin: '6px 0 8px', color: 'var(--ink)' }
const sub: React.CSSProperties = { fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }
const ghostBtn: React.CSSProperties = {
  background: 'none', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer',
  fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em',
  color: 'var(--ink-muted)', padding: '7px 12px',
}

function Eyebrow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <DigiCharacter size={26} mood="wave" once />
      <span style={{ ...eyebrow, fontSize: 10, color: 'var(--terracotta-dark)' }}>
        Rehearse with DiGi
      </span>
    </div>
  )
}
