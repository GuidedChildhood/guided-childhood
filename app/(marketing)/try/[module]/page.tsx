import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SharedLessonStart from '@/components/school/SharedLessonStart'
import { parseSlides, visibleSlides } from '@gc/shared/lesson-slides'
import { characterKeyFor, registerFor } from '@gc/shared/friend-register'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarLessonForShare } from '@/lib/quests/star-lesson-catalogue'
import { shareTeaser, shareFull } from '@/lib/school/share'
import { isTryModule } from '@/lib/content/try-lessons'
import { LandingTop, EYEBROW, BODY } from '@/components/marketing/EmailLanding'

// TRY A LESSON, NO ACCOUNT (Justin, 26 November 2026).
//
// One real lesson per stage, open to anyone, linked from the homepage cards.
// The same together deck and the same parent note a family gets when a school
// shares a lesson (app/(marketing)/from-school), without the account door,
// for the five modules in lib/content/try-lessons.ts and nothing else. Any
// other module id is a 404 before the database is asked anything.
//
// Read with the admin client because migration 275 took the curriculum away
// from anonymous reads; getStarLessonForShare selects only the safe columns
// (no teacher notes, no DSL note). The player records nothing.

export const dynamic = 'force-dynamic'

type Params = Promise<{ module: string }>

async function load(params: Params) {
  const { module: raw } = await params
  const moduleId = decodeURIComponent(raw)
  if (!isTryModule(moduleId)) return null
  try {
    const row = await getStarLessonForShare(createAdminClient(), moduleId)
    return row ? { moduleId, row } : null
  } catch { return null }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const hit = await load(params)
  const title = hit ? `Try a lesson: ${hit.row.title}` : 'Try a lesson'
  const description = 'A real Guided Childhood lesson to go through with your child at home, free, no account.'
  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: { title, description, type: 'article', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Guided Childhood' }] },
  }
}

const card: React.CSSProperties = {
  background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '18px 20px',
}
const label: React.CSSProperties = { ...EYEBROW, color: 'var(--ink-muted)', marginBottom: 8 }

function NoteCard({ title, children, quote = false }: { title: string; children: React.ReactNode; quote?: boolean }) {
  return (
    <div style={card}>
      <p style={label}>{title}</p>
      <p style={{ ...BODY, color: 'var(--ink)', fontStyle: quote ? 'italic' : 'normal' }}>{quote ? <>&ldquo;{children}&rdquo;</> : children}</p>
    </div>
  )
}

// How a lesson works at home, said once, short. The from-school page's
// "go through it together" wording, as steps.
const HOW = [
  ['Sit together', 'One screen, you and your child. Pick ten quiet minutes, not the middle of an argument.'],
  ['Go through the slides', 'The friend on screen does the talking. You read along, answer the questions together and stop wherever you like.'],
  ['Ask the question tonight', 'The note below gives you one question to ask later, what to listen for, and the words to say back.'],
]

export default async function TryLessonPage({ params }: { params: Params }) {
  const hit = await load(params)
  if (!hit) notFound()

  const { moduleId, row } = hit
  const teaser = shareTeaser(row)
  const full = shareFull(row)
  const slides = visibleSlides(parseSlides(row.slides) ?? [], 'together').slides
  const path = `/try/${encodeURIComponent(moduleId)}`

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <LandingTop signInHref="/login" />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(16px, 4vw, 40px) 20px clamp(64px, 9vw, 96px)' }}>
        <p style={{ ...EYEBROW, marginBottom: 10 }}>{teaser.yearBand ? `Try a lesson for ${teaser.yearBand}` : 'Try a lesson'}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 5.8vw, 2.6rem)', letterSpacing: '-0.025em', lineHeight: 1.1, color: 'var(--ink)', margin: '0 0 12px' }}>
          {teaser.title}
        </h1>
        <p style={{ ...BODY, marginBottom: 22 }}>
          A real lesson from the road to 16, the same one schools teach, worded for a child and a grown up on one screen. Free, no account, and nothing is saved.
        </p>

        {teaser.learned && (
          <div style={{ marginBottom: 24 }}>
            <NoteCard title="By the end, your child can">{teaser.learned}</NoteCard>
          </div>
        )}

        <section aria-label="How it works at home" style={{ marginBottom: 28 }}>
          <p style={{ ...EYEBROW, marginBottom: 10 }}>How it works at home</p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
            {HOW.map(([title, body], i) => (
              <li key={title} style={{ ...card, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span aria-hidden style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: 'var(--terracotta)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 900, display: 'grid', placeItems: 'center' }}>{i + 1}</span>
                <span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)', marginBottom: 2 }}>{title}</span>
                  <span style={{ ...BODY, display: 'block' }}>{body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {slides.length > 0 && (
          <section aria-label="The lesson" style={{ marginBottom: 32 }}>
            <SharedLessonStart
              lessonId={row.id}
              slides={slides}
              backHref={path}
              character={characterKeyFor(row.character_cast)}
              register={registerFor(row.key_stage)}
            />
          </section>
        )}

        <div style={{ display: 'grid', gap: 12, marginBottom: 32 }}>
          {teaser.askAtHome && <NoteCard title="Ask at home tonight" quote>{teaser.askAtHome}</NoteCard>}
          {full.listenFor && <NoteCard title="Listen for">{full.listenFor}</NoteCard>}
          {full.thenAsk && <NoteCard title="Then ask" quote>{full.thenAsk}</NoteCard>}
          {full.sayThis && <NoteCard title="Say this tonight" quote>{full.sayThis}</NoteCard>}
          {full.tryThis && <NoteCard title="Try this at home">{full.tryThis}</NoteCard>}
        </div>

        <div style={{ ...card, background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', padding: 'clamp(20px, 4vw, 28px)' }}>
          <p style={{ ...EYEBROW, marginBottom: 8 }}>The rest of the road</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.35rem, 4vw, 1.7rem)', letterSpacing: '-0.02em', lineHeight: 1.2, color: 'var(--ink)', margin: '0 0 10px' }}>
            Every lesson for your child&rsquo;s age, in order
          </h2>
          <p style={{ ...BODY, marginBottom: 18 }}>
            Three questions about your child and you see where they are on the road to 16, and what comes next.
          </p>
          <Link href="/starter-pack" data-track={`try-${moduleId}-cta`} className="btn btn-gold" style={{ minHeight: 52, fontSize: 'var(--text-md)' }}>
            Find my child&rsquo;s stage
          </Link>
        </div>
      </div>
    </div>
  )
}
