-- 110: 13+ SOCIAL MEDIA LITERACY, four school lessons seeded as complete
-- teacher lessons. Modules 5, 6, 7 and 12 from the social-media-13plus set,
-- each a v3 slide deck (teacher script on every slide, phases and timings,
-- scenarios, diagrams, discussions, DiGi close), full teacher notes
-- (misconceptions, differentiation, paper fallback, worksheet), parent notes,
-- and DSL notes on the two mildly sensitive modules (5 bodies and filters,
-- 7 how people treat each other). Video beats are empty arrays until the
-- Higgsfield render pass. Insert only: on conflict (module_id) do nothing,
-- so this never clobbers hand edits. Dashboard safe: no DO blocks, every
-- content block dollar quoted with a unique tag.

-- Module 5: Bodies and filters
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-05-bodies-and-filters', 'Bodies and filters', 'KS4', 'Years 10 to 11', 'teacher',
  '{1,6}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'APA 2023, cutting back improves body image', 'I can explain why filtered and edited images set an impossible bar, and one thing I do about it.', 'Nova', 105,
  $sm5$[
 {
  "type": "title",
  "eyebrow": "KS4 · Years 10 to 11 · Module 5",
  "title": "Bodies and filters",
  "body": "One hour on the gap between the faces you scroll past and any real face, and why closing that gap starts with knowing it is there.",
  "script": "Set the ground rules before this slide is even up: we talk about images and how they are made, never about anyone in this room, and no comments on appearance, ours or anyone else. Then the opener. Has anyone ever looked at a face on their feed and felt a bit rubbish about their own? No hands needed, just a nod. Today we find out why that happens, and that it is not a fault in you.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can explain why filtered and edited images set an impossible bar, and one thing I do about it.",
  "why": "Most of the faces and bodies you scroll past are edited, filtered, angled and posed, and a lot of it is filtered live so you never see the before. When you measure your real self against images no real body matches, that gap is where the harm sits. Once you can see the edit, the perfect photo loses its power over you.",
  "gains": [
   "Explain the reality gap between edited images and real bodies",
   "Name the filter trap and why it catches people",
   "Say the one proven move that actually helps, cutting back",
   "Know where to go if worry about your body or eating gets heavy"
  ],
  "script": "Read the mission and the why out loud. Then the calm framing: this is not delete everything, and it is not a lecture about self esteem. It is one skill, seeing what you are actually looking at, plus one move that research says works. Keep the tone steady and warm throughout, this topic is tender for some pupils.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Squad words for today",
  "words": [
   {
    "word": "the reality gap",
    "meaning": "The space between an edited image and a real body. It is where body worry grows, because nobody real can match the edit."
   },
   {
    "word": "the filter trap",
    "meaning": "Starting to prefer your filtered face to your real one, and forgetting everyone else is filtered too."
   },
   {
    "word": "edited",
    "meaning": "Changed before posting. Smoothed, reshaped, angled, lit and posed, often filtered live so the before is never shown."
   },
   {
    "word": "body image",
    "meaning": "How you feel about your own body. Appearance content on a feed can push it up or down."
   }
  ],
  "script": "Say each word, class repeats it back. The reality gap is the anchor idea, so land it hardest: you are comparing your real, moving, three dimensional face to a still, filtered, best angle image. That comparison was never fair. The filter trap is the sneaky one, because filters are genuinely fun, so nobody expects them to be the problem.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Recall from last time. We said your feed is a highlight reel. What does that actually mean?",
  "options": [
   {
    "text": "People mostly post their best five seconds, so a feed is the peaks, not the whole of anyone life",
    "correct": true,
    "feedback": "Exactly. The highlight reel. Today we go one layer deeper, because the peaks are not just carefully chosen, they are often edited too."
   },
   {
    "text": "Everything you see on a feed is completely fake and made up",
    "correct": false,
    "feedback": "Not quite. Most of it is real moments, just the best ones, carefully chosen and often polished. Real, but not the full picture."
   },
   {
    "text": "A feed shows you an honest, balanced view of everyone day",
    "correct": false,
    "feedback": "The opposite. A feed is the peaks, the wins, the good angles. Almost nobody posts the flat, ordinary, average bits, which is most of real life."
   }
  ],
  "script": "Retrieval from the highlight reel lesson, thirty seconds of thinking before hands go up. Cold call two pupils for the reasoning. The point to land: if a feed is already the peaks, today we find out the peaks are frequently edited on top, which stacks the reality gap even higher.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🪞",
  "heading": "The reality gap",
  "body": "A huge share of what you scroll past is edited, filtered, angled, lit and posed, and a lot of it is filtered in real time so you never see the before. Your own face is real, moving, three dimensional, seen from every angle. Theirs is a still, filtered, best angle image. When you measure one against the other, the gap between them is exactly where you start to feel bad. It is not that your face is wrong. It is that the comparison was never real.",
  "script": "Say the line slowly: you are comparing your real, moving face to a still, filtered image. Nobody real clears that bar, including the person who posted it. Ask the class to picture the same person before and after a filter, the difference is the gap. Do not use any real pupil as the example, keep it to made up images only.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🎭",
  "heading": "The filter trap",
  "body": "Filters can be fun, and that is completely fine. The trouble starts in two places. One, when you begin to prefer your filtered face to your real one, so mirrors start to feel wrong. Two, when you forget that everyone else is filtered too, so you assume their skin, their jaw, their shape are simply how they wake up. They usually are not. Knowing the filter is on, on their photos and yours, is what breaks the trap.",
  "script": "Two parts, say them one at a time. Part one is preferring the filtered self, part two is forgetting others are filtered. Ask which one pupils think catches more people. Keep it light and shame free, filters are not the villain here, forgetting they are on is the risk. No device demos of filters in the lesson, we are talking about the design, not trying it on each other.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "feed",
  "handle": "glow.daily",
  "avatar": "✨",
  "meta": "3h · Recommended for you",
  "text": "no makeup, no filter, just woke up like this 😌",
  "image": "🖼",
  "stats": "❤ 214K   ↻ 61K   💬 9.4K",
  "prompt": "Nova sees this, glances in the mirror and thinks something is wrong with my face. Slow it down: what has actually happened here, step by step?",
  "script": "Model the reframe out loud, the way the module worked example does. Gut reaction, my face does not look like that, something is wrong with mine. Now slow it down. Is this edited? Almost certainly, a filter smooths skin and reshapes a face in real time and it is on by default in many apps. Am I comparing my real moving face to a still filtered one? Yes. So the comparison was never real. Then land the hopeful part: when young people cut back on this kind of scrolling, researchers found their feelings about their weight and appearance actually improved, APA 2023. That is a lever the pupil holds.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "choice",
  "question": "Hinge question. You feel worse about your own face after scrolling. Which is the strongest, evidence backed thing you can actually do?",
  "options": [
   {
    "text": "Cut back on appearance content, because teens who did reported feeling better about how they look",
    "correct": true,
    "feedback": "Yes, and this one is proven, not a slogan. Cutting back on appearance content improved young people feelings about their weight and looks, APA 2023. Nothing about their bodies changed, only how much they fed the comparison."
   },
   {
    "text": "Get better at editing your own photos so they match",
    "correct": false,
    "feedback": "That feeds the reality gap rather than closing it. Now your real face is competing with your own edited one too, and the mirror feels worse, not better."
   },
   {
    "text": "Only compare yourself to people who look worse than you",
    "correct": false,
    "feedback": "Still comparing, just in a different direction, and it does not last. The move that research backs is cutting back on the appearance content altogether."
   }
  ],
  "script": "This is the hinge, so use it as a whole class gauge with A, B, C cards or devices. If most pick the first option, move on. If not, back to the worked example. The misconception to smash is that the answer is better editing or better comparison. It is neither. It is less appearance content, and that is the one with evidence under it.",
  "phase": "prove",
  "minutes": 3
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 3,
  "mode": "pairs",
  "seconds": 120,
  "prompt": "Three quick cards to name. One, someone prefers their filtered photos and feels uneasy in real mirrors. Two, someone assumes a friend edited pictures are just how they look, and feels worse. Three, someone feed keeps serving more and more content about dieting and bodies. For each, name it, the filter trap, the reality gap, or the feed pushing too far, and one move that takes control back.",
  "lookFor": "Pupils matching each card to the right idea and naming a real move: filters off sometimes, remembering the friend is filtered too, and for the third, telling a trusted adult and using not interested and report. The win for card three is naming help seeking calmly, not any detail.",
  "script": "Two minutes, pairs. Circulate and collect a good answer for each card. Take card three carefully and warmly: the move there includes telling a trusted adult and using the not interested and report tools, and that is a strong, sensible thing to do, not a big deal. Keep the whole thing calm, no personal disclosures invited."
 },
 {
  "type": "concept",
  "emoji": "🧭",
  "heading": "When the feed pushes too far",
  "body": "One more thing, said plainly and briefly. The algorithm does not only show you filtered selfies. If someone lingers on content about weight or dieting, it can start pushing more, sometimes content that dresses up an eating disorder as a lifestyle or a goal. That is not inspiration, it is a health risk. Knowing the feed can steer you there is exactly how you steer back out: use not interested, unfollow, and tell a trusted adult if it is getting heavy.",
  "script": "This is the sensitive strand, so keep it calm, brief and non graphic, no images, no how to, no detail. Name it, name that it is a health risk not a goal, and move straight to the move: not interested, unfollow, tell a trusted adult. Then signpost that the close of the lesson shows exactly where to go. Watch for any pupil this lands heavily for and follow up gently after.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "Reading the edit, and this one stays yours",
  "body": "On your own, and I am collecting the thinking, not anything personal. Write one honest, no names line about how edited images affect how you feel. Then choose one small move to try this week: turn beauty filters off sometimes so you get used to your real face, unfollow accounts that leave you feeling worse, follow a wider mix of real bodies and faces, or the proven one, cut back on appearance content for a bit and notice if you feel better. Ten minutes.",
  "script": "Hand out the sheet. Ten minutes. Make clear you collect the analysis, not personal detail, and nothing gets read aloud without permission. Support pupils get the three ideas visible and sentence starters. Stretch: why is the answer cutting back and curating rather than quitting, and why are filters not inherently bad. Point to the support slide coming next for anyone the task stirs up.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Exit check. Why does a flawless face on your feed set a bar nobody can meet?",
  "options": [
   {
    "text": "It is usually edited and filtered, so a real, moving, ordinary face is being measured against something that does not exist",
    "correct": true,
    "feedback": "That is the reality gap, said like someone who can see the filter now. The image is edited, so the comparison was never real, and cutting back on this content genuinely helps."
   },
   {
    "text": "Because some people are just naturally perfect and you are not",
    "correct": false,
    "feedback": "Look again. The faces you are comparing yourself to are mostly edited and filtered, often live. You are competing with an image no real face matches, theirs included."
   },
   {
    "text": "Because you have not learned to edit your own photos well enough yet",
    "correct": false,
    "feedback": "Not this one. Better editing just deepens the reality gap. The bar is impossible because the images are edited, so the honest move is to cut back on them."
   }
  ],
  "script": "Silent, independent exit check, this is your evidence for the outcome. A pupil who picks the first option and can say the reality gap has met the objective. Anyone still on natural perfection needs the reality gap concept again, the back button works. Collect the printed quiz in.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Nova",
  "text": "The faces on my feed are edited, so that bar was never real. I can cut back, and it genuinely helps!",
  "script": "Whole class, twice, warmer the second time. This is the sentence worth carrying out of the room, so make it feel like a squad line, not a test answer. Keep it steady and kind, no jokey shame about anyone appearance.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "The reality gap: your real moving face against a still, filtered image is a comparison that was never fair.",
   "The filter trap: filters are fine, forgetting they are on, on your photos and everyone else, is the risk.",
   "The proven move is cutting back on appearance content, which improved young people feelings about how they look, APA 2023.",
   "If worry about your body or eating gets heavy, tell a trusted adult, or Childline on 0800 1111. For eating worries there is a charity called Beat."
  ],
  "script": "Read by pupils, one point each. Return to the entry answers on how much is real and enjoy the shift. End on the support routes, said as calmly and normally as the rest, so telling someone feels ordinary and safe, not dramatic. Confirm the Beat helpline details against their site before displaying any number.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi wraps it up",
  "lines": [
   "Squad, you saw the filter, and once you see it, it loses its grip. ⭐",
   "The faces on your feed are edited, so measuring your real self against them is a bar nobody can meet.",
   "Your mission this week: pick one small move, filters off sometimes, unfollow what stings, or cut back and notice how you feel.",
   "And if it ever gets heavy, you tell a trusted adult, Childline, or Beat. You are never meant to carry that on your own. Shine on."
  ],
  "script": "Let DiGi land the close, the bubbles appear on their own. While it plays, pupils write their one small move on the exit card. Keep the support routes visible as they leave. Follow up privately with any pupil the sensitive strand seemed to touch.",
  "phase": "close",
  "minutes": 2
 }
]$sm5$::jsonb,
  '[]'::jsonb,
  $sm5${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 1,
  "auto_marked": true
 },
 "teacher_judgement": {
  "scale": [
   "working_towards",
   "met",
   "exceeded"
  ],
  "one_tap": true,
  "default": "met"
 },
 "action_commitment": {
  "captured": true,
  "revisited_next_lesson": true
 }
}$sm5$::jsonb,
  $sm5${
 "headline": "What we taught today, and one gentle thing to try at home",
 "taught": "Today your child learned that most of the faces and bodies they scroll past are edited and filtered, often live, so comparing a real self to them is a bar nobody can meet. We named the filter trap, and we shared a hopeful, proven fact: when young people cut back on appearance content, their feelings about their weight and looks improved.",
 "try_this": "Look at a few posts together, lightly, with no comments about anyone body including your own. Point at a too perfect image and wonder aloud how much of it is a filter. Agree one small thing together, filters off sometimes, unfollowing accounts that sting, or a quiet cut back to test the effect.",
 "family_question": "If you ever felt bad about your body or about eating, who is the person you would tell, and do they know that is their job?",
 "no_login_required": true
}$sm5$::jsonb,
  $sm5${
 "learning_objective": "Pupils can explain why filtered and edited images set an impossible bar (the reality gap) and name one evidence backed move, cutting back on appearance content.",
 "timing": "55 minutes: starter 8, cycle one (the reality gap and filter trap) 9, worked example 4, hinge 3, guided practice 3, sensitive strand 2, independent practice 10, prove 2, close 5",
 "misconceptions": [
  "The perfect faces I see are simply real (most are edited, filtered, angled and posed, often filtered live so the before is never shown)",
  "The fix is to get better at editing my own photos (that deepens the reality gap: the proven move is cutting back on appearance content, APA 2023)",
  "This lesson is saying delete social media and that filters are bad (it is not: filters can be fun, and the message is know the edit and cut back when it stings, a Goldilocks stance, not abstinence)"
 ],
 "differentiation": {
  "support": "The three ideas stay visible on cards, pairs get sentence starters, and the sensitive strand is kept to naming and help seeking only. Scenario cards can be matched with counters rather than written up.",
  "stretch": "Discuss why the answer is cutting back and curating rather than quitting (Przybylski Goldilocks), and why filters are not inherently bad, so the lesson never tips into shame or abstinence."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Draw the reality gap as two faces on the board, one real and moving, one still and filtered, and talk through the space between them. Read the made up post aloud and model the reframe. Choice slides become read aloud questions with corner voting. The independent task is already paper. The support slide is printed and given as a takeaway.",
 "keywords": [
  {
   "word": "the reality gap",
   "definition": "The space between an edited image and a real body. It is where body worry grows, because nobody real can match the edit."
  },
  {
   "word": "the filter trap",
   "definition": "Starting to prefer your filtered face to your real one, and forgetting everyone else is filtered too."
  },
  {
   "word": "edited",
   "definition": "Changed before posting. Smoothed, reshaped, angled, lit and posed, often filtered live so the before is never shown."
  },
  {
   "word": "body image",
   "definition": "How you feel about your own body. Appearance content on a feed can push it up or down."
  }
 ],
 "tool": {
  "heading": "See the edit, cut back when it stings",
  "lines": [
   "The image is edited",
   "The comparison was never real",
   "Cutting back genuinely helps"
  ],
  "strapline": "The faces on my feed are edited, so that bar was never real, and cutting back genuinely helps."
 },
 "worksheet": {
  "title": "Reading the edit",
  "directions": "For each scenario, name what is going on, the reality gap, the filter trap, or the feed pushing too far, then name one move that takes control back.",
  "verdict_options": [
   "The reality gap",
   "The filter trap",
   "The feed pushing too far"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "Someone starts to prefer their filtered photos and feels uneasy looking in a real mirror.",
   "expected_verdict": "The filter trap",
   "teaching_point": "Preferring the filtered self is part one of the filter trap. The move is turning filters off sometimes so the real face stops feeling wrong."
  },
  {
   "n": 2,
   "item": "A person assumes a friend edited pictures are just how they naturally look, and feels worse by comparison.",
   "expected_verdict": "The reality gap",
   "teaching_point": "Forgetting others are filtered too is the reality gap in action. The move is remembering the filter is on their photos as well, so the comparison was never fair."
  },
  {
   "n": 3,
   "item": "Someone feed keeps serving more and more content about dieting and bodies until it feels heavy.",
   "expected_verdict": "The feed pushing too far",
   "teaching_point": "The calm, important one. Name it as a health risk not a goal, and the move is not interested, unfollow, and tell a trusted adult. No detail, just the help route."
  },
  {
   "n": 4,
   "item": "A flawless close up gets thousands of likes and the caption says no filter, just woke up like this.",
   "expected_verdict": "The reality gap",
   "teaching_point": "The caption is part of the edit. A best angle, best light, often live filtered image is still a still image competing with a real moving face. The bar is impossible by design."
  }
 ],
 "commitment_stem": "My move this week: when appearance content leaves me feeling worse, I will..."
}$sm5$::jsonb,
  $sm5${
 "required": true,
 "note": "This is a mildly sensitive module: body image and eating content can touch pupils personally. Before teaching, know your school referral route and who the DSL is, and brief them. Set the ground rules first, we talk about images not bodies in this room. Keep the eating strand calm, brief and non graphic, with no how to detail, and pair it with help seeking every time. Watch for disclosures during or after the lesson, in independent work or quietly at the end, about body distress or disordered eating. Do not probe, do not promise secrecy, follow the school safeguarding process the same day, and make sure the support slide, trusted adult, Childline 0800 1111 and Beat, is visible and given as a takeaway. Confirm the Beat helpline number and hours against Beat website before displaying it.",
 "concern_form_linked": true
}$sm5$::jsonb
)
on conflict (module_id) do nothing;

