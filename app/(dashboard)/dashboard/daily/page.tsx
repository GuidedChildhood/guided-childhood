import { createClient } from '@/lib/supabase/server'
import { getChildren } from '@/lib/children/server'
import { redirect } from 'next/navigation'
import { STAGES } from '@/lib/content/stages'
import type { AgeBand } from '@/lib/content/stages'
import { pickReview, agoLabel, type Completion } from '@/lib/pathway/review-pick'
import DailyDeckViewer from './DailyDeckViewer'
import type { DailyCard } from './DailyDeckViewer'
import { getMomentTopics, firstMatch, MOMENT_KEYWORDS } from '@/lib/daily/moment-source'

export default async function DailyPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  // Which child this page is about, so the switcher in the layout actually
  // changes the page rather than only the pills. See lib/children/server.ts.
  const { child: childParam } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const [profileResult, childResult, sessionResult, yesterdaySession] = await Promise.all([
    supabase.from('profiles').select('full_name, onboarding_answers').eq('id', user.id).single(),
    // In the same wave as before: getChildren returns a promise like any
    // other read, so honouring ?child= costs no extra round trip.
    getChildren<{
      id: string; name: string | null; age_band: string | null; stage_id: number | null
      streak_weeks: number | null; actions_this_week: number | null; is_primary: boolean | null
    }>(supabase, user.id, childParam, 'name, age_band, stage_id, streak_weeks, actions_this_week'),
    // Per child since migration 210. Asking by user alone is what made
    // Olgie's day show as done the moment Teo's was.
    supabase.from('daily_sessions').select('completed_at, child_id').eq('user_id', user.id).eq('session_date', today),
    // Not maybeSingle, same reason as today's read one line up: with a row per
    // child, more than one row is a PostgREST error, the data read as null and
    // yesterday's flags silently vanished for every family with two children.
    // The child is picked below, once we know which child the page is about.
    supabase.from('daily_sessions').select('moment_feedback, child_id').eq('user_id', user.id).eq('session_date', yesterday),
  ])

  const child = childResult.child
  const firstName = profileResult.data?.full_name?.split(' ')[0] ?? 'there'
  // The child's name, for the cards below. A deck with Teo and Olga in the
  // switcher saying "your child" on every card is about neither of them.
  const kidName = child?.name && child.name !== 'Your child' ? child.name : null
  // Say the child's name where the written copy says "your child". The stage
  // vocabulary shifts as they grow, so the older phrasings are swapped too.
  const named = (text: string) => kidName
    ? text
        .replace(/\byour child\b/g, kidName)
        .replace(/\byour teenager\b/g, kidName)
        .replace(/\byour young person\b/g, kidName)
    : text
  // DONE FOR THIS CHILD, not for the household. Migration 210 gave the table a
  // child, so the answer is "is there a completed row for the child I am
  // looking at", and a legacy row with no child still counts for everybody
  // because that is what it meant when it was written.
  const sessions = (sessionResult.data ?? []) as { completed_at: string | null; child_id: string | null }[]
  const alreadyDone = sessions.some(r =>
    !!r.completed_at && (r.child_id === (child?.id ?? null) || r.child_id === null))
  const streak = child?.streak_weeks ?? 0
  // Yesterday's flags for THIS child, or a household row written before the
  // sessions went per child, which spoke for everybody when it was written.
  const yRows = (yesterdaySession.data ?? []) as { moment_feedback: string[] | null; child_id: string | null }[]
  const yRow = yRows.find(r => r.child_id === (child?.id ?? null)) ?? yRows.find(r => r.child_id === null)
  const yesterdayMoments: string[] = yRow?.moment_feedback ?? []
  const stage = STAGES.find(s => s.ageBand === (child?.age_band as AgeBand)) ?? STAGES[2]

  // Everything they have completed, for the look back card.
  //
  // NOT limit 1. That was a pin rather than a rotation: until a parent completed
  // a new script the card showed the same one every single day, which is what
  // Justin was seeing. The whole history is read so the card can walk through
  // it, and so a script they said did not work can be brought back on purpose.
  // Twenty is plenty: a rotation longer than that stops feeling like a rotation.
  // THIS child's shelf, not the household's. Completions are per child (key
  // 219), and the look back card walking through the other child's scripts is
  // the deck telling a parent about conversations that were not about this
  // child. A row with no child on it predates the split and counts for
  // everyone, matching how every per child read treats the legacy rows.
  let completionsQ = supabase
    .from('script_completions')
    .select('script_sort_order, completed_at, worked')
    .eq('user_id', user.id)
  if (child?.id) completionsQ = completionsQ.or(`child_id.eq.${child.id},child_id.is.null`)
  const { data: completionRows } = await completionsQ
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

  // ── THE POOL WAS ALWAYS EMPTY, FOR EVERY FAMILY, SINCE IT WAS WRITTEN ─────
  //
  // This filtered on category 'daily-moments'. Checked against the live
  // database rather than assumed: THERE IS NO SUCH CATEGORY. The scripts in the
  // 1301 to 1399 band are filed under everyday-routines, screen-time, gaming,
  // family-rules, school-and-ai, staying-safe, mood-confidence and
  // social-media. So the query returned zero rows for every stage, every day,
  // and the Watch for this card has never once rendered for anybody.
  //
  // Nothing failed loudly, which is why it survived: momentPool came back
  // empty, momentScript stayed null, and the card was simply skipped. The deck
  // quietly ran one card short for its whole life.
  //
  // The sort_order band IS the daily moments set, and it is what the comment
  // above always meant. For a Builder stage family that band holds 21 real
  // scripts, including "Sibling Fights Over One Device" and "They Are Fighting
  // Over Something Specific", which are exactly what the top live concern on
  // the account, Sibling fighting, should have been matching all along.
  const { data: momentPool } = await supabase
    .from('scripts')
    .select('title, situation, say_this, sort_order')
    .eq('stage_id', stageId)
    .gte('sort_order', 1301)
    .lte('sort_order', 1399)
    .order('sort_order', { ascending: true })
    .limit(40)

  // Each daily-moments script is written about one specific routine moment, so a
  // moment flagged yesterday (see components/cards/MomentCard.tsx) can be matched
  // back to a script by keyword, closing the loop the app promises the parent.
  // The keyword map moved to lib/daily/moment-source.ts, because the concern
  // path needs the same one: a concern created FROM a moment carries that
  // moment's slug, so the exact map beats word matching whenever it applies.

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

  // ── THE CARD IS ABOUT THIS FAMILY, NOT ABOUT TODAY'S DATE ─────────────────
  //
  // Justin, 14 August 2026: "what does it come up with this particular moment to
  // start... if first time after sign up then choose what they ticked at set
  // up, so that moment should then bring up cards associated with the sign up
  // issues raised."
  //
  // The old fallback was pool[dayIndex % pool.length], a pure calendar
  // rotation, and it fired on every day the parent had not logged something the
  // day before, which is most days. A family who told us at signup that gaming
  // was their problem could open the app next morning to a card about
  // lunchboxes.
  //
  // getMomentTopics returns what they flagged yesterday, then their live
  // worries, then what they ticked at signup, in that order, with anything they
  // have just called sorted removed. See lib/daily/moment-source.ts for why
  // each step is there. The calendar is still the last resort, because a
  // general card beats no card, but it is now genuinely last.
  const topics = await getMomentTopics(
    supabase, user.id, yesterdayMoments, profileResult.data?.onboarding_answers,
    // This child's worries drive this child's card. See moment-source.ts.
    child?.id ?? null,
  )
  let momentTopicSource: 'yesterday' | 'concern' | 'signup' | 'rotation' = 'rotation'
  let momentTopicLabel: string | null = null

  if (momentPool && momentPool.length > 0) {
    for (const topic of topics) {
      const matches = firstMatch(
        momentPool, topic.keywords,
        sc => `${sc.title} ${sc.situation}`.toLowerCase(),
      )
      if (matches.length > 0) {
        momentScript = matches[dayIndex % matches.length]
        momentTopicSource = topic.source
        momentTopicLabel = topic.label
        momentMatchedYesterday = topic.source === 'yesterday'
        break
      }
    }
    if (!momentScript) {
      momentScript = momentPool[dayIndex % momentPool.length]
    }
  }

  // Nothing raised, nothing ticked at signup, nothing matched: this family has
  // genuinely told us nothing yet. Justin: "I would like it to give the
  // timeline moment page if no moments have yet been raised." So the card says
  // so and sends them to the timeline, rather than pretending a card picked by
  // the date is about them.
  const nothingKnownYet = topics.length === 0

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
    body: `If today gets busy and everything else falls away, hold onto this one thing:\n\n${named(stageChallenge)}${challengeExplainer ? `\n\n${challengeExplainer.text}` : ''}\n\nThat is the whole ask. Small, doable, and it compounds.`,
    accent: 'var(--terracotta)',
    icon: '◈',
    action: { label: 'Make it official in your family agreement', href: '/dashboard/agreement' },
  })

  // Card 3 — Watch for this, and it SAYS where it came from.
  //
  // The eyebrow is not decoration. A card that opens "because you flagged this
  // yesterday" is the product proving it listened, and the same card opening
  // "watch for this today" when it was actually picked by the date is the
  // product bluffing. Each source gets its own honest line, and the calendar
  // one no longer claims to be about them.
  if (nothingKnownYet) {
    cards.push({
      id: 'watchfor',
      type: 'watchfor',
      eyebrow: 'Tell us what today looked like',
      headline: 'What actually happened today?',
      body: `We do not know your family yet, and rather than guess at what to put in front of you, it is worth thirty seconds telling us.\n\nTap whatever came up today, even the small things. Tomorrow this card is about that, and the day after it is about whatever moved.`,
      accent: 'var(--terracotta)',
      icon: '△',
      action: { label: 'Pick from the timeline', href: '/dashboard/moments' },
    })
  } else if (momentScript) {
    const eyebrow =
      momentTopicSource === 'yesterday' ? 'Because you flagged this yesterday'
      : momentTopicSource === 'concern' ? `Because ${(momentTopicLabel ?? 'this').toLowerCase()} is on your list`
      : momentTopicSource === 'signup' ? 'From what you told us when you joined'
      : 'Watch for this today'
    const opener =
      momentTopicSource === 'yesterday' ? 'You flagged this one yesterday, so let us walk in ready today.'
      : momentTopicSource === 'concern' ? 'This is one you are working on, so here is today\'s version of it.'
      : momentTopicSource === 'signup' ? 'You named this when you joined, so this is where we start.'
      : 'Every family knows this one, yours included.'
    cards.push({
      id: 'watchfor',
      type: 'watchfor',
      eyebrow,
      headline: momentScript.title,
      body: `${opener} ${momentScript.situation}\n\nIf it shows up, you already have the words: "${momentScript.say_this}"\n\nNo lecture, no negotiation. Say it warmly and let it land.`,
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
    // The child's name in the question itself. "Do you know what Teo did
    // online yesterday" is a question about a person; "your child" is a
    // question about a category, and with two names in the switcher it does
    // not even say which one.
    body: named(stageQuestions[dayIndex % stageQuestions.length]),
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
      {/* THE CHECK IN IS NOT ON THIS PAGE ANY MORE, and that is the point.
          Justin, 13 August 2026: "check in is different from moments."
          It lived here, above the deck, and every link to it was
          /dashboard/daily#checkin, so asking to check in landed a parent on
          the moments page. It has its own page now: /dashboard/checkin, loaded
          by lib/checkin/today.ts. A reading and a moment are two different
          questions and they no longer share a screen. */}
      <DailyDeckViewer cards={cards} alreadyDone={alreadyDone} />
    </div>
  )
}
