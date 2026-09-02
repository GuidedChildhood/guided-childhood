'use client'

import { useState } from 'react'
import { KID_REQUEST_IDEAS } from '@/lib/quests/templates'
import { bestJobsFor, KIND_TINT, type BestJob } from '@/lib/quests/best-jobs'
import { playKidSound } from '@/lib/sound/kidSounds'
import { resolveTheme, type KidTheme } from '@/lib/kid/theme'
import { HAPPY, HappyMasthead, Sticker, StarShape } from '@/components/kid/HappyNewsBits'

// The child pitches their own job.
//
// Justin: "here on child's app you should be able to suggest quest to parent,
// there is a page that should open."
//
// He was right that it should be a page, and right that it was not one. The
// whole flow existed already, buried 1600 lines down the single Quests screen,
// and the New job tile that should have led to it called /api/quests/more
// instead: a bare "wants more quests" ping that stores nothing and cannot say
// WHAT the child had in mind. Worse, once that ping was sent the tile flipped
// to "Asked, grown up knows" and stopped doing anything at all, so the one entry
// point a child would press became a dead end.
//
// /api/quests/request has always done the real thing: the ask lands as a row
// with a title, the parent's phone names the idea, and one tap on Manage jobs
// turns it into a real job with stars. Same pattern as the parent's own Manage
// jobs earlier today, and the same fix: give it a page and point the tile at it.
//
// THE HAPPY NEWS EDITION. Justin, 2 September 2026, with the card on Jonny's
// phone: "tidy up child job request, have the best options as first ones,
// make sure it has a great happy news type set, work icons super child
// friendly, and change recommended ones by age." The old card offered the
// same flat seven ideas to a four year old and a fifteen year old, and its
// tiles broke words in half ("footbal l"). Now the ideas are the ranked best
// jobs for the child's own stage (lib/quests/best-jobs, the same list the
// parent's Add a job leads with), most useful first, each tile a proper
// happy news sticker: the icon in a tinted circle, the stars it is worth,
// the words whole. The old seven ride along at the end so nothing a child
// liked disappears.
//
// Extracted here so the page and the Quests screen cannot drift apart. The
// printable asks on the Quests screen still call the route directly, because
// those are a different ask ("send me this sheet") that happens to share a
// table, and folding them in here would make this component about two things.

export type KidAsk = { id: string; title: string; emoji: string; status: string }

// Matches MAX_PENDING_ASKS in app/api/quests/request. Checked here too so a
// child gets a warm sentence instead of a silent refusal from the server.
const MAX_PENDING = 5

// Eight tiles first, the rest behind one tap. Twenty tiles is a catalogue.
const FOLD = 8

type Idea = { title: string; emoji: string; stars: number; tint: string }

function ideasFor(ageBand: string | null | undefined): Idea[] {
  const best = bestJobsFor(ageBand).jobs.map((j: BestJob) => ({ title: j.title, emoji: j.emoji, stars: j.stars, tint: KIND_TINT[j.kind].bg }))
  const extra = KID_REQUEST_IDEAS
    .filter(i => !best.some(b => b.title === i.title))
    .map(i => ({ title: i.title, emoji: i.emoji, stars: 2, tint: 'var(--stage-3)' }))
  return [...best, ...extra]
}

