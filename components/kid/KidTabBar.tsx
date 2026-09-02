'use client'

import KidIcon, { type KidIconName } from '@/components/kid/KidIcon'

// The child's sticky Quests, Lessons, Printables bar, on a butter surface.
//
// The Happy Newspaper pass (design-refs/happy-newspaper-notes.md): the one
// place the brand yellow is a surface rather than a mark is the shop strip
// on a phone. This is ours: butter ground, ink edge and ledge, the chosen
// tab a white card sat on it, the others ink on butter. Same three tabs,
// same taps, same red badges; the screen decides what a tap does.

export type KidTab = 'quests' | 'lessons' | 'print'

export default function KidTabBar({ current, onSelect, badges }: {
  current: KidTab
  onSelect: (tab: KidTab) => void
  /** Red counts on lessons and printables, the moment something new is waiting. */
  badges: { lessons: number; print: number }
}) {
  const tabs: [KidTab, string, KidIconName, number][] = [
    ['quests', 'Quests', 'star', 0],
    ['lessons', 'Lessons', 'lessons', badges.lessons],
    ['print', 'Printables', 'printables', badges.print],
  ]
  return (
    <div
      id="kid-tabs"
      style={{
        position: 'sticky', top: 0, zIndex: 30,
        display: 'flex', gap: 4, background: 'var(--terracotta)',
        border: '2px solid var(--ink)', borderRadius: 18,
        padding: 5, marginBottom: 16, scrollMarginTop: 12,
        boxShadow: '0 4px 0 var(--ink), 0 10px 24px rgba(26,26,46,0.16)',
      }}
    >
      {tabs.map(([key, label, icon, dot]) => {
        const on = current === key
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            style={{
              position: 'relative',
              flex: 1, padding: '11px 4px', borderRadius: 13, cursor: 'pointer',
              border: on ? '2px solid var(--ink)' : '2px solid transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
              background: on ? '#fff' : 'transparent',
              color: 'var(--ink)',
              boxShadow: on ? '0 3px 0 var(--ink)' : 'none',
              transition: 'background 0.15s',
            }}
          >
            <KidIcon name={icon} size={24} color="var(--ink)" />
            {label}
            {dot > 0 && (
              <span style={{
                position: 'absolute', top: -7, right: -4, minWidth: 20, height: 20, padding: '0 5px',
                borderRadius: 100, background: '#E5484D', color: '#fff', border: '2px solid #fff',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, lineHeight: '16px',
                textAlign: 'center',
              }}>
                {dot > 9 ? '9+' : dot}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
