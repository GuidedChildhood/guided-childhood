// The five lifecycle emails. Plain warm HTML in the butter and ink
// system, table based so every client renders it, Justin's voice
// throughout. No dashes in any copy.

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
