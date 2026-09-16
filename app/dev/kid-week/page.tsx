import KidWeekCalendar from '@/components/kid/KidWeekCalendar'
import KidMission from '@/components/kid/KidMission'
import { buildMission } from '@/lib/kid/mission'
import { buddyFor } from '@/lib/kid/buddy'

// Dev fixture: the child's week calendar (14 September 2026, the Kenji note).
// Three tones, three states: mid week with three done, a fresh week, and a
// full week. The friend is Bloop; ?buddy=pebble for another.

export const dynamic = 'force-dynamic'

const LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const week = (done: number[], today: number) => LETTERS.map((letter, i) => ({ letter, done: done.includes(i), isToday: i === today, ahead: i > today }))

export default async function KidWeekFixture({ searchParams }: { searchParams: Promise<{ buddy?: string }> }) {
  const sp = await searchParams
  const b = buddyFor(sp.buddy ?? 'bloop')
  const friend = { name: b.name, img: b.img }
  return (
    <main style={{ minHeight: '100dvh', background: 'var(--app-bg, #F3F1EC)', padding: '24px 16px 60px', display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 460, margin: '0 auto' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0 }}>Reference · the child's week</p>
      <KidWeekCalendar days={week([0, 1, 2], 3)} friend={friend} title="My week" count={{ n: 3, word: 'full days' }} line="3 full days so far. Keep going." />
      <KidWeekCalendar days={week([], 0)} friend={friend} title="This week" count={{ n: 0, of: 7, word: 'days' }} line="A fresh week. Finish today and your Friend lands here." tone="butter" />
      <KidWeekCalendar days={week([0, 1, 2, 3, 4, 5, 6], 6)} friend={friend} title="Quest days" count={{ n: 7, of: 7, word: 'days' }} line="Amazing, 7 days this week!" tone="green" />
      {/* The mission under the week (14 September 2026): the next sticker on
          each objective, from a small fixture book. */}
      <KidMission rows={buildMission([
        { key: 'friend-pebble', name: 'Pebble', art: '/digi-squad/friends/pebble.png', colour: '#EDC35F', earned: false, rule: { kind: 'friend', n: 1, streaks: 2 }, have: 1, need: 2 },
        { key: 'friend-bloop', name: 'Bloop', art: '/digi-squad/friends/bloop.png', colour: '#2F8F6B', earned: false, rule: { kind: 'friend', n: 2, streaks: 10 }, have: 1, need: 10 },
        { key: 'lessons-1', name: 'First Lesson', emoji: '📚', colour: '#2E6F8E', earned: true, rule: { kind: 'lessons', n: 1 }, have: 3, need: 1 },
        { key: 'lessons-5', name: 'Five Lessons', emoji: '📚', colour: '#2E6F8E', earned: false, rule: { kind: 'lessons', n: 5 }, have: 3, need: 5 },
        { key: 'stamp-explorer', name: 'Explorer Stamp', emoji: '🛂', colour: '#2E6F8E', earned: false, rule: { kind: 'stamp', n: 3 }, have: 3, need: 12 },
        { key: 'outside-1', name: 'Fresh Air', emoji: '🌳', colour: '#2F8F6B', earned: true, rule: { kind: 'outside', n: 1 }, have: 1, need: 1 },
        { key: 'outside-10', name: 'Outdoor Ten', emoji: '🌳', colour: '#2F8F6B', earned: false, rule: { kind: 'outside', n: 10 }, have: 1, need: 10 },
        { key: 'timer-7', name: 'Timer Week', emoji: '⏱️', colour: '#2E6F8E', earned: false, rule: { kind: 'timer', n: 7 }, have: 6, need: 7 },
      ], { token: '0123456789abcdef01' })} />
      {/* The same three rows with the balance objective on an OUTSIDE sticker
          rather than the timer, which is the case that has no door: it is
          ticked on the Move about row of the five a day above. */}
      <KidMission rows={buildMission([
        { key: 'friend-pebble', name: 'Pebble', art: '/digi-squad/friends/pebble.png', colour: '#EDC35F', earned: false, rule: { kind: 'friend', n: 1, streaks: 2 }, have: 1, need: 2 },
        { key: 'lessons-5', name: 'Five Lessons', emoji: '📚', colour: '#2E6F8E', earned: false, rule: { kind: 'lessons', n: 5 }, have: 1, need: 5 },
        { key: 'outside-1', name: 'Fresh Air', emoji: '🌳', colour: '#2F8F6B', earned: false, rule: { kind: 'outside', n: 1 }, have: 0, need: 1 },
      ], { token: '0123456789abcdef01' })} />
      <div style={{ background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: 14 }}>
        <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Compact, inside another card</p>
        <KidWeekCalendar days={week([1, 3], 4)} friend={friend} compact />
      </div>
    </main>
  )
}
