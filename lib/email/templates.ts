// The lifecycle and nurture emails. Plain warm HTML in the butter and ink
// system, table based so every client renders it, Justin's voice
// throughout. No dashes in any copy.

import { EFCW_STRANDS } from '@gc/shared/efcw'
import type { WeeklyReview } from '@/lib/digi/weekly-review'
import type { MonthPace } from '@/lib/balance/pace'
import { SCHOOL_EVENTS, yearGroupFromDob } from '@/lib/learning/calendar'
import { transitionFor } from '@/lib/learning/transition'
import {
  bandedWrapper, eyebrow, h1, linkList, rule, sectionHead, tickList, p as bp,
  type Band,
} from '@/lib/email/blocks'

const INK = '#1A1A2E'
const INK_SOFT = '#52526A'
const INK_MUTED = '#8888A0'
const BUTTER = '#E9B949'
const BUTTER_DARK = '#C29018'
const CREAM = '#F9F8F6'
const BORDER = '#EAEAF0'

const APP = process.env.NEXT_PUBLIC_APP_URL ?? 'https://guidedchildhood.com'

function button(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0"><tr><td style="background:${BUTTER};border-radius:16px;box-shadow:0 5px 0 ${BUTTER_DARK}">
    <a href="${url}" style="display:inline-block;padding:15px 32px;font-family:'IBM Plex Mono',Menlo,monospace;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${INK};text-decoration:none">${label}</a>
  </td></tr></table>`
}

function wrapper(body: string, unsubscribe: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${CREAM}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:32px 16px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border:1px solid ${BORDER};border-radius:20px">
      <tr><td style="padding:36px 32px 8px">
        <div style="font-family:'IBM Plex Mono',Menlo,monospace;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${BUTTER_DARK};margin-bottom:20px">Guided Childhood</div>
        <div style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.7;color:${INK}">
        ${body}
        </div>
      </td></tr>
      <tr><td style="padding:8px 32px 32px">
        <div style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:${INK_SOFT}">Justin<br><span style="color:${INK_MUTED};font-size:13px">Founder, Guided Childhood · Bath, UK</span></div>
      </td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px"><tr><td style="padding:18px 8px;text-align:center">
      <span style="font-family:'IBM Plex Mono',Menlo,monospace;font-size:11px;color:${INK_MUTED}">
        You get these because you joined Guided Childhood.
        <a href="${unsubscribe}" style="color:${INK_MUTED}">Stop the emails</a>
      </span>
    </td></tr></table>
  </td></tr></table>
</body></html>`
}

function heading(text: string): string {
  return `<h1 style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:24px;font-weight:800;line-height:1.2;color:${INK};margin:0 0 18px">${text}</h1>`
}

function p(text: string): string {
  return `<p style="margin:0 0 16px">${text}</p>`
}

export interface EmailContent {
  subject: string
  html: string
}

// 1 · Welcome, sent the moment onboarding completes
export function welcomeEmail(params: {
  parentName: string
  childName: string
  unsubscribe: string
}): EmailContent {
  const { parentName, childName, unsubscribe } = params
  return {
    subject: 'Your first script is ready',
    html: wrapper(
      heading(`Welcome, ${parentName}.`) +
      p(`You just did the thing most parents put off. You started before the next screen fight, not after it.`) +
      p(`DiGi has already picked your first script based on what you told us about ${childName}. It takes two minutes to read and it gives you the exact words for tonight.`) +
      button('Open my first script', `${APP}/dashboard/scripts/recommended`) +
      p(`One thing to know about how this works: no bans, no guilt, no fifty page course. One small move at a time, matched to your child's stage.`),
      unsubscribe
    ),
  }
}

// 2 · Day 2, the stage guide
export function day2StageEmail(params: {
  childName: string
  stageName: string
  stageFocus: string
  unsubscribe: string
}): EmailContent {
  const { childName, stageName, stageFocus, unsubscribe } = params
  return {
    subject: `What the ${stageName} stage is really about`,
    html: wrapper(
      heading(`${childName} is in the ${stageName} stage.`) +
      p(`Here is the one sentence version: ${stageFocus}.`) +
      p(`Every script, weekly action and DiGi answer you get is calibrated to this stage. Not generic advice for children, the right move for this age, right now.`) +
      button('See my stage pathway', `${APP}/dashboard/pathway`) +
      p(`Five minutes on the pathway page and you will know exactly where you are and what comes next.`),
      unsubscribe
    ),
  }
}

// 3 · Day 3, the full tour: every service, one line each, one link each.
// Every earlier email is about ONE thing. This is the only one that
// walks through everything on offer, step by step, so nothing gets
// missed inside the app itself.
export function day3TourEmail(params: {
  parentName: string
  childName: string
  unsubscribe: string
}): EmailContent {
  const { parentName, childName, unsubscribe } = params
  const step = (num: number, title: string, body: string, label: string, url: string): string =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px">
      <tr>
        <td width="34" valign="top" style="padding-right:12px">
          <div style="width:26px;height:26px;border-radius:50%;background:${BUTTER};color:${INK};font-family:'IBM Plex Mono',Menlo,monospace;font-weight:700;font-size:13px;text-align:center;line-height:26px">${num}</div>
        </td>
        <td valign="top">
          <div style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:16px;font-weight:800;color:${INK};margin-bottom:4px">${title}</div>
          <div style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:${INK_SOFT};margin-bottom:8px">${body}</div>
          <a href="${url}" style="font-family:'IBM Plex Mono',Menlo,monospace;font-size:12px;font-weight:700;letter-spacing:0.04em;color:${BUTTER_DARK};text-decoration:none">${label} →</a>
        </td>
      </tr>
    </table>`

  return {
    subject: `Everything Guided Childhood does for ${childName}, in one email`,
    html: wrapper(
      heading(`${parentName}, here is the whole toolkit.`) +
      p(`Three days in, so here is every piece in one place, what each one is for and where to find it. Save this one, it works as a map any time you are not sure where something lives.`) +
      step(1, 'Scripts', `The exact words for the moment you are in: what to say, what not to say, and why it works. This is the one to open when a screen fight is happening right now.`, 'Open scripts', `${APP}/dashboard/scripts`) +
      step(2, 'DiGi', `Your evidence led guide for the question too small for a professional and too specific for a book. Ask it anything about ${childName} and screens, any time.`, 'Ask DiGi', `${APP}/dashboard/digi`) +
      step(3, 'Family Quests', `${childName}'s everyday jobs, packing a bag, getting dressed, being kind, earn stars. Stars buy the screen time you both agree on. They tick, you approve.`, 'Set up quests', `${APP}/dashboard/quests`) +
      step(4, 'Family Agreement', `The rules decided together, not handed down, covering screens off time, where devices sleep, and what happens when something goes wrong. Signed by both of you.`, 'Build your agreement', `${APP}/dashboard/agreement`) +
      step(5, 'School emails, caught automatically', `Forward school emails to your private address and PE kit days, forms and deadlines land as reminders here, straight into the platform, never buried in an inbox.`, 'Connect your school', `${APP}/dashboard/school`) +
      step(6, 'Your Progress page', `Streaks, wellbeing signals and where ${childName} sits on the pathway to 16, all in one view. This is the page that answers is it working.`, 'See your progress', `${APP}/dashboard/pathway`) +
      step(7, 'Help now', `The gold button at the bottom of every screen. Mid meltdown, tap it, pick the situation, the calm script is on screen in seconds.`, 'Open the dashboard', `${APP}/dashboard`) +
      p(`Every one of these is built on the actual research on kids, screens and growing up online, not opinion. More on that another time.`),
      unsubscribe
    ),
  }
}

// 4 · Day 4, the DiGi nudge
export function day4DigiEmail(params: {
  childName: string
  unsubscribe: string
}): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: 'The 11pm question',
    html: wrapper(
      heading(`The question you cannot ask anyone else.`) +
      p(`Every parent has one. The thing with ${childName} and screens that feels too small for a professional and too specific for a book.`) +
      p(`That is exactly what DiGi is for. Ask it the real question, the messy one, at 11pm if that is when it surfaces. It knows ${childName}'s stage and it answers with the actual words to say, not theory.`) +
      button('Ask DiGi now', `${APP}/dashboard/digi`) +
      p(`Parents tell us the first real question is the moment this stops feeling like an app.`),
      unsubscribe
    ),
  }
}

