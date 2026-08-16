// The weekly service programme, weeks 17 to 26. Approved by Justin on
// 8 August 2026.
//
// The lifecycle track used to stop at day 43 and go quiet. These ten carry it
// from week 17 to week 26, one email a week, and each teaches exactly ONE part
// of the service: what it is, why we built it that way, and one thing to do
// today with a deep link. A parent four months in has stopped needing a tour;
// what they are deciding is whether the thing they are trusting deserves it.
//
// Built on the banded system in blocks.ts, the same shape as the back to
// school roundup: full width colour bands alternating with white, one calm
// blue throughout, Justin's voice, no dashes in any copy.
//
// Every claim below traces to the product as built or to a cited document.
// Founder facts come from content/brand-story/founding-story.md and nowhere
// else. Research names stay inside the set the code already carries
// (screen-balance.ts: WHO, the American Academy of Pediatrics, the RCPCH,
// Sue Atkins), described only at the breadth of their published positions,
// never a specific study or number. Where the honest claim is narrower than
// the impressive one, these take the narrow one.

import {
  bandedWrapper, button, eyebrow, h1, linkList, rule, sectionHead, tickList,
  p as bp, type Band,
} from './blocks'
import type { EmailContent } from './templates'
import { APP_ORIGIN } from '@/lib/config/site'

const APP = APP_ORIGIN

// ── Week 17 · email_key 'week-founder-story' ─────────────────────────────────
// Justin's why, from founding-story.md only. The Covid babysitter admission is
// the hinge of the story and it stays unresolved by blame in either direction:
// the tool was doing a job that needed doing, and nobody had built the version
// that gave the time back on purpose.
export function founderStoryEmail(params: { unsubscribe: string }): EmailContent {
  const { unsubscribe } = params
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('The founding story', tone) +
        h1('Why we built this', tone) +
        bp('Natalia started making cake toppers on a laptop in our bedroom when Alma was born in 2015. That grew into parties, weddings and our own shop in Bristol. This family builds real things and finishes them.', tone),
    },
    {
      tone: 'white',
      html:
        sectionHead('&#127968;', 'Then Olga, and the battle') +
        bp('With Olga, screens turned into a fight, and not just a fight about screens. The mood of the whole house moved with the five o’clock handover. Through Covid, with two little girls at home and orders to get out, we used YouTube as a babysitter to survive. We felt guilty then and there is no point pretending otherwise now.') +
        bp('The idea arrived at nine at night, after a day like that. We wished something existed that helped us manage the devices rather than just switch them off. So we built it, first for our own family, on our own kitchen table.') +
        bp('Teo is four now and mad about football. He will grow up with all of this, and AI on top. He is who we are building for.') +
        button('Ask DiGi anything', `${APP}/dashboard/digi`) +
        bp('One thing to do today: bring DiGi the question that is on your mind tonight. It is why the whole thing exists.'),
    },
  ]
  return {
    subject: 'Why we built this',
    html: bandedWrapper({ bands, unsubscribe, signOff: 'From our kitchen table to yours,' }),
  }
}

// ── Week 18 · email_key 'week-philosophy' ────────────────────────────────────
// Never allow or deny, the calibrated pathway, ready at 16. The position from
// founding-story.md in the founder's voice: a ban is a delay, not a
// preparation. We never relitigate the ban itself.
export function philosophyEmail(params: { unsubscribe: string }): EmailContent {
  const { unsubscribe } = params
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('How we think', tone) +
        h1('Never allow, never deny', tone) +
        bp('Every answer here is a calibrated pathway, never a flat yes or no. A verdict on its own has never once helped anyone at bedtime. What helps is the next move, sized to your child and their stage.', tone),
    },
    {
      tone: 'white',
      html:
        sectionHead('&#129517;', 'Why we will not sell you a ban') +
        bp('Keeping a child away from something until sixteen and then handing it over whole is how you get the cliff edge, and the cliff edge is the actual danger. Fear sells. It does not help. So we do the bit in between that nobody was building:') +
        tickList([
          'A little more freedom at each stage, earned',
          'Settings that ease as the judgement grows',
          'A child who arrives at sixteen ready, not dropped in',
        ]) +
        button('See the pathway', `${APP}/dashboard/pathway`) +
        bp('One thing to do today: open the pathway, find your child’s stage, and read what the next one asks of them. That is the whole plan, in one look.'),
    },
  ]
  return {
    subject: 'Never allow, never deny',
    html: bandedWrapper({ bands, unsubscribe }),
  }
}

