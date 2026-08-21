import { createClient } from '@/lib/supabase/server'
import { getChildren } from '@/lib/children/server'
import { hasFullAccess } from '@/lib/access'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BrowseTile from '@/components/ui/BrowseTile'
import { CHALLENGE_TO_CATEGORY } from '@/lib/content/challenge-map'
import { momentImageForTitle } from '@/lib/content/moment-images'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import { countsTowardPathway } from '@/lib/pathway/script-status'
import type { ChallengeId } from '@/lib/content/stages'
import ScriptFinder from '@/components/scripts/ScriptFinder'

// The eight the library actually uses, after migration 149 collapsed fourteen
// values plus a source label into a vocabulary a parent can scan.
//
// "Everyday routines" is the one Justin did not ask for and it earned its
// place: filing the 59 daily moments by hand turned up 24 with no device in
// them at all, from teeth brushing to a sibling being unkind to a good day
// worth noticing. Every other chip here is a digital topic, so those 24 had
// nowhere honest to go.
export const CATEGORY_META: Record<string, {
  label: string
  description: string
  bg: string
  border: string
  accent: string
}> = {
  'screen-time':       { label: 'Screen time',        description: 'Handovers, standoffs, and the routines that stop the daily argument.',      bg: 'var(--stage-1)', border: 'var(--stage-1)', accent: 'var(--terracotta)' },
  'social-media':      { label: 'Social media',       description: 'Platforms, algorithms, comparison, and who they are becoming online.',      bg: 'var(--stage-3)', border: 'var(--stage-3)', accent: 'var(--terracotta)' },
  'gaming':            { label: 'Gaming',             description: 'Healthy gaming conversations without the battle.',                          bg: 'var(--stage-2)', border: 'var(--stage-2)', accent: 'var(--terracotta)' },
  'staying-safe':      { label: 'Staying safe',       description: 'What to say when something goes wrong online, from a group chat to worse.', bg: 'var(--stage-4)', border: 'var(--stage-4)', accent: 'var(--terracotta)' },
  'mood-confidence':   { label: 'Mood and confidence',description: 'Low moods, body image, and who they think they are.',                       bg: 'var(--stage-4)', border: 'var(--stage-4)', accent: 'var(--terracotta)' },
  'family-rules':      { label: 'Family rules',       description: 'First devices, other parents, siblings, and the deals you make together.',  bg: 'var(--stage-2)', border: 'var(--stage-2)', accent: 'var(--terracotta)' },
  'school-and-ai':     { label: 'School and AI',      description: 'Homework, deepfakes, AI tools, and what is real.',                          bg: 'var(--stage-5)', border: 'var(--stage-5)', accent: 'var(--terracotta)' },
  'everyday-routines': { label: 'Everyday routines',  description: 'Mornings, meals, siblings and bedtime. No screens involved.',               bg: 'var(--tint-sage)', border: 'var(--tint-sage)', accent: 'var(--terracotta)' },
}

