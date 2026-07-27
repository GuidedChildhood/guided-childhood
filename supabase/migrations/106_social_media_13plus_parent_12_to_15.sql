-- Migration 106: 13 plus Social Media Literacy, parent co view guides, modules 12 to 15
-- Seeds the PARENT (Version C) co view guides for four curriculum modules into
-- public.lessons, following the tested parent lesson pattern (013 / 017 / 018).
-- Content lives in the database, never hardcoded (non negotiable 6).
--
--   Module 12  Sleep, attention and the body      shaper       sort 1120
--   Module 13  The good side held honestly         shaper       sort 1130
--   Module 14  Taking the wheel                    independent  sort 1140  (16 plus)
--   Module 15  AI companions and chatbots          shaper       sort 1150
--
-- audience 'parent', category 'social media', status 'live'. Each slides deck
-- uses the title / objective / concept / choice / digi shapes. British English,
-- calm co view tone, no dashes in any copy. Idempotent: each insert is guarded
-- with where not exists on the title, so re running is safe. No DO blocks.

-- ── Module 12: Sleep, attention and the body (shaper) ───────────────────────
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'shaper', 'parent', 'social media', 'Sleep, attention and the body',
  'The phone does not only cost your child time, it reaches into their sleep and their attention, and it does the most harm at night. Used in bed it delays sleep, shortens it and breaks it up, and a large UK study of teenagers found the heaviest users struggling most with falling asleep, waking late and getting back off after a wake in the night. In the day, constant notifications train the brain to expect the next interruption, so focus gets harder. The fix is not a battle over the phone, it is a couple of concrete moves, mostly about the night.',
  'Sleep is the quiet engine under mood, weight and learning, so protecting the night protects a lot at once. The point is not that phones are bad, moderate daytime use is genuinely fine, it is that night time and the heaviest use are where the harm concentrates. Two moves do most of the work, the phone charges outside the bedroom, and notifications go off at night. Because these are small and specific, they are easy to agree and easy to keep, far more than a vague "less screen time".',
  'Skip the lecture and make it practical and shared. Ask, without blame, "where does your phone sleep, and does it wake you?" Then explain the why in one line, a phone in the room means later nights and broken sleep, and broken sleep means rough mornings. Offer to make the change together and to do it yourself too, your phone charges downstairs and so does theirs. Set it up as a family move, not a punishment aimed only at them. Agree one small thing, the phone charging in the hall, notifications off after a set time, or a last scroll time you both keep. A rule they help write, and see you keep too, is a rule that sticks.',
  'The phone reaches your child''s sleep and focus, and mostly at night. Your job is not to fight the phone all day, it is to guard the night with a couple of concrete moves you set up together.',
  'My teenager cannot sleep and cannot focus, how do I help without a nightly battle over the phone?',
  1120, 'live',
  $s12$[
    {
      "type": "title",
      "eyebrow": "Shaper · Ages 13 to 15 · Social media",
      "title": "Sleep, attention and the body",
      "body": "A short co view guide. The phone does not only cost time, it reaches into sleep and focus, and it does the most harm at night. Two calm moves take most of it back."
    },
    {
      "type": "objective",
      "heading": "What you will take from this",
      "body": "By the end you can name how night time and constant use affect your child's sleep and attention, and one concrete move you set up together tonight."
    },
    {
      "type": "concept",
      "emoji": "🌙",
      "heading": "The night is the pressure point",
      "body": "Used in bed, the phone delays sleep, shortens it and breaks it into pieces. A large UK study of teenagers found the heaviest users struggling most to fall asleep, waking late, and failing to drop back off after a wake in the night."
    },
    {
      "type": "concept",
      "emoji": "🧠",
      "heading": "And the focus, by day",
      "body": "Every notification is a small tug on attention. After enough of them the brain starts to expect the next interruption, so sitting with one thing gets harder. This is design at work, not a flaw in your child."
    },
    {
      "type": "concept",
      "emoji": "🛏️",
      "heading": "Two moves do most of the work",
      "body": "The phone charges outside the bedroom, and notifications go off at night. Because they are small and specific, they are easy to agree and far easier to keep than a vague plan to use it less."
    },
    {
      "type": "choice",
      "question": "Your teenager keeps waking to a phone buzzing by the bed and cannot drop back off. What is the single most effective move to suggest?",
      "options": [
        { "text": "Keep the phone by the bed, just on silent.", "correct": false, "feedback": "Silent still glows and still tempts, and one glance at 2am costs an hour. The phone needs to leave the room." },
        { "text": "Charge the phone in another room overnight.", "correct": true, "feedback": "Out of reach is out of mind. This one change protects the whole night more than any rule you say out loud." },
        { "text": "Reply to messages faster so they stop coming.", "correct": false, "feedback": "The app never runs out of reasons to buzz. Distance from the phone is what resets the night, not speed." }
      ]
    },
    {
      "type": "digi",
      "heading": "Talk it through with DiGi",
      "body": "If your child cannot sleep or cannot focus, DiGi stays calm and never lectures. It asks where the phone spends the night, explains the sleep link plainly, and hands over one concrete move plus a trusted adult to set it up with. If sleep or worry has been hard for a while, DiGi names Childline on 0800 1111 as a next step.",
      "prompt": "My teenager cannot sleep and cannot focus, how do I help without a nightly battle over the phone?"
    }
  ]$s12$::jsonb
