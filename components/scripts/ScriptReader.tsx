'use client'

import { useState } from 'react'
import {
  eyebrow, sheet, dottedRule, sheetBody, stageAccent,
} from '@/components/scripts/card-system'

// The heart of a script: the line to say, made to feel like the single most
// important thing on the screen, and placed where a parent can reach it
// without scrolling.
//
// ── WHY THIS WAS REBUILT, 12 October 2026 ───────────────────────────────────
//
// Justin: "make sure the scripts page fits great on mobile and is extremely
// useful, really makes everything important stand out and workable."
//
// Rendered at 390px, the first screen of a script contained NOT ONE WORD a
// parent could say. Roughly 460 to 520px of furniture came first: a back link,
// a Try as deck button, two chips, the title, the situation set at 19px with
// no clamp, a read tick, a search link, a ban note, and then a band announcing
// "Four steps, in order". The words were below all of it. A parent standing in
// the kitchen with the child in front of them had to scroll to find them.
//
// ── THE FOUR STEPS WERE NEVER STEPS ─────────────────────────────────────────
//
// Say this, not this, why it works and tonight were numbered 1 to 4 and
// introduced as a sequence to work through. They are not a sequence. One is a
// thing you say, one is an anti example you must never say, one is theory for
// a calm moment, and the fourth is a thing you were meant to do BEFORE any of
// it. A parent following them in order would prepare last.
//
// So the numbering goes and each block is labelled by its job. The eye still
// walks one left edge, but it is no longer being told to walk it in order.
//
// ── AND THE ORDER CHANGED, ON THE EVIDENCE ──────────────────────────────────
//
// `tonight` is the most evidenced field in the whole record and it rendered
// last. Hiniker 2016 (CHI, observational): previously agreed rules accounted
// for only 9 percent of endings, and endings the parent's voice called went
// worse than endings the content or the device called. Wilder 2005: antecedent
// strategies did nothing without follow through. Gollwitzer and Sheeran 2006,
// 94 tests, d = 0.65: the active ingredient is a cue paired with a response,
// formed IN ADVANCE.
//
// It moves up to third and is labelled Before the moment, which is what it is.
// It does not go first, because the parent who opens this at seven in the
// evening has already missed the before and needs the words now. The ordering
// serves the person in the moment; the labelling tells the person preparing
// what they are looking at.
//
// Why it works is the only block allowed to collapse. Rationale is
// preparation, and under stress it is noise. Everything a parent might say
// out loud stays open, because an accordion costs a tap and hides the
// existence of the content, and remembering to look is exactly the memory
// stress takes away.

type Props = {
  sayThis: string
  notThis: string
  whyItWorks: string
  tonight: string
  stageId: string
}

export default function ScriptReader({ sayThis, notThis, whyItWorks, tonight, stageId }: Props) {
  const accent = stageAccent(stageId)
  const [whyOpen, setWhyOpen] = useState(false)

  // Each block opens with a mono label against the stage colour. No number,
  // because there is no order to walk, and no circle, because the circle was
  // the thing that made it look like a sequence.
  const head = (label: string, tone?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
      <span aria-hidden style={{
        width: 4, height: 15, borderRadius: 2, flexShrink: 0,
        background: tone ?? accent.fill,
      }} />
      <span style={{ ...eyebrow, color: tone ?? 'var(--terracotta-dark)' }}>{label}</span>
    </div>
  )

  return (
    <section style={sheet}>
      <div style={{ padding: 'clamp(18px, 4.5vw, 26px)' }}>

        {/* ── THE WORDS. The whole reason the page exists. ───────────────── */}
        {head('Say this')}
        <blockquote style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          // 800 rather than 900: at 28px across several lines the heaviest
          // weight closes the counters and the quote reads as a slab.
          fontWeight: 800,
          fontSize: 'clamp(26px, 7vw, 30px)',
          lineHeight: 1.3,
          letterSpacing: '-0.015em',
          color: 'var(--ink)',
          // A teleprompter measure, one saccade per line. A 390px phone is
          // already near this, so the cap is really what stops the line
          // running to 680px on a desktop.
          maxWidth: '30ch',
          textWrap: 'balance',
        }}>
          <span aria-hidden style={{ opacity: 0.35 }}>&ldquo;</span>{sayThis}<span aria-hidden style={{ opacity: 0.35 }}>&rdquo;</span>
        </blockquote>

        <div style={dottedRule} />

        {/* ── The glance check. Subordinate on purpose: it is never spoken. */}
        {head('Not this', 'var(--danger)')}
        <p style={{ ...sheetBody, color: 'var(--danger)', fontStyle: 'italic', maxWidth: '36ch' }}>
          <span aria-hidden style={{ opacity: 0.5 }}>&ldquo;</span>{notThis}<span aria-hidden style={{ opacity: 0.5 }}>&rdquo;</span>
        </p>

        <div style={dottedRule} />

        {/* ── The before action, promoted from last to here. ─────────────── */}
        {head('Before the moment')}
        <p style={{ ...sheetBody, fontWeight: 600, maxWidth: '42ch' }}>{tonight}</p>

        <div style={dottedRule} />

        {/* ── The evidence, and the only thing behind a tap. ─────────────── */}
        <button
          onClick={() => setWhyOpen(v => !v)}
          aria-expanded={whyOpen}
          style={{
            display: 'flex', alignItems: 'center', gap: 9, width: '100%',
            background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer',
            textAlign: 'left', minHeight: 44,
          }}
        >
          <span aria-hidden style={{ width: 4, height: 15, borderRadius: 2, flexShrink: 0, background: accent.fill }} />
          <span style={{ ...eyebrow, color: 'var(--terracotta-dark)' }}>Why it works</span>
          <span aria-hidden style={{
            marginLeft: 'auto', color: 'var(--ink-muted)', fontSize: 'var(--text-lg)',
            transform: whyOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.18s ease',
          }}>›</span>
        </button>
        {whyOpen && (
          <p style={{ ...sheetBody, maxWidth: '42ch', marginTop: 10 }}>{whyItWorks}</p>
        )}
      </div>
    </section>
  )
}
