import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// The parent's side of the telling card.
//
// The passport review found "what to report to a parent" existing only as
// scattered implication across a few lessons, with nothing at all on what
// happens after a child tells. Migration 163 wrote that card, one per stage,
// and put it on the child's own screen. This page shows the parent the same
// words, which is the point rather than a convenience.
//
// A promise the app makes to a child on a parent's behalf is worth nothing.
// The child app tells a ten year old that their grown up will not take the
// tablet away just for telling them something. If the parent has never read
// that sentence, the first time it is tested is the first time they hear it,
// and the child learns the app lied. So the same card renders on both sides,
// and the parent sees the wording their child has been given.
//
// DELIBERATELY NOT PAYWALLED. Every other script in the library sits behind
// the membership and should. This one is the sextortion card, the self harm
// card and the stranger contact card, and a child in that situation does not
// know whether their parent renewed. It sits with the daily path and the
// check ins as the part that never runs out.

export const dynamic = 'force-dynamic'

const STAGE_META = {
  foundation:  { num: 1, label: 'Foundation',  ages: 'Ages 4 to 7',       bg: 'var(--stage-1)' },
  builder:     { num: 2, label: 'Builder',     ages: 'Ages 8 to 10',      bg: 'var(--stage-2)' },
  explorer:    { num: 3, label: 'Explorer',    ages: 'Ages 11 to 13',     bg: 'var(--stage-3)' },
  shaper:      { num: 4, label: 'Shaper',      ages: 'Ages 13 to 15',     bg: 'var(--stage-4)' },
  independent: { num: 5, label: 'Independent', ages: 'Ages 16 and above', bg: 'var(--stage-5)' },
} as const

type StageId = keyof typeof STAGE_META

type Card = {
  stage_id: StageId
  headline: string
  intro: string
  tell_now: string[]
  tell_soon: string[]
  what_happens: { step: string; detail: string }[]
  the_promise: string
  never: string
}

type ChildScript = {
  id: string
  stage_id: StageId
  title: string
  emoji: string
  say_this: string
  urgent: boolean
}

const label = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const }

