import QuestManager from './QuestManager'

// Family Quests: the parent manager. Set the quests, the stars, the goal,
// send the kid their link or print the sheet. The deal lives here.

export default function QuestsPage() {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <QuestManager />
    </div>
  )
}
