'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function DigiChat({
  initialMessages,
  initialCount,
  isPaid,
  stagePrompts,
}: {
  initialMessages: Message[]
  initialCount: number
  isPaid: boolean
  stagePrompts: string[]
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dailyCount, setDailyCount] = useState(initialCount)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const FREE_LIMIT = 3

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const q = searchParams.get('q')
    if (q) setInput(q)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
      }
    } catch {
      setError('Could not reach DiGi. Please check your connection and try again.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const atLimit = !isPaid && dailyCount >= FREE_LIMIT

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 80px)', maxWidth: '700px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--warm)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: '2px' }}>Your AI advisor</p>
            <h1 style={{ fontSize: '1.2rem', marginBottom: '0' }}>DiGi</h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            {!isPaid && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)' }}>
                {dailyCount}/{FREE_LIMIT} today
              </span>
            )}
            {atLimit && (
              <Link href="/dashboard/upgrade" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold-dark)', textDecoration: 'none' }}>
                Upgrade for unlimited →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0' }}>
        {messages.length === 0 && (
          <div style={{ paddingTop: '16px' }}>
            <div style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
              <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '8px' }}>
                I am DiGi, your digital parenting advisor. I am trained on the research and available any time. What is on your mind?
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-light)' }}>
                I cover devices, social media, gaming, AI, online safety, and everything in between.
              </p>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Try asking
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stagePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--warm)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    color: 'var(--ink-soft)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    lineHeight: 1.4,
                    transition: 'border-color 0.15s',
                  }}
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
            }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '13px 16px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' ? 'var(--ink)' : 'var(--warm)',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              color: msg.role === 'user' ? '#fff' : 'var(--ink)',
              fontSize: '15px',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
            <div style={{ padding: '13px 16px', background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: '6px', height: '6px', background: 'var(--ink-light)', borderRadius: '50%', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{ padding: '12px 16px', background: 'var(--coral-lt)', border: '1px solid var(--coral)', borderRadius: '12px', marginBottom: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--coral)', lineHeight: 1.5 }}>{error}</p>
            {error.includes('upgrade') && (
              <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ marginTop: '12px', display: 'inline-flex', padding: '10px 20px', fontSize: '12px' }}>
                Unlock unlimited DiGi
              </Link>
            )}
          </div>
        )}

        <div ref={messagesEndRef} style={{ height: '20px' }} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'var(--warm)', flexShrink: 0 }}>
        {atLimit ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '12px' }}>
              You have used your 3 free messages today. Come back tomorrow, or upgrade for unlimited DiGi.
            </p>
            <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-flex' }}>
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
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn btn-gold"
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
