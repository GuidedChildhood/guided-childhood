import { ImageResponse } from 'next/og'
import { momentLook } from '@/lib/content/moment-look'

// The social unfurl for a shared moment card: when the /m/<id> link lands
// in WhatsApp, iMessage or a feed, this image is the preview, in the same
// band and tint as the card itself. Fetched via Supabase REST with the
// anon key (daily_moments is publicly readable).

export const runtime = 'edge'
export const alt = 'A moment card from Guided Childhood'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type MomentRow = { title: string; category: string; science_brief: string }

async function getMoment(id: string): Promise<MomentRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!base || !key) return null
  try {
    const res = await fetch(
      `${base}/rest/v1/daily_moments?id=eq.${id}&active=eq.true&select=title,category,science_brief`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    )
    const rows = (await res.json()) as MomentRow[]
    return rows[0] ?? null
  } catch {
    return null
  }
}

export default async function OgImage({ params }: { params: { id: string } }) {
  const moment = await getMoment(params.id)
  const look = momentLook(moment?.category ?? 'Morning')
  const title = moment?.title ?? 'The words that work, for every hard moment'
  const brief = (moment?.science_brief ?? '').slice(0, 150)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: look.tint,
        }}
      >
        {/* Band */}
        <div
          style={{
            background: look.band,
            padding: '36px 64px 44px',
            display: 'flex',
            flexDirection: 'column',
            borderBottomLeftRadius: 60,
            borderBottomRightRadius: 60,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: 4, textTransform: 'uppercase' }}>
            A moment from Guided Childhood
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: '#ffffff', marginTop: 6 }}>
            {moment?.category ?? 'Moments'}
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '48px 64px' }}>
          <div style={{ fontSize: 68, fontWeight: 800, color: '#1A1A2E', lineHeight: 1.1, letterSpacing: -1.5 }}>
            {title}
          </div>
          {brief && (
            <div style={{ fontSize: 30, color: '#3A3A50', marginTop: 28, lineHeight: 1.4 }}>
              {brief}{brief.length >= 150 ? '…' : ''}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 64px 40px',
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1A1A2E' }}>guidedchildhood.co.uk</div>
          <div
            style={{
              background: '#EDC35F',
              color: '#1A1A2E',
              fontSize: 26,
              fontWeight: 800,
              padding: '14px 30px',
              borderRadius: 18,
            }}
          >
            The words that work
          </div>
        </div>
      </div>
    ),
    size
  )
}
