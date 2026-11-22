'use client'
import QuestGamePlayer from '@/components/quest-games/QuestGamePlayer'
import { QUEST_GAMES } from '@/lib/quest-games/registry'

// Dev harness for Beat the clock: the first judgement game, played through,
// then the timed round from the finish card.
export default function QuestRoundHarness() {
  const game = QUEST_GAMES.find(g => g.mechanic === 'judge')!
  return <QuestGamePlayer game={game} onClose={() => {}} />
}
