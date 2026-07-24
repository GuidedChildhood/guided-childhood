// The lifecycle and nurture emails. Plain warm HTML in the butter and ink
// system, table based so every client renders it, Justin's voice
// throughout. No dashes in any copy.

import type { WeeklyReview } from '@/lib/digi/weekly-review'

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
      step(6, 'Your Progress page', `Streaks, wellbeing signals and where ${childName} sits on the pathway to 16, all in one view. This is the page that answers is it working.`, 'See your progress', `${APP}/dashboard/tracker`) +
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
}): EmailContent {
  const { childName, stageName, scriptsDoneTotal, scriptsDoneThisWeek, unsubscribe } = params
  const weekLine = scriptsDoneThisWeek > 0
    ? `You used ${scriptsDoneThisWeek === 1 ? 'one script' : `${scriptsDoneThisWeek} scripts`} this week. That is ${scriptsDoneThisWeek === 1 ? 'a real conversation' : 'real conversations'} that went differently because you had the words.`
    : `No scripts this week. No guilt about that, life happens. One two minute script tonight puts the week back on track.`
  return {
    subject: `${childName}'s week on the pathway`,
    html: wrapper(
      heading(`Your week with ${childName}.`) +
      p(weekLine) +
      p(`All together you have completed <strong>${scriptsDoneTotal === 1 ? 'one script' : `${scriptsDoneTotal} scripts`}</strong> on the ${stageName} stage. Every one of them is a pattern ${childName} will carry into the next stage.`) +
      button('Open this week’s script', `${APP}/dashboard/scripts/recommended`) +
      p(`Ten minutes this week. That is the whole ask.`),
      unsubscribe
    ),
  }
}

// 10 · Lead nurture, sent once to an email captured before an account exists
// (a magnet download or a quiz drop off). Warm, no hard sell, one door to the
// free trial. No account yet, so unsubscribe is a plain reply address.
export function leadNurtureEmail(): EmailContent {
  return {
    subject: 'Your pathway is a couple of minutes away',
    html: wrapper(
      heading('Whenever you are ready.') +
      p(`You grabbed something from us recently, thank you. If it was useful, there is a whole calm plan behind it, matched to your child's age.`) +
      p(`It takes about two minutes to set up, no card needed, and the free trial opens everything: the scripts for the hard conversations, the daily moments, and DiGi whenever you want the exact words.`) +
      button('Start the free trial', `${APP}/starter-pack`) +
      p(`No rush, and no pressure. The door stays open whenever the timing feels right.`),
      'mailto:hello@guidedchildhood.com?subject=Unsubscribe'
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
}): EmailContent {
  const { magnetTitle, downloadUrl } = params
  return {
    subject: `Your download: ${magnetTitle}`,
    html: wrapper(
      heading('Here is your download.') +
      p(`Thanks for grabbing <strong>${magnetTitle}</strong>. It is one page, made to print and stick on the fridge. No login needed.`) +
      button('Download the printable', downloadUrl) +
      p(`If the button does not work, paste this into your browser: <a href="${downloadUrl}" style="color:${BUTTER_DARK}">${downloadUrl}</a>`) +
      p(`This is the free front door to Guided Childhood. When you want the calm plan behind it, the starter pack picks the first small move for your child in about two minutes.`) +
      button('See the free starter pack', `${APP}/starter-pack`),
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
}): EmailContent {
  const { childLabel, review, unsubscribe } = params
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
      button('See the full week', `${APP}/dashboard`) +
      p(`These numbers are ${childLabel}'s own. Nothing here is shared or set against another family, it is just your week, read back to you.`),
      unsubscribe
    ),
  }
}
