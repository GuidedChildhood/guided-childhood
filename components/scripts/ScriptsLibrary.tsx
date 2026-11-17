import Link from 'next/link'
import BrowseTile from '@/components/ui/BrowseTile'
import ScriptFinder from '@/components/scripts/ScriptFinder'
import { chunky, pill, INK_EDGE } from '@/components/scripts/card-system'
import { momentImageForTitle } from '@/lib/content/moment-images'
import { CATEGORY_META, scriptEmoji, type StageId, type ScriptRow, STAGE_META } from '@/components/scripts/library-meta'
import type { Revisit } from '@/lib/scripts/shelves'

// The Scripts page as three shelves. Drawn by app/(dashboard)/dashboard/scripts
// from the database, and by app/dev/scripts-page from fixtures so the layout
// can be checked on a phone without an account. Presentational only: every
// decision about what goes on a shelf is made before it gets here.

type Pick = { sort_order: number; title: string; situation: string; is_free: boolean; reason: string | null }
type Group = { stageId: StageId; meta: (typeof STAGE_META)[StageId]; items: ScriptRow[] }

export type ScriptsLibraryProps = {
  isPaid: boolean
  scripts: ScriptRow[]
  completed: number[]
  childName: string | null
  childQS: string | null
  tally: { had: number; wentWell: number }
  recommended: Pick | null
  morePicks: Pick[]
  revisit: Revisit[]
  topicScripts: { sort_order: number; title: string; situation: string }[]
  topicLabel: string | null
  topicConfident: boolean
  byStage: Group[]
  theirStage: StageId | null
  chips: { key: string; label: string; n: number }[]
  activeCat: string | null
  askedStage: StageId | null
  cameFromPathway: boolean
  pathwayHref: string
  initialQuery: string
}

