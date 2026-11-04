import type { Metadata } from 'next'
import Link from 'next/link'
import { DELIVERY, WORKSHOPS, WORKSHOPS_LAUNCHED } from '@/lib/workshops'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'
import WorkshopForm from './WorkshopForm'

// THE WORKSHOPS PAGE (4 November 2026, phase 3 of the workshop audit). A
// school asks for a visit here; nothing is booked or charged until Justin
// replies. Every line about a workshop says what pupils will DO, never what a
// school found, because none has been delivered yet. The safeguarding answers
// are promises that hold whether or not the DBS certificate has arrived
// ("before any visit is confirmed"), so the page can never say something that
// is not true on the day it is read.
//
// Hidden until launch: noindex and linked from nowhere while
// WORKSHOPS_LAUNCHED is false (lib/workshops.ts), because the audit holds all
// workshop marketing until the DBS check and insurance are in hand.

export const metadata: Metadata = {
  title: 'Workshops in school',
  description: 'Guided Childhood workshops for Years 3 to 11: one visit, pupils who practise what ready looks like online, and a sheet that tells parents what to say tonight.',
  alternates: { canonical: 'https://schools.guidedchildhood.com/workshops' },
  robots: WORKSHOPS_LAUNCHED ? undefined : { index: false, follow: false },
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}
const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7,
}
const h2: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.section, color: 'var(--ink)', margin: '0 0 var(--space-3)',
}
const card: React.CSSProperties = {
  background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 'clamp(18px, 3vw, 24px)',
}
const tick: React.CSSProperties = { color: 'var(--terracotta-dark)', fontWeight: 900, flexShrink: 0 }

