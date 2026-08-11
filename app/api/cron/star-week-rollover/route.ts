import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarBanks } from '@/lib/quests/bank'
import { getFamilyRegion } from '@/lib/learning/region'
import { pushToChild } from '@/lib/quests/kid-push'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import {
  previousStarWeekStart,
  MINUTES_PER_STICKER_CREDIT,
} from '@/lib/quests/star-week'

// Monday morning: the week resets, and what a child did not spend becomes theirs
// to keep.
//
// Justin: "any time not used resets each week fresh for a Monday morning ... then
// we have a reward system for unused minutes." And: "let's get unused minutes to
// convert to sticker book."
//
// The reset itself needs no job at all, because spendable stars are COMPUTED from
// the current star week (lib/quests/bank.ts). Monday arrives and the number is
// simply a new week's number. This route exists only for the part that must be
// made permanent before the week rolls out of view: turning what was left over
// into sticker credits.
//
// That ordering matters and is the reason this runs just after midnight rather
// than at some point during Monday. Once the clock passes into the new week the
// old week's leftover is still readable (the bank can be asked for any week), but
// nothing else in the product looks backwards, so the longer this waits the more
// chances there are for a family to log in and see their spare time vanish with
// nothing to show for it.
//
// Idempotent by construction. The unique constraint on (child_id, week_start) in
// migration 124 means a second run, a retry, or a manual kick cannot pay a child
// twice for the same week. That is enforced by the database rather than by this
// code remembering to check, which is the only way it stays true.

