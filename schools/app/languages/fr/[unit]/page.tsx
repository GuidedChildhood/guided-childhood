import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PAGE } from '@gc/shared/page-scale'
import { btnGold, eyebrow } from '@/components/ui'
import { FRENCH_UNITS, frenchUnit, KS2_STATEMENTS, lessonsOf, mediaUrl, sheetList, type SheetFile } from '@/lib/languages/french'
import { body, card, Crumbs, langEyebrow, Section, Sheets, small, Words } from '../_ui'

// /languages/fr/[unit]: one half term on one page. The plan (sound, words,
// grammar, culture, I can) for every ready unit; the classroom set (slides,
// songs, sheets, assessment) where the unit has one. The order follows a
// teacher's week: what this unit is, the lessons, then the paperwork.

export function generateStaticParams() {
  return FRENCH_UNITS.filter(u => u.ready).map(u => ({ unit: u.key }))
}

export async function generateMetadata({ params }: { params: Promise<{ unit: string }> }) {
  const u = frenchUnit((await params).unit)
  return { title: u ? `${u.fr} · Year ${u.year}` : 'French' }
}

export default async function FrenchUnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const u = frenchUnit((await params).unit)
  if (!u || !u.ready) notFound()
  const p = u.plan
  const d = u.deck
  const lessons = lessonsOf(u)
  const paperwork: { label: string; files: SheetFile[] }[] = d ? [
    { label: 'Word mats', files: sheetList(d.wordMats) },
    { label: 'What I can do', files: sheetList(d.whatICanDo) },
    { label: 'Extra activities', files: sheetList(d.activities) },
    { label: 'Assessment', files: sheetList(d.assessment) },
    { label: 'For the teacher', files: sheetList(d.teacher) },
  ].filter(x => x.files.length > 0) : []

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <Crumbs trail={[{ href: '/languages', label: 'Languages' }, { href: '/languages/fr', label: 'French' }, { label: `Year ${u.year}, half term ${u.ht}` }]} />
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>Year {u.year} · Half term {u.ht}{p.theme ? ` · ${p.theme}` : ''}</p>
        <h1 lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: 0 }}>{u.fr}</h1>
        <p style={{ ...body, fontWeight: 700, color: 'var(--ink)', margin: 'var(--space-1) 0 var(--space-3)' }}>{u.en}</p>
        {(d?.summary || p.summary) && <p style={{ ...body, maxWidth: '680px' }}>{d?.summary ?? p.summary}</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
        {p.sound && (
          <div style={card}>
            <div style={langEyebrow}>The sound</div>
            <div lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: 'var(--space-1) 0' }}>{p.sound}</div>
            {p.soundHint && <div style={small}>{p.soundHint}</div>}
            {p.soundSays && <div style={{ ...small, color: 'var(--ink)' }}>Say it {p.soundSays}</div>}
            {d?.phonics && u.slug && (
              <a href={mediaUrl(u.slug, d.phonics, 'deck')} target="_blank" rel="noopener" style={{ ...small, display: 'inline-block', marginTop: 'var(--space-2)', color: 'var(--terracotta-dark)', fontWeight: 700 }}>
                Open the phonics slides
              </a>
            )}
          </div>
        )}
        {p.grammar && (
          <div style={card}>
            <div style={langEyebrow}>Grammar</div>
            <p style={{ ...body, margin: 'var(--space-1) 0 0' }}>{p.grammar}</p>
          </div>
        )}
        {p.culture && (
          <div style={card}>
            <div style={langEyebrow}>Culture</div>
            <p style={{ ...body, margin: 'var(--space-1) 0 0' }}>{p.culture}</p>
          </div>
        )}
      </div>

      <Section label={`The lessons (${lessons.length})`}>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
          {lessons.map(l => (
            <li key={l.n} style={{ borderTop: '1px solid var(--border)' }}>
              <Link href={`/languages/fr/${u.key}/${l.n}`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: 56, padding: 'var(--space-2) 0', textDecoration: 'none', color: 'var(--ink)' }}>
                <span aria-hidden style={{
                  width: 32, height: 32, flexShrink: 0, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--butter-lt)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)',
                }}>{l.n}</span>
                <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <span lang="fr" style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)' }}>{l.title}</span>
                  <span style={{ ...small, display: 'block' }}>{l.detail}</span>
                </span>
                <span style={{ ...eyebrow, color: l.deck?.slides ? 'var(--retro-green)' : 'var(--ink-light)', whiteSpace: 'nowrap' }}>
                  {l.deck?.slides ? 'Slides' : 'Plan'}
                </span>
              </Link>
            </li>
          ))}
        </ol>
        {d && lessons[0] && (
          <Link href={`/languages/fr/${u.key}/1/teach`} style={{ ...btnGold, marginTop: 'var(--space-3)', textDecoration: 'none' }}>
            Teach lesson 1
          </Link>
        )}
      </Section>

      {p.vocab && p.vocab.length > 0 && (
        <Section label={`The words (${p.vocab.length})`}>
          <Words rows={p.vocab} />
        </Section>
      )}

      {p.ican && p.ican.length > 0 && (
        <Section label="By the end, pupils can">
          <ul style={{ ...body, margin: 0, paddingLeft: 'var(--space-4)' }}>
            {p.ican.map(c => <li key={c}>{c}</li>)}
          </ul>
        </Section>
      )}

      {d?.songs && d.songs.length > 0 && u.slug && (
        <Section label="Songs">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
            {d.songs.map(s => (
              <figure key={s.f} style={{ margin: 0 }}>
                <video controls preload="none" playsInline poster={s.poster ? mediaUrl(u.slug!, s.poster, 'deck') : undefined}
                  src={mediaUrl(u.slug!, s.f, 'deck')} style={{ width: '100%', borderRadius: 'var(--radius-tile)', background: 'var(--ink)' }} />
                <figcaption style={{ ...small, marginTop: 'var(--space-1)' }}>{s.t}</figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {p.codes && p.codes.length > 0 && (
        <Section label="What is assessed, against the KS2 programme of study">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {p.codes.map(c => {
              const plan = d?.assessPlan?.find(a => a.code === c.code)
              return (
                <div key={c.code} style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-3)' }}>
                  <div style={{ ...langEyebrow }}>{c.code}</div>
                  <p style={{ ...body, color: 'var(--ink)', margin: 'var(--space-1) 0' }}>{KS2_STATEMENTS[c.code] ?? c.nc}</p>
                  <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-2)', margin: 'var(--space-2) 0 0' }}>
                    <div><dt style={eyebrow}>Working towards</dt><dd style={{ ...small, margin: 0 }}>{c.s3}</dd></div>
                    <div><dt style={eyebrow}>Expected</dt><dd style={{ ...small, margin: 0 }}>{c.s4}</dd></div>
                    {plan?.s5 && <div><dt style={eyebrow}>Greater depth</dt><dd style={{ ...small, margin: 0 }}>{plan.s5}</dd></div>}
                  </dl>
                  {(plan?.what || c.idea) && <p style={{ ...small, margin: 'var(--space-2) 0 0' }}><b style={{ color: 'var(--ink)' }}>How to see it:</b> {plan?.what ?? c.idea}</p>}
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {paperwork.length > 0 && u.slug && (
        <Section label="To print for the unit">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
            {paperwork.map(g => (
              <div key={g.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', marginBottom: 'var(--space-2)' }}>{g.label}</div>
                <Sheets slug={u.slug!} files={g.files} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {p.exit && p.exit.length > 0 && (
        <Section label="Exit questions">
          <ol style={{ ...body, margin: 0, paddingLeft: 'var(--space-4)' }}>
            {p.exit.map(q => <li key={q}>{q}</li>)}
          </ol>
        </Section>
      )}
    </div>
  )
}