// 4 · Day 7, founder rate with the live counter
export function day7FounderEmail(params: {
  remaining: number
  unsubscribe: string
}): EmailContent {
  const { remaining, unsubscribe } = params
  return {
    subject: `${remaining} founding places left`,
    html: wrapper(
      heading(`You have been here a week.`) +
      p(`So here is the honest pitch, once, and then I will stop mentioning it.`) +
      p(`The first 50 families lock in £7.99 a month for life. The price never rises for you, whatever the platform grows into. Right now <strong>${remaining} of the 50 places are left</strong>, and the counter is real, it is enforced in the code.`) +
      p(`That unlocks every stage as your child grows, unlimited DiGi, all 100 plus scripts, the wellbeing tracker and the family agreement builder.`) +
      button('Claim a founding place', `${APP}/dashboard/upgrade`) +
      p(`And if now is not the moment, the free tier is not going anywhere.`),
      unsubscribe
    ),
  }
}

// ── The service drip ──
// One benefit email per service, spaced through the second week and each only
// sent when that service is NOT set up yet, so it is a genuine "here is why,
// here is where" nudge and never nags about something already done. Justin's
// voice, benefit first, one clear door.

// Child's own app on their device
export function childPhoneEmail(params: { childName: string; unsubscribe: string }): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: `Give ${childName} their own version`,
    html: wrapper(
      heading(`${childName} can have their own app.`) +
      p(`It is the piece parents tell us changes the mood at home the most. ${childName} opens their own screen and sees their jobs, ticks them off, and watches their stars grow into screen time they earned.`) +
      p(`No app store, no logins, nothing to install. You hold up a code, they point their tablet or phone at it, and they are in. You approve everything from your side, and there is nothing they can break.`) +
      button('Set up their app', `${APP}/dashboard/quests`) +
      p(`For a little one with no device, the same app opens on your phone and you do it together.`),
      unsubscribe
    ),
  }
}

// Family Quests and earned screen time
export function screenTimeEmail(params: { childName: string; unsubscribe: string }): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: 'Screen time, without the fight',
    html: wrapper(
      heading(`Turn screen time into something earned.`) +
      p(`The daily battle usually comes from screens being a thing you give or take away. Family Quests flips it: ${childName}'s everyday jobs earn stars, stars buy the minutes you both agreed, and ${childName} chooses when to spend them.`) +
      p(`No timer standoff, no nagging. When the time is up, their own screen says so, and yours gets a quiet heads up too. When they have run out, the answer is never a telling off, it is do another job.`) +
      button('Set up quests and screen time', `${APP}/dashboard/quests`) +
      p(`This is the bit backed by the research on self regulation: a child who earns and spends their own time learns to manage it.`),
      unsubscribe
    ),
  }
}

// Watch together lessons
export function lessonsEmail(params: { childName: string; unsubscribe: string }): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: 'Five minutes that does the hard talk for you',
    html: wrapper(
      heading(`The talks you dread, done in five minutes.`) +
      p(`Comparison, strangers, staying kind online, knowing when to stop. Big talks, and hard to start. The lessons do the starting for you.`) +
      p(`Short films you watch together on your device, or send straight to ${childName}'s phone to play on their own. Each one lands one idea in ${childName}'s language, then earns them a star for finishing.`) +
      button('Watch one together', `${APP}/dashboard/lessons`) +
      p(`No lecture from you needed. DiGi even nudges you the next one when the time is right.`),
      unsubscribe
    ),
  }
}

// School reminders
export function schoolRemindersEmail(params: { childName: string; unsubscribe: string }): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: 'Never miss another kit day',
    html: wrapper(
      heading(`PE kit, forms and deadlines, sorted.`) +
      p(`Add your weekly routines once, or forward a school email to your private address, and the night before you get a reminder while there is still time to pack the bag or sign the form. Nothing buried in an inbox.`) +
      p(`The child friendly ones reach ${childName} too, so packing the swimming kit becomes their job, not only something you carry in your head.`) +
      button('Set up school reminders', `${APP}/dashboard/school`) +
      p(`It works whether or not your school ever emails you.`),
      unsubscribe
    ),
  }
}

// Family agreement
export function familyAgreementEmail(params: { childName: string; unsubscribe: string }): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: 'The rules that actually stick',
    html: wrapper(
      heading(`Agree the screen rules together, once.`) +
      p(`Rules handed down get fought. Rules a child helped write get kept. The family agreement walks you both through five short talks: screens off times, where devices sleep at night, what happens when something goes wrong, and turns them into one simple sheet you both sign.`) +
      p(`It takes one sitting with ${childName}, and it ends the daily renegotiation because the answer is already agreed and on the wall.`) +
      button('Build your agreement', `${APP}/dashboard/agreement`) +
      p(`Not a contract to police them. A promise you make to each other.`),
      unsubscribe
    ),
  }
}

// 5 · Weekly digest with the child's progress
export function weeklyDigestEmail(params: {
  childName: string
  stageName: string
  scriptsDoneTotal: number
  scriptsDoneThisWeek: number
  unsubscribe: string
  // The one balance signal worth reaching a parent who has not opened the app:
  // the young age phone flag. Optional, and deliberately the only screen time
  // line in the weekly digest, so the parent is never marked on the clock every
  // week. Rendered as a calm note with its own link when present.
  balanceNote?: string | null
  // One service a week, chosen by lib/email/spotlights.ts. It lives inside this
  // email rather than in one of its own on purpose: the digest already arrives
  // weekly, already carries the unsubscribe, and already has the parent's
  // attention. A second weekly send is how a list starts opting out.
  //
  // Absent when a parent has seen them all, and a digest with no spotlight is a
  // perfectly good digest. Never repeated, or the section teaches itself to be
  // skipped.
  spotlight?: { title: string; body: string; cta: string; href: string } | null
}): EmailContent {
  const { childName, stageName, scriptsDoneTotal, scriptsDoneThisWeek, unsubscribe, balanceNote, spotlight } = params
  const weekLine = scriptsDoneThisWeek > 0
    ? `You used ${scriptsDoneThisWeek === 1 ? 'one script' : `${scriptsDoneThisWeek} scripts`} this week. That is ${scriptsDoneThisWeek === 1 ? 'a real conversation' : 'real conversations'} that went differently because you had the words.`
    : `No scripts this week. No guilt about that, life happens. One two minute script tonight puts the week back on track.`
  return {
    subject: `${childName}'s week on the pathway`,
    html: wrapper(
      heading(`Your week with ${childName}.`) +
      p(weekLine) +
      p(`All together you have completed <strong>${scriptsDoneTotal === 1 ? 'one script' : `${scriptsDoneTotal} scripts`}</strong> on the ${stageName} stage. Every one of them is a pattern ${childName} will carry into the next stage.`) +
      (balanceNote ? p(balanceNote) + button('See the balance', `${APP}/dashboard/stats`) : '') +
      button('Open this week’s script', `${APP}/dashboard/scripts/recommended`) +
      p(`Ten minutes this week. That is the whole ask.`) +
      // Set apart from the week's own news by a rule and a tint, so it reads as
      // one extra thing worth knowing rather than as more of the report.
      (spotlight
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 8px;border-top:1px solid ${BORDER}"><tr><td style="padding:26px 0 0">
             <div style="font-family:'IBM Plex Mono',Menlo,monospace;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${BUTTER_DARK};margin-bottom:10px">Something you already have</div>
             <div style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:20px;font-weight:800;line-height:1.25;color:${INK};margin:0 0 12px">${spotlight.title}</div>
             <div style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.7;color:${INK}">${spotlight.body}</div>
             ${button(spotlight.cta, spotlight.href)}
           </td></tr></table>`
        : ''),
      unsubscribe
    ),
  }
}

// 10 · Lead nurture, sent once to an email captured before an account exists
// (a magnet download or a quiz drop off). Warm, no hard sell, one door to the
// free trial. No account yet, so unsubscribe is a plain reply address.
export function leadNurtureEmail(unsubscribe: string = LEAD_UNSUB, cta: string = `${APP}/starter-pack`): EmailContent {
  return {
    subject: 'Your pathway is a couple of minutes away',
    html: wrapper(
      heading('Whenever you are ready.') +
      p(`You grabbed something from us recently, thank you. If it was useful, there is a whole calm plan behind it, matched to your child's age.`) +
      p(`It takes about two minutes to set up, no card needed, and the free trial opens everything: the scripts for the hard conversations, the daily moments, and DiGi whenever you want the exact words.`) +
      button('Start the free trial', cta) +
      p(`No rush, and no pressure. The door stays open whenever the timing feels right.`),
      unsubscribe
    ),
  }
}

// 8 · Trial ending, the gentle nudge two days before a no card trial runs
// out. No pressure, a reminder of what they would keep, one clear door.
export function trialEndingEmail(params: {
  childName: string
  daysLeft: number
  unsubscribe: string
}): EmailContent {
  const { childName, daysLeft, unsubscribe } = params
  const when = daysLeft <= 1 ? 'tomorrow' : `in ${daysLeft} days`
  return {
    subject: `Your free trial ends ${when}`,
    html: wrapper(
      heading('A quick heads up.') +
      p(`Your free trial ends ${when}. No card was taken, so nothing happens automatically, this is just so it does not catch you out.`) +
      p(`If it has helped with ${childName}, keeping it means the daily moments, the scripts for the hard conversations, and DiGi whenever you need the words all stay on.`) +
      button('Keep everything on', `${APP}/dashboard/upgrade`) +
      p(`And if the timing is not right, that is completely fine. You drop to the free tier and keep your pathway. Nothing is lost.`),
      unsubscribe
    ),
  }
}

// 9 · Win back, sent once a short while after a trial lapses unpaid. Warm,
// no guilt, the door left open.
export function winBackEmail(params: {
  childName: string
  unsubscribe: string
}): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: 'The door is still open',
    html: wrapper(
      heading('No rush, just a hello.') +
      p(`Your trial wrapped up and you are on the free tier now, which is a perfectly good place to be. No guilt here.`) +
      p(`When things with ${childName} feel like they need a steadier hand again, everything is one tap from being back on: the scripts, the daily moments, DiGi at 11pm.`) +
      button('Pick up where you left off', `${APP}/dashboard/upgrade`) +
      p(`One small thing this week is the whole idea. That is all it ever asks.`),
      unsubscribe
    ),
  }
}