export default function KidAskForJob({
  token,
  initialAsks,
  childName,
  theme,
  ageBand,
}: {
  token: string
  initialAsks: KidAsk[]
  childName?: string
  // The colour the child chose. Three lines here sit directly on the page
  // background rather than inside the white card, so they were white on dark
  // and would have vanished the moment the page took a pastel wash.
  theme?: KidTheme
  /** The child's age band, which picks the ranked ideas. */
  ageBand?: string | null
}) {
  const t = theme ?? resolveTheme(null)
  const [asks, setAsks] = useState<KidAsk[]>(initialAsks)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  // The tile a child just tapped. Without this the tile vanished the instant
  // it was tapped (a pending ask filters it out of the grid below), so the
  // grid reflowed under the child's finger and the only confirmation was a
  // toast at the far edge of the screen. The tile itself says Sent for a
  // beat, then leaves.
  const [sentTitle, setSentTitle] = useState<string | null>(null)

  const say = (msg: string) => { setNote(msg); setTimeout(() => setNote(null), 3500) }
  const pending = asks.filter(a => a.status === 'pending').length

  async function submit(title: string, emoji: string) {
    const clean = title.replace(/\s+/g, ' ').trim().slice(0, 60)
    if (clean.length < 3 || busy) return
    if (pending >= MAX_PENDING) {
      say('Lots of ideas already waiting! Ask again once your grown up answers.')
      return
    }
    setBusy(true)
    setText('')
    playKidSound('star')
    // Shown straight away, because a child who taps and sees nothing assumes it
    // broke. Taken back below if the server says no, because a row the child
    // believes in that was never saved is the worse of the two bugs.
    const localId = `local-${asks.length}-${clean}`
    setAsks(prev => [{ id: localId, title: clean, emoji, status: 'pending' }, ...prev])
    setSentTitle(clean)
    setTimeout(() => setSentTitle(null), 1200)
    say('Quest idea sent to your grown up! ⭐')
    try {
      const res = await fetch('/api/quests/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, title: clean, emoji }),
      })
      if (!res.ok) {
        setAsks(prev => prev.filter(a => a.id !== localId))
        const d = await res.json().catch(() => null)
        say(d?.reason === 'daily_limit'
          ? 'That is plenty of ideas for today. Have another think tomorrow!'
          : 'That one did not send. Try again in a minute.')
      } else {
        // The fifth of the five a day, ticked by actually asking.
        //
        // Nothing anywhere marked this step done, and Ask for a job is one of
        // the two that are ALWAYS in the five. So no child could finish a day,
        // which means no streak could ever be earned, no celebration could ever
        // fire, and the Friends had nothing feeding them. A row that cannot be
        // completed sitting permanently in a list of five is worse than not
        // being there at all, and it was quietly holding up the whole economy
        // behind it.
        //
        // On the SUCCESSFUL send, not on arrival. The balance step ticks by
        // being read because reading it is the whole of that step. This one is
        // not: the step is pitching an idea, so landing on the page and
        // wandering off has not done it. A tick has to mean the thing it says.
        //
        // Fire and forget. The endpoint refuses a step that is not in today's
        // five and dedupes the done list, so a repeat costs nothing, and a
        // child who has just sent their idea should never be interrupted by a
        // failure to tick a box about it.
        fetch('/api/kid/day', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, step: 'ask' }),
        }).catch(() => { /* the day simply stays as it was */ })
      }
    } catch {
      setAsks(prev => prev.filter(a => a.id !== localId))
      say('That one did not send. Try again in a minute.')
    }
    setBusy(false)
  }

  // Hide an idea only while it is STILL WAITING on a parent, not forever.
  //
  // Justin, 9 August 2026, from the child app: "it's one of the 5 ask for a job
  // but it's a list that I cannot add one, can you check how this works and why
  // I can't add one, it may be a restriction on too many jobs."
  //
  // It was not a restriction. Both caps were clear: the child had one ask
  // pending against a limit of five, and none at all today against a limit of
  // five. What had happened is that this line matched on title at ANY status,
  // and the child had at some point asked for all seven presets and had every
  // one approved. So the filter emptied the grid completely and the tap to ask
  // route disappeared, leaving a free text box on a page that still says "tap
  // one, or write your own". Nothing above it explains where the list went.
  //
  // An approved job is the opposite of a reason to hide the idea: it is proof
  // the child likes doing it and the parent said yes. Helping with dinner again
  // next week is exactly the behaviour this feature exists to produce. Only an
  // ask still sitting in the queue is worth suppressing, because asking twice
  // for the same undecided thing is the one case that genuinely clutters a
  // parent's approvals.
  // The just sent tile stays for its Sent beat even though it is now pending.
  const ideas = ideasFor(ageBand).filter(
    i => i.title === sentTitle || !asks.some(a => a.title === i.title && a.status === 'pending'),
  )
  const shown = showAll ? ideas : ideas.slice(0, FOLD)
  const hidden = ideas.length - shown.length
  const canPitch = text.trim().length >= 3

  return (
    <div>
      <HappyMasthead
        kicker="Pitch a job"
        title="Got a quest idea?"
        sub="Tap one, or write your own. Your grown up says yes and it turns into a real quest with stars."
        right={<Sticker accent="white" rotate={8}><StarShape size={13} /> Best for you</Sticker>}
        style={{ marginBottom: 14 }}
      />

      {ideas.length > 0 && (
        <>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.inkMuted, margin: '0 0 10px' }}>
            Best ones first{childName ? `, ${childName}` : ''}
          </p>
          {/* minmax(0, 1fr) rather than 1fr: a grid item's default min width
              is auto, so a long word would hold the track open. Words are
              never broken in half; the tile is a column, so the title has the
              whole width to wrap on spaces. */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 10, marginBottom: 12 }}>
            {shown.map(idea => {
              const justSent = idea.title === sentTitle
              return (
                <button
                  key={idea.title}
                  disabled={justSent}
                  onClick={() => { submit(idea.title, idea.emoji); playKidSound('tap') }}
                  aria-label={`${idea.title}, ${idea.stars} ${idea.stars === 1 ? 'star' : 'stars'}`}
                  style={{
                    position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
                    textAlign: 'left', cursor: justSent ? 'default' : 'pointer', minHeight: 132,
                    padding: '12px 12px 12px', borderRadius: 18,
                    background: justSent ? HAPPY.green : '#fff', color: justSent ? '#fff' : HAPPY.ink,
                    border: `2px solid ${HAPPY.ink}`, boxShadow: `0 4px 0 ${HAPPY.ink}`,
                    transition: 'background .2s ease',
                  }}
                >
                  <span aria-hidden style={{
                    width: 46, height: 46, borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box',
                    background: justSent ? '#fff' : idea.tint, border: `2px solid ${HAPPY.ink}`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, lineHeight: 1,
                  }}>
                    {justSent ? '✓' : idea.emoji}
                  </span>
                  <span style={{ position: 'absolute', top: 8, right: 8 }}>
                    <Sticker accent={justSent ? 'white' : 'butter'} rotate={7} size="sm">
                      <StarShape size={11} color={HAPPY.ink} /> {idea.stars}
                    </Sticker>
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', lineHeight: 1.2, minWidth: 0, overflowWrap: 'normal', wordBreak: 'normal' }}>
                    {justSent ? 'Sent!' : idea.title}
                  </span>
                </button>
              )
            })}
          </div>
          {hidden > 0 && (
            <button
              onClick={() => { setShowAll(true); playKidSound('tap') }}
              style={{
                display: 'block', margin: '0 auto 14px', padding: '11px 18px', borderRadius: 100, cursor: 'pointer',
                border: `2px solid ${HAPPY.ink}`, background: '#fff', color: HAPPY.ink, boxShadow: `0 4px 0 ${HAPPY.ink}`,
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
              }}
            >
              Show {hidden} more ideas ↓
            </button>
          )}
        </>
      )}

      {/* Write your own */}
      <div style={{ background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 20, padding: '14px 14px 14px', boxShadow: `0 4px 0 ${HAPPY.ink}` }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: HAPPY.ink, margin: '0 0 10px' }}>
          Or write your own ✏️
        </p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submit(text, '⭐') }}
            placeholder="Your idea..."
            maxLength={60}
            style={{
              flex: 1, minWidth: 0, padding: '13px 14px', borderRadius: 14,
              border: `2px solid ${HAPPY.ink}`, background: HAPPY.cream,
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: HAPPY.ink, outline: 'none',
            }}
          />
          <button
            onClick={() => submit(text, '⭐')}
            disabled={!canPitch}
            style={{
              padding: '13px 18px', borderRadius: 14, flexShrink: 0,
              border: `2px solid ${HAPPY.ink}`, cursor: canPitch ? 'pointer' : 'default',
              background: canPitch ? HAPPY.butter : '#fff', color: HAPPY.ink,
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
              boxShadow: canPitch ? `0 4px 0 ${HAPPY.ink}` : 'none',
              opacity: canPitch ? 1 : 0.55,
            }}
          >
            Pitch it
          </button>
        </div>
      </div>

      {/* What has already been asked, and where each one got to. This is the
          half that was missing from a bare ping: the child could ask and then
          had no way of ever seeing what happened next. */}
      {asks.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {/* From the theme, because this sits on the page background rather
              than inside the white card, and that background is whatever colour
              the child picked. A fixed colour here is invisible on half of them. */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.inkMuted, margin: '0 0 8px' }}>
            Your ideas so far
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {asks.slice(0, 8).map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 16, padding: '11px 12px', boxShadow: `0 3px 0 ${HAPPY.ink}` }}>
                <span style={{ fontSize: 'var(--text-lg)', flexShrink: 0 }}>{a.emoji}</span>
                <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: HAPPY.ink, lineHeight: 1.25 }}>{a.title}</span>
                <span style={{ flexShrink: 0 }}>
                  {a.status === 'added'
                    ? <Sticker accent="green" rotate={5} size="sm">It is on ⭐</Sticker>
                    : a.status === 'declined'
                      ? <Sticker accent="white" rotate={5} size="sm">Not this time</Sticker>
                      : <Sticker accent="butter" rotate={5} size="sm">Waiting</Sticker>}
                </span>
              </div>
            ))}
          </div>
          {/* Said plainly, because a child watching a Waiting row needs to know
              nothing is stuck and nobody is ignoring them. */}
          {pending > 0 && (
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: t.inkSoft, lineHeight: 1.5, margin: '10px 0 0' }}>
              {pending === 1 ? 'One idea is' : `${pending} ideas are`} with your grown up. They get a message on their phone, so it is not lost.
            </p>
          )}
        </div>
      )}

      {note && (
        <div role="status" style={{ position: 'fixed', left: '50%', bottom: 22, transform: 'translateX(-50%)', zIndex: 60, maxWidth: 'calc(100% - 32px)', background: HAPPY.ink, color: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 14, padding: '12px 18px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', textAlign: 'center', lineHeight: 1.35 }}>
          {note}
        </div>
      )}
    </div>
  )
}
