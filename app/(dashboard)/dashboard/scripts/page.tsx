import { createClient } from '@/lib/supabase/server'
import { hasFullAccess } from '@/lib/access'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BrowseTile from '@/components/ui/BrowseTile'
import { CHALLENGE_TO_CATEGORY } from '@/lib/content/challenge-map'
import { momentImageForTitle } from '@/lib/content/moment-images'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import type { ChallengeId } from '@/lib/content/stages'
import ScriptFinder from '@/components/scripts/ScriptFinder'

export const CATEGORY_META: Record<string, {
  label: string
  description: string
  bg: string
  border: string
  accent: string
}> = {
  'first-device':  { label: 'First Device',  description: 'Setting the right foundations before and after the first screen arrives.', bg: 'var(--stage-1)',  border: 'var(--stage-1)',  accent: 'var(--terracotta)' },
  'social-media':  { label: 'Social Media',  description: 'Navigating platforms, algorithms, and identity with your child.',          bg: 'var(--stage-3)', border: 'var(--stage-3)',    accent: 'var(--terracotta)' },
  'gaming':        { label: 'Gaming',        description: 'Healthy gaming conversations without the battle.',                          bg: 'var(--stage-2)',      border: 'var(--stage-2)',    accent: 'var(--terracotta)' },
  'safety':        { label: 'Safety',        description: 'What to say when something goes wrong online.',                            bg: 'var(--stage-4)',  border: 'var(--stage-4)',    accent: 'var(--terracotta)' },
  'wellbeing':     { label: 'Wellbeing',     description: 'Mood, sleep, body image, and the digital connection.',                    bg: 'var(--stage-4)',     border: 'var(--stage-4)',    accent: 'var(--terracotta)' },
  'screen-habits': { label: 'Screen Habits', description: 'Building routines that work for your whole family.',                      bg: 'var(--stage-1)',  border: 'var(--stage-1)',    accent: 'var(--terracotta)' },
  'ai-and-tech':   { label: 'AI and Tech',   description: 'Deepfakes, AI tools, and what digital literacy actually looks like.',     bg: 'var(--stage-5)',      border: 'var(--stage-5)',    accent: 'var(--terracotta)' },
  'relationships': { label: 'Relationships', description: 'Trust, independence, and keeping the conversation open.',                 bg: 'var(--stage-3)',    border: 'var(--stage-3)',    accent: 'var(--terracotta)' },
}