// A contextual icon per script, so a card shows what it is about at a glance
// instead of a generic quote mark. The title wins first (the moment it names),
// then the category, then a warm talk bubble, never a bare quote glyph. Where
// a title matches one of our Higgsfield moment illustrations, the card shows
// that drawn art through BrowseTile's coverUrl instead of an emoji.
// The eight live slugs lead. The older values stay underneath as aliases
// rather than being deleted: migration 149 renames what is in the database
// today, and a row written by an older seed or restored from a backup should
// still get its icon instead of falling through to a bare quote mark.
const CATEGORY_EMOJI: Record<string, string> = {
  'screen-time': '⏰', 'screen time': '⏰',
  'social-media': '💬', 'social media': '💬',
  'gaming': '🎮', 'games': '🎮',
  'staying-safe': '🛡️',
  'mood-confidence': '💛',
  'family-rules': '🤝',
  'school-and-ai': '🤖',
  'everyday-routines': '🏡',
  // Aliases, pre 149.
  'first-device': '📱', 'first device': '📱',
  'safety': '🛡️', 'online-safety': '🛡️', 'online safety': '🛡️',
  'cyberbullying': '🛡️',
  'wellbeing': '💛', 'mental-health': '💛', 'body-image': '💛', 'identity': '💛',
  'screen-habits': '⏰',
  'ai-and-tech': '🤖', 'ai and tech': '🤖', 'ai-technology': '🤖', 'school': '🤖',
  'relationships': '🤝',
  'daily-moments': '🏡', 'daily moments': '🏡',
}
// Keyword to icon, read off the script title, so an everyday battle shows its
// real subject: the console, the toothbrush, the dinner table.
const TITLE_ICON: [RegExp, string][] = [
  [/bed|sleep|night|bath/i, '🌙'],
  [/teeth|brush/i, '🪥'],
  [/morning|wake|get up/i, '🌅'],
  [/tv|telly|watch|video|youtube/i, '📺'],
  [/dinner|meal|eat|food|table|snack/i, '🍽️'],
  [/dress|clothes|uniform|getting dressed/i, '👕'],
  [/school|drop off|pick ?up|homework|bag/i, '🎒'],
  [/console|gaming|game|xbox|playstation|fortnite|roblox|minecraft/i, '🎮'],
  [/phone|device|tablet|ipad|first (device|screen)/i, '📱'],
  [/stranger|online|scam|safe|predator/i, '🛡️'],
  [/screen ?time|screens|more screen/i, '⏰'],
  [/social|friend|message|chat|group/i, '💬'],
  [/ai|deepfake|robot|fake|real/i, '🤖'],
  [/money|spend|buy|purchase|skin/i, '💷'],
  [/bored|boring|nothing to do/i, '🎨'],
]
function scriptEmoji(category: string, title: string): string {
  const t = (title ?? '').toLowerCase()
  const byTitle = TITLE_ICON.find(([re]) => re.test(t))
  if (byTitle) return byTitle[1]
  return CATEGORY_EMOJI[(category ?? '').toLowerCase()] ?? '💬'
}

const STAGE_META = {
  foundation:  { num: 1, label: 'Foundation',  ages: 'Ages 4 to 7',       color: 'var(--ink)', bg: 'var(--stage-1)' },
  builder:     { num: 2, label: 'Builder',     ages: 'Ages 8 to 10',      color: 'var(--ink)', bg: 'var(--stage-2)' },
  explorer:    { num: 3, label: 'Explorer',    ages: 'Ages 11 to 13',     color: 'var(--ink)', bg: 'var(--stage-3)' },
  shaper:      { num: 4, label: 'Shaper',      ages: 'Ages 13 to 15',     color: 'var(--ink)', bg: 'var(--stage-4)' },
  independent: { num: 5, label: 'Independent', ages: 'Ages 16 and above', color: 'var(--ink)', bg: 'var(--stage-5)' },
} as const

type StageId = keyof typeof STAGE_META

type ScriptRow = {
  id: string
  stage_id: StageId
  title: string
  situation: string
  category: string
  is_free: boolean
  sort_order: number
}

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

