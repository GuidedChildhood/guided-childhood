// THE TOPIC EMAIL COURSES (16 November 2026).
//
// A course is a week of short emails on one parent problem, asked for by name
// on the stage check result page. The first is the first group chat, written
// and checked in content/packs/2026-11-14-first-whatsapp-group (recheck.md is
// the source list, pack.md section 5 the copy). This file is that copy, as
// data, so the next topic is a new entry and not new plumbing.
//
// The rules the copy was written to (plan, Prompt C step e): one email a day
// for seven days, each read in 60 to 90 seconds, one thing to do that evening,
// at most one link and only to the product, the product first named on day 5
// and offered once more on day 7, no invented urgency. Every figure in here is
// on the pack's cleared list; change a figure here and it must change there.
//
// Pure, no imports, so the test runs it without a database. The sign up is
// app/api/course/route.ts (day 1 at once) and the email cron sends the rest,
// one a morning, as kind 'series'.

export type CourseLink = { label: string; to: 'agreement' | 'scripts' | 'stage' }

export type CourseDay = {
  title: string
  subject: string
  /** The hidden preview line most inboxes show beside the subject. */
  preview: string
  paragraphs: string[]
  /** The one thing to do that evening, shown last. */
  tonight: string
  link: CourseLink | null
}

export type Course = {
  slug: string
  /** What the parent sees on the offer. */
  title: string
  offer: string
  /** The ages the offer shows for, in whole years, inclusive. */
  minAge: number
  maxAge: number
  days: CourseDay[]
}

export const COURSES: Course[] = [
  {
    slug: 'first-group-chat',
    title: 'The first group chat',
    offer: 'Seven short emails, one a morning, one thing to do each evening.',
    minAge: 10,
    maxAge: 12,
    days: [
      {
        "title": "What is actually going on",
        "subject": "The first group chat, and why it feels so big",
        "preview": "Nobody has measured it. Here is what we do know.",
        "paragraphs": [
          "You asked for help with the first group chat. Here is the honest starting point.",
          "Nobody has measured it. I went looking for a study of how many messages a class group sends, or how long the rush lasts. I could not find one. So if it feels as though every other parent knows something you do not, they do not.",
          "Here is what is known. Ofcom found that 56 percent of 10 year olds have a phone, and 83 percent of 11 year olds. It calls starting senior school the tipping point. The class group tends to arrive with the phone.",
          "For your child, the group is the room where the class now talks. Wanting to be in that room is ordinary.",
          "WhatsApp's own terms say 13. I am not going to tell you what to decide about that. This week I will give you the three things I would agree first, whenever the group arrives in your house."
        ],
        "tonight": "ask one question, and only listen. \"Is there a class group yet? Who is in it?\"",
        "link": null
      },
      {
        "title": "What the evidence says, calmly",
        "subject": "Four things the research can tell you",
        "preview": "Two are reassuring. Two are worth planning for.",
        "paragraphs": [
          "Four things, as plainly as I can put them.",
          "One. Messaging friends is different from scrolling a feed. A study of 812 Dutch children aged 10 to 17 found that messaging existing friends made those friendships better six months later. It is older research, from before WhatsApp.",
          "Two. Most children are not bullied online. The Office for National Statistics found that 19.1 percent of 10 to 15 year olds had an online bullying experience in a year. About four in five did not.",
          "Three. Being left out is the thing to watch for. In research for Ofcom, secondary pupils and their teachers named being removed from a group chat as bullying. There is no figure for how often it happens.",
          "Four. Sleep. A US study of 9,398 children aged about 12 linked leaving the ringer on overnight with slightly more disturbed sleep a year later. The link is small, and phones on silent looked no different from phones switched off.",
          "That is all of it. Anything scarier you have read is about teenagers on other apps, or has no source I could find."
        ],
        "tonight": "notice where the phone or tablet spends the night at the moment. Do not change anything yet.",
        "link": null
      },
      {
        "title": "The words to say",
        "subject": "The one promise to make before anything goes wrong",
        "preview": "\"You come and show me, and the phone stays yours.\"",
        "paragraphs": [
          "If you only do one thing this week, do this one.",
          "Teenagers told the Children's Commissioner for England that they worry about losing their phones as a punishment, \"and that stops them asking for help\". They were 13 to 18. I would make the promise years earlier, while it is still easy to say.",
          "Here are the words.",
          "\"If something in that chat worries you, you come and show me, and the phone stays yours. I will not take it off you for telling me.\"",
          "Say it out loud, and say it before there is a problem. Then keep it the first time it is tested, because the first time decides whether there is a second.",
          "Keeping it does not mean doing nothing. You can still act on what you are shown. You deal with the chat, and the child who told you keeps the phone."
        ],
        "tonight": "say the promise. Then ask them to say it back in their own words.",
        "link": null
      },
      {
        "title": "The rule to agree together",
        "subject": "Three lines, written by both of you",
        "preview": "Who can add you. Where the phone sleeps. Will you show me.",
        "paragraphs": [
          "You have the promise. Today is the agreement, and your child helps write it.",
          "One. Who can add you. WhatsApp's help pages say the group setting starts on Everyone, so anyone with the number can add your child to a group. Open the app together, go to Settings, then Privacy, then Groups, and choose My Contacts. Tell them why. Someone can still send an invite link, so agree that they ask you before joining from a link.",
          "Two. Where the phone sleeps. Pick a place outside the bedroom and let your child choose the spot. Yours goes there too if you can manage it.",
          "Three. Will you show me. You said it yesterday. Now write it down.",
          "A note on age. WhatsApp's terms say 13. This year it announced accounts for younger children that a parent sets up and manages. I have not been able to confirm they have reached the UK, so look in your own app."
        ],
        "tonight": "write the three lines down together and both sign them. Our first phone agreement takes a few minutes and you can print it.",
        "link": {
          "label": "Write the three lines",
          "to": "agreement"
        }
      },
      {
        "title": "What to do when it goes wrong",
        "subject": "When the group chat goes wrong",
        "preview": "It probably will, once. Here is the first thing to say.",
        "paragraphs": [
          "At some point something will go wrong in a group. That does not mean the plan failed. It is what the plan was for.",
          "If they are added to a group of strangers, say: \"You did not do anything wrong here.\" Leave it together and check the setting is still on My Contacts.",
          "If they are taken out of a group on purpose, do not tell them to shrug it off. Say: \"Being taken out of that group was meant to hurt and it did.\" Then screenshot it with the date. If it keeps happening, that record is what a school can act on.",
          "If something frightening or illegal is shared, that goes beyond a script. Tell the school. If you think a child is being groomed, report to CEOP. If a child is in immediate danger, call 999.",
          "Whatever it is, they showed you. The phone stays theirs.",
          "Those lines come from the scripts in Guided Childhood. Each one also covers what to do when your child pushes back and when to check in again, and three of the ones for this moment are free. That is what the product adds to this week: the words for the next argument, when it comes."
        ],
        "tonight": "read one script before you need it.",
        "link": {
          "label": "Read the scripts",
          "to": "scripts"
        }
      },
      {
        "title": "The child's side of it",
        "subject": "Why \"just turn it off\" does not work on an eleven year old",
        "preview": "Muting is not leaving.",
        "paragraphs": [
          "Today is your child's side.",
          "To us the group is noise. To them it is where the class is. If they switch off, the cost is being the one who did not know what happened. That is a real cost at eleven, even when it looks small from where we stand.",
          "So \"just turn your phone off\" asks them to pay it. They will not, and the evening ends in a row.",
          "Try this. Do not ask them to leave the group. Take them out of the room.",
          "Mute the group until the morning and do it together the first time. Put the phone in its sleeping place. Then tell them the two things nobody has told them.",
          "\"Muting is not leaving. Nobody gets told you muted it.\"",
          "If they say they will miss something, agree with them. They will. In the morning, ask what it was.",
          "I am not promising better sleep. Nobody has tested muting in a trial. I am offering a calmer bedtime and a skill they will keep."
        ],
        "tonight": "ask them what the best thing about the group is, and the most annoying. Then show them how to mute it.",
        "link": null
      },
      {
        "title": "What comes next",
        "subject": "The group chat is the first one, not the last",
        "preview": "What you have built this week, and where it goes.",
        "paragraphs": [
          "This is the last email of the week.",
          "You now have a promise your child has heard out loud, three lines you wrote together, a place where the phone sleeps, and a child who can mute a group without leaving it. That is more of a plan than most of us had when the first phone arrived.",
          "The group chat is the first of these moments. The next ones are already on their way: the first game with strangers in it, the first account, the first time something they sent travels further than they meant.",
          "That is what Guided Childhood is for. Ten minutes a day, you and your child together, working through what comes at their stage before it arrives. Your child earns stars for it. You get the words for each argument, and DiGi, our guide, for the questions that come up late at night.",
          "If this week helped, your child's stage is where it carries on. If you would rather stop here, keep the three lines on the fridge. They will still work."
        ],
        "tonight": "read the three lines back together and ask your child whether any of them needs changing.",
        "link": {
          "label": "Back to your child's stage",
          "to": "stage"
        }
      }
    ],
  },
]

