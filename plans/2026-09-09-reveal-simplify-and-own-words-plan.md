# The reveal, simplified, and the parent's own words carried all the way through

Justin, 9 September 2026, with five screenshots of the live starter quiz and
reveal, plus a board of Happy Newspaper reference:

> "can we simplify this page but keep important parts, remember present problem
> parent has, and provide how we solve. Also no black, these needs proper Happy
> News style and make sure text fits all our previous design. Don't stop working
> on each aspect here until an agent can score it 10 out of 10 from a SaaS expert
> on parents platforms and an agent that specialises in mental health of children
> how it relates to these issues we solve. Really needs better likeness to icons
> on Happy News. Can we make the something else box where they type in appear in
> the box and they click to save. Can we also report when we get asked common
> related questions here to an analytics page so we think about common asks and
> problems from parents to look to add in future. I see something else comes up
> on next page but this needs to be better colour and put there what they added,
> add to check in as what they added, and then DiGi brain and system searches for
> relating scripts, moments and advice on this entered as well as letting me know
> via the analytics page. DiGi is clever enough to look up advice based on our
> agent and relate it to anything we have."

## What is actually broken, from the screenshots

1. **The typed words never leave the quiz.** `worryOther` is captured in
   `page.tsx`, saved to `onboarding_answers.challenge_other`, and then NOT
   passed to `<ResultScreen>`. So a parent who typed "speaking on phone a lot
   as friend has new one" is shown a card headed **"Something else"**. We asked
   them to tell us and then read back our own label.
2. **The dark card.** `background: 'var(--deep-teal)'` renders near black on a
   cream page. It is the only black block in the product and it lands directly
   under the hero.
3. **`WorryAnswers` drops the catch all entirely** (`filter(id => id !==
   CATCH_ALL_ID)`), so the one worry they cared enough to type gets no answer
   card at all.
4. **Nine sections after the hero.** Roll call, answers, how it works, DiGi,
   time, child app, road, for you, door. Two of them say the same thing twice.
5. **The icons are thin monochrome line icons.** The Happy News hand is bold
   filled shapes, black outlines, bright multi colour, slightly wonky.
6. **No save on the Something else field.** It is a bare input with no
   affordance, so a parent does not know the words were kept.

## The lanes

### 1. Their words, kept and shown
- `WriteInWorry`: the field gains an explicit **Save** button and, once saved,
  the typed words show back inside the tile as a chip with an edit affordance.
- `worryOther` passed into `ResultScreen`, and through to `WorryAnswers`.
- The catch all gets its own answer card, headed with THEIR words, with an
  honest answer: we do not have a pre written pathway for this one, here is
  what DiGi does with it tonight and how it joins the check in.

### 2. No black, Happy News, text fits
- The deep teal roll call card is replaced. The roll call folds into the
  answers section rather than being its own card, which removes a section AND
  removes the black.
- Section count cut from nine to five plus the door, by folding DiGi into How
  it works (it is step 2) and merging the child app, the road and "for you"
  into one "What else is included".

### 3. The icons
- `WorryIcon` redrawn in the Happy News hand: filled shapes, 2.5 black
  outline, a bright fill per worry from the house tokens, slight rotation.
  Same names, same call sites, so nothing else changes.

### 4. Their words reach the product
- Check in: already built (`seedBaselineConcerns` reads `challenge_other`,
  puts their row first, uses their exact words as the label). Verify only.
- DiGi: the free form worry is matched against scripts, moments and lessons
  with the retrieval that already exists (`lib/digi/script-match.ts`,
  `embeddings.ts`), so the first thing DiGi says about it is grounded.

### 5. The analytics page
- New founder only page `dashboard/admin/asks`: what parents are typing into
  Something else, grouped, most common first, so the next worries we add to
  the nine are chosen from data rather than guesses.

### 6. The 10 out of 10 gate
Two agents score the built page and do not stop until both give 10:
- a SaaS expert on parent facing subscription platforms (conversion, clarity,
  objection handling, trust before payment)
- a children's mental health specialist (is the framing accurate, does it
  avoid alarm, does it respect the child, is any claim overreaching)

Their findings drive edits, and the loop runs again until both are at 10.

## Guards
- `check-tokens` already fails on an undefined token.
- A new assertion that the catch all reaches the reveal: if `worryOther` is
  set, the reveal must render those words and not the string "Something else".
