# Smart alerts — the one proactive nudge layer

**Written 9 Jul 2026 · The now and then, here is something you could do layer · Surfaces the whole service at the right moment instead of making the parent go find it**

Justin's ask: the app should, now and then, alert the parent to things they can do, set a routine reminder that pings the child, remind them of the week's events and tasks, send tasks and chores, reach for a script, a device setting, a lesson, an outdoor or play quest. The pieces exist. What is missing is one layer that picks the single most useful thing for this family this moment and offers it, gently, so the value is surfaced instead of buried.

## 1. The idea

One engine, `getSuggestions`, that looks across everything a family has and has not done and returns a short ranked list of concrete, one tap actions. The home shows the top one or two as a calm nudge card. A daily cron can push the single best one to the phone. Never a wall, never nagging, one clear thing at a time.

## 2. It reuses what is already here

- **DigiPrompts** already renders proactive prompts on the home. This becomes its smarter, cross service replacement.
- **School reminders**, **quest ping to child**, **push send**, **scripts**, **device setup progress**, **concerns ledger**, **lessons completion** all already store the state the engine reads.
- Nothing new to store for v1. The engine is a read and rank over existing tables.

## 3. What it can suggest (the sources)

Each suggestion has a kind, a warm one line, and a single action. The engine draws from:

- **Device settings**: a device in this stage not yet set. Action, open its guide.
- **The week's tasks**: a school routine or event due in the next two days. Action, remind me, or send it to the child.
- **Chores and quests**: no quests set yet, or a quest goal close to earned. Action, set quests, or tell the child they are nearly there.
- **Ping the child**: it is the usual screen off time. Action, send a come off screens ping.
- **A script for tonight**: a concern flagged today with a matching script unread. Action, open the script.
- **Outdoor and real play**: too many screen quests this week and no outside ones. Action, add an outside quest.
- **A lesson**: the next age matched lesson not done. Action, do it together.
- **DiGi**: a recurring concern worth a proper plan. Action, talk to DiGi.

## 4. How it ranks (so it is never noise)

- **Urgency first**: a task due tomorrow beats a nice to have.
- **One per source per day**: never two device nudges in a row.
- **Respect recent action**: if they just did the thing, drop it for a while.
- **Calm cap**: the home shows at most two, the daily push sends at most one.
- **Never repeat a dismissed suggestion** for a set cool off.

## 5. Surfaces

- **Home card**: replaces DigiPrompts with the ranked top one or two, each a tap to act.
- **Daily push (opt in)**: a cron picks the single best suggestion per family and sends it as the day's nudge, in the Duolingo spirit but calm and honest, never guilt for its own sake.
- **A quiet list**: a see all view for the parent who wants the full set of what they could do now.

## 6. Data and build shape

- `lib/alerts/suggestions.ts` returns a ranked `Suggestion[]` from the existing tables. Pure read and rank, no migration for v1.
- `components/alerts/SuggestionCard.tsx` renders one suggestion with its action.
- The home mounts the top of the list where DigiPrompts sits now.
- A `dismissed_suggestions` store (localStorage for v1, a small table later) holds the cool off.
- Phase two: a cron route that sends the daily best suggestion by push, reusing the push send path.

## 7. Anti nag rules (non negotiable)

The whole product is calm. Smart alerts must never become a slot machine or a guilt engine. Fixed to the same ethos as the quest games: one thing at a time, honest, easy to dismiss, and it always respects that a parent who is doing the work does not need chasing. Frequency is capped in code, not left to chance.

## 8. Build order

1. `getSuggestions` over the existing tables, with the ranking rules.
2. `SuggestionCard`, and mount the top one or two on the home in place of DigiPrompts.
3. The see all list.
4. Phase two, the daily push cron that sends the single best suggestion.

## 9. First actions

1. Confirm the source list and ranking with JP.
2. Build `getSuggestions` and `SuggestionCard`, wire into the home.
3. Ship, watch which suggestions land, tune the ranking.
