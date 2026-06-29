'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

function DigiAvatar({ size = 26 }: { size?: number }) {
  return (
    <Image
      src="/digi-squad/Digi.png"
      alt="DiGi"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0 }}
    />
  )
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function DigiChat({
  initialMessages,
  initialCount,
  isPaid,
  stagePrompts,
  pendingReflection,
}: {
  initialMessages: Message[]
  initialCount: number
  isPaid: boolean
  stagePrompts: string[]
  pendingReflection?: { question: string; answered: boolean } | null
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dailyCount, setDailyCount] = useState(initialCount)

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
  const FREE_LIMIT = 3

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const q = searchParams.get('q')
    if (q) setInput(q)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, reflectionQuestion])

  async function sendMessage(text?: string) {
    const messageText = text ?? input
    if (!messageText.trim() || loading) return

    setMessages(prev => [...prev, { role: 'user', content: messageText }])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/digi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setError('You have used your 3 free DiGi messages for today. Upgrade for unlimited access.')
        } else {
          setError(data.error ?? 'Something went wrong. Please try again.')
        }
        setMessages(prev => prev.slice(0, -1))
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        setDailyCount(data.messagesUsedToday ?? dailyCount + 1)
        // Surface reflective question if new (and not already showing one)
        if (data.reflectiveQuestion && !reflectionQuestion && !reflectionDone) {
          setReflectionQuestion(data.reflectiveQuestion)
        }
      }
    } catch {
      setError('Could not reach DiGi. Please check your connection and try again.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
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
              <DigiAvatar size={36} />
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
              <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.7, marginBottom: '8px', fontWeight: 500 }}>
                I'm DiGi, your digital parenting advisor.
              </p>
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                I'm trained on the research and I get more useful the more you tell me. What's on your mind?
              </p>
            </div>

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

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '12px',
              alignItems: 'flex-end',
              gap: 8,
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{ marginBottom: 2 }}>
                <DigiAvatar size={26} />
              </div>
            )}
            <div style={{
              maxWidth: '82%',
              padding: '13px 16px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' ? 'var(--ink)' : 'var(--white)',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              color: msg.role === 'user' ? '#fff' : 'var(--ink)',
              fontSize: '15px',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px', alignItems: 'flex-end', gap: 8 }}>
            <DigiAvatar size={26} />
            <div style={{ padding: '13px 16px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: '5px', alignItems: 'center' }}>
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
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
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
              ✓ Reflection saved — DiGi will use this tomorrow
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
          <form onSubmit={e => { e.preventDefault(); sendMessage() }} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Ask DiGi anything about your child's digital world..."
              rows={1}
              style={{
                flex: 1,
                padding: '13px 16px',
                borderRadius: '14px',
                border: '1.5px solid var(--border)',
                background: 'var(--cream)',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: 'var(--ink)',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.5,
                maxHeight: '120px',
                overflowY: 'auto',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn"
              style={{ padding: '13px 20px', flexShrink: 0, fontSize: '13px' }}
            >
              Send
            </button>
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
