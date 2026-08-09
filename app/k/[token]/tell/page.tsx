import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import DigiCharacter from '@gc/shared/components/DigiCharacter'

// Telling a grown up: the child's own page, and the other half of the scripts
// library.
//
// The passport review on 5 August 2026 found all 296 scripts running parent to
// child, with nothing at all a child could pick up to start a conversation
// themselves. This is that missing half, and it is deliberately a page a child
// reaches on their own rather than something a parent sends, because the whole
// point is the conversations a parent does not know to start.
//
// Two things on one page, in this order and not the other way round.
//
// The card comes first because it answers the question a child is actually
// stuck on. Not what do I say, but what will happen to me if I do. A child
// weighs telling against losing the phone, and where nobody has said out loud
// what happens next, the answer they assume is confiscation. So the promise
// and the never sit above the words, and the words are no use without them.
//
// Same trust model as the rest of the child app: no account, no login, the
// link token scopes everything to one child.

export const dynamic = 'force-dynamic'

type Card = {
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
  title: string
  emoji: string
  when_to_use: string
  opener: string
  say_this: string
  if_it_goes_wrong: string
  who_else: string
  urgent: boolean
}

export default async function KidTellPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) notFound()

  const { data: child } = await supabase
    .from('children')
    .select('name, age_band')
    .eq('id', link.child_id)
    .maybeSingle()

  const stage = getStageFromAgeBand((child?.age_band as AgeBand | null) ?? '8-10')
  const stageSlug = stage.name.toLowerCase()
  const childName = child?.name && child.name !== 'Your child' ? child.name : ''

  const [{ data: cardRow }, { data: scriptRows }] = await Promise.all([
    supabase
      .from('tell_a_parent_cards')
      .select('headline, intro, tell_now, tell_soon, what_happens, the_promise, never')
      .eq('stage_id', stageSlug)
      .eq('active', true)
      .maybeSingle(),
    supabase
      .from('child_scripts')
      .select('id, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent')
      .eq('stage_id', stageSlug)
      .eq('active', true)
      .order('sort_order', { ascending: true }),
  ])

  const card = (cardRow as Card | null) ?? null
  const scripts = (scriptRows ?? []) as ChildScript[]

  const label = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)', padding: '22px 16px 60px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ marginBottom: '18px' }}>
          <Link href={`/k/${token}`} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            color: 'rgba(255,255,255,0.78)', textDecoration: 'none',
          }}>
            ← My quests
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
          <DigiCharacter mood="wave" size={56} once />
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 6vw, 1.9rem)', color: '#F7F7F5', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
              Telling a grown up
            </h1>
            <p style={{ ...label, color: 'rgba(255,255,255,0.66)', margin: '5px 0 0' }}>
              The words, and what happens after
            </p>
          </div>
        </div>
        <p style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, margin: '10px 0 20px' }}>
          Some things are hard to start saying{childName ? `, ${childName}` : ''}. These are the exact words, ready to borrow. You can read one out loud, or just hand them your phone with it open.
        </p>

        {/* ── THE CARD ──────────────────────────────────────────────────────
            The promise first. Everything under it depends on a child believing
            this bit, and a child who does not believe it will not scroll. */}
        {card && (
          <section style={{ background: 'var(--cream)', borderRadius: '22px', padding: '20px 18px', marginBottom: '18px', boxShadow: '0 5px 0 rgba(0,0,0,0.18)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 8px' }}>
              {card.headline}
            </h2>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
              {card.intro}
            </p>

            <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '16px', padding: '15px 16px', marginBottom: '16px' }}>
              <div style={{ ...label, color: 'var(--terracotta-dark)', marginBottom: '6px' }}>The promise</div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.35, margin: 0 }}>
                {card.the_promise}
              </p>
            </div>

            <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '8px' }}>Tell them straight away</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
              {card.tell_now.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '8px 0', borderBottom: i < card.tell_now.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)' }}>🔴</span>
                  <span style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.45, fontWeight: 600 }}>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '8px' }}>Tell them when there is a quiet moment</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px' }}>
              {card.tell_soon.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '8px 0', borderBottom: i < card.tell_soon.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)' }}>🟡</span>
                  <span style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.45 }}>{item}</span>
                </li>
              ))}
            </ul>

            {/* The half the review found missing everywhere. What to tell is no
                use on its own: this is the part that makes telling worth it. */}
            <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '10px' }}>What happens when you do</div>
            <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', counterReset: 'step' }}>
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

            <div style={{ background: '#fff', border: '1.5px dashed var(--border)', borderRadius: '14px', padding: '13px 15px' }}>
              <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '5px' }}>What will not happen</div>
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                {card.never}
              </p>
            </div>
          </section>
        )}

        {/* ── THE SCRIPTS ───────────────────────────────────────────────────
            Native details elements, so this costs no JavaScript, works on a bad
            connection, and a closed one is still findable with Ctrl F. Closed
            by default and one line each: a child scanning for their situation
            should not have to read four they are not in. */}
        {scripts.length > 0 && (
          <section>
            <div style={{ ...label, color: 'rgba(255,255,255,0.66)', margin: '0 0 10px 2px' }}>
              {scripts.length} things that are hard to say
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scripts.map(s => (
                <details key={s.id} style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', border: s.urgent ? '2px solid var(--terracotta)' : '1.5px solid rgba(0,0,0,0.06)' }}>
                  <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 16px' }}>
                    <span aria-hidden style={{ flexShrink: 0, width: 42, height: 42, borderRadius: '13px', background: s.urgent ? 'var(--terracotta-lt)' : 'var(--tint-blue, #E4ECF7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)' }}>
                      {s.emoji}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>
                        {s.title}
                      </span>
                      {s.urgent && (
                        <span style={{ ...label, display: 'block', color: 'var(--terracotta-dark)', marginTop: '3px' }}>
                          Do not wait for a good moment
                        </span>
                      )}
                    </span>
                    <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', color: 'var(--ink-muted)' }}>›</span>
                  </summary>

                  <div style={{ padding: '0 16px 18px' }}>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '0 0 14px' }}>
                      {s.when_to_use}
                    </p>

                    <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '6px' }}>How to start</div>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.4, margin: '0 0 14px' }}>
                      “{s.opener}”
                    </p>

                    {/* The words themselves, at reading size and set apart, so a
                        child can hold the phone up and read straight off it. */}
                    <div style={{ background: 'var(--cream)', borderLeft: '4px solid var(--terracotta)', borderRadius: '12px', padding: '14px 15px', marginBottom: '14px' }}>
                      <div style={{ ...label, color: 'var(--terracotta-dark)', marginBottom: '6px' }}>Then say this</div>
                      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                        {s.say_this}
                      </p>
                    </div>

                    <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '5px' }}>If it does not go well</div>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
                      {s.if_it_goes_wrong}
                    </p>

                    <div style={{ ...label, color: 'var(--ink-muted)', marginBottom: '5px' }}>Who else you can tell</div>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
                      {s.who_else}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Childline stands on its own at the bottom rather than only inside the
            scripts. A child who finds nothing here that fits their situation
            still leaves the page with somewhere to go. */}
        <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.09)', border: '1.5px solid rgba(255,255,255,0.16)', borderRadius: '18px', padding: '16px' }}>
          <div style={{ ...label, color: 'rgba(255,255,255,0.66)', marginBottom: '6px' }}>If none of these fit</div>
          <p style={{ fontSize: 'var(--text-md)', color: 'rgba(255,255,255,0.86)', lineHeight: 1.55, margin: 0 }}>
            Childline is free on 0800 1111, any time of day or night. It does not show up on the phone bill, and you do not have to give your name.
          </p>
        </div>
      </div>
    </div>
  )
}
