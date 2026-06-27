import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { STAGES } from '@/lib/content/stages'
import type { AgeBand } from '@/lib/content/stages'
import DailyDeckViewer from './DailyDeckViewer'
import type { DailyCard } from './DailyDeckViewer'

export default async function DailyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  const [profileResult, childResult, sessionResult] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('children').select('name, age_band, stage_id, streak_weeks, actions_this_week').eq('parent_id', user.id).eq('is_primary', true).single(),
    supabase.from('daily_sessions').select('completed_at').eq('user_id', user.id).eq('session_date', today).maybeSingle(),
  ])

  const child = childResult.data
  const firstName = profileResult.data?.full_name?.split(' ')[0] ?? 'there'
  const alreadyDone = !!sessionResult.data?.completed_at
  const streak = child?.streak_weeks ?? 0

  const stage = STAGES.find(s => s.ageBand === (child?.age_band as AgeBand)) ?? STAGES[2]

  // Last completed script for the review card
  const { data: lastCompletion } = await supabase
    .from('script_completions')
    .select('script_sort_order, completed_at')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  let lastScript: { title: string; why_it_works: string } | null = null
  if (lastCompletion) {
    const { data: s } = await supabase
      .from('scripts')
      .select('title, why_it_works')
      .eq('sort_order', lastCompletion.script_sort_order)
      .single()
    if (s) lastScript = s
  }

  // A daily moments script from the right stage for the "watch for this" card
  const { data: momentScript } = await supabase
    .from('scripts')
    .select('title, situation, say_this')
    .eq('stage_id', stage.ageBand === '4-7' ? 'foundation' : stage.ageBand === '8-10' ? 'builder' : stage.ageBand === '11-13' ? 'explorer' : stage.ageBand === '13-15' ? 'shaper' : 'independent')
    .gte('sort_order', 1301)
    .lte('sort_order', 1399)
    .order('sort_order', { ascending: false })
    .limit(3)
    .maybeSingle()

  const stageChallenge = stage.challengeActions?.screens_takeover ?? stage.focus

  const cards: DailyCard[] = []

  // Card 1 — Review (if there's a last script) or Welcome
  if (lastScript) {
    cards.push({
      id: 'review',
      type: 'review',
      eyebrow: 'From last time',
      headline: lastScript.title,
      body: lastScript.why_it_works,
      accent: 'var(--lav-deep)',
      bg: 'var(--lav)',
      icon: '↩',
    })
  } else {
    cards.push({
      id: 'welcome',
      type: 'review',
      eyebrow: `Good to have you back, ${firstName}`,
      headline: `Stage ${stage.id}: ${stage.name}`,
      body: stage.focus,
      accent: 'var(--lav-deep)',
      bg: 'var(--lav)',
      icon: '◎',
    })
  }

  // Card 2 — Today's focus (from stage data)
  cards.push({
    id: 'focus',
    type: 'focus',
    eyebrow: 'Today\'s focus',
    headline: 'What matters right now',
    body: stageChallenge,
    accent: 'var(--green-dark)',
    bg: 'var(--green-lt)',
    icon: '◈',
  })

  // Card 3 — Watch for this (daily moment situation)
  if (momentScript) {
    cards.push({
      id: 'watchfor',
      type: 'watchfor',
      eyebrow: 'Watch for this today',
      headline: momentScript.title,
      body: `${momentScript.situation}\n\nIf this happens, try: "${momentScript.say_this}"`,
      accent: 'var(--gold-dark)',
      bg: 'var(--gold-lt)',
      icon: '△',
    })
  }

  // Card 4 — Reflective question (stage-based)
  const questions: Record<number, string> = {
    1: 'Has your child had any screen-free time today? Even 20 minutes of imaginative play builds the self-regulation they will need later.',
    2: 'Do you know what your child did online yesterday? Not to check up on them. Just to be curious. One question at dinner is enough.',
    3: 'Has anything changed in your child\'s mood or behaviour this week? Mood is often the first signal that something is happening online.',
    4: 'When did you last have a conversation with your teenager that was not about a screen? Just a check.',
    5: 'Is your young person building a digital life they will be proud of? That is the whole question at this stage.',
  }

  cards.push({
    id: 'question',
    type: 'question',
    eyebrow: 'A question for today',
    headline: 'Just one thing to notice',
    body: questions[stage.id] ?? questions[3],
    accent: 'var(--coral)',
    bg: 'var(--coral-lt)',
    icon: '?',
  })

  // Card 5 — Complete
  cards.push({
    id: 'complete',
    type: 'complete',
    eyebrow: 'Daily practice',
    headline: alreadyDone ? 'Already done today' : 'You\'re done for today',
    body: alreadyDone
      ? 'You have already completed today\'s practice. Come back tomorrow to keep the streak going.'
      : streak > 0
      ? `${streak} week streak and counting. See you tomorrow.`
      : 'Practice done. Come back tomorrow and build the habit.',
    accent: 'var(--green-dark)',
    bg: 'var(--green-lt)',
    icon: '✓',
  })

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <DailyDeckViewer cards={cards} alreadyDone={alreadyDone} />
    </div>
  )
}