// 7 · School reminder, the belt and braces channel alongside the push. A
// strong, specific subject so it stands out in a busy inbox, the list of
// what is due, and a plain link to fix it if DiGi picked it up wrong from a
// forwarded school email.
export function schoolReminderEmail(params: {
  titles: string[]
  adjustUrl: string
  unsubscribe: string
}): EmailContent {
  const { titles, adjustUrl, unsubscribe } = params
  const subject = titles.length === 1
    ? `Tomorrow: ${titles[0]} 🎒`
    : `Tomorrow for school: ${titles[0]} and ${titles.length - 1} more 🎒`
  const list = titles.map(t => `<li style="margin:0 0 6px">${t}</li>`).join('')
  return {
    subject,
    html: wrapper(
      heading('From school, due tomorrow.') +
      p('Here is what to sort tonight while it is still easy:') +
      `<ul style="margin:0 0 16px;padding-left:20px;font-size:16px;color:${INK}">${list}</ul>` +
      button('Open my school reminders', `${APP}/dashboard/school`) +
      p(`Not right, or DiGi picked it up wrong from an email? <a href="${adjustUrl}" style="color:${BUTTER_DARK};font-weight:700">Adjust or clear it here</a>.`),
      unsubscribe
    ),
  }
}

// 6 · Lead magnet delivery, sent the moment a parent asks for a free
// printable. Warm, short, and it points gently on to the free pathway
// without a hard sell. There is no account yet, so unsubscribe is a
// plain reply address rather than a signed link.
export function magnetEmail(params: {
  magnetTitle: string
  downloadUrl: string
  cta?: string
}): EmailContent {
  const { magnetTitle, downloadUrl } = params
  const cta = params.cta ?? `${APP}/starter-pack`
  return {
    subject: `Your download: ${magnetTitle}`,
    html: wrapper(
      heading('Here is your download.') +
      p(`Thanks for grabbing <strong>${magnetTitle}</strong>. It is one page, made to print and stick on the fridge. No login needed.`) +
      button('Download the printable', downloadUrl) +
      p(`If the button does not work, paste this into your browser: <a href="${downloadUrl}" style="color:${BUTTER_DARK}">${downloadUrl}</a>`) +
      p(`This is the free front door to Guided Childhood. When you want the calm plan behind it, the starter pack picks the first small move for your child in about two minutes.`) +
      button('See the free starter pack', cta),
      'mailto:hello@guidedchildhood.com?subject=Unsubscribe'
    ),
  }
}

// Minutes to a short label for the weekly review stats block.
function fmtMinsEmail(mins: number): string {
  const m = Math.max(0, Math.round(mins))
  const h = Math.floor(m / 60)
  const r = m % 60
  if (h <= 0) return `${r} min`
  if (r === 0) return `${h}h`
  return `${h}h ${r}m`
}

// The DiGi weekly catch up. The clever per family read the Sunday review
// already builds, turned into an email so it reaches a parent who lives in
// their inbox, not only the phone push: the week's own numbers, one warm note,
// one gentle watch for, and one thing to set up for next week. Nothing is
// shared or compared, the numbers are the family's own.
export function weeklyReviewEmail(params: {
  parentName: string
  childLabel: string
  review: WeeklyReview
  unsubscribe: string
  poll?: { question: string; results: { label: string; pct: number }[]; total: number } | null
}): EmailContent {
  const { childLabel, review, unsubscribe, poll } = params
  const s = review.stats
  const statRow = (label: string, value: string) => `<tr>
    <td style="padding:8px 4px;font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:15px;color:${INK_SOFT}">${label}</td>
    <td style="padding:8px 4px;font-family:'IBM Plex Mono',Menlo,monospace;font-size:14px;font-weight:700;color:${INK};text-align:right">${value}</td>
  </tr>`
  const rows = [
    statRow('Jobs done', `${s.questsApproved}`),
    statRow('Stars earned', `${s.starsEarned}`),
    statRow('Screen time', s.deviceMinutes > 0 ? fmtMinsEmail(s.deviceMinutes) : 'none logged'),
    ...(s.lessonsDone.length ? [statRow('Lessons', `${s.lessonsDone.length}`)] : []),
    ...(s.momentsDone ? [statRow('Calm moments', `${s.momentsDone}`)] : []),
    statRow('Days you showed up', `${s.activeDays} of 7`),
  ].join('')

  return {
    subject: `${childLabel}'s week with DiGi`,
    html: wrapper(
      heading(`This week with ${childLabel}`) +
      p(review.summary) +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};border:1px solid ${BORDER};border-radius:14px;padding:8px 16px;margin:0 0 20px">${rows}</table>` +
      (review.watch_for ? p(`<strong>One thing to keep an eye on.</strong> ${review.watch_for}`) : '') +
      (review.suggestion ? p(`<strong>For next week.</strong> ${review.suggestion}`) : '') +
      // Once a month the community bite comes back as the crowd: what every
      // other family answered. The reassurance is the whole point, so it reads
      // as company rather than a chart.
      (poll && poll.total > 0
        ? `<div style="background:${CREAM};border:1px solid ${BORDER};border-radius:14px;padding:16px 18px;margin:0 0 20px">
             <div style="font-family:'IBM Plex Mono',Menlo,monospace;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BUTTER_DARK};margin-bottom:6px">This month, across every family</div>
             <div style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:17px;font-weight:800;color:${INK};line-height:1.3;margin-bottom:12px">${poll.question}</div>
             ${poll.results.map(r => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px"><tr>
               <td style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:15px;color:${INK_SOFT};padding-right:10px">${r.label}</td>
               <td width="52" style="font-family:'IBM Plex Mono',Menlo,monospace;font-size:14px;font-weight:700;color:${INK};text-align:right">${r.pct}%</td>
             </tr><tr><td colspan="2" style="padding-top:4px">
               <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFEDE8;border-radius:100px"><tr>
                 <td width="${r.pct}%" style="background:${BUTTER};border-radius:100px;font-size:0;line-height:6px">&nbsp;</td>
                 <td style="font-size:0;line-height:6px">&nbsp;</td>
               </tr></table>
             </td></tr></table>`).join('')}
             <div style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:13px;color:${INK_MUTED};margin-top:10px">${poll.total} ${poll.total === 1 ? 'family' : 'families'} answered. Whatever your week looked like, you are in good company.</div>
           </div>`
        : '') +
      button('See the full week', `${APP}/dashboard`) +
      p(`These numbers are ${childLabel}'s own. Nothing here is shared or set against another family, it is just your week, read back to you.`),
      unsubscribe
    ),
  }
}

