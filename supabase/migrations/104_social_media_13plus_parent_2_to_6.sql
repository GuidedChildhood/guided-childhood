-- Guided Childhood — Migration 104: social media 13+ parent co view lessons, modules 2 to 6
-- Seeds the PARENT (Version C) rows for five 13+ social media literacy modules
-- into public.lessons, mirroring 103 (module 1 parent). One insert per lesson,
-- guarded by where not exists on the title, so the migration is idempotent and
-- safe to run more than once. Slides render in the interactive player
-- (lib/content/lesson-slides.ts): types title, objective, concept, choice, digi.
-- Calm co view tone, British English, no dashes in any lesson copy (non
-- negotiable 4). Content lives in the database, never hardcoded (non negotiable 6).

-- ── Module 2: The deal you signed ──────────────────────────────────────────────
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'shaper', 'parent', 'social media', 'The deal you signed',
  'When your child makes an account, they are signing a contract. They hand over their data, what they watch, tap and say, and the platform keeps a record and builds a profile. The age 13 rule is often misread as "13 is when they are ready". It is not. Under UK GDPR it is simply the age a child can consent to their own data being processed, a data protection line, not a maturity judgement.',
  'Two things follow from getting this right. First, you stop treating 13 as a green light for readiness and start treating it as the moment to teach the deal, which is a very different conversation. Second, the thing that quietly wears on teenagers is permanence and context collapse, the sense that anything posted can be screenshotted, resurface, or be seen by family, school and strangers all at once. That feeds self monitoring and a low level anxiety. Understanding the contract does the opposite, it hands them back agency. They post on purpose instead of feeling watched.',
  'Sit together and ask them to walk you through it, not test them. "When you made your account, did you read what you agreed to? Shall we look at what it actually collects?" Then, gently, the future self test, "who could end up seeing this, and would you be fine with it turning up in two years?" Make it a team habit, not a telling off. Agree one small thing together, a private account, reading what an app asks to access, or running that quick test before posting. And be clear it is not about posting nothing. It is about posting with their eyes open. A habit they help set is a habit they keep.',
  'Making an account is signing a deal, and 13 is the age they can sign it, not the age they are ready. Your job is not to ban the post, it is to help them read the contract so they choose what they share on purpose.',
  'My teenager is worried about something they posted and is asking to delete their account, what should I do?',
  1020, 'live',
  $s2$[
    {
      "type": "title",
      "eyebrow": "Shaper · Ages 13 to 15",
      "title": "The deal you signed",
      "body": "A calm walk through what an account really is, to read together tonight."
    },
    {
      "type": "objective",
      "outcome": "I can explain what I am really agreeing to when I make an account, and one thing I do to protect my future self.",
      "why": "Because making an account is signing a deal, and knowing the deal hands the choice back to your child.",
      "gains": [
        "Name what an account actually collects",
        "Understand why 13 is a data line, not a readiness line",
        "Pick one small move to protect your future self"
      ]
    },
    {
      "type": "concept",
      "emoji": "📝",
      "heading": "An account is a contract",
      "body": "When your child makes an account they hand over their data, what they watch, tap and say, and the platform keeps a record and builds a profile. The age 13 rule is often misread as the moment they are ready. Under UK GDPR it is simply the age a child can consent to their own data being processed."
    },
    {
      "type": "concept",
      "emoji": "🪞",
      "heading": "Why permanence wears on them",
      "body": "The quiet weight is the sense that anything posted can be screenshotted, resurface, or be seen by family, school and strangers all at once. That feeds self monitoring and a low hum of worry. Understanding the contract does the opposite, it hands agency back, so they post on purpose instead of feeling watched."
    },
    {
      "type": "choice",
      "question": "Your teenager posts a photo to a story, sure it vanishes in 24 hours. What is the honest thing to teach?",
      "options": [
        { "text": "It is gone after a day, so there is nothing to think about.", "correct": false, "feedback": "A friend can screenshot it, and then there is a copy nobody controls. Temporary was never really the deal." },
        { "text": "Picture the whole audience first, nan, a teacher, a stranger, future them, then choose.", "correct": true, "feedback": "Yes. That quick future self test is the skill. If it passes, post it. If not, they just saved themselves." },
        { "text": "Ban stories so the risk goes away.", "correct": false, "feedback": "The move is not banning the post, it is helping them read the contract so the choice stays theirs." }
      ]
    },
    {
      "type": "digi",
      "heading": "The one line to keep",
      "lines": [
        "Making an account is signing a deal, and 13 is the age they can sign it, not the age they are ready.",
        "Your job is not to ban the post, it is to help them read the contract so they choose what they share on purpose."
      ]
    }
  ]$s2$::jsonb
