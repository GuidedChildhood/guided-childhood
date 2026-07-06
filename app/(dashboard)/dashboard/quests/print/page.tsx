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
            background: '#fff', border: '3px solid var(--ink)', borderRadius: '20px',
            padding: '24px 26px', marginBottom: '24px',
          }}>
            {/* Board banner, DiGi presiding */}
            <div style={{
              textAlign: 'center', marginBottom: '14px',
              border: '2.5px solid var(--ink)', borderRadius: '16px',
              padding: '14px 16px 12px', position: 'relative',
              background: 'var(--terracotta-lt)',
              display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/digi-squad/DiGi-star.svg" alt="" width={62} height={62} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '2px' }}>
                  ⭐ DiGi&apos;s quest board ⭐
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.9rem', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                  {child.name}&apos;s week
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/digi-squad/DiGi-star.svg" alt="" width={62} height={62} style={{ flexShrink: 0, transform: 'scaleX(-1)' }} />
            </div>

            {/* The prize and the star track to colour in */}
            {goal && (
              <div style={{
                border: '2px dashed var(--terracotta-dark)', borderRadius: '14px',
                padding: '12px 16px', marginBottom: '16px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', marginBottom: '6px' }}>
                  The prize: {goal.title}
                </div>
                <div style={{ fontSize: '19px', letterSpacing: '3px', lineHeight: 1.5, wordBreak: 'break-all' }}>
                  {Array.from({ length: Math.min(goal.stars_needed, 30) }).map((_, i) => '☆').join('')}
                  {goal.stars_needed > 30 ? ' …' : ''}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                  Colour a star every time a grown up approves a quest. Fill them all and the prize is yours.
                </div>
              </div>
            )}

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

            {/* Weekend family bonus */}
            <div style={{
              marginTop: '14px', border: '2px solid var(--ink)', borderRadius: '14px',
              padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px',
              background: 'var(--tint-sage)',
            }}>
              <span style={{ fontSize: '1.4rem' }}>🎲</span>
              <span style={{ flex: 1, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.45 }}>
                <strong>Family bonus:</strong> play one game together this weekend, screens off. Worth ⭐⭐⭐ extra.
              </span>
              <span style={{
                width: '26px', height: '26px', border: '2.5px solid var(--ink)', borderRadius: '8px', flexShrink: 0,
              }} />
            </div>

            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--ink-soft)', marginTop: '14px', marginBottom: 0 }}>
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