// The monthly screen time review.
//
// One number, one verdict, one thing to do, and nothing else. The weekly review
// is the rich one with jobs and stars and lessons; this is deliberately the
// opposite. A parent skimming an inbox should get the whole answer from the
// subject line, and the body should confirm it in about eight seconds.
//
// The verdict wording is the same VERDICT_LABEL the stats page uses, so the
// email and the app never disagree about whether a month was alright. Anything
// else would make the email untrustworthy, and an untrustworthy monthly email
// is worse than no monthly email.
//
// The colour follows the verdict rather than the brand, because a green block
// saying "well over the guide" is a mixed message, and this is the one email
// where the parent needs to read the temperature before the words.
export function monthlyBalanceEmail(params: {
  childLabel: string
  monthLabel: string
  pace: MonthPace
  /** The heaviest device of the month, when there was one. */
  heaviest?: { label: string; minutes: number } | null
  unsubscribe: string
}): EmailContent {
  const { childLabel, monthLabel, pace, heaviest, unsubscribe } = params

  const tone = pace.verdict === 'well_over'
    ? { bg: '#FDECEC', border: '#F3C9C9', ink: '#A33A3A' }
    : pace.verdict === 'a_little_high'
    ? { bg: '#FBF0E6', border: '#E8C9A8', ink: '#A65D2E' }
    : { bg: '#EDF5F1', border: '#D6E5DF', ink: '#236F52' }

  const arrow = pace.direction === 'down' ? '↓' : pace.direction === 'up' ? '↑' : null

  return {
    subject: `${childLabel}'s screen time in ${monthLabel}: ${pace.headline.toLowerCase()}`,
    html: wrapper(
      heading(`${monthLabel}, in one number`) +
      `<div style="background:${tone.bg};border:1px solid ${tone.border};border-radius:16px;padding:20px 22px;margin:0 0 20px">
         <div style="font-family:'IBM Plex Mono',Menlo,monospace;font-size:11px;font-weight:700;letter-spacing:0.13em;text-transform:uppercase;color:${tone.ink};margin-bottom:10px">${pace.headline}</div>
         <div style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:42px;font-weight:800;line-height:1;color:${INK};letter-spacing:-0.02em">${pace.average} <span style="font-size:19px;font-weight:800">minutes a day</span></div>
         ${pace.previousAverage != null
           ? `<div style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:15px;color:${INK_SOFT};margin-top:8px">${arrow ? `${arrow} ` : ''}last month was ${pace.previousAverage}</div>`
           : ''}
       </div>` +
      p(pace.line) +
      (heaviest
        ? p(`Most of it was on ${heaviest.label}, at ${fmtMinsEmail(heaviest.minutes)} across the month.`)
        : '') +
      button('See the full picture', `${APP}/dashboard/stats`) +
      p(`This is a budget, not a rule. A heavy weekend does not break anything, it just makes the next few days a little lighter. Nothing here is compared against another family.`),
      unsubscribe
    ),
  }
}

// ── Pre sign up teasers ──────────────────────────────────────────────
// One clever thing per email, each earning the sign up by showing not telling.
// Sent to leads on a gentle cadence. Every call to action goes to the free
// starter pack (house rule 9).
//
// The cron passes a real signed stop link (leadUnsubscribeUrl), which matters
// most for the parent who took a printable with one address and then joined
// with another: the account check matches on address, so two addresses defeat
// it and always will, and without a working link they were stuck being sold
// what they already own. The mailto stays only as the default for a caller
// with no address to hand, which in practice is the fixture pages.

const LEAD_UNSUB = 'mailto:hello@guidedchildhood.com?subject=Unsubscribe'

export function digiTeaserEmail(unsubscribe: string = LEAD_UNSUB, cta: string = `${APP}/starter-pack`): EmailContent {
  return {
    subject: 'The assistant that never just says no',
    html: wrapper(
      heading('An answer, not a ban.') +
      p(`Most advice on screens comes down to take it away. That teaches a child nothing for the day they get it back.`) +
      p(`DiGi is different. Ask it anything, the 11pm worry, the game you have never heard of, the friend who just got a phone, and it hands you a calm pathway for your child's exact age. Never allow or deny, always one small step you can actually take tonight.`) +
      p(`It is the part parents tell us they did not know they were missing.`) +
      button('See the free starter pack', cta),
      unsubscribe
    ),
  }
}

export function scriptsTeaserEmail(unsubscribe: string = LEAD_UNSUB, cta: string = `${APP}/starter-pack`): EmailContent {
  return {
    subject: 'The exact words for the 7am screen meltdown',
    html: wrapper(
      heading('When you do not know what to say.') +
      p(`The tablet goes off, the morning falls apart, and every calm plan you had goes with it. In that moment you do not need a theory, you need the next sentence.`) +
      p(`Guided Childhood gives you the actual words. Short scripts for the meltdowns, the handovers and the hard nos, written with child psychologists, ready to read off your phone while it is happening.`) +
      p(`Warm, firm, and tested on real mornings.`) +
      button('See the free starter pack', cta),
      unsubscribe
    ),
  }
}

export function printablesTeaserEmail(unsubscribe: string = LEAD_UNSUB, cta: string = `${APP}/starter-pack`): EmailContent {
  return {
    subject: 'Print it tonight, offline win tomorrow',
    html: wrapper(
      heading('Screens down, without the fight.') +
      p(`Sometimes the best screen tool is a piece of paper. Star charts for the fridge, colour in Planet Friends, a whole offline pack a child can do at the table while you make tea.`) +
      p(`Every printable ties back to the same reward loop as the app, so time off screens becomes something a child chooses, not something you have to enforce.`) +
      p(`Print one tonight and see what tomorrow looks like.`) +
      button('See the free starter pack', cta),
      unsubscribe
    ),
  }
}

export function balanceTeaserEmail(unsubscribe: string = LEAD_UNSUB, cta: string = `${APP}/starter-pack`): EmailContent {
  return {
    subject: 'An hour a day, is that ok?',
    html: wrapper(
      heading('The number, settled by the science.') +
      p(`Every parent asks it and no one gives a straight answer. Guided Childhood does. It shows the healthy amount of recreational screen for your child's exact age, per day and per week, drawn straight from the WHO, the American Academy of Pediatrics, the Canadian movement guidelines and the RCPCH.`) +
      p(`Then it sets your child's real usage against it, so you can see at a glance where an hour a day actually sits. A calm steer for their age, never a hard cap.`) +
      button('See the free starter pack', cta),
      unsubscribe
    ),
  }
}

export function mentalHealthTeaserEmail(unsubscribe: string = LEAD_UNSUB, cta: string = `${APP}/starter-pack`): EmailContent {
  return {
    subject: 'It is not just you',
    html: wrapper(
      heading('The worry you have not said out loud.') +
      p(`The late night doubt, the comparison, the feeling that everyone else has this figured out. They do not, and the evidence is clear that these moments are normal.`) +
      p(`Guided Childhood has a library of those exact moments, each one met with a calm, research backed reason it is ok, from the people parents actually trust. Not just for your child. For you.`) +
      button('See the free starter pack', cta),
      unsubscribe
    ),
  }
}

export function safetyTeaserEmail(unsubscribe: string = LEAD_UNSUB, cta: string = `${APP}/starter-pack`): EmailContent {
  return {
    subject: 'The talk about deepfakes and scams, done for you',
    html: wrapper(
      heading('The hard talks, made easy.') +
      p(`Strangers, scams, deepfakes, what stays online forever. The conversations that matter most are the ones we put off because we do not know how to start them.`) +
      p(`Guided Childhood turns each one into a five minute lesson, pitched to your child's age, that does the hard part for you. You come out of it closer, not lectured at.`) +
      button('See the free starter pack', cta),
      unsubscribe
    ),
  }
}

export function passportTeaserEmail(unsubscribe: string = LEAD_UNSUB, cta: string = `${APP}/starter-pack`): EmailContent {
  return {
    subject: 'One map, from 4 to 16',
    html: wrapper(
      heading('A childhood you can see.') +
      p(`Digital parenting feels like a hundred separate decisions. Guided Childhood turns it into one clear map, a passport your child grows along from their first safe steps at 4 to full readiness at 16.`) +
      p(`Every job done, every lesson learned and every calm screen off earns a stamp. You always know where you are, and where you are heading next.`) +
      button('See the free starter pack', cta),
      unsubscribe
    ),
  }
}

export function founderLeadEmail(params: { remaining: number; unsubscribe?: string; cta?: string }): EmailContent {
  const { remaining, unsubscribe = LEAD_UNSUB } = params
  return {
    subject: `${remaining} founding places left`,
    html: wrapper(
      heading('Before the founder rate closes.') +
      p(`You had a look at Guided Childhood but have not started yet, so here is the one nudge worth sending.`) +
      p(`The founder rate opens the whole platform for £7.99 a month, held for life, and it is capped at 50 families. Right now there are <strong>${remaining}</strong> places left. When they are gone the price goes up and stays up.`) +
      p(`The starter pack still picks your child's first move in about two minutes, free.`) +
      button('Claim a founding place', params.cta ?? `${APP}/starter-pack`),
      unsubscribe
    ),
  }
}

// ── Post sign up pillar reveals ──────────────────────────────────────
// Once a family is in, reveal one feature at a time so the free plan feels
// generous. Each is only sent when that feature has not been touched yet, so it
// is a genuine here is why, here is where, never a nag about something done.

