import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getNotifications } from '@/lib/notifications/collect'

// The notifications feed for the bell and the hub. The bell reads the count,
// the page reads the list, both from here so they never disagree.

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ items: [], count: 0, urgentCount: 0 })
  const feed = await getNotifications(supabase, user.id)
  return NextResponse.json(feed)
}
