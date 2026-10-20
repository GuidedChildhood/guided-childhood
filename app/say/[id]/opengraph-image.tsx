import { ImageResponse } from 'next/og'
import { SITE_URL } from '@/lib/config/site'

// The social unfurl for a shared script: when /say/<id> lands in a WhatsApp
// group, iMessage or a feed, THIS is what another parent sees.
//
// ── THE IMAGE IS THE SENTENCE ───────────────────────────────────────────────
//
// Every other unfurl in this app leads with a title and uses the body text as
// a subtitle. A script inverts that, because the title ("Meltdown when screen
// time ends") is the problem and the quote is the answer. A parent scrolling
// a group chat at speed should be able to take the words away WITHOUT opening
// the link, and still want to open the link. So the quote is set at 60px and
// the title sits above it at a third of that, as a label.
//
// ── EXPLICIT NUMBERS, NOT TOKENS, AND THIS IS NOT A STYLE PREFERENCE ────────
//
// Satori renders this outside the document. There is no :root, so there are no
// custom properties: `fontSize: 'var(--text-2xl)'` is not a smaller font, it
// is an unparseable value. The sibling route at app/m/[id] carries exactly
// that and it is fixed in the same change. Every size and colour here is a
// literal, and must stay one.

export const runtime = 'edge'
export const alt = 'A script from Guided Childhood'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const INK = '#1A1A2E'
const INK_SOFT = '#52526A'
const BUTTER = '#EDC35F'
const BUTTER_DARK = '#C99A28'
const ESPRESSO = '#2E2818'

const STAGE_LABEL: Record<string, string> = {
  foundation: 'Ages 4 to 7',
  builder: 'Ages 8 to 10',
  explorer: 'Ages 11 to 13',
  shaper: 'Ages 13 to 15',
  independent: 'Ages 16 and above',
}

type ScriptRow = { title: string; say_this: string; stage_id: string }

async function getScript(id: string): Promise<ScriptRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Both names are accepted across this repo, so take whichever is set.
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!base || !key) return null
  try {
    const res = await fetch(
      `${base}/rest/v1/scripts?id=eq.${id}&select=title,say_this,stage_id`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    )
    const rows = (await res.json()) as ScriptRow[]
    return rows[0] ?? null
  } catch {
    return null
  }
}

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  // Awaited, not read. The sibling moment card read `params.id` straight off
  // the Promise and rendered its fallback for every moment ever shared.
  const { id } = await params
  const script = await getScript(id)
  const title = script?.title ?? 'The words that work, for every hard moment'
  const ages = STAGE_LABEL[script?.stage_id ?? ''] ?? 'Ages 4 to 16'

  // Trimmed to what fits at 60px across two or three lines. A quote cut mid
  // word reads as broken; cut at a word with an ellipsis reads as a quote.
  const full = script?.say_this ?? ''
  const quote = full.length > 190
    ? `${full.slice(0, 190).replace(/\s+\S*$/, '')}…`
    : full

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFFFF',
          border: `14px solid ${ESPRESSO}`,
        }}
      >
        {/* The butter band, the shape of the sheet inside the app */}
        <div
          style={{
            background: BUTTER,
            borderBottom: `6px solid ${INK}`,
            padding: '22px 56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: INK, letterSpacing: 5, textTransform: 'uppercase' }}>
            A script from Guided Childhood
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: BUTTER_DARK, letterSpacing: 2 }}>
            {ages}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '38px 56px 0' }}>
          {/* The title as a label above the words, not as the headline */}
          <div style={{ fontSize: 30, fontWeight: 700, color: INK_SOFT, letterSpacing: -0.5 }}>
            {title}
          </div>

          {quote ? (
            <div
              style={{
                display: 'flex',
                marginTop: 22,
                paddingLeft: 26,
                borderLeft: `10px solid ${BUTTER}`,
                fontSize: quote.length > 120 ? 48 : 60,
                fontWeight: 800,
                color: INK,
                lineHeight: 1.22,
                letterSpacing: -1.2,
              }}
            >
              {`“${quote}”`}
            </div>
          ) : (
            <div style={{ fontSize: 56, fontWeight: 800, color: INK, marginTop: 22, lineHeight: 1.2 }}>
              The exact words to say, from age 4 to 16
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 56px 36px',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, color: INK }}>
            {SITE_URL.replace(/^https?:\/\//, '')}
          </div>
          <div
            style={{
              background: BUTTER,
              color: INK,
              fontSize: 28,
              fontWeight: 800,
              padding: '14px 30px',
              borderRadius: 16,
              border: `4px solid ${INK}`,
            }}
          >
            And what not to say
          </div>
        </div>
      </div>
    ),
    size
  )
}
