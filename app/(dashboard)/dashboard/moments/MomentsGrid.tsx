'use client'
import { useState, useEffect } from 'react'
import MomentCard, { type Moment } from '@/components/cards/MomentCard'

const CATEGORIES = ['All', 'Morning', 'Digital', 'School', 'Food', 'Evening', 'Transitions', 'Emotions']

interface MomentsGridProps {
  initialMoments: Moment[]
  allMoments?: Moment[]
  childName?: string
  ageBand?: string
  suggestedId?: string
  suggestReason?: string
}

export default function MomentsGrid({ initialMoments, allMoments, childName, ageBand, suggestedId, suggestReason }: MomentsGridProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set())
  // Age filtered by default so a parent lands on what fits their child, but
  // the whole library is one tap away: hidden cards read as missing content. If
  // nothing is tagged for this child's age, we open on the whole library instead
  // of a blank page, so the moments never look like they vanished.
  const [scope, setScope] = useState<'child' | 'all'>(initialMoments.length === 0 ? 'all' : 'child')
  const everything = allMoments ?? initialMoments
  const showScopeToggle = everything.length > initialMoments.length
  const pool = scope === 'all' ? everything : initialMoments

  const baseFiltered = activeCategory === 'All'
    ? pool
    : pool.filter(m => m.category === activeCategory)
  // DiGi's pick leads the grid when browsing everything, so the cleverness
  // is the first thing a parent meets, never buried by sort order.
  const suggestedMoment = suggestedId ? pool.find(m => m.id === suggestedId) : undefined
  const filtered = activeCategory === 'All' && suggestedMoment
    ? [suggestedMoment, ...baseFiltered.filter(m => m.id !== suggestedId)]
    : baseFiltered

  function handleFlip(momentId: string) {
    setFlippedIds(prev => new Set([...prev, momentId]))
  }

  // The day at a glance: the moments laid along a timeline of a real day, so a
  // parent sees the shape of the day and taps the time they are heading into.
  // The categories are the times, the cross cutting ones stay in the filter row.
  const TIME_BANDS: { label: string; category: string; icon: string }[] = [
    { label: 'Morning', category: 'Morning', icon: '🌅' },
    { label: 'Midday', category: 'School', icon: '🏫' },
    { label: 'After school', category: 'Food', icon: '🍎' },
    { label: 'Evening', category: 'Evening', icon: '🌙' },
  ]
  const timeline = TIME_BANDS
    .map(b => ({ ...b, items: pool.filter(m => m.category === b.category) }))
    .filter(b => b.items.length > 0)

  return (
    <div>
      {/* The day timeline: moment icons along the arc of a day, tap a time to
          filter the grid to it. */}
      {timeline.length > 1 && (
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 20, padding: '4px 2px' }}>
          <div aria-hidden style={{ position: 'absolute', left: 22, right: 22, top: 26, height: 2, background: 'var(--border)', zIndex: 0 }} />
          {timeline.map(b => {
            const on = activeCategory === b.category
            return (
              <button
                key={b.category}
                onClick={() => setActiveCategory(on ? 'All' : b.category)}
                style={{ position: 'relative', zIndex: 1, flex: 1, minWidth: 0, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: 0 }}
              >
                <span style={{ width: 46, height: 46, borderRadius: '50%', background: on ? 'var(--terracotta)' : 'var(--cream)', border: `1.5px solid ${on ? 'var(--terracotta-dark)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : 'none' }}>{b.icon}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, color: 'var(--ink)', lineHeight: 1.1, textAlign: 'center' }}>{b.label}</span>
                <span style={{ display: 'flex', gap: 1, fontSize: 11, lineHeight: 1 }}>
                  {b.items.slice(0, 4).map(m => <span key={m.id}>{m.icon}</span>)}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, color: 'var(--ink-muted)' }}>{b.items.length}</span>
              </button>
            )
          })}
        </div>
      )}
      {/* DiGi names its pick and why, the first card in the grid below */}
      {suggestedMoment && suggestReason && activeCategory === 'All' && (
        <div style={{
          display: 'flex', gap: 12, alignItems: 'flex-start',
          background: 'var(--deep-teal)', borderRadius: 16,
          padding: '14px 16px', marginBottom: 14,
        }}>
          <span style={{ fontSize: '1.3rem', flexShrink: 0 }} aria-hidden>✨</span>
          <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.55, color: 'rgba(255,255,255,0.9)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: 3 }}>
              DiGi&apos;s pick
            </span>
            <strong>{suggestedMoment.title}</strong>, {suggestReason}. It is the first card below.
          </p>
        </div>
      )}

      {/* Whose moments: the child's age by default, everything on request */}
      {showScopeToggle && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {([
            ['child', `${childName && childName !== 'Your child' ? `For ${childName}` : 'For their age'} · ${initialMoments.length}`],
            ['all', `All ages · ${everything.length}`],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setScope(key)}
              style={{
                padding: '7px 14px',
                borderRadius: '100px',
                border: scope === key ? 'none' : '1px solid var(--border)',
                background: scope === key ? 'var(--deep-teal)' : 'var(--white)',
                color: scope === key ? '#fff' : 'var(--ink-soft)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                fontWeight: 700,
                letterSpacing: '0.03em',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Category filter */}
      <div style={{
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        paddingBottom: 4,
        marginBottom: 20,
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '7px 14px',
              borderRadius: '100px',
              border: activeCategory === cat ? 'none' : '1px solid var(--border)',
              background: activeCategory === cat ? 'var(--terracotta)' : 'var(--white)',
              color: activeCategory === cat ? '#fff' : 'var(--ink-soft)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: activeCategory === cat ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '14px',
      }}>
        {filtered.map(moment => (
          <MomentCard
            key={moment.id}
            moment={moment}
            childName={childName}
            ageBand={ageBand}
            onFlip={handleFlip}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-muted)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>No moments in this category yet.</p>
        </div>
      )}
    </div>
  )
}
