import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { STAGES } from '@/lib/content/stages'
import type { AgeBand } from '@/lib/content/stages'
import { pickReview, agoLabel, type Completion } from '@/lib/pathway/review-pick'
import DailyDeckViewer from './DailyDeckViewer'
import type { DailyCard } from './DailyDeckViewer'
import ConcernCheckIn from '@/components/daily/ConcernCheckIn'

export default async function DailyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const [profileResult, childResult, sessionResult, yesterdaySession, concernsResult] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('children').select('name, age_band, stage_id, streak_weeks, actions_this_week').eq('parent_id', user.id).eq('is_primary', true).single(),
    supabase.from('daily_sessions').select('completed_at').eq('user_id', user.id).eq('session_date', today).maybeSingle(),
    supabase.from('daily_sessions').select('moment_feedback').eq('user_id', user.id).eq('session_date', yesterday).maybeSingle(),
    // Live concerns flagged before today and not yet checked today: these
    // become the one tap check in card above the moments tagger.
    supabase.from('concerns')
      .select('id, slug, label, times_flagged, last_flagged_at')
      .eq('user_id', user.id)
      .in('status', ['open', 'improving'])
      .lt('last_flagged_at', today)
      .or(`last_checked_at.is.null,last_checked_at.lt.${today}`)
      .order('last_flagged_at', { ascending: false })
      .limit(5),
  ])

  const child = childResult.data
  const firstName = profileResult.data?.full_name?.split(' ')[0] ?? 'there'
  const alreadyDone = !!sessionResult.data?.completed_at
  const streak = child?.streak_weeks ?? 0
  const yesterdayMoments: string[] = (yesterdaySession.data?.moment_feedback as string[] | null) ?? []
  // The generic Something else catch all is a picker, not a real moment, so it
  // is never a rateable check in row: only the specific moment a parent lands
  // on is tracked. Guard it out of the list defensively even if an old row
  // exists.
  const GENERIC_CONCERN_SLUGS = new Set(['something-else', 'something_else', 'other'])
  const checkIns = ((concernsResult.data ?? []) as { id: string; slug: string; label: string; times_flagged: number; last_flagged_at: string }[])
    .filter(c => c.slug && !GENERIC_CONCERN_SLUGS.has(c.slug) && (c.label ?? '').trim().toLowerCase() !== 'something else')

  // What they said last time for each check in, so the card can show it back
  // and the verdict can name the move. A second wave by necessity: it needs the
  // concern ids from the first.
  //
  // The card asks for one of five bands now and posts the top of each (2, 4, 6,
  // 8, 10), so this stays a plain read of the last score. An ODD number here is
  // a legacy answer from the ten point scale and is handled rather than
  // ignored: bandOf() rounds it to the word it belonged to, so the ring lands in
  // the right place for a family who has been checking in for weeks.
  const lastScoreByConcern = new Map<string, number>()
  if (checkIns.length > 0) {
    const { data: scoreRows } = await supabase
      .from('concern_events')
      .select('concern_id, score, created_at')
      .in('concern_id', checkIns.map(c => c.id))
      .order('created_at', { ascending: false })
      .limit(120)
    for (const r of (scoreRows ?? []) as { concern_id: string; score: number | null }[]) {
      if (typeof r.score === 'number' && !lastScoreByConcern.has(r.concern_id)) {
        lastScoreByConcern.set(r.concern_id, r.score)
      }
    }
  }

  const stage = STAGES.find(s => s.ageBand === (child?.age_band as AgeBand)) ?? STAGES[2]

  // Everything they have completed, for the look back card.
  //
  // NOT limit 1. That was a pin rather than a rotation: until a parent completed
  // a new script the card showed the same one every single day, which is what
  // Justin was seeing. The whole history is read so the card can walk through
  // it, and so a script they said did not work can be brought back on purpose.
  // Twenty is plenty: a rotation longer than that stops feeling like a rotation.
  const { data: completionRows } = await supabase
    .from('script_completions')
    .select('script_sort_order, completed_at, worked')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(20)

  const completions = (completionRows ?? []) as Completion[]

  // Titles for the completed scripts, so a flagged topic can be matched against
  // what they already own. One query for the set rather than one per row.
  const reviewTitles = new Map<number, string>()
  if (completions.length > 0) {
    const { data: titleRows } = await supabase
      .from('scripts')
      .select('sort_order, title')
      .in('sort_order', completions.map(c => c.script_sort_order))
    for (const r of titleRows ?? []) reviewTitles.set(r.sort_order as number, r.title as string)
  }

  // Pick a daily moment card — prefer topics flagged yesterday, otherwise use date rotation
  // stage.name matches the scripts table's stage_id slugs exactly once lowercased
  // (foundation/builder/explorer/shaper/independent), so no separate map to maintain
  // or get out of sync with the real AgeBand values in lib/content/stages.ts.
  const stageId = stage.name.toLowerCase()

  // Pull a pool of 12 moment scripts for this stage to rotate through
  const { data: momentPool } = await supabase
    .from('scripts')
    .select('title, situation, say_this, sort_order')
    .eq('stage_id', stageId)
    .eq('category', 'daily-moments')
    .gte('sort_order', 1301)
    .lte('sort_order', 1399)
    .order('sort_order', { ascending: true })
    .limit(30)

  // Each daily-moments script is written about one specific routine moment, so a
  // moment flagged yesterday (see components/cards/MomentCard.tsx) can be matched
  // back to a script by keyword, closing the loop the app promises the parent.
  const MOMENT_KEYWORDS: Record<string, string[]> = {
    morning: ['morning'],
    teeth: ['teeth'],
    dressed: ['dressed'],
    bag: ['bag'],
    lunch: ['lunch'],
    dropoff: ['drop off', 'dropoff'],
    pickup: ['pickup', 'pick up'],
    snacks: ['snack'],
    dinner: ['dinner'],
    tv_eve: ['tv'],
    homework: ['homework'],
    clothes: ['clothes', 'washing'],
    fighting: ['fighting', 'sibling'],
    bedtime: ['bedtime', 'bed'],
    sleep: ['sleep', 'asleep'],
  }

  const dayIndex = Math.floor(Date.now() / 86400000)

  // Which past script to look back at today, and WHY, because the reason
  // decides what the card is allowed to say. See lib/pathway/review-pick.
  //
  // The topic matcher reuses the keyword map below: if a check in flagged
  // bedtime and they already own a bedtime script, that beats the rotation.
  const review = pickReview(
    completions,
    dayIndex,
    yesterdayMoments.length > 0
      ? sortOrder => {
          const title = reviewTitles.get(sortOrder)
          if (!title) return false
          const words = yesterdayMoments.flatMap(m => MOMENT_KEYWORDS[m] ?? [])
          return words.some(w => title.toLowerCase().includes(w))
        }
      : undefined,
  )

  let lastScript: { title: string; why_it_works: string } | null = null
  if (review) {
    const { data: s } = await supabase
      .from('scripts')
      .select('title, why_it_works')
      .eq('sort_order', review.sortOrder)
      .maybeSingle()
    if (s) lastScript = s
  }
  const reviewCompletedAt = review
    ? completions.find(c => c.script_sort_order === review.sortOrder)?.completed_at ?? null
    : null
  let momentScript: { title: string; situation: string; say_this: string; sort_order: number } | null = null
  let momentMatchedYesterday = false

  if (momentPool && momentPool.length > 0) {
    if (yesterdayMoments.length > 0) {
      const keywords = yesterdayMoments.flatMap(m => MOMENT_KEYWORDS[m] ?? [])
      const matches = momentPool.filter(s =>
        keywords.some(kw => s.title.toLowerCase().includes(kw) || s.situation.toLowerCase().includes(kw))
      )
      if (matches.length > 0) {
        momentScript = matches[dayIndex % matches.length]
        momentMatchedYesterday = true
      }
    }
    if (!momentScript) {
      momentScript = momentPool[dayIndex % momentPool.length]
    }
  }

  const stageChallenge = stage.challengeActions?.screens_takeover ?? stage.focus

  // Cards never name a rule without spelling it out. If the stage text
  // mentions a shorthand the parent might not know yet, the definition
  // rides on the same card, and the button goes where the rule lives.
  const RULE_EXPLAINERS: { match: string; text: string }[] = [
    {
      match: 'bedroom rule',
      text: 'The bedroom rule, spelled out: screens do not sleep in bedrooms. Every device charges in the kitchen or hallway overnight, grown ups phones too, because kids copy what they see.',
    },
    {
      match: 'charging station',
      text: 'The charging station, spelled out: one spot in the kitchen or hallway where every device in the house sleeps overnight, grown ups phones included.',
    },
  ]
  const challengeExplainer = RULE_EXPLAINERS.find(r => stageChallenge.toLowerCase().includes(r.match))

  const cards: DailyCard[] = []

  // The warmth layer: cards talk like a friend who knows this family,
  // never a textbook. Context first, database content framed, always a
  // hand on the shoulder before the information.
  const ukHour = Number(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', hour: 'numeric', hour12: false }))
  const greeting = ukHour < 12 ? 'Morning' : ukHour < 18 ? 'Afternoon' : 'Evening'

  // Card 1 — Review (if there's a last script) or Welcome
  if (lastScript && review) {
    // The eyebrow and the opening line both change with the reason.
    //
    // "Last time you reached for the words for this one" is a claim about
    // RECENCY. On the old card it was said every day about a script a parent
    // had opened once, weeks ago, which is a product telling somebody something
    // untrue about their own history. It is only said now when it is true.
    const ago = reviewCompletedAt ? agoLabel(reviewCompletedAt) : ''
    const when = ago ? ` You used it ${ago}.` : ''

    const eyebrow =
      review.reason === 'did-not-work' ? 'This one did not land'
      : review.reason === 'flagged' ? 'You raised this again'
      : review.reason === 'rotation' ? 'Worth another look'
      : 'From last time'

    const opener =
      review.reason === 'did-not-work'
        ? `${greeting}, ${firstName}. You told us this one did not work.${when} That is worth coming back to rather than leaving behind, so here is what it was trying to do:`
      : review.reason === 'flagged'
        ? `${greeting}, ${firstName}. This came up again in your check in, and you already have the words for it.${when} The thinking behind them:`
      : review.reason === 'rotation'
        ? `${greeting}, ${firstName}. One from your own shelf, number ${(dayIndex % review.total) + 1} of ${review.total}.${when} Thirty seconds on why it works, because the why is what makes it yours:`
        : `${greeting}, ${firstName}. Last time you reached for the words for this one. Worth thirty seconds on why they do the heavy lifting, because the why is what makes them yours:`

    cards.push({
      id: 'review',
      type: 'review',
      eyebrow,
      headline: lastScript.title,
      body: `${opener}\n\n${lastScript.why_it_works}`,
      accent: 'var(--terracotta)',
      icon: '↩',
      action: { label: 'Open the full script', href: `/dashboard/scripts/${review.sortOrder}` },
    })
  } else {
    cards.push({
      id: 'welcome',
      type: 'review',
      eyebrow: `Good to have you back, ${firstName}`,
      headline: `Stage ${stage.id}: ${stage.name}`,
      body: `${greeting}, ${firstName}. Two minutes, that is all this takes. Where your family is on the pathway right now:\n\n${stage.focus}`,
      accent: 'var(--terracotta)',
      icon: '◎',
    })
  }

  // Card 2 — Today's focus (from stage data), the rule always spelled
  // out in full and the button pointing where it gets made official.
  cards.push({
    id: 'focus',
    type: 'focus',
    eyebrow: 'Today\'s focus',
    headline: 'One thing, nothing else',
    body: `If today gets busy and everything else falls away, hold onto this one thing:\n\n${stageChallenge}${challengeExplainer ? `\n\n${challengeExplainer.text}` : ''}\n\nThat is the whole ask. Small, doable, and it compounds.`,
    accent: 'var(--terracotta)',
    icon: '◈',
    action: { label: 'Make it official in your family agreement', href: '/dashboard/agreement' },
  })

  // Card 3 — Watch for this (daily moment situation)
  if (momentScript) {
    cards.push({
      id: 'watchfor',
      type: 'watchfor',
      eyebrow: momentMatchedYesterday ? 'Because you flagged this yesterday' : 'Watch for this today',
      headline: momentScript.title,
      body: `${momentMatchedYesterday ? 'You flagged this one yesterday, so let us walk in ready today.' : 'Every family knows this one, yours included.'} ${momentScript.situation}\n\nIf it shows up, you already have the words: "${momentScript.say_this}"\n\nNo lecture, no negotiation. Say it warmly and let it land.`,
      accent: 'var(--terracotta)',
      icon: '△',
      action: { label: 'Read the full script', href: `/dashboard/scripts/${momentScript.sort_order}` },
    })
  }

  // Card 4 — Reflective question, a small pool per stage rotated by the day.
  // One fixed question per stage meant a daily card that read identically
  // every single morning, which is half of Justin's "the first card always
  // seems the same". Three per stage, walked by the same dayIndex the moment
  // card uses, keeps it a daily question rather than a laminated one.
  const questions: Record<number, string[]> = {
    1: [
      'Has your child had any screen-free time today? Even 20 minutes of imaginative play builds the self-regulation they will need later.',
      'Who chose what went on the screen last time, you or them? Handing over the choosing, inside your limits, is where self control starts.',
      'What did your child do straight after the screen went off yesterday? The handover moment tells you more than the minutes do.',
    ],
    2: [
      'Do you know what your child did online yesterday? Not to check up on them. Just to be curious. One question at dinner is enough.',
      'When did your child last teach YOU something about a game or an app? Being the student for five minutes opens more doors than any rule.',
      'Is the charging spot still working, or have devices crept back to bedrooms? Structure drifts quietly. A ten second check today.',
    ],
    3: [
      'Has anything changed in your child\'s mood or behaviour this week? Mood is often the first signal that something is happening online.',
      'Does your child know what you would do if they showed you something upsetting they had seen? If they expect calm, they will show you.',
      'Which app got most of their time this week, and do you know what it feels like to use? Ten minutes inside it is worth a week of headlines.',
    ],
    4: [
      'When did you last have a conversation with your teenager that was not about a screen? Just a check.',
      'Would your teenager say you trust them online? Their answer, not yours, is the one that shapes what they tell you next.',
      'What is one thing your teenager did online this week that deserved credit? Catch them doing it right, out loud.',
    ],
    5: [
      'Is your young person building a digital life they will be proud of? That is the whole question at this stage.',
      'Do they know how to walk away from an online space that turns nasty? Leaving well is a skill, and it is learnable.',
      'What does their online presence say about them to someone who has never met them? Worth asking them, not telling them.',
    ],
  }
  const stageQuestions = questions[stage.id] ?? questions[3]

  cards.push({
    id: 'question',
    type: 'question',
    eyebrow: 'A question for today',
    headline: 'Just one thing to notice',
    body: stageQuestions[dayIndex % stageQuestions.length],
    accent: 'var(--terracotta)',
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
    accent: 'var(--terracotta)',
    icon: '✓',
  })

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      {/* Always on the page, whatever state today's moment deck is in, so
          the pathway's Check in link always lands somewhere answerable
          and can actually flip to done. */}
      {checkIns.length > 0 && (
        <div id="checkin" style={{ maxWidth: '480px', margin: '0 auto', padding: '20px 20px 0' }}>
          <ConcernCheckIn concerns={checkIns.map(c => ({
            slug: c.slug,
            label: c.label,
            timesFlagged: c.times_flagged,
            lastFlaggedAt: c.last_flagged_at,
            lastScore: lastScoreByConcern.get(c.id) ?? null,
          }))} />
        </div>
      )}
      <DailyDeckViewer cards={cards} alreadyDone={alreadyDone} />
    </div>
  )
}
