import type { Metadata } from 'next'
import Link from 'next/link'
import SharedLessonStart from '@/components/school/SharedLessonStart'
import { parseSlides, visibleSlides } from '@gc/shared/lesson-slides'
import { characterKeyFor, registerFor } from '@gc/shared/friend-register'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sessionUser } from '@/lib/supabase/session'
import { getStarLessonForShare } from '@/lib/quests/star-lesson-catalogue'
import { readParentShare, shareSecret, shareTeaser, shareFull, parentSharePath } from '@/lib/school/share'
import { shortCode } from '@/lib/school/home-code'
import { LandingTop, EYEBROW, BODY } from '@/components/marketing/EmailLanding'

// A LESSON YOUR CHILD'S SCHOOL SHARED (5 November 2026).
//
// Justin: schools share every lesson with parents, and parents see it by
// signing up free, "a secret way to get users". The schools app puts this link
// on every lesson page a school's code opens (schools/lib/parent-share.ts),
// for the newsletter, the class app or the parent note.
//
//   signed out   the lesson's title, what the class learned and the question
//                to ask at home, then the free account door. The rest of the
//                note and the lesson itself are named, not shown.
//   signed in    all of it: the whole parent note and the lesson in the
//                together register. ANY account, free included. Nothing is
//                recorded: no completion, no answers, no child.
//   bad link     nothing about any lesson, and the stage check.
//
// The link is checked before the database is asked anything, and the lesson
// is read by module id from the signed link, never from anything else in the
// address, so editing the URL opens nothing (shared/parent-share.ts).
//
// The DSL note never reaches this page. It is written for a school's
// safeguarding lead, and getStarLessonForShare does not select it.

export const dynamic = 'force-dynamic'

type Params = Promise<{ module: string; token: string }>

async function load(params: Params) {
  const { module: rawModule, token } = await params
  const share = await readParentShare(decodeURIComponent(rawModule), decodeURIComponent(token), shareSecret())
  if (!share) return null
  try {
    const row = await getStarLessonForShare(createAdminClient(), share.moduleId)
    return row ? { share, row, path: parentSharePath(share.moduleId, share.token) } : null
  } catch { return null }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const hit = await load(params)
  const title = hit ? `From school today: ${hit.row.title}` : 'A lesson from your child’s school'
  const description = hit
    ? 'What your child’s class learned today, and one question to ask at home. Free to read with a Guided Childhood account.'
    : 'A lesson link from your child’s school.'
  return {
    title,
    description,
    // A school's link, for its own families. Not for anybody's search index.
    robots: { index: false, follow: false },
    openGraph: { title, description, type: 'article', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Guided Childhood' }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
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

export default async function FromSchoolPage({ params }: { params: Params }) {
  const hit = await load(params)

  if (!hit) {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
        <LandingTop signInHref="/login" />
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px 80px' }}>
          <p style={{ ...EYEBROW, marginBottom: 10 }}>From your child’s school</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 5.4vw, 2.3rem)', letterSpacing: '-0.02em', lineHeight: 1.12, color: 'var(--ink)', margin: '0 0 14px' }}>
            That link did not open a lesson
          </h1>
          <p style={{ ...BODY, marginBottom: 22 }}>
            It may have been cut short when it was copied. Try the link again from the school’s message, or ask the class teacher to send it again.
          </p>
          <Link href="/starter-pack" className="btn btn-gold" style={{ minHeight: 48 }}>Find your child’s stage</Link>
        </div>
      </div>
    )
  }

  const { row, path } = hit
  const teaser = shareTeaser(row)
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  const signInHref = `/login?next=${encodeURIComponent(path)}`

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <LandingTop signInHref={user ? '/dashboard' : signInHref} />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(16px, 4vw, 40px) 20px clamp(64px, 9vw, 96px)' }}>
        <p style={{ ...EYEBROW, marginBottom: 10 }}>From your child’s school{teaser.yearBand ? ` · ${teaser.yearBand}` : ''}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 5.8vw, 2.6rem)', letterSpacing: '-0.025em', lineHeight: 1.1, color: 'var(--ink)', margin: '0 0 22px' }}>
          {teaser.title}
        </h1>

        <div style={{ display: 'grid', gap: 12, marginBottom: 28 }}>
          {teaser.learned && <NoteCard title="What the class learned">{teaser.learned}</NoteCard>}
          {teaser.askAtHome && <NoteCard title="Ask at home tonight" quote>{teaser.askAtHome}</NoteCard>}
        </div>

        {user ? <FullLesson row={row} path={path} /> : <Locked path={path} signInHref={signInHref} />}
      </div>
    </div>
  )
}

