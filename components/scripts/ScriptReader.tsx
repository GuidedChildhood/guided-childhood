'use client'

import {
  eyebrow, sheet, sheetBand, dottedRule, sheetBody, stageAccent, stageCircle, chunky,
} from '@/components/scripts/card-system'

// The heart of a script: the line to say, made to feel like the single most
// important thing on the screen. A parent opens this in the heat of a hard
// moment, so the words they will actually say are set large and warm.
//
// It used to arrive as four separate white boxes, and four boxes read as four
// things to get through. It is one thing: the words for one moment. So it is
// one sheet now, butter, with the four steps as numbered blocks divided by a
// dotted rule, the way a good worksheet is laid out. Every supporting step is
// set at the same size, because none of them outranks the one beside it. Only
// the words to say are bigger, because they are the only part a parent is
// going to say out loud.

type Props = {
  sayThis: string
  notThis: string
  whyItWorks: string
  tonight: string
  stageId: string
}

export default function ScriptReader({ sayThis, notThis, whyItWorks, tonight, stageId }: Props) {
  const accent = stageAccent(stageId)

  // Every step opens the same way: the number circle and the mono label on one
  // baseline, so the eye walks the sequence 1 to 4 down one left edge.
  const head = (num: number, label: string, tone?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
      <span style={stageCircle(accent)}>{num}</span>
      <span style={{ ...eyebrow, color: tone ?? 'var(--terracotta-dark)' }}>{label}</span>
    </div>
  )

  return (
    <section style={sheet}>

      {/* The band, with the same convex arc the daily deck cards wear, so a
          script and a card read as one family. It names what the sheet is. */}
      <div style={sheetBand}>
        <div style={{ ...eyebrow, fontSize: 'var(--text-sm)', color: 'var(--ink)', opacity: 0.7 }}>
          The script
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
          color: 'var(--ink)', lineHeight: 1.1, letterSpacing: '-0.02em', marginTop: 2,
        }}>
          Four steps, in order
        </div>
      </div>

      <div style={{ padding: 'clamp(20px, 5vw, 26px)' }}>

        {/* ── 1 · Say this: the one thing on the page said out loud ─────── */}
        {head(1, 'Say this')}
        <blockquote style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 'clamp(26px, 7vw, 34px)',
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          textWrap: 'balance',
        }}>
          <span aria-hidden style={{ opacity: 0.35 }}>&ldquo;</span>{sayThis}<span aria-hidden style={{ opacity: 0.35 }}>&rdquo;</span>
        </blockquote>

        {/* ── HEAR IT ALOUD IS GONE (11 September 2026) ────────────────────
            Justin: "lets get rid of hear it aloud on scripts or anything else
            as not helpful unless you think there is better way to have
            something there?"

            Agreed, and the case against it is stronger than "not helpful".
            The one person who has to say these words is the parent, in their
            own voice, and a synthetic reading rehearses nothing. Worse, it is
            played in a house where the child is usually in the next room, so
            the likeliest outcome of the button is the child hearing an app
            read out the exact line about to be used on them. That is the worst
            thing that can happen to a script, and we had a button under the
            quote inviting it.

            NOTHING REPLACES IT, on purpose. The page already ends with the
            thing that earns the space: mark it used or not needed, which moves
            the pathway and retires the script from the recommender
            (ScriptStatusButtons, rendered by ScriptDetailView). A second
            control up here would only compete with the one that matters, and
            the quote is meant to be the hero of this block. */}

        <div style={dottedRule} />

        {/* ── 2 · Not this ─────────────────────────────────────────────── */}
        {head(2, 'Not this', 'var(--danger)')}
        <p style={{ ...sheetBody, color: 'var(--danger)', fontStyle: 'italic' }}>
          <span aria-hidden style={{ opacity: 0.5 }}>&ldquo;</span>{notThis}<span aria-hidden style={{ opacity: 0.5 }}>&rdquo;</span>
        </p>

        <div style={dottedRule} />

        {/* ── 3 · Why it works (the evidence) ──────────────────────────── */}
        {head(3, 'Why it works')}
        <p style={sheetBody}>{whyItWorks}</p>

        <div style={dottedRule} />

        {/* ── 4 · Tonight (the one action) ─────────────────────────────── */}
        {head(4, 'Tonight')}
        <p style={{ ...sheetBody, fontWeight: 600 }}>{tonight}</p>
      </div>

      <style>{`
        @keyframes sr-bar { 0%,100% { transform: scaleY(0.4) } 50% { transform: scaleY(1) } }
      `}</style>
    </section>
  )
}
