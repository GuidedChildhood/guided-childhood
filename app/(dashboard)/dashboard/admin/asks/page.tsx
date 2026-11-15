import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ONBOARDING_TO_SLUG } from '@/lib/concerns/baseline'
import { ASK_QUESTIONS } from '@/lib/asks/stalled'

// Founder only. What are parents actually asking us for that we do not have?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// Justin, 9 September 2026: "can we also report when we get asked common
// related questions here to an analytics page, so we think about common asks
// and problems from parents to look to add in future... as well as letting me
// know via the analytics page."
//
// The quiz offers nine worries and a Something else box. Which nine is the
// single highest leverage content decision in the product: every tile has a
// pathway, scripts and a stage by stage answer written by hand behind it, so
// adding one is weeks of work and picking the wrong one is weeks wasted. Until
// today that list came from judgement.
//
// It does not have to. Two places already hold what families actually say:
//
//   1. profiles.onboarding_answers.challenge_other, what they TYPE at the quiz
//      when none of the nine fits. A worry someone typed by hand, before they
//      had an account, is the strongest signal of demand in the product.
//   2. The concerns ledger, which has accepted free form slugs since August.
//      DiGi, the moments deck and Right now all write them, so it already
//      holds worries nobody designed a tile for. times_flagged says how often
//      a family came back to the same one, which separates a passing annoyance
//      from a thing that runs their week.
//
// Neither was ever read. This page reads both and ranks them, so the tenth
// worry we build is chosen from what parents raised rather than from what we
// assumed they would.
//
// ── WHAT IT DELIBERATELY DOES NOT DO ────────────────────────────────────────
//
// It does not aggregate across families into a "top asks" chart with counts
// presented as a metric. At nineteen profiles that would be a chart made of
// noise, and a chart invites a decision the sample cannot support. It lists the
// raw words instead, most repeated first, because at this size reading twenty
// parents' actual sentences is better evidence than any average of them.

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
}

/** Every slug one of the nine tiles already owns, so we can spot the rest. */
const COVERED = new Set(Object.values(ONBOARDING_TO_SLUG))

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--lift)', padding: '14px 16px 16px', marginBottom: 14,
    }}>
      {children}
    </div>
  )
}

