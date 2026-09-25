'use client'

import { useRef, useState } from 'react'
import { preparePhoto, type PreparedPhoto } from '@/lib/school/photo'

// ── STUCK? A HINT, NOT AN ANSWER (25 September 2026) ────────────────────────
//
// Justin: "a click here for homework help where they can upload an image or
// type the homework, and DiGi gives them an idea of how it links to the
// curriculum, tips, ideas and asks questions... stress free." And the line he
// drew: "as long as the child does not access the LLM version."
//
// So this is a card, not a chat. The child types the question or snaps it, and
// gets one card back: what it is practising, what the teacher is looking for,
// one hint, one thing to try. "Another hint" goes one step further, three at
// most, and the third is a worked example on a DIFFERENT question. There is no
// box to say anything else to DiGi, so there is nothing to chat to.
//
// Under 10 (lib/homework/help, checked on the server too) the same button asks
// their grown up instead, with a push to the parent's phone.
//
// The photo is shrunk in the browser and read once. Neither it nor the text is
// kept anywhere.

type Card = {
  onTopic: boolean
  subject: string
  about: string
  teacherWants: string
  hint: string
  tryThis: string
  level: number
  maxLevel: number
  curriculum: { yearGroup: number | null; strand: string; objective: string } | null
  minutes: string
}

const BOX: React.CSSProperties = {
  background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 'var(--radius-card)',
  padding: '16px 18px', marginBottom: 14, boxShadow: '0 5px 0 rgba(26,26,46,0.08)',
}
const EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 6px',
}
const BIG_BUTTON: React.CSSProperties = {
  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, width: '100%', padding: '14px 18px',
  border: 'var(--edge)', borderRadius: 16, cursor: 'pointer', background: 'var(--terracotta)', color: 'var(--ink)',
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', boxShadow: '0 5px 0 var(--terracotta-dark)',
}
const QUIET_BUTTON: React.CSSProperties = {
  ...BIG_BUTTON, background: '#fff', boxShadow: '0 5px 0 var(--ink)', fontWeight: 800,
}

