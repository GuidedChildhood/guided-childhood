'use client'
import { useState, useRef, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DigiCharacter, { type DigiMood } from '@/components/digi/DigiCharacter'
import DigiHero from '@/components/digi/DigiHero'
import LessonPlayer from '@/components/lessons/LessonPlayer'
import type { LessonSlide } from '@/lib/content/lesson-slides'

function DigiAvatar({ size = 26, mood = 'idle' }: { size?: number; mood?: DigiMood }) {
  return <DigiCharacter size={size} mood={mood} />
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Render DiGi's bold lead ins (**like this**) as real bold, so a structured
// answer reads with the clarity of a coach, the bold phrase carrying the point
// and the rest of the sentence explaining it. Everything outside the asterisks
// stays plain. A lone trailing ** while the reply is still streaming is ignored.
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    nodes.push(<strong key={key++} style={{ fontWeight: 800, color: 'var(--ink)' }}>{m[1]}</strong>)
    last = m.index + m[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

// When DiGi answers a how to in the house lesson shape, splitting it on blank
// lines shatters the numbered steps across ragged bubbles (the three steps land
// half in one box, half in the next). So a lesson reply is caught here and
// rendered as one clean structured card instead. Anything that is not a lesson
// falls through to the normal chat bubbles untouched.
interface LessonParts {
  title: string
  bigIdea?: string
  why?: string
  steps: string[]
  tryTonight?: string
}

function parseLesson(content: string): LessonParts | null {
  const text = content.trim()
  // The lesson always opens with the Lesson label, so this is a stable, early
  // signal even while the reply is still streaming in.
  if (!/^Lesson:/i.test(text)) return null

  const markers: { key: keyof LessonParts; re: RegExp }[] = [
    { key: 'title', re: /Lesson:/i },
    { key: 'bigIdea', re: /The big idea:/i },
    { key: 'why', re: /Why it works[^:\n]*:/i },
    { key: 'steps', re: /Teach it in (?:three|3) steps:/i },
    { key: 'tryTonight', re: /Try tonight:/i },
  ]

  const found = markers
    .map(m => {
      const match = text.match(m.re)
      return match && match.index != null
        ? { key: m.key, start: match.index, end: match.index + match[0].length }
        : null
    })
    .filter((x): x is { key: keyof LessonParts; start: number; end: number } => x !== null)
    .sort((a, b) => a.start - b.start)

  const parts: LessonParts = { title: '', steps: [] }
  for (let i = 0; i < found.length; i++) {
    const cur = found[i]
    const next = found[i + 1]
    const body = text.slice(cur.end, next ? next.start : undefined).trim()
    if (cur.key === 'steps') {
      // Split on the numbered markers whether the steps came on their own lines
      // or ran together on one line, so 1 2 3 always separate cleanly.
      parts.steps = body.split(/\s*\d+[.)]\s+/).map(s => s.trim()).filter(Boolean)
    } else {
      parts[cur.key] = body
    }
  }

  if (!parts.title) return null
  return parts
}

// A DiGi written lesson becomes real slides, so Play it runs the same
// interactive player a library lesson uses: one part at a time, DiGi
// reacting, the try tonight landing last. No database row, so the player
// skips the completion write (completeEndpoint null).
function lessonToSlides(parts: LessonParts): LessonSlide[] {
  const slides: LessonSlide[] = [{ type: 'title', eyebrow: 'A DiGi lesson, made for you', title: parts.title }]
  if (parts.bigIdea) slides.push({ type: 'concept', heading: 'The big idea', body: parts.bigIdea })
  if (parts.why) slides.push({ type: 'concept', heading: 'Why it works', body: parts.why })
  if (parts.steps.length) slides.push({ type: 'recap', heading: 'Teach it in three steps', points: parts.steps })
  if (parts.tryTonight) slides.push({ type: 'tryit', heading: 'Try tonight', body: parts.tryTonight })
  return slides
}

function LessonCard({ parts }: { parts: LessonParts }) {
  const [playing, setPlaying] = useState(false)
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
  }
  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: '22px', padding: '22px 22px 20px',
      boxShadow: '0 1px 2px rgba(26,26,46,0.04), 0 12px 32px -10px rgba(26,26,46,0.14)',
    }}>
      <div style={{ ...labelStyle, marginBottom: 8 }}>Lesson</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.15, margin: 0 }}>
        {parts.title}
      </h3>

      {parts.bigIdea && (
        <div style={{ background: 'var(--stage-2)', borderRadius: 16, padding: '15px 17px', marginTop: 16 }}>
          <div style={{ ...labelStyle, marginBottom: 6 }}>The big idea</div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>{parts.bigIdea}</p>
        </div>
      )}

      {parts.why && (
        <div style={{ marginTop: 18 }}>
          <div style={{ ...labelStyle, marginBottom: 6 }}>Why it works</div>
          <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.65, margin: 0 }}>{parts.why}</p>
        </div>
      )}

      {parts.steps.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{ ...labelStyle, marginBottom: 12 }}>Teach it in three steps</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {parts.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                <span style={{
                  width: 27, height: 27, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  background: 'var(--terracotta)', color: 'var(--ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13.5,
                  boxShadow: '0 2px 0 var(--terracotta-dark)',
                }}>{i + 1}</span>
                <span style={{ fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.6, paddingTop: 2 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {parts.tryTonight && (
        <div style={{ background: 'var(--stage-1)', border: '1px solid var(--stage-1-bold)', borderRadius: 16, padding: '15px 17px', marginTop: 18 }}>
          <div style={{ ...labelStyle, color: 'var(--stage-1-text)', marginBottom: 6 }}>Try tonight</div>
          <p style={{ fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{parts.tryTonight}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setPlaying(true)}
        style={{
          width: '100%', marginTop: 18,
          background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
          borderRadius: 16, padding: '14px 20px', cursor: 'pointer',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
          boxShadow: '0 5px 0 var(--terracotta-dark)',
        }}
      >
        ▶ Play it as a lesson
      </button>

      {playing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={parts.title}
          style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'var(--cream)', overflowY: 'auto' }}
        >
          <div style={{ maxWidth: 620, margin: '0 auto', padding: '18px 20px 48px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
              <button
                type="button"
                onClick={() => setPlaying(false)}
                aria-label="Close the lesson"
                style={{
                  background: 'var(--white, #fff)', border: '1px solid var(--border)', borderRadius: '50%',
                  width: 38, height: 38, fontSize: 16, color: 'var(--ink-soft)', cursor: 'pointer', lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
            <LessonPlayer
              lessonId="digi-quick-lesson"
              lessonSource="ai_lesson"
              slides={lessonToSlides(parts)}
              backHref="/dashboard/digi"
              completeEndpoint={null}
            />
          </div>
        </div>
      )}
    </div>
  )
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
  // A brief confirmation the moment a reflection saves, then it eases away so
  // it never lingers at the bottom of the thread. Separate from reflectionDone,
  // which stays true so the prompt does not resurface.
  const [reflectionToast, setReflectionToast] = useState(false)
  useEffect(() => {
    if (!reflectionToast) return
    const id = setTimeout(() => setReflectionToast(false), 4000)
    return () => clearTimeout(id)
  }, [reflectionToast])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // The scrolling messages column, and whether the reader is currently pinned
  // to the bottom. While pinned, new text keeps the latest line in view as it
  // streams. The moment the reader scrolls up to re-read, we release, so the
  // stream never yanks them back down mid sentence. A ref, not state, so a
  // scroll never triggers a re-render.
  const scrollRef = useRef<HTMLDivElement>(null)
  const stickRef = useRef(true)
  const onMessagesScroll = () => {
    const el = scrollRef.current
    if (el) stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }
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

  // Keep the newest text in view as it streams, but only while the reader is
  // pinned to the bottom. Instant, not smooth: a smooth animation on every
  // streamed token stacks up into jank and fights the reader. If they have
  // scrolled up to read, we leave them exactly where they are.
  useEffect(() => {
    if (!stickRef.current) return
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, reflectionQuestion])

  // Safety net: a tap that navigates away while a textarea is still
  // focused can skip the blur handler, which would leave the tab bar
  // hidden on the next page. Always clear it on unmount.
  useEffect(() => () => { document.body.classList.remove('gc-input-focused') }, [])

  async function sendMessage(text?: string, deviceOverride?: string) {
    const typed = text ?? input
    if (!typed.trim() || loading) return
    const messageText = text ? typed : continuingPrefix ? `${continuingPrefix}${typed}` : typed

    // Sending is an intent to see the reply: always re-pin to the bottom.
    stickRef.current = true
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
      setReflectionToast(true)
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
              <p className="eyebrow" style={{ marginBottom: '1px', fontSize: 10 }}>Your evidence led guide</p>
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
      <div ref={scrollRef} onScroll={onMessagesScroll} style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0', background: 'var(--cream)' }}>

        {messages.length === 0 && (
          <div style={{ paddingTop: '4px' }}>
            {/* The premium DiGi front door: the same warm hero DiGi opens with
                everywhere, in our butter and ink. */}
            <div style={{ margin: '0 -20px 24px' }}>
              <DigiHero
                title={<>Let&apos;s make today a little easier.</>}
                subtitle="I am trained on the research and I get more useful the more you tell me. What is on your mind?"
                curved={false}
              />
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
          // DiGi speaks as one warm, continuous voice, the way the welcome
          // sheet reads, not a stack of boxed white cards. The whole reply
          // flows inside a single soft butter bubble, its separate thoughts
          // set apart by generous spacing rather than separate boxes. Only the
          // parent's own message wears the solid butter bubble, on the right.
          // A lesson reply still renders as its structured card.
          if (msg.role === 'user') {
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '22px' }}>
                <div style={{
                  maxWidth: '82%', background: 'var(--terracotta)', color: 'var(--ink)',
                  borderRadius: '20px 20px 5px 20px', padding: '13px 17px',
                  boxShadow: '0 2px 0 var(--terracotta-dark)',
                  fontFamily: 'var(--font-body)', fontSize: '16.5px', lineHeight: 1.5,
                  fontWeight: 500, whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            )
          }
          const lesson = parseLesson(msg.content)
          // Keep each point whole (split on blank lines only, no character
          // shatter), so a bold led suggestion never breaks across two boxes.
          const paras = msg.content.split(/\n{2,}/).map(s => s.trim()).filter(Boolean)
          if (!lesson && paras.length === 0) return null
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: '90%' }}>
                <div style={{ width: 30, flexShrink: 0, marginTop: 2 }}>
                  <DigiAvatar size={30} />
                </div>
                {lesson ? <LessonCard parts={lesson} /> : (
                  <div style={{
                    background: 'var(--terracotta-lt)', borderRadius: '6px 20px 20px 20px',
                    padding: '16px 19px', display: 'flex', flexDirection: 'column', gap: '13px', minWidth: 0,
                  }}>
                    {paras.map((text, b) => (
                      <p key={b} style={{
                        margin: 0, fontFamily: 'var(--font-body)', fontSize: '16.5px',
                        lineHeight: 1.6, color: 'var(--ink)', fontWeight: 500, whiteSpace: 'pre-wrap',
                      }}>
                        {renderInline(text)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {loading && !streamingReply && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '22px', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 30, flexShrink: 0, marginTop: 2 }}><DigiAvatar size={30} mood="thinking" /></div>
            <div style={{ padding: '16px 19px', background: 'var(--terracotta-lt)', borderRadius: '6px 20px 20px 20px', display: 'flex', gap: '5px', alignItems: 'center' }}>
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

        {reflectionToast && (
          <div style={{ textAlign: 'center', padding: '12px 0 8px', marginBottom: 8, transition: 'opacity 0.4s' }}>
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
            {/* The compose pill: soft rounded field with a butter send tucked
                in the corner, the reference feel in our palette. */}
            <div style={{
              display: 'flex', gap: '8px', alignItems: 'flex-end',
              background: 'var(--cream)', border: '1.5px solid var(--border)',
              borderRadius: '26px', padding: '6px 6px 6px 18px',
              transition: 'border-color 0.15s',
            }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder={continuingTopic ? 'What is happening, in your own words...' : 'Type your question'}
              rows={1}
              style={{
                flex: 1,
                padding: '9px 0',
                border: 'none',
                background: 'transparent',
                fontFamily: 'var(--font-body)',
                fontSize: '16.5px',
                color: 'var(--ink)',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.5,
                maxHeight: '160px',
                overflowY: 'auto',
              }}
              onFocus={e => { const p = e.currentTarget.parentElement; if (p) p.style.borderColor = 'var(--terracotta)'; document.body.classList.add('gc-input-focused') }}
              onBlur={e => { const p = e.currentTarget.parentElement; if (p) p.style.borderColor = 'var(--border)'; document.body.classList.remove('gc-input-focused') }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send to DiGi"
              style={{
                flexShrink: 0, width: 44, height: 44, borderRadius: '50%', border: 'none',
                background: input.trim() ? 'var(--terracotta)' : 'var(--border)',
                color: 'var(--ink)', cursor: input.trim() ? 'pointer' : 'default',
                boxShadow: input.trim() ? '0 4px 0 var(--terracotta-dark)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 800, lineHeight: 1,
                transition: 'background 0.15s',
              }}
            >
              ↑
            </button>
            </div>
          </form>
        )}
        {!atLimit && (
          <p style={{ margin: '9px 6px 0', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--ink-muted)', lineHeight: 1.4 }}>
            DiGi is a guide, not a crisis line, and can make mistakes. In an emergency call 999, or Samaritans on 116 123.
          </p>
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
