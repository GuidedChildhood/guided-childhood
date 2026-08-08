'use client'

import { useState } from 'react'
import type { KidLesson } from '@/lib/quests/kid-lessons'

// TEST THEM ON IT, AT THE MOMENT YOU ARE SAYING YES.
//
// Justin, 8 August 2026: "can we give the parent a tool to check a lesson by
// asking the question and give them the answer, so when they get confirmation a
// lesson is done they can test them ... as this will be one of all lesson
// questions to pass the passport test when completed."
//
// The approval already asks a parent to agree that a lesson was learned, and
// until now the only evidence was that the child said so. Everything needed to
// do better already existed on both sides and nobody had joined it up: the
// quest is titled after the lesson, and the lesson holds its three questions
// and the right answer.
//
// THE ANSWER IS HIDDEN UNTIL ASKED FOR, and that is the whole design rather
// than a flourish. A parent reading the answer and the question together reads
// them out as one thing and the child agrees with the last thing they heard.
// Ask first, then check. It is the same reason a quiz card has two sides.
//
// It never blocks the approval and it never scores anybody. Justin's rule
// throughout is that this product does not do scoreboards, and a tool that
// turned "say yes" into "examine your child" would be one. The Yes button is
// untouched: this is here for the parent who wants to have the conversation,
// and invisible to the one who does not.

export default function LessonCheck({ lesson, childName }: {
  lesson: KidLesson
  childName?: string | null
}) {
  const [open, setOpen] = useState(false)
  // Which answers have been revealed, by question index. Per question rather
  // than one switch for the lot, so a parent can ask, check, ask, check.
  const [shown, setShown] = useState<Set<number>>(new Set())
  const who = childName && childName !== 'Your child' ? childName : 'them'

  if (lesson.questions.length === 0) return null

  return (
    <div style={{ marginTop: 8 }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          background: 'none', border: 'none', padding: '4px 0',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.04em', color: 'var(--terracotta-dark)',
        }}
      >
        {open ? 'Hide the questions' : `Test ${who} on it`}
        <span aria-hidden>{open ? '˅' : '›'}</span>
      </button>

      {open && (
        <div style={{
          marginTop: 8, background: 'var(--cream)', border: '1.5px solid var(--border)',
          borderRadius: 14, padding: '12px 13px',
        }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.45, margin: '0 0 10px' }}>
            The three they just answered. Ask out loud, then check.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {lesson.questions.map((q, i) => {
              const revealed = shown.has(i)
              return (
                <div key={i}>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                    color: 'var(--ink)', lineHeight: 1.4, margin: 0,
                  }}>
                    {q.q}
                  </p>

                  {revealed ? (
                    <p style={{
                      display: 'flex', gap: 7, alignItems: 'flex-start',
                      fontSize: 'var(--text-base)', color: 'var(--retro-green)',
                      fontWeight: 700, lineHeight: 1.4, margin: '6px 0 0',
                    }}>
                      <span aria-hidden style={{ flexShrink: 0 }}>✓</span>
                      <span>{q.options[q.answer]}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShown(prev => new Set(prev).add(i))}
                      style={{
                        marginTop: 6, cursor: 'pointer',
                        background: '#fff', border: '1.5px solid var(--border)', borderRadius: 100,
                        padding: '5px 12px',
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                        color: 'var(--ink-soft)',
                      }}
                    >
                      Show the answer
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Says out loud that this is not a test they can fail here. The
              approval is the parent's judgement, not a mark out of three. */}
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.45, margin: '12px 0 0' }}>
            Nothing here is scored. It is for the conversation, and these are the
            questions the passport test draws on later.
          </p>
        </div>
      )}
    </div>
  )
}
