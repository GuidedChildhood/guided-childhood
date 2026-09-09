# The butter that was never a colour

Justin, 9 September 2026: "Butter colour fix make sure all fits happy news
design."

## What is wrong

`--butter` is used 16 times in the app and defined nowhere it loads. It exists
only in four standalone HTML files under `content/` and `tools/`, which the app
never imports. Verified at runtime rather than by reading:
`getComputedStyle(document.documentElement).getPropertyValue('--butter')`
returns the empty string, and `/ref-quest-board`'s `main` computes to
`rgba(0, 0, 0, 0)` instead of butter.

A custom property that does not resolve makes the whole declaration invalid at
computed value time, so `background: var(--butter)` is not a wrong colour, it is
NO colour. The element falls back to transparent and shows whatever is behind
it. On the child screens that is `--kid-bg`, a dark anthracite gradient, under
ink coloured text chosen for a butter background.

It is silent in exactly the way this codebase keeps getting caught by: nothing
errors, nothing logs, the page renders, and the only way to know is to be the
family looking at it.

## The sweep, not just the one token

Reading the file that was supposed to define it turned up neighbours in the same
state, so this is a sweep of every custom property the app uses and never
defines, checked at runtime, not a single line fix.

Confirmed missing and bare (no `var(--x, fallback)` to save them):

| token | uses | where |
| --- | --- | --- |
| `--butter` | 16 | child jobs and week, printables sheet, craft pack, five ref pages |
| `--butter-dark` | 3 | printables sheet, star chart sheet |
| `--butter-lt` | 2 | Planet Friends, Mission Board |
| `--sage` | 3 | child lesson list, child stage quiz |
| `--coral-dark` | 7 | schools hub, curriculum, print |
| `--gold-hover` | 1 | schools print button |

Ruled out as false alarms, so they are not touched: `--stage-` (a template
literal, `var(--stage-${n})`), `--font-nunito` and `--font-ibm-plex-mono` (set
by next/font on the root element), and the `--ag-*`, `--drift`, `--fall`,
`--fit*` families, all defined inline in the one file that uses them.

## The values, and why these ones

Not invented. `tools/social-cards/template.html` already carries the set the
brand was drawn with, and it matches the terracotta family in `shared/tokens.css`
exactly:

    --butter: #EDC35F        the same as --terracotta, whose own comment reads "butter"
    --butter-dark: #C99A28   the same as --terracotta-dark
    --butter-lt: #FEF7E0     the same as --terracotta-lt

So butter is not a new colour, it is the name half the codebase already uses for
the one we have. They are defined as aliases of the terracotta tokens rather
than as fresh hex, so the two names can never drift apart.

`--sage` takes `--retro-green` (#2F8F6B) and `--coral-dark` and `--gold-hover`
follow the same rule: an existing house colour, aliased, never a new one.

## What has to be true afterwards, and this is the actual work

Justin: "make sure all fits happy news design." Defining the token is one line.
The job is what happens to the screens when a colour they have never had
suddenly arrives.

Every one of these screens has been rendering wrong for weeks, which means any
tuning done to them was tuning against the broken state. So each affected screen
is looked at BEFORE and AFTER at 390 and 1200, and anything that does not read
as happy news once the colour lands gets fixed in this pass:

- ink text must stay readable on butter, and white text must not be left on it
- a butter card on a butter ground needs its edge back
- the ink border and hard ledge must survive
- nothing may start scrolling sideways

## Guard

A missing token cannot be caught by typechecking and was not caught by the
wiring check. `scripts/check-tokens.mjs` reads every `var(--x)` in the app and
fails when one has no definition and no fallback, ruling out the inline and
next/font cases the same way this plan did. It runs in CI beside the concern
guards.

## Checks

`npx tsc --noEmit`, `npm run wiring`, `npm run concern-guards`, the new token
guard, the dash grep, and Playwright before and after at 390 and 1200 on every
screen in the table.
