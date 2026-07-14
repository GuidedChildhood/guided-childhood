'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PrintBrandHeader, PrintBrandFooter } from '@/components/brand/PrintBrand'

// The interactive bucket list maker. A family picks from the idea pool or
// writes their own, we lay it out as a colour in sheet in the house style,
// and the browser's print dialog turns it into paper (or a PDF). Original
// layout and artwork throughout, emoji as the colour spot.

type Idea = { emoji: string; text: string }

const IDEA_POOL: { group: string; ideas: Idea[] }[] = [
  {
    group: 'Outside',
    ideas: [
      { emoji: '🚲', text: 'Family bike ride' },
      { emoji: '🪁', text: 'Fly a kite' },
      { emoji: '🌳', text: 'Climb a tree' },
      { emoji: '🐞', text: 'Find three minibeasts' },
      { emoji: '⚽', text: 'Kickabout in the park' },
      { emoji: '🌧️', text: 'Splash in puddles' },
      { emoji: '🏰', text: 'Build a den outside' },
      { emoji: '🌻', text: 'Plant something' },
    ],
  },
  {
    group: 'Together',
    ideas: [
      { emoji: '🎲', text: 'Family game night' },
      { emoji: '🍪', text: 'Bake together' },
      { emoji: '🎬', text: 'Movie den night' },
      { emoji: '🍳', text: 'Cook dinner together' },
      { emoji: '🧺', text: 'Picnic somewhere new' },
      { emoji: '📵', text: 'A whole screen free evening' },
      { emoji: '🎶', text: 'Kitchen disco' },
      { emoji: '🧩', text: 'Finish a big puzzle' },
    ],
  },
  {
    group: 'Make and learn',
    ideas: [
      { emoji: '🎨', text: 'Paint a masterpiece' },
      { emoji: '📚', text: 'Read a whole book' },
      { emoji: '✉️', text: 'Write a letter to someone' },
      { emoji: '🗺️', text: 'Draw a treasure map' },
      { emoji: '🏗️', text: 'Build something amazing' },
      { emoji: '🎭', text: 'Put on a show' },
      { emoji: '📸', text: 'Photo hunt around the house' },
      { emoji: '💛', text: 'Do one kind thing' },
    ],
  },
]

const MAX_ITEMS = 12