-- Module 6: Influencers and the sell
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-06-influencers-and-the-sell', 'Influencers and the sell', 'KS4', 'Years 10 to 11', 'teacher',
  '{5,8}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'PMC review, disclosing influencer marketing to children', 'I can explain why a creator I feel close to can still be selling to me, and one thing I do before I buy.', 'Nova', 106,
  $sm6$[
 {
  "type": "title",
  "eyebrow": "KS4 · Years 10 to 11 · Module 6",
  "title": "Influencers and the sell",
  "body": "One hour on why a creator you feel you know can still be selling to you, and how to see the advert when it has a friendly face.",
  "script": "Opener while the title is up. Think of a creator you watch most days. You know their voice, their room, how their week went. It feels a bit like a friend. Hold that feeling, because today we find out how that exact feeling gets used, and how to spot it without giving up the creators you love.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can explain why a creator I feel close to can still be selling to me, and one thing I do before I buy.",
  "why": "You can feel like you know a creator who has no idea you exist. That closeness is real and normal, and it is also exactly what makes their selling work, because a bond quietly softens your guard. Seeing the bond and the business behind it turns a recommendation back into what it is, an advert.",
  "gains": [
   "Name the one sided bond and why it is not a weakness",
   "Spot the paid recommendation dressed as a friend tip",
   "Explain why an ad label protects you less than it looks",
   "Have one habit you use before buying anything from a feed"
  ],
  "script": "Read the mission and the why. Then set the balance early: this is not delete every creator you follow. Following people you enjoy is completely fine. The skill is seeing the advert when the advert has a friendly face. Keep it non judgemental, nobody is silly for feeling close to a creator.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Squad words for today",
  "words": [
   {
    "word": "one sided bond",
    "meaning": "The parasocial relationship: you feel you know a creator you watch a lot, and they do not know you back. Normal, not a weakness."
   },
   {
    "word": "influencer marketing",
    "meaning": "A creator being paid to feature a product, so a recommendation is an advert wearing the clothes of a friend tip."
   },
   {
    "word": "disclosure",
    "meaning": "The label an advert is supposed to carry, ad or paid partnership. Meant to protect you, but easy to miss."
   },
   {
    "word": "the pull to want more",
    "meaning": "A feed of new clothes, gadgets and lifestyles quietly raises what you think you need. Researchers link it to materialism."
   }
  ],
  "script": "Say each word, class repeats it. The one sided bond is the anchor, so take any embarrassment out of it now: everyone gets it, it is how brains work with faces we see daily. Disclosure is the one to watch, because pupils assume a label keeps them safe, and today we find out it barely lands when the bond is strong.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Recall from last time. We looked at how the feed holds your attention. Name one way an app is designed to keep you watching longer than you meant to.",
  "options": [
   {
    "text": "Autoplay and an endless feed, so the next video starts before you get a moment to stop",
    "correct": true,
    "feedback": "Spot on. No natural ending, so no natural stop. Today we follow the money one step further, to the people inside that feed who are selling to you."
   },
   {
    "text": "The app politely asks you every few minutes whether you would like to stop",
    "correct": false,
    "feedback": "The opposite. The design removes the stopping points, autoplay and the endless feed, so you keep going without deciding to. That is what today builds on."
   },
   {
    "text": "The feed shows you boring content so you log off quickly",
    "correct": false,
    "feedback": "No app wants you to log off. It serves whatever keeps you watching and removes the natural endings. Now we meet the selling that rides on all that attention."
   }
  ],
  "script": "Retrieval from the attention lesson, thirty seconds thinking then hands. Cold call two pupils for the reasoning. The bridge to land: last time was how the feed keeps you watching, today is who is selling to you inside it, and why a friendly face makes the sell land harder.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🤝",
  "heading": "The one sided bond",
  "body": "When you watch someone daily, you start to feel you know them, their voice, their room, their week. That feeling has a name, a parasocial relationship, a one sided bond. You feel close, they do not know you exist. It is normal, everyone gets it, and it is not a weakness. But here is the catch: when someone you feel close to sells you something, your guard drops without you noticing. Closeness plus selling is a strong mix.",
  "script": "Kill any embarrassment first, this bond is how human brains work with faces we see every day, footballers, singers, streamers, all of it. Then the key line: closeness plus selling is a strong mix. Ask the class why they think a tip from someone you feel you know lands harder than the same tip from a stranger. Take two answers, they usually get there themselves.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🏷",
  "heading": "The paid recommendation",
  "body": "Creators are often paid to feature a product. That is influencer marketing, and a paid recommendation is an advert wearing the clothes of a friend tip. Adverts are supposed to be labelled, ad or paid partnership. Here is the problem research found: when the bond is strong, the label barely registers, and your radar for spotting persuasion is still developing at this age. So the disclosure does not protect you as much as it looks like it should. The label is not your shield. You are.",
  "script": "Land the PMC finding plainly and without invented numbers: a strong bond can neutralise a disclosure, so the young viewer stays open to persuasion, and persuasion knowledge is still developing at this age. The line to say twice: the label is not your shield, you are. Ask the class where they usually see the ad tag, top corner, tiny, grey, and why that placement matters.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "feed",
  "handle": "mornings.with.mia",
  "avatar": "🌅",
  "meta": "1h · Paid partnership",
  "text": "honestly obsessed with this water bottle, been using it all week, link in my bio if you want one 💧",
  "image": "🍶",
  "stats": "❤ 88.1K   ↻ 12K   💬 3.9K",
  "prompt": "A creator you have watched every morning for a year holds up a bottle mid story. Pull it apart: where is the bond, where is the sell, where is the label, and where is the nudge to want it?",
  "script": "Model it aloud like the module worked example. First the bond, I trust her because I feel I know her, that is idea one doing its job. Second the label, paid partnership tucked at the top, disclosed but easy to miss and easy to forgive because I like her. Third the nudge, by the end I sort of want the bottle, not because I need water differently, wanting has just been raised. The point to land: nobody did anything foolish, a real bond, a real advert and a small nudge all did their job at once. Naming them as they happen is the whole skill.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "choice",
  "question": "Hinge question. A creator you have followed for years shows a skincare product with a small paid partnership tag. Why does research say that tag protects you less than it should?",
  "options": [
   {
    "text": "Because the strong bond you feel makes the label barely register, so the persuasion still lands",
    "correct": true,
    "feedback": "That is the PMC finding, said clearly. The closer you feel, the less the label lands, and your persuasion radar is still developing at this age. The label is not your shield, you are."
   },
   {
    "text": "Because the tag is probably fake and put there to trick you",
    "correct": false,
    "feedback": "The tag is usually real, that is the strange part. The problem is not a fake label, it is that a real one barely registers when you feel close to the creator."
   },
   {
    "text": "Because skincare is not really advertising",
    "correct": false,
    "feedback": "A paid recommendation is advertising, skincare included. The reason the tag is weak is the bond, not the product, it makes the honest label sail straight past you."
   }
  ],
  "script": "The hinge, whole class with A, B, C cards or devices. If most pick the first option, move on. If not, back to the paid recommendation slide. The misconception to break is that the label is either fake or enough. It is real, and it is weak, because the bond does the work the label cannot.",
  "phase": "prove",
  "minutes": 3
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 3,
  "mode": "pairs",
  "seconds": 120,
  "prompt": "Three scenario cards. One, a favourite gamer who just loves an energy drink that turns out to be a sponsor. Two, a haul video that leaves someone feeling their own clothes are not enough. Three, a my honest review that is actually a paid partnership. For each, name what is really going on, the bond, the sell, the nudge or the missable label, and one move that takes control back.",
  "lookFor": "Pupils naming the mechanism and a countermove: spot and say advert, wait before buying, and the strong one, would I want this if a stranger held it up. Card two should surface the pull to want more, the haul raising what feels normal to own.",
  "script": "Two minutes, pairs, take the first card with them if they need the model. Circulate and grab the best countermove for each. The stranger question is the keeper, so land it: would I still want this if a total stranger held it up? If not, it was the bond talking, not the thing."
 },
 {
  "type": "concept",
  "emoji": "🛒",
  "heading": "The pull to want more, and the honest balance",
  "body": "A feed of new clothes, gadgets and lifestyles quietly raises what you think you need, which researchers link to materialism and a low grade pressure to buy. But here is the honest balance: following creators is not the problem, and a lot of it is genuinely good, learning, community, laughs, inspiration. The skill is not deleting everyone. It is seeing the sell when it arrives, so the choice to buy stays yours and not the bond talking.",
  "script": "This is the calibration slide, so resist making influencers the villain. Ask for hands, who has learned something genuinely useful from a creator, take two and celebrate them. Then the line: following creators you enjoy is fine, the skill is knowing an advert when it has a friendly face. Keep it Goldilocks, not abstinence.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "Reading the sell, in your own feed",
  "body": "On your own, no names needed. Pick one real recommendation you have seen from a creator. Write a short reading the sell account: was it disclosed, how strong is the bond you feel with that creator, and what is one habit you will use before buying something a creator shows you, a rule like wait a day, spot and say advert, or ask what problem this actually solves for me. Ten minutes. I am collecting the analysis, not your shopping.",
  "script": "Hand out the sheet, ten minutes. Support pupils get the four ideas visible and sentence starters. Stretch: why is disclosure still worth having even though it is weak, and where is following creators genuinely positive. Circulate and grab one sharp before buying habit to read out. Make clear no personal spending has to be shared.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Exit check. Why can a creator you feel close to still be selling to you without it feeling like an advert?",
  "options": [
   {
    "text": "The one sided bond softens your guard, so a paid recommendation lands like a friend tip and the ad label barely registers",
    "correct": true,
    "feedback": "That is it, said like someone who can see the sell now. The bond is not a bug in the plan, it is the plan. Knowing that puts the choice to buy back in your hands."
   },
   {
    "text": "Because creators never actually get paid, they just share things they love",
    "correct": false,
    "feedback": "A lot of it is paid promotion, disclosed or not. The reason it does not feel like an advert is the bond, which makes a paid tip land like a friend one."
   },
   {
    "text": "Because the ad label is always hidden illegally",
    "correct": false,
    "feedback": "The label is usually there and legal. The point is it barely registers when you feel close to the creator. The bond does the persuading, not a hidden label."
   }
  ],
  "script": "Silent, independent exit check, your evidence for the outcome. A pupil who picks the first option and can name the bond has met the objective. Anyone who thinks creators are never paid needs the paid recommendation slide again. Collect the printed quiz in.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Nova",
  "text": "A creator I feel close to can still be selling to me. Would I want this if a stranger held it up?",
  "script": "Whole class, twice, the second time landing the stranger question like a tool they can reach for. This is the sentence worth repeating at the shops tonight, so make it feel like a squad move, not a test answer.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "The one sided bond is real and normal, and it quietly softens your guard when a creator sells to you.",
   "A paid recommendation is an advert wearing the clothes of a friend tip.",
   "The ad label protects you less than it looks, because a strong bond makes it barely register.",
   "Keep the creators you love. The move is the stranger question before you buy, would I want this if a stranger held it up."
  ],
  "script": "Read by pupils, one point each. Return to the entry answers on how creators make money and enjoy the shift. Finish on the balance, not the alarm: following creators is fine, seeing the advert is the skill. Name the support line quietly for anyone left feeling low about what they have.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi wraps it up",
  "lines": [
   "Squad, you can see the advert now, even when it smiles at you. ⭐",
   "The bond is real, and it is also the plan. A creator you feel close to can still be selling to you.",
   "Your mission this week: next time a creator shows a product, say advert out loud and ask, would I want this from a stranger?",
   "Keep the creators you love. Just keep the choice to buy in your own hands. See you next mission!"
  ],
  "script": "Let DiGi land the close, the bubbles appear on their own. While it plays, pupils write their before buying habit on the exit card. Exit quizzes collected as they leave.",
  "phase": "close",
  "minutes": 2
 }
]$sm6$::jsonb,
  '[]'::jsonb,
  $sm6${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 1,
  "auto_marked": true
 },
 "teacher_judgement": {
  "scale": [
   "working_towards",
   "met",
   "exceeded"
  ],
  "one_tap": true,
  "default": "met"
 },
 "action_commitment": {
  "captured": true,
  "revisited_next_lesson": true
 }
}$sm6$::jsonb,
  $sm6${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned about the one sided bond, feeling close to a creator who does not know they exist, and why that closeness is exactly what makes influencer selling work. They saw that a paid recommendation is an advert with a friendly face, and that an ad label protects less than it looks because a strong bond makes it barely register.",
 "try_this": "Watch one video together with a creator your child likes, and let them be the expert. Ask why they like them, then gently how they think the creator makes their money. Next time a product appears, spot the ad tag together as a team, and try one question out loud, would we want this if a stranger held it up.",
 "family_question": "Who is a creator you feel like you know, and how do you think they actually make their money?",
 "no_login_required": true
}$sm6$::jsonb,
  $sm6${
 "learning_objective": "Pupils can explain why a creator they feel close to can still be selling to them (the one sided bond softens the guard and weakens the ad label) and name one habit they use before buying.",
 "timing": "55 minutes: starter 8, cycle one (the one sided bond and the paid recommendation) 6, worked example 4, hinge 3, guided practice 3, calibration 2, independent practice 10, prove 2, close 5",
 "misconceptions": [
  "Creators just share things they love, they are not really being paid (a lot is paid promotion, and a paid recommendation is an advert)",
  "The ad label keeps me safe (research finds a strong bond makes the label barely register, and persuasion knowledge is still developing at this age)",
  "This lesson is saying influencers are bad and I should unfollow everyone (it is not: following creators is fine, the skill is seeing the sell so the choice to buy stays yours)"
 ],
 "differentiation": {
  "support": "The four idea cards stay visible, pairs get sentence starters, and the scenario cards can be sorted rather than written up. Model the first scenario fully before pairs take the rest.",
  "stretch": "Ask why disclosure is still worth having even though it is weak, and where following creators is genuinely positive, learning, community, inspiration, so the lesson never tips into influencers are bad."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Draw the one sided bond as a line that only goes one way. Read the mocked post aloud and call out the bond, the label and the nudge as you go. Choice slides become read aloud questions with corner voting. The independent task is already paper. The stranger question printed as a bookmark for tables.",
 "keywords": [
  {
   "word": "one sided bond",
   "definition": "The parasocial relationship: you feel you know a creator you watch a lot, and they do not know you back. Normal, not a weakness."
  },
  {
   "word": "influencer marketing",
   "definition": "A creator being paid to feature a product, so a recommendation is an advert wearing the clothes of a friend tip."
  },
  {
   "word": "disclosure",
   "definition": "The label an advert is supposed to carry, ad or paid partnership. Meant to protect you, but easy to miss when the bond is strong."
  },
  {
   "word": "the pull to want more",
   "definition": "A feed of new clothes, gadgets and lifestyles quietly raises what you think you need. Researchers link it to materialism."
  }
 ],
 "tool": {
  "heading": "The stranger question",
  "lines": [
   "Spot the sell",
   "Say advert out loud",
   "Would I want this from a stranger?"
  ],
  "strapline": "A creator I feel close to can still be selling to me, so I ask, would I want this from a stranger?"
 },
 "worksheet": {
  "title": "Reading the sell",
  "directions": "For each scenario, name what is really going on, the bond, the paid recommendation, the pull to want more, or the missable label, then name one move that takes control back.",
  "verdict_options": [
   "The one sided bond",
   "The paid recommendation",
   "The pull to want more",
   "The missable label"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "A favourite gamer says they just love an energy drink, and it turns out the brand is a sponsor.",
   "expected_verdict": "The paid recommendation",
   "teaching_point": "A paid recommendation dressed as a personal favourite. The move is spot and say advert, then ask whether the enthusiasm survives the stranger question."
  },
  {
   "n": 2,
   "item": "A haul video of loads of new clothes leaves someone feeling their own wardrobe is not enough.",
   "expected_verdict": "The pull to want more",
   "teaching_point": "The feed quietly raising what feels normal to own, linked to materialism. The move is naming the pull and waiting a day before buying anything it stirred up."
  },
  {
   "n": 3,
   "item": "A creator posts my honest review, which is actually a paid partnership with a tiny grey tag.",
   "expected_verdict": "The missable label",
   "teaching_point": "The label is real but barely registers because of the bond. The move is looking for the tag on purpose and treating a paid review as an advert, not a neutral opinion."
  },
  {
   "n": 4,
   "item": "Someone says a creator they have watched for years would never sell them anything rubbish, they are basically mates.",
   "expected_verdict": "The one sided bond",
   "teaching_point": "The bond talking. It is real and normal, and it is also the plan. Strong answers name that closeness softens the guard, and reach for the stranger question."
  }
 ],
 "commitment_stem": "My habit before buying: next time a creator shows me a product, I will..."
}$sm6$::jsonb,
  $sm6${
 "required": false
}$sm6$::jsonb
)
on conflict (module_id) do nothing;