export function printablesRevealEmail(params: { childName: string; unsubscribe: string }): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: `Colour in the Planet Friends with ${childName} tonight`,
    html: wrapper(
      heading('The offline pack is yours.') +
      p(`Alongside the app there is a whole set of printables: star charts for the fridge, colour in Planet Friends, weekly calendars and the full offline pack, all free on your plan.`) +
      p(`They use the same stars ${childName} already earns, so screen off time becomes a reward, not a battle. Print one tonight.`) +
      button('Open the printables', `${APP}/dashboard/printables`),
      unsubscribe
    ),
  }
}

export function balanceRevealEmail(params: { childName: string; unsubscribe: string }): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: `Where ${childName}'s screen time actually sits`,
    html: wrapper(
      heading('The balance, by the science.') +
      p(`Your balance and stats now show the healthy amount of recreational screen for ${childName}'s age, per day and per week, drawn from the WHO, the American Academy of Pediatrics, the Canadian movement guidelines and the RCPCH.`) +
      p(`It sets ${childName}'s real usage against that guide, so you can see in one glance whether a day sits inside the healthy range. A steer for their age, never a hard cap.`) +
      button('See the balance', `${APP}/dashboard/quests`),
      unsubscribe
    ),
  }
}

export function mentalHealthRevealEmail(params: { unsubscribe: string }): EmailContent {
  const { unsubscribe } = params
  return {
    subject: 'For the worry you have not said out loud',
    html: wrapper(
      heading('This one is for you.') +
      p(`The late night doubt, the comparison, the feeling everyone else has it figured out. Guided Childhood has a library of those exact moments, each met with a calm, research backed reason it is normal.`) +
      p(`It is there whenever you need it, from the experts parents actually trust. Two minutes, and you feel a little less alone in it.`) +
      button('Open the library', `${APP}/dashboard`),
      unsubscribe
    ),
  }
}

export function passportRevealEmail(params: { childName: string; unsubscribe: string }): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: `${childName}'s passport is filling up`,
    html: wrapper(
      heading('See how far you have come.') +
      p(`Every job done, lesson learned and calm screen off earns ${childName} a stamp on their passport, the one map that runs from their first safe steps to full readiness at 16.`) +
      p(`It is the clearest way to see the childhood you are building, one small win at a time. Take a look at where you are.`) +
      button('Open the passport', `${APP}/dashboard/pathway`),
      unsubscribe
    ),
  }
}

// The keepsake order confirmation. A physical thing is being made and posted,
// so this says plainly what was bought, what happens next and roughly when,
// because the gap between paying and a parcel arriving is where doubt lives.
export function orderConfirmationEmail(params: {
  lines: { name: string; qty: number }[]
  totalLabel: string
  childName: string | null
  unsubscribe: string
}): EmailContent {
  const { lines, totalLabel, childName, unsubscribe } = params
  const list = lines
    .map(l => `<li style="margin:0 0 6px">${l.name}${l.qty > 1 ? ` × ${l.qty}` : ''}</li>`)
    .join('')
  return {
    subject: 'Your keepsake is on its way',
    html: wrapper(
      heading('Thank you. We are making it now.') +
      p(`Here is what you ordered:`) +
      `<ul style="margin:0 0 16px;padding-left:20px">${list}</ul>` +
      p(`Total paid: <strong>${totalLabel}</strong>`) +
      p(childName
        ? `The passport prints ${childName}'s real stamps, the ones actually earned, so no two are ever the same. That does mean each one is made to order rather than pulled off a shelf.`
        : `Everything here is made to order rather than pulled off a shelf.`) +
      p(`Expect it inside two weeks. If anything is wrong when it lands, reply to this email and I will sort it myself.`) +
      button('See the passport', `${APP}/dashboard/pathway`),
      unsubscribe
    ),
  }
}

// The note to ourselves. Not a customer email: it is the thing that stops a
// paid order sitting unnoticed while a family waits.
export function orderFulfilmentEmail(params: {
  orderId: string
  email: string
  lines: { name: string; qty: number }[]
  totalLabel: string
  childName: string | null
  shipping: string
}): EmailContent {
  const { orderId, email, lines, totalLabel, childName, shipping } = params
  const list = lines
    .map(l => `<li style="margin:0 0 6px">${l.name}${l.qty > 1 ? ` × ${l.qty}` : ''}</li>`)
    .join('')
  return {
    subject: `New keepsake order ${orderId.slice(0, 8)}`,
    html: wrapper(
      heading('A keepsake order to fulfil.') +
      `<ul style="margin:0 0 16px;padding-left:20px">${list}</ul>` +
      p(`Paid <strong>${totalLabel}</strong> by ${email}.`) +
      p(childName ? `Child on the order: ${childName}. Print the passport from their real stamps.` : `No child on the order.`) +
      p(`Ship to:<br>${shipping}`),
      `${APP}/dashboard`
    ),
  }
}

// ── The back to school roundup ───────────────────────────────────────────────
//
// Justin sent the Good Inside August roundup: "Love this email from goodinside
// can we replicate the style for our email sequence using those colours, also
// like back to school get ready, we can build off school data and add the
// emails." Then, on their age band blocks: "the blue looks nice but alternate
// colours would be good."
//
// WHAT MAKES THIS DIFFERENT FROM THEIR EMAIL, and it is the whole reason to
// send it. Theirs is one roundup to everybody. Ours knows the child's year
// group from their birthday, and the school year is data we already hold and
// already act on: lib/learning/calendar.ts has the events keyed by year, and
// lib/learning/transition.ts knows that Year 6 into Year 7 is the highest value
// moment this product has. So a Year 6 family in August gets the phone
// conversation, and a Year 3 family gets the new year one, and neither reads a
// word aimed at the other.
//
// The colour rotates through the stage palette, starting at the child's own
// stage, so the first band is the colour they already know from the app.

export function backToSchoolEmail(params: {
  childName: string
  dob: string | null
  stageNumber: 1 | 2 | 3 | 4 | 5
  unsubscribe: string
  on?: Date
}): EmailContent {
  const { childName, dob, stageNumber, unsubscribe } = params
  const on = params.on ?? new Date()
  const yearGroup = yearGroupFromDob(dob, on)
  const transition = transitionFor(dob, on)
  const newYear = SCHOOL_EVENTS.find(e => e.key === 'new_year')!

  // The year group line. Named plainly when we know it, and skipped rather than
  // guessed when we do not, because "your child's new year" to a parent whose
  // birthday we never collected reads as a product that is not paying attention.
  const yearLine = yearGroup !== null && yearGroup >= 1 && yearGroup <= 11
    ? `${childName} goes into Year ${yearGroup} in September.`
    : `${childName} goes back in September.`

  // The two white sections, built first so the assembly below can decide
  // whether they are one band or two.
  //
  // Two adjacent white bands render as one white area with a double gap down
  // the middle, which reads as a rotation that skipped its turn. Whether that
  // happens depends on the phone block, which is conditional, so the only way
  // to get it right for both audiences is to assemble after the condition is
  // known rather than push bands as we go.
  const firstThing =
    sectionHead('&#128211;', 'The one thing worth doing first') +
    bp('Screens are the part that slips. The July routine does not survive the first week of term, and the families it goes well for agreed the new shape before they needed it.') +
    button('Set the term routine', `${APP}/dashboard/quests`)

  const restOfYear =
    sectionHead('&#128197;', 'The rest of the school year, already mapped') +
    bp('Every year group has dates that arrive without warning. They are all in one place, so the first you hear of one is not a letter in a bag.') +
    linkList([
      { label: 'What your child’s year actually covers', href: `${APP}/dashboard/learning` },
      { label: 'The scripts for the first week back', href: `${APP}/dashboard/scripts` },
      { label: 'Screen balance for term time', href: `${APP}/dashboard/quests` },
    ])

  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('The September run up', tone) +
        h1('Consider this your back to school prep', tone) +
        bp(`${yearLine} New year group, new teacher, and a jump in what is expected that nobody hands you a list for.`, tone),
    },
  ]

  if (transition) {
    // The phone window, only for the families actually in it. A Year 6 August
    // family is the single most valuable moment this product has, and a Year 3
    // family getting this block would be noise at best.
    bands.push({ tone: 'white', html: firstThing })
    bands.push({
      tone: 'auto',
      html: tone =>
        eyebrow(`Year ${transition.yearGroup}`, tone) +
        sectionHead('&#128241;', transition.headline, tone) +
        bp(transition.line, tone) +
        tickList([
          'What to agree before the handset, the part most families do backwards',
          'Which rules survive the first term, and which quietly stop',
          'What to do when the year group WhatsApp starts without you',
        ], tone),
    })
    bands.push({
      tone: 'white',
      html:
        bp('We will not tell you to give them a phone, or not to. That is your call. What we have is the order to do it in.') +
        button('Walk the transition', `${APP}/dashboard/pathway`) +
        rule() +
        restOfYear,
    })
  } else {
    // Nothing to separate them, so they are one band with a rule down the
    // middle rather than two whites pretending to be different sections.
    bands.push({ tone: 'white', html: firstThing + rule() + restOfYear })
  }

  bands.push({
    tone: 'auto',
    html: tone =>
      bp('September starts a lot at once. Whichever of it lands on your family, we are here for it.', tone),
  })

  return {
    subject: `Consider this your back to school prep, ${childName}’s year starts soon`,
    html: bandedWrapper({ bands, unsubscribe, signOff: 'Have a good September,' }),
  }
}

