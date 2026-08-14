import { createClient } from '@/lib/supabase/server'
import { hasFullAccess } from '@/lib/access'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { STAGES, type ChallengeId } from '@/lib/content/stages'
import PathwayEvidence from '@/components/pathway/PathwayEvidence'
import PathwayJourney from '@/components/pathway/PathwayJourney'
import SchoolChest from '@/components/pathway/SchoolChest'
import { sheetTarget, sheetLabel } from '@/lib/learning/term'
import StageRoad from '@/components/pathway/StageRoad'
import { getStageProgress, getAllStagesProgress, type StageId as ProgressStageId } from '@/lib/pathway/progress'
import { getJourney } from '@/lib/pathway/journey'
import ChildSwitcher from '@/components/children/ChildSwitcher'
import { pickChild } from '@/lib/children/select'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import PathwayIntro from '@/components/pathway/PathwayIntro'
import PathwayComplete from '@/components/pathway/PathwayComplete'
import MeetTheFriends from '@/components/pathway/MeetTheFriends'
import SectionTiles, { type SectionTile } from '@/components/ui/SectionTiles'

// ═══ THE ROAD, AND ONLY THE ROAD ═══════════════════════════════════════════
//
// Justin, 13 August 2026: "this needs to be the only thing on the passport
// page ... as its a mess and a long scroll."
//
// This file was 656 lines and four products in one column: the road, the
// passport, the what is working report and the four strands, each with its own
// data load, all paid for on every open whether a parent came to look at them
// or not. A parent who wanted one thing read all of it or gave up.
//
// The passport material moved to /dashboard/passport, which is tabs. So did
// the what is working report and the four strands, in the SAME pass, because
// both jobs were emptying this file and doing them one at a time would have
// meant the second rewrote the first.
//
// What is left here is the thing this page was always called: the road. Where
// the child is, the five stages between four and sixteen, and what we are
// working on right now.

// date_of_birth joined the select on 11 August 2026 for the school chest, which
// needs the year group and term rather than the age band.
type Child = { id: string; name: string; age_band: string | null; stage_id: string | null; is_primary: boolean; streak_weeks: number | null; date_of_birth: string | null }

