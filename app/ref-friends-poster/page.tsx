import FriendsPoster from '@/components/printables/FriendsPoster'

// Layout fixture for the Planet Friends poster.
//
// The real page needs a logged in parent and a child, so the three shapes that
// matter are rendered here instead. The middle one is the ordinary case and the
// two ends are where a sheet goes wrong: nobody home yet, and everybody home.
//
// Printed sheets get their own fixture for a reason that cost a day earlier
// this week. A page that measures 297mm in CSS arrived at the printer at
// 317.8mm because of the app's body zoom, and the only way anybody was ever
// going to see that was to render the sheet and measure it.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

const CASES: [string, number][] = [
  ['Nobody home yet, 0 full days', 0],
  ['Three home, the ordinary middle, 25 full days', 25],
  ['Everybody home, 58 full days', 58],
]

export default function RefFriendsPoster() {
  return (
    <main style={{ background: 'var(--app-bg)', minHeight: '100vh', padding: '24px 16px 60px' }}>
      {/* Only the sheets go to the printer. Without this the fixture's own
          heading and padding pushed the first sheet down the page and three
          sheets came out as four sides, which is the exact failure the sheet's
          own print rules exist to prevent. */}
      <style>{`@media print { main { padding: 0 !important; background: #fff !important } }`}</style>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p className="fp-noprint" style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 16px',
        }}>
          Reference · the Planet Friends poster
        </p>
        {CASES.map(([label, days]) => (
          <div key={label} className="fp-case" style={{ marginBottom: 26 }}>
            <p className="fp-noprint" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', fontWeight: 700, margin: '0 0 8px' }}>
              {label}
            </p>
            <FriendsPoster childName="Teo" fullDays={days} />
          </div>
        ))}
      </div>
    </main>
  )
}
