import QuestStatusBoard from '@/components/quests/QuestStatusBoard'

// Fixture reference page: the REAL status board, so its caught up line and its
// busy board can both be seen without a logged in parent. The component fetches
// its own data, so a browser checking this stubs that one response.
//
// 404s on the live deployment, like every other ref- page (middleware.ts).
export const dynamic = 'force-dynamic'

export default function RefStatusBoardPage() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: 20, maxWidth: 640, margin: '0 auto' }}>
      <QuestStatusBoard />
    </main>
  )
}
