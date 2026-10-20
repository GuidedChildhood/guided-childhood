import Link from 'next/link'
import ScriptDepth from '@/components/scripts/ScriptDepth'
import ScriptReader from '@/components/scripts/ScriptReader'
import RehearseWithDigi, { type RehearseFixture } from '@/components/scripts/RehearseWithDigi'
import ScriptHelpPrompt from '@/components/scripts/ScriptHelpPrompt'
import ScriptStatusButtons from '@/components/scripts/ScriptStatusButtons'
import MarkReadOnEnd from '@/components/scripts/MarkReadOnEnd'
import ShareScript from '@/components/scripts/ShareScript'
import TakeoverReader from '@/components/ui/TakeoverReader'
import { card, cardPad, eyebrow, chunky, INK_EDGE } from '@/components/scripts/card-system'
import HappyIcon from '@/components/kid/HappyIcon'

// The whole script detail page as one presentational view: the page route
// fetches the data, this file owns how it looks. One card system, one spacing
// rhythm (24px between sections, 12px inside a group), everything on one grid.
// Extracted so the fixture page can render the exact same layout without a
// database. Presentation only, no data logic lives here.

const STAGE_META: Record<string, { label: string; short: string; color: string; bg: string }> = {
  foundation:  { label: 'Foundation · Ages 4 to 7',  short: 'Foundation',  color: 'var(--ink)', bg: 'var(--stage-1)' },
  builder:     { label: 'Builder · Ages 8 to 10',    short: 'Builder',     color: 'var(--ink)', bg: 'var(--stage-2)' },
  explorer:    { label: 'Explorer · Ages 11 to 13',  short: 'Explorer',    color: 'var(--ink)', bg: 'var(--stage-3)' },
  shaper:      { label: 'Shaper · Ages 13 to 15',    short: 'Shaper',      color: 'var(--ink)', bg: 'var(--stage-4)' },
  independent: { label: 'Independent · Ages 16 and above', short: 'Independent', color: 'var(--ink)', bg: 'var(--stage-5)' },
}

export type ScriptDetailData = {
  stage_id: string
  title: string
  situation: string
  say_this: string
  not_this: string
  why_it_works: string
  tonight: string
  is_free: boolean
}

type NavScript = { sort_order: number; title: string } | null

type Props = {
  script: ScriptDetailData
  sortOrder: number
  showBanNote: boolean
  isPaid: boolean
  childName: string | null
  childPhone: string | null
  childId: string | null
  childHasApp: boolean
  workedRating: 'yes' | 'somewhat' | 'no' | null
  scriptStatus: 'opened' | 'read' | 'used' | 'not_needed'
  /** Arrived from the road or the passport, so the exits point back there. */
  backToPathway?: boolean
  stageSlug?: string | null
  /**
   * The ?child= this page was opened with, threaded into every script link so
   * the choice survives Previous, Next and the deck. The read tick and the
   * status buttons both resolve the child from the URL they are on, so a link
   * that drops the param quietly hands the tick to the primary child.
   */
  childIdParam?: string | null
  /**
   * The script's uuid, which is its public address at /say/<id>. Optional
   * because the fixture page has no row and therefore nothing real to share;
   * the share button simply does not render there.
   */
  publicId?: string | null
  prevScript: NavScript
  nextScript: NavScript
  depthInitial: { ifTheyPushBack?: string; checkBack?: string; forYourChild?: string }
  rehearseFixture?: RehearseFixture
}

const chip: React.CSSProperties = {
  ...eyebrow,
  fontSize: 'var(--text-sm)',
  padding: '6px 12px',
  borderRadius: 'var(--radius-pill)',
  border: INK_EDGE,
  display: 'inline-flex',
  alignItems: 'center',
}

