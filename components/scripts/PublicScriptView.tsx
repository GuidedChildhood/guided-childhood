import Link from 'next/link'
import { SITE_URL } from '@/lib/config/site'

// ── THE PUBLIC FACE OF ONE SCRIPT, AS A VIEW ────────────────────────────────
//
// Presentation only. The route at app/say/[id] does the fetch and the member
// check; this file owns how it looks, so the dev fixture can render the exact
// same page with no database. Same split as ScriptDetailView and the
// ref-script-premium fixture, for the same reason: a public page nobody can
// render locally is a public page nobody checks on a phone.
//
// ── MOBBIN, 12 OCTOBER 2026 ─────────────────────────────────────────────────
//
// Pulled before this was settled, per the house rule. Patreon's public post
// page (mobbin.com/screens/ffcd6be4-4c00-45e7-bbb4-7294c90f65b3) is the proven
// shape: the content in full, a bulleted "here is what you can expect" with
// the label of each line bolded, and a STICKY BOTTOM BAR carrying the single
// join action. Two of those three are taken below.
//
// Whop's (mobbin.com/screens/855321db-942a-487e-a265-5db910515326) is the one
// to avoid, and worth naming because it is the obvious thing to build: a grey
// "This content is paywalled" slab sitting where the content should be. A
// stranger who followed a friend's link to be helped meets a receipt instead.
// Nothing is blurred or slabbed here. The words are the whole page.
//
// ── WHY THE BAR AND NOT JUST THE BUTTON ─────────────────────────────────────
//
// The CTA under the card is right for a desktop read. On a 390px phone the
// card is taller than the screen, so a parent who reads the quote, takes the
// words and stops never scrolls far enough to see it. Patreon solved this
// years ago. The bar carries one action and nothing else, and it only exists
// for a stranger: a member already has the app and does not need selling.

type Props = {
  title: string
  situation: string
  sayThis: string
  notThis: string
  stageId: string
  /** Where the big button goes: the script in the app, or the stage check. */
  member: boolean
  sortOrder: number
}

const STAGE_LABEL: Record<string, string> = {
  foundation: 'Ages 4 to 7',
  builder: 'Ages 8 to 10',
  explorer: 'Ages 11 to 13',
  shaper: 'Ages 13 to 15',
  independent: 'Ages 16 and above',
}

// Named rather than counted. "Five more sections" is a number; these are five
// things a parent standing in a kitchen can tell whether they want.
const HELD_BACK: { label: string; rest: string }[] = [
  { label: 'If they push back', rest: 'their likely comeback, and the exact reply' },
  { label: 'Before the moment', rest: 'the one thing to do first, so the words land' },
  { label: 'Why it works', rest: 'the research, in plain words' },
  { label: 'Check back', rest: 'what to notice two or three days later' },
  { label: 'A note for your child', rest: 'written for their age, sent from you' },
]

const label: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase',
}

