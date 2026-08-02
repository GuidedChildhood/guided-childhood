'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// The explanation above the passport, said once and then folded away.
//
// Justin, on the phone: "that text currently takes up the whole of screen so
// needs to move away, especially not each time. The passport needs to fill the
// page when on it."
//
// He is right, and the reason it grew is worth writing down: every line here
// was added because the page never said what the promise WAS. That was a real
// problem and the fix was correct. But an explanation and a tool have different
// lifespans. A parent needs the explanation once. They open the passport tab
// every week, and every week they were paying for the first visit again, with
// the actual passport pushed off the bottom of a 390 wide screen.
//
// So: the promise stays in full, it just stops being the first screenful after
// the first time. Collapsed by default on the server, opened once on a device
// that has never seen it, then closed for good and reachable by a tap.
//
// Mobbin references pulled before building this (Justin reconnected it, and
// CLAUDE.md says references first): Goodreads puts "How it works" behind a
// disclosure rather than above the content; Superpower and Life Reset collapse
// standing explanation into a chevron row; Linktree folds its setup checklist
// away the moment it stops being the thing you came for. Same pattern, our
// butter and ink and Nunito, not their look.

const SEEN_KEY = 'gc_pathway_intro_seen'

const PROVES: [string, string, string][] = [
  ['🛡️', 'Safe online', 'Spotting what is not right, and always telling someone.'],
  ['⚖️', 'A healthy balance', 'Screen time earned from real world jobs, never just handed over.'],
  ['🤖', 'AI and what is real', 'Knowing when something is made up, sold to them, or a bot.'],
  ['💬', 'Ready for social media', 'Judgement built years before the account, not the week they ask.'],
]

/**
 * How long the intro has to be on screen before it counts as seen.
 *
 * This delay is the whole fix, so it is worth saying why it exists rather than
 * leaving a bare 2000 for somebody to "tidy up" later.
 *
 * The obvious version read the flag and wrote it in the same breath: open the
 * panel, mark it seen. It did not work. This component mounts more than once
 * per page load, so the first mount opened the panel and wrote "seen", the
 * second mount read "seen" and rendered it shut, and the net effect was a
 * device marked as having read the explanation without the explanation ever
 * being on screen. A parent's first visit was silently their second. Module
 * scope did not save it either, because the module is evaluated twice too.
 *
 * Writing the flag a beat AFTER the mounts have settled makes every mount in a
 * page load agree, and it is the more honest rule anyway: an explanation a
 * parent bounced off in under two seconds has not been read, so it earns the
 * right to appear once more.
 */
const SEEN_AFTER_MS = 2000

export default function PathwayIntro({ kidLabel, childCount }: { kidLabel: string; childCount: number }) {
  // Closed on the server and on the first client paint, always. Reading
  // localStorage during render is the usual way this becomes a hydration
  // mismatch, and a mismatch on the tallest block of the page is a visible
  // jump rather than a warning nobody sees.
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let seen = false
    try { seen = localStorage.getItem(SEEN_KEY) === '1' } catch { seen = false }
    if (seen) return
    setOpen(true)
    const t = setTimeout(() => {
      try { localStorage.setItem(SEEN_KEY, '1') } catch { /* private mode, it just explains itself again */ }
    }, SEEN_AFTER_MS)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ minWidth: 0 }}>
      <p className="eyebrow" style={{ marginBottom: '4px' }}>Your journey</p>
      {/* Smaller than it was. At 2.5rem on a 390 wide phone this heading alone
          took two lines and a fifth of the viewport. */}
      <h1 style={{ fontSize: 'clamp(1.6rem, 5.2vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '7px' }}>
        The pathway to 16
      </h1>
      <p style={{ color: 'var(--ink)', fontSize: 'var(--text-md)', lineHeight: 1.5, maxWidth: '580px', fontWeight: 600, margin: 0 }}>
        A passport that proves {kidLabel} can actually handle the internet, earned one stage at a time.
      </p>

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginTop: 10, padding: '8px 14px',
          background: '#fff', border: '1.5px solid var(--border)', borderRadius: 12,
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)',
          cursor: 'pointer',
        }}
      >
        {open ? 'Hide what it proves' : 'What the passport proves'}
        <span aria-hidden style={{ display: 'inline-block', fontSize: 'var(--text-xs)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
          ▾
        </span>
      </button>

      {open && (
        <div style={{ animation: 'gcIntroIn 0.28s ease both' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', maxWidth: '580px' }}>
            {PROVES.map(([em, t, b]) => (
              <li key={t} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginBottom: 9 }}>
                <span aria-hidden style={{ fontSize: 20, lineHeight: 1.2, flexShrink: 0 }}>{em}</span>
                <span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>{t}</span>
                  <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>{b}</span>
                </span>
              </li>
            ))}
          </ul>
          <p style={{ color: 'var(--ink)', fontSize: 'var(--text-md)', lineHeight: 1.55, maxWidth: '580px', margin: '4px 0 0', fontWeight: 600 }}>
            We tell you what to do, how to do it, and the research it comes from. You just do today.
          </p>
          <Link href="/passport" style={{ display: 'inline-block', marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', textDecoration: 'underline', textUnderlineOffset: '3px', letterSpacing: '0.03em' }}>
            Why we call it a passport →
          </Link>
          {childCount > 1 && (
            <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-base)', marginTop: '6px' }}>
              {childCount} children, one account.
            </p>
          )}
        </div>
      )}

      <style>{`
        @keyframes gcIntroIn {
          0% { opacity: 0; transform: translateY(-6px) }
          100% { opacity: 1; transform: none }
        }
      `}</style>
    </div>
  )
}
