'use client'

import { useState } from 'react'
import Link from 'next/link'
import BucketSheet, { type BucketIdea } from '@/components/printables/BucketSheet'
import KidBackLink from '@/components/kid/KidBackLink'
import { HAPPY, HappyMasthead, Burst, Sticker, WavyRule } from '@/components/kid/HappyNewsBits'
import { printOrOpen, packForUrl, tickPrintableStep } from '@/lib/kid/print-anywhere'

// The interactive bucket list maker. A family picks from the idea pool or
// writes their own, we lay it out as a colour in sheet in the house style
// (components/printables/BucketSheet), and the browser's print dialog turns
// it into paper (or a PDF). Original layout and artwork throughout, emoji as
// the colour spot.

type Idea = BucketIdea

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

// One builder, both phones, the StarChartBuilder precedent exactly.
// Justin, 12 August 2026, on the builder living only on the parent
// dashboard: "but should be on child app also." The kid variant swaps the
// back link, prefills their name, and turns Add to quests into an ask
// through the child request pipeline, because a child never writes to the
// family quest list directly, they ask and a grown up says yes.
//
// 2 September 2026, the happy news edition for the child: a butter masthead
// instead of a form heading, the ideas as stickers that pop when picked, a
// count burst that fills as they choose, and a Print it bar that stays in
// reach. Print goes through printOrOpen, because inside the installed iOS
// app window.print does nothing; there it opens the child's print page in
// Safari with the picks packed into the URL. Printing ticks the five a day.
// The parent variant keeps its calmer dashboard register and the same sheet.
export default function BucketBuilder({
  variant = 'parent',
  kidToken = null,
  defaultChildName = '',
  backHref = '/dashboard/printables',
  backLabel = 'All printables',
}: {
  variant?: 'parent' | 'kid'
  kidToken?: string | null
  defaultChildName?: string
  backHref?: string
  backLabel?: string
} = {}) {
  const kid = variant === 'kid'
  const [title, setTitle] = useState(kid ? 'My Bucket List' : 'Our Bucket List')
  const [childName, setChildName] = useState(defaultChildName)
  const [picked, setPicked] = useState<Idea[]>([])
  const [custom, setCustom] = useState('')
  const [added, setAdded] = useState(false)
  const [askNote, setAskNote] = useState<string | null>(null)
  const [printNote, setPrintNote] = useState<string | null>(null)

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

  function print() {
    if (picked.length === 0) return
    if (kid && kidToken) {
      tickPrintableStep(kidToken)
      const packed = packForUrl({ title, childName, picked })
      const how = printOrOpen(`/k/${kidToken}/print?bucket=${packed}`)
      if (how === 'opened') setPrintNote('Opened in Safari so it can print. Come back here when it is done.')
      return
    }
    window.print()
  }

  async function addToQuests() {
    if (added || picked.length === 0) return
    setAdded(true)
    const questTitle = `Finish the ${title.trim() || 'Bucket List'} sheet`
    if (kid && kidToken) {
      // The ask pipeline, same as pitching any job from the child app. The
      // grown up gets the push and one tap makes it real with stars on it.
      try {
        const res = await fetch('/api/quests/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: kidToken, title: questTitle, emoji: '🖨️' }),
        })
        if (!res.ok) {
          setAdded(false)
          setAskNote('That did not send. Ask again in a minute, or just hand the finished sheet to your grown up.')
          setTimeout(() => setAskNote(null), 4000)
        }
      } catch {
        setAdded(false)
        setAskNote('That did not send. Ask again in a minute, or just hand the finished sheet to your grown up.')
        setTimeout(() => setAskNote(null), 4000)
      }
      return
    }
    try {
      await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: questTitle,
          emoji: '🖨️', stars: 5, schedule: 'once', child_id: null,
        }),
      })
    } catch { setAdded(false) }
  }

  const pickedKeys = new Set(picked.map(p => p.text))
  const inputStyle: React.CSSProperties = {
    padding: '12px 15px', borderRadius: 12, border: `${kid ? 2 : 1.5}px solid ${kid ? HAPPY.ink : 'var(--border)'}`,
    background: '#fff', fontSize: 'var(--text-md)', color: 'var(--ink)', outline: 'none',
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: kid ? '16px 16px 120px' : '24px 20px 48px' }}>
      <style>{`
        @media print {
          header, .bottom-tab-bar, .rightnow-desktop, .no-print { display: none !important; }
          .print-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; }
          @page { size: A4 portrait; margin: 10mm; }
        }
        .bucket-chip { transition: transform 0.12s, background 0.12s; }
        .bucket-chip:active { transform: translateY(2px) scale(0.98); }
      `}</style>

      {/* Controls, hidden on paper */}
      <div className="no-print">
        {kid ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
              <KidBackLink href={backHref} label={backLabel} color="var(--ink)" />
              <KidBackLink href={backHref} label="Close" variant="close" />
            </div>
            <HappyMasthead
              kicker="Bucket list builder"
              title="Build your bucket list"
              sub={`Pick up to ${MAX_ITEMS} things you want to do, or write your own. Print it for the fridge.`}
              right={<Burst size={72} color={picked.length > 0 ? HAPPY.butterLt : '#fff'}><span style={{ fontSize: 24 }}>{picked.length}</span><br /><span style={{ fontSize: 10, letterSpacing: '0.08em' }}>OF {MAX_ITEMS}</span></Burst>}
              style={{ marginBottom: 16 }}
            />
          </>
        ) : (
          <>
            <Link href={backHref} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none' }}>
              ← {backLabel}
            </Link>
            <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', margin: '14px 0 8px' }}>Bucket list builder</p>
            <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '10px' }}>
              Build your own bucket list
            </h1>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '20px', maxWidth: '540px' }}>
              Pick up to {MAX_ITEMS} ideas or write your own, put their name on it, print it for the fridge. The finished page is worth 5 stars through the quest list.
            </p>
          </>
        )}

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={30}
            placeholder={kid ? 'My Bucket List' : 'Our Bucket List'}
            aria-label="List name"
            style={{ ...inputStyle, flex: 2, minWidth: '180px', fontFamily: 'var(--font-display)', fontWeight: 800 }}
          />
          <input
            value={childName}
            onChange={e => setChildName(e.target.value)}
            maxLength={20}
            placeholder={kid ? 'Your name' : 'Their name (optional)'}
            aria-label="Name"
            style={{ ...inputStyle, flex: 1, minWidth: '140px', fontFamily: 'var(--font-body)' }}
          />
        </div>

        {IDEA_POOL.map((group, gi) => (
          <div key={group.group} style={{ marginBottom: kid ? 16 : 14 }}>
            {kid ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                <Sticker accent={gi === 0 ? 'green' : gi === 1 ? 'coral' : 'sky'} rotate={gi % 2 ? 3 : -3} size="sm">{group.group}</Sticker>
                <WavyRule color={HAPPY.butterDark} style={{ flex: 1, width: 'auto', opacity: 0.7 }} />
              </div>
            ) : (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                {group.group}
              </div>
            )}
            <div style={{ display: 'flex', gap: kid ? 8 : 7, flexWrap: 'wrap' }}>
              {group.ideas.map(idea => {
                const on = pickedKeys.has(idea.text)
                return (
                  <button
                    key={idea.text}
                    className="bucket-chip"
                    onClick={() => toggle(idea)}
                    aria-pressed={on}
                    style={kid ? {
                      padding: '10px 14px', borderRadius: 100, cursor: 'pointer',
                      border: `2px solid ${HAPPY.ink}`,
                      background: on ? HAPPY.butter : '#fff',
                      boxShadow: on ? `0 3px 0 ${HAPPY.ink}` : 'none',
                      transform: on ? 'none' : 'translateY(2px)',
                      fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: HAPPY.ink,
                    } : {
                      padding: '9px 14px', borderRadius: '100px', cursor: 'pointer',
                      border: `1.5px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                      background: on ? 'var(--terracotta-lt)' : '#fff',
                      fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink)',
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
            aria-label="Your own idea"
            style={{ ...inputStyle, flex: 1, minWidth: 0, fontFamily: 'var(--font-body)' }}
          />
          <button
            onClick={addCustom}
            style={kid
              ? { padding: '12px 18px', borderRadius: 12, border: `2px solid ${HAPPY.ink}`, cursor: 'pointer', background: HAPPY.green, color: '#fff', boxShadow: `0 3px 0 ${HAPPY.ink}`, fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 900 }
              : { padding: '12px 18px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: 'var(--deep-teal)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700 }}
          >
            Add
          </button>
        </div>

        {!kid && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '26px' }}>
            <button
              onClick={print}
              disabled={picked.length === 0}
              className="btn btn-gold"
              style={{ padding: '13px 22px', fontSize: 'var(--text-md)', opacity: picked.length === 0 ? 0.55 : 1, cursor: picked.length === 0 ? 'default' : 'pointer' }}
            >
              🖨️ Print it ({picked.length}/{MAX_ITEMS})
            </button>
            <button
              onClick={addToQuests}
              disabled={added || picked.length === 0}
              style={{
                background: added ? 'var(--tint-sage)' : '#fff', border: '1.5px solid var(--border)', borderRadius: '16px',
                padding: '13px 22px', cursor: added || picked.length === 0 ? 'default' : 'pointer',
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)',
              }}
            >
              {added ? 'On the quest list ✓' : 'Add to quests · ⭐ 5'}
            </button>
          </div>
        )}

        {askNote && (
          <p style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            color: 'var(--ink)', background: 'var(--tint-sage)', border: '1.5px solid var(--border)',
            borderRadius: 14, padding: '11px 14px', margin: '0 0 20px',
          }}>
            {askNote}
          </p>
        )}
      </div>

      {/* The sheet itself: what prints. */}
      <BucketSheet title={title} childName={childName} picked={picked} />

      {/* The child's action bar, always in reach however long the idea list
          runs: one big Print it, and the ask beside it. */}
      {kid && (
        <div className="no-print" style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40,
          padding: '10px 14px calc(12px + env(safe-area-inset-bottom))',
          background: 'rgba(249,248,246,0.94)', backdropFilter: 'blur(8px)', borderTop: `2px solid ${HAPPY.ink}`,
        }}>
          {printNote && (
            <p style={{ margin: '0 auto 8px', maxWidth: 560, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: HAPPY.ink, lineHeight: 1.35 }}>
              {printNote}
            </p>
          )}
          <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', gap: 8 }}>
            <button
              onClick={print}
              disabled={picked.length === 0}
              style={{
                flex: 1.4, padding: '14px 12px', borderRadius: 16, border: `2px solid ${HAPPY.ink}`,
                cursor: picked.length === 0 ? 'default' : 'pointer', opacity: picked.length === 0 ? 0.55 : 1,
                background: HAPPY.butter, color: HAPPY.ink, boxShadow: `0 4px 0 ${HAPPY.ink}`,
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
              }}
            >
              🖨️ Print it{picked.length > 0 ? ` (${picked.length})` : ''}
            </button>
            <button
              onClick={addToQuests}
              disabled={added || picked.length === 0}
              style={{
                flex: 1, padding: '14px 10px', borderRadius: 16, border: `2px solid ${HAPPY.ink}`,
                cursor: added || picked.length === 0 ? 'default' : 'pointer', opacity: picked.length === 0 ? 0.55 : 1,
                background: added ? '#E8F0EE' : '#fff', color: HAPPY.ink, boxShadow: added ? 'none' : `0 4px 0 ${HAPPY.ink}`,
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
              }}
            >
              {added ? 'Asked ✓' : 'Make it a job ⭐ 5'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
