import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getParentLessonByCode, getCompletionsForChild } from '@/lib/lessons/parent-lessons'
import { getChildren } from '@/lib/children/server'
import { STAGES } from '@/lib/content/stages'
import ParentLessonPlayer from '@/components/lessons/ParentLessonPlayer'
import WatchBookingPanel from '@/components/lessons/WatchBookingPanel'
import { createAdminClient } from '@/lib/supabase/admin'
import { bookingFor, afterPromptFor } from '@/lib/lessons/watch-bookings-server'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { SITE_URL } from '@/lib/config/site'

// One watch together lesson, played from the parent's side of the sofa. The
// completion writes against the SELECTED child, so the tick, the stars and any
// stage passport land exactly as if that child had played it from their own
// link.
//
// ── IT USED TO WRITE THEM ALL TO THE PRIMARY CHILD (18 August 2026) ─────────
//
// This page read .eq('is_primary', true) and handed that id to the player, and
// the player posts it as the child the lesson was for. So a parent who switched
// to Alma, sat down and watched a lesson with her, gave the tick, the stars and
// the stage passport to Teo. Alma's record showed she had never done it, and
// Teo's showed a lesson he had never seen.
//
// That is the worst kind of fault this product can have: it is silent, it is a
// WRITE, and it corrupts the one record the whole passport is built on. The API
// route was always correct, it takes child_id from the body and checks it
// belongs to this parent. Only the page was choosing the wrong child.
//
// See plans/multi-child-two-session-contract.md section 5: if a child does it
// or learns it, it is per child.

export default async function WatchTogetherLessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>
  searchParams: Promise<{ child?: string }>
}) {
  const { code } = await params
  const { child: childParam } = await searchParams
  if (!/^\d{1,2}\.\d{1,2}$/.test(code)) notFound()

  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')

  const [{ child }, lessonData] = await Promise.all([
    getChildren<{ id: string; name: string | null; is_primary: boolean | null; age_band: string | null }>(
      supabase, user.id, childParam, 'id, name, age_band'),
    getParentLessonByCode(supabase, code),
  ])
  if (!lessonData) notFound()
  const { lesson, segments, cards } = lessonData

  // Watch together booking (migration 400). The booking and the after prompt
  // are read through the service role, and both answer "nothing" if the
  // migration is not applied yet, so this page is unchanged until it is.
  const admin = createAdminClient()
  const [completions, booking, afterPrompt] = await Promise.all([
    child ? getCompletionsForChild(supabase, child.id) : Promise.resolve(new Map()),
    child ? bookingFor(admin, child.id, lesson.lesson_code) : Promise.resolve(null),
    afterPromptFor(admin, lesson.lesson_code),
  ])
  // A film above the child's stage is not offered for booking, the same gate
  // their own page uses for adventures. The film still plays here as before.
  const childStage = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand).id : 2
  const canBook = Boolean(child) && lesson.stage_id <= childStage
  const completion = completions.get(lesson.lesson_code)
  const stageName = STAGES.find(s => s.id === lesson.stage_id)?.name ?? `Stage ${lesson.stage_id}`
  // The way back keeps the child that was watched with, so the hub does not
  // snap to the primary child the moment the credits roll.
  const backHref = `/dashboard/lessons/together${childParam && child ? `?child=${child.id}` : ''}`

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px' }}>
      <Link href={backHref} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
        ← All lessons
      </Link>

      <div style={{ marginBottom: '20px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>
          {stageName} · Lesson {lesson.journey_step} · Keyword: {lesson.keyword}
        </p>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', marginBottom: '6px' }}>{lesson.title}</h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', fontStyle: 'italic' }}>
          &ldquo;{lesson.catchphrase}&rdquo;
        </p>
      </div>

      {/* The parent note: the misconception this lesson breaks and any
          promise the grown up must keep. Parent eyes, worth reading first. */}
      <div style={{ background: 'var(--terracotta-lt)', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-btn)', padding: '14px 18px', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
          Before you press play
        </div>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
          {lesson.misconception}
        </p>
        {lesson.parent_note && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 0' }}>
            {lesson.parent_note}
          </p>
        )}
      </div>

      {child && canBook && (
        <WatchBookingPanel
          childId={child.id}
          childName={child.name}
          lessonCode={lesson.lesson_code}
          title={lesson.title}
          initial={booking ? { id: booking.id, starts_at: booking.starts_at, buzz_child: booking.buzz_child } : null}
          filmUrl={`${SITE_URL}/dashboard/lessons/together/${lesson.lesson_code}`}
        />
      )}

      {child ? (
        <ParentLessonPlayer
          afterPrompt={afterPrompt}
          lesson={lesson}
          segments={segments}
          cards={cards}
          stageName={stageName}
          backHref={backHref}
          childName={child.name}
          childId={child.id}
          timesCompleted={completion?.times_completed ?? 0}
        />
      ) : (
        <div style={{ background: 'var(--cream)', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-tile)', padding: '20px', color: 'var(--ink-muted)', fontSize: 'var(--text-md)' }}>
          Add your child first so their stars and passport have somewhere to land.{' '}
          <Link href="/dashboard/settings" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Add them in settings</Link>
        </div>
      )}
    </div>
  )
}