export function getCourse(slug: string): Course | null {
  return COURSES.find(c => c.slug === slug) ?? null
}

/** The course to offer a child of this age, or null. Unknown age offers none. */
export function courseForAge(ageYears: number | null | undefined): Course | null {
  if (ageYears == null || !Number.isFinite(ageYears)) return null
  return COURSES.find(c => ageYears >= c.minAge && ageYears <= c.maxAge) ?? null
}

// The ledger keys, in lead_email_log. The start row is written when the parent
// asks and its sent_at is the clock; one row per day sent. The table's unique
// (email, email_key) is what stops a second sign up restarting the week.
export const courseStartKey = (slug: string) => `course:${slug}:start`
export const courseDayKey = (slug: string, day: number) => `course:${slug}:${day}`
export const COURSE_WINDOW_DAYS = 21

/**
 * Which day is due, if any: the first day not yet sent, once the course is old
 * enough for it. Day 1 goes at sign up; day n is due from n minus one and a
 * half days on, so the 08:00 run after a Sunday evening sign up sends day 2 on
 * Monday. One a run, never out of order, so a missed run never bunches two.
 */
export function courseDayDue(ageDays: number, sent: ReadonlySet<string>, course: Course): number | null {
  if (!Number.isFinite(ageDays) || ageDays > COURSE_WINDOW_DAYS) return null
  for (let day = 1; day <= course.days.length; day++) {
    if (sent.has(courseDayKey(course.slug, day))) continue
    return ageDays >= day - 1.5 ? day : null
  }
  return null
}
