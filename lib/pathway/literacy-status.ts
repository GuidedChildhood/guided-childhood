import type { createClient } from '@/lib/supabase/server'
import { literacyAreaFor } from '@/lib/content/literacy'
import { STAR_MINUTES } from '@/lib/quests/templates'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// One live reading per literacy strand, computed once and shown everywhere,
// the home strip, the pathway page and the progress tab, so the passport and
// every tracker always agree. Green is a big tick, red is a cross with the one
// thing that fixes it, and the value carries the real numbers so the status is
// proof, not decoration. Every reading is age honest: a strand that has not
// started yet says when it comes and why, grounded in the research.
export type AreaStatus = {
  tone: 'green' | 'red'
  label: string
  note?: string
  // The big bold figure behind the tick, e.g. "865 min earned · 50 used".
  value?: string
  // When red: the one concrete thing that turns the cross back to a tick.
  improve?: string
  // Where acting on this reading happens. Defaults to the lessons hub.
  href?: string
}

const STAGE_ORDER = ['foundation', 'builder', 'explorer', 'shaper', 'independent'] as const

function deviceAgeToStageNum(minAge: number): number {
  if (minAge <= 7) return 1
  if (minAge <= 10) return 2
  if (minAge <= 13) return 3
  if (minAge <= 15) return 4
  return 5
}

