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
 * WHEN AN EXPLANATION RETIRES, which is the whole design question here.
 *
 * Justin: "I can see you have given an option to dismiss it, but is there a
 * neater way to show it then it goes away? Auto? What is best practice?"
 *
 * The honest answer to the auto half is NO, and it is the one option to rule
 * out rather than tune. Content that removes itself on a timer takes words off
 * the screen while somebody is still reading them, and it punishes exactly the
 * people who read slowly, in a second language, or with a toddler shouting.
 * WCAG 2.2.1 is explicit about it. A timer also has no idea whether the thing
 * was read or ignored, so it is guessing with confidence.
 *
 * The pattern that does work, and it is what every app worth copying does:
 * AN EXPLANATION RETIRES WHEN THE READER DOES THE THING IT EXPLAINS. Nothing
 * disappears while being read, nothing needs a decision, and the trigger is
 * real evidence rather than elapsed seconds.
 *
 * So this panel closes the moment a parent opens the passport, which is the
 * one action that proves the explanation landed. The manual toggle stays as
 * the way back in, because someone who never touches the book should keep the
 * words, and someone who wants them again should not have to clear storage.
 *
 * The event is dispatched by PassportBook.goTo.
 *
 * (This replaces a two second timer that marked it seen. That timer existed to
 * dodge a double mount race, not because anyone thought it was right, and the
 * engagement signal solves the race properly: both mounts hear the same event.)
 */
const OPENED_EVENT = 'gc:passport-opened'

export default function PathwayIntro({ kidLabel, childCount }: { kidLabel: string; childCount: number }) {
  // Closed on the server and on the first client paint, always. Reading
  // localStorage during render is the usual way this becomes a hydration
  // mismatch, and a mismatch on the tallest block of the page is a visible
  // jump rather than a warning nobody sees.
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let seen = false
    try { seen = localStorage.getItem(SEEN_KEY) === '1' } catch { seen = false }
    if (!seen) setOpen(true)

    // Opening the passport is what retires the explanation. Registered even
    // when already seen, which costs nothing and keeps the two paths identical.
    const onOpened = () => {
      setOpen(false)
      try { localStorage.setItem(SEEN_KEY, '1') } catch { /* private mode, it just explains itself again */ }
    }
    window.addEventListener(OPENED_EVENT, onOpened)
    return () => window.removeEventListener(OPENED_EVENT, onOpened)
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
                <span aria-hidden style={{ fontSize: 'var(--text-lg)', lineHeight: 1.2, flexShrink: 0 }}>{em}</span>
                <span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>{t}</span>
                  <span style={{ display: 'block', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>{b}</span>
                </span>
              </li>
            ))}
          </ul>
          <p style={{ color: 'var(--ink)', fontSize: 'var(--text-md)', lineHeight: 1.55, maxWidth: '580px', margin: '4px 0 0', fontWeight: 600 }}>
            We tell you what to do, how to do it, and the research it comes from. You just do today.
          </p>
          <Link href="/passport" style={{ display: 'inline-block', marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', textDecoration: 'underline', textUnderlineOffset: '3px', letterSpacing: '0.03em' }}>
            Why we call it a passport →
          </Link>
          {childCount > 1 && (
            <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-md)', marginTop: '6px' }}>
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