export default async function ScriptsPage({ searchParams }: { searchParams: Promise<{ topic?: string; cat?: string; stage?: string; from?: string; q?: string; child?: string }> }) {
  const { topic, cat, stage, from, q, child: childParam } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { child }, { data: scriptsData }, { data: completions }] = await Promise.all([
    supabase.from('profiles').select('subscription_status, trial_ends_at, onboarding_answers').eq('id', user.id).single(),
    // The child's stage decides which scripts lead the page, so this has to be
    // the child the parent chose. Justin: "scripts page for all children with
    // toggle." It read the primary child, so switching to the six year old left
    // the teenager's scripts on top.
    getChildren<{ id: string; stage_id: string | null; is_primary: boolean | null }>(
      supabase, user.id, childParam, 'stage_id'),
    supabase.from('scripts').select('id, stage_id, title, situation, category, is_free, sort_order').order('sort_order', { ascending: true }),
    supabase.from('script_completions').select('script_sort_order, completed_at, status').eq('user_id', user.id),
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
  const withChild = (href: string) =>
    childQS ? `${href}${href.includes('?') ? '&' : '?'}child=${childQS}` : href

  // Handoff from a moment card: when the deck sends the parent here with a
  // topic, the scripts for that exact moment lead the page as the yellow Good
  // Inside numbered list, so the loop closes on the relevant words, not a
  // browse. Falls back silently to the normal page when nothing matches.
  const topicKey = topic ? decodeURIComponent(topic).toLowerCase().trim() : null
  // Match the moment's category to the scripts, tolerant of small taxonomy
  // differences (a moment tagged sibling_conflict still finds sibling scripts),
  // so the handoff reliably lands the relevant words rather than nothing.
  const topicScripts = topicKey
    ? scripts.filter(s => {
        const c = (s.category ?? '').toLowerCase().trim()
        if (!c) return false
        return c === topicKey || (topicKey.length >= 4 && (c.includes(topicKey) || topicKey.includes(c)))
      })
    : []
  const topicLabel = topicKey ? (CATEGORY_META[topicKey]?.label ?? topicKey.replace(/_/g, ' ')) : null

  // The recommendation is about THIS child: their stage, and since 20 August
  // 2026 their own concerns and check ins too, so switching the pills changes
  // the pick rather than only the shelf it sits on.
  const recommended = currentStageId
    ? await getRecommendedScript(supabase, user.id, currentStageId, challenge ?? null, { preferFree: !isPaid, childId: child?.id ?? null })
    : null

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

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>
      {cameFromPathway && (
        <Link href={PATHWAY_HREF} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', textDecoration: 'none', marginBottom: 14 }}>
          ← Back to the pathway
        </Link>
      )}
      <div style={{ marginBottom: '24px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Conversation tools</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px' }}>Scripts</h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-md)' }}>
          What to say, what not to say, and why it works. Scripts for real moments, not perfect families.
        </p>
      </div>

      {/* Find my script: search all the scripts in plain words, and if there is
          no fit, ask DiGi and it lands in the founder insights to be written. */}
      {/* Seeded from DiGi's "scripts for moments like this", which used to
          drop a parent at the top of a library of 236 with the question they
          had just asked left behind. Capped at a sentence: this is a search
          box, not a transcript. */}
      <ScriptFinder
        scripts={scripts.map(s => ({ sort_order: s.sort_order, title: s.title, situation: s.situation, category: s.category, is_free: s.is_free }))}
        isPaid={isPaid}
        initialQuery={(q ?? '').slice(0, 140)}
        childId={childQS}
      />

      {/* The other direction.

          Every tile below this line is a parent opening a conversation. The
          passport review found nothing anywhere running the other way, which is
          the half that decides whether a 16 year old still comes to you. It
          gets a banner rather than a chip because it is not a ninth category,
          it is the other half of the library. */}
      <Link
        href="/dashboard/tell-a-parent"
        style={{ display: 'flex', alignItems: 'center', gap: '13px', textDecoration: 'none', background: 'var(--tint-sage)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '15px 17px', marginBottom: '20px' }}
      >
        <span aria-hidden style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '13px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)' }}>💬</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.2 }}>
            When they come to you
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '2px' }}>
            The words your child has, and the promise about how you will react
          </span>
        </span>
        <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', color: 'var(--ink-muted)' }}>›</span>
      </Link>

      {/* Handoff from a moment card: the scripts for that exact moment lead, as
          the butter Good Inside numbered list, so the deck closes on the words.
          Butter and gold, never lavender: this is the Good Inside "4 Scripts"
          sheet in our own palette. Each script is its own soft butter pill with
          a gold number, and the type sits at reading size, matching the daily
          deck cards, so the words carry the same weight on screen as on paper. */}
      {topicScripts.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <div style={{ background: 'var(--terracotta)', borderRadius: '18px', padding: '16px 20px 14px', marginBottom: '12px', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--stage-1-text)', marginBottom: '4px' }}>
              {topicScripts.length} script{topicScripts.length > 1 ? 's' : ''} for this moment
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.12, letterSpacing: '-0.02em', textTransform: 'capitalize' }}>
              {topicLabel}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topicScripts.map((script, i) => {
              const isDone = completedOrders.has(script.sort_order)
              // Locked is now simply not a member. See migration 187: there is
              // no free tier left for is_free to open, and the row itself is
              // gone for a non member anyway, because this page reads through
              // the parent's own session and the policy hides it. Belt and
              // braces on purpose, so the list cannot ever render a tile the
              // database would refuse to open.
              const isLocked = !isPaid
              return (
                <Link
                  key={script.id}
                  href={isLocked ? '/dashboard/upgrade' : withChild(`/dashboard/scripts/${script.sort_order}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px 18px', textDecoration: 'none', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '18px' }}
                >
                  <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: '50%', background: 'var(--terracotta)', color: 'var(--stage-1-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)' }}>
                    {i + 1}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.25, letterSpacing: '-0.01em' }}>{script.title}</span>
                    <span style={{ display: 'block', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '3px' }}>{script.situation}</span>
                  </span>
                  <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--terracotta-dark)' }}>{isDone ? '✓' : isLocked ? '🔒' : '›'}</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {recommended && (
        <Link
          href={withChild(`/dashboard/scripts/${recommended.sort_order}`)}
          style={{ textDecoration: 'none', display: 'block', marginBottom: '20px' }}
        >
          <div style={{ background: 'var(--terracotta)', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: '6px' }}>
              Recommended next
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: '#fff', marginBottom: '4px' }}>
              {recommended.title}
            </div>
            <div style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
              {recommended.situation}
            </div>
            {/* Why this one, in a line a parent can check against their own
                week. A recommendation that cannot say why it is here is
                indistinguishable from the next row down. */}
            {recommended.reason && (
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.92)', fontWeight: 700, marginTop: '9px' }}>
                {recommended.reason}
              </div>
            )}
          </div>
        </Link>
      )}

      {/* The four days are up. This card used to be the free plan's weekly
          allowance with a progress bar, which is the thing that no longer
          exists, so it said a parent had free scripts waiting that they did
          not. What it has to do now is name the deadline that has passed and
          say plainly what a membership opens.

          NOT AN APOLOGY AND NOT A WALL WITH NOTHING BEHIND IT. The daily path,
          the jobs, the stars and the printables all keep working without a
          membership, and saying so is the difference between a parent who
          upgrades later and one who stops opening the app. */}
      {!isPaid && (
        <div style={{ background: 'var(--stage-5)', border: '2px solid var(--stage-5)', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--terracotta)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your free days are up</span>
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', marginTop: '4px', fontWeight: 600 }}>
                Every script is part of the membership now. All {scripts.length} of them, the exact words for the conversations that are coming, and DiGi whenever you want them rewritten for your own child.
              </p>
            </div>
            <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ flexShrink: 0, padding: '10px 20px', fontSize: 'var(--text-base)' }}>
              Unlock all
            </Link>
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            Your daily path on the Home tab keeps going either way. The jobs, the stars, the five a day and the printables do not need a membership and never will, so keep that going whatever you decide about the rest.
          </p>
        </div>
      )}

      {/* THE CHIP ROW.

          Justin: "is there a better way of showing so many? Could we have tabs
          for each category rather than fill the whole page?"

          Chips rather than tabs, and that is a measured choice rather than a
          preference. Mobbin, pulled before building: Alan, Formula 1, Moonly
          and Nibble all use a scrolling chip row for a topic library of this
          size. The one that uses tabs, Tonal, has four. Tabs stop working past
          about five because the labels truncate and you cannot see what you are
          not looking at. We have eight.

          Links, not buttons. The whole page stays a server component, so there
          is no client state to hydrate, it works before JavaScript arrives, and
          a filtered view has a URL a parent can bookmark or you can send. */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16,
        // The row runs to the screen edge rather than stopping inside the
        // padding, which is what tells a thumb there is more to the right.
        marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20,
        scrollbarWidth: 'none',
      }}>
        {[{ key: null as string | null, label: 'All', n: scripts.length }, ...chips].map(c => {
          const on = activeCat === c.key
          return (
            <Link
              key={c.key ?? 'all'}
              href={withChild(c.key ? `/dashboard/scripts?cat=${c.key}` : '/dashboard/scripts')}
              scroll={false}
              style={{
                flexShrink: 0, textDecoration: 'none', borderRadius: 100,
                padding: '9px 15px', whiteSpace: 'nowrap',
                background: on ? 'var(--terracotta)' : '#fff',
                border: `1.5px solid ${on ? 'var(--terracotta-dark)' : 'var(--border)'}`,
                boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : 'none',
                fontFamily: 'var(--font-display)', fontWeight: on ? 800 : 700,
                fontSize: 'var(--text-base)', color: 'var(--ink)',
              }}
            >
              {c.label}
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                marginLeft: 7, color: on ? 'var(--ink)' : 'var(--ink-muted)',
              }}>{c.n}</span>
            </Link>
          )
        })}
      </div>

      {activeCat && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 16px' }}>
          {CATEGORY_META[activeCat].description}
        </p>
      )}

      {/* Arrived from the road, so say what is being shown and what moves the
          pathway on.

          The second half is the other thing Justin hit: "it doesn't update if I
          read it." Opening a script has counted for nothing on the passport
          since migration 157, on purpose, because a parent who scrolls through
          ten scripts has not had ten conversations. That is the right rule and
          it was never said out loud anywhere, so the only way to learn it was to
          read a script, go back, and find nothing had moved. */}
      {askedStage && (
        <div style={{ background: 'var(--tint-sage)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '14px 16px', marginBottom: 18 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 4px' }}>
            {STAGE_META[askedStage].label}, {STAGE_META[askedStage].ages.toLowerCase()}
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            Your pathway fills in as you read these. Reach the end of one and it counts. Tell us you used it, or that it does not apply, and it counts for more, because the conversation is the thing and only you can tell us it happened.
          </p>
          <Link href={withChild('/dashboard/scripts')} style={{ display: 'inline-block', marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
            See every stage →
          </Link>
        </div>
      )}

      {byStage.length === 0 && (
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 24px' }}>
          Nothing in that one yet. Try another, or search above for the moment you are actually in.
        </p>
      )}

      {/* THEIR STAGE IS OPEN, THE OTHER FOUR ARE FOLDED.

          The chips alone would not have fixed "it fills the whole page",
          because All is still 233 tiles. A parent is nearly always after a
          script for the child they have, so their own stage stays open and the
          rest fold to one line each with a count.

          A native details element, so this costs no JavaScript, survives a
          bad connection, and Ctrl F still finds a title inside a closed one in
          most browsers. Nothing is hidden, it is stacked. */}
      {byStage.map(group => {
        // Open for their own stage, and open for the stage the pathway asked
        // for. Without the second half, tapping "the words for this stage" on a
        // stage that is not the child's own landed on a single folded row: the
        // filter worked and the page still looked like it had done nothing.
        const isTheirs = group.stageId === currentStageId || group.stageId === askedStage
        const header = (
          <span style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: group.meta.color, background: group.meta.bg,
              padding: '4px 10px', borderRadius: '100px',
            }}>
              Stage {group.meta.num}: {group.meta.label}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {group.meta.ages}
            </span>
            {!isTheirs && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
                {group.items.length} script{group.items.length === 1 ? '' : 's'}
              </span>
            )}
          </span>
        )
        const tiles = (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
            {group.items.map(script => {
              const isDone = completedOrders.has(script.sort_order)
              // Locked is now simply not a member. The weekly free allowance
              // this used to consult is gone with migration 187.
              const isLocked = !isPaid
              const cat = CATEGORY_META[script.category]
              return (
                <BrowseTile
                  key={script.id}
                  href={isLocked ? '/dashboard/upgrade' : withChild(`/dashboard/scripts/${script.sort_order}`)}
                  stageNum={group.meta.num}
                  title={script.title}
                  sub={cat?.label ?? script.category}
                  emoji={scriptEmoji(script.category, script.title)}
                  coverUrl={momentImageForTitle(script.title)}
                  done={isDone}
                  locked={isLocked}
                />
              )
            })}
          </div>
        )
        // Big pastel browse tiles, the Good Inside Discover pattern.
        return isTheirs ? (
          <section key={group.stageId} style={{ marginBottom: '28px' }}>
            <div style={{ marginBottom: '12px' }}>{header}</div>
            {tiles}
          </section>
        ) : (
          <details key={group.stageId} style={{ marginBottom: '14px' }}>
            <summary style={{
              cursor: 'pointer', listStyle: 'none', padding: '11px 14px',
              background: '#fff', border: '1.5px solid var(--border)', borderRadius: 14,
            }}>
              {header}
            </summary>
            <div style={{ marginTop: 12 }}>{tiles}</div>
          </details>
        )
      })}

      {!isPaid && (
        <div style={{
          background: 'var(--cream)', border: '2px dashed var(--border)',
          borderRadius: '16px', padding: '24px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 'var(--text-xl)', marginBottom: '12px' }}>🔒</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: '8px' }}>
            The full library of 100 plus scripts is unlocked with membership
          </div>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: '16px' }}>
            Every stage from 4 to 16. Gaming, safety, social media, AI, body image, sleep, and the hard moments in between.
          </p>
          <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-flex' }}>
            Unlock all scripts
          </Link>
        </div>
      )}
    </div>
  )
}