/** Behind the account: named, never shown. */
function Locked({ path, signInHref }: { path: string; signInHref: string }) {
  const behind = [
    'The whole lesson, slide by slide, to go through together',
    'What to listen for when you ask',
    'The words to say tonight',
    'Where it sits on your child’s passport',
  ]
  return (
    <div style={{ ...card, background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', padding: 'clamp(20px, 4vw, 28px)' }}>
      <p style={{ ...EYEBROW, marginBottom: 8 }}>The rest of the lesson</p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.35rem, 4vw, 1.7rem)', letterSpacing: '-0.02em', lineHeight: 1.2, color: 'var(--ink)', margin: '0 0 14px' }}>
        Free with a Guided Childhood account
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'grid', gap: 8 }}>
        {behind.map(b => (
          <li key={b} style={{ ...BODY, color: 'var(--ink)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span aria-hidden style={{ color: 'var(--terracotta-dark)', fontWeight: 900 }}>✓</span>{b}
          </li>
        ))}
      </ul>
      {/* Through the start route, which remembers the school and the lesson in
          cookies, then the starter pack with next back to here. */}
      <a href={`${path}/start`} className="btn btn-gold" style={{ minHeight: 52, fontSize: 'var(--text-md)' }}>
        Create your free account
      </a>
      <p style={{ ...BODY, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: 14 }}>
        Three questions about your child, then you come straight back to this lesson. No card. Nothing about your child is shared with the school.
      </p>
      <p style={{ ...BODY, fontSize: 'var(--text-sm)', marginTop: 6 }}>
        Already have an account?{' '}
        <Link href={signInHref} style={{ color: 'var(--ink)', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: 3 }}>Sign in</Link>
      </p>
    </div>
  )
}

/** Everything, for any signed in parent. Records nothing. */
function FullLesson({ row, path }: { row: NonNullable<Awaited<ReturnType<typeof load>>>['row']; path: string }) {
  const full = shareFull(row)
  const slides = visibleSlides(parseSlides(row.slides) ?? [], 'together').slides
  const home = row.home_code ? shortCode(row.home_code) : null
  return (
    <>
      <div style={{ display: 'grid', gap: 12, marginBottom: 32 }}>
        {full.listenFor && <NoteCard title="Listen for">{full.listenFor}</NoteCard>}
        {full.thenAsk && <NoteCard title="Then ask" quote>{full.thenAsk}</NoteCard>}
        {full.sayThis && <NoteCard title="Say this tonight" quote>{full.sayThis}</NoteCard>}
        {full.tryThis && <NoteCard title="Try this at home">{full.tryThis}</NoteCard>}
        {full.passport && <NoteCard title="On the passport">{full.passport}</NoteCard>}
      </div>

      {slides.length > 0 && (
        <section aria-label="The lesson" style={{ marginBottom: 32 }}>
          <p style={{ ...EYEBROW, marginBottom: 8 }}>The lesson</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.35rem, 4vw, 1.7rem)', letterSpacing: '-0.02em', lineHeight: 1.2, color: 'var(--ink)', margin: '0 0 6px' }}>
            Go through it together
          </h2>
          <p style={{ ...BODY, marginBottom: 16 }}>The same lesson the class had, worded for a child and a grown up on one screen. It fills the screen while you go through it, and nothing is saved as you go.</p>
          <SharedLessonStart
            lessonId={row.id}
            slides={slides}
            backHref={path}
            character={characterKeyFor(row.character_cast)}
            register={registerFor(row.key_stage)}
          />
        </section>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        {home ? (
          // The lessons page card picks the code up and asks which child, the
          // same door the QR on the parent note uses (lib/school/home-code.ts).
          <Link href={`/dashboard/lessons?home=${encodeURIComponent(home)}`} className="btn-outline" style={{ minHeight: 48, whiteSpace: 'normal' }}>
            Put it on your child’s passport
          </Link>
        ) : (
          <Link href="/dashboard" className="btn-outline" style={{ minHeight: 48 }}>Go to your account</Link>
        )}
        {home && (
          <Link href="/dashboard" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
            Go to your account
          </Link>
        )}
      </div>
    </>
  )
}
