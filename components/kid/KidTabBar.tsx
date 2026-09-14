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

// ── TODAY, FIRST, ON EVERY TAB (14 September 2026) ──────────────────────────
//
// Justin: "the home tab on the app always has a Duolingo type reminder to
// return to daily tasks until done so they don't get lost on other tabs, and
// each day done shows clearly done." The five a day sits above this bar and
// scrolls away the moment a child taps Lessons. This entry stays: butter with
// the count left while the day is going, green with a tick once it is done,
// and a tap goes straight back to the five a day whatever tab is open.
export type TodayTab = { left: number; total: number; complete: boolean; opened: boolean }

export default function KidTabBar({ current, onSelect, badges, today = null, onToday }: {
  current: KidTab
  onSelect: (tab: KidTab) => void
  /** Red counts on lessons and printables, the moment something new is waiting. */
  badges: { lessons: number; print: number }
  /** What is left today. Null keeps the bar as it was (three tabs). */
  today?: TodayTab | null
  onToday?: () => void
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
        border: 'var(--edge)', borderRadius: 'var(--radius-card)',
        padding: 5, marginBottom: 16, scrollMarginTop: 12,
        boxShadow: 'var(--lift), 0 10px 24px rgba(26,26,46,0.16)',
      }}
    >
      {today && (
        <button
          type="button"
          data-today-tab
          data-state={today.complete ? 'done' : today.opened ? 'going' : 'fresh'}
          onClick={onToday}
          aria-label={today.complete ? 'Today is done' : `${today.left} of ${today.total} left today`}
          style={{
            position: 'relative', flex: 1, padding: '11px 4px', borderRadius: 'var(--radius-tile)', cursor: 'pointer',
            border: '2px solid transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            background: today.complete ? 'var(--retro-green)' : 'transparent',
            color: today.complete ? '#fff' : 'var(--ink)',
            transition: 'background 0.15s',
          }}
        >
          <KidIcon name={today.complete ? 'star' : 'flame'} size={24} color={today.complete ? '#fff' : 'var(--ink)'} />
          Today
          {today.complete ? (
            <span style={{
              position: 'absolute', top: -7, right: -4, minWidth: 20, height: 20, padding: '0 5px',
              borderRadius: 'var(--radius-pill)', background: '#fff', color: 'var(--retro-green)', border: '2px solid var(--retro-green)',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 900, lineHeight: '16px', textAlign: 'center',
            }}>✓</span>
          ) : today.opened && today.left > 0 ? (
            <span style={{
              position: 'absolute', top: -7, right: -4, minWidth: 20, height: 20, padding: '0 5px',
              borderRadius: 'var(--radius-pill)', background: '#fff', color: 'var(--ink)', border: '2px solid var(--ink)',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, lineHeight: '16px', textAlign: 'center',
            }}>{today.left}</span>
          ) : null}
        </button>
      )}
      {tabs.map(([key, label, icon, dot]) => {
        const on = current === key
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            style={{
              position: 'relative',
              flex: 1, padding: '11px 4px', borderRadius: 'var(--radius-tile)', cursor: 'pointer',
              border: on ? 'var(--edge)' : '2px solid transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
              background: on ? '#fff' : 'transparent',
              color: 'var(--ink)',
              boxShadow: on ? 'var(--lift)' : 'none',
              transition: 'background 0.15s',
            }}
          >
            <KidIcon name={icon} size={24} color="var(--ink)" />
            {label}
            {dot > 0 && (
              <span style={{
                position: 'absolute', top: -7, right: -4, minWidth: 20, height: 20, padding: '0 5px',
                borderRadius: 'var(--radius-pill)', background: '#E5484D', color: '#fff', border: '2px solid #fff',
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
