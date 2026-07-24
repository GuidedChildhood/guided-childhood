'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PrintBrandFooter } from '@/components/brand/PrintBrand'
import { STAR_MINUTES } from '@/lib/quests/templates'

// The award button under every game, so a finished pack pays out like a
// printable does: it drops a one off family quest worth the pack's stars into
// the same approve loop, and the stars buy screen time once the parent ticks
// it. Screen only, never printed.
function AwardStars({ title, worth }: { title: string; worth: number }) {
  const [added, setAdded] = useState(false)
  async function add() {
    if (added) return
    setAdded(true)
    try {
      const r = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `Play ${title}`, emoji: '🎲', stars: worth, schedule: 'once', child_id: null }),
      })
      if (!r.ok) setAdded(false)
    } catch { setAdded(false) }
  }
  return (
    <button
      onClick={add}
      disabled={added}
      className="no-print"
      style={{
        marginTop: '14px', width: '100%',
        background: added ? 'var(--tint-sage)' : 'var(--terracotta)',
        border: 'none', borderRadius: '14px', padding: '13px 18px',
        cursor: added ? 'default' : 'pointer',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)',
        boxShadow: added ? 'none' : '0 4px 0 var(--terracotta-dark)',
      }}
    >
      {added ? 'On the quest list ✓ · stars land when you tick it' : `Add to quests · earns ${'⭐'.repeat(worth)}`}
    </button>
  )
}

// The Game Pack. Age banded printable games and crafts, each one screen
// free, each one worth stars, each one secretly a digital literacy
// lesson. Pick the age, print the sheets, play in the real world.

const BANDS = [
  { key: 'young', label: '4 to 7' },
  { key: 'middle', label: '8 to 10' },
  { key: 'older', label: '11 to 13' },
  { key: 'family', label: 'The whole family' },
] as const

type BandKey = (typeof BANDS)[number]['key']

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
}

function Sheet({ children, band, title, worth, lesson, plays }: {
  children: React.ReactNode
  band: string
  title: string
  worth: number
  lesson: string
  plays: string
}) {
  return (
    <div className="craft-sheet" style={{
      background: '#fff', border: '2px solid var(--ink)', borderRadius: '20px',
      padding: '28px', marginBottom: '24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Header band */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px', flexWrap: 'wrap' }}>
        <img src="/digi-squad/DiGi-star.svg" alt="" style={{ width: '44px', height: '44px' }} />
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ ...mono, fontSize: '9px', color: 'var(--terracotta-dark)' }}>{band} · Guided Childhood game pack</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.55rem', letterSpacing: '-0.02em', color: 'var(--ink)', margin: '2px 0 0' }}>
            {title}
          </h2>
        </div>
        <div style={{
          background: 'var(--butter, #EDC35F)', borderRadius: '14px', padding: '8px 14px',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '14px', color: 'var(--ink)',
          boxShadow: '0 3px 0 rgba(0,0,0,0.2)', flexShrink: 0,
        }}>
          Worth {'⭐'.repeat(worth)}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', margin: '0 0 18px' }}>
        <span style={{
          ...mono, fontSize: '9px', color: 'var(--ink)',
          background: 'var(--cream)', border: '1px solid var(--border)',
          borderRadius: '100px', padding: '4px 10px',
        }}>
          Plays like {plays}
        </span>
        <p style={{ fontSize: '12px', color: 'var(--ink-muted)', margin: 0, fontStyle: 'italic' }}>
          The sneaky lesson: {lesson}
        </p>
      </div>
      {children}
      <p style={{ ...mono, fontSize: '9px', color: 'var(--ink-light)', textAlign: 'center', marginTop: '20px' }}>
        Finished? Tick it on your quest page and the stars are yours
      </p>
      <AwardStars title={title} worth={worth} />
      <PrintBrandFooter />
    </div>
  )
}