where not exists (select 1 from public.lessons where title = 'The deal you signed');

-- ── Module 3: Locking your doors ───────────────────────────────────────────────
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'shaper', 'parent', 'social media', 'Locking your doors',
  'Your child controls four doors on every account, who can see them, who can contact them, whether their posts share their location, and how they block and report. Apps often leave these doors open by default, because open means more reach for the platform. Nobody sets them for your child. Setting them is a two minute job that turns a vague worry about being watched into real control.',
  'A lot of the anxiety teenagers carry online comes from exposure, the sense that anyone can see them, reach them or judge them at any moment. Ofcom''s work shows plenty of young people have public profiles without really meaning to. The fix is not to ban the app or make them come off. It is to help them set their own doors, because agency is the thing that lifts the worry. And there is a safeguarding layer, contact controls and knowing how to block and report calmly are exactly what protects a child from unwanted contact. The ICO Children''s Code even sets high privacy and location off as the default children should get.',
  'Do it together, as a team, not an inspection. "Shall we do a two minute doors check on your account?" Walk the four together, who can see you, who can message you, location, and how you would block and report. The click by click steps change constantly, so use the live settings walk in the app rather than trusting a menu you half remember. Make one point clearly, blocking or reporting someone is never rude, it is locking your own door, and they never owe a stranger access. Set one door together tonight and leave the rest for them to finish. A door they set themselves is one they understand.',
  'Your child holds the keys to four doors, who sees them, who reaches them, their location, and block and report. Your job is not to lock everything down for them, it is to hand them the keys and make sure they know blocking and reporting is normal, not rude.',
  'How do I help my child feel less exposed and set their own privacy without taking the app away?',
  1030, 'live',
  $s3$[
    {
      "type": "title",
      "eyebrow": "Shaper · Ages 13 to 15",
      "title": "Locking your doors",
      "body": "A two minute doors check you can do together, side by side."
    },
    {
      "type": "objective",
      "outcome": "I can find the four doors on my account and set at least one of them myself.",
      "why": "Because agency is the thing that lifts the worry of being watched.",
      "gains": [
        "Name the four doors, who sees you, who reaches you, location, block and report",
        "Know that blocking and reporting is normal, not rude",
        "Set one door tonight and finish the rest yourself"
      ]
    },
    {
      "type": "concept",
      "emoji": "🚪",
      "heading": "Four doors, often left open",
      "body": "Your child controls who can see them, who can contact them, whether posts share their location, and how they block and report. Apps often leave these doors open by default, because open means more reach for the platform. Nobody sets them for your child. Setting them is a two minute job that turns a vague worry into real control."
    },
    {
      "type": "concept",
      "emoji": "🧭",
      "heading": "Why this lifts the worry",
      "body": "A lot of the anxiety teenagers carry comes from exposure, the sense that anyone can see them or reach them at any moment. Ofcom's work shows many young people have public profiles without really meaning to. The fix is not to make them come off, it is to help them set their own doors. The ICO Children's Code even sets high privacy and location off as the default children should get."
    },
    {
      "type": "choice",
      "question": "Someone your child does not know keeps messaging them. What do you help them see?",
      "options": [
        { "text": "Blocking would be rude, so just ignore it.", "correct": false, "feedback": "Blocking or reporting is never rude, it is locking your own door. They never owe a stranger access." },
        { "text": "Block and report calmly, then tell a trusted adult.", "correct": true, "feedback": "Exactly. Contact controls and calm blocking are what protect a child from unwanted contact." },
        { "text": "Delete the whole account to be safe.", "correct": false, "feedback": "The move is not to lock everything down or leave, it is to name which door is open and set it together." }
      ]
    },
    {
      "type": "digi",
      "heading": "The one line to keep",
      "lines": [
        "Your child holds the keys to four doors, who sees them, who reaches them, their location, and block and report.",
        "Your job is not to lock everything down for them, it is to hand them the keys and make blocking and reporting feel normal."
      ]
    }
  ]$s3$::jsonb
