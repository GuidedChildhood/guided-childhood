'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { REPLY_MAX, talkPromptFor, type DealChangeAsk } from '@/lib/deal/change-requests'

// The child has asked to change the deal (migration 381). The grown up's card.
//
// Justin, 16 October 2026: the child asks from their own app, with a reason,
// and the grown up decides. Three answers, and none of them is a flat no:
//
//   Yes, let's change it   opens the agreement, where the change is made and
//                          both agree it again (the editor versions it).
//   Let's talk             opens DiGi with the ask already written in, so the
//                          grown up has the words for the conversation.
//   Not this time          with an optional kind line the child will read.
//
// Silent when nothing is waiting, like the other cards on the Quests page.
// The id is where the push and the agreement page link land.

type Ask = DealChangeAsk & { child_name: string }

const BTN: React.CSSProperties = {
  width: '100%', border: 'var(--edge)', borderRadius: 'var(--radius-btn)', padding: '12px 14px',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)',
  cursor: 'pointer', boxShadow: 'var(--lift)', background: 'var(--white)', textAlign: 'center',
}

export default function DealChangeAsks() {
  const router = useRouter()
  const [asks, setAsks] = useState<Ask[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [replyFor, setReplyFor] = useState<string | null>(null)
  const [reply, setReply] = useState('')
  const [failed, setFailed] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    fetch('/api/deal-change')
      .then(r => r.json())
      .then(d => { if (live) setAsks(Array.isArray(d?.asks) ? d.asks : []) })
      .catch(() => { /* stays hidden */ })
    return () => { live = false }
  }, [])

  if (asks.length === 0) return null

  async function answer(ask: Ask, kind: 'yes' | 'not_now' | 'talk', note?: string) {
    if (busy) return
    setBusy(ask.id)
    setFailed(null)
    try {
      const res = await fetch('/api/deal-change', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ask.id, answer: kind, reply: note ?? '' }),
      })
      // 409 means another device answered first: the ask is settled either way.
      if (!res.ok && res.status !== 409) throw new Error('save failed')
      setAsks(q => q.filter(a => a.id !== ask.id))
      setReplyFor(null)
      setReply('')
      if (kind === 'yes') router.push('/dashboard/agreement')
      if (kind === 'talk') router.push(`/dashboard/digi?q=${encodeURIComponent(talkPromptFor(ask.child_name, ask))}`)
    } catch {
      setFailed(ask.id)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div id="deal-asks" style={{ marginBottom: '18px', scrollMarginTop: '80px' }}>
      {asks.map(ask => {
        const writing = replyFor === ask.id
        const waiting = busy === ask.id
        return (
          <div key={ask.id} data-deal-change-ask style={{
            background: 'var(--terracotta-lt)', border: 'var(--edge)', boxShadow: 'var(--lift)',
            borderRadius: 'var(--radius-card)', padding: '17px 18px', marginBottom: '12px',
          }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
              Asking to change the deal
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2, marginTop: 4 }}>
              {ask.child_name} has made their case
            </span>

            <div style={{ background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '12px 14px', margin: '12px 0' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: 0 }}>{ask.promise_title}</p>
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0' }}>
                <strong style={{ color: 'var(--ink)' }}>They would like:</strong> {ask.wish}
              </p>
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '4px 0 0' }}>
                <strong style={{ color: 'var(--ink)' }}>Their reason:</strong> {ask.reason}
              </p>
            </div>

            {!writing ? (
              <div style={{ display: 'grid', gap: '9px' }}>
                <button type="button" disabled={waiting} onClick={() => answer(ask, 'yes')}
                  style={{ ...BTN, background: 'var(--gold)', boxShadow: '0 5px 0 var(--gold-dark)', fontWeight: 900 }}>
                  Yes, let&apos;s change it
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' }}>
                  <button type="button" disabled={waiting} onClick={() => answer(ask, 'talk')} style={BTN}>Let&apos;s talk</button>
                  <button type="button" disabled={waiting} onClick={() => { setReplyFor(ask.id); setReply('') }} style={BTN}>Not this time</button>
                </div>
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink)', fontWeight: 700, marginBottom: 6 }} htmlFor={`reply-${ask.id}`}>
                  A kind line back, if you like. {ask.child_name} will see it.
                </label>
                <input
                  id={`reply-${ask.id}`}
                  value={reply}
                  onChange={e => setReply(e.target.value.slice(0, REPLY_MAX))}
                  maxLength={REPLY_MAX}
                  placeholder="Good reason. Let's look at it again after half term."
                  style={{ width: '100%', boxSizing: 'border-box', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '11px 12px', fontSize: 'var(--text-md)', fontFamily: 'var(--font-body, inherit)', background: 'var(--white)', color: 'var(--ink)' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px', marginTop: '10px' }}>
                  <button type="button" disabled={waiting} onClick={() => answer(ask, 'not_now', reply)} style={{ ...BTN, background: 'var(--gold)', boxShadow: '0 5px 0 var(--gold-dark)' }}>
                    {waiting ? 'Sending' : 'Send'}
                  </button>
                  <button type="button" disabled={waiting} onClick={() => setReplyFor(null)} style={BTN}>Back</button>
                </div>
              </div>
            )}

            {failed === ask.id && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--danger)', margin: '8px 0 0' }}>That did not save. Have another go in a moment.</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
