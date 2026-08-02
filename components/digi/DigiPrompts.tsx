'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'

type Prompt = { id: string; kind: string; title: string; body: string; href?: string | null; outcome_id?: string | null }

const KIND_LABEL: Record<string, string> = {
  watch_for: 'Worth watching this week',
  tip: 'A small improvement',
  parent_care: 'For you, not the kids',
  new_research: 'New research',
  celebration: 'Worth celebrating',
  school: 'From school',
  // DiGi said it would come back and ask. The label has to read as a promise
  // being kept rather than as another notification, or the whole point of it is
  // lost at the moment a parent looks at their screen.
  follow_up: 'Checking back, as promised',
}

// DiGi leads: proactive prompts generated from this family's own data and
// the expert knowledge base, surfaced before the parent asks anything.
//
// ONE card, not a stack. This used to map over every live prompt, so a family
// with three of them met three full width cards in a row, each with the same
// star avatar and each carrying about ten lines of body text. Stacked, they
// read as one essay, and Justin ended up scrolling past his own advice.
//
// The rule now, and it is Justin's own answer to how the whole notification
// layer should work: short factual nudges, plus ONE reflective card from DiGi.
// SmartAlerts underneath is the short factual half. This is the one card.
//
// Mobbin first, per CLAUDE.md, and four apps independently agree. Withings
// Health Mate splits Highlights, a single big card, from Read, a list of
// compact rows. Plenty of Fish does For you then Latest the same way. Apple
// Store follows its activity cards with a compact row. And komoot puts Show
// more under a long body rather than printing all of it, which is where the
// two line clamp below comes from: the whole thought is still there, it just
// waits to be asked for.
//
// The rest of the prompts are not thrown away. They are rows in the database
// with their own status, so dismissing this one brings the next one forward,
// and anything untouched is simply there tomorrow. A quieter Home does not
// mean less thinking, it means less of it shouted at once.
export default function DigiPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch('/api/digi/prompts')
      .then(r => r.json())
      .then(d => setPrompts(d.prompts ?? []))
      .catch(() => {})
  }, [])

  const dismiss = async (id: string) => {
    setPrompts(p => p.filter(x => x.id !== id))
    try {
      await fetch('/api/digi/prompts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'dismissed' }),
      })
    } catch { /* non-blocking */ }
  }

  if (prompts.length === 0) return null

  // The one card. Anything else waits its turn.
  const p = prompts[0]
  const waiting = prompts.length - 1

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        background: '#fff', border: '1.5px solid var(--border)',
        borderRadius: '20px', padding: '18px 20px 16px',
        boxShadow: '0 4px 18px rgba(26,26,46,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '13px', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DigiCharacter mood={p.kind === 'celebration' ? 'happy' : 'speak'} size={30} />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
              {KIND_LABEL[p.kind] ?? 'From DiGi'}
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.25, marginTop: '3px' }}>
              {p.title}
            </span>
          </span>
        </div>

        {/* Two lines, then Read the rest. The body is often ten lines of real
            thinking, which is the right amount to have written and the wrong
            amount to put in front of somebody scrolling their Home at 8am. */}
        <p style={{
          fontSize: '17px', color: 'var(--ink-soft)', lineHeight: 1.68, margin: '0 0 10px',
          ...(open ? {} : {
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }),
        }}>
          {p.body}
        </p>
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 14px',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.06em', color: 'var(--terracotta-dark)',
          }}
        >
          {open ? 'Show less' : 'Read the rest'}
        </button>

        {/* A follow up card ANSWERS, everything else acts.

            DiGi promised to come back and ask how something went, and until now
            the only thing a parent could do with that question was dismiss it.
            We kept the promise and binned the answer, which is the one part of
            the loop the rest of the learning depends on.

            Three taps, an optional line, and nothing required. "Not really" is
            the most valuable answer in here, so it gets equal weight and equal
            size rather than being tucked away as the awkward option, and it is
            the only one that opens something instead of closing it. */}
        {p.kind === 'follow_up' && p.outcome_id ? (
          <FollowUpAnswer
            outcomeId={p.outcome_id}
            promptId={p.id}
            onAnswered={() => { setOpen(false); setPrompts(list => list.filter(x => x.id !== p.id)) }}
          />
        ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link
            href={p.href ?? `/dashboard/digi?q=${encodeURIComponent(`You flagged: ${p.title}. Can we talk it through?`)}`}
            onClick={() => { if (p.href) dismiss(p.id) }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
              borderRadius: '13px', padding: '10px 16px',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}
          >
            {p.href ? 'Open Lessons' : 'Talk it through'}
            <span style={{ fontSize: 'var(--text-md)' }} aria-hidden>→</span>
          </Link>
          <button
            onClick={() => { setOpen(false); dismiss(p.id) }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}
          >
            Dismiss
          </button>
        </div>
        )}

        {/* Said quietly, so a parent knows there is more thinking here without
            it being pushed at them. Dismissing this brings the next one up. */}
        {waiting > 0 && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.05em', color: 'var(--ink-light)', margin: '12px 0 0' }}>
            {waiting} more when you want {waiting === 1 ? 'it' : 'them'}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * How did that go. Three answers, one optional line.
 *
 * THE WORDING IS THE FEATURE. If saying "it did not work" feels like a
 * complaint, every answer skews kind and the ledger fills with flattery that
 * has a count attached to it. So the third option is worded as information
 * rather than criticism, it is the same size as the other two, and the line
 * underneath says plainly that it is the useful one.
 *
 * It is also the only answer that opens something. A parent who has just told
 * us a suggestion failed has done us a favour, and answering that with a tick
 * and silence is the fastest way to teach them not to bother next time. They
 * go straight into DiGi with the thread loaded, so what they get back is a
 * different idea.
 */
const ANSWERS: { verdict: 'worked' | 'partly' | 'no'; label: string; bg: string; border: string }[] = [
  { verdict: 'worked', label: 'It worked', bg: 'var(--tint-green)', border: 'var(--retro-green)' },
  { verdict: 'partly', label: 'Helped a bit', bg: 'var(--stage-1)', border: '#D9B94E' },
  { verdict: 'no', label: 'Not really', bg: 'var(--terracotta-lt)', border: 'var(--terracotta)' },
]

function FollowUpAnswer({
  outcomeId, promptId, onAnswered,
}: { outcomeId: string; promptId: string; onAnswered: () => void }) {
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  async function answer(verdict: 'worked' | 'partly' | 'no') {
    if (busy) return
    setBusy(verdict)
    try {
      const res = await fetch('/api/digi/outcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcomeId, promptId, verdict, note }),
      })
      const json = await res.json().catch(() => ({}))
      // A hard navigation rather than a router push, because the DiGi page
      // reads its opening question from the query string on load.
      if (json?.nextStep?.href) {
        window.location.href = `${json.nextStep.href}?q=${encodeURIComponent(json.nextStep.message)}`
        return
      }
      onAnswered()
    } catch {
      // The verdict is worth more than the tidy up. Leaving the card in place
      // means they can try again rather than losing the answer silently.
      setBusy(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {ANSWERS.map(a => (
          <button
            key={a.verdict}
            onClick={() => answer(a.verdict)}
            disabled={!!busy}
            style={{
              flex: '1 1 100px', background: a.bg, border: `1.5px solid ${a.border}`,
              borderRadius: 13, padding: '11px 12px', cursor: busy ? 'default' : 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
              color: 'var(--ink)', opacity: busy && busy !== a.verdict ? 0.45 : 1,
            }}
          >
            {busy === a.verdict ? 'Saving...' : a.label}
          </button>
        ))}
      </div>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Anything you want to add, in your own words. Optional."
        rows={2}
        style={{
          width: '100%', marginTop: 10, padding: '10px 12px', resize: 'vertical',
          border: '1.5px solid var(--border)', borderRadius: 12, background: 'var(--cream)',
          fontFamily: 'inherit', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5,
        }}
      />
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.45, margin: '8px 0 0' }}>
        Not really is the most useful answer here. It is how DiGi learns what to suggest you instead.
      </p>
    </div>
  )
}
