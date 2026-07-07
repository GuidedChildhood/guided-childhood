import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSchool, createClass } from './actions'
import { CURRICULUM } from '@/lib/content/schools-curriculum'

// The educator workspace home: a premium dashboard. Hero greeting, a
// coverage donut, gilded stat tiles, a class leaderboard by coverage, and
// the quick routes. No school yet: a two field setup form. Broken read:
// a repair notice. All three states stay, the happy path goes luxe.

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const card: React.CSSProperties = {
  background: 'var(--warm)', border: '1.5px solid var(--border)',
  borderRadius: '20px', padding: '22px',
}
const input: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: '12px',
  border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)',
  fontSize: '15px', background: '#fff', color: 'var(--ink)',
}
const chunkyButton: React.CSSProperties = {
  display: 'inline-block', padding: '12px 22px', borderRadius: '16px',
  background: 'var(--gold)', color: 'var(--ink)', border: 'none',
  boxShadow: '0 5px 0 var(--gold-hover, #E3B53A)', cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
}
const panel: React.CSSProperties = {
  background: '#fff', border: '1px solid var(--border)', borderRadius: '24px',
  padding: '24px', boxShadow: '0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28)',
}

function ErrorBox({ message }: { message?: string }) {
  if (!message) return null
  return (
    <div style={{
      background: 'var(--coral-lt)', border: '2px solid var(--coral)', borderRadius: '16px',
      padding: '14px 18px', marginBottom: '20px', fontFamily: 'var(--font-body)',
      fontSize: '14px', color: 'var(--coral-dark, #8F3F04)', lineHeight: 1.6, overflowWrap: 'anywhere',
    }}>
      <strong style={{ display: 'block', marginBottom: '4px' }}>Something went wrong</strong>
      {message}
    </div>
  )
}

// A premium coverage donut, drawn server side. Gold progress arc on a
// faint track, the big percentage centred.
function CoverageDonut({ pct }: { pct: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  const filled = Math.max(0, Math.min(1, pct)) * c
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" role="img" aria-label={`${Math.round(pct * 100)} percent of modules delivered`}>
      <defs>
        <linearGradient id="gc-donut" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gold, #F2C94C)" />
          <stop offset="100%" stopColor="var(--coral, #D4600A)" />
        </linearGradient>
      </defs>
      <circle cx="75" cy="75" r={r} fill="none" stroke="var(--border)" strokeWidth="14" opacity="0.5" />
      <circle
        cx="75" cy="75" r={r} fill="none" stroke="url(#gc-donut)" strokeWidth="14"
        strokeLinecap="round" strokeDasharray={`${filled} ${c}`} transform="rotate(-90 75 75)"
      />
      <text x="75" y="72" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="30" fill="var(--ink)">
        {Math.round(pct * 100)}%
      </text>
      <text x="75" y="92" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="0.1em" fill="var(--ink-muted)">
        DELIVERED
      </text>
    </svg>
  )
}