// ── Weeks 5 to 7: the curriculum, and how DiGi learns ──
//
// The programme used to stop dead at day 25. These six carry it to day 43, and
// they change subject: the first four weeks sell the tools, these explain the
// thinking underneath them. A parent six weeks in has stopped needing a tour
// and started wondering whether the thing they are trusting is any good.
//
// Cadence drops to every three days here. Keeping the onboarding pace for six
// straight weeks turns help into pressure.
//
// Every claim below traces to code or to a cited document. Where the honest
// answer is narrower than the impressive one, these take the narrow one.

// A compact list, used where the point IS the completeness of a set (the eight
// strands) and prose would bury it.
function bullets(items: string[]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">` +
    items.map(item =>
      `<tr>
        <td width="18" valign="top" style="padding:0 10px 8px 0">
          <div style="width:6px;height:6px;border-radius:50%;background:${BUTTER};margin-top:8px"></div>
        </td>
        <td valign="top" style="padding:0 0 8px;font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${INK_SOFT}">${item}</td>
      </tr>`
    ).join('') +
    `</table>`
}

// Day 28 · The spine under the lessons.
//
// The claim is deliberately limited to what curriculum-badges.ts already says
// in code: the lessons walk the same recognised ground, they are not the
// school's scheme of work. A parent who thought their child had covered
// school's syllabus, and had not, would find that out the worst way.
export function curriculumStrandsEmail(params: {
  childName: string
  keyStage: string | null
  unsubscribe: string
}): EmailContent {
  const { childName, keyStage, unsubscribe } = params
  const ks = keyStage ? `, alongside the Key Stage it lines up with (${keyStage} for ${childName} right now)` : ''
  return {
    subject: `What ${childName} is actually being taught`,
    html: wrapper(
      heading('There is a spine under the lessons.') +
      p(`The lessons are not a pile of good ideas. Every one of them sits on a strand of Education for a Connected World, the UKCIS framework schools use to plan online safety. There are eight, and between them they cover the whole of growing up online:`) +
      bullets([...EFCW_STRANDS]) +
      p(`Open any lesson and you will see which strand it belongs to${ks}. That is how you can tell at a glance what ground ${childName} has covered and what is still ahead.`) +
      button('See the lessons', `${APP}/dashboard/lessons`) +
      p(`One thing I want to be straight about: this is not your school's scheme of work and it does not replace it. It walks the same recognised ground, so nothing ${childName} learns here is off on its own somewhere.`),
      unsubscribe
    ),
  }
}

// Day 31 · What school has to teach, and why getting there first is kinder.
//
// The five named topics are the ones the July 2025 RSHE guidance actually adds
// (see plans/school-readiness-verdict-2026-07.md).
//
// SPLIT BY STAGE, and this is the whole point of the email rather than a
// refinement of it. Those five are secondary school content. Listing them to
// the parent of a five year old would be the exact fear pitch this company
// exists to argue against, and no caveat underneath rescues a list a parent
// has already read. So the primary stages get what their child actually meets
// at KS1 and KS2, and the knowledge that the harder ground is mapped and comes
// later. Same email, same promise, told at the right distance.
export function curriculumSchoolEmail(params: {
  childName: string
  stageName: string
  stageId: number
  unsubscribe: string
}): EmailContent {
  const { childName, stageName, stageId, unsubscribe } = params
  const primary = stageId <= 2

  const items = primary
    ? [
        'Being kind online, and what to do when someone is not',
        'Keeping personal things private',
        'Telling a trusted adult when something feels wrong',
        'Knowing that not everything online is true',
      ]
    : [
        'The harms of pornography',
        'Misogynistic cultures online, including incel groups',
        'Deepfakes',
        'The risks of online gambling',
        'Illegal behaviour online, including drug and knife supply',
      ]

  const after = primary
    ? p(`Gentle ground, and ${childName} is already walking it here. The heavier topics arrive years later, and they are mapped on the pathway so you can see them coming rather than meeting them the week school sends the letter.`)
    : p(`That is a heavy list to meet for the first time in a school hall, in one go, with two hundred other children watching your reaction.`)

  return {
    subject: 'What school has to teach from September',
    html: wrapper(
      heading('From September the rules change.') +
      p(`New statutory guidance for relationships and health education becomes compulsory in English schools on 1 September 2026. Here is the part of it ${childName} meets ${primary ? 'at their age' : 'at this stage'}:`) +
      bullets(items) +
      after +
      p(`The lessons here go at ${childName}'s pace, one idea at a time, pitched at the ${stageName} stage and no further. Nothing lands before it should. By the time a topic comes up at school it is a second conversation rather than a first one, and you already know what was said.`) +
      button(`See what is next for ${childName}`, `${APP}/dashboard/lessons`) +
      p(`Not instead of school. Just calmly, first.`),
      unsubscribe
    ),
  }
}

// Day 34 · The brain, in plain words.
//
// Written for a parent who has been told for two years that everything is AI
// and has no way to tell a research tool from a chatbot with a mascot. The
// retrieval example is concrete on purpose: "screams when I take the iPad"
// finding work on transitions is exactly what search by meaning buys, and it
// is the one part of the machinery a parent can feel from the outside.
export function digiBrainEmail(params: {
  childName: string
  unsubscribe: string
}): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: 'What DiGi is doing while you wait',
    html: wrapper(
      heading('The three seconds after you press send.') +
      p(`DiGi is not a chatbot having a guess, so here is exactly what happens in the pause after you ask it something.`) +
      bullets([
        `<strong>It searches by meaning, not words.</strong> Ask why he screams when I take the iPad away and it finds the research on transitions and endings, even though you never used either word.`,
        `<strong>It loads who is asking.</strong> ${childName}'s age and stage go in with the question, so the answer is for a child that age and not for children in general.`,
        `<strong>It refuses to give you a verdict.</strong> DiGi never answers allow it or ban it. It gives you the next move, because a yes or no on its own has never once helped anyone at bedtime.`,
      ]) +
      p(`And it will tell you when something is beyond it. A question that needs your GP, your school or a safeguarding lead gets sent there, plainly, rather than answered by a piece of software at 11pm.`) +
      button('Ask DiGi something', `${APP}/dashboard/digi`) +
      p(`That is the whole trick. Real research, your actual child, no verdicts.`),
      unsubscribe
    ),
  }
}

// Day 37 · The loop, and the human gate on it.
//
// The gate is the point. Every AI product claims it learns; almost none of them
// can say a person reads each new thing before it reaches you. That is the
// difference worth the email, so it gets the last word rather than a footnote.
export function digiLearnsEmail(params: { unsubscribe: string }): EmailContent {
  const { unsubscribe } = params
  return {
    subject: 'How DiGi gets better',
    html: wrapper(
      heading('It reads what parents actually ask.') +
      p(`Every fortnight DiGi looks at the questions families have really been bringing it. Not what I assumed parents would ask, what they did ask, at the hours they asked it.`) +
      p(`Where there is a gap, it goes looking for the current research on that exact thing, from universities, paediatric bodies and the people who study this for a living. It drafts what it finds into new findings for its own bank.`) +
      p(`Then it stops and waits for me.`) +
      p(`Nothing reaches your answers until I have read it and approved it. Every candidate sits in a queue marked pending until a person says yes. That gate is deliberate and it is not coming out. An AI tool that quietly rewrites its own advice about your children, with nobody reading the change, is not a tool I would let near my own family.`) +
      button('Ask DiGi something', `${APP}/dashboard/digi`) +
      p(`So the bank grows most weeks, and every single thing in it has been looked at by a human being first.`),
      unsubscribe
    ),
  }
}

