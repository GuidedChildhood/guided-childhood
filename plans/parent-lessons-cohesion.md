# Lessons: one simple app, one pathway

The north star for the parent and child lesson experience, so every session
builds toward the same coherent app instead of stacking overlapping shelves.
Drawn from a benchmark study of Good Inside, Duolingo, Khan Academy Kids,
Jigsaw PSHE, Common Sense Education and the parent-sets / child-does pairing
apps. Read this before touching the Lessons hub, the kid link, stars or the
passport.

## The one sentence

One family pathway, ages 4 to 16: the parent watches a five minute film with
the child or sends it to their phone, the child earns stars that become device
time, and each finished stage stamps the passport. The pathway is the spine.
Everything hangs off a node on it.

## The eight principles

1. **One home, one next thing.** The parent and the child each open on a single
   recommended action, never a feature grid. Good Inside pre-decides today's one
   thing; Duolingo lights the one next node. The library sits one tap down, never
   as the front door.

2. **The pathway is the spine, not a tab.** The five stage road (already at
   `/dashboard/pathway`) is the primary object. Lessons, scripts, DiGi and stars
   are things that live on its nodes. If a new feature does not attach to a node,
   question whether it belongs.

3. **One reward currency, end to end.** Stars look and behave identically where
   the child earns them, where the parent sees them, and where they convert to
   device time. A second currency instantly reads as a second app. Stars already
   flow through `lib/quests/bank.ts`; never open a parallel currency.

4. **The handoff is a bond, not a second app.** Pair once by link, the child
   needs no login, and the parent sees the child act: the rocking red badge on
   the Quests tab when a child asks (PR #276) is exactly this loop made visible.
   Speak of it as one thing, "your family pathway".

5. **Value before the menu.** First session should deliver one complete watch
   together plus one child mini lesson that pays real stars before the app
   reveals everything else.

6. **The passport is the goal gradient.** A visible passport, one stamp per
   stage, always showing "x of 5". Motivation rises as the finish shows. The data
   layer exists (`stage_passports`, migration 049); the visual wires into the
   `/passport` flip book.

7. **Reward the behaviour, never bribe.** Tangible rewards for an already enjoyed
   act erode intrinsic motivation. Pair every star with DiGi or parent praise so
   stars feel like recognition, and reserve the big payout for a stamp, not every
   tap. This is why first watch pays 10 and a redo pays 2.

8. **Kind re-engagement.** One gentle nudge at the family's usual time; escalate
   only when a stamp is within reach; always a grace day. Never guilt, never
   streak anxiety. Progress framed as "still on the pathway", never "you failed".

## Child accessibility is structure, not polish

One guide character voices every prompt (a non reader must operate it unaided),
tap targets at least 48dp with generous spacing, sessions three to five minutes,
and a celebratory close. The big picture tiles in PR #276 move the kid link the
right way.

## The five ways it goes messy, and the guard

1. Two apps bolted together. Guard: shared currency, real time mirroring, one
   shared vocabulary.
2. A dashboard instead of a next step. Guard: home is one action, library one tap
   down.
3. Reward inflation and a bribery feel. Guard: steady the earn rate, co-deliver
   praise, save big payouts for stamps.
4. Feature sprawl, every idea a new tab. Guard: everything attaches to a path
   node or is cut.
5. Guilt notifications and streak anxiety. Guard: gentle cadence, grace days,
   supportive framing.

## Where the build is (2026-07-14)

**Live on main.** Schema and seed (migrations 049, 050), the player, the age
gated kid adventures, completion with redo, 10 / 2 stars into the star bank, the
stage passport data layer, and the co view shelf. Vercel green.

**In flight, PR #276** (the coherence pass by another session): drawn posters on
the parent hub, posters threaded to the child adventure cards, big picture kid
tiles grouped as Watch with your grown up / My lessons / Games / Paper
adventures, and the rocking red badge for pending child asks. Depends on
migration 051 to show posters.

**This tidy, PR (claude/lessons-hub-tidy).** Collapsed the duplicate shelf: the
whole app already treated `/dashboard/lessons` as the hub (nav, quests, guide,
lesson back links), while only the dashboard card and the completion push still
pointed at the vestigial standalone `/dashboard/lessons/together`. Repointed both
to the hub and turned the standalone index into a redirect. The player at
`/dashboard/lessons/together/[code]` is untouched. Result: one Lessons hub, films
above the interactive library in one scroll.

## Still open (the honest gap list)

- **Run migration 051 in Supabase.** Until it runs, `poster_url` is null and the
  headline poster feature in #276 shows only the emoji fallback. This is the one
  paste that unblocks the visible win.
- **Passport visual.** Data is done; the `/passport` flip book needs the stamp
  per stage wired and surfaced as the goal ("x of 5").
- **Send to child deep link.** The send currently lands the child on their home,
  not the specific adventure. Deep link it to the sent lesson.
- **One home, one next thing.** The parent dashboard is still a tile grid. A
  single "tonight's lesson" recommendation above the grid would match the field.
- **Migration numbering.** Two files share the 049 prefix (`049_parent_lessons`
  and `049_wire_video_beats`) from parallel sessions. Both already applied, so
  this is cosmetic, but fresh setups should renumber one.

## The coordination rule that keeps this tidy

The video lesson area is hot across sessions. Before building here: `git fetch`,
list open PRs, and check whether a PR already claims the files. Posters, the kid
tiles and the hub have each been built twice already. Attach to a node, claim
with a PR, and prefer finishing an open PR over opening a parallel one.
