'use client'

import { useState } from 'react'

// The sheet a child works through with a grown up.
//
// One line per objective, and beside each one the only control on the page:
// "found this tricky". That tick is the product. Not a score, not a mark, not a
// percentage. A place to help.
//
// The child is never shown a number, and the copy never implies one is being
// kept. A judged child stops flagging what they found hard, and the flag is the
// entire mechanism, so the moment this page starts counting it stops working.
//
// Ticking is deliberately the positive action. Saying "I found this tricky" has
// to feel like the useful, grown up thing to do rather than an admission, so the
// ticked state is warm rather than red, and the summary at the end thanks them
// for it instead of totting it up.

export type SheetObjective = { id: string; strand: string; objective: string }

export default function LearningSheet({
  childId, childName, yearGroup, subject, term, label, objectives,
}: {
  childId: string
  childName: string
  yearGroup: number
  subject: string
  term: string
  label: string
  objectives: SheetObjective[]
}) {
  const [tricky, setTricky] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState<{ id: string; stars: number; flagged: number } | null>(null)
  const [failed, setFailed] = useState(false)
  // The quest offered for what they flagged. Idle until asked for, because a
  // family who just wants to close the sheet should not have a job created for
  // them by having read to the bottom of the page.
  const [quest, setQuest] = useState<{ emoji: string; title: string; stars: number } | null>(null)
  const [questState, setQuestState] = useState<'idle' | 'busy' | 'failed'>('idle')

  const toggle = (id: string) => setTricky(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  async function finish() {
    if (saving) return
    setSaving(true)
    setFailed(false)
    try {
      const r = await fetch('/api/learning/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: childId, year_group: yearGroup, subject, term,
          tricky: [...tricky],
        }),
      })
      const d = await r.json().catch(() => ({}))
      if (r.ok && d.ok) setDone({ id: d.id, stars: d.stars, flagged: d.flagged })
      else setFailed(true)
    } catch { setFailed(true) }
    setSaving(false)
  }

  // The flags come back as one small job on the child's own phone. The server
  // reads the flagged objectives off the saved result rather than taking them
  // from here, so this only ever needs to say which sheet it was.
  async function makeQuest() {
    if (!done || questState === 'busy') return
    setQuestState('busy')
    try {
      const r = await fetch('/api/learning/make-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId: done.id }),
      })
      const d = await r.json().catch(() => ({}))
      if (r.ok && d.quest) { setQuest(d.quest); setQuestState('idle') }
      else setQuestState('failed')
    } catch { setQuestState('failed') }
  }

  // Grouped by strand, because that is how the objectives are taught and how a
  // parent will recognise them from a school report.
  const strands = [...new Set(objectives.map(o => o.strand))]

  if (done) {
    const flaggedNames = objectives.filter(o => tricky.has(o.id))
    return (
      <div style={{ background: 'var(--tint-sage)', border: '1.5px solid var(--retro-green)', borderRadius: 20, padding: '20px 22px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, color: 'var(--ink)', lineHeight: 1.15, marginBottom: 6 }}>
          All done, and {done.stars} stars in the bank
        </div>
        {flaggedNames.length === 0 ? (
          <p style={{ fontSize: 17, color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
            {childName} did not flag anything as tricky. Worth doing another one in a few weeks to see if that holds.
          </p>
        ) : (
          <>
            <p style={{ fontSize: 17, color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 12px' }}>
              Thank you for being honest about the hard bits, {childName}. These are the {flaggedNames.length === 1 ? 'one' : flaggedNames.length} to go over together, and nothing else:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {flaggedNames.map(o => (
                <li key={o.id} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginBottom: 8 }}>
                  <span aria-hidden style={{ flexShrink: 0 }}>💛</span>
                  <span style={{ fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.5 }}>{o.objective}</span>
                </li>
              ))}
            </ul>

            {/* And then something happens about it. A flag that is collected and
                filed teaches a child that saying they found something hard leads
                nowhere, so DiGi turns it into one small job on their own phone,
                worth stars like any other. Offered, never automatic: a family
                who has had enough for one afternoon closes the page. */}
            <div style={{ borderTop: '1.5px solid rgba(47,143,107,0.28)', marginTop: 16, paddingTop: 14 }}>
              {quest ? (
                <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 14, padding: '13px 15px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--retro-green-dark)', marginBottom: 5 }}>
                    On {childName}&apos;s phone now
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--ink)', lineHeight: 1.3 }}>
                    {quest.emoji} {quest.title}
                  </div>
                  <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0' }}>
                    Worth {quest.stars} {quest.stars === 1 ? 'star' : 'stars'} on weekdays. It sits on the Quests board with the rest, so switch it off there whenever it has done its job.
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 12px' }}>
                    DiGi can turn {flaggedNames.length === 1 ? 'that' : 'those'} into one small thing to practise, and put it on {childName}&apos;s phone for stars.
                  </p>
                  <button
                    onClick={makeQuest}
                    disabled={questState === 'busy'}
                    style={{
                      width: '100%', padding: '13px', cursor: questState === 'busy' ? 'default' : 'pointer',
                      background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 14,
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17,
                      boxShadow: '0 4px 0 var(--terracotta-dark)', opacity: questState === 'busy' ? 0.7 : 1,
                    }}
                  >
                    {questState === 'busy' ? 'Writing it' : 'Make it a quest'}
                  </button>
                  {questState === 'failed' && (
                    <p style={{ fontSize: 15, color: 'var(--terracotta-dark)', fontWeight: 700, margin: '10px 0 0' }}>
                      That did not go through. Have another go in a moment.
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      <div style={{ background: '#fff', border: '1.5px solid rgba(201,154,40,0.32)', borderRadius: 22, overflow: 'hidden', boxShadow: '0 4px 0 rgba(201,154,40,0.16)' }}>
        <div style={{ background: 'var(--terracotta)', padding: '14px 20px 20px', borderRadius: '0 0 50% 50% / 0 0 30px 30px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#4A3410', opacity: 0.75 }}>
            {label}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: '#3A2C0C', lineHeight: 1.2, letterSpacing: '-0.01em', marginTop: 2 }}>
            What {childName} should know by now
          </div>
        </div>

        <div style={{ padding: 'clamp(18px, 5vw, 24px)' }}>
          <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
            Go through these together. Tick anything {childName} found tricky. There is no score and nothing is marked, we only want to know where to help.
          </p>

          {strands.map(strand => (
            <div key={strand} style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 10 }}>
                {strand}
              </div>
              {objectives.filter(o => o.strand === strand).map(o => {
                const on = tricky.has(o.id)
                return (
                  <button
                    key={o.id}
                    onClick={() => toggle(o.id)}
                    aria-pressed={on}
                    style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start', width: '100%', textAlign: 'left',
                      background: on ? 'var(--terracotta-lt)' : '#fff',
                      border: `1.5px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                      borderRadius: 14, padding: '12px 13px', marginBottom: 8, cursor: 'pointer',
                    }}
                  >
                    <span aria-hidden style={{
                      flexShrink: 0, width: 26, height: 26, borderRadius: 9,
                      border: `1.5px solid ${on ? 'var(--terracotta-dark)' : 'var(--border)'}`,
                      background: on ? 'var(--terracotta)' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, lineHeight: 1,
                    }}>{on ? '💛' : ''}</span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 17, color: 'var(--ink)', lineHeight: 1.45 }}>{o.objective}</span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: on ? 'var(--terracotta-dark)' : 'var(--ink-muted)', marginTop: 4 }}>
                        {on ? 'Found this tricky' : 'Tap if tricky'}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {failed && (
        <p style={{ fontSize: 16, color: 'var(--terracotta-dark)', fontWeight: 700, margin: '12px 0 0' }}>
          That did not save. Have another go in a moment.
        </p>
      )}

      <button
        onClick={finish}
        disabled={saving}
        style={{
          width: '100%', marginTop: 16, padding: '15px', cursor: saving ? 'default' : 'pointer',
          background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 16,
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18,
          boxShadow: '0 5px 0 var(--terracotta-dark)', opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? 'Saving' : `We have finished this one · ⭐ 5`}
      </button>
      <p style={{ fontSize: 14.5, color: 'var(--ink-muted)', lineHeight: 1.5, margin: '10px 0 0', textAlign: 'center' }}>
        {tricky.size === 0
          ? 'Nothing ticked yet, which is a fine answer too.'
          : `${tricky.size} to go over together.`}
      </p>
    </div>
  )
}