// ── Week 19 · email_key 'week-research' ──────────────────────────────────────
// The evidence and the human gate on it. The bodies named are the ones
// screen-balance.ts already cites, at the breadth it cites them; the gate is
// the knowledge refresh pipeline exactly as digiLearnsEmail describes it. No
// invented studies, no numbers, no implied endorsements.
export function researchAnchorsEmail(params: { unsubscribe: string }): EmailContent {
  const { unsubscribe } = params
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('The evidence', tone) +
        h1('Where the advice comes from', tone) +
        bp('The screen guides in this product lean on the bodies that publish this ground: the World Health Organization, the American Academy of Pediatrics and the RCPCH here in the UK. Their broad position is ours too. There is no single magic number of minutes. What matters is what screens displace: sleep, movement, real play and family time.', tone),
    },
    {
      tone: 'white',
      html:
        bp('The weekly parenting steers draw on the same well worn ground parenting voices like Sue Atkins have long taught: the calm boundary said once beats the long negotiation.') +
        sectionHead('&#128218;', 'How new evidence gets in') +
        bp('Every fortnight DiGi reads the questions families have actually been asking and goes looking for current research on those exact things. Then it stops and waits. Nothing reaches your answers until a human has read it and approved it. That gate is deliberate and it is not coming out.') +
        button('Ask DiGi something', `${APP}/dashboard/digi`) +
        bp('One thing to do today: ask DiGi the question you would normally type into a search engine, and notice the difference a checked answer makes.'),
    },
  ]
  return {
    subject: 'Where the advice comes from',
    html: bandedWrapper({ bands, unsubscribe }),
  }
}

// ── Week 20 · email_key 'week-wisdom' ────────────────────────────────────────
// How other families' wins become your starting points. The hedge is lifted
// from the comment on getProvenSolutions in lib/digi/wisdom.ts, "a good place
// to start and not a verdict", and it must never grow more confident on its
// way into an inbox.
export function wisdomInsightsEmail(params: { unsubscribe: string }): EmailContent {
  const { unsubscribe } = params
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('The wisdom bank', tone) +
        h1('What other families found', tone) +
        bp('When something DiGi suggested genuinely works, families say so. A concern gets resolved, a script gets marked as the one that helped, and that record goes into the bank.', tone),
    },
    {
      tone: 'white',
      html:
        sectionHead('&#128161;', 'Proven first, humble always') +
        bp('A solution proven across many families carries more weight than one that worked once, so DiGi leads with the proven ones. Not what sounds sensible in a book. What a real family tried on a real Tuesday and came back to say helped.') +
        bp('And it offers them as a good place to start, not a verdict. A pattern that helped a hundred families is a starting point for yours, never a ruling on it.') +
        button('Ask DiGi something', `${APP}/dashboard/digi`) +
        bp('One thing to do today: tell DiGi how its last suggestion actually went, especially if it did not work. That sentence is how the next family gets a better starting point.'),
    },
  ]
  return {
    subject: 'What other families found',
    html: bandedWrapper({ bands, unsubscribe }),
  }
}

