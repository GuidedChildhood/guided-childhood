import { APP_ORIGIN } from '@/lib/config/site'
import { characterForStage } from '@/lib/content/stage-characters'

// WHICH PLANET FRIEND AN EMAIL SHOWS, AND WHEN IT SHOWS NONE.
//
// Justin, 15 August 2026: "only is some of the emails relating to emails that
// need to have them in so not all emails."
//
// That constraint is the whole design, so it is written here rather than left
// to each template to remember. A character that turns up on every email stops
// being a character and becomes furniture. On the child's side a Friend is
// EARNED, one per stage, over weeks; stapling one to a receipt or a trial
// reminder spends that meaning on decoration.
//
// The test a template has to pass before it calls this at all:
//
//   Is the email about the journey, the stage, the passport or the habit?
//     The Friend is the messenger for exactly those things. Show one.
//   Is it about money, a deadline, or one administrative fact?
//     No. A cartoon beside a charge reads as softening bad news.
//   Does it go to a LEAD, who has no child and no stage?
//     No. See stageId below: there is no "their" Friend to show.
//
// No art is the default. Art is the exception that earns its place.
//
// ── THE ART IS NOT THE APP'S ART ────────────────────────────────────────────
//
// public/digi-squad/friends/*.png are 512 square and 122 to 141 KB each, which
// is right for a retina phone screen and wrong for an inbox: five of those in
// one message is 659 KB of somebody's mobile data. public/digi-squad/friends/
// email/*.png are the same pictures at 192 square, 26 to 29 KB, displayed at 96
// so they stay crisp on a retina screen. Same source, same cast, a fifth of the
// weight.
//
// DiGi was deliberately absent until 8 October 2026: its art was an SVG, which
// Gmail's sanitiser drops and Outlook's Word engine never supported, so DiGi
// appeared for Apple Mail readers and vanished for the majority. The 3D star
// (digi-squad/README.md) is a raster, so friends/email/digi.png is the same
// 192 square, 15 KB treatment as the five, and emailDigi() below shows it on
// the emails whose whole subject is DiGi. The same test applies: DiGi marks
// the guide, never a charge or a deadline.

export type EmailFriend = {
  name: string
  /** Absolute, because an email client has no idea what our origin is. */
  src: string
  /** Carries the meaning when images are blocked. See the note below. */
  alt: string
}

/**
 * The Friend that marks this stage, or null when we do not honestly know.
 *
 * ── NULL IS A REAL ANSWER AND THE IMPORTANT ONE ─────────────────────────────
 *
 * The daily email cron falls back to STAGES[2], Explorer, for any member whose
 * child row or age_band is missing (app/api/email/cron/route.ts). That fallback
 * is right for choosing which words to send and WRONG for choosing a Friend: it
 * would hand a family Orbit and present it as their child's own character, on
 * the basis of a guess they never made. Two different jobs, one variable.
 *
 * So callers pass the stage id only when the child genuinely has one, and this
 * returns null otherwise. A template that gets null shows no art, which is the
 * default anyway.
 */
export function emailFriend(stageId: number | null | undefined): EmailFriend | null {
  if (!stageId) return null
  const character = characterForStage(stageId)
  if (!character) return null

  return {
    name: character.name,
    // The email sized copy, never character.img, which is the 512 square file
    // the app uses. Same filename, different folder, so the two can never be
    // confused for one another at a glance.
    src: `${APP_ORIGIN}/digi-squad/friends/email/${character.key}.png`,
    // ── ALT TEXT IS NOT A LABEL, IT IS THE FALLBACK COPY ──────────────────
    //
    // Gmail, Outlook and most clients block images on a first open, so for a
    // large share of readers this SENTENCE is the block. "Pebble" alone would
    // leave a stray word floating above a paragraph. This reads as a caption
    // either way, which is what alt text on a decorative-but-meaningful image
    // has to do.
    alt: `${character.name}, the Planet Friend for this stage`,
  }
}

/**
 * DiGi, for the emails whose subject is DiGi itself: how it thinks, how it
 * learns, who checks it, what it asks of you. Not stage bound, so unlike a
 * Friend it is honest on a lead's email too: there is no "your child's" DiGi
 * to get wrong.
 */
export function emailDigi(): EmailFriend {
  return {
    name: 'DiGi',
    src: `${APP_ORIGIN}/digi-squad/friends/email/digi.png`,
    alt: 'DiGi, the golden star who answers your questions in the app',
  }
}
