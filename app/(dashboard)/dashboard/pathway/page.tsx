import { createClient } from '@/lib/supabase/server'
import { hasFullAccess } from '@/lib/access'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { STAGES, type ChallengeId } from '@/lib/content/stages'
import PathwayEvidence from '@/components/pathway/PathwayEvidence'
import PathwayJourney from '@/components/pathway/PathwayJourney'
import StageRoad from '@/components/pathway/StageRoad'
import LiteracyAreas from '@/components/pathway/LiteracyAreas'
import { getLiteracyStatuses } from '@/lib/pathway/literacy-status'
import { getStageProgress, getAllStagesProgress, type StageId as ProgressStageId } from '@/lib/pathway/progress'
import { getJourney } from '@/lib/pathway/journey'
import ChildSwitcher from '@/components/children/ChildSwitcher'
import { pickChild } from '@/lib/children/select'
import DigiCharacter from '@/components/digi/DigiCharacter'
import PassportBook from '@/components/pathway/PassportBook'
import { type Stamp, type StampStatus } from '@/components/pathway/PassportStamps'
import DigiStarBuild from '@/components/pathway/DigiStarBuild'

type Child = { id: string; name: string; age_band: string | null; stage_id: string | null; is_primary: boolean; streak_weeks: number | null }

export default async function PathwayPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { child: childParam } = await searchParams

  const [profileResult, childrenResult] = await Promise.all([
    supabase.from('profiles').select('subscription_status, trial_ends_at, onboarding_answers').eq('id', user.id).single(),
    supabase.from('children').select('id, name, age_band, stage_id, is_primary, streak_weeks').eq('parent_id', user.id).order('is_primary', { ascending: false }),
  ])

  const isPaid = hasFullAccess(profileResult.data, user.email)
  const children = (childrenResult.data ?? []) as Child[]

  const stageIdToNum: Record<string, number> = {
    foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
  }

  // The whole road renders for the selected child (?child=<id>), defaulting
  // to the primary, so a second or third child gets their own pathway too.
  const primaryChild = pickChild(children, childParam)
  const currentStageNum = primaryChild?.stage_id ? stageIdToNum[primaryChild.stage_id] ?? null : null

  const [currentStageProgress, journey, allStagesProgress] = primaryChild?.stage_id
    ? await Promise.all([
        getStageProgress(supabase, user.id, primaryChild.stage_id as ProgressStageId, primaryChild.streak_weeks ?? 0),
        getJourney(supabase, user.id, primaryChild.stage_id as ProgressStageId),
        getAllStagesProgress(supabase, user.id, primaryChild.streak_weeks ?? 0),
      ])
    : [null, null, null]

  // One shared reading per stage for the road, the same blend the passport
  // uses, keyed by stage number, so caught up pages and filled stamps show
  // truthfully on the road instead of a fixed badge.
  const stageStatus: Record<number, { pct: number; complete: boolean }> = {}
  if (allStagesProgress) {
    for (const slug of Object.keys(allStagesProgress) as ProgressStageId[]) {
      stageStatus[stageIdToNum[slug]] = { pct: allStagesProgress[slug].overallPct, complete: allStagesProgress[slug].contentComplete }
    }
  }

  const currentStageContent = currentStageNum ? STAGES.find(s => s.id === currentStageNum) : null

  // The passport the road is filling, so the goal sits right beside the map:
  // one stamp per stage, earned as the family works through it, catch up pages
  // for earlier stages and a peek at the ones ahead. Same reading as the road.
  const STAGE_SLUGS_ARR: ProgressStageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']
  const passportStamps: Stamp[] = allStagesProgress && currentStageNum
    ? STAGES.map(s => {
        const prog = allStagesProgress[STAGE_SLUGS_ARR[s.id - 1]]
        const status: StampStatus =
          prog.contentComplete ? 'earned'
          : s.id === currentStageNum ? 'current'
          : s.id < currentStageNum ? 'catchup'
          : 'upcoming'
        // A stage still ahead reads a true zero, never the blend's free credit
        // from the global streak or empty device list. Earned shows the stamp,
        // the current and catch up stages show their real reading.
        const pct = status === 'earned' ? 100 : status === 'upcoming' ? 0 : prog.overallPct
        return {
          id: s.id, name: s.name, ages: s.ages, pct, status,
          href: '/dashboard/lessons',
          lessonsDone: prog.lessonsDone, lessonsTotal: prog.lessonsTotal,
          scriptsPct: prog.scriptsPct, streakPct: prog.streakPct,
          devicesPct: prog.devicesPct, lessonsPct: prog.lessonsPct,
        }
      })
    : []

  // Tailor the stage by the concern this family actually flagged, not by any
  // assumption about the child. The top open concern maps straight to the
  // stage's own action for it, so an eleven year old whose parent worries about
  // gaming and one whose parent worries about comparison get different guidance,
  // the honest version of a boy and girl pathway.
  const { data: topConcern } = await supabase
    .from('concerns').select('slug, label')
    .eq('user_id', user.id).neq('status', 'resolved')
    .order('times_flagged', { ascending: false }).limit(1).maybeSingle()
  const concernSlug = (topConcern as { slug?: string } | null)?.slug as ChallengeId | undefined
  const concernLabel = (topConcern as { label?: string } | null)?.label ?? null
  const tailoredAction = concernSlug && currentStageContent
    ? currentStageContent.challengeActions[concernSlug] ?? null
    : null

  return (
    <div style={{ padding: '24px 0 32px' }}>
      {/* Header */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto', marginBottom: '20px' }}>
        <ChildSwitcher kids={children} selectedId={primaryChild?.id ?? null} basePath="/dashboard/pathway" />
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Your journey</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px' }}>The pathway to 16</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '16px', lineHeight: 1.6, maxWidth: '560px' }}>
          This is your child’s social media passport. The plan that turns 16 from a cliff edge into a gentle ramp, earned one stage at a time, all the way to independence. Your next step is always here.
        </p>
        <Link href="/passport" style={{ display: 'inline-block', marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--terracotta)', textDecoration: 'none', letterSpacing: '0.03em' }}>
          Why we call it a passport →
        </Link>
        {children.length > 1 && (
          <p style={{ color: 'var(--ink-muted)', fontSize: '14px', marginTop: '4px' }}>
            {children.length} children, one account.
          </p>
        )}
      </div>

      {/* Reassurance before the map. The five stages can look like a lot at a
          glance, so DiGi says the one thing a parent needs to hear: you do not
          hold all of this, we do. Just do today. */}
      <div style={{ padding: '0 20px', maxWidth: '560px', margin: '0 auto 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '13px',
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
          borderRadius: '18px', padding: '15px 17px',
        }}>
          <span style={{ flexShrink: 0, width: 42, height: 42, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DigiCharacter size={28} mood="wave" />
          </span>
          <p style={{ flex: 1, minWidth: 0, fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
            <strong style={{ fontWeight: 800 }}>Do not worry about the whole map.</strong> We have got you. Just follow each daily task and we drive the growing up for you, all the way to 16 and beyond.
          </p>
        </div>
      </div>

      {/* THE road, the hero of the page: five big stamp nodes on one thick
          winding trail, Duolingo sized, DiGi on the current one, the sticky
          position card riding along as you scroll, live progress and the
          stage detail folded in. */}
      <div style={{ padding: '0 20px', maxWidth: '560px', margin: '0 auto 28px' }}>
        <StageRoad
          currentStageNum={currentStageNum}
          progressPct={currentStageProgress?.overallPct ?? null}
          childName={primaryChild?.name ?? undefined}
          stageStatus={stageStatus}
        />
      </div>

      {/* The goal beside the map: the passport they are filling, one stamp per
          stage, so a parent looking at the road can see exactly what it builds
          towards and watch the stamps land as they go. */}
      {passportStamps.length > 0 && (() => {
        const earnedStages = passportStamps.filter(s => s.status === 'earned').length
        const currentIdx = passportStamps.findIndex(s => s.status === 'current')
        const childLabel = primaryChild?.name && primaryChild.name !== 'Your child' ? primaryChild.name : 'your child'
        return (
          <div style={{ padding: '0 20px', maxWidth: '560px', margin: '0 auto 28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
                Building DiGi, one stage at a time
              </span>
              <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '5px auto 0', maxWidth: '440px' }}>
                DiGi is a star with five points, one for each stage. {childLabel} earns a point every stage, and by 16 the whole star is theirs.
              </p>
            </div>

            {/* The star assembling: a shard locks in for every stage earned, and
                the sparkles grow with each level. */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
              <DigiStarBuild earned={earnedStages} currentIndex={currentIdx >= 0 ? currentIdx : null} size={172} />
            </div>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)', margin: '0 0 18px' }}>
              {earnedStages >= 5
                ? 'DiGi is whole. Every stage earned, all the way to 16 🌟'
                : `${earnedStages} of 5 points of DiGi's star earned so far`}
            </p>

            <PassportBook stamps={passportStamps} childName={primaryChild?.name ?? 'your child'} />
          </div>
        )
      })()}

      {/* The four literacy strands in plain words, each with a live reading
          from the family's real week: the jobs and screen balance, open
          worries, and lessons done per strand. Green means on track, red means
          worth a look, the same readings the rest of the app uses. */}
      <LiteracyAreas stageId={currentStageNum ?? 1} childName={primaryChild?.name ?? undefined} statuses={await getLiteracyStatuses(supabase, user.id, currentStageNum ?? 1)} />

      {/* Tailored by what this family flagged, not by the child's sex. */}
      {tailoredAction && (
        <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 20px' }}>
          <div style={{ background: 'var(--tint-sage)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--deep-teal)', marginBottom: '5px' }}>
              For your family right now{concernLabel ? ` · ${concernLabel}` : ''}
            </div>
            <p style={{ fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>{tailoredAction}</p>
          </div>
        </div>
      )}

      {/* The evidence and the stance, folded into one card that opens on demand,
          so the pathway stays a next step, not a research brochure. */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 24px' }}>
        <PathwayEvidence />
      </div>

      {/* The journey: one spine, three strands, the single next step */}
      {journey && currentStageContent && (
        <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 32px' }}>
          <PathwayJourney
            journey={journey}
            childName={primaryChild?.name ?? 'your child'}
            stageName={currentStageContent.name}
            stageAges={currentStageContent.ages}
          />
        </div>
      )}

      {/* DiGi help: the pathway is never a wall. When the next step is
          unclear, DiGi reads the moments this family has flagged and talks
          through the one that matters now. This is the moments and DiGi help
          thread, in one calm card, replacing the stacked journey views that
          made the page busy. */}
      {currentStageContent && (
        <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 28px' }}>
          <Link href="/dashboard/digi" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ background: 'var(--deep-teal)', borderRadius: '18px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '11px', background: 'var(--terracotta)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
                <span style={{ color: '#fff', fontSize: '1rem', lineHeight: 1 }}>◎</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: '#fff' }}>
                  Not sure of your next step?
                </div>
                <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.45, marginTop: '2px' }}>
                  DiGi reads the moments you have flagged and talks you through the one that matters now.
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', flexShrink: 0 }}>→</span>
            </div>
          </Link>
        </div>
      )}

      {/* Multiple children section */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '28px auto 0' }}>
        {children.length > 1 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
              Your children
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {children.map(child => {
                const stageNum = child.stage_id ? stageIdToNum[child.stage_id] : null
                const stageMeta = stageNum ? STAGES.find(st => st.id === stageNum) ?? null : null
                return (
                  <Link key={child.id} href={child.is_primary ? '/dashboard/pathway' : `/dashboard/pathway?child=${child.id}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--cream)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '12px 16px', gap: '12px',
                    textDecoration: 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                      {child.name}
                    </span>
                    {stageMeta && (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                        color: 'var(--terracotta-dark)', background: 'var(--terracotta-lt)',
                        padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.06em',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                      }}>
                        Stage {stageMeta.id} · {stageMeta.name}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Add child prompt */}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '10px' }}>
            Multiple children? One account covers all of them.
          </p>
          <Link href="/dashboard/settings" style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)',
            textDecoration: 'underline', letterSpacing: '0.04em',
          }}>
            Manage children →
          </Link>
        </div>

        {!isPaid && (
          <div style={{
            marginTop: '24px',
            border: '2px solid var(--stage-5)', borderRadius: '16px',
            padding: '20px 22px', background: 'var(--stage-5)',
          }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '8px' }}>Founder rate</p>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Unlock all 5 stages for £7.99 / month</h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '16px' }}>
              All scripts, unlimited DiGi, wellbeing tracker. First 50 members only.
            </p>
            <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-flex' }}>
              Claim founder rate
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}
