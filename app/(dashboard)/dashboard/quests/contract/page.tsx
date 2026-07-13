import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '../print/PrintButton'
import { getStarBanks } from '@/lib/quests/bank'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { PrintBrandHeader, PrintBrandFooter } from '@/components/brand/PrintBrand'

// The device time contract: the quest deal on paper, signed by both
// sides. The quests that earn stars, the before screens clause, the
// exchange rate, and how the score is kept (the star bank in the app is
// the ledger both sides can always see). One contract per child, fridge
// ready, printed with the brand like every other downloadable.

const SCHEDULE_LABELS: Record<string, string> = {
  daily: 'Every day', weekdays: 'School days', weekend: 'Weekends', once: 'One time',
}

export default async function ContractPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStartIso = weekStart.toISOString().slice(0, 10)

  const [childrenRes, questsRes, ticksRes, spendsRes] = await Promise.all([
    supabase.from('children').select('id, name').eq('parent_id', user.id).order('created_at'),
    supabase.from('family_quests').select('id, title, emoji, stars, schedule, child_id, blocks_screens').eq('user_id', user.id).eq('active', true).order('created_at'),
    supabase.from('quest_ticks').select('quest_id, child_id, status').eq('user_id', user.id).eq('status', 'approved').gte('tick_date', weekStartIso),
    supabase.from('star_spends').select('child_id, minutes, created_at').eq('user_id', user.id).gte('created_at', `${weekStartIso}T00:00:00Z`),
  ])

  const children = childrenRes.data ?? []
  const quests = questsRes.data ?? []
  const ticks = ticksRes.data ?? []
  const spends = spendsRes.data ?? []
  const banks = await getStarBanks(supabase, user.id, children.map(c => c.id))
  const starsByQuest = new Map(quests.map(q => [q.id, q.stars]))
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const mono: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase',
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .contract-sheet { page-break-after: always; border: 2px solid #1A1A2E !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '6px' }}>Family Quests</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
            The device time contract
          </h1>
        </div>
        <PrintButton />
      </div>
      <p className="no-print" style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '-8px 0 20px', maxWidth: '540px' }}>
        The quest deal on paper, signed by both of you. Stars pay for screen time, the before screens jobs come first, and the star bank in the app keeps the score for both sides.
      </p>

      {children.map(child => {
        const childQuests = quests.filter(q => q.child_id === child.id || q.child_id === null)
        if (childQuests.length === 0) return null
        const first = childQuests.filter(q => q.blocks_screens)
        const rest = childQuests.filter(q => !q.blocks_screens)
        const bank = banks.find(b => b.child_id === child.id)
        const weekStars = ticks
          .filter(t => t.child_id === child.id || t.child_id === null)
          .reduce((sum, t) => sum + (starsByQuest.get(t.quest_id) ?? 1), 0)
        const weekMinutes = spends
          .filter(s => s.child_id === child.id)
          .reduce((sum, s) => sum + (Number(s.minutes) || 0), 0)

        return (
          <div key={child.id} className="contract-sheet" style={{
            background: '#fff', border: '3px solid var(--ink)', borderRadius: '20px',
            padding: '26px 28px', marginBottom: '24px',
          }}>
            <PrintBrandHeader />

            <div style={{ textAlign: 'center', margin: '4px 0 18px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {child.name}&apos;s Device Time Contract
              </div>
              <div style={{ ...mono, fontSize: '10px', color: 'var(--ink-muted)', marginTop: '6px' }}>
                Agreed on {today}
              </div>
            </div>

            {/* The deal */}
            <div style={{
              border: '2px solid var(--ink)', borderRadius: '14px', padding: '13px 16px',
              marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px',
              background: 'var(--terracotta-lt)',
            }}>
              <span style={{ fontSize: '1.6rem' }}>⭐</span>
              <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
                The deal: quests earn stars, stars buy screen time. 1 star is {STAR_MINUTES} minutes. Stars only land when a grown up approves the job.
              </p>
            </div>

            {/* Before screens clause */}
            {first.length > 0 && (
              <div style={{ border: '2px dashed var(--terracotta-dark)', borderRadius: '14px', padding: '13px 16px', marginBottom: '16px' }}>
                <div style={{ ...mono, fontSize: '10px', color: 'var(--terracotta-dark)', marginBottom: '8px' }}>
                  📵 These come first, before any screens
                </div>
                {first.map(q => (
                  <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ width: 18, height: 18, border: '2px solid var(--ink)', borderRadius: '5px', flexShrink: 0 }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>{q.emoji} {q.title}</span>
                  </div>
                ))}
                <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', margin: '8px 0 0', lineHeight: 1.5 }}>
                  Done and shown to a grown up. Then the screens can come on.
                </p>
              </div>
            )}

            {/* The quest table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
              <thead>
                <tr>
                  {['Quest', 'When', 'Stars', 'Worth'].map(h => (
                    <th key={h} style={{ ...mono, textAlign: h === 'Quest' ? 'left' : 'center', padding: '7px 6px', fontSize: '9.5px', color: 'var(--ink-muted)', borderBottom: '2px solid var(--ink)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...first, ...rest].map(q => (
                  <tr key={q.id}>
                    <td style={{ padding: '9px 6px', borderBottom: '1px solid var(--border)', fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                      {q.emoji} {q.title}{q.blocks_screens ? ' 📵' : ''}
                    </td>
                    <td style={{ padding: '9px 4px', borderBottom: '1px solid var(--border)', textAlign: 'center', fontSize: '11px', color: 'var(--ink-soft)' }}>
                      {SCHEDULE_LABELS[q.schedule] ?? q.schedule}
                    </td>
                    <td style={{ padding: '9px 4px', borderBottom: '1px solid var(--border)', textAlign: 'center', fontSize: '12.5px', fontWeight: 700 }}>
                      ⭐ {q.stars}
                    </td>
                    <td style={{ padding: '9px 4px', borderBottom: '1px solid var(--border)', textAlign: 'center', fontSize: '11px', color: 'var(--ink-soft)' }}>
                      {q.stars * STAR_MINUTES} min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* How the score is kept */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {[
                { n: String(bank?.balance ?? 0), label: 'stars in the bank', sub: `${(bank?.balance ?? 0) * STAR_MINUTES} minutes ready` },
                { n: String(weekStars), label: 'earned this week', sub: 'approved quests' },
                { n: String(weekMinutes), label: 'minutes used', sub: 'this week' },
              ].map(stat => (
                <div key={stat.label} style={{ border: '1.5px solid var(--border)', borderRadius: '12px', padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: 'var(--ink)', lineHeight: 1 }}>{stat.n}</div>
                  <div style={{ ...mono, fontSize: '8px', color: 'var(--ink-muted)', marginTop: '5px' }}>{stat.label}</div>
                  <div style={{ fontSize: '9.5px', color: 'var(--ink-light)', marginTop: '1px' }}>{stat.sub}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
              How we keep score: every approved quest pays stars into the bank in the app. Screen time is bought from the bank before the screens go on, so both of us can always see what is earned, what is spent and what is left.
            </p>

            {/* Signatures */}
            <div style={{ display: 'flex', gap: '20px', paddingTop: '14px', borderTop: '1.5px solid var(--border)', flexWrap: 'wrap' }}>
              {['Parent', child.name].map(name => (
                <div key={name} style={{ flex: 1, minWidth: '160px' }}>
                  <div style={{ borderBottom: '2px solid var(--ink)', minHeight: '34px' }} />
                  <div style={{ ...mono, fontSize: '9px', color: 'var(--ink-muted)', marginTop: '5px' }}>
                    Signed, {name}
                  </div>
                </div>
              ))}
            </div>

            <PrintBrandFooter />
          </div>
        )
      })}

      {quests.length === 0 && (
        <p className="no-print" style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
          No quests set yet. Add some in the <Link href="/dashboard/quests" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>quest manager</Link> first, then print the contract.
        </p>
      )}
    </div>
  )
}
