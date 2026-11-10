import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PAGE } from '@gc/shared/page-scale'
import { eyebrow } from '@/components/ui'
import { assessedIn, deckSequence, FRENCH_UNITS, frenchLesson, frenchUnit, lessonLabel, lessonsOf, mediaUrl, teachingLessons } from '@/lib/languages/french'
import { body, Crumbs, langEyebrow, Section, Sheets, small } from '../../_ui'
import DeckPreview from '../../DeckPreview'

// /languages/fr/[unit]/[lesson]: the lesson page, shaped like the digital
// scheme's /lesson/[module]: what pupils will be able to do, the words, the
// running order, the sheets, and one button to teach it on the board.
// A planned lesson with no slides yet shows its plan and says so.

export function generateStaticParams() {
  return FRENCH_UNITS.filter(u => u.ready).flatMap(u => lessonsOf(u).map(l => ({ unit: u.key, lesson: String(l.n) })))
}

export async function generateMetadata({ params }: { params: Promise<{ unit: string; lesson: string }> }) {
  const { unit, lesson } = await params
  const u = frenchUnit(unit)
  const l = u ? frenchLesson(u, Number(lesson)) : null
  return { title: l ? l.title : 'French' }
}

export default async function FrenchLessonPage({ params }: { params: Promise<{ unit: string; lesson: string }> }) {
  const { unit, lesson } = await params
  const u = frenchUnit(unit)
  if (!u || !u.ready) notFound()
  const l = frenchLesson(u, Number(lesson))
  if (!l) notFound()
  // A culture lesson sits outside the unit's numbered lessons, so it is not
  // "lesson 7 of 7" and it has no neighbours: it goes back to its unit.
  const all = teachingLessons(u)
  const prev = l.culture ? undefined : all.find(x => x.n === l.n - 1)
  const next = l.culture ? undefined : all.find(x => x.n === l.n + 1)
  const assess = l.culture ? [] : assessedIn(u, l.n)
  const deck = l.deck
  const songs = deck?.songs?.map(i => u.deck?.songs?.[i]).filter((s): s is NonNullable<typeof s> => !!s) ?? []
  const order = deckSequence(deck?.slides)

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Crumbs trail={[
        { href: '/languages', label: 'Languages' },
        { href: '/languages/fr', label: 'French' },
        { href: `/languages/fr/${u.key}`, label: u.fr },
        { label: lessonLabel(l) },
      ]} />

      {/* THE HERO: the words on one side, the lesson itself on the other.
          On a phone the slide comes first, because it is the lesson. */}
      <div className="gc-fr-hero">
        <div>
          <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>Year {u.year} · {u.fr} · {l.culture ? `Culture · ${l.culture}` : `Lesson ${l.n} of ${all.length}`}</p>
          <h1 lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: 0 }}>{l.title}</h1>
          {deck?.en && <p style={{ ...body, fontWeight: 700, color: 'var(--ink)', margin: 'var(--space-1) 0 0' }}>{deck.en}</p>}
          <p style={{ ...body, margin: 'var(--space-3) 0 0' }}>
            <span style={{ ...eyebrow, display: 'block', marginBottom: 'var(--space-1)' }}>Pupils will</span>
            {deck?.ican ?? l.detail}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center', marginTop: 'var(--space-4)' }}>
            {deck?.slides ? (
              <Link href={`/languages/fr/${u.key}/${l.n}/teach`} className="btn btn-gold">Teach it on the board</Link>
            ) : (
              <span style={small}>The slides for this lesson are still being made. The plan is below.</span>
            )}
            {deck?.files && deck.files.length > 0 && <a href="#sheets" className="btn btn-outline">Sheets ({deck.files.length})</a>}
            {u.deck && <Link href={`/languages/fr/${u.key}/plans#lesson-${l.n}`} className="btn btn-outline">Lesson plan</Link>}
          </div>
          {assess.length > 0 && (
            <p style={{ ...small, margin: 'var(--space-3) 0 0' }}>
              <b style={{ color: 'var(--ink)' }}>Assess today:</b>{' '}
              {assess.map(a => `${a.code} (${a.how === 'written' ? 'written' : 'observed'})`).join(' · ')}
            </p>
          )}
          {l.culture && <p style={{ ...small, margin: 'var(--space-3) 0 0' }}>A culture lesson. It is taught with this unit and is not assessed.</p>}
        </div>
        {deck?.slides && u.slug && (
          <DeckPreview src={mediaUrl(u.slug, deck.slides, 'deck')} href={`/languages/fr/${u.key}/${l.n}/teach`} title={l.title} />
        )}
      </div>
      <style>{`
        .gc-fr-hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: var(--space-5); align-items: center; }
        @media (max-width: 820px) { .gc-fr-hero { grid-template-columns: 1fr; gap: var(--space-4); } .gc-fr-hero > .gc-fr-preview { order: -1; } }
      `}</style>

      {deck?.words && (
        <Section label="The words">
          <p lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.4, margin: 0 }}>{deck.words}</p>
        </Section>
      )}

      {order.length > 0 && (
        <Section label={`The running order (${order.length} slides)`}>
          <ol style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', listStyle: 'none', padding: 0, margin: 0 }}>
            {order.map((t, i) => (
              <li key={i} lang="fr" style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: 'var(--space-1) var(--space-3)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
                <span style={{ color: 'var(--ink-muted)' }}>{i + 1}.</span> {t}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {deck?.book && (
        <Section label="In their books">
          <p style={{ ...body, margin: 0 }}>{deck.book}</p>
        </Section>
      )}

      {songs.length > 0 && u.slug && (
        <Section label="The song">
          {songs.map(s => (
            <figure key={s.f} style={{ margin: 0 }}>
              <video controls preload="none" playsInline poster={s.poster ? mediaUrl(u.slug!, s.poster, 'deck') : undefined}
                src={mediaUrl(u.slug!, s.f, 'deck')} style={{ width: '100%', maxWidth: '560px', borderRadius: 'var(--radius-tile)', background: 'var(--ink)' }} />
              <figcaption style={{ ...small, marginTop: 'var(--space-1)' }}>{s.t}</figcaption>
            </figure>
          ))}
        </Section>
      )}

      {deck?.files && deck.files.length > 0 && u.slug && (
        <div id="sheets" style={{ scrollMarginTop: 'var(--space-7)' }}>
          <Section label="Sheets for this lesson">
            <Sheets slug={u.slug} files={deck.files} />
          </Section>
        </div>
      )}

      <nav aria-label="Lessons in this unit" style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        {prev ? <Link href={`/languages/fr/${u.key}/${prev.n}`} className="btn btn-outline">‹ Lesson {prev.n}</Link> : <span />}
        {next ? <Link href={`/languages/fr/${u.key}/${next.n}`} className="btn btn-outline">Lesson {next.n} ›</Link> : <Link href={`/languages/fr/${u.key}`} className="btn btn-outline">Back to the unit</Link>}
      </nav>
    </div>
  )
}
