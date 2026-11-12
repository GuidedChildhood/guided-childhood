import DigiStreakWidget from '@/components/digi/DigiStreakWidget'

// Dev fixture for the streak card's four states (12 November 2026): a live
// run with more lifetime days than the run, a run still warm, a restart after
// a missed day (the welcome back line), and a first ever day. The real Home
// needs a signed in family, so this is where the lifetime line is checked at
// 390 and 1280.
export default function Page() {
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px' }}>
      <DigiStreakWidget count={4} aliveToday total={23} firstName="Sam" />
      <DigiStreakWidget count={4} aliveToday={false} total={23} />
      <DigiStreakWidget count={0} aliveToday={false} total={23} firstName="Sam" />
      <DigiStreakWidget count={0} aliveToday={false} total={0} />
    </div>
  )
}