where not exists (select 1 from public.lessons where title = 'Locking your doors');

-- ── Module 4: The highlight reel ───────────────────────────────────────────────
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'shaper', 'parent', 'social media', 'The highlight reel',
  'A feed shows your child everyone else''s edited peaks and hides everyone''s ordinary behind the scenes. So other lives look shinier and theirs looks flat, even though they are comparing their whole day to somebody''s single best frame. Add the tug of missing out, and the habit of reading likes as a score of their worth, and you have the quiet mechanism that can pull a young person''s mood down without anyone noticing.',
  'Social comparison is one of the main ways heavy scrolling links to lower mood, anxiety and loneliness in teenagers. As fear of missing out rises, how good a young person feels about their own life tends to fall. This is not about a weak child, it is about an unfair contest running quietly in the background. When you understand the mechanism, you can teach your child to see it, which protects them far more than banning the app, which they will only resent. The point is judgement, not fear.',
  'Scroll alongside your child, no phone grab, no lecture. When a too perfect post comes up, ask lightly, "what do you reckon they left out of this one?" Let them list the deleted takes, the boring bits, the bad day before. Then ask the honest question, "does looking at this ever leave you feeling a bit worse?" If yes, thank them for saying so and do not fix it, just sit with it. Agree one small thing together, unfollowing a couple of accounts that always sting, following some that show real life, or deciding that likes are not the score of a day. And say the true thing out loud, that you compare too, adults do it constantly, so they know it is human, not a failing.',
  'Your child is comparing their whole self to other people''s highlight reels, and that contest is rigged. Your job is not to police the scrolling, it is to help them see the edit, so a perfect post loses its power over how they feel.',
  'My child says everyone else''s life looks better than theirs online, what do I say?',
  1040, 'live',
  $s4$[
    {
      "type": "title",
      "eyebrow": "Shaper · Ages 13 to 15",
      "title": "The highlight reel",
      "body": "Scroll alongside your child and learn to see the edit together."
    },
    {
      "type": "objective",
      "outcome": "I can spot a highlight reel and name what a perfect post probably left out.",
      "why": "Because comparing your whole self to other people's best frames is a rigged contest.",
      "gains": [
        "See that a feed hides the ordinary behind the scenes",
        "Notice when scrolling leaves you feeling a bit worse",
        "Pick one small move so a perfect post loses its power"
      ]
    },
    {
      "type": "concept",
      "emoji": "🎬",
      "heading": "Everyone's peaks, nobody's ordinary",
      "body": "A feed shows your child everyone's edited peaks and hides everyone's ordinary behind the scenes. So other lives look shinier and theirs looks flat, even though they are comparing their whole day to somebody's single best frame. Add the tug of missing out, and reading likes as a score of their worth, and you have the quiet mechanism that pulls a mood down without anyone noticing."
    },
    {
      "type": "concept",
      "emoji": "⚖️",
      "heading": "An unfair contest, not a weak child",
      "body": "Social comparison is one of the main ways heavy scrolling links to lower mood, anxiety and loneliness in teenagers. This is not about a weak child, it is an unfair contest running quietly in the background. When you understand the mechanism you can teach your child to see it, which protects them far more than banning the app."
    },
    {
      "type": "choice",
      "question": "A too perfect post comes up while you scroll together. What is the lightest thing to ask?",
      "options": [
        { "text": "Nothing, just tell them to stop comparing.", "correct": false, "feedback": "Telling them to stop rarely lands. Helping them see the edit does." },
        { "text": "What do you reckon they left out of this one?", "correct": true, "feedback": "Yes. Let them list the deleted takes and the boring bits. Seeing the edit is what drains the post of its power." },
        { "text": "Point out that their own life is just as good.", "correct": false, "feedback": "Better to sit with the honest feeling than to fix it, then agree one small move together." }
      ]
    },
    {
      "type": "digi",
      "heading": "The one line to keep",
      "lines": [
        "Your child is comparing their whole self to other people's highlight reels, and that contest is rigged.",
        "Your job is not to police the scrolling, it is to help them see the edit so a perfect post loses its power over how they feel."
      ]
    }
  ]$s4$::jsonb