where not exists (select 1 from public.lessons where title = 'Sleep, attention and the body');

-- ── Module 13: The good side held honestly (shaper) ─────────────────────────
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'shaper', 'parent', 'social media', 'The good side held honestly',
  'Social media is genuinely good for your child in real ways. It keeps their friendships alive across distance, it helps them find people who understand them, it gives them a voice, and it lets them create instead of only consume. For a teenager who feels on the edge of things, an LGBTQ+ teen, a young carer, a child with a condition no one around them shares, finding their people online can lift a weight you may never fully see. That good is real. And every part of it comes with a catch, so we hold the two together.',
  'If you only ever name the dangers, your child learns that you do not understand the part of their life that matters most, and they stop talking to you about it. When you can name the good out loud, and genuinely mean it, you earn the right to talk about the catch too. The research is honest that belonging online is good for wellbeing, especially for teens who lack support at home, and that the same spaces are double edged. Naming both, not just the risk, is what keeps you in the conversation.',
  'Ask your child to show you the good bit. "Show me a group or an account that actually makes your day better. What do you get from it?" Listen properly, and mean it when you say that sounds good. Then, gently, "and is there ever a version of that group that gets harder, that piles on or wears you down?" Let them tell you. If they say a community online is where they feel most understood, take that seriously and do not compete with it, instead widen it, "I love that you have that, who else in your actual day would have your back too?" A good online community and a trusted adult are not rivals. Aim for both.',
  'The good side of social media is real, and worth naming out loud, and every good thing on there comes with a catch. Your job is not to talk them out of the good, it is to help them keep it with their eyes open, and to make sure their online people are not their only people.',
  'My teenager says an online community is the only place they feel they belong, how do I take that seriously without ignoring the risks?',
  1130, 'live',
  $s13$[
    {
      "type": "title",
      "eyebrow": "Shaper · Ages 13 to 15 · Social media",
      "title": "The good side held honestly",
      "body": "A short co view guide. Social media can genuinely be good for your child. We name the good out loud, and we hold its catch in the same breath, never one without the other."
    },
    {
      "type": "objective",
      "heading": "What you will take from this",
      "body": "By the end you can name a real way social media is good for your child, the catch that sits alongside it, and how you help them keep the good with their eyes open."
    },
    {
      "type": "concept",
      "emoji": "💛",
      "heading": "The good is real",
      "body": "It keeps friendships alive across distance, helps your child find people who understand them, gives them a voice, and lets them create instead of only consume. For a teenager who feels on the edge of things, finding their people online can lift a weight you may never fully see."
    },
    {
      "type": "concept",
      "emoji": "👁️",
      "heading": "And every good thing has a catch",
      "body": "The place you belong is the same place that can pile on. A community that carries someone through a hard week can turn on a bad day. That is not a reason to leave it. It is a reason to hold the good and the catch together."
    },
    {
      "type": "concept",
      "emoji": "🗝️",
      "heading": "Why naming the good matters",
      "body": "If you only ever name the dangers, your child learns you do not understand the part of their life that matters most, and they stop talking to you. Mean it when you say the good is good, and you earn the right to talk about the catch."
    },
    {
      "type": "choice",
      "question": "Your child says an online community is the only place they feel understood. What is the most honest response?",
      "options": [
        { "text": "They are right, if it feels that good it must be safe.", "correct": false, "feedback": "Belonging is real and protective, but feeling good is not proof that nothing there carries risk. Both can be true at once." },
        { "text": "The belonging is real and good, and the same place can still carry risk, so both are true.", "correct": true, "feedback": "That is the whole idea. Take the belonging seriously, keep the catch in view, and do not compete with it." },
        { "text": "They are wrong, online communities are dangerous.", "correct": false, "feedback": "Wave it away and you push it out of the conversation. The belonging is genuine, especially for a teen who lacks support elsewhere." }
      ]
    },
    {
      "type": "digi",
      "heading": "Talk it through with DiGi",
      "body": "When a child says an online community is the only place they belong, DiGi does not warn them off it and does not wave it through. It names the belonging as real, gently asks what the group is like on a hard day, and hands them one small move plus a trusted adult, so the good is kept and the catch is watched.",
      "prompt": "My teenager says an online community is the only place they feel they belong, how do I take that seriously without ignoring the risks?"
    }
  ]$s13$::jsonb