// A contextual icon per script, so a card shows what it is about at a glance
// instead of a generic quote mark. The title wins first (the moment it names),
// then the category, then a warm talk bubble, never a bare quote glyph. Where
// a title matches one of our Higgsfield moment illustrations, the card shows
// that drawn art through BrowseTile's coverUrl instead of an emoji.
const CATEGORY_EMOJI: Record<string, string> = {
  'first-device': '📱', 'first device': '📱',
  'social-media': '💬', 'social media': '💬',
  'gaming': '🎮', 'games': '🎮',
  'safety': '🛡️', 'online-safety': '🛡️', 'online safety': '🛡️',
  'wellbeing': '💛',
  'screen-habits': '⏰', 'screen-time': '⏰', 'screen time': '⏰',
  'ai-and-tech': '🤖', 'ai and tech': '🤖',
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

export default async function ScriptsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: child }, { data: scriptsData }, { data: completions }] = await Promise.all([
    supabase.from('profiles').select('subscription_status, trial_ends_at, onboarding_answers').eq('id', user.id).single(),
    supabase.from('children').select('stage_id').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
    supabase.from('scripts').select('id, stage_id, title, situation, category, is_free, sort_order').order('sort_order', { ascending: true }),
    supabase.from('script_completions').select('script_sort_order, completed_at').eq('user_id', user.id),
  ])

  const isPaid = hasFullAccess(profile, user.email)
  const scripts = (scriptsData ?? []) as ScriptRow[]
  const completedOrders = new Set((completions ?? []).map(c => c.script_sort_order))
  const challenge = (profile?.onboarding_answers as Record<string, string> | null)?.challenge as ChallengeId | undefined
  const matchCategory = challenge ? CHALLENGE_TO_CATEGORY[challenge] : null
  const currentStageId = (child?.stage_id as StageId) ?? null

  const recommended = currentStageId
    ? await getRecommendedScript(supabase, user.id, currentStageId, challenge ?? null, { preferFree: !isPaid })
    : null

  const byStage = (Object.keys(STAGE_META) as StageId[]).map(stageId => {
    const items = scripts.filter(s => s.stage_id === stageId)
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

  // The promise is 5 free scripts, but is_free marks every script that is
  // ELIGIBLE to be a free read (dozens, spanning every panic moment), not
  // a personal allowance. Counting the flag itself never changed as this
  // parent read more, which is the "stuck at some big number, never
  // updates" bug. The real, personal, moving number is how many DISTINCT
  // free scripts THIS parent has actually opened so far.
  // A weekly renewing allowance, not a lifetime cap: only free scripts
  // opened in the last seven days count against the week, and every one
  // already opened stays open forever. The ceiling refreshes, never walls.
  const FREE_SCRIPTS_PER_WEEK = 2
  const weekAgoIso = new Date(Date.now() - 7 * 86400000).toISOString()
  const freeScriptOrders = new Set(scripts.filter(s => s.is_free).map(s => s.sort_order))
  const freeScriptsReadCount = (completions ?? []).filter(c => freeScriptOrders.has(c.script_sort_order) && String(c.completed_at) >= weekAgoIso).length
  const freeScriptsLeft = Math.max(0, FREE_SCRIPTS_PER_WEEK - freeScriptsReadCount)
  const freeAllowanceUsedUp = !isPaid && freeScriptsReadCount >= FREE_SCRIPTS_PER_WEEK

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Conversation tools</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px' }}>Scripts</h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
          What to say, what not to say, and why it works. Scripts for real moments, not perfect families.
        </p>
      </div>

      {/* Find my script: search all the scripts in plain words, and if there is
          no fit, ask DiGi and it lands in the founder insights to be written. */}
      <ScriptFinder
        scripts={scripts.map(s => ({ sort_order: s.sort_order, title: s.title, situation: s.situation, category: s.category, is_free: s.is_free }))}
        isPaid={isPaid}
      />

      {recommended && (
        <Link
          href={`/dashboard/scripts/${recommended.sort_order}`}
          style={{ textDecoration: 'none', display: 'block', marginBottom: '20px' }}
        >
          <div style={{ background: 'var(--terracotta)', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: '6px' }}>
              {recommended.matchesChallenge ? 'Recommended next, matches what you told us' : 'Recommended next'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: '#fff', marginBottom: '4px' }}>
              {recommended.title}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
              {recommended.situation}
            </div>
          </div>
        </Link>
      )}

      {!isPaid && (
        <div style={{ background: 'var(--stage-5)', border: '2px solid var(--stage-5)', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--terracotta)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Free plan</span>
              <p style={{ fontSize: '14px', color: 'var(--ink)', marginTop: '4px', fontWeight: 600 }}>
                {freeAllowanceUsedUp
                  ? "That is your free scripts for this week. Fresh ones unlock in a few days, and every one you have opened stays yours to reread."
                  : `${freeScriptsReadCount} of ${FREE_SCRIPTS_PER_WEEK} free scripts this week, ${freeScriptsLeft} left. They refresh every week.`}
              </p>
            </div>
            <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ flexShrink: 0, padding: '10px 20px', fontSize: '12px' }}>
              Unlock all
            </Link>
          </div>
          <div style={{ height: '8px', borderRadius: '8px', background: 'rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{ height: '100%', borderRadius: '8px', background: 'var(--terracotta)', width: `${Math.min(100, (freeScriptsReadCount / FREE_SCRIPTS_PER_WEEK) * 100)}%`, transition: 'width 0.4s ease' }} />
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            Scripts are one part of it. Your daily path on the Home tab, a moment card, a check in, and a few free DiGi messages, never runs out and never needs membership. That is where the everyday habit lives, keep that going regardless.
          </p>
        </div>
      )}

      {byStage.map(group => (
        <section key={group.stageId} style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: group.meta.color, background: group.meta.bg,
              padding: '4px 10px', borderRadius: '100px',
            }}>
              Stage {group.meta.num}: {group.meta.label}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {group.meta.ages}
            </span>
          </div>

          {/* Big pastel browse tiles, the Good Inside Discover pattern. */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
            {group.items.map(script => {
              const isDone = completedOrders.has(script.sort_order)
              // A free script already opened stays open forever. A free
              // script never opened locks once the 5 are used up, same as
              // a script that was never flagged free at all.
              const isLocked = !isPaid && !isDone && (!script.is_free || freeAllowanceUsedUp)
              const cat = CATEGORY_META[script.category]
              return (
                <BrowseTile
                  key={script.id}
                  href={isLocked ? '/dashboard/upgrade' : `/dashboard/scripts/${script.sort_order}`}
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
        </section>
      ))}

      {!isPaid && (
        <div style={{
          background: 'var(--cream)', border: '2px dashed var(--border)',
          borderRadius: '16px', padding: '24px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>🔒</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
            The full library of 100 plus scripts is unlocked with membership
          </div>
          <p style={{ fontSize: '14px', color: 'var(--ink)', marginBottom: '16px' }}>
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
