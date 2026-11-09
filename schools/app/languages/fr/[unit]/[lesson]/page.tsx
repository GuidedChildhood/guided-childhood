import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PAGE } from '@gc/shared/page-scale'
import { btnGold, btnQuiet, eyebrow } from '@/components/ui'
import { deckSequence, FRENCH_UNITS, frenchLesson, frenchUnit, lessonsOf, mediaUrl } from '@/lib/languages/french'
import { body, Crumbs, langEyebrow, Section, Sheets, small } from '../../_ui'

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
  const all = lessonsOf(u)
  const prev = all.find(x => x.n === l.n - 1)
  const next = all.find(x => x.n === l.n + 1)
  const deck = l.deck
  const songs = deck?.songs?.map(i => u.deck?.songs?.[i]).filter((s): s is NonNullable<typeof s> => !!s) ?? []
  const order = deckSequence(deck?.slides)

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <Crumbs trail={[
          { href: '/languages', label: 'Languages' },
          { href: '/languages/fr', label: 'French' },
          { href: `/languages/fr/${u.key}`, label: u.fr },
          { label: `Lesson ${l.n}` },
        ]} />
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>Year {u.year} · {u.fr} · Lesson {l.n} of {all.length}</p>
        <h1 lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: 0 }}>{l.title}</h1>
        {deck?.en && <p style={{ ...body, fontWeight: 700, color: 'var(--ink)', margin: 'var(--space-1) 0 0' }}>{deck.en}</p>}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
        {deck?.slides ? (
          <Link href={`/languages/fr/${u.key}/${l.n}/teach`} style={{ ...btnGold, textDecoration: 'none' }}>Teach it on the board</Link>
        ) : (
          <span style={{ ...small }}>The slides for this lesson are still being made. The plan is below.</span>
        )}
        {deck?.slides && u.slug && (
          <a href={mediaUrl(u.slug, deck.slides, 'deck')} target="_blank" rel="noopener" style={{ ...btnQuiet, textDecoration: 'none' }}>Open in a new tab</a>
        )}
      </div>

      <Section label="Pupils will">
        <p style={{ ...body, color: 'var(--ink)', fontWeight: 700, margin: 0 }}>{deck?.ican ?? l.detail}</p>
        {deck?.words && (
          <p lang="fr" style={{ ...body, margin: 'var(--space-2) 0 0' }}><span style={{ ...eyebrow, marginRight: 'var(--space-2)' }}>Words</span>{deck.words}</p>
        )}
      </Section>

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
        <Section label="Sheets for this lesson">
          <Sheets slug={u.slug} files={deck.files} />
        </Section>
      )}

      <nav aria-label="Lessons in this unit" style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        {prev ? <Link href={`/languages/fr/${u.key}/${prev.n}`} style={{ ...btnQuiet, textDecoration: 'none' }}>‹ Lesson {prev.n}</Link> : <span />}
        {next ? <Link href={`/languages/fr/${u.key}/${next.n}`} style={{ ...btnQuiet, textDecoration: 'none' }}>Lesson {next.n} ›</Link> : <Link href={`/languages/fr/${u.key}`} style={{ ...btnQuiet, textDecoration: 'none' }}>Back to the unit</Link>}
      </nav>
    </div>
  )
}
