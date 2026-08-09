'use client'

import { useState } from 'react'
import { KID_REQUEST_IDEAS } from '@/lib/quests/templates'
import { playKidSound } from '@/lib/sound/kidSounds'
import { resolveTheme, type KidTheme } from '@/lib/kid/theme'

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
// Extracted here so the page and the Quests screen cannot drift apart. The
// printable asks on the Quests screen still call the route directly, because
// those are a different ask ("send me this sheet") that happens to share a
// table, and folding them in here would make this component about two things.

export type KidAsk = { id: string; title: string; emoji: string; status: string }

// Matches MAX_PENDING_ASKS in app/api/quests/request. Checked here too so a
// child gets a warm sentence instead of a silent refusal from the server.
const MAX_PENDING = 5

export default function KidAskForJob({
  token,
  initialAsks,
  childName,
  theme,
}: {
  token: string
  initialAsks: KidAsk[]
  childName?: string
  // The colour the child chose. Three lines here sit directly on the page
  // background rather than inside the white card, so they were white on dark
  // and would have vanished the moment the page took a pastel wash.
  theme?: KidTheme
}) {
  const t = theme ?? resolveTheme(null)
  const [asks, setAsks] = useState<KidAsk[]>(initialAsks)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)

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
  const ideas = KID_REQUEST_IDEAS.filter(
    i => !asks.some(a => a.title === i.title && a.status === 'pending'),
  )

  return (
    <div>
      <div style={{ background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: '20px', padding: '16px 18px', boxShadow: '0 4px 0 rgba(26,26,46,0.08)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 4px' }}>
          Got a quest idea? 💡
        </p>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
          Tap one, or write your own. Your grown up says yes to turn it into a real quest with stars.
        </p>

        {ideas.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px', marginBottom: '14px' }}>
            {ideas.map(idea => (
              <button
                key={idea.title}
                onClick={() => { submit(idea.title, idea.emoji); playKidSound('tap') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '9px', textAlign: 'left', cursor: 'pointer',
                  padding: '13px 14px', borderRadius: '14px',
                  background: 'var(--cream)', border: '1.5px solid rgba(26,26,46,0.08)',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25,
                }}
              >
                <span style={{ fontSize: 'var(--text-lg)', flexShrink: 0 }}>{idea.emoji}</span>
                <span style={{ minWidth: 0 }}>{idea.title}</span>
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submit(text, '⭐') }}
            placeholder="Write your own idea..."
            maxLength={60}
            style={{
              flex: 1, minWidth: 0, padding: '13px 14px', borderRadius: '14px',
              border: '1.5px solid rgba(26,26,46,0.12)', background: 'var(--cream)',
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', outline: 'none',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--terracotta)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(26,26,46,0.12)' }}
          />
          <button
            onClick={() => submit(text, '⭐')}
            disabled={text.trim().length < 3}
            style={{
              padding: '13px 20px', borderRadius: '14px', border: 'none', flexShrink: 0,
              cursor: text.trim().length < 3 ? 'default' : 'pointer',
              background: 'var(--terracotta)', color: 'var(--ink)',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
              boxShadow: text.trim().length < 3 ? 'none' : '0 4px 0 var(--terracotta-dark)',
              opacity: text.trim().length < 3 ? 0.55 : 1,
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
        <div style={{ marginTop: '18px' }}>
          {/* From the theme, because this sits on the page background rather
              than inside the white card, and that background is whatever colour
              the child picked. A fixed colour here is invisible on half of them. */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.inkMuted, margin: '0 0 8px' }}>
            Your ideas so far
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {asks.slice(0, 8).map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: '14px', padding: '11px 13px' }}>
                <span style={{ fontSize: 'var(--text-md)', flexShrink: 0 }}>{a.emoji}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>{a.title}</span>
                <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: a.status === 'added' ? 'var(--retro-green-dark, var(--deep-teal))' : 'var(--ink-muted)' }}>
                  {a.status === 'added' ? 'IT IS ON ⭐' : a.status === 'declined' ? 'NOT THIS TIME' : 'WAITING'}
                </span>
              </div>
            ))}
          </div>
          {/* Said plainly, because a child watching a WAITING row needs to know
              nothing is stuck and nobody is ignoring them. */}
          {pending > 0 && (
            <p style={{ fontSize: 'var(--text-base)', color: t.inkSoft, lineHeight: 1.5, margin: '10px 0 0' }}>
              {pending === 1 ? 'One idea is' : `${pending} ideas are`} with your grown up. They get a message on their phone, so it is not lost.
            </p>
          )}
        </div>
      )}

      {note && (
        <div role="status" style={{ position: 'fixed', left: '50%', bottom: '22px', transform: 'translateX(-50%)', zIndex: 60, maxWidth: 'calc(100% - 32px)', background: 'var(--ink)', color: '#fff', borderRadius: '14px', padding: '12px 18px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', textAlign: 'center', lineHeight: 1.35 }}>
          {note}
        </div>
      )}

      {childName && asks.length === 0 && (
        <p style={{ fontSize: 'var(--text-base)', color: t.inkSoft, lineHeight: 1.55, marginTop: '16px' }}>
          Anything you think you could help with counts, {childName}. Even a small one.
        </p>
      )}
    </div>
  )
}
