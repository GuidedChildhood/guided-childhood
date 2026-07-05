import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PrintButton from './PrintButton'

// The printable quest sheet: one week per child, big tick boxes, fridge
// ready. For under phone age children this IS the interface; the parent
// approves ticks from the dashboard as they happen in real life.

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default async function QuestPrintPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [childrenRes, questsRes, goalsRes] = await Promise.all([
    supabase.from('children').select('id, name').eq('parent_id', user.id).order('created_at'),
    supabase.from('family_quests').select('id, title, emoji, stars, schedule, child_id').eq('user_id', user.id).eq('active', true).order('created_at'),
    supabase.from('star_goals').select('child_id, title, stars_needed').eq('user_id', user.id),
  ])

  const children = childrenRes.data ?? []
  const quests = questsRes.data ?? []
  const goals = goalsRes.data ?? []

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .quest-sheet { page-break-after: always; border: 2px solid #1A1A2E !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '6px' }}>Family Quests</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
            This week&apos;s quest sheets
          </h1>
        </div>
        <PrintButton />
      </div>

      {children.map(child => {
        const childQuests = quests.filter(q => q.child_id === child.id || q.child_id === null)
        if (childQuests.length === 0) return null
        const goal = goals.find(g => g.child_id === child.id)
        return (
          <div key={child.id} className="quest-sheet" style={{
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px',
            padding: '26px 28px', marginBottom: '24px',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>
                Quest sheet
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                {child.name}&apos;s week
              </div>
              {goal && (
                <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                  Saving for: <strong>{goal.title}</strong> (⭐ {goal.stars_needed})
                </div>
              )}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px 6px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', borderBottom: '2px solid var(--ink)' }}>
                    Quest
                  </th>
                  {DAYS.map(d => (
                    <th key={d} style={{ padding: '8px 4px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', borderBottom: '2px solid var(--ink)', width: '44px' }}>
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {childQuests.map(q => (
                  <tr key={q.id}>
                    <td style={{ padding: '10px 6px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '1.05rem', marginRight: '8px' }}>{q.emoji}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>{q.title}</span>
                      <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}> ⭐{q.stars}</span>
                    </td>
                    {DAYS.map((d, i) => {
                      const weekend = i >= 5
                      const off = (q.schedule === 'weekdays' && weekend) || (q.schedule === 'weekend' && !weekend)
                      return (
                        <td key={d} style={{ padding: '10px 4px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                          {off ? (
                            <span style={{ color: 'var(--ink-light)', fontSize: '12px' }}>·</span>
                          ) : (
                            <span style={{
                              display: 'inline-block', width: '24px', height: '24px',
                              border: '2px solid var(--ink)', borderRadius: '7px',
                            }} />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--ink-soft)', marginTop: '16px', marginBottom: 0 }}>
              Tick the box when it is done, then show a grown up. Stars land when they approve. ⭐
            </p>
          </div>
        )
      })}

      {quests.length === 0 && (
        <p className="no-print" style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
          No quests set yet. Add some in the quest manager first.
        </p>
      )}
    </div>
  )
}
