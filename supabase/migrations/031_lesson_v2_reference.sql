-- 031: Lesson v2 for the reference lesson (ks3-12-misinfo-deepfakes).
-- The "proper lesson" pass (JP directive, 6 Jul 2026): a teacher script on
-- every slide, an objective slide (purpose and what pupils gain, the Ofsted
-- deep dive answer), a keywords slide, three realistic scenario posts
-- rendered on screen as evidence, two animated diagrams, and the animated
-- DiGi closing where the golden star speaks the lesson home.
--
-- Contract lives in lib/content/lesson-slides.ts. Dashboard safe: one plain
-- UPDATE, dollar quoted, no DO blocks, no semicolons inside strings.

update public.school_lessons
set slides = $gc_v2$[
  { "type": "title",
    "eyebrow": "KS3 · Years 7 to 9 · Module 12",
    "title": "Misinformation, deepfakes and AI content",
    "body": "One hour, one skill: three checks that catch a fake before you believe it or share it.",
    "script": "Settle everyone with this slide up. Today you all become detectives. By the end of the hour you will be able to do something most adults cannot do: catch a fake before it catches you." },

  { "type": "objective",
    "outcome": "I can run three checks before I believe or share something.",
    "why": "Photos, videos and even voices can now be made by a computer, and they look and sound completely real. Nobody can tell by looking anymore, not you, not your teacher, not the news. So today is not about looking harder. It is about three quick questions that do the work your eyes cannot.",
    "gains": [
      "Spot when content might be manufactured, even when it looks perfect",
      "Run the three checks in under a minute on anything in a feed",
      "Give a verdict with a reason: believe, pause, or do not share",
      "Explain why fakes are built to make you feel before you think"
    ],
    "script": "Read the mission out loud, then the why. Ask: hands up if you think YOU could spot a fake video. Keep a rough count. Come back to that count at the end of the lesson." },

  { "type": "keywords",
    "heading": "Detective words for today",
    "words": [
      { "word": "misinformation", "meaning": "False content shared by someone who believes it is true. The sharer is fooled, not lying." },
      { "word": "disinformation", "meaning": "False content made or shared on purpose to trick people. The maker knows it is false." },
      { "word": "deepfake", "meaning": "A face, voice or whole video manufactured by a computer to look and sound like a real person." },
      { "word": "source", "meaning": "Where a claim comes from: who made it and how they know. No source means no way to check." }
    ],
    "script": "Say each word, class repeats it back. The difference between the first two is the whole word: MIS is a mistake, DIS is dishonest. Both spread the same way, and the same three checks catch both." },

  { "type": "choice",
    "question": "Warm up from last lesson. A friend offers you a workaround to get past an age check. What matters most before you decide anything?",
    "options": [
      { "text": "Whether you would get caught", "correct": false, "feedback": "Getting caught is not the real risk. The real risk is what the workaround takes you into: unregulated spaces with none of the protections." },
      { "text": "What the workaround actually exposes you to", "correct": true, "feedback": "Exactly. A workaround does not just skip a rule, it skips every protection behind the rule. That is the risk to weigh." },
      { "text": "Whether everyone else is doing it", "correct": false, "feedback": "Everyone else doing it changes nothing about what it exposes you to. That is the check that matters." }
    ],
    "script": "Retrieval from last lesson, thirty seconds of thinking time before anyone answers. Cold call two pupils for their reasoning, not just their letter." },

  { "type": "video",
    "src": "https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061752_459b1662-1742-4e83-97af-e26c2b0e1688.mp4",
    "caption": "Zara opens the case: real or made?",
    "script": "Play the beat once, full volume. Zara sets the case up in twelve seconds. Do not talk over it." },

  { "type": "scenario",
    "label": "Evidence item one",
    "platform": "feed",
    "handle": "transfer.insider",
    "avatar": "⚽",
    "meta": "3h · Shared 48,200 times",
    "text": "BREAKING: England captain caught on camera saying he is DONE with the national team and wants to play for their biggest rivals. Watch before it gets taken down 👇",
    "image": "🎬",
    "stats": "❤ 89.2K   ↻ 48.2K   💬 12.4K",
    "prompt": "Real or made? Vote now, hands up. Then be honest: how would you actually know?",
    "script": "Run the vote and count the hands for each side. Then the reveal: it does not matter which way the class voted, because nobody in this room can tell by looking. Not you, not me. Let that sit for a second. That discomfort is the lesson starting." },

  { "type": "concept",
    "emoji": "🎭",
    "heading": "Content can be manufactured",
    "body": "Some of what you see online is real. Some is edited. And some is made entirely by a computer: faces, voices, whole events that never happened. The three look identical at first glance. That is not a reason to panic. It is a reason to check, and checking takes under a minute once you know the three questions.",
    "script": "Key move here: kill the panic. This is not everything online is fake, and it is not you cannot trust anything. It is simply that looking is no longer a test. We need a better test, and it is coming on the next video." },

  { "type": "choice",
    "question": "A video shows a famous footballer saying something shocking. It looks completely real. What is the honest position before you check?",
    "options": [
      { "text": "It is probably real, videos are hard to fake", "correct": false, "feedback": "Videos stopped being hard to fake. A voice and a face can now be generated convincingly by widely available tools." },
      { "text": "You cannot tell yet, and that is exactly why you check", "correct": true, "feedback": "Right. Not paranoia, not blind trust. You simply cannot tell by looking anymore, so the checks do the work your eyes cannot." },
      { "text": "It is probably fake, most things online are lies", "correct": false, "feedback": "Most things online are not lies. Assuming everything is fake is as lazy as believing everything. The checks tell you which is which." }
    ],
    "script": "This is the footballer post from evidence item one. Watch for pupils picking the third answer: assuming everything is fake feels streetwise but it is the same laziness as believing everything. Name that if it comes up." },

  { "type": "video",
    "src": "https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061754_66e88fe5-67c2-47ef-aa10-ebbf022ea96a.mp4",
    "caption": "Zara teaches the three checks",
    "script": "The core teaching beat. Zara gives the three checks in ten seconds. Play it twice: once to hear it, once with the class saying the checks along with her." },

  { "type": "diagram",
    "heading": "The three checks",
    "caption": "Three checks, under a minute. Every verdict needs a reason, a verdict without a reason does not count.",
    "steps": [
      { "emoji": "🕵️", "title": "Check one: who made this?", "text": "And how do they know? A name you can follow, or nothing behind the claim?" },
      { "emoji": "🌍", "title": "Check two: what do other places say?", "text": "One post is a claim. Three places agreeing starts to be evidence." },
      { "emoji": "🔥", "title": "Check three: how is it trying to make me feel?", "text": "Big instant feelings are the doorway every fake aims for." }
    ],
    "verdicts": ["Believe", "Pause", "Do not share"],
    "script": "Walk the diagram as it builds. Get the class chanting the three questions back: who made it, what do other places say, how does it want me to feel. Then point at the three verdicts: every check ends in one of these, and pause is a perfectly good verdict when you are not sure." },

  { "type": "scenario",
    "label": "Evidence item two",
    "platform": "feed",
    "handle": "Wellness Truth Daily",
    "avatar": "🧪",
    "meta": "1d · Public group · Shared 118,000 times",
    "text": "Scientists CONFIRM a common breakfast food is slowly harming children. The mainstream media will not report this. Share so every parent sees it!!",
    "image": "🥣",
    "stats": "❤ 231K   ↻ 118K   💬 44K",
    "prompt": "Which check fails first? Thirty seconds with your partner, then verdicts with reasons.",
    "script": "Pair talk, thirty seconds. The answer you are fishing for: check one fails instantly, scientists confirm with no scientist named and no link is a claim with nobody behind it. Bonus if anyone spots the share so every parent sees it line, that is check three firing too. Fakes usually fail more than one check at once." },

  { "type": "choice",
    "question": "A post makes you furious the second you see it. Which check does that feeling trigger?",
    "options": [
      { "text": "Check three: how is it trying to make me feel", "correct": true, "feedback": "Yes. A big instant feeling is not proof something is false, but it is exactly when the other two checks matter most, because you are least likely to run them." },
      { "text": "No check, feelings are not evidence either way", "correct": false, "feedback": "The feeling itself IS the signal to check. Content built to enrage is content built to spread, true or not." },
      { "text": "Check one only", "correct": false, "feedback": "Check one matters too, but the fury is check three firing. That feeling is the tap on the shoulder." }
    ],
    "script": "Whole class on devices or hands for a, b, c. The subtle point to land in feedback: the feeling is not proof of anything, it is a trigger to check. Furious and true both exist." },

  { "type": "choice",
    "question": "A post says scientists confirm a shocking finding. No name, no link, no source. Which check fails first?",
    "options": [
      { "text": "Check one: who made this, and how do they know", "correct": true, "feedback": "Exactly. Scientists confirm, with no scientist named and nothing to follow, fails the first check before you even reach the second." },
      { "text": "Check two: what do other places say", "correct": false, "feedback": "Check two would catch it eventually, but the missing source fails check one immediately. Fastest check first." },
      { "text": "None, it might still be true", "correct": false, "feedback": "It might be true. But a claim with no source has failed a check, and that means pause, not share." }
    ],
    "script": "This is evidence item two formalised. If the pair talk went well this should be near unanimous. If it was not, go back to the diagram slide, the back button works." },

  { "type": "scenario",
    "label": "Evidence item three",
    "platform": "message",
    "handle": "Jay 🏀",
    "avatar": "🏀",
    "meta": "Voice message · 0:42",
    "text": "listen to this 😳 it is DEFINITELY him, you can literally hear his voice, he admits the whole thing",
    "image": "🎧",
    "prompt": "A voice that sounds exactly right, sent by a friend you trust. Does that change which checks we run?",
    "script": "The trap here is the trusted friend. Jay is not lying, Jay is fooled, that is misinformation from your keywords. The checks do not care who delivered the claim or what format it arrived in. A voice is now just another thing a computer can make." },

  { "type": "video",
    "src": "https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_123550_bc3337b7-0b24-4d82-b1e3-965955dd3d1c.mp4",
    "caption": "DiGi Junior half time check in",
    "script": "The star pause. Eight seconds, everyone breathes, then straight into the spread engine." },

  { "type": "diagram",
    "heading": "How a fake travels",
    "caption": "The checks break this loop at step one. That is why check three is the deepfake tell.",
    "steps": [
      { "emoji": "😱", "title": "A big feeling hits", "text": "Fury, fear or wow. The post is engineered to cause it." },
      { "emoji": "👆", "title": "The instant share", "text": "Feelings share fast and check slowly. That is the whole trick." },
      { "emoji": "📈", "title": "The feed boosts it", "text": "Every reaction tells the feed to show it to more people." },
      { "emoji": "🌍", "title": "Millions see it", "text": "Most of them will never check. You are no longer most people." }
    ],
    "script": "Walk the loop as it builds, then ask the class where the weakest link is. Answer: step one, the only step the fake cannot control is whether YOU notice the feeling and check instead of share. The last line on screen is the identity shift of the lesson: you are no longer most people." },

  { "type": "tryit",
    "heading": "Detective practice, on paper",
    "body": "Your teacher has six items on the worksheet: posts, a screenshot chain, and a described video. Run the three checks on each and give a verdict: believe, pause, or do not share. You have fifteen minutes. Verdicts need reasons, a verdict without a reason does not count.",
    "script": "Hand out the worksheet or booklets. Fifteen minutes, bookmark strips on tables for anyone who needs the checks in front of them. Support group works items one to three together with you. Stretch question for early finishers: who benefits when item four spreads? Circulate and collect one great reason to read out." },

  { "type": "choice",
    "question": "Exit check. Your neighbour shares a voice message that sounds exactly like a celebrity confessing to something. What do you now know that most people do not?",
    "options": [
      { "text": "Voices can be generated too, so it faces the same three checks as any post", "correct": true, "feedback": "Right. A voice is now just another thing a computer can make. Same checks, same verdicts." },
      { "text": "Voice messages are more trustworthy than video", "correct": false, "feedback": "Voices are now among the easiest things to fake. The checks do not care what format the claim arrives in." },
      { "text": "If it sounds real it probably is", "correct": false, "feedback": "Sounding real stopped being evidence. That is the whole lesson." }
    ],
    "script": "First of two exit checks. This mirrors evidence item three, so a wrong answer here tells you exactly who to mark as working towards on the register." },

  { "type": "choice",
    "question": "True or false: if a picture was made by AI, it is always a lie.",
    "options": [
      { "text": "False. Made by AI tells you how it was made, not whether it is honest", "correct": true, "feedback": "Exactly right, and this is the honest nuance. AI made content can be labelled, harmless or art. The problem is manufactured content pretending to be real. The checks catch the pretending." },
      { "text": "True. AI content is fake by definition", "correct": false, "feedback": "AI made is a method, not a verdict. The lie is in the pretending, not the making. The checks target the pretending." }
    ],
    "script": "The nuance question, and the one Ofsted style deep dives love: it proves pupils are thinking, not reciting. If someone argues the true side well, celebrate the arguing and then land the distinction: the lie is the pretending, not the making." },

  { "type": "quote",
    "label": "Say it like Zara",
    "text": "Who made it. What do other places say. How is it trying to make me FEEL? Three checks, under a minute, case closed.",
    "script": "Whole class says it together, twice, louder the second time. This is the sentence you want repeated at dinner tables tonight." },

  { "type": "video",
    "src": "https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061806_129f9d14-d174-4444-8de3-e080bdbd52cb.mp4",
    "caption": "Your mission: check before you share",
    "script": "Zara sets the mission. After the beat, every pupil writes their commitment on the exit card: one thing in their own feed this week they will run the checks on before sharing." },

  { "type": "recap",
    "heading": "What to remember",
    "points": [
      "You cannot tell real from made by looking anymore. The checks do what your eyes cannot.",
      "The three checks: who made this and how do they know, what do other places say, how is it trying to make me feel.",
      "A big instant feeling is the signal to check, because content built for feelings spreads fastest.",
      "Made by AI is a method, not a verdict. The lie is the pretending, and the checks catch it."
    ],
    "script": "Return to the hands up count from the start of the lesson: who thought they could spot a fake by looking? Ask it again now and let the room notice what changed. Then the recap, read by pupils, one point each." },

  { "type": "digi",
    "heading": "DiGi closes the case",
    "lines": [
      "Case closed, detectives! ⭐",
      "Three checks, under a minute: who made it, what do other places say, and how is it trying to make me FEEL?",
      "Your mission this week: run the checks on one thing in your own feed before you share it. Anything. Every check makes you sharper.",
      "Most people scroll and share without thinking. You are no longer most people. See you next lesson!"
    ],
    "script": "Let DiGi land the ending, the bubbles appear on their own. Exit quizzes go out as this plays, named copies from the print room. Collect them in, they are your evidence for the register." }
]$gc_v2$::jsonb
where module_id = 'ks3-12-misinfo-deepfakes';