// Day 40 · The ask.
//
// Six weeks of giving before asking for anything, which is the right order. The
// "good place to start and not a verdict" line is lifted from the comment on
// getProvenSolutions in lib/digi/wisdom.ts, because that comment is the honest
// description of what the weighting does and it should not get more confident
// on its way into an email.
export function digiFeedbackLoopEmail(params: {
  childName: string
  unsubscribe: string
}): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: 'The one thing I will ask you for',
    html: wrapper(
      heading('Six weeks in, one ask.') +
      p(`Every so often DiGi will ask whether something it suggested actually worked. It takes a sentence to answer and most people skip it, so here is why it matters more than it looks.`) +
      p(`Those answers are the record of what has genuinely worked. Not what sounds sensible in a book, what a real family tried on a real Tuesday and came back to say helped. A solution proven across many families carries more weight than one that worked once, and DiGi leads with the proven ones.`) +
      p(`It offers them first and stays ready to be wrong. A pattern that helped a hundred families is a good place to start, never a verdict on yours.`) +
      p(`Which is the honest version of the thing everyone says about scale. More families does not make the software cleverer by itself. It means that when you ask at 11pm about ${childName}, the starting point you get has already been tried by someone whose evening looked like yours.`) +
      button('Ask DiGi something', `${APP}/dashboard/digi`) +
      p(`So when it asks, tell it. Especially when the answer is that it did not work.`),
      unsubscribe
    ),
  }
}

// Day 43 · Who checks the checker.
//
// The programme closes on the least promotional thing in it. A parent six
// weeks in is deciding whether to keep trusting this, and the answer to that is
// not another feature, it is the machinery that would catch DiGi being wrong.
// The all clear email detail is the convincing part precisely because it is a
// boring operational choice nobody would invent for marketing.
export function digiChecksEmail(params: { unsubscribe: string }): EmailContent {
  const { unsubscribe } = params
  return {
    subject: 'Who checks DiGi',
    html: wrapper(
      heading('The question you would be right to ask.') +
      p(`You have been letting DiGi advise you on your child for six weeks. So who is checking it.`) +
      bullets([
        `<strong>Every Monday</strong> DiGi is put through a fixed set of hard cases, including the ones where the right answer is to send a parent to a professional. It emails me the verdict even when everything passes, because a quiet inbox should mean no problems and never a check that quietly stopped running.`,
        `<strong>Every month</strong> a closed month of real answers gets pulled apart and graded, to catch the slow drift that a single bad answer never shows.`,
        `<strong>Every time you flag one</strong>, I read it. There is a small link under every answer for telling me it was off. It is quiet and it stays out of your way, and it is the fastest route into my inbox that exists here.`,
      ]) +
      p(`None of that makes DiGi incapable of being wrong. It makes being wrong something that gets found and fixed rather than something that sits there for a year.`) +
      button('Ask DiGi something', `${APP}/dashboard/digi`) +
      p(`That is the last of the welcome emails. From here you will hear from me weekly with how the family is doing, and when there is something genuinely worth your time. Thank you for trusting this with something that matters.`),
      unsubscribe
    ),
  }
}

// ── State tracks: everyone who registered, not just recent signups ──
//
// The onboarding programme is a function of how long someone has been here, so
// it is keyed on days since signup and windowed. These are not. A parent who
// lapsed, or paid, or had a card fail is in that state today whether they
// joined last week or last year, and until now the windowed query meant anyone
// past the window was invisible to the email system permanently.
//
// Paced off email_log.sent_at rather than a signup date, which is what lets a
// sequence run for someone who registered eleven months ago.

// ── Win back, for the ones who did not continue after the trial ──
// winBackEmail above is the first. Three in total and then it stops. A fourth
// is nagging, and the free tier means they are still here if they change their
// mind. Each one gives a different reason rather than repeating the first
// louder.

// Win back 2, a week after the first. Names what is sitting unused, because
// "come back" is not a reason and a specific unopened thing is.
export function winBackUnusedEmail(params: {
  childName: string
  stageName: string
  unsubscribe: string
}): EmailContent {
  const { childName, stageName, unsubscribe } = params
  return {
    subject: `What is still sitting there for ${childName}`,
    html: wrapper(
      heading('Still yours, still free.') +
      p(`Nothing was taken away when the trial ended. The free tier keeps a real amount of it, and most of it is the part parents tell me they miss without realising they had it.`) +
      bullets([
        `The <strong>${stageName}</strong> stage scripts, the exact words for the moment you are actually in`,
        `The printables, star charts and the offline pack, still free to print tonight`,
        `${childName}'s passport, which keeps every stamp they earned`,
      ]) +
      p(`It is all where you left it. No setting up again, no starting over.`) +
      button('Open your dashboard', `${APP}/dashboard`) +
      p(`And if the honest answer is that this is not what you need right now, that is a fine answer. You can stop these at the bottom.`),
      unsubscribe
    ),
  }
}

// Win back 3, three weeks in: the founder rate while it exists.
//
// Justin, 8 August: "make sure we tease sign ups that disappear after trial
// ends and keep emailing them weekly to entice back." So this is no longer the
// last one, and the copy does not pretend to be. The weekly teases follow.
export function winBackLastEmail(params: {
  childName: string
  remaining: number
  unsubscribe: string
}): EmailContent {
  const { childName, remaining, unsubscribe } = params
  const founder = remaining > 0
    ? p(`The founding rate is still open, and it is the one thing here that genuinely runs out. <strong>${remaining} of the 50 places are left</strong>, it locks £7.99 a month for life, and the counter is real because it is enforced in the code rather than in the copy.`)
    : p(`The founding places have all gone now, so this is not me dangling anything at you. The normal plan is there when and if you want it, at the normal price.`)
  return {
    subject: 'The bit that actually runs out',
    html: wrapper(
      heading('One thing here has a limit.') +
      p(`Almost nothing about this is urgent. The free tier is not going anywhere, ${childName}'s passport keeps every stamp, and there is no countdown on any of it.`) +
      founder +
      p(`That is the whole pitch and I am not going to dress it up. If the timing is wrong, the timing is wrong.`) +
      button('Take a look', `${APP}/dashboard/upgrade`) +
      p(`I will keep sending you the odd useful thing either way, and you can stop them at the bottom of any of these.`),
      unsubscribe
    ),
  }
}

// ── The paid service track ──
// They already bought. So this is help, not selling, and every one of the three
// gives something rather than asking for something. The paying members were the
// worst served group in the system before this: the same onboarding as everyone
// else, then nothing.

// Paid 1 · What the plan actually unlocks. Most of the value is in the parts
// nobody opens, and a parent paying for something they are not using is a
// cancellation with a delay on it.
export function paidUnlockedEmail(params: {
  parentName: string
  childName: string
  unsubscribe: string
}): EmailContent {
  const { parentName, childName, unsubscribe } = params
  return {
    subject: 'The parts of your plan most people never open',
    html: wrapper(
      heading(`${parentName}, you are paying for more than you are using.`) +
      p(`That is true of nearly everyone and it is my problem rather than yours, so here are the four things members most often have not touched.`) +
      bullets([
        `<strong>Every stage, not just this one.</strong> You can read ahead. What is coming at 11, at 13, at 16, is all unlocked, and reading it early is how the hard conversations stop being ambushes.`,
        `<strong>DiGi without a limit.</strong> The free tier stops at three questions a day. Yours does not stop. Ask it the same thing three different ways at midnight if that is what it takes.`,
        `<strong>The full script library.</strong> Over a hundred, searchable by the moment you are in rather than by topic.`,
        `<strong>The family agreement builder.</strong> The rules decided together and signed by both of you, which is the single thing parents tell me changed the most in their house.`,
      ]) +
      button('Open your dashboard', `${APP}/dashboard`) +
      p(`If one of those is not doing what you expected for ${childName}, tell me. That is what the next email is about.`),
      unsubscribe
    ),
  }
}

// Paid 2 · The open door. A real invitation to reply, sent to a small enough
// group that it can be honoured. It is deliberately the shortest email in the
// system: an ask this simple gets longer and less believable the more it is
// dressed up.
export function paidAskMeEmail(params: {
  parentName: string
  childName: string
  unsubscribe: string
}): EmailContent {
  const { parentName, childName, unsubscribe } = params
  return {
    subject: 'Reply to this one',
    html: wrapper(
      heading('This is not an automated door.') +
      p(`${parentName}, you pay for this, so you get me as well as the software.`) +
      p(`If something about ${childName} and screens is not working, or the platform is not doing what you hoped, or there is a thing you wish existed here, hit reply and tell me. It comes to my actual inbox and I answer them myself.`) +
      p(`The things members ask for in these replies are most of what gets built. Not a nice sentiment, just how the roadmap has genuinely worked so far.`) +
      p(`No form, no ticket number. Just reply.`),
      unsubscribe
    ),
  }
}