export async function getLiteracyStatuses(
  supabase: SupabaseClient,
  userId: string,
  stageNum: number | null = null,
): Promise<Record<string, AreaStatus>> {
  const now = new Date()
  const day = (now.getUTCDay() + 6) % 7
  const monday = new Date(now); monday.setUTCDate(now.getUTCDate() - day)
  const weekStart = monday.toISOString().slice(0, 10)

  const [ticksRes, questsRes, spendsRes, concernsRes, lessonsRes, doneRes, guidesRes, setupRes, checkinsRes] = await Promise.all([
    supabase.from('quest_ticks').select('quest_id').eq('user_id', userId).eq('status', 'approved').gte('tick_date', weekStart),
    supabase.from('family_quests').select('id, stars').eq('user_id', userId),
    supabase.from('star_spends').select('minutes').eq('user_id', userId).gte('created_at', `${weekStart}T00:00:00Z`),
    supabase.from('concerns').select('id').eq('user_id', userId).in('status', ['open', 'improving']),
    supabase.from('lessons').select('id, category, stage_id'),
    supabase.from('lesson_completions').select('lesson_id').eq('user_id', userId),
    supabase.from('device_guides').select('device_key, name, min_age'),
    supabase.from('device_setup_progress').select('device_key').eq('user_id', userId),
    supabase.from('literacy_checkins').select('strand, grade, grade_note, created_at').eq('user_id', userId).gte('created_at', new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()).order('created_at', { ascending: false }),
  ])

  const starsOf = new Map((questsRes.data ?? []).map(q => [q.id, q.stars ?? 1]))
  const earnedMins = (ticksRes.data ?? []).reduce((s, t) => s + (starsOf.get(t.quest_id) ?? 1), 0) * STAR_MINUTES
  const usedMins = (spendsRes.data ?? []).reduce((s, x) => s + (Number(x.minutes) || 0), 0)
  const healthy = usedMins === 0 || usedMins <= earnedMins
  const worries = (concernsRes.data ?? []).length

  // Lessons done per strand, the learning half of every reading.
  const doneIds = new Set((doneRes.data ?? []).map(d => d.lesson_id))
  const doneByArea = new Map<string, number>()
  for (const l of lessonsRes.data ?? []) {
    if (!doneIds.has(l.id)) continue
    const a = literacyAreaFor(l.category)
    if (a) doneByArea.set(a.key, (doneByArea.get(a.key) ?? 0) + 1)
  }
  // This stage's lessons per strand: the tick asks for the age right lessons
  // to actually be taken, so learning is part of every reading.
  const stageSlug = STAGE_ORDER[Math.min(4, Math.max(0, (stageNum ?? 1) - 1))]
  const stageTotal = new Map<string, number>()
  const stageDone = new Map<string, number>()
  for (const l of (lessonsRes.data ?? []) as { id: string; category: string; stage_id?: string }[]) {
    if (l.stage_id !== stageSlug) continue
    const a = literacyAreaFor(l.category)
    if (!a) continue
    stageTotal.set(a.key, (stageTotal.get(a.key) ?? 0) + 1)
    if (doneIds.has(l.id)) stageDone.set(a.key, (stageDone.get(a.key) ?? 0) + 1)
  }
  const stageLessonsLeft = (k: string) => (stageTotal.get(k) ?? 0) - (stageDone.get(k) ?? 0)
  const stageLessonBit = (k: string) => {
    const t = stageTotal.get(k) ?? 0
    return t > 0 ? `${stageDone.get(k) ?? 0} of ${t} stage lessons done` : null
  }
  const lessonCount = (k: string) => doneByArea.get(k) ?? 0
  const lessonBit = (k: string) => {
    const n = lessonCount(k)
    return n > 0 ? `${n} lesson${n === 1 ? '' : 's'} done` : 'No lessons done yet'
  }

  // Safe online is part settings, part conversation: the device guides for
  // this child's age actually marked done in the device setup section, plus
  // the lessons, plus DiGi asking gently through the weekly catch up.
  const stage = stageNum ?? 1
  const guidesForAge = (guidesRes.data ?? []).filter(g => deviceAgeToStageNum(g.min_age) <= stage)
  const doneKeys = new Set((setupRes.data ?? []).map(d => d.device_key))
  const guidesDone = guidesForAge.filter(g => doneKeys.has(g.device_key))
  const nextGuide = guidesForAge.find(g => !doneKeys.has(g.device_key))
  const devicesOk = guidesForAge.length === 0 || guidesDone.length >= guidesForAge.length
  // DiGi's graded weekly answers: the latest per strand inside 28 days.
  const latestGrade = (strand: 'safe' | 'social') =>
    (checkinsRes.data ?? []).find(c => c.strand === strand) as { grade: string; grade_note: string | null } | undefined
  const safeCheck = latestGrade('safe')
  const socialCheck = latestGrade('social')
  const safeOk = devicesOk && worries === 0 && safeCheck?.grade !== 'red' && stageLessonsLeft('safe') === 0

  const statuses: Record<string, AreaStatus> = {
    safe: safeOk
      ? {
          tone: 'green', label: 'Safe and set up',
          value: guidesForAge.length > 0 ? `${guidesDone.length} of ${guidesForAge.length} device guides set` : 'No devices to set yet',
          note: `${lessonBit('safe')}. No open worries. DiGi keeps asking gently in the weekly catch up.`,
          href: '/dashboard/lessons',
        }
      : {
          tone: 'red',
          label: !devicesOk ? 'Settings not finished' : worries > 0 ? `${worries} worr${worries === 1 ? 'y' : 'ies'} open` : stageLessonsLeft('safe') > 0 ? 'Stage lessons waiting' : 'DiGi flagged this week',
          value: `${guidesDone.length} of ${guidesForAge.length} device guides set`,
          note: `${lessonBit('safe')}. ${worries > 0 ? `Working through ${worries} open worr${worries === 1 ? 'y' : 'ies'} together.` : 'The guides walk you through each screen.'}`,
          improve: !devicesOk && nextGuide
            ? `Finish the ${nextGuide.name} setup guide and this turns green.`
            : worries > 0
            ? 'Keep the open worry moving with DiGi and this turns green.'
            : stageLessonsLeft('safe') > 0
            ? `Do the next safe online lesson for this stage, ${stageLessonsLeft('safe')} to go.`
            : safeCheck?.grade_note ?? 'Answer DiGi honestly next week and keep the telling channel open.',
          href: devicesOk ? '/dashboard/digi' : '/dashboard/devices',
        },
    balance: healthy && stageLessonsLeft('balance') === 0
      ? {
          tone: 'green', label: 'In balance',
          value: `${earnedMins} min earned · ${usedMins} min used`,
          note: `${lessonBit('balance')}. Real world jobs are paying for the screen time, which is the balance doing its job.`,
          href: '/dashboard/quests',
        }
      : {
          tone: 'red', label: healthy ? 'Stage lessons waiting' : 'Screen ahead',
          value: `${usedMins} min used · ${earnedMins} min earned`,
          note: `${lessonBit('balance')}. Screen has run ahead of what the jobs earned this week.`,
          improve: healthy
            ? `Do the next healthy balance lesson for this stage, ${stageLessonsLeft('balance')} to go.`
            : 'Add two or three more jobs this week so the time is earned again.',
          href: '/dashboard/quests',
        },
  }

  // The learning strands, age gated: green once the lessons are being done,
  // a cross when the age is right but the lessons are not moving yet.
  // A red social answer from DiGi's weekly question overrides a lesson green,
  // because what the child is actually meeting beats what has been watched.
  const socialRed = socialCheck?.grade === 'red'
  for (const k of ['ai', 'social'] as const) {
    const n = lessonCount(k)
    statuses[k] = n > 0 && stageLessonsLeft(k) === 0 && !(k === 'social' && socialRed)
      ? {
          tone: 'green', label: 'Building now',
          value: stageLessonBit(k) ?? `${n} lesson${n === 1 ? '' : 's'} done`,
          note: k === 'ai'
            ? 'What AI is, how chatbots work, and how to tell what is real, built lesson by lesson.'
            : 'The judgement for the platforms, built in good time before 16. From 13, DiGi also asks what they are seeing.',
          href: '/dashboard/lessons',
        }
      : {
          tone: 'red', label: 'Lessons waiting',
          value: 'No lessons done yet',
          note: k === 'ai'
            ? 'The age is right for this now. The first AI lesson takes ten minutes together.'
            : 'The age is right to start building platform judgement, well before any account exists.',
          improve: k === 'ai'
            ? 'Watch the first AI and chatbots lesson together this week.'
            : (socialRed && socialCheck?.grade_note) ? socialCheck.grade_note : 'Do the first social media readiness lesson together this week.',
          href: '/dashboard/lessons',
        }
  }
  return statuses
}
