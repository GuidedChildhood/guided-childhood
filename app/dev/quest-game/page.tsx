import { notFound } from 'next/navigation'
import { getQuestGame, QUEST_GAMES } from '@/lib/quest-games/registry'
import QuestGamePlayer from '@/components/quest-games/QuestGamePlayer'

// Dev only fixture: any quest game by key, so a new mechanic can be built
// and played without a database or a signed in parent. ?game=<key> opens
// that game; no key lists every key in the registry. Never reachable in
// production (the dev layout gates on VERCEL_ENV).

export const dynamic = 'force-dynamic'

export default async function QuestGameFixturePage({ searchParams }: { searchParams: Promise<{ game?: string }> }) {
  const sp = await searchParams
  if (!sp.game) {
    return (
      <div style={{ padding: '30px', fontFamily: 'var(--font-mono)' }}>
        <p style={{ fontWeight: 700 }}>?game=</p>
        <ul>{QUEST_GAMES.map(g => <li key={g.key}><a href={`/dev/quest-game?game=${g.key}`}>{g.key}</a> · {g.mechanic}</li>)}</ul>
      </div>
    )
  }
  const game = getQuestGame(sp.game)
  if (!game) notFound()
  return <QuestGamePlayer game={game} />
}