export const dynamic = 'force-dynamic'

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  // The week being paid out is the one that just ended, not the one starting.
  const week = previousStarWeekStart()

  const { data: kids } = await admin.from('children').select('id, name, parent_id, age_band')
  if (!kids || kids.length === 0) {
    return NextResponse.json({ ok: true, week, paid: 0, reason: 'no children' })
  }

  // Grouped by parent, because getStarBanks is scoped to one account: it reads
  // family_quests and star_spends by user_id, so asking it for children across
  // accounts in one call would quietly return nothing for most of them.
  const byParent = new Map<string, { id: string; name: string | null; age_band: string | null }[]>()
  for (const k of kids) {
    const list = byParent.get(k.parent_id as string) ?? []
    list.push({ id: k.id as string, name: (k.name as string) ?? null, age_band: (k.age_band as string) ?? null })
    byParent.set(k.parent_id as string, list)
  }

  let paid = 0
  let skipped = 0
  const rows: { user_id: string; child_id: string; credits: number; minutes_unused: number; week_start: string }[] = []
  const tell: { userId: string; childId: string; name: string | null; credits: number }[] = []
  // Surplus banked towards the school holidays. Separate list, because a child
  // can have one, both or neither: unused time and extra work are different
  // things and a week that produced only one of them must still pay that one.
  const holidayRows: { user_id: string; child_id: string; minutes: number; stars: number; week_start: string; source: string; on_date: string }[] = []
  const tellHoliday: { userId: string; childId: string; minutes: number }[] = []

  for (const [userId, list] of byParent) {
    // Asked for the week that has just ended. The weekStart argument exists
    // precisely so a job running after midnight can still see the week it is
    // paying for, rather than reading the empty new one and paying nobody.
    // This family's own school calendar. The weekly ceiling relaxes in a
    // holiday, so pricing a US family's Thanksgiving week against the English
    // term time number would bank the wrong surplus, for ever, with nothing
    // saying so.
    const region = await getFamilyRegion(admin, userId)
    let banks
    try {
      banks = await getStarBanks(admin, userId, list.map(c => c.id), Object.fromEntries(list.map(c => [c.id, c.age_band])), week, region)
    } catch { continue }

    for (const bank of banks) {
      const child = list.find(c => c.id === bank.child_id)
      // What was earned that week and never spent, in minutes. bank.balance is
      // the weekly spendable figure, and asked for a past week it is that week's
      // leftover, which is exactly what converts.
      // Work done beyond what the week could hold, banked for the holidays.
      // Computed before the sticker credit check, because a child who spent
      // every available minute has no unused time but may still have done far
      // more jobs than the cap allowed, and that effort must not be lost just
      // because the other reward did not apply.
      if (bank.weekSurplus > 0) {
        // CAPPED at one day's screen guide for their age, per week. Justin,
        // 11 August 2026, at a bank showing 485 minutes: "way too many
        // holiday minutes." The surplus used to convert whole, so one heavy
        // week banked four hours and the holiday pot quietly became a way
        // around the entire balance system. One extra day's worth is still a
        // real prize for a big week, and it keeps the pot what it was meant
        // to be: a treat, not a second allowance. The guide is holiday aware
        // and by age, so the cap grows up with the child.
        const guide = Math.max(0, recommendedDailyMinutes(child?.age_band ?? null, { on: new Date(`${week}T12:00:00Z`), region }))
        const banked = Math.min(bank.weekSurplus * STAR_MINUTES, guide)
        if (banked > 0) {
          holidayRows.push({
            user_id: userId,
            child_id: bank.child_id,
            minutes: banked,
            stars: Math.round(banked / STAR_MINUTES),
            week_start: week,
            // Both required by the key since migration 137. on_date is the
            // Monday for a rollover, which is what makes "one rollover per child
            // per week" the same guarantee it always was, now said in a way that
            // leaves room for the daily grants beside it.
            source: 'rollover',
            on_date: week,
          })
          tellHoliday.push({ userId, childId: bank.child_id, minutes: banked })
        }
      }

      const unused = bank.balance * STAR_MINUTES
      const credits = Math.floor(unused / MINUTES_PER_STICKER_CREDIT)
      if (credits < 1) { skipped++; continue }
      rows.push({
        user_id: userId,
        child_id: bank.child_id,
        credits,
        minutes_unused: unused,
        week_start: week,
      })
      tell.push({ userId, childId: bank.child_id, name: child?.name ?? null, credits })
    }
  }

  if (rows.length > 0) {
    // ignoreDuplicates, so a re-run is a no-op rather than an error that stops
    // the whole batch and leaves half the families paid.
    const { error } = await admin
      .from('sticker_credits')
      .upsert(rows, { onConflict: 'child_id,week_start', ignoreDuplicates: true })
    if (error) {
      return NextResponse.json({ error: error.message, week }, { status: 500 })
    }
    paid = rows.length
  }

  let holidayBanked = 0
  if (holidayRows.length > 0) {
    // The conflict target moved with migration 137, and it HAS to move here in
    // the same breath. The key is (child_id, source, on_date) now, because a
    // child can have a rollover row and up to seven daily grant rows in one
    // week. Left pointing at child_id,week_start this would raise "no unique
    // constraint matching the ON CONFLICT specification" and quietly bank
    // nobody, so the rows below set source and on_date and this names them.
    const { error } = await admin
      .from('holiday_allowance')
      .upsert(holidayRows, { onConflict: 'child_id,source,on_date', ignoreDuplicates: true })
    // A failure here must not lose the sticker credits already written above,
    // so it is reported rather than thrown.
    if (!error) holidayBanked = holidayRows.length
  }

  // Tell the child, on their own device, because a reward nobody mentions is not
  // a reward. Only to children who turned reminders on, and only when there is
  // something to say: a week with nothing left over stays silent rather than
  // reminding a child they spent it all, which would turn the whole mechanic into
  // a weekly telling off.
  for (const t of tell) {
    try {
      await pushToChild(
        admin,
        t.userId,
        t.childId,
        t.credits === 1 ? 'You saved a sticker credit' : `You saved ${t.credits} sticker credits`,
        'Screen time you earned and did not use is now yours to keep. Open your sticker book to see.',
      )
    } catch { /* one dead subscription never stops the rest */ }
  }

  // And tell them about the holiday bank, which is the half Justin asked for:
  // "we do need to let the child app know that any unused stars go towards
  // holiday amount". A saving nobody mentions is not a saving, it is a
  // deduction, and this one is invisible until the holidays arrive.
  for (const t of tellHoliday) {
    try {
      await pushToChild(
        admin,
        t.userId,
        t.childId,
        'Saved for the school holidays 🌞',
        `You did more jobs than this week had room for, so ${t.minutes} minutes are saved for the school holidays. They are yours, waiting.`,
      )
    } catch { /* one dead subscription never stops the rest */ }
  }

  return NextResponse.json({ ok: true, week, paid, skipped, holidayBanked })
}

export const GET = withHeartbeat('/api/cron/star-week-rollover', handler)