export default async function AsksPage() {
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) redirect('/dashboard')

  const admin = createAdminClient()
  const [{ data: profiles }, { data: concerns }] = await Promise.all([
    admin.from('profiles').select('id, onboarding_answers, created_at').order('created_at', { ascending: false }),
    admin.from('concerns').select('slug, label, times_flagged, created_at'),
  ])

  // 0. What a parent who stopped told us (15 November 2026). Read on its own
  //    and allowed to fail quietly, so a database without migration 397 still
  //    shows the rest of the page. Newest parent first, their answers together.
  const { data: answerRows } = await admin
    .from('parent_answers')
    .select('user_id, question, answer, updated_at')
    .order('updated_at', { ascending: false })
    .limit(200)
  const labelOf = new Map(ASK_QUESTIONS.map(q => [q.key, q.label]))
  const whoIds = [...new Set((answerRows ?? []).map(a => a.user_id as string))]
  const { data: whoRows } = whoIds.length
    ? await admin.from('profiles').select('id, full_name').in('id', whoIds)
    : { data: [] as { id: string; full_name: string | null }[] }
  const nameOf = new Map((whoRows ?? []).map(w => [w.id as string, String(w.full_name ?? '').split(' ')[0] || 'A parent']))
  const stopped = whoIds.map(id => ({
    id,
    name: nameOf.get(id) ?? 'A parent',
    answers: ASK_QUESTIONS
      .map(q => (answerRows ?? []).find(a => a.user_id === id && a.question === q.key))
      .filter((a): a is NonNullable<typeof a> => Boolean(a)),
  }))

  // 1. Typed at the quiz, when none of the nine fitted.
  const typed = (profiles ?? [])
    .map(p => ({
      words: String((p.onboarding_answers as { challenge_other?: string } | null)?.challenge_other ?? '').trim(),
      at: p.created_at as string,
    }))
    .filter(t => t.words.length > 1)

  // 2. Raised anywhere in the product, on a slug no tile owns.
  const uncovered = new Map<string, { label: string; families: number; flags: number }>()
  for (const c of concerns ?? []) {
    const slug = String(c.slug ?? '')
    if (!slug || COVERED.has(slug)) continue
    const row = uncovered.get(slug) ?? { label: String(c.label ?? slug), families: 0, flags: 0 }
    row.families += 1
    row.flags += Number(c.times_flagged ?? 0)
    uncovered.set(slug, row)
  }
  // Families first, then how hard it bit the families who had it.
  const ranked = [...uncovered.entries()]
    .sort((a, b) => (b[1].families - a[1].families) || (b[1].flags - a[1].flags))

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 18px 60px' }}>
      <Link href="/dashboard/admin/health" style={{ ...MONO, color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ← Admin
      </Link>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--ink)', margin: '10px 0 6px' }}>
        What parents ask for
      </h1>
      <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.55, color: 'var(--ink-soft)', margin: '0 0 24px' }}>
        The worries families raised that no tile covers. This is the list the tenth
        worry should be chosen from.
      </p>

      {stopped.length > 0 && (
        <>
          <p style={{ ...MONO, margin: '0 0 10px' }}>Parents who stopped, in their words</p>
          {stopped.map(parent => (
            <Card key={parent.id}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 8px' }}>{parent.name}</p>
              {parent.answers.map(a => (
                <p key={a.question as string} style={{ fontSize: 'var(--text-md)', lineHeight: 1.5, color: 'var(--ink)', margin: '0 0 8px' }}>
                  <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>{labelOf.get(a.question as string) ?? a.question}</span>
                  {a.answer as string}
                </p>
              ))}
            </Card>
          ))}
          <div style={{ height: 18 }} />
        </>
      )}

      {/* ── TYPED AT THE QUIZ ─────────────────────────────────────────────── */}
      <div style={{ ...MONO, marginBottom: 10 }}>
        Typed into Something else · {typed.length}
      </div>
      {typed.length === 0 ? (
        <Card>
          <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 'var(--text-md)' }}>
            Nobody has typed one yet. Worth checking again in a fortnight rather than
            concluding the nine are complete.
          </p>
        </Card>
      ) : (
        typed.map((t, i) => (
          <Card key={i}>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.3 }}>
              {t.words}
            </p>
            <p style={{ ...MONO, margin: '7px 0 0', color: 'var(--ink-muted)' }}>
              {new Date(t.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </Card>
        ))
      )}

      {/* ── RAISED IN THE PRODUCT ─────────────────────────────────────────── */}
      <div style={{ ...MONO, margin: '30px 0 10px' }}>
        Raised in the product, no tile for it · {ranked.length}
      </div>
      <div style={{
        background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--lift)', overflow: 'hidden',
      }}>
        {ranked.length === 0 && (
          <p style={{ margin: 0, padding: '14px 16px', color: 'var(--ink-soft)', fontSize: 'var(--text-md)' }}>
            Nothing outside the nine yet.
          </p>
        )}
        {ranked.map(([slug, r], i) => (
          <div key={slug} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px',
            borderTop: i === 0 ? 'none' : '1.5px solid var(--border)',
            background: r.families > 1 ? 'var(--terracotta-lt)' : '#fff',
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                {r.label}
              </div>
              <div style={{ ...MONO, color: 'var(--ink-muted)', marginTop: 2, letterSpacing: '.06em' }}>
                {slug}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>
                {r.families}
              </div>
              <div style={{ ...MONO, color: 'var(--ink-muted)' }}>
                {r.families === 1 ? 'family' : 'families'}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 62 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>
                {r.flags}
              </div>
              <div style={{ ...MONO, color: 'var(--ink-muted)' }}>
                raised
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.55, color: 'var(--ink-soft)', margin: '18px 0 0' }}>
        Shaded rows are the ones more than one family raised. A high raised count on a
        single family is a worry that ran their week, which is worth a script even when
        it is not worth a tile.
      </p>
    </div>
  )
}
