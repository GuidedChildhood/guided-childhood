import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LIBRARY_PRINTABLES, printablesForStage } from '@/lib/printables/registry'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { hasFullAccess } from '@/lib/access'
import PrintableActions from './PrintableActions'
import FridgeChartLog from '@/components/quests/FridgeChartLog'
import { getChildren } from '@/lib/children/server'

// The Printables library: the offline pathway. Beautiful colouring book
// sheets a family prints and completes away from screens, each worth
// stars through the quest approve loop. The child's stage set leads, the
// whole library follows.

export const metadata = { title: 'Printables · Guided Childhood' }

const SETTING_LABEL: Record<string, string> = {
  indoors: 'Indoors', outdoors: 'Outdoors', anywhere: 'Anywhere',
}

export default async function PrintablesPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child: childParam } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ kids, child }, { data: profile }] = await Promise.all([
    // One read serves the selected child (?child= honoured) and the list.
    getChildren<{ id: string; name: string | null; age_band: string | null; is_primary: boolean | null }>(
      supabase, user.id, childParam, 'id, name, age_band'),
    supabase.from('profiles').select('subscription_status, trial_ends_at').eq('id', user.id).maybeSingle(),
  ])
  // The named children, for the log a week card under the star chart builder.
  const logKids = (kids ?? []).filter(k => k.name && k.name !== 'Your child').map(k => ({ id: k.id as string, name: k.name as string }))
  // Previews always show (they are the sell); downloads and the builder
  // are a member feature. The founder and trial parents get full access.
  const isPaid = hasFullAccess(profile, user.email)

  const stageId = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand).id : 2
  const forChild = printablesForStage(stageId)
  const forChildKeys = new Set(forChild.map(p => p.key))
  const others = LIBRARY_PRINTABLES.filter(p => !forChildKeys.has(p.key))
  const childName = child?.name && child.name !== 'Your child' ? child.name : null

  const card: React.CSSProperties = {
    background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px',
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
    boxShadow: '0 4px 24px rgba(26,26,46,0.07)',
  }

  function Section({ title, sub, items }: { title: string; sub: string; items: typeof LIBRARY_PRINTABLES }) {
    if (items.length === 0) return null
    return (
      <section style={{ marginBottom: '34px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>
          {title}
        </div>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 14px' }}>{sub}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {items.map(p => (
            <div key={p.key} style={card}>
              {/* The pinned preview. next/image resizes each large sheet down to
                  the card size, serves webp, and lazy loads the ones below the
                  fold, so a full grid paints fast instead of pulling megabytes. */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: 'var(--cream)' }}>
                <Image src={p.previewUrl} alt={`${p.title} preview`} fill sizes="(max-width: 640px) 50vw, 300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                    {p.emoji} {p.title}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {[p.minutes, SETTING_LABEL[p.setting], p.skill].map(chip => (
                      <span key={chip} style={{
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        background: 'var(--cream)', color: 'var(--ink-soft)',
                        border: '1px solid var(--border)', borderRadius: '100px', padding: '3px 9px',
                      }}>{chip}</span>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0, flex: 1 }}>
                  {p.blurb}
                </p>
                <PrintableActions printable={p} isPaid={isPaid} />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '8px' }}>Printables</p>
      <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '10px' }}>
        The offline pathway
      </h1>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '28px', maxWidth: '560px' }}>
        Print it, put the crayons out, and the screens look after themselves. Every finished sheet is worth stars: add it to the quest list, they hand the page back, you approve, the stars land in their bank.
      </p>

      {/* The star chart, typed before it is printed. This is the starter pack
          now: the old multi page booklet was retired into this tidier builder,
          and it stays first because it is the one every family uses. */}
      <Link
        href="/dashboard/printables/star-chart"
        style={{
          display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none',
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '20px',
          padding: '18px 22px', marginBottom: '12px',
        }}
      >
        <span style={{ fontSize: 'var(--text-2xl)', lineHeight: 1 }} aria-hidden>⭐</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            Build your star chart
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: '3px' }}>
            Put your own jobs on it, then print the chart and a sheet of gold stars to cut out. One star is five minutes.
          </span>
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
          Open →
        </span>
      </Link>

      {/* Ran the printed chart on paper this week? Log the stars straight into
          the bank, right under the builder that made the chart, so build, print
          and log read as one thing. Moved here from the Quests page. */}
      {logKids.length > 0 && (
        <div style={{ marginBottom: '34px' }}>
          <FridgeChartLog kids={logKids} />
        </div>
      )}

      {/* The builder: pick from the idea pool or write your own, then print.
          A member feature; free parents see it and are pointed to upgrade. */}
      {/* THREE THINGS IN A ROW DO NOT FIT ON A PHONE.
          Justin, 8 August 2026: "this looks messy."
          Emoji, then a title and two lines of copy, then a nowrap call to
          action, all in one flex row. On a 390 wide screen the two fixed ends
          and the padding eat most of the width, so the middle column collapsed
          to about a third and "Build your own bucket list" set one word per
          line, with the call to action floating in the gap beside it.
          It stacks below 640 instead: emoji and title on one line, the copy
          under them, the call to action last. Side by side is kept on a laptop,
          where there is genuinely room for it.
          minWidth 0 on the text column as well, because a flex item defaults to
          min-width auto and will not shrink below its longest word, which is
          how a squeezed column ends up overflowing rather than wrapping. */}
      <style>{`
        .pr-builder { display: flex; align-items: center; gap: 16px; }
        .pr-builder .pr-cta { margin-left: auto }
        @media (max-width: 640px) {
          .pr-builder { display: grid; grid-template-columns: auto 1fr; gap: 10px 12px; align-items: start }
          .pr-builder .pr-text { grid-column: 2 }
          .pr-builder .pr-cta { grid-column: 2; margin-left: 0 }
        }
      `}</style>
      <Link
        href={isPaid ? '/dashboard/printables/builder' : '/dashboard/upgrade'}
        className="pr-builder"
        style={{
          textDecoration: 'none',
          background: 'var(--tint-sage)', border: '1.5px solid var(--border)', borderRadius: '20px',
          padding: '18px 22px', marginBottom: '34px',
        }}
      >
        <span style={{ fontSize: 'var(--text-2xl)', lineHeight: 1 }} aria-hidden>✏️</span>
        <span className="pr-text" style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            Build your own bucket list{isPaid ? '' : ' 🔒'}
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: '3px' }}>
            Pick from our ideas or write your own, put their name on it, and print a list that is completely yours.
          </span>
        </span>
        <span className="pr-cta" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
          {isPaid ? 'Open the builder →' : 'Members →'}
        </span>
      </Link>

      {/* The Planet Friends poster. Under the two builders because it is a
          reward rather than a tool: it only says something once a child has
          done the days. Justin: "let's give away of printing a poster sticker
          sheet from achieving these." */}
      <Link
        href="/dashboard/printables/friends"
        className="pr-builder"
        style={{
          textDecoration: 'none',
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--border)', borderRadius: '20px',
          padding: '18px 22px', marginBottom: '34px',
        }}
      >
        <span style={{ fontSize: 'var(--text-2xl)', lineHeight: 1 }} aria-hidden>🪐</span>
        <span className="pr-text" style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            {childName ? `${childName}'s Planet Friends poster` : 'The Planet Friends poster'}
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: '3px' }}>
            The ones they have brought home, in colour to cut out and stick up. The ones still coming, in line art to colour in.
          </span>
        </span>
        <span className="pr-cta" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
          Print it →
        </span>
      </Link>

      <Section
        title={childName ? `Made for ${childName}` : 'Made for their age'}
        sub="The sheets that fit their stage right now."
        items={forChild}
      />
      <Section
        title="The whole library"
        sub="Everything else, for siblings, rainy Sundays and growing into."
        items={others}
      />
    </div>
  )
}
