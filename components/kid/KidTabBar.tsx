'use client'

import KidIcon, { type KidIconName } from '@/components/kid/KidIcon'

// The child's sticky Quests, Lessons, Printables bar, on a butter surface.
//
// ── WHY THE LABELS SHRINK AND THE TABS DO NOT (14 September 2026) ───────────
//
// Justin, from his phone: "tabs here misaligned". Printables was running off
// the right edge of its own bar.
//
// Four tabs, each `flex: 1`, is not enough. A flex item's default min-width is
// AUTO, which means it will not shrink below the width of its own content, so
// the longest label decides the width of the bar rather than the bar deciding
// the size of the label. Measured: "Printables" wants 103px, and at a 360px
// phone the four tabs together want 19px more than the bar has. It fits at
// 390 by 7px, which is why it looked fine here and broken on a real phone:
// any larger text setting in iOS spends that 7px immediately.
//
// So `minWidth: 0` lets a tab shrink, and the LABEL gives way first: it takes
// a fluid size that falls with the viewport and never wraps. The icon, the tap
// target and the chunky edges stay exactly as they were, because those are the
// parts a thumb and an eye need. A word set a point smaller is still a word; a
// word past the edge of the screen is not.
//
// The Happy Newspaper pass (design-refs/happy-newspaper-notes.md): the one
// place the brand yellow is a surface rather than a mark is the shop strip
// on a phone. This is ours: butter ground, ink edge and ledge, the chosen
// tab a white card sat on it, the others ink on butter. Same three tabs,
// same taps, same red badges; the screen decides what a tap does.

export type KidTab = 'quests' | 'lessons' | 'print'

// The label gives way before the bar does. The floor is the smallest a label
// may get and still read as a word under a 24px icon; the ceiling is the size
// the bar had before any of this, so nothing changes on a wide screen.
const LABEL = 'clamp(0.72rem, 3.4vw, var(--text-md))'

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
  /**
   * Red counts on lessons and printables, the moment something NEW is waiting
   * for the child, plus `waiting`: how many of their own asks are sitting with
   * their grown up.
   *
   * Justin, 14 September 2026: "we should have printables and update on jobs,
   * e.g. waiting on parents to do." A child who has pitched an idea or asked
   * for screen time had no way to see that from the bar, so they either kept
   * opening the tab to check or assumed nothing had happened. The two counts
   * are deliberately different marks: red is something new FOR them to do,
   * butter is something of theirs someone else still has.
   */
  badges: { lessons: number; print: number; waiting?: number }
  /** What is left today. Null keeps the bar as it was (three tabs). */
  today?: TodayTab | null
  onToday?: () => void
}) {
  const waiting = Math.max(0, badges.waiting ?? 0)
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
            position: 'relative', flex: '1 1 0', minWidth: 0, padding: '11px 2px', borderRadius: 'var(--radius-tile)', cursor: 'pointer',
            border: '2px solid transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: LABEL, whiteSpace: 'nowrap',
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
              flex: '1 1 0', minWidth: 0, padding: '11px 2px', borderRadius: 'var(--radius-tile)', cursor: 'pointer',
              border: on ? 'var(--edge)' : '2px solid transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: LABEL, whiteSpace: 'nowrap',
              background: on ? '#fff' : 'transparent',
              color: 'var(--ink)',
              boxShadow: on ? 'var(--lift)' : 'none',
              transition: 'background 0.15s',
            }}
          >
            <KidIcon name={icon} size={24} color="var(--ink)" />
            {label}
            {/* Waiting on a grown up. Butter and ink rather than red, because
                nothing is wrong and nothing is owed by the child: somebody
                else has their ask. An hourglass says that without a word,
                which is the only way to say it in the space a badge has. */}
            {key === 'quests' && waiting > 0 && (
              <span
                data-waiting-badge={waiting}
                aria-label={`${waiting} waiting for your grown up`}
                style={{
                  position: 'absolute', top: -7, right: -4, minWidth: 20, height: 20, padding: '0 5px',
                  borderRadius: 'var(--radius-pill)', background: 'var(--terracotta)', color: 'var(--ink)',
                  border: '2px solid var(--ink)',
                  // A white ring outside the ink edge, so a butter badge still
                  // separates from the butter bar when this tab is not the
                  // chosen one. Without it the fill and the ground are the
                  // same colour and only the ring reads.
                  boxShadow: '0 0 0 2px #fff',
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 900, lineHeight: '16px',
                  textAlign: 'center',
                }}
              >
                {waiting > 9 ? '9+' : waiting}
              </span>
            )}
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
