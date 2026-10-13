'use client'

import { useEffect, useState } from 'react'
import { card, cardPad, eyebrow, sheet, dottedRule, sheetBody, stageAccent, chunky } from '@/components/scripts/card-system'

// The deeper half of every script: what to say when the child pushes
// back, how to check back later in the week, and a short note written
// for the child. The note never leaves through us. It opens the
// parent's own Messages app, ready to send from them.
//
// ── PER FIELD, 12 October 2026 ──────────────────────────────────────────────
//
// This used to ask one question: are all three fields present? If not, it hid
// everything behind "DiGi is writing the deeper half of this script" and
// called the expand route, which regenerated and wrote back all three.
//
// On the live table 54 scripts had a hand written push back reply and follow
// up and no child note. All or nothing read those as unexpanded, so a parent
// opening one saw the loading line instead of the prose that was already
// there, and the route overwrote that prose with generated text, every view.
//
// So the unit is the field here too. What is stored renders immediately, the
// route is asked only for the gaps, and the writing line sits in the gap
// rather than over the whole thing.
//
// ── NO NUMBERS ──────────────────────────────────────────────────────────────
//
// These were steps 5 and 6 of a numbered sequence. The numbering came off the
// first four blocks in ScriptReader for a reason (they are not a sequence),
// and a 5 and a 6 left behind would be a sequence starting at five. Same stage
// coloured bar and mono label as the reader, so the page reads as one sheet.

type Expansion = {
  ifTheyPushBack: string
  checkBack: string
  forYourChild: string
}

type Props = {
  sortOrder: number
  initial: Partial<Expansion>
  childName: string | null
  childPhone: string | null
  childId: string | null
  childHasApp: boolean
  stageId: string
}

const DEEP_STEPS = [
  { key: 'ifTheyPushBack' as const, label: 'If they push back' },
  { key: 'checkBack' as const, label: 'Check back in a few days' },
]

const FIELDS = ['ifTheyPushBack', 'checkBack', 'forYourChild'] as const

const YOUNG_STAGES = ['foundation', 'builder']