export default function HomeworkHelp({ token, childName, canHint }: { token: string; childName?: string; canHint: boolean }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState<PreparedPhoto | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [card, setCard] = useState<Card | null>(null)
  const [hints, setHints] = useState<string[]>([])
  const [unsafe, setUnsafe] = useState(false)
  const [sent, setSent] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function askGrownUp() {
    setBusy(true); setError('')
    const res = await fetch('/api/kid/homework-help', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, mode: 'grownup' }),
    }).catch(() => null)
    const d = res ? await res.json().catch(() => null) : null
    setBusy(false)
    if (d?.ok) setSent(true)
    else setError(d?.message ?? 'That did not send. Go and find them instead.')
  }

  async function getHint(level: number) {
    if (busy) return
    setBusy(true); setError('')
    const res = await fetch('/api/kid/homework-help', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token, mode: 'hint', text, level, previous: hints,
        image: photo ? { media_type: photo.mediaType, base64: photo.base64 } : undefined,
      }),
    }).catch(() => null)
    const d = res ? await res.json().catch(() => null) : null
    setBusy(false)
    if (!d?.ok) { setError(d?.message ?? 'DiGi could not look just then. Have another go.'); return }
    if (d.safe === false) { setUnsafe(true); return }
    setCard(d as Card)
    if (d.hint) setHints(h => [...h, d.hint as string])
  }

  async function onPhoto(file: File | undefined) {
    if (!file) return
    setError('')
    try { setPhoto(await preparePhoto(file)) } catch { setError('That photo did not work. Try again, or type the question.') }
  }

  function startAgain() {
    setCard(null); setHints([]); setText(''); setPhoto(null); setUnsafe(false); setError('')
  }

  // ── Closed: one line, one button ─────────────────────────────────────────
  if (!open) {
    return (
      <section data-homework-help style={{ ...BOX, marginTop: 18 }}>
        <p style={EYEBROW}>Stuck?</p>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 12px', lineHeight: 1.25 }}>
          {canHint ? 'Get a hint from DiGi' : 'Ask your grown up for a hand'}
        </p>
        <button onClick={() => setOpen(true)} style={BIG_BUTTON}>
          <span aria-hidden>💡</span> {canHint ? 'Help me with a question' : 'Get help'}
        </button>
      </section>
    )
  }

  // ── Under 10: the grown up ───────────────────────────────────────────────
  if (!canHint) {
    return (
      <section data-homework-help style={{ ...BOX, marginTop: 18 }}>
        <p style={EYEBROW}>Homework help</p>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
          {sent
            ? 'Done. Your grown up has a message on their phone. Five minutes together is all it takes.'
            : 'Homework is best with your grown up at your age. Tap and they get a message to come and help.'}
        </p>
        {!sent && (
          <button onClick={askGrownUp} disabled={busy} style={{ ...BIG_BUTTON, opacity: busy ? 0.6 : 1 }}>
            {busy ? 'Sending...' : 'Ask my grown up'}
          </button>
        )}
        {error && <p style={{ color: 'var(--danger, #B4453C)', fontWeight: 600, margin: '10px 0 0' }}>{error}</p>}
      </section>
    )
  }

  // ── Something worrying: a grown up, not a hint ───────────────────────────
  if (unsafe) {
    return (
      <section data-homework-help style={{ ...BOX, marginTop: 18 }}>
        <p style={EYEBROW}>DiGi says</p>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 14px' }}>
          This sounds like something to talk about with a grown up you trust. They would really want to know.
        </p>
        <button onClick={askGrownUp} disabled={busy || sent} style={BIG_BUTTON}>{sent ? 'Message sent' : 'Tell my grown up'}</button>
        <button onClick={startAgain} style={{ ...QUIET_BUTTON, marginTop: 12 }}>Back to homework</button>
      </section>
    )
  }

  // ── The card ─────────────────────────────────────────────────────────────
  if (card) {
    const canMore = card.onTopic && card.level < card.maxLevel
    return (
      <section data-homework-help data-hint-level={card.level} style={{ marginTop: 18 }}>
        {!card.onTopic ? (
          <div style={BOX}>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>{card.about || 'DiGi only helps with homework here.'}</p>
          </div>
        ) : (
          <>
            <div style={BOX}>
              <p style={EYEBROW}>{card.subject || 'Your homework'}{card.curriculum?.yearGroup ? ` · Year ${card.curriculum.yearGroup}` : ''}</p>
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 8px' }}>{card.about}</p>
              {card.teacherWants && (
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
                  <strong style={{ color: 'var(--ink)' }}>Your teacher is looking for:</strong> {card.teacherWants}
                </p>
              )}
              {card.curriculum && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.45, margin: '8px 0 0' }}>
                  From the national curriculum, {card.curriculum.strand.toLowerCase()}: {card.curriculum.objective}
                </p>
              )}
            </div>
            <div style={{ ...BOX, background: 'var(--terracotta-lt)' }}>
              <p style={EYEBROW}>Hint {card.level} of {card.maxLevel}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.45, margin: 0 }}>💡 {card.hint}</p>
            </div>
            {card.tryThis && (
              <div style={BOX}>
                <p style={EYEBROW}>Try this</p>
                <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>{card.tryThis}</p>
              </div>
            )}
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '0 0 14px', textAlign: 'center' }}>
              ⏱ {card.minutes}
            </p>
          </>
        )}
        {canMore && (
          <button onClick={() => getHint(card.level + 1)} disabled={busy} style={{ ...QUIET_BUTTON, marginBottom: 12, opacity: busy ? 0.6 : 1 }}>
            {busy ? 'DiGi is thinking...' : 'Still stuck? Another hint'}
          </button>
        )}
        <button onClick={startAgain} style={BIG_BUTTON}>{card.onTopic ? 'Got it, thanks DiGi' : 'Try again'}</button>
        {error && <p style={{ color: 'var(--danger, #B4453C)', fontWeight: 600, margin: '10px 0 0' }}>{error}</p>}
      </section>
    )
  }

  // ── Asking ───────────────────────────────────────────────────────────────
  const ready = text.trim().length >= 3 || !!photo
  return (
    <section data-homework-help style={{ ...BOX, marginTop: 18 }}>
      <p style={EYEBROW}>Homework help</p>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
        {childName ? `${childName}, type` : 'Type'} the question you are stuck on, or take a photo of it. DiGi gives you a hint, never the answer.
      </p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        maxLength={1500}
        placeholder="e.g. Question 4: what is 3/8 of 24?"
        style={{
          width: '100%', boxSizing: 'border-box', resize: 'vertical',
          border: '1.5px solid rgba(26,26,46,0.12)', borderRadius: 'var(--radius-tile)',
          padding: '12px 13px', background: 'var(--cream)', color: 'var(--ink)',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', lineHeight: 1.5, marginBottom: 10,
        }}
      />
      <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={e => onPhoto(e.target.files?.[0])} />
      <button onClick={() => fileRef.current?.click()} style={{ ...QUIET_BUTTON, marginBottom: 12 }}>
        <span aria-hidden>📷</span> {photo ? 'Photo added. Take another' : 'Take a photo of it'}
      </button>
      <button onClick={() => getHint(1)} disabled={!ready || busy} style={{ ...BIG_BUTTON, opacity: !ready || busy ? 0.55 : 1, cursor: !ready || busy ? 'default' : 'pointer' }}>
        {busy ? 'DiGi is thinking...' : 'Give me a hint'}
      </button>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.45, margin: '10px 0 0', textAlign: 'center' }}>
        Your photo and question are not kept.
      </p>
      {error && <p style={{ color: 'var(--danger, #B4453C)', fontWeight: 600, margin: '10px 0 0' }}>{error}</p>}
    </section>
  )
}
