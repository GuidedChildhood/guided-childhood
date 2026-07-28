# Devices, and the balance. A three thread, six channel content system.

Date: 28 July 2026. The running content engine for the next stretch. One theme
underneath everything, three alternating threads on top, written native to six
rooms. No dashes anywhere. UK English. Justin's voice, warm, plain, direct.

---

## The one theme underneath all of it

Devices, and the balance. Not a fear pitch and not a cheerleader pitch. The
honest middle. There are good reasons to reach for a screen and there are good
reasons to put it down, and the whole skill of modern childhood is holding both
at once. Every post, whichever thread it belongs to, sits inside that frame.

This lets the hard belief travel quietly. The real drivers of the crisis are
poverty, adverse childhood experiences and a parent's own mental health carried
with too little support. Connection is the protection. Sixteen is a ramp, not a
cliff. We never lead with that thesis. We let the balance argument walk toward
it, roughly one post in ten stating it plainly, the other nine each carrying one
brick. (See .claude/skills/content-engine/hidden-thread.md, the mission filter
and the 1 in 10 rule, applied to every draft in this pack.)

---

## The three threads (they alternate, in this order)

**Thread 1. What we believe.** Research led. The proportionality spine. One brick
per post, an effect size, a pattern beats hours finding, active versus passive
use, the Goldilocks middle, connection as the real protection, the moral panic
lineage held precisely. Loosely tied to devices and balance, never a lecture.
The rare 1 in 10 post lands the full thesis.

**Thread 2. What we are building.** Founder. Grounded only in what the repo shows
we have actually built, no invented features. Building the brain (DiGi, the
parent facing guide). The calendar engine that reads the school year. The staged
pathway from 4 to 16. The school curriculum. Building in the open, the failed
safety eval, the deleted homepage numbers. Honesty as the through line.

**Thread 3. How we solve the actual problem.** The practical one. The moments a
real parent has, and the tools that meet them. The Year 6 phone bridge. The
homework decoder. Seasonal advice that arrives at the right week without testing
the child. The family phone agreement written together. The big social media
literacy module. And the reasons to reach for a device, held honestly with the
catch, all worked into the online and offline balance.

The rotation runs Thread 1, then Thread 2, then Thread 3, then back to Thread 1,
across whatever cadence a channel posts at. On LinkedIn this runs alongside the
existing In Proportion and Founder alternation as the broader multi channel
strand, so LinkedIn readers see belief, build and practical in turn.

---

## The evidence bank (Thread 1, and the spine of Thread 3)

Every claim here is one we can stand behind. UK anchor where possible.

- **Pattern beats hours.** Xiao et al, JAMA 2025, ABCD cohort, 4,285 youths over
  four years. Total screen time was not associated with suicidal behaviour, an
  addictive use trajectory carried a risk ratio of 2.14. The shape of the use,
  not the clock, is the signal.
- **Small population effect.** Orben and Przybylski, Nature Human Behaviour 2019,
  355,358 adolescents. Digital technology use explained at most about 0.4 percent
  of variance in wellbeing. The wearing glasses line is theirs, not Odgers.
- **The Goldilocks middle.** Przybylski. Moderate use beats both zero and heavy.
  Aim at a sensible middle, not abstinence.
- **Windows of sensitivity.** Orben. Roughly girls 11 to 13, boys 14 to 15, both
  around 19. Blanket age rules are crude because sensitivity is developmental.
- **Preparation over fear.** Odgers. Effects are small on average and causation is
  unproven, so prepare and support rather than ban. Never overstate into harmless.
- **The good side is real.** Digital Wellness Lab on belonging and connection.
  Systematic reviews on social media and marginalised youth, connection can lift
  wellbeing, and the same reviews call it double edged. Ofcom Children and Parents
  2025, a large share of UK young people create content, not just consume it.
- **The real drivers.** Odgers, Nature 2024, caregiver mental health among the
  strongest single predictors of child mental health. Childhood adversity and its
  long tail, Kovacic and Orso 2025 (JRC), loneliness as the bridge from an old
  wound to later overuse.
- **Context predates phones.** Independent childhood mobility fell from about 80
  percent to under 10 percent of young children between 1971 and 1990 (Hillman,
  One False Move, PSI 1990). The screen partly fills a hole dug long before it.
- **Moral panic, used precisely.** Cohen 1972 coined it. Goode and Ben-Yehuda 1994
  gave the criteria, disproportionality, volatility, symbolic threat. Always the
  proportionality test, never a denial that harm exists.

## The reasons to reach for a device (the balance, held honestly)

From the curriculum module 13, the good side held honestly. Five real goods,
each with its catch. This is the backbone of the balance argument, and the
answer to why not just ban it.

1. **Connection.** Keeps friendships alive across distance. Catch, always
   reachable can start to feel like you can never log off.
2. **Belonging.** Helps a child find their people, and it matters most for the
   one on the edge of things. Catch, the place you belong is the place that can
   pile on.
3. **Voice.** Standing for something and being heard. Catch, being visible is
   being a target.
4. **Creativity and learning.** Making beats watching, and the homework, the
   research, the skill learned on a screen are real goods. Catch, the pressure to
   perform and chase numbers.
