import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Stage metadata, keyed by the stage_id stored in the scripts table.
// These names are canonical (see lib/content/stages.ts) and match the database.
const STAGE_META = {
  foundation:  { num: 1, label: 'Foundation',  ages: 'Ages 4 to 7',        color: 'var(--green-dark)', bg: 'var(--green-lt)' },
  builder:     { num: 2, label: 'Builder',     ages: 'Ages 8 to 10',       color: 'var(--lav-deep)',   bg: 'var(--lav)' },
  explorer:    { num: 3, label: 'Explorer',    ages: 'Ages 11 to 13',      color: 'var(--coral)',      bg: 'var(--coral-lt)' },
  shaper:      { num: 4, label: 'Shaper',      ages: 'Ages 13 to 15',      color: 'var(--gold-dark)',  bg: 'var(--gold-lt)' },
  independent: { num: 5, label: 'Independent', ages: 'Ages 16 and above',  color: 'var(--ink-soft)',   bg: 'var(--warm)' },
} as const

type StageId = keyof typeof STAGE_META

type ScriptRow = {
  id: string
  stage_id: StageId
  title: string
  situation: string
  is_free: boolean
  sort_order: number
}

export default async function ScriptsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  const isPaid = profile?.subscription_status === 'active'

  // Row level security does the gating for us: a free member only ever receives
  // is_free scripts, a paid member receives all of them. We still order by stage
  // and then sort_order so the library reads as a journey from age 4 to 16.
  const { data: scriptsData } = await supabase
    .from('scripts')
    .select('id, stage_id, title, situation, is_free, sort_order')
    .order('sort_order', { ascending: true })

  const scripts = (scriptsData ?? []) as ScriptRow[]

  // Group by stage so the page mirrors the pathway, the way Good Inside groups by age.
  const byStage = (Object.keys(STAGE_META) as StageId[]).map(stageId => ({
    stageId,
    meta: STAGE_META[stageId],
    items: scripts.filter(s => s.stage_id === stageId),
  })).filter(group => group.items.length > 0)

  const freeCount = scripts.filter(s => s.is_free).length

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Conversation tools</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '8px' }}>Scripts</h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
          What to say, what not to say, and why it works. Scripts for real moments, not perfect families.
        </p>
      </div>

      {!isPaid && (
        <div style={{ background: 'var(--gold-lt)', border: '2px solid var(--gold)', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold-dark)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Free plan</span>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '4px' }}>
              You have {freeCount} free scripts. Membership unlocks the full library of 100 plus, every stage from 4 to 16.
            </p>
          </div>
          <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ flexShrink: 0, padding: '10px 20px', fontSize: '12px' }}>
            Unlock all
          </Link>
        </div>
      )}

      {byStage.map(group => (
        <section key={group.stageId} style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: group.meta.color, background: group.meta.bg,
              padding: '4px 10px', borderRadius: '100px',
            }}>
              Stage {group.meta.num}: {group.meta.label}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {group.meta.ages}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {group.items.map(script => (
              <Link
                key={script.id}
                href={`/dashboard/scripts/${script.id}`}
                style={{
                  display: 'block', textDecoration: 'none',
                  background: 'var(--warm)', border: '1px solid var(--border)',
                  borderRadius: '14px', padding: '16px 18px',
                }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', marginBottom: '4px' }}>
                  {script.title}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                  {script.situation}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {!isPaid && (
        <div style={{
          background: 'var(--warm)', border: '2px dashed var(--border)',
          borderRadius: '14px', padding: '24px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>🔒</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
            The full library of 100 plus scripts is unlocked with membership
          </div>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '16px' }}>
            Every stage from 4 to 16. Gaming, safety, social media, AI, body image, sleep, and the hard moments in between.
          </p>
          <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-flex' }}>
            Unlock all scripts
          </Link>
        </div>
      )}
    </div>
  )
}