// ── Week 21 · email_key 'week-jobs-stars' ────────────────────────────────────
// The jobs board and the star economy: real world jobs earn stars, stars buy
// screen time or save towards goals, the parent's approval is the gate.
export function jobsStarsEmail(params: { unsubscribe: string }): EmailContent {
  const { unsubscribe } = params
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('The star economy', tone) +
        h1('Real jobs, real stars', tone) +
        bp('The jobs board pays for real world jobs in stars. That order is the whole design: the real world earns the screen, never the other way round.', tone),
    },
    {
      tone: 'white',
      html:
        sectionHead('&#11088;', 'How the loop runs') +
        tickList([
          'You post the jobs and set the stars on each one',
          'Your child ticks a job done, you approve it, the stars land',
          'Stars buy screen time, or save up towards a goal they choose',
        ]) +
        bp('We built it this way because a system nobody enjoys gets dropped in a fortnight. A child earning their time is not being policed, they are being paid, and the argument about the tablet quietly becomes a conversation about the job.') +
        button('Open the jobs board', `${APP}/dashboard/quests`) +
        bp('One thing to do today: post one job your child can finish before tea, and let them feel the first stars land.'),
    },
  ]
  return {
    subject: 'Real jobs, real stars',
    html: bandedWrapper({ bands, unsubscribe }),
  }
}

// ── Week 22 · email_key 'week-evidence' ──────────────────────────────────────
// The daily check in. One slider, 1 is really tough, 10 is going great, and
// the scale climbs as things improve, so every chart of a family's journey
// rises. The verdict is computed from the change, never asked.
export function checkinEvidenceEmail(params: { unsubscribe: string }): EmailContent {
  const { unsubscribe } = params
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('The daily check in', tone) +
        h1('One slider, once a day', tone) +
        bp('The check in is one slider. 1 is really tough, 10 is going great, and that is the whole answer. No quiz, no typing, a few seconds while the kettle boils.', tone),
    },
    {
      tone: 'white',
      html:
        sectionHead('&#128200;', 'Why the scale climbs') +
        bp('We set the scale so up means better. As home gets calmer, the line on your chart rises, and months of hard evenings become a shape you can actually see. How far you have come shows the climb in your own numbers, not in our words.') +
        bp('It also means you never have to announce whether things are improving. The change between check ins says it for you, quietly, over time.') +
        button('Do today’s check in', `${APP}/dashboard/daily`) +
        bp('One thing to do today: move the slider once. The chart only ever tells the truth if it gets the boring days too.'),
    },
  ]
  return {
    subject: 'One slider, once a day',
    html: bandedWrapper({ bands, unsubscribe }),
  }
}

// ── Week 23 · email_key 'week-scripts' ───────────────────────────────────────
// Scripts for the hard moments. The pitch is the honest one: at nine at night
// the thinking has to already be done, which is what word for word buys and
// advice does not.
export function scriptsDeepEmail(params: { unsubscribe: string }): EmailContent {
  const { unsubscribe } = params
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('The scripts', tone) +
        h1('The exact words, ready for 9pm', tone) +
        bp('Advice says hold the boundary warmly. A script tells you what to actually say when the tablet has to come back and the wail starts. At nine at night, word for word beats advice, because the thinking is already done.', tone),
    },
    {
      tone: 'white',
      html:
        sectionHead('&#128172;', 'Rehearse before you need it') +
        bp('Every script is matched to your child’s stage, so the words fit the child in front of you. And you can rehearse the hard ones with DiGi first, so the first time you say them out loud is not the moment itself.') +
        button('Open the scripts', `${APP}/dashboard/scripts`) +
        bp('One thing to do today: read one script before you need it. Two minutes now buys back the whole evening later.'),
    },
  ]
  return {
    subject: 'The exact words, ready for 9pm',
    html: bandedWrapper({ bands, unsubscribe }),
  }
}