export default function ScriptDetailView({
  script, sortOrder, showBanNote, isPaid,
  childName, childPhone, childId, childHasApp, workedRating, scriptStatus,
  backToPathway = false, stageSlug = null, childIdParam = null,
  publicId = null, prevScript, nextScript, depthInitial, rehearseFixture,
}: Props) {
  const stageMeta = STAGE_META[script.stage_id] ?? STAGE_META.foundation
  const withChild = (href: string) =>
    childIdParam ? `${href}${href.includes('?') ? '&' : '?'}child=${childIdParam}` : href
  const backHref = backToPathway ? '/dashboard/pathway' : withChild('/dashboard/scripts')

  return (
    // On a phone the reader fills the screen, Good Inside style, with one bar
    // and one way back; on desktop the shell renders as nothing and the page
    // keeps the layout below exactly as it was.
    <TakeoverReader backHref={backHref} eyebrow="Script">
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px 56px' }}>

      {/* Back and the deck door, one quiet row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '8px' }}>
        {/* Back to where they came from. A parent who followed their own
            pathway here and is handed "All scripts" has been quietly moved to
            a different place from the one they were in. On mobile the sheet's
            own bar carries the way back, so this link steps aside there. */}
        <Link
          href={backHref}
          className="gc-takeover-hide"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
        >
          {backToPathway ? '← Back to the Passport' : '← All scripts'}
        </Link>
      </div>

      {/* Title block, given room to breathe. Chips share one baseline, then
          the title, the situation, and a single quiet read line. */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {/* The stage label carried its age band ("Shaper · Ages 13 to 15"),
              which at 390px is wider than the screen allows beside the Free
              chip, so the two stacked and cost a whole row. The band is on the
              scripts index, on the road and in settings; here it is the stage
              that matters, and the title underneath is about to say the rest. */}
          <span style={{ ...chip, color: stageMeta.color, background: stageMeta.bg }}>
            {stageMeta.short}
          </span>
          {script.is_free && (
            <span style={{ ...chip, color: 'var(--terracotta-dark)', background: 'var(--terracotta-lt)' }}>
              Free
            </span>
          )}
        </div>

        {/* Two lines, no more. The title is how a parent knows they opened
            the right script, and anything past two lines is pushing the words
            they came for off the screen. */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(2.1rem, 7.5vw, 2.8rem)', lineHeight: 1.05,
          letterSpacing: '-0.03em', marginBottom: '12px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', textWrap: 'balance',
        }}>
          {script.title}
        </h1>
        {/* 17px at 1.50 rather than 19px at 1.65, clamped to two lines. The
            old setting spent about 45px of the first screen on leading alone
            and bought no comprehension. The situation tells a parent they are
            in the right place; it is not the thing they came to read. */}
        <p style={{
          fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5,
          maxWidth: '46ch', margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {script.situation}
        </p>

      </div>

      {/* Everything below sits on one grid with one rhythm */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ── THE WORDS COME FIRST, AND NOTHING GETS IN FRONT OF THEM ─────
            Justin, 12 October 2026: "really makes everything important stand
            out and workable."

            Everything that used to sit between the title and the quote now
            sits after it: the read tick, the search link and the ban note.
            None of them is why the page was opened, and together they cost
            roughly 200px of the first screen on a 390px phone, which is the
            difference between a parent reading the words and a parent
            scrolling for them with a child shouting.

            The ban note in particular is context for a calm moment. It is
            still here, still on every script that needs it, just no longer
            standing between a parent and the sentence they have to say. */}
        {/* The core of the script, led by the say this hero */}
        <ScriptReader
          sayThis={script.say_this}
          notThis={script.not_this}
          whyItWorks={script.why_it_works}
          tonight={script.tonight}
          stageId={script.stage_id}
        />

        {/* ── THE WAY INTO THE MOMENT, IN THE THUMB ZONE ──────────────────
            This was a white "Try as deck" pill at the very TOP of the page,
            above the title, costing about 60px of the first screen to offer a
            secondary reading mode to somebody who had not yet read anything.

            It belongs here, directly under the words, for two reasons. The
            thumb is already at the bottom of the screen by the time the quote
            has been read, and only about a third of a 390px phone is
            comfortably reachable one handed (Hoober's field study: 49 percent
            of use is one thumb). And the honest moment to offer a card by card
            run through is after a parent has seen what the words are, not
            before.

            Named for what it does rather than for the feature. "Try as deck"
            describes our implementation; "Use it now" describes their
            evening. */}
        <Link
          href={withChild(`/dashboard/scripts/${sortOrder}/deck`)}
          style={{
            ...chunky('butter'),
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '16px 22px', fontSize: 'var(--text-md)',
            minHeight: 56, textDecoration: 'none',
          }}
        >
          Use it now <span aria-hidden>→</span>
        </Link>

        {/* ── AND PASS IT ON ──────────────────────────────────────────────
            Directly under Use it now, because the two are the same decision
            seen from either side: this helped me, or this will help her.
            Secondary white against the butter above it, so it offers itself
            without competing with the thing a parent came to do.

            It shares a link to /say/<uuid>, a real public page with the words
            and an unfurl that shows the quote. Before this there was no way
            to share a script at all, which on the one artifact a parent
            actually wants to pass on was the gap in the whole product. */}
        {publicId && (
          <ShareScript publicId={publicId} title={script.title} sayThis={script.say_this} />
        )}

        {/* The quiet row: what this did to the path, and the way to a better
            fitting script. Below the words, where it belongs. */}
        <div>
          {/* Marked as read: a small tick and one line, never a grey slab */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginTop: '20px' }}>
          <span aria-hidden style={{
            width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
            background: 'var(--tint-sage)', color: 'var(--ink)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)',
          }}>✓</span>
          <span style={{ fontSize: 'var(--text-md)', color: 'var(--ink-muted)', lineHeight: 1.45 }}>
            Marked as read just by opening it. It counts on your path today.
          </span>
        </div>

        {/* DiGi picks the likely script for tonight, but the parent knows the
            evening best, so the way to search for a better fitting one is always
            one tap away, right here on the pick. */}
        <div style={{ marginTop: '16px' }}>
          <Link href={withChild('/dashboard/scripts')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
            Not the right words for tonight? Search all scripts →
          </Link>
        </div>
        </div>

        {/* Ban world note */}
        {showBanNote && (
          <div style={{ ...card, padding: cardPad }}>
            <div style={{ ...eyebrow, color: 'var(--terracotta-dark)', marginBottom: '8px' }}>
              UK social media ban context
            </div>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
              This script is updated for the UK ban on social media for under 16s. The approach stays the same: relational, not restrictive. The law is the start of the conversation, not the end of it.
            </p>
          </div>
        )}

        {/* Rehearse the words with DiGi before the real conversation */}
        <RehearseWithDigi
          sortOrder={sortOrder}
          scriptTitle={script.title}
          situation={script.situation}
          sayThis={script.say_this}
          notThis={script.not_this}
          childName={childName}
          isPaid={isPaid}
          fixture={rehearseFixture}
        />

        {/* The deeper half: push back, check back, and the note for the child */}
        <ScriptDepth
          sortOrder={sortOrder}
          initial={depthInitial}
          childName={childName}
          childPhone={childPhone}
          childId={childId}
          childHasApp={childHasApp}
          stageId={script.stage_id}
        />

        {/* THE END OF THE SCRIPT, and the point at which reading it counts.
            Justin, twice: once read through it needs to update the pathway. It
            sits here rather than at the very bottom of the page on purpose: the
            words end here, and everything below is what to do next. */}
        <MarkReadOnEnd sortOrder={sortOrder} settled={scriptStatus === 'used' || scriptStatus === 'not_needed'} />

        {/* Did it help? DiGi asks, and the answer shapes what it suggests next. */}
        <ScriptHelpPrompt sortOrder={sortOrder} initialWorked={workedRating} />
        <ScriptStatusButtons sortOrder={sortOrder} status={scriptStatus} />

        {/* DiGi CTA */}
        <div style={{ ...card, padding: cardPad, display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ ...eyebrow, color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
              DiGi
            </div>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
              Need help adapting this for your situation? Ask DiGi.
            </p>
          </div>
          <Link
            href={`/dashboard/digi?q=${encodeURIComponent(`I need help with the script: ${script.title}. My situation: `)}`}
            style={{ ...chunky('butter'), maxWidth: '100%', boxSizing: 'border-box' }}
          >
            Ask DiGi about this
          </Link>
        </div>

        {/* Turn the words into something that lasts: a shared family agreement */}
        <Link
          href="/dashboard/agreement"
          style={{ ...card, display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', padding: cardPad }}
        >
          <span aria-hidden style={{ width: 44, height: 44, borderRadius: 'var(--radius-tile)', background: 'var(--terracotta-lt)', border: INK_EDGE, boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <HappyIcon name="deal" size={32} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-display)', marginBottom: '3px' }}>
              Make it a family agreement
            </div>
            <div style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Turn this conversation into a simple agreement you both sign, so the rule holds after the moment passes.
            </div>
          </div>
          <span aria-hidden style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', flexShrink: 0 }}>→</span>
        </Link>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {prevScript ? (
            <Link
              href={withChild(`/dashboard/scripts/${prevScript.sort_order}`)}
              style={{ ...card, borderRadius: 'var(--radius-btn)', flex: 1, padding: '14px 16px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}
            >
              <span style={{ ...eyebrow, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>← Previous</span>
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prevScript.title}</span>
            </Link>
          ) : (
            <Link
              href={withChild('/dashboard/scripts')}
              style={{ ...card, borderRadius: 'var(--radius-btn)', flex: 1, padding: '14px 16px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}
            >
              <span style={{ ...eyebrow, fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)' }}>All topics</span>
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)' }}>Back to scripts</span>
            </Link>
          )}

          {nextScript && (
            <Link
              href={withChild(`/dashboard/scripts/${nextScript.sort_order}`)}
              style={{ ...card, borderRadius: 'var(--radius-btn)', flex: 1, padding: '14px 16px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'right', minWidth: 0 }}
            >
              <span style={{ ...eyebrow, fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)' }}>Next →</span>
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nextScript.title}</span>
            </Link>
          )}
        </div>

        {/* The one tap way back to the daily path after doing this step, so a
            parent sent here from home always has a clear return to the next
            thing rather than reaching for the browser back button. */}
        {/* Two exits when they came from the road, because after reading one
            script the useful next move is either the NEXT script for this
            stage or the road itself, and neither is the daily home page. */}
        {backToPathway && stageSlug && (
          <Link
            href={withChild(`/dashboard/scripts/next?stage=${stageSlug}`)}
            style={{ ...chunky('white', 'lg'), display: 'flex', width: '100%', marginBottom: 10 }}
          >
            The next one for this stage →
          </Link>
        )}
        <Link
          href={backToPathway ? '/dashboard/pathway' : '/dashboard'}
          style={{ ...chunky('butter', 'lg'), display: 'flex', width: '100%', boxShadow: 'var(--lift-deep)' }}
        >
          {/* Passport is the page's one name and Pathway is DiGi's word
              (Justin, 15 October 2026). The second door goes to Home, which
              DiGi's header also calls Today. */}
          {backToPathway ? 'Back to the Passport →' : 'Back to Today →'}
        </Link>

      </div>
    </div>
    </TakeoverReader>
  )
}
