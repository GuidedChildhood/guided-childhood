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
import { DEVICE_ISSUES } from '@/lib/content/device-issues'
import { categoryForConcern } from '@/lib/content/signal-map'

export type TonightPlan = {
  /** The mechanism confirmed: bedtime, timer, words, morning, gaming, phone. */
  key: 'bedtime' | 'timer' | 'words' | 'morning' | 'gaming' | 'phone'
  /** The rung's label on the road. */
  label: string
  /** One plain sentence saying what is on tonight. */
  line: string
  /** Where the mechanism lives, for the parent who wants to change it. */
  href: string
  /** The words for the button that goes there. */
  hrefLabel: string
  /** Anything else the step leans on, shown as quieter links under the button. */
  more?: { href: string; label: string }[]
}

// ── THE FIRST PHONE: ITS OWN STEP, NOT THE BEDTIME ONE ──────────────────────
//
// Review board, 13 October 2026: phones-and-messaging shared the bedtime case,
// so a parent whose child does not have a phone yet was told "Phones to bed"
// and "the device charges outside the bedroom". Asking for a phone is the
// second most common worry named at signup, and for most of those families
// the phone is still an idea, not an object.
//
// So when the child has no phone of their own on the devices list, the step
// is the conversation: the phone plan script (the words for when they ask),
// the phone ladder (what phone, at what age) and the family phone agreement
// (the thing they sign together). A child who already has one keeps the
// bedtime step, because then the charging spot really is tonight's job.
//
// The title is a real row (supabase/migrations/261_situations_scripts.sql,
// family rules, free); scripts/check-concern-loop.mjs fails if it is not in
// the seeds. The script itself lives in the database, as every script does.
export const PHONE_PLAN_SCRIPT = 'The Year 6 phone plan, before the box is opened'
export const PHONE_LADDER_HREF = '/dashboard/phone-setup'
export const PHONE_AGREEMENT_HREF = '/dashboard/printables#family-phone-agreement'

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
  /** Does this child have a phone of their own on the devices list. */
  hasOwnPhone?: boolean
  /**
   * Where Read the words goes: this worry's own script when the reader found
   * one, else its shelf. Falls back to scriptHref when neither is known.
   */
  wordsHref?: string | null
}): TonightPlan | null {
  const { slug, childName: kid, bedtimeStartMin, deviceTrust, blocksScreensJob, timerHref } = input
  if (!slug) return null
  const scriptHref = input.wordsHref ?? input.scriptHref
  const bed = clockLabel(bedtimeStartMin)
  const before = blocksScreensJob ? ` ${blocksScreensJob} comes before screens.` : ''

  if (slug === 'phones-and-messaging' && !input.hasOwnPhone) {
    return {
      key: 'phone',
      label: 'The first phone',
      line: `If ${kid} asks about a phone tonight, the answer is a plan, never a flat no. Ask where they think a phone should charge at night and why. Whatever they say, you have started planning it together.`,
      href: scriptHref,
      hrefLabel: 'Read the words',
      more: [
        { href: PHONE_LADDER_HREF, label: 'What phone, at what age' },
        { href: PHONE_AGREEMENT_HREF, label: 'The family phone agreement' },
      ],
    }
  }

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

// ── READ THE WORDS GOES TO THIS WORRY'S WORDS ───────────────────────────────
//
// Review board, 13 October 2026 (tonight-tap-closes-loop): Read the words on
// Tonight opened the whole scripts index, 335 rows, under a promise of the
// words for tonight. It now opens the script for the worry the step is about.
//
// Which script is an editorial judgement already made once: the device issues
// table names, for each concern slug it tracks, the exact script titles that
// answer it, checked against the seeds by scripts/check-device-issues.mjs. The
// issues that peak at this child's age come first, then the rest, each in the
// table's own order. The first title that is a real row wins. A worry with no
// issue goes to its category shelf, and only a worry with neither falls back
// to the index.
export function worryScriptTitles(slug: string, ageBand?: string | null): string[] {
  const issues = DEVICE_ISSUES.filter(i => i.proof.concernSlug === slug)
  const fits = (i: (typeof issues)[number]) => !!ageBand && (i.bands as string[]).includes(ageBand)
  const ordered = [...issues.filter(fits), ...issues.filter(i => !fits(i))]
  return [...new Set(ordered.flatMap(i => i.proof.scripts))]
}

/**
 * The live worry Tonight is about: open beats improving, then the one flagged
 * most. Shared by the page and the one tap, so the tap is written against the
 * same worry the parent was shown.
 */
export function pickTopConcern<T extends { status: string; times_flagged: number | null }>(concerns: T[]): T | null {
  return [...concerns].sort((a, b) =>
    Number(b.status === 'open') - Number(a.status === 'open') || (b.times_flagged ?? 0) - (a.times_flagged ?? 0),
  )[0] ?? null
}

export async function readTopConcern(
  supabase: Client,
  userId: string,
  childId: string,
): Promise<{ id: string; slug: string } | null> {
  const { data } = await supabase.from('concerns').select('id, slug, status, times_flagged')
    .eq('user_id', userId).eq('child_id', childId).in('status', ['open', 'improving']).limit(50)
  const top = pickTopConcern((data ?? []) as { id: string; slug: string; status: string; times_flagged: number | null }[])
  return top ? { id: top.id, slug: top.slug } : null
}

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
  const [top, childRes, jobRes, settings, phoneRes] = await Promise.all([
    readTopConcern(supabase, userId, child.id),
    supabase.from('children').select('device_trust').eq('id', child.id).maybeSingle(),
    supabase.from('family_quests').select('title')
      .eq('user_id', userId).eq('active', true).eq('blocks_screens', true)
      .or(`child_id.eq.${child.id},child_id.is.null`).limit(1),
    getTimeSettings(supabase, userId, [{ id: child.id, age_band: child.age_band ?? null }]).catch(() => new Map()),
    // A phone of their own: on the list, this child's, not retired. A shared
    // house phone is nobody's first phone.
    supabase.from('family_devices').select('id')
      .eq('user_id', userId).eq('child_id', child.id).eq('kind', 'phone').eq('shared', false).is('retired_at', null).limit(1),
  ])
  const kidName = child.name && child.name !== 'Your child' ? child.name : 'your child'
  const withChild = (href: string) => `${href}${href.includes('?') ? '&' : '?'}child=${child.id}`
  const hasOwnPhone = (phoneRes.data ?? []).length > 0

  // The words for this worry. Scripts are addressed by sort_order
  // (app/(dashboard)/dashboard/scripts/[id]), so one read turns the titles
  // into a link; a title that is not a row is skipped, never linked dead.
  let wordsHref: string | null = null
  if (top) {
    const firstPhone = top.slug === 'phones-and-messaging' && !hasOwnPhone
    const titles = firstPhone ? [PHONE_PLAN_SCRIPT] : worryScriptTitles(top.slug, child.age_band)
    if (titles.length) {
      const { data: rows } = await supabase.from('scripts').select('title, sort_order').in('title', titles)
      const order = new Map(((rows ?? []) as { title: string; sort_order: number | null }[]).map(r => [r.title, r.sort_order]))
      const hit = titles.map(t => order.get(t)).find(o => typeof o === 'number' && o > 0)
      if (hit) wordsHref = withChild(`/dashboard/scripts/${hit}`)
    }
    if (!wordsHref) {
      const shelf = categoryForConcern(top.slug)
      if (shelf) wordsHref = withChild(`/dashboard/scripts/category/${shelf}`)
    }
  }
  return tonightFor({
    slug: top?.slug ?? null,
    childName: kidName,
    bedtimeStartMin: settings.get(child.id)?.bedtimeStartMin ?? null,
    deviceTrust: ((childRes.data as { device_trust?: string | null } | null)?.device_trust) ?? null,
    blocksScreensJob: ((jobRes.data ?? [])[0] as { title?: string } | undefined)?.title ?? null,
    scriptHref,
    timerHref: withChild('/dashboard/quests/timer'),
    hasOwnPhone,
    wordsHref,
  })
}
