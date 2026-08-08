# Curriculum depth: the warehouse gets a front door

8 August 2026. Justin: "can we build a plan that fits into what we got so we
are not making completely changes just adding to its depth."

That constraint is the whole design. Nothing below adds a new page, a new
nav item, or a new pattern. Every phase rides a surface that already exists
and already works: the Today card, the quests board, the kid road, DiGi's
context, the passport. The plan turns the most imported and least used data
in the product, 448 curriculum objectives, into the reason a family opens
the app on a Monday.

## Where we start from, counted live on 8 August

| Asset | Rows | Reached today by |
|---|---|---|
| curriculum_objectives | 448 | /dashboard/learning and the homework decoder at /dashboard/homework, both parent initiated, two taps deep |
| scripts | 296 | daily loop, recommender, library |
| lessons | 135 (46 parent live, 44 parent stubs, 44 teacher stubs) | lessons hub, passport |
| daily_moments | 89 | daily deck, Home rail |
| ai_lessons | 54 | AI module |
| child_scripts | 25 | /k/[token]/tell |
| kid_lesson_missions | 3 | the kid road |

Lifetime consumption across all families: 56 script completions, 37 lesson
completions, 5 moment completions, 0 watch together completions, 0 stage
quiz passes. The warehouse is stocked and the aisles are dark. The objectives
table has year_group, subject, term, strand, objective, checkpoint and
sort_order, which is everything a deterministic weekly rotation needs.

## Phase 1: This week at school (one PR, the big one)

The weekly class brief. The server already knows the child's year group (from
the birthday) and the term (from lib/learning/term.ts). Pick the week's
objectives deterministically: the term's rows for that year group, ordered by
sort_order, walked by week of term, two subjects a week (maths and English
lead, others rotate in).

Delivery rides what exists:

1. **A Today card row.** "What [name]'s class is on this week", one line of
   the objective in plain words. Taps through to /dashboard/learning, which
   already renders the year; add an anchor that lands on this week's strip.
   No new Home component: it is one more row in the card phase 3 built,
   appearing on Mondays and folding like the rest.
2. **The brief itself lives on the learning page**, which already exists and
   already knows the year. It gains a "this week" strip at the top: the
   objective, the school's method (the verbatim field), and one dinner table
   question templated from the checkpoint field ("ask them to show you...").
   No model call, no new page.
3. **One tap makes it a quest.** "Make this a job" prefills the existing
   quest add flow with the objective as a job that pays stars, the exact
   mechanism entry 8 of the service catalogue already promises ("anything
   they are learning can be turned into a job"). Today that promise is a
   manual retype; this makes it one tap.

Why first: it uses the biggest dormant asset, it gives Home a reason to be
opened on a fixed day, and it costs one row plus one strip plus one prefill.

## Phase 2: the child sees the same week (one small PR)

kid_lesson_missions exists and works; it has three rows. Extend it: the same
weekly objective lands as a mission on the kid road, worded for the child,
paying stars on completion the way the AI games already do. Parent approves
the tick like any quest. The loop this closes: school says it, the parent
hears it, the child earns on it, one week, one thread.

## Phase 3: DiGi knows the term (one small PR)

DiGi's dynamic context already carries the family memory, the stage and the
live concerns. Add one block: the child's year group and this term's
objectives for the two lead subjects, plus a pointer to the decoder. Then
"he is stuck on fractions" gets answered in the school's method without the
parent knowing the decoder exists, and DiGi can say "want me to show you how
their class is being taught this" with a real answer behind it. Additive:
one context builder, no tool changes, no behaviour rules touched.

## Phase 4: the shelf tells the truth (one PR, mechanical)

The 44 parent lesson stubs. Audit against the passport: any stub a stamp
depends on gets finished (content written into the existing lesson shape) or
the stamp requirement drops it. The rest get retired from listings so the
hub stops showing shelves of ghosts. The 44 teacher stubs wait for the
schools lane and are out of scope here.

## What this does not do, on purpose

No new pages. No new nav. No new tables (phase 2 may add columns to
kid_lesson_missions; the rest is reads). No model calls in the weekly loop.
No change to what a Now row means: the week's brief is a Today row, because
nobody is stood waiting on it. The homework decoder stays where it is and
gains traffic from phases 1 and 3 rather than a new home.

## Order and effort

Phase 1 is the value and roughly a day. Phase 2 is a morning. Phase 3 is an
afternoon and needs care only in context size (a handful of objectives, not
the term's 40). Phase 4 is long but mechanical and can run in a parallel
session lane. 1 then 3 then 2 then 4 if sessions are scarce; 1 must land
first because 2 and 3 reuse its week picker.
