'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import HappyIcon from '@/components/kid/HappyIcon'
import { currentChildId } from '@/lib/children/current'

// The way back from a welcome card.
//
// The hello sends a parent off to do a thing: add the PE kit, set up the jobs,
// turn on the check ins. Before this, that was a one way trip. They landed on
// Settings or Quests, finished, and were left on a page with no relationship to
// the day, having been pulled out of the one two minute habit the whole product
// runs on. Justin: once done, "take them back to home to start daily pathway if
// not done".
//
// So every welcome action carries ?from=welcome and this reads it, in the
// dashboard layout, once, for every destination. One place rather than a return
// link bolted onto seven pages, which is seven chances for one of them to be
// forgotten and strand somebody.
//
// It says "when you are done" rather than assuming they are. The bar cannot
// know whether the job is finished, and a bar that says "Done!" at a parent who
// has not started is the app talking over them.
export default function BackToToday() {
  const params = useSearchParams()
  const step = params.get('step')
  if (params.get('from') === 'today' && step && STEP_LINE[step]) return <StepDone step={step} childParam={params.get('child')} />
  if (params.get('from') !== 'welcome') return null

  // The spacing lives here, not in the layout, so a page without the param
  // pays nothing at all rather than carrying an empty padded wrapper.
  return (
    <div style={{ padding: '16px 20px 0', maxWidth: 720, margin: '0 auto' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'var(--terracotta-lt)', border: 'var(--edge)', boxShadow: 'var(--lift)',
      borderRadius: 'var(--radius-btn)', padding: '11px 14px', margin: '0 0 16px',
    }}>
      <span aria-hidden style={{
        flexShrink: 0, width: 36, height: 36, borderRadius: 11, background: '#fff', border: 'var(--edge)',
        boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><HappyIcon name="calendar" size={26} /></span>
      {/* Sentence and link share the flexible column so the words never get
          squeezed one a line beside a fixed pill at larger text sizes. */}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.45 }}>
          When you are done here, today is waiting.
        </span>
        <Link
          href="/dashboard"
          style={{
            display: 'inline-block', marginTop: 8, textDecoration: 'none', padding: '8px 13px',
            background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 'var(--radius-tile)',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            boxShadow: '0 3px 0 var(--terracotta-dark)',
          }}
        >
          Back to today
        </Link>
      </span>
    </div>
    </div>
  )
}

// ── DONE HERE, BACK TO THE PATH (17 October 2026) ───────────────────────────
//
// Justin, with his Home path: a step that takes the parent off the path must
// let them "mark as done so goes green otherwise they are stuck on digi
// instead of going back to path".
//
// Two rungs do their work off the path and had no way to finish there: DiGi
// went green only on a question asked, and the passport job (devices, most
// often) only on a whole section finished. The path links to both with
// from=today&step=<key>, and this bar is the other end of that link. One tap
// records the step (migration 382) and puts the parent back on the path, where
// the rung is now green.
//
// Unlike the welcome bar it CAN say done, because the parent is the one
// pressing it: it is their word, not the app guessing.
const STEP_LINE: Record<string, string> = {
  digi: 'Got what you needed from DiGi? Mark it done and carry on with today.',
  passport: 'Looked at this today? Mark it done and carry on with today.',
}

function StepDone({ step, childParam }: { step: string; childParam: string | null }) {
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)

  async function markDone() {
    setSaving(true)
    setFailed(false)
    const childId = childParam ?? currentChildId()
    try {
      const r = await fetch('/api/daily/mark-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, child_id: childId ?? undefined }),
      })
      if (!r.ok) throw new Error('not saved')
      // A full load rather than a client push, so Home is rebuilt from the
      // server and the rung arrives green rather than from a cached render.
      window.location.assign(`/dashboard${childId ? `?child=${encodeURIComponent(childId)}` : ''}#today`)
    } catch {
      setSaving(false)
      setFailed(true)
    }
  }

  return (
    <div style={{ padding: '12px 16px 0', maxWidth: 720, margin: '0 auto' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      background: 'var(--tint-sage)', border: 'var(--edge)', boxShadow: 'var(--lift)',
      borderRadius: 'var(--radius-btn)', padding: '10px 12px', margin: '0 0 12px',
    }}>
      <span style={{ flex: '1 1 180px', minWidth: 0, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.4 }}>
        {failed ? 'That did not save. Try once more?' : STEP_LINE[step]}
      </span>
      <button
        onClick={markDone}
        disabled={saving}
        style={{
          flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44,
          padding: '9px 16px', cursor: saving ? 'default' : 'pointer',
          // The road's own done green, so the button is the colour the rung
          // is about to turn.
          background: 'var(--retro-green)', color: 'var(--white)',
          border: 'var(--edge)', borderRadius: 16, boxShadow: '0 5px 0 var(--retro-green-dark)',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
          opacity: saving ? 0.7 : 1,
        }}
      >
        <span aria-hidden>✓</span>
        {saving ? 'Saving' : 'Done, back to today'}
      </button>
    </div>
    </div>
  )
}