export default function BucketBuilder() {
  const [title, setTitle] = useState('Our Bucket List')
  const [childName, setChildName] = useState('')
  const [picked, setPicked] = useState<Idea[]>([])
  const [custom, setCustom] = useState('')
  const [added, setAdded] = useState(false)

  function toggle(idea: Idea) {
    setPicked(prev => prev.some(p => p.text === idea.text)
      ? prev.filter(p => p.text !== idea.text)
      : prev.length < MAX_ITEMS ? [...prev, idea] : prev)
  }

  function addCustom() {
    const clean = custom.replace(/\s+/g, ' ').trim().slice(0, 40)
    if (clean.length < 3 || picked.length >= MAX_ITEMS) return
    if (!picked.some(p => p.text.toLowerCase() === clean.toLowerCase())) {
      setPicked(prev => [...prev, { emoji: '⭐', text: clean }])
    }
    setCustom('')
  }

  async function addToQuests() {
    if (added || picked.length === 0) return
    setAdded(true)
    try {
      await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Finish the ${title.trim() || 'Bucket List'} sheet`,
          emoji: '🖨️', stars: 5, schedule: 'once', child_id: null,
        }),
      })
    } catch { setAdded(false) }
  }

  const pickedKeys = new Set(picked.map(p => p.text))

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; }
          @page { size: A4 portrait; margin: 10mm; }
        }
      `}</style>

      {/* Controls, hidden on paper */}
      <div className="no-print">
        <Link href="/dashboard/printables" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)', textDecoration: 'none' }}>
          ← All printables
        </Link>
        <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', margin: '14px 0 8px' }}>Bucket list builder</p>
        <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '10px' }}>
          Build your own bucket list
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '20px', maxWidth: '540px' }}>
          Pick up to {MAX_ITEMS} ideas or write your own, put their name on it, print it for the fridge. The finished page is worth 5 stars through the quest list.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={30}
            placeholder="Our Bucket List"
            style={{ flex: 2, minWidth: '180px', padding: '12px 15px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)', outline: 'none' }}
          />
          <input
            value={childName}
            onChange={e => setChildName(e.target.value)}
            maxLength={20}
            placeholder="Their name (optional)"
            style={{ flex: 1, minWidth: '140px', padding: '12px 15px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', outline: 'none' }}
          />
        </div>

        {IDEA_POOL.map(group => (
          <div key={group.group} style={{ marginBottom: '14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
              {group.group}
            </div>
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
              {group.ideas.map(idea => {
                const on = pickedKeys.has(idea.text)
                return (
                  <button
                    key={idea.text}
                    onClick={() => toggle(idea)}
                    style={{
                      padding: '9px 14px', borderRadius: '100px', cursor: 'pointer',
                      border: `1.5px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                      background: on ? 'var(--terracotta-lt)' : '#fff',
                      fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--ink)',
                    }}
                  >
                    {idea.emoji} {idea.text}{on ? ' ✓' : ''}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '22px' }}>
          <input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addCustom() }}
            maxLength={40}
            placeholder="Or write your own idea..."
            style={{ flex: 1, minWidth: 0, padding: '12px 15px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', outline: 'none' }}
          />
          <button
            onClick={addCustom}
            style={{ padding: '12px 18px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: 'var(--deep-teal)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}
          >
            Add
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '26px' }}>
          <button
            onClick={() => window.print()}
            disabled={picked.length === 0}
            className="btn btn-gold"
            style={{ padding: '13px 22px', fontSize: '14px', opacity: picked.length === 0 ? 0.55 : 1, cursor: picked.length === 0 ? 'default' : 'pointer' }}
          >
            🖨️ Print it ({picked.length}/{MAX_ITEMS})
          </button>
          <button
            onClick={addToQuests}
            disabled={added || picked.length === 0}
            style={{
              background: added ? 'var(--tint-sage)' : '#fff', border: '1.5px solid var(--border)', borderRadius: '16px',
              padding: '13px 22px', cursor: added || picked.length === 0 ? 'default' : 'pointer',
              fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800, color: 'var(--ink)',
            }}
          >
            {added ? 'On the quest list ✓' : 'Add to quests · ⭐ 5'}
          </button>
        </div>
      </div>

      {/* The sheet itself: what prints. The list lives INSIDE a big drawn
          bucket (original line art, drawn right here in SVG), so the print
          out is the bucket shaped page from the craft, with their own
          picks written on it. Everything uncoloured is theirs to colour. */}
      <div className="print-sheet" style={{
        background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px',
        padding: '30px 26px 22px', boxShadow: '0 8px 30px rgba(26,26,46,0.10)',
      }}>
        <PrintBrandHeader />

        <div style={{ position: 'relative', maxWidth: '470px', margin: '0 auto', aspectRatio: '400 / 508' }}>
          {/* The bucket: handle with ring ends, rim, tapered body */}
          <svg viewBox="0 0 400 508" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
            <path d="M 62 132 C 62 18, 338 18, 338 132" fill="none" stroke="#1A1A2E" strokeWidth="11" strokeLinecap="round" />
            <circle cx="62" cy="132" r="11" fill="#fff" stroke="#1A1A2E" strokeWidth="7" />
            <circle cx="338" cy="132" r="11" fill="#fff" stroke="#1A1A2E" strokeWidth="7" />
            <rect x="34" y="128" width="332" height="40" rx="20" fill="#fff" stroke="#1A1A2E" strokeWidth="8" />
            <path d="M 52 168 L 348 168 L 317 480 Q 315 500 295 500 L 105 500 Q 85 500 83 480 Z" fill="#fff" stroke="#1A1A2E" strokeWidth="8" strokeLinejoin="round" />
            {/* A little smiling sun on the rim corner, theirs to colour */}
            <circle cx="356" cy="112" r="17" fill="#fff" stroke="#1A1A2E" strokeWidth="5" />
            <path d="M 356 88 v-9 M 356 136 v9 M 332 112 h-9 M 380 112 h9 M 339 95 l-6 -6 M 373 95 l6 -6 M 339 129 l-6 6 M 373 129 l6 6" stroke="#1A1A2E" strokeWidth="4" strokeLinecap="round" />
            <circle cx="350" cy="108" r="1.8" fill="#1A1A2E" />
            <circle cx="362" cy="108" r="1.8" fill="#1A1A2E" />
            <path d="M 350 116 q 6 5 12 0" fill="none" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          {/* The list, laid out inside the bucket body. Rows share the
              bucket's height evenly, like ruled lines, so any count from 1
              to 12 always fits inside the drawing. */}
          {(() => {
            const n = picked.length
            const size = n <= 6 ? { text: 15, emoji: 18, circle: 20 } : n <= 9 ? { text: 13, emoji: 15, circle: 17 } : { text: 11.5, emoji: 13, circle: 14 }
            return (
              <div style={{
                position: 'absolute', left: '17.5%', right: '17.5%', top: '35%', bottom: '4.5%',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
              }}>
                <div style={{
                  textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: n > 9 ? '18px' : '21px', letterSpacing: '-0.02em',
                  color: 'var(--ink)', lineHeight: 1.1,
                }}>
                  {title.trim() || 'Our Bucket List'}
                </div>
                <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '3px 0 2px' }}>
                  {childName.trim() ? `${childName.trim()}'s list · ` : ''}Colour the circle when it is done
                </div>
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  {n === 0 ? (
                    <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--ink-muted)', margin: 'auto 0' }}>
                      Your picks appear in the bucket as you choose them.
                    </p>
                  ) : picked.map((idea, i) => (
                    // The bucket tapers inward, so lower rows tuck in a
                    // touch further to stay clear of the drawn wall.
                    <div key={idea.text} style={{
                      flex: 1, minHeight: 0,
                      display: 'flex', alignItems: 'center', gap: '9px',
                      borderBottom: '1.5px solid var(--border)',
                      padding: `0 ${Math.max(0, ((i + 0.5) / n) * 7.7 - 2.2).toFixed(1)}%`,
                    }}>
                      <span style={{
                        width: size.circle, height: size.circle,
                        borderRadius: '50%', border: '2.5px solid var(--ink)', flexShrink: 0,
                      }} />
                      <span style={{ fontSize: `${size.emoji}px`, flexShrink: 0, lineHeight: 1 }}>{idea.emoji}</span>
                      <span style={{
                        fontFamily: 'var(--font-display)', fontWeight: 700,
                        fontSize: `${size.text}px`,
                        color: 'var(--ink)', lineHeight: 1.15, minWidth: 0,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {idea.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--deep-teal)', borderRadius: '14px', padding: '13px 18px', marginTop: '14px' }}>
          <span style={{ fontSize: '22px' }}>⭐</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', lineHeight: 1.45 }}>
            Whole list done? Hand this to your grown up. Worth 5 stars toward your screen time.
          </span>
        </div>
        <PrintBrandFooter />
      </div>
    </div>
  )
}