function CardBody({ card, scripts }: { card: Card; scripts: ChildScript[] }) {
  return (
    <div>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
        {card.intro}
      </p>

      <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '16px', padding: '15px 16px', marginBottom: '16px' }}>
        <div style={{ ...label, color: 'var(--terracotta-dark)', marginBottom: '6px' }}>The promise your child has read</div>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.35, margin: 0 }}>
          {card.the_promise}
        </p>
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '18px' }}>
        <div>
          <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '8px' }}>They tell you straight away</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {card.tell_now.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', padding: '7px 0' }}>
                <span aria-hidden style={{ flexShrink: 0 }}>🔴</span>
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.45, fontWeight: 600 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '8px' }}>They tell you when it is quiet</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {card.tell_soon.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', padding: '7px 0' }}>
                <span aria-hidden style={{ flexShrink: 0 }}>🟡</span>
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '10px' }}>What you have promised happens next</div>
      <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
        {card.what_happens.map((w, i) => (
          <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--tint-sage)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)' }}>
              {i + 1}
            </span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>{w.step}</span>
              <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '2px' }}>{w.detail}</span>
            </span>
          </li>
        ))}
      </ol>

      <div style={{ background: '#fff', border: '1.5px dashed var(--border)', borderRadius: '14px', padding: '13px 15px', marginBottom: '20px' }}>
        <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '5px' }}>What you have promised will not happen</div>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
          {card.never}
        </p>
      </div>

      {scripts.length > 0 && (
        <div>
          <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '4px' }}>The words they have, in their own app</div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
            If one of these ever gets read out to you, they will have practised it first. Knowing the wording means you will recognise it.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {scripts.map(s => (
              <details key={s.id} style={{ background: '#fff', border: s.urgent ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
                <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '11px', padding: '12px 14px' }}>
                  <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-lg)' }}>{s.emoji}</span>
                  <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>
                    {s.title}
                  </span>
                  {s.urgent && (
                    <span style={{ ...label, flexShrink: 0, color: 'var(--terracotta-dark)' }}>Urgent</span>
                  )}
                  <span aria-hidden style={{ flexShrink: 0, color: 'var(--ink-muted)' }}>›</span>
                </summary>
                <div style={{ padding: '0 14px 14px 40px' }}>
                  <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                    “{s.say_this}”
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default async function TellAParentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: child }, { data: cardRows }, { data: scriptRows }] = await Promise.all([
    supabase.from('children').select('name, stage_id').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
    supabase.from('tell_a_parent_cards').select('stage_id, headline, intro, tell_now, tell_soon, what_happens, the_promise, never').eq('active', true).order('sort_order', { ascending: true }),
    supabase.from('child_scripts').select('id, stage_id, title, emoji, say_this, urgent').eq('active', true).order('sort_order', { ascending: true }),
  ])

  const cards = (cardRows ?? []) as Card[]
  const scripts = (scriptRows ?? []) as ChildScript[]
  const currentStageId = (child?.stage_id as StageId) ?? null
  const childName = child?.name && child.name !== 'Your child' ? child.name : ''

  const theirs = cards.find(c => c.stage_id === currentStageId) ?? null
  const others = cards.filter(c => c.stage_id !== currentStageId)

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Conversation tools</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px' }}>
          What they tell you, and what you do
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-md)' }}>
          Every other script here is you starting the conversation. This one is them. {childName ? `${childName} has` : 'Your child has'} these words in their own app, along with a promise about how you will react. This is that promise, so you have read it too.
        </p>
      </div>

      <div style={{ background: 'var(--stage-5)', borderRadius: '16px', padding: '16px 18px', marginBottom: '24px' }}>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
          The hard part is not the words. It is that a child weighs telling you against losing the phone, and if nobody has said out loud what happens next, the answer they assume is that it gets taken away. So they say nothing, and you hear about it much later. The promise below is what changes that maths, and it only works if you keep it on the day it is tested.
        </p>
      </div>

      {theirs && (
        <section style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span style={{ ...label, fontWeight: 600, color: 'var(--ink)', background: STAGE_META[theirs.stage_id].bg, padding: '4px 10px', borderRadius: '100px' }}>
              Stage {STAGE_META[theirs.stage_id].num}: {STAGE_META[theirs.stage_id].label}
            </span>
            <span style={{ ...label, fontWeight: 600, color: 'var(--ink-light)' }}>{STAGE_META[theirs.stage_id].ages}</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 10px' }}>
            {theirs.headline}
          </h2>
          <CardBody card={theirs} scripts={scripts.filter(s => s.stage_id === theirs.stage_id)} />
        </section>
      )}

      {/* The stages either side, folded. A parent with an eleven year old is
          often reading ahead to what lands at thirteen, and the wording changes
          a lot between the two. */}
      {others.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '10px' }}>
            {theirs ? 'The other stages' : 'Every stage'}
          </div>
          {others.map(c => (
            <details key={c.stage_id} style={{ marginBottom: '10px' }}>
              <summary style={{ cursor: 'pointer', listStyle: 'none', padding: '11px 14px', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 14, display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ ...label, fontWeight: 600, color: 'var(--ink)', background: STAGE_META[c.stage_id].bg, padding: '4px 10px', borderRadius: '100px' }}>
                  Stage {STAGE_META[c.stage_id].num}: {STAGE_META[c.stage_id].label}
                </span>
                <span style={{ ...label, fontWeight: 600, color: 'var(--ink-light)' }}>{STAGE_META[c.stage_id].ages}</span>
              </summary>
              <div style={{ padding: '16px 2px 4px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 10px' }}>
                  {c.headline}
                </h3>
                <CardBody card={c} scripts={scripts.filter(s => s.stage_id === c.stage_id)} />
              </div>
            </details>
          ))}
        </section>
      )}

      <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '18px 20px' }}>
        <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '6px' }}>Where they find it</div>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 12px' }}>
          Telling a grown up sits on their own quest screen, under the tiles. They do not need you to send it, which is the point of it being there.
        </p>
        <Link href="/dashboard/scripts" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
          Back to the scripts library ›
        </Link>
      </div>
    </div>
  )
}
