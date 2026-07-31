import QuestBoard from '@/components/quests/QuestBoard'

// Layout fixture for the Family Quests board on Home. QuestBoard fetches
// /api/quests itself rather than taking props, so this page hands it nothing
// and the checking harness stubs that one route. Same as every other ref-*
// page: real component, fake data, 404 in production via middleware.

export default function RefQuestBoard() {
  return (
    <main style={{ background: 'var(--butter)', minHeight: '100vh', padding: '20px 16px' }}>
      <div data-ref-card style={{
        background: 'var(--white)', borderRadius: '20px', padding: '18px 16px',
        border: '1.5px solid var(--border)',
      }}>
        <QuestBoard />
      </div>
    </main>
  )
}