export default async function EducatorHome({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error: errorMessage } = await searchParams

  const { data: membership, error: membershipError } = await supabase
    .from('school_educators')
    .select('school_id, role, display_name')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  const { data: schoolRow, error: schoolError } = membership
    ? await supabase
        .from('school_accounts')
        .select('name, phase, licence_tier')
        .eq('id', membership.school_id)
        .maybeSingle()
    : { data: null, error: null }

  const combinedError = [
    errorMessage,
    membershipError ? `Loading your membership failed: ${membershipError.message}` : null,
    schoolError ? `Loading your school failed: ${schoolError.message} (code ${schoolError.code ?? 'unknown'})` : null,
  ].filter(Boolean).join(' · ')

  if (!membership) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '48px 20px' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div style={eyebrow}>Guided Childhood Schools</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', color: 'var(--ink)', letterSpacing: '-0.01em', margin: '8px 0 10px' }}>
            Set up your school
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '24px' }}>
            Two fields and you are in. You become the school lead; colleagues can be added later.
          </p>
          <ErrorBox message={combinedError || undefined} />
          <form action={createSchool} style={{ ...card, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
              School name
              <input name="name" required placeholder="St Example Primary" style={{ ...input, marginTop: '6px' }} />
            </label>
            <label style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
              Phase
              <select name="phase" style={{ ...input, marginTop: '6px' }}>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="all_through">All through</option>
                <option value="special">Special</option>
                <option value="other">Other</option>
              </select>
            </label>
            <button type="submit" style={chunkyButton}>Create school</button>
          </form>
        </div>
      </main>
    )
  }

  const school = schoolRow as { name: string; phase: string; licence_tier: string } | null

  if (!school) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '48px 20px' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div style={eyebrow}>Guided Childhood Schools</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem, 4.5vw, 1.9rem)', color: 'var(--ink)', margin: '8px 0 12px' }}>
            Your school exists but cannot be read
          </h1>
          <ErrorBox message={combinedError || `Your educator record was found (school id ${membership.school_id}) but the school row came back empty with no error. Run migration 028_membership_functions.sql in the Supabase SQL Editor, then reload this page.`} />
        </div>
      </main>
    )
  }

  const [{ data: classes }, { data: lessons }, { count: pupilCount }] = await Promise.all([
    supabase.from('school_classes').select('id, name, year_group, class_code').eq('school_id', membership.school_id).order('created_at'),
    supabase.from('school_lessons').select('id, module_id, title, key_stage, year_band, single_action_outcome').order('sort_order'),
    supabase.from('pupils').select('id', { count: 'exact', head: true }),
  ])

  const classIds = (classes ?? []).map(c => c.id)
  const { data: deliveries } = classIds.length
    ? await supabase.from('lesson_deliveries').select('lesson_id, class_id').in('class_id', classIds)
    : { data: [] as { lesson_id: string; class_id: string }[] }

  const taughtByClass = new Map<string, Set<string>>()
  for (const d of deliveries ?? []) {
    if (!taughtByClass.has(d.class_id)) taughtByClass.set(d.class_id, new Set())
    taughtByClass.get(d.class_id)!.add(d.lesson_id)
  }
  const nextLesson = (classId: string) =>
    (lessons ?? []).find(l => !taughtByClass.get(classId)?.has(l.id))

  const liveCount = (lessons ?? []).length
  const modulesTaught = new Set((deliveries ?? []).map(d => d.lesson_id)).size

  // Coverage per class, for the donut (average) and the leaderboard.
  const classCoverage = (classes ?? []).map(c => ({
    ...c,
    taught: taughtByClass.get(c.id)?.size ?? 0,
    pct: liveCount ? (taughtByClass.get(c.id)?.size ?? 0) / liveCount : 0,
    next: nextLesson(c.id),
  })).sort((a, b) => b.taught - a.taught)
  const overallPct = classCoverage.length
    ? classCoverage.reduce((s, c) => s + c.pct, 0) / classCoverage.length
    : 0

  const stats = [
    { figure: String((classes ?? []).length), label: (classes ?? []).length === 1 ? 'class' : 'classes', tint: 'var(--green-lt)', ink: 'var(--green-dark)' },
    { figure: String(pupilCount ?? 0), label: 'pupils', tint: 'var(--stage-2)', ink: 'var(--terracotta)' },
    { figure: String((deliveries ?? []).length), label: 'lessons taught', tint: 'var(--stage-1)', ink: 'var(--coral-dark, #8F3F04)' },
    { figure: `${modulesTaught}/${liveCount}`, label: 'modules covered', tint: 'var(--gold-lt, #FDF4D9)', ink: 'var(--gold-dark, #7A5A0E)' },
  ]

  const savedName = (membership.display_name ?? '').trim()
  const firstName = savedName || (user.email ?? '').split('@')[0].split('.')[0]
  const greetName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : 'there'

  const QUICK = [
    { href: '/educator/curriculum', emoji: '🗺️', title: 'Curriculum map', sub: 'All 21 modules, live coverage' },
    { href: '/educator/print', emoji: '🖨️', title: 'Print room', sub: 'Packs, booklets, quizzes' },
    { href: '/educator/reports', emoji: '📊', title: 'Reports', sub: 'Coverage for governors' },
    { href: '/educator/hub', emoji: '📋', title: 'The Hub', sub: 'Compliance and CPD' },
  ]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '28px 20px 90px' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <ErrorBox message={combinedError || undefined} />

        {/* Hero + coverage donut */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(240px, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            ...panel, position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--deep-teal, #173C46) 0%, #12313a 100%)',
            border: 'none', color: '#fff',
          }}>
            <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,201,76,0.28) 0%, transparent 70%)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ ...eyebrow, color: 'rgba(255,255,255,0.6)' }}>
                {school.licence_tier === 'pilot' ? 'Pilot workspace' : 'Licensed workspace'} · {school.name}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 4.5vw, 2.3rem)', letterSpacing: '-0.02em', margin: '10px 0 8px' }}>
                Hi {greetName} 👋
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: '440px', marginBottom: '20px' }}>
                {classCoverage.length === 0
                  ? 'Add your first class below and the whole programme opens up: teach, print and record in one place.'
                  : classCoverage[0]?.next
                    ? <>Ready when you are. Next up for {classCoverage[0].name}: <strong style={{ color: '#fff' }}>{classCoverage[0].next.title}</strong>.</>
                    : 'Every live module delivered across your classes. New modules light up as they ship.'}
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {classCoverage[0]?.next && (
                  <Link href={`/educator/classes/${classCoverage[0].id}/lesson/${classCoverage[0].next.module_id}`} style={{ ...chunkyButton, textDecoration: 'none' }}>
                    Teach the next lesson
                  </Link>
                )}
                <Link href="/educator/curriculum" style={{
                  display: 'inline-block', padding: '12px 22px', borderRadius: '16px',
                  background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.28)',
                  textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
                }}>
                  See the curriculum
                </Link>
              </div>
            </div>
          </div>

          <div style={{ ...panel, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <div style={{ ...eyebrow, alignSelf: 'flex-start' }}>Programme coverage</div>
            <CoverageDonut pct={overallPct} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.5 }}>
              Average across {classCoverage.length || 'your'} class{classCoverage.length === 1 ? '' : 'es'}, of {liveCount} live module{liveCount === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        {/* Gilded stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          {stats.map(s => (
            <div key={s.label} style={{ ...panel, padding: '18px 20px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: s.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: s.ink }} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.9rem', color: 'var(--ink)', lineHeight: 1.05 }}>{s.figure}</div>
              <div style={{ ...eyebrow, marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick routes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          {QUICK.map(q => (
            <Link key={q.href} href={q.href} style={{ ...panel, padding: '18px 20px', textDecoration: 'none', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', flexShrink: 0 }}>{q.emoji}</span>
              <span>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>{q.title}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-muted)' }}>{q.sub}</span>
              </span>
            </Link>
          ))}
        </div>

        {/* Two columns: class leaderboard + live modules */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)', gap: '16px', alignItems: 'start' }}>
          {/* Class leaderboard by coverage */}
          <div style={panel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ ...eyebrow, color: 'var(--green-dark)' }}>Your classes</div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)' }}>Ranked by coverage</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {classCoverage.map((c, i) => (
                <Link key={c.id} href={`/educator/classes/${c.id}`} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none',
                  padding: '12px 14px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--warm)',
                }}>
                  <span style={{
                    width: '28px', height: '28px', borderRadius: '9px', flexShrink: 0,
                    background: i === 0 ? 'var(--gold)' : 'var(--cream)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '13px', color: 'var(--ink)',
                  }}>{i + 1}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)' }}>
                        {c.name} <span style={{ fontWeight: 600, color: 'var(--ink-muted)', fontSize: '12.5px' }}>{c.year_group}</span>
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, color: 'var(--green-dark)' }}>{c.taught}/{liveCount}</span>
                    </span>
                    <span style={{ display: 'block', height: '6px', borderRadius: '6px', background: 'var(--border)', overflow: 'hidden', marginTop: '6px' }}>
                      <span style={{ display: 'block', height: '100%', width: `${Math.round(c.pct * 100)}%`, borderRadius: '6px', background: 'linear-gradient(90deg, var(--gold), var(--coral))' }} />
                    </span>
                  </span>
                </Link>
              ))}
              {classCoverage.length === 0 && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-muted)' }}>No classes yet. Add your first below.</p>
              )}
            </div>

            <details style={{ marginTop: '16px' }}>
              <summary style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--green-dark)', cursor: 'pointer' }}>+ Add a class</summary>
              <form action={createClass} style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="hidden" name="school_id" value={membership.school_id} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>
                    Class name
                    <input name="name" required placeholder="8B" style={{ ...input, marginTop: '6px' }} />
                  </label>
                  <label style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>
                    Year group
                    <input name="year_group" required placeholder="Year 8" style={{ ...input, marginTop: '6px' }} />
                  </label>
                </div>
                <label style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>
                  Pupils, one per line, first name and initial only
                  <textarea name="pupils" rows={5} placeholder={'Amara K\nBen T\nChloe M'} style={{ ...input, marginTop: '6px', resize: 'vertical' }} />
                </label>
                <button type="submit" style={chunkyButton}>Create class</button>
              </form>
            </details>
          </div>

          {/* Live modules */}
          <div style={panel}>
            <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '16px' }}>Live now</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(lessons ?? []).map(l => (
                <div key={l.id} style={{ padding: '14px 16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--warm)' }}>
                  <div style={{ ...eyebrow, marginBottom: '5px' }}>{l.key_stage} · {l.year_band}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', marginBottom: '10px', lineHeight: 1.3 }}>{l.title}</div>
                  <span style={{ display: 'flex', gap: '16px' }}>
                    <Link href={`/educator/teach/${l.module_id}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--green-dark)', textDecoration: 'none' }}>
                      Teach →
                    </Link>
                    <Link href={`/educator/print/${l.module_id}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--gold-dark)', textDecoration: 'none' }}>
                      Print pack →
                    </Link>
                  </span>
                </div>
              ))}
              {(lessons ?? []).length === 0 && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-muted)' }}>Run the migrations and the lessons appear here.</p>
              )}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink-light)', marginTop: '14px', lineHeight: 1.55 }}>
              {liveCount} of {CURRICULUM.length} modules live. The rest are on the curriculum map and light up as each ships.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