// The fridge chart: stars turn into screen time, the same rate on every
// device. Printed big and colour in, it goes on the fridge so the whole deal
// is visible without opening the app. The star row is there to colour in as
// they are earned, the reward track a child can see filling up.
function StarChartSheet() {
  const rows: { icon: string; label: string }[] = [
    { icon: '📺', label: 'TV and films' },
    { icon: '🎮', label: 'Console and games' },
    { icon: '📱', label: 'Phone' },
    { icon: '💻', label: 'Tablet and iPad' },
  ]
  const ladder = [1, 2, 3, 5, 10]
  return (
    <div className="craft-sheet" style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <img src="/digi-squad/DiGi-star.svg" alt="" style={{ width: '44px', height: '44px' }} />
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ ...mono, fontSize: '9px', color: 'var(--terracotta-dark)' }}>For the fridge · Guided Childhood</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.55rem', letterSpacing: '-0.02em', color: 'var(--ink)', margin: '2px 0 0' }}>
            Stars turn into screen time
          </h2>
        </div>
      </div>
      <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 16px' }}>
        Jobs and games earn stars. Stars buy screen time, and <strong>1 star is {STAR_MINUTES} minutes</strong> on any screen. Same rate for the TV, the console, the phone and the tablet, because a screen is a screen.
      </p>

      {/* The conversion ladder */}
      <div style={{ border: '2px solid var(--ink)', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
        {ladder.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', background: i % 2 === 0 ? 'var(--cream)' : '#fff', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px', color: 'var(--ink)', minWidth: 62 }}>{s} {'⭐'.repeat(Math.min(s, 3))}{s > 3 ? '…' : ''}</span>
            <span style={{ flex: 1, borderBottom: '1px dashed var(--border)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px', color: 'var(--terracotta-dark)' }}>{s * STAR_MINUTES} minutes</span>
          </div>
        ))}
      </div>

      {/* Which screens it covers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '18px' }}>
        {rows.map(r => (
          <div key={r.label} style={{ border: '1.5px solid var(--border)', borderRadius: '12px', padding: '10px 12px', textAlign: 'center', background: 'var(--cream)' }}>
            <div style={{ fontSize: '1.4rem' }}>{r.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', color: 'var(--ink)', marginTop: '2px' }}>{r.label}</div>
          </div>
        ))}
      </div>

      {/* Colour a star as you earn it */}
      <div style={{ border: '2px dashed var(--terracotta-dark)', borderRadius: '14px', padding: '14px 16px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)', marginBottom: '8px' }}>
          My stars this week
        </div>
        <div style={{ fontSize: '26px', letterSpacing: '6px', lineHeight: 1.6, wordBreak: 'break-word' }}>
          {'☆'.repeat(20)}
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', marginTop: '4px' }}>
          Colour a star in every time a grown up says a job or a game is done.
        </div>
      </div>
      <PrintBrandFooter />
    </div>
  )
}

