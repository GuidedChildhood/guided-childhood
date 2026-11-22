import { scriptsForMoment, type MomentText } from '@/lib/content/moment-to-scripts'
import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { getChildren } from '@/lib/children/server'
import { hasFullAccess } from '@/lib/access'
import { redirect } from 'next/navigation'
import { CHALLENGE_TO_CATEGORY } from '@/lib/content/challenge-map'
import { getRecommendedScript, getTopScripts } from '@/lib/pathway/recommend'
import { recordSurfaceEvents } from '@/lib/events/record'
import { countsTowardPathway } from '@/lib/pathway/script-status'
import type { ChallengeId } from '@/lib/content/stages'
import ScriptsLibrary from '@/components/scripts/ScriptsLibrary'
import type { MomentCard } from '@/components/scripts/ScriptMoments'
import { momentFor } from '@/lib/scripts/moments'
import { revisitShelf, conversationTally, type CompletionLite } from '@/lib/scripts/shelves'

import { CATEGORY_META, STAGE_META, type StageId, type ScriptRow } from '@/components/scripts/library-meta'
export { CATEGORY_META }




// Where a parent came from, so they can get back.
//
// Justin, 10 August 2026: "it's taking me here from the pathway but not allowing
// me to either go back, or it doesn't update if I read it. Is this because I am
// not paying?"
//
// It was not the paywall. The pathway and the passport have always linked here
// as /dashboard/scripts?stage=<slug>, and this page only ever read `topic` and
// `cat`. The stage was dropped on the floor. A parent who tapped "the words for
// this stage" landed on the whole library, at the top, with no filter, nothing
// saying why they were there and no way back to the road they came off.
//
// Read from the link rather than the referrer, matching the devices page: a
// referrer is stripped by enough browsers that the back link would silently
// change meaning depending on the reader's setup.
// Both the road and the passport book live on /dashboard/pathway, so there is
// one place to send them back to and no chance of guessing wrong.
const PATHWAY_HREF = '/dashboard/pathway'