where not exists (select 1 from public.lessons where title = 'The good side held honestly');

-- ── Module 14: Taking the wheel (independent, 16 plus) ──────────────────────
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'independent', 'parent', 'social media', 'Taking the wheel',
  'By 16 the handover is happening whether you plan it or not. The default protections that were built into apps when your child was younger get weaker as they age, under the ICO Children''s Code, so the judgement that used to be automatic has to become theirs. There are four levers they now hold themselves, taking deliberate breaks, curating their feed, deciding whether and how to be on a platform at all, and thinking about the footprint they leave for the adult they are becoming. Your role shifts from setting the rules to handing over the wheel.',
  'Agency is protective, being the one who decides is genuinely good for a young person, and breaks are one of the few levers with real evidence behind them, the APA reported in 2023 that teenagers who cut their use for a few weeks felt better about their appearance. At the same time the built in safeguards are quietly stepping back as your child ages, so if the judgement has not moved inside them, nothing replaces the protection they are losing. The handover is not a risk to manage, it is the whole goal, but it only works if you make it deliberate rather than letting it happen by accident.',
  'Treat your 16 plus as the near adult they are. Instead of a rule, offer a question. "You are old enough now that the app is not really protecting you by default any more, it is on you. What is your own plan for keeping it healthy?" Let them answer, and take their reasoning seriously even when you would decide differently. If they mention feeling flat or picky about how they look after using it, you could say, "some research found a short break actually helped with that, might be worth a try, your call." This is the age where you hand over the wheel on purpose, staying in the passenger seat, available, not gripping the dashboard. And make clear that asking for help is part of driving, not a return to childhood.',
  'The protections thin out as your child grows up, so the judgement has to become theirs, and that is the goal, not the danger. Your job now is to hand over the wheel deliberately, trust them with real decisions, and stay in the passenger seat so that asking you for help still feels like a grown up move, not a step back.',
  'My 16 year old wants to manage their own social media, how do I hand over the wheel without stepping back too far?',
  1140, 'live',
  $s14$[
    {
      "type": "title",
      "eyebrow": "Independent · Ages 16 plus · Social media",
      "title": "Taking the wheel",
      "body": "A short co view guide. By 16 the handover is already happening. The protections that were built in when your child was younger thin out, so the judgement has to become theirs. Your role shifts from setting rules to handing over the wheel."
    },
    {
      "type": "objective",
      "heading": "What you will take from this",
      "body": "By the end you can name the four levers your near adult now holds, and how you hand over the wheel deliberately while staying in the passenger seat."
    },
    {
      "type": "concept",
      "emoji": "🛞",
      "heading": "The defaults are stepping back",
      "body": "Under the ICO Children's Code the built in safeguards are strongest for younger children and weaken with age. If the judgement has not moved inside your child, nothing replaces the protection they are losing. The handover is the goal, not a risk to manage."
    },
    {
      "type": "concept",
      "emoji": "🎛️",
      "heading": "Four levers, now theirs",
      "body": "Taking deliberate breaks, curating the feed, deciding whether and how to be on a platform at all, and minding the footprint they leave for the adult they are becoming. Breaks have real evidence behind them. The APA reported in 2023 that teenagers who cut their use for a few weeks felt better about their appearance."
    },
    {
      "type": "concept",
      "emoji": "🚗",
      "heading": "Your seat is the passenger seat",
      "body": "Hand over the wheel on purpose. Stay available, do not grip the dashboard. And make clear that asking for help is part of driving, not a return to childhood."
    },
    {
      "type": "choice",
      "question": "Your 17 year old wants to sort out their own social media use. What is the most useful thing you can offer?",
      "options": [
        { "text": "A firm rule about how long they are allowed on it.", "correct": false, "feedback": "A rule handed down at this age misses the point. The protection they are losing is replaced by their own judgement, not yours." },
        { "text": "A question that hands them the decision, and your trust in their reasoning.", "correct": true, "feedback": "That is taking the wheel. Offer the question, take their reasoning seriously, and stay in the passenger seat." },
        { "text": "Nothing, they are old enough to be left entirely to it.", "correct": false, "feedback": "Handing over the wheel is not leaving the car. The passenger seat, available and not driving, is exactly where you belong now." }
      ]
    },
    {
      "type": "digi",
      "heading": "Talk it through with DiGi",
      "body": "When a near adult wants to manage their own use, DiGi treats them as the decision maker they are, names the levers they hold, asks what signal they are reading in themselves, and hands back one deliberate move with a reason, plus the reminder that asking a trusted adult is part of taking the wheel, not a failure of it.",
      "prompt": "My 16 year old wants to manage their own social media, how do I hand over the wheel without stepping back too far?"
    }
  ]$s14$::jsonb