-- Module 7: How people treat each other
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-07-how-people-treat-each-other', 'How people treat each other', 'KS3', 'Years 7 to 9', 'teacher',
  '{4,2}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'Anti Bullying Alliance and Internet Matters', 'I can name the ways people can be treated badly online, and the tools I use to protect myself or a friend.', 'Orbit', 107,
  $sm7$[
 {
  "type": "title",
  "eyebrow": "KS3 · Years 7 to 9 · Module 7",
  "title": "How people treat each other",
  "body": "One hour on how a group can turn online, why it follows you home, and the toolkit that means you never handle it alone.",
  "script": "Set the ground rules before the title is up: we talk about the scenarios and the tools, not real incidents or real people in this room, no naming, no reliving fallouts. Then the calm opener. A fallout at school stays at school, you go home and it is quiet. Online is different, it comes with you. Today is about the tools for exactly that, so we open on what you can do, not on the threat.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can name the ways people can be treated badly online, and the tools I use to protect myself or a friend.",
  "why": "Being got at online is different from a fallout in the corridor, because it follows you home, onto the phone in your hand, so there is no natural moment where it stops. That is why it can weigh heavily. Knowing the shapes it takes, and knowing your tools before you need them, means it does not have to swallow you.",
  "gains": [
   "Name the shapes online unkindness takes, from pile ons to leaked screenshots",
   "Use the four tools in order: keep evidence, block, report, tell someone",
   "Explain why telling an adult is the strongest move, not snitching",
   "Know the help routes: a trusted adult, Childline, the school anti bullying route"
  ],
  "script": "Read the mission and the why. Land the frame that this is a kit, not a warning. Most of your time online is fine, we name the hard bits so you are ready, not afraid. Keep the whole lesson calm and agency first, and remember the close names help clearly.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Squad words for today",
  "words": [
   {
    "word": "pile on",
    "meaning": "A group chat or comment section where many people turn on one person at once, so it feels like everyone."
   },
   {
    "word": "exclusion",
    "meaning": "Being cut out on purpose, removed from a chat or kicked from a game. It counts as bullying because it strikes at belonging."
   },
   {
    "word": "cyberbullying",
    "meaning": "Cruel messages, fake accounts set up to get at someone, or rumours spread to damage them."
   },
   {
    "word": "the leaked screenshot",
    "meaning": "Something said in private copied out and passed around, so a private moment goes public."
   }
  ],
  "script": "Say each word, class repeats it. Naming these takes their power to confuse. Land exclusion carefully, lots of pupils think it does not count because nobody said anything cruel, but the Anti Bullying Alliance treats it as real bullying because being left out on purpose hits the deep need to belong.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Quick recall. Name one tool a phone or app gives you to protect yourself when someone is being unkind.",
  "options": [
   {
    "text": "Block and report, so you cut off the account and flag the post to the app",
    "correct": true,
    "feedback": "Yes. Block and report are two of your four tools. Today we add keep evidence and tell someone, and we learn the order to use them in."
   },
   {
    "text": "There is nothing you can do, you just have to put up with it",
    "correct": false,
    "feedback": "Not true, and it is the trap the whole lesson breaks. You have real tools, block, report, keep evidence and tell someone, and using them early keeps a small thing small."
   },
   {
    "text": "Reply with something worse so they stop",
    "correct": false,
    "feedback": "Firing back feeds it and pulls you into it. The tools are block, report, keep evidence and tell someone, calm beats fast every time."
   }
  ],
  "script": "Retrieval, thirty seconds then hands. This opens on agency by design, so celebrate every real tool named. The bridge: you already know some of the kit, today we complete it and put it in order, and we learn why the last tool, telling someone, is the strongest of all.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🌐",
  "heading": "The shapes it takes",
  "body": "It shows up in a few ways, and naming them helps. A pile on, when many people turn on one person at once so it feels like everyone. Cyberbullying in its plain forms, cruel messages, fake accounts, rumours spread on purpose. Exclusion, being removed from a chat or kicked from a game on purpose, which counts because it strikes at belonging. Public shaming, a mistake held up for a crowd. And the leaked screenshot, something private copied out and passed around. This is not most of your time online. We name it so you are ready.",
  "script": "Reveal the shapes calmly, one at a time. Attribute the evidence plainly: the Anti Bullying Alliance and Internet Matters find this can follow a child home and cause lasting harm, that exclusion strikes at belonging, and that girls are more often targeted. Keep general, no invented statistics, and keep the tone steady, this is equipment not a horror story.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "diagram",
  "heading": "The four tools, in order",
  "caption": "When it happens, this is the sequence. Say it with me: do not react, keep evidence, block and report, tell someone.",
  "steps": [
   {
    "emoji": "✋",
    "title": "Do not react",
    "text": "Firing back just feeds it. Calm first, because the calm move is the strong one."
   },
   {
    "emoji": "📸",
    "title": "Keep evidence",
    "text": "Screenshot what is there, times and names, before anything gets deleted."
   },
   {
    "emoji": "🚫",
    "title": "Block and report",
    "text": "Use the app own buttons to cut off the account and flag the post."
   },
   {
    "emoji": "🗣",
    "title": "Tell someone",
    "text": "A trusted adult. Handling it alone is the trap, so this step is the strongest one."
   }
  ],
  "script": "Walk the sequence as it builds, then chant it twice as a class: do not react, keep evidence, block and report, tell someone. This diagram is the spine of the lesson, so do not rush it. The point to land: calm and in sequence beats fast and angry every time, and the last step is the one that changes everything.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "message",
  "handle": "Year 9 group chat",
  "avatar": "💬",
  "meta": "Class chat · 20:41",
  "text": "someone just posted a screenshot of a private message Priya sent, and now everyone is piling in with laughing reactions",
  "image": "📱",
  "prompt": "Use the four tools to handle this calmly, in order. What is the first move, and why is firing back the wrong one?",
  "script": "Model it aloud the way the module worked example does. If that were me, first move, I do not fire back, that just feeds it. Second, keep evidence, screenshot what is there before it is deleted, times and names. Third, block the worst account and report the post to the app. Fourth, tell a trusted adult, because handling it alone is the trap. Notice the order: protect myself, keep proof, use the tools, tell someone. Calm and in sequence beats fast and angry.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "Hinge question. Someone is spreading a rumour about a friend in a group chat and it is getting worse. What is the strongest first move?",
  "options": [
   {
    "text": "Keep evidence, then block, report and tell a trusted adult",
    "correct": true,
    "feedback": "That is the sequence. Calm, in order, and it ends with telling someone so you are not carrying it alone. That last step is the strongest one there is."
   },
   {
    "text": "Screenshot it and reply with your own insult",
    "correct": false,
    "feedback": "The screenshot is right, the insult is not. Firing back feeds it and pulls you in. Keep the evidence, then block, report and tell someone."
   },
   {
    "text": "Leave the chat and say nothing to anyone",
    "correct": false,
    "feedback": "Leaving quietly lets it grow and leaves your friend alone with it. Keep evidence, block, report, and crucially tell a trusted adult. Silence is what it counts on."
   }
  ],
  "script": "The hinge, whole class with A, B, C cards or devices. If most pick the first option, move on. If not, back to the four tools diagram. The misconception to break is that saying nothing is safest. It is not, telling someone is the move the whole lesson builds to.",
  "phase": "prove",
  "minutes": 3
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 3,
  "mode": "pairs",
  "seconds": 120,
  "prompt": "Three scenario cards. One, someone quietly removed from the group chat before a party. Two, a fake account set up in a classmate name. Three, a private screenshot passed around to shame someone. For each, name what is happening, exclusion, a fake account, a leaked screenshot, and name the tools you would use in order.",
  "lookFor": "Pupils naming the shape correctly and running the sequence, keep evidence, block, report, tell. Card one is the test of whether they now see exclusion as real bullying rather than nothing happening.",
  "script": "Two minutes, pairs, take the first card with them if they need the model. Circulate. The card to watch is exclusion, check pupils treat being cut out on purpose as real, not as no big deal. Land every card on the same sequence, keep evidence, block, report, tell someone."
 },
 {
  "type": "concept",
  "emoji": "💪",
  "heading": "Telling someone is the strongest move",
  "body": "Here is the part that matters most. Telling an adult is not snitching and it is not weak. The people who get at others online are counting on you staying quiet and dealing with it alone. The moment you tell someone you trust, you stop carrying it by yourself, and that is the strongest move there is. Reporting to keep someone safe is not telling tales. It is the opposite of leaving a friend to face it alone.",
  "script": "This is the twist and the heart of the lesson, so land it firmly and warmly. Separate telling from telling tales: telling tales is to get someone in trouble, telling is to keep someone safe. The people doing the harm rely on silence, so breaking the silence is the power move, not the weak one. Watch for pupils this lands heavily for and follow up gently.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "If it happened, my plan, and this stays yours",
  "body": "On your own, no real names, keep it general. Write a short if it happened plan for a friend who came to you being targeted online. What would you tell them to do first? Which tools would you help them use, and in what order? And which adult in this school, or which service, would you point them to? Ten minutes. I am collecting the plan, not any real story.",
  "script": "Hand out the sheet, ten minutes. Framing it as helping a friend builds agency and keeps it safe, no pupil has to write about themselves. Support pupils get the four tools visible and sentence starters. Stretch: what can a bystander in a pile on do, and how do you tell reporting apart from telling tales. Circulate, and be ready for a quiet disclosure, follow the DSL note if one comes.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Exit check. Why can being treated badly online feel heavier than a fallout at school, and what is the answer to it?",
  "options": [
   {
    "text": "It follows you home with no natural stop, so the answer is the tools and telling someone, not carrying it alone",
    "correct": true,
    "feedback": "Exactly. No bell ends it, which is why you keep evidence, block, report and tell someone. It does not follow you around if you do not carry it alone."
   },
   {
    "text": "It feels heavier because you are being dramatic, so you should just log off",
    "correct": false,
    "feedback": "Not this one. It genuinely does not switch off on its own, it comes home with you. That is real, and the answer is the four tools and telling a trusted adult."
   },
   {
    "text": "It is heavier because there is nothing anyone can do about it",
    "correct": false,
    "feedback": "There is a lot you can do, that is the whole lesson. Keep evidence, block, report, tell someone. The heaviness comes from no natural stop, and the tools are the stop."
   }
  ],
  "script": "Silent, independent exit check, your evidence for the outcome. A pupil who picks the first option and can name the tools has met the objective. Anyone on just log off needs the twist slide again. Collect the printed quiz in.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Orbit",
  "text": "If people treat me or a friend badly online, I keep evidence, block, report and tell someone. I never carry it alone.",
  "script": "Whole class, twice, the second time firmer. This is the sentence worth carrying out of the room, so make it feel like a squad promise, not a test answer. Point at the four tools diagram as they say each step if you can.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "Online unkindness follows you home, so there is no natural moment where it stops. That is why it can feel so big.",
   "It takes shapes: pile ons, cyberbullying, exclusion on purpose, public shaming, leaked screenshots.",
   "The four tools, in order: do not react, keep evidence, block and report, tell someone.",
   "Telling a trusted adult is the strongest move, not snitching. Childline is on 0800 1111, and the school has an anti bullying route."
  ],
  "script": "Read by pupils, one point each. Return to the entry answers on why online feels heavier and enjoy the shift. Finish on the help routes, said as calmly as the rest: a trusted adult here, our named safeguarding lead, Childline on 0800 1111, and the school anti bullying route. You never have to handle it on your own.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi wraps it up",
  "lines": [
   "Squad, you built the toolkit, and now it is ready before you ever need it. ⭐",
   "It follows you home, but it does not have to swallow you. You have four tools and a trusted adult.",
   "Your mission this week: find the block and report buttons in your main app, and decide the one adult you would tell first.",
   "Telling someone is not weak, it is the strongest move there is. You are never meant to carry it alone. See you next mission!"
  ],
  "script": "Let DiGi land the close, the bubbles appear on their own. While it plays, pupils write their one adult and where the block and report buttons live on the exit card. Keep the Childline number and school route visible as they leave. Follow up privately with any pupil the lesson seemed to touch.",
  "phase": "close",
  "minutes": 2
 }
]$sm7$::jsonb,
  '[]'::jsonb,
  $sm7${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 1,
  "auto_marked": true
 },
 "teacher_judgement": {
  "scale": [
   "working_towards",
   "met",
   "exceeded"
  ],
  "one_tap": true,
  "default": "met"
 },
 "action_commitment": {
  "captured": true,
  "revisited_next_lesson": true
 }
}$sm7$::jsonb,
  $sm7${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned that being treated badly online is different from a playground fallout because it follows them home, and named the shapes it takes: pile ons, cyberbullying, exclusion, public shaming and leaked screenshots. They practised a calm sequence, keep evidence, block, report, tell someone, and learned that telling a trusted adult is the strongest move, not snitching.",
 "try_this": "Pick a quiet moment, not a crisis, and ask what they would do if someone was being got at in a group chat. Add the four moves together, keep evidence, block, report, tell someone. Walk through where the block and report buttons live in their main app so it is not new when they need it. Agree the deal is they tell you and you help, you do not confiscate.",
 "family_question": "If something happened to you or a friend online, who would you tell first, and what would you want me to do?",
 "no_login_required": true
}$sm7$::jsonb,
  $sm7${
 "learning_objective": "Pupils can name the forms of online harm (pile on, cyberbullying, exclusion, public shaming, leaked screenshot) and use the four tools in a sensible order: keep evidence, block, report, tell someone.",
 "timing": "55 minutes: starter 8, shapes and the four tools 11, worked example 3, hinge 3, guided practice 3, the twist 2, independent practice 10, prove 2, close 5",
 "misconceptions": [
  "Being left out on purpose does not count as bullying because nobody said anything cruel (exclusion counts, it strikes at belonging, per the Anti Bullying Alliance)",
  "Telling an adult is snitching and will only make it worse (telling to keep someone safe is not telling tales, and silence is what the harm relies on)",
  "There is nothing you can do so you just have to put up with it (you have four tools, and using them early keeps a small thing small)"
 ],
 "differentiation": {
  "support": "The five shape cards and the four step order stay visible, pairs get sentence starters, and scenario cards can be matched to the shape before the tools are added. Model the first scenario fully.",
  "stretch": "Ask what a bystander in a pile on can do, and how to tell reporting apart from telling tales, so agency extends to defending others, not just protecting yourself."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Draw the four tools as a numbered sequence on the board and have the class chant it. Read the scenarios aloud in character and run the votes with hands up. Choice slides become read aloud questions with corner voting. The independent plan is already paper. The help routes printed and given as a takeaway.",
 "keywords": [
  {
   "word": "pile on",
   "definition": "A group chat or comment section where many people turn on one person at once, so it feels like everyone."
  },
  {
   "word": "exclusion",
   "definition": "Being cut out on purpose, removed from a chat or kicked from a game. It counts as bullying because it strikes at belonging."
  },
  {
   "word": "cyberbullying",
   "definition": "Cruel messages, fake accounts set up to get at someone, or rumours spread to damage them."
  },
  {
   "word": "the leaked screenshot",
   "definition": "Something said in private copied out and passed around, so a private moment goes public."
  }
 ],
 "tool": {
  "heading": "The four tools, in order",
  "lines": [
   "Do not react",
   "Keep evidence",
   "Block and report",
   "Tell someone"
  ],
  "strapline": "Keep evidence, block, report and tell someone, so I never carry it alone."
 },
 "worksheet": {
  "title": "If it happened, my plan",
  "directions": "For each scenario, name what is happening, then list the tools you would use in order and the adult or service you would point a friend to.",
  "verdict_options": [
   "Exclusion",
   "A fake account",
   "A leaked screenshot",
   "A pile on"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "Someone is quietly removed from the group chat right before a party everyone else is talking about.",
   "expected_verdict": "Exclusion",
   "teaching_point": "Being cut out on purpose is real bullying because it strikes at belonging. The tools still apply, keep evidence, and the strong move is telling a trusted adult rather than pretending it does not matter."
  },
  {
   "n": 2,
   "item": "A fake account is set up in a classmate name and starts posting to embarrass them.",
   "expected_verdict": "A fake account",
   "teaching_point": "Keep evidence first, screenshot the account and posts, then report the fake account to the app and block it, and tell a trusted adult so the school can act."
  },
  {
   "n": 3,
   "item": "A private screenshot is passed around a chat to shame someone.",
   "expected_verdict": "A leaked screenshot",
   "teaching_point": "Do not forward it on, that spreads the harm. Keep evidence, report the post, block the worst accounts, and tell a trusted adult. Reporting to keep someone safe is not telling tales."
  },
  {
   "n": 4,
   "item": "A comment section turns on one person and dozens of people join in at once.",
   "expected_verdict": "A pile on",
   "teaching_point": "A pile on feels like everyone, but it is a handful amplified. Do not react, keep evidence, report and block, and tell someone. A bystander stepping in or reporting can break it."
  }
 ],
 "commitment_stem": "My plan: if someone is treated badly online, the first person I would tell is..."
}$sm7$::jsonb,
  $sm7${
 "required": true,
 "note": "This is a mildly sensitive module on bullying. Brief the DSL before teaching. The scenarios can surface real disclosures, that a pupil or a friend is being bullied online, or that a private image or message has been shared. Reassure first, you are not in trouble and you did the right thing telling me, do not promise secrecy, and do not ask a pupil to show you messages beyond what they volunteer. Follow the school safeguarding and anti bullying procedures the same day and log the concern. Signpost the trusted adult, Childline on 0800 1111 and the school anti bullying route as in the lesson close.",
 "concern_form_linked": true
}$sm7$::jsonb
)
on conflict (module_id) do nothing;

