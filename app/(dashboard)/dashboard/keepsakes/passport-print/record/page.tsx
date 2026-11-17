import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import QRCode from 'qrcode'
import { getChildren } from '@/lib/children/server'
import { hasFullAccess } from '@/lib/access'
import { loadRecordBook } from '@/lib/pathway/record-book-server'
import { passportStageFor } from '@/lib/lessons/school-path'
import { SITE_URL } from '@/lib/config/site'
import RecordBook from '@/components/passport/RecordBook'
import PrintButton from '../PrintButton'

// THE PASSPORT RECORD BOOK (17 November 2026, part 2 of
// plans/2026-11-17-passport-stickers-plan.md). Every step of every stage on
// paper, ticked from the app, signed by a grown up, like a swimming badge book.

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Passport record book · Guided Childhood' }

const STAGE_NUM: Record<string, number> = { foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5 }

export default async function RecordBookPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child: childParam } = await searchParams
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')

  const [{ child }, profile] = await Promise.all([
    getChildren<{ id: string; name: string | null; is_primary: boolean | null; date_of_birth: string | null; stage_id: string | null; age_band: string | null }>(
      supabase, user.id, childParam, 'id, name, date_of_birth, stage_id, age_band'),
    supabase.from('profiles').select('subscription_status, trial_ends_at').eq('id', user.id).single(),
  ])
  const kid = child?.name && child.name !== 'Your child' ? child.name : null
  const stages = child ? await loadRecordBook(supabase, user.id, child.id, hasFullAccess(profile.data, user.email)) : []
  const passportStage = child ? passportStageFor(child) : null
  const currentStage = passportStage ? STAGE_NUM[passportStage] ?? null : null
  const q = child ? `?child=${encodeURIComponent(child.id)}` : ''
  const qrSvg = await QRCode.toString(`${SITE_URL}/dashboard/pathway${q}`, {
    type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#1A1A2E', light: '#FFFFFF' }, // hex-ok: QR code SVG string, a custom property cannot reach inside it
  }).catch(() => null)
  const back = `/dashboard/pathway${q}`
  const stickers = `/dashboard/keepsakes/passport-print/stickers${q}`

  return (
    <RecordBook kid={kid} stages={stages} currentStage={currentStage} qrSvg={qrSvg}>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px', maxWidth: '52ch' }}>
        Every step of every stage, on paper. Ticks and dates come from the app. Print it on plain A4, staple it, and keep it with the passport.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <PrintButton />
        <Link href={stickers} style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          The colour stickers
        </Link>
        <Link href={back} style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          Back to the passport
        </Link>
      </div>
    </RecordBook>
  )
}
