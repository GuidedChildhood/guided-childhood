# Five design concepts: the child learning platform, 4 to 16 and beyond

A design exploration only. No code or architecture changes proposed. To be red
penned before anything is built. All concepts assume the assets we already own:
the road to 16, the passport stamps, the four strands, DiGi and the buddy squad,
stars and quests, the device timer, printables, learning games, and the
Rosenshine lesson decks.

---

## 1. Research summary

The top performing children's learning apps share five patterns. **One path,
one next thing**: Duolingo's home is a single vertical trail where exactly one
node is lit; the user never chooses from a menu, they continue. **The
companion who cares**: Khan Academy Kids and Finch attach progress to a
character the child feeds through real effort, which converts abstract streaks
into felt responsibility. **Real world in, reward out**: Finch and GoHenry
prove children will do offline tasks (self care, chores) when a digital
companion visibly benefits, and GoHenry's paired parent and child apps show
oversight and autonomy can share one system. **Visual maturation**: platforms
that span wide age ranges quietly redraw themselves as the child ages rather
than offering a settings toggle. **Celebration density**: small, frequent,
physical feedback (chunky buttons, pops, confetti, sound) beats rare big
rewards. <uncertain>Public figures like Duolingo's day 365 retention are not
reliably verifiable and are deliberately not cited as targets.</uncertain>

---

## 2. Five concepts

### Concept A: The Winding Road
**The whole platform is one Duolingo style trail from 4 to 16.** Every
activity, a lesson, a quest, a device setting done with a parent, a health
habit, is a node on one serpentine path; the passport stamps are the chapter
gates between stages. Nothing lives outside the road.

- **Pseudo mockup:** full screen butter cream background; a fat dotted
  terracotta trail snakes vertically; chunky 3D circular nodes (72px, hard
  bottom shadow) alternate icon types: 📖 lesson, ⭐ job, 🛡️ setting,
  🏃 offline, ❤️ health check. The next node is lit butter with the child's
  buddy standing on it; done nodes show green ticks; ahead nodes are cream.
  Every fifth node is a large passport stamp medallion. Sticky top bar: streak
  flame, star count, stage chip ("Explorer · 11 to 13") in IBM Plex Mono.
  Nunito 900 for node labels. One button ever visible: "Continue".
- **Age progression:** the road literally changes landscape per stage:
  Foundation is a garden, Builder a street, Explorer a city, Shaper a campus,
  Independent a skyline at dusk. Node density and copy length grow with age;
  under 8s get audio-first nodes.
- **Feature tie in:** AI, social, safety and balance lessons are simply nodes
  scheduled at the right ages; settings tasks appear as "do this with your
  grown up" nodes; offline tasks and health habits are nodes that need a
  parent tick to pass; the parent app approves and injects nodes (school
  reminders appear ON the road).

### Concept B: Star Town
**A Finch style world the child builds by living well.** The buddy lives in a
small town; each strand is a building, and every real action, a job done, a
lesson finished, a calm switch off, visibly grows the town.

- **Pseudo mockup:** isometric pastel town on the child's chosen hue wash;
  four buildings: the Lighthouse (safe online), the Park (healthy balance,
  with the timer clock on its gate), the Lab (AI), the Café (social,
  locked with ivy until 11). Buddy walks between them. Bottom bar, three big
  tabs only: Town, My Jobs, Me. Tapping a building opens that strand's
  lessons and tasks as floors. Town hall displays the current passport stamp
  as a flag.