export default function PublicScriptView({
  title, situation, sayThis, notThis, stageId, member, sortOrder,
}: Props) {
  const ages = STAGE_LABEL[stageId] ?? 'Ages 4 to 16'

  const head = (text: string, tone: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
      <span aria-hidden style={{ width: 4, height: 15, borderRadius: 2, flexShrink: 0, background: tone }} />
      <span style={{ ...label, color: tone === 'var(--danger)' ? 'var(--danger)' : 'var(--terracotta-dark)' }}>{text}</span>
    </div>
  )

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--deep-teal)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      // The bottom padding clears the sticky bar so the last thing on the page
      // is never sitting underneath it.
      padding: member ? '20px 14px 32px' : '20px 14px 108px',
    }}>
      {/* The sheet, in the same grammar as the reader inside the app: white, a
          2.5px ink edge, the words set big. A parent who follows this link and
          then joins meets the same object twice. */}
      <div style={{
        width: 'min(100%, 520px)',
        background: '#fff',
        border: '2.5px solid var(--ink)',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
      }}>
        <div style={{
          background: 'var(--terracotta)',
          padding: '15px 20px',
          borderBottom: '2.5px solid var(--ink)',
        }}>
          <p style={{ ...label, fontSize: 'var(--text-xs)', color: 'var(--ink)', margin: 0 }}>
            A script from Guided Childhood · {ages}
          </p>
        </div>

        <div style={{ padding: 'clamp(20px, 5vw, 26px)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(1.5rem, 6.5vw, 2rem)', color: 'var(--ink)',
              letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 8px',
              textWrap: 'balance',
            }}>
              {title}
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
              color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0, maxWidth: '46ch',
            }}>
              {situation}
            </p>
          </div>

          {/* The words. Same weight, measure and balance as ScriptReader, for
              the same reason: this is the whole point of the page. */}
          <div>
            {head('Say this', 'var(--terracotta)')}
            <blockquote style={{
              margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(23px, 6.2vw, 28px)', lineHeight: 1.3,
              letterSpacing: '-0.015em', color: 'var(--ink)',
              maxWidth: '30ch', textWrap: 'balance',
            }}>
              <span aria-hidden style={{ opacity: 0.35 }}>&ldquo;</span>{sayThis}<span aria-hidden style={{ opacity: 0.35 }}>&rdquo;</span>
            </blockquote>
          </div>

          <div style={{ height: 0, borderTop: '2.5px dotted rgba(26,26,46,0.28)' }} />

          <div>
            {head('Not this', 'var(--danger)')}
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(17px, 4.3vw, 19px)',
              fontWeight: 500, lineHeight: 1.5, color: 'var(--danger)',
              fontStyle: 'italic', margin: 0, maxWidth: '36ch',
            }}>
              <span aria-hidden style={{ opacity: 0.5 }}>&ldquo;</span>{notThis}<span aria-hidden style={{ opacity: 0.5 }}>&rdquo;</span>
            </p>
          </div>

          {/* The held back half, named. Never a blur and never a slab: each
              line says what it is, so a stranger can tell whether they want
              it rather than being told they cannot have it. */}
          {!member && (
            <div style={{
              background: 'var(--cream)', border: '2px solid rgba(26,26,46,0.18)',
              borderRadius: 'var(--radius-tile)', padding: '15px 17px',
            }}>
              <p style={{ ...label, fontSize: 'var(--text-xs)', letterSpacing: '0.12em', color: 'var(--ink-muted)', margin: '0 0 11px' }}>
                The rest of this script
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {HELD_BACK.map(item => (
                  <li key={item.label} style={{
                    display: 'flex', gap: 9, fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45,
                  }}>
                    <span aria-hidden style={{ color: 'var(--terracotta-dark)', fontWeight: 900, flexShrink: 0 }}>+</span>
                    <span>
                      <strong style={{ color: 'var(--ink)', fontWeight: 800 }}>{item.label}</strong>
                      {', '}{item.rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div style={{ width: 'min(100%, 520px)', marginTop: '18px', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
          color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '14px',
        }}>
          {member
            ? 'This one is in your app, with the rest of the script and the note for your child.'
            : 'There is a script like this for every hard moment with a screen, from age 4 to 16, with the exact words to say.'}
        </p>
        {/* A member gets their button here and no sticky bar: they already
            have the app, and a bar selling it to them would be the exact
            fault of selling something to somebody who has bought it. */}
        {member && (
          <Link href={`/dashboard/scripts/${sortOrder}`} style={bigButton}>
            Open it in your app
          </Link>
        )}
        {!member && (
          <p style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.75)', margin: 0 }}>
            Already a member?{' '}
            <Link href="/login" style={{ color: '#fff', fontWeight: 700 }}>Log in</Link>
          </p>
        )}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          color: 'rgba(255,255,255,0.55)', marginTop: '14px', letterSpacing: '0.06em',
        }}>
          {SITE_URL.replace(/^https?:\/\//, '')}
        </p>
      </div>

      {/* ── THE STICKY BAR, PATREON'S SHAPE IN OUR COLOURS ────────────────
          One action, always in the thumb, for the stranger only. */}
      {!member && (
        <div style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 10,
          background: 'var(--cream)', borderTop: '2.5px solid var(--ink)',
          padding: '12px 14px calc(12px + env(safe-area-inset-bottom))',
          display: 'flex', justifyContent: 'center',
        }}>
          <Link href="/starter-pack" style={{ ...bigButton, width: 'min(100%, 520px)' }}>
            Find the words for your age
          </Link>
        </div>
      )}
    </div>
  )
}

const bigButton: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--terracotta)', color: 'var(--ink)',
  border: '2.5px solid var(--ink)', boxSizing: 'border-box',
  borderRadius: 'var(--radius-btn)', padding: '14px 28px', textDecoration: 'none',
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
  boxShadow: '0 5px 0 var(--ink)', minHeight: 54, maxWidth: '100%',
}
