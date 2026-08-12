'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BetaTag from '@/components/ui/BetaTag'
import ChestSpark from './ChestSpark'

// School, sitting beside the road rather than on it.
//
// Justin, 11 August 2026, asking the question directly: "is it time critical it
// becomes a relevant for age step stone on the pathway to check what your child
// is doing next at school, and when they click it it updates the pathway? Or is
// it next to have a chest equivalent showing next to the pathway diagram, that
// does not have to be done but invites you to see the new curriculum checker,
// homework decoder helper?"
//
// ── IT IS THE CHEST, AND THE REASON IS WHAT THE ROAD MEANS ───────────────────
//
// The five stones on that road are the five STAGES between four and sixteen,
// years wide each, and the road says one thing very clearly: here is where your
// child is on the way to sixteen. A school term is not a stage. Dropping it in
// as a sixth stone would put a thing measured in weeks on a scale measured in
// years, and the first casualty is the only sentence the road was making.
//
// Worse, stones are sequenced and they gate. A curriculum checker as a stone
// would be something a parent could be BEHIND on. Nothing about knowing what
// Year 4 covers this term is a duty, a milestone, or a safety step, and turning
// a genuinely useful thing into an obligation is the fastest way to make a
// parent avoid it. Justin's own phrasing settles it: "does not have to be done".
// That is a chest, not a stone.
//
// The grammar already exists in the product. The child's own path has a chest
// beside its stones for exactly this reason: the good things you may open, next
// to the things you have to walk.
//
// ── AND IT STILL CHANGES WHEN YOU OPEN IT ────────────────────────────────────
//
// The other half of Justin's question was "when they click it it updates the
// pathway", and he is right that a thing which never changes stops being worth
// tapping. So the chest opens: once a parent has been in, it says so and shows
// what it holds, rather than reverting to a closed box that has forgotten them.
//
// That state lives in localStorage rather than in the database, deliberately.
// Opening a chest is not a fact about a family, it is a fact about a browser,
// and the passport is where family achievements belong. It also means opening
// it can never look like progress a parent has to keep up.

const OPENED_KEY = 'gc.schoolchest.opened'

export default function SchoolChest({
  childName, yearLabel,
}: {
  childName?: string | null
  /** "Year 4, Autumn term" when we know it. Null before a birthday is set. */
  yearLabel?: string | null
}) {
  const who = childName && childName !== 'Your child' ? childName : 'your child'
  const [opened, setOpened] = useState(false)
  useEffect(() => {
    try { setOpened(window.localStorage.getItem(OPENED_KEY) === '1') } catch { /* private mode */ }
  }, [])
  const markOpened = () => {
    try { window.localStorage.setItem(OPENED_KEY, '1') } catch { /* private mode */ }
    setOpened(true)
  }

  return (
    <div style={{
      position: 'relative',
      background: opened ? '#fff' : 'var(--stage-1)',
      border: `1.5px solid ${opened ? 'var(--border)' : 'var(--terracotta)'}`,
      borderRadius: 20, padding: '17px 18px',
      boxShadow: opened ? 'none' : '0 4px 0 rgba(26,26,46,0.06)',
    }}>
      {/* Justin: "I want it sparking next to the pathway, like a shooting star."
          The chest is drawn small and quiet on purpose, and the cost of that
          restraint is that it reads as scenery: he has been looking straight at
          it and reporting it as missing. A badge or a red dot would fix the
          noticing and break the meaning, because those say something is waiting
          on you and nothing here ever is. A shooting star says look over here
          and nothing more. It stops for good once the chest has been opened. */}
      <ChestSpark active={!opened} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 6 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
        }}>
          Beside the road
        </span>
        <BetaTag />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
        <span aria-hidden style={{ flexShrink: 0, fontSize: '30px', lineHeight: 1.1 }}>
          {opened ? '🎒' : '🧰'}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
            color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.2, letterSpacing: '-0.01em',
          }}>
            {opened ? 'School, whenever you want it' : 'What school is doing next'}
          </h3>
          {/* Never a task. This is the one thing on this page a parent can walk
              past for a term and lose nothing by it, and the copy has to say so
              or the road has quietly grown a sixth stone. */}
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
            {yearLabel
              ? `${yearLabel}. What the class is working on, something to practise, and help with the homework that comes home. Nothing to finish, open it when it is useful.`
              : `What ${who}'s class is working on, something to practise, and help with the homework that comes home. Nothing to finish, open it when it is useful.`}
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link
              href="/dashboard/learning"
              onClick={markOpened}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, textDecoration: 'none',
                background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 12,
                padding: '11px 15px', fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'var(--text-base)', boxShadow: '0 3px 0 var(--terracotta-dark)',
              }}
            >
              {opened ? 'Open it again' : 'Open it'}
            </Link>
            {/* The decoder by name, because it is the one a parent goes looking
                for at half past six with a worksheet in front of them, and they
                will not find it by guessing which tab it is behind. */}
            <Link
              href="/dashboard/learning?tab=homework"
              onClick={markOpened}
              style={{
                display: 'inline-flex', alignItems: 'center', textDecoration: 'none',
                background: '#fff', color: 'var(--ink)', border: '1.5px solid var(--border)',
                borderRadius: 12, padding: '11px 15px', fontFamily: 'var(--font-display)',
                fontWeight: 800, fontSize: 'var(--text-base)',
              }}
            >
              Homework help
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