// Paid 3 · The questions that come back most. Closes the track by answering
// rather than asking, and points at the one thing a paying parent is entitled
// to know: how to leave.
export function paidCommonQuestionsEmail(params: {
  childName: string
  unsubscribe: string
}): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: 'The questions members ask most',
    html: wrapper(
      heading('Four answers, quickly.') +
      bullets([
        `<strong>My child moved up an age band, do I redo everything?</strong> No. Change their age in settings and the stage, scripts and lessons all follow. The passport keeps every stamp.`,
        `<strong>Can both parents have it?</strong> Yes. Same login, and the agreement is built to be signed by whoever is in the room.`,
        `<strong>${childName} says the app is babyish.</strong> Usually the age band is set low. It is the most common fix and it takes ten seconds.`,
        `<strong>How do I cancel?</strong> Settings, then Manage your plan. Two taps, no phone call, and no three screens of reasons to stay. Your data stays until you ask me to delete it, and then it goes.`,
      ]) +
      button('Open settings', `${APP}/dashboard/settings#billing`) +
      p(`Putting cancelling in a list like that is deliberate. A plan you stay on because leaving is annoying is not a plan I want to be running.`),
      unsubscribe
    ),
  }
}

// ── The failed card ──
// Not a decision, an accident. This is the cheapest save in the system and it
// did not exist: past_due fell through lifecycleState to 'unknown' and nothing
// was ever sent, so a member who wanted to stay simply stopped being one.
export function pastDueEmail(params: {
  parentName: string
  unsubscribe: string
}): EmailContent {
  const { parentName, unsubscribe } = params
  return {
    subject: 'Your card needs a quick look',
    html: wrapper(
      heading('Nothing has been taken away.') +
      p(`${parentName}, your last payment did not go through. Almost always that is an expired card or a bank being cautious, rather than anything you did.`) +
      p(`Everything is still switched on. Updating the card takes about thirty seconds in settings, and nothing else changes.`) +
      button('Update your card', `${APP}/dashboard/settings#billing`) +
      p(`And if you meant to stop, that is genuinely fine and you do not owe me an explanation. Cancelling is on the same screen, two taps, and the free tier keeps everything you have earned.`) +
      p(`If anything about it is awkward, reply to this and I will sort it out with you directly.`),
      unsubscribe
    ),
  }
}

// ── The paid depth track ──
//
// Justin, 8 August: "build more paid customers emails about every aspect of
// what they can do, the research and why we run it the way we do, the benefits
// solutions parenting help child help everything possible, both types of users."
//
// Both types of users is the key phrase and the reason these are not more
// feature tours. Two of the five are about what the CHILD experiences, which
// nothing in the programme had covered: every previous email is written to the
// parent about the parent's side of the glass.
//
// Topics were picked by auditing every existing subject line across templates,
// the weekly programme and the reveals first. Everything here is ground that
// none of the other forty odd emails already walk. Spaced three weeks apart,
// because this is depth for people who have already bought rather than
// onboarding, and there is no hurry.

// Paid 4 · The child's side of the glass.
export function paidChildSideEmail(params: {
  childName: string
  unsubscribe: string
}): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: `What this looks like from ${childName}'s phone`,
    html: wrapper(
      heading('You have never seen their version.') +
      p(`Everything I send you is about your side of the glass. ${childName} has a completely separate app, and most parents never see it, so here is what is actually on it.`) +
      bullets([
        `<strong>Their path.</strong> The same pathway you see, drawn as a road they walk, with the next step lit and the ones after it waiting.`,
        `<strong>Their jobs and their stars.</strong> They tick, you approve. The stars buy screen time you both already agreed to, so the negotiation happened once instead of every day.`,
        `<strong>Their lessons.</strong> Played on their own device, at their own pace, with the buddy they picked.`,
        `<strong>Their week.</strong> What is coming, what is due, what they earned.`,
      ]) +
      p(`It is deliberately not a small copy of your app. Yours answers what do I do. Theirs answers what do I do next, which is a different question and the only one a child is actually asking.`) +
      button('See their app', `${APP}/dashboard/phone-setup`) +
      p(`Worth opening it with them once. Children are far more interested in a thing they can see the shape of.`),
      unsubscribe
    ),
  }
}

// Paid 5 · The disclosure tool. The most important email in the whole
// programme and the one nothing else covered: every other script is the parent
// starting a conversation, and this is the child starting one.
export function paidTellYouEmail(params: {
  childName: string
  unsubscribe: string
}): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: 'The words they will need one day',
    html: wrapper(
      heading('Every other script is you starting.') +
      p(`Scripts, DiGi, the agreement, all of it is you opening a conversation. There is one tool here that works the other way round, and it is the one I would most want a family to have set up before they need it.`) +
      p(`${childName} has words in their own app for telling you something has gone wrong online. Something they saw, something someone said, something they did and wish they had not. It gives them the sentence, because at eleven the problem is almost never that they do not want to tell you. It is that they cannot find the words and they are frightened of your face.`) +
      p(`It comes with a promise about how you will react, and your side of that promise is written down for you to read first. That is the part that matters. A child who thinks the phone gets taken away tells you nothing, and then you find out in a much worse way, much later.`) +
      button('Read the promise', `${APP}/dashboard/tell-a-parent`) +
      p(`Five minutes now, and it sits there quietly for years. I hope it never gets used.`),
      unsubscribe
    ),
  }
}

// Paid 6 · Reading ahead, which is a genuine paid unlock and the one people
// forget they have.
export function paidReadAheadEmail(params: {
  childName: string
  stageName: string
  unsubscribe: string
}): EmailContent {
  const { childName, stageName, unsubscribe } = params
  return {
    subject: 'You can read the next four years',
    html: wrapper(
      heading('Your plan is not locked to today.') +
      p(`${childName} is in the ${stageName} stage, so that is what the app shows you. But you paid for all five, and the other four are sitting there unlocked right now.`) +
      bullets([
        `<strong>Foundation, 4 to 7.</strong> First relationships with technology, before habits form.`,
        `<strong>Builder, 8 to 10.</strong> Building digital habits before the algorithm learns them.`,
        `<strong>Explorer, 11 to 13.</strong> The algorithm conversation, before social media. The critical window.`,
        `<strong>Shaper, 13 to 15.</strong> Identity and digital footprint, while the relationship still holds.`,
        `<strong>Independent, 16 plus.</strong> Real independence, before they leave home.`,
      ]) +
      p(`Reading one stage ahead is the single most useful thing you can do with this. Not to bring it forward, and not to worry earlier, but so the week it arrives you already know what it is and you are not learning it in the same hour you are handling it.`) +
      button('Read ahead', `${APP}/dashboard/pathway`) +
      p(`Twenty minutes on a Sunday buys you the whole of next year.`),
      unsubscribe
    ),
  }
}

// Paid 7 · The evidence under the balance number, and why it is a steer and
// never a cap. This is the "why we run it the way we do" email.
export function paidTheNumbersEmail(params: {
  childName: string
  unsubscribe: string
}): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: 'Where the screen time number comes from',
    html: wrapper(
      heading('Nobody made that number up.') +
      p(`The healthy range you see against ${childName}'s usage is drawn from the World Health Organization, the American Academy of Pediatrics, the Canadian movement guidelines and the Royal College of Paediatrics and Child Health. Four bodies, not one opinion.`) +
      p(`Here is the part most apps leave out. Those bodies do not agree with each other on a single magic number, and the RCPCH in particular is careful to say the evidence does not support one. What the research actually supports is a different question: not how many hours, but what the hours are displacing. Sleep, moving about, being with people, the stuff a childhood is made of.`) +
      p(`Which is why it is drawn as a range and called a steer, and why nothing here ever hard stops a child at a number. A cap tells you when to have a fight. A range tells you whether the shape of the week is right, and that is the thing you can actually act on.`) +
      button('See the balance', `${APP}/dashboard/quests`) +
      p(`If a day sits outside the range, that is information, not a verdict. Some weeks are like that and the sky stays up.`),
      unsubscribe
    ),
  }
}

// Paid 8 · The whole family, not one child. Second and third children get
// added and then quietly forgotten by the parent, not by the product.
export function paidWholeFamilyEmail(params: {
  childName: string
  unsubscribe: string
}): EmailContent {
  const { childName, unsubscribe } = params
  return {
    subject: 'If there is more than one of them',
    html: wrapper(
      heading('Your plan covers all of them.') +
      p(`If you have another child, add them. It is the same subscription, not another one, and it takes about a minute in settings.`) +
      p(`They get their own everything: their own stage, their own jobs and stars, their own lessons at their own age, their own passport. Not a shared list with names next to it, which is how siblings end up measured against each other by an app that should know better.`) +
      p(`The reason this matters more than it sounds: the advice for a seven year old and a thirteen year old is genuinely opposite in places. What is right for the younger one is often the exact thing that damages trust with the older one. Two separate stages means DiGi answers for the child you are actually asking about rather than averaging them into a family.`) +
      button('Add a child', `${APP}/dashboard/settings`) +
      p(`And if ${childName} is your only one, ignore this. Nothing is missing.`),
      unsubscribe
    ),
  }
}
