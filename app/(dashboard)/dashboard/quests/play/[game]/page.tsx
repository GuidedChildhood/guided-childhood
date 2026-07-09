import { notFound } from 'next/navigation'
import { getQuestGame } from '@/lib/quest-games/registry'
import QuestGamePlayer from '@/components/quest-games/QuestGamePlayer'

export default async function PlayQuestGamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game: key } = await params
  const game = getQuestGame(key)
  if (!game) notFound()
  return <QuestGamePlayer game={game} />
}
