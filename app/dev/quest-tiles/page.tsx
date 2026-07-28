import QuestShortcuts from '@/components/quests/QuestShortcuts'

// Layout harness for the Quests board tiles with live badges. No auth.
export default function Page() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: 20, maxWidth: 640, margin: '0 auto' }}>
      <QuestShortcuts status={{ ticksToConfirm: 4, printablesToConfirm: 2, schoolOpen: 1, agreementSigned: false }} />
    </main>
  )
}
