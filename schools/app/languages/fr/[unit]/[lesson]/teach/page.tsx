import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eyebrow } from '@/components/ui'
import { FRENCH_UNITS, frenchLesson, frenchUnit, lessonsOf, mediaUrl } from '@/lib/languages/french'

// /languages/fr/[unit]/[lesson]/teach: the deck on the board, full screen,
// with one thin bar: back to the lesson page, and on to record it when the
// lesson ends. The deck is the author's own interactive
// stage (arrows, songs and games built in), framed rather than rebuilt, so
// nothing a class taps is lost. It is sandboxed with an origin of its own
// (the media route sends the same rule as a header), so a deck's scripts
// never run as this app. It sits above the site nav on purpose: the
// board shows the lesson and nothing else.

export function generateStaticParams() {
  return FRENCH_UNITS.filter(u => u.deck).flatMap(u => lessonsOf(u).filter(l => l.deck?.slides).map(l => ({ unit: u.key, lesson: String(l.n) })))
}

export async function generateMetadata({ params }: { params: Promise<{ unit: string; lesson: string }> }) {
  const { unit, lesson } = await params
  const u = frenchUnit(unit)
  const l = u ? frenchLesson(u, Number(lesson)) : null
  return { title: l ? `Teach: ${l.title}` : 'French' }
}

export default async function FrenchTeachPage({ params }: { params: Promise<{ unit: string; lesson: string }> }) {
  const { unit, lesson } = await params
  const u = frenchUnit(unit)
  const l = u ? frenchLesson(u, Number(lesson)) : null
  if (!u || !l || !l.deck?.slides || !u.slug) notFound()
  const src = mediaUrl(u.slug, l.deck.slides, 'deck')

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-1) var(--space-3)', minHeight: 44 }}>
        <Link href={`/languages/fr/${u.key}/${l.n}`} style={{ ...eyebrow, color: 'var(--cream)', textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
          ‹ Lesson page
        </Link>
        <span lang="fr" style={{ ...eyebrow, color: 'var(--butter)', flex: '1 1 auto', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {u.fr} · {l.title}
        </span>
        <Link href={`/languages/fr/${u.key}/${l.n}#record`} style={{ ...eyebrow, color: 'var(--butter)', textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
          Finished? Record it ›
        </Link>
      </div>
      <iframe
        src={src}
        title={`${l.title}, slides`}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-presentation"
        allow="autoplay; fullscreen"
        allowFullScreen
        style={{ flex: '1 1 auto', width: '100%', border: 0, background: 'var(--ink)' }}
      />
    </div>
  )
}
