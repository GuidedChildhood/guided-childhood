// The five platform emails, ported from the Mailchimp drafts in /emails
// into functions the app can send itself with live per family data.
// Butter and ink brand: cream background, single white card, bold centered
// heading over a yellow underline rule, chunky gold CTA. Justin's voice,
// no dashes anywhere.

const SITE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.guidedchildhood.co.uk'

export interface EmailContent {
  subject: string
  html: string
}

function shell(opts: {
  title: string
  preheader: string
  heading: string
  bodyHtml: string
  ctaLabel: string
  ctaHref: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${opts.title}</title></head>
<body style="margin:0;padding:0;background:#FFFBEE;font-family:'Nunito',Verdana,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;">${opts.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEE;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:28px 28px 8px;text-align:center;">
  <span style="font-size:15px;font-weight:800;color:#1A1A2E;">Guided Childhood</span>
  <span style="font-size:18px;"> &#11088;</span>
</td></tr>
<tr><td style="padding:12px 28px 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;">
<tr><td style="padding:36px 32px;">
<h1 style="font-size:26px;line-height:1.2;color:#1A1A2E;font-weight:900;margin:0 0 6px;text-align:center;">${opts.heading}</h1><div style="width:64px;height:4px;background:#E9B949;border-radius:2px;margin:0 auto 22px;"></div>${opts.bodyHtml}
<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:28px auto 8px;">
<tr><td style="background:#E9B949;border-radius:16px;box-shadow:0 5px 0 #C29018;">
  <a href="${opts.ctaHref}" style="display:inline-block;padding:15px 34px;font-size:15px;font-weight:800;color:#1A1A2E;text-decoration:none;">${opts.ctaLabel}</a>
</td></tr></table>
</td></tr></table>
</td></tr>
<tr><td style="padding:0 28px 32px;text-align:center;font-size:11px;color:#8888A0;line-height:1.6;">
  You are getting this because you started your pathway at guidedchildhood.co.uk.<br>
  Guided Childhood, UK
</td></tr>
</table>
</td></tr></table>
</body></html>`
}

function p(text: string): string {
  return `<p style="font-size:15.5px;color:#1A1A2E;line-height:1.75;margin:0 0 16px;">${text}</p>`
}

function quote(text: string): string {
  return `<div style="background:#FEF7E0;border-left:3px solid #E9B949;border-radius:12px;padding:16px 18px;margin:0 0 16px;font-size:15px;font-style:italic;color:#1A1A2E;line-height:1.6;">&ldquo;${text}&rdquo;</div>`
}

// Day 0: welcome, straight into the first script.
export function welcomeEmail(firstScript: { title: string; sort_order: number } | null): EmailContent {
  const ctaHref = firstScript
    ? `${SITE}/dashboard/scripts/${firstScript.sort_order}`
    : `${SITE}/dashboard/scripts`
  return {
    subject: 'Your first script is waiting',
    html: shell({
      title: 'Welcome to your pathway',
      preheader: 'The exact words for tonight are inside.',
      heading: 'You are on the pathway.',
      bodyHtml:
        p('I am Justin, and I built Guided Childhood because I was the parent googling at 11pm with no idea what to say the next morning.') +
        p('Here is the deal. You do not need to read everything. You need one script for the thing that is actually happening in your house this week. Your dashboard already has it picked out, matched to your child’s age and the answer you gave when you joined.') +
        quote('Screens start after shoes and bag are done. One week, then we review.') +
        p(`That is what a script looks like. Ten seconds to read, works within a week when you hold it warmly and consistently.${firstScript ? ` Yours is called <strong>${firstScript.title}</strong> and it is waiting.` : ' Your first one is waiting.'}`),
      ctaLabel: 'Read tonight’s script',
      ctaHref,
    }),
  }
}

// Day 2: the stage guide.
export function stageGuideEmail(): EmailContent {
  return {
    subject: 'The right move depends on the age',
    html: shell({
      title: 'Your child’s stage, explained',
      preheader: 'What is normal now, and what to watch for.',
      heading: 'The right move depends on the age.',
      bodyHtml:
        p('The advice that works for a 6 year old backfires at 13. That is why everything in Guided Childhood is built on five stages, from the first shared screen at 4 to full independence at 16.') +
        p('Your stage page shows what is normal at this age, what to watch for, which device boundaries fit, and the one conversation most parents at this stage have not had yet.') +
        p('Two minutes on the pathway page and you will know exactly where you stand. DiGi walks the trail with you.'),
      ctaLabel: 'See your stage',
      ctaHref: `${SITE}/dashboard/pathway`,
    }),
  }
}

// Day 4: meet DiGi.
export function digiNudgeEmail(): EmailContent {
  return {
    subject: 'Ask DiGi the thing you googled last night',
    html: shell({
      title: 'Meet DiGi properly',
      preheader: 'The exact words for tonight, in 20 seconds.',
      heading: 'Ask DiGi the thing you googled last night.',
      bodyHtml:
        p('DiGi is your parenting advisor built into the platform. It knows your child’s age and stage, it has read the research from Odgers, Orben, Livingstone and the NHS guidance, and it remembers what you have tried before.') +
        p('It will not give you a lecture. It gives you the exact words for tonight, and if something needs a professional, it says so and points you to the right one.') +
        quote('My 9 year old melts down every time the game gets turned off. What do I say?') +
        p('That took one parent 20 seconds to ask, and it changed their evenings. Your first three questions a day are free.'),
      ctaLabel: 'Ask DiGi one question',
      ctaHref: `${SITE}/dashboard/digi`,
    }),
  }
}

// Day 7: the founder rate, with the live counter.
export function founderRateEmail(founderRemaining: number): EmailContent {
  return {
    subject: 'You have been here a week',
    html: shell({
      title: 'The founder rate, while it lasts',
      preheader: `${founderRemaining} of 50 founding places still open.`,
      heading: 'You have been here a week.',
      bodyHtml:
        p('If the scripts have helped even once, here is the honest pitch. Membership unlocks the full library of 100 plus scripts, unlimited DiGi, the device setup hub, the family agreement builder, and every lesson as they release.') +
        p(`The first 50 families lock in £7.99 a month for life, against £12.99 after. It is capped in the code, not just in the copy. Right now <strong>${founderRemaining} of the 50 places are still open</strong>. When it is gone it is gone.`) +
        p('And if it is not for you, the free tier stays free. No tricks.'),
      ctaLabel: 'Claim the founder rate',
      ctaHref: `${SITE}/dashboard/upgrade`,
    }),
  }
}

// Weekly digest: one win, one watch for, one next step, and the child's
// real progress bar.
export function weeklyDigestEmail(opts: {
  childName: string
  win: string
  watchFor: string
  nextStep: string
  progressPct: number
  stageLabel: string
}): EmailContent {
  const pct = Math.max(0, Math.min(100, Math.round(opts.progressPct)))
  const progressBar = `
<div style="margin:0 0 18px;">
  <div style="font-size:12px;font-weight:800;color:#1A1A2E;letter-spacing:0.06em;text-transform:uppercase;margin:0 0 6px;">${opts.stageLabel} &middot; ${pct}% walked</div>
  <div style="background:#FEF7E0;border-radius:100px;height:14px;overflow:hidden;">
    <div style="background:#E9B949;height:14px;width:${pct}%;border-radius:100px;"></div>
  </div>
</div>`
  return {
    subject: `Your week with ${opts.childName}`,
    html: shell({
      title: 'Your week on the pathway',
      preheader: 'One win, one watch for, one next step.',
      heading: `Your week with ${opts.childName}`,
      bodyHtml:
        progressBar +
        p(`<strong>The win:</strong> ${opts.win}`) +
        p(`<strong>Worth watching:</strong> ${opts.watchFor}`) +
        p(`<strong>Next on the trail:</strong> ${opts.nextStep}`) +
        p('Ten minutes this week keeps the streak alive. DiGi has the details on your dashboard.'),
      ctaLabel: 'Open my dashboard',
      ctaHref: `${SITE}/dashboard`,
    }),
  }
}
