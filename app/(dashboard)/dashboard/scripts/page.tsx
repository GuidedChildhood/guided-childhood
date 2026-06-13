import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const FREE_SCRIPT_IDS = [1, 2, 3]

const SCRIPTS = [
  { id: 1, title: 'The First Device Conversation', stage: 1, context: 'When you are introducing the first screen or device', tag: 'Foundation' },
  { id: 2, title: 'The Bedroom Rule', stage: 2, context: 'Before or after your child gets a personal device', tag: 'Habits' },
  { id: 3, title: 'The Algorithm Conversation', stage: 3, context: 'When they are approaching social media age', tag: 'Critical Window' },
  { id: 4, title: 'When Things Go Wrong Online', stage: 3, context: 'If something upsetting has happened online', tag: 'Safety' },
  { id: 5, title: 'The Mood and Phone Connection', stage: 3, context: 'When mood changes seem tied to device use', tag: 'Wellbeing' },
  { id: 6, title: 'The Gaming Conversation', stage: 2, context: 'When gaming feels like it is taking over', tag: 'Gaming' },
  { id: 7, title: 'The Social Media Ask', stage: 3, context: 'When they are asking for social media accounts', tag: 'Social Media' },
  { id: 8, title: 'The Bedtime Device Check-In', stage: 2, context: 'Introducing the device off / bedroom rule for the first time', tag: 'Bedtime' },
  { id: 9, title: 'The Unknown Contact Conversation', stage: 4, context: 'If you discover they have been contacted by someone unknown', tag: 'Safety' },
  { id: 10, title: 'The Sexting Risk Conversation', stage: 4, context: 'Age-appropriate conversation about image sharing', tag: 'Safety' },
  { id: 11, title: 'The AI and Deepfakes Conversation', stage: 4, context: 'When they start using AI tools or encounter deepfakes', tag: 'AI Literacy' },
  { id: 12, title: 'The TikTok Algorithm Walk-Through', stage: 3, context: 'Sit together and look at what the algorithm is showing them', tag: 'Algorithm' },
  { id: 13, title: 'The Family Agreement Introduction', stage: 2, context: 'Starting the family digital agreement together', tag: 'Agreement' },
  { id: 14, title: 'The Weekly Check-In Script', stage: 4, context: 'The no-agenda 10 minutes, same day, same time', tag: 'Relationship' },
  { id: 15, title: 'The Influencer and Body Image Conversation', stage: 3, context: 'When comparison culture is affecting mood or self-image', tag: 'Body Image' },
  { id: 16, title: 'The Digital Footprint Conversation', stage: 4, context: 'Before they start creating content or building an online presence', tag: 'Identity' },
  { id: 17, title: 'Building Independence', stage: 5, context: 'When they are ready to manage their digital life more independently', tag: 'Independence' },
]

const STAGE_TAGS = {
  1: { label: 'Stage 1', color: 'var(--green-dark)', bg: 'var(--green-lt)' },
  2: { label: 'Stage 2', color: 'var(--lav-deep)', bg: 'var(--lav)' },
  3: { label: 'Stage 3', color: 'var(--coral)', bg: 'var(--coral-lt)' },
  4: { label: 'Stage 4', color: 'var(--gold-dark)', bg: 'var(--gold-lt)' },
  5: { label: 'Stage 5', color: 'var(--ink-soft)', bg: 'var(--warm)' },
} as const

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

  const visibleScripts = isPaid ? SCRIPTS : SCRIPTS.filter(s => FREE_SCRIPT_IDS.includes(s.id))
  const lockedCount = SCRIPTS.length - visibleScripts.length

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ marginBottom: '28px' }}>
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
              You have access to 3 of 17 scripts. Upgrade to unlock all of them.
            </p>
          </div>
          <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ flexShrink: 0, padding: '10px 20px', fontSize: '12px' }}>
            Unlock all 17
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {visibleScripts.map(script => {
          const stageTag = STAGE_TAGS[script.stage as keyof typeof STAGE_TAGS]
          return (
            <div
              key={script.id}
              style={{
                background: 'var(--warm)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: stageTag.color,
                  background: stageTag.bg,
                  padding: '3px 8px',
                  borderRadius: '100px',
                }}>
                  {stageTag.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-light)',
                  background: 'var(--cream)',
                  padding: '3px 8px',
                  borderRadius: '100px',
                  border: '1px solid var(--border)',
                }}>
                  {script.tag}
                </span>
              </div>

              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', marginBottom: '6px' }}>
                #{script.id} — {script.title}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                {script.context}
              </div>

              <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Link
                  href={`/dashboard/scripts/${script.id}`}
                  className="btn btn-outline"
                  style={{ padding: '9px 18px', fontSize: '11px' }}
                >
                  Open script
                </Link>
                <Link
                  href={`/dashboard/digi?q=${encodeURIComponent(`Help me with: ${script.title}`)}`}
                  style={{
                    padding: '9px 18px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--gold-dark)',
                    background: 'var(--gold-lt)',
                    border: '1px solid var(--gold)',
                    borderRadius: 'var(--radius-btn)',
                    textDecoration: 'none',
                  }}
                >
                  Ask DiGi
                </Link>
              </div>
            </div>
          )
        })}

        {/* Locked paywall card */}
        {!isPaid && lockedCount > 0 && (
          <div style={{
            background: 'var(--warm)',
            border: '2px dashed var(--border)',
            borderRadius: '14px',
            padding: '24px 20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>🔒</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
              {lockedCount} more scripts unlocked with membership
            </div>
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '16px' }}>
              Including gaming, safety, social media, AI, body image, and more.
            </p>
            <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-flex' }}>
              Unlock all 17 scripts
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
