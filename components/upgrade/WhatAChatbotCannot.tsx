import HappyIcon, { type HappyIconName } from '@/components/kid/HappyIcon'

// ── WHAT A FREE CHATBOT CANNOT DO ───────────────────────────────────────────
//
// Review board, 13 October 2026 (paywall-names-what-ai-cannot): the question a
// parent actually weighs at the price is "why not just ask a chatbot for free",
// and no screen in the product answered it. The home page said only "DiGi
// remembers", the choose screen and the upgrade page never mentioned a chatbot
// at all, and WhatYouAreBuying is a parts list.
//
// So four lines, the same four everywhere, in the words a parent would use at
// the school gate rather than ours. No model is named and no competitor is
// named: the point is what a general chatbot cannot be, not who makes one.
//
// EVERY LINE HAS A PROOF PATH, checked on 16 October 2026 before it was
// written. If one of these stops being true, the line goes, not the proof:
//
//   remembers last Tuesday   lib/digi/brain.ts getFamilyMemory (digi_memory,
//                            retrieved by meaning into every answer)
//   it checks back in        lib/digi/tools.ts schedule_followup,
//                            app/api/cron/followups, lib/digi/weekly-review.ts
//   their own app            app/k/[token] (token link, no login: jobs, stars,
//                            lessons, the quest board)
//   the worry moving         components/daily/ConcernCheckIn.tsx (a face per
//                            worry, the first one is the baseline),
//                            lib/concerns/outcome.ts and
//                            app/(dashboard)/dashboard/what-is-working
//   words ready, printable   the scripts table, the yes / partly / no verdict
//                            on script_completions.worked that DiGi reads back
//                            (lib/digi/rating-loop.ts), and the fridge card
//                            (components/rightnow/ScriptFridgeCard.tsx)
//
// ONE COMPONENT, TWO SIZES. 'section' is the home page block, a whole band of
// its own so another lane can rework the sections around it without touching
// this. 'card' sits inside the 640 column of the upgrade page and under the
// two doors on the choose screen.

type Line = { icon: HappyIconName; said: string; why: string }

export const CHATBOT_CANNOT: Line[] = [
  {
    icon: 'calendar',
    said: 'It remembers last Tuesday.',
    why: 'Tonight’s answer starts from what you told DiGi last week, the worry you are tracking and the words that worked. You never explain your child twice.',
  },
  {
    icon: 'jobs',
    said: 'Your child has their own app.',
    why: 'Their jobs, stars and lessons, opened from one link with no login. They take part instead of being talked about.',
  },
  {
    icon: 'sprout',
    said: 'You see the worry move.',
    why: 'Tap a face for it from the first day and you can see where bedtime started and where it is now.',
  },
  {
    icon: 'print',
    said: 'The words are ready, and you can print them.',
    why: 'Scripts written in advance from the research, not made up on the spot. Say whether one worked and DiGi remembers that too.',
  },
]

const SAID: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)',
  letterSpacing: '-0.01em', lineHeight: 1.2, margin: 0,
}

function IconPlate({ name, size }: { name: HappyIconName; size: number }) {
  return (
    <span aria-hidden="true" style={{
      width: size + 14, height: size + 14, flexShrink: 0, boxSizing: 'border-box',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-tile)',
    }}>
      <HappyIcon name={name} size={size} />
    </span>
  )
}

export default function WhatAChatbotCannot({ variant = 'card' }: { variant?: 'card' | 'section' }) {
  if (variant === 'section') {
    return (
      <section aria-label="What a free chatbot cannot do" style={{
        background: 'var(--stage-1)', borderTop: '1px solid var(--border)',
        padding: 'clamp(64px, 9vw, 96px) 20px',
      }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <p className="eyebrow" style={{ textAlign: 'center', color: 'var(--terracotta-dark)', marginBottom: '12px' }}>
            Why not just ask a chatbot?
          </p>
          <h2 style={{ textAlign: 'center', margin: '0 auto 12px', maxWidth: '640px' }}>
            Four things a free chatbot cannot do for your family
          </h2>
          <p style={{ textAlign: 'center', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 auto 36px', maxWidth: '560px' }}>
            A chatbot waits for your next question. This is built around one family, and it checks back in with you.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: '16px' }}>
            {CHATBOT_CANNOT.map(l => (
              <div key={l.icon} style={{
                background: '#fff', border: 'var(--edge)', boxShadow: 'var(--lift)',
                borderRadius: 'var(--radius-card)', padding: '20px 18px',
                display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                <IconPlate name={l.icon} size={34} />
                <p style={{ ...SAID, fontSize: 'var(--text-lg)' }}>{l.said}</p>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>{l.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div style={{
      background: '#fff', border: 'var(--edge)', boxShadow: 'var(--lift)',
      borderRadius: 'var(--radius-card)', padding: '18px 20px', marginBottom: '24px',
    }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        Why not just ask a chatbot?
      </p>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
        color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em', margin: '0 0 14px',
      }}>
        What a free chatbot cannot do
      </h2>
      {/* One column in the 640 upgrade column, two side by side under the
          wider choose screen, from the same rule. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '12px 20px' }}>
        {CHATBOT_CANNOT.map(l => (
          <div key={l.icon} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <IconPlate name={l.icon} size={26} />
            <div>
              <p style={{ ...SAID, fontSize: 'var(--text-md)', marginBottom: '2px' }}>{l.said}</p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>{l.why}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
