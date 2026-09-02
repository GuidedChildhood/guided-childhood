import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAllStagesProgress, type StageId } from '@/lib/pathway/progress'
import { getPassedStageQuizzes } from '@/lib/pathway/stage-quiz-status'
import { isStageStamped } from '@/lib/pathway/stamped'
import type { createClient } from '@/lib/supabase/server'
import { STAGES } from '@/lib/content/stages'

// The public face of a passport number. A code printed on the passport book,
// the keepsake or a certificate resolves here, and the page answers from the
// live record: this passport is real, these stamps are earned. The document
// is a pointer; the database is the credential.
//
// Exact match or silence, the DofE award validation pattern: a wrong code
// gets a plain 404 and learns nothing. A right code shows the child's FIRST
// name, the stamps, and nothing else. No age, no school, no dates of birth,
// no photo, no way to browse from one passport to another. The DPIA line for
// this page: a child's first name and stamp states are reachable by anyone
// holding the printed code, by design, and by nobody else.
//
// The route uses the service role client on purpose: children rows are
// parent locked under RLS, and this page has no session. It reads exactly
// four columns and renders less.

export const dynamic = 'force-dynamic'

const STAGE_ORDER: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

// Crockford base32: I and L read as 1, O reads as 0, case never matters. A
// code copied from a fridge door or read over the phone still resolves.
function normaliseCode(raw: string): string | null {
  const cleaned = decodeURIComponent(raw)
    .toUpperCase()
    .replace(/[\s-]/g, '')
    .replace(/^GC/, '')
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1')
  if (!/^[0-9A-HJKMNP-TV-Z]{8}$/.test(cleaned)) return null
  return `GC-${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`
}

type ChildRow = { id: string; parent_id: string; name: string; streak_weeks: number | null }

async function getChild(code: string): Promise<ChildRow | null> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('children')
    .select('id, parent_id, name, streak_weeks')
    .eq('passport_code', code)
    .maybeSingle()
  return (data as ChildRow | null) ?? null
}

export async function generateMetadata(): Promise<Metadata> {
  // One generic title for hit and miss alike, and no indexing: a child's
  // verification page is for the person holding the code, not for search.
  return { title: 'Passport check · Guided Childhood', robots: { index: false, follow: false } }
}

export default async function VerifyPassportPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params
  const code = normaliseCode(rawCode)
  if (!code) notFound()

  const child = await getChild(code)
  if (!child) notFound()

  // The same engine every passport surface trusts, pointed at this one child.
  // The admin client speaks the same query dialect as the server client; the
  // cast bridges the two factory types.
  const admin = createAdminClient() as unknown as Awaited<ReturnType<typeof createClient>>
  const [progress, passed] = await Promise.all([
    getAllStagesProgress(admin, child.parent_id, child.streak_weeks ?? 0, child.id),
    getPassedStageQuizzes(admin, child.parent_id, child.id),
  ])

  const firstName = child.name.trim().split(/\s+/)[0] || 'This child'
  const checkedOn = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  // The one rule (lib/pathway/stamped): a page anyone can verify is a page
  // the parent's book and the child's book both call stamped.
  const stamped = STAGE_ORDER.filter((s, i) => isStageStamped(progress[s], passed, i + 1))

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--deep-teal)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '20px 14px 32px',
    }}>
      <div style={{
        width: 'min(100%, 520px)', background: 'var(--cream)', borderRadius: '26px',
        overflow: 'hidden', boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
      }}>
        {/* The burgundy band, the colours of the book itself */}
        <div style={{
          background: 'linear-gradient(160deg, #6B2333 0%, #571C2A 55%, #4A1723 100%)',
          padding: '18px 22px 22px',
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 4 }}>
            Guided Childhood passport check
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: '#fff', lineHeight: 1.15, margin: 0 }}>
            This passport is real
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(237,195,95,0.85)', margin: '10px 0 0' }}>
            № {code}
          </p>
        </div>

        <div style={{ padding: '22px 24px 26px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 16px' }}>
            {firstName}&rsquo;s passport, checked live against the record on {checkedOn}.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STAGES.map(stage => {
              const slug = STAGE_ORDER[stage.id - 1]
              const earned = progress[slug]?.contentComplete ?? false
              return (
                <div key={stage.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  background: earned ? 'rgba(47,143,107,0.12)' : 'rgba(26,26,46,0.05)',
                  borderRadius: 12, padding: '10px 14px',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                    {earned ? '✅' : '⬜'} Stage {stage.id} · {stage.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: earned ? 'var(--retro-green)' : 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                    {earned ? 'Stamped' : 'Not yet stamped'}
                  </span>
                </div>
              )
            })}
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '16px 0 0' }}>
            {stamped.length === STAGE_ORDER.length
              ? 'Every stage of the preparation is complete: the lessons and the conversations, all of it, done and recorded.'
              : 'A stamp is earned when every lesson and conversation in that stage is genuinely finished. It records completed preparation, never a guarantee.'}
          </p>
        </div>
      </div>

      {/* What this page is, for the person who was handed a code */}
      <div style={{ width: 'min(100%, 520px)', marginTop: '18px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '14px' }}>
          The passport is a staged preparation for digital life, from age 4 to 16. Wondering where your own child is on the road?
        </p>
        <Link
          href="/starter-pack"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: '16px', padding: '14px 28px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          Take the free stage check
        </Link>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.55)', marginTop: '14px', letterSpacing: '0.06em' }}>
          guidedchildhood.co.uk
        </p>
      </div>
    </div>
  )
}
