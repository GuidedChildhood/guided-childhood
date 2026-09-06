# DiGi's situations and forecasts bank

Justin, 6 September 2026: "DiGi needs to be clever enough to know all the
exact problems parents have with devices: after school, in the morning,
holidays, whether they use devices more to help with parenting, and helping
the parents deal with the stress of looking after children when they use
devices to help them; how to make sure they are using it in balanced ways.
Research all the deep science on that, how in the past we have dealt with
potentially addictive media, our pathway and philosophy on it and the
researchers we believe in, the latest research from neuroscience, dealing
with children who find it difficult, how different types of children react,
forecasting what happens when a child gets a new phone or starts to love a
game on the Switch, how children can learn AI in a safe way, and the US
picture from Pew Research Center so we know what is coming."

## What already exists

The research bank (expert_knowledge) holds about two hundred active rows,
tagged by topic and age band, searched by meaning (match_expert_knowledge)
with a keyword fallback (lib/digi/brain.ts). Every row in a migration is
embedded by the knowledge embed sweep, so a new row is searchable the same
day. The situation reader (lib/digi/situation.ts) infers a time band and a
topic from the parent's words. DiGi's word (PR 978) reads the family's
fortnight and the bank for the child's age band. What is missing is the
bank knowing the MOMENTS a parent lives in (after school, morning,
holidays, the calming screen, the parent's own stress, the new phone, the
new game, the chatbot) and anything that looks AHEAD for a child of this age.

## The build

1. Research first. The kids-research pipeline runs on the brief above: six
   lenses, a contradiction map, the briefing from the template, a citation
   verifier pass, a v2 with the ledger, and the distribution review note.
   Saved to briefings/2026-09-06-digi-situations-and-forecasts-v2.html and
   content/packs/2026-09-06-digi-situations-and-forecasts/content-potential.md.
2. Migration 260 seeds the bank from the CONFIRMED and CORRECTED findings
   only, one row per finding, each tagged with its situation
   (after_school, morning, holidays, parent_stress, device_as_helper,
   balanced_use, pull_and_design, history, temperament, adhd, autism,
   anxiety, new_phone, new_game, ai_use, ai_readiness, forecast) plus the
   existing topic it also belongs to, and its age bands. Demoted findings
   never enter the bank.
3. lib/digi/horizons.ts holds the milestone table by age band (what
   typically arrives next, the move to make before it lands, the named
   source and the country the figure is from). It renders into the chat
   prompt and DiGi's word brief for this band and the next.
4. lib/digi/brain.ts keyword map learns the words parents use for each
   situation ("after school", "the holidays", "his new phone", "chatgpt",
   "calm him down", "stressed") so the keyword path finds the new rows even
   before they are embedded. lib/digi/situation.ts gains the holidays time
   band and the new phone, new game, parent stress, ADHD and autism topics.

5. The three facts. The static prompt gains one rule: on a screen, game or
   phone worry, DiGi looks for who the child was with, how they felt
   afterwards and where the device charges, asks whichever it does not
   know in one warm line inside the first reply, and remembers the answers.
   Never on a crisis, never on a quick factual question.
6. The closed lists the follow up tool and the outcomes ledger use gain the
   holidays time band and the new phone, new game, parent stress, ADHD and
   autism topics, so a follow up about the holidays or a new phone can be
   counted with other families rather than dropped.

The platform map for every move the briefing proposes, including the six
scripts and the schools Year 6 pitch that are NOT in this PR, is in
plans/2026-09-06-situations-platform-map.md.

## Out of scope

No new screens. DiGi's chat and DiGi's word are the surfaces; the bank and
the horizons change what they know. Migrations 256 and 260 apply to
production only on Justin's word.

## Follow up, same day: the six scripts (migration 261)

Justin, after the merge: "Do migrations and continue." Migrations 256 and
260 are applied. The six scripts the briefing named are migration 261, one
row each, none repeating an existing title (the builder match stop and the
explorer real money scripts from migration 186 stay as they are):

- foundation, screen time: The two minute warning is making it worse
- builder, gaming: The first gift card, before the first spend
- builder, school and AI: Ask the AI together, hints not answers
- builder, family rules: The Year 6 phone plan, before the box is opened
- explorer, staying safe: The no confiscation promise, said out loud
- explorer, everyday routines: Your own phone, one protected slot a day

All free, so the recommender has something honest to offer at the stages
where free screen and safety rows were thin. Applied to production on
Justin's word.
