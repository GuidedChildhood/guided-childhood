import PlanetCoins from '@/components/home/PlanetCoins'
import { planetOfTheWeek } from '@/lib/pathway/planets'

// Dev fixture for the coin row that sits under today's loop on Home.
//
// Home itself needs a signed in family with a real week behind it, so this is
// the only way to look at the coins at 390 and at 1280 without one. What it
// proves is the thing that actually goes wrong with a grid of six: whether the
// labels hold on one line on a phone, and whether the row strands two coins on
// their own at laptop width.

export default function PlanetCoinsFixture() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <PlanetCoins featured={planetOfTheWeek()} />
      </div>
    </div>
  )
}
