import QuestShortcuts from '@/components/quests/QuestShortcuts'

// Layout harness for the Quests board tiles with live badges. No auth.
//
// Both states, because the badges are only half the design: the quiet board is
// what most families see most days, and it has to look finished rather than
// unloaded. Seeing them side by side is the only way to check that.
const BUSY = { ticksToConfirm: 4, printablesToConfirm: 2, schoolOpen: 1, agreementSigned: false, starsToSpend: 40, starChartPrinted: false, chartWeekDue: false, timeAsks: 1, timersRunning: 0 }
// A timer running with nobody asking: the screen timer's quiet badge, which is
// the case that proves the red is reserved rather than decorative.
const RUNNING = { ticksToConfirm: 0, printablesToConfirm: 0, schoolOpen: 0, agreementSigned: true, starsToSpend: 0, starChartPrinted: true, chartWeekDue: false, timeAsks: 0, timersRunning: 1 }
const QUIET = { ticksToConfirm: 0, printablesToConfirm: 0, schoolOpen: 0, agreementSigned: true, starsToSpend: 0, starChartPrinted: true, chartWeekDue: false, timeAsks: 0, timersRunning: 0 }
// Sunday, on an otherwise quiet board. The one state the weekly offer appears
// in, and worth its own row here because "For Monday" is a longer badge than
// anything else on these tiles and this is where it gets looked at.
const SUNDAY = { ticksToConfirm: 0, printablesToConfirm: 0, schoolOpen: 0, agreementSigned: true, starsToSpend: 0, starChartPrinted: true, chartWeekDue: true, timeAsks: 0, timersRunning: 0 }

export default function Page() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: 20, maxWidth: 640, margin: '0 auto' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>Something waiting</p>
      <QuestShortcuts status={BUSY} />
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7, marginTop: 32 }}>Timer running, nobody asking</p>
      <QuestShortcuts status={RUNNING} />
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7, marginTop: 32 }}>Sunday, chart to make for Monday</p>
      <QuestShortcuts status={SUNDAY} />
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7, marginTop: 32 }}>All clear</p>
      <QuestShortcuts status={QUIET} />
    </main>
  )
}
