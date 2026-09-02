import PlanterGarden from '@/components/planter/PlanterGarden'
import { resolveTheme } from '@/lib/kid/theme'
import { applyEvent, newGarden, type Tier } from '@/lib/planter/logic'
import { starterPlants } from '@/lib/planter/registry'
import type { GardenView } from '@/lib/planter/view'

// Dev fixture for Planter Friends: the greenhouse with a pretend garden and
// no database, so every slot can be dragged and every overlay reached by
// Playwright. The same pure rules run locally in fixture mode.
//
//   ?tier=1|2          one plant or two (default 1)
//   ?energy=0..100     starting energy for every plant (default 100)
//   ?phase=day|winddown|bedtime
//   ?rest=nap          every plant already napping (the nursery)
//   ?grew=1            a while you were away card waiting
//   ?accent=coral      the child's theme
// Never reachable in production (the dev layout gates on VERCEL_ENV).

export const dynamic = 'force-dynamic'

export default async function PlanterFixture({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const tier: Tier = sp.tier === '2' ? 2 : 1
  const now = new Date().toISOString()
  let garden = newGarden(tier, now, starterPlants(tier), null)
  const energy = sp.energy !== undefined ? Math.max(0, Math.min(100, Number(sp.energy))) : 100
  garden = { ...garden, plants: garden.plants.map(p => ({ ...p, energy, growthStage: 4 })) }
  if (sp.rest === 'nap') for (const p of garden.plants) garden = applyEvent(garden, { kind: 'nap_start', plantId: p.id }, now)
  if (sp.grew === '1') garden = { ...garden, plants: garden.plants.map(p => ({ ...p, grewWhileAway: 25 })) }
  const phase = sp.phase === 'winddown' ? 'winddown' : sp.phase === 'bedtime' ? 'bedtime' : 'day'
  const view: GardenView = {
    garden, serverNow: now, tier,
    bedtime: { phase, startMin: 19 * 60, endMin: 7 * 60, minutesNow: phase === 'bedtime' ? 20 * 60 : phase === 'winddown' ? 18 * 60 + 40 : 15 * 60, windowUntil: null },
    ask: null, screenAsk: null, starMinutes: 5,
  }
  return (
    <PlanterGarden
      token={null}
      fixture
      initial={view}
      theme={resolveTheme(sp.accent ?? null)}
      childName="Teo"
      gardener={{ name: 'DiGi', img: '/digi-squad/DiGi-star.svg' }}
    />
  )
}