where not exists (select 1 from public.lessons where title = 'Taking the wheel');

-- ── Module 15: AI companions and chatbots (shaper) ──────────────────────────
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'shaper', 'parent', 'social media', 'AI companions and chatbots',
  'AI companion apps and chatbots are now a normal part of teen life. A companion is software designed to feel like a relationship, always available, always agreeable, but it is a tool, not a friend, a therapist or a trusted adult, and because it is built to agree and keep your child engaged, it can be confidently wrong. The honest picture has two buckets. Most teens keep their perspective, still prefer real friends and find a bot less satisfying than a person. A smaller group, often when lonely or going through something hard, lean on it more heavily, or follow advice a real person would never give. It is the activity and the child that matter, not the tool.',
  'If you panic about the app, you push it underground and your child stops talking to you about it. If you shrug it off, you miss the smaller number of moments that genuinely matter. Holding both, calm about the general use, alert to heavy dependence and to bad advice on serious things, is what keeps you useful and keeps them talking. And the skill that actually protects them is not a ban, it is the judgement to see the bot for what it is and to bring the things that matter to a real person. This is why the 2026 RSHE guidance now names chatbots explicitly, and why it is worth a proper conversation at home.',
  'Get curious rather than worried. "What do you actually use it for? What is it good at, and where does it get things wrong?" Let them be the expert, they will often name the limits themselves. Try it together on something low stakes and notice out loud how it just agrees with whatever you say, that is the most useful thing you can show them. Then draw the line gently, that the low stakes stuff is fine, and the things that matter, their safety, their mood, a real worry, go to a person. Tell them plainly that if they ever get advice from a bot on something serious, you would rather they checked it with you first, and that you will not overreact. A child who knows a real person is the safe place is a child who will use one.',
  'An AI chatbot can be useful, but it is a tool, not a friend, and it is built to agree, so it can be confidently wrong. Stay calm, most teens use these fine, and help your child keep one clear line, the things that matter go to real people.',
  'My teenager is chatting to an AI companion a lot, how do I stay calm but make sure the things that matter go to a real person?',
  1150, 'live',
  $s15$[
    {
      "type": "title",
      "eyebrow": "Shaper · Ages 14 to 15 · Social media",
      "title": "AI companions and chatbots",
      "body": "A short co view guide. An AI companion can feel like it listens, but it is a tool, not a friend, a therapist or a trusted adult, and it can be confidently wrong. Seeing it clearly is how your child uses it well."
    },
    {
      "type": "objective",
      "heading": "What you will take from this",
      "body": "By the end you can say what an AI companion is and is not, hold the two buckets calmly, and help your child keep one clear line, the things that matter go to real people."
    },
    {
      "type": "concept",
      "emoji": "🤖",
      "heading": "What it is, and is not",
      "body": "A companion is software designed to feel like a relationship, always available, always agreeable. Because it is built to agree and keep your child engaged, it can be confidently wrong. It does not know your child and it cannot carry real responsibility for them."
    },
    {
      "type": "concept",
      "emoji": "⚖️",
      "heading": "Two buckets, both true",
      "body": "Most teens keep their perspective, still prefer real friends and find a bot less satisfying than a person. A smaller group, often when lonely or going through something hard, lean on it too heavily, or follow advice a real person would never give. It is the activity and the child that matter, not the tool."
    },
    {
      "type": "concept",
      "emoji": "🧭",
      "heading": "Calm, and clear",
      "body": "Panic about the app and you push it underground. Shrug it off and you miss the moments that matter. Stay calm about the general use, stay alert to heavy dependence and to bad advice on serious things, and keep talking."
    },
    {
      "type": "choice",
      "question": "Your child gets a confident answer from a chatbot about a worry over their safety or mental health. What is the line to hold?",
      "options": [
        { "text": "If the bot sounds sure, the advice is probably fine to act on.", "correct": false, "feedback": "A companion is built to agree and keep chatting, so it can be confidently wrong. Confidence is not the same as being right." },
        { "text": "The low stakes stuff is fine, but the things that matter go to a real person.", "correct": true, "feedback": "That is the line. Keep the useful uses, and send safety, mood and real worries to a trusted adult, not a bot." },
        { "text": "Ban the app so the question never comes up.", "correct": false, "feedback": "A ban pushes it underground. The judgement to see the bot clearly protects your child far more than removing it." }
      ]
    },
    {
      "type": "digi",
      "heading": "Talk it through with DiGi",
      "body": "When a child talks about an AI companion, DiGi names plainly that it is a tool that stays a tool, notes what a bot is useful for and where it agrees too easily to be trusted, and asks what the child is really using it for. If they are leaning heavily, or have taken a serious safety or mental health worry to a bot, DiGi stays calm and points them to a trusted adult and Childline on 0800 1111.",
      "prompt": "My teenager is chatting to an AI companion a lot, how do I stay calm but make sure the things that matter go to a real person?"
    }
  ]$s15$::jsonb
where not exists (select 1 from public.lessons where title = 'AI companions and chatbots');
