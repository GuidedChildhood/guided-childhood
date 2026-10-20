'use client'

import { useState } from 'react'
import { chunky } from '@/components/scripts/card-system'

// ── PASS IT ON ──────────────────────────────────────────────────────────────
//
// Justin, 12 October 2026: "usable and sharable on social media to other
// parents."
//
// Before this, scripts could not be shared at all. Not badly, not at all. The
// only share anywhere in the scripts stack is the note for the child, which
// shares plain text with no link. So the one thing a parent genuinely wants to
// pass on, the sentence that stopped the fight on Tuesday, left this app as a
// screenshot or not at all.
//
// What this shares is a link to /say/<uuid>, a real public page with the words
// on it and an unfurl that shows the quote. The text goes in the share payload
// too, because WhatsApp shows the text immediately and the unfurl a beat
// later, and on a platform that strips previews the words still arrive.
//
// ── WHY THE WORDS AND THE LINK, NOT ONE OR THE OTHER ────────────────────────
//
// Text only is what we had: useful to the friend, invisible to us, and it
// cannot carry the other half of the script. A bare link is a demand for a
// tap before anybody knows if it is worth one. Both means the friend gets
// help in the group chat whether or not they ever open it, which is the only
// version of this that is honest.
//
// ── NO REFERRAL CODE HERE, DELIBERATELY ─────────────────────────────────────
//
// There is a £5 referral share in settings with a code and the disclosure that
// goes with it (CAP: an incentivised recommendation has to say so). This is a
// different act. A parent helping a friend at nine in the evening is not
// running a campaign, and quietly attaching their referral code to it would
// turn a kindness into an ad they did not know they were in. If the two ever
// need to meet, the referral share is the one that says so on the tin.

type Props = {
  /** The script's uuid, which is its public address. Never the sort_order:
   *  /say/1 to /say/342 would walk the whole paid library. */
  publicId: string
  title: string
  sayThis: string
}

export default function ShareScript({ publicId, title, sayThis }: Props) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')

  const share = async () => {
    // Built from the live origin at tap time rather than from the env var, so
    // the link is always the host the parent is actually on and a preview
    // deploy never shares a production URL or the other way round.
    const url = `${window.location.origin}/say/${publicId}`
    const text = `${title}\n\n"${sayThis}"\n\nThe rest of it, and what to say when they push back, is here:`

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
        return
      }
    } catch {
      // A cancelled share sheet throws. That is not a failure and must not
      // fall through to the clipboard, or cancelling would silently copy.
      return
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      setState('copied')
      setTimeout(() => setState('idle'), 2400)
    } catch { /* nothing useful to say, and nothing broken */ }
  }

  return (
    <button
      onClick={share}
      style={{
        ...chunky('white'),
        width: '100%', padding: '14px 20px', minHeight: 52,
        fontSize: 'var(--text-md)',
      }}
    >
      {state === 'copied' ? 'Copied, ready to paste ✓' : 'Send this to another parent'}
    </button>
  )
}
