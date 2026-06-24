import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const CATEGORY_META: Record<string, {
  label: string
  description: string
  accent: string
  bg: string
  border: string
  textOnAccent: string
}> = {
  'first-device':  { label: 'First Device',        description: 'Setting up healthy habits from day one',          accent: 'var(--green-dark)', bg: 'var(--green-lt)',  border: 'var(--green-b)',  textOnAccent: '#fff' },
  'screen-time':   { label: 'Screen Time',          description: 'Navigating limits without the battles',           accent: 'var(--green-dark)', bg: 'var(--green-lt)',  border: 'var(--green-b)',  textOnAccent: '#fff' },
  'gaming':        { label: 'Gaming',               description: 'When gaming feels like it is taking over',        accent: 'var(--lav-deep)',   bg: 'var(--lav)',       border: '#b8c8f0',         textOnAccent: '#fff' },
  'social-media':  { label: 'Social Media',         description: 'From the first ask to identity and influence',    accent: 'var(--coral)',      bg: 'var(--coral-lt)',  border: 'var(--coral)',    textOnAccent: '#fff' },
  'online-safety': { label: 'Online Safety',        description: 'Strangers, privacy, and knowing the risks',       accent: 'var(--gold-dark)',  bg: 'var(--gold-lt)',   border: 'var(--gold)',     textOnAccent: '#fff' },
  'cyberbullying': { label: 'Cyberbullying',        description: 'What to say when they are hurting online',        accent: 'var(--coral)',      bg: 'var(--coral-lt)',  border: 'var(--coral)',    textOnAccent: '#fff' },
  'mental-health': { label: 'Mental Health',        description: 'When screens are affecting how they feel',        accent: 'var(--lav-deep)',   bg: 'var(--lav)',       border: '#b8c8f0',         textOnAccent: '#fff' },
  'body-image':    { label: 'Body Image',           description: 'Comparison culture and how to counter it',        accent: 'var(--coral)',      bg: 'var(--coral-lt)',  border: 'var(--coral)',    textOnAccent: '#fff' },
  'identity':      { label: 'Identity',             description: 'Who they are online vs who they are at home',     accent: 'var(--green-dark)', bg: 'var(--green-lt)',  border: 'var(--green-b)',  textOnAccent: '#fff' },
  'ai-technology': { label: 'AI and Technology',    description: 'Deepfakes, AI tools, and what to do about them',  accent: 'var(--ink)',        bg: 'var(--warm)',      border: 'var(--border)',   textOnAccent: '#fff' },
  'family-rules':  { label: 'Family Rules',         description: 'Building agreements that actually stick',         accent: 'var(--gold-dark)',  bg: 'var(--gold-lt)',   border: 'var(--gold)',     textOnAccent: '#fff' },
  'school':        { label: 'School',               description: 'Devices, homework, and classroom distraction',    accent: 'var(--lav-deep)',   bg: 'var(--lav)',       border: '#b8c8f0',         textOnAccent: '#fff' },
  'relationships': { label: 'Relationships',        description: 'Friendships, connections, and who they trust',    accent: 'var(--green-dark)', bg: 'var(--green-lt)',  border: 'var(--green-b)',  textOnAccent: '#fff' },
}

type CategoryRow = {
  category: string
  script_count: number
  has_free: boolean
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

  const { data: scriptRows } = await supabase
    .from('scripts')
    .select('category, is_free')

  const catMap = new Map<string, { count: number; hasFree: boolean }>()
  for (const row of scriptRows ?? []) {
    if (!row.category) continue
    const existing = catMap.get(row.category) ?? { count: 0, hasFree: false }
    catMap.set(row.category, { count: existing.count + 1, hasFree: existing.hasFree || row.is_free })
  }

  const categories: CategoryRow[] = Object.keys(CATEGORY_META).map(k => {
    const agg = catMap.get(k)
    return { category: k, script_count: agg?.count ?? 0, has_free: agg?.hasFree ?? (k === 'first-device') }
  }).filter(c => c.script_count > 0 || c.category === 'first-device')

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ marginBottom: '28px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Conversation tools</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '8px' }}>Scripts</h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px', lineHeight: 1.55 }}>
          Real conversations for real moments. Tap a topic to see what to say, what not to say, and why it works.
        </p>
      </div>

      {!isPaid && (
        <div style={{
          background: 'var(--gold-lt)', border: '2px solid var(--gold)',
          borderRadius: '14px', padding: '16px 20px', marginBottom: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '16px', flexWrap: 'wrap',
        }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold-dark)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Free plan
            </span>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '4px' }}>
              First Device scripts are free. Upgrade to unlock all categories.
            </p>
          </div>
          <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ flexShrink: 0, padding: '10px 20px', fontSize: '12px' }}>
            Unlock everything
          </Link>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
      }}>
        {categories.map(row => {
          const meta = CATEGORY_META[row.category]
          if (!meta) return null
          const isLocked = !isPaid && !row.has_free
          return (
            <Link
              key={row.category}
              href={isLocked ? '/dashboard/upgrade' : `/dashboard/scripts/category/${row.category}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div style={{
                background: isLocked ? 'var(--warm)' : meta.bg,
                border: `1.5px solid ${isLocked ? 'var(--border)' : meta.border}`,
                borderRadius: '18px',
                overflow: 'hidden',
                opacity: isLocked ? 0.75 : 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              className="category-tile"
              >
                {/* Colored accent bar */}
                <div style={{
                  background: isLocked ? 'var(--ink-light)' : meta.accent,
                  padding: '14px 18px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.9)',
                  }}>
                    {row.script_count > 0 ? `${row.script_count} scripts` : 'Scripts'}
                  </span>
                  {isLocked && (
                    <span style={{ fontSize: '14px', opacity: 0.8 }}>🔒</span>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: '16px 18px 18px' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '17px',
                    color: 'var(--ink)',
                    lineHeight: 1.2,
                    marginBottom: '7px',
                    letterSpacing: '-0.01em',
                  }}>
                    {meta.label}
                  </div>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--ink-muted)',
                    lineHeight: 1.5,
                    margin: 0,
                  }}>
                    {meta.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <style>{`
        .category-tile:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }
        @media (min-width: 520px) {
          .category-tile-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  )
}
