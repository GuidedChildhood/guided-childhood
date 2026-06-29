'use client'
import { useState, useEffect } from 'react'
import MomentCard, { type Moment } from '@/components/cards/MomentCard'

const CATEGORIES = ['All', 'Morning', 'Digital', 'School', 'Food', 'Evening', 'Transitions', 'Emotions']

interface MomentsGridProps {
  initialMoments: Moment[]
  childName?: string
  ageBand?: string
}

export default function MomentsGrid({ initialMoments, childName, ageBand }: MomentsGridProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set())

  const filtered = activeCategory === 'All'
    ? initialMoments
    : initialMoments.filter(m => m.category === activeCategory)

  function handleFlip(momentId: string) {
    setFlippedIds(prev => new Set([...prev, momentId]))
  }

  return (
    <div>
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