-- Module 12: Sleep, attention and the body
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-12-sleep-attention-and-the-body', 'Sleep, attention and the body', 'KS3', 'Years 7 to 9', 'teacher',
  '{6}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'Millennium Cohort Study, adolescent sleep', 'I can name how night time and constant use affect my sleep and attention, and one concrete move I make about it.', 'Orbit', 112,
  $sm12$[
 {
  "type": "title",
  "eyebrow": "KS3 · Years 7 to 9 · Module 12",
  "title": "Sleep, attention and the body",
  "body": "One hour on how the phone reaches into your sleep and your focus, mostly at night, and the couple of moves that take it back.",
  "script": "Opener while the title is up. It is late, you meant to sleep an hour ago, and the phone is right there on the pillow. Morning comes and you are flat and foggy. That is not you being lazy, that is the phone doing its job in the worst possible room. Today we find out why night is the pressure point, and the two moves that fix most of it.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can name how night time and constant use affect my sleep and attention, and one concrete move I make about it.",
  "why": "The phone does not just take your time, it reaches into your sleep and your focus, mostly at night and mostly without you noticing. A phone in the bedroom delays sleep, shortens it and breaks it up, and constant notifications train your brain toward distraction. This is not about willpower. It is about a couple of settings and where the phone sleeps.",
  "gains": [
   "Explain how a phone at night delays, shortens and fragments sleep",
   "Explain how constant switching trains the brain toward distraction",
   "Name why night is the pressure point, not phones in general",
   "Choose one concrete move: phone out of the bedroom, or notifications off at night"
  ],
  "script": "Read the mission and the why. Set the Goldilocks frame early: this is not give up your phone, moderate daytime use is genuinely fine. It is about guarding the night, where the harm concentrates. Keep it practical and shame free, this is a couple of settings, not a character flaw.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Squad words for today",
  "words": [
   {
    "word": "sleep onset",
    "meaning": "How long it takes you to fall asleep. A phone at night pushes it later, so your total sleep shrinks."
   },
   {
    "word": "fragmented sleep",
    "meaning": "Sleep broken into pieces. A buzz that wakes you, and then you cannot drop back off, breaks the night up."
   },
   {
    "word": "attention switching",
    "meaning": "Jumping between apps and notifications. Do it enough and the brain starts expecting the next interruption."
   },
   {
    "word": "the pressure point",
    "meaning": "Night. The pull to check is strongest exactly when your body needs to wind down, so night is where the harm lands."
   }
  ],
  "script": "Say each word, class repeats it. Fragmented is the one to land, that 2am buzz that wakes you and then you lie there, that is the fragmentation a big UK study describes in the heaviest users. Attention switching is the daytime one, and the pressure point ties it together: the phone pulls hardest exactly when you most need to stop.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Recall from earlier. We said the app has no natural stop, you bring the stop. When does that bite hardest?",
  "options": [
   {
    "text": "At night, because there is no natural ending and the pull to check is strongest when you should be winding down",
    "correct": true,
    "feedback": "Exactly. No last page, no THE END, and autoplay carries you on, so falling asleep slips later and later. Night is where the missing stop hurts most."
   },
   {
    "text": "In the morning, because the phone wakes you up gently",
    "correct": false,
    "feedback": "Not quite. The bite is at night, when there is no natural stop and the pull to keep scrolling is strongest exactly when your body needs to wind down."
   },
   {
    "text": "It does not bite at all, the app stops you when it is time for bed",
    "correct": false,
    "feedback": "The app does not know it is night and does not care, it pulls just as hard at midnight as at noon. That is why the stop has to come from you, especially at night."
   }
  ],
  "script": "Retrieval, thirty seconds then hands. The bridge: we learned the app has no natural stop and you bring the stop. Tonight is where that bites hardest, so today is about why night is the worst time for the machine to have you, and what to do about it.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "😴",
  "heading": "Sleep",
  "body": "Using the phone at night delays when you fall asleep, shortens the total, and breaks it into pieces. A large UK study of teenagers your age, the Millennium Cohort Study, found the very heaviest users were more likely to report falling asleep late, waking late, and trouble getting back to sleep once woken. Sleep is the quiet engine under your mood, your focus and your day, so a lost hour at night costs you more than an hour.",
  "script": "Land the study plainly and without an invented sample number, keep it qualitative: a big UK study of teens found the heaviest users struggling most with falling asleep, waking late and getting back off. The point to make: this is not a lecture about being tired, poor sleep tracks with more anxiety and low mood, so the night phone is doing more than costing an hour.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🧠",
  "heading": "Attention",
  "body": "Every notification is a tap that pulls your focus. Do it enough and constant switching trains the brain to expect the next interruption, so sitting with one thing gets harder. Heavier, more compulsive use is linked to more of that. This is not a flaw in you. It is the pull of the phone in the wrong place at the wrong time, and it responds to a couple of concrete changes, not to willpower.",
  "script": "Ask the class to notice the tug: a buzz in your pocket pulls your attention even when you do not pick up. Constant switching trains the brain to expect the next interruption. Keep it shame free, this is design meeting a normal brain, and the fix is settings and placement, not trying harder.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "A night with the phone in the room",
  "caption": "Watch a normal night unfold. Notice nobody did anything dramatic, the phone in the room did the work.",
  "steps": [
   {
    "emoji": "🛏",
    "title": "Phone on the pillow",
    "text": "Lights off, one last check. A buzz answers back, and now you are awake again."
   },
   {
    "emoji": "▶",
    "title": "Autoplay carries on",
    "text": "No natural stop, so falling asleep slips later and later."
   },
   {
    "emoji": "🌙",
    "title": "A 2am wake",
    "text": "A buzz wakes you, you check it, and now you are wide awake and cannot drop back off."
   },
   {
    "emoji": "🥱",
    "title": "A groggy morning",
    "text": "You are flat and cannot focus in first period. The phone in the room did all of it."
   }
  ],
  "script": "Walk the timeline as it builds. The line to land at the end: the fix is not willpower at 2am, it is deciding at 9pm where the phone sleeps. This diagram is the spine of the lesson, so do not rush it, and keep it recognisable rather than scary, most pupils will see their own night in it.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "choice",
  "question": "Hinge question. Someone keeps waking at night to a buzzing phone by the bed and cannot get back to sleep. What is the single most effective move?",
  "options": [
   {
    "text": "Charge the phone in another room overnight",
    "correct": true,
    "feedback": "That is the strongest move. Out of reach means out of mind, and the sleep gets the night back. The fix is where the phone sleeps, decided before bed, not willpower at 2am."
   },
   {
    "text": "Keep the phone by the bed but on silent",
    "correct": false,
    "feedback": "Silent still glows and still tempts, and one 2am glance costs you an hour. The move that works is the phone charging in another room, out of reach."
   },
   {
    "text": "Scroll until you feel tired enough to sleep",
    "correct": false,
    "feedback": "Scrolling pushes sleep later, not earlier, and autoplay has no natural stop. The effective move is the phone out of the room, so the pull is gone."
   }
  ],
  "script": "The hinge, whole class with A, B, C cards or devices. If most pick charge in another room, move on. If not, back to the night timeline. The misconception to break is that silent by the bed is enough. It is not, silent still glows and still tempts, out of the room is the move.",
  "phase": "prove",
  "minutes": 3
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 3,
  "mode": "pairs",
  "seconds": 120,
  "prompt": "Three scenario cards. One, someone who cannot fall asleep because there is always one more video. Two, someone whose sleep breaks up because their phone buzzes on the pillow all night. Three, someone who cannot focus in lessons because they are used to checking every few minutes. For each, name what is going on, and one concrete move that fixes it.",
  "lookFor": "Pupils naming the mechanism, delayed onset, fragmentation, attention switching, and a concrete move, a last scroll time, phone out of the room, notifications off. The win is the move being specific, not just try to use it less.",
  "script": "Two minutes, pairs, take the first card with them if they need the model. Circulate and grab a specific move for each. Push for concrete: not use it less but phone charges in the hall, notifications off after nine, a last scroll time you keep. Specific is what sticks."
 },
 {
  "type": "concept",
  "emoji": "🌓",
  "heading": "The app does not know it is night",
  "body": "Here is the part worth knowing. The app does not know it is night, and it does not care. It pulls just as hard at midnight as at noon. So the boundary has to come from you, not from the app. And this is not about giving up your phone, using it in the day is fine. It is about guarding the eight hours that put you back together. Two moves do most of the work: the phone charges outside the bedroom, and notifications go off at night.",
  "script": "This is the calibration slide, so hold the Goldilocks line: daytime use is fine, the point is the night and the heaviest use, not phones in general. Then the two moves, said as the headline of the lesson: phone out of the bedroom, notifications off at night. Small, specific, easy to keep, which is exactly why they beat a vague less screen time.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "Design your own night plan",
  "body": "On your own. Write where the phone will charge tonight, what time notifications go off, and one attention move for the day, like keeping the phone out of sight while you do one task. Then write the one you think you will actually keep, and why. Ten minutes. I am not collecting personal detail, I am collecting the plan.",
  "script": "Hand out the sheet, ten minutes. Support pupils get the three ideas visible, sentence starters and a ready made night timeline. Stretch: why is the point the night and the heaviest use, not phones in general. Circulate and grab one realistic, keepable plan to read out. Point to the support line for anyone whose work suggests ongoing sleeplessness or worry.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Exit check. Where does the phone do the most damage to your sleep and focus, and what fixes most of it?",
  "options": [
   {
    "text": "At night. The fix is where the phone sleeps and whether it buzzes, phone out of the room and notifications off",
    "correct": true,
    "feedback": "Exactly. Night is the pressure point, and two moves do most of the work: phone out of the bedroom, notifications off at night. Not willpower, just placement and settings."
   },
   {
    "text": "In the daytime, so the fix is to never use the phone at all",
    "correct": false,
    "feedback": "Not this one. Moderate daytime use is fine. The harm concentrates at night, and the fix is guarding the night, not giving up the phone."
   },
   {
    "text": "Nowhere in particular, so there is nothing you can really do",
    "correct": false,
    "feedback": "There is a lot you can do, and it is specific. Night is the pressure point, and phone out of the room plus notifications off fixes most of it."
   }
  ],
  "script": "Silent, independent exit check, your evidence for the outcome. A pupil who picks the first option and can name one concrete move has met the objective. Anyone on never use the phone has missed the Goldilocks point, back to the calibration slide. Collect the printed quiz in.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Orbit",
  "text": "The phone reaches my sleep and my focus at night, and the fix is where it sleeps and whether it buzzes.",
  "script": "Whole class, twice, warmer the second time. This is the sentence worth carrying home, so make it feel like a squad line, not a test answer. Guard the night, and the days get easier.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "A phone at night delays sleep, shortens it and breaks it into pieces. A big UK study found the heaviest users struggling most.",
   "Constant notifications train the brain toward distraction, so focus gets harder.",
   "The app does not know it is night. The boundary has to come from you.",
   "Two moves do most of the work: phone out of the bedroom, notifications off at night. If sleep or worry has been rough for a while, tell a trusted adult, or Childline on 0800 1111."
  ],
  "script": "Read by pupils, one point each. Return to the entry answers on where the phone sleeps and enjoy the shift. Hold the balance: this is not give up your phone, it is guard the night. Name the support line calmly for anyone lying awake worrying or whose sleep or mood has been hard for a while.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi wraps it up",
  "lines": [
   "Squad, you found the pressure point, and once you see it, you can guard it. ⭐",
   "The app does not know it is night, so the boundary comes from you.",
   "Your mission this week: pick one move and keep it, phone out of the room, notifications off, or a last scroll time.",
   "Guard the night, and the days get easier. And if sleep or worry has been rough for a while, tell a trusted adult or Childline. See you next mission!"
  ],
  "script": "Let DiGi land the close, the bubbles appear on their own. While it plays, pupils write their one move on the exit card. Keep the support line visible as they leave. Follow up gently with any pupil whose work suggested ongoing sleeplessness or low mood.",
  "phase": "close",
  "minutes": 2
 }
]$sm12$::jsonb,
  '[]'::jsonb,
  $sm12${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 1,
  "auto_marked": true
 },
 "teacher_judgement": {
  "scale": [
   "working_towards",
   "met",
   "exceeded"
  ],
  "one_tap": true,
  "default": "met"
 },
 "action_commitment": {
  "captured": true,
  "revisited_next_lesson": true
 }
}$sm12$::jsonb,
  $sm12${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned that the phone reaches into their sleep and their focus, and does the most harm at night. A phone in the bedroom delays sleep, shortens it and breaks it up, and a large UK study found the heaviest teenage users struggling most. In the day, constant notifications train the brain to expect the next interruption. The fix is a couple of concrete moves, mostly about the night.",
 "try_this": "Skip the lecture, make it shared. Ask, without blame, where the phone sleeps and whether it wakes them. Offer to make the change together and do it yourself too, your phone charges downstairs, so does theirs. Agree one small thing, phone charging in the hall, notifications off after a set time, or a last scroll time you both keep.",
 "family_question": "Where does your phone spend the night, and does it ever wake you up?",
 "no_login_required": true
}$sm12$::jsonb,
  $sm12${
 "learning_objective": "Pupils can name how night time use and constant switching affect sleep and attention, and choose one concrete move, phone out of the bedroom or notifications off at night.",
 "timing": "55 minutes: starter 8, sleep and attention 5, night timeline 4, hinge 3, guided practice 3, calibration 2, independent practice 10, prove 2, close 5",
 "misconceptions": [
  "Keeping the phone on silent by the bed is enough (silent still glows and tempts, and one 2am glance costs an hour: out of the room is the move)",
  "The app knows when it is night and will help me stop (the app pulls just as hard at midnight as at noon, the boundary has to come from you)",
  "This lesson is saying phones ruin your health and I should give mine up (it is not: the harm concentrates at night and in the heaviest use, moderate daytime use is fine, a Goldilocks stance)"
 ],
 "differentiation": {
  "support": "The three idea cards stay visible, pairs get sentence starters and a ready made night timeline, and scenario cards can be matched to a move rather than written up.",
  "stretch": "Ask why the point is the night and the heaviest use, not phones in general, drawing on the study flagging the very highest users and Przybylski Goldilocks, so the lesson never tips into phones ruin your health."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Draw the night timeline on the board, phone on the pillow, buzz, delayed onset, 2am wake, groggy morning, and talk it through. Read the scenarios aloud and run the votes with hands up. Choice slides become read aloud questions with corner voting. The night plan is already paper.",
 "keywords": [
  {
   "word": "sleep onset",
   "definition": "How long it takes you to fall asleep. A phone at night pushes it later, so your total sleep shrinks."
  },
  {
   "word": "fragmented sleep",
   "definition": "Sleep broken into pieces. A buzz that wakes you, and then you cannot drop back off, breaks the night up."
  },
  {
   "word": "attention switching",
   "definition": "Jumping between apps and notifications. Do it enough and the brain starts expecting the next interruption."
  },
  {
   "word": "the pressure point",
   "definition": "Night. The pull to check is strongest exactly when your body needs to wind down, so night is where the harm lands."
  }
 ],
 "tool": {
  "heading": "Guard the night",
  "lines": [
   "Phone out of the bedroom",
   "Notifications off at night",
   "A last scroll time you keep"
  ],
  "strapline": "The phone reaches my sleep and focus at night, so I guard the night: phone out of the room, notifications off."
 },
 "worksheet": {
  "title": "Design your own night plan",
  "directions": "For each scenario, name what is going on, then name one concrete move that fixes it. Then design your own plan and mark the one you will actually keep.",
  "verdict_options": [
   "Delayed sleep onset",
   "Fragmented sleep",
   "Attention switching"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "Someone cannot fall asleep because there is always one more video and autoplay never stops.",
   "expected_verdict": "Delayed sleep onset",
   "teaching_point": "No natural stop pushes sleep later. The concrete move is a last scroll time and, best of all, the phone charging outside the bedroom so the one more video is out of reach."
  },
  {
   "n": 2,
   "item": "Someone sleep keeps breaking up because their phone buzzes on the pillow through the night.",
   "expected_verdict": "Fragmented sleep",
   "teaching_point": "A 2am buzz wakes you and then you cannot drop back off, the fragmentation the UK study describes. The move is notifications off at night, or the phone charging in another room."
  },
  {
   "n": 3,
   "item": "Someone cannot focus in lessons because they are used to checking their phone every few minutes.",
   "expected_verdict": "Attention switching",
   "teaching_point": "Constant switching trains the brain to expect the next interruption. The move is keeping the phone out of sight during one task, so focus gets a chance to settle."
  },
  {
   "n": 4,
   "item": "Someone says silent by the bed is fine, the phone does not make a sound so it cannot bother them.",
   "expected_verdict": "Fragmented sleep",
   "teaching_point": "Silent still glows and still tempts, and one glance costs an hour. The move that actually works is the phone charging outside the bedroom, out of reach and out of mind."
  }
 ],
 "commitment_stem": "My night plan: the move I will actually keep this week is..."
}$sm12$::jsonb,
  $sm12${
 "required": false
}$sm12$::jsonb
)
on conflict (module_id) do nothing;