- **Age progression:** buildings unlock by age (the Café's ivy falls at 11);
  the art style matures from picture book to flat modern; at 16 the town
  becomes "yours to run", the child sets house rules for a younger sim
  resident, which is the mastery test.
- **Feature tie in:** the device timer is the Park gate (time earned opens
  it); settings tasks are Lighthouse lamps to light; health habits water the
  town green spaces; offline tasks earn building materials. Parent app is the
  town's planning office: approves, sends jobs, sees the health dashboard.

### Concept C: The Passport
**The passport stops being a metaphor and becomes the object.** The child owns
a beautiful skeuomorphic passport book; each stage is a page, each competence
a visa stamp earned through checks, and the daily loop is a boarding pass.

- **Pseudo mockup:** home screen is today's boarding pass: a ticket shaped
  card (mono type, perforated edge) listing three items: one lesson, one job,
  one health tick. Behind it, the passport book opens with a page curl; done
  stamps are inked (the real Higgsfield stamp art), the current page shows
  faint outlines of stamps still to earn. Ink on cream, terracotta foil
  accents; feels premium, like a real document.
- **Age progression:** pages are literally age gated with the ages printed on
  the page edge; younger pages have bigger stamps and fewer requirements; the
  16 page is a full spread that unlocks the "departures" ceremony.
- **Feature tie in:** every feature is a stamp requirement listed on the
  page: "Safety settings sealed" (device guides done), "The algorithm
  understood" (Explorer AI lessons plus quiz), "Balance held four weeks"
  (timer data), "Body and mind" (health habits). DiGi is the border officer
  who checks understanding through the choice quizzes before inking a stamp.
  Parent countersigns stamps in their app, GoHenry style dual control.

### Concept D: The Daily Three
**Habit first, map second.** The home screen is only ever three big tiles,
Learn, Do, Move, refreshed daily and finishable in 15 minutes. The road and
passport exist one tap behind, as the record of all the days.

- **Pseudo mockup:** three stacked full width cards with huge icons and hard
  shadows: "Learn: Spot the trick (6 min)", "Do: Tidy room ⭐2", "Move: 20
  minutes outside". Each card flips with a GSAP pop and tick when done; when
  all three flip, the buddy celebrates and the streak flame grows. A single
  small "My road →" link opens the map. Maximum four tappable things on
  screen, ever.
- **Age progression:** tile contents are fed by stage (a 5 year old's Learn
  is a 2 minute audio story; a 15 year old's is a notification audit);
  copy reading age scales; at 13 plus a fourth optional tile appears,
  "Check", the social and AI self checks.
- **Feature tie in:** the scheduler guarantees coverage: across a week the
  Learn tiles rotate strands, Do tiles carry quests and settings tasks, Move
  tiles carry offline and health. Everything still writes to the one road and
  the strand ticks; parents see the same three tiles mirrored with approve
  buttons and the health metrics behind them.

### Concept E: DiGi, the Co Pilot
**Conversation is the interface.** The child's home is DiGi greeting them the
way the parent app already does: a three beat guided walk, here is where you
are, here is today's one thing, off you go, with every feature surfacing as a
card inside that conversation.

- **Pseudo mockup:** white screen, Good Inside simplicity; DiGi's golden star
  top left, big Nunito 900 greeting: "Morning Teo. One thing today." Below,
  one card at a time slides up: a lesson card, then on completion a job card,
  then a "your time is ready" timer card. The child's replies are big blue
  pills. No tabs at all for under 8s; a quiet bottom bar appears from 8.
- **Age progression:** the conversation itself ages: emoji dense and spoken
  aloud at 4, peer toned and typed by 13; at 16 DiGi shifts from guide to
  consultant ("want me to audit your privacy settings with you?"), the same
  arc as the parent side promise.
- **Feature tie in:** DiGi sequences everything (lessons, settings walks,
  offline missions, health check ins, the weekly graded questions) as
  conversation, so the strand ticks are fed by the same dialogue; the parent
  app sees DiGi's summary of the week. This is the strongest continuity with
  the parent experience, one character, both sides of the family.

---

## 3. Recommended next steps

1. **Score against the bar** (Duolingo clarity, our warmth): rate each concept
   1 to 5 on: obvious next thing, five year old usable, sixteen year old not
   embarrassed, parent oversight visible, builds on assets we already own.
2. **Likely hybrid:** A + D + E compose naturally: the Daily Three as the
   home habit, the Winding Road as the map behind it, DiGi as the voice that
   walks the child between them. B and C contribute their best organs (the
   timer as a gate, the passport as the reward object).
3. **Mobbin pass on the winner** before any mockups: pull the exact reference
   screens for the chosen pattern set, then one high fidelity mock of the
   child home at ages 5, 11 and 15 for red pen.
4. **Prototype the smallest loop** (one Daily Three day, one road chapter,
   one stamp ceremony) behind a flag on the existing kid link, no
   architecture change, before committing further.
