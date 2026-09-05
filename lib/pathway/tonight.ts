// The Tonight rung: the one live mechanism for the child's top worry, named
// on the road so a connect day asks for one action, not three reflections.
//
// Justin, 5 September 2026, after the daily loop review: "let's build 1 to
// 3." Number one was this. The fight is at 8pm and the road opened with the
// check in, the moment and the script before anything touched it. Now the
// second rung on a connect day says what is ON tonight for this child, from
// the worry they named and the settings they already have: the bedtime window,
// the ask first rule on the timer, the words for the mood after screens.
//
// Pure in the first half so a fixture and a test can run it; the reader in
// the second half does the three small reads it needs.

import type { SupabaseClient } from '@supabase/supabase-js'
import { getTimeSettings } from '@/lib/quests/time-tiers'

export type TonightPlan = {
  /** The mechanism confirmed: bedtime, timer, words, morning, gaming. */
  key: 'bedtime' | 'timer' | 'words' | 'morning' | 'gaming'
  /** The rung's label on the road. */
  label: string
  /** One plain sentence saying what is on tonight. */
  line: string
  /** Where the mechanism lives, for the parent who wants to change it. */
  href: string
  /** The words for the button that goes there. */
  hrefLabel: string
}

/** 20:00 to "8pm", 19:30 to "7.30pm". Minutes past midnight in. */
export function clockLabel(min: number | null): string | null {
  if (min === null || !Number.isFinite(min)) return null
  const h24 = Math.floor(min / 60) % 24
  const m = min % 60
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  const suffix = h24 < 12 ? 'am' : 'pm'
  return m === 0 ? `${h}${suffix}` : `${h}.${String(m).padStart(2, '0')}${suffix}`
}

export function tonightFor(input: {
  slug: string | null
  childName: string
  bedtimeStartMin: number | null
  deviceTrust: string | null
  blocksScreensJob: string | null
  scriptHref: string
  timerHref: string
}): TonightPlan | null {
  const { slug, childName: kid, bedtimeStartMin, deviceTrust, blocksScreensJob, scriptHref, timerHref } = input
  if (!slug) return null
  const bed = clockLabel(bedtimeStartMin)
  const before = blocksScreensJob ? ` ${blocksScreensJob} comes before screens.` : ''

  switch (slug) {
    case 'bedtime-screens':
    case 'phones-and-messaging':
      return {
        key: 'bedtime',
        label: 'Phones to bed',
        line: bed
          ? `Screens rest from ${bed} tonight, and ${kid}'s device charges outside the bedroom. If they ask after that, it comes to you, never a flat no.`
          : `Set ${kid}'s bedtime window once and the timer keeps it every night. Tonight the device charges outside the bedroom.`,
        href: timerHref,
        hrefLabel: bed ? 'Change the window' : 'Set the window',
      }
    case 'wont-put-down':
      return {
        key: 'timer',
        label: 'The timer',
        line: deviceTrust === 'ask' || !deviceTrust
          ? `Every screen goes through the timer tonight, and ${kid} asks you first. The stars decide how long, the timer decides when it ends.${before}`
          : `Every screen goes through the timer tonight, and it winds up at the healthy amount for ${kid}'s age.${before}`,
        href: timerHref,
        hrefLabel: 'Open the timer',
      }
    case 'mood-after-screens':
      return {
        key: 'words',
        label: "Tonight's words",
        line: `After screens tonight: notice the mood, name it without a verdict, and use the words. Track the pattern, not the moment.`,
        href: scriptHref,
        hrefLabel: 'Read the words',
      }
    case 'morning-tv':
      return {
        key: 'morning',
        label: 'Tomorrow morning',
        line: `Set tomorrow up tonight: dressed and breakfast first, then the screen. Said once at bedtime, so the morning has no decision to argue about.`,
        href: scriptHref,
        hrefLabel: 'Read the words',
      }
    case 'controller-fights':
      return {
        key: 'gaming',
        label: 'The end of the game',
        line: `Agree the stop before the game starts tonight: end of the round, then the controller goes down. The timer says when, so you do not have to.${before}`,
        href: timerHref,
        hrefLabel: 'Open the timer',
      }
    default:
      return {
        key: 'words',
        label: "Tonight's words",
        line: `One conversation tonight, with the words ready before it starts. Ten seconds to read, and it works when you hold it warmly.`,
        href: scriptHref,
        hrefLabel: 'Read the words',
      }
  }
}

type Client = Pick<SupabaseClient, 'from'>

/**
 * The plan for one child, read from what the family already has: their top
 * live worry, their bedtime window, their trust level and any job that
 * comes before screens. Null when there is no live worry, so the rung stays
 * off the road rather than inventing a task.
 */
export async function readTonight(
  supabase: Client,
  userId: string,
  child: { id: string; name?: string | null; age_band?: string | null },
  scriptHref: string,
): Promise<TonightPlan | null> {
  const [concernsRes, childRes, jobRes, settings] = await Promise.all([
    supabase.from('concerns').select('slug, status, times_flagged')
      .eq('user_id', userId).eq('child_id', child.id).in('status', ['open', 'improving']).limit(50),
    supabase.from('children').select('device_trust').eq('id', child.id).maybeSingle(),
    supabase.from('family_quests').select('title')
      .eq('user_id', userId).eq('active', true).eq('blocks_screens', true)
      .or(`child_id.eq.${child.id},child_id.is.null`).limit(1),
    getTimeSettings(supabase, userId, [{ id: child.id, age_band: child.age_band ?? null }]).catch(() => new Map()),
  ])
  const concerns = (concernsRes.data ?? []) as { slug: string; status: string; times_flagged: number | null }[]
  // Open beats improving, then the one flagged most.
  const top = [...concerns].sort((a, b) =>
    Number(b.status === 'open') - Number(a.status === 'open') || (b.times_flagged ?? 0) - (a.times_flagged ?? 0),
  )[0] ?? null
  const kidName = child.name && child.name !== 'Your child' ? child.name : 'your child'
  const withChild = (href: string) => `${href}${href.includes('?') ? '&' : '?'}child=${child.id}`
  return tonightFor({
    slug: top?.slug ?? null,
    childName: kidName,
    bedtimeStartMin: settings.get(child.id)?.bedtimeStartMin ?? null,
    deviceTrust: ((childRes.data as { device_trust?: string | null } | null)?.device_trust) ?? null,
    blocksScreensJob: ((jobRes.data ?? [])[0] as { title?: string } | undefined)?.title ?? null,
    scriptHref,
    timerHref: withChild('/dashboard/quests/timer'),
  })
}
