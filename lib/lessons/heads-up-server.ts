// READY: THE PARENT OPENS A HEAVY LESSON BEFORE ITS 48 HOURS RUN OUT.
//
// One door for it, because two places open a waiting lesson early: the Ready
// button under the note (dashboard/lessons/heads-up) and the parent sending or
// nudging that same lesson from their lessons page, which is the parent
// choosing it and so already theirs (lib/lessons/heavy). Only a mission that
// is still waiting moves, so a second tap is a no op rather than a second push.

import type { SupabaseClient } from '@supabase/supabase-js'
import { pushToChild, type ChildPushResult } from '@/lib/quests/kid-push'

type Db = Pick<SupabaseClient, 'from'>

/** Opens a waiting heavy lesson now and tells the child. False when nothing was waiting. */
export async function openHeadsUpNow(
  /** The parent's own client: the update is scoped to their rows. */
  db: Db,
  /** The service client, for the push subscriptions. */
  admin: Db,
  args: { userId: string; childId: string; lessonId: string; parentName: string },
): Promise<{ opened: boolean; push: ChildPushResult['reason'] | null }> {
  const now = new Date().toISOString()
  const { data } = await db
    .from('kid_lesson_missions')
    .update({ sent_at: now })
    .eq('user_id', args.userId).eq('child_id', args.childId).eq('lesson_id', args.lessonId)
    .eq('status', 'sent')
    .gt('sent_at', now)
    .select('id')
  if (!data?.length) return { opened: false, push: null }
  // No lesson title on a lock screen for these six (sync plan G4).
  const pushed = await pushToChild(admin, args.userId, args.childId, `${args.parentName} is ready`, 'Your lesson is open now. Have a go when you like.')
  return { opened: true, push: pushed.reason }
}
