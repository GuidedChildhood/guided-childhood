# Worry first emails, search page hand off, first screen, and the search page engine (28 November 2026)

Justin: "build in order suggested and cover everything, plus what you can see
is getting traffic, double down with a special agent, do not stop until as
many changes to add more pages that attract Google customers and LLM searches."

Evidence (PostHog and Supabase, 28 November):
- 5 parent sign ups in 60 days; all added a child, none opened a script or
  came back. The welcome and day 2 emails never mention the worries they ticked.
- Stage check, 14 days, Mumsnet removed: 147 started, 80 answered question 1.
- The /is-{app}-safe-for-{age}-year-old pages: 130 visitors in 30 days, almost
  all from Google, 4 started the stage check (3 percent).

## Build, in order

1. **Worry first emails.** The welcome and day 2 emails open with the
   script for the parent's top ticked worry: "You told us X is the hard one.
   Here are the words for tonight", the script's say line, a Use it tonight
   button. Everything else in the email stays. (`lib/email/templates.ts`,
   `app/api/email/cron/route.ts`, a small resolver from concerns to a script.)
2. **Search page hand off.** On every app safety page, the first stage check
   question sits under the answer as tap answers that carry into the check;
   each page links the matching script(s) for that app and age.
   (`components/app-safety/AppSafetyPage.tsx`)
3. **Stage check first screen.** Open on the first question, not a screen
   before it; the reassurance sits under the question.
4. **Search page engine (background agent, own worktree, merged here).**
   Reads what already gets traffic, then adds and improves pages that answer
   the questions parents ask Google and AI assistants, every claim sourced,
   every page handing into the stage check. Commits come back to this branch.

Every page and email: no dashes, British English, Justin's voice, evidence or
silence, design tokens, founder voice review on outward words.

## Done in this PR (28 November)

- Worry first welcome and day 2 emails (item 1).
- App pages ask the stage check's worry question and link the scripts (item 2).
- Item 3 held: the intro screen was already removed on 26 November; the leak
  moved to question one itself, on 24 visits. Not enough to redesign again.
- Search page engine: 66 app pages (six games), 16 guides on proven issues,
  FAQ structured data on guides, /llms-full.txt, extra FAQs on top apps.
- RSHE: the mapping page already existed (all 57 online requirements FULL);
  six school posts drafted on facts read in the primary documents:
  `content/linkedin/rshe-2026-school-series.md`.

## Habit review of the parent journey (to choose from, not yet built)

Why parents stop: setup ends in admin (home screen, reminders, screen time),
nothing asks them to use a script, days 1 to 7 are tour and sales emails, no
"did it work?" Top five, ranked:
1. When will you say it (planning prompt plus one reminder at that time),
   Gollwitzer and Sheeran 2006. Medium.
2. First win before admin: setup ends on the worry's script, Fogg 2009,
   Ryan and Deci 2000. Small to medium.
3. Day 3 "Did you try the words?" into workedRating and concern_events,
   Michie 2013. Small.
4. A first check at 2 to 3 days before the two week one, Lally 2010. Small.
5. True progress shown (named your worry, first script tried), Nunes and
   Dreze 2006. Medium.
Citations from memory with DOIs; verify before any public use.