where not exists (select 1 from public.lessons where title = 'The highlight reel');

-- ── Module 5: Bodies and filters ───────────────────────────────────────────────
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'shaper', 'parent', 'social media', 'Bodies and filters',
  'Most of the faces and bodies your child scrolls past are edited, filtered, angled and posed, and a lot of it is filtered live so the before is never shown. When they measure their real self against images no real body matches, that gap is where body worry grows. Two extra risks sit alongside it, they can start preferring their own filtered face to their real one, and the algorithm can push appearance and dieting content harder the more it is watched, occasionally surfacing content that frames an eating disorder as a goal.',
  'Appearance focused content drives body dissatisfaction, and this is not a small thing, almost half of girls report worrying about their bodies often or always. The most useful fact to hold is a hopeful one. When young people cut back on social media, researchers found their feelings about their weight and appearance improved (APA 2023). That means the strongest protection is not a ban and not a lecture about self esteem, it is helping your child see that the images are edited and gently reduce the appearance content that stings. This is a lever they can hold themselves.',
  'Look at some posts together, lightly, no comments about anyone''s body including your own. Point at a too perfect image and wonder aloud, "how much of this do you reckon is a filter?" Try one together, notice how it smooths and reshapes in real time, and how the before looked just fine. Share the hopeful fact plainly, that teens who cut back on this kind of content started feeling better about how they look, nothing about their bodies changed. Agree one small thing together, filters off sometimes, unfollowing accounts that leave them feeling worse, following a wider mix of real bodies, or a quiet cut back to test the effect. And keep the door open, "if you ever feel bad about your body or about eating, you can always tell me, and I will not make a fuss, I will just help."',
  'The images your child compares themselves to are edited, so the bar is impossible, and cutting back genuinely helps. Your job is not to police mirrors or meals, it is to help them see the edit and to be the safe person they tell if it ever gets heavy.',
  'My daughter hates how she looks next to people online, how do I help without making it worse?',
  1050, 'live',
  $s5$[
    {
      "type": "title",
      "eyebrow": "Shaper · Ages 13 to 15",
      "title": "Bodies and filters",
      "body": "A gentle look together at how much of a feed is edited."
    },
    {
      "type": "objective",
      "outcome": "I can see that the images I compare myself to are edited, and name one move that helps.",
      "why": "Because the bar those images set is impossible, and cutting back genuinely helps.",
      "gains": [
        "Understand that most faces and bodies online are filtered and posed",
        "Hold the hopeful fact that cutting back improves how teens feel about their looks",
        "Know who to tell if worry about bodies or eating ever gets heavy"
      ]
    },
    {
      "type": "concept",
      "emoji": "🪞",
      "heading": "The reality gap",
      "body": "Most of the faces and bodies your child scrolls past are edited, filtered, angled and posed, and a lot of it is filtered live so the before is never shown. When they measure their real self against images no real body matches, that gap is where body worry grows. They can even start preferring their own filtered face to their real one."
    },
    {
      "type": "concept",
      "emoji": "🌱",
      "heading": "The hopeful fact",
      "body": "Appearance focused content drives body dissatisfaction, and almost half of girls report worrying about their bodies often or always. Here is the hopeful part. When young people cut back on this content, researchers found their feelings about their weight and appearance improved (APA 2023). Nothing about their bodies changed. The strongest protection is helping them see the edit and gently reduce the content that stings."
    },
    {
      "type": "choice",
      "question": "Your child says they hate how they look next to people online. What helps most?",
      "options": [
        { "text": "Tell them they look lovely and move on.", "correct": false, "feedback": "Reassurance alone rarely shifts it. Naming that the images are edited, and cutting back, does more." },
        { "text": "Try a filter together and notice how it smooths and reshapes in real time.", "correct": true, "feedback": "Yes. Seeing the edit happen, plus a quiet cut back to test the effect, is a lever they can hold themselves." },
        { "text": "Ban the apps that make them feel bad.", "correct": false, "feedback": "A ban breeds resentment. And if any worry about eating or self harm shows, route to a trusted adult and named help, never handle it alone." }
      ]
    },
    {
      "type": "digi",
      "heading": "The one line to keep",
      "lines": [
        "The images your child compares themselves to are edited, so the bar is impossible, and cutting back genuinely helps.",
        "Your job is not to police mirrors or meals, it is to help them see the edit and to be the safe person they tell if it ever gets heavy."
      ]
    }
  ]$s5$::jsonb