export default async function PathwayPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { child: childParam } = await searchParams

  const [profileResult, childrenResult] = await Promise.all([
    supabase.from('profiles').select('subscription_status, trial_ends_at').eq('id', user.id).single(),
    supabase.from('children').select('id, name, age_band, stage_id, is_primary, streak_weeks, date_of_birth').eq('parent_id', user.id).order('is_primary', { ascending: false }),
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

  // All five stamps genuinely earned. Read from contentComplete, the same
  // source the passport and the road's trophy use, so the celebration can never
  // fire on a stage the family has not actually finished. Age is deliberately
  // not in it: a sixteen year old whose family did nothing has walked no road.
  const allStagesEarned = !!allStagesProgress
    && (['foundation', 'builder', 'explorer', 'shaper', 'independent'] as ProgressStageId[])
      .every(slug => allStagesProgress[slug].contentComplete)

  // Tailor the stage by the concern this family actually flagged, not by any
  // assumption about the child. The top open concern maps straight to the
  // stage's own action for it, so an eleven year old whose parent worries about
  // gaming and one whose parent worries about comparison get different guidance,
  // the honest version of a boy and girl pathway.
  const { data: topConcern } = await supabase
    .from('concerns').select('slug, label, status')
    .eq('user_id', user.id).neq('status', 'resolved')
    .order('times_flagged', { ascending: false }).limit(1).maybeSingle()
  const concernSlug = (topConcern as { slug?: string } | null)?.slug as ChallengeId | undefined
  const concernLabel = (topConcern as { label?: string } | null)?.label ?? null
  // YOUR FOCUS IS NOT HERE, AND THAT IS THE CORRECTION (13 August 2026).
  //
  // It was moved onto this page on 12 August on a misreading of the word
  // pathway. Justin meant the daily list on Home, and he meant it should ROTATE
  // there rather than sit pinned above it. It does, as the `focus` item in
  // lib/home/next-up.ts. See the header of FocusStrip for the whole story.
  //
  // concernLabel survives because the tailored action below is keyed off the
  // same concern, which is a different use of the same reading.
  const kidLabel = primaryChild?.name && primaryChild.name !== 'Your child' ? primaryChild.name : 'your child'

  // The child's year and term, for the school chest beside the road, using the
  // same helper the learning sheet does so the two can never disagree. Null
  // before a birthday is set, which the chest handles by naming the child
  // instead of the year.
  const schoolDob = primaryChild?.date_of_birth ? new Date(primaryChild.date_of_birth) : null
  const schoolTarget = schoolDob && !Number.isNaN(schoolDob.getTime()) ? sheetTarget(schoolDob, new Date()) : null
  const schoolYearLabel = schoolTarget ? sheetLabel(schoolTarget) : null

  // Four doors, and three of them now lead off this page rather than down it.
  // The tiles used to be six anchors into one scroll, which is what a long page
  // does instead of splitting: it renames scrolling as navigation. Three of the
  // six are tabs on the passport now, so these are real destinations.
  const SECTIONS: SectionTile[] = [
    { href: '/dashboard/passport', label: 'View passport', sub: 'One page per stage, tap to fill it',
      icon: '🛂', bg: 'var(--stage-1-bold)', accent: 'var(--terracotta)' },
    { href: '/dashboard/passport?tab=working', label: 'Is it working', sub: 'The honest read on where you are',
      icon: '📈', bg: 'var(--tint-sage)', accent: '#9CC3B4' },
    { href: '/dashboard/stats', label: `${kidLabel}'s week`, sub: 'Screen balance and what to aim for',
      icon: '⚖️', bg: 'var(--stage-2-bold)', accent: '#A9C8E4' },
    { href: '#working-on', label: 'What we are working on', sub: 'This stage, right now',
      icon: '🎯', bg: 'var(--stage-3-bold)', accent: '#F0B9AE' },
  ]

  const tailoredAction = concernSlug && currentStageContent
    ? currentStageContent.challengeActions[concernSlug] ?? null
    : null

  return (
    <div style={{ padding: '24px 0 32px' }}>
      {/* 720, the same column as every other section on this page. */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto', marginBottom: '20px' }}>
        <ChildSwitcher kids={children} selectedId={primaryChild?.id ?? null} basePath="/dashboard/road" />

        {/* THE END OF THE ROAD, WHEN IT ARRIVES.
            Justin: "when pathway is done and celebration."
            It sits ABOVE the intro rather than down by the trophy, because on
            the day it lands it is the most important thing on the page, and
            nobody should have to scroll past the explanation of a road they
            have already walked to be told they walked it. Same reading as the
            passport, so it can never light without the five stamps being real. */}
        {allStagesEarned && <PathwayComplete childName={primaryChild?.name ?? null} />}

        {/* The promise, folded away after the first visit. See PathwayIntro. */}
        <PathwayIntro kidLabel={kidLabel} childCount={children.length} />
      </div>

      {/* Four doors. Three of them leave this page now. */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 8px' }}>
        <SectionTiles tiles={SECTIONS} />
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
          <p style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
            <strong style={{ fontWeight: 800 }}>Do not worry about the whole map.</strong> We have got you. Just follow each daily task and we drive the growing up for you, all the way to 16 and beyond.
          </p>
        </div>
      </div>

      {/* THE road, the hero of the page: five big stamp nodes on one thick
          winding trail, Duolingo sized, DiGi on the current one, the sticky
          position card riding along as you scroll, live progress and the
          stage detail folded in. */}
      <div id="the-road" style={{ scrollMarginTop: '84px', padding: '0 20px', maxWidth: '560px', margin: '0 auto 28px' }}>
        <StageRoad
          currentStageNum={currentStageNum}
          progressPct={currentStageProgress?.overallPct ?? null}
          childName={primaryChild?.name ?? undefined}
          stageStatus={stageStatus}
        />
      </div>

      {/* THE WEEKLY PLANET IS GONE (14 August 2026).
          Justin: "if we have the rotating planet friends on today doing the
          same job, so no need for the planets the stage road."
          He is right and it is the same call that took the six coins off Home
          yesterday. One thing a week introducing a corner of the product, on a
          page a parent opens occasionally, doing the identical job to the
          Planet Friend that appears beside the daily list every single day.
          Two rotations for one purpose is one too many, and the daily one wins
          because it is seen daily and it is a character rather than a disc.
          lib/pathway/planets.ts and PlanetCard are kept, not deleted: they are
          still what /dev/planets draws and they are a smaller thing to
          reinstate than to reinvent. */}

      {/* SCHOOL, BESIDE THE ROAD RATHER THAN ON IT.
          Justin asked the question directly: a step stone on the pathway, or a
          chest next to the diagram that does not have to be done? It is the
          chest, and the reasoning is in SchoolChest: the five stones are STAGES,
          years wide each, and a school term measured in weeks does not belong on
          that scale. His own phrasing settles it: "does not have to be done". */}
      <div style={{ padding: '0 20px', maxWidth: '560px', margin: '0 auto 28px' }}>
        <SchoolChest childName={primaryChild?.name ?? null} yearLabel={schoolYearLabel} />
      </div>

      {/* Meet the family: DiGi and the Planet Friends the child grows up with,
          an introduction not a score. Here with the road, which is where the
          characters are actually walking. */}
      <div style={{ padding: '0 20px', maxWidth: '560px', margin: '0 auto 28px' }}>
        <MeetTheFriends childName={primaryChild?.name ?? null} />
      </div>

      {/* Tailored by what this family flagged, not by the child's sex. */}
      {tailoredAction && (
        <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 20px' }}>
          <div style={{ background: 'var(--tint-sage)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--deep-teal)', marginBottom: '5px' }}>
              For your family right now{concernLabel ? ` · ${concernLabel}` : ''}
            </div>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>{tailoredAction}</p>
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
        <div id="working-on" style={{ scrollMarginTop: '84px', padding: '0 20px', maxWidth: '720px', margin: '0 auto 32px' }}>
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
          through the one that matters now. */}
      {currentStageContent && (
        <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 28px' }}>
          <Link href="/dashboard/digi" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ background: 'var(--deep-teal)', borderRadius: '18px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '11px', background: 'var(--terracotta)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
                <span style={{ color: '#fff', fontSize: 'var(--text-md)', lineHeight: 1 }}>◎</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: '#fff' }}>
                  Not sure of your next step?
                </div>
                <div style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.45, marginTop: '2px' }}>
                  DiGi reads the moments you have flagged and talks you through the one that matters now.
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)', flexShrink: 0 }}>→</span>
            </div>
          </Link>
        </div>
      )}

      {/* Multiple children section */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '28px auto 0' }}>
        {children.length > 1 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
              Your children
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {children.map(child => {
                const stageNum = child.stage_id ? stageIdToNum[child.stage_id] : null
                const stageMeta = stageNum ? STAGES.find(st => st.id === stageNum) ?? null : null
                return (
                  <Link key={child.id} href={child.is_primary ? '/dashboard/road' : `/dashboard/road?child=${child.id}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--cream)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '12px 16px', gap: '12px',
                    textDecoration: 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                      {child.name}
                    </span>
                    {stageMeta && (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
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
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginBottom: '10px' }}>
            Multiple children? One account covers all of them.
          </p>
          <Link href="/dashboard/settings" style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)',
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
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '8px' }}>Unlock all 5 stages for £7.99 / month</h3>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-muted)', marginBottom: '16px' }}>
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
