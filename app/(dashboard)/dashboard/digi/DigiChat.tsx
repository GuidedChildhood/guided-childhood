'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DigiCharacter, { type DigiMood } from '@/components/digi/DigiCharacter'

function DigiAvatar({ size = 26, mood = 'idle' }: { size?: number; mood?: DigiMood }) {
  return <DigiCharacter size={size} mood={mood} />
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Chat protocol, made bulletproof: DiGi is told to write short texts
// separated by blank lines, but a reply is still rendered as proper
// chat bubbles even if a paragraph comes back long. Blank lines split
// first, then anything still over ~200 characters is split again on
// sentence boundaries into two sentence chunks, so the premium chat
// look never depends on the model getting the format exactly right.
const MAX_BUBBLE_CHARS = 200

function splitIntoBubbles(content: string): string[] {
  const paragraphs = content.split(/\n{2,}/).map(s => s.trim()).filter(Boolean)
  const bubbles: string[] = []
  for (const para of paragraphs) {
    if (para.length <= MAX_BUBBLE_CHARS) {
      bubbles.push(para)
      continue
    }
    const sentences = para.split(/(?<=[.?!])\s+(?=[A-Z0-9"'])/).filter(Boolean)
    let chunk = ''
    for (const s of sentences) {
      const candidate = chunk ? `${chunk} ${s}` : s
      if (candidate.length > MAX_BUBBLE_CHARS && chunk) {
        bubbles.push(chunk)
        chunk = s
      } else {
        chunk = candidate
      }
    }
    if (chunk) bubbles.push(chunk)
  }
  return bubbles
}

export default function DigiChat({
  initialMessages,
  initialCount,
  isPaid,
  stagePrompts,
  pendingReflection,
  stageId,
  stageName,
}: {
  initialMessages: Message[]
  initialCount: number
  isPaid: boolean
  stagePrompts: string[]
  pendingReflection?: { question: string; answered: boolean } | null
  stageId?: number
  stageName?: string
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingReply, setStreamingReply] = useState(false)
  const [error, setError] = useState('')
  const [dailyCount, setDailyCount] = useState(initialCount)
  const [deviceSetupDismissed, setDeviceSetupDismissed] = useState(true)

  useEffect(() => {
    if (stageId) {
      setDeviceSetupDismissed(localStorage.getItem(`gc_device_setup_confirmed_${stageId}`) === '1')
    }
  }, [stageId])

  // Reflection state
  const [reflectionQuestion, setReflectionQuestion] = useState<string | null>(
    pendingReflection && !pendingReflection.answered ? pendingReflection.question : null
  )
  const [reflectionInput, setReflectionInput] = useState('')
  const [reflectionSaving, setReflectionSaving] = useState(false)
  const [reflectionDone, setReflectionDone] = useState(
    pendingReflection?.answered ?? false
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const FREE_LIMIT = 3

  const [deviceKey, setDeviceKey] = useState<string | null>(null)

  // A prompt still waiting to be finished ("My situation: ") never goes
  // into the box itself, that read as a messy half written sentence. It
  // becomes a small topic tag above a clean, empty box instead: the
  // parent sees what they are continuing without typing inside a wall
  // of someone else's words, and their own short answer is quietly
  // joined onto the full sentence only when it is actually sent.
  const [continuingPrefix, setContinuingPrefix] = useState<string | null>(null)
  const [continuingTopic, setContinuingTopic] = useState<string | null>(null)

  // Arriving from Help now, a moment card, a script or a lesson with a
  // ready made question: send it straight away so the conversation is
  // already under way, rather than dumping a long sentence into a one
  // line box where it sits half clipped and looks broken.
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const q = searchParams.get('q')
    const device = searchParams.get('device')
    if (device) setDeviceKey(device)
    if (!q) return
    window.history.replaceState(null, '', window.location.pathname)
    if (/:\s*$/.test(q)) {
      const topicMatch = q.match(/:\s*([^.]+)\.[^.]*:\s*$/)
      setContinuingTopic(topicMatch?.[1]?.trim() ?? 'this script')
      setContinuingPrefix(q)
      requestAnimationFrame(() => textareaRef.current?.focus())
    } else {
      sendMessage(q, device ?? undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The compose box grows to fit what is in it, including a prefilled
  // question, instead of clipping to one line and hiding the rest.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, reflectionQuestion])

  // Safety net: a tap that navigates away while a textarea is still
  // focused can skip the blur handler, which would leave the tab bar
  // hidden on the next page. Always clear it on unmount.
  useEffect(() => () => { document.body.classList.remove('gc-input-focused') }, [])

  async function sendMessage(text?: string, deviceOverride?: string) {
    const typed = text ?? input
    if (!typed.trim() || loading) return
    const messageText = text ? typed : continuingPrefix ? `${continuingPrefix}${typed}` : typed

    setMessages(prev => [...prev, { role: 'user', content: messageText }])
    setInput('')
    setContinuingPrefix(null)
    setContinuingTopic(null)
    setLoading(true)
    setError('')

    // The reply streams in as plain text. The reflective question travels in
    // the same stream after a --- marker line and is split out client side.
    const REFLECTION_MARKER = /\n\s*---\s*\n/
    let replyStarted = false

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 65_000)
      const res = await fetch('/api/digi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, device_key: deviceOverride ?? deviceKey }),
        signal: controller.signal,
      })

      if (!res.ok) {
        clearTimeout(timeout)
        const data = await res.json().catch(() => ({} as { error?: string }))
        if (res.status === 429) {
          setError('DiGi has helped all it can today, that is your 3 free chats. It refreshes tomorrow, or go unlimited any time.')
        } else {
          setError(data.error ?? 'Something went wrong. Please try again.')
        }
        setMessages(prev => prev.slice(0, -1))
        return
      }

      if (!res.body) throw new Error('No response stream')

      const usedToday = Number(res.headers.get('X-Messages-Used-Today'))
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      const showReply = (content: string) => {
        if (!replyStarted) {
          replyStarted = true
          setStreamingReply(true)
          setMessages(prev => [...prev, { role: 'assistant', content }])
        } else {
          setMessages(prev => {
            const next = [...prev]
            next[next.length - 1] = { role: 'assistant', content }
            return next
          })
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        // Hide a partially streamed marker line so it never flashes on screen
        const visible = fullText.split(REFLECTION_MARKER)[0].replace(/\n\s*-{1,3}\s*$/, '')
        if (visible.trim()) showReply(visible)
      }
      fullText += decoder.decode()
      clearTimeout(timeout)

      const parts = fullText.split(REFLECTION_MARKER)
      const mainResponse = parts[0]?.trim() ?? fullText.trim()
      const reflective = parts[1]?.trim() || null

      if (!mainResponse) {
        setError('DiGi took too long to answer. Your message was not lost, try sending it again.')
        setMessages(prev => prev.slice(0, -1))
        return
      }

      showReply(mainResponse)
      setDailyCount(Number.isFinite(usedToday) && usedToday > 0 ? usedToday : dailyCount + 1)
      // Surface reflective question if new (and not already showing one)
      if (reflective && !reflectionQuestion && !reflectionDone) {
        setReflectionQuestion(reflective)
      }
    } catch {
      if (replyStarted) {
        // Keep whatever DiGi managed to say before the connection dropped
        return
      }
      setError('DiGi took too long to answer. Your message was not lost, try sending it again.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
      setStreamingReply(false)
    }
  }

  async function submitReflection() {
    if (!reflectionQuestion || !reflectionInput.trim()) return
    setReflectionSaving(true)
    try {
      await fetch('/api/digi/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: reflectionQuestion,
          response: reflectionInput.trim(),
        }),
      })
      setReflectionDone(true)
      setReflectionQuestion(null)
    } catch {
      // fail silently — not critical
    } finally {
      setReflectionSaving(false)
    }
  }

  async function dismissReflection() {
    if (!reflectionQuestion) return
    // Save with no response (so it doesn't resurface)
    await fetch('/api/digi/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: reflectionQuestion, response: '' }),
    }).catch(() => null)
    setReflectionQuestion(null)
    setReflectionDone(true)
  }

  const atLimit = !isPaid && dailyCount >= FREE_LIMIT

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 80px)', maxWidth: '700px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--white)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <DigiAvatar size={36} mood="wave" />
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: '1px', fontSize: 10 }}>Your AI advisor</p>
              <h1 style={{ fontSize: '1.05rem', marginBottom: '0', lineHeight: 1 }}>DiGi</h1>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            {!isPaid && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--ink-muted)' }}>
                {dailyCount}/{FREE_LIMIT} today
              </span>
            )}
            {atLimit && (
              <Link href="/dashboard/upgrade" style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--terracotta)', textDecoration: 'none' }}>
                Upgrade for unlimited →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0', background: 'var(--cream)' }}>

        {messages.length === 0 && (
          <div style={{ paddingTop: '8px' }}>
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
              <p style={{ fontSize: '17px', color: 'var(--ink)', lineHeight: 1.55, marginBottom: '8px', fontWeight: 600 }}>
                I&apos;m DiGi, your digital parenting advisor.
              </p>
              <p style={{ fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
                I&apos;m trained on the research and I get more useful the more you tell me. What&apos;s on your mind?
              </p>
            </div>

            {stageId && stageName && !deviceSetupDismissed && (
              <div style={{
                background: 'var(--stage-2)',
                border: '1.5px solid var(--border)',
                borderRadius: '16px',
                padding: '16px 18px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'var(--terracotta)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 0 var(--terracotta-dark)',
                }}>
                  <span style={{ fontSize: '14px', color: '#fff' }}>⚙</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--terracotta)', marginBottom: '4px',
                  }}>
                    Device setup · Stage {stageId}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5, marginBottom: '10px' }}>
                    Have you set the right device settings for {stageName}? I work better when the basics are in place.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link
                      href={`/dashboard/pathway`}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                        color: 'var(--terracotta)', textDecoration: 'underline',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Check setup →
                    </Link>
                    <button
                      onClick={() => {
                        if (stageId) localStorage.setItem(`gc_device_setup_confirmed_${stageId}`, '1')
                        setDeviceSetupDismissed(true)
                      }}
                      style={{
                        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                        fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
                        color: 'var(--ink-muted)', letterSpacing: '0.04em',
                      }}
                    >
                      All set
                    </button>
                  </div>
                </div>
              </div>
            )}

            <p className="eyebrow" style={{ marginBottom: '12px', fontSize: 10 }}>Try asking</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {stagePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--white)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    color: 'var(--ink-soft)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    lineHeight: 1.4,
                    transition: 'border-color 0.15s',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          // Chat protocol: every short thought in a DiGi reply becomes its
          // own bubble, the way real messaging apps stack a multi part
          // message. The avatar sits once, beside the last bubble, and
          // consecutive bubbles in the group sit close with softened inner
          // corners, the iMessage grouping look rather than separate cards.
          const bubbles = msg.role === 'assistant' ? splitIntoBubbles(msg.content) : [msg.content]
          if (bubbles.length === 0) return null
          return (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, maxWidth: '86%' }}>
                {msg.role === 'assistant' && (
                  <div style={{ width: 30, flexShrink: 0, marginBottom: 2 }}>
                    <DigiAvatar size={30} />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                  {bubbles.map((text, b) => {
                    const first = b === 0
                    const last = b === bubbles.length - 1
                    return (
                      <div
                        key={b}
                        style={{
                          padding: '13px 17px',
                          borderRadius: msg.role === 'user'
                            ? `20px ${first ? '20px' : '8px'} ${last ? '5px' : '8px'} 20px`
                            : `${first ? '20px' : '8px'} 20px 20px ${last ? '5px' : '8px'}`,
                          background: msg.role === 'user' ? 'var(--terracotta)' : 'var(--white, #fff)',
                          color: msg.role === 'user' ? 'var(--ink)' : 'var(--ink)',
                          boxShadow: msg.role === 'assistant'
                            ? '0 1px 1px rgba(26,26,46,0.04), 0 4px 14px rgba(26,26,46,0.07)'
                            : '0 2px 0 var(--terracotta-dark)',
                          fontSize: '16.5px',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap',
                          fontWeight: 500,
                        }}
                      >
                        {text}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}

        {loading && !streamingReply && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '18px', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ width: 30, flexShrink: 0 }}><DigiAvatar size={30} mood="thinking" /></div>
            <div style={{ padding: '15px 18px', background: 'var(--white)', borderRadius: '20px 20px 20px 5px', boxShadow: '0 1px 1px rgba(26,26,46,0.04), 0 4px 14px rgba(26,26,46,0.07)', display: 'flex', gap: '5px', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: '7px', height: '7px', background: 'var(--ink-light)', borderRadius: '50%', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{ padding: '12px 16px', background: 'var(--stage-1)', borderRadius: '12px', marginBottom: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>{error}</p>
            {error.toLowerCase().includes('upgrade') && (
              <Link href="/dashboard/upgrade" className="btn" style={{ marginTop: '12px', display: 'inline-flex', padding: '10px 20px', fontSize: '12px' }}>
                Unlock unlimited DiGi
              </Link>
            )}
          </div>
        )}

        {/* Reflection card — appears after DiGi has given a daily reflection question */}
        {reflectionQuestion && !reflectionDone && (
          <div style={{
            background: 'var(--white)',
            border: '1.5px solid var(--terracotta-lt)',
            borderLeft: '3px solid var(--terracotta)',
            borderRadius: '16px',
            padding: '18px 18px 16px',
            marginBottom: '16px',
            marginTop: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--terracotta)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
                Today's reflection
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: 14, fontWeight: 500 }}>
              {reflectionQuestion}
            </p>
            <textarea
              value={reflectionInput}
              onChange={e => setReflectionInput(e.target.value)}
              placeholder="A sentence or two is fine..."
              rows={2}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid var(--border)',
                background: 'var(--cream)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--ink)',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.5,
                marginBottom: 10,
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--terracotta)'; document.body.classList.add('gc-input-focused') }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; document.body.classList.remove('gc-input-focused') }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={submitReflection}
                disabled={reflectionSaving || !reflectionInput.trim()}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: reflectionInput.trim() ? 'var(--terracotta)' : 'var(--border)',
                  color: reflectionInput.trim() ? '#fff' : 'var(--ink-muted)',
                  border: 'none',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: reflectionInput.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background 0.15s',
                }}
              >
                {reflectionSaving ? 'Saving...' : 'Send to DiGi'}
              </button>
              <button
                onClick={dismissReflection}
                style={{
                  padding: '10px 14px',
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--ink-muted)',
                  cursor: 'pointer',
                }}
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {reflectionDone && (
          <div style={{ textAlign: 'center', padding: '12px 0 8px', marginBottom: 8 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-muted)' }}>
              ✓ Reflection saved. DiGi will use this tomorrow
            </p>
          </div>
        )}

        <div ref={messagesEndRef} style={{ height: '20px' }} />
      </div>

      {/* Input */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', background: 'var(--white)', flexShrink: 0 }}>
        {atLimit ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '12px' }}>
              You have used your 3 free messages today. Come back tomorrow, or upgrade for unlimited DiGi.
            </p>
            <Link href="/dashboard/upgrade" className="btn" style={{ display: 'inline-flex' }}>
              Upgrade for unlimited
            </Link>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); sendMessage() }} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {continuingTopic && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'var(--stage-2)', border: '1px solid var(--border)',
                  borderRadius: '100px', padding: '5px 12px',
                  fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700,
                  color: 'var(--ink-soft)', maxWidth: '100%',
                }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Continuing: {continuingTopic}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setContinuingPrefix(null); setContinuingTopic(null) }}
                    aria-label="Stop continuing this topic"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--ink-muted)', fontSize: '13px', lineHeight: 1, flexShrink: 0 }}
                  >
                    ×
                  </button>
                </span>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder={continuingTopic ? 'What is happening, in your own words...' : "Ask DiGi anything about your child's digital world..."}
              rows={1}
              style={{
                flex: 1,
                padding: '13px 16px',
                borderRadius: '14px',
                border: '1.5px solid var(--border)',
                background: 'var(--cream)',
                fontFamily: 'var(--font-body)',
                fontSize: '16.5px',
                color: 'var(--ink)',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.5,
                maxHeight: '160px',
                overflowY: 'auto',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--terracotta)'; document.body.classList.add('gc-input-focused') }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; document.body.classList.remove('gc-input-focused') }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn"
              style={{ padding: '13px 20px', flexShrink: 0, fontSize: '13px' }}
            >
              Send
            </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}