5. **Support.** Finding people who get exactly what you are going through. Catch,
   a warm stranger is still a stranger, and online advice is not a trained adult.

The offline half is not the enemy of this list, it is the ballast. Rebuild
unstructured, unsupervised real world time beside the screen rather than only
taking things away.

## The feature bank (Thread 2 and Thread 3, repo grounded)

Only what the repo shows we have built. To be confirmed and enriched by the
feature inventory pass before any post claims a feature.

- **DiGi, the brain.** Parent facing guide. Answers from a cited library of around
  twelve named researchers, an engine scores every finding against the parent's
  exact question by the child's age band and topic, seven research principles plus
  a hard safety line it cannot cross, no verdicts only pathways, a crisis rule that
  beats every other instruction, a safety eval that runs every Monday and emails
  the score. It also remembers the family and tracks what has already worked. Not a
  child chatbot.
- **The calendar engine (lib/learning/calendar.ts).** Reads the fixed England
  statutory school calendar against a child's year group. Tells a parent what is
  coming, the phonics screening, the multiplication tables check, the 31 October
  secondary application deadline, without ever testing the child. Every date is
  approximate, the copy says around and the week of.
- **The Year 6 phone bridge.** The highest value moment the product has. Secondary
  transfer is when the first phone usually arrives. The card gives the ORDER, the
  thing that cannot be redone, and never a verdict on whether to buy the phone.
  Rules agreed a fortnight early are just how it works, the same rules added later
  feel like something taken away. Triggered by school year, not age.
- **The homework decoder.** Paste the homework, get the statutory line behind it,
  what it is for, and one thing to do tonight. Needs nothing about the child, only
  the year group and the curriculum.
- **The staged pathway, 4 to 16.** Five stages, foundation (4 to 7), builder (8 to
  10), explorer (11 to 13), shaper (13 to 15), independent (16+). DiGi plus the
  five Planet Friends, Pebble, Bloop, Orbit, Nova and Cosmo, one earned per stage.
  Readiness grown one stage at a time, tracked on a passport, long before any
  account exists.
- **The school curriculum.** Two, actually. A full 21 module curriculum from
  Reception to Year 13, and inside it the social media literacy set, 15 modules in
  three versions, mapped to the statutory RSHE guidance that becomes compulsory 1
  September 2026 and to UKCIS Education for a Connected World. A compliance hub
  (RSHE mapping matrix, policy text, parent pack, data protection pack) is built.
  The schools sell is meeting a duty that arrives this September.
- **The balance report and the scripts.** A weekly balance report that counts off
  screen effort, jobs, printables, time outside, against the week's screen time.
  A database library of 100+ conversation scripts for the real moments, the device
  at dinner, the meltdown when it goes off, the thing you did not know how to say.
  A device safety hub of set up guides, each with an ask DiGi to walk me through it.
- **The family phone agreement.** A printable deal written together, in the
  child's own handwriting for their half, a ceremony not a lecture, reviewed every
  term so the deal loosens as trust grows.
- **Building in the open.** The safety eval that scored two out of seven and the
  crisis rule written after. The homepage numbers deleted because they were not
  true. The founder rate capped at 50 in code, not just copy.

---

## The six rooms (voice rules, held from the established packs)

- **LinkedIn.** Professional, longer, thought leadership. Up to 3000 characters.
  One idea, argued in full, ends on a question. CTA sparingly, only near a
  series close, to /starter-pack.
- **Facebook.** Warm, short, one idea, local parent group register, ends on a
  question. No hard sell.
- **Instagram.** Caption first, a strong hook line, short lines with air, a small
  set of hashtags at the end, one soft line to the link in bio at most. Written to
  sit under an image or carousel.
- **Mumsnet.** Genuine parent sharing what they found. No marketing scent, no
  link, no brand name. Honest, a bit unsure, invites others. Board named.
- **Reddit.** r/ScienceBasedParenting register. Evidence first, neutral, every
  claim linked, structured for discussion, invites correction. No product.
- **Substack.** The long essay. Room to hold all three threads together, the
  belief, the build and the practical, in one considered piece. Soft CTA at the
  foot.

---

## The alternating calendar (first cycle)

Each channel gets one post per thread this cycle, in rotation. Reddit and Mumsnet
carry Thread 1 and Thread 3 native, and hold Thread 2 lightly or not at all,
because a founder pitch reads as marketing in those rooms.

| Slot | Thread | LinkedIn | Facebook | Instagram | Mumsnet | Reddit | Substack |
|------|--------|----------|----------|-----------|---------|--------|----------|
| 1 | 1 Believe | yes | yes | yes | yes | yes | woven |
| 2 | 2 Build | yes | yes | yes | light | skip | woven |
| 3 | 3 Solve | yes | yes | yes | yes | yes | woven |

Substack holds all three in one essay. The rotation then repeats, Thread 1 next,
carrying the next brick.

## Compliance

- Hidden thread applied. Roughly 1 in 10 posts states the full thesis, the rest
  carry one brick. Thread 1 post 1 here lands closest to plain, the rest imply it.
- No dashes, anywhere, any channel.
- Repo grounded for every build and feature claim, no invented biography, no
  invented features, no invented statistics.
- DiGi is the parent facing guide, never a child chatbot, never allow or deny.
