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
  // the whole library is one tap away: hidden cards read as missing content.
  const [scope, setScope] = useState<'child' | 'all'>('child')
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

  return (
    <div>
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
