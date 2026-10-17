// THE PUSHES ABOUT A PASSPORT PAGE (plans/2026-10-16-passport-journey-plan.md, PR 3).
//
// Justin, 17 October 2026, decision 3: no new daily push. The page rides the
// pushes that already go out when something real happens, a lesson passed or
// the big check sat, and two page moments get a push of their own, each once
// per page: the page is ready for its check, and the page is stamped. The
// "once" is a column on passport_pages (migration 378), claimed with an
// update that only succeeds where the column is still empty, so two routes
// racing can never both send.
//
// Titles carry the page's one count, never an emoji, and never the title of a
// safeguarding flagged lesson (sync plan G4). Every link opens the page.

import type { SupabaseClient } from '@supabase/supabase-js'
import { sendPush } from './send'

type Db = Pick<SupabaseClient, 'from'>

export type PageMoment = 'check_ready_pushed_at' | 'stamp_pushed_at'

/** Where every passport push lands: the child's page, open, on the picture's page anchor. */
export function pagePushUrl(childId: string, stageNum: number): string {
  return `/dashboard/pathway?open=${stageNum}&child=${encodeURIComponent(childId)}&src=push_passport#page`
}

/**
 * Claims one page moment for one child. True only for the call that claimed
 * it. Fails closed (false) on any error, so a missing table means no push
 * rather than a push every time.
 */
export async function claimPageMoment(
  admin: Db,
  args: { userId: string; childId: string; stageNum: number; moment: PageMoment },
): Promise<boolean> {
  try {
    await admin.from('passport_pages').upsert(
      { user_id: args.userId, child_id: args.childId, stage_num: args.stageNum },
      { onConflict: 'child_id,stage_num', ignoreDuplicates: true },
    )
    const { data, error } = await admin
      .from('passport_pages')
      .update({ [args.moment]: new Date().toISOString() })
      .eq('child_id', args.childId)
      .eq('stage_num', args.stageNum)
      .is(args.moment, null)
      .select('stage_num')
    return !error && !!data && data.length > 0
  } catch {
    return false
  }
}

/** One passport push to the parent, best effort. */
export async function sendPassportPush(input: { userId: string; childId: string; stageNum: number; title: string; body: string }): Promise<void> {
  try {
    await sendPush({
      userId: input.userId,
      title: input.title.slice(0, 60),
      body: input.body,
      url: pagePushUrl(input.childId, input.stageNum),
    })
  } catch { /* best effort */ }
}