export default function ScriptsLibrary(props: ScriptsLibraryProps) {
  const {
    isPaid, scripts, childName, childQS, tally, recommended, morePicks, revisit,
    topicScripts, topicLabel, topicConfident, byStage, theirStage, chips, activeCat,
    askedStage, cameFromPathway, pathwayHref, initialQuery,
  } = props
  const completedOrders = new Set(props.completed)
  const scriptBySort = new Map(scripts.map(sc => [sc.sort_order, sc]))
  const withChild = (href: string) =>
    childQS ? `${href}${href.includes('?') ? '&' : '?'}child=${childQS}` : href
  const momentMatch = { confident: topicConfident }
  const q = initialQuery
  const PATHWAY_HREF = pathwayHref

  // Their own age leads, every other age folds into one row at the bottom.
  const theirGroup = byStage.find(g => g.stageId === theirStage) ?? null
  const otherGroups = byStage.filter(g => g !== theirGroup)
  // Nine tiles is three rows on a phone. The rest of their age is one tap away
  // rather than a wall of forty, which is what "fills the whole page" was.
  const FIRST = 9

  const shelfHead = (eyebrowText: string, title: string, sub?: string) => (
    <div style={{ marginBottom: 12 }}>
      <p className="eyebrow" style={{ marginBottom: 3 }}>{eyebrowText}</p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: 0, color: 'var(--ink)' }}>{title}</h2>
      {sub && <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '4px 0 0' }}>{sub}</p>}
    </div>
  )

  // One row in a shelf: the title, the situation, and why it is here.
  const row = (sortOrder: number, title: string, situation: string, why: string | null, opts: { isFree?: boolean; tone?: 'butter' | 'sage'; noTick?: boolean } = {}) => {
    const isLocked = !isPaid && !opts.isFree
    // A revisit card never wears the done tick: "it did not land" beside a
    // green tick reads as a contradiction.
    const isDone = !opts.noTick && completedOrders.has(sortOrder)
    return (
      <Link
        key={sortOrder}
        href={isLocked ? '/dashboard/upgrade' : withChild(`/dashboard/scripts/${sortOrder}`)}
        style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', minHeight: 64, textDecoration: 'none', background: 'var(--white)', border: INK_EDGE, borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)' }}
      >
        <span aria-hidden style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 'var(--radius-tile)', background: opts.tone === 'sage' ? 'var(--tint-sage)' : 'var(--tint-butter)', border: INK_EDGE, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)' }}>
          {scriptEmoji(scriptBySort.get(sortOrder)?.category ?? '', title)}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>{title}</span>
          <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{situation}</span>
          {why && (
            <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--terracotta-dark)', lineHeight: 1.35, marginTop: 5 }}>{why}</span>
          )}
        </span>
        <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', fontWeight: 800, color: isDone ? 'var(--retro-green-dark, var(--ink))' : 'var(--ink-muted)' }}>{isDone ? '✓' : isLocked ? '🔒' : '›'}</span>
      </Link>
    )
  }

  const tiles = (items: ScriptRow[], stageNum: number) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
      {items.map(script => (
        <BrowseTile
          key={script.id}
          href={!isPaid ? '/dashboard/upgrade' : withChild(`/dashboard/scripts/${script.sort_order}`)}
          stageNum={stageNum}
          title={script.title}
          sub={CATEGORY_META[script.category]?.label ?? script.category}
          emoji={scriptEmoji(script.category, script.title)}
          coverUrl={momentImageForTitle(script.title)}
          done={completedOrders.has(script.sort_order)}
          locked={!isPaid}
        />
      ))}
    </div>
  )

  // THE PAGE, in the order a parent needs it.
  //
  // Justin, 17 November 2026: show the ones that respond to what they have
  // said, the ones for their age, and the ones done that are worth a revisit,
  // "super easy to understand". It was eleven sections: search, a banner, the
  // moment list, the lead card, four more picks, a paywall card, chips, a stage
  // note, five stage groups and a second paywall card. It is now three shelves
  // under the search, named for the three questions:
  //
  //   1. Picked for Teo: what they have told us (concerns, check in dips,
  //      devices), each card saying why in their own words.
  //   2. Worth another go: scripts already met, coming back for a reason
  //      (lib/scripts/shelves.ts). Silent when there is nothing.
  //   3. For Teo's age: the whole stage, filterable, every other age folded.
  //
  // The Apple Fitness and Calm pattern (Mobbin, pulled 17 November: Calm's
  // Recently Played over Recommended for You, Bloom's Recommended for You
  // list): a few labelled shelves, each one a reason, rather than one library.
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>
      {cameFromPathway && (
        <Link href={PATHWAY_HREF} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', textDecoration: 'none', marginBottom: 6 }}>
          ← Back to the Passport
        </Link>
      )}
      <div style={{ marginBottom: '18px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>The words for the hard moments</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px' }}>Scripts</h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-md)', lineHeight: 1.45, margin: 0 }}>
          What to say, what not to say, and why it works. Real moments, not perfect families.
        </p>
        {/* What they have done, counted up and never down. No streak and
            nothing to lose: the goal is the conversation, which might rightly
            happen once a fortnight (lib/scripts/shelves.ts). */}
        {tally.had > 0 && (
          <p style={{ display: 'inline-flex', alignItems: 'baseline', flexWrap: 'wrap', columnGap: 6, margin: '12px 0 0', background: 'var(--tint-butter)', border: INK_EDGE, borderRadius: 'var(--radius-btn)', padding: '7px 14px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.4 }}>
            <span aria-hidden>⭐</span>
            <span>{tally.had} conversation{tally.had === 1 ? '' : 's'} had{childName ? ` with ${childName}` : ''}</span>
            {tally.wentWell > 0 && <span style={{ fontWeight: 600, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>· {tally.wentWell} went well</span>}
          </p>
        )}
      </div>

      {/* Find my script: search every script in plain words, and if there is
          no fit, ask DiGi and it lands in the founder insights to be written.
          Seeded from DiGi's "scripts for moments like this", capped at a
          sentence: this is a search box, not a transcript. */}
      <ScriptFinder
        scripts={scripts.map(s => ({ sort_order: s.sort_order, title: s.title, situation: s.situation, category: s.category, is_free: s.is_free }))}
        isPaid={isPaid}
        initialQuery={(q ?? '').slice(0, 140)}
        childId={childQS}
      />

      {/* Handoff from a moment card: the scripts for that exact moment lead,
          as the butter numbered list, so the deck closes on the words. */}
      {topicScripts.length > 0 && (
        <section style={{ marginBottom: '28px' }}>
          <div style={{ background: 'var(--terracotta)', border: '2.5px solid var(--ink)', borderRadius: 'var(--radius-card)', padding: '16px 20px 14px', marginBottom: '14px', boxShadow: 'var(--lift-deep)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--stage-1-text)', marginBottom: '4px' }}>
              {!momentMatch?.confident ? 'The closest scripts' : topicScripts.length === 1 ? 'The words' : `${topicScripts.length} scripts`} for this moment
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.12, letterSpacing: '-0.02em' }}>
              {topicLabel}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topicScripts.map(script => row(script.sort_order, script.title, script.situation, null))}
          </div>
        </section>
      )}

      {/* The four days are up. One card, said once, near the top, and honest
          that the daily loop keeps working without a membership. It used to
          appear twice, here and again at the foot of the page. */}
      {!isPaid && (
        <div style={{ background: 'var(--stage-5)', border: INK_EDGE, borderRadius: 'var(--radius-card)', padding: '16px 20px', marginBottom: '26px', boxShadow: 'var(--lift)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--terracotta-dark)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your free days are up</span>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '4px 0 12px', fontWeight: 600, lineHeight: 1.45 }}>
            All {scripts.length} scripts are part of the membership, with DiGi to rewrite any of them for your own child.
          </p>
          <Link href="/dashboard/upgrade" style={{ ...chunky('butter'), display: 'inline-flex' }}>
            Unlock all scripts
          </Link>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '12px 0 0' }}>
            Your daily path, the jobs, the stars and the printables keep going either way.
          </p>
        </div>
      )}

      {/* ── 1. PICKED FOR THEM ───────────────────────────────────────────────
          What this family has told us, newest and loudest first: a worry
          raised in DiGi or a moment, a dip on the check in, the devices in the
          house, then the age. Every card says which, so a parent can check it
          against their own week (lib/pathway/recommend.ts). */}
      {recommended && (
        <section style={{ marginBottom: '28px' }}>
          {shelfHead(childName ? `Picked for ${childName}` : 'Picked for your child', 'From what you have told us')}
          <Link href={withChild(`/dashboard/scripts/${recommended.sort_order}`)} style={{ textDecoration: 'none', display: 'block', marginBottom: '10px' }}>
            <div style={{ background: 'var(--terracotta)', border: '2.5px solid var(--ink)', borderRadius: 'var(--radius-card)', padding: '20px 20px 18px', boxShadow: 'var(--lift-deep)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.75, marginBottom: '6px' }}>
                Start with this one
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.45rem, 6vw, 1.9rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '8px' }}>
                {recommended.title}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', lineHeight: 1.4, color: 'var(--ink)', opacity: 0.85 }}>
                {recommended.situation}
              </div>
              {recommended.reason && (
                <div style={{ display: 'inline-block', marginTop: '12px', background: 'var(--white)', border: INK_EDGE, borderRadius: 'var(--radius-pill)', padding: '6px 12px', fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', color: 'var(--ink)', fontWeight: 800 }}>
                  {recommended.reason}
                </div>
              )}
            </div>
          </Link>
          {morePicks.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {morePicks.map(pick => row(pick.sort_order, pick.title, pick.situation, pick.reason, { isFree: pick.is_free }))}
            </div>
          )}
        </section>
      )}

      {/* ── 2. WORTH ANOTHER GO ──────────────────────────────────────────────
          Scripts already met, back for a reason: it did not land, it worked a
          while ago and a refresher holds it, or it was read and never tried.
          Silent when there is nothing, so a new family never sees an empty
          shelf promising something. */}
      {revisit.length > 0 && (
        <section style={{ marginBottom: '28px' }}>
          {shelfHead('Worth another go', 'Ones you have met before', 'A second look at the right time is how the words stick.')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {revisit.map(r => {
              const sc = scriptBySort.get(r.sort_order)!
              return row(r.sort_order, sc.title, sc.situation, r.line, { isFree: sc.is_free, tone: 'sage', noTick: true })
            })}
          </div>
        </section>
      )}

      {/* ── 3. FOR THEIR AGE ─────────────────────────────────────────────────
          The whole stage, with the topic chips to narrow it. Links, not
          buttons, so the page stays a server component and a filtered view has
          a URL a parent can send (the chip row reasoning is unchanged: Mobbin
          showed chips, not tabs, for a library past five topics). */}
      <section style={{ marginBottom: '24px' }}>
        {shelfHead(
          theirGroup ? `Stage ${theirGroup.meta.num}: ${theirGroup.meta.label} · ${theirGroup.meta.ages}` : 'Every script',
          childName && theirGroup && !askedStage ? `For ${childName}'s age` : theirGroup ? 'For this age' : 'Browse by topic',
        )}
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 14,
          marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20,
          scrollbarWidth: 'none',
        }}>
          {[{ key: null as string | null, label: 'All', n: 0 }, ...chips].map(c => {
            const on = activeCat === c.key
            const inStage = theirGroup
              ? (c.key ? scripts.filter(sc => sc.stage_id === theirGroup.stageId && sc.category === c.key).length : scripts.filter(sc => sc.stage_id === theirGroup.stageId).length)
              : (c.key ? c.n : scripts.length)
            if (c.key && inStage === 0) return null
            const qs = [c.key ? `cat=${c.key}` : '', askedStage ? `stage=${askedStage}` : ''].filter(Boolean).join('&')
            return (
              <Link key={c.key ?? 'all'} href={withChild(`/dashboard/scripts${qs ? `?${qs}` : ''}`)} scroll={false} style={{ ...pill(on), flexShrink: 0 }}>
                {c.label}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, marginLeft: 7, color: on ? 'var(--ink)' : 'var(--ink-muted)' }}>{inStage}</span>
              </Link>
            )
          })}
        </div>

        {activeCat && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
            {CATEGORY_META[activeCat].description}
          </p>
        )}

        {/* Arrived from the road: say what moves the pathway on, because it
            was never said anywhere and the only way to learn it was to read a
            script and find nothing had moved. */}
        {askedStage && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px', background: 'var(--tint-sage)', border: INK_EDGE, borderRadius: 'var(--radius-tile)', padding: '12px 14px' }}>
            Your pathway fills in as you read these. Reach the end of one and it counts. Tell us you used it, or that it does not apply, and it counts for more.{' '}
            <Link href={withChild('/dashboard/scripts')} style={{ fontWeight: 700, color: 'var(--terracotta-dark)' }}>See every stage</Link>
          </p>
        )}

        {theirGroup ? (
          <>
            {tiles(theirGroup.items.slice(0, FIRST), theirGroup.meta.num)}
            {theirGroup.items.length > FIRST && (
              <details style={{ marginTop: 12 }}>
                <summary style={{ cursor: 'pointer', listStyle: 'none', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', background: 'var(--white)', border: INK_EDGE, borderRadius: 'var(--radius-btn)' }}>
                  Show {theirGroup.items.length - FIRST} more
                </summary>
                <div style={{ marginTop: 12 }}>{tiles(theirGroup.items.slice(FIRST), theirGroup.meta.num)}</div>
              </details>
            )}
          </>
        ) : byStage.length === 0 ? (
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            Nothing in that one yet. Try another, or search above for the moment you are actually in.
          </p>
        ) : null}
      </section>

      {/* Every other age, in one fold. A parent is nearly always after the
          child they have; the younger and older stages are there for a sibling,
          or for looking ahead, and a closed row costs one line. */}
      {otherGroups.length > 0 && (
        <details style={{ marginBottom: '24px' }}>
          <summary style={{ cursor: 'pointer', listStyle: 'none', padding: '14px 16px', minHeight: 44, background: 'var(--white)', border: INK_EDGE, borderRadius: 'var(--radius-btn)', boxShadow: 'var(--lift)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
            {theirGroup ? 'Other ages' : 'Every stage'}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', marginLeft: 8 }}>
              {otherGroups.reduce((n, g) => n + g.items.length, 0)}
            </span>
          </summary>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 16 }}>
            {otherGroups.map(group => (
              <div key={group.stageId}>
                <p style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', margin: '0 0 10px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: group.meta.color, background: group.meta.bg, padding: '4px 10px', borderRadius: 'var(--radius-pill)' }}>
                    Stage {group.meta.num}: {group.meta.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{group.meta.ages}</span>
                </p>
                {tiles(group.items, group.meta.num)}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* The other direction, now at the foot rather than above every shelf.
          It is the other half of the library (the words a child has when they
          come to you), not a ninth topic, so it keeps its own row. */}
      <Link
        href="/dashboard/tell-a-parent"
        style={{ display: 'flex', alignItems: 'center', gap: '13px', textDecoration: 'none', background: 'var(--tint-sage)', border: INK_EDGE, borderRadius: 'var(--radius-card)', padding: '15px 17px', boxShadow: 'var(--lift)' }}
      >
        <span aria-hidden style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 'var(--radius-tile)', background: 'var(--white)', border: INK_EDGE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)' }}>💬</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.2 }}>
            When they come to you
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '2px' }}>
            The words your child has, and the promise about how you will react
          </span>
        </span>
        <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', color: 'var(--ink-muted)' }}>›</span>
      </Link>
    </div>
  )
}
