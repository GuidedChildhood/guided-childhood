'use client'

import { useEffect, useState } from 'react'

// The deeper half of every script: what to say when the child pushes
// back, how to check back later in the week, and a short note written
// for the child. The note never leaves through us. It opens the
// parent's own Messages app, ready to send from them.

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
  { num: 5, key: 'ifTheyPushBack' as const, label: 'If they push back', bg: 'var(--stage-4)', border: 'var(--stage-4)' },
  { num: 6, key: 'checkBack' as const, label: 'Check back in a few days', bg: 'var(--stage-1)', border: 'var(--stage-1)' },
]

const YOUNG_STAGES = ['foundation', 'builder']

export default function ScriptDepth({ sortOrder, initial, childName, childPhone, childId, childHasApp, stageId }: Props) {
  const hasAll = !!(initial.ifTheyPushBack && initial.checkBack && initial.forYourChild)
  const [expansion, setExpansion] = useState<Expansion | null>(
    hasAll ? (initial as Expansion) : null
  )
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
        if (!cancelled && data?.ifTheyPushBack) setExpansion(data)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [sortOrder, hasAll])

  const note = expansion?.forYourChild ?? null
  const smsHref = note && childPhone
    ? `sms:${childPhone.replace(/\s/g, '')}?&body=${encodeURIComponent(note)}`
    : null
  const isYoung = YOUNG_STAGES.includes(stageId)

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

  if (loading) {
    return (
      <div style={{
        background: 'var(--cream)', border: '1.5px dashed var(--border)', borderRadius: '16px',
        padding: '20px 22px', marginBottom: '28px', textAlign: 'center',
      }}>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
          DiGi is writing the deeper half of this script, the push back reply, the follow up and a note for your child...
        </p>
      </div>
    )
  }

  if (!expansion) return null

  return (
    <div style={{ marginBottom: '28px' }}>

      {/* Steps 5 and 6, same shape as the first four */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
        {DEEP_STEPS.map(step => (
          <div key={step.num} style={{
            background: step.bg, border: `1.5px solid ${step.border}`,
            borderRadius: '16px', padding: '22px', display: 'flex', gap: '18px',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--terracotta)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: 800, flexShrink: 0,
              fontFamily: 'var(--font-display)',
            }}>
              {step.num}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--terracotta)', marginBottom: '10px',
              }}>
                {step.label}
              </div>
              <p style={{ fontSize: '17px', color: 'var(--ink)', lineHeight: 1.72 }}>
                {expansion[step.key]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* The note for the child. Spoken words live in the DiGi blue pill,
          the chat speech treatment, and everything around them (the how to
          share it guidance, the buttons) is clean white process. No dark
          espresso grounds on this page. */}
      <div style={{
        background: '#fff', border: '1.5px solid var(--border)',
        borderRadius: '16px', padding: '22px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--terracotta-dark)', marginBottom: '10px',
        }}>
          A note for {childName ?? 'your child'}
        </div>

        <p style={{
          fontSize: '17px', color: '#1B2A4A', lineHeight: 1.6, marginBottom: '14px',
          fontStyle: 'italic', background: '#DCE7FB',
          borderRadius: '4px 16px 16px 16px', padding: '14px 16px',
        }}>
          {note}
        </p>

        <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '16px' }}>
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
            <button onClick={sendToApp} disabled={sending} className="btn btn-gold" style={{ padding: '10px 18px', fontSize: '12px', cursor: sending ? 'wait' : 'pointer' }}>
              {sending ? 'Sending…' : `💛 Send to ${childName ?? 'their'}'s app`}
            </button>
          )}
          {smsHref && (
            <a href={smsHref} className={childHasApp && !isYoung ? '' : 'btn btn-gold'} style={{
              padding: '10px 18px', fontSize: '12px', textDecoration: 'none',
              ...(childHasApp && !isYoung ? { background: 'var(--white)', color: 'var(--ink)', border: '1.5px solid var(--border)', borderRadius: '16px', fontFamily: 'var(--font-display)', fontWeight: 700, boxShadow: '0 3px 0 var(--border)' } : {}),
            }}>
              Text it instead
            </a>
          )}
          {!(childHasApp && !isYoung) && (
            <button onClick={share} className="btn btn-gold" style={{ padding: '10px 18px', fontSize: '12px', cursor: 'pointer' }}>
              {smsHref ? 'Share another way' : `Share it with ${childName ?? 'your child'}`}
            </button>
          )}
          <button
            onClick={copy}
            style={{
              padding: '10px 18px', fontSize: '12px', cursor: 'pointer',
              background: 'var(--white)', color: 'var(--ink)',
              border: '1.5px solid var(--border)', borderRadius: '16px',
              fontFamily: 'var(--font-display)', fontWeight: 700,
              boxShadow: '0 3px 0 var(--border)',
            }}
          >
            {copied ? 'Copied ✓' : 'Copy the note'}
          </button>
        </div>
        {sent && (
          <p style={{ fontSize: '14px', color: 'var(--ink)', fontWeight: 700, lineHeight: 1.5, margin: '12px 0 0' }}>{sent}</p>
        )}
      </div>

    </div>
  )
}
