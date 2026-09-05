import PlanetFriends from '@/components/planet/PlanetFriends'
import { resolveTheme } from '@/lib/kid/theme'
import { applyEvent, newHome, type CodeMode, type RewardKey, type Tier } from '@/lib/planet/logic'
import { MISSION_DEFS } from '@/lib/planet/missions'

const REWARD_KEYS: RewardKey[] = ['dome', 'flag', 'ring', 'pool', 'lamp', 'star', 'blanket', 'moon', 'moonflower']
// The pretend code on the pretend card, one per shape, so the pad can be driven.
export const FIXTURE_CODES: Record<CodeMode, string[]> = { pictures: ['star', 'moon', 'rocket'], letters: ['m', 'o', 'o', 'n'] }
const isRewardKey = (k: string): k is RewardKey => (REWARD_KEYS as string[]).includes(k)
import type { HomeView } from '@/lib/planet/view'

// Dev fixture for Planet Friends: the home planet with a pretend save and no
// database, so every slot can be dragged and every overlay reached by
// Playwright. The same pure rules run locally in fixture mode.
//
//   ?tier=1|2|3        one Friend, two, or three (default 1)
//   ?age=3..16         the child's age, which decides who is still a baby (default 4)
//   ?energy=0..100     starting starlight for every Friend (default 100)
//   ?stage=0..5        how far the planet has grown (default 1)
//   ?phase=day|winddown|bedtime
//   ?rest=nap          every Friend already in the pod
//   ?grew=1            a while you were away card waiting
//   ?rewards=dome,flag what the missions have already brought home
//   ?doing=spider_legs  missions already under way, the first on the board
//   ?landed=plant_seed a mission just approved, the reveal waiting
//   ?card=pictures|letters  the Moonflower card printed, in that shape (the code is FIXTURE_CODES)
//   ?accent=coral      the child's theme
// Never reachable in production (the dev layout gates on VERCEL_ENV).

export const dynamic = 'force-dynamic'

export default async function PlanetFixture({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const tier: Tier = sp.tier === '3' ? 3 : sp.tier === '2' ? 2 : 1
  const now = new Date().toISOString()
  let home = newHome(tier, now, null)
  const energy = sp.energy !== undefined ? Math.max(0, Math.min(100, Number(sp.energy))) : 100
  const stage = sp.stage !== undefined ? Math.max(0, Math.min(5, Number(sp.stage))) : 1
  home = { ...home, growthStage: stage, friends: home.friends.map(f => ({ ...f, energy })) }
  if (sp.rest === 'nap') for (const f of home.friends) home = applyEvent(home, { kind: 'nap_start', friend: f.key }, now)
  if (sp.grew === '1') home = { ...home, grewWhileAway: 25 }
  if (sp.rewards) home = { ...home, rewards: sp.rewards.split(',').filter(isRewardKey) }
  if (sp.doing) for (const key of sp.doing.split(',')) if (MISSION_DEFS[key]) home = applyEvent(home, { kind: 'mission_start', key }, now, MISSION_DEFS)
  if (sp.landed && MISSION_DEFS[sp.landed]) {
    home = applyEvent(home, { kind: 'mission_start', key: sp.landed }, now, MISSION_DEFS)
    home = applyEvent(home, { kind: 'mission_approve', key: sp.landed }, now, MISSION_DEFS)
  }
  const phase = sp.phase === 'winddown' ? 'winddown' : sp.phase === 'bedtime' ? 'bedtime' : 'day'
  const view: HomeView = {
    home, serverNow: now, tier,
    childAge: sp.age !== undefined ? Math.max(0, Math.min(16, Number(sp.age))) : 4,
    bedtime: { phase, startMin: 19 * 60, endMin: 7 * 60, minutesNow: phase === 'bedtime' ? 20 * 60 : phase === 'winddown' ? 18 * 60 + 40 : 15 * 60, windowUntil: null },
    ask: null, screenAsk: null, starMinutes: 5,
    cards: sp.card === 'pictures' || sp.card === 'letters' ? [{ key: 'moonflower_card', mode: sp.card, printed: true }] : [],
  }
  return (
    <PlanetFriends
      token={null}
      fixture
      initial={view}
      theme={resolveTheme(sp.accent ?? null)}
      childName="Teo"
      fixtureAnswers={sp.card === 'pictures' || sp.card === 'letters' ? { moonflower_card: FIXTURE_CODES[sp.card] } : undefined}
    />
  )
}
