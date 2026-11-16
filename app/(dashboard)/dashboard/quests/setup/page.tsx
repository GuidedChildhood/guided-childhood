import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import BackTo from '@/components/nav/BackTo'
import QuestManager from '../QuestManager'

// Stars, rewards and sharing: everything that SETS the system.
//
// Until 15 November 2026 this was the bottom of the Quests page. Measured on a
// phone with a two child family, that page ran to seventeen screens and 124
// things to tap, and fifteen of the seventeen were this: the child picker, the
// star rate, the reward being saved for, the link and QR code, the pings, the
// routines and the idea lists. Justin: "seems way too much".
//
// A page does one job (THE-STORY, section 11). Quests is the day: what is
// waiting on me, and how is each child doing. This is the deal behind the day,
// which a parent sets up once and then visits now and then. It is the same
// component, moved whole, so every call it makes to the child's app is the
// call it always made. It reads ?tab=, ?routine= and ?add_child= itself, and
// the Quests page sends those here, so no old link lands on a blank.

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Stars, rewards and sharing · Guided Childhood' }

export default async function QuestSetupPage() {
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <BackTo from="quests" />
      <QuestManager />
    </div>
  )
}
