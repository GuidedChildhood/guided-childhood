import Link from 'next/link'
import QuestManager from './QuestManager'

// Family Quests: the parent manager. Set the quests, the stars, the goal,
// send the kid their link or print the sheet. The deal lives here. Sending
// a lesson to the child moved to the Lessons tab (its one home now), so
// this page points there rather than duplicating it.

export default function QuestsPage() {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <QuestManager />

      <Link href="/dashboard/lessons" style={{ textDecoration: 'none', display: 'block', marginTop: '28px' }}>
        <div style={{
          background: 'var(--stage-3)', border: '1.5px solid var(--stage-3)', borderRadius: '16px',
          padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '4px' }}>
              Looking for star lessons?
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
              Send a lesson to their device
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '4px' }}>
              Lessons now live in one place. Open Lessons and tap Send to your child. It still lands as a quest.
            </div>
          </div>
          <span style={{ fontSize: '18px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
        </div>
      </Link>
    </div>
  )
}