export default async function ScriptsPage({ searchParams }: { searchParams: Promise<{ topic?: string; moment?: string; cat?: string; stage?: string; from?: string; q?: string; child?: string }> }) {
  const { topic, moment: momentId, cat, stage, from, q, child: childParam } = await searchParams
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')

  const [{ data: profile }, { child }, { data: scriptsData }, { data: completions }] = await Promise.all([
    supabase.from('profiles').select('subscription_status, trial_ends_at, onboarding_answers').eq('id', user.id).single(),
    // The child's stage decides which scripts lead the page, so this has to be
    // the child the parent chose. Justin: "scripts page for all children with
    // toggle." It read the primary child, so switching to the six year old left
    // the teenager's scripts on top.
    getChildren<{ id: string; stage_id: string | null; is_primary: boolean | null; name: string | null }>(
      supabase, user.id, childParam, 'stage_id, name'),
    supabase.from('scripts').select('id, stage_id, title, situation, category, is_free, sort_order, say_this, if_they_push_back').order('sort_order', { ascending: true }),
    supabase.from('script_completions').select('script_sort_order, completed_at, status, worked, child_id').eq('user_id', user.id),
  ])

  const isPaid = hasFullAccess(profile, user.email)
  const scripts = (scriptsData ?? []) as ScriptRow[]
  // The tick means the conversation happened, not that the page was opened.
  // Migration 157 split those two apart; this list was still counting a row of
  // any kind, so a parent who scrolled through ten scripts came back to ten
  // ticks and a passport that disagreed with every one of them. The free read
  // counter below deliberately keeps counting opens, because opening a paid
  // script is exactly what that allowance is spent on.
  const completedOrders = new Set(
    (completions ?? []).filter(c => countsTowardPathway((c as { status?: string }).status)).map(c => c.script_sort_order)
  )
  const challenge = (profile?.onboarding_answers as Record<string, string> | null)?.challenge as ChallengeId | undefined
  const matchCategory = challenge ? CHALLENGE_TO_CATEGORY[challenge] : null
  const currentStageId = (child?.stage_id as StageId) ?? null

  // THE CHILD TRAVELS WITH EVERY LINK, and this is the whole per child fix.
  //
  // ?child= is the single source of truth for which child a page is about
  // (lib/children/current.ts), and the script reader's read tick, its status
  // buttons and its "note for" name all resolve the child from the URL they
  // are on. Every link out of this page used to drop the param, so a parent
  // who switched to Olga and opened a script marked TEO's day: the switcher
  // moved the pills and the very next tap threw the choice away.
  //
  // Matches the switcher's own rule: the primary child keeps the clean URL,
  // so nothing changes for a one child family or an unswitched visit.
  const childQS = childParam && child && !child.is_primary ? child.id : null
  // withChild lives in ScriptsLibrary now, built from the same childQS.

  // Handoff from a moment card: when the deck sends the parent here with a
  // topic, the scripts for that exact moment lead the page as the yellow Good
  // Inside numbered list, so the loop closes on the relevant words, not a
  // browse. Falls back silently to the normal page when nothing matches.
  const topicKey = topic ? decodeURIComponent(topic).toLowerCase().trim() : null
  // The moment and script taxonomies were never the same list, and the
  // substring match this used to do found a script for 10 of 89 live moments,
  // then listed all 33 school scripts across every age for those ten. The
  // moment's own words now choose, for this child's stage, at most four. See
  // lib/content/moment-to-scripts.ts.
  //
  // The row is read through the parent's own session: `authenticated` holds
  // SELECT on daily_moments, it is the same read the moments page makes, and
  // a bad or stale id simply finds nothing and the page renders as it always
  // has.
  const { data: momentRow } = momentId && /^[0-9a-f-]{36}$/i.test(momentId)
    ? await supabase
        .from('daily_moments')
        .select('title, category, science_brief, digi_opener, solutions')
        .eq('id', momentId)
        .maybeSingle()
    : { data: null }
  const momentMatch = momentRow
    ? scriptsForMoment(scripts, momentRow as MomentText, child?.stage_id ?? null)
    : null
  const topicScripts = momentMatch?.scripts ?? []
  // The heading names the moment the parent just read, in their words, not
  // the shelf it was filed on.
  const topicLabel = momentRow ? (momentRow as MomentText).title : null

  // The recommendation is about THIS child: their stage, and since 20 August
  // 2026 their own concerns and check ins too, so switching the pills changes
  // the pick rather than only the shelf it sits on.
  //
  // Five now, not one. Justin, 1 September 2026: "a top 5 of scripts that
  // apply to details we gather for each child ... recommended scripts to
  // choose from." Position one is the same pick the road carries; the other
  // four are the choice. For an unpaid parent the lead card keeps its free
  // first pick so the big butter button never opens onto a paywall, while
  // the shelf below shows the honest ranking with locks on its face.
  const topPicks = currentStageId
    ? await getTopScripts(supabase, user.id, currentStageId, challenge ?? null, { childId: child?.id ?? null })
    : []
  const recommended = currentStageId
    ? (isPaid
        ? topPicks[0] ?? null
        : await getRecommendedScript(supabase, user.id, currentStageId, challenge ?? null, { preferFree: true, childId: child?.id ?? null }))
    : null
  // Two more, not four. The lead plus two is a choice a parent can take in at
  // a glance; five stacked cards was a list to read (15 November review of the
  // Quests page, same reasoning: show what is needed every visit, one level
  // down for the rest).
  const morePicks = topPicks.filter(p => p.sort_order !== recommended?.sort_order).slice(0, 2)

  // THIS CHILD'S HISTORY, for the revisit shelf and the tally. Their own rows
  // plus any household row with no child on it, which is what a family wide
  // row always meant.
  const childRows = ((completions ?? []) as CompletionLite[])
    .filter(r => !child?.id || r.child_id === child.id || r.child_id == null)
  const onPageAbove = new Set<number>([
    ...(recommended ? [recommended.sort_order] : []),
    ...morePicks.map(p => p.sort_order),
    ...topicScripts.map(t => t.sort_order),
  ])
  const scriptBySort = new Map(scripts.map(sc => [sc.sort_order, sc]))
  const revisit = revisitShelf(childRows, { exclude: onPageAbove })
    .filter(r => scriptBySort.has(r.sort_order))
  const tally = conversationTally(childRows)
  const childName = child?.name && child.name !== 'Your child' ? child.name : null

  // The learning stream (migration 238): what the shelf actually put in
  // front of this family today. One row per pick per day, the daily index
  // dedupes repeat visits, and the recommender reads these back so a pick
  // shown for three days and never opened gives way to a fresh one.
  const shownToday = [...new Set([...(recommended ? [recommended.sort_order] : []), ...topPicks.map(p => p.sort_order)])]
  if (shownToday.length > 0) {
    await recordSurfaceEvents(supabase, user.id, shownToday.map(so => ({ surface: 'script' as const, item: so, event: 'shown' as const, childId: child?.id ?? null })))
  }

  // The chip row. Counted from the real library rather than from the eight
  // keys, so a category with nothing in it never gets a chip and a chip never
  // promises rows it cannot show.
  const catCounts = new Map<string, number>()
  for (const sc of scripts) {
    if (sc.category) catCounts.set(sc.category, (catCounts.get(sc.category) ?? 0) + 1)
  }
  const chips = (Object.keys(CATEGORY_META))
    .filter(k => (catCounts.get(k) ?? 0) > 0)
    .map(k => ({ key: k, label: CATEGORY_META[k].label, n: catCounts.get(k) ?? 0 }))
  const activeCat = cat && CATEGORY_META[cat] ? cat : null

  // The stage the pathway asked for, when it is one we have. Anything else is
  // ignored rather than shown as an empty page: a bad slug in a link should
  // degrade to the whole library, which is still useful.
  const askedStage = stage && (stage in STAGE_META) ? (stage as StageId) : null
  // A back link appears when the parent arrived from the road, and the stage
  // link is enough on its own to know that they did.
  const cameFromPathway = Boolean(askedStage) || from === 'pathway' || from === 'passport'

  const byStage = (Object.keys(STAGE_META) as StageId[])
    .filter(stageId => !askedStage || stageId === askedStage)
    .map(stageId => {
    const items = scripts.filter(s => s.stage_id === stageId && (!activeCat || s.category === activeCat))
    // Scripts matching what this parent told us their main concern was
    // surface first within the stage, so that answer stays useful instead
    // of being read once at signup and forgotten.
    const sorted = matchCategory
      ? [...items].sort((a, b) => {
          const aMatch = a.category === matchCategory ? 0 : 1
          const bMatch = b.category === matchCategory ? 0 : 1
          return aMatch - bMatch || a.sort_order - b.sort_order
        })
      : items
    return { stageId, meta: STAGE_META[stageId], items: sorted }
  }).filter(group => group.items.length > 0)

  // The weekly free allowance used to be worked out here: two free scripts a
  // week, a renewing ceiling drawn from the scripts carrying is_free.
  //
  // Justin, 11 August 2026, twice: "I don't want the scripts free so that needs
  // to be paywalled, as everything should be 4 days free paywall." So there is
  // no allowance left to count. The trial is the free offer and lib/access.ts
  // is the whole rule: an active membership, a trial that has not run out, or
  // the founder allowlist. See migration 187, which closes the same door in the
  // database so a script is unreachable as well as unopenable.

  // WHAT IS HAPPENING? and My scripts (18 November 2026, plan
  // plans/2026-11-18-scripts-system.md). The moment cards are this child's
  // age plus anything pinned, so the stack is never the whole library. The
  // words only travel for scripts the parent can open.
  let pinned: number[] = []
  try {
    const { data: pinRows } = await supabase.from('script_pins').select('script_sort_order').eq('user_id', user.id).order('created_at')
    pinned = (pinRows ?? []).map(r => r.script_sort_order as number)
  } catch { /* before migration 402: no pins yet */ }
  const cardStage = askedStage ?? currentStageId
  const momentCards: MomentCard[] = (scriptsData ?? [])
    .filter(r => !cardStage || r.stage_id === cardStage || pinned.includes(r.sort_order as number))
    .map(r => {
      const locked = !isPaid && !r.is_free
      return {
        sort_order: r.sort_order as number,
        title: r.title as string,
        situation: (r.situation as string) ?? '',
        say: locked ? null : ((r.say_this as string | null) ?? null),
        pushBack: locked ? null : ((r.if_they_push_back as string | null) ?? null),
        moment: momentFor({ title: r.title as string, situation: r.situation as string, category: r.category as string }),
        locked,
      }
    })

  return (
    <ScriptsLibrary
      momentCards={momentCards}
      pinned={pinned}
      isPaid={isPaid}
      scripts={scripts}
      completed={[...completedOrders]}
      childName={childName}
      childQS={childQS}
      tally={tally}
      recommended={recommended}
      morePicks={morePicks}
      revisit={revisit}
      topicScripts={topicScripts}
      topicLabel={topicLabel}
      topicConfident={!!momentMatch?.confident}
      byStage={byStage}
      theirStage={askedStage ?? currentStageId}
      chips={chips}
      activeCat={activeCat}
      askedStage={askedStage}
      cameFromPathway={cameFromPathway}
      pathwayHref={PATHWAY_HREF}
      initialQuery={(q ?? '').slice(0, 140)}
    />
  )
}
