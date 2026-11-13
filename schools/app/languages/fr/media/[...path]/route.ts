import { cookies } from 'next/headers'
import { LANGUAGES_COOKIE, languagesTokenAccess } from '@/lib/languages-access'
import { EXTRAS_FOLDER, FR_ORIGIN, FRENCH_UNITS } from '@/lib/languages/french'

// /languages/fr/media/<unit folder>/<file>: every French deck, song and sheet.
//
// Justin, 9 November 2026: the French media moves to our own storage. The
// files are copied into the public `languages` bucket by
// scripts/languages/mirror-french-media.mjs (run in GitHub Actions), and this
// route is the one address the pages use for them, so where a file lives is
// decided here and nowhere else.
//
// OURS FIRST, HERS UNTIL THEN. A file that is in our bucket is served from
// it. A file that is not there yet (a unit the author finished this morning,
// or the first hours after this ships) goes to her site, as it did before.
// So a page never breaks while the mirror catches up, and nothing depends on
// her site once a file has been copied.
//
// THE GATE IS HERE, NOT IN THE PROXY. The proxy's matcher skips any path with
// a dot in it, and every path here has one. So a deck (the HTML) checks the
// languages code itself. Sheets, songs and images do not: they sit in a public
// bucket and on the author's public site already, and a deck's own requests
// for them carry no cookie (see the sandbox below).
//
// A DECK NEVER RUNS AS US. A deck is somebody else's page with its own
// scripts. Served plainly from this address it would share this app's origin:
// its code could read this app's saved ticks and call its actions. The
// Content-Security-Policy sandbox header gives it an origin of its own
// wherever it opens, in the teach frame or in a tab, exactly as when it was
// framed from her site.

const BUCKET = 'languages'
const SAFE = /^[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)*\.(html|pdf|mp4|mp3|jpg|jpeg|png|webp|svg|zip)$/
const DECK_SANDBOX = 'sandbox allow-scripts allow-popups allow-popups-to-escape-sandbox allow-presentation'

const gone = () => new Response('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex, nofollow' } })

function redirect(url: string, maxAge: number) {
  return new Response(null, {
    status: 307,
    headers: { Location: url, 'Cache-Control': `public, max-age=${maxAge}`, 'X-Robots-Tag': 'noindex, nofollow' },
  })
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const [slug, ...rest] = (await params).path
  const file = rest.join('/')
  // The shared extras folder (mats, display cards, posters) is one more
  // folder beside the units, and holds PDFs only.
  const extras = slug === EXTRAS_FOLDER
  if (!slug || !(extras || FRENCH_UNITS.some(u => u.slug === slug)) || !SAFE.test(file)) return gone()
  if (extras && !/^[A-Za-z0-9_-]+\.pdf$/.test(file)) return gone()

  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
  const ours = base ? `${base}/storage/v1/object/public/${BUCKET}/fr/${slug}/${file}` : null
  const hers = `${FR_ORIGIN}/units/${slug}/${file}`

  if (!file.endsWith('.html')) {
    const there = ours ? await fetch(ours, { method: 'HEAD', cache: 'no-store' }).then(r => r.ok, () => false) : false
    // A day once it is ours; a minute while it is still hers, so the switch is quick.
    return there ? redirect(ours!, 86400) : redirect(hers, 60)
  }

  const access = await languagesTokenAccess((await cookies()).get(LANGUAGES_COOKIE)?.value)
  if (!access?.langs.includes('fr')) return gone()

  const stored = ours ? await fetch(ours, { cache: 'no-store' }).catch(() => null) : null
  if (!stored?.ok) return redirect(hers, 60)
  return new Response(stored.body, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': DECK_SANDBOX,
      'Cache-Control': 'private, max-age=300',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