// ── Week 24 · email_key 'week-school-week' ───────────────────────────────────
// This week at school on Home, the child's one calm school card, the homework
// decoder. The objective is worked out from the year group, a new one lands
// each Monday, and the child's card is deliberately one thing with no feed and
// no notifications.
export function schoolWeekEmail(params: { unsubscribe: string }): EmailContent {
  const { unsubscribe } = params
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('School, decoded', tone) +
        h1('What school covers this week', tone) +
        bp('Your Home screen carries this week at school: the one thing your child’s class is working on right now, worked out from their year group, with a dinner table way to bring it up. A new one lands every Monday.', tone),
    },
    {
      tone: 'white',
      html:
        sectionHead('&#127891;', 'One calm card, both sides') +
        bp('Your child sees the same week as one calm card in their app. No feed, no notifications, one thing. When they practise it and tap, it comes to you to approve like any other job, and the stars land.') +
        bp('And when a homework letter arrives in the bag, the homework decoder turns it into plain words and a plan, so the first you hear of a project is not the night before it is due.') +
        button('See this week', `${APP}/dashboard/learning`) +
        bp('One thing to do today: read this week’s card, then ask about it at dinner. You will be the parent who somehow already knew.'),
    },
  ]
  return {
    subject: 'What school covers this week',
    html: bandedWrapper({ bands, unsubscribe }),
  }
}

// ── Week 25 · email_key 'week-device-time' ───────────────────────────────────
// Device asks, the timer, treats named honestly as treats. The parent's yes
// stays the door: the app holds the clock so the parent does not have to be
// the clock, and it never becomes the parent.
export function deviceTimeEmail(params: { unsubscribe: string }): EmailContent {
  const { unsubscribe } = params
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('Device time', tone) +
        h1('The timer, and your yes', tone) +
        bp('When your child wants screen time, the ask comes to you, and your yes opens the door. That part never moves. The app holds the clock so you do not have to be the clock, and the end of a session is the timer’s news rather than yours.', tone),
    },
    {
      tone: 'white',
      html:
        sectionHead('&#9200;', 'Honest bookkeeping') +
        bp('When you grant time that was not earned, the app names it a treat, because that is what it is. No pretending it was part of the plan. Treats are a lovely part of family life, and naming them honestly is what keeps the earned minutes meaning something.') +
        bp('We built it this way because a timer with no parent behind it is just one more thing to argue with. The machinery does the counting. The yes stays yours.') +
        button('Set up device time', `${APP}/dashboard/quests`) +
        bp('One thing to do today: run one session through the timer and let the clock, not you, call the ending.'),
    },
  ]
  return {
    subject: 'The timer, and your yes',
    html: bandedWrapper({ bands, unsubscribe }),
  }
}

// ── Week 26 · email_key 'week-year-ahead' ────────────────────────────────────
// The road to 16, stamps and stages, and the reply invitation. The programme
// closes by handing the pen over: what gets built next is steered by what
// families ask for, and Justin reads every reply.
export function yearAheadEmail(params: { unsubscribe: string }): EmailContent {
  const { unsubscribe } = params
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('The road to 16', tone) +
        h1('Where this is all going', tone) +
        bp('The pathway runs in stages from the first screen to sixteen. Lessons finished earn stamps in your child’s passport, and stage by stage the freedoms grow as the judgement does, so sixteen arrives as a line crossed rather than a cliff.', tone),
    },
    {
      tone: 'white',
      html:
        sectionHead('&#128506;', 'What lands next') +
        bp('There is more coming, and the honest truth is that what we build next is steered by what families ask for. This started as a thing two parents built for their own kitchen table, and it grows the same way: someone names the gap, we build for it.') +
        bp('So here is the one thing to do this week: hit reply and tell me what you want built. I read every reply myself.') +
        button('See the road ahead', `${APP}/dashboard/pathway`) +
        rule() +
        linkList([
          { label: 'The pathway, stage by stage', href: `${APP}/dashboard/pathway` },
          { label: 'The scripts for the hard moments', href: `${APP}/dashboard/scripts` },
          { label: 'The jobs board and the stars', href: `${APP}/dashboard/quests` },
        ]),
    },
  ]
  return {
    subject: 'Where this is all going',
    html: bandedWrapper({ bands, unsubscribe, signOff: 'Thank you for six months of trust,' }),
  }
}