export default function ScriptDepth({ sortOrder, initial, childName, childPhone, childId, childHasApp, stageId }: Props) {
  // Trimmed, because a column holding a single space is an empty field with a
  // character in it and would otherwise render as a blank block forever.
  const missing = FIELDS.filter(k => !initial[k]?.trim())
  const hasAll = missing.length === 0

  const [expansion, setExpansion] = useState<Partial<Expansion>>(initial)
  const [loading, setLoading] = useState(!hasAll)
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<string | null>(null)

  useEffect(() => {
    if (hasAll) return
    let cancelled = false
    fetch('/api/scripts/expand', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sortOrder }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        // Merged over what is already here, never under it, so a field the
        // team wrote survives even if the route ever answers with a null.
        if (!cancelled && data) {
          setExpansion(prev => {
            const next = { ...prev }
            for (const k of FIELDS) if (data[k]) next[k] = String(data[k])
            return next
          })
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [sortOrder, hasAll])

  const note = expansion.forYourChild?.trim() || null
  const smsHref = note && childPhone
    ? `sms:${childPhone.replace(/\s/g, '')}?&body=${encodeURIComponent(note)}`
    : null
  const isYoung = YOUNG_STAGES.includes(stageId)
  const accent = stageAccent(stageId)

  const share = () => {
    if (!note) return
    if (navigator.share) {
      navigator.share({ text: note }).catch(() => {})
    } else {
      copy()
    }
  }

  // Send the note straight to the child's own app, where it is kept to read
  // again, and pings their phone. Only for a child who has their app set up.
  const sendToApp = async () => {
    if (!note || !childId || sending) return
    setSending(true)
    setSent(null)
    try {
      const res = await fetch('/api/child-share', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, kind: 'note', title: `A note for ${childName ?? 'you'}`, body: note, ref: String(sortOrder) }),
      })
      const d = await res.json().catch(() => ({}))
      if (res.ok && d.ok) {
        setSent(d.hasApp
          ? `Sent to ${childName ?? 'their'}'s app 💛 It is on their phone and saved for them to read again.`
          : `Saved to ${childName ?? 'their'}'s app 💛 They will see it next time they open their page.`)
      } else {
        setSent('Could not send just now. You can still copy it and share it your way.')
      }
    } catch {
      setSent('Could not send just now. You can still copy it and share it your way.')
    }
    setSending(false)
  }

  const copy = () => {
    if (!note) return
    navigator.clipboard?.writeText(note).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  // Same head treatment as ScriptReader: the stage coloured bar and a mono
  // label, no number and no circle.
  const head = (label: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
      <span aria-hidden style={{
        width: 4, height: 15, borderRadius: 2, flexShrink: 0, background: accent.fill,
      }} />
      <span style={{ ...eyebrow, color: 'var(--terracotta-dark)' }}>{label}</span>
    </div>
  )

  // The writing line, sized to sit in one block's place rather than over the
  // whole half.
  const writing = (
    <p style={{
      ...sheetBody, color: 'var(--ink-muted)', fontStyle: 'italic', margin: 0,
    }}>
      DiGi is writing this part...
    </p>
  )

  const deepVisible = DEEP_STEPS.filter(s => expansion[s.key]?.trim() || loading)
  const noteVisible = note || loading

  if (deepVisible.length === 0 && !noteVisible) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Continues the sheet the reader is on: one butter sheet, a dotted rule
          between blocks, the same body size, so the script reads as one thing
          being read down rather than two products stacked. */}
      {deepVisible.length > 0 && (
        <section style={sheet}>
          <div style={{ padding: 'clamp(18px, 4.5vw, 26px)' }}>
            {deepVisible.map((step, i) => (
              <div key={step.key}>
                {i > 0 && <div style={dottedRule} />}
                {head(step.label)}
                {expansion[step.key]?.trim()
                  ? <p style={{ ...sheetBody, maxWidth: '42ch' }}>{expansion[step.key]}</p>
                  : writing}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* The note for the child. Spoken words live in the DiGi blue pill,
          the chat speech treatment, and everything around them (the how to
          share it guidance, the buttons) is clean white process. No dark
          espresso grounds on this page. */}
      {noteVisible && (
        <div style={{ ...card, padding: cardPad }}>
          <div style={{ ...eyebrow, color: 'var(--terracotta-dark)', marginBottom: '12px' }}>
            A note for {childName ?? 'your child'}
          </div>

          {note ? (
            <p style={{
              fontSize: 'var(--text-lg)', color: '#1B2A4A', lineHeight: 1.6, marginBottom: '14px',
              fontStyle: 'italic', background: '#DCE7FB',
              borderRadius: '18px 18px 18px 6px', padding: '14px 16px',
            }}>
              {note}
            </p>
          ) : (
            <div style={{ marginBottom: '14px' }}>{writing}</div>
          )}

          {note && (
            <>
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '16px' }}>
                {isYoung
                  ? 'At this age there is no phone, so read it together at bedtime, or tuck it into a lunchbox. It always comes from you, we never message your child.'
                  : childHasApp
                  ? 'This lands in their own app and pings their phone, kept for them to read again. It always comes from you, we never message your child.'
                  : 'This shares the note from you, your own way. It always comes from you, we never message your child.'}
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {/* Send to their app is the way for a child who has it, no phone
                    number needed. The read together and copy paths stay for the
                    young ages and the no app families. */}
                {childHasApp && !isYoung && childId && (
                  <button onClick={sendToApp} disabled={sending} style={{ ...chunky('butter'), cursor: sending ? 'wait' : 'pointer' }}>
                    {sending ? 'Sending…' : `💛 Send to ${childName ?? 'their'}'s app`}
                  </button>
                )}
                {smsHref && (
                  <a href={smsHref} style={{
                    ...(childHasApp && !isYoung ? {} : chunky('butter')),
                    ...(childHasApp && !isYoung ? chunky('white') : {}),
                  }}>
                    Text it instead
                  </a>
                )}
                {!(childHasApp && !isYoung) && (
                  <button onClick={share} style={chunky('butter')}>
                    {smsHref ? 'Share another way' : `Share it with ${childName ?? 'your child'}`}
                  </button>
                )}
                <button
                  onClick={copy}
                  style={chunky('white')}
                >
                  {copied ? 'Copied ✓' : 'Copy the note'}
                </button>
              </div>
              {sent && (
                <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', fontWeight: 700, lineHeight: 1.5, margin: '12px 0 0' }}>{sent}</p>
              )}
            </>
          )}
        </div>
      )}

    </div>
  )
}
