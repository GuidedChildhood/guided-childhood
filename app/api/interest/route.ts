import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { unsubscribeToken } from '@/lib/email'

// "Would you use this?" answered in one tap.
//
// Justin, 9 August 2026: the school alerts email promises a feature that is
// not built. It now says coming soon and asks the question, and this is where
// the two buttons land.
//
// A GET, because it is a link in an email and an email cannot POST. That means
// it has to be safe to hit twice, which it is: one row per person per feature,
// upserted, so a second tap or a mail client prefetching the link updates the
// same row rather than inflating the count.
//
// Signed with the same token as the unsubscribe link. Without that, the id is
// the only thing standing between a guessed URL and a fake answer, and a
// feature count that anybody can stuff is worse than no count, because it
// looks like evidence.

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const userId = searchParams.get('u') ?? ''
  const key = searchParams.get('k') ?? ''
  const feature = searchParams.get('f') ?? ''
  const answer = searchParams.get('a') === 'yes' ? 'yes' : 'no'

  const ok = userId && feature && key === unsubscribeToken(userId)
  if (!ok) return NextResponse.redirect(`${origin}/`)

  try {
    await createAdminClient()
      .from('feature_interest')
      .upsert(
        { user_id: userId, feature, answer, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,feature' },
      )
  } catch {
    // Migration 178 is applied by hand, so there is a window where this code
    // knows about a table the database has not got. A parent who taps a button
    // should still be thanked rather than shown an error for our deploy skew.
  }

  return NextResponse.redirect(`${origin}/thanks?f=${encodeURIComponent(feature)}&a=${answer}`)
}