// The weekly star calendar, the child's name at the top, a row per day with
// stars to colour in as jobs and games are done. Fridge ready, the paper twin
// of the app's star bank, so a family with no child device still runs the loop.
function StarCalendarSheet({ childName }: { childName: string | null }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return (
    <div className="craft-sheet" style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ ...mono, fontSize: '9px', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>My week of stars · Guided Childhood</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>
          {childName ? `${childName}'s star week` : 'My star week'}
        </h2>
        {!childName && (
          <div style={{ borderBottom: '2.5px solid var(--ink)', width: '60%', margin: '10px auto 0', height: '28px' }} />
        )}
      </div>
      <div style={{ border: '2px solid var(--ink)', borderRadius: '16px', overflow: 'hidden' }}>
        {days.map((d, i) => (
          <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: i % 2 === 0 ? 'var(--cream)' : '#fff', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)', width: 86, flexShrink: 0 }}>{d}</span>
            <span style={{ flex: 1, fontSize: '20px', letterSpacing: '4px', color: 'var(--ink-light)' }}>{'☆'.repeat(5)}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>
        Colour a star for each job or game done. Stars turn into screen time on the fridge chart, and buy the prize on the reward sheet.
      </p>
      <PrintBrandFooter />
    </div>
  )
}

function CutLine() {
  return (
    <div style={{ ...mono, fontSize: '9px', color: 'var(--ink-light)', display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0' }}>
      ✂<span style={{ flex: 1, borderTop: '2px dashed var(--ink-light)' }} />cut along the dashed lines
    </div>
  )
}

const ROBOT_CARDS = [
  { emoji: '🚪', cmd: 'Walk to the nearest door and knock three times' },
  { emoji: '🛏️', cmd: 'Say goodnight to the tablet in a robot voice' },
  { emoji: '🧦', cmd: 'Pick up one sock and put it where it lives' },
  { emoji: '🤖', cmd: 'March around the sofa saying beep boop' },
  { emoji: '📺', cmd: 'Point at the TV and say screen time is finished' },
  { emoji: '🥕', cmd: 'Bring one healthy snack to the table' },
  { emoji: '🎵', cmd: 'Hum one song while standing on one leg' },
  { emoji: '🌟', cmd: 'Give the card holder a high five' },
]

const SNAP_PAIRS = ['📺', '📱', '🎮', '💻', '⌚', '🤖']

const BINGO_SQUARES = [
  'Someone says hurry, only today',
  'A toy looks way bigger than real life',
  'A game asks for money to keep playing',
  'A star says they just love the product',
  'Free, but you must sign up first',
  'A sad face turns happy after buying',
  'Everyone in the ad is laughing too hard',
  'A prize you can win if you click now',
  'Before and after pictures',
  'A cartoon sells food to kids',
  'Small words flash by too fast to read',
  'An unboxing that is secretly an ad',
  'Nine out of ten people agree',
  'A countdown clock on a deal',
  'The word FREE in giant letters',
  'An ad pretending to be a normal video',
]

const PASSWORD_COLS = [
  { head: 'Silly word', words: ['Wobbly', 'Sparkly', 'Bouncy', 'Grumpy', 'Invisible', 'Turbo'] },
  { head: 'Animal', words: ['Octopus', 'Hedgehog', 'Dragon', 'Penguin', 'Wombat', 'Narwhal'] },
  { head: 'Number and mark', words: ['77!', '39?', '52!', '81?', '26!', '64?'] },
]

const BOARD = (() => {
  // 30 squares, snakes slide down, ladders climb up. Every snake is a
  // screen trap, every ladder is a smart digital choice.
  const specials: Record<number, { kind: 'snake' | 'ladder'; to: number; note: string }> = {
    4:  { kind: 'ladder', to: 14, note: 'Told a grown up about a weird message. Climb!' },
    7:  { kind: 'snake',  to: 2,  note: 'One more video became six. Slide down.' },
    12: { kind: 'ladder', to: 21, note: 'Turned the tablet off first time asked. Climb!' },
    16: { kind: 'snake',  to: 8,  note: 'Shared a photo without asking. Slide down.' },
    19: { kind: 'ladder', to: 27, note: 'Spotted an advert pretending to be a game. Climb!' },
    24: { kind: 'snake',  to: 15, note: 'Took the phone to bed. Big slide down.' },
    28: { kind: 'snake',  to: 22, note: 'Believed everything a video said. Slide down.' },
  }
  return Array.from({ length: 30 }, (_, i) => ({ n: i + 1, special: specials[i + 1] ?? null }))
})()

const QUIZ_CARDS = [
  { q: 'A video shows a famous footballer saying he is quitting to become a chef. His mouth looks slightly blurry.', a: 'FAKE. Blurry or rubbery mouths are a classic deepfake giveaway. Check the club’s real account.' },
  { q: 'A news story appears on three different real news sites with the same facts.', a: 'LIKELY REAL. Cross checking on sources that check facts is the strongest test we have.' },
  { q: 'A voice note from your friend asks for your login because they got locked out.', a: 'TREAT AS FAKE. Voices can be cloned. Ring them on a number you already have before doing anything.' },
  { q: 'A photo of a politician has six fingers on one hand.', a: 'FAKE. AI image tools still get hands, ears and teeth wrong. Zoom in on the edges.' },
  { q: 'An account with 47 followers posts a miracle cure doctors do not want you to know.', a: 'FAKE. Miracle plus secret plus tiny account is the misinformation starter pack.' },
  { q: 'Your favourite creator posts an apology video that feels a bit flat and never blinks.', a: 'SUSPICIOUS. Not blinking and flat delivery are deepfake tells. Wait for a second source.' },
]

const DINNER_CARDS = [
  'What is the funniest thing you saw this week, screen or no screen?',
  'If you could invent an app that does one kind thing, what would it do?',
  'What is one thing the internet got wrong this week?',
  'Everyone says one thing they are brilliant at that needs no battery.',
  'If our family had a group chat rule, what should it be?',
  'What would you do with a whole Saturday and no screens at all?',
  'Who did you help today, and who helped you?',
  'Phones sleep in the kitchen tonight. What shall we do instead?',
]

export default function CraftPack({ childName = null }: { childName?: string | null }) {
  const [band, setBand] = useState<BandKey>('young')
  // The whole offline pack: every game across every age, plus the fridge star
  // chart and the weekly star calendar, all printed in one go for a family that
  // wants the paper set on the wall. Turning it on renders every sheet so a
  // single print run catches the lot.
  const [showAll, setShowAll] = useState(false)
  function printWholePack() {
    setShowAll(true)
    setTimeout(() => window.print(), 200)
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 20px 60px' }}>
      <style>{`
        @media print {
          header, .bottom-tab-bar, .no-print, .rightnow-desktop { display: none !important; }
          .craft-sheet { page-break-after: always; border-radius: 0 !important; margin-bottom: 0 !important; }
        }
      `}</style>

      {/* Screen chrome */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <div>
          <Link href="/dashboard/quests" style={{ ...mono, fontSize: '11px', color: 'var(--ink-muted)', textDecoration: 'none' }}>
            ← Quests
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 5vw, 2rem)', letterSpacing: '-0.02em', margin: '6px 0 4px' }}>
            The Game Pack
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)', maxWidth: '46ch', lineHeight: 1.55 }}>
            Screen free games that earn stars and quietly teach the digital skills. Print, cut, play. Every finished craft counts as a quest.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => window.print()} className="btn btn-gold" style={{ padding: '12px 22px', fontSize: '13px', cursor: 'pointer' }}>
            Print this pack
          </button>
          <button onClick={printWholePack} style={{ padding: '12px 22px', fontSize: '13px', cursor: 'pointer', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)' }}>
            ⭐ Print the whole offline pack
          </button>
        </div>
      </div>

      {/* When the whole pack is on, a line so the parent knows the print will
          be long: every game, the fridge chart and the star calendar at once. */}
      {showAll && (
        <div className="no-print" style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '14px', padding: '12px 16px', marginBottom: '18px', fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.5 }}>
          The whole offline star pack is ready below: every game for every age, the fridge star chart and {childName ? `${childName}'s` : 'the'} weekly star calendar. Print the lot, or use Print this pack for one age at a time.
        </div>
      )}

      {/* The offline pack extras lead when printing everything: the fridge
          star chart and the child's weekly star calendar, then all the games. */}
      {showAll && (
        <>
          <StarChartSheet />
          <StarCalendarSheet childName={childName} />
        </>
      )}

      {/* Age band picker */}
      {!showAll && (
      <div className="no-print" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}>
        {BANDS.map(b => (
          <button
            key={b.key}
            onClick={() => setBand(b.key)}
            style={{
              padding: '10px 18px', borderRadius: '100px', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
              background: band === b.key ? 'var(--terracotta)' : '#fff',
              color: 'var(--ink)',
              border: band === b.key ? 'none' : '1.5px solid var(--border)',
              boxShadow: band === b.key ? '0 3px 0 var(--terracotta-dark)' : 'none',
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
      )}

      {/* ------------------------------ 4 to 7 ------------------------------ */}
      {(showAll || band === 'young') && (
        <>
          <Sheet band="Ages 4 to 7" title="Robot Parent" worth={3} plays="Simon Says" lesson="computers only do exactly what they are told, nothing more">
            <div style={{ background: 'var(--cream)', borderRadius: '14px', padding: '14px 16px', marginBottom: '4px' }}>
              <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                <strong>How to play:</strong> cut out the cards. Your grown up is now a robot. Hand them a card and they must do it, exactly, in their best robot voice. Robots never guess and never do extra. That is how computers work too: they only follow instructions.
              </p>
            </div>
            <CutLine />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
              {ROBOT_CARDS.map((c, i) => (
                <div key={i} style={{
                  border: '2px dashed var(--ink-light)', borderRadius: '14px', padding: '14px 12px',
                  textAlign: 'center', background: '#fff',
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{c.emoji}</div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', lineHeight: 1.4, color: 'var(--ink)', margin: 0 }}>{c.cmd}</p>
                  <div style={{ ...mono, fontSize: '8px', color: 'var(--ink-light)', marginTop: '8px' }}>beep boop · command card</div>
                </div>
              ))}
            </div>
          </Sheet>

          <Sheet band="Ages 4 to 7" title="My Screen Rules door poster" worth={2} plays="a keep out sign, but yours" lesson="rules the child writes are rules the child keeps">
            <div style={{ border: '3px solid var(--ink)', borderRadius: '18px', padding: '24px', textAlign: 'center', background: '#fff' }}>
              <img src="/digi-squad/DiGi-star.svg" alt="DiGi" style={{ width: '90px', height: '90px', marginBottom: '8px' }} />
              <div style={{ ...mono, fontSize: '10px', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>this room belongs to</div>
              <div style={{ borderBottom: '3px solid var(--ink)', width: '60%', margin: '0 auto 20px', height: '34px' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.8rem', color: 'var(--ink)', margin: '0 0 18px', letterSpacing: '-0.02em' }}>
                MY SCREEN RULES
              </h3>
              {[1, 2, 3].map(n => (
                <div key={n} style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '18px', textAlign: 'left' }}>
                  <span style={{
                    width: 34, height: 34, borderRadius: '50%', background: 'var(--terracotta)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '16px', color: 'var(--ink)',
                  }}>{n}</span>
                  <span style={{ flex: 1, borderBottom: '2.5px solid var(--ink)', height: '30px' }} />
                </div>
              ))}
              <p style={{ fontSize: '12px', color: 'var(--ink-muted)', margin: 0 }}>
                Write your three rules with your grown up, colour DiGi in, stick it on your door. Your rules, your door, your call.
              </p>
            </div>
          </Sheet>

          <Sheet band="Ages 4 to 7" title="Goodnight Screens pairs" worth={2} plays="the memory pairs game" lesson="switching a screen off becomes a normal, happy part of the day">
            <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 4px' }}>
              <strong>How to play:</strong> cut out the cards and lay them face down. Take turns flipping two. Find a matching pair and you keep it, but only after you say goodnight to it out loud: goodnight tablet! Most pairs wins. Bedtime for screens becomes the fun bit, not the fight.
            </p>
            <CutLine />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {[...SNAP_PAIRS, ...SNAP_PAIRS].map((e, i) => (
                <div key={i} style={{
                  border: '2px dashed var(--ink-light)', borderRadius: '14px', aspectRatio: '1',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  background: '#fff',
                }}>
                  <span style={{ fontSize: '2rem' }}>{e}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)' }}>goodnight!</span>
                </div>
              ))}
            </div>
          </Sheet>
        </>
      )}

      {/* ------------------------------ 8 to 10 ----------------------------- */}
      {(showAll || band === 'middle') && (
        <>
          <Sheet band="Ages 8 to 10" title="Password Monster" worth={3} plays="Mad Libs" lesson="three random words beat any clever short password">
            <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 14px' }}>
              <strong>How to play:</strong> pick one word from each column and squash them together. WobblyOctopus77! is a monster of a passphrase: long, silly, easy for you to remember and horrible for a computer to guess. Then draw your monster below. Never tell anyone your real one except your grown up.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              {PASSWORD_COLS.map((col, i) => (
                <div key={i} style={{ background: 'var(--cream)', borderRadius: '14px', padding: '12px' }}>
                  <div style={{ ...mono, fontSize: '9px', color: 'var(--terracotta-dark)', marginBottom: '8px', textAlign: 'center' }}>{col.head}</div>
                  {col.words.map(w => (
                    <p key={w} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)', textAlign: 'center', margin: '0 0 6px' }}>{w}</p>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ border: '2px dashed var(--ink-light)', borderRadius: '16px', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ ...mono, fontSize: '10px', color: 'var(--ink-light)' }}>draw your password monster here</span>
            </div>
          </Sheet>

          <Sheet band="Ages 8 to 10" title="The Feed: snakes and ladders" worth={3} plays="snakes and ladders" lesson="the feed is built with traps and ladders, learn to spot both">
            <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 14px' }}>
              <strong>How to play:</strong> grab a dice and a counter each (coins work). Smart digital choices are ladders, screen traps are snakes. First to square 30 wins the remote for film night.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px', marginBottom: '14px' }}>
              {[...BOARD].reverse().map(sq => (
                <div key={sq.n} style={{
                  aspectRatio: '1', borderRadius: '10px', padding: '5px',
                  background: sq.special ? (sq.special.kind === 'ladder' ? 'var(--tint-sage, #DCE8DC)' : '#F6DBD3') : 'var(--cream)',
                  border: '1.5px solid var(--border)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px', color: 'var(--ink)' }}>{sq.n}</span>
                  {sq.special && (
                    <span style={{ fontSize: '13px', lineHeight: 1 }}>
                      {sq.special.kind === 'ladder' ? `🪜↑${sq.special.to}` : `🐍↓${sq.special.to}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {BOARD.filter(s => s.special).map(s => (
                <p key={s.n} style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.45, margin: 0 }}>
                  <strong>{s.special!.kind === 'ladder' ? '🪜' : '🐍'} {s.n}:</strong> {s.special!.note}
                </p>
              ))}
            </div>
          </Sheet>

          <Sheet band="Ages 8 to 10" title="Advert Detective Bingo" worth={3} plays="bingo" lesson="once you can spot the selling tricks, they stop working on you">
            <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 14px' }}>
              <strong>How to play:</strong> everyone gets a card for one normal evening of TV or YouTube. Spot a trick in the wild, cross it off, shout BINGO on a full line. Winner picks pudding. Grown ups play too and usually lose.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {BINGO_SQUARES.map((sq, i) => (
                <div key={i} style={{
                  aspectRatio: '1', borderRadius: '10px', padding: '7px',
                  background: i % 2 === 0 ? 'var(--cream)' : '#fff',
                  border: '1.5px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.35 }}>{sq}</span>
                </div>
              ))}
            </div>
          </Sheet>
        </>
      )}

      {/* ------------------------------ 11 to 13 ---------------------------- */}
      {(showAll || band === 'older') && (
        <>
          <Sheet band="Ages 11 to 13" title="Deepfake or Real: the family quiz" worth={3} plays="a TV quiz show" lesson="the tells of fake content, learned by beating your parents at it">
            <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 4px' }}>
              <strong>How to play:</strong> cut out the cards. Take turns reading one aloud. Everyone votes real or fake before the reader flips it for the answer. Score a point for each correct call. The child usually wins this. That is the point.
            </p>
            <CutLine />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
              {QUIZ_CARDS.map((c, i) => (
                <div key={i} style={{ border: '2px dashed var(--ink-light)', borderRadius: '14px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 14px', background: '#fff' }}>
                    <div style={{ ...mono, fontSize: '8px', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>card {i + 1} · real or fake?</div>
                    <p style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>{c.q}</p>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'var(--deep-teal, #173C46)', transform: 'rotate(180deg)' }}>
                    <p style={{ fontSize: '10.5px', color: '#fff', lineHeight: 1.45, margin: 0 }}>{c.a}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '10px', textAlign: 'center' }}>
              Answers print upside down so nobody peeks. Fold each card along the middle.
            </p>
          </Sheet>

          <Sheet band="Ages 11 to 13" title="Algorithm Architect" worth={3} plays="being the game maker for once" lesson="design the hook yourself and it never hooks you the same way again">
            <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 14px' }}>
              <strong>The job:</strong> you are the algorithm. Your only goal is to keep a player watching as long as possible. Design the next six videos for someone who just watched one football clip. Use every trick: cliffhangers, outrage, one more thing.
            </p>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '16px' }}>
                <span style={{
                  width: 30, height: 30, borderRadius: '8px', background: 'var(--deep-teal, #173C46)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '14px', color: '#fff',
                }}>{n}</span>
                <span style={{ flex: 1, borderBottom: '2px solid var(--ink)', height: '26px' }} />
              </div>
            ))}
            <div style={{ background: 'var(--butter, #EDC35F)', borderRadius: '14px', padding: '14px 16px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
                The debrief, together: which trick was strongest? Now the big one: whose feed is running these exact tricks on you, and where did it work this week?
              </p>
            </div>
          </Sheet>
        </>
      )}

      {/* ------------------------------ Family ------------------------------ */}
      {(showAll || band === 'family') && (
        <Sheet band="The whole family" title="Device free dinner cards" worth={2} plays="a card deck in a jar" lesson="the best parental control ever invented is a conversation">
          <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 4px' }}>
            <strong>How to play:</strong> cut out the cards, keep them in a jar on the table. Phones sleep somewhere else during dinner, grown ups included. Youngest picks a card, everyone answers, no wrong answers.
          </p>
          <CutLine />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px' }}>
            {DINNER_CARDS.map((q, i) => (
              <div key={i} style={{
                border: '2px dashed var(--ink-light)', borderRadius: '14px', padding: '16px 14px',
                background: i % 2 === 0 ? '#fff' : 'var(--cream)', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>🍽️</div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', lineHeight: 1.45, color: 'var(--ink)', margin: 0 }}>{q}</p>
              </div>
            ))}
          </div>
        </Sheet>
      )}
    </div>
  )
}