function Ticks({ lines }: { lines: string[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {lines.map(line => (
        <li key={line} style={{ ...body, fontSize: 'var(--text-base)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
          <span aria-hidden style={tick}>✓</span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Who stays in the room?',
    a: 'The class teacher, for every minute of every session. Justin is never left alone with pupils, and the workshop follows your safeguarding policy and your DSL, not ours.',
  },
  {
    q: 'DBS and insurance',
    a: 'You get the enhanced DBS certificate details and the public liability certificate before any visit is confirmed, so your office can check them in advance.',
  },
  {
    q: 'Will any pupil have to talk about their own life online?',
    a: 'No. Every activity uses invented scenarios or anonymous answers, and nobody is asked whether they own a phone. A quiet opt out is agreed with the class teacher beforehand, and your DSL gets a brief before the day.',
  },
  {
    q: 'What if a pupil tells Justin something?',
    a: 'He listens, does not promise to keep it secret, does not ask questions, writes down the exact words and passes it to your DSL the same day. We ask who your DSL is before the visit, so there is no doubt on the day.',
  },
  {
    q: 'Pupils with additional needs',
    a: 'Every workshop is built from lessons that carry SEND adaptations and a paper version of each activity. Tell us beforehand and the session is adjusted.',
  },
  {
    q: 'What data do you collect?',
    a: 'From pupils, nothing: no names, no photos, no accounts. From you, only what is in the enquiry, used to reply. The privacy notice says how.',
  },
  {
    q: 'Who is Justin?',
    a: 'Justin Phillips, a parent of three and the founder of Guided Childhood. He is not a qualified teacher, which is why the class teacher stays in the room and the workshops are built from lessons with a word for word script.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on how many classes on the day and whether a parent session is added, so the reply carries a quote. Nothing is charged by sending the form.',
  },
]

export default async function WorkshopsPage({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const preselect = (await searchParams).w ?? null

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* 1. The promise, and who is making it. */}
        <section style={{ maxWidth: '760px', marginBottom: 'clamp(36px, 6vw, 64px)' }}>
          <p style={{ ...eyebrow, marginBottom: '12px' }}>Workshops in school · Years 3 to 11</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.hero, color: 'var(--ink)', marginBottom: 'var(--space-4)', textWrap: 'balance' }}>
            One visit. Pupils practise what ready looks like online, and parents get the words for tonight.
          </h1>
          <p style={{ ...body, ...PAGE.lead, color: 'var(--ink-soft)', marginBottom: 'var(--space-4)' }}>
            Justin Phillips, founder of Guided Childhood and a parent of three, teaches one class at a time with the class teacher in the room. Each workshop is built from the lessons in the Guided Childhood scheme, and the class takes home a plan and a sheet for parents.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <a href="#enquire" className="btn btn-gold">Ask about a workshop</a>
            <a href="?w=b#enquire" className="btn btn-outline">Ask about the Year 5 to 6 one</a>
          </div>
        </section>

        {/* 2. The four workshops. */}
        <section aria-labelledby="ws-four" style={{ marginBottom: 'clamp(36px, 6vw, 64px)' }}>
          <h2 id="ws-four" style={h2}>Four workshops, one for each stage</h2>
          <p style={{ ...body, maxWidth: '680px', marginBottom: 'var(--space-5)' }}>
            Each runs for 45 or 60 minutes. These are the three things pupils do in the room.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            {WORKSHOPS.map(w => (
              <article key={w.id} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', border: w.flagship ? '2px solid var(--terracotta)' : card.border }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ ...eyebrow, color: 'var(--ink-muted)' }}>{w.years}</span>
                  {w.flagship && (
                    <span style={{ ...eyebrow, fontSize: '0.68rem', color: 'var(--stage-1-text)', background: 'var(--stage-1)', border: '1px solid var(--stage-1-bold)', borderRadius: 'var(--radius-pill)', padding: '3px 9px' }}>
                      The flagship
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: 0, lineHeight: 1.2 }}>{w.title}</h3>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em' }}>{w.minutes}</div>
                <div style={{ flex: 1 }}><Ticks lines={[...w.does]} /></div>
                <a href={`?w=${w.id}#enquire`} style={{ fontFamily: 'var(--font-body)', fontWeight: 800, color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
                  Ask about this one →
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* 3. What the class gets and what the teacher gets. */}
        <section aria-labelledby="ws-gets" style={{ marginBottom: 'clamp(36px, 6vw, 64px)' }}>
          <h2 id="ws-gets" style={h2}>What everyone takes away</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={card}>
              <p style={{ ...eyebrow, color: 'var(--ink-muted)', marginBottom: 'var(--space-3)' }}>Pupils</p>
              <Ticks lines={[
                'Scenarios with invented names, so nobody shares their own story',
                'A one page takeaway: their plan and three places to get help',
                'The words to use, practised out loud, not just heard',
              ]} />
            </div>
            <div style={card}>
              <p style={{ ...eyebrow, color: 'var(--ink-muted)', marginBottom: 'var(--space-3)' }}>The school</p>
              <Ticks lines={[
                'A brief for your DSL before the day',
                'Teacher notes and the SEND adaptations',
                'A follow up sheet for parents, with the questions to ask at the dinner table',
                'A short feedback form after the session',
              ]} />
            </div>
          </div>
        </section>

        {/* 4. Curriculum, and how it is delivered. */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)', marginBottom: 'clamp(36px, 6vw, 64px)' }}>
          <div>
            <h2 style={h2}>Curriculum links</h2>
            <p style={body}>
              Each workshop is drawn from lessons mapped requirement by requirement to the revised RSHE statutory guidance, and strand by strand to Education for a Connected World, so a workshop supports a school to evidence coverage of the same lines. The mapping is open to read:{' '}
              <Link href="/hub/rshe-mapping" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the RSHE mapping</Link>.
            </p>
          </div>
          <div>
            <h2 style={h2}>How it is delivered</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {DELIVERY.map(d => (
                <li key={d.key} style={body}>
                  <strong style={{ color: 'var(--ink)' }}>{d.label}.</strong> {d.line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. Founding schools, then the form. */}
        <section id="enquire" aria-labelledby="ws-enquire" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'start', marginBottom: 'clamp(36px, 6vw, 64px)', scrollMarginTop: '90px' }}>
          <div>
            <p style={{ ...eyebrow, marginBottom: '12px' }}>Founding schools</p>
            <h2 id="ws-enquire" style={h2}>Ask about a workshop</h2>
            <p style={{ ...body, marginBottom: 'var(--space-3)' }}>
              The first five schools get a founding rate. In return we ask for the short feedback form after the session, a twenty minute call, and your written permission before anything about your school is ever quoted.
            </p>
            <p style={{ ...body, marginBottom: 'var(--space-3)' }}>
              Sending the form books nothing and charges nothing. Justin replies within two working days, usually the same day, with a quote or a time to talk.
            </p>
            <p style={{ ...body, fontSize: 'var(--text-base)' }}>
              Want to see the standard first? <Link href="/curriculum" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Open the curriculum</Link>: the sample lesson is the real thing, nothing locked.
            </p>
          </div>
          <WorkshopForm preselect={preselect} />
        </section>

        {/* 6. The questions a school asks before it says yes. */}
        <section aria-labelledby="ws-faq" style={{ maxWidth: '760px' }}>
          <h2 id="ws-faq" style={h2}>Before you ask</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {FAQ.map(f => (
              <details key={f.q} style={{ ...card, padding: '14px 18px' }}>
                <summary style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', cursor: 'pointer' }}>{f.q}</summary>
                <p style={{ ...body, fontSize: 'var(--text-base)', margin: 'var(--space-2) 0 0' }}>
                  {f.a}
                  {f.q === 'What data do you collect?' && <> <Link href="/privacy" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Read the privacy notice</Link>.</>}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
