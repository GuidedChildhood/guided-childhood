'use client'

import { useState } from 'react'
import MethodIcon, { METHOD, type MethodId } from './MethodIcon'

// Everything else, as icons.
//
// Justin, 10 September 2026: "just make the other information after that a
// collection of happy news design icons so we can shrink the scroll and too
// much text ... icons such as see optional child's app contents and helps with
// tasks, school help, moments, scripts, they can all live under icons ... we've
// got you, not another blocking app, our philosophy, all in pretty happy news
// icons. A number you agreed, child gets own app, passport road to 16."
//
// ── WHY A GRID AND NOT MORE SECTIONS ────────────────────────────────────────
//
// Each of these was a section with a heading, a paragraph and three points, and
// there are ten of them. Ten sections is ten screens whatever the words say.
//
// Stake's plan comparison is the shape: a two up grid of tiles, each an icon, a
// short bold title and one line, so the whole offer is visible at once and the
// detail is a tap. Turo does the same for car features. The point is that a
// parent scanning ten tiles has seen the whole product in two screens, which is
// the thing ten sections cannot do however well each one is written.
//
// The two philosophy tiles sit in the same grid as the eight features on
// purpose, and Justin asked for it that way. "Not another blocking app" is the
// single most important thing this product has to say to somebody who has
// already bought Qustodio and hated it, and putting it in a prose section
// further down means the people who most need it never reach it.

type Tile = {
  icon: MethodId
  title: string
  /** One line, visible. Fewer than nine words wherever it can be. */
  line: string
  /** Two short lines at most, behind the tap. */
  more: string
}

const TILES: Tile[] = [
  {
    icon: 'kidapp',
    title: 'Their own app',
    line: 'Jobs, stars and the five a day',
    more: 'A link, no login, no account, and nothing buzzing at night. A job, a lesson, time outside, a read, a kind thing. A full day earns a Planet Friend.',
  },
  {
    icon: 'lesson',
    title: 'Lessons and school',
    line: 'The things nobody teaches, before they arrive',
    more: 'The algorithm, group chats, strangers, passwords, what a screen does to a mood. Short, at the kitchen table, with a buddy they choose. Schools run the same lessons on a whiteboard.',
  },
  {
    icon: 'moment',
    title: 'Moments',
    line: 'The thing that went wrong tonight',
    more: 'Name it once, and the platform keeps track of whether it is getting better. You get the words for it, and the record of how it went.',
  },
  {
    icon: 'script',
    title: 'Scripts',
    line: 'The words, ready before the moment',
    more: 'Hundreds of them, sorted by what is actually happening in your house tonight. Read one in the hallway before you open the door.',
  },
  {
    icon: 'digi',
    title: 'DiGi',
    line: 'Ask anything, any time',
    more: 'Never allow or deny. Every answer is a pathway: where you are, what to do next, and what it looks like when it is working.',
  },
  {
    icon: 'balance',
    title: 'Device time',
    line: 'A number you agreed this morning',
    more: 'Not one you defend at six. Bedtime, meals and school hours are off the table at any price, and most of the day is theirs before they do anything.',
  },
  {
    icon: 'passport',
    title: 'The passport',
    line: 'One road, from 4 to 16',
    more: 'Five stages, stamped as you go, so you can see what is done and what is next. It is the record you keep, and it prints as a real booklet.',
  },
  {
    icon: 'checkin',
    title: 'Ten seconds a day',
    line: 'Tap how it went, that is the whole habit',
    more: 'A feeling turns into a line you can read over weeks. It will not tell you the cause. It gives you something real to take to them, or to your GP, instead of a hunch.',
  },
]

// The two that are the philosophy rather than a feature. Same grid, different
// ink, because a parent who has been burned by a blocking app needs to see this
// before they read a single feature.
const BELIEFS: Tile[] = [
  {
    icon: 'digi',
    title: 'Not another blocking app',
    line: 'Blocking makes tonight easy and tomorrow worse',
    more: 'Software that decides for you teaches your child nothing for the day they are holding the phone on their own. This works the other way round.',
  },
  {
    icon: 'checkin',
    title: 'We have got you',
    line: 'Five minutes a day, and you can miss days',
    more: 'Some days it is one tap. Some days it is a script at bedtime. The platform decides what today needs. You decide when.',
  },
]

function TileCard({ tile, belief }: { tile: Tile; belief?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setOpen(o => !o)}
      aria-expanded={open}
      style={{
        gridColumn: open ? '1 / -1' : 'auto',
        display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
        background: belief ? 'var(--tint-sage)' : '#fff',
        border: '2px solid var(--ink)', borderRadius: 16,
        boxShadow: open ? 'none' : '0 4px 0 var(--ink)',
        padding: '11px 12px',
        transition: 'box-shadow 0.2s ease',
        fontFamily: 'var(--font-body)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span aria-hidden style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 38, height: 38, borderRadius: 12,
          background: METHOD[tile.icon].tint, border: '2px solid var(--ink)', boxSizing: 'border-box',
        }}>
          <MethodIcon id={tile.icon} size={22} />
        </span>
        {/* The caret sits beside the icon rather than on a line of its own. A
            row saying "Tap" under every tile was ten extra lines on the page to
            repeat what a chevron says. */}
        <span aria-hidden style={{
          fontSize: 11, fontWeight: 900, color: 'var(--terracotta-dark)',
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease',
        }}>▾</span>
      </span>
      <span style={{
        display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900,
        fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.25, letterSpacing: '-0.01em',
      }}>
        {tile.title}
      </span>
      <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 3 }}>
        {tile.line}
      </span>
      {open && (
        <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.55, marginTop: 9, paddingTop: 9, borderTop: '1.5px dashed var(--border)' }}>
          {tile.more}
        </span>
      )}

    </button>
  )
}

export default function WhatYouGet({ childName }: { childName?: string | null }) {
  const kid = childName && childName !== 'your child' ? childName : null
  return (
    <div>
      <p style={{
        margin: '0 0 4px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
      }}>
        What you get
      </p>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.03em',
        fontSize: 'clamp(1.45rem, 5vw, 1.9rem)', lineHeight: 1.12, color: 'var(--ink)', margin: '0 0 14px',
      }}>
        {kid ? `Everything ${kid} needs, and everything you need.` : 'Everything they need, and everything you need.'}
      </h2>

      {/* Two up. A tile that is open takes the full width, so the detail gets a
          readable measure instead of a 160px column. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 9, alignItems: 'start' }}>
        {BELIEFS.map(t => <TileCard key={t.title} tile={t} belief />)}
        {TILES.map(t => <TileCard key={t.title} tile={t} />)}
      </div>
    </div>
  )
}
