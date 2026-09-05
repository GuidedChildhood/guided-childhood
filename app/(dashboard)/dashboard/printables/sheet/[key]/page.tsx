import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPrintable } from '@/lib/printables/registry'
import { hasFullAccess } from '@/lib/access'
import { getChildren } from '@/lib/children/server'
import { getTimeSettings } from '@/lib/quests/time-tiers'
import { dealFactsFrom } from '@/lib/printables/deal-facts'
import { missionForPrintable, missionSheetFor } from '@/lib/printables/mission-sheets'
import { childAgeFor } from '@/lib/planet/logic'
import { ensureMissionCode } from '@/lib/planet/server'
import type { DealFacts, DrawnSpec } from '@/components/printables/drawn'
import SheetPrintClient from './SheetPrintClient'

// The parent's print page for a drawn sheet (the happy news device balance
// set). The CDN sheets come down as a PDF from /api/printables/[key]/pdf;
// a drawn sheet has no file to fetch, so this page draws it at true size
// with the chosen child's name and the family's real deal on it, and prints
// itself. Same paywall as the PDF route, checked here for the same reason:
// a direct link must not skip it.

export const dynamic = 'force-dynamic'

export default async function DrawnSheetPage({ params, searchParams }: {
  params: Promise<{ key: string }>
  searchParams: Promise<{ child?: string }>
}) {
  const { key } = await params
  const { child: childParam } = await searchParams
  const printable = getPrintable(key)
  if (!printable?.drawn) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(`/dashboard/printables/sheet/${key}`)}`)

  const [{ kids, child }, { data: profile }] = await Promise.all([
    getChildren<{ id: string; name: string | null; age_band: string | null; date_of_birth: string | null; is_primary: boolean | null }>(
      supabase, user.id, childParam, 'id, name, age_band, date_of_birth'),
    supabase.from('profiles').select('subscription_status, trial_ends_at, created_at').eq('id', user.id).maybeSingle(),
  ])
  if (!printable.free && !hasFullAccess(profile, user.email)) {
    redirect(`/dashboard/upgrade?sheet=${encodeURIComponent(key)}`)
  }

  const childName = child?.name && child.name !== 'Your child' ? child.name : ''
  let facts: DealFacts = {}
  if (child) {
    try {
      const settings = await getTimeSettings(supabase, user.id, [{ id: child.id, age_band: child.age_band }])
      const s = settings.get(child.id)
      if (s) facts = dealFactsFrom(s)
    } catch { /* dotted lines */ }
  }

  // A Planet Friends mission sheet: the grown up's line comes from its
  // scripts row (migration 253), and a card mission gets the code the server
  // made for this child, made now if this is the first print. The code is
  // on this print and nowhere the child's device can see.
  let mission: DrawnSpec['mission']
  const m = missionForPrintable(printable.key)
  if (m) {
    let prompt: string | null = null
    try {
      const { data: row } = await supabase.from('scripts').select('say_this').eq('sort_order', m.scriptOrder).maybeSingle()
      if (row?.say_this) prompt = String(row.say_this)
    } catch { /* the catalogue's line prints instead */ }
    let card: { code: string[]; mode: 'pictures' | 'letters' } | null = null
    if (m.perChild && child) {
      card = await ensureMissionCode(supabase, child.id, m.key, childAgeFor(child.date_of_birth, child.age_band))
    }
    mission = missionSheetFor(printable.key, { prompt, card })
  }
  const spec: DrawnSpec = { key: printable.drawn, childName, stars: printable.stars, facts, mission }
  const named = kids.filter(k => k.name && k.name !== 'Your child').map(k => ({ id: k.id, name: k.name as string }))

  return (
    <SheetPrintClient
      spec={spec}
      title={`${printable.emoji} ${printable.title}`}
      kids={named}
      currentChildId={child?.id ?? null}
      sheetKey={key}
    />
  )
}
