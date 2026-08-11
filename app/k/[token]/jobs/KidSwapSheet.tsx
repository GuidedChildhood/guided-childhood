'use client'

import { useState } from 'react'
import { type TodayQuest } from '@/components/kid/KidTodayList'
import { playKidSound } from '@/lib/sound/kidSounds'
import { KID_REQUEST_IDEAS } from '@/lib/quests/templates'

// The swap sheet: a child proposes trading one of today's jobs for a
// different task. Justin, 11 August 2026: "give child ability to click
// negotiate job so can change it to different task as gives them more
// control".
//
// It is an ASK, never a self serve change. The proposal rides the existing
// pitch pipeline (/api/quests/request with swapQuestId, migration 184), so
// the caps, the parent's yes/no on their board, and the child's status list
// all come for free. The old job stays on the list until the yes lands,
// which the sheet says plainly, because a job that vanished on the strength
// of the child's own tap would be the app overruling the parent.

export default function KidSwapSheet({ token, quest, onClose, onSent }: {
  token: string
  quest: TodayQuest
  onClose: () => void
  onSent: (message: string) => void
}) {
  const [custom, setCustom] = useState('')
  const [picked, setPicked] = useState<{ title: string; emoji: string } | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  // Their current job never offers itself as its own replacement.
  const ideas = KID_REQUEST_IDEAS.filter(i => i.title.toLowerCase() !== quest.title.toLowerCase())

  const choice = custom.trim().length >= 3
    ? { title: custom.trim().slice(0, 60), emoji: '⭐' }
    : picked

  async function send() {
    if (!choice || sending) return
    setSending(true); setError('')
    try {
      const res = await fetch('/api/quests/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, title: choice.title, emoji: choice.emoji, swapQuestId: quest.id }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.reason === 'daily_limit'
          ? 'That is enough asks for one day. Try again tomorrow.'
          : res.status === 429
            ? 'Your grown up has a few of your asks already. Wait for those first.'
            : 'That did not send. Try again.')
        setSending(false); return
      }
      playKidSound('tap')
      onSent(`Sent! Your grown up decides the swap. "${quest.title}" stays on your list until they say yes.`)
    } catch {
      setError('That did not send. Try again.')
      setSending(false)
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 120, background: 'rgba(26,26,46,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 560, maxHeight: '86dvh', overflowY: 'auto', background: 'var(--cream)', borderRadius: '24px 24px 0 0', padding: '20px 18px calc(20px + env(safe-area-inset-bottom))' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.2, margin: 0 }}>
            Swap {quest.emoji} {quest.title}?
          </h2>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', fontSize: 'var(--text-lg)', color: 'var(--ink-muted)', flexShrink: 0 }}>✕</button>
        </div>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
          Pick the job you would rather do, or write your own. Your grown up gets the swap to say yes or no, and this one stays on your list until they answer.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {ideas.map(i => {
            const on = picked?.title === i.title && custom.trim().length < 3
            return (
              <button
                key={i.title}
                onClick={() => { setPicked(i); setCustom('') }}
                aria-pressed={on}
                style={{
                  padding: '10px 14px', borderRadius: 100, cursor: 'pointer',
                  border: on ? '2px solid var(--terracotta-dark)' : '1.5px solid var(--border)',
                  background: on ? 'var(--terracotta-lt)' : '#fff',
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)',
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                }}
              >
                <span aria-hidden>{i.emoji}</span>
                <span>{i.title}</span>
                {on && <span aria-hidden style={{ color: 'var(--terracotta-dark)', fontWeight: 800 }}>✓</span>}
              </button>
            )
          })}
        </div>

        <input
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send() }}
          maxLength={60}
          placeholder="Or write your own idea…"
          style={{ width: '100%', padding: '13px 15px', borderRadius: 14, border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', outline: 'none', marginBottom: 14 }}
        />

        <button
          onClick={send}
          disabled={!choice || sending}
          style={{
            width: '100%', padding: '15px', cursor: choice ? 'pointer' : 'default',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            color: 'var(--ink)', background: 'var(--terracotta)',
            border: 'none', borderRadius: 16,
            boxShadow: '0 5px 0 var(--terracotta-dark)',
            opacity: choice && !sending ? 1 : 0.55,
          }}
        >
          {sending ? 'Sending…' : 'Send the swap to my grown up'}
        </button>
        {error && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--danger)', margin: '10px 0 0', textAlign: 'center', fontWeight: 700 }}>{error}</p>}
      </div>
    </div>
  )
}