where not exists (select 1 from public.lessons where title = 'Bodies and filters');

-- ── Module 6: Influencers and the sell ─────────────────────────────────────────
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'shaper', 'parent', 'social media', 'Influencers and the sell',
  'Your child can feel genuinely close to a creator they watch every day, a one sided bond where they feel they know the person who has no idea they exist. That closeness is warm and normal, and it is also exactly what makes influencer selling work. A lot of what they watch is paid promotion, and even when it carries an "ad" label, research finds that a strong bond makes the label barely register, so the persuasion still lands.',
  'When you understand the bond, two things change. You stop treating your child''s love of a creator as silly or a red flag, which keeps them talking to you about what they watch and want. And you can teach them the one skill that actually protects them, seeing the sell behind the friendship, which matters because researchers link a steady diet of influencer content to materialism and a quiet pressure to buy, and because at this age the internal radar for spotting persuasion is still developing. This protects far better than banning a creator they will just watch elsewhere.',
  'Watch one video together with a creator your child likes, and let them be the expert. "Tell me why you like them." Then, gently, "how do you think they make their money?" Let them find the answer, that a lot of it is selling. Next time a product appears, spot the "ad" tag together as a team, not a telling off, and try one question out loud, "would we want this if a stranger held it up?" Agree one small family habit, wait a day before buying anything from the feed, or a quick check of what problem it actually solves. A habit they help set is one they keep.',
  'Loving a creator is fine. The skill is seeing the advert when it has a friendly face. Your job is not to ban the people they watch, it is to help them read the sell so the choice to buy stays theirs.',
  'My child wants to buy something their favourite creator recommended, how do I handle it?',
  1060, 'live',
  $s6$[
    {
      "type": "title",
      "eyebrow": "Shaper · Ages 13 to 15",
      "title": "Influencers and the sell",
      "body": "Watch one video together and let your child be the expert."
    },
    {
      "type": "objective",
      "outcome": "I can enjoy a creator I love and still spot the advert behind the friendship.",
      "why": "Because a strong bond makes an ad label barely register, so the sell still lands.",
      "gains": [
        "Understand the one sided bond and why it is normal",
        "Spot the ad tag and the sell behind a friendly face",
        "Agree one small family habit before buying from a feed"
      ]
    },
    {
      "type": "concept",
      "emoji": "🤝",
      "heading": "A one sided bond",
      "body": "Your child can feel genuinely close to a creator they watch every day, a bond where they feel they know a person who has no idea they exist. That closeness is warm and normal, and it is also exactly what makes influencer selling work. A lot of what they watch is paid promotion, and even when it carries an ad label, a strong bond makes the label barely register."
    },
    {
      "type": "concept",
      "emoji": "🛒",
      "heading": "Why naming the sell protects them",
      "body": "When you understand the bond you stop treating your child's love of a creator as silly, which keeps them talking to you. And you can teach the one skill that protects them, seeing the sell behind the friendship. Researchers link a steady diet of influencer content to materialism and a quiet pressure to buy, and at this age the radar for spotting persuasion is still developing."
    },
    {
      "type": "choice",
      "question": "A creator your child loves recommends a product and they really want it. What is the useful move?",
      "options": [
        { "text": "Tell them the influencer is just after their money.", "correct": false, "feedback": "Dismissing the bond shuts the conversation. Warm to it as real, then name the sell calmly." },
        { "text": "Spot the ad tag together and ask, would we want this if a stranger held it up?", "correct": true, "feedback": "Yes. Let them find that a lot of it is selling, then agree to wait a day before buying from the feed." },
        { "text": "Ban the creator from their feed.", "correct": false, "feedback": "They will just watch elsewhere. Reading the sell keeps the choice to buy theirs." }
      ]
    },
    {
      "type": "digi",
      "heading": "The one line to keep",
      "lines": [
        "Loving a creator is fine. The skill is seeing the advert when it has a friendly face.",
        "Your job is not to ban the people they watch, it is to help them read the sell so the choice to buy stays theirs."
      ]
    }
  ]$s6$::jsonb
where not exists (select 1 from public.lessons where title = 'Influencers and the sell');
