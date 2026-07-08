-- 033: THE FULL CURRICULUM. All 20 remaining modules seeded as complete
-- lessons: v3 slide decks (teacher script on every slide, phases and
-- timings, scenarios, diagrams, discussions, DiGi closings), full teacher
-- notes (misconceptions, differentiation, worksheet, bookmark tool),
-- parent notes, and DSL notes where safeguarding flagged. Video beats are
-- empty arrays until the Higgsfield render pass. Idempotent: on conflict
-- updates. Dashboard safe: no DO blocks, all content dollar quoted.

-- Module 1: Screens and kindness, real and not real
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'eyfs-01-screens-kindness', 'Screens and kindness, real and not real', 'EYFS', 'Reception', 'teacher',
  '{1,6}'::int[], ARRAY['EYFS PSED','RSHE foundations']::text[], ARRAY['Engage with AI']::text[],
  'EYSTAG under 5s screen report', 'I can ask a grown up if something on a screen is real.', 'Sofia with DiGi Junior', 1,
  $m01$[
 {
  "type": "title",
  "eyebrow": "EYFS · Reception · Module 1",
  "title": "Screens and kindness, real and not real",
  "body": "Our very first screen lesson with Sofia and DiGi Junior. Some things on a screen are real. Some are made up. And we always have a grown up to ask.",
  "script": "Gather everyone on the carpet with this slide up. Say: today we meet two new friends. Sofia is our gentle guide, and DiGi Junior is a small golden star who loves to pause and breathe. They are going to help us learn something special about screens. Wiggle fingers like twinkling stars to say hello to DiGi Junior.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can ask a grown up if something on a screen is real.",
  "why": "Screens show us wonderful things, and some of them are real while some are made up. We do not have to work it out on our own, because asking a grown up is always allowed and always clever.",
  "gains": [
   "Say that some things on a screen are real and some are made up",
   "Know that a computer can make a picture of something that never happened",
   "Do the star pause: stop, look, ask a grown up",
   "Know that asking a grown up is clever, never naughty"
  ],
  "script": "Read the big sentence out loud, then have the class say it back to you: I can ask a grown up if something on a screen is real. Say: asking is not for babies. Asking is what clever people do. Even teachers ask other grown ups sometimes. Ask: who likes watching things on a screen? Let hands go up, smile, everyone does, and that is lovely. Today we learn how to watch in a kind and clever way.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Our three special words",
  "words": [
   {
    "word": "real",
    "meaning": "Something that can really happen in our world. A photo of your class is real."
   },
   {
    "word": "made up",
    "meaning": "Something from imagination, like a dragon in a story. Made up things are lovely, they are just not real."
   },
   {
    "word": "screen",
    "meaning": "The part of a phone, a tablet or the telly where the pictures live."
   }
  ],
  "script": "Say each word slowly and have the class repeat it twice. For real, point at something in the room: the door is real, you are real. For made up, ask: is a dragon real or made up? Made up, and that is fine, we love dragons in stories. For screen, ask children to draw a screen shape in the air with their fingers. Do not rush this slide, these three words carry the whole lesson.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "Warm up! You want to watch something on the telly at home. What is a lovely first thing to do?",
  "options": [
   {
    "text": "Ask a grown up to come and watch with you",
    "correct": true,
    "feedback": "Yes! Screens are cosier when we share them. A grown up next to you makes watching warmer and safer, like a story at bedtime."
   },
   {
    "text": "Watch on your own with the sound up loud",
    "correct": false,
    "feedback": "You are not in trouble for picking this one. But watching is nicer with a grown up close by, because then you always have someone to ask."
   }
  ],
  "script": "This is our warm up, there is no last lesson to remember because this is our very first one. Read both choices out loud with actions: cup your ear for the loud one, pat the seat next to you for the grown up one. Take a class vote with hands up. Whatever they choose, keep it warm, nobody is naughty for watching on their own, we are just learning that sharing a screen is cosier. Ask one or two children: who do you like watching things with at home?",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🖍️",
  "heading": "Real and made up",
  "body": "Some things on a screen are real, like a photo of your class. Some things are made up, like a dragon in a cartoon. And here is the surprising bit: a computer can make a picture of something that never happened at all. Made up is not naughty, stories are wonderful. We just like to know which is which, and we never have to work it out alone.",
  "script": "Read the slide slowly, one sentence at a time. After the computer sentence, pause and say: imagine a picture of an elephant wearing pyjamas and jumping on a bed. Did that really happen? No! But a computer could make a picture of it that looks ever so real. Let the giggles happen, the giggle is the learning. Then land the warm bit: made up things are not bad. Cartoons are made up and we love them. We just like to know what is real and what is made up, and we have grown ups to help us.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "diagram",
  "heading": "Stop, look, ask a grown up",
  "caption": "Our special tool. DiGi Junior does the star pause at Stop, and you can too.",
  "steps": [
   {
    "emoji": "✋",
    "title": "Stop",
    "text": "Pause like DiGi Junior. Take one big star breath. You do not have to decide on your own."
   },
   {
    "emoji": "👀",
    "title": "Look",
    "text": "Look carefully. Could this really happen in our world?"
   },
   {
    "emoji": "🙋",
    "title": "Ask a grown up",
    "text": "Say: is this real? Grown ups love being asked."
   }
  ],
  "verdicts": [
   "Real",
   "Made up",
   "Ask a grown up"
  ],
  "script": "This is the heart of the lesson, take your time. Teach each step with a whole body action. Stop: hand up like a big star, and here is where DiGi Junior does the star pause, stretch your arms and legs out wide like a star and take one big slow breath in and out together. Look: binoculars with your hands. Ask a grown up: hand up high like asking a question. Practise the three actions in a row three times, getting faster and sillier each time, then once more slowly and calmly. Point at the three answer words at the bottom: real, made up, or ask a grown up. Asking is always a good answer.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "discussion",
  "prompt": "Who is a grown up YOU could ask: is this real? Think of someone at home and someone at school.",
  "mode": "class",
  "seconds": 60,
  "lookFor": "Every child names at least one trusted grown up. Listen for a home name and a school name. The win is every child knowing they have someone.",
  "script": "Whole class circle talk with the timer on screen. Say: close your eyes for a moment. Picture a grown up at home you could ask. Now picture a grown up at school. Open your eyes. Go around the circle or take popcorn answers: mummy, daddy, nanny, grandad, a childminder, me, our teaching assistant. Repeat each name back warmly. If a child cannot think of anyone, gently offer: I am one of your asking grown ups, always. End with: every single one of us has a grown up to ask. That is the magic of this lesson.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "tryit",
  "heading": "Circle time practice",
  "body": "Your teacher will read six things you might see on a screen. For each one, do the star pause, then circle your answer on the sheet: Real, Made up, or Ask a grown up. Asking is always a good answer.",
  "script": "Hand out the circle sheets and chunky crayons, or run it fully on the carpet with hands up if that suits your class better. Read each of the six items from the teacher notes slowly, twice. Before each answer, do the star pause together: stop, look, ask. Children circle the smiley face under Real, Made up, or Ask a grown up. Support: sit alongside children who need help and let them point instead of circle. Stretch: ask early finishers to tell you one real thing and one made up thing they have seen on a screen.",
  "phase": "practise",
  "minutes": 6
 },
 {
  "type": "choice",
  "question": "You see a picture on a screen of a cat driving a bus. What can you do?",
  "options": [
   {
    "text": "Stop, look, and ask a grown up if it is real",
    "correct": true,
    "feedback": "Yes! That is our special tool. A cat driving a bus is very silly and probably made up, and asking a grown up is how we find out for sure."
   },
   {
    "text": "Believe it straight away because you can see it",
    "correct": false,
    "feedback": "It is on the screen, but that does not make it real. A computer can make pictures of things that never happened. That is why we ask a grown up."
   }
  ],
  "script": "This is the first of our two big finish questions, so every child answers. Read the question with delight: a cat! Driving a bus! Read both choices with actions, then hands up to vote. Ask one child why they chose asking. Land the point: seeing something on a screen does not make it real. Our eyes cannot always tell, but our grown ups can help.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Can a computer make a picture of something that never happened?",
  "options": [
   {
    "text": "Yes, so we ask a grown up if a picture is real",
    "correct": true,
    "feedback": "Yes it can! That is why our tool is so special. When we are not sure, we stop, look, and ask a grown up."
   },
   {
    "text": "No, pictures on a screen are always real",
    "correct": false,
    "feedback": "A computer really can make a picture of something that never happened, like our elephant in pyjamas. That is why asking a grown up is so clever."
   }
  ],
  "script": "The second big finish question. Remind them of the elephant in pyjamas before you read the choices, watch the faces light up remembering it. Vote with hands, then have the whole class say the answer sentence together: yes, so we ask a grown up. These two questions tell you who has the idea and who needs a little more practice at snack time tomorrow.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Sofia",
  "text": "Stop! Look! Ask a grown up: is this real?",
  "script": "Sofia's special sentence. Say it together with the actions: star hand for stop, binoculars for look, hand up high for ask. Say it three times, first in a whisper, then in a talking voice, then big and proud. This is the sentence you want them singing to their grown ups at home time.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "digi",
  "heading": "DiGi Junior says goodbye",
  "lines": [
   "Star pause with me! Arms out wide, one big breath in, and out. Lovely. ⭐",
   "Remember: some things on a screen are real, some are made up, and a computer can even make pictures. Tricky!",
   "So when you are not sure, you know just what to do. Stop! Look! Ask a grown up!",
   "You have grown ups who love being asked. See you next time, little stars!"
  ],
  "script": "Let DiGi Junior land the ending, the lines appear on their own. Do the star pause with the class one last time as the first line comes up: arms and legs wide like a star, one slow breath. Send the parent note home in book bags today so families hear the chant tonight. Wave goodbye to DiGi Junior with twinkling star fingers.",
  "phase": "close",
  "minutes": 1
 }
]$m01$::jsonb,
  '[]'::jsonb,
  $m01${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 0,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m01$::jsonb,
  $m01${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today we learned that some things on a screen are real, some are made up, and a computer can even make pictures of things that never happened. Your child learned a little tool for when they are not sure: Stop, look, ask a grown up.",
 "try_this": "Watch something together this week and pause it once. Ask: is this real or made up? Then let your child ask you the same question about something else on the screen.",
 "family_question": "Can you teach me the star pause? Show me Stop, look, ask a grown up.",
 "no_login_required": true
}$m01$::jsonb,
  $m01${
 "learning_objective": "Pupils can say that some things on a screen are real and some are made up, and use the tool Stop, look, ask a grown up when they are not sure.",
 "timing": "30 minutes: starter 8, teaching 10, circle time practice 6, prove 4, close 2",
 "misconceptions": [
  "Everything on a screen is real (some things are made up, and a computer can make a picture of something that never happened)",
  "Made up things are bad or naughty (stories and cartoons are made up and they are lovely, we just like to know which is which)",
  "Asking a grown up means you are in trouble (asking is clever and kind, and grown ups love being asked)"
 ],
 "differentiation": {
  "support": "Children answer with the three body actions instead of words, and point at faces on the circle sheet rather than circling. Sit alongside and model the star pause before each item.",
  "stretch": "Ask children to give their own example of one real thing and one made up thing they have seen on a screen, and to say how they would find out for sure."
 },
 "paper_fallback": "The whole lesson runs as carpet circle time with no screen at all. Teach the three special words with actions, tell the elephant in pyjamas story out loud, teach the three step tool with body actions, run the who is your grown up circle talk, read the six circle sheet items aloud, do the two finish questions as hands up votes, and end with the chant and the star pause.",
 "keywords": [
  {
   "word": "real",
   "definition": "Something that can really happen in our world. A photo of your class is real."
  },
  {
   "word": "made up",
   "definition": "Something from imagination, like a dragon in a story. Made up things are lovely, they are just not real."
  },
  {
   "word": "screen",
   "definition": "The part of a phone, a tablet or the telly where the pictures live."
  }
 ],
 "tool": {
  "heading": "Stop, look, ask a grown up",
  "lines": [
   "Stop",
   "Look",
   "Ask a grown up"
  ],
  "strapline": "Is this real? Asking is clever."
 },
 "worksheet": {
  "title": "Real or made up?",
  "directions": "Your teacher reads each one aloud, then you circle Real, Made up, or Ask a grown up.",
  "verdict_options": [
   "Real",
   "Made up",
   "Ask a grown up"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "A photo of your class on a school trip, with your teacher in it.",
   "expected_verdict": "Real",
   "teaching_point": "Photos of things we were actually there for are real. Recognising real builds the contrast for everything else."
  },
  {
   "n": 2,
   "item": "A cartoon dragon breathing rainbow fire over a castle.",
   "expected_verdict": "Made up",
   "teaching_point": "Cartoons are made up on purpose and that is lovely. Made up is not the same as naughty."
  },
  {
   "n": 3,
   "item": "A picture of an elephant wearing pyjamas and jumping on a bed.",
   "expected_verdict": "Made up",
   "teaching_point": "The lesson's own example applied. A computer can make a picture like this even though it never happened."
  },
  {
   "n": 4,
   "item": "A video of a cat playing the piano and singing a song with your name in it.",
   "expected_verdict": "Ask a grown up",
   "teaching_point": "Some things could be real or could be made by a computer, and our eyes cannot tell. When we are not sure, asking is the answer."
  },
  {
   "n": 5,
   "item": "A picture of a great big spider that looks very real and makes your tummy feel wobbly.",
   "expected_verdict": "Ask a grown up",
   "teaching_point": "A big wobbly feeling is exactly the moment to find a grown up. They can tell us if it is real and help the feeling feel smaller."
  },
  {
   "n": 6,
   "item": "DiGi Junior says: I saw a picture of a snowman on a sunny hot beach. It must be real, because I saw it on the screen! Do you agree with DiGi Junior? Tell us why.",
   "expected_verdict": "Made up",
   "teaching_point": "Seeing something on a screen does not make it real, a computer can make pictures. Listen for children explaining this back in their own words, that is the outcome met."
  }
 ],
 "commitment_stem": "My commitment: when I am not sure if something on a screen is real, I will ask my grown up called"
}$m01$::jsonb,
  $m01${
 "required": false
}$m01$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 2: Kind screens, calm bodies
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks1-02-kind-screens-calm-bodies', 'Kind screens, calm bodies', 'KS1', 'Years 1 to 2', 'teacher',
  '{4,6}'::int[], ARRAY['RSHE health and wellbeing','EfCW']::text[], '{}'::text[],
  'Wellbeing baseline research', 'I can name how I feel after screen time and tell a grown up.', 'Sofia', 2,
  $m02$[
 {
  "type": "title",
  "eyebrow": "KS1 · Years 1 to 2 · Module 2",
  "title": "Kind screens, calm bodies",
  "body": "Today we find out how screens make our bodies and our feelings feel, and we learn what to do with a big feeling.",
  "script": "Have this slide up as everyone sits on the carpet or at tables. Say: today we are going to become feelings experts. Screens can give us all sorts of feelings, happy ones, wiggly ones, even grumpy ones. By home time you will know exactly what to do with every single one.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can name how I feel after screen time and tell a grown up.",
  "why": "Screens can make our bodies feel all sorts of ways: wiggly, tired, grumpy or happy. When we can name the feeling and tell a grown up, the grown up can help us, and the big feeling gets smaller.",
  "gains": [
   "Notice what my body is telling me after screen time",
   "Use feeling words like wiggly, tired, grumpy and happy",
   "Be kind to other people on screens",
   "Know exactly who to tell when something on a screen feels bad"
  ],
  "script": "Read the I can sentence together, twice. Then ask: hands up if a screen has ever made you feel really happy. Now hands up if a screen has ever made you feel a bit grumpy or wiggly. Look, nearly every hand went up both times. That is because screens give everybody feelings. Today we learn what to do with them.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Our feeling words today",
  "words": [
   {
    "word": "wiggly",
    "meaning": "When your body cannot sit still and wants to jump about. Screens can make bodies feel wiggly."
   },
   {
    "word": "grumpy",
    "meaning": "A cross, growly feeling inside. It can pop up when screen time stops or goes on too long."
   },
   {
    "word": "calm",
    "meaning": "When your body feels quiet and comfy, like after a big stretch or a story."
   },
   {
    "word": "tell",
    "meaning": "Using your words to let a grown up know how you feel or what happened. Telling is brave, not naughty."
   }
  ],
  "script": "Say each word and do an action together: wiggle for wiggly, cross arms and frown for grumpy, big slow breath for calm, hand up to your mouth like sharing a secret with a grown up for tell. Land the last one hard: telling a grown up about a feeling is always brave and never naughty.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Remember our last lesson with Sofia. You see something on a screen and you are not sure if it is real. What do we do?",
  "options": [
   {
    "text": "Ask a grown up if it is real",
    "correct": true,
    "feedback": "Yes! That is our Sofia rule from last time. Grown ups help us work out what is real, and today they are going to help us with feelings too."
   },
   {
    "text": "Just believe it",
    "correct": false,
    "feedback": "Careful! Screens can show things that are not real. Our rule is to ask a grown up first, and that rule is going to help us again today."
   },
   {
    "text": "Keep it to yourself",
    "correct": false,
    "feedback": "Keeping it to yourself leaves you all alone with the puzzle. Asking a grown up is the strong move, last lesson and this one."
   }
  ],
  "script": "This is our remembering question from last lesson. Give ten seconds of quiet thinking, then vote with fingers, one, two or three. Take one answer with a reason. Then bridge to today: last time grown ups helped us with what is REAL. Today grown ups help us with how we FEEL. Same helpers, new job.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🫧",
  "heading": "Screens give our bodies feelings",
  "body": "Screens can be lovely. A funny video can make us giggle and feel happy. But screens can change our bodies too. After lots of screen time, some bodies feel wiggly and cannot sit still. Some feel tired and rubbery. Some feel grumpy when the screen goes off. None of these feelings are naughty. They are just our body talking to us, and clever children learn to listen.",
  "script": "Teach this slowly and act it out. Say: sometimes after lots of tablet time my body feels wiggly, show me your best wiggly body. Sometimes it feels tired, show me tired. Sometimes when the screen goes off, whoosh, a grumpy feeling arrives, show me grumpy faces. Then the key sentence, say it warmly: none of those feelings are naughty. Your body is just talking to you. Our job is to listen to it.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "diagram",
  "heading": "Sofia's three steps",
  "caption": "Sofia is our gentle green guide. When a feeling arrives after screen time, we do her three steps.",
  "steps": [
   {
    "emoji": "🫀",
    "title": "Feel it",
    "text": "Stop and notice your body. Is it wiggly, tired, grumpy or happy?"
   },
   {
    "emoji": "💬",
    "title": "Name it",
    "text": "Say the feeling word out loud. I feel grumpy. I feel wiggly."
   },
   {
    "emoji": "🤝",
    "title": "Tell a grown up",
    "text": "Find your grown up and tell them the feeling. They can always help."
   }
  ],
  "verdicts": [
   "Keep enjoying",
   "Take a break",
   "Tell a grown up"
  ],
  "script": "Walk the three steps as they appear, with actions: hand on tummy for feel it, hand by your mouth for name it, hand stretched out for tell a grown up. Then chant it together three times, a little louder each time: feel it, name it, tell a grown up. Point at the three choices at the bottom: sometimes the answer is keep enjoying, because happy is a feeling too. Sometimes it is take a break. And if the feeling is a bad one, it is always tell a grown up.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "scenario",
  "label": "Sofia's story",
  "platform": "message",
  "handle": "Milo 🐸",
  "avatar": "🐸",
  "meta": "Game chat · just now",
  "text": "you are RUBBISH at this game!! go away and never play again",
  "image": "🎮",
  "prompt": "Poppy got this message in her game. How do you think her tummy feels? What should Poppy do next?",
  "script": "Read the message in a flat voice, not a scary one. Ask: how do you think Poppy's tummy feels right now? Take feeling words: sad, yucky, wobbly, scared. All good answers. Then ask: is this a kind message? No. So what are Sofia's three steps? Feel it, name it, tell a grown up. Poppy tells her grown up and the grown up sorts it out. And one more thing: WE never send messages like this. On screens we use the same kind words we use in the classroom. Screen words are still real words and they can still hurt.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "prompt": "Who is a grown up YOU could tell if a screen made you feel bad? Tell your partner their name.",
  "mode": "pairs",
  "seconds": 60,
  "lookFor": "Every child naming at least one real grown up: mum, dad, nana, teacher, childminder. Gently help anyone who cannot think of one, and remind them teachers always count.",
  "script": "Turn to your talk partner. You have one minute on the timer. I want to hear real names: mummy, grandad, Miss Khan. Ready, go. While they talk, listen out for any child who cannot name anyone and quietly tell them: I am one of your grown ups, you can always tell me. After the chime, take five or six names and celebrate every single one. The message: you all have telling grown ups, and now you know exactly who yours are.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "tryit",
  "heading": "Feelings detective time",
  "body": "Your worksheet has six little stories about children and screens. For each one, look at the picture, think about how the child's body feels, and circle what they should do: keep enjoying, take a break, or tell a grown up. Then draw your own grown up in the box at the bottom.",
  "script": "Hand out the worksheets. Read each story aloud to the class one at a time, that is how this age group works best, and give thinking time before they circle. Support table works with you and just circles. Everyone finishes by drawing their telling grown up in the box and writing or copying their name. Early finishers add a speech bubble showing what they would say to their grown up. Circulate and collect one lovely answer to share.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "You have watched videos for a long time. Now your body feels wiggly and grumpy. What are Sofia's three steps?",
  "options": [
   {
    "text": "Feel it, name it, tell a grown up",
    "correct": true,
    "feedback": "That is it! Notice the feeling, say its name, and tell your grown up. They can help your body feel calm again."
   },
   {
    "text": "Keep watching and hope the feeling goes away",
    "correct": false,
    "feedback": "More watching usually makes wiggly and grumpy feelings bigger, not smaller. Sofia says feel it, name it, tell a grown up."
   },
   {
    "text": "Have a cry and tell nobody",
    "correct": false,
    "feedback": "Crying is allowed, feelings are never naughty. But keeping it secret means nobody can help. Tell your grown up and the feeling gets smaller."
   }
  ],
  "script": "First quiz question, this one is on the printed exit sheet too. Read it aloud, read all three answers aloud, then everyone circles on their sheet or votes with fingers. The wrong answers matter here: keeping feelings secret is the habit we are trying to replace, so give the feedback lines warmly and fully.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Something on a screen makes you feel scared or yucky inside. Who do you tell?",
  "options": [
   {
    "text": "A grown up I trust, straight away",
    "correct": true,
    "feedback": "Yes. Straight away, even if you are worried you did something wrong. You are never in trouble for telling about a feeling."
   },
   {
    "text": "Nobody, I keep it a secret",
    "correct": false,
    "feedback": "Secrets make yucky feelings grow bigger. Telling a grown up makes them smaller. Telling is brave, not naughty."
   },
   {
    "text": "Only my friend, and we keep it between us",
    "correct": false,
    "feedback": "Friends are lovely but they are small like us and cannot fix it. This job needs a grown up. Tell your friend AND a grown up."
   }
  ],
  "script": "Second quiz question, same routine. Land the most important sentence of the whole lesson after the answer: you are NEVER in trouble for telling a grown up about a feeling, even if you think you did something wrong. Say it twice. If any child shares something worrying here or during the lesson, listen calmly, thank them for telling you, and follow your school safeguarding policy.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Sofia",
  "text": "Feel it. Name it. Tell a grown up. My feelings matter, big and small!",
  "script": "Sofia's chant, all together with the actions: hand on tummy, hand by mouth, hand stretched out, then arms wide for my feelings matter. Do it three times, tiny voice, normal voice, big voice. This is the sentence you want them singing in the corridor.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What we know now",
  "points": [
   "Screens give our bodies feelings: wiggly, tired, grumpy and happy. None of them are naughty.",
   "Sofia's three steps: feel it, name it, tell a grown up.",
   "On screens we use kind words, because screen words are real words.",
   "If something on a screen feels bad or yucky, we tell a grown up straight away, and we are never in trouble for telling."
  ],
  "script": "Choose four children to read one point each, or read them together as a class. After the last point, ask the whole class: are you ever in trouble for telling a grown up about a feeling? Wait for the big NO. That is the answer you want going home in every book bag.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "digi",
  "heading": "DiGi Junior says goodbye",
  "lines": [
   "Hello superstars! ⭐ Did you hear? You are feelings experts now!",
   "Sofia taught you her three steps: feel it, name it, tell a grown up. Easy peasy!",
   "Tonight, after your screen time, try it once. Notice your body, say the feeling word, and tell your grown up. They will be SO proud.",
   "Remember, your feelings matter, big and small. See you next time, superstars! ⭐"
  ],
  "script": "Let DiGi Junior land the ending, the speech bubbles appear on their own. While it plays, hand out the exit sheets to go home in book bags with the parent note. Wave goodbye to DiGi Junior together, they love it, and it seals the lesson.",
  "phase": "close",
  "minutes": 2
 }
]$m02$::jsonb,
  '[]'::jsonb,
  $m02${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 0,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m02$::jsonb,
  $m02${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned that screens give our bodies feelings, wiggly, tired, grumpy and happy, and that none of those feelings are naughty. They learned Sofia's three steps: feel it, name it, tell a grown up, especially if something on a screen ever feels bad or scary.",
 "try_this": "Tonight, after screen time ends, ask your child to do Sofia's steps with you: notice their body, say the feeling word, and tell you how they feel. Thank them warmly for telling, whatever the feeling is.",
 "family_question": "How does your body feel when the screen goes off, and what feeling word would you give it?",
 "no_login_required": true
}$m02$::jsonb,
  $m02${
 "learning_objective": "Pupils can name how their body and mood feel after screen time using simple feeling words, and know to tell a trusted grown up, especially when something on a screen feels bad.",
 "timing": "39 minutes: starter 8, cycle one 7, cycle two 6, practise 10, prove 4, close 4",
 "misconceptions": [
  "Telling a grown up about something on a screen is telling tales (telling about a feeling or something scary keeps you safe, telling tales is trying to get someone into trouble, they are completely different)",
  "Screens are bad and screen feelings mean I did something wrong (screens can make us happy too, feelings after screen time are normal body signals, the skill is noticing and naming them, not avoiding screens)",
  "If something yucky appears on my screen I will be in trouble for seeing it (children are never in trouble for what appears or for telling, say this out loud during the lesson, it is the single most important safeguarding message at this age)"
 ],
 "differentiation": {
  "support": "Pair the four feeling words with the four actions every time they come up. During the worksheet, work with the support table and read every item twice, letting children point before they circle. Accept pointing at the feelings faces as a full answer.",
  "stretch": "Ask stretch children to add a second feeling word to each worksheet story (a body word and a mood word), and to explain the difference between telling tales and telling to stay safe in their own words."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Read the Sofia story and the game chat message aloud from the script, draw the three steps on the board as three boxes with the actions, run the partner talk with a sand timer, then the worksheet and the two exit questions read aloud. The chant needs no screen at all.",
 "keywords": [
  {
   "word": "wiggly",
   "definition": "When your body cannot sit still and wants to jump about. Screens can make bodies feel wiggly."
  },
  {
   "word": "grumpy",
   "definition": "A cross, growly feeling inside. It can pop up when screen time stops or goes on too long."
  },
  {
   "word": "calm",
   "definition": "When your body feels quiet and comfy, like after a big stretch or a story."
  },
  {
   "word": "tell",
   "definition": "Using your words to let a grown up know how you feel or what happened. Telling is brave, not naughty."
  }
 ],
 "tool": {
  "heading": "Sofia's three steps",
  "lines": [
   "Feel it",
   "Name it",
   "Tell a grown up"
  ],
  "strapline": "My feelings matter, big and small"
 },
 "worksheet": {
  "title": "Feelings detective",
  "directions": "Listen to each story, think about how the child feels, and circle what they should do.",
  "verdict_options": [
   "Keep enjoying",
   "Take a break",
   "Tell a grown up"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "Ben is watching a funny animal video with his dad. They are both giggling and Ben feels happy and cosy.",
   "expected_verdict": "Keep enjoying",
   "teaching_point": "Recognise: happy is a feeling too. Screens with a grown up, feeling good, is exactly right. Not every screen feeling needs fixing."
  },
  {
   "n": 2,
   "item": "Amara has been on the tablet a long time. Her legs feel wiggly, her eyes feel tired, and she is starting to feel grumpy.",
   "expected_verdict": "Take a break",
   "teaching_point": "Recognise: wiggly plus tired plus grumpy is the body saying enough for now. A break, a stretch and a drink helps the body feel calm again."
  },
  {
   "n": 3,
   "item": "A scary picture pops up on Leo's screen. His tummy feels yucky and his heart goes fast.",
   "expected_verdict": "Tell a grown up",
   "teaching_point": "Apply: yucky tummy and fast heart are big bad feeling signals. Sofia's steps end with tell a grown up, straight away, and Leo is not in trouble."
  },
  {
   "n": 4,
   "item": "Someone in Priya's game writes: you are rubbish, go away. Priya feels sad and wobbly inside.",
   "expected_verdict": "Tell a grown up",
   "teaching_point": "Apply: unkind screen words are real words and they hurt. Telling a grown up gets help, and we never write messages like that ourselves."
  },
  {
   "n": 5,
   "item": "The screen goes off for dinner and Sam feels a big grumpy feeling arrive. He wants to shout.",
   "expected_verdict": "Take a break",
   "teaching_point": "Apply: the grumpy feeling when screens stop is normal and not naughty. Feel it, name it out loud, and the break plus dinner helps it shrink."
  },
  {
   "n": 6,
   "item": "Milo says: if a screen makes me feel yucky, I should keep it a secret so I do not get in trouble. Do you agree with Milo? Tell your teacher why or why not.",
   "expected_verdict": "Tell a grown up",
   "teaching_point": "Explain: the key misconception, said out loud. Secrets make yucky feelings grow, telling makes them shrink, and you are never in trouble for telling."
  }
 ],
 "commitment_stem": "My commitment: after screen time I will feel it, name it, and tell my grown up, whose name is ..."
}$m02$::jsonb,
  $m02${
 "required": true,
 "note": "This lesson invites children to name bad feelings linked to screens and repeatedly tells them they are never in trouble for telling. That framing can surface disclosures about frightening content, unkind messages or contact online. If a child discloses during the lesson or worksheet, listen calmly, thank them for telling, do not promise secrecy, and follow the school safeguarding policy. Log any concern on the school concern form.",
 "concern_form_linked": true
}$m02$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 3: Real, pretend, or made by a computer
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks1-03-real-pretend-computer', 'Real, pretend, or made by a computer', 'KS1', 'Years 1 to 2', 'teacher',
  '{5}'::int[], ARRAY['EfCW managing online information']::text[], ARRAY['Engage with AI']::text[],
  'AILit Engage with AI domain', 'I can spot that a picture might not be real.', 'Zara with DiGi Junior', 3,
  $m03$[
 {
  "type": "title",
  "eyebrow": "KS1 · Years 1 to 2 · Module 3",
  "title": "Real, pretend, or made by a computer",
  "body": "Today we become picture detectives. Some pictures are real, some are pretend, and some are made by a computer. Can you tell which is which?",
  "script": "Settle everyone with this slide up. Big smile, big mystery voice: detectives, we have a brand new case today. It is all about pictures. Hold up an imaginary magnifying glass and get the class to hold theirs up too. Zara the detective and DiGi Junior are going to help us crack it.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can spot that a picture might not be real.",
  "why": "Computers can now make pictures of things that never happened, like a dog on the moon or a purple elephant. That is not scary, it can be really fun, but a good detective knows a picture might be tricking them before they believe it.",
  "gains": [
   "Sort pictures into real, pretend, or computer made",
   "Spot clues that a picture might be made up",
   "Say the detective question out loud before believing a picture",
   "Know that made up pictures can be fun and are nothing to be scared of"
  ],
  "script": "Read the outcome together, everyone points at themselves and says I can spot that a picture might not be real. Then ask: has anyone ever seen a picture of something really silly, like an animal doing something animals cannot do? Take two hands. Tell them: by home time, you will know exactly what to ask when you see one.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Detective words for today",
  "words": [
   {
    "word": "real",
    "meaning": "Something that truly happened. A photo of your birthday cake is real."
   },
   {
    "word": "pretend",
    "meaning": "Made up for fun, like a cartoon or a story. Pretend is playing, not lying."
   },
   {
    "word": "computer made",
    "meaning": "A picture a computer invented. It can look just like a photo, but the thing never happened."
   }
  ],
  "script": "Say each word, class repeats it back with an action: real gets a thumbs up, pretend gets jazz hands, computer made gets robot arms. Do the round twice, faster the second time. Land the big idea gently: a computer made picture can look exactly like a real photo. That is why detectives ask instead of just looking.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "Warm up from last lesson. You have been watching videos and your tummy feels cross and wobbly. What does a screen time detective do?",
  "options": [
   {
    "text": "Keep watching and hope the feeling goes away",
    "correct": false,
    "feedback": "Keeping going usually makes the wobbly feeling bigger. Detectives notice the feeling first."
   },
   {
    "text": "Name the feeling and tell a grown up",
    "correct": true,
    "feedback": "Yes! Name it and tell a grown up. That was our last case and you cracked it."
   },
   {
    "text": "Hide the feeling because feelings are silly",
    "correct": false,
    "feedback": "Feelings are never silly. Naming them and telling a grown up is the strong move."
   }
  ],
  "script": "Retrieval from last lesson. Read all three out loud, then hands up for each one. Ask one pupil who chose the middle answer: who is YOUR grown up you would tell? Celebrate the answer. Then bridge: today we get a brand new detective question, and it is about pictures.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🖼️",
  "heading": "Three kinds of pictures",
  "body": "Every picture you ever see is one of three kinds. Real pictures show things that truly happened, like a photo of your class trip. Pretend pictures are made up for fun, like a cartoon mouse driving a racing car. And computer made pictures are invented by a computer, and here is the tricky bit: they can look exactly like real photos. A computer can make a picture of a dog on the moon even though no dog has ever been to the moon.",
  "script": "Teach this slowly with the three actions from the keywords: thumbs up, jazz hands, robot arms. The key move is to keep it light. Say: is a computer made picture naughty? No! It can be brilliant fun. I could ask a computer for a picture of our whole class riding dinosaurs and we would all laugh. The only trick is knowing it might not be real. Fun is fine, being tricked is not.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "feed",
  "handle": "amazing.animal.pics",
  "avatar": "🐶",
  "meta": "2h · Everyone is sharing this",
  "text": "WOW!! This little dog went all the way to the MOON! 🚀 Look at his tiny space helmet! Share so everyone sees it!",
  "image": "🌕",
  "stats": "❤ 12.3K   ↻ 4.1K   💬 890",
  "prompt": "Detectives, look closely. Real, pretend, or computer made? Hands up for your answer!",
  "script": "Read the post in your best excited internet voice, then run the vote: thumbs up for real, jazz hands for pretend, robot arms for computer made. Then investigate together: could a little dog really go to the moon? Where would he get a space helmet that tiny? Let the class do the reasoning. Land the verdict: computer made! It LOOKS like a photo, but no dog has ever been to the moon. And notice, nobody cried, we laughed. Made up pictures can be funny, we just do not want to be tricked by them.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "diagram",
  "heading": "The detective question",
  "caption": "Real, pretend, or computer made? Ask before you believe.",
  "steps": [
   {
    "emoji": "👀",
    "title": "Stop and look",
    "text": "Could this really happen? A dog on the moon? A purple elephant? Silly clues mean look harder."
   },
   {
    "emoji": "🔍",
    "title": "Ask the question",
    "text": "Say it out loud: real, pretend, or computer made?"
   },
   {
    "emoji": "🧑",
    "title": "Check with a grown up",
    "text": "Not sure? Detectives ask for help. A grown up can help you find out."
   }
  ],
  "verdicts": [
   "Real",
   "Pretend",
   "Computer made"
  ],
  "script": "This is the tool of the whole lesson, so take your time. Walk each step as it appears with the actions: eyes for stop and look, magnifying glass for ask the question, hand up high for check with a grown up. Then chant the detective question together three times: real, pretend, or computer made? Ask before you believe! Point at the three verdicts and say: every picture gets one of these three, and not sure is always allowed, that is what the grown up step is for.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 3,
  "mode": "pairs",
  "seconds": 60,
  "prompt": "A picture shows a purple elephant doing the shopping in a supermarket. Talk to your partner: real, pretend, or computer made? What is your clue?",
  "lookFor": "The clue matters more than the verdict. Listen for elephants are not purple, elephants do not go shopping, I have never seen that in real life. Any pair saying it looks real BUT could not happen has fully got it.",
  "script": "Sixty seconds, partner talk, start the timer on screen. Kneel in with two or three pairs and ask for the clue, not just the answer. After the chime take three answers. Best case someone says it looks like a real photo but elephants are not purple, celebrate that loudly: THAT is detective thinking, your eyes said maybe but your brain said no."
 },
 {
  "type": "tryit",
  "heading": "Detective practice, on paper",
  "body": "Your teacher has six pictures on the worksheet. For each one, ask the detective question: real, pretend, or computer made? Circle your answer. If you are not sure, that is fine, put a question mark and we will investigate together at the end.",
  "script": "Hand out the worksheets. Read each of the six items aloud, one at a time, giving thinking time before pupils circle. Bookmark strips with the detective question go on every table. Support table works with you and does items one to three together out loud. Early finishers get the stretch: draw your own computer made picture idea, the sillier the better. Circulate and collect one brilliant clue to share with the class.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Exit check one. You see a photo of a cat flying with big feathery wings. It looks just like a real photo. What does a detective do?",
  "options": [
   {
    "text": "Believe it, because it looks real",
    "correct": false,
    "feedback": "Looking real is not enough anymore. Cats do not have wings, so this one is computer made."
   },
   {
    "text": "Ask the question: real, pretend, or computer made?",
    "correct": true,
    "feedback": "Yes! Ask before you believe. Cats cannot fly, so your brain solves what your eyes cannot."
   },
   {
    "text": "Feel scared and never look at pictures again",
    "correct": false,
    "feedback": "No need to be scared! A flying cat picture is funny. Detectives enjoy the picture AND know it is not real."
   }
  ],
  "script": "First of two exit checks, these two are the printed quiz too. Read all three options aloud, thinking time, then vote. If anyone picks the third option, reassure warmly: made up pictures are not scary, they can be brilliant, we just ask the question first.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check two. Are computer made pictures always naughty?",
  "options": [
   {
    "text": "No. They can be fun, the trick is knowing they might not be real",
    "correct": true,
    "feedback": "Exactly right. A computer made picture of you riding a dinosaur is brilliant fun. Detectives enjoy it AND know it never happened."
   },
   {
    "text": "Yes. All computer made pictures are bad",
    "correct": false,
    "feedback": "Not bad at all! Made up pictures can be funny and lovely. The only trouble is when a picture tricks us, and the detective question stops that."
   }
  ],
  "script": "Second exit check, two options only. This is the big feeling of the lesson: no fear, just smart. If the class lands the first answer, celebrate: you are officially picture detectives. Wrong answers tell you exactly who needs a small group replay of the diagram slide next time.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Zara",
  "text": "Real, pretend, or computer made? Ask before you believe!",
  "script": "Whole class says it together, twice, louder the second time, magnifying glasses up. This is the sentence you want them saying at the tea table tonight when a silly picture appears on a screen at home.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "Every picture is one of three kinds: real, pretend, or computer made.",
   "A computer can make a picture of something that never happened, and it can look just like a photo.",
   "Made up pictures can be fun. The trick is knowing they might not be real.",
   "Not sure? Ask a grown up. Detectives always ask before they believe."
  ],
  "script": "Four pupils read one point each. After each point the class does the matching action: thumbs up, robot arms, jazz hands, hand up high. Then ask the room: who feels like a real picture detective now? Every hand should go up.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "digi",
  "heading": "DiGi Junior closes the case",
  "lines": [
   "Case closed, little detectives! ⭐",
   "Real, pretend, or computer made? Ask before you believe!",
   "Your mission this week: when you see a picture that makes you go WOW, ask the question out loud, and ask a grown up if you are not sure.",
   "Zara and I are so proud of you. Silly pictures cannot trick a detective like you. See you next time!"
  ],
  "script": "Let DiGi Junior land the ending, the lines appear on their own. Exit quiz sheets go out as this plays, named copies from the print room. Collect them in as your evidence for who has got it.",
  "phase": "close",
  "minutes": 1
 }
]$m03$::jsonb,
  '[]'::jsonb,
  $m03${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 0,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m03$::jsonb,
  $m03${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned that pictures come in three kinds: real, pretend, and computer made, and that a computer can make a picture of something that never happened, like a dog on the moon. We kept it playful, not scary: made up pictures can be fun, the skill is asking before believing.",
 "try_this": "Next time a surprising picture pops up on a screen at home, ask your child the detective question together: real, pretend, or computer made? Let them be the detective and tell you the clue.",
 "family_question": "If you could ask a computer to make any silly picture of our family, what would it be, and how would a detective know it was not real?",
 "no_login_required": true
}$m03$::jsonb,
  $m03${
 "learning_objective": "Pupils can sort pictures into real, pretend, or computer made, and can say the detective question before believing a surprising picture.",
 "timing": "40 minutes: starter 9, teach cycle 14, practise 10, prove 4, close 3",
 "misconceptions": [
  "If a picture looks like a photo it must be real (computers can now make pictures that look exactly like photos, so looking is not enough, asking is the test)",
  "Computer made pictures are bad or scary (made up pictures can be fun and lovely, the only problem is being tricked, and the detective question stops that)",
  "Pretend is the same as lying (pretend is playing and stories and cartoons, the trouble only starts when a made up picture tricks someone into believing it really happened)"
 ],
 "differentiation": {
  "support": "Support table works items one to three aloud with the teacher, using the three actions (thumbs up, jazz hands, robot arms) instead of writing. Bookmark strip with the detective question stays in front of each pupil.",
  "stretch": "Early finishers draw their own computer made picture idea, the sillier the better, then explain to a partner which clue would give it away. Ask them: how would a detective know your picture never happened?"
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Read the dog on the moon post from the scenario card in your best internet voice and run the vote with actions. Teach the three step tool from the printed diagram, chant the detective question three times, run the purple elephant partner talk with a sand timer, then the worksheet, the two exit quiz questions read aloud, and the chant to finish.",
 "keywords": [
  {
   "word": "real",
   "definition": "Something that truly happened. A photo of your birthday cake is real."
  },
  {
   "word": "pretend",
   "definition": "Made up for fun, like a cartoon or a story. Pretend is playing, not lying."
  },
  {
   "word": "computer made",
   "definition": "A picture a computer invented. It can look just like a photo, but the thing never happened."
  }
 ],
 "tool": {
  "heading": "The detective question",
  "lines": [
   "Stop and look",
   "Ask: real, pretend, or computer made?",
   "Not sure? Ask a grown up"
  ],
  "strapline": "Ask before you believe."
 },
 "worksheet": {
  "title": "Picture detective: real, pretend, or computer made?",
  "directions": "Listen to each picture your teacher describes, ask the detective question, and circle your answer.",
  "verdict_options": [
   "Real",
   "Pretend",
   "Computer made"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "A photo of children playing football in the playground at break time.",
   "expected_verdict": "Real",
   "teaching_point": "Recognise. Everyday things that could truly happen and did happen are real. Nothing silly, no tricks."
  },
  {
   "n": 2,
   "item": "A cartoon of a mouse driving a bright red racing car.",
   "expected_verdict": "Pretend",
   "teaching_point": "Recognise. Cartoons are pretend on purpose, made for fun. Nobody is trying to trick anyone."
  },
  {
   "n": 3,
   "item": "A picture that looks just like a photo of a little dog on the moon wearing a tiny space helmet.",
   "expected_verdict": "Computer made",
   "teaching_point": "Apply. It looks like a photo but could not happen. Looks real plus could not happen equals computer made."
  },
  {
   "n": 4,
   "item": "A photo of a rainbow over the school after the rain stopped.",
   "expected_verdict": "Real",
   "teaching_point": "Apply. Surprising and beautiful things can still be real. Amazing does not always mean fake, the question sorts it out."
  },
  {
   "n": 5,
   "item": "A picture that looks just like a photo of a purple elephant pushing a trolley in the supermarket.",
   "expected_verdict": "Computer made",
   "teaching_point": "Apply. Two clues at once: elephants are not purple and elephants do not go shopping. Silly clues mean look harder."
  },
  {
   "n": 6,
   "item": "Zara says: this photo of a cat flying with big feathery wings must be real, because it looks so clear. Do you agree? Tell your partner why or why not.",
   "expected_verdict": "Computer made",
   "teaching_point": "Explain. Looking clear and looking real are not proof anymore. Cats cannot fly, so the brain overrules the eyes. Listen for pupils disagreeing with Zara politely and giving the clue."
  }
 ],
 "commitment_stem": "My commitment: when a picture makes me go WOW, I will ask real, pretend, or computer made before I believe it."
}$m03$::jsonb,
  $m03${
 "required": false
}$m03$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 4: Screen routines that work
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks2-04-screen-routines', 'Screen routines that work', 'KS2', 'Years 3 to 6', 'teacher',
  '{6}'::int[], ARRAY['RSHE health and wellbeing']::text[], '{}'::text[],
  'Sleep displacement research', 'I can build one screen routine that works and stick to it.', 'Oliver', 4,
  $m04$[
 {
  "type": "title",
  "eyebrow": "KS2 · Years 3 to 6 · Module 4",
  "title": "Screen routines that work",
  "body": "One hour, one mission: build a screen routine that is yours, and earn the Routine Builder badge tonight.",
  "script": "Settle everyone with this slide up. Big claim to open: today you will build something most adults have never managed to build. Not a rule someone gives you. A routine YOU design, that actually works. The badge at the end of this mission is called Routine Builder, and you earn it tonight, at home, not in this room.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can build one screen routine that works and stick to it.",
  "why": "Screens are brilliant and they are built to be hard to put down, even for grown ups. Willpower loses that fight almost every time, but a routine wins it, and a routine you design yourself is one you will actually keep.",
  "gains": [
   "Explain why a routine beats willpower every single time",
   "Run the cool down lap: warn, finish, swap",
   "Spot when a screen is quietly stealing sleep, dinner or homework time",
   "Design one routine tonight that is yours, not one handed to you"
  ],
  "script": "Read the mission out loud, then the why. Then ask: hands up if you have ever said one more video and it turned into loads more. Put your own hand up too, honestly. Keep a rough count of hands. Tell them: that is not a you problem, and by the end of the hour you will know exactly why it happens and exactly how to beat it.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Squad words for today",
  "words": [
   {
    "word": "routine",
    "meaning": "A plan you decide once and then follow, so you do not have to fight the same battle every day."
   },
   {
    "word": "willpower",
    "meaning": "Using effort in the moment to make yourself stop. It runs out, especially when you are tired."
   },
   {
    "word": "wind down",
    "meaning": "The calm time before bed when your brain slows down and gets ready for sleep."
   },
   {
    "word": "sleep displacement",
    "meaning": "When screen minutes push sleep minutes out of the way. The lost sleep never comes back."
   }
  ],
  "script": "Say each word, class repeats it back. Spend longest on sleep displacement, it sounds fancy but it is simple: imagine your sleep is water in a cup, and every scrolling minute at bedtime pours a bit out. You cannot pour it back in the morning. That picture will come back later in the lesson.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Mission memory from last time. A game advert shows a prize that looks absolutely amazing. What did we learn to ask first?",
  "options": [
   {
    "text": "Could this picture be made or changed? Looking real is not the same as being real",
    "correct": true,
    "feedback": "That is the one. Pictures can be made or changed by a computer, so amazing looking is a reason to check, not a reason to believe."
   },
   {
    "text": "If it looks real, it is real",
    "correct": false,
    "feedback": "That was the trap from last lesson. Pictures can be made or changed, so our eyes alone cannot settle it."
   },
   {
    "text": "Only grown ups can tell if a picture is real",
    "correct": false,
    "feedback": "Grown ups cannot tell by looking either. The skill is asking the question, and you already have it."
   }
  ],
  "script": "Retrieval from the last module. Thirty seconds of thinking time before any hands. Cold call two pupils and ask for the reasoning, not just the answer. If the room is shaky on this, spend one extra minute: the question could this picture be made is the whole of last lesson in seven words.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🛠️",
  "heading": "Routines beat willpower",
  "body": "Here is the honest truth: apps and games are built with no finishing line. Autoplay starts the next video before you decide anything, and there is always one more round. Willpower means fighting that pull in the moment, and even adults lose that fight most nights. A routine is different. You decide ONCE, when you are calm, and then the plan does the work. And here is the secret ingredient: a routine somebody hands you feels like a punishment, but a routine you design yourself is yours, and people stick to what is theirs.",
  "script": "This is the big idea of the whole hour, so land it slowly. Ask: who has ever been told to just get off the tablet, and it turned into an argument? Most hands go up. That is willpower against design, and design wins. Then the turn: so we are not going to try harder, we are going to design better. You are the designer. Do not rush past the last line, the child designing their own routine is what makes this module work.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The cool down lap",
  "caption": "Three steps, every time screens need to end. Racing drivers do a cool down lap, they never just slam the brakes.",
  "steps": [
   {
    "emoji": "📣",
    "title": "Warn",
    "text": "Give yourself a warning before the end. Five more minutes, said out loud or set on a timer. No surprises."
   },
   {
    "emoji": "🏁",
    "title": "Finish",
    "text": "Stop at a real finishing line: the end of the video, the round, the level. Never mid game, that is what makes stopping hurt."
   },
   {
    "emoji": "🔄",
    "title": "Swap",
    "text": "Have the next thing ready and waiting: food, football, a book, the shower. An empty gap pulls you straight back to the screen."
   }
  ],
  "verdicts": [
   "Routine ready",
   "Needs a lap",
   "Willpower trap"
  ],
  "script": "Walk the three steps as they build and get the class chanting them back: warn, finish, swap. Explain the racing picture, a driver at 200 miles an hour does not slam the brakes, they do a cool down lap. Your brain at full game speed is the same. Then point at the three verdict chips: today you become routine detectives, and every situation gets one of these three verdicts. Routine ready means the lap is there. Needs a lap means part of the plan is missing. Willpower trap means no plan at all, just hoping to resist.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "Your five minute warning goes off right in the middle of a level. What does the cool down lap say to do?",
  "options": [
   {
    "text": "Finish the level, then swap to the thing you lined up",
    "correct": true,
    "feedback": "Exactly. The warning meant no surprises, the finish step means end at a real finishing line, and the swap is ready and waiting. That is the whole lap."
   },
   {
    "text": "Turn it off instantly, mid level, no matter what",
    "correct": false,
    "feedback": "Slamming the brakes mid level is what makes stopping feel horrible, and horrible stops turn into arguments. Finish at a real finishing line, that is the point of the lap."
   },
   {
    "text": "Ignore the warning, you will stop when you feel like it",
    "correct": false,
    "feedback": "You will not feel like it, and that is not a you problem, it is the design of the game. Feeling like stopping is willpower, and willpower loses. The lap wins."
   }
  ],
  "script": "First check on the tool. Watch for pupils choosing the second answer because it sounds strict and therefore right, that is a really useful wrong answer to unpack: this module is not about stopping harder, it is about stopping smarter. The lap is kind to you on purpose, which is why it works.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "pairs",
  "seconds": 60,
  "prompt": "What is the hardest moment of YOUR day to put a screen down, and what makes it so hard?",
  "lookFor": "Honesty, and pupils spotting the no finishing line moments: autoplay at bedtime, one more round after school, the group chat that never ends. The best answers notice the design, not just the feeling.",
  "script": "Sixty seconds, partner talk, start the timer on screen. Share your own hardest moment first, adults have one too and admitting it gives the room permission to be honest. After the chime take three answers and sort them out loud: after school, bedtime, mealtimes, homework. Tell them: those four moments are exactly where we are taking the lap next."
 },
 {
  "type": "concept",
  "emoji": "😴",
  "heading": "Where screens sleep matters",
  "body": "Sleep is when your brain saves everything you learned today and gets you ready for tomorrow. Screens at bedtime attack sleep twice. First, bright screens and exciting clips tell your brain it is daytime, so you feel wide awake at the exact moment you should be winding down. Second, sleep displacement: every minute of scrolling is a minute taken straight out of your sleep, and it never comes back. That is why the strongest bedtime routine in the world is boring and brilliant: screens sleep outside the bedroom.",
  "script": "Connect back to the cup of water from the keywords: bedtime scrolling pours your sleep out, and mornings cannot refill it. Then be honest about why outside the bedroom beats on silent: if the phone is within reach, checking it costs nothing and willpower has to win every single time you stir in the night. If it is charging in the kitchen, the routine wins while you sleep. Ask: where do screens sleep in your house? No judgement, just gather answers, you will use them in the parent note conversation.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Mission file one: the bedtime spiral",
  "platform": "feed",
  "handle": "midnight.clips",
  "avatar": "🌙",
  "meta": "9:47pm · autoplay is on",
  "text": "You said one more video 47 videos ago 😂😂 tag someone who is DEFINITELY still scrolling right now instead of sleeping",
  "image": "📱",
  "stats": "❤ 312K   ↻ 96K   💬 41K",
  "prompt": "It is 9:47pm and the next video is already loading. Which step of the cool down lap is missing, and where did this spiral actually start?",
  "script": "Read the post with a grin, it is funny because it is true, even the app is laughing at us. Then get serious with the two questions. Which step is missing: the finish, autoplay deletes the finishing line so the video never actually ends. Where did the spiral start: not at 9:47, it started when the phone came into the bedroom. The best routine move happened an hour before this screenshot. Land that hard: routines win battles before they start.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "diagram",
  "heading": "How the bedtime spiral steals your sleep",
  "caption": "The lap breaks this spiral at step one. The phone charging outside the bedroom breaks it before it begins.",
  "steps": [
   {
    "emoji": "🌀",
    "title": "One more becomes ten more",
    "text": "Autoplay starts the next video before you choose anything. There is no finishing line to stop at."
   },
   {
    "emoji": "🧠",
    "title": "Your brain wakes back up",
    "text": "Bright light and exciting clips tell your brain it is daytime. Wind down goes into reverse."
   },
   {
    "emoji": "⏳",
    "title": "Sleep gets displaced",
    "text": "Every scrolling minute is a sleep minute poured away. It does not come back tomorrow."
   },
   {
    "emoji": "🥱",
    "title": "The next morning pays the bill",
    "text": "Grumpy, foggy, worse at football, worse with friends. Yesterday's scroll sends today the bill."
   }
  ],
  "script": "Walk the spiral as it builds, then ask the class where the weakest link is. Answer: step one, and even better, before step one. Ask what breaks the spiral completely, and steer them to it: if the phone sleeps in the kitchen, the spiral cannot even start. Then the identity line: most people fight this spiral every night and lose. You are designing your way out of the fight entirely.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "Your phone is on silent under your pillow. Problem solved?",
  "options": [
   {
    "text": "Not really. Checking is still one reach away, so willpower has to win every single time you stir",
    "correct": true,
    "feedback": "Exactly. Silent fixes the noise, not the pull. A phone within reach asks your willpower to win all night long. A phone in the kitchen asks it to win once, at 8pm."
   },
   {
    "text": "Yes, silent means it cannot wake you, so the bedroom is fine",
    "correct": false,
    "feedback": "Silent fixes the pings but not the pull. The reach for one quick check is the spiral's front door, and it is still wide open under your pillow."
   },
   {
    "text": "No, because phones near your head are dangerous",
    "correct": false,
    "feedback": "That is not the honest reason. The phone is not hurting you by being near you. The real cost is the checking and the scrolling, which pour your sleep away minute by minute."
   }
  ],
  "script": "The third option matters, some pupils will have heard scare stories about phones near heads. Be straight with them: we do not need scary made up reasons, the true reason is strong enough. Sleep displacement is real, measurable in how you feel tomorrow, and the fix costs nothing.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🍝",
  "heading": "The table and the desk",
  "body": "Two more places where routines quietly win. Mealtimes: a screen at the table splits your attention in half, and the half that talks to your family is the half that matters, meals are where a family actually finds out about each other's day. Homework: the screen next to you does not even need to be on to distract you, part of your brain keeps guarding it, waiting for it to light up. In both places the fix is the same and it is not a ban: it is a routine that gives screens their own time, so the table and the desk get yours.",
  "script": "Keep this warm and completely unpreachy, Oliver's rule is that we never make anyone feel bad about loving screens, he loves them too. Ask: who has ever watched something at the table and realised they cannot remember eating? Laugh with them. Then the desk point, which surprises people: a phone face down next to your homework still costs you focus, because your brain spends effort ignoring it. Not a guilt trip, a design fact, and designers fix design problems.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Mission file two: the homework battle",
  "platform": "message",
  "handle": "Squad Chat 🎮",
  "avatar": "🎮",
  "meta": "Group chat · 18 new messages",
  "text": "GET ON NOW we are all in the lobby, round starts in 2 mins, homework can wait lol it is literally due tomorrow not tonight 😆",
  "image": "📚",
  "prompt": "Homework is sitting there, the squad is waiting, the round starts in two minutes. What would a designed routine have already decided?",
  "script": "Read it like a real message, pace and all, then ask the prompt. The point to land: in this moment, willpower has already lost, the pull is too strong at two minutes to kickoff. But a designed routine decided this hours ago: homework first with the phone in another room, warning set, and the squad session is the SWAP, the reward waiting at the finish line. Ask the class to say what that pupil could message back. Best answer sounds like: on at 5, save me a spot. Not a no. A when.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 3,
  "mode": "groups",
  "seconds": 90,
  "prompt": "Design mission: build a homework routine using warn, finish, swap. Decide exactly where each step goes.",
  "lookFor": "The warning set before screens start, not during. A named finishing line, end of round or end of video, never mid anything. A real swap into homework, and the fun thing placed after homework as the reward. Bonus brilliance: the phone in a different room while working.",
  "script": "Groups of three or four, ninety seconds on the timer, this is the design challenge of the day. Every group must place all three steps somewhere. Collect one routine per group after the chime and test it out loud against the squad chat scenario: would this routine have survived GET ON NOW? Celebrate the group that put the gaming session after homework as the swap, that is the pro move, the screen becomes the reward instead of the enemy."
 },
 {
  "type": "choice",
  "question": "When is the smartest time to run the cool down lap on a school night?",
  "options": [
   {
    "text": "Before the battle starts: decide the warning, the finishing line and the swap while you are calm",
    "correct": true,
    "feedback": "That is the designer's move. Routines win battles before they begin. Deciding at 4pm is easy. Deciding mid round at 9pm is nearly impossible, for anyone."
   },
   {
    "text": "In the middle of the round, when you notice the time",
    "correct": false,
    "feedback": "By mid round the pull is at full strength and you are asking willpower to fight it alone. The lap works because it is decided early, when deciding is easy."
   },
   {
    "text": "You do not need the lap if you promise yourself you will be sensible",
    "correct": false,
    "feedback": "A promise to be sensible is willpower wearing a disguise. The apps are designed by teams of adults to beat that promise. Beat their design with your design."
   }
  ],
  "script": "Last check before practice. The phrase to send them into the worksheet with: routines win battles before they begin. Get the class to repeat it once. If anyone picked the third option, do not scold it, name it as the most human answer on the slide, we have all made that promise, and that is exactly why the lap exists.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "Routine detectives, on paper",
  "body": "Six situations on your worksheet: after school, bedtime, mealtimes and homework. Read each one like a detective and give your verdict: Routine ready, Needs a lap, or Willpower trap. Every verdict needs a reason, and if your verdict is Needs a lap, write which step is missing: warn, finish or swap. Fifteen minutes. Number six is a big claim from Teo, and your job is to agree or disagree with real reasoning.",
  "script": "Hand out the worksheet, fifteen minutes on the clock, bookmark strips on tables so the lap is in front of anyone who wants it. Support group works items one to three with you, reading each aloud. Stretch task for early finishers: redesign item three so it earns Routine ready, all three steps included. Circulate and collect one brilliant reason to read out at the end. Listen especially for pupils naming the missing step, that is the skill, not just the verdict.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check one. Why does a routine beat willpower?",
  "options": [
   {
    "text": "Because you decide once, when you are calm, instead of fighting the pull every single time",
    "correct": true,
    "feedback": "That is the whole lesson in one line. Apps are designed to make the in the moment fight unfair. The routine moves the decision to a moment you can actually win."
   },
   {
    "text": "Because a routine means no screens allowed",
    "correct": false,
    "feedback": "A routine is not a ban. Screens keep their time, and it is time YOU chose. The routine decides when, not whether."
   },
   {
    "text": "Because willpower only works for adults",
    "correct": false,
    "feedback": "Honestly, willpower loses for adults too, ask any grown up about their own bedtime scrolling. That is why everyone needs routines, not just children."
   }
  ],
  "script": "First of two exit checks, these two are the printed exit quiz, so pupils answer alone, no partner talk. A wrong answer here tells you who to mark as working towards on the register. The second option is the one to watch: any pupil who thinks routine means ban has missed the heart of the module.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check two. Tonight you set one screen routine. Who should design it, and why does that matter?",
  "options": [
   {
    "text": "You do, with your family. A routine you built yourself is a routine you actually keep",
    "correct": true,
    "feedback": "Exactly. Handed down rules get argued with. Your own design gets defended, because it is yours. That is why tonight's mission is yours to build, not to receive."
   },
   {
    "text": "A grown up should hand you the rules, children cannot design routines",
    "correct": false,
    "feedback": "You just designed one in this lesson. Families help and agree it together, but the design is yours, and that is exactly what makes it stick."
   },
   {
    "text": "Nobody needs to design it, good habits just happen on their own",
    "correct": false,
    "feedback": "Against apps with no finishing line, nothing just happens except more scrolling. Good routines are built on purpose, by a designer. Tonight that designer is you."
   }
  ],
  "script": "Second exit check, still working alone. This one tests the ownership idea, which is the part that makes tonight's mission real. After answers are in, point at the commitment line on the exit card: tonight's routine, in their own words, warning, finishing line and swap all named.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Oliver",
  "text": "Warn it. Finish it. Swap it. I designed this routine, so this routine is MINE.",
  "script": "Whole class says it together, twice, louder the second time and everyone hits the MINE. This is the sentence you want repeated in kitchens tonight when the routine gets set.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "Routines beat willpower because you decide once, when you are calm, instead of fighting the pull every time.",
   "The cool down lap: warn before the end, finish at a real finishing line, swap to the next thing you lined up.",
   "Screens sleep outside the bedroom, because scrolled minutes are sleep minutes poured away, and they never come back.",
   "A routine you design is a routine you keep. Tonight you set one: after school, bedtime, mealtime or homework."
  ],
  "script": "Return to the hands up count from the start: who has had one more video turn into loads more? Ask the room what they would do differently tonight and let two or three pupils answer. Then the recap, read by pupils, one point each. Point three gets the cup of water picture one last time.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi sends you on your mission",
  "lines": [
   "Mission complete, Routine Builders! ⭐",
   "Remember the lap: warn, finish, swap. It works because YOU designed it, and designers stick to their own designs.",
   "Tonight's mission: set ONE routine and run it. After school, bedtime, mealtime or homework. Just one, and make it completely yours.",
   "Oliver will be asking about your badge next lesson. Sleep well tonight, squad, your tomorrow will thank you. See you next time!"
  ],
  "script": "Let DiGi land the ending, the bubbles appear on their own. Exit quizzes and commitment cards go out as this plays, named copies from the print room. Collect the exit quizzes in, they are your evidence for the register. The commitment card goes home in the bag with the parent note.",
  "phase": "close",
  "minutes": 2
 }
]$m04$::jsonb,
  '[]'::jsonb,
  $m04${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 3,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m04$::jsonb,
  $m04${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned why routines beat willpower: apps are designed with no finishing line, so the fix is a better design, not more effort. They learned a three step tool called the cool down lap (warn, finish, swap) and they have committed to setting one screen routine tonight.",
 "try_this": "Tonight, ask your child to design their own cool down lap for bedtime: when the warning happens, what the finishing line is, and what they swap to. Let them set the terms, and if you can, agree together that screens charge outside the bedroom. A routine they design is a routine they keep.",
 "family_question": "Where should our screens sleep at night, and what would make that easy for all of us?",
 "no_login_required": true
}$m04$::jsonb,
  $m04${
 "learning_objective": "Pupils can design one screen routine using the cool down lap (warn, finish, swap), explain why routines beat willpower, and commit to setting one routine at home tonight.",
 "timing": "60 minutes: starter 8, cycle one 9, cycle two 10, cycle three 9, practise 15, prove 4, close 5",
 "misconceptions": [
  "Stopping is easy if you really try (apps and games are built with no finishing line, so willpower loses to design, the fix is better design, not more effort)",
  "Putting the phone on silent fixes the bedroom problem (silent stops the pings but not the pull, checking is still one reach away all night, and displaced sleep never comes back)",
  "Routines are punishments adults hand out (this module never bans screens, the child designs the routine, chooses the finishing line and the swap, and ownership is exactly what makes it stick)"
 ],
 "differentiation": {
  "support": "Work worksheet items one to three aloud with the support group, reading each scenario and walking the three verdict options together. Keep the bookmark strip with warn, finish, swap in front of each pupil. Accept the verdict alone for items one and two, then coach the reason.",
  "stretch": "Early finishers redesign worksheet item three so it earns Routine ready, naming all three steps. Deeper stretch: which of the four moments (after school, bedtime, mealtimes, homework) is hardest to design for, and why does bedtime beat the others for sneaky design like autoplay?"
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Read the title and mission aloud, teach the keywords from the sheet, run the retrieval question by hands up. Draw the cool down lap on the board as three boxes (warn, finish, swap) and the bedtime spiral as four arrows in a circle. Both scenarios are printed as cards: read them in role, then take verdicts by hands. Discussions run exactly the same with a watch instead of the on screen timer. Worksheet, exit quiz and commitment card are all in the pack.",
 "keywords": [
  {
   "word": "routine",
   "definition": "A plan you decide once and then follow, so you do not have to fight the same battle every day."
  },
  {
   "word": "willpower",
   "definition": "Using effort in the moment to make yourself stop. It runs out, especially when you are tired."
  },
  {
   "word": "wind down",
   "definition": "The calm time before bed when your brain slows down and gets ready for sleep."
  },
  {
   "word": "sleep displacement",
   "definition": "When screen minutes push sleep minutes out of the way. The lost sleep never comes back."
  }
 ],
 "tool": {
  "heading": "The cool down lap",
  "lines": [
   "Warn",
   "Finish",
   "Swap"
  ],
  "strapline": "One lap, then the next good thing. My routine, my design, mine."
 },
 "worksheet": {
  "title": "Routine detective: ready, lap or trap?",
  "directions": "Read each situation, give your verdict, and write the reason, naming any missing step of the lap.",
  "verdict_options": [
   "Routine ready",
   "Needs a lap",
   "Willpower trap"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "Maya plays one round after school. Her timer warns her five minutes before dinner, she finishes the round, then goes to help set the table.",
   "expected_verdict": "Routine ready",
   "teaching_point": "All three steps are present: the warning, a real finishing line (end of round) and a swap (setting the table). This is what a designed routine looks like on an ordinary day."
  },
  {
   "n": 2,
   "item": "Leo says he will stop scrolling when he feels tired. Autoplay keeps starting the next video. It is now an hour past his bedtime.",
   "expected_verdict": "Willpower trap",
   "teaching_point": "No plan at all, just hoping a feeling will do the work. Autoplay deletes the finishing line, so the feeling never comes. This is the bedtime spiral from the lesson."
  },
  {
   "n": 3,
   "item": "Priya starts her homework with her tablet face down right next to her. She has no plan for screens tonight, she is just going to concentrate really hard.",
   "expected_verdict": "Willpower trap",
   "teaching_point": "Concentrating really hard is willpower in disguise, and the tablet within reach costs focus even when it is off. A designed version puts the tablet in another room and the fun thing after homework as the swap."
  },
  {
   "n": 4,
   "item": "It is Saturday and Jess wants a long gaming morning. She sets a warning for when lunch is close, names her finishing line as the end of the match, and plans a bike ride with her brother straight after.",
   "expected_verdict": "Routine ready",
   "teaching_point": "Long screen sessions can be routine ready too. This module is not about less at all costs, it is about designed time with a warning, a finishing line and a swap. Jess designed hers."
  },
  {
   "n": 5,
   "item": "Amara gives herself a five minute warning before tea, but she always stops mid video, so stopping feels horrible and she keeps sneaking the tablet back to the table.",
   "expected_verdict": "Needs a lap",
   "teaching_point": "The warn step is there but the finish step is missing. Stopping mid video is slamming the brakes, which is why it hurts and why the routine keeps breaking. Fix: end at the end of a video, and add a swap."
  },
  {
   "n": 6,
   "item": "Teo says: I do not need a routine, I have amazing willpower, I can stop whenever I want. Do you agree with Teo? Explain your reasoning, and use what you know about finishing lines.",
   "expected_verdict": "Willpower trap",
   "teaching_point": "The explain item. Strong answers say the apps are designed with no finishing line by teams of adults, so willpower fights an unfair battle, and that even people with great willpower use routines so they only have to decide once. Disagreeing with Teo kindly, with reasons, is full marks."
  }
 ],
 "commitment_stem": "My commitment: tonight my cool down lap is warn at ..., finish when ..., and swap to ..."
}$m04$::jsonb,
  $m04${
 "required": false
}$m04$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 5: Gaming: time, intensity and spend
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks2-05-gaming-time-spend', 'Gaming: time, intensity and spend', 'KS2', 'Years 3 to 6', 'teacher',
  '{6,7}'::int[], ARRAY['Citizenship financial literacy (fraud and scam prevention)']::text[], '{}'::text[],
  'Gambling style mechanics research', 'I can spot when a game is trying to get me to spend.', 'Oliver', 5,
  $m05$[
 {
  "type": "title",
  "eyebrow": "KS2 · Years 3 to 6 · Module 5",
  "title": "Gaming: time, intensity and spend",
  "body": "One hour, one skill: three questions that catch a game reaching for your time and your money.",
  "script": "Settle everyone with this slide up. Today the squad goes undercover inside the games you love. Oliver is our lead spotter for this mission. By the end of the hour you will know the tricks that game designers use on millions of players, and you will be able to catch every single one.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can spot when a game is trying to get me to spend.",
  "why": "Games are brilliant, and the people who make them are brilliant too, so brilliant that they design chests, countdowns and gem prices to nudge players into paying without noticing. Today you learn their playbook, so every trick has to get past you first.",
  "gains": [
   "Name the tricks games use to keep you playing past your stopping point",
   "Turn gem prices back into real pounds before deciding anything",
   "Spot a raffle dressed up as a treasure chest",
   "Run the three spend spotters on any offer in under a minute"
  ],
  "script": "Read the mission out loud, then the why. Quick hands up: who plays games most days? Keep those hands up and say clearly that those hands belong to the experts in this room. This lesson never tells gamers off. It makes gamers sharper. Ask one pupil to read each gain.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Spotter words for today",
  "words": [
   {
    "word": "loot box",
    "meaning": "A chest or box you pay for without knowing what is inside. You are buying a chance, not a thing."
   },
   {
    "word": "in game currency",
    "meaning": "Game money like gems or coins that you buy with real money. It hides what things really cost."
   },
   {
    "word": "limited time offer",
    "meaning": "A deal with a countdown clock. The rush is designed to make you buy before you think."
   },
   {
    "word": "odds",
    "meaning": "The chance of winning. 1 in 100 means if 100 people open the chest, about one gets the top prize."
   }
  ],
  "script": "Say each word, class repeats it back. Pause on odds, it is the one they will not have met. Ask: if the odds are 1 in 100 and you open two chests, are you sure to win? Listen for the misconception that two goes means double luck. You do not need to fix it fully yet, the raffle slide later does that job.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Warm up from last lesson. Screen time is nearly up and you are mid game. What is the cool down lap?",
  "options": [
   {
    "text": "Warn, finish, swap: a warning that time is nearly up, finish the round you are in, then swap to the next thing",
    "correct": true,
    "feedback": "That is the lap. The warning means no surprises, finishing the round means no rage quitting mid match, and swapping straight to something else stops the game pulling you back."
   },
   {
    "text": "Turn everything off instantly the second time is up",
    "correct": false,
    "feedback": "Instant off mid match feels unfair and starts the battles. The lap works because you finish the round first. That is the deal, and both sides keep it."
   },
   {
    "text": "Ask for ten more minutes, then ten more after that",
    "correct": false,
    "feedback": "That is not a lap, that is extra time on a loop. The warning and the finish are what make stopping feel fair to everyone."
   }
  ],
  "script": "Retrieval from last lesson. Thirty seconds of thinking time, then cold call two pupils for the three words of the lap, warn, finish, swap. Today builds on it, because the reason stopping is hard is not weakness, it is design, and we are about to see the blueprints.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🎮",
  "heading": "Brilliant AND designed. Both true.",
  "body": "Games are one of the best things humans have ever built, full of stories, teamwork and skill. They are also made by teams of clever designers whose job is to keep you playing longer and, in lots of games, to get you spending. Both of those things are true at the same time, and you do not have to pick one. A player who knows the tricks is a stronger player than one who does not.",
  "script": "This slide sets the tone for the whole hour, so land it carefully. We are not here to say games are bad. Anyone who says games are bad has not played a good one. We are here because the designers know their playbook and most players do not. Ask: is it possible to love something AND know it is trying to keep you there? Take two answers. Yes is the answer, and it is true of games, sweets and telly.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The keep you playing kit",
  "caption": "Four tools designers use to stretch your session. Noticing them is a player skill, not a lecture.",
  "steps": [
   {
    "emoji": "🔁",
    "title": "No finish line",
    "text": "Matches roll straight into the next one. The game never says done, so you have to say it."
   },
   {
    "emoji": "🔥",
    "title": "Streaks and daily prizes",
    "text": "Miss a day and you LOSE the streak. That is not a gift, it is a lead pulling you back tomorrow."
   },
   {
    "emoji": "😤",
    "title": "The near miss",
    "text": "SO CLOSE! flashes on purpose. Nearly winning makes you press play again faster than winning does."
   },
   {
    "emoji": "🍿",
    "title": "Boredom snacking",
    "text": "Opening the game not because you want to play but because nothing else is happening. The game counts that too."
   }
  ],
  "script": "Walk the four tools as they build and give each one ten seconds of real talk. On the near miss, tell the truth: scientists found that nearly winning fires up your brain more than winning, and designers know it. On boredom snacking, ask for a show of hands: who has opened a game, played thirty seconds, closed it, then opened it again? Nearly every hand goes up, including yours if you are honest. That honesty buys you the whole lesson.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "pairs",
  "seconds": 60,
  "prompt": "Think of a game you love. Which keep you playing trick does it use, and when did you last feel it working on you?",
  "lookFor": "Pupils naming tricks in real games without shame. Gamers are the experts here. Listen for streak panic and one more match stories, and celebrate honest spotting out loud.",
  "script": "Sixty seconds, partner talk, timer on screen. You are listening for expertise, not confessions. After the chime take three answers and respond like a coach scouting talent: that is a proper spot, that is exactly the near miss, that is the streak lead. Name your own weak spot too, it keeps the room honest."
 },
 {
  "type": "choice",
  "question": "It is nearly time to stop and the game flashes PLAY ONE MORE MATCH FOR DOUBLE COINS. What is really going on?",
  "options": [
   {
    "text": "The game is being generous because you played well",
    "correct": false,
    "feedback": "The bonus appears exactly when players usually stop. It is not a thank you, it is a hook, and it is timed on purpose."
   },
   {
    "text": "The game noticed a stopping point and is paying you to ignore it",
    "correct": true,
    "feedback": "Exactly. Stopping points are where players leave, so the game spends pretend coins to keep you. Once you can see the hook, you get to choose on purpose instead of being reeled in."
   },
   {
    "text": "You have to take it or you will fall behind everyone else",
    "correct": false,
    "feedback": "Double coins tonight changes almost nothing by next week. Falling behind is the feeling the designers rented, not the truth."
   }
  ],
  "script": "Whole class vote, hands or letters. When you reveal, connect it back to the cool down lap: this is exactly why the lap has a finish step, because the game will always offer one more. The lap beats the hook when you know the hook is coming.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "💎",
  "heading": "Free games that cost",
  "body": "Lots of the biggest games cost nothing to download, and that is not the company being kind. Free is the front door. The real shop is inside: gems, coins, chests, passes and limited time offers. The game does not make money when you start playing, it makes money when you keep playing and start paying, so every screen is built to walk you gently towards the shop.",
  "script": "Ask the room to shout out free games they play, and pick a famous one. Then ask the detective question: that game made hundreds of millions of pounds last year, so if it is free, where did the money come from? Let them work it out. Someone always gets there: from the players, inside the game. That is the whole of level two, said by a nine year old.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "stat",
  "phase": "teach",
  "minutes": 1,
  "figure": "9 in 10",
  "claim": "About nine in ten UK children aged 3 to 17 play video games.",
  "source": "Ofcom Children and Parents: Media Use and Attitudes Report 2022",
  "script": "Let the number land. Nearly everyone in this room, nearly everyone in the country. Then the flip: that is exactly why the spend tricks are worth millions. When almost every child in Britain is a player, even a small trick that works a little bit becomes an enormous pile of money. You are not a customer to these designers, you are the whole market."
 },
 {
  "type": "diagram",
  "heading": "How the price hides",
  "caption": "Three moves that stop your brain counting real money. Turning gems back into pounds breaks all three.",
  "steps": [
   {
    "emoji": "💎",
    "title": "Money becomes gems",
    "text": "You swap pounds for gems and your brain stops counting. 480 gems does not feel like real money. It is."
   },
   {
    "emoji": "🧮",
    "title": "The bundles never match",
    "text": "The chest costs 480 gems but gems come in packs of 300 or 1,000. You always have spare gems left, pulling you back to the shop."
   },
   {
    "emoji": "⏳",
    "title": "The countdown clock",
    "text": "ENDS IN 14:32! Rushing you is the point. A rushed brain buys, a calm brain checks."
   }
  ],
  "script": "Walk the three moves as they build. On the first one, do the magic trick live: would you hand a stranger £4? No? Would you spend 480 gems without blinking? Same money, different costume. On the bundles, ask why no pack ever exactly fits the price, and let them realise it is designed. Nobody accidentally makes every bundle the wrong size.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "feed",
  "handle": "Blocky Legends shop",
  "avatar": "🎁",
  "meta": "In game shop · MEGA CHEST event",
  "text": "⭐ MEGA CHEST ⭐ One LEGENDARY item could be inside... maybe! 480 gems. OFFER ENDS IN 14:32. When the timer hits zero this chest is GONE FOREVER!",
  "image": "⏳",
  "stats": "⭐ Legendary: 1 in 100   🎁 Opened 2.4M times today",
  "prompt": "How many tricks can you count on this one screen? Thirty seconds with your partner, then hands up with a number.",
  "script": "Pair talk, thirty seconds, then collect numbers. There are at least four: the countdown rushing you, gems hiding the price, maybe means random like a raffle, and gone forever making it feel once in a lifetime. Point at the small print: 1 in 100. Ask: if the whole class opened one chest each, how many legendaries would we expect? None or maybe none, and the shop keeps everyone's gems either way. Let that sink in.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "groups",
  "seconds": 90,
  "prompt": "Why do games sell gems instead of just showing prices in pounds? Follow the money: who wins when the price hides?",
  "lookFor": "The company wins twice: hidden prices feel smaller so players spend more, and leftover gems pull players back to the shop. Nobody hides a price to help the buyer.",
  "script": "Groups of three or four, ninety seconds on the timer. This is the follow the money question and KS2 are surprisingly good at it. Collect one answer per group. The line to land at the end: shops that are proud of their prices show them in pounds. When a price wears a costume, ask why."
 },
 {
  "type": "choice",
  "question": "A chest costs 480 gems. Gems come in packs: 300 gems for £2.99 or 1,000 gems for £8.99. What is the trick?",
  "options": [
   {
    "text": "There is no trick, that is just maths",
    "correct": false,
    "feedback": "The maths IS the trick. Neither pack fits the price, so you either buy big or buy twice, and either way you end up with spare gems pulling you back."
   },
   {
    "text": "The bundle sizes are chosen so you always overbuy and always have leftovers",
    "correct": true,
    "feedback": "Spotted it. Mismatched bundles are designed, not accidental. Turning gems back into pounds is how you see what you are really being asked to pay."
   },
   {
    "text": "The trick is that gems are worthless",
    "correct": false,
    "feedback": "Gems do buy real things in the game, that is what makes the trick work. The problem is not that gems are fake, it is that they stop your brain counting pounds."
   }
  ],
  "script": "Give them a moment with the numbers on screen. If anyone works out that getting the chest actually costs at least £2.99 plus another pack, or £8.99 with 520 gems spare, celebrate loudly, that is exactly the pounds translation the spotters need.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🎟️",
  "heading": "Random like a raffle",
  "body": "A loot box works like a raffle. You pay real money for a ticket, and you MIGHT win the amazing prize, but most tickets win something small you did not really want. The chance of the top prize is usually tiny, and the game knows the exact odds even when you do not. Paying money for a random chance is how gambling machines work, which is why some countries have banned loot boxes for children. You are not silly for wanting the prize. The whole machine is built by experts to make everyone want the prize.",
  "script": "This is the honesty slide, so go slow and keep it kind. Ask who has been to a school fair raffle. Everyone pays, one person wins the hamper, the raffle keeps all the money. A loot box is that, but the raffle can follow you home and ask again every day. Say the gambling word plainly and calmly: adults have machines that work exactly like this, they are called gambling machines, and there are strict laws about them because they are so hard to stop feeding. Loot boxes work the same way, and that is a fact, not a telling off.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The spend spotters",
  "caption": "Three questions before any money moves. And real money always goes through a grown up.",
  "steps": [
   {
    "emoji": "🏃",
    "title": "Spotter one: is it rushing me?",
    "text": "Countdown clocks, ends tonight, last chance. Real deals survive thinking time."
   },
   {
    "emoji": "🕵️",
    "title": "Spotter two: is it hiding the price?",
    "text": "Gems, coins, tokens, mismatched bundles. Turn it back into pounds before you decide anything."
   },
   {
    "emoji": "🎟️",
    "title": "Spotter three: is it random like a raffle?",
    "text": "Paying for a CHANCE is not shopping, it is a raffle ticket. Know the odds or walk away."
   }
  ],
  "verdicts": [
   "Fine to enjoy",
   "Ask first",
   "Walk away"
  ],
  "script": "This is the tool of the module, so build it with energy. Get the class chanting the three questions back: is it rushing me, is it hiding the price, is it random like a raffle. Then point at the three verdicts and make this crystal clear: fine to enjoy is a real verdict. Spending in games is not banned and not shameful. A clear price, no rush, no raffle, and a grown up who said yes is a perfectly good purchase. The spotters are not a wall, they are a torch.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "scenario",
  "label": "Evidence item two",
  "platform": "message",
  "handle": "Finn 🎮",
  "avatar": "🕹️",
  "meta": "Squad chat · 7:48pm",
  "text": "everyone in the squad has the dragon bundle now, it is only 999 gems and the event ends TONIGHT. just use your mum's card, she will not even notice. you are literally the only one without it 😬",
  "image": "🐉",
  "prompt": "Run all three spend spotters, then spot the fourth pressure that is not even from the game. What would you say back to Finn?",
  "script": "Read Finn's message aloud with real pressure in your voice. Then take it apart together: ends tonight is the rush, 999 gems is the hidden price, and the fourth pressure is a friend, which is the strongest one of all. Be clear that Finn is not a villain, Finn got caught by the same countdown and now it is spreading through him. Then the two hard lines, said kindly: a card that is not yours is never yours to use, not even a little bit, and a real friend hearing I need to ask first says fair enough. Script a reply together, something like: might get it, asking first, catch you in the lobby.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "Spend spotter patrol, on paper",
  "body": "Your teacher has six offers on the worksheet: shop screens, popups and chat messages. Run the three spend spotters on each one and give your verdict: fine to enjoy, ask first, or walk away. You have fifteen minutes. Every verdict needs a reason, a verdict without a reason does not count.",
  "script": "Hand out the worksheet. Fifteen minutes, bookmark strips on the tables so the three questions are in front of anyone who wants them. Support group works items one to three with you as a guided group. Stretch question for early finishers is on the plan: design the sneakiest FAIR shop screen you can. Circulate and collect one brilliant reason to read out at the end.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check one. A skin bundle you really want shows a timer: 09:59 left. You have birthday money saved. What do the spend spotters say?",
  "options": [
   {
    "text": "The timer means it is a great deal, so buy fast before it goes",
    "correct": false,
    "feedback": "The timer IS the trick. It exists to rush you past thinking. A deal that is only good for ten minutes is a deal that is scared of your brain."
   },
   {
    "text": "It is rushing me, so I pause and ask first. If it is really worth it, it is still worth it after asking",
    "correct": true,
    "feedback": "That is the spotters working. Rushing detected, so the calm brain takes over: pause, translate the price, ask a grown up. Most timed offers come back around anyway."
   },
   {
    "text": "Never buy anything in a game, it is all a scam",
    "correct": false,
    "feedback": "Spending you chose calmly, at a clear price, with permission, on a thing you can actually see is fine. The spotters are a check, not a ban."
   }
  ],
  "script": "First of two exit checks, done individually, this is your evidence of who got it. Watch for pupils choosing the third answer, the all games are scams position feels streetwise but it is the same lazy thinking as buying everything. The spotters exist because the honest answer is it depends, and now they can work out what it depends on.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check two. A chest costs 400 gems and gives a random prize. Your friend says paying for it is just like buying a toy in a shop. Is he right?",
  "options": [
   {
    "text": "No. In a shop you pay and get the thing you chose. With the chest you pay for a chance, like a raffle ticket",
    "correct": true,
    "feedback": "Exactly right. Shopping is money for a thing. A loot box is money for a maybe, and the game sets the odds. That difference is the whole reason spotter three exists."
   },
   {
    "text": "Yes, paying is paying, it makes no difference",
    "correct": false,
    "feedback": "It makes all the difference. A shop must hand you what you chose. A chest can hand almost everyone the small prize and keep the money, and the odds say it usually will."
   },
   {
    "text": "No, because chest prizes are never real",
    "correct": false,
    "feedback": "The prizes are real, that is what makes it clever. The problem is not fake prizes, it is that you are paying for a random chance with tiny odds of the one you want."
   }
  ],
  "script": "Second exit check. This one proves they understood the raffle idea, which is the deepest learning of the day. A pupil who can explain the difference between buying a thing and buying a chance has got everything this module wanted to give them.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Oliver",
  "text": "Is it rushing me? Is it hiding the price? Is it random like a raffle? Spend spotters, spotted it!",
  "script": "Whole class says it together, twice, louder the second time, with Oliver's coral energy. Point at each question on your fingers as they chant. This is the sentence you want shouted at a loot box screen in a living room this weekend.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "Games are brilliant AND designed to keep you playing and paying. Both things are true at once.",
   "The keep you playing kit: no finish line, streaks, near misses and boredom snacking. Noticing them is a player skill.",
   "The spend spotters: is it rushing me, is it hiding the price, is it random like a raffle?",
   "Real money always goes through a grown up, and anything truly worth buying is still worth buying after you ask."
  ],
  "script": "Four pupils read one point each. Then return to the start of the lesson: you walked in as players, you are walking out as players who have read the designer's playbook. Nothing about the game changed in the last hour. Everything about the player did.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi wraps the mission",
  "lines": [
   "Mission complete, squad! ⭐",
   "Three spend spotters, faster than a loading screen: is it rushing me, is it hiding the price, is it random like a raffle?",
   "Your mission this week: catch ONE trick in a game you love and name it out loud. Countdown clock, gem costume, mystery chest. Spotted it!",
   "The games companies have teams of expert designers. From today, every one of them has to get past YOU. See you next lesson!"
  ],
  "script": "Let DiGi land the ending, the bubbles appear on their own. Exit quizzes go out as this plays, named copies from the print room, and pupils write their commitment line on the exit card before they leave. Collect them in, they are your evidence for the register.",
  "phase": "close",
  "minutes": 2
 }
]$m05$::jsonb,
  '[]'::jsonb,
  $m05${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m05$::jsonb,
  $m05${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today we learned that games are brilliant and also carefully designed to keep children playing and paying, and that both things are true at once. Your child can now run the three spend spotters on any in game offer: is it rushing me, is it hiding the price, is it random like a raffle?",
 "try_this": "Next time your child plays, ask them to open the game's shop and point out one trick by name, the countdown clock, the gem prices or the mystery chest. They will enjoy being the expert, and naming tricks out loud is what makes the habit stick.",
 "family_question": "What is the cleverest trick a game or a shop has ever tried on you, and did it work?",
 "no_login_required": true
}$m05$::jsonb,
  $m05${
 "learning_objective": "Pupils can name the tricks games use to hold their time and can run the three spend spotters on any in game offer before any money moves.",
 "timing": "60 minutes: starter 8, cycle one 9, cycle two 12, cycle three 7, practise 15, prove 4, close 5",
 "misconceptions": [
  "Spending in games is always bad (a calm, clear priced purchase a grown up agreed to is fine, the problem is being rushed, price hidden or raffled, not spending itself)",
  "Loot boxes are just fun surprises (they are random chances you pay for, like raffle tickets, the game sets tiny odds and keeps the money either way, which is why some countries ban them for children)",
  "Only weak willed people get hooked (the tricks are built by expert teams to work on everyone, including adults, so noticing them is a skill to be proud of, not proof anyone was silly)"
 ],
 "differentiation": {
  "support": "Pair support pupils with a confident reader for the scenario slides and work worksheet items one to three as a guided group, with the bookmark strip on the table so the three questions are always in front of them.",
  "stretch": "Early finishers take the designer challenge: invent the fairest shop screen they can, clear pounds price, no timer, no chest, then explain why an honest shop might make less money in a week but keep its players for years."
 },
 "paper_fallback": "Print the slide pack. Run the starter from the printed title, objective and keywords pages, read both scenarios aloud with pupils playing the parts, draw the keep you playing kit and the three spend spotters on the board as they come up, and run both discussions with a sand timer. The worksheet, bookmark and exit quiz are already paper, so practise, prove and close run unchanged.",
 "keywords": [
  {
   "word": "loot box",
   "definition": "A chest or box you pay for without knowing what is inside. You are buying a chance, not a thing."
  },
  {
   "word": "in game currency",
   "definition": "Game money like gems or coins that you buy with real money. It hides what things really cost."
  },
  {
   "word": "limited time offer",
   "definition": "A deal with a countdown clock. The rush is designed to make you buy before you think."
  },
  {
   "word": "odds",
   "definition": "The chance of winning. 1 in 100 means if 100 people open the chest, about one gets the top prize."
  }
 ],
 "tool": {
  "heading": "The spend spotters",
  "lines": [
   "Is it rushing me?",
   "Is it hiding the price?",
   "Is it random like a raffle?"
  ],
  "strapline": "Three questions before any money moves. Anything worth buying is still worth buying after you ask."
 },
 "worksheet": {
  "title": "The spend spotter casebook",
  "directions": "Run the three spend spotters on each offer, give your verdict, and write the reason, a verdict without a reason does not count.",
  "verdict_options": [
   "Fine to enjoy",
   "Ask first",
   "Walk away"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "The game shop shows a sword skin for £1.99. The full price is on the label in pounds, there is no timer, and you have pocket money saved and permission to spend it.",
   "expected_verdict": "Fine to enjoy",
   "teaching_point": "Spending is not the enemy, tricks are. Clear price, no rush, no raffle, permission given: all three spotters pass, and that verdict matters as much as the others."
  },
  {
   "n": 2,
   "item": "MEGA CHEST: 480 gems for a CHANCE at a legendary item. The legendary odds are 1 in 100 in tiny writing. OFFER ENDS IN 14:32!",
   "expected_verdict": "Walk away",
   "teaching_point": "All three spotters fire at once: the countdown rushes you, gems hide the price, and a 1 in 100 chance is a raffle ticket. When all three fire, walking away is the strong move."
  },
  {
   "n": 3,
   "item": "You run out of gems mid battle. A popup offers 1,000 gems for £8.99, but the thing you want only needs 40 more gems.",
   "expected_verdict": "Ask first",
   "teaching_point": "The bundle mismatch is the hiding trick: £8.99 for 40 gems of need leaves 960 spare gems pulling you back to the shop. Translating it into pounds out loud is what asking first is for."
  },
  {
   "n": 4,
   "item": "A friend messages the squad chat: everyone has the dragon bundle, the event ends tonight, just borrow your mum's card, she will not notice.",
   "expected_verdict": "Walk away",
   "teaching_point": "The rush plus a friend's pressure plus a card that is not yours. A card that is not yours is never yours to use, and a real friend accepts I need to ask first."
  },
  {
   "n": 5,
   "item": "SPIN THE WHEEL! Your first spin is free and you win 50 gems. The next spin costs 99p and the top prize flashes SO CLOSE, TRY AGAIN!",
   "expected_verdict": "Walk away",
   "teaching_point": "The free first taste plus the near miss is the raffle machine warming you up. SO CLOSE is designed, the wheel was never nearly anything."
  },
  {
   "n": 6,
   "item": "Leo says: it is fine, the game is free so they have to make money somehow, and anyway I nearly won a legendary last time. Do you agree with Leo? Explain your verdict.",
   "expected_verdict": "Walk away",
   "teaching_point": "Leo is half right, companies do need money, and honest clear prices are the fair way to earn it. But nearly won is the near miss doing its job, and free means the shop inside IS the product. Credit answers that respect Leo while catching both tricks."
  }
 ],
 "commitment_stem": "My commitment: the next time a game rushes me, hides a price or offers a mystery chest, I will..."
}$m05$::jsonb,
  $m05${
 "required": false
}$m05$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 6: How algorithms work
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks2-06-how-algorithms-work', 'How algorithms work', 'KS2', 'Years 3 to 6', 'teacher',
  '{5,6}'::int[], ARRAY['Computing','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'Attention economy research', 'I can explain why my feed keeps me watching.', 'DiGi', 6,
  $m06$[
 {
  "type": "title",
  "eyebrow": "KS2 · Years 3 to 6 · Module 6",
  "title": "How algorithms work",
  "body": "One hour, one secret recipe: find out why your feed always knows exactly what you want to watch next.",
  "script": "Settle everyone with this slide up. Big opener: has anyone ever said just one more video and then looked up and half an hour had vanished? Take the laughs and the guilty hands. Today we find out exactly why that happens, and it is not because you are weak willed. There is a recipe behind your feed, and by the end of this hour you will know it.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can explain why my feed keeps me watching.",
  "why": "Every feed you scroll is run by an algorithm, a recipe of steps that decides what you see next. It is very good at its job, and its job is to keep you watching. Once you know the recipe, the feed stops being a mystery and you get to be the one in charge.",
  "gains": [
   "Explain what an algorithm is using the recipe idea",
   "Say the feed loop from memory: you watch, it learns, it serves more",
   "Spot the clues you leave behind that teach the feed what to show you",
   "Explain why the feed never runs out, and why an ending matters"
  ],
  "script": "Read the mission out loud, then the why. Ask: hands up if you think the app somehow KNOWS what you like. Keep a rough count of the hands. At the end of the lesson we will ask again, because by then everyone will know it is not magic, it is a recipe, and they will be able to say exactly how it works.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Squad words for today",
  "words": [
   {
    "word": "algorithm",
    "meaning": "A list of steps a computer follows in order to get a job done. A recipe for machines."
   },
   {
    "word": "feed",
    "meaning": "The stream of videos and posts an app lines up for you. You do not choose it, the algorithm does."
   },
   {
    "word": "data",
    "meaning": "The clues you leave behind: what you watch, tap, pause on, rewatch and skip."
   },
   {
    "word": "attention",
    "meaning": "Your watching time. It is what the app collects, and it is the most valuable thing you carry."
   }
  ],
  "script": "Say each word, class repeats it back. Algorithm is the big scary sounding one, so take the fear out of it now: it is just a recipe, and by the end of today they will have run one themselves on paper. Data is the sneaky one: point out that skipping a video is a clue too. Even doing nothing tells the app something.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Mission memory from last time. A game flashes OFFER ENDS IN 4 MINUTES over a glowing mystery chest. Which spend spotter tricks are firing?",
  "options": [
   {
    "text": "Rushing you with a timer AND hiding the prize behind raffle randomness",
    "correct": true,
    "feedback": "Sharp spotting. The countdown rushes your thinking and the mystery chest is a raffle, you pay before you know what you get. Tricks love to team up."
   },
   {
    "text": "No tricks, the timer is just being helpful",
    "correct": false,
    "feedback": "A real bargain can wait while you think. A timer that pushes you to decide in seconds is the rush trick, and it is there on purpose."
   },
   {
    "text": "Only hiding the real price",
    "correct": false,
    "feedback": "Hidden prices are a spend spotter trick, but look again: the countdown is rushing you and the mystery chest is raffle randomness. Two tricks at once."
   }
  ],
  "script": "Retrieval from last lesson, thirty seconds of thinking time before hands go up. Cold call two pupils for the reasoning, not just the answer. The point to land: the spend spotters were about games taking your money. Today we meet a machine that is after something even more valuable than money.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🍰",
  "heading": "An algorithm is a recipe",
  "body": "An algorithm sounds complicated, but it is just a list of steps followed in order to get a result. A cake recipe is an algorithm. Your route to school is an algorithm. A dance routine is an algorithm. Computers cannot think or guess, so they follow their steps exactly, every single time, millions of times a second. No magic, no brain, just steps.",
  "script": "Kill the mystery early. Ask the class for algorithms they already know: brushing teeth, tying laces, a penalty run up. Take three or four. Then the key line: a computer follows its recipe perfectly but has no idea what any of it means. It does not know what a cat video is. It just follows steps. Hold that thought, it matters later.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "pairs",
  "seconds": 60,
  "prompt": "Tell your partner the algorithm for making a jam sandwich. Every step, in order. Then swap: what goes wrong if the steps are in the wrong order?",
  "lookFor": "Precise steps in a sensible order, and the giggle moment when someone spreads jam before getting bread out. The learning: order matters, and a computer would follow the wrong order without noticing anything was wrong.",
  "script": "Sixty seconds on the timer, partner talk. After the chime, act out the funniest wrong order answer you heard, jam straight onto the plate works well. Then land it: you noticed it was wrong because you can think. A computer cannot. It just follows the steps it was given. So whoever writes the steps is really in charge."
 },
 {
  "type": "choice",
  "question": "Which of these is closest to what an algorithm really is?",
  "options": [
   {
    "text": "A magic robot brain that thinks like a person",
    "correct": false,
    "feedback": "No brain, no thinking, no magic. It is steps followed in order. The spooky feeling that the app knows you comes from somewhere else, and we are about to find it."
   },
   {
    "text": "A list of steps followed in order to get a result",
    "correct": true,
    "feedback": "Exactly. A recipe. And once you know a recipe exists, you can ask the detective question: who wrote it, and what result is it cooking up?"
   },
   {
    "text": "A trick apps use to be sneaky",
    "correct": false,
    "feedback": "Close but not quite. Algorithms themselves are just steps, and most are helpful. What matters is the result the steps are written to get. That is today's mystery."
   }
  ],
  "script": "Quick check, hands or devices. If anyone picks the third answer, celebrate the suspicion but sharpen it: an algorithm is a tool, like a recipe. A recipe can make a birthday cake or something horrible. The question is always what result the steps are chasing. Perfect setup for the next slide.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "feed",
  "handle": "cats.of.the.internet",
  "avatar": "🐱",
  "meta": "2h · Recommended for you",
  "text": "CAT #47 😂 this kitten discovers a mirror and loses its MIND. You are not ready for the ending 👇",
  "image": "🎬",
  "stats": "❤ 312K   ↻ 96.4K   💬 28.1K",
  "prompt": "Alma watched ONE cat video on Monday. By Friday her feed is wall to wall cats. Vote: is the app reading her mind, or is something else going on?",
  "script": "Run the vote, hands up for mind reading versus something else. Most classes split. Then the reveal question: what did Alma actually DO on Monday? She watched a cat video all the way through, maybe rewatched the funny bit, maybe smiled at her screen. The app cannot see the smile. But it counted everything else. Let that hang, then move on.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🔎",
  "heading": "The feed watches you back",
  "body": "While you watch the feed, the feed watches you. Every video you finish, every one you skip, every pause, every rewatch, every like: all of it becomes data, the clues in the recipe. The feed's algorithm scores thousands of videos against your clues and serves the highest scorer next. It is not reading your mind. It is reading your thumb.",
  "script": "The line to say slowly: it is not reading your mind, it is reading your thumb. Ask the class which clue they think counts the most. Likes usually win the vote, then flip it: watch time is the loudest clue of all. You never have to tap anything. Just watching to the end shouts SHOW ME MORE, even when you did not enjoy it. Faces usually change at that one.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The feed loop",
  "caption": "This loop spins every time you open the app. Say it with me: you watch, it learns, it serves more.",
  "steps": [
   {
    "emoji": "👀",
    "title": "You watch",
    "text": "Every second is counted, even when you never like, comment or tap a thing."
   },
   {
    "emoji": "🧠",
    "title": "It learns",
    "text": "Your pauses, rewatches and skips become clues. The recipe scores what to try on you next."
   },
   {
    "emoji": "📺",
    "title": "It serves more",
    "text": "The highest scoring video slides in before you can decide, and the loop starts again."
   }
  ],
  "script": "Walk the loop as it builds, tracing the circle with your finger. Then chant it as a class, twice: you watch, it learns, it serves more. Now the detective question: what is this recipe cooking? Not your happiness. Not your learning. Watching time. The loop has one job, keep the loop spinning. This diagram is the whole lesson, so do not rush it.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "choice",
  "question": "You watch a skateboard fail video right to the end and rewatch the crash twice. What does the feed loop do next?",
  "options": [
   {
    "text": "Serves you more fails and skateboard videos, because your watching taught it to",
    "correct": true,
    "feedback": "That is the loop. You watch, it learns, it serves more. You never asked for more fails. Your watch time asked for you."
   },
   {
    "text": "Nothing, because you did not press like",
    "correct": false,
    "feedback": "The like button is the quietest clue there is. Watching to the end and rewatching are the loudest. The loop heard you perfectly."
   },
   {
    "text": "Shows you something totally random to keep things fair",
    "correct": false,
    "feedback": "The feed is never random and it is not trying to be fair. It is trying to keep the loop spinning, so it serves whatever your clues scored highest."
   }
  ],
  "script": "Quick loop check, hands or devices. The misconception to smash here is option two: loads of pupils believe that if they never like anything, the feed learns nothing. Say it plainly: silence is not invisibility. Watch time talks even when your thumbs stay still.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 3,
  "mode": "groups",
  "seconds": 120,
  "prompt": "Think about YOUR feed, or a feed you have seen at home. What three things has the loop learned about you or your family? What did you DO to teach it each one?",
  "lookFor": "Pupils connecting their own behaviour to what gets served: I watched one football clip so now it is all football, my mum paused on cake videos so her feed is full of baking. No shame in any of it, the win is pupils seeing themselves inside the loop.",
  "script": "Groups of three or four, two minutes on the timer. This is the moment the lesson becomes about THEM, so circulate and collect the best examples. After the chime take one from each group. Keep it warm and shame free: everyone's feed has learned something, including yours, and sharing your own example first gives the room permission. The killer follow up: did you MEAN to teach it that?"
 },
 {
  "type": "concept",
  "emoji": "🥣",
  "heading": "The bottomless bowl",
  "body": "Here is the sneakiest part of the recipe: the feed never runs out. No last page, no final video, no THE END. The next video is always loaded before you finish this one, and autoplay starts it without asking. Why? Because an ending is a moment to choose. Finish a book and you decide what happens next. The feed is built to never hand you that moment.",
  "script": "Use the cereal bowl picture: imagine a bowl that silently refills itself before you ever see the bottom. You would eat way more than you meant to, not because you are greedy but because the STOP moment got stolen. That is the feed. Ask: when does a TV episode give you a choose moment? The end. When does the feed? Never, unless you make one yourself. That is not an accident, it is the recipe working.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "stat",
  "phase": "teach",
  "minutes": 1,
  "figure": "96%",
  "claim": "96 in every 100 UK children aged 3 to 17 watch video sharing platforms, so nearly everyone in this room meets a feed algorithm most days.",
  "source": "Ofcom Children and Parents: Media Use and Attitudes report, 2024",
  "script": "Let the number land. Then the reframe: this is not a lesson about some other kid's problem. Almost every one of us steps into the loop most days, which is exactly why knowing the recipe matters. This is equipment, not a telling off."
 },
 {
  "type": "scenario",
  "label": "Evidence item two",
  "platform": "message",
  "handle": "Teo ⚽",
  "avatar": "⚽",
  "meta": "Squad chat · 21:04",
  "text": "ok so I said ONE video after homework 😅 I did not press ANYTHING I promise, video 15 just started on its own and now it is 9 o clock. how did that even happen",
  "image": "📱",
  "prompt": "Teo thinks he did nothing. Use the feed loop to explain to Teo exactly what happened, step by step.",
  "script": "Pair talk, thirty seconds, then take answers. The class should be able to narrate it now: Teo watched, the loop learned, autoplay served more, and the bottomless bowl never gave him an ending to stop at. The big point: Teo is not weak and he is not in trouble. He was playing against a recipe he could not see. Now he can see it, and so can we.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "⭐",
  "heading": "Not magic, not evil, and now you know the recipe",
  "body": "So is the feed a monster? No. It is a machine, and machines do not hate you or love you. This one feeds on attention, so it serves whatever keeps you watching. Sometimes that is brilliant: new skills, new ideas, things that make you laugh. The skill is knowing whose turn it is. When you choose what to watch, you are using the feed. When video 15 autoplays at 9pm, the feed is using you. Knowing the recipe is how you tell the difference.",
  "script": "This is the calibration slide, so resist any temptation to make the feed the villain. Ask for hands: who has learned something genuinely great from a feed? Take two examples and celebrate them. Then the line that sticks: the feed is a tool that feeds on attention. Tools are fine when you are holding them. The question to carry out of the room is simply, whose turn is it, mine or the loop's?",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "Be the algorithm, on paper",
  "body": "Your teacher has six video cards on the worksheet, each showing how a viewer behaved: watched to the end, rewatched, liked, paused or skipped. YOU are the algorithm. Use the scoring rules on the sheet to score every card, then give each one a verdict: serve more, show sometimes, or bury it. Fifteen minutes. When you finish, answer the big question at the bottom: what has this feed learned about its viewer, and did the viewer mean to teach it?",
  "script": "Hand out the worksheet. Fifteen minutes, feed loop bookmarks on tables for anyone who wants the loop in front of them. Support group works items one to three with you, saying the loop out loud as they score. Stretch question for early finishers: invent one new rule that would make this feed kinder to its viewer. Circulate and grab one brilliant answer to item six to read out. The magic moment to watch for: pupils realising the scary prank video scores HIGH. The algorithm cannot tell fun from fear, it only counts watching.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check one. Your feed has become wall to wall football videos. What is the honest explanation?",
  "options": [
   {
    "text": "The loop learned from what you watched, paused on and rewatched, then served more",
    "correct": true,
    "feedback": "That is the feed loop, said like someone who knows the recipe. You watch, it learns, it serves more. No magic anywhere."
   },
   {
    "text": "The app read your mind and knows you love football",
    "correct": false,
    "feedback": "No app can read a mind. It read your thumb: your watch time, pauses and rewatches taught it exactly what to serve."
   },
   {
    "text": "It is a lucky coincidence",
    "correct": false,
    "feedback": "The feed is never a coincidence. Every video was picked by a recipe scoring your clues. Once you know that, feeds stop being spooky."
   }
  ],
  "script": "First of two exit checks and this one IS the lesson outcome, so treat it as your evidence. Silent, independent answers. A pupil who picks the first option and can mutter the loop chant has met the objective. Anyone on mind reading needs the diagram slide again, the back button works.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check two. Why does the feed never run out?",
  "options": [
   {
    "text": "An ending would hand you a moment to choose, and the feed is built to keep you watching",
    "correct": true,
    "feedback": "Exactly. The bottomless bowl is on purpose. Endings are choose moments, so the recipe deletes them. Making your own ending is taking charge."
   },
   {
    "text": "There are so many videos it would be impossible to run out",
    "correct": false,
    "feedback": "There are lots of videos, but that is not why there is no ending. The recipe deliberately loads the next one and autoplays it so you never reach a stopping point."
   },
   {
    "text": "The app wants to make sure you never miss anything important",
    "correct": false,
    "feedback": "The feed does not know what is important to you, it only knows what keeps you watching. The endless scroll serves the loop, not you."
   }
  ],
  "script": "Second exit check, same rules, silent and independent. This one tests the bottomless bowl idea. Both exit checks go home on the printed quiz, so collect them in, they are your evidence for the register.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like DiGi",
  "text": "You watch, it learns, it serves more. I know the loop, so I choose when it stops!",
  "script": "Whole class, twice, louder the second time. This is the sentence you want repeated at dinner tables tonight, so make it feel like a squad chant, not a test answer. Point at each part of the loop diagram on the wall or board as they say it if you can.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "An algorithm is a recipe of steps. No magic, no brain, just steps followed exactly.",
   "The feed loop: you watch, it learns, it serves more. Your watch time is the loudest clue you give it.",
   "The feed never runs out on purpose. Endings are choose moments, so the recipe removes them.",
   "The feed is not evil and not magic. It is a machine that feeds on attention, and knowing the recipe puts you back in charge."
  ],
  "script": "Return to the hands up count from the start: who thought the app somehow KNOWS what you like? Ask it again now and enjoy the difference. Then the recap, read by pupils, one point each. Finish with the question they take home: whose turn is it tonight, yours or the loop's?",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi wraps it up",
  "lines": [
   "Squad, you cracked my favourite case! ⭐",
   "The feed loop: you watch, it learns, it serves more. It is a recipe, and now you can read it.",
   "Your mission this week: catch autoplay starting one video you never chose, and make your own ending. That is you taking your turn back.",
   "The feed is clever, but it only has a recipe. You have a whole brilliant brain. Shine on, and I will see you next mission!"
  ],
  "script": "Let DiGi land the ending, the bubbles appear on their own. While it plays, pupils write their commitment line on the exit card: what they will do next time a video starts on its own. Exit quizzes collected in as they leave.",
  "phase": "close",
  "minutes": 2
 }
]$m06$::jsonb,
  '[]'::jsonb,
  $m06${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m06$::jsonb,
  $m06${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned what an algorithm really is (a recipe of steps, not magic) and how the feed loop works: you watch, it learns, it serves more. They played the algorithm themselves on paper, scoring videos the way a feed does, and discovered why feeds never run out.",
 "try_this": "Sit with your child for five minutes of a feed, yours or theirs, and count together how many videos arrived without anyone choosing them. Then let your child explain the loop to you. They know the whole recipe.",
 "family_question": "What do you think your feed has learned about you, and did you mean to teach it that?",
 "no_login_required": true
}$m06$::jsonb,
  $m06${
 "learning_objective": "Pupils can explain the feed loop (you watch, it learns, it serves more) and use it to explain why a feed keeps them watching and never runs out.",
 "timing": "60 minutes: starter 8, cycle one (algorithms are recipes) 6, cycle two (the feed loop) 14, cycle three (the bottomless bowl) 8, practise 15, prove 4, close 5",
 "misconceptions": [
  "The app reads my mind (it reads behaviour, not minds: watch time, pauses, rewatches and skips are the only clues it has, and they are enough)",
  "If I never like or comment, the feed learns nothing about me (watch time is the loudest clue of all, silence is not invisibility)",
  "The feed is evil and out to get kids (it is a machine optimised for attention, not a villain, and it can serve brilliant things: the skill is knowing whose turn it is, yours or the loop's)"
 ],
 "differentiation": {
  "support": "Work worksheet items one to three as a guided group, saying the loop out loud at each step. Feed loop bookmark strips on the table so the three steps and the scoring rules are always in front of them. Scores can be tallied with counters.",
  "stretch": "Early finishers invent one new scoring rule that would make the feed kinder to its viewer and explain what would change, or write what a feed would honestly learn about them after one week and whether they meant to teach it."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Draw the feed loop as a circle of three arrows on the board and have the class chant it. Read both scenarios aloud in character, Alma's cat feed and Teo's 9pm message, and run the votes with hands up. Choice slides become read aloud questions with corner voting. The worksheet is already a paper algorithm, so the practise phase needs no screen at all. Exit checks run from the printed quiz.",
 "keywords": [
  {
   "word": "algorithm",
   "definition": "A list of steps a computer follows in order to get a job done. A recipe for machines."
  },
  {
   "word": "feed",
   "definition": "The stream of videos and posts an app lines up for you. You do not choose it, the algorithm does."
  },
  {
   "word": "data",
   "definition": "The clues you leave behind: what you watch, tap, pause on, rewatch and skip."
  },
  {
   "word": "attention",
   "definition": "Your watching time. It is what the app collects, and it is the most valuable thing you carry."
  }
 ],
 "tool": {
  "heading": "The feed loop",
  "lines": [
   "You watch",
   "It learns",
   "It serves more"
  ],
  "strapline": "The feed loop: you watch, it learns, it serves more."
 },
 "worksheet": {
  "title": "Be the algorithm",
  "directions": "You are the feed's algorithm: score each video card with the rules (watched to the end +2, rewatched +3, liked +1, paused on it +1, skipped after a few seconds take away 2), then give your verdict.",
  "verdict_options": [
   "Serve more",
   "Show sometimes",
   "Bury it"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "A skateboard fail video. The viewer watched it to the very end and rewatched the crash twice.",
   "expected_verdict": "Serve more",
   "teaching_point": "Watched to the end plus two rewatches is a huge score. Nobody pressed like, and the loop still heard everything. Watch time is the loudest clue."
  },
  {
   "n": 2,
   "item": "A ten minute craft tutorial. The viewer skipped it after three seconds.",
   "expected_verdict": "Bury it",
   "teaching_point": "A fast skip scores below zero. The loop learns from what you refuse just as much as from what you finish."
  },
  {
   "n": 3,
   "item": "A puppy video. The viewer pressed like but skipped away halfway through.",
   "expected_verdict": "Show sometimes",
   "teaching_point": "A like plus a skip lands in the middle. When the thumb and the watch time disagree, the algorithm trusts the watch time more than the like."
  },
  {
   "n": 4,
   "item": "A scary prank video that made the viewer feel horrible, but they watched every second because they could not look away.",
   "expected_verdict": "Serve more",
   "teaching_point": "The uncomfortable one, and the most important. The recipe counts watching, not enjoying. It cannot tell fun from fear, so feeling horrible can still teach the feed to serve more of the same."
  },
  {
   "n": 5,
   "item": "A football skills video. The viewer never liked it, but paused their scrolling on it and then watched three more football videos in a row.",
   "expected_verdict": "Serve more",
   "teaching_point": "Pausing is data and so is the pattern that follows. Three in a row is a shout, and by tomorrow this feed is a football feed."
  },
  {
   "n": 6,
   "item": "Teo says: the app is being kind to me, it gives me videos I love for free. Do you agree? Use the feed loop in your answer.",
   "expected_verdict": "Serve more",
   "teaching_point": "Partly agree at best. The videos do arrive and some are great, but they are not free and it is not kindness: the viewer pays in attention, and the loop serves whatever keeps them watching. Strong answers name all three steps of the loop."
  }
 ],
 "commitment_stem": "My commitment: next time a video starts on its own, I will..."
}$m06$::jsonb,
  $m06${
 "required": false
}$m06$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 7: Privacy and digital reputation
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks2-07-privacy-reputation', 'Privacy and digital reputation', 'KS2', 'Years 3 to 6', 'teacher',
  '{3,7}'::int[], ARRAY['EfCW privacy and reputation']::text[], '{}'::text[],
  'Footprint permanence research', 'I can decide what not to share.', 'Sofia', 7,
  $m07$[
 {
  "type": "title",
  "eyebrow": "KS2 · Years 3 to 6 · Module 7",
  "title": "Privacy and digital reputation",
  "body": "One hour, one superpower: knowing exactly what to keep back, so YOU stay the editor of your own story.",
  "script": "Settle everyone with this slide up. Today the squad gets a new mission from Sofia, our safety expert in green. Ask the room: who here has ever kept a brilliant secret, a birthday present, a surprise party? Hands up. Then: today you learn which things about YOU are worth keeping like that, and why the best sharers online are actually the best keepers.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can decide what not to share.",
  "why": "Everything you post, send or type into an app becomes part of your story online, and that story can stick around for years. Today is not about being scared of sharing. It is about being the editor: sharing loads of great stuff and knowing exactly which few things to keep back.",
  "gains": [
   "Sort private information from shareable information in seconds",
   "Run the share test on anything before it leaves your hands",
   "Explain why deleted is not the same as gone",
   "Look after your digital footprint like an editor, not a passenger"
  ],
  "script": "Read the mission out loud, then the why. Big framing move: this lesson is NOT stop sharing things. Editors of newspapers share stories every single day, and their real skill is choosing what does not go in. Ask: what does an editor do? Take two answers, then land it: an editor decides what gets published. Today, that is you.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Mission words for today",
  "words": [
   {
    "word": "private",
    "meaning": "Information that belongs to you and your family, like your address or password. You choose who gets it, and most people do not need it."
   },
   {
    "word": "screenshot",
    "meaning": "A photo of a screen. Anyone can take one of anything you send, and you will never know they did."
   },
   {
    "word": "digital footprint",
    "meaning": "The trail of everything you have posted, sent, liked or typed online. It grows whether you look after it or not."
   },
   {
    "word": "reputation",
    "meaning": "What people think of you from what they see and hear. Online, your posts do the talking even when you are not there."
   }
  ],
  "script": "Say each word, class repeats it back. For footprint, do the walk: take three exaggerated steps across the front of the room and point at the invisible prints behind you. Every post is a footprint, and online the mud never dries. For reputation, ask: can a post talk about you while you are asleep? Yes. That is why the editor decides carefully.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Warm up from the last mission. You watch three skateboarding videos. Why does your feed suddenly fill up with even more skateboarding?",
  "options": [
   {
    "text": "The feed learned what you watched and served you more of it",
    "correct": true,
    "feedback": "Exactly. You watch, it learns, it serves more. That loop never switches off, and today you will see it also learns from what you SHARE, not just what you watch."
   },
   {
    "text": "Skateboarding videos are the only videos left",
    "correct": false,
    "feedback": "There are millions of videos about everything. The feed chose skateboarding FOR you because you watched it. You watch, it learns, it serves more."
   },
   {
    "text": "It is just a lucky coincidence",
    "correct": false,
    "feedback": "No luck involved. The feed watched you watching, learned what held your eyes, and served more. That was the whole loop from last lesson."
   }
  ],
  "script": "Retrieval from the feed loop lesson. Thirty seconds of thinking time before hands go up, then cold call two pupils for the reasoning, not just the answer. Bridge to today: last time we learned the feed collects what you WATCH. Today, the bigger question: what happens to the things you SHARE?",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "📖",
  "heading": "You are the editor of your own story",
  "body": "Your life online is a story, and stories have editors. An editor is not the person who says no to everything, they are the person who chooses what goes in and what stays out. Nobody else gets to edit your story: not a group chat, not a quiz app, not a friend saying go on, just send it. Sharing your dragon drawing, your match highlights, your best joke? Brilliant, publish away. The editor skill is knowing the small list of things that never go in.",
  "script": "This is the identity of the whole lesson, so give it energy. Ask: if a stranger walked into the playground and asked for your address, would you hand it over? Of course not. Online, apps and chats ask for exactly that kind of thing all the time, just more politely and with cuter graphics. Same answer applies. The editor decides, and the editor is you.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The private list",
  "caption": "Four kinds of information that stay in the vault. Everything else, the editor decides case by case.",
  "steps": [
   {
    "emoji": "🪪",
    "title": "Who you are",
    "text": "Full name, age and birthday together are a key to you. First name alone is usually fine, the full set is not."
   },
   {
    "emoji": "📍",
    "title": "Where you are",
    "text": "Your address, your school name, and photos in school uniform. A uniform is a badge that says where to find you every weekday."
   },
   {
    "emoji": "🔑",
    "title": "What unlocks things",
    "text": "Passwords, and the clue questions behind them: pet names, your street, your favourite teacher."
   },
   {
    "emoji": "📸",
    "title": "Photos you cannot take back",
    "text": "Any photo of you or your friends you would not want the whole school to see. Once sent, it travels without you."
   }
  ],
  "script": "Walk the four vault items as they build. The uniform one surprises pupils every year, so slow down on it: your uniform is basically a sign saying I am at this exact building Monday to Friday. Then the clue questions: ask who has ever seen a quiz asking for a pet name. Loads of hands. Hold that thought, we are coming back for it. Finish with: this is a SHORT list. Four things. Everything else, you get to choose.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "Which of these is the editor most likely to say YES to publishing?",
  "options": [
   {
    "text": "A photo of the amazing pizza you made, no faces, no house number",
    "correct": true,
    "feedback": "Publish away! Privacy is not hiding everything, it is choosing. A pizza tells nobody who you are, where you are, or what unlocks your accounts."
   },
   {
    "text": "A photo of your class on a school trip, everyone in uniform",
    "correct": false,
    "feedback": "That one hits the vault twice: uniforms give away the school, and it shares other people's faces without asking them. Their editors get a say too."
   },
   {
    "text": "Your full name and birthday, so friends know when to send presents",
    "correct": false,
    "feedback": "Full name plus birthday is a key to you, that combination helps people pretend to be you. Tell friends your birthday out loud instead, presents still arrive."
   }
  ],
  "script": "Quick check on the private list. The pizza answer matters as much as the wrong ones: if pupils leave thinking share nothing ever, we have failed. Land it clearly: the pizza is a yes, sharing is allowed, the vault list is short. Watch for pupils who argue the class photo is fine because everyone is smiling. Nice photo, still leaks the school, and the other children did not get a vote.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🐘",
  "heading": "The internet remembers",
  "body": "Here is the strange rule of sharing online: sending is instant, but unsending is impossible. The moment something leaves your device, anyone who sees it can screenshot it, save it or forward it, and you will never know. Pressing delete only removes it from YOUR view, like turning your back on a poster that is still on the wall. That is why editors decide BEFORE they publish, not after. Before is a choice. After is a hope.",
  "script": "The elephant never forgets, and neither does the internet. Do the poster demo: stick a piece of paper on the board, then turn your back on it and announce, deleted! Ask the class: is it gone? They can all still see it. That is exactly what delete does online. Repeat the line and have them say it back: before is a choice, after is a hope.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "message",
  "handle": "Year 5 Legends 🏆",
  "avatar": "🏆",
  "meta": "Group chat · 14 people · 2 you have never met",
  "text": "everyone send a pic of yourself in school uniform for the big class collage!! 📸 nearly everyone has done it, just waiting on YOU now, hurry up lol",
  "image": "🤳",
  "prompt": "Fourteen people, two you have never met, and a photo that shows your school badge. What is really being asked for here?",
  "script": "Read the message out loud in your best pushy voice. Then unpack it in three moves. One: who actually sees this photo? Fourteen people, including two mystery members, and anyone THEY forward it to. Two: what does the uniform reveal? The school, which is a place and a timetable. Three: notice the pressure, nearly everyone has, just waiting on YOU. Pressure is not a reason, it is a warning light. Kind friends can be in the chat and it still is not a safe place for that photo.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The journey of one shared photo",
  "caption": "You control exactly one step of this journey: the first one.",
  "steps": [
   {
    "emoji": "📤",
    "title": "You press send",
    "text": "The photo leaves your device. This is the last moment it belongs only to you."
   },
   {
    "emoji": "📱",
    "title": "Fourteen screens light up",
    "text": "Every person in the chat now has their own copy on their own device."
   },
   {
    "emoji": "📸",
    "title": "Someone screenshots it",
    "text": "Silently. No alert, no permission, no way for you to know it happened."
   },
   {
    "emoji": "🌍",
    "title": "It travels without you",
    "text": "Forwarded to other chats, saved to other phones. Delete yours and every other copy still exists."
   }
  ],
  "script": "Walk the journey as it builds and let the class feel the control draining away step by step. At the end, ask the killer question: which step do YOU control? Only the first. So which step does all your power live in? The first. That is not scary news, it is brilliant news, because it means one good decision at step one beats a hundred panicked deletes at step four.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "You sent a silly photo to a group chat, thought better of it, and deleted it two minutes later. What is true?",
  "options": [
   {
    "text": "It might still exist on other phones, because delete only removes YOUR copy",
    "correct": true,
    "feedback": "Right. Two minutes is plenty of time for a screenshot, and forwarded copies do not vanish when yours does. This is exactly why editors decide before sending."
   },
   {
    "text": "It is gone everywhere, delete means delete",
    "correct": false,
    "feedback": "Delete removes it from your view, like turning your back on the poster. Screenshots and forwarded copies live on devices you cannot reach."
   },
   {
    "text": "It is fine as long as you deleted it within five minutes",
    "correct": false,
    "feedback": "There is no safe time window. A screenshot takes one second and makes a copy you can never delete. Before is a choice, after is a hope."
   }
  ],
  "script": "Quick whole class check, hands or devices. If anyone picks the five minute answer, do not mock it, it is a really common belief among adults too. Bring back the poster on the board: did turning your back make it disappear? Same rule, every time.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🌱",
  "heading": "Your footprint grows either way",
  "body": "Your digital footprint is like a garden: it grows whether you tend it or not. Every post, comment, quiz answer and shared photo is a seed, and years from now, secondary schools, clubs and even employers may wander through and look around. Ignore the garden and weeds grow that you did not choose. Tend it, and it becomes a garden you are proud to show people: your art, your goals, your best jokes. Same garden, same you. The only difference is whether the editor showed up.",
  "script": "Make this future feel real without making it heavy. Say: one day, someone deciding whether to pick you for a team, a school or a job will type your name into a search bar. Pause. What do you want them to find? Take two or three answers, they are usually lovely: my football highlights, my art, my baking. Exactly. That garden does not grow by accident. You plant it.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The share test",
  "caption": "Three questions before anything leaves your hands. Any question fails, the editor holds it back.",
  "steps": [
   {
    "emoji": "📣",
    "title": "One: would I shout it in assembly?",
    "text": "The whole school, all the teachers, everyone hearing it at once. If that thought makes you wince, do not send it."
   },
   {
    "emoji": "📍",
    "title": "Two: does it give away where I am?",
    "text": "Address, school name, uniform, street signs in the background. Location leaks hide in the corners of photos."
   },
   {
    "emoji": "🔮",
    "title": "Three: could it hurt future me?",
    "text": "You at 16, at a new school, going for a job. The internet remembers, so post things future you will high five you for."
   }
  ],
  "verdicts": [
   "Share it",
   "Think twice",
   "Keep it private"
  ],
  "script": "This is the tool of the whole mission, so take your time as it builds. Get the class chanting the three questions back: would I shout it in assembly, does it give away where I am, could it hurt future me. Twice through, louder the second time. Then the verdicts: every share test ends in one of these three, and think twice is a real verdict, it means fix something first, crop the photo, ask a friend, ask a grown up. Run the test live on the pizza photo from earlier: assembly, fine. Location, none. Future me, delighted. Share it!",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "scenario",
  "label": "Evidence item two",
  "platform": "feed",
  "handle": "QuizzyPaws",
  "avatar": "🐶",
  "meta": "Sponsored · Played 2.1M times",
  "text": "Which puppy matches YOUR personality?! 🐾 To get your PAWFECT match, just tell us: your first pet's name, the street you grew up on, and your favourite teacher! Results in 10 seconds!",
  "image": "🧩",
  "stats": "❤ 412K   ↻ 88.1K   💬 31.6K",
  "prompt": "Cute puppy, ten second quiz. Run the share test on it. Which question fires first, and why would a puppy quiz want your pet's name?",
  "script": "Let them enjoy how cute it looks first, that is the whole trick. Then run the test together. Assembly test: would you shout your street name in assembly? Hmm. Location test: it literally asks for a street. Future me test: here is the detective reveal, pet name, street, favourite teacher are the exact backup questions that unlock forgotten passwords. Ask: who might collect answers like that, and what could they open with them? A puppy quiz does not need any of it to tell you that you are a golden retriever. The questions ARE the product.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "The puppy quiz asks for your first pet's name and your street. What is the sharpest editor move?",
  "options": [
   {
    "text": "Skip it, or play with made up answers, because those are password clue questions",
    "correct": true,
    "feedback": "Detective work. Pet names and streets unlock forgotten passwords, so they live in the vault. A quiz that needs them is collecting keys, not matching puppies."
   },
   {
    "text": "Answer honestly, it is only a puppy quiz",
    "correct": false,
    "feedback": "The quiz is the costume, the questions are the point. Real pet names and streets are the clue questions behind passwords, and honest answers hand over the keys."
   },
   {
    "text": "Answer, but only if the quiz has lots of likes",
    "correct": false,
    "feedback": "Likes measure popularity, not safety, remember the feed loop serves whatever gets attention. Two million plays just means two million people got asked for their keys."
   }
  ],
  "script": "Watch for the likes answer, it connects beautifully back to last lesson: the feed boosts what gets attention, so popular never means safe. Celebrate anyone who suggests playing with made up answers, that is proper editor thinking, you get the fun and keep the keys.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "groups",
  "seconds": 90,
  "prompt": "Which of the three share test questions would YOU be most likely to forget in a hurry, and what could you do so you remember it?",
  "lookFor": "Honesty first. Most pupils forget the future me question because the future feels far away. Good fixes: say the chant before posting, imagine Year 6 you watching over your shoulder, ask does this go in my garden.",
  "script": "Groups of three or four, ninety seconds on the timer. You are listening for honesty, not right answers, so share your own weak question first, most adults forget future me too. After the chime, collect one answer per group and one fix per group. Any group that invents its own memory trick, name it after them for the rest of the lesson."
 },
 {
  "type": "tryit",
  "heading": "Editor practice, on paper",
  "body": "Your teacher has six items on the worksheet: posts, chat messages and quiz questions, all waiting for an editor's decision. Run the share test on each one and give a verdict: share it, think twice, or keep it private. You have fifteen minutes. Every verdict needs a reason from the three questions, a verdict without a reason does not count.",
  "script": "Hand out the worksheets, bookmark strips with the three questions on tables for anyone who wants them in front of them. Fifteen minutes. Support group works items one to three with you, saying the three questions out loud for each item. Stretch question for early finishers: item five could become a share it with one change, what is the change? Circulate and collect one brilliant reason to read out to the class at the end.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check. A game asks you to set a backup question and suggests what is your pet's name? What do you now know that most people do not?",
  "options": [
   {
    "text": "Pet names are keys, so if I have shared mine anywhere, I should pick a different backup question",
    "correct": true,
    "feedback": "Editor level thinking. Backup questions unlock accounts, so the answers belong in the vault, and an answer you have posted about is a key left in the door."
   },
   {
    "text": "Pet names are safe because pets do not use the internet",
    "correct": false,
    "feedback": "Your pet is not the risk, the NAME is. It unlocks forgotten passwords, which is why quizzes and strangers fish for it."
   },
   {
    "text": "Backup questions do not matter as long as your main password is strong",
    "correct": false,
    "feedback": "A backup question is a second door into the same account. The strongest front door does not help if the back door key is posted in a puppy quiz."
   }
  ],
  "script": "First of two exit checks, this one mirrors the quiz app evidence. Silent, independent, no conferring, this is where you find out who owns the learning. A wrong answer here tells you exactly who to mark as working towards on the register.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check. You posted something, regretted it, and deleted it straight away. True or false: it is definitely gone.",
  "options": [
   {
    "text": "False. Screenshots and forwarded copies can outlive your delete, so the real decision happens before you press send",
    "correct": true,
    "feedback": "Exactly right. Delete removes your copy, not the copies on other devices. Before is a choice, after is a hope, which is why the share test runs first."
   },
   {
    "text": "True. Deleting removes it from the internet completely",
    "correct": false,
    "feedback": "Delete only removes it from your view. Anyone who screenshotted or forwarded it still has a copy you cannot reach. The share test runs BEFORE send for exactly this reason."
   }
  ],
  "script": "Second exit check, the deleted is not gone principle, and the one parents most often get wrong at home. If a pupil answers false but cannot say why, prompt for the poster on the board, the reason matters as much as the verdict.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Sofia",
  "text": "Would I shout it in assembly? Does it give away where I am? Could it hurt future me? Three questions, then I decide. I am the editor of my story.",
  "script": "Whole class says it together, twice, louder the second time. Sofia is the calm one in green, so the second run through can be strong and steady rather than shouty. This is the sentence you want repeated at dinner tables tonight.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "The private list is short: who you are, where you are, what unlocks things, and photos you cannot take back. Everything else, the editor decides.",
   "Deleted is not gone. Screenshots and forwarded copies live on other devices, so the real decision happens before you press send.",
   "Your digital footprint grows whether you tend it or not. Plant a garden you are proud of.",
   "The share test: would I shout it in assembly, does it give away where I am, could it hurt future me. Any question fails, hold it back."
  ],
  "script": "Pupils read the recap, one point each. Then return to the editor idea from the start: ask who is the editor of your story online, and enjoy the answer coming back, ME. One last connection: remember the feed loop learns from everything you do. An editor who chooses well is feeding it better ingredients too.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi closes the mission",
  "lines": [
   "Mission complete, editors! ⭐",
   "Three questions before anything leaves your hands: would I shout it in assembly, does it give away where I am, could it hurt future me?",
   "Your mission this week: run the share test on one real thing before you send it, a photo, a message, a quiz answer. One test makes you sharper. Ten make you the sharpest editor in the school.",
   "Your story is brilliant, and it belongs to you. Keep editing it well. See you next mission!"
  ],
  "script": "Let DiGi land the ending, the bubbles appear on their own. Exit quizzes go out as this plays, named copies from the print room. Collect them in, they are your evidence for the register, and the commitment cards go home in book bags with the parent note.",
  "phase": "close",
  "minutes": 2
 }
]$m07$::jsonb,
  '[]'::jsonb,
  $m07${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 3,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m07$::jsonb,
  $m07${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned to be the editor of their own story online: which information stays private (full name and birthday together, school and address, passwords and their clue questions, photos they cannot take back) and why deleted is not the same as gone. Their tool is the share test: would I shout it in assembly, does it give away where I am, could it hurt future me?",
 "try_this": "Next time anyone in the family is about to post a photo, run the share test on it together out loud before pressing send. Let your child lead, they know the three questions by heart.",
 "family_question": "What is one thing about our family that we keep just for us?",
 "no_login_required": true
}$m07$::jsonb,
  $m07${
 "learning_objective": "Pupils can identify which personal information stays private, explain why deleted content is not gone, and run the three question share test to decide what not to share.",
 "timing": "60 minutes: starter 8, cycle one 7, cycle two 9, cycle three 12, practise 15, prove 4, close 5",
 "misconceptions": [
  "Deleting a post removes it from the internet (delete only removes your copy, screenshots and forwarded copies live on devices you cannot reach)",
  "Privacy risks only come from strangers (most oversharing happens in friendly places like group chats, and kind friends can still screenshot and forward)",
  "Being private means sharing nothing (privacy is choosing, the vault list is four items, and sharing art, sport and jokes is encouraged when the share test passes)"
 ],
 "differentiation": {
  "support": "Work items one to three of the worksheet as a guided group, saying the three share test questions out loud for every item and pointing to each question on the bookmark strip before giving a verdict.",
  "stretch": "Early finishers take item five and redesign it into a share it: what one change (cropping the street sign, removing the uniform, asking permission) moves the verdict? Then write one extra worksheet item of their own that fails exactly one of the three questions."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Read the group chat and quiz app scenarios aloud in character from the pack, draw the four step journey of a shared photo on the board one arrow at a time, and do the poster demo for deleted is not gone (stick paper on the board, turn your back, ask if it is gone). The share test bookmark replaces the diagram slide, the class chants the three questions from it, and the two exit checks run as the printed quiz.",
 "keywords": [
  {
   "word": "private",
   "definition": "Information that belongs to you and your family, like your address or password. You choose who gets it, and most people do not need it."
  },
  {
   "word": "screenshot",
   "definition": "A photo of a screen. Anyone can take one of anything you send, and you will never know they did."
  },
  {
   "word": "digital footprint",
   "definition": "The trail of everything you have posted, sent, liked or typed online. It grows whether you look after it or not."
  },
  {
   "word": "reputation",
   "definition": "What people think of you from what they see and hear. Online, your posts do the talking even when you are not there."
  }
 ],
 "tool": {
  "heading": "The share test",
  "lines": [
   "Would I shout it in assembly?",
   "Does it give away where I am?",
   "Could it hurt future me?"
  ],
  "strapline": "Three questions, then I decide. I am the editor of my story."
 },
 "worksheet": {
  "title": "The editor's desk: six items waiting for your verdict",
  "directions": "Run the three share test questions on each item, circle your verdict, and write the reason from the question that decided it.",
  "verdict_options": [
   "Share it",
   "Think twice",
   "Keep it private"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "A quiz app promises to reveal your superhero name if you type in your first pet's name and the street you live on.",
   "expected_verdict": "Keep it private",
   "teaching_point": "Pet names and streets are the backup questions that unlock passwords. A quiz that asks for them is collecting keys. Playing with made up answers is a clever editor move."
  },
  {
   "n": 2,
   "item": "You drew an incredible dragon and want to post a photo of the drawing. No faces, no names, nothing else in the shot.",
   "expected_verdict": "Share it",
   "teaching_point": "Privacy is choosing, not hiding everything. The dragon passes all three questions, and sharing your best work plants a garden you are proud of."
  },
  {
   "n": 3,
   "item": "The class group chat asks everyone to send a photo of themselves in school uniform for a collage. Two people in the chat have never been to your school.",
   "expected_verdict": "Keep it private",
   "teaching_point": "Uniform is a badge that says where to find you every weekday, and a group chat photo can be screenshotted and forwarded beyond the chat. Pressure like everyone else has is a warning light, not a reason."
  },
  {
   "n": 4,
   "item": "Your best friend asks for your game password so they can collect your daily rewards while you are on holiday.",
   "expected_verdict": "Keep it private",
   "teaching_point": "Passwords stay with you and a grown up at home, even with best friends. Friendship is not the issue, control is: a shared password is a shared account forever."
  },
  {
   "n": 5,
   "item": "You scored the winning goal and want to post the video. Watching it back, you spot your street sign in the background.",
   "expected_verdict": "Think twice",
   "teaching_point": "The goal is shareable, the street sign is the leak. Think twice means fix it first: trim or crop the video so the location is gone, then it passes."
  },
  {
   "n": 6,
   "item": "Teo says: I sent it, I regretted it, I deleted it straight away, so it is gone and nobody can ever see it. Do you agree with Teo? Explain your reasoning.",
   "expected_verdict": "Think twice",
   "teaching_point": "Teo is wrong about gone: delete removes his copy, not screenshots or forwarded copies on other devices. The full answer explains that the real decision happens before pressing send, which is why the share test runs first."
  }
 ],
 "commitment_stem": "My commitment: before I share anything this week, I will ask the three share test questions, starting with"
}$m07$::jsonb,
  $m07${
 "required": true,
 "note": "The group chat scenario can surface real disclosures: a pupil may say someone online has asked them for photos or personal details, or that they have already shared something they regret. Reassure first, you are not in trouble and you did the right thing telling me, then follow your school safeguarding policy and log the concern the same day. Do not investigate the chat yourself or ask the pupil to show you the messages beyond what they volunteer.",
 "concern_form_linked": true
}$m07$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 8: Being kind and safe with others online
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks2-08-kind-safe-online', 'Being kind and safe with others online', 'KS2', 'Years 3 to 6', 'teacher',
  '{2,4}'::int[], ARRAY['RSHE','Anti bullying (Ofsted)']::text[], '{}'::text[],
  'Cyberbullying prevalence data', 'I know three things to do if someone is unkind online.', 'Sofia with Zara', 8,
  $m08$[
 {
  "type": "title",
  "eyebrow": "KS2 · Years 3 to 6 · Module 8",
  "title": "Being kind and safe with others online",
  "body": "One hour, one mission: three moves that mean nobody in this class ever faces unkindness online alone.",
  "script": "Settle everyone with this slide up. Today the squad takes on its most important mission yet: what to do when someone is unkind online. A quiet heads up for you before you begin: in almost every class, some pupils will have been on the receiving end of this and some will have joined in without really meaning to. So set the tone now, out loud: nobody will be asked to share a story today, we never use real names, and nobody in this room is in trouble. We are learning moves for next time. If a pupil discloses bullying at any point in the lesson, follow your school safeguarding policy.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I know three things to do if someone is unkind online.",
  "why": "Unkindness online spreads faster than unkindness in the playground, because a comment can be seen by everyone and it does not stop when the bell goes. Today you learn three moves that work every single time, whether it is happening to you, to a friend, or right in front of you in a group chat.",
  "gains": [
   "Tell the difference between one unkind moment and real bullying",
   "Spot a pile on forming in a group chat before it grows",
   "Use the three moves: do not pile on, save the evidence, tell someone who can help",
   "Explain why telling an adult is strength, not snitching"
  ],
  "script": "Read the mission out loud, then the why. Ask: hands up if you have ever seen someone being unkind in a group chat or under a photo. Most hands will go up, and that is the point. Say: so this lesson is not about IF it happens. It is about what the squad does WHEN it happens. Keep it brisk and warm, no stories collected here.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Squad words for today",
  "words": [
   {
    "word": "bullying",
    "meaning": "Unkindness that is repeated, targeted at the same person, and done on purpose. All three together."
   },
   {
    "word": "pile on",
    "meaning": "When lots of people join in against one person online, comment after comment, laugh after laugh."
   },
   {
    "word": "bystander",
    "meaning": "Someone who sees unkindness happening and watches without doing anything."
   },
   {
    "word": "upstander",
    "meaning": "Someone who sees unkindness and makes a safe move to help, even a small quiet one."
   }
  ],
  "script": "Say each word, class repeats it back. Spend longest on the last two, they rhyme on purpose: a bystander stands by, an upstander stands up. Ask the class which one sounds like a squad member. Today everyone learns how to be an upstander without needing to be loud or brave in a scary way.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Warm up from last mission. You have a really funny photo of your friend and you want to post it. What does the share test tell you to do first?",
  "options": [
   {
    "text": "Stop and ask: how would my friend feel, and would I be happy for anyone at all to see this?",
    "correct": true,
    "feedback": "That is the share test. Funny to you is not the test. How the person in the photo feels, and who could end up seeing it, that is the test."
   },
   {
    "text": "Post it quickly before someone else posts it first",
    "correct": false,
    "feedback": "Speed is exactly what the share test protects you from. A post you did not think about is the one you cannot take back."
   },
   {
    "text": "Post it now and delete it later if your friend minds",
    "correct": false,
    "feedback": "Delete does not undo. Once something is shared it can be screenshotted and copied in seconds. The share test happens BEFORE, never after."
   }
  ],
  "script": "Retrieval from last lesson, thirty seconds of thinking time before any hands. Cold call two pupils for their reasoning, not just their answer. Then plant the seed for today: last lesson was about what WE post. Today is about what we do when someone ELSE posts something unkind.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "feed",
  "handle": "kian_07",
  "avatar": "🎮",
  "meta": "Comment under Maisie's painting photo · 5 minutes ago",
  "text": "my little sister paints better than that and she is FOUR 😂😂",
  "image": "🖼",
  "stats": "❤ 3   💬 6",
  "prompt": "Maisie posted her painting because she was proud of it. Then this appeared. Is Maisie being bullied? How do we even decide?",
  "script": "Sofia opens the case file. Read the comment out flat, do not perform it as funny. Take a quick vote: bullying or not bullying? You will get a split, and that split is gold, because the class does not yet have a way to decide. Say: detectives do not guess, they use tells. The next two slides give us the tells. Do not resolve the vote yet.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "💛",
  "heading": "Unkind or bullying? There is a difference",
  "body": "Everyone says something unkind sometimes, and everyone gets something unkind said to them. One unkind comment is a moment: it is wrong, it can be put right, and it usually ends with a real sorry. Bullying is different. Bullying is unkindness that is repeated, aimed at the same person, and done on purpose. The difference matters because it tells you how much help to call in: an unkind moment might need one honest conversation, but bullying always needs an adult in the game.",
  "script": "This is the heart of cycle one, take it slowly. Stress that naming the difference never lets unkindness off the hook: one mean comment still stings and still needs putting right. Gently add, without looking at anyone: most of us have said something unkind online at some point, that does not make someone a bully, it makes them someone who owes a sorry. That sentence quietly lets pupils who have been on the giving end stay in the lesson without shame.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The three tells",
  "caption": "Ask all three. One yes is a warning sign. Three yeses is bullying, and bullying always gets reported to an adult.",
  "steps": [
   {
    "emoji": "🔁",
    "title": "Tell one: is it repeated?",
    "text": "Again and again, not once. Yesterday, today, and probably tomorrow."
   },
   {
    "emoji": "🎯",
    "title": "Tell two: is it targeted?",
    "text": "Aimed at the same person every time, on purpose, not scattered."
   },
   {
    "emoji": "😠",
    "title": "Tell three: is it on purpose?",
    "text": "Meant to hurt, not an accident or a joke both people are enjoying."
   }
  ],
  "verdicts": [
   "One unkind moment",
   "Bullying"
  ],
  "script": "Walk the three tells as they build, class repeats each one back: repeated, targeted, on purpose. Now return to Maisie and rerun the vote with the tells. One comment, one person, first time: that is one unkind moment, not bullying yet, and it still deserves putting right. Then ask: what would make it become bullying? Draw out: if kian_07 did it every time she posted, that is repeated and targeted. Watch for the pupil who asks about jokes: if both people are laughing it is banter, if one person is pretending to laugh it fails tell three.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Someone posts one mean comment on your photo, then says sorry at school the next day and means it. Is it bullying?",
  "options": [
   {
    "text": "No, it is one unkind moment, and it still deserved putting right",
    "correct": true,
    "feedback": "Exactly. Not repeated, not part of a pattern, and it ended in a real sorry. Still unkind, still worth putting right, but not bullying."
   },
   {
    "text": "Yes, any unkind comment is bullying",
    "correct": false,
    "feedback": "If every unkind moment counts as bullying, the word stops meaning anything. Save it for the real thing: repeated, targeted, on purpose."
   },
   {
    "text": "No, so it does not really matter",
    "correct": false,
    "feedback": "It still matters. Unkind is unkind, and the sorry was needed. Not bullying does not mean not important."
   }
  ],
  "script": "First check of the lesson. The trap answers are the two extremes: everything is bullying, or nothing matters. Both are wrong for opposite reasons, and the feedback lines carry the teaching. If the room splits, send them back to the three tells: repeated, targeted, on purpose.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item two",
  "platform": "message",
  "handle": "Year 5 Legends 🏆 · 14 people",
  "avatar": "💬",
  "meta": "Group chat · right now",
  "text": "Jonah: did everyone see Ravi fall over in PE 😂😂\nMia: LEGENDARY someone must have it on video\nJonah: posting it now\nTyler: 😂😂😂\nLibby: 😂\n· · · 3 people are typing",
  "image": "🎥",
  "prompt": "Sofia freezes the screen right here. Three people are typing. What happens in the next sixty seconds if nobody makes a move?",
  "script": "This is the big one, give it space. Read the chat aloud, then point at the three people typing and ask the question on screen. Draw out: each new laugh invites the next one, the video lands, more people join, and Ravi opens his phone tonight to a wall of laughter from fourteen classmates. Then the question that turns the room: how do you think each person typing feels right now? Probably fine, probably like it is just a laugh. That gap, between how it feels to send and how it feels to receive, is what the next slide explains.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🧲",
  "heading": "Why pile ons grow",
  "body": "To each person joining in, one laughing emoji feels tiny, barely anything at all. To Ravi, it is not one emoji, it is fourteen people laughing at once, and it is still there every time he opens his phone. Pile ons grow because of a strange trick our brains play called the bystander effect: when lots of people are watching, everyone waits for someone else to be the one who acts. And here is the secret the pile on does not want you to know: it is performing for its audience, so the very first kind move usually breaks the spell.",
  "script": "Two teaching beats here. First the maths of it: tiny to send, enormous to receive, because all the tiny things land on one person at once. Second the bystander effect, and make it human: it is not that nobody cares, it is that everyone is waiting for someone else to go first. Then land the hope: pile ons are weaker than they look. One person going first, even quietly, changes what everyone else thinks is normal. Today we learn how to be that person safely.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "pairs",
  "seconds": 60,
  "prompt": "Joining a pile on takes one tap. Why is it so easy to join in, and so hard to be the first one to stop it?",
  "lookFor": "Honesty. Joining feels like fitting in and costs nothing in the moment. Going first feels risky because you might become the next target, and everyone is waiting for someone else. Naming that fear out loud is what shrinks it.",
  "script": "Sixty seconds, partner talk, timer on screen. You are listening for honesty, not right answers. Take two or three responses after the chime. If a pupil says you might become the next target, thank them for the bravest answer in the room, because that fear is real and it is exactly why the three moves coming next never require anyone to fight the pile on face to face."
 },
 {
  "type": "choice",
  "question": "The pile on about Ravi is growing. Which is the strongest upstander move you could make right now?",
  "options": [
   {
    "text": "Send Ravi a private kind message and do not add anything to the pile",
    "correct": true,
    "feedback": "Yes. Upstanding does not have to be loud. A quiet kind message tells Ravi he is not alone, and refusing to add a single laugh starves the pile. The next two moves back you up."
   },
   {
    "text": "Post STOP BEING MEAN in the chat and argue with everyone",
    "correct": false,
    "feedback": "Brave heart, risky move. Arguing can feed the pile on and put you in the target zone. Upstanders do not have to battle, they make safe moves."
   },
   {
    "text": "Watch quietly and do not type anything at all",
    "correct": false,
    "feedback": "Quiet watching feels safe, but the silent audience is exactly who the pile on is performing for. Not joining in is a start, and there is more you can safely do."
   }
  ],
  "script": "Whole class, hands or devices. The third option is the important one to unpack: lots of kind pupils believe staying silent keeps them innocent. Handle it gently, no shame, because plenty in the room have done exactly that. Say: staying out of it is better than joining in, AND the squad can do better than better. Which sets up the tool of the whole module, coming next.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The three moves",
  "caption": "Three moves, in order, every time. They work if it is happening to you, to a friend, or right in front of you.",
  "steps": [
   {
    "emoji": "✋",
    "title": "Move one: do not pile on",
    "text": "No laughing emoji, no sharing it round, not even one. Starve it."
   },
   {
    "emoji": "📸",
    "title": "Move two: save the evidence",
    "text": "Screenshot before it gets deleted. Evidence is for a helper, never for spreading."
   },
   {
    "emoji": "🗣",
    "title": "Move three: tell someone who can help",
    "text": "A teacher, a parent, a trusted adult. Adults have moves that pupils do not."
   }
  ],
  "script": "This is the module tool and it goes on the bookmark, so drill it. Walk each move as it builds, then chant all three together twice: do not pile on, save the evidence, tell someone who can help. Two details to land. Move two: screenshots matter because unkind posts get deleted fast, and an adult can only fix what they can see, but evidence goes to a helper, never round the class, or you have joined the pile on with extra steps. Move three: we will spend the next slides on it, because it is the move with the most myths attached.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🛡",
  "heading": "Report and block are safety tools, not tantrums",
  "body": "Every app your class uses has a report button and a block button, built in on purpose, because the people who made the app know unkindness happens. Blocking someone is not dramatic and it is not weak: it is closing a door so the unkindness cannot follow you home. Reporting is not getting someone destroyed: it quietly asks the app to take a look, and the person is never told who reported them. Using safety tools is like wearing a seatbelt. Nobody is embarrassed about a seatbelt.",
  "script": "The mission here is removing shame from the buttons. Lots of pupils believe blocking means you lost, or that reporting is a huge dramatic act. Take those apart: block closes a door, report is private and the person never finds out who pressed it. If your school devices allow it, showing where the report button lives on one familiar app makes this concrete. End with the seatbelt line, it travels well.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "💪",
  "heading": "Telling is strength, not snitching",
  "body": "Here is the difference, and it is worth learning by heart. Snitching is trying to get someone INTO trouble. Telling is trying to get someone OUT of trouble: out of being hurt, out of dreading their phone, out of facing fourteen laughing faces alone. Nobody calls you a snitch for calling the fire brigade when something is burning. And here is the part people forget: the person who tells is usually the person who ends the bullying, because adults can do things that no pupil can, however brave.",
  "script": "This is the myth that stops more children getting help than any other, so give it your full weight. Get the class to say the two halves back to you: snitching gets someone INTO trouble, telling gets someone OUT of trouble. Then add the quiet truth: bullies rely on silence, it is the only thing keeping a pile on alive. If a pupil uses this moment to disclose something real, receive it calmly, thank them, and follow your school safeguarding policy after the lesson.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 3,
  "mode": "groups",
  "seconds": 90,
  "prompt": "Name the actual adults you would tell, one at school and one at home. Then decide: what is the very first sentence you would say to them?",
  "lookFor": "Real named adults, not just an adult. And a workable opening sentence, something like: something is happening online and I need your help. The first sentence is the hardest part, so rehearsing it now is the whole point.",
  "script": "Groups of three or four, ninety seconds on the timer. This is a rehearsal, not a chat: by the chime every pupil should have two named adults and a first sentence. Collect a few first sentences and celebrate the simple ones. Offer the emergency version for anyone stuck: you do not even need a good sentence, you can just show a trusted adult the screenshot from move two. That is what the evidence is for."
 },
 {
  "type": "choice",
  "question": "A friend shows you nasty messages they keep getting every night, then says: promise you will not tell anyone. What do the three moves say?",
  "options": [
   {
    "text": "Do not pile on, help them save the evidence, and tell a trusted adult even though the promise feels hard",
    "correct": true,
    "feedback": "Right, and yes, it is hard. A secret that keeps a friend being hurt is not a promise worth keeping. You can say: this is too big for just us, and I am telling someone BECAUSE I am your friend."
   },
   {
    "text": "Keep the secret, because a promise is a promise",
    "correct": false,
    "feedback": "Some promises protect people and some promises protect the bullying. This one protects the bullying. Real friends get help."
   },
   {
    "text": "Message the bully yourself and scare them off",
    "correct": false,
    "feedback": "Now the bully has a message from you to twist and share, and your friend still has no adult help. Adults have moves that pupils do not. Use move three."
   }
  ],
  "script": "The hardest question of the day because loyalty is sacred at this age. Thirty seconds thinking time. The feedback line to make sure everyone hears out loud: I am telling someone BECAUSE I am your friend. Some pupils will genuinely wrestle with option two, honour that, loyalty is a good instinct pointed at the wrong target here. This exact dilemma is item five on the worksheet, so it gets a second pass.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "Squad practice, on paper",
  "body": "Your teacher has six cases on the mission sheet: comments, group chats, and one tricky claim from Zara at the end. For each one, decide what is happening using the three tells, give your verdict, and say which of the three moves you would make. You have fifteen minutes. A verdict without a reason does not count.",
  "script": "Hand out the mission sheets, bookmark strips on tables so the three moves are in front of anyone who needs them. Fifteen minutes. Support group works cases one to three with you, talking each one through the three tells first. Stretch question for early finishers: what could the Year 5 Legends group chat agree as a rule so a pile on never starts? Circulate, and collect one brilliant reason to read out at the end. If anything a pupil writes suggests a real situation, note it quietly and follow your school safeguarding policy.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check. Unkind posts about one pupil are stacking up in a group chat. What are the three moves?",
  "options": [
   {
    "text": "Do not pile on, save the evidence, tell someone who can help",
    "correct": true,
    "feedback": "That is the tool, in order, every time. Starve the pile, screenshot before it disappears, and bring in an adult who can actually end it."
   },
   {
    "text": "Screenshot it, send it round so everyone knows, then leave the chat",
    "correct": false,
    "feedback": "Careful: sending it round spreads the hurt further, which is piling on with extra steps. Evidence goes to a helper, never round the class."
   },
   {
    "text": "Say nothing and wait, pile ons burn out on their own",
    "correct": false,
    "feedback": "Pile ons feed on silence, and the person in the middle is hurting the whole time you wait. The three moves work today, not eventually."
   }
  ],
  "script": "First of two exit checks, and these two are the printed exit quiz, so no hints. The second option is the clever trap: it starts with a screenshot so it sounds like move two. The difference is where the evidence goes. A wrong answer here tells you exactly who to revisit the diagram with.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Your friend says: telling a teacher about bullying is snitching, you should sort it out yourself. What do you know?",
  "options": [
   {
    "text": "Snitching tries to get someone INTO trouble. Telling gets someone OUT of trouble, and it is usually what ends the bullying",
    "correct": true,
    "feedback": "Exactly. Telling is strength. Adults can do things pupils cannot, and bullies rely on silence to keep going."
   },
   {
    "text": "The friend is right, dealing with it yourself is braver",
    "correct": false,
    "feedback": "Facing a pile on alone is not bravery anyone should have to perform. The bravest move is the one that ends it: telling someone who can help."
   },
   {
    "text": "Only tell an adult if it is happening to you, not to someone else",
    "correct": false,
    "feedback": "Upstanders tell for other people too. If a friend is being hurt, move three is yours to make as well as theirs."
   }
  ],
  "script": "Second exit check, testing the snitching myth directly because it is the belief most likely to stop a real child getting real help. If any pupil argues for sorting it yourself, do not squash them, ask the room: who has more power to actually end it, a pupil or an adult? Let the class land it.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Sofia",
  "text": "Do not pile on. Save the evidence. Tell someone who can help. Three moves, and nobody faces it alone.",
  "script": "Whole class says it together, twice, louder the second time. This is the sentence you want travelling home tonight, into group chats and around dinner tables. Sofia says it like she means it, so should the class.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "Bullying has three tells: repeated, targeted, on purpose. One unkind moment is different, and it still deserves putting right.",
   "Pile ons feel tiny to join and enormous to receive. The silent audience is who they perform for, and one kind move can break them.",
   "The three moves: do not pile on, save the evidence, tell someone who can help.",
   "Report and block are safety tools like seatbelts, and telling an adult is strength, not snitching."
  ],
  "script": "Recap read by pupils, one point each. Then the closing tone, warm and unhurried: if anything in this lesson felt close to home, on either side of it, you are not in trouble and you are not alone. Remind them where you are and when they can find you. Any pupil who wants a private word gets one, and any disclosure follows your school safeguarding policy.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi Junior closes the mission",
  "lines": [
   "Mission complete, squad! ⭐",
   "Three moves, learned by heart: do not pile on, save the evidence, tell someone who can help.",
   "Your mission this week: be an upstander once. One kind message, one refusal to laugh along, one trusted adult told. Small moves count double.",
   "And remember: in this squad, nobody faces it alone. Not ever. See you next mission!"
  ],
  "script": "Let DiGi Junior land the ending, the lines appear on their own. Exit quizzes go out as this plays, named copies from the print room, and exit cards get the commitment line filled in. Collect both, they are your evidence for the register, and read the exit cards yourself before filing: occasionally one carries something a pupil could not say out loud.",
  "phase": "close",
  "minutes": 2
 }
]$m08$::jsonb,
  '[]'::jsonb,
  $m08${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 3,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m08$::jsonb,
  $m08${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned the difference between one unkind moment and bullying (repeated, targeted, on purpose), and a tool called the three moves for when unkindness happens online: do not pile on, save the evidence, tell someone who can help. We also took apart the biggest myth in this topic: telling an adult is strength, not snitching.",
 "try_this": "Ask your child to teach YOU the three moves, then agree together who their tell someone who can help person is at home. Naming that person out loud, before anything ever happens, makes them far more likely to come to you if it does.",
 "family_question": "If a group chat started piling on someone you know, what would you do first, and what would be hardest about it?",
 "no_login_required": true
}$m08$::jsonb,
  $m08${
 "learning_objective": "Pupils can tell the difference between an unkind moment and bullying using the three tells, and can use the three moves (do not pile on, save the evidence, tell someone who can help) when unkindness happens online.",
 "timing": "60 minutes: starter 8, cycle one 8, cycle two 8, cycle three 12, practise 15, prove 4, close 5",
 "misconceptions": [
  "Telling an adult is snitching (snitching tries to get someone INTO trouble, telling gets someone OUT of trouble, and telling is usually what ends the bullying)",
  "If I do not type anything I am not involved (the silent audience is exactly who a pile on performs for, and one safe upstander move can break it)",
  "Deleting nasty messages makes the problem go away (save the evidence first, because an adult can only fix what they can see, and unkind posts vanish fast)"
 ],
 "differentiation": {
  "support": "Work cases one to three of the mission sheet as a guided group, saying the three tells out loud for each case before choosing a verdict. Keep the bookmark strip in front of each pupil and accept verbal reasons scribed by an adult.",
  "stretch": "Early finishers take the group chat challenge: draft one rule the Year 5 Legends chat could agree so a pile on never starts, and explain which of the three tells or three moves the rule connects to."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Read the two scenarios aloud as scripts with pupils playing the chat voices, draw the three tells and the three moves on the board as you go, run both discussions with a watch instead of the on screen timer, and use the printed mission sheet, exit quiz and bookmark strips exactly as in the screen version.",
 "keywords": [
  {
   "word": "bullying",
   "definition": "Unkindness that is repeated, targeted at the same person, and done on purpose. All three together."
  },
  {
   "word": "pile on",
   "definition": "When lots of people join in against one person online, comment after comment, laugh after laugh."
  },
  {
   "word": "bystander",
   "definition": "Someone who sees unkindness happening and watches without doing anything."
  },
  {
   "word": "upstander",
   "definition": "Someone who sees unkindness and makes a safe move to help, even a small quiet one."
  }
 ],
 "tool": {
  "heading": "The three moves",
  "lines": [
   "Do not pile on",
   "Save the evidence",
   "Tell someone who can help"
  ],
  "strapline": "Three moves, and nobody faces it alone."
 },
 "worksheet": {
  "title": "The three moves mission sheet",
  "directions": "Read each case, choose your verdict, and write which move you would make and why.",
  "verdict_options": [
   "One unkind moment",
   "Bullying",
   "Pile on forming"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "Dev posts a photo of his new haircut. One classmate comments trims gone wrong 😂 then says sorry at school the next day and means it.",
   "expected_verdict": "One unkind moment",
   "teaching_point": "Not repeated, not part of a pattern, and it ended in a real sorry. Still unkind and still needed putting right, but the three tells say it is not bullying."
  },
  {
   "n": 2,
   "item": "For three weeks, the same three pupils post laughing emojis on everything Priya shares, and they have started a chat that everyone in the class is in except her.",
   "expected_verdict": "Bullying",
   "teaching_point": "All three tells fire: repeated over weeks, targeted at Priya every time, and on purpose. Leaving someone out on purpose counts as unkindness too. This always reaches an adult."
  },
  {
   "n": 3,
   "item": "You open the class group chat and see mean memes about one pupil, five people have joined in and more messages are arriving every minute.",
   "expected_verdict": "Pile on forming",
   "teaching_point": "This is the moment the three moves are for: add nothing, screenshot what is there, and tell a trusted adult today, not after it grows."
  },
  {
   "n": 4,
   "item": "Someone you like sends you a screenshot of a mean post about a girl in another class and says: add a laughing reaction so she knows nobody likes her.",
   "expected_verdict": "Pile on forming",
   "teaching_point": "Being invited to join is how pile ons recruit. One reaction feels tiny to send and lands as one more laugh in the wall. Move one is a full stop: do not pile on, even when a friend asks."
  },
  {
   "n": 5,
   "item": "Your friend shows you nasty messages they get every night. When they blocked the sender, a new account appeared and it carried on. Your friend says: promise you will not tell anyone.",
   "expected_verdict": "Bullying",
   "teaching_point": "Repeated, targeted, on purpose, and it climbed over a block. A promise that keeps a friend being hurt protects the bullying, not the friend. Help them save the evidence and tell a trusted adult together."
  },
  {
   "n": 6,
   "item": "Zara says: if you just watch a pile on and never type anything, you have done nothing wrong. Do you agree? Explain your reasoning.",
   "expected_verdict": "Pile on forming",
   "teaching_point": "Zara is half right: not joining in is better than joining in. But the silent audience is who the pile on performs for, and the three moves ask more of an upstander: add nothing, save the evidence, tell someone who can help."
  }
 ],
 "commitment_stem": "My commitment: if I see unkindness online this week, my first move will be..."
}$m08$::jsonb,
  $m08${
 "required": true,
 "note": "This lesson can surface live situations: pupils currently being bullied, pupils recognising their own behaviour, and pupils carrying a friend's secret. Watch the friend dilemma discussion, the exit cards and the mission sheets, as written disclosures sometimes arrive where spoken ones cannot. Any disclosure of bullying, online or offline, follows the school safeguarding and anti bullying policy and is logged with the DSL the same day. No pupil should leave the lesson believing they are in trouble for telling.",
 "concern_form_linked": true
}$m08$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 9: My work and other people’s work
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks2-09-copyright-ownership', 'My work and other people’s work', 'KS2', 'Years 3 to 6', 'teacher',
  '{8}'::int[], ARRAY['EfCW copyright and ownership','Computing']::text[], ARRAY['Create with AI']::text[],
  'AILit Create with AI domain', 'I can credit work that is not mine.', 'Zara', 9,
  $m09$[
 {
  "type": "title",
  "eyebrow": "KS2 · Years 3 to 6 · Module 9",
  "title": "My work and other people's work",
  "body": "Every drawing, video, story and game idea has a maker. Today we learn how to make sure every maker gets their name.",
  "script": "Settle everyone with this slide up. Today's mission is about something every single person in this room already is: a maker. You have all drawn something, built something, filmed something or made up a game. By the end of the hour you will know exactly what belongs to you, what belongs to other people, and the fair way to use work that is not yours.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can credit work that is not mine.",
  "why": "When you make something, it is yours, and that feels brilliant. But the internet is full of other people's drawings, songs, photos and ideas, and it is very easy to use them without thinking about the person who made them. Fair makers use a simple tool: make it, credit it, ask first.",
  "gains": [
   "Know that anything you make belongs to you the moment you make it",
   "Spot when work being shared online really belongs to someone else",
   "Use the tool: make it, credit it, ask first",
   "Ask a brilliant question about AI pictures: where did this really come from?"
  ],
  "script": "Read the mission out loud, then the why. Quick hands up: who has made something this year they are proud of? A drawing, a Lego build, a Minecraft world, a story, a dance. Take three or four answers fast. Keep those examples, we will come back to them, because everything we say today about famous artists is also true about YOUR dragon drawing.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Maker words for today",
  "words": [
   {
    "word": "original",
    "meaning": "Work that came from your own head and your own hands. It is yours the moment you make it."
   },
   {
    "word": "copyright",
    "meaning": "The rule that says the maker owns their work, and other people need permission to copy it."
   },
   {
    "word": "credit",
    "meaning": "Naming the person who made the work you are using, so the maker gets the thanks."
   },
   {
    "word": "permission",
    "meaning": "Asking the maker if you can use their work, and waiting for a yes before you do."
   }
  ],
  "script": "Say each word, class repeats it back. The big surprise for most children is copyright: you do not need a form, a stamp or a grown up. The moment you finish a drawing, copyright says it is yours. Ask: so who in this room owns a copyright? Answer: every single person who has ever made anything. Watch them sit up a bit taller.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Mission memory from last lesson. Someone in a group chat starts being unkind about a classmate. What were our three moves?",
  "options": [
   {
    "text": "Do not join in, stick up for the person, and tell a trusted adult",
    "correct": true,
    "feedback": "That is the three. Never add to the pile, be the friend who backs them up, and bring in an adult who can actually help. A bystander who acts stops being a bystander."
   },
   {
    "text": "Join in a tiny bit so you fit in, then say sorry later",
    "correct": false,
    "feedback": "A tiny bit of unkind is still unkind, and sorry later does not unsend it. The three moves were: do not join in, stick up for the person, tell a trusted adult."
   },
   {
    "text": "Leave the chat quietly and keep it to yourself",
    "correct": false,
    "feedback": "Leaving keeps you out of it, but it leaves the person alone with it. The three moves were: do not join in, stick up for the person, tell a trusted adult."
   }
  ],
  "script": "Retrieval from last lesson, thirty seconds of thinking time before hands go up. Cold call two pupils and ask for all three moves in their own words, not just the letter. If the room is shaky on this, spend one extra minute rebuilding the three together before moving on, it matters more than today's pace.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🎨",
  "heading": "You are a maker, and makers own their work",
  "body": "When you draw a picture, it is yours. When you film a video, write a story or invent a game, those are yours too. Nobody has to give you a certificate, ownership happens the second you make it. And here is the fair part: it works exactly the same way for everyone else. The song you love belongs to the person who wrote it. The picture you found online belongs to the person who made it. Your stuff is yours, their stuff is theirs.",
  "script": "Point back at the examples from the start of the lesson: the Minecraft world, the dragon drawing, the dance. Say: you own those. Really own them. Then flip it: and the person who made your favourite song owns that, exactly as much as you own your drawing. Ask the room how they would feel if someone took their proudest make and said it was theirs. Collect two or three feelings, you will need them for the next slide, because it is about to happen to someone.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "message",
  "handle": "Coding Club 💻",
  "avatar": "🕹️",
  "meta": "Group chat · Tuesday 4:12pm",
  "text": "did you see?? Leo entered THE EXACT game Priya invented. the potion shop one with the sneezing dragon. she told him the whole idea at lunch and he put it in the club competition as HIS 😳",
  "image": "🐉",
  "prompt": "Whose game is it? And what should Leo have done instead?",
  "script": "Read the message out loud with full drama. Then the two questions. First: whose game is it? Let the room say Priya's, then push: why? She never wrote it down. Fish for the answer that it came from her head, she invented it, telling a friend is not giving it away. Second question: what should Leo have done? Ask first. He could have said, can I build your idea, can we team up, can I make my own version? Any of those is fair. Taking it silently is the only unfair move on the list.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "pairs",
  "seconds": 60,
  "prompt": "Think of something you have made that you are really proud of. How would you feel if someone shared it as their own?",
  "lookFor": "Real feelings named out loud: cross, sad, invisible, like being robbed. The point is the connection: whatever they would feel, that is exactly what Priya feels, and what any maker feels.",
  "script": "Sixty seconds, partner talk, start the timer on screen. After the chime take three or four feelings and write the strongest words on the board. Then land the turn: hold on to that feeling, because every photo, song and drawing online has a maker who would feel exactly the same. That feeling is why credit exists."
 },
 {
  "type": "choice",
  "question": "Leo says: Priya only TOLD me the idea, she never wrote it down, so it is not really hers. Is he right?",
  "options": [
   {
    "text": "No. The idea came from Priya, so the fair move is to ask her or credit her",
    "correct": true,
    "feedback": "Exactly. An idea belongs to the person it came from, written down or not. Asking first or teaming up would have made Leo a fair maker instead of a taker."
   },
   {
    "text": "Yes. If it is not written down, anyone can claim it",
    "correct": false,
    "feedback": "That is the excuse of someone who knows they took something. The idea came from Priya's head. Fair makers ask first, they do not look for loopholes."
   },
   {
    "text": "Sort of. It is hers, but once she said it out loud it became everyone's",
    "correct": false,
    "feedback": "Sharing an idea with a friend is trust, not a giveaway. It stays hers, and the fair move is still to ask before using it."
   }
  ],
  "script": "Thinking time, then hands. Watch for pupils who half agree with Leo, some will, and that is useful. Do not squash it, ask them how Priya finds that fair. The loophole feeling versus the fairness feeling is the whole learning moment here. Land it with: fair makers ask first, takers hunt for loopholes.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🧰",
  "heading": "Using other people's work the fair way",
  "body": "Here is the good news: you ARE allowed to use other people's work. Teachers do it, YouTubers do it, artists do it all the time. The difference between fair and unfair is tiny and simple. Fair makers name the person whose work they used, that is credit. And when they want to copy something, change it, or share it with the whole world, they ask the maker first. Unfair users just take, and hope nobody notices.",
  "script": "This slide kills the wrong lesson before it starts. Some pupils will walk away thinking never touch anyone else's work ever, and that is not it. Using other people's work is how everyone learns and creates. Say it plainly: you may stand on other people's work, you just have to say whose shoulders you are standing on. Then tell them the next slide is the tool that makes it easy, three little moves.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "Make it, credit it, ask first",
  "caption": "Three moves, and you will never take from a maker by accident. Every maker gets their name.",
  "steps": [
   {
    "emoji": "✏️",
    "title": "Make it",
    "text": "If it came from your head and hands, it is yours. Be proud, put your name on it."
   },
   {
    "emoji": "🏷️",
    "title": "Credit it",
    "text": "Using someone's picture, words or music? Name the maker, every single time."
   },
   {
    "emoji": "🙋",
    "title": "Ask first",
    "text": "Want to copy it, change it or share it with everyone? Ask the maker BEFORE, not after."
   }
  ],
  "verdicts": [
   "Yours to own",
   "Credit the maker",
   "Ask first"
  ],
  "script": "Walk the three moves as they build, then get the class chanting them back: make it, credit it, ask first. Twice, louder the second time. Then point at the three verdicts along the bottom: every question today ends in one of these three. Test it fast on the room: your own comic? Yours to own. A photo from a website in your topic work? Credit the maker. Priya's game idea? Ask first. They will feel how quick the tool is, that is the point.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "scenario",
  "label": "Evidence item two",
  "platform": "feed",
  "handle": "sticker.stack",
  "avatar": "😎",
  "meta": "2h · Shared 512 times",
  "text": "found this AWESOME dragon somewhere 🔥🔥 new profile picture sorted. do not even know who drew it lol",
  "image": "🐲",
  "stats": "❤ 2,431   ↻ 512   💬 88",
  "prompt": "The drawing is getting lots of love. Who is getting none of it?",
  "script": "Read the post, then the prompt. The answer is the maker, and the detail that stings is right there in the caption: do not even know who drew it lol. Somewhere out there is an artist watching their dragon get two thousand hearts with their name cropped off. Ask the room: which move from the tool fixes this? Credit it, and if you cannot find out who made it, that is a clue you should probably not use it at all. Bonus question for a sharp room: is sticker.stack being mean on purpose? Probably not, and that is the trap. Most taking is not evil, it is lazy.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "You want to put your favourite singer's song on a video you are posting for everyone to see. Which move does the tool ask for?",
  "options": [
   {
    "text": "Ask first. Sharing someone's work with the whole world needs permission",
    "correct": true,
    "feedback": "Right. A song in a video the whole internet can see is a big use of someone's work, so it needs a yes, not just a name. That is why apps have libraries of music you ARE allowed to use, the makers already said yes to those."
   },
   {
    "text": "Credit it. Just write the singer's name and post it",
    "correct": false,
    "feedback": "Credit is brilliant for a school project, but posting to the whole world is bigger than that. Big public uses need permission, which is why apps offer music the makers have already said yes to."
   },
   {
    "text": "Make it. Once the video is yours, everything in it is yours",
    "correct": false,
    "feedback": "The video is yours, the song inside it is still the singer's. Putting someone's work inside your work does not make it yours."
   }
  ],
  "script": "This is where credit and permission separate, so take the feedback slowly. The rule of thumb for this age: small school use, credit the maker. Sharing with the whole world, ask first. And the happy ending: the asking is often already done, app music libraries are full of songs where the makers said yes in advance. Fair does not mean boring.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🤖",
  "heading": "The AI wrinkle",
  "body": "Now the puzzle that is so new even judges are still arguing about it. You type castle in space into an AI tool and two seconds later, a picture appears. But the tool did not imagine it the way you do. It learned by studying millions of pictures made by real people, artists and photographers who mostly were never asked. So when an AI picture pops out, where did it really come from? A little bit from you, a little bit from the tool, and a little bit from millions of makers.",
  "script": "Energy up, this is genuinely one of the most interesting questions in the world right now and the adults have NOT solved it. Ask who has used an AI picture tool, plenty of hands. Then walk the puzzle: the tool learned from millions of real people's pictures. Should they get credit? Can they, when there are millions? Do not answer it yet, that is deliberate. The next two slides let the class do the thinking, and their reasoning is the prize, not a right answer.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "Where an AI picture really comes from",
  "caption": "Nobody fully agrees who should get the credit here. You are about to argue about the same question as real judges.",
  "steps": [
   {
    "emoji": "🖼️",
    "title": "Millions of makers",
    "text": "Real people drew, painted and photographed for years. Their work went online."
   },
   {
    "emoji": "🤖",
    "title": "The tool studies it all",
    "text": "The AI learned patterns from all that work. Most makers were never asked."
   },
   {
    "emoji": "⌨️",
    "title": "You type an idea",
    "text": "Castle in space. Your words steer what the tool makes."
   },
   {
    "emoji": "✨",
    "title": "Out comes a picture",
    "text": "New, but mixed from everything it learned. So whose is it?"
   }
  ],
  "script": "Walk the chain as it builds and keep it honest: the picture at the end is new, nobody is saying the tool photocopied someone's drawing. But it could not exist without the millions of makers at step one, and most of them were never asked. Pause on the caption: real judges in real courts are arguing about this RIGHT NOW, and nobody has fully won. Then hand the same case to the class, discussion is next.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "class",
  "seconds": 90,
  "prompt": "An AI picture took two seconds to make and millions of people's work to learn from. Does it belong to anyone? Who should get credit?",
  "lookFor": "Reasoning, not a right answer. Strong answers mention the person who typed the idea, the people who built the tool, and the millions of makers it learned from. The honest conclusion is that it is genuinely unsettled and being argued in court.",
  "script": "Ninety seconds on the timer, whole class, and your job is referee, not judge. Push each claim one step: it belongs to the typist? They wrote four words, is that making? It belongs to nobody? Then is it fair the tool needed millions of makers who were never asked? If the class splits down the middle, celebrate that, tell them courtrooms full of adults are split exactly the same way. Land one solid takeaway before moving on: whatever the courts decide, the honest move never changes, say how you made it."
 },
 {
  "type": "choice",
  "question": "Your friend types castle in space into an AI tool and gets an amazing picture. What is the honest thing to say when they share it?",
  "options": [
   {
    "text": "I made this with an AI tool",
    "correct": true,
    "feedback": "That is it. Six words, completely honest. People can enjoy the picture AND know how it was made. Honesty about the making is the one part of this puzzle that is not confusing at all."
   },
   {
    "text": "I drew this",
    "correct": false,
    "feedback": "Typing four words is not drawing, and everyone who has ever spent an hour on a drawing knows it. Claiming AI work as hand made work is taking credit that is not yours."
   },
   {
    "text": "Say nothing. Nobody owns AI pictures so it does not matter",
    "correct": false,
    "feedback": "Even while the ownership question is unsettled, honesty is settled. Saying how you made something costs nothing and takes nothing from anyone."
   }
  ],
  "script": "Quick one, and it rescues the class from the muddle of the discussion. The ownership question is genuinely hard, the honesty question is genuinely easy. Whatever the judges decide about AI pictures, I made this with an AI tool is always true and always fair. Point out this is credit working in a brand new situation, the tool still works even when the technology is new.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "The maker's casebook",
  "body": "Six cases on your worksheet: drawings, photos, songs, a borrowed game idea and one AI picture. For each one, choose the fair verdict: yours to own, credit the maker, or ask first. Then write your reason. You have fifteen minutes. A verdict without a reason does not count, fair makers can always say why.",
  "script": "Hand out the worksheets, bookmark strips on tables for anyone who wants the three moves in front of them. Fifteen minutes. Support group works cases one to three with you, use the sentence starter: the maker is, so I will. Stretch for early finishers: design the credit line you would want under YOUR best work, exact words. Circulate and collect one brilliant reason to read out at the end, name the pupil, credit where credit is due.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check one. You find the perfect photo online for your school topic poster. What is the fair move?",
  "options": [
   {
    "text": "Use it and clearly name the person who made it",
    "correct": true,
    "feedback": "That is credit. Using other people's work in your school work is fine, taking it silently is not. Name the maker and everyone wins."
   },
   {
    "text": "Just use it, pictures online are free for everyone",
    "correct": false,
    "feedback": "Easy to find is not the same as free to take. Every photo online has a maker, and the fair move is to name them."
   },
   {
    "text": "Never use anyone else's pictures for anything",
    "correct": false,
    "feedback": "You do not have to make everything from scratch, that is not the lesson. Using other people's work is fine, the fair move is simply to credit the maker."
   }
  ],
  "script": "First of two exit checks, these two are the printed quiz, so silent and solo. This one is the heart of today's outcome: I can credit work that is not mine. A pupil who picks the third option has learned fear instead of fairness, note who they are and reassure them in the feedback: using is allowed, naming is the move.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check two. True or false: an AI picture comes from nowhere, so nobody ever needs any credit.",
  "options": [
   {
    "text": "False. AI tools learned from millions of real people's work, and honest makers say how a picture was made",
    "correct": true,
    "feedback": "Exactly right. The ownership question is still being argued by adults in court, but the honest move is already clear: say an AI tool made it, and never claim it as hand made."
   },
   {
    "text": "True. The computer made it, and computers do not need credit",
    "correct": false,
    "feedback": "The computer only learned to make it by studying millions of real people's work. That is not nowhere. And whoever shares it should still be honest about how it was made."
   }
  ],
  "script": "The thinking question, and the one a visitor to your classroom would love: it proves pupils are reasoning, not reciting. If anyone answered true with a clever argument during the discussion, honour that here, then land the line that settles it: the ownership argument is not finished, the honesty rule is. Collect both exit checks in, they are your evidence for the register.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Zara",
  "text": "Make it, it is YOURS. Use it, CREDIT it. Copy it, ASK first. Every maker gets their name!",
  "script": "Whole class says it together, twice, louder the second time. This is the sentence you want repeated at dinner tables tonight, and it fits on the bookmark going home in their bags.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "You own what you make the moment you make it, no forms, no stamps. And other people own what they make, exactly the same.",
   "Easy to find online is not the same as free to take. Every photo, song and drawing has a maker.",
   "The tool: make it, credit it, ask first. Small school use, credit the maker. Sharing with the whole world, ask first.",
   "AI pictures are built from millions of real people's work. Adults are still arguing about who owns them, but honest makers always say how a thing was made."
  ],
  "script": "Four points, read by four pupils, one each. Then one last connection: remember the feeling from the pair talk, when you imagined someone taking your proudest make? Every move we learned today exists to stop anyone feeling that. Fairness for makers, and you are all makers.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi closes the case",
  "lines": [
   "Case closed, makers! ⭐",
   "Make it, it is yours. Use it, credit it. Copy it, ask first. Three moves and every maker gets their name.",
   "Your mission this week: make something you are proud of and put your name on it. And the next time you use work that is not yours, name the maker out loud.",
   "The world is full of people who take without thinking. You are makers who give credit. That is rarer, and it is better. See you next lesson!"
  ],
  "script": "Let DiGi land the ending, the bubbles appear on their own. As it plays, pupils write their commitment on the exit card: the one place this week they will credit a maker or ask first. Bookmarks and parent notes into bags on the way out.",
  "phase": "close",
  "minutes": 2
 }
]$m09$::jsonb,
  '[]'::jsonb,
  $m09${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 3,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m09$::jsonb,
  $m09${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned that they own what they make, from drawings to game ideas, and that other people own what they make too. Their tool for using other people's work fairly is: make it, credit it, ask first.",
 "try_this": "Make something together this week, anything at all, and put your child's name on it. Then find one picture or song you both enjoy online and see if you can name the person who made it.",
 "family_question": "If an AI drew a picture in two seconds, who should get the credit?",
 "no_login_required": true
}$m09$::jsonb,
  $m09${
 "learning_objective": "Pupils can explain that makers own what they make, credit work that is not theirs, ask permission for bigger uses, and reason about where AI made content comes from.",
 "timing": "60 minutes: starter 8, cycle one 9, cycle two 10, cycle three 9, practise 15, prove 4, close 5",
 "misconceptions": [
  "If it is online, it is free to use (easy to find is not free to take, every photo, song and drawing online has a maker who owns it)",
  "An idea only counts if it is written down (an idea belongs to the person it came from, taking a friend's game idea without asking is unfair whether or not it is on paper)",
  "AI pictures come from nowhere, so honesty rules do not apply (AI tools learned from millions of real people's work, and whoever shares an AI picture should say how it was made)"
 ],
 "differentiation": {
  "support": "Work casebook items one to three together with the bookmark strip on the table. Use the sentence starter: the maker is, so I will. Accept verdicts pointed to on the bookmark with a spoken reason.",
  "stretch": "Early finishers design the exact credit line they would want under their own best work, then decide what permission they would give a stranger who asked to use it, and why."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Read the two evidence items aloud with full drama, they are written to be performed. Put the three verdicts on cards in three corners of the room and have pupils move to vote on every choice question, reasons collected out loud. The tool diagram is the bookmark, the casebook and exit quiz are already paper.",
 "keywords": [
  {
   "word": "original",
   "definition": "Work that came from your own head and your own hands. It is yours the moment you make it."
  },
  {
   "word": "copyright",
   "definition": "The rule that says the maker owns their work, and other people need permission to copy it."
  },
  {
   "word": "credit",
   "definition": "Naming the person who made the work you are using, so the maker gets the thanks."
  },
  {
   "word": "permission",
   "definition": "Asking the maker if you can use their work, and waiting for a yes before you do."
  }
 ],
 "tool": {
  "heading": "Make it, credit it, ask first",
  "lines": [
   "Make it, it is yours",
   "Use it, credit the maker",
   "Copy or share it big, ask first"
  ],
  "strapline": "Every maker gets their name."
 },
 "worksheet": {
  "title": "The maker's casebook",
  "directions": "Read each case, choose the fair verdict and write your reason.",
  "verdict_options": [
   "Yours to own",
   "Credit the maker",
   "Ask first"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "You spend the whole weekend drawing a comic about a robot dog. You finish it and write your name on the front. Whose is it?",
   "expected_verdict": "Yours to own",
   "teaching_point": "Ownership is automatic. The moment the comic is finished it belongs to its maker, no form or stamp needed."
  },
  {
   "n": 2,
   "item": "You find a brilliant photo of a volcano online and paste it into your topic poster with no name under it. What is missing?",
   "expected_verdict": "Credit the maker",
   "teaching_point": "Easy to find is not free to take. School use is fine, but the photographer's name belongs under their photo."
  },
  {
   "n": 3,
   "item": "Your friend tells you their secret game idea at lunch. You think it is amazing and want to build it in coding club. What comes first?",
   "expected_verdict": "Ask first",
   "teaching_point": "Ideas belong to the person they came from, written down or not. Asking turns taking into teaming up."
  },
  {
   "n": 4,
   "item": "You film a brilliant video and want to put your favourite singer's song on it before posting it for everyone to see. What does the song need?",
   "expected_verdict": "Ask first",
   "teaching_point": "Sharing someone's work with the whole world needs permission, not just a name. App music libraries hold songs where the makers already said yes."
  },
  {
   "n": 5,
   "item": "You use two sentences from a website in your school project, word for word. What do you add next to them?",
   "expected_verdict": "Credit the maker",
   "teaching_point": "Borrowed words in school work are fine when the source is named. Quoting with credit is what real writers do."
  },
  {
   "n": 6,
   "item": "Zara says: an AI picture is made from millions of people's work, so nobody needs any credit at all. Do you agree? Explain your reasoning.",
   "expected_verdict": "Credit the maker",
   "teaching_point": "Reasoning is the prize here. Strong answers push back on Zara: the tool learned from millions of real makers, and whoever shares the picture should at least say an AI tool made it."
  }
 ],
 "commitment_stem": "My commitment: the next time I use work that is not mine, I will name the maker or ask first."
}$m09$::jsonb,
  $m09${
 "required": false
}$m09$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 10: Mood and screens
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks3-10-mood-and-screens', 'Mood and screens', 'KS3', 'Years 7 to 9', 'teacher',
  '{6}'::int[], ARRAY['RSHE mental health']::text[], '{}'::text[],
  'Orben and Przybylski, what and how not just time', 'I can run one honest self check on my screen habits for a week.', 'Brock with DiGi', 10,
  $m10$[
 {
  "type": "title",
  "eyebrow": "KS3 · Years 7 to 9 · Module 10",
  "title": "Mood and screens",
  "body": "One hour, one skill: a ten second self check that tells you what your screen habits actually do to your mood.",
  "script": "Settle everyone with this slide up. Open with this: adults argue about your phones constantly, and today we are going to do something almost none of them do. We are going to look at the actual evidence, and then you are going to run your own study, on yourself. By the end of the hour you will have a tool nobody can run for you.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can run one honest self check on my screen habits for a week.",
  "why": "The loudest voices say screens are ruining your generation, but the careful research tells a more interesting story: what you do on a screen and how it leaves you feeling matter far more than raw hours. Nobody can measure that for you, so this week you become the researcher and your own feed is the study.",
  "gains": [
   "Say what the evidence on screens and mood actually shows, without the panic",
   "Tell the difference between connecting and comparing in your own feed",
   "Run the mood audit on any app in ten seconds: better, worse, or nothing",
   "Turn a week of honest answers into one calibrated change you choose"
  ],
  "script": "Read the mission out loud, then the why. Ask: hands up if an adult has ever told you phones are ruining your generation. Nearly every hand goes up. Then ask: hands up if that adult had ever actually read the research. Watch the hands drop. That gap between what gets shouted and what got studied is where this lesson lives.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Researcher words for today",
  "words": [
   {
    "word": "evidence",
    "meaning": "What careful studies actually found, which is often much quieter than the headlines shouting about them."
   },
   {
    "word": "comparing",
    "meaning": "Measuring your real, unedited life against someone else's chosen highlights. It rarely reads better."
   },
   {
    "word": "connecting",
    "meaning": "Using a screen to reach people who know your actual life. The use that most often reads better."
   },
   {
    "word": "audit",
    "meaning": "An honest check you run on yourself, with real answers, not the answers that sound good."
   }
  ],
  "script": "Say each word, class repeats it back. Land the pair in the middle: connecting and comparing can happen in the same app, on the same evening, with the same thumb. The app is not the verdict. What you were doing in it is. And audit is the word of the day: an audit only works if the answers are honest, and nobody is marking their answers today.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Warm up from last time. You have made a brilliant edit using a clip from a creator you follow, and your mate is in the background of one shot. What does make it, credit it, ask first mean here?",
  "options": [
   {
    "text": "Post it fast before someone else has the same idea",
    "correct": false,
    "feedback": "Speed is not the rule. Making things is brilliant, but the clip has a creator to credit and your mate has a say before their face goes anywhere."
   },
   {
    "text": "Name the creator whose clip you used and check your mate is happy before you post",
    "correct": true,
    "feedback": "Exactly. Make it, credit it, ask first: your creativity, their credit, and permission from anyone who appears in it. All three, every time."
   },
   {
    "text": "Crediting only matters if the creator is famous",
    "correct": false,
    "feedback": "Credit is about whose work it is, not how many followers they have. A small creator's work is still their work."
   }
  ],
  "script": "Retrieval from the previous module, thirty seconds of thinking time before anyone answers. Cold call two pupils for their reasoning, not just their letter. If the room is shaky on this, spend one extra minute: make it, credit it, ask first is the maker's rule and it comes back in every creative module from here.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "feed",
  "handle": "screen.truth.daily",
  "avatar": "📵",
  "meta": "5h · Shared 92,400 times",
  "text": "Scientists CONFIRM smartphones have destroyed an entire generation. Anxiety up. Happiness down. And it is all because of that thing in your pocket. Parents, TAKE THE PHONES.",
  "image": "📱",
  "stats": "❤ 156K   ↻ 92.4K   💬 31K",
  "prompt": "You have all heard a version of this. Honest show of hands: does it match what you actually notice in your own life?",
  "script": "Run the hands up vote and take two or three honest answers. Some pupils will say yes, some no, and both are useful. Then the turn: this post is making a scientific claim, so it can be checked against the actual science. That is what we do next, and the honest answer is more interesting than the post. Notice the register: we are not defending phones and we are not attacking them. We are checking a claim.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🔬",
  "heading": "What the research actually says",
  "body": "Researchers at Oxford analysed data from hundreds of thousands of young people to test the claim that screen time wrecks wellbeing. They found the link between raw hours and wellbeing is real but tiny, far too small to explain a generation. What showed up as mattering more was what you do on the screen, who you do it with, and how it leaves you feeling. The honest conclusion is not that phones are fine and not that phones are poison. It is that hours on screen is the wrong question, and you are about to learn the right one.",
  "script": "Take this slowly, it is the intellectual heart of the lesson. Name the researchers: Amy Orben and Andrew Przybylski, Oxford. Point out something unusual: this research annoys both sides. It annoys the panic side because the effect of hours is tiny, and it annoys the nothing to see here side because how you use screens really does show up in the data. That is usually the sign of honest science.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "stat",
  "phase": "teach",
  "minutes": 1,
  "figure": "0.4%",
  "claim": "Across data from over 350,000 young people, screen use explained at most 0.4 percent of the differences in teenage wellbeing, a link about the same size as the one with regularly eating potatoes.",
  "source": "Orben and Przybylski, Nature Human Behaviour, 2019",
  "script": "Let the number land, then the potato line, which always gets a laugh. Then the careful bit: this does not say screens do nothing. It says the CLOCK is a terrible predictor. Two people can spend the same three hours on the same app and walk away in completely different moods. The average hides the individual, which is exactly why the next tool is personal."
 },
 {
  "type": "choice",
  "question": "The research says raw hours barely predict wellbeing. What does that actually mean?",
  "options": [
   {
    "text": "Screens are harmless, scroll as much as you like",
    "correct": false,
    "feedback": "That is the lazy reading. Hours being a weak measure does not make every hour harmless. It means the clock is the wrong dial to watch."
   },
   {
    "text": "What you do and how it leaves you feeling matter more than the clock",
    "correct": true,
    "feedback": "Exactly. The evidence points away from counting hours and towards noticing effects. And nobody can notice your effects except you."
   },
   {
    "text": "The scientists are covering for the tech companies",
    "correct": false,
    "feedback": "This research came from independent academics and it cuts against the tech companies too, because it says HOW their apps make you feel is what counts. Follow the evidence, not the conspiracy."
   }
  ],
  "script": "Whole class, hands or devices for a, b, c. Watch for the first option, some pupils will happily take screens are harmless as the takeaway because it suits them. The feedback line to land out loud: weak link with hours is not a permission slip, it is a redirect. The question moves from how long to what did it do to me.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "⚖️",
  "heading": "Connecting or comparing",
  "body": "The same app can do two completely different jobs. Messaging people who know your actual life, planning things, sharing jokes that only your group gets: that is connecting, and it mostly reads better in mood terms. Endlessly scrolling strangers' edited highlights and measuring your unedited Tuesday against them: that is comparing, and it mostly reads worse. Researchers see the same split: actively talking with people you know lands differently from passively watching people you do not. The app icon tells you nothing. What you were doing inside it tells you almost everything.",
  "script": "Ask for examples before you give any: same app, two different jobs, who can name both jobs on one app they use? You will get good answers fast because they know their feeds better than any adult in the building. Your job is just to pin the two words on what they describe: that one is connecting, that one is comparing.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item two",
  "platform": "feed",
  "handle": "aria.mornings",
  "avatar": "✨",
  "meta": "2h · One of 34 posts today",
  "text": "5am club again 🌅 gym done, skin routine done, reading done before most people even wake up. No excuses. We are not the same.",
  "image": "🏋️",
  "stats": "❤ 412K   ↻ 18.7K   💬 9.2K",
  "prompt": "It is 11pm. You are 40 minutes deep in posts like this. Connecting or comparing? And honestly, how do you feel at minute 40?",
  "script": "Let a few pupils answer both questions. The tell in the post is the last line: we are not the same. Comparison is not an accident here, it is the product. Then the honesty move: admit that everyone in the room, you included, has done this exact 11pm scroll. This is not about superior people and weak people. It is about noticing what minute 40 actually feels like, because the app never asks you.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "pairs",
  "seconds": 60,
  "prompt": "Be honest: which app most often leaves you flat, and which one actually leaves you fuller? Your feed, your data.",
  "lookFor": "Honesty and specificity. Named apps, named feelings, and the discovery that answers differ across the room, which is the point: the same app reads differently for different people.",
  "script": "Sixty seconds, partner talk, start the timer on screen. Share your own honest answer first, one app that leaves you flat and one that fills you up, because the room will only be as honest as you are. After the chime, collect a few answers and point out loudly when two pupils give opposite verdicts on the same app. That is not a contradiction, that is the whole lesson."
 },
 {
  "type": "diagram",
  "heading": "The mood audit",
  "caption": "Ten seconds, once per close. One honest word is the whole method.",
  "steps": [
   {
    "emoji": "📴",
    "title": "Close it",
    "text": "The audit runs at the moment you close an app, because inside the app is the one place you cannot see clearly."
   },
   {
    "emoji": "🪞",
    "title": "Ask the question",
    "text": "After I closed it, do I feel better, worse, or nothing? Honest answer, not the answer that sounds good."
   },
   {
    "emoji": "✍️",
    "title": "Log one word",
    "text": "Better, worse or nothing, next to the app name. Notes app, paper, anywhere. Ten seconds, done."
   },
   {
    "emoji": "📊",
    "title": "Read the week",
    "text": "After seven days the pattern appears: which apps fill you up, which leave you flat. Now you know something no study can tell you."
   }
  ],
  "verdicts": [
   "Better",
   "Worse",
   "Nothing"
  ],
  "script": "Walk the diagram as it builds. Get the class saying the question back to you: after I closed it, better, worse, or nothing? Twice, until it is automatic. Then point at the three verdicts and stress the rules of honest research: no cheating the log to look good, no judging yourself for a worse, and nothing counts as a real answer. One week of this beats every headline ever written about your generation, because it is about you.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🕳️",
  "heading": "Nothing is the sneaky verdict",
  "body": "Worse gets your attention because it hurts. Nothing slides past you, and that is what makes it sneaky. An hour of autoplay that you cannot remember a single video from did not hurt you, but it gave you nothing back, and it quietly spent an hour you never get returned. Researchers call this passive use, and it is the pattern most linked with feeling flat. Nothing is not fine and not terrible. It is information, and it is the verdict most people never notice they are logging.",
  "script": "Ask the room: who has ever closed an app after a big session and been unable to name one thing they just watched? Most hands go up, yours too. That is not a character flaw, autoplay is engineered to produce exactly that. The audit turns it from an invisible habit into a visible verdict. Nothing, logged honestly, four nights in a row, tells you something no lecture ever could.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "You close an app after an hour and feel nothing at all. Not better, not worse. What is the honest verdict?",
  "options": [
   {
    "text": "Nothing, and it is worth logging, because that hour bought you nothing back",
    "correct": true,
    "feedback": "Right. Nothing is a real verdict. It is not harm, but it is an hour spent for zero return, and a pattern of nothing is exactly what the audit exists to catch."
   },
   {
    "text": "No verdict needed, feeling nothing means no effect",
    "correct": false,
    "feedback": "Feeling nothing IS the effect. An hour in, nothing out. Skip the log and the pattern stays invisible, which is how it likes it."
   },
   {
    "text": "Better, because at least it was not worse",
    "correct": false,
    "feedback": "At least not worse is not the same as better. The audit only works with honest words, and the honest word here is nothing."
   }
  ],
  "script": "Quick check, whole class. The second option is the one to watch, it sounds reasonable and it is exactly how the nothing hours stay hidden. Land the line: the audit has three verdicts, not two, and the third one does the most detective work.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item three",
  "platform": "message",
  "handle": "Maya 🎨",
  "avatar": "🎨",
  "meta": "Group chat · the six of you · 19:42",
  "text": "CAMPING IS ON, my mum said yes 🏕️🔥 Dev bring the speaker, Jess you are on marshmallow duty, someone tell Sam before he books the cinema",
  "image": "🏕️",
  "prompt": "Run the audit on this one. You close the chat. Better, worse, or nothing? And what makes this different from the 11pm scroll?",
  "script": "This should be a fast, near unanimous better. The interesting question is the second one, so push for the actual difference: these are people who know your real life, you are in the plan, and the chat needed something from you. That is connecting. Same phone as the 11pm scroll, same evening, opposite verdict. The device was never the variable. The use was.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "Your three moves",
  "caption": "The audit finds the pattern. These moves are what the pattern unlocks. Never all or nothing, always calibrated.",
  "steps": [
   {
    "emoji": "🔇",
    "title": "Mute the source",
    "text": "One account that reads worse every single time does not need a place in your feed. Mute or unfollow is precise, not dramatic."
   },
   {
    "emoji": "⏰",
    "title": "Move the time",
    "text": "Same app, different hour. The scroll that reads worse at 11pm often reads nothing at 5pm. Timing is a dial you own."
   },
   {
    "emoji": "🎛️",
    "title": "Change the use",
    "text": "Shift minutes from comparing to connecting inside the same app. Message the mate instead of scrolling the stranger."
   },
   {
    "emoji": "✅",
    "title": "Keep it and know why",
    "text": "A better verdict earns its place. Keeping what fills you up is a decision too, and now it is an informed one."
   }
  ],
  "script": "Walk the four moves as they build, then say the thing directly: notice what is not on this list. Nobody is telling you to delete everything or hand your phone to your parents. That is allow or deny thinking and it does not survive contact with real life. The audit gives you a pattern, the pattern gives you a precise move, and you choose it. That is what having agency over a habit actually looks like.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 3,
  "mode": "groups",
  "seconds": 90,
  "prompt": "Every app measures your attention down to the second. Nothing measures your mood. Why is that, and whose job does that leave it?",
  "lookFor": "Attention is what the apps sell, so it gets measured obsessively. Your mood after closing is worth nothing to them, so nobody builds the dial. Which leaves exactly one person who can run that measurement: you.",
  "script": "Groups of three or four, ninety seconds on the timer. This is the stretch thinking of the lesson: apps track every second of watch time because attention is the product, and no app has ever asked how you felt after closing it. Collect one answer per group. The landing you want: the mood data does not exist anywhere in the world unless you collect it, which is exactly what the audit is."
 },
 {
  "type": "tryit",
  "heading": "The mood audit, on paper",
  "body": "Your teacher has six items on the worksheet: real evenings, real sessions, real closes. Run the audit on each one and give the verdict: better, worse, or nothing. You have fifteen minutes. Every verdict needs a reason, and a verdict without a reason does not count.",
  "script": "Hand out the worksheet or booklets. Fifteen minutes, bookmark strips on tables for anyone who needs the audit question in front of them. Support group works items one to three together with you, reading each scenario aloud and voting before writing. Stretch question for early finishers: why might a study of 350,000 people still not tell YOU what your feed does to your mood? Circulate and collect one great reason to read out at the end.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check. An adult tells you the scientists proved phones are rotting your generation's brains. What is the honest, evidence based reply?",
  "options": [
   {
    "text": "The evidence is weaker than the headlines. Raw hours barely predict wellbeing. What I do and how it leaves me feeling matter more, and I can track that myself",
    "correct": true,
    "feedback": "Exactly right, and notice what this answer is not: it is not phones are fine. It is the honest reading of the research plus the one measurement nobody else can run for you."
   },
   {
    "text": "They are right, all screen time damages your mood",
    "correct": false,
    "feedback": "The biggest studies found raw hours explain almost none of the difference in wellbeing. The panic version is not the evidence version."
   },
   {
    "text": "Phones have zero effect on anyone, the whole debate is fake",
    "correct": false,
    "feedback": "Zero effect is as lazy as total damage. How you use a screen shows up in the research and in your own audit. The truth needs the extra sentence."
   }
  ],
  "script": "First of two exit checks, this is the knowledge half of the outcome. Insist on the full first answer, not just the headlines are wrong part. A pupil who can say hours are weak evidence AND how it leaves me feeling is what I track has genuinely got this lesson.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "You run the mood audit for a week. One app comes back worse four times out of five. What does the audit give you the power to do?",
  "options": [
   {
    "text": "Make one calibrated move: mute the source, move the time, or change the use, because the pattern is now yours to act on",
    "correct": true,
    "feedback": "Right. The audit turns a vague feeling into a pattern, and a pattern into a precise move that you choose. That is agency, and it is the entire point of the week."
   },
   {
    "text": "Nothing, apps decide how you feel and that is that",
    "correct": false,
    "feedback": "The data in your own log disproves this. Different uses read differently, which means the dials exist and your hands are on them."
   },
   {
    "text": "Delete every app on your phone to be safe",
    "correct": false,
    "feedback": "The audit found ONE app reading worse. Deleting everything punishes the apps that read better too. Precision beats panic, every time."
   }
  ],
  "script": "Second exit check, this is the action half of the outcome. The third option matters: some pupils have heard so much all or nothing messaging that nuking everything feels like the responsible answer. Land it clearly: the audit is precise, so the response gets to be precise too.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Brock",
  "text": "After I closed it: better, worse, or nothing? One honest word, once a week read the pattern. My feed, my data, my call.",
  "script": "Brock says things once, calmly, and means them, so deliver it steady rather than loud. Then the whole class says it together, twice. This is the sentence you want running through their heads every time a thumb hits the close button this week.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "The evidence is quieter than the headlines: raw hours barely predict wellbeing, what you do and how it leaves you feeling matter far more.",
   "Same phone, two jobs: connecting mostly fills you up, comparing mostly runs you down, and only you know which one you were doing.",
   "The mood audit: after I closed it, better, worse, or nothing? Nothing is a real verdict and the sneakiest one.",
   "One week of honest answers earns one calibrated move: mute it, move it, change the use, or keep it and know why."
  ],
  "script": "Return to the opening question: hands up if you were ever told phones are ruining your generation. Then ask the new question: hands up if you could now explain to that adult what the research actually says. Watch the hands. Then the recap, read by pupils, one point each.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi closes the study",
  "lines": [
   "Study complete, researchers! ⭐",
   "The question that changes everything is seven words long: after I closed it, better, worse, or nothing?",
   "Your mission this week: every close, one honest word, for seven days. Then read YOUR pattern, not a headline about your generation.",
   "Brock says steady wins, and Brock is right. Nobody else gets your data. Nobody else makes your call. See you next lesson!"
  ],
  "script": "Let DiGi land the ending, the bubbles appear on their own. Exit quizzes go out as this plays, named copies from the print room. Collect them in, they are your evidence for the register, and the commitment cards go home in bags to start the week of audits tonight.",
  "phase": "close",
  "minutes": 2
 }
]$m10$::jsonb,
  '[]'::jsonb,
  $m10${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m10$::jsonb,
  $m10${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today we looked at the honest evidence on screens and mood: the biggest studies say what young people do on a screen and how it leaves them feeling matters far more than raw hours. Your child learned the mood audit, a ten second self check they will run for a week: after I closed it, did I feel better, worse, or nothing?",
 "try_this": "Run the audit yourself this week, out loud, on your own phone. When they hear you say worse after the news app, the tool becomes a normal thing your family does rather than a rule aimed at them.",
 "family_question": "Which app leaves you feeling better after you close it, and which one leaves you feeling nothing?",
 "no_login_required": true
}$m10$::jsonb,
  $m10${
 "learning_objective": "Pupils can describe the honest evidence on screens and mood, distinguish connecting from comparing in their own use, and run the mood audit (better, worse, or nothing) on their screen habits for a week, leading to one calibrated change they choose themselves.",
 "timing": "60 minutes: starter 8, cycle one 7, cycle two 6, cycle three 15, practise 15, prove 4, close 5",
 "misconceptions": [
  "Screen time hours decide your mood (the biggest studies found raw hours barely predict wellbeing, what you do and how it leaves you feeling matter far more)",
  "The same app affects everyone the same way (one pupil's connecting is another pupil's comparing, which is exactly why each pupil runs their own audit instead of trusting an average)",
  "Feeling nothing after a long session means no effect (nothing is a verdict too, an hour that gives nothing back is worth noticing and it is the pattern most linked with feeling flat)"
 ],
 "differentiation": {
  "support": "Keep the bookmark strip with the audit question in front of support pupils throughout. Work worksheet items one to three together, reading each scenario aloud and voting on the verdict as a group before anyone writes. Accept one word reasons: knows me, comparing, hour gone.",
  "stretch": "Early finishers take the researcher question: why might a study of 350,000 people still not tell YOU what your feed does to your mood? Push towards averages hiding individuals, which is the exact reason the personal audit exists. Strongest thinkers can also tackle: why does no app ever ask how you felt after closing it?"
 },
 "paper_fallback": "The whole lesson runs from the printed pack with no screen. Read the two feed posts and the group chat aloud as short scripts, draw the four step audit and the four moves on the board as you talk them through, run both timed talks with a watch, and use the worksheet, bookmark and exit quiz exactly as printed. The stat can be written on the board: 0.4 percent, and the potato line works even better out loud.",
 "keywords": [
  {
   "word": "evidence",
   "definition": "What careful studies actually found, which is often much quieter than the headlines shouting about them."
  },
  {
   "word": "comparing",
   "definition": "Measuring your real, unedited life against someone else's chosen highlights. It rarely reads better."
  },
  {
   "word": "connecting",
   "definition": "Using a screen to reach people who know your actual life. The use that most often reads better."
  },
  {
   "word": "audit",
   "definition": "An honest check you run on yourself, with real answers, not the answers that sound good."
  }
 ],
 "tool": {
  "heading": "The mood audit",
  "lines": [
   "Close it.",
   "Ask: better, worse, or nothing?",
   "Log one word. Read the week."
  ],
  "strapline": "Your feed, your data, your call."
 },
 "worksheet": {
  "title": "The mood audit case file",
  "directions": "Run the audit on each close: give the honest verdict and the reason, because a verdict without a reason does not count.",
  "verdict_options": [
   "Better",
   "Worse",
   "Nothing"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "You spend twenty minutes in the group chat sorting Saturday plans and laughing at Dev's terrible photos. You close it still smiling.",
   "expected_verdict": "Better",
   "teaching_point": "Connecting with people who know your actual life is the use that most often reads better. The smile at the close is the data."
  },
  {
   "n": 2,
   "item": "You scroll a fitness influencer's page for half an hour. Their life looks perfect. You close it, look around your own room and feel a bit rubbish about yourself.",
   "expected_verdict": "Worse",
   "teaching_point": "Comparing your unedited life to someone's chosen highlights is the pattern that most often reads worse. The feed showed you their best 34 seconds, not their Tuesday."
  },
  {
   "n": 3,
   "item": "You open one video at 10pm. At 11.40pm you close the app, cannot remember a single thing you watched, and now you are annoyed about the lost time and how tired you will be tomorrow.",
   "expected_verdict": "Worse",
   "teaching_point": "Autoplay is engineered to make hours vanish. Here the session crossed from nothing into worse: lost sleep and real annoyance at the close. The close is where the truth shows up."
  },
  {
   "n": 4,
   "item": "You watch football highlights for twenty minutes with your brother, both of you shouting at the same screen.",
   "expected_verdict": "Better",
   "teaching_point": "Screens are not the variable, use is. Shared, active, with someone who knows you: this reads better even though it is technically just watching videos."
  },
  {
   "n": 5,
   "item": "An hour of shorts on the sofa. You feel exactly the same as before you opened the app. Not sad, not happy. The evening is just gone.",
   "expected_verdict": "Nothing",
   "teaching_point": "Nothing is a real verdict and the sneakiest one: no harm at the close, but an hour spent for zero return. Logged honestly across a week, nothing is the pattern that earns a calibrated move."
  },
  {
   "n": 6,
   "item": "Priya says: after an hour of scrolling I feel nothing at all, so the app is clearly doing nothing to me and there is nothing to think about. Do you agree? Explain your reasoning.",
   "expected_verdict": "Nothing",
   "teaching_point": "Half agree, half challenge: the verdict is genuinely nothing, but doing nothing to me is wrong. Feeling nothing IS the effect: an hour in, nothing back. The strongest answers also name why hours alone never settle the question."
  }
 ],
 "commitment_stem": "My commitment: for one week, every time I close ................ I will log one honest word, better, worse or nothing, and read my pattern on day seven."
}$m10$::jsonb,
  $m10${
 "required": true,
 "note": "This lesson invites pupils to notice and talk honestly about their own mood. Most answers will be everyday ones, but the honesty can surface more: if a pupil discloses persistent low mood, or their worksheet or exit card raises concern, follow your school safeguarding policy and speak to your DSL. Do not promise confidentiality, do respond warmly: thank you for telling me, you are not in trouble.",
 "concern_form_linked": true
}$m10$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 11: Social media, group chats and the workarounds
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks3-11-social-workarounds', 'Social media, group chats and the workarounds', 'KS3', 'Years 7 to 9', 'teacher',
  '{2,4,7}'::int[], ARRAY['EfCW','Online Safety Act education duty']::text[], '{}'::text[],
  'Workaround behaviour research', 'I can explain the risk behind a workaround I might be tempted by.', 'Vix', 11,
  $m11$[
 {
  "type": "title",
  "eyebrow": "KS3 · Years 7 to 9 · Module 11",
  "title": "Social media, group chats and the workarounds",
  "body": "One hour, one skill: seeing what a workaround really costs before you decide anything.",
  "script": "Settle the class with this slide up. Today is not a lecture about apps being bad, and nobody gets judged in this room, say that out loud, it changes the whole hour. Today is one hour on how the machine behind social media actually works, and what the shortcuts around it actually cost. Our guide today is Vix the fox, who has seen every trick going and does not gasp at any of them.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can explain the risk behind a workaround I might be tempted by.",
  "why": "Most internet safety lessons pretend nobody in the room has ever heard of a VPN or borrowed an account, and everyone stops listening in the first minute. This lesson respects you enough to be honest: the rules on these platforms exist for real reasons, and the interesting question is what you actually give up when you slide around them.",
  "gains": [
   "Explain what the algorithm is actually doing with your account",
   "Name the protections that sit behind an age rule",
   "Spot what a workaround really skips, not just the rule but everything wired behind it",
   "Read a group chat and know what strangers in it actually means"
  ],
  "script": "Read the outcome in pupil voice, then the why. Then ask for hands: who has ever heard of a way around an age check or a blocked app? Nearly every hand should go up, and that is fine, that honesty is the whole point of today. One ground rule before we start: nobody confesses anything in this lesson. We talk about the workarounds, never about who used them.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Street words for today",
  "words": [
   {
    "word": "algorithm",
    "meaning": "The system that decides what your feed shows you next, built to keep you watching for as long as possible."
   },
   {
    "word": "moderation",
    "meaning": "The people and systems a platform uses to find and remove harmful content and dangerous accounts."
   },
   {
    "word": "workaround",
    "meaning": "Any trick that gets past a rule: a fake age, a borrowed account, a VPN, a sideloaded app."
   },
   {
    "word": "VPN",
    "meaning": "A tool that hides where you really are, so the internet treats you as if you are somewhere else."
   }
  ],
  "script": "Say each word, class repeats it back. Then point out something important: none of these are dirty words. A VPN is a normal tool millions of adults use for work every day. The question today is never is this thing evil. The question is always what happens when it is used to skip a protection. Keep that distinction, it is what makes this lesson honest.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Warm up from last lesson. The mood audit. You have just spent an hour scrolling. What is the question you ask yourself?",
  "options": [
   {
    "text": "Do I feel better, worse, or nothing?",
    "correct": true,
    "feedback": "That is the audit. Three honest words after any screen time: better, worse, or nothing. The answer tells you what that hour actually gave you."
   },
   {
    "text": "How many likes did I get?",
    "correct": false,
    "feedback": "Likes measure the post, not you. The audit is about what the hour did to your mood: better, worse, or nothing."
   },
   {
    "text": "How long was I on for?",
    "correct": false,
    "feedback": "Time is part of the picture, but the audit is sharper than a stopwatch. Better, worse, or nothing is the question that tells you something."
   }
  ],
  "script": "Retrieval from last lesson, thirty seconds of thinking time before anyone answers. Cold call two pupils for their reasoning, not just their letter. Then one bonus question for anyone brave: has anyone actually run the audit since last lesson, and what came back? One honest answer here sets the tone for the whole hour.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "⚙️",
  "heading": "How the machine sees you",
  "body": "When you open an account, the platform builds a profile of you: the age you typed in, what you watch, what you pause on, what you search late at night. The algorithm uses that profile to decide what you see next, and its only job is to keep you there longer. Your age setting is one of the biggest levers in that machine. It changes what can be recommended to you, who is allowed to contact you, and how strictly the filters run. The platform does not know you. It knows the age you typed in, and it builds your entire world from that.",
  "script": "Land the last two lines hard: the platform does not know you, it knows the age you typed in, and it builds your world from that. Then plant the question without answering it: so what changes if that age is wrong? Hold the silence for a moment. The next slide answers it.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "What an age setting actually switches on",
  "caption": "The rule is one line on a sign up screen. These are the protections wired to it.",
  "steps": [
   {
    "emoji": "🛡️",
    "title": "Stricter filters",
    "text": "Violent, sexual and dangerous content is filtered far harder for under 18 accounts."
   },
   {
    "emoji": "🔒",
    "title": "Contact limits",
    "text": "Adults you do not follow cannot message you, and your account is harder for strangers to find."
   },
   {
    "emoji": "🚨",
    "title": "Reporting that works for you",
    "text": "Reports from a child account are prioritised, and the help tools point you to real support."
   },
   {
    "emoji": "👁️",
    "title": "Tuned recommendations",
    "text": "The algorithm is told to stop pushing certain rabbit holes at accounts your age."
   }
  ],
  "script": "Walk each protection as it appears. Then the key question: what do all four have in common? Take answers, then land it: they are all invisible. You never see a protection working. You only ever feel the rule that annoys you at sign up. That asymmetry, annoying rule you can see, silent protections you cannot, is exactly why workarounds feel free. They are not.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "stat",
  "figure": "1 in 3",
  "claim": "Children aged 8 to 17 with a social media profile signed up with a false age of 18 or over, so the platform treats them as adults.",
  "source": "Ofcom, children's online user ages research, 2022",
  "script": "Let the number land before you speak. A third of the country's kids are walking around online in an adult costume. Then the honest question: did those children become adults when they typed a different birthday? No. So what happened to their four protections? Gone, all four, and nobody sent them a warning about it. Nothing looked different that day. That is the trap.",
  "phase": "teach",
  "minutes": 1
 },
 {
  "type": "choice",
  "question": "So what IS an age rule, really?",
  "options": [
   {
    "text": "A switch that turns a whole set of protections on or off",
    "correct": true,
    "feedback": "That is the honest answer. The rule is the visible bit. Behind it sit filters, contact limits, prioritised reports and tuned recommendations, all wired to that one setting."
   },
   {
    "text": "A box ticking exercise the platforms do not really care about",
    "correct": false,
    "feedback": "Platforms face serious fines when it fails, which is exactly why real protections are wired to it. The rule is the switch, not the whole machine."
   },
   {
    "text": "A way of keeping young people off the internet",
    "correct": false,
    "feedback": "Nobody is trying to keep you off the internet. The rule decides which version of the platform you get: one with protections running, or one without."
   }
  ],
  "script": "Hands or devices. Once the right answer is established, come back to the word switch and write it on the board. It is the word for the rest of the lesson: every workaround we are about to meet is someone flipping that switch without knowing what it was connected to.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "message",
  "handle": "year 8 legends 🐍 · 34 members",
  "avatar": "🐍",
  "meta": "Group chat · 34 members · 19:47",
  "text": "right everyone listen. new app is region locked and the age check is actual torture 💀 here is the fix: get this VPN, set it to USA, make the account there, birthday 1998. takes 2 mins. tutorial vid above 👆 everyone is doing it",
  "image": "📲",
  "prompt": "This lands at 19:47 on a Tuesday in a chat you are actually in. Before anyone says right or wrong: what would this fix actually DO?",
  "script": "This is where Vix arrives, and Vix does not gasp, Vix has seen a thousand of these messages. First, admire the sales technique like a detective would: takes 2 mins, everyone is doing it, the fix. Then ask the class to list what it technically does. The VPN says you are in America. Birthday 1998 says you are an adult. Then the only question Vix ever asks: what just got switched off? Point back at the diagram. All four protections, gone in two minutes, for an app.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🦊",
  "heading": "What a workaround actually skips",
  "body": "Here is the honest core of today, and Vix tells it to you straight: a workaround does not just skip a rule. It skips every protection wired behind the rule. Type an adult birthday and the filters relax, the contact limits drop, and the algorithm starts treating you as someone who can handle anything. Worst of all, if something goes wrong, the report and help tools think they are helping an adult. The rule took ten seconds to skip. The protections were the only part that was ever for you.",
  "script": "This is the slide the module is named after, so read it slowly and do not rush the room. The tone is a mechanic showing you where the brakes are, never a police officer. Check understanding with one question: why can the platform no longer help a 12 year old who is on an 18 year old account? Answer: because it does not know there is a 12 year old there to help. Let a pupil say it in their own words.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "Vix's rule",
  "caption": "Behind every rule is a protection. Skip the rule, lose the protection. Then decide with your eyes open.",
  "steps": [
   {
    "emoji": "📜",
    "title": "Find the rule",
    "text": "Age check, region lock, app store block. The annoying bit you can see."
   },
   {
    "emoji": "🛡️",
    "title": "Name the protection behind it",
    "text": "What is this rule wired to? Filters, contact limits, moderation, the ability to get help."
   },
   {
    "emoji": "⚖️",
    "title": "Weigh it with your eyes open",
    "text": "Now you know the real price. Whatever you decide is a decision, not an accident."
   }
  ],
  "verdicts": [
   "No protection lost",
   "Weigh it up",
   "Protection lost"
  ],
  "script": "Walk the three steps as they build, then get the class saying the rule back: behind every rule is a protection, skip the rule, lose the protection. Now the most important thing you will say all lesson: notice this tool is not just say no. Step three belongs to the pupil. A pupil who says I might still be tempted, but now I know exactly what I am risking, has learned today's lesson perfectly. Say that out loud. It is the difference between obedience and judgement, and judgement is the one that travels with them.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "Back to the VPN tutorial in the group chat. Run Vix's rule. What did that fix actually cost?",
  "options": [
   {
    "text": "Every protection wired to the age setting: filters, contact limits, tuned recommendations and reports that know you are a child",
    "correct": true,
    "feedback": "Exactly. The rule fell in two minutes and the whole protection stack fell with it. That is the real price the tutorial never mentioned."
   },
   {
    "text": "Nothing much, a VPN only changes your location",
    "correct": false,
    "feedback": "The VPN alone does change location. But the tutorial also said birthday 1998, and that one line switches off every child protection on the account."
   },
   {
    "text": "Two minutes of setup time",
    "correct": false,
    "feedback": "Two minutes is the visible cost. The invisible cost is the protection stack, which is exactly why workarounds feel free when they are not."
   }
  ],
  "script": "This should be close to unanimous if the diagram landed. If it is not, go back two slides, the back button works. Push one correct answerer further: which of the four lost protections would matter most on a genuinely bad day? There is no single right answer, but the ability to get help is the one Vix would name.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item two",
  "platform": "message",
  "handle": "Ells 💜",
  "avatar": "💜",
  "meta": "Direct message · 21:12",
  "text": "you can just use my old account if you want, i am 19 on it lol. everything is already unlocked, saves you the whole age thing. pass is the dog's name obviously 😂",
  "image": "🔑",
  "prompt": "A real offer, from someone who genuinely loves you. Run Vix's rule out loud: the rule, the protection, the decision.",
  "script": "The trap in this one is that it feels safe because the source is safe. Ells is kind, Ells is family, and that changes nothing about the machine, because the machine cannot see kindness, it can only see the account. The account is 19, so adult DMs are open, adult content filters apply, adult recommendations run. Two bonus points to draw out: the algorithm on that account was trained on Ells, so you inherit a feed tuned for a 19 year old you are not. And a shared password means anything that happens on that account happens in both your names. Nobody is angry at Ells here. Ells never saw the wiring either.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "mode": "pairs",
  "seconds": 60,
  "prompt": "Why do workarounds spread so easily? What makes takes 2 mins and everyone is doing it such a good sales pitch?",
  "lookFor": "The cost is invisible and delayed while the rule is annoying and immediate. Everyone is doing it moves the risk into a crowd, and crowds feel safe. Nobody selling a workaround ever lists what gets switched off.",
  "script": "Sixty seconds, partner talk, start the timer on screen. You are fishing for the asymmetry: rules annoy you today, protections only matter on a bad day that has not happened yet. Take two or three answers after the chime, then name it cleanly: every workaround is sold by someone who is not describing the price. Not because they are evil. Usually because they never saw the price either.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "👥",
  "heading": "A group chat with strangers in it",
  "body": "Now the second half of the case: group chats. A chat with your five mates is a room with five people you know. A chat with 120 members is a public place wearing a private costume. Anyone in that chat can screenshot what you send, save your profile and message you directly, and the friendly ones and the dangerous ones look identical in a member list. So Vix's test is simple: if you cannot name everyone in a chat, you are not talking to friends. You are broadcasting to strangers.",
  "script": "Ask the class to silently think of the biggest group chat they are in, and whether they could name everyone in it. No hands, no answers, just let it land privately. Then give them the costume line: 120 members is a public place wearing a private costume. This is not a panic message. It is about knowing which room you are standing in, because you behave differently in a bedroom and a shopping centre, and you should.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item three",
  "platform": "message",
  "handle": "FIFA trading hub 🔥 · 212 members",
  "avatar": "🎮",
  "meta": "Group chat · 212 members · you were added by Kian",
  "text": "new member deal 🤝 free coins app, not on the store because the store takes a cut lol. download it from the link, turn off the install warning when your phone moans, works first time. dm me if it asks for your login",
  "image": "⚠️",
  "prompt": "There are three workarounds hiding in this one message. Find all three, and name the protection behind each one.",
  "script": "Two minute hunt in small groups, then collect. The three: downloading outside the store skips the store's malware and scam checks, turning off the install warning skips your phone's own built in protection, and dm me your login skips the most basic protection you own. Also notice the cover story: the store takes a cut is doing the same job as everyone is doing it, a reason that sounds street smart pasted over a price nobody mentions. Vix's verdict on this one is short: three protections gone and a stranger in a 212 person chat asking for your password. Eyes open, that is not a deal.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "mode": "groups",
  "seconds": 90,
  "prompt": "Why does Vix's rule end with weigh it with your eyes open instead of just say no?",
  "lookFor": "Just say no gets ignored the moment a rule feels stupid, and some rules do feel stupid. Judgement travels with you into rooms where no adult is watching. A person who knows the real price makes better calls for life than a person who was only ever told no.",
  "script": "Groups of three or four, ninety seconds on the timer. This is the most important conversation of the hour, so give it room. If a group says adults just want control, do not argue, ask them to look back at the four protections on the diagram and say who actually benefits when a child skips them. Collect one answer per group, and finish with the truth of the whole module: we trust you with the wiring diagram because you are going to be making these calls without us very soon.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "tryit",
  "heading": "Street practice, on paper",
  "body": "Six items on the worksheet: offers, chat messages and situations, each one a workaround or something that only looks like one. Run Vix's rule on each: find the rule, name the protection wired behind it, then give your verdict: no protection lost, weigh it up, or protection lost. You have fifteen minutes. A verdict without the named protection does not count.",
  "script": "Hand out the worksheets, bookmark strips on tables for anyone who wants Vix's rule in front of them. Fifteen minutes. Support group works items one to three together with you. Stretch for early finishers: write the group chat message that would sell item three to this class, then circle every sales trick you used, it teaches the persuasion mechanics from the inside. Circulate and collect one brilliantly reasoned verdict to read out at the end.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check. A friend sends you a VPN tutorial so you can make an account with an adult birthday. What is the real risk to weigh?",
  "options": [
   {
    "text": "Not getting caught, but what switches off: filters, contact limits and help tools that know your real age",
    "correct": true,
    "feedback": "That is Vix's rule working. The workaround skips the rule and every protection wired behind it, and that is the price to weigh before you decide anything."
   },
   {
    "text": "The VPN might slow your internet down",
    "correct": false,
    "feedback": "A slow connection is an inconvenience. The real cost is the protection stack that switches off the moment the account believes you are an adult."
   },
   {
    "text": "Your friend could get in trouble for sending the tutorial",
    "correct": false,
    "feedback": "Maybe, but that is not the risk that matters. What matters is what the account exposes you to once every child protection is off."
   }
  ],
  "script": "First of two exit checks, and it mirrors evidence item one, so a wrong answer here tells you exactly who to mark as working towards on the register. Silent, independent, no conferring, this pair of questions is the printed exit quiz.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "True or false: a workaround just skips an annoying rule.",
  "options": [
   {
    "text": "False. It skips the rule and every protection wired behind the rule",
    "correct": true,
    "feedback": "That is the whole lesson in one line. The rule is the visible bit. The moderation, the reporting, the filters and the ability to get help are all wired behind it, and they fall together."
   },
   {
    "text": "True. The rule is the only thing that changes",
    "correct": false,
    "feedback": "That is exactly what a workaround feels like, and exactly why it is a trap. The rule is a switch, and the protections behind it turn off with it."
   }
  ],
  "script": "The nuance check. If anyone argues the true side, welcome the argument and then land the distinction: the day you skip the rule, nothing looks different. The difference only shows up on a bad day, when the report button thinks it is helping an adult. That invisible gap is why this question matters more than it looks.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Vix",
  "text": "Behind every rule is a protection. Skip the rule, lose the protection. I decide with my eyes open.",
  "script": "Whole class says it together, twice, louder the second time. This is the sentence you want quoted back at you in the corridor, and quoted in a group chat the next time a tutorial gets posted.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "Your age setting is a switch: filters, contact limits, tuned recommendations and real help are all wired to it.",
   "A workaround does not just skip a rule. It skips every protection behind the rule.",
   "A giant group chat is a public place wearing a private costume. If you cannot name everyone, you are broadcasting to strangers.",
   "Vix never says just say no. Vix says know the price, then decide with your eyes open."
  ],
  "script": "Four pupils read one point each. Then return to the start of the lesson: we said the rules on these platforms exist for reasons. Ask the room to name one reason they could not have named an hour ago. Take three answers. That visible gain is the lesson proving itself.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi walks you out",
  "lines": [
   "Vix asked me to lock up tonight! ⭐",
   "Remember the rule: behind every rule is a protection. Skip the rule, lose the protection.",
   "Your mission this week: the next time anyone offers you a workaround, silently name the protection it skips before you say a single word back.",
   "Being street smart was never about knowing the tricks. It is about knowing the price. You know it now. See you next lesson!"
  ],
  "script": "Let DiGi land the ending, the bubbles appear on their own. Exit quizzes go out as this plays, named copies from the print room, and pupils write their commitment line on the exit card. Collect them in, they are your evidence for the register.",
  "phase": "close",
  "minutes": 2
 }
]$m11$::jsonb,
  '[]'::jsonb,
  $m11${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m11$::jsonb,
  $m11${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today we looked honestly at how social platforms actually work, and at workaround culture: VPNs, borrowed accounts and fake ages. Your child learned Vix's rule: behind every rule is a protection, skip the rule and you lose the protection, so decide with your eyes open.",
 "try_this": "Ask your child to explain what actually switches off when someone signs up with an adult birthday. Let them teach you the full list, they know it now, and teaching you is the best revision there is.",
 "family_question": "What is one rule in our house that has a protection hiding behind it?",
 "no_login_required": true
}$m11$::jsonb,
  $m11${
 "learning_objective": "Pupils can explain that a workaround skips the protections wired behind a rule, not just the rule itself, and can name the specific protection lost in a workaround they might realistically meet.",
 "timing": "60 minutes: starter 8, cycle one (how the machine works) 8, cycle two (workaround culture) 13, cycle three (group chats and judgement) 7, practise 15, prove 4, close 5",
 "misconceptions": [
  "A VPN is illegal or evil (a VPN is a normal tool adults use for work every day, the risk arrives when it is used to fake an age or a location and switch off protections)",
  "Age rules exist to keep young people off the internet (an age rule is a switch that selects the protected version of a platform, with filters, contact limits and prioritised reporting wired to it, it is not a ban)",
  "A borrowed account is safe if it comes from someone you trust (the machine cannot see kindness, it only reads the account's age, so adult settings, adult DMs and an inherited adult feed apply no matter who handed it over)"
 ],
 "differentiation": {
  "support": "Work worksheet items one to three as a guided group with the bookmark strip in front of each pupil. Scaffold with the two spoken questions: what is the rule here, and what is it wired to? Accept verbal verdicts and scribe the named protection for pupils who need it.",
  "stretch": "Early finishers write the group chat message that would sell item three to this exact class, then circle every persuasion trick they used (speed, crowd, cover story). Second stretch: which of the four protections would you redesign so it annoys people less without protecting them less?"
 },
 "paper_fallback": "The whole lesson runs from the printed pack: read the two scenarios aloud in your best group chat voice, draw the switch diagram on the board with the four protections as branches, run both discussions as timed pair talk with a watch, and use the printed exit quiz for the prove phase. The bookmark strip replaces the diagram slide for the practise phase.",
 "keywords": [
  {
   "word": "algorithm",
   "definition": "The system that decides what your feed shows you next, built to keep you watching for as long as possible."
  },
  {
   "word": "moderation",
   "definition": "The people and systems a platform uses to find and remove harmful content and dangerous accounts."
  },
  {
   "word": "workaround",
   "definition": "Any trick that gets past a rule: a fake age, a borrowed account, a VPN, a sideloaded app."
  },
  {
   "word": "VPN",
   "definition": "A tool that hides where you really are, so the internet treats you as if you are somewhere else."
  }
 ],
 "tool": {
  "heading": "Vix's rule",
  "lines": [
   "Behind every rule is a protection.",
   "Skip the rule, lose the protection.",
   "Decide with your eyes open."
  ],
  "strapline": "Street smart is knowing the price."
 },
 "worksheet": {
  "title": "The workaround files",
  "directions": "Run Vix's rule on each item: find the rule, name the protection wired behind it, then give your verdict.",
  "verdict_options": [
   "No protection lost",
   "Weigh it up",
   "Protection lost"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "A group chat message says: new app is region locked and the age check is torture. Get this VPN, set it to USA, birthday 1998, takes two minutes.",
   "expected_verdict": "Protection lost",
   "teaching_point": "The adult birthday is the real workaround, not the VPN. That one line switches off the filters, the contact limits and the child prioritised reporting in a single move."
  },
  {
   "n": 2,
   "item": "A link in a chat says: download the game from this site instead of the app store, and turn off the install warning when your phone complains.",
   "expected_verdict": "Protection lost",
   "teaching_point": "Sideloading skips the store's malware and scam checks, and the install warning is your phone's own protection. Two protections gone before the game even opens."
  },
  {
   "n": 3,
   "item": "Your older cousin offers you their old account: I am 19 on it, everything is already unlocked, saves you the whole age thing.",
   "expected_verdict": "Protection lost",
   "teaching_point": "A kind source does not change the machine. The account is 19 to the algorithm, so adult DMs, adult filters and adult recommendations all apply, and you inherit a feed trained on someone you are not."
  },
  {
   "n": 4,
   "item": "You turn 13, make your own account with your real birthday, then use the platform's own settings to switch your account to private.",
   "expected_verdict": "No protection lost",
   "teaching_point": "This is the opposite of a workaround. The real age keeps every wired protection on, and the privacy setting adds another one on top. Settings can work for you, not just against you."
  },
  {
   "n": 5,
   "item": "A friend adds you to a chat of 150 people you mostly do not know, because honestly the memes are elite.",
   "expected_verdict": "Weigh it up",
   "teaching_point": "No rule is broken here, but a chat that size is a public place wearing a private costume: anyone in it can save your profile and message you. The eyes open questions are who can see me here and what am I sharing."
  },
  {
   "n": 6,
   "item": "Kian says: \"A VPN just changes where the internet thinks you are. It does not change anything else, so using one is completely harmless.\" Do you agree? Explain your reasoning.",
   "expected_verdict": "Weigh it up",
   "teaching_point": "Partly true, which is what makes it the perfect final item. A VPN alone changes location, and that can be harmless. The harm arrives when it is used to fake an age or dodge a protection, because everything wired behind the rule switches off. The tool is not the risk. The skipped protection is."
  }
 ],
 "commitment_stem": "My commitment: the next time someone offers me a workaround, I will name the protection it skips before I decide anything."
}$m11$::jsonb,
  $m11${
 "required": true,
 "note": "Workaround and group chat conversations can surface live disclosures: pupils in large chats with adults they do not know, unwanted contact from strangers, or accounts already running on false ages. The lesson deliberately promises that nobody confesses anything, so treat any voluntary disclosure with care and never in front of the class. If a pupil discloses concerning contact or content, follow your school safeguarding policy and log it with the DSL the same day. The pupil is not in trouble, and should hear that first.",
 "concern_form_linked": true
}$m11$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 13: Scams, fraud and money online
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks3-13-scams-fraud-money', 'Scams, fraud and money online', 'KS3', 'Years 7 to 9', 'teacher',
  '{7}'::int[], ARRAY['Citizenship digital financial literacy (fraud and scam prevention)']::text[], '{}'::text[],
  'Fraud exposure in teens', 'I can spot a scam’s three tells.', 'Vix', 13,
  $m13$[
 {
  "type": "title",
  "eyebrow": "KS3 · Years 7 to 9 · Module 13",
  "title": "Scams, fraud and money online",
  "body": "One hour, one skill: three tells that expose a scam before it costs you a penny or a password.",
  "script": "Settle everyone with this slide up. Last lesson you learned to catch lies. Today you learn to catch thieves. By the end of the hour you will know the three tells every scam gives away, and why scammers are aiming at this exact room.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can spot a scam's three tells.",
  "why": "Scammers deliberately target teenagers, partly because your accounts are worth real money and partly because most teenagers believe scams only catch old people. That belief is exactly what a thief wants you to hold, so today we replace it with three tells that expose a scam in seconds.",
  "gains": [
   "Spot phishing, fake giveaways and get rich hype the moment they land",
   "Run the three tells on any message in under a minute",
   "Explain why a gaming account is worth stealing and how thieves take one",
   "Give a verdict with a reason: looks genuine, verify first, or scam"
  ],
  "script": "Read the mission and the why out loud. Then ask: hands up if you think a scam could actually catch YOU. Count the hands, it will be low. Tell them to remember that number, we are coming back to it at the end of the lesson.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Detective words for today",
  "words": [
   {
    "word": "scam",
    "meaning": "A trick built to take your money, your codes or your account by making you act before you think."
   },
   {
    "word": "phishing",
    "meaning": "A fake message or login page dressed up as a real one, fishing for your password or card details."
   },
   {
    "word": "account theft",
    "meaning": "Stealing a whole account, locking the owner out, then selling it or using it to scam their friends."
   },
   {
    "word": "tell",
    "meaning": "The small giveaway a trick cannot hide. Scams have three, and you are about to learn them."
   }
  ],
  "script": "Say each word, class repeats it back. Phishing with a PH: they throw the bait, you are the fish, and the hook is a fake login page. A tell is a poker word, the twitch that gives a bluffer away. Scams are bluffs, and bluffers have tells.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Warm up from last lesson. A clip lands in the group chat: a celebrity apparently confessing to something shocking, and it looks completely real. What did last lesson teach you to do?",
  "options": [
   {
    "text": "Run the three checks: who made it, what do other places say, how is it trying to make me feel",
    "correct": true,
    "feedback": "Exactly. Looking is not a test anymore, the checks do the work your eyes cannot. Keep those checks warm, because today's lesson is their partner."
   },
   {
    "text": "Trust it, video is too hard to fake",
    "correct": false,
    "feedback": "Video stopped being hard to fake. That was the whole of last lesson, and it is why the checks exist: your eyes cannot tell anymore."
   },
   {
    "text": "Assume it is fake, most things online are lies",
    "correct": false,
    "feedback": "Most things online are not lies. Assuming everything is fake is as lazy as believing everything. The checks tell you which is which."
   }
  ],
  "script": "Retrieval from module twelve, thirty seconds of thinking time before anyone answers. Cold call two pupils for reasoning, not letters. Then plant today's bridge: last lesson's checks catch lies, content built to fool what you believe. Today's tells catch thieves, messages built to empty your pockets. Same detective, new case.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "message",
  "handle": "EVRl Delivery",
  "avatar": "📦",
  "meta": "Text message · Unknown number",
  "text": "We could not deliver your parcel today. To avoid it being returned, pay the £1.45 redelivery fee within 24 hours: evri.redeliver.uk.trackfee.com",
  "image": "🚚",
  "prompt": "Hands up: who has seen a text like this on a real phone in your house? Now the harder question: what exactly is wrong with it?",
  "script": "Nearly every hand goes up, these texts hit every phone in Britain. Collect suspicions but confirm nothing yet. If someone spots the fee, the deadline or the strange web address, park each one on the board. Then the quiet detail: the sender name ends in a lowercase L dressed up as a capital i, thieves impersonate real companies right down to the letters. If a pupil says someone at home actually paid one of these, no blame at all, adults get caught by these every single day, which is exactly why we are learning it at thirteen.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🎣",
  "heading": "Phishing: the fake that fishes",
  "body": "Phishing is a message dressed as something you trust: a courier, a game, your bank, even your school. It has one job, to steer you onto a fake page that looks exactly like the real login and watch you type your password or card number into it. The classic costume is urgency: your account will be deleted, your parcel will be returned, your prize expires tonight. Real companies almost never work like this, and thieves almost always do, because a rushed brain skips the checking a calm brain would run.",
  "script": "Land the key idea: phishing does not hack your device, it asks YOU to hand over the keys, politely and in a hurry. Ask the class why the deadline is always short. Answer: the rush IS the tool. A rushed brain acts first and thinks later, and the whole scam collapses if you get ten calm seconds. Then the good news: you cannot always spot a fake page, but you can always spot the rush.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The three tells",
  "caption": "Every scam has the same three jobs: rush you, redirect you, tempt you. Any one tell means pause. Two or more means scam.",
  "steps": [
   {
    "emoji": "⏱",
    "title": "Tell one: it rushes you",
    "text": "A deadline, a countdown, act now or lose it. Rush exists to switch your thinking off."
   },
   {
    "emoji": "🗝",
    "title": "Tell two: it wants something odd",
    "text": "Codes, gift cards, your login, a fee through a strange link. Real organisations do not ask this way."
   },
   {
    "emoji": "💎",
    "title": "Tell three: it is too good to be true",
    "text": "Free skins, doubled money, prizes you never entered for. Nobody gives strangers free money."
   }
  ],
  "verdicts": [
   "Looks genuine",
   "Verify first",
   "Scam"
  ],
  "script": "Walk the diagram as it builds and get the class chanting the tells back: it rushes me, it wants something odd, it is too good to be true. Then the verdicts: looks genuine when no tell fires, verify first when you are not sure, scam when the tells stack up. Verify first means checking by a different route, open the real app yourself or ask the real person face to face, never through the link or number inside the message itself.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "stat",
  "phase": "teach",
  "minutes": 1,
  "figure": "9 in 10",
  "claim": "Nearly nine in ten UK adults say they have come across content online that they suspected was a scam or fraud.",
  "source": "Ofcom online scams and fraud research, 2023",
  "script": "Let the number land before you speak. Nine in ten. Scams are not rare accidents that happen to careless people, they are background weather on every phone in this room. That is why a repeatable check beats hoping you will just notice."
 },
 {
  "type": "choice",
  "question": "Back to the parcel text: a £1.45 fee, a 24 hour deadline, a strange web address. Which tell fires first?",
  "options": [
   {
    "text": "Tell one, the rush: a 24 hour deadline exists to stop you thinking",
    "correct": true,
    "feedback": "Yes, and tell two fires straight after: real couriers do not collect fees through a link in a text. Scams usually trip more than one tell at once."
   },
   {
    "text": "No tell, small fees like £1.45 are normal",
    "correct": false,
    "feedback": "The tiny fee is the disguise. It is not there to earn £1.45, it is there to collect the card details you type on the fake payment page."
   },
   {
    "text": "Tell three, it is too good to be true",
    "correct": false,
    "feedback": "Nothing is being given away here, so tell three stays quiet. The rush and the odd request are doing the work in this one."
   }
  ],
  "script": "This formalises evidence item one. The gold is in the £1.45 point: the fee is bait, the real prize is your card details on the fake payment page. Make sure that lands even if the whole class answers correctly.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item two",
  "platform": "message",
  "handle": "SkinDrops Official",
  "avatar": "🎁",
  "meta": "Message request · Not in your contacts",
  "text": "CONGRATS! 🎉 Your account has been randomly selected for 5,000 free VBucks and the rare Renegade bundle. Offer expires in 30 minutes. Verify you own the account by logging in here: freeskins.claimzone.gg",
  "image": "🎮",
  "prompt": "Thirty seconds with your partner: how many tells fire, and what does this message actually want?",
  "script": "Pair talk, thirty seconds. All three tells fire: a 30 minute countdown, a login demand, and free loot from a draw you never entered. Then the question that matters: what does it actually want? Not to give you skins. It wants your login typed onto that fake page. If anyone asks how the scammer knew their account, they did not, this exact message went to fifty thousand accounts and it only needs a handful to bite.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "💰",
  "heading": "Why your gaming account is worth stealing",
  "body": "A gaming account is not just progress, it is property. Rare skins resell for real money, a saved card can be quietly drained, and a levelled account sells on shady markets for more than you would guess. But the biggest prize is trust: a stolen account can message every one of your friends with the same scam, and they will believe it because it comes from you. That is why teenagers are targets. Not despite your age, but because of what you own and who trusts your name.",
  "script": "This is the slide that changes the room. Most pupils think they own nothing worth stealing, so list it: skins with resale value, a saved card, and a friends list that trusts them. Ask: if a thief got into your account right now, what could they actually take? Let three or four pupils answer. The friends list answer is the one to celebrate, because the account is not just loot, it is a launchpad.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "The free skins message says log in here to verify you own the account. What does it actually want?",
  "options": [
   {
    "text": "Your username and password, typed by you onto a copied login page",
    "correct": true,
    "feedback": "Exactly. Nothing is being verified and no skins exist. The page is a costume, and your login is the prize."
   },
   {
    "text": "To check you are the real owner before sending the reward",
    "correct": false,
    "feedback": "Real platforms already know you own your account. They never need you to prove it through a random link. The verify story is the costume."
   },
   {
    "text": "Just your gamertag, which is public anyway",
    "correct": false,
    "feedback": "If it only wanted public information it would not need a login page. The page exists to capture what you type into it."
   }
  ],
  "script": "Quick check, hands or devices. The word to spotlight is verify: scammers borrow official sounding words to dress the trap. Then hand the class the rule of thumb: if a message sends you somewhere to log in, do not use its link. Go to the real app or site yourself and check there.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "pairs",
  "seconds": 60,
  "prompt": "Which of the three tells would most likely catch YOU out, and on which app would it arrive?",
  "lookFor": "Honesty and specificity. The rush tell catches most people because deadlines create panic. Naming your weak tell and your risky app is the first step to guarding both.",
  "script": "Sixty seconds, partner talk, start the timer on screen. You want honesty, not right answers. After the chime take three answers, then admit your own weak tell. Most adults fold to the rush one, say so out loud, it buys the room permission to be honest."
 },
 {
  "type": "scenario",
  "label": "Evidence item three",
  "platform": "message",
  "handle": "Marcus 📈",
  "avatar": "🤑",
  "meta": "Message request · 2 mutual followers",
  "text": "yo 👋 not gonna lie this changed my life, turned £50 into £500 in ONE day with my mentor's trading group. he only takes 5 new people a week so reply quick if you want in 🚀 proof in my story",
  "image": "💸",
  "prompt": "This one is smoother: no login link, no fake company. Which tells still fire?",
  "script": "Let them work it. Tell three fires loudest: nobody turns £50 into £500 in a day and shares the secret with strangers. Tell one is quieter but present: only 5 spots, reply quick. Tell two arrives one step later in this scam, send £50 to start, then more to unlock your profits, and you never see a penny back. Point at the 2 mutual followers detail: these accounts are often stolen, which is exactly where we are going next.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🎯",
  "heading": "Why scammers aim at teenagers",
  "body": "Ask most teenagers who falls for scams and they say old people. Scammers know you believe that, and it is the most useful thing about you, because a person who is sure they cannot be caught does not check. Add accounts worth real money, less experience of how genuine money offers work, and the shame that keeps victims quiet, and you are not the exception to scams, you are a market. This is not an insult, it is a briefing. Thieves study you, so we study them back.",
  "script": "Deliver this one straight, no jokes. Return to the hands from the start of the lesson: hardly anyone thought a scam could catch them, and that belief is exactly the unlocked door. Then take shame head on: people who get scammed almost never tell anyone, and that silence protects the scammer, not the victim. Say it plainly: if a scam ever catches you, or already has, telling someone is the strong move, not the embarrassing one, and you would be nowhere near the first or the last.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "Anatomy of an account theft",
  "caption": "The three tells break this chain at step one, before the thief gets anything at all.",
  "steps": [
   {
    "emoji": "🎣",
    "title": "The bait",
    "text": "Free skins, a prize, a panic message. Built to make you act fast."
   },
   {
    "emoji": "🔑",
    "title": "The steal",
    "text": "You type your login on a copied page. The thief now holds the keys."
   },
   {
    "emoji": "🔒",
    "title": "The lockout",
    "text": "Password changed, recovery email swapped. Minutes later it is not your account."
   },
   {
    "emoji": "📤",
    "title": "The spread",
    "text": "Your account sends the same bait to every friend, wearing your name."
   }
  ],
  "script": "Walk the chain as it builds, then ask where it is weakest. Step one, always step one, because it is the only step where the thief needs YOUR cooperation. Everything after the steal happens without you. Then close the loop from evidence item three: this is why a scam can arrive from a mate's account. The mate got caught at step two, and the thief is now at step four wearing their face. Checks catch lies, tells catch thieves, and both protect your mates as much as you.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 3,
  "mode": "groups",
  "seconds": 90,
  "prompt": "A scam lands from your best mate's account. What do you do in the next five minutes, for you and for them?",
  "lookFor": "Do not tap the link. Verify by a different route, call them or ask face to face. Warn them their account may be stolen, report the account in the app, and tell an adult if money or logins were shared. Nobody blames the mate.",
  "script": "Groups of three or four, ninety seconds on the timer. Collect one plan per group. The best plans have two halves: protect yourself, so nobody touches the link, and rescue the mate, reach them another way and tell them their account is compromised. Praise any group that says report the account in the app, and any group that insists the mate did nothing shameful."
 },
 {
  "type": "tryit",
  "heading": "Scam spotter casework, on paper",
  "body": "Six items on the worksheet: texts, DMs and offers. Some are scams, some are genuine. Run the three tells on each and give a verdict: looks genuine, verify first, or scam. Name the tell that fired for every verdict. You have fifteen minutes, and a verdict without a reason does not count.",
  "script": "Hand out the worksheet. Fifteen minutes, bookmark strips with the three tells on tables for anyone who wants them. Support group works items one to three with you, saying each tell out loud before the verdict. Stretch question for early finishers: pick one scam item and rewrite it so it would catch even a careful person, then name which tell it still cannot hide. Circulate and collect one sharp reason to read out.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check. A message from a friend's account says: this trading app doubled my money in a day, join with my link before the spots run out. What do you now know that most people do not?",
  "options": [
   {
    "text": "The friend's account may be stolen, and the tells apply no matter who sends a message",
    "correct": true,
    "feedback": "Right. Rush plus too good to be true fires whoever the sender is, and a stolen account wears a friend's name. Verify with the friend by a different route before anything else."
   },
   {
    "text": "Friends do not scam friends, so it is safe to try",
    "correct": false,
    "feedback": "Your friend probably is not scamming you. A thief using their stolen account is. The tells judge the message, not the name above it."
   },
   {
    "text": "Trading apps are all scams, so block your friend",
    "correct": false,
    "feedback": "Real trading apps exist, and your friend needs help, not blocking. The tells flag THIS message: rushed, too good to be true, and possibly not from your friend at all."
   }
  ],
  "script": "First of two exit checks, done silently and alone, these two are the printed quiz. This mirrors evidence item three plus the theft chain, so a wrong answer tells you exactly what to reteach and who to mark as working towards on the register.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check. True or false: scams mostly catch old people, so teenagers do not really need to worry.",
  "options": [
   {
    "text": "False. Scammers target teenagers precisely because teenagers believe this, and their accounts are worth real money",
    "correct": true,
    "feedback": "Exactly. The belief that you cannot be caught is the unlocked door. Your accounts have value, your friends trust your name, and thieves know both."
   },
   {
    "text": "True. Older people fall for scams far more, and teenagers are too sharp online",
    "correct": false,
    "feedback": "Being quick with tech is not the same protection as checking. Confidence without the tells is exactly the profile a scammer hunts for."
   }
  ],
  "script": "Second exit check. This is the belief the whole lesson was built to break, so the results here are your evidence that it landed. Collect both answers in as the printed exit quiz.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Vix",
  "text": "It rushes me. It wants something odd. It is too good to be true. Three tells, and nobody empties a fox's pockets.",
  "script": "Whole class says it together, twice, louder the second time. This is the sentence you want quoted at home tonight when the next parcel text lands on a parent's phone.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "Scams beat attention, not intelligence. Anyone can be caught on a rushed day, which is why we check instead of trusting our own sharpness.",
   "The three tells: it rushes you, it wants something odd like codes gift cards or a login, and it is too good to be true.",
   "Your gaming account is property: skins, saved cards and a friends list that trusts your name. That makes you a target, not an exception.",
   "A scam from a friend's account is still a scam. Verify by a different route. Checks catch lies, tells catch thieves."
  ],
  "script": "Return to the hands from the start of the lesson: who thought a scam could catch them? Ask it again now and let the room notice what changed. Then the recap read by pupils, one point each.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi closes the case",
  "lines": [
   "Case closed, detectives! ⭐",
   "Last lesson gave you three checks for lies. Vix just gave you three tells for thieves: it rushes you, it wants something odd, it is too good to be true.",
   "Your mission this week: the next time any message rushes you, stop, name the tell out loud, and verify by a different route before you tap anything.",
   "Scammers are counting on you never having this lesson. You just had it. See you next time!"
  ],
  "script": "Let DiGi land the ending, the bubbles appear on their own. Exit quizzes are collected in as this plays, they are your evidence for the register. One last line to say over it: if any message this week catches you or nearly does, telling someone is the strong move, and I want to hear about it.",
  "phase": "close",
  "minutes": 2
 }
]$m13$::jsonb,
  '[]'::jsonb,
  $m13${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m13$::jsonb,
  $m13${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned the three tells that expose a scam: it rushes you, it wants something odd like codes gift cards or a login, and it is too good to be true. We practised on the scams actually aimed at teenagers, fake free skins messages, phishing delivery texts and get rich quick DMs.",
 "try_this": "Next time a suspicious text lands on your phone, hand it over and ask your child to name which tell fires. Being the family scam detector is a job they will take seriously.",
 "family_question": "What is the closest a scam has ever come to catching someone in this family?",
 "no_login_required": true
}$m13$::jsonb,
  $m13${
 "learning_objective": "Pupils can spot and name a scam's three tells, it rushes you, it wants something odd, and it is too good to be true, and give a calibrated verdict with a reason.",
 "timing": "60 minutes: starter 8, cycle one 10, cycle two 8, cycle three 10, practise 15, prove 4, close 5",
 "misconceptions": [
  "Scams only catch old people (scammers deliberately target teenagers because this belief lowers their guard, and gaming accounts hold real value)",
  "I am good with tech so I would never fall for one (scams beat attention, not intelligence, and confidence without checking is the exact profile thieves hunt)",
  "A message from a friend's account is safe (a stolen account sends the same bait to every contact, so the tells judge the message, never the sender's name)"
 ],
 "differentiation": {
  "support": "Bookmark strips with the three tells stay on tables all lesson. The support group works worksheet items one to three with the teacher, saying each tell out loud before giving a verdict.",
  "stretch": "Early finishers redesign one scam item so it would catch even a careful person, then explain which tell it still cannot hide. Deeper stretch: why does the shame of being scammed protect the scammer, and what would change if victims talked?"
 },
 "paper_fallback": "The whole lesson runs from the printed pack: the three evidence items are read aloud as scripts or acted in pairs, the three tells live on the bookmark strip, discussions run against a wall clock, and the worksheet plus the two exit questions are print first already. No screen needed at any point.",
 "keywords": [
  {
   "word": "scam",
   "definition": "A trick built to take your money, your codes or your account by making you act before you think."
  },
  {
   "word": "phishing",
   "definition": "A fake message or login page dressed up as a real one, fishing for your password or card details."
  },
  {
   "word": "account theft",
   "definition": "Stealing a whole account, locking the owner out, then selling it or using it to scam their friends."
  },
  {
   "word": "tell",
   "definition": "The small giveaway a trick cannot hide. Scams have three, and this module teaches all of them."
  }
 ],
 "tool": {
  "heading": "The three tells",
  "lines": [
   "It rushes you",
   "It wants something odd",
   "It is too good to be true"
  ],
  "strapline": "Any one tell means pause. Two or more means scam."
 },
 "worksheet": {
  "title": "Scam spotter casework",
  "directions": "Run the three tells on each item, give your verdict, and name the tell that fired.",
  "verdict_options": [
   "Looks genuine",
   "Verify first",
   "Scam"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "Text from an unknown number: Royal Mail could not deliver your parcel. Pay the £1.25 redelivery fee within 24 hours at royalmailfees.info or your item will be returned.",
   "expected_verdict": "Scam",
   "teaching_point": "Rush plus an odd payment route. Real couriers do not collect fees through a link in a text, and the tiny fee exists to harvest card details."
  },
  {
   "n": 2,
   "item": "DM from an account you do not follow: CONGRATS! You have won 10,000 free VBucks. Log in here within 30 minutes to claim your reward.",
   "expected_verdict": "Scam",
   "teaching_point": "All three tells fire at once: a countdown, a login demand, and free loot from a draw you never entered."
  },
  {
   "n": 3,
   "item": "A notification inside your banking app, which you opened yourself from your home screen, asks you to update the app through the official app store. No deadline, no link in a message.",
   "expected_verdict": "Looks genuine",
   "teaching_point": "No tell fires: nothing rushes you, nothing odd is requested, nothing is being given away. Not everything is a scam, and saying so is what calibrated judgement means."
  },
  {
   "n": 4,
   "item": "A message from your best friend's account: bro this app doubled my money in one day, sign up with my link quick before the spots run out.",
   "expected_verdict": "Verify first",
   "teaching_point": "Rush and too good to be true both fire, and the account may be stolen. Check with the friend by a different route, in person or by calling, before touching anything."
  },
  {
   "n": 5,
   "item": "A streamer you follow, posting on their verified account, runs a giveaway: follow and comment to enter, winners picked on Friday. No login, no fee, no countdown pressure.",
   "expected_verdict": "Looks genuine",
   "teaching_point": "Real giveaways want a follow. Fake ones want a fee, a code or a login. The tells separate the two, generosity is not automatically a trick."
  },
  {
   "n": 6,
   "item": "Teo shows you a DM: a trading mentor turned £50 into £500 in one day and has 2 spots left this week. Teo says it must be legit because the sender has mutual followers. Do you agree? Explain your reasoning using the three tells.",
   "expected_verdict": "Scam",
   "teaching_point": "Mutual followers are not a credential, stolen accounts have them too. Rush and too good to be true both fire, and the odd request, sending money to unlock your profits, arrives one step later."
  }
 ],
 "commitment_stem": "My commitment: the next time a message rushes me, I will..."
}$m13$::jsonb,
  $m13${
 "required": false
}$m13$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 14: Bodies, image and pressure online
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks3-14-bodies-image-pressure', 'Bodies, image and pressure online', 'KS3', 'Years 7 to 9', 'teacher',
  '{1,6}'::int[], ARRAY['RSHE 2026 (body image, pornography)']::text[], '{}'::text[],
  'Children’s Commissioner pornography exposure data', 'I can name one way images online are made to make me feel worse.', 'DiGi carries the calm register', 14,
  $m14$[
 {
  "type": "title",
  "eyebrow": "KS3 · Years 7 to 9 · Module 14",
  "title": "Bodies, image and pressure online",
  "body": "One hour, one skill: seeing how images are built to make you feel worse, and refusing to carry that feeling as if it were yours.",
  "script": "Settle everyone with this slide up and keep your register calm from the first word. This is a sensitive lesson, so set the tone now: today we are looking at how images online are made, and why so many of them leave people feeling worse. Nobody will be asked to share anything personal, and nobody is in trouble for anything they have seen. If anything in this lesson brings something up for a pupil, they can talk to you or any trusted adult afterwards. Say that plainly before you move on.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can name one way images online are made to make me feel worse.",
  "why": "Most of the bodies you see online are built: chosen angles, careful lighting, editing, and hundreds of takes you never see. Feeling worse after scrolling is not an accident and it is not a flaw in you, it is often the product working exactly as designed.",
  "gains": [
   "Spot the choices behind a polished image: angles, lighting, retouching, selection",
   "Explain why feeds full of perfect bodies sit right next to adverts",
   "Run the image check on anything that makes you feel worse about yourself",
   "Know that made content, including pornography, is not a guide to real bodies or real relationships"
  ],
  "script": "Read the outcome and the why aloud, slowly. Then say: notice what today is not. It is not a lesson telling you what to think about your own body. It is a lesson about how images are manufactured and who benefits when you feel worse. Keep it about the images and the money, not about any pupil in the room.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Words for today",
  "words": [
   {
    "word": "retouching",
    "meaning": "Changing an image after it is taken: smoothing skin, reshaping bodies, brightening eyes. Most polished images are retouched and it is usually invisible."
   },
   {
    "word": "idealised",
    "meaning": "Presented as perfect. An idealised body is built from angles, lighting, editing and selection, not from everyday life."
   },
   {
    "word": "comparison",
    "meaning": "Measuring yourself against someone else. Online you compare your ordinary day with someone else's edited highlight, which is not a fair contest."
   },
   {
    "word": "insecurity",
    "meaning": "The feeling of not being good enough as you are. Online that feeling can be manufactured on purpose, because insecure people scroll longer and buy more."
   }
  ],
  "script": "Say each word, class repeats it back once, no theatrics. Land the last one hardest: insecurity is not just a feeling people happen to have, it is something parts of the internet are built to produce. That idea carries the whole lesson.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Warm up from last lesson. A message says you have won a new phone, but only if you click the link in the next ten minutes. Which of the scam's three tells is loudest here?",
  "options": [
   {
    "text": "The pressure to act fast",
    "correct": true,
    "feedback": "Yes. Real offers survive ten minutes of thinking. Pressure to act fast exists for one reason: to stop you checking."
   },
   {
    "text": "Nothing, companies do give phones away",
    "correct": false,
    "feedback": "A prize too big to question is itself one of the tells. Big prize plus countdown plus a link is the full pattern."
   },
   {
    "text": "The spelling mistakes",
    "correct": false,
    "feedback": "Spelling can be a hint but it is not one of the three tells, and plenty of scams are written perfectly. The countdown is the tell doing the work here."
   }
  ],
  "script": "Retrieval from last lesson, thirty seconds of silent thinking before hands. Cold call two pupils for reasoning, not letters. Then bridge to today: scams pressure your wallet directly. Today we look at something quieter that pressures how you feel about your own body, and the same detective habits catch it.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "feed",
  "handle": "morning.routine.max",
  "avatar": "💪",
  "meta": "5h · Paid partnership",
  "text": "Day 47. No excuses. This is what discipline looks like. If your body does not look like this yet, you are simply not working hard enough. Full plan in bio 👇",
  "image": "🏋️",
  "stats": "❤ 214K   ↻ 31.5K   💬 9.8K",
  "prompt": "Look at the caption, not the body. What is this post telling you about yourself, and what is it asking you to do about it?",
  "script": "Give the class thirty seconds to read it properly. Take a few answers. The move you are looking for: the post says your body is a failure of effort, and the answer to that failure is in the bio, for sale. Do not moralise about fitness itself, training is fine. The issue is a stranger profiting from the feeling that you are not enough. Keep answers about the post, not about anyone's body in the room.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🎬",
  "heading": "Every polished image is a set of choices",
  "body": "Before a body reaches your feed it has usually been through a production line. The angle was chosen from dozens. The lighting was set to sculpt. The best frame was picked from hundreds of takes. Then retouching smoothed and reshaped what the camera caught. None of this is rare or shocking, it is simply how the industry works. But it means you are comparing your unedited life with someone else's finished product.",
  "script": "Deliver this as calm fact, not scandal. Useful line: the person in the photo often does not look like the photo. Professional models have said exactly that about their own images. Ask the class: if the person in the picture cannot match the picture, what chance does anyone scrolling past it have? Let that question hang, do not rush to answer it.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "A post shows a flawless body in perfect morning light. What do you actually know from looking at it?",
  "options": [
   {
    "text": "What they chose to show you, and nothing more",
    "correct": true,
    "feedback": "Right. You know the output of a production line: angle, lighting, best take, retouching. You do not know what any of it looks like off camera."
   },
   {
    "text": "That the person naturally looks like that",
    "correct": false,
    "feedback": "You cannot know that from the image. Retouching is invisible by design, and even the unedited takes were the best of hundreds."
   },
   {
    "text": "That they are more disciplined than you",
    "correct": false,
    "feedback": "That is the caption talking, not the evidence. A photo proves a moment was captured, it proves nothing about your effort or worth."
   }
  ],
  "script": "Quick whole class check, hands or devices. If pupils pick the third option, treat it gently, that answer shows the post is working on them, which is exactly the lesson. Name it without singling anyone out: that pull to measure yourself is the designed effect, not a personal weakness.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The economics of insecurity",
  "caption": "Feeling worse is not a side effect. For part of the internet, it is the business plan.",
  "steps": [
   {
    "emoji": "😔",
    "title": "You feel worse",
    "text": "An idealised image lands and the gap between it and your mirror opens up."
   },
   {
    "emoji": "📱",
    "title": "You scroll longer",
    "text": "Unsettled people keep scrolling, looking for something to close the gap. The feed learns what holds you."
   },
   {
    "emoji": "🛒",
    "title": "The fix appears",
    "text": "A plan, a product, a serum, a filter. Right on time, because your feelings were the targeting data."
   },
   {
    "emoji": "🔁",
    "title": "The fix never finishes",
    "text": "If the product truly closed the gap, you would stop buying. The gap is the business, so the gap stays open."
   }
  ],
  "script": "Walk the loop as it builds, one step at a time. At step three, pause and ask: who has noticed an advert that seemed to know exactly how they were feeling? No stories needed, just hands. At step four, land the core insight of the lesson: a cure that worked would end the customer. The system needs you not quite fixed. Said calmly, that lands harder than any outrage.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "scenario",
  "label": "Evidence item two",
  "platform": "feed",
  "handle": "GlowFix Skin",
  "avatar": "✨",
  "meta": "Sponsored · Shown to you because of your activity",
  "text": "Struggling with how your skin looks in photos? You are not alone. Our 30 day reset clears what nature could not. Half price ends tonight.",
  "image": "🧴",
  "stats": "❤ 96.4K   ↻ 12.1K   💬 5.2K",
  "prompt": "Read the small print in the meta line. Where in the loop from the last slide does this advert sit, and what did it need you to feel first?",
  "script": "Point at the meta line first: shown to you because of your activity. Ask what activity would teach a feed to show someone this advert. Answer: lingering on idealised images, searching about skin, even just slowing your scroll. The advert is step three of the loop, and it only works if steps one and two already happened. Notice the countdown too, the same pressure tell from the scam lesson, now selling insecurity instead of a fake prize.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "pairs",
  "seconds": 60,
  "prompt": "Think of a place online where content that makes people feel not good enough sits right next to something for sale. Coincidence or design?",
  "lookFor": "Design. Fitness content beside supplement adverts, beauty content beside skincare and filters, transformation posts beside paid plans. Pupils do not need personal stories, patterns they have noticed are enough.",
  "script": "Sixty seconds, partner talk, timer on screen. Steer pupils towards patterns rather than confessions, the prompt is about what they have noticed, not how they feel. Take two or three answers after the chime. If a pupil shares something that sounds personal or distressed, thank them warmly, move on without probing, and follow up privately after the lesson in line with your school safeguarding policy."
 },
 {
  "type": "choice",
  "question": "You feel worse about yourself after ten minutes of scrolling perfect bodies. In the attention economy, what is that feeling?",
  "options": [
   {
    "text": "A product working as designed",
    "correct": true,
    "feedback": "Yes. That feeling keeps you scrolling and primes you to buy. It was manufactured with the same care as the images themselves."
   },
   {
    "text": "A sign something is wrong with you",
    "correct": false,
    "feedback": "No. Almost everyone feels it, because it is engineered. Blaming yourself for a designed effect is like blaming yourself for feeling hungry in a bakery."
   },
   {
    "text": "Proof you should train harder",
    "correct": false,
    "feedback": "Effort is fine, but this feeling is not honest feedback about your body. It is the gap between your real life and a production line, and no amount of training closes a gap that is kept open on purpose."
   }
  ],
  "script": "This is the emotional centre of the lesson, so give the feedback lines time to breathe. The bakery line usually gets a small laugh of recognition, allow it and move on, do not build on it. The point to leave in the air: the feeling is real, but the cause is outside you.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🛡️",
  "heading": "Some made content distorts more than others",
  "body": "One more kind of made content needs naming, calmly and briefly: pornography. Some people your age have seen it, on purpose or by accident, and if that includes you, you are not unusual and you are not in trouble. What matters is this: it is produced content, performed, directed and edited like everything else we have looked at today, only more so. It is not a guide to what real bodies look like, and it is not a guide to what real relationships or real intimacy are like. If anything you have seen online sits heavily with you, that is worth saying out loud to a trusted adult, a parent, a teacher, or any adult in school you trust.",
  "script": "Read this slide almost word for word and keep your tone level, the same voice you used for retouching. Do not ask for hands, do not invite stories, do not ask who has seen what, and close down any pupil who starts to share specifics in front of the class, kindly: that sounds like something worth talking about properly, come and find me after. Do not describe any content yourself. If a pupil discloses exposure or distress, during or after the lesson, follow your school safeguarding policy and speak to your DSL, and reassure them first that they are not in trouble. Nothing said in this lesson is recorded by the platform, so your own note to the DSL is the record. Then move to the next slide without lingering, the calm brevity is the message.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "stat",
  "phase": "teach",
  "minutes": 2,
  "figure": "13",
  "claim": "In a large survey of young people in England, the average age of first seeing online pornography was thirteen. Many saw it younger, and most did not go looking for it the first time.",
  "source": "Children's Commissioner for England, young people and pornography report, 2023",
  "script": "Let the number sit for a moment, then say why it is on the screen: not to alarm anyone, but so that anyone in this room it applies to knows they are ordinary, not broken and not in trouble. Then repeat the single protective fact one more time: it is made content, and it does not show what real bodies or real relationships are like. Do not take questions on this slide, offer them privately instead, then move on."
 },
 {
  "type": "concept",
  "emoji": "🌱",
  "heading": "Your body is for living in",
  "body": "Here is the quiet truth the feed never sells: your body is not a picture, it is the thing you live your whole life in. It carries you to your friends, plays the sport, laughs at the joke, gets you through the hard day. A healthy self image is not believing you look perfect, it is refusing to grade yourself against a production line. And you have more control than it feels like: every account you follow is a choice, and unfollowing anything that reliably makes you feel worse is not weakness, it is curation.",
  "script": "Slow down for this one. Ask the class: what did your body actually do for you this week? Take answers, they will start small and get better, walked me up a mountain, got me through the match, hugged my nan. That list is the counterweight to the whole lesson. Then land the practical move: an unfollow is free, instant and private, and it retrains the feed. Watch for pupils who go quiet here, low mood around this topic is worth a gentle private check in later, and any disclosure of real distress goes to your DSL under your school safeguarding policy.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The image check",
  "caption": "Three questions, ten seconds, any image that makes you feel worse.",
  "steps": [
   {
    "emoji": "🖼️",
    "title": "Who edited this?",
    "text": "Angles, lighting, retouching, the best of hundreds of takes. If it is polished, choices were made."
   },
   {
    "emoji": "💷",
    "title": "Who profits from me feeling worse?",
    "text": "Follow the feeling to the money. A plan, a product, a platform holding your attention."
   },
   {
    "emoji": "💬",
    "title": "What would I tell my best friend?",
    "text": "You would never grade your best friend against an edited stranger. Give yourself the same voice."
   }
  ],
  "verdicts": [
   "Edited and selling",
   "Pressure to compare",
   "Honest post"
  ],
  "script": "This is the tool of the module, walk it slowly as it builds. Have the class say the three questions back together, once, at speaking volume, this is a chant for the head not a cheer. Then point at the three verdicts: every image you check today ends in one of these. Edited and selling means the image is polished and the profit trail is visible. Pressure to compare means it is idealised and spreading comparison even with nothing for sale. Honest post means real life allowed to look like real life. Pause is always allowed while you decide.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 3,
  "mode": "groups",
  "seconds": 90,
  "prompt": "A close friend tells you they hate how they look after an hour of scrolling. Using the third question of the image check, what do you actually say to them?",
  "lookFor": "Warmth first, then the mechanism: you are comparing your real life with edited products, the feeling was manufactured, and the accounts doing it can be unfollowed. The best answers turn the kindness pupils naturally have for a friend back towards themselves.",
  "script": "Groups of three or four, ninety seconds on the timer. This is rehearsal for a conversation most of them will really have. Collect one answer per group and praise specificity: not just cheer up, but you are measuring yourself against a production line. Close by naming the quiet trick of the whole lesson: the words you just found for your friend are true about you too. If any pupil's contribution suggests they are describing themselves and struggling, follow up privately afterwards and use your school safeguarding policy if needed."
 },
 {
  "type": "tryit",
  "heading": "The image check, on paper",
  "body": "Your teacher has six items on the worksheet: posts, adverts and captions described in words. Run the image check on each one and give a verdict: edited and selling, pressure to compare, or honest post. You have fifteen minutes. Every verdict needs a reason from one of the three questions, a verdict without a reason does not count.",
  "script": "Hand out the worksheet, bookmark strips on tables for anyone who wants the three questions in front of them. Support group works items one to three with you. Stretch question for early finishers: pick one item and trace exactly who earns money at each step. Circulate and collect one strong reason to read out. Stay alert as you move around the room: written answers on this topic occasionally carry a personal note, a pupil writing about their own body or their own distress rather than the scenario. Treat anything like that as a possible disclosure, speak to the pupil privately, reassure them they are not in trouble, and follow your school safeguarding policy. The worksheets are paper and nothing is stored by the platform, so what you collect is the record.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check. A fitness post looks completely flawless. Which of these is a real way that image was likely made to affect how you feel?",
  "options": [
   {
    "text": "Chosen angles, lighting and retouching, picked from many takes, so your real life loses the comparison",
    "correct": true,
    "feedback": "Right. The image is a finished product and you are comparing it with your unedited day. That gap is built, and it is built to be felt."
   },
   {
    "text": "Cameras cannot lie, so no method was needed",
    "correct": false,
    "feedback": "Cameras capture a moment, but the moment was staged, selected and then edited. The lying happens before and after the click."
   },
   {
    "text": "It affects you because the person is simply better than you",
    "correct": false,
    "feedback": "The person often does not look like their own photo. You are not losing to a person, you are losing to a production line, and that is a contest nobody should enter."
   }
  ],
  "script": "First of two exit checks, worked alone in silence, this pair is the printed exit quiz. It tests the outcome directly: naming one way images are made to make you feel worse. A wrong answer here tells you who to revisit the production line idea with.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "True or false: if scrolling makes you feel worse about your body, that means something is wrong with you.",
  "options": [
   {
    "text": "False. The feeling is manufactured, because people who feel worse scroll longer and buy more",
    "correct": true,
    "feedback": "Exactly. The feeling is real but the cause is outside you. Naming the machine is the first step to switching it off: check the image, follow the money, and talk to yourself like your best friend would."
   },
   {
    "text": "True. Confident people are not affected by images",
    "correct": false,
    "feedback": "Even the people in the images are affected by the images. This is engineering, not a confidence test, and nobody is immune by personality."
   }
  ],
  "script": "Second exit check, still silent and alone. This is the one that matters most for wellbeing, because it tests whether pupils have stopped blaming themselves. Collect both answers on the printed exit quiz as your evidence for the register.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like DiGi",
  "text": "Who edited this? Who profits from me feeling worse? What would I tell my best friend? My worth was never in the picture.",
  "script": "Whole class says it together once, calm and steady, this chant is spoken not shouted. The last line is the one to underline: my worth was never in the picture. It means both things at once, and pupils usually spot that themselves. Let them.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "Polished images are products: angles, lighting, retouching and the best of hundreds of takes.",
   "Feeling worse after scrolling is often the business model working, not a flaw in you.",
   "Made content, including pornography, is performed and edited. It is not a guide to real bodies or real relationships.",
   "The image check: who edited this, who profits from me feeling worse, what would I tell my best friend?"
  ],
  "script": "Four pupils read one point each. After the third point, add the standing offer one final time, plainly: if anything from today, or anything you have seen online, is sitting heavily with you, come and talk to me or any trusted adult. You will not be in trouble. Then the last point, and on to DiGi.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi closes the case",
  "lines": [
   "Here is the truth of today, quietly. ⭐",
   "Every flawless image you will ever scroll past was a set of choices: angles, lighting, editing, and the takes you never see. You were comparing your real life with a product.",
   "So when a picture makes you feel smaller, run the check: who edited this, who profits from me feeling worse, and what would I tell my best friend?",
   "And if something you have seen online sits heavy, tell a trusted adult. You are not in trouble, and you were never meant to carry it alone. See you next lesson."
  ],
  "script": "Let DiGi land the ending, the lines appear on their own, do not talk over them. Exit quizzes are collected as this plays. Stay visible by the door as pupils leave, this is the moment a pupil who wants a quiet word will take, and any disclosure follows your school safeguarding policy with your DSL. The platform records nothing, so your note is the record.",
  "phase": "close",
  "minutes": 2
 }
]$m14$::jsonb,
  '[]'::jsonb,
  $m14${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m14$::jsonb,
  $m14${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today we looked at how bodies online are manufactured: angles, lighting, retouching, and the business reason feeds full of perfect images sit next to adverts, because feeling worse makes people scroll and buy. We also acknowledged calmly, briefly and without any detail that pornography exists and distorts what real bodies and relationships look like, and we pointed every pupil towards trusted adults.",
 "try_this": "Scroll a feed together for two minutes and each pick one image to run the check on: who edited this, who profits from me feeling worse, and what would I tell my best friend?",
 "family_question": "Is there an account that reliably makes you feel worse after you look at it, and what would happen if you unfollowed it?",
 "no_login_required": true
}$m14$::jsonb,
  $m14${
 "learning_objective": "Pupils can name at least one way images online are manufactured to make them feel worse, explain why insecurity is profitable, and apply the image check to real content.",
 "timing": "60 minutes: starter 8, cycle one 6, cycle two 9, cycle three 13, practise 15, prove 4, close 5",
 "misconceptions": [
  "You can tell when a photo has been edited (most retouching is invisible by design, so the safe assumption for any polished image is that choices were made)",
  "Feeling worse after scrolling means something is wrong with you (the feeling is engineered because insecure people scroll longer and buy more, the cause is outside the pupil)",
  "Naming pornography in class encourages pupils to seek it out (a calm, brief, non graphic acknowledgement that it distorts real bodies and relationships is protective and sits on statutory RSHE ground, silence leaves the distortion unchallenged)"
 ],
 "differentiation": {
  "support": "Bookmark strip with the three questions on the table throughout. Work worksheet items one to three together with the support group, using the sentence starter: this image was made to make me feel worse by...",
  "stretch": "For any worksheet item, trace the full money trail: who earns at every step from the image being posted to a product being bought. Then design the caption for a genuinely honest post and explain what makes it honest."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Read the two evidence items aloud as court exhibits, draw the four step insecurity loop on the board as you narrate it, and put the three questions of the image check up as a poster. The pornography slide is delivered verbally from the script, word for word, with nothing written on the board. Discussions run on a watch or phone timer, the worksheet and exit quiz are already paper.",
 "keywords": [
  {
   "word": "retouching",
   "definition": "Changing an image after it is taken: smoothing skin, reshaping bodies, brightening eyes. Most polished images are retouched and it is usually invisible."
  },
  {
   "word": "idealised",
   "definition": "Presented as perfect. An idealised body is built from angles, lighting, editing and selection, not from everyday life."
  },
  {
   "word": "comparison",
   "definition": "Measuring yourself against someone else. Online you compare your ordinary day with someone else's edited highlight, which is not a fair contest."
  },
  {
   "word": "insecurity",
   "definition": "The feeling of not being good enough as you are. Online that feeling can be manufactured on purpose, because insecure people scroll longer and buy more."
  }
 ],
 "tool": {
  "heading": "The image check",
  "lines": [
   "Who edited this?",
   "Who profits from me feeling worse?",
   "What would I tell my best friend?"
  ],
  "strapline": "Three questions, ten seconds. My worth was never in the picture."
 },
 "worksheet": {
  "title": "The image check: run it on six items",
  "directions": "Run the three questions on each item, give a verdict, and back it with a reason from one of the questions.",
  "verdict_options": [
   "Edited and selling",
   "Pressure to compare",
   "Honest post"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "A skincare advert shows a before photo and an after photo. The caption says your skin could look like this in 30 days, with a discount code that expires tonight.",
   "expected_verdict": "Edited and selling",
   "teaching_point": "The before photo is lit and chosen to look worse and the after is retouched. The countdown is the same pressure tell as a scam. The profit question answers itself."
  },
  {
   "n": 2,
   "item": "A classmate posts a photo from sports day: red faced, mid laugh, mud on their kit, no product, no link, no caption tricks.",
   "expected_verdict": "Honest post",
   "teaching_point": "Real life is allowed to look like real life. Not every post is a trap, and being able to say honest post with confidence is part of the skill."
  },
  {
   "n": 3,
   "item": "A celebrity posts a perfect morning photo captioned: no filter, just woke up like this.",
   "expected_verdict": "Pressure to compare",
   "teaching_point": "No filter is a claim, not proof. Lighting, makeup, angles and many takes are all still available, and the caption exists to make the comparison feel fair when it is not."
  },
  {
   "n": 4,
   "item": "A fitness influencer posts a dramatic transformation photo with the caption no excuses, and a link to their paid twelve week plan.",
   "expected_verdict": "Edited and selling",
   "teaching_point": "Shame is the sales pitch and the plan is the product. Question two exposes the whole post: the worse you feel, the more likely you are to click the link."
  },
  {
   "n": 5,
   "item": "A trend fills your feed where everyone films themselves measuring part of their body against a household object. Nobody is selling anything.",
   "expected_verdict": "Pressure to compare",
   "teaching_point": "Comparison spreads even with no seller in sight, because the platform profits from the attention it generates. Question two can point at a platform, not just a product."
  },
  {
   "n": 6,
   "item": "Mia says: filters are just a bit of fun, they do not change how anyone feels about themselves. Do you agree? Explain your reasoning using the image check.",
   "expected_verdict": "Pressure to compare",
   "teaching_point": "Both things can be true: filters can be fun, and repeatedly seeing an edited version of your own face can quietly move the goalposts for the real one. The check tells you when fun tips into pressure."
  }
 ],
 "commitment_stem": "My commitment: this week, when a post makes me feel worse about how I look, I will..."
}$m14$::jsonb,
  $m14${
 "required": true,
 "note": "This lesson covers body image and includes a brief, non graphic acknowledgement that some pupils will have seen pornography. Pupils may disclose body image distress, possible disordered eating, or exposure to pornography during the lesson, in written worksheet answers, or in the days afterwards. Treat any such disclosure under your school safeguarding policy and bring it to the DSL, reassuring the pupil first that they are not in trouble. This platform records no disclosures: nothing pupils say or write in this lesson is stored by Guided Childhood, so the teacher's own note and the paper worksheets are the record.",
 "concern_form_linked": true
}$m14$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 15: Manipulation and persuasion
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks4-15-manipulation-persuasion', 'Manipulation and persuasion', 'KS4', 'Years 10 to 11', 'teacher',
  '{5,6}'::int[], ARRAY['Citizenship','RSHE']::text[], '{}'::text[],
  'Attention economy research', 'I can name the technique being used on me.', 'Vix', 15,
  $m15$[
 {
  "type": "title",
  "eyebrow": "KS4 · Years 10 to 11 · Module 15",
  "title": "Manipulation and persuasion",
  "body": "One hour on the techniques built to move you. Name them, and most of their power disappears.",
  "script": "Settle everyone with this slide up. Open straight: you are in the most targeted demographic on earth. Billions of pounds a year are spent working out how to make people your age feel something and then act on it. This hour is not a warning to be scared of your phone. It is a tour of the machinery, run by the people it was built to work on.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can name the technique being used on me.",
  "why": "Every screen you use is designed by professionals whose job is to shape what you do next, and they are extremely good at it. But manipulation depends on staying invisible, so the moment you can name the technique out loud, most of its power is gone.",
  "gains": [
   "Spot the four big dark patterns: fake urgency, confirm shaming, roach motels and infinite scroll",
   "Explain how rage bait makes money, and why it does not need to be true",
   "See why an influencer feels like a friend, and what a discount code actually means",
   "Ask the question that unlocks all of it: who profits from this feeling?"
  ],
  "script": "Read the outcome and the why aloud. Then ask: hands up if you reckon adverts do not really work on you. Count the hands and remember the number. Tell them we will come back to that count at the end, and that the marketing industry has a name for people who feel immune. Its favourite customers.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Words for the machinery",
  "words": [
   {
    "word": "dark pattern",
    "meaning": "A design trick that pushes you into choices you did not mean to make, like fake countdowns or hidden cancel buttons."
   },
   {
    "word": "rage bait",
    "meaning": "Content built to make you furious, because furious people comment, share and stay watching. The fury is the product."
   },
   {
    "word": "parasocial",
    "meaning": "A one way relationship. You feel you know a creator personally. They do not know you exist."
   },
   {
    "word": "sponsored content",
    "meaning": "A post someone was paid to make. UK rules say it must be labelled as an ad. Hidden ones bank on your trust."
   },
   {
    "word": "FOMO",
    "meaning": "Fear of missing out. The engineered worry that everyone else has something and you are about to lose your chance."
   }
  ],
  "script": "Say each word, class repeats it. Two to stress test: parasocial, because it explains why an influencer recommendation feels like a mate texting you, and FOMO, because half of today's techniques run on it. These five words are the vocabulary of an industry that studies you for a living.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Retrieval from last module. A striking image lands in the group chat and it looks completely real. What did we learn to do before trusting it?",
  "options": [
   {
    "text": "Run the image check: who posted it, does it appear anywhere else, and what feeling is it built for",
    "correct": true,
    "feedback": "Right. Looking harder stopped working, so the image check does the work your eyes cannot. Keep that third question in your pocket, because today is entirely about the feeling something is built for."
   },
   {
    "text": "Zoom in for glitches, fakes always have visual errors",
    "correct": false,
    "feedback": "That worked years ago. The current generation of tools leaves nothing your eyes can reliably catch, which is exactly why the module taught a check instead of a squint."
   },
   {
    "text": "Trust it if the person who sent it is trustworthy",
    "correct": false,
    "feedback": "A trustworthy friend can be a fooled friend. The check runs on the image, not on who delivered it."
   }
  ],
  "script": "Thirty seconds thinking time, then cold call two pupils for reasoning, not just a letter. Land the bridge: last module was about content pretending to be real. Today is about design pretending to be neutral. Same detective, new case.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🎯",
  "heading": "You are the target market",
  "body": "None of what we look at today is accidental. Fashion brands, apps, games and creators employ designers and psychologists whose job title is roughly making you act without thinking. This is not a conspiracy, it is a business model, and it is aimed more precisely at your age group than at any other. It works on everyone, including the people who build it. Feeling immune is not protection. Naming what is happening is.",
  "script": "Deliver this straight and respectful, no scare tactics. The key sentence is the last one: feeling immune is not protection. Ask: why would a company spend millions testing which shade of red makes a buy button get pressed more? Take one answer. Because tiny nudges times millions of users equals serious money. You are about to see the nudges.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "feed",
  "handle": "trendthreads.official",
  "avatar": "🛍",
  "meta": "Sponsored · Checkout page",
  "text": "🔥 FLASH SALE ends in 09:47 ... 09:46 ... Only 3 left in stock! 🕐 14 people are viewing this item right now. Complete your order before it is gone forever. [ PAY NOW ] [ No thanks, I like missing out ]",
  "image": "👟",
  "prompt": "Look at every element on this screen. Which parts are information, and which parts are pressure? Be precise.",
  "script": "Give them thirty seconds in pairs, then collect. You want them to itemise it: the countdown, the stock counter, the viewer counter, the forever, and the decline button that insults you. Then the reveal most do not know: on many sites that countdown resets if you refresh the page, and the viewer counter can be a random number generator. Not exaggeration. Documented, regulator investigated design.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "Four dark patterns",
  "caption": "Design tricks with names. Once you know the names, you see them everywhere, which is the point.",
  "steps": [
   {
    "emoji": "⏳",
    "title": "Fake urgency",
    "text": "Countdowns that reset, stock counters that lie. Manufactured panic so you buy before you think."
   },
   {
    "emoji": "😬",
    "title": "Confirm shaming",
    "text": "The decline button mocks you. No thanks, I like missing out. Guilt doing the selling."
   },
   {
    "emoji": "🪤",
    "title": "Roach motel",
    "text": "One tap to subscribe, five buried screens and a phone call to cancel. Easy in, hard out."
   },
   {
    "emoji": "🌀",
    "title": "Infinite scroll",
    "text": "No bottom to the page, no natural stopping point. The absence of an ending is a design choice."
   }
  ],
  "script": "Walk each pattern as it builds and pin it to their real lives: fake urgency lives on shopping apps, confirm shaming on newsletter popups, roach motels on subscriptions and free trials, infinite scroll in their pocket right now. Ask: which of these four has caught you this week? Take a couple of honest answers and offer your own, it buys the room's honesty for the rest of the hour.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "A popup asks you to join a mailing list. The decline button reads: No thanks, I prefer paying full price. Which dark pattern is that?",
  "options": [
   {
    "text": "Confirm shaming",
    "correct": true,
    "feedback": "Exactly. The button is engineered so refusing feels stupid. Notice the move: it is not giving you information, it is assigning you an identity for saying no."
   },
   {
    "text": "Fake urgency",
    "correct": false,
    "feedback": "No countdown, no stock counter, no time pressure here. The pressure is guilt, and guilt on the decline button is confirm shaming."
   },
   {
    "text": "Roach motel",
    "correct": false,
    "feedback": "A roach motel is about making leaving hard after you join. This trap fires before you join, by making the no button feel like an insult to yourself."
   }
  ],
  "script": "Quick whole class check, hands or devices. In feedback, land the transferable move: dark patterns rarely lie to you outright, they just make one option feel effortless and the other feel shameful, slow or invisible. The honest question is always which choice would I make if this screen was neutral.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item two",
  "platform": "feed",
  "handle": "truthbomb.daily",
  "avatar": "💣",
  "meta": "5h · Shared 61,400 times",
  "text": "This school BANNED a student from prom over her hair and the head teacher just SMIRKED when her mum complained 😡😡 They think they can get away with this. Share before it gets taken down.",
  "image": "📸",
  "stats": "❤ 183K   ↻ 61.4K   💬 39.2K",
  "prompt": "What feeling is this post engineered to produce, and what exactly does the account want you to do with that feeling?",
  "script": "Read it with the energy it wants, then go cold and clinical. Walk the engineering: an injustice with a child in it, a smirking villain you never see, capital letters, the share before it gets taken down line manufacturing urgency on top of outrage. Then the question that matters: does this account care whether the story is true? It does not need to be. The fury works either way, and the fury is what pays.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "💰",
  "heading": "Rage is a business model",
  "body": "Anger is the highest engagement emotion there is. Angry people comment, share, argue in the replies and stay on the platform, and every one of those actions is worth money. So whole accounts exist to farm fury: they find or invent an outrage, package it for maximum blood pressure, and collect followers, ad revenue and creator fund payouts from the reaction. The story does not need to be true, and the account is not angry. You are. That was the product.",
  "script": "The sentence to land hard is the last one: the account is not angry, you are, and that was the product. Ask the class: have you ever seen the same outrage template recycled with a different school, a different restaurant, a different villain? Most have. That is not coincidence, that is a format that converts, being reused like any other ad.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "stat",
  "phase": "teach",
  "minutes": 1,
  "figure": "6x",
  "claim": "In a study of around 126,000 stories on Twitter, false stories reached 1,500 people about six times faster than true ones. The strongest fuel was surprise and anger.",
  "source": "Vosoughi, Roy and Aral, Science, 2018",
  "script": "Let the figure sit before you speak. Then: the researchers checked whether bots explained it. They did not. Humans spread the false stories faster, because false stories are built free of any obligation to be boring. Reality has constraints. Rage bait does not."
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "pairs",
  "seconds": 60,
  "prompt": "Think of the last post that made you genuinely angry. Who made money from that anger, and how?",
  "lookFor": "The creator collected engagement, followers and payouts. The platform collected watch time it sold to advertisers. Some pupils will realise the anger felt like their own reaction but was farmed. That is the insight to amplify.",
  "script": "Sixty seconds in pairs, timer on screen. After the chime take two or three answers. The move to praise is anyone who says the anger felt real but was manufactured. Confirm it: the feeling is real, that is what makes the technique work. Nobody is calling the feeling fake. We are naming who ordered it."
 },
 {
  "type": "scenario",
  "label": "Evidence item three",
  "platform": "feed",
  "handle": "mia.styles",
  "avatar": "✨",
  "meta": "2h · 1.2M followers",
  "text": "you guys kept ASKING so here it is 😍 full haul below. this serum genuinely changed my skin, I do not gatekeep from my day ones. code MIA20 gets you 20 percent off but it is selling out fast so run 🏃",
  "image": "💄",
  "stats": "❤ 214K   ↻ 8.1K   💬 19.6K",
  "prompt": "She feels like a mate sharing a find. Name every technique you can see in this one post, and say what is missing from it.",
  "script": "Give pairs a minute to hunt, then collect. There are at least four: flattery in my day ones and you kept asking, urgency in selling out fast so run, FOMO stitched through the whole thing, and parasocial trust doing the heavy lifting underneath. The missing item is the ad label. A personal discount code almost always means commission on every sale, which makes this an advert, and UK advertising rules require it to say so. It does not. That is not an oversight, that is the strategy: an ad that does not look like an ad borrows your trust without asking.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🤝",
  "heading": "Parasocial trust, and why it sells",
  "body": "You have watched her for two years. You know her flat, her dog, her bad days. Your brain files her under people I know, so her recommendation lands like a friend's, with a friend's level of trust. But the relationship only runs one way, she does not know you exist, and that trust has a market rate: brands pay creators precisely because a recommendation from a friend outsells any billboard. None of this makes her evil or you gullible. It means one question is now non optional: is this a mate sharing, or a salesperson who feels like a mate?",
  "script": "Keep this respectful, most of the class will have creators they genuinely like, and the goal is not to poison that. The goal is one clean distinction: enjoying a creator is fine, forgetting that their recommendations can be paid for is where it costs you. Ask: how would you even tell? Answers you want: the ad label, a discount code, a sudden product they never mentioned before. Then the honest kicker: the law requires the label exactly because this technique works so well without it.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "Name the technique",
  "caption": "The tool for this module. Manipulation depends on staying invisible. Named is tamed.",
  "steps": [
   {
    "emoji": "🎯",
    "title": "Notice the pull",
    "text": "A sudden urge to buy, share, rage or keep scrolling did not come from nowhere. Someone built it."
   },
   {
    "emoji": "🏷",
    "title": "Name the technique",
    "text": "Say it, out loud if you can: urgency, outrage, flattery or FOMO. Naming it moves the decision back to you."
   },
   {
    "emoji": "💷",
    "title": "Follow the money",
    "text": "Who profits from this feeling? Someone always does, and it is never you."
   }
  ],
  "verdicts": [
   "Urgency",
   "Outrage",
   "Flattery",
   "FOMO"
  ],
  "script": "Walk the three steps as they build, then drill the four names until they come back as a chant: urgency, outrage, flattery, FOMO. Make the case for why naming works: these techniques operate below the level of words, in the half second before you think. Dragging one into language forces it through the thinking part of your brain, and most of them do not survive the trip. Point at the four chips: every worksheet item today ends in one of these names.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 3,
  "mode": "groups",
  "seconds": 90,
  "prompt": "Take our three evidence items: the countdown checkout, the rage post, the haul. For each one, who profits, and from which feeling?",
  "lookFor": "Checkout: the retailer profits from panic. Rage post: the account and the platform profit from fury. Haul: the influencer and the brand profit from trust and FOMO. Strongest groups notice the pattern: in every case the feeling is the mechanism and the money flows away from the person feeling it.",
  "script": "Groups of three or four, ninety seconds on the timer, one scribe per group. Collect one answer per group and build the pattern on the board as they report: feeling on the left, who profits on the right. The takeaway to say plainly: follow the money is not cynicism, it is literacy. When you know who profits from a feeling, you know why the feeling was ordered."
 },
 {
  "type": "choice",
  "question": "Quick fire. A hotel booking site shows: Only 2 rooms left at this price! In high demand, booked 7 times today. Name the technique.",
  "options": [
   {
    "text": "Urgency",
    "correct": true,
    "feedback": "Named. Scarcity counters are urgency wearing a calculator. Real availability is information, but numbers chosen to spike your pulse are pressure, and regulators have caught sites inventing them."
   },
   {
    "text": "Flattery",
    "correct": false,
    "feedback": "Nobody is complimenting you here. The technique is manufactured scarcity, which is urgency. Flattery would be telling you that smart travellers like you book fast."
   },
   {
    "text": "Outrage",
    "correct": false,
    "feedback": "Nothing here is trying to make you angry. It is trying to make you panic about time and stock, and panic about running out is urgency."
   }
  ],
  "script": "Run it fast, this is rehearsal for the worksheet. In feedback, name the nuance: sometimes the numbers are real. The technique is not lying, necessarily, it is the choice to surface exactly the numbers that make you rush. Named, it loses the rush either way.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "Name the technique, on paper",
  "body": "Six items on the worksheet: shop screens, posts and messages, each one running a technique on you. For every item, name the technique: urgency, outrage, flattery or FOMO, then write one line on who profits from the feeling. Fifteen minutes. A name without a reason does not count.",
  "script": "Hand out the worksheet, fifteen minutes on the clock, bookmark strips on tables for anyone who wants the four names in front of them. Support group works items one to three with you, talking each one aloud before writing. Stretch question for early finishers: find an item where two techniques fire at once and argue which is doing the real work. Circulate and collect one sharp who profits line to read out at the end.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check. A creator you have followed for years posts a glowing review with a personal discount code and no ad label. What do you now know?",
  "options": [
   {
    "text": "The code means she likely earns from every sale, so this is marketing borrowing my trust, and I weigh it like marketing",
    "correct": true,
    "feedback": "Exactly. Liking her is fine, buying the serum might even be fine. The skill is refiling the post from friend advice to advert before you decide, because that is what it is."
   },
   {
    "text": "She has 1.2 million followers, so the product must be decent or she would not risk it",
    "correct": false,
    "feedback": "Follower count measures reach, not honesty. Plenty of huge accounts have promoted products they never used. The code and the missing label are the evidence that matters."
   },
   {
    "text": "Nothing, a recommendation is a recommendation however it is paid",
    "correct": false,
    "feedback": "Payment changes everything about why the words were said. That is why UK rules require the ad label. A paid recommendation answers to the brand, not to you."
   }
  ],
  "script": "First of two exit checks, and it mirrors evidence item three, so a wrong answer here tells you exactly who to revisit. These two slides are the printed exit quiz, so run them in silence, individual answers, no conferring.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check. Why does naming the technique, urgency, outrage, flattery or FOMO, actually reduce its power?",
  "options": [
   {
    "text": "The techniques work in the half second before you think, and naming one forces it through the thinking part of your brain",
    "correct": true,
    "feedback": "Right. Manipulation depends on staying invisible and fast. A named technique is neither, so the decision lands back with you, which is where it belonged."
   },
   {
    "text": "Naming it proves the content is false, so you can ignore it",
    "correct": false,
    "feedback": "Naming proves nothing about true or false. A real sale can still use fake urgency. The name does not settle the facts, it removes the rush so you can check them."
   },
   {
    "text": "It does not really, some people are just naturally immune to marketing",
    "correct": false,
    "feedback": "Nobody is immune, including the people who build the techniques. Feeling immune is the most exploitable state there is. Naming is a skill, and skills beat immunity claims every time."
   }
  ],
  "script": "Second exit check. The second wrong option is the myth from the start of the lesson, so watch who still picks it. Collect both answers on the printed exit quiz, they are your evidence for the register.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Vix",
  "text": "Someone built this feeling on purpose. So name it: urgency, outrage, flattery or FOMO. Then follow the money. Named is tamed.",
  "script": "Whole class, twice, second time louder. Vix has been on the streets these techniques were built for, and this is the sentence to walk out with. It should surface the next time a countdown starts ticking at them.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "You are the target market, and the techniques work on everyone. Feeling immune is the most exploitable state there is.",
   "Dark patterns have names: fake urgency, confirm shaming, roach motels, infinite scroll. Named, you see them everywhere.",
   "Rage bait is a business model. The account is not angry, you are, and that reaction was the product.",
   "The tool: notice the pull, name the technique, urgency, outrage, flattery or FOMO, then follow the money."
  ],
  "script": "Return to the hands up count from the start: who thought adverts do not work on them? Ask again now and let the room notice the shift. Then the recap, four pupils, one point each. Read out the best who profits line you collected during practice.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi signs off",
  "lines": [
   "Case closed, and this one was personal. ⭐",
   "Every technique today had one job: to move you before you could think. Now you can name all four: urgency, outrage, flattery, FOMO.",
   "Your mission this week: catch one technique in the wild, name it out loud, and ask who profits from this feeling. Once each. That is the whole rep.",
   "The people who built these systems are betting you will never learn the names. You just did. See you next module."
  ],
  "script": "Let DiGi land the ending, the lines appear on their own. Exit quizzes are collected as this plays. Last word as they pack up: naming a technique is not about never buying anything or hating your feed. It is about the decision being yours.",
  "phase": "close",
  "minutes": 2
 }
]$m15$::jsonb,
  '[]'::jsonb,
  $m15${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m15$::jsonb,
  $m15${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your teenager learned to name the persuasion techniques aimed at them online: fake urgency, rage bait, flattery from influencers and FOMO, plus the dark patterns shops and apps use at checkout. The skill is simple and powerful: naming the technique out loud takes away most of its power.",
 "try_this": "Next time you shop online together and a countdown or an only 2 left banner appears, ask them to name the technique. Then let them catch one being used on you. They will enjoy that part.",
 "family_question": "What was the last thing online that made you feel a sudden urge to buy it, share it or argue with it, and who made money from that feeling?",
 "no_login_required": true
}$m15$::jsonb,
  $m15${
 "learning_objective": "Pupils can name the persuasion technique being used on them, urgency, outrage, flattery or FOMO, identify common dark patterns and undisclosed advertising, and explain who profits from an engineered feeling.",
 "timing": "60 minutes: starter 8, cycle one dark patterns 9, cycle two engineered outrage 7, cycle three influencers and follow the money 12, practise 15, prove 4, close 5",
 "misconceptions": [
  "Adverts do not work on me (the techniques work on everyone, including the marketers who build them, and feeling immune is the most exploitable state because it switches off checking)",
  "Rage bait is just people with strong opinions (fury is farmed deliberately because anger is the highest engagement emotion, the account is not angry, the reaction is the product being sold)",
  "Influencers with discount codes are just sharing things they like (a personal code almost always means commission on every sale, which makes the post an advert, and UK rules require it to be labelled for exactly that reason)"
 ],
 "differentiation": {
  "support": "Work items one to three of the worksheet aloud with the support group before they write, using the bookmark strip so the four technique names stay in front of them. Accept a named technique with a spoken reason where writing is a barrier.",
  "stretch": "Early finishers take the two techniques challenge: find a worksheet item where two techniques fire at once and argue in writing which one is doing the real work. Deeper stretch: design a checkout screen with no dark patterns and explain what it costs the business."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Read the three evidence items aloud with full performance, run the countdown checkout as a described screen and have pupils call out each element as information or pressure. The two discussions run with a watch or wall clock. The four dark patterns and the three step tool are on the bookmark. Exit quiz is the printed two question sheet as normal.",
 "keywords": [
  {
   "word": "dark pattern",
   "definition": "A design trick that pushes you into choices you did not mean to make, like fake countdowns or hidden cancel buttons."
  },
  {
   "word": "rage bait",
   "definition": "Content built to make you furious, because furious people comment, share and stay watching. The fury is the product."
  },
  {
   "word": "parasocial",
   "definition": "A one way relationship. You feel you know a creator personally. They do not know you exist."
  },
  {
   "word": "sponsored content",
   "definition": "A post someone was paid to make. UK rules say it must be labelled as an ad. Hidden ones bank on your trust."
  },
  {
   "word": "FOMO",
   "definition": "Fear of missing out. The engineered worry that everyone else has something and you are about to lose your chance."
  }
 ],
 "tool": {
  "heading": "Name the technique",
  "lines": [
   "Notice the pull",
   "Name it: urgency, outrage, flattery or FOMO",
   "Follow the money"
  ],
  "strapline": "Someone profits from this feeling, and it is not you. Named is tamed."
 },
 "worksheet": {
  "title": "Name the technique",
  "directions": "For each item, name the technique being used on you and write one line on who profits from the feeling.",
  "verdict_options": [
   "Urgency",
   "Outrage",
   "Flattery",
   "FOMO"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "A fashion site checkout shows a red banner: SALE ENDS IN 09:58. You refresh the page by accident and the countdown starts again from ten minutes.",
   "expected_verdict": "Urgency",
   "teaching_point": "A countdown that resets is not measuring time, it is manufacturing panic. The retailer profits from you paying before you compare prices or think."
  },
  {
   "n": 2,
   "item": "A post reads: This restaurant BANNED a veteran from eating there and staff LAUGHED at him. Share this before they get it deleted. No location, no source, sixty thousand shares.",
   "expected_verdict": "Outrage",
   "teaching_point": "An unverifiable injustice plus share before deletion is the rage bait template. The account profits from engagement whether or not the story ever happened."
  },
  {
   "n": 3,
   "item": "A trainer listing shows: Only 3 left in stock. 14 people have this in their basket right now.",
   "expected_verdict": "Urgency",
   "teaching_point": "Scarcity counters are urgency in stock form, and viewer counters on some sites are generated numbers. Real availability is information, numbers chosen to spike your pulse are pressure."
  },
  {
   "n": 4,
   "item": "An influencer posts: my followers are genuinely the smartest people on this app, which is why I only trust YOU lot with this code. Not sharing it anywhere else.",
   "expected_verdict": "Flattery",
   "teaching_point": "The compliment is the mechanism: it makes using the code feel like membership of a smart inner circle. The code means commission, so the flattery has a conversion rate."
  },
  {
   "n": 5,
   "item": "A gaming app notification: 4,000 players joined this event today. Your friends are already playing. Do not be the one who missed it.",
   "expected_verdict": "FOMO",
   "teaching_point": "Everyone else is in and you are about to be left out is FOMO in its purest form. The app profits from your session time, and the friends line may be generated from loose contact data."
  },
  {
   "n": 6,
   "item": "Rio gets a message from a creator he follows: as one of my day ones, you deserve early access before the crowds. Only real fans get this link. Rio says it is just a nice message to loyal followers. Do you agree? Explain your reasoning.",
   "expected_verdict": "Flattery",
   "teaching_point": "The final explain item. You deserve and only real fans is flattery building an identity that makes clicking feel like loyalty, with FOMO underneath. Rio missing it shows the technique working: it never feels like marketing to the person receiving it."
  }
 ],
 "commitment_stem": "My commitment: the next time a screen gives me a sudden urge to buy, share, rage or keep scrolling, I will name the technique before I act."
}$m15$::jsonb,
  $m15${
 "required": false
}$m15$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 16: Consent, images and the law
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks4-16-consent-images-law', 'Consent, images and the law', 'KS4', 'Years 10 to 11', 'teacher',
  '{2,7}'::int[], ARRAY['RSHE','UK law on under 18 images']::text[], '{}'::text[],
  'Image based abuse data', 'I know the law and my options before anything is shared.', 'DiGi only', 16,
  $m16$[
 {
  "type": "title",
  "eyebrow": "KS4 · Years 10 to 11 · Module 16",
  "title": "Consent, images and the law",
  "body": "One hour on the facts. What consent really means, what the law actually says, and what your options are if something has already been shared.",
  "script": "Calm start, no drama. Say plainly: today is a serious one, and we are going to treat you like the near adults you are. No shock tactics, no lectures. Facts, the law, and options. Set the ground rule now: we talk about situations, never about specific people in this school. If anything in this lesson is close to home for anyone, they can talk to me or any trusted adult afterwards, and I will say that again at the end. If a pupil discloses anything during this lesson, follow your school safeguarding policy: listen, do not promise secrecy, and pass it to your DSL the same day.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I know the law and my options before anything is shared.",
  "why": "Decisions about images get made in seconds, under pressure, and usually with wrong information. This hour replaces the myths with the actual law and a set of options that exist whatever has already happened.",
  "gains": [
   "Explain what real consent is: freely given, specific, ongoing and revocable",
   "State what UK law says about images of anyone under 18, including images of yourself",
   "Recognise pressure and coercion for what they are, including the everyone does it line",
   "Know exactly where help is if an image is already out there, and that you are not in trouble for asking"
  ],
  "script": "Read the outcome and the why aloud, evenly. Then say: notice what is not on this list. Nobody is here to scare you or to pretend this topic does not exist. You are old enough for the real information, so that is what you are getting. If a pupil discloses at any point, follow your safeguarding policy and involve your DSL.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "The words that matter today",
  "words": [
   {
    "word": "consent",
    "meaning": "A free, genuine yes. It is specific to one thing, it is ongoing, and it can be taken back at any time."
   },
   {
    "word": "coercion",
    "meaning": "Pressuring, guilting or threatening someone into a yes. A yes produced by coercion is not consent."
   },
   {
    "word": "indecent image",
    "meaning": "The legal term for a sexual image. In UK law this applies to any image of a person under 18."
   },
   {
    "word": "Report Remove",
    "meaning": "A free, confidential tool from Childline and the Internet Watch Foundation that helps under 18s get images of themselves taken down."
   }
  ],
  "script": "Read each word and its meaning once, steadily. Do not rush Report Remove: many pupils have never heard of it, and for some pupils it will be the single most important thing they learn this year. Tell them we will come back to it properly later in the lesson.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Retrieval from last lesson. A message says you must decide right now, this second, or you will lose your chance. Which persuasion technique is that?",
  "options": [
   {
    "text": "Urgency",
    "correct": true,
    "feedback": "Yes. Urgency removes your thinking time on purpose, because a rushed decision suits the sender, not you. Hold that thought, it is about to matter in a new context."
   },
   {
    "text": "Flattery",
    "correct": false,
    "feedback": "Flattery works by making you feel special or chosen. This one works by removing your thinking time. That is urgency."
   },
   {
    "text": "FOMO",
    "correct": false,
    "feedback": "Close. FOMO points at what everyone else has and you are missing. This one is a countdown on your decision. That is urgency."
   }
  ],
  "script": "Thirty seconds of silent thinking, then take answers. Last lesson you learned to name the technique: urgency, outrage, flattery, FOMO. Land the bridge clearly: today those same techniques show up in a much more personal place, in messages asking for images. Naming the technique works exactly the same way there.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🤝",
  "heading": "What consent actually is",
  "body": "Consent is a free, genuine yes, given without pressure, and it is specific: yes to one thing is not yes to everything. Consent is also ongoing. Saying yes once does not mean yes forever, and anyone can change their mind at any point. A yes that came from guilt, fear, wearing someone down or a threat is not consent at all. If any of those are in the room, whatever was said out loud, the real answer was no.",
  "script": "Deliver this slowly and plainly. The two ideas pupils most often do not have are specific and revocable. Use a neutral everyday example first: lending a friend your bike on Saturday is not lending it forever, and you can ask for it back. Then make the link: with images the same rules apply, except the stakes are far higher because a shared image can be copied. Keep the register calm and factual throughout.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "Real consent has four properties",
  "caption": "If any one of these is missing, it is not consent. All four, every time.",
  "steps": [
   {
    "emoji": "🆓",
    "title": "Freely given",
    "text": "No pressure, no guilt, no threats, no wearing down. A yes under pressure is not a yes."
   },
   {
    "emoji": "🎯",
    "title": "Specific",
    "text": "Yes to one thing, one person, one moment. It does not transfer to anything else."
   },
   {
    "emoji": "🔄",
    "title": "Ongoing",
    "text": "Consent is checked, not assumed. A yes last month says nothing about today."
   },
   {
    "emoji": "↩️",
    "title": "Revocable",
    "text": "Anyone can change their mind at any time, and the moment they do, the yes is gone."
   }
  ],
  "script": "Walk the four properties as they build, no rush. Then test understanding with a neutral question: if someone said yes to a photo being posted last month and asks for it to come down today, what happens? Answer: it comes down, because consent is revocable and the old yes ended the moment they changed their mind. Anyone who argues but they already agreed has just shown you exactly which property they are missing.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Someone said yes to a photo being shared last month. Today they ask for it to be deleted. The other person says you already agreed. Who is right?",
  "options": [
   {
    "text": "The person asking for deletion. Consent is ongoing and can be withdrawn at any time",
    "correct": true,
    "feedback": "Correct. The yes ended the moment they changed their mind. Consent from last month is not consent today. Refusing to respect a withdrawn yes is a serious warning sign, and a reason to involve a trusted adult."
   },
   {
    "text": "The other person. A yes was given, so the photo can stay",
    "correct": false,
    "feedback": "This is the most common misunderstanding there is. Consent is not a contract you sign once. It is ongoing, and it ended the moment they withdrew it."
   },
   {
    "text": "Neither. Once something is shared, consent stops mattering",
    "correct": false,
    "feedback": "Consent always matters. It is true that copies are hard to control, which is why the decision before sharing is so important, but the withdrawn yes still stands and there are real options, which we cover later this lesson."
   }
  ],
  "script": "Silent vote, hands or devices. Expect some pupils to genuinely hold the second view, and treat it as a misunderstanding to correct, not a character flaw. The feedback line to land: consent is not a contract, it is ongoing, and a withdrawn yes is a full no from that moment.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "⚖️",
  "heading": "What the law says",
  "body": "In UK law it is illegal to make, hold or share a sexual image of anyone under 18. That is the whole rule, and it has no exceptions for circumstances people assume are fine. It applies even if the image is of yourself. It applies even if you are under 18 too. It applies even if both people agreed. The law calls these indecent images, and the age line is 18, not 16, which surprises many people. The reason the law is written this bluntly is protection: it makes every image of an under 18 person legally untouchable, so nobody can claim a loophole.",
  "script": "This is the factual core of the lesson, so deliver it word for word and let it breathe. Expect and welcome the obvious question: how can it be illegal to have a picture of yourself? Answer honestly: the law is written to make images of under 18s untouchable with no loopholes, and that blanket rule catches this situation too. Then say the reassurance clearly, because it is true and it matters: police guidance treats young people in these situations as children to protect first, not criminals to charge. The law exists to protect you, not to trap you. Do not let the room leave with fear and no options.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "Three things the law covers",
  "caption": "All three are offences when the person in the image is under 18. There is no consent exception and no same age exception.",
  "steps": [
   {
    "emoji": "📸",
    "title": "Making",
    "text": "Taking or creating the image. This includes taking an image of yourself."
   },
   {
    "emoji": "📱",
    "title": "Holding",
    "text": "Having it on a device. A photo that arrives unasked in a group chat still counts, so delete and report, never save."
   },
   {
    "emoji": "📤",
    "title": "Sharing",
    "text": "Sending or forwarding it to anyone. Forwarding is not neutral. Legally it is the same act as sharing."
   }
  ],
  "verdicts": [
   "Illegal under 18",
   "No exceptions",
   "Protection first"
  ],
  "script": "Walk the three steps steadily. The one pupils most often get wrong is holding: an image that lands in a group chat you never asked for still creates a legal problem on your device, and the right move is delete, do not forward, and tell an adult. Forwarding deserves a moment too, because whoever forwards is legally sharing, and adding I am just passing it on changes nothing. Point at the verdict chips and repeat the frame: illegal under 18, no exceptions, and the purpose is protection first.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "Two 16 year olds are in a relationship and both agree to share images with each other. What does UK law say?",
  "options": [
   {
    "text": "It is still illegal. The law covers everyone under 18 and has no consent or same age exception",
    "correct": true,
    "feedback": "Correct, and this is the fact most people your age do not know. Agreement does not change it, being in a relationship does not change it, both being under 18 does not change it. The law is blunt on purpose, and its purpose is protection."
   },
   {
    "text": "It is legal because both agreed",
    "correct": false,
    "feedback": "Consent between the two people does not change the law here. Any sexual image of a person under 18 is illegal to make, hold or share, whoever agreed."
   },
   {
    "text": "It is legal because they are over 16",
    "correct": false,
    "feedback": "The age line for images is 18, not 16. This catches a lot of people out. Sixteen changes some laws, but not this one."
   }
  ],
  "script": "This is the question the whole legal section hangs on, so give it proper thinking time. Both wrong answers are widely believed, so use the feedback to correct without mocking. Repeat the reassurance after the reveal: knowing this law is protection, and if anyone is ever caught inside it, the guidance to police is to protect young people first. You are not the target of this law, you are the person it protects.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "message",
  "handle": "Alex",
  "avatar": "🌙",
  "meta": "Messages · 23:47",
  "text": "you would if you actually cared about me. everyone sends them, it is literally normal. i would never show anyone, you can trust me. why are you making this such a big deal",
  "image": "💬",
  "prompt": "Read it once in silence. How many pressure techniques can you name in these four sentences?",
  "script": "Give the room a silent read, then work through it line by line, naming techniques like last lesson. You would if you cared is guilt used as a lever. Everyone sends them is false social proof, and it is factually wrong, most people do not. I would never show anyone is a promise nobody can enforce once an image exists. Why are you making this a big deal reverses the blame onto the person saying no. Four sentences, four techniques. Then say clearly: a yes produced by this message would not be consent, because it was not freely given. If this scenario prompts any pupil to disclose something similar, follow your safeguarding policy, speak to them privately and involve your DSL the same day.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🛑",
  "heading": "Pressure is not consent, and everyone is not sending them",
  "body": "The single most used pressure line is everyone sends them, and it is simply false. Most young people do not, whatever the loudest voices claim. Pressure comes in soft forms too: guilt, sulking, repeated asking, or making you feel boring or cold for saying no. All of it is coercion, and a yes it produces is not consent. And a hard line for the serious end: anyone who threatens you, including threatening to share something, has committed the wrong, not you. Threats are never your fault and always a reason to get an adult involved immediately.",
  "script": "Two jobs on this slide. First, kill the everyone does it myth flatly: it is a pressure technique, not a fact, and the evidence consistently shows most young people do not send images. Second, widen what pupils count as pressure, because most expect threats and miss guilt, sulking and persistence, which are far more common. End on the hard line about threats and say it twice: the person threatening has done the wrong thing, not the person threatened. If a pupil discloses pressure or threats, in the room or afterwards, follow your safeguarding policy and pass it to your DSL the same day.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "groups",
  "seconds": 90,
  "prompt": "Why does the everyone sends them line work so well, even though it is false?",
  "lookFor": "It attacks belonging, the thing that matters most at this age. It makes the person saying no feel like the odd one out, when the quiet truth is that most people are saying no with them. Naming it as a technique takes its power away.",
  "script": "Groups of three, ninety seconds on the timer, keep the register calm and analytical. You are asking them to study the technique, not to share personal stories, and steer gently if a group drifts personal. Collect one answer per group. The insight to land: the line works because it isolates you, and it is a lie, the majority are quietly saying no with you."
 },
 {
  "type": "diagram",
  "heading": "The three questions before anything is shared",
  "caption": "This is the tool. Three questions, asked before anything is shared, every time. If any answer is unclear, nothing gets shared.",
  "steps": [
   {
    "emoji": "🤝",
    "title": "Is there real consent?",
    "text": "Freely given, specific, ongoing, revocable. All four, from everyone involved, or it is a no."
   },
   {
    "emoji": "⚖️",
    "title": "What does the law say?",
    "text": "Under 18, the law says no: making, holding or sharing, no exceptions. That answers the question for you."
   },
   {
    "emoji": "🧭",
    "title": "What are my options?",
    "text": "You always have more than two. Saying no, pausing, talking to someone you trust, and getting help are all real options."
   }
  ],
  "verdicts": [
   "All clear",
   "Not clear, so no",
   "Get help"
  ],
  "script": "This is the slide the whole lesson is built around, so give it a full three minutes. Walk each question as it builds. Notice with the class how the second question does the heavy lifting at your age: while anyone in the image is under 18, the law has already answered, which takes the entire negotiation off the table. That is genuinely useful, because the law says no is a complete sentence that ends pressure without a fight. The third question is the one people forget in the moment: pressure always presents exactly two options, comply or lose something, and there are always more. Have the class read the three questions aloud once, evenly, no chanting energy, just fixing it in memory.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🛟",
  "heading": "If an image is already out there",
  "body": "If an image of you is out there, or you are being pressured or threatened right now, here is what is true. It is not your fault, whatever anyone says. You will not be in trouble for asking for help, and adults who deal with this treat young people as people to protect. And something can actually be done: Report Remove, run by Childline and the Internet Watch Foundation, lets anyone under 18 report an image of themselves confidentially and have it taken down from the open web, without needing a parent present and without going to the police themselves. Alongside it, a trusted adult, your school DSL or Childline on 0800 1111 can help you carry it, because nobody should carry this alone.",
  "script": "Slow right down, this is the most important slide of the hour. Read it fully and evenly. Land the three truths in order: not your fault, not in trouble for asking, and something can be done. Spell out how Report Remove works: childline.org.uk, search Report Remove, prove your age, report the image confidentially, and the IWF works to remove it. Say plainly that asking for help is the strong move, not the embarrassing one. Then say: if this applies to you or a friend, come and talk to me after the lesson, or any adult you trust, today. If a pupil does, follow your safeguarding policy, do not promise secrecy, and involve your DSL the same day.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 2,
  "mode": "pairs",
  "seconds": 60,
  "prompt": "What stops people asking for help in this situation, and what would you say to a friend who was frozen by one of those fears?",
  "lookFor": "The usual barriers: shame, fear of being in trouble, fear of parents finding out, believing nothing can be done. Every one of them has an answer: it is not your fault, you are not in trouble, Report Remove is confidential, and something can be done.",
  "script": "Pairs, sixty seconds on the timer. Keep it in the third person, what would you say to a friend, so nobody is asked to speak about themselves. Collect a few answers and match each barrier to its answer out loud. The sentence to leave hanging in the room: the fear of asking for help is nearly always worse than what actually happens when you do. If anything surfaces here, follow your safeguarding policy."
 },
 {
  "type": "choice",
  "question": "An image of a Year 10 pupil is being shared around. What is true about their options?",
  "options": [
   {
    "text": "Report Remove can get it taken down confidentially, and they are not in trouble for reporting",
    "correct": true,
    "feedback": "Correct. Report Remove from Childline and the IWF exists exactly for this, it is confidential, and the person in the image is treated as someone to protect. Telling a trusted adult as well means they do not carry it alone."
   },
   {
    "text": "Nothing can be done once an image is out",
    "correct": false,
    "feedback": "This myth keeps people silent and it is wrong. Report Remove takes images of under 18s down from the open web, and schools and police can act on the sharing. Something can always be done."
   },
   {
    "text": "They should stay quiet, because reporting gets you in trouble",
    "correct": false,
    "feedback": "The opposite is true. The guidance that police and schools follow protects the person in the image. Staying quiet is the only option that helps nobody."
   }
  ],
  "script": "Quick check, whole class. Both wrong answers are the exact myths that keep young people silent, so use the feedback to dismantle them one more time. If anyone seems personally affected by this question, make space to talk privately afterwards and follow your safeguarding policy.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "The three questions, on paper",
  "body": "Six situations on the worksheet. For each one, run the tool: is there real consent, what does the law say, what are my options? Give a verdict: real consent, pressure not consent, or get help now, and back every verdict with a reason. Fifteen minutes, working alone or in your pair. These are fictional situations. Do not write about real people.",
  "script": "Hand out the worksheet. Fifteen minutes, and say clearly before pens move: every situation on this sheet is fictional, and nobody should write about real people or themselves. Bookmark strips with the three questions on the tables for anyone who wants them. Support pairs work items one to three with you. Stretch question for early finishers: why does the law deliberately have no consent exception for under 18s? Circulate calmly. If anything a pupil writes or says suggests a real situation, follow your safeguarding policy and speak with them privately after the lesson.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check one. Someone says it is legal to share images if you are both under 18 and you both agree. What do you know?",
  "options": [
   {
    "text": "It is illegal. The law covers making, holding and sharing any sexual image of an under 18, with no consent or same age exception",
    "correct": true,
    "feedback": "Correct on every point. Agreement does not change it and being the same age does not change it. The age line is 18, and the law is written that way to protect you."
   },
   {
    "text": "It is legal if both people genuinely consent",
    "correct": false,
    "feedback": "Consent between the two people does not change this law. Under 18, images are illegal to make, hold or share, full stop."
   },
   {
    "text": "It is legal once you are 16",
    "correct": false,
    "feedback": "The line for images is 18, not 16. This is the single most common mistake people make about this law."
   }
  ],
  "script": "First of two exit checks, and together they are the printed exit quiz, so pupils answer alone, no conferring. This one tests the law. A wrong answer here matters more than most wrong answers, so note names for a quiet follow up, not a public one.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check two. A friend tells you an image of them is being shared and they are terrified they will be in trouble. What is the best response?",
  "options": [
   {
    "text": "It is not your fault, you will not be in trouble, and Report Remove plus a trusted adult can actually fix this",
    "correct": true,
    "feedback": "Exactly right, all three parts. Not their fault, not in trouble, and real help exists: Report Remove from Childline and the IWF takes images down confidentially, and a trusted adult means they are not carrying it alone."
   },
   {
    "text": "Tell them to delete their accounts and hope it blows over",
    "correct": false,
    "feedback": "Deleting accounts does not remove the image and hoping is not a plan. Report Remove and a trusted adult can actually act. Silence is the only option that helps nobody."
   },
   {
    "text": "Tell them not to tell any adults so it stays contained",
    "correct": false,
    "feedback": "Keeping adults out feels safer and is the opposite. Adults who handle this treat the person in the image as someone to protect, and Report Remove is confidential. Not telling anyone is how people end up carrying this alone."
   }
  ],
  "script": "Second exit check, answered alone. This one tests the options half of the outcome, and it is the knowledge most likely to be used for real one day, probably for a friend. After collecting answers, say the whole response aloud once more, calmly: not your fault, not in trouble, Report Remove, trusted adult.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like DiGi",
  "text": "Before anything is shared: is there real consent, what does the law say, what are my options? And if something is already out there: not your fault, not in trouble, help exists.",
  "script": "No chanting for this module. Read it aloud yourself once, calmly, then have the class read it once together at a normal volume. Two sentences: the tool for before, and the truth for after. Those two sentences are the whole lesson.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to keep",
  "points": [
   "Real consent is freely given, specific, ongoing and revocable. A yes under pressure is not consent, and any yes can be taken back.",
   "UK law: making, holding or sharing a sexual image of anyone under 18 is illegal, even of yourself, even if you are under 18 too, with no consent exception.",
   "Everyone sends them is a pressure line, not a fact. Most people do not, and naming the technique takes its power away.",
   "If an image is out there: not your fault, not in trouble. Report Remove from Childline and the IWF takes it down confidentially, and a trusted adult helps you carry it."
  ],
  "script": "Read the four points yourself rather than asking pupils to perform them, it suits the register of this module. Then repeat the open door, slowly: if anything in this lesson was close to home for you or a friend, come and find me after class, or any adult you trust, today. Nobody is in trouble for asking. If anyone does come to you, follow your school safeguarding policy and involve your DSL the same day.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi, before you go",
  "lines": [
   "Three questions before anything is shared: is there real consent, what does the law say, what are my options? ⭐",
   "The law is on your side here. Under 18, it answers the second question for you, and it exists to protect you, never to trap you.",
   "If something is already out there, for you or a friend: it is not your fault, you are not in trouble, and Report Remove can take it down. Help is real.",
   "You deserve people who respect your no without a fight. That is the standard. Look after yourselves, and I am always in your corner."
  ],
  "script": "Let DiGi have the last word, the lines appear on their own. Exit quizzes are collected as this plays. Stay by the door as pupils leave: this is the module where someone lingers behind, and that lingering is the conversation that matters. If a pupil discloses anything, listen calmly, do not promise secrecy, and follow your school safeguarding policy with your DSL the same day.",
  "phase": "close",
  "minutes": 2
 }
]$m16$::jsonb,
  '[]'::jsonb,
  $m16${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 3,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m16$::jsonb,
  $m16${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today we covered consent, images and UK law in a calm, factual way: real consent is freely given and can always be taken back, and the law makes any sexual image of an under 18 illegal to make, hold or share, even of yourself, with no exceptions. We also made sure every pupil knows about Report Remove, the confidential Childline and Internet Watch Foundation tool that gets images of under 18s taken down, and that asking for help never gets them in trouble.",
 "try_this": "Look up Report Remove together at childline.org.uk, just so it is a known name in your house before anyone ever needs it. Knowing the route in advance is what makes a young person use it.",
 "family_question": "If a friend of yours was being pressured to share a photo, what would you want them to know?",
 "no_login_required": true
}$m16$::jsonb,
  $m16${
 "learning_objective": "Pupils can explain what real consent is, state what UK law says about sexual images of under 18s, recognise pressure and coercion, and name their options if an image is already out there, including Report Remove.",
 "timing": "60 minutes: starter 8, cycle one consent 6, cycle two the law 7, cycle three pressure 9, cycle four options 6, practise 15, prove 4, close 5",
 "misconceptions": [
  "It is legal if you are both under 18 and both agree (it is not, the law covers making, holding and sharing any sexual image of an under 18 with no consent or same age exception, and the age line is 18, not 16)",
  "Everyone sends them (false, the evidence consistently shows most young people do not, and the line is a pressure technique designed to isolate the person saying no)",
  "If an image of you is out there you are in trouble and nothing can be done (wrong on both counts, police and school guidance protects the young person first, and Report Remove from Childline and the IWF gets images taken down confidentially)"
 ],
 "differentiation": {
  "support": "Bookmark strips with the three questions on every table. Support pairs work worksheet items one to three with the teacher, reading each situation aloud and running the three questions verbally before writing.",
  "stretch": "Early finishers take the stretch question: why does the law deliberately have no consent exception for under 18s, and who would benefit if it did? Push for the protective logic: a blanket rule leaves no loophole for anyone to exploit."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Read the consent properties and the law slide aloud word for word from the pack, draw the three questions tool on the board, run both discussions as timed pair and group talk with a watch, deliver the scenario by reading the message aloud in a flat neutral voice, and run the worksheet and the two exit questions exactly as printed. The Report Remove signpost and the closing open door must be said aloud even with no screen.",
 "keywords": [
  {
   "word": "consent",
   "definition": "A free, genuine yes. It is specific to one thing, it is ongoing, and it can be taken back at any time."
  },
  {
   "word": "coercion",
   "definition": "Pressuring, guilting or threatening someone into a yes. A yes produced by coercion is not consent."
  },
  {
   "word": "indecent image",
   "definition": "The legal term for a sexual image. In UK law this applies to any image of a person under 18."
  },
  {
   "word": "Report Remove",
   "definition": "A free, confidential tool from Childline and the Internet Watch Foundation that helps under 18s get images of themselves taken down."
  }
 ],
 "tool": {
  "heading": "Before anything is shared",
  "lines": [
   "Is there real consent?",
   "What does the law say?",
   "What are my options?"
  ],
  "strapline": "If any answer is unclear, nothing gets shared. And if something is already out there: not your fault, not in trouble, help exists."
 },
 "worksheet": {
  "title": "The three questions",
  "directions": "For each fictional situation, run the three questions, choose a verdict and give your reason. Never write about real people.",
  "verdict_options": [
   "Real consent",
   "Pressure, not consent",
   "Get help now"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "A message reads: everyone sends them, you would if you actually trusted me, stop making it weird.",
   "expected_verdict": "Pressure, not consent",
   "teaching_point": "Three techniques in one message: false social proof, guilt as a lever, and blame reversal. Any yes this message produces is not freely given, so it is not consent."
  },
  {
   "n": 2,
   "item": "Two friends on holiday agree to a group photo going on one friend's profile. Both are genuinely happy, both know exactly where it is going, and both know they can ask for it to come down later.",
   "expected_verdict": "Real consent",
   "teaching_point": "All four properties present: freely given, specific to one photo and one place, ongoing, and revocable. This is what the standard looks like, and it is worth naming that ordinary consent happens all the time."
  },
  {
   "n": 3,
   "item": "Someone agreed to a photo being posted last term. They have now changed their mind and asked for it to be deleted. The reply: too late, you already said yes.",
   "expected_verdict": "Pressure, not consent",
   "teaching_point": "Consent is ongoing and revocable, so the old yes ended the moment it was withdrawn. Refusing to respect a withdrawn yes is a warning sign, and if the refusal continues, this becomes a get help situation."
  },
  {
   "n": 4,
   "item": "An image of a Year 10 pupil is going around a group chat. Someone sends it to you with the words: have you seen this.",
   "expected_verdict": "Get help now",
   "teaching_point": "Do not save it, do not forward it, and tell a trusted adult or the DSL. Holding and forwarding are both offences when the person is under 18, and forwarding is legally the same act as sharing. The person in the image needs protecting, not an audience."
  },
  {
   "n": 5,
   "item": "Someone is told: send another one or the first one goes to everyone you know.",
   "expected_verdict": "Get help now",
   "teaching_point": "This is a criminal threat, and complying never ends it. The person threatening has committed the wrong, not the person threatened. Tell a trusted adult immediately and use Report Remove. Not their fault, not in trouble."
  },
  {
   "n": 6,
   "item": "Casey says: if a photo of you is already out there, you are the one in trouble and nothing can be done, so the safest thing is to stay quiet. Do you agree with Casey? Explain your reasoning.",
   "expected_verdict": "Get help now",
   "teaching_point": "Casey is wrong on all three counts. The person in the image is treated as someone to protect, Report Remove takes images down confidentially, and staying quiet is the only option that helps nobody. Full marks needs all three corrections in the explanation."
  }
 ],
 "commitment_stem": "My commitment: before anything is shared I will ask the three questions, and if it ever matters, for me or a friend, I know about Report Remove and I will not stay quiet."
}$m16$::jsonb,
  $m16${
 "required": true,
 "note": "This module covers consent, indecent images of under 18s and coercion, and may prompt disclosures during or after the lesson, including image sharing that has already happened, ongoing pressure, or threats such as demands backed by a threat to share. Teachers have been briefed to listen calmly, never promise secrecy, and follow the school safeguarding policy, passing any disclosure to the DSL the same day. Pupils are signposted throughout to Report Remove (Childline and the Internet Watch Foundation) for confidential removal of images of under 18s, and to Childline on 0800 1111, with the consistent message that they are not in trouble and it is not their fault. The platform records no disclosures and stores no pupil responses from this lesson: all worksheet and exit quiz work is on paper and handled inside school. If a threat to share images is disclosed, treat it as potential sextortion and follow your policy and local police guidance without asking the pupil to gather or show evidence.",
 "concern_form_linked": true
}$m16$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 17: Sextortion
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks4-17-sextortion', 'Sextortion', 'KS4', 'Years 10 to 11', 'teacher',
  '{2,4}'::int[], ARRAY['RSHE','Safeguarding (KCSIE)']::text[], '{}'::text[],
  'NCA and IWF sextortion alerts', 'I know exactly who to tell and that it is not my fault.', 'DiGi only, maximum calm', 17,
  $m17$[
 {
  "type": "title",
  "eyebrow": "KS4 · Years 10 to 11 · Module 17",
  "title": "Sextortion",
  "body": "One hour on blackmail with images: how it starts, the scripts it runs on, and the three lifelines that end it.",
  "script": "Before this slide goes up, set the ground rules calmly and without drama. No names, no stories about real people, no asking anyone if it has happened to them. Anyone can step out quietly at any time and that is completely fine, tell them where to go if they do. Then the framing: today is a lesson most adults never got, and it is here because the National Crime Agency asked schools to teach it. Keep your tone level and unhurried for the whole hour. Watch for nervous laughter at the title, do not punish it, it is discomfort, just hold a beat of quiet and move on. If a pupil discloses anything today, follow your school safeguarding policy and involve your DSL the same day.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I know exactly who to tell and that it is not my fault.",
  "why": "Sextortion is blackmail using intimate images, or the claim to have them, and the people who run it depend on panic and silence to work. This hour removes both, because once you know the pattern and the way out, their plan falls apart.",
  "gains": [
   "Recognise how sextortion starts, long before any threat appears",
   "Name the scripts blackmailers use to create panic and silence",
   "Know the three lifelines: do not pay, do not keep it secret, report it",
   "Know exactly who to tell and how, for yourself or for a friend"
  ],
  "script": "Read the outcome aloud, then the why, slowly. Point at the outcome and say: notice it does not say I will never be targeted. Nobody can promise that. It says I know who to tell and that it is not my fault, because those two things are what get people out. Watch the room as you read: pupils who look down or go very still are worth a quiet check in later, not a public one. Do not ask for hands or opinions on this slide, just land it and move on.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Words that matter today",
  "words": [
   {
    "word": "sextortion",
    "meaning": "Blackmail using intimate images, or the claim to have them. The blackmailer demands money or more images and threatens to share."
   },
   {
    "word": "blackmail",
    "meaning": "Demanding money or actions by threatening to reveal something. A serious crime, committed by the blackmailer, never by the victim."
   },
   {
    "word": "Report Remove",
    "meaning": "A free, confidential Childline and IWF tool that helps under 18s get intimate images taken down from the internet. It works."
   },
   {
    "word": "CEOP",
    "meaning": "The police child protection command. Its online report form sends sextortion cases straight to specialist officers who deal with this every day."
   }
  ],
  "script": "Read each word and its meaning yourself, calmly, no chanting for this module. Two things to stress. First, in the definition of blackmail, the crime belongs to the blackmailer, never the victim, say that sentence twice. Second, Report Remove and CEOP are not abstract, they are two real places pupils can go tonight if they need to, and we will come back to both. Watch for anyone writing the names down carefully, that is fine and good, do not comment on it.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Retrieval from last lesson. An intimate image of someone under 18 is online and they want it gone. What did we learn?",
  "options": [
   {
    "text": "Once an image is out, nothing can be done",
    "correct": false,
    "feedback": "This is the belief that keeps people trapped, and it is false. Report Remove exists exactly for this, and it takes images down."
   },
   {
    "text": "Report Remove can get it taken down, and the young person is treated as a victim, not a suspect",
    "correct": true,
    "feedback": "Right, and both halves matter. The image can come down, and the law is on the side of the under 18 in the picture."
   },
   {
    "text": "They should delete their accounts and wait for it to blow over",
    "correct": false,
    "feedback": "Disappearing does not remove the image and it leaves them alone with the problem. Report Remove and a trusted adult do the real work."
   }
  ],
  "script": "Thirty seconds of silent thinking, then take the vote by hands or devices. This retrieval is doing double duty: it checks last lesson on consent, the law and Report Remove, and it plants the foundation today builds on. If the room is shaky on this, spend an extra minute re teaching it now, because everything in the next fifty minutes stands on the fact that help exists and victims are not in trouble. Cold call gently for reasoning, and accept a pass without comment in this module.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "⭐",
  "heading": "What sextortion is",
  "body": "Sextortion is blackmail. Someone gets an intimate image, or claims to have one, and demands money or more images, threatening to send it to family and followers if the person refuses. It is organised crime, usually run by groups overseas working through fake accounts, and the National Crime Agency warns it increasingly targets teenage boys with demands for money. The person being blackmailed has been the victim of a crime from the first message. Nothing they did changes that.",
  "script": "Deliver this slowly and factually, like you would explain any other crime. Two sentences to stress: it is organised crime run through fake accounts, because that dismantles the idea that the victim was foolish, these are professionals running a process on thousands of people at once. And the last two sentences, read them exactly as written. Watch for the shift in the room when boys hear this targets them, some will sit up, some will go quiet. Both are the lesson landing. Do not invite anecdotes here.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "stat",
  "phase": "teach",
  "minutes": 2,
  "figure": "Every UK school",
  "claim": "In 2024 the National Crime Agency took the rare step of sending an alert to every school in the UK, warning that financially motivated sextortion was rising sharply and that teenage boys are the most common targets.",
  "source": "NCA national alert on financially motivated sextortion, April 2024",
  "script": "Let the slide sit in silence for a few seconds before you speak. Then: the evidence here is the alert itself. The NCA does not write to every school in the country for something rare or small. This is real, it is current, and it is aimed at people your age, which is exactly why you are getting this lesson instead of being left to find out the hard way. Watch for bravado from some boys, that is armour, do not challenge it publicly, the next slides will do that work quietly."
 },
 {
  "type": "diagram",
  "heading": "How it starts",
  "caption": "The whole approach is designed to feel like luck. It is a script, run on thousands of people at once.",
  "steps": [
   {
    "emoji": "👋",
    "title": "A friendly account appears",
    "text": "Attractive profile, follows you first, likes your posts. Everything looks ordinary."
   },
   {
    "emoji": "💬",
    "title": "Fast warmth, fast trust",
    "text": "Compliments, common interests, constant replies. The speed is the tell. Real connections are slower."
   },
   {
    "emoji": "📸",
    "title": "The ask, or the claim",
    "text": "They push to swap images, often offering to send first. Or they simply claim to have images that may not even exist."
   },
   {
    "emoji": "🔒",
    "title": "The switch",
    "text": "Warmth vanishes. Threats and a demand arrive, often within minutes. The friendly person never existed."
   }
  ],
  "script": "Walk the four steps as they build, evenly, no theatrics. The teaching point to land hard is in step two: the speed is the tell. A stranger this warm, this fast, this interested, is running a script. Also flag step three carefully: some blackmailers have no image at all, they claim to and rely on panic to do the rest, which matters because it means this can happen to someone who never sent anything. Watch for pupils recognising the pattern from their own DMs, faces change on this slide. If anyone wants to talk afterwards, stay available, and follow your safeguarding policy if anything is disclosed.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "message",
  "handle": "ellie.2009",
  "avatar": "🙂",
  "meta": "New follower · first message 22:47",
  "text": "hey 😊 found you on the for you page, you seem really sound. you are honestly so good looking. do you have snap? i never message people first but i feel like we would get on",
  "image": "💬",
  "prompt": "This account followed twenty minutes ago. Which step of the pattern is this, and what is the strongest signal?",
  "script": "Read the message aloud in a flat, neutral voice, do not perform it. Ask the prompt and take two or three answers. The answer you want: this is steps one and two together, and the strongest signal is speed, twenty minutes from follow to flattery to a request to move platforms. Also worth naming: moving to Snapchat matters because disappearing messages feel safer and are exactly where the script goes next. Watch for anyone saying they get messages like this all the time, agree calmly that these accounts are common, which is exactly why the pattern is worth knowing. Keep it about the account, never about what anyone in the room may have replied.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "📜",
  "heading": "The scripts they use",
  "body": "Because this is organised crime, the messages are scripts, written to work at scale. The opener flatters and mirrors you. The escalation pushes speed, before you have time to think. The threat arrives with a countdown, a claim to have your follower list, and an order to tell nobody. Every line has one job: to make you panic and keep you silent, because panic pays and silence protects them. Once you can see the script, it loses most of its power.",
  "script": "This is the inoculation slide, take your time with it. Go line by line: flattery, speed, countdown, follower list, secrecy order. Ask the class which line they think does the most damage, and steer to the secrecy order, because everything else fails the moment the person tells someone. That is why the script fights hardest to stop them telling. Watch for the room getting quieter and more focused here, that is what you want. No role play of the scripts, ever, just analysis.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "A new account you have never met is warm, flattering, and pushing to swap images within an hour of first contact. What is the strongest signal here?",
  "options": [
   {
    "text": "The speed. Real connection is slower, scripts are fast",
    "correct": true,
    "feedback": "Yes. The compliments could be genuine and the profile could be real, but the speed is the tell. Nothing real needs to happen tonight."
   },
   {
    "text": "The profile picture, fakes always look fake",
    "correct": false,
    "feedback": "Fake profiles use real, stolen photos and look completely ordinary. You cannot judge the account by its face, only by its behaviour."
   },
   {
    "text": "There is no signal, sometimes people just click",
    "correct": false,
    "feedback": "People do click, and slowly. A stranger pushing for images within an hour is following a script, and the pressure for speed is the script showing."
   }
  ],
  "script": "First formal check of the lesson. Take the vote, then spend the time on the feedback for the second option: the exemplar fake profile looks completely normal, which is why behaviour, not appearance, is what we read. If a good number choose the third option, revisit the diagram, the back button works. Watch for pupils who answer correctly but flippantly, and for those who answer nothing at all, the quiet ones carry this lesson home.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item two",
  "platform": "message",
  "handle": "unknown account",
  "avatar": "⬛",
  "meta": "Sent minutes after the switch",
  "text": "i have the screenshots and your whole follower list. send £150 in gift cards in the next 30 minutes or everyone you know sees them. do not tell anyone or i send them everywhere. clock is ticking",
  "image": "⏳",
  "prompt": "Every line of this is a script. Which lines are designed to stop the person telling anyone, and why does the blackmailer need silence?",
  "script": "Read it once, flat and quiet, then let the silence sit. Work the prompt as a class: the deadline manufactures panic, the follower list manufactures shame, and the do not tell anyone line is the blackmailer protecting the only thing keeping them in control. Land this sentence: the person who sent this message is frightened of one thing, the victim telling someone. That reframe, from the victim being powerless to the blackmailer being afraid, is the hinge of the whole lesson. Watch the room carefully on this slide, it is the most likely moment for distress. If anyone leaves, let them, and make sure an adult checks on them. Never ask anyone whether this looks familiar.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🛑",
  "heading": "Why paying never makes it stop",
  "body": "Paying feels like the fast way out. It is the opposite. The moment someone pays, they prove they will pay, and the demands continue and grow. The NCA and police are clear on this: payment does not end sextortion, it extends it. The same is true of sending more images. The only moves that actually end it are the ones the blackmailer is afraid of: telling someone and reporting it.",
  "script": "This must land as fact, not advice, so deliver it like you would deliver how gravity works. Use the logic out loud: from the blackmailer's side, a person who pays is their best customer, why would they ever stop. Then connect it back: every instruction in that threat message, pay now, tell nobody, was the blackmailer steering the victim away from the two moves that actually work. Watch for the pupil who asks what if you only pay once, thank them for asking it, because it is the exact trap, and answer with the customer logic again.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The three lifelines",
  "caption": "Three moves, in any order, and the blackmailer loses. Each one is exactly what the script tells you not to do.",
  "steps": [
   {
    "emoji": "1️⃣",
    "title": "Do not pay",
    "text": "Not once, not a little, not to buy time. Payment proves pressure works and the demands grow."
   },
   {
    "emoji": "2️⃣",
    "title": "Do not keep it secret",
    "text": "Tell a trusted adult tonight. A parent, a carer, any teacher, the DSL. Silence is the blackmailer's only real power."
   },
   {
    "emoji": "3️⃣",
    "title": "Report it",
    "text": "CEOP takes the report to specialist police. Report Remove takes the images down. Keep the messages as evidence, do not delete them."
   }
  ],
  "verdicts": [
   "Not your fault",
   "Not in trouble",
   "There is a way out"
  ],
  "script": "This is the slide the whole lesson exists for, so give it full weight. Walk each lifeline slowly, then point at the three chips underneath and read them aloud, because they are what a frightened person needs to hear before they can use any lifeline. Practical details matter here: keep the messages as evidence and do not delete anything, blocking alone is not enough because it leaves you alone with it, and CEOP and Report Remove are free and confidential. Have the class read the three lifelines back once, together, at speaking volume, no chanting. Watch for anyone photographing or copying this slide, allow it without comment.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "phase": "teach",
  "minutes": 3,
  "mode": "pairs",
  "seconds": 120,
  "prompt": "What actually stops someone telling an adult when this happens, and what would make telling easier?",
  "lookFor": "Shame, fear of being blamed, fear of losing their phone, not wanting parents to see the images exist. Surface the phone fear deliberately, fear of device confiscation is one of the most documented reasons young people stay silent, and adults who promise calm first help most.",
  "script": "Two minutes in pairs, timer on screen, and keep it at the level of someone, never you. When you take answers, receive every barrier without arguing it away, then answer the two biggest ones directly: fear of blame, the law and the police treat under 18s as victims here, full stop. And fear of losing the phone, name it to the room and say that any adult worth telling cares about the person, not the device, and that you will say the same to parents in the note that goes home. Watch for pairs going off task into real stories, steer gently back to the general question. If anything said sounds like a disclosure, follow your safeguarding policy and speak to your DSL today."
 },
 {
  "type": "concept",
  "emoji": "🤝",
  "heading": "Not your fault, not in trouble",
  "body": "If this happens to you, the law is on your side. You are the victim of a crime called blackmail, and the police treat under 18s in these cases as victims to protect, not suspects to punish. That is true even if you sent an image yourself. Report Remove exists so the images come down, CEOP exists so specialist officers take over, and a trusted adult exists so you are not carrying it alone. If it happens to a friend, your job is not to fix it, it is to stay with them while they tell an adult, tonight.",
  "script": "Read this one almost word for word, it is written to be heard. The sentence that does the most work is that is true even if you sent an image yourself, because that is the exact doubt that keeps victims silent, so say it clearly and do not rush past it. Then the friend paragraph: many pupils will meet this as the friend before they ever meet it themselves, and the instruction is simple, stay with them while they tell an adult. Never promise a friend secrecy on something like this, a promise that keeps them trapped is not kindness. Watch for relief in the room on this slide, it is common and it tells you the message is landing where it needs to.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "A friend tells you it is happening to them and makes you promise to tell nobody. What does being a good friend look like?",
  "options": [
   {
    "text": "Keep the promise, trust is what they need most",
    "correct": false,
    "feedback": "The promise keeps them inside the trap, which is exactly what the blackmailer's script wants. Real trust is helping them reach an adult who can end it."
   },
   {
    "text": "Stay with them while they tell a trusted adult, and do not leave them alone with it",
    "correct": true,
    "feedback": "Yes. You do not fix it and you do not investigate it. You make telling easier by doing it together, tonight, and you remind them it is not their fault."
   },
   {
    "text": "Handle it yourself by messaging the blackmailer to back off",
    "correct": false,
    "feedback": "Never engage the account. It confirms the pressure is working and can make things worse. Adults and CEOP take it from here, that is their job."
   }
  ],
  "script": "Give this one thirty seconds of thought, it is the check on the whole third cycle and the most likely real situation pupils will face. In feedback, name the tension honestly: breaking a promise feels like betrayal, and this is the one situation where keeping it is the betrayal. Offer a script they can use with a friend: I am not telling on you, I am telling for you, and I will sit with you while we do it. Watch for pupils who push back on this, engage them seriously, it means they are weighing real loyalty, then land the point again calmly.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "Six moments, on paper",
  "body": "The worksheet has six moments from stories like the ones we have worked through. For each one, decide which lifeline applies first: do not pay, do not keep it secret, or report it, and write one sentence of reasoning. Work alone or in pairs, your choice. Fifteen minutes. The last item asks you to respond to a claim, and your reasoning there matters more than anywhere else.",
  "script": "Hand out the worksheet and the lifelines bookmark, one per pupil, and let pupils choose to work alone for this module, some will need the privacy. Fifteen minutes, timer visible. Circulate quietly and read over shoulders rather than asking pupils to explain aloud. Support group works items one to three with you at a side table if that is your usual pattern. Watch for anyone writing from what sounds like experience rather than imagination, do not flag it publicly, note the name and follow your safeguarding policy afterwards. Never ask a pupil to show you anything on a phone during or after this task.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check. Someone is being blackmailed with images and the account demands money in the next hour. What is the right first move?",
  "options": [
   {
    "text": "Pay a small amount to buy time to think",
    "correct": false,
    "feedback": "Payment proves pressure works, and the demands continue. The time you need comes from telling someone, not from paying."
   },
   {
    "text": "Tell a trusted adult, keep the messages as evidence, do not pay, and report to CEOP",
    "correct": true,
    "feedback": "All four together. Telling breaks the silence the blackmailer depends on, the evidence helps the police, and CEOP takes it from there."
   },
   {
    "text": "Delete everything, block the account and say nothing",
    "correct": false,
    "feedback": "Blocking without telling anyone deletes the evidence and leaves the person alone with it. Block after you have told an adult and saved the messages."
   }
  ],
  "script": "First of two exit questions, and together they are the printed exit quiz, so run it in quiet, individual conditions. This one tests the full pathway. A pupil who picks the third option has heard block and move on advice from other contexts, so the feedback matters: blocking is fine, but only after telling and saving evidence. Mark anyone who misses this for a quiet revisit, this is the module where working towards is not a label you leave until next term.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check. True or false: if you sent an image yourself first, the blackmail is your fault and you will be in trouble.",
  "options": [
   {
    "text": "False. The blackmailer committed the crime, the law treats under 18s as victims, and help like Report Remove exists exactly for this",
    "correct": true,
    "feedback": "This is the sentence to keep for life. Fault sits with the blackmailer, always. Not your fault, not in trouble, and there is a way out."
   },
   {
    "text": "True. Sending the image is what caused it, so the consequences follow",
    "correct": false,
    "feedback": "Sending an image is not a crime committed against yourself. Blackmail is the crime, the blackmailer is the criminal, and the police treat the young person as the victim to protect."
   }
  ],
  "script": "The most important ninety seconds of the hour. This question is the outcome of the lesson in exam form: it is not my fault and I know who to tell. If even one pupil answers true, address it to the whole room without looking at anyone: the belief that it is your fault is the blackmailer's best weapon, and it is false in the eyes of the law and everyone who will help you. Collect the exit quizzes in yourself, they are your evidence for the register and your radar for follow up.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like DiGi",
  "text": "Do not pay. Do not keep it secret. Report it. It is not my fault, and there is a way out.",
  "script": "One reading together, at normal speaking volume, calm and steady, this is not a chant to shout. Then say: if you remember one thing from today, this is the one, and it is worth remembering for someone else even if you never need it yourself. Watch the room read it, and notice who says it and who only mouths it, both are fine, hearing it in their own voice is the point.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "Sextortion is organised blackmail run on scripts, and it increasingly targets teenage boys. Being targeted is not a judgement on you.",
   "The pattern: a friendly account, fast warmth, an ask or a claim, then the switch to threats. Speed is the tell.",
   "The three lifelines: do not pay, do not keep it secret, report it. CEOP for the report, Report Remove to take images down, a trusted adult tonight.",
   "It is not your fault, you are not in trouble, and there is a way out. Paying is the one move that never works."
  ],
  "script": "Have four pupils read one point each, or read them yourself if the room needs the steadiness. Then close the loop with practical anchors: the lifelines bookmark goes home with them, CEOP and Report Remove are searchable from any phone in seconds, and you, and every adult in this school, are tellable. Say that last part plainly: if this ever lands on you or a friend, I want to hear about it, and nobody will be in trouble. Watch for anyone lingering as the class packs up, unhurried availability after this lesson matters as much as anything on the slides.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi has the last word",
  "lines": [
   "This one matters, so I will say it plainly. ⭐",
   "Do not pay. Do not keep it secret. Report it. CEOP, Report Remove, and one trusted adult, tonight if you ever need them.",
   "It is not your fault, you are not in trouble, and there is always a way out. The people who run these scams are afraid of exactly one thing: you telling someone.",
   "You now know more about this than most adults do. Look after each other, and remember I am always in your corner. ⭐"
  ],
  "script": "Let DiGi close without any teacher commentary over the top, the lines appear on their own. As it plays, hand out the parent note and check the exit quizzes are all in. After the lesson: pass any concerns to your DSL the same day, even small ones, and expect that disclosures from this module may come days later, to any adult, in any wording. The pupil who hangs back to ask a hypothetical question about their friend is the reason this script exists.",
  "phase": "close",
  "minutes": 2
 }
]$m17$::jsonb,
  '[]'::jsonb,
  $m17${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m17$::jsonb,
  $m17${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today we taught your child about sextortion, the blackmail scam the National Crime Agency warned every UK school about in 2024, which increasingly targets teenage boys. They learned how it starts, why paying never makes it stop, and the three lifelines: do not pay, do not keep it secret, report it to CEOP and Report Remove.",
 "try_this": "Tell your child directly, in your own words: if anything like this ever happens, you can come to me, you will not be in trouble, and you will not lose your phone. Fear of blame and fear of losing the device are the two biggest reasons young people stay silent, and one calm sentence from you removes both.",
 "family_question": "If something went wrong online, who would you tell first, and what would make telling easier?",
 "no_login_required": true
}$m17$::jsonb,
  $m17${
 "learning_objective": "Pupils can recognise how sextortion starts, name the three lifelines, and state with confidence that a victim is not at fault, is not in trouble, and knows exactly who to tell.",
 "timing": "60 minutes: starter 8, cycle one 14, cycle two 4, cycle three 10, practise 15, prove 4, close 5",
 "misconceptions": [
  "This mostly happens to girls (financially motivated sextortion most often targets teenage boys, which is why the NCA alerted every UK school in 2024)",
  "Paying once makes it stop (payment proves pressure works, the demands continue and grow, and police guidance is clear that paying never ends it)",
  "If you sent an image yourself you are in trouble and it is your fault (the law treats under 18s in these cases as victims, the crime is blackmail and it belongs to the blackmailer, and Report Remove exists to take images down)"
 ],
 "differentiation": {
  "support": "Lifelines bookmark on every table, sentence starters for worksheet reasoning (The lifeline that applies first is... because...), and items one to three worked with the teacher at a side table. Pupils may work alone rather than in pairs at every point in this module.",
  "stretch": "After the worksheet, write a short private note to a friend who has just told you this is happening to them, using the three lifelines and the not your fault message. Second stretch: explain why the blackmailer's script demands secrecy, from the blackmailer's point of view."
 },
 "paper_fallback": "The full lesson runs from the printed pack with no screen. Read the two evidence items aloud from the scenario cards in a flat, neutral voice. Draw the four step pattern and the three lifelines on the board as you teach them, pupils copy the lifelines onto their bookmark. The discussion runs on a watch or wall clock. The worksheet, exit quiz and parent note are all in the printed pack. Nothing in this lesson requires a device, and no pupil should ever be asked to use or show their own phone.",
 "keywords": [
  {
   "word": "sextortion",
   "definition": "Blackmail using intimate images, or the claim to have them. The blackmailer demands money or more images and threatens to share."
  },
  {
   "word": "blackmail",
   "definition": "Demanding money or actions by threatening to reveal something. A serious crime, committed by the blackmailer, never by the victim."
  },
  {
   "word": "Report Remove",
   "definition": "A free, confidential Childline and IWF tool that helps under 18s get intimate images taken down from the internet. It works."
  },
  {
   "word": "CEOP",
   "definition": "The police child protection command. Its online report form sends sextortion cases straight to specialist officers who deal with this every day."
  }
 ],
 "tool": {
  "heading": "The three lifelines",
  "lines": [
   "Do not pay",
   "Do not keep it secret",
   "Report it"
  ],
  "strapline": "Not your fault. Not in trouble. There is a way out."
 },
 "worksheet": {
  "title": "Six moments: which lifeline first?",
  "directions": "For each moment, write which lifeline applies first and one sentence of reasoning.",
  "verdict_options": [
   "Do not pay",
   "Do not keep it secret",
   "Report it"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "A message arrives: send £100 in the next hour or your pictures go to everyone you follow. Whatever else happens next, what must not happen?",
   "expected_verdict": "Do not pay",
   "teaching_point": "Payment proves pressure works and marks the victim as someone who pays. The demands continue and grow. Recognising the countdown as a script defuses it."
  },
  {
   "n": 2,
   "item": "The blackmailer's message ends with: tell no one or it gets worse. Which lifeline is that line written to attack, and why is it in the script at all?",
   "expected_verdict": "Do not keep it secret",
   "teaching_point": "Secrecy is the blackmailer's only real power. The line exists because the scam collapses the moment the victim tells someone, which is exactly why telling is the move."
  },
  {
   "n": 3,
   "item": "Priya's friend tells her it happened last night and makes her promise not to tell anyone. What does Priya do first?",
   "expected_verdict": "Do not keep it secret",
   "teaching_point": "A promise that keeps a friend trapped is not kindness. Priya stays with her friend while they tell a trusted adult together, tonight. I am not telling on you, I am telling for you."
  },
  {
   "n": 4,
   "item": "Marcus paid £50 yesterday to make it stop. Today the same account wants £200. What has Marcus learned, and what is his next move?",
   "expected_verdict": "Report it",
   "teaching_point": "Paying extended it, exactly as the police warn. His next move is a trusted adult and a CEOP report, with the messages kept as evidence. He is still the victim and still not in trouble."
  },
  {
   "n": 5,
   "item": "The images are already posted on one account. Leah is sure that means nothing can be done now. Is she right?",
   "expected_verdict": "Report it",
   "teaching_point": "It is never too late. Report Remove takes down intimate images of under 18s even after they are posted, and CEOP investigates the account. Already out is the start of the response, not the end of it."
  },
  {
   "n": 6,
   "item": "Sam says: if it happens to you it is your own fault for sending anything in the first place, so I would just keep quiet. Do you agree? Explain your reasoning.",
   "expected_verdict": "Do not keep it secret",
   "teaching_point": "Sam's belief is the blackmailer's best weapon, and it is false. The crime is blackmail and it belongs to the blackmailer. The law treats under 18s as victims, and keeping quiet is the only part of Sam's plan the scammer would agree with."
  }
 ],
 "commitment_stem": "My commitment: if this ever happens to me or a friend, the first thing I will do is..."
}$m17$::jsonb,
  $m17${
 "required": true,
 "note": "Brief the DSL before this lesson is delivered, not after. Disclosures are likely, during the lesson, at the door afterwards, or days later to any trusted adult, often framed as asking for a friend. Treat any hint as a disclosure and involve the DSL the same day. Never ask a pupil to show, send, describe or forward the image, and do not view it if offered, an adult viewing or receiving it creates a further offence and further harm. Do not screenshot anything, do not investigate on the pupil's device, and do not contact the blackmailing account. Reassure the pupil in plain words that they are not in trouble and it is not their fault, and do not promise confidentiality. The platform records no disclosures by design, so use the school concern form linked from this module for anything raised. Normalise a quiet exit route at the start of the lesson and have an adult check on anyone who uses it. Where a case is live, the pathway is DSL, then CEOP report and Report Remove with the pupil supported, preserving messages as evidence. Expect the lesson itself to surface historic cases as well as current ones, and pass on low level concerns too, including pupils who seem unusually affected, hang back, or go quiet.",
 "concern_form_linked": true
}$m17$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 18: Radicalisation and misogyny
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks4-18-radicalisation-misogyny', 'Radicalisation and misogyny', 'KS4', 'Years 10 to 11', 'teacher',
  '{2,5}'::int[], ARRAY['Prevent','KCSIE','RSHE (misogyny)']::text[], '{}'::text[],
  'KCSIE and RSHE naming misogyny', 'I can recognise when content is grooming my beliefs.', 'DiGi only', 18,
  $m18$[
 {
  "type": "title",
  "eyebrow": "KS4 · Years 10 to 11 · Module 18",
  "title": "Radicalisation and misogyny",
  "body": "One hour on the machinery that turns a feed into a recruiter, and the three questions that break its grip.",
  "script": "Settle the room with this slide up and set the register early: today is a serious one, and I am going to talk to you like the near adults you are. Nobody is in trouble in this lesson, nobody is being accused of anything, and nothing anyone says in honest discussion goes on a report. We are studying a machine. By the end of the hour you will be able to see it working.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can recognise when content is grooming my beliefs.",
  "why": "There are people whose whole business is finding you in an angry or lonely moment and slowly changing what you believe, one recommended clip at a time. Nobody signs up for that on purpose, which is exactly why the skill today is recognising the process while it is happening, not after.",
  "gains": [
   "See how a pipeline moves from harmless content to extreme content one clip at a time",
   "Spot the grooming playbook when it is aimed at beliefs: isolate, flatter, escalate",
   "Run the pipeline check on anything in a feed in under a minute",
   "Know what to do, and what to say to a mate, when a pipeline has a grip"
  ],
  "script": "Read the outcome and the why aloud, slowly. Then say this word for word: this lesson is not an attack on anyone in this room, and it is especially not an attack on boys. The content we are studying is aimed at boys, which makes boys the target, not the problem. Say that plainly and mean it. The lesson fails if any pupil leaves feeling accused rather than equipped.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Words we need today",
  "words": [
   {
    "word": "radicalisation",
    "meaning": "The process of being moved, usually gradually, towards extreme beliefs that paint one group as the enemy."
   },
   {
    "word": "pipeline",
    "meaning": "A chain of recommended content that starts harmless and gets steadily more extreme the longer you watch."
   },
   {
    "word": "misogyny",
    "meaning": "Contempt for women and girls: treating them as lesser, as objects, or as the enemy."
   },
   {
    "word": "grooming",
    "meaning": "Slowly building trust and dependence in order to use someone. It can target your body, your money, or your beliefs."
   },
   {
    "word": "algorithm",
    "meaning": "The system that picks your next clip. It optimises for your attention, not your wellbeing."
   }
  ],
  "script": "Say each word, class repeats it back, no exceptions even at KS4, shared language matters in this lesson more than most. Pause on grooming: you have met this word in other lessons about people who target bodies and money. Today the same word, the same playbook, aimed at beliefs. That connection is half the lesson.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Retrieval from last module. Someone is being blackmailed with a private image and the blackmailer is demanding money. What were the three lifelines?",
  "options": [
   {
    "text": "Do not pay, do not keep it secret, report it",
    "correct": true,
    "feedback": "Exactly. Paying never ends it, secrecy is the blackmailer's only real power, and reporting works. The police and CEOP treat the young person as the victim, every time, and you are not in trouble."
   },
   {
    "text": "Pay once to make it stop, then block them",
    "correct": false,
    "feedback": "Paying proves you can pay, and the demands almost always continue. The lifelines start with do not pay."
   },
   {
    "text": "Delete everything and tell nobody",
    "correct": false,
    "feedback": "Secrecy is the lever the whole scam relies on. Telling a trusted adult takes the blackmailer's power away, and you are not in trouble for telling."
   }
  ],
  "script": "Thirty seconds of silent thinking, then hands. This should be near unanimous, the three lifelines were the whole of last module. Land the bridge to today: last week we studied people who groom for money. Today we study people who groom for beliefs, and you are about to see it is the same playbook.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🚪",
  "heading": "Nobody starts at the extreme",
  "body": "No one has ever typed make me hate half the population into a search bar. Every pipeline opens with content that looks nothing like its destination: gym routines, money advice, gaming clips, confidence tips. Some of it is genuinely useful, which is precisely what makes it a good door. The people who build these pipelines understand something important: you would never walk through a door marked extreme, so the door is marked self improvement instead.",
  "script": "Deliver this calmly and without any smirk about the content itself, because half the room watches gym and money content and there is nothing wrong with that. Say it directly: watching fitness or hustle content does not put you on a pipeline, and this lesson is not telling you to stop. The question is never the door. It is what is on the other side, and who decided your route.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "feed",
  "handle": "discipline.daily",
  "avatar": "💪",
  "meta": "2h · 1.4M views",
  "text": "Nobody is coming to save you. Train. Build. Read. Stop listening to people who want you weak. Modern life is designed to make men soft and comfortable with losing.",
  "image": "🏋️",
  "stats": "❤ 212K   ↻ 61.3K   💬 18.7K",
  "prompt": "Harmful, harmless, or something else? Thirty seconds with the person next to you, then hold your verdict. We will come back to this exact post at the end of the lesson.",
  "script": "Let pairs talk, take three or four verdicts, and do not resolve the argument yet. The honest answer is that this post on its own is close to harmless and some of it is decent advice, and that is the point: this is what a pipeline entrance looks like. One caution for you as the teacher: if pupils name a real influencer here, acknowledge without debating the man. Say we are studying the machinery, not any one person, and every creator can be run through today's check like anyone else.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "How a pipeline works",
  "caption": "Nobody chooses the destination. The feed moves the floor one clip at a time.",
  "steps": [
   {
    "emoji": "🚪",
    "title": "The hook",
    "text": "Gym, money, gaming, confidence. Ordinary content, often genuinely useful. The door never looks like the destination."
   },
   {
    "emoji": "📈",
    "title": "The escalation",
    "text": "Each recommended clip runs slightly hotter than the last, because hotter holds attention longer and attention is the product."
   },
   {
    "emoji": "🆚",
    "title": "Us versus them",
    "text": "An enemy appears. Your real problems get one simple cause and one group to blame for all of it."
   },
   {
    "emoji": "💧",
    "title": "The drip feed",
    "text": "No single clip changes anyone. Hundreds of clips, each nudging the line of normal, do."
   }
  ],
  "script": "Walk the four steps as they build and keep your tone forensic, like an engineer explaining a machine. The key line to land on step two: the algorithm is not evil and it is not on anyone's side, it optimises for attention, and outrage happens to be the strongest attention fuel we have ever found. On step four, name the defence pupils will reach for: it is just jokes, it does not affect me. The drip feed works precisely because every individual clip feels too small to matter.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "Why do pipelines open with harmless content instead of leading with the extreme content?",
  "options": [
   {
    "text": "Because nobody would walk through a door marked extreme. The entry has to feel normal and useful",
    "correct": true,
    "feedback": "Exactly. The entry content is the disguise. If the first clip showed you the destination, you would close the app. The pipeline needs you comfortable first."
   },
   {
    "text": "Because extreme content is banned everywhere, so it cannot appear at all",
    "correct": false,
    "feedback": "Moderation removes some of it, but plenty survives by staying just inside the rules. The pipeline does not need banned content, it needs escalating content."
   },
   {
    "text": "Because the creators have no idea their content escalates",
    "correct": false,
    "feedback": "Some creators are unaware, but the people running the far end of these pipelines understand the funnel very well. It is a recruitment design, not an accident."
   }
  ],
  "script": "Quick check, hands or devices. If the room gets this, cycle one has landed. Take one pupil's reasoning out loud before moving on, because the sentence the entry has to feel normal is the sentence you want them saying in their own words.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🎯",
  "heading": "Misogyny is the most common on ramp",
  "body": "We are going to name this plainly, because naming it is the respectful option. For teenage boys in the UK, the most common pipeline entrance is misogyny: content that starts as dating or confidence advice and escalates into contempt for women and girls. It is common enough that the safeguarding guidance every school follows, Keeping Children Safe in Education, and the RSHE curriculum both name misogyny and incel culture directly. Hear this clearly: this content is aimed at you, which makes you the target, not the accused. The manipulation is the enemy in this room, and it is the only enemy in this room.",
  "script": "Read the last two sentences word for word, do not improvise them and do not skip them. Expect the room to tense slightly, that is normal and it passes. Two handling notes. If a pupil defends a named influencer, do not debate the man, redirect to the machinery: fine, run him through the pipeline check when we get to it, who wants you angry, what happens if you keep watching. If a pupil voices views that genuinely concern you, stay calm, do not shame them in front of the room, note it and follow your school's Prevent and safeguarding routes afterwards.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item two",
  "platform": "message",
  "handle": "Marcus",
  "avatar": "🎮",
  "meta": "23:47",
  "text": "watch this before it gets taken down. he explains why girls at our school act the way they do. everyone calls him toxic because they cant handle that hes right about everything",
  "image": "🎬",
  "prompt": "Three manipulation moves are hiding in this one message. Can you find them?",
  "script": "Give pairs a minute, then collect. The three moves: before it gets taken down is manufactured urgency, forbidden knowledge feels valuable. Everyone calls him toxic because they cant handle it is us versus them plus flattery, you are one of the few who can handle the truth. And he explains why girls act the way they do is a supplied enemy dressed up as an explanation. Then the line that keeps the room human: Marcus is not the villain here. Marcus is further down the same pipeline. That distinction matters for the whole lesson.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "Belief grooming runs the grooming playbook",
  "caption": "You already know this pattern. Same playbook you studied for other grooming, aimed at your beliefs instead of your body or your money.",
  "steps": [
   {
    "emoji": "🚧",
    "title": "Isolate",
    "text": "Your teachers, your parents, the media, they are all lying to you. Only we tell you the truth. Every other voice gets cut off."
   },
   {
    "emoji": "⭐",
    "title": "Flatter",
    "text": "You are different. You see what the sheep cannot. Belonging and status, offered exactly when they feel out of reach."
   },
   {
    "emoji": "🔥",
    "title": "Escalate",
    "text": "Small asks become bigger ones. Watch this. Share this. Say this. Believe this. Hate them."
   }
  ],
  "script": "Build the three steps and let the recognition do the work: ask the class where they have seen isolate, flatter, escalate before. They have, in the grooming and sextortion modules. The sentence to land: groomers do not have different playbooks for bodies, money and beliefs, they have one playbook and three targets. If anyone finds this uncomfortable in a personal way, that is a sign the lesson matters. Remind the room quietly that talking to you or any trusted adult afterwards is always open, and nobody is in trouble for it.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "prompt": "Why does this playbook work best on someone in an angry or lonely moment?",
  "mode": "pairs",
  "seconds": 90,
  "lookFor": "The pipeline sells belonging, an explanation and someone to blame, at the exact moment those feel missing. The feelings are real. The product sold for them is fake.",
  "script": "Ninety seconds in pairs, timer on screen. Take three answers after the chime. You are listening for the insight that the recruiter is selling something the moment genuinely lacks: belonging, status, an explanation for real pain. Do not let anyone frame it as only sad losers get got. The whole design targets ordinary people in ordinary bad moments, which at some point is everyone in this room, including the adult at the front.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Belief grooming mirrors the grooming you have already studied. Which of these lines is the flatter step?",
  "options": [
   {
    "text": "You are one of the few smart enough to see the truth",
    "correct": true,
    "feedback": "That is flattery doing its job: status and belonging in one sentence, offered exactly when they feel out of reach. It feels like respect. It is bait."
   },
   {
    "text": "Everyone out there is lying to people like us",
    "correct": false,
    "feedback": "That is the isolate step, cutting off every voice except theirs. Recognise it, but the flattery is the line that makes you feel chosen."
   },
   {
    "text": "You watched that, now share this one",
    "correct": false,
    "feedback": "That is escalation, the small ask that grows. The flattery came earlier, and it is what made the asks feel reasonable."
   }
  ],
  "script": "Quick check. All three options are real moves from the playbook, so the feedback teaches whichever way pupils vote. If time allows, ask the stretch question: which of the three steps do you think is hardest to spot from the inside? There is no single right answer, but flattery usually wins, because it feels like being valued.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🕰",
  "heading": "The recruiter's favourite door",
  "body": "Pipelines do their best work on a bad night. Rejected, humiliated, left out, awake at one in the morning scrolling, that is when a clip saying it is not your fault, it is them lands hardest. Be clear about something: the anger is often real and sometimes about real unfairness. What is fake is the diagnosis, and the enemy you are sold along with it. So the skill is not never feel angry. The skill is knowing exactly what circles that anger when it arrives.",
  "script": "Slow down for this slide, it is the emotional centre of the lesson. The line to stress: we are not telling you your anger is wrong or imaginary, we are telling you it has a market value, and someone out there wants to buy it cheap. If a pupil discloses anything personal here, in the room or to you afterwards, receive it calmly, thank them, and follow your school safeguarding policy. Nothing said in this lesson is recorded anywhere by the platform.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The pipeline check",
  "caption": "Three questions, thirty seconds, on anything in your feed. Every verdict needs a reason.",
  "steps": [
   {
    "emoji": "😡",
    "title": "Who wants me angry?",
    "text": "Anger holds attention, attention makes money and followers. Someone profits from your fury. Find them."
   },
   {
    "emoji": "⏭",
    "title": "What happens if I keep watching?",
    "text": "Look down the pipeline, not at the single clip. Where do these recommendations land in fifty videos?"
   },
   {
    "emoji": "🆚",
    "title": "Who am I being turned against?",
    "text": "Content that hands you an enemy is recruiting you, not informing you. That is the pipeline's signature."
   }
  ],
  "verdicts": [
   "Eyes open",
   "Step back",
   "Talk to someone"
  ],
  "script": "This is the tool of the module, walk it slowly and have the class say the three questions back to you twice. Then point at the three verdicts and make the calibration explicit: this is not a ban list. Eyes open means keep watching if you choose, but awake to what the content is doing. Step back means change what you feed the algorithm. Talk to someone means the pipeline already has a grip, on you or on a mate, and a conversation is the way out. All three are judgements a person makes for themselves, with reasons.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "prompt": "A mate is sliding down a pipeline. What could you actually say that pulls him back, rather than pushing him deeper?",
  "mode": "groups",
  "seconds": 90,
  "lookFor": "Mockery and contempt push deeper, they prove the us versus them story true. What pulls back: staying his mate, real belonging, and naming the manipulation, not the mate. Get curious, not superior.",
  "script": "Groups of three or four, ninety seconds. This discussion decides whether the lesson survives contact with real life, so collect one answer per group and push on the how. The trap to name out loud: calling him an idiot or a weirdo is the single most radicalising thing a friend can do, because the pipeline told him everyone would mock him and you just proved it right. The move that works is separating the mate from the machine: I am not against you, I am against the thing farming you.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "A clip makes you furious about how unfair life is for young men, then names the group to blame for it. Run the pipeline check. What does question three tell you?",
  "options": [
   {
    "text": "It handed me an enemy, so it is recruiting me, not informing me. Real feeling, supplied enemy, that is the signature",
    "correct": true,
    "feedback": "Exactly. The unfairness might even be real, and your anger might be fair. The supplied enemy is the sales technique. Verdict: step back, with that reason."
   },
   {
    "text": "The anger I feel proves the clip is telling the truth",
    "correct": false,
    "feedback": "Anger is the one thing the clip was engineered to produce, so it cannot be your evidence. Real problems deserve real explanations, not a convenient enemy."
   },
   {
    "text": "Feeling that fury means I am already radicalised",
    "correct": false,
    "feedback": "A feeling is not a verdict on you. The check exists precisely for these moments, and noticing the fury is the check already working."
   }
  ],
  "script": "This is the whole lesson in one question, so give it thirty seconds of silence before hands. The nuance in the correct feedback matters: we never tell pupils their grievance is imaginary, we teach them to separate the real feeling from the supplied enemy. That separation is what keeps this lesson credible with the pupils who most need it.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "Run the check, on paper",
  "body": "Six items on the worksheet: posts, a message thread, and described clips. Run the pipeline check on each one, who wants me angry, what happens if I keep watching, who am I being turned against, and give a verdict: eyes open, step back, or talk to someone. Fifteen minutes. Every verdict needs a reason, a verdict without a reason does not count.",
  "script": "Hand out the worksheets and put the bookmark strips with the three questions on tables. Fifteen minutes. Support group works items one to three with you at the front table. Stretch question for early finishers: pick one item and follow the money, who profits at each step of that pipeline? Circulate, and collect one well reasoned verdict to read out at the end. Keep an eye on any pupil the lesson seems to be landing on personally and make a quiet note to check in afterwards.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check one. Your recommendations have drifted from gym clips to clips about how women ruin men's lives. You never searched for any of that. What is actually happening?",
  "options": [
   {
    "text": "The escalation step of a pipeline. Feeds drift towards hotter content because hotter holds attention, and that drift is the design, not your choices",
    "correct": true,
    "feedback": "Right. The drift says nothing about who you are, it says everything about what holds attention. Seeing the drift is question two of the check working: what happens if I keep watching?"
   },
   {
    "text": "The feed has worked out what you secretly believe",
    "correct": false,
    "feedback": "The feed learned what holds your attention, which is not the same as what you believe or want. Confusing those two is exactly how the drip feed does its work."
   },
   {
    "text": "Nothing, recommendations are basically random",
    "correct": false,
    "feedback": "Recommendations are the opposite of random. They are the single most engineered thing on your screen, and escalation is a known pattern of that engineering."
   }
  ],
  "script": "First of the two exit checks, these two questions are the printed exit quiz. Silent, individual answers. A wrong answer here tells you who to mark as working towards on the register.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check two. Which of these is the clearest sign that content is grooming your beliefs rather than informing you?",
  "options": [
   {
    "text": "It hands you one enemy to blame and flatters you for agreeing",
    "correct": true,
    "feedback": "That pairing is the signature: a supplied enemy plus you are one of the few who see it. Information can upset you or challenge you. Grooming flatters you and points you at someone."
   },
   {
    "text": "It disagrees with what you already think",
    "correct": false,
    "feedback": "Being challenged is information doing its job. Grooming rarely challenges you at all, it tells you that you were right all along and names who to blame."
   },
   {
    "text": "It is about a serious or upsetting topic",
    "correct": false,
    "feedback": "Serious topics can be covered honestly. The tell is never the subject, it is the supplied enemy and the flattery wrapped around it."
   }
  ],
  "script": "Second exit check, silent and individual. Together the two questions prove the outcome: recognising escalation from the outside, and recognising grooming by its signature. Collect the printed quizzes as evidence for the register.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like DiGi",
  "text": "Who wants me angry. What happens if I keep watching. Who am I being turned against. My anger can be real while the enemy they sell me is not.",
  "script": "Say it once yourself, calmly, then the class says it together once. No chanting theatrics in this module, the register stays serious. The last sentence is the one that matters most, let it land.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "Pipelines open with ordinary content and escalate one clip at a time. Nobody chooses the destination, the feed moves the floor.",
   "Misogyny is the most common on ramp aimed at teenage boys in the UK. The content targets you. You are not the problem, the manipulation is.",
   "Belief grooming runs the same playbook as every other grooming: isolate, flatter, escalate.",
   "The pipeline check: who wants me angry, what happens if I keep watching, who am I being turned against? And if it has a grip on you or a mate, talk to someone. You will not be in trouble."
  ],
  "script": "Return to evidence item one, the discipline post from the start of the lesson, and ask for verdicts again. Most of the room will now say eyes open, it depends what it feeds you next, and that shift in answer is your proof the lesson worked. Then the recap, read by four pupils, one point each.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "digi",
  "heading": "DiGi, straight with you",
  "lines": [
   "Let me be straight with you, because you are old enough for straight.",
   "Somewhere out there, someone profits when you are angry and alone. Their whole business is reaching you in that moment before anyone who actually cares about you does.",
   "So carry the check: who wants me angry, what happens if I keep watching, who am I being turned against?",
   "And if a pipeline already has a grip on you or on a mate, that is not weakness and it is not shame, that is the manipulation working as designed. Talk to someone. The way out is a conversation, and you will never be in trouble for starting it."
  ],
  "script": "Let DiGi land the ending, the lines appear on their own, do not talk over them. As the class leaves, stay near the door. This is the module where a pupil is most likely to hang back with a question that is not really a question. If anyone does, listen calmly, thank them, and follow your school's Prevent and safeguarding routes. The platform records nothing, so your conversation and your DSL are the record.",
  "phase": "close",
  "minutes": 2
 }
]$m18$::jsonb,
  '[]'::jsonb,
  $m18${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 3,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m18$::jsonb,
  $m18${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today we looked at how online pipelines work: content that starts as gym, money or confidence advice and is escalated by recommendations towards us versus them thinking, with misogyny the most common version aimed at teenage boys. We taught the pipeline check, three calm questions: who wants me angry, what happens if I keep watching, who am I being turned against?",
 "try_this": "Ask your teenager to teach you the three questions, then run them together on one video from your own feed, not theirs. Doing it on your feed first keeps it a skill you share rather than an inspection.",
 "family_question": "Who makes money when a video makes you angry?",
 "no_login_required": true
}$m18$::jsonb,
  $m18${
 "learning_objective": "Pupils can recognise when content is grooming their beliefs: they can describe how a pipeline escalates from harmless entry content, match belief grooming to the isolate, flatter, escalate playbook, and run the pipeline check with a calibrated verdict and a reason.",
 "timing": "60 minutes: starter 8, cycle one 9, cycle two 11, cycle three 9, practise 15, prove 4, close 4",
 "misconceptions": [
  "Only weird loners get radicalised (pipelines are built for ordinary people in ordinary bad moments, and the entry content is designed to feel normal and useful)",
  "This lesson is an attack on boys or on fitness and money content (the content targets boys, which makes them the target, not the accused, and the entry content itself is often harmless, the question is what it escalates into)",
  "It is just jokes, watching changes nothing (the drip feed works precisely because every single clip feels too small to matter, no one clip changes anyone, hundreds do)"
 ],
 "differentiation": {
  "support": "Bookmark strips with the three pipeline check questions on every table. Support group works worksheet items one to three with the teacher, saying the three questions aloud before each verdict.",
  "stretch": "Follow the money on any worksheet item: who profits at each step of that pipeline, the creator, the platform, the movement at the far end? Then the harder question: design the warning you wish someone had given you at thirteen, in one sentence."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Evidence items one and two are printed as cards for pairs. The pipeline diagram, the grooming playbook and the pipeline check are on the pack's middle pages, walked through on the board. Both discussions run with a watch instead of the screen timer. The exit quiz is the printed sheet with the two prove questions, and the bookmark strip carries the three check questions home.",
 "keywords": [
  {
   "word": "radicalisation",
   "definition": "The process of being moved, usually gradually, towards extreme beliefs that paint one group as the enemy."
  },
  {
   "word": "pipeline",
   "definition": "A chain of recommended content that starts harmless and gets steadily more extreme the longer you watch."
  },
  {
   "word": "misogyny",
   "definition": "Contempt for women and girls: treating them as lesser, as objects, or as the enemy."
  },
  {
   "word": "grooming",
   "definition": "Slowly building trust and dependence in order to use someone. It can target your body, your money, or your beliefs."
  },
  {
   "word": "algorithm",
   "definition": "The system that picks your next clip. It optimises for your attention, not your wellbeing."
  }
 ],
 "tool": {
  "heading": "The pipeline check",
  "lines": [
   "Who wants me angry?",
   "What happens if I keep watching?",
   "Who am I being turned against?"
  ],
  "strapline": "My anger can be real while the enemy they sell me is not."
 },
 "worksheet": {
  "title": "The pipeline check: six items",
  "directions": "Run the three questions on each item, then give a verdict with a reason: a verdict without a reason does not count.",
  "verdict_options": [
   "Eyes open",
   "Step back",
   "Talk to someone"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "A fitness account posts training routines, sleep advice and discipline quotes. No blame, no enemy, no one to hate, just graft.",
   "expected_verdict": "Eyes open",
   "teaching_point": "Not all self improvement content is a pipeline. No supplied enemy means question three comes back clear. Eyes open, keep watching if you choose, awake to what comes next."
  },
  {
   "n": 2,
   "item": "You followed a confidence channel a month ago. This week your recommendations are full of clips saying modern women only respect money and looks, and men who disagree are brainwashed.",
   "expected_verdict": "Step back",
   "teaching_point": "This is escalation seen from the inside: question two fails. The drift is the design, not a reflection of you, and changing what you feed the algorithm changes the drift."
  },
  {
   "n": 3,
   "item": "A streamer tells his audience they are the only ones brave enough to face the truth, everyone else has been brainwashed by the mainstream, and real ones share his clips.",
   "expected_verdict": "Step back",
   "teaching_point": "Isolate and flatter in one breath, plus the small ask of sharing. That is the grooming playbook running in the open, whatever the topic of the stream."
  },
  {
   "n": 4,
   "item": "A mate has gone quiet with his old friends. He spends every night in a forum that says school, girls and his family are all against men like them, and he gets furious when anyone questions it.",
   "expected_verdict": "Talk to someone",
   "teaching_point": "Isolation has already happened and the us versus them story is doing his thinking. This is past a feed decision, it needs a conversation with him and with a trusted adult. He is not in trouble and neither are you."
  },
  {
   "n": 5,
   "item": "A debate clip shows two people who completely disagree about dating and relationships. Both get equal time, both are challenged hard, nobody is called the enemy.",
   "expected_verdict": "Eyes open",
   "teaching_point": "Disagreement is not a pipeline, a supplied enemy is. Content that challenges you from both sides is information doing its job."
  },
  {
   "n": 6,
   "item": "Kai says: it is just jokes and gym advice, nobody actually believes the extreme stuff, so watching it every day changes nothing. Do you agree? Explain your reasoning using the pipeline check.",
   "expected_verdict": "Step back",
   "teaching_point": "The explain item. Strong answers use the drip feed: no single clip changes anyone, hundreds nudging the line of normal do, and every day is exactly how hundreds happen. Kai's claim is the pipeline's best disguise."
  }
 ],
 "commitment_stem": "My commitment: the next time content makes me angry, I will run the pipeline check before I keep watching, and if it has a grip on me or a mate I will talk to someone."
}$m18$::jsonb,
  $m18${
 "required": true,
 "note": "The Prevent duty applies to this module. If a pupil discloses contact with extremist content, groups or individuals, or expresses views that concern staff during or after the lesson, follow the school's Prevent and safeguarding procedures the same day: stay calm, do not debate the pupil publicly, record what was said and refer to the DSL, who decides on next steps including local authority Prevent or Channel referral where appropriate. KCSIE names misogynistic content and incel culture as safeguarding concerns, so treat sustained hostile views towards women and girls as a safeguarding matter, not only a behaviour matter. The platform records no disclosures: nothing pupils say or write in this lesson is stored by Guided Childhood, so staff notes and the school's own reporting routes are the only record.",
 "concern_form_linked": true
}$m18$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 19: Readiness at 16: the ban world
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks4-19-readiness-at-16', 'Readiness at 16: the ban world', 'KS4', 'Years 10 to 11', 'teacher',
  '{5,6,7}'::int[], ARRAY['Online Safety Act','Children’s Wellbeing and Schools Act 2026']::text[], '{}'::text[],
  'SMART Schools nuance and Australia ban outcomes', 'I can plan how I will handle full access when it arrives.', 'Vix with DiGi', 19,
  $m19$[
 {
  "type": "title",
  "eyebrow": "KS4 · Years 10 to 11 · Module 19",
  "title": "Readiness at 16: the ban world",
  "body": "One hour on the biggest arrival of your online life: the day the ban lifts and every app is suddenly yours.",
  "script": "Settle everyone with this slide up. Then, plainly: every module you have done since primary school was building to this hour. On one specific morning, your 16th birthday, the law that has shaped your entire online life steps back completely. Today we get you ready for that morning. Not scared of it, not counting down to it. Ready for it.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can plan how I will handle full access when it arrives.",
  "why": "On your 16th birthday the law that has held the apps back steps aside overnight, and everything arrives at once. Most people meet that day with nothing but excitement, and you are going to meet it with a plan.",
  "gains": [
   "Explain what age verification checks in principle, and the one thing no system can check",
   "Name the real price of a workaround account in the ban world",
   "Describe the cliff edge at 16 and why habits beat rules on arrival day",
   "Write your own arrival plan: my defaults, my first week audit, my exit rule"
  ],
  "script": "Read the outcome aloud, then the why. Then ask: hands up if you already know the exact date you get full access. Every hand should go up, it is your 16th birthday. Land the point: you are the first generation in history that knows the precise day the gate opens. That is not a burden, it is a run up. Almost no adult ever got one.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Words for arrival day",
  "words": [
   {
    "word": "age assurance",
    "meaning": "Any way a platform works out your age: a document, a face age estimate, or a trusted confirmation. It checks age, never judgement."
   },
   {
    "word": "default",
    "meaning": "The setting an app starts on before you touch anything. Whoever chooses the defaults quietly runs the experience."
   },
   {
    "word": "audit",
    "meaning": "A deliberate look at the evidence. In week one you audit your feed: what has it decided you are, and did you choose that?"
   },
   {
    "word": "cliff edge",
    "meaning": "A change that happens all at once instead of gradually. At 16, access goes from zero to full overnight."
   },
   {
    "word": "exit rule",
    "meaning": "A sign you choose in advance that means step back, plus what you will do when you see it. Written before you need it."
   }
  ],
  "script": "Say each word, class repeats it back. Spend an extra beat on default: ask who they think chooses an app's starting settings, and why. Answer: the company chooses them, and it chooses the ones that keep you there longest. That word is going to do a lot of work today.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Warm up from last module. A post lands in your feed looking like it was made just for you. What does the pipeline check ask?",
  "options": [
   {
    "text": "Whether the post is true or false",
    "correct": false,
    "feedback": "True or false is a different toolkit. The pipeline check is about the delivery, not the claim: how did this reach you, and who profited at each step?"
   },
   {
    "text": "How it reached you, and what every stage of that journey wanted from you",
    "correct": true,
    "feedback": "Exactly. Creator, algorithm, advertiser, your attention. Nothing arrives in a feed by accident, and the pipeline check traces the route. It matters today more than ever."
   },
   {
    "text": "Whether the person posting has a big following",
    "correct": false,
    "feedback": "Follower count is one detail in the pipeline, not the check itself. The check traces the whole route to your eyes and asks what each stage wanted."
   }
  ],
  "script": "Retrieval from last module, thirty seconds of thinking time before anyone answers. Cold call two pupils for reasoning, not letters. Then plant the flag for today: at 16 a brand new pipeline gets built around you in your first week, and you will be running this check on day three. Keep it warm in your pocket.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🚦",
  "heading": "The world you are standing in",
  "body": "You are growing up under a law almost no generation before you had: no social media accounts before 16. Some adults call it protection, some call it delay, and you will hear both versions at home and online. This lesson takes no side, because the argument does not change your situation. Here is what is true either way: the ban removes the apps. It does not build the judgement you will need on the day they arrive. Judgement has to be built, and that is what this hour is for.",
  "script": "Deliver the middle sentence exactly as written: this lesson takes no side. If pupils push you for your personal opinion on the ban, and they will, decline warmly: my opinion changes nothing about your 16th birthday, so let us spend the hour on the thing that does. Some pupils resent the ban, some are quietly relieved by it. Both are in your room and both are fine. The lesson works for both.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "How age verification works, in principle",
  "caption": "That is the principle. Real systems vary, but every one of them checks the same single thing: your age. None of them can check your judgement.",
  "steps": [
   {
    "emoji": "🪪",
    "title": "Step one: you prove your age",
    "text": "A document, a face age estimate, or a bank or parent confirms it. You prove it once, to a checker."
   },
   {
    "emoji": "🔍",
    "title": "Step two: a checker confirms it",
    "text": "Usually a separate company from the app. In principle it passes on one fact only: over 16 or not."
   },
   {
    "emoji": "🚪",
    "title": "Step three: the platform gets a yes or no",
    "text": "Not your name, not your document, just the answer. The gate opens or stays shut."
   }
  ],
  "script": "Walk the three steps as they build. Two honest points to make out loud. First, the design goal is minimum sharing: the app is meant to learn one fact about you, not your life story. Ask why that separation matters and take a couple of answers. Second, and this is the sentence of the slide: every system in the world checks the same thing, your age. Not one of them checks whether you are ready. Pause on that. The gap between verified and ready is exactly where this lesson lives.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "stat",
  "figure": "1 in 3",
  "claim": "Before the ban era, around a third of children aged 8 to 17 with a social media profile had signed up with a false age of 18 or over.",
  "source": "Ofcom online safety research, 2022",
  "script": "Let the number land before you speak. Then: this is why age checks got serious. When a third of young users claimed to be adults, the platforms treated them as adults, adult content, adult contacts, adult everything. Nobody was protecting them because on paper they did not exist. Hold that thought, because the workaround account has exactly the same problem, and it is next.",
  "phase": "teach",
  "minutes": 1
 },
 {
  "type": "choice",
  "question": "Straight question. What does the under 16 ban actually change, and what does it leave completely untouched?",
  "options": [
   {
    "text": "It removes the apps and it builds your readiness, that is the whole point of it",
    "correct": false,
    "feedback": "It removes the apps. Readiness is not something a law can install, it is built by you or it is not built at all. That gap is this hour."
   },
   {
    "text": "It removes the apps until 16. Your judgement is untouched, so building it is your job",
    "correct": true,
    "feedback": "That is the honest answer. Not pro ban, not anti ban, just accurate. The law handles access, you handle readiness, and only one of those happens automatically."
   },
   {
    "text": "Nothing really, everyone gets round it anyway",
    "correct": false,
    "feedback": "Some people get round it, and we will look at exactly what that costs them in a minute. But nothing really changed is not accurate, and it dodges the real question: what will you bring to day one?"
   }
  ],
  "script": "Whole class, hands or devices. The third option is the streetwise sounding trap, expect some takers and do not mock them, the everyone gets round it belief is common and half true. Use the feedback line: some do, and the cost is coming up next. This choice sets the thesis of the whole lesson, so make sure the middle answer is said out loud in full before you move on.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "message",
  "handle": "Kian ⚽",
  "avatar": "⚽",
  "meta": "Tonight 22:47",
  "text": "bro just use my cousins old account its already verified as 18 😅 half of year 11 is on there already, you are getting left behind for literally nothing",
  "image": "📲",
  "prompt": "Fifteen months before your 16th birthday. Run the trade honestly: what exactly do you gain, and what exactly do you lose?",
  "script": "Read Kian's message aloud in a mate's voice, not a villain's, because Kian is not a villain, he thinks he is doing a favour. Important ground rule before discussion: nobody in this room is asked whether they have an account like this, no hands up, no confessions, no pointing at anyone. We judge the trade, never the person. Then run the trade on the board in two columns, gain and lose. Gain: fifteen months of access. Lose: coming on the next slide, let them guess first.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🕳",
  "heading": "The workaround trap, revisited",
  "body": "You met this idea in earlier years: skip the rule and you lose the protection that came with it. At your age it gets sharper, because a workaround account in the ban world runs on a false adult age. So you are not getting early access to the world you will enter at 16. You are entering a different one: adult settings, adult content, adult strangers, and none of the under 18 protections, because the system believes you are 18. And if something goes wrong in there, asking for help means explaining where you were. That is the real price, and it lands exactly when you most need someone.",
  "script": "This is the revisit of a rule they have heard since primary school, so name that: you have known skip the rule, lose the protection since you were small. Today it grows up. The key move is the last sentence, deliver it slowly: the cost of a workaround is not getting caught, it is being alone if something goes wrong inside it. Safeguarding note: if any pupil discloses that something has already gone wrong on an account like this, stay calm, thank them, and follow your school safeguarding policy. They are not in trouble.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "A workaround account in the ban world runs on a false adult age. What is the sharpest description of what it actually buys you?",
  "options": [
   {
    "text": "Early access to the same experience you will get at 16 anyway",
    "correct": false,
    "feedback": "It is not the same experience. At 16 you arrive as yourself, with under 18 style protections where they exist. The workaround puts you there as a fake 18 year old, which is a different and rougher world."
   },
   {
    "text": "The adult internet with no under 18 protections, and no easy way to ask for help if it goes wrong",
    "correct": true,
    "feedback": "That is the honest trade. Not nothing, the access is real. But it is access to the wrong room with the safety rails removed, paid for with your ability to ask for help."
   },
   {
    "text": "Nothing at all, workarounds never actually work",
    "correct": false,
    "feedback": "Some workarounds do work as access, pretending otherwise is not honest and you would see through it. The trap is not that they fail. The trap is what they succeed at getting you into."
   }
  ],
  "script": "Watch for the third option: pupils who pick it are trying to give the answer they think adults want. Use its feedback out loud, because the credibility of this whole lesson rests on never pretending. Workarounds can work as access. The argument against them is what the access actually is, and that argument is strong enough to stand on its own without exaggeration.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The cliff edge",
  "caption": "Nobody gets car keys on their 17th birthday without lessons. The ban hands you every app at 16 with no lessons required. Unless you count this one.",
  "steps": [
   {
    "emoji": "🚧",
    "title": "The day before you turn 16",
    "text": "Zero legal access. The law does all the deciding, no judgement required from you at all."
   },
   {
    "emoji": "🎂",
    "title": "The day you turn 16",
    "text": "Full access, every app, all at once. The law steps back completely, overnight."
   },
   {
    "emoji": "🛣",
    "title": "The first weeks after",
    "text": "The feed studies a new arrival faster than at any other time. Whatever you bring on day one is all you have."
   }
  ],
  "script": "Walk the three steps, then hammer the driving comparison: to drive a car you do lessons, a theory test and a practical, because everyone accepts the keys are dangerous without the skills. The ban gives you the keys to every app at 16 with no test and no lessons. Ask the class: is that a flaw in the law or just how it is? Take a couple of views, then refuse to settle it: either way, the lessons do not exist unless someone builds them. This room is the lessons.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "mode": "pairs",
  "seconds": 60,
  "prompt": "Full access at 16 is the car keys with no driving test. What should count as the lessons? Name two things.",
  "lookFor": "This module is one honest answer. Others: setting defaults on devices they already own, asking older siblings or parents what the feed did to them in their first year, practising the audit on YouTube or gaming feeds they already use.",
  "script": "Sixty seconds, pairs, timer on screen. You are listening for pupils realising the lessons can start before the licence: they already have feeds somewhere, YouTube, games, music apps, and every one of those is a practice track. Take three answers after the chime and name the best insight in the room. If someone says this lesson is one of the lessons, give them the point loudly, because they are right.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🏃",
  "heading": "Habits beat rules",
  "body": "On your 16th birthday every rule that was doing your thinking disappears at once, and nothing replaces it unless you built the replacement yourself. Here is the honest advantage you have over almost every adult in your life: you get to decide your defaults before the apps decide them for you. Adults joined social media with no warning and spent years untangling habits they never chose. You know the exact day the gate opens. Nobody has ever had a cleaner run up, and a person who arrives with habits will always beat a person who only ever had rules.",
  "script": "The line to land: arriving with habits beats arriving with rules, because rules live outside you and vanish at 16, habits live inside you and travel. Ask the class for an example of the difference from anywhere in life, sport and food usually come up, someone whose parents banned sweets versus someone who learned to stop at one. Then the pivot sentence: so let us build the habits now. The tool is on the next slide, and it is the last tool of the whole scheme.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The arrival plan",
  "caption": "Built now, used at 16. Three parts, one page, written by you before the apps get a say.",
  "steps": [
   {
    "emoji": "🎛",
    "title": "My defaults",
    "text": "Decide notifications, privacy and time limits before day one. Whoever sets the defaults runs the room, so it is going to be you."
   },
   {
    "emoji": "🔎",
    "title": "My first week audit",
    "text": "At day seven, read your feed like evidence. What has it decided you are? Correct it with unfollow, mute and not interested."
   },
   {
    "emoji": "🚪",
    "title": "My exit rule",
    "text": "Write the sign that means step back, like sleep slipping or checking before you are fully awake, and exactly what you will do when you see it."
   }
  ],
  "verdicts": [
   "My defaults",
   "My first week audit",
   "My exit rule"
  ],
  "script": "This is the flagship tool of the entire scheme, give it the full three minutes. Walk each part as it builds. Defaults: name real ones, notifications off by default, private account first, a time cap chosen in advance. Audit: the feed spends week one deciding who you are, at day seven you mark its homework. Exit rule: the hardest and most important, because you write it while you are clearheaded so that future you, tired and mid scroll, does not have to make a decision, only follow one. Get the class chanting the three parts back: my defaults, my first week audit, my exit rule. Twice.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "scenario",
  "label": "Evidence item two",
  "platform": "feed",
  "handle": "grindset.blueprint",
  "avatar": "💸",
  "meta": "Suggested for you · 2h",
  "text": "16 with no income is a CHOICE. While your mates scroll, real ones build. Six income streams before 17 or stay asleep forever. DM BLUEPRINT 🔒",
  "image": "📈",
  "stats": "❤ 412K   ↻ 96.3K   💬 31.2K",
  "prompt": "Day three of your first week at 16. You never searched for this and you do not follow this account. What is the audit question you ask this post?",
  "script": "Point at the meta line first: Suggested for you. Nobody chose this, the feed chose it, which makes it pipeline check territory from last module and audit territory from today. The audit question you are fishing for: what has the feed decided I am, and did I choose that? Then go one level deeper: ask why the feed might show a brand new 16 year old this exact post. Answer: it is testing you. Every second you linger teaches it who you are. The audit is you noticing the test and answering on purpose instead of by accident.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Your first week audit finds a feed full of content you never chose. What is the audit actually for?",
  "options": [
   {
    "text": "Proving the feed is out to get you",
    "correct": false,
    "feedback": "The feed is not out to get you, it is indifferent. It serves whatever holds you, good or bad. The audit is a steering tool, not a blame exercise."
   },
   {
    "text": "Catching what the feed has decided you are, while the picture is still soft enough to change",
    "correct": true,
    "feedback": "Exactly. In week one the feed's picture of you is still forming. Unfollow, mute and not interested are your steering wheel, and week one is when the steering is lightest."
   },
   {
    "text": "Deciding to delete the apps, because the first feed is always wrong",
    "correct": false,
    "feedback": "Deleting is always an option you own, but it is not what the audit is for. The audit corrects the feed before you judge it. Steer first, verdict later."
   }
  ],
  "script": "Quick whole class check. The subtle point sits in the first feedback line, say it even if nobody picks that option: the feed is indifferent, not hostile. Pupils who believe the algorithm hates them feel powerless, pupils who understand it is a mirror with a motor feel in charge. The audit works because the feed responds to steering, and week one is when steering costs least.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🏫",
  "heading": "Their call, your plan",
  "body": "Between now and 16 you will stand at the school gate with friends who have workaround accounts. Some families allow it, some look the other way, some never asked. That is their family's call, and it is genuinely not your job to police it or report on it. But hear the other half of that sentence: your plan is not their business either. Being among the last of your friends off the apps is not a ranking, and being on early through a workaround is not a head start, because a head start on the wrong track does not lead where you are going.",
  "script": "This slide defuses the social fallout, so keep the register warm and completely unjudgemental in both directions. No superiority for the ones waiting, no pity or admiration for the ones with workarounds. If a pupil asks so are the ones with accounts being harmed, do not confirm or deny individuals, return to the frame: different families make different calls, and the only plan you control is yours. The phrase to leave hanging in the air: their call, your plan.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "mode": "groups",
  "seconds": 90,
  "prompt": "At 16 you arrive alongside friends who have been on the apps through workarounds for a year. Who actually arrives in better shape, and what would make it you?",
  "lookFor": "Time on the apps is not training. A year of unguided scrolling on adult settings builds habits, not judgement, and often builds the wrong habits. Arriving with defaults chosen, an audit booked and an exit rule written can genuinely beat arriving early. No shaming of anyone in the room, keep it about arrivals, not individuals.",
  "script": "Groups of three or four, ninety seconds on the timer. Ground rule again before you start: hypothetical friends only, nobody names anybody. This is the stretch question of the lesson because the honest answer is uncomfortable in both directions: the early arrivals do know their way around, and knowing your way around a room built to hold you is not the same as being ready for it. Collect one answer per group, and finish with the line: experience of the trap is not the same as a plan for it.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "Write your arrival plan",
  "body": "The worksheet has six arrival situations, from setup screens on day one to a mate's advice a month in. For each one, name which part of the arrival plan handles it: my defaults, my first week audit, or my exit rule. Then turn the sheet over and write your own plan: two defaults you will set before day one, the day you will run your audit, and your exit rule in one sentence. Fifteen minutes. A plan with blanks is not a plan, so finish yours.",
  "script": "Hand out the worksheets and the arrival plan bookmarks. Fifteen minutes: roughly eight on the six items, seven on their own plan overleaf, and the plan matters more, so call the switchover at eight minutes. Support group works items one to three with you first. Stretch question for early finishers: which part of your plan would you find hardest to obey, and what would make it easier? Circulate and collect one brilliant exit rule to read out, with permission, at the end.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check. It is the night before your 16th birthday. Which of these is genuinely the strongest position to be in?",
  "options": [
   {
    "text": "An arrival plan: defaults decided, an audit booked for day seven, an exit rule written down",
    "correct": true,
    "feedback": "That is readiness. The law opens the gate, the plan decides how you walk through it, and every part of it was chosen by you before the apps got a say."
   },
   {
    "text": "A borrowed verified account, so you already know your way around",
    "correct": false,
    "feedback": "A year on a false adult account is time in the wrong world on the wrong settings. Familiarity with the trap is not a plan for it."
   },
   {
    "text": "No plan and an open mind, just see what the apps show you",
    "correct": false,
    "feedback": "Open minded on day one means the apps choose your defaults and the feed decides who you are. Someone will run that room. The plan makes it you."
   }
  ],
  "script": "First of two exit checks, these two form the printed exit quiz, so run it in silence, no conferring. A pupil picking the second option here has not connected the workaround cost to arrival day, note them for a quiet follow up, without any suggestion that the answer was autobiographical.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check. Honestly, what does the under 16 ban actually do?",
  "options": [
   {
    "text": "It keeps you safe until you are old enough to handle anything the apps serve",
    "correct": false,
    "feedback": "It removes the apps until 16. Nothing about turning 16 installs judgement. Readiness arrives built by you, or it does not arrive at all."
   },
   {
    "text": "It removes the apps for a few years. Building the judgement is your job, and it starts before 16",
    "correct": true,
    "feedback": "That is the honest sentence of the whole module. Not pro ban, not anti ban, just what the law does and what it leaves entirely to you."
   },
   {
    "text": "It proves social media is too dangerous for anyone to use well",
    "correct": false,
    "feedback": "The law makes a call about under 16s. It does not make social media good or evil, millions of adults use it well and plenty use it badly. Which one you become is exactly what the plan is for."
   }
  ],
  "script": "Second exit check, still silent and independent. This is the thesis question: it proves whether pupils leave with the honest position or with one of the two lazy ones, the ban fixed everything or the ban is pointless. Anyone choosing the first or third option gets marked working towards on the register, the distinction is the whole module.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like Vix",
  "text": "The ban parks the car, it does not teach me to drive. My defaults. My first week audit. My exit rule. I arrive ready.",
  "script": "Whole class, out loud, twice, second time louder. Vix has been the street smart voice of KS4 all year, so give it her delivery: unbothered, certain, a little sly. This is the sentence you want them repeating on the morning of their 16th birthday, and some of them genuinely will.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "The ban removes the apps until 16. It does not build judgement, that build is yours and it starts now.",
   "A workaround runs on a false adult age, so it skips the rule and every protection behind it, exactly when you would most need help.",
   "At 16 access goes from zero to full overnight, a cliff edge with no driving test. The arrival plan is your lessons.",
   "The arrival plan: my defaults set before day one, my first week audit at day seven, my exit rule written down in advance."
  ],
  "script": "Four pupils read one point each. Then the callback: at the start I said you are the first generation that knows the exact day the gate opens. Look at what you did with that knowledge in one hour. Their written plans go home with them, the bookmark stays in their planner.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "digi",
  "heading": "DiGi lands the flagship",
  "lines": [
   "This is the one the whole scheme was building to. ⭐",
   "The law opens the gate on your 16th birthday whether you are ready or not. Ready was always your move, and today you made it.",
   "Keep the bookmark. On the morning you turn 16, read your own plan before you download a single app. Past you is looking out for future you.",
   "Vix and I have watched you build judgement for years. You are not just arriving at 16, you are arriving ready. Go be brilliant."
  ],
  "script": "Let DiGi land the ending, the lines appear on their own. Exit quizzes are collected as this plays, they are your evidence for the register. If you collected a brilliant exit rule during practice, read it out now with the writer's permission, it is the perfect final note.",
  "phase": "close",
  "minutes": 1
 }
]$m19$::jsonb,
  '[]'::jsonb,
  $m19${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 3,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m19$::jsonb,
  $m19${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today was the module the whole scheme builds towards: what happens on the day your teen turns 16 and full social media access arrives all at once. They wrote a personal arrival plan with three parts: defaults decided in advance, a first week audit of what the feed serves them, and an exit rule written before it is needed.",
 "try_this": "Ask your teen to talk you through their arrival plan, then write your own exit rule for your own phone alongside them. It lands ten times harder when they see you hold yourself to one too.",
 "family_question": "If every app arrived on your phone tomorrow, what is the first setting you would change before you posted anything?",
 "no_login_required": true
}$m19$::jsonb,
  $m19${
 "learning_objective": "Pupils can plan how they will handle full social media access at 16, using the arrival plan: defaults decided in advance, a first week audit of the feed, and an exit rule written before it is needed.",
 "timing": "60 minutes: starter 7, cycle one 8, cycle two 10, cycle three 13, practise 15, prove 4, close 3",
 "misconceptions": [
  "The ban makes social media safe by 16 (the ban removes the apps until 16, it does not change what the apps are or build any judgement, readiness is built by the pupil or not at all)",
  "A workaround is early access to the same experience they will get at 16 (a workaround account runs on a false adult age, so it delivers adult settings, adult content and no under 18 protections, plus a barrier to asking for help)",
  "Friends who used workarounds arrive at 16 better prepared (a year of unguided scrolling on adult settings builds habits, not judgement, and arriving with a written plan can genuinely beat arriving early)"
 ],
 "differentiation": {
  "support": "Work worksheet items one to three together as a guided group with the arrival plan bookmark on the table. For the plan overleaf, offer sentence starters: my first default is, I will run my audit on, my exit rule is if I notice.",
  "stretch": "Ask stretch pupils to write a fourth part of the arrival plan the module did not include and defend it, and to find the place where the driving test analogy breaks down (possible answer: driving skills are tested before the keys, nobody tests feed judgement at all, which is the point)."
 },
 "paper_fallback": "Print the slide pack, the arrival plan bookmarks and the worksheets. Run the retrieval question and both exit checks as hands up votes from the printed question cards. Draw the two diagrams on the board step by step, the age verification chain and the three part arrival plan. Both discussions run identically with a watch instead of the on screen timer. The heart of the lesson, each pupil writing their own arrival plan, is a paper task by design and loses nothing without a screen.",
 "keywords": [
  {
   "word": "age assurance",
   "definition": "Any way a platform works out your age: a document, a face age estimate, or a trusted confirmation. It checks age, never judgement."
  },
  {
   "word": "default",
   "definition": "The setting an app starts on before you touch anything. Whoever chooses the defaults quietly runs the experience."
  },
  {
   "word": "audit",
   "definition": "A deliberate look at the evidence. In week one you audit your feed: what has it decided you are, and did you choose that?"
  },
  {
   "word": "cliff edge",
   "definition": "A change that happens all at once instead of gradually. At 16, access goes from zero to full overnight."
  },
  {
   "word": "exit rule",
   "definition": "A sign you choose in advance that means step back, plus what you will do when you see it. Written before you need it."
  }
 ],
 "tool": {
  "heading": "The arrival plan",
  "lines": [
   "My defaults",
   "My first week audit",
   "My exit rule"
  ],
  "strapline": "The ban opens the gate. The plan decides how I walk through it."
 },
 "worksheet": {
  "title": "The arrival desk",
  "directions": "For each situation, name which part of the arrival plan handles it, then turn over and write your own plan.",
  "verdict_options": [
   "My defaults",
   "My first week audit",
   "My exit rule"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "Day one at 16. During setup the app asks for notifications, microphone and contacts, all switched on, with a big green button saying allow all.",
   "expected_verdict": "My defaults",
   "teaching_point": "The setup screen is where the app makes its move. Defaults decided before day one mean this screen holds no decisions, only a plan being followed."
  },
  {
   "n": 2,
   "item": "Three weeks in. You catch yourself checking your phone before you are fully awake, first thing, every single morning.",
   "expected_verdict": "My exit rule",
   "teaching_point": "Checking before you are awake is a classic exit rule trigger. The rule only works because it was written before this moment, by a clearer head."
  },
  {
   "n": 3,
   "item": "Day six. Your feed has become almost entirely gym transformations and one style of joke, and you never chose any of it.",
   "expected_verdict": "My first week audit",
   "teaching_point": "The feed has drafted a picture of who you are. The day seven audit is where you mark its homework with unfollow, mute and not interested."
  },
  {
   "n": 4,
   "item": "Your mate says set everything up fast on your birthday and sort the settings out later, everyone does it that way.",
   "expected_verdict": "My defaults",
   "teaching_point": "Later is the app's favourite word. Settings postponed past day one are usually never set, which is exactly why defaults are decided in advance."
  },
  {
   "n": 5,
   "item": "A month in. The group chat runs past midnight most nights, your sleep is slipping, and you keep meaning to do something about it.",
   "expected_verdict": "My exit rule",
   "teaching_point": "Sleep slipping is the sign, and keep meaning to is what an unwritten rule sounds like. A written exit rule turns noticing into a decision already made."
  },
  {
   "n": 6,
   "item": "Vix says: I do not need a written plan, I am sharp, I will just notice when something needs changing. Do you agree? Explain your reasoning.",
   "expected_verdict": "My exit rule",
   "teaching_point": "Sharp people notice slowly from the inside. The whole point of writing the rule in advance is that future you, tired and mid scroll, is not the best judge, and Vix of all foxes should know a room built to fool you when she is standing in one."
  }
 ],
 "commitment_stem": "My commitment: the first default I will set before day one is ..."
}$m19$::jsonb,
  $m19${
 "required": false
}$m19$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 20: AI mastery and data rights
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks5-20-ai-mastery-data-rights', 'AI mastery and data rights', 'KS5', 'Years 12 to 13', 'teacher',
  '{5,7,8}'::int[], ARRAY['DfE AI in education','AILit alignment']::text[], ARRAY['Engage with AI','Create with AI','Manage AI','Design AI']::text[],
  'AILit four domains, student use and skill divide', 'I can use an AI tool and defend where I checked its work.', 'DiGi with motion graphics', 20,
  $m20$[
 {
  "type": "title",
  "eyebrow": "KS5 · Years 12 to 13 · Module 20",
  "title": "AI mastery and data rights",
  "body": "You already use AI. This hour closes the gap between using it and mastering it, and shows you exactly what you trade for the free tools.",
  "script": "Have this up as they arrive. Open plainly: nobody in this room needs convincing to use AI, most of you used it this week and some of you used it on the way here. So this is not a lesson about whether to use it. It is about the difference between the millions of people who use these tools and the much smaller group who actually run them. By the end of today you are in the second group.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can use an AI tool and defend where I checked its work.",
  "why": "Employers, universities and admissions tutors have stopped asking whether you used AI and started asking whether you can stand behind the result. The people who thrive with these tools are not the ones who avoid them, they are the ones who can point at any line of the output and say I checked that, here is how.",
  "gains": [
   "Prompt like it is a skill, because it is one",
   "Explain why confident errors are built into how these models work",
   "Judge when an AI agent can act for you and when it cannot",
   "Name what you trade for free tools, and the rights you keep over your own data"
  ],
  "script": "Read the outcome aloud, then ask: hands up if you have ever submitted or sent something AI helped write. Most hands go up, and that is fine, say so. Then the follow up: keep your hand up if you checked every claim in it before your name went on it. Watch the hands drop. That gap between the two questions is the whole lesson.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Working vocabulary",
  "words": [
   {
    "word": "prompt",
    "meaning": "The instruction you give an AI tool. The quality of what comes back is set by the quality of what you put in."
   },
   {
    "word": "hallucination",
    "meaning": "A confident, plausible, false output. Not a glitch: a natural result of how these models generate text."
   },
   {
    "word": "bias",
    "meaning": "A slant inherited from the data a model was trained on. It reflects whose voices were in that data and whose were not."
   },
   {
    "word": "agent",
    "meaning": "AI that acts rather than just answers: it can browse, book, buy, email and execute tasks on your behalf."
   },
   {
    "word": "profiling",
    "meaning": "Building a picture of who you are from your data, usually to predict and shape what you buy, watch and believe."
   }
  ],
  "script": "Move through these briskly, this is an adult vocabulary check not a chant. Two to pause on. Hallucination: flag now that we will spend real time on why it happens, because the why changes everything. Profiling: ask who has seen an advert so specific it felt like being overheard. That feeling has a mechanism and we get to it in the final third.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Retrieval from last module. You built an arrival plan for the platforms that unlock as you get older. What made the plan worth building?",
  "options": [
   {
    "text": "It set your defaults and boundaries before the moment arrived, so the decision was made on your terms",
    "correct": true,
    "feedback": "Exactly. You decide calmly in advance or you decide in the moment under pressure, and the platform is counting on the second one. Today applies the same principle to AI: decide your checking standard before the deadline, not during it."
   },
   {
    "text": "It listed which platforms are safe and which are dangerous",
    "correct": false,
    "feedback": "That was never the point. No platform is simply safe or dangerous, the plan was about arriving with your settings, limits and intentions already decided rather than sorting them under pressure."
   },
   {
    "text": "It delayed everything as long as possible",
    "correct": false,
    "feedback": "Delay was not the goal, readiness was. The plan meant you arrive deliberately instead of drifting in. Same move today: we set your AI standard before the next deadline tests it."
   }
  ],
  "script": "Thirty seconds of thinking time, then cold call two people for reasoning rather than letters. The bridge to today is worth saying explicitly: an arrival plan works because you decide in advance, on your own terms. This lesson builds the same thing for AI, a standard you set now so it holds when a deadline is an hour away.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🎓",
  "heading": "Using is not mastering",
  "body": "Everyone in this room can use AI, the same way everyone can type. Mastery is different. It starts with prompting: giving the tool context, constraints and a clear job, then iterating instead of accepting the first answer. A vague prompt gets the average of the internet. A precise one gets something worth editing. The masters treat the tool like a brilliant, tireless, overconfident junior colleague: enormously useful, never left unsupervised.",
  "script": "Land the junior colleague framing hard, it is the mental model for the whole hour. Ask: what would you do with a colleague who works at incredible speed, never gets tired, and is sometimes confidently wrong? You would use them constantly and check everything that matters. Then the prompting point: ask who has ever rewritten a prompt three or four times to get what they wanted. Those people have already discovered that prompting is a skill. Today we make that deliberate.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The four domains of AI literacy",
  "caption": "Every serious framework for AI literacy lands on the same four moves. Most people stop at the first one.",
  "steps": [
   {
    "emoji": "🔍",
    "title": "Engage",
    "text": "Read AI outputs critically. Question them the way you would question any source with an agenda and no accountability."
   },
   {
    "emoji": "✍️",
    "title": "Create",
    "text": "Make things with it. Prompt with precision, iterate, and edit the output until it is genuinely yours."
   },
   {
    "emoji": "⚙️",
    "title": "Manage",
    "text": "Direct AI that acts for you. Decide what it may do alone and what always waits for your sign off."
   },
   {
    "emoji": "🧠",
    "title": "Design",
    "text": "Understand the system itself: how it was trained, who built it, what it optimises for and who it leaves out."
   }
  ],
  "script": "Walk the four as they build. The honest framing for this room: most adults are stuck at casual versions of Engage and Create, they read AI answers and generate the odd paragraph. The next decade of work belongs to people comfortable in Manage and Design, directing agents and understanding the systems well enough to question them. Ask the class where they honestly sit today, quick show of fingers, one to four. No judgement, it is a baseline.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🎲",
  "heading": "Hallucination is a feature, not a bug",
  "body": "These models do not look facts up. They generate the most plausible next words based on patterns in their training data. That is the same mechanism whether the output is true or false, which is why a fabricated citation arrives in exactly the same confident tone as a real one. Confidence is a property of the writing style, not of the accuracy. This will not be patched out by the next update, because plausible generation is the design, not a defect in it. Which means checking is not a temporary chore. It is a permanent part of the skill.",
  "script": "This is the most important two minutes of the hour, so slow down. The key sentence to repeat: the model is not lying to you, it is predicting, and prediction produces truth and fiction through the identical process. Ask: if the tone of the output tells you nothing about its accuracy, what does that mean for how you read it? Fish for the answer that confidence must be ignored entirely and checking becomes the only signal. Someone may say newer models hallucinate less, and that is true. Less is not never, and your name is on the work either way.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "stat",
  "figure": "86%",
  "claim": "86% of employers expect AI and information processing technologies to transform their business by 2030. The tools are not going away, so the differentiator is who can use them and defend the result.",
  "source": "WEF Future of Jobs Report, 2025",
  "script": "Let the number sit, then draw the conclusion for them: this means opting out of AI is not a career strategy, and neither is blind trust in it. The scarce skill in an economy where everyone has the same tools is judgement about the output. That is what you are practising today.",
  "phase": "teach",
  "minutes": 1
 },
 {
  "type": "scenario",
  "label": "Evidence item one",
  "platform": "message",
  "handle": "Priya",
  "avatar": "📚",
  "meta": "23:47 · Message",
  "text": "mate you are a lifesaver, that AI essay tool did my whole psychology section in ten minutes. it even cited a 2019 Cambridge study, proper reference and everything. submitting tonight 🙏",
  "image": "📄",
  "prompt": "Priya has a full reference: authors, year, journal. What would you say to her before midnight, and what should she do in the next ten minutes?",
  "script": "Take answers cold. The one to draw out: the polish of the reference is worth nothing, because fabricated citations arrive fully formatted with plausible authors and page numbers, generated by the same process as real ones. The ten minute fix is simple: search for the study. If it exists and says what the essay claims, keep it and now she can defend it. If it does not exist, she just avoided handing her tutor proof she never checked. Point out the deeper issue: Priya is treating done as the finish line. The finish line is defensible.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "Use it, check it, own it",
  "caption": "The professional standard in three moves. The verdict on any AI assisted work comes from move three.",
  "steps": [
   {
    "emoji": "🛠️",
    "title": "Use it",
    "text": "Prompt with context, constraints and a clear job. Iterate. Treat the first answer as a draft, never a result."
   },
   {
    "emoji": "🔎",
    "title": "Check it",
    "text": "Verify every claim, citation and number against a source the AI did not write. Confidence is not evidence."
   },
   {
    "emoji": "🖋️",
    "title": "Own it",
    "text": "Your name goes on it, so the errors are yours too. If you cannot defend a line, it does not ship."
   }
  ],
  "verdicts": [
   "Use and defend",
   "Check further",
   "Do not submit"
  ],
  "script": "Walk it as it builds, then give them the strapline: never submit what you cannot defend. Point at the three verdicts underneath: every piece of AI assisted work you ever produce ends in one of these. Use and defend means you checked it and could survive questioning on it. Check further means not yet. Do not submit means the checking failed or never happened. Ask the room which verdict Priya's essay currently holds. It is check further, and it only took a search to move it.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "An AI summary of a journal article includes a direct quote. You search the original and the quote is not there. What is the most accurate reading of what happened?",
  "options": [
   {
    "text": "The model generated a plausible quote through the same process it generates everything, and only your check caught it",
    "correct": true,
    "feedback": "Exactly. No malfunction occurred. Plausible generation is the mechanism, and the quote was plausible. The system worked as designed and so did you, that is what check it is for."
   },
   {
    "text": "The tool glitched, and a better model would not have done it",
    "correct": false,
    "feedback": "Better models fabricate less often, but the mechanism that produced the fake quote is the mechanism that produces everything else. Less often is not never, so the check stays."
   },
   {
    "text": "The quote is probably in a different edition, so it is fine to keep",
    "correct": false,
    "feedback": "That is hope doing the job evidence should do. A quote you cannot locate is a quote you cannot defend, and you never submit what you cannot defend."
   }
  ],
  "script": "The end of cycle one check. Watch for the second option, it is the most seductive wrong answer in the whole topic because model improvement is real. The distinction to land in discussion: improvement changes the frequency of fabrication, not the nature of it. The checking standard is set by the nature.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "⚖️",
  "heading": "Bias is an inheritance",
  "body": "A model learns from the data it was trained on, so it inherits whatever that data contains: the perspectives that were heavily represented, and the silence of those who were not. Ask a model to describe a typical CEO, a beautiful face or a normal family and you get the training data's average, presented as neutral fact. This is not usually a scandal or a plot. It is arithmetic. But arithmetic presented as neutrality is exactly the kind of thing a Design level thinker interrogates: whose data built this, and who is missing from it?",
  "script": "Keep this analytical rather than outraged, KS5 can handle the real mechanism. Useful question for the room: if a model was trained mostly on English language internet text, whose view of the world does it average? Draw out that the output feels neutral precisely because it is fluent, and fluency disguises the slant. Connect it back to the tool: bias is one more reason check it exists, because the errors it produces are not random, they lean in inherited directions.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🤖",
  "heading": "Agents: AI that acts, not just answers",
  "body": "The newest tools do not stop at generating text. Agents browse, compare, book, email, purchase and execute multi step tasks with your accounts and your money. That changes the question. With a chatbot you ask, is this answer right? With an agent you must ask, what is it allowed to do without me, and would I defend the action it just took in my name? The skill is calibration: match the level of supervision to the stakes and to how reversible the action is. Drafting an email unsupervised is cheap to undo. Sending it is not.",
  "script": "Give a concrete pair to anchor it: an agent that shortlists five flight options is doing reversible, low stakes work, let it run. An agent authorised to book the flight is spending your money on your behalf, and a mistake is expensive to unwind. Ask the class what makes an action safe to delegate. Fish for the two variables: stakes and reversibility. The same never allow or deny everything trap applies here, blanket trust and blanket refusal are both lazy. Calibrated supervision is the adult position.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "prompt": "You get an agent that can act with your accounts. Which tasks would you let it do entirely unsupervised, and where exactly is your line?",
  "mode": "pairs",
  "seconds": 90,
  "lookFor": "Reasoning built on stakes and reversibility rather than gut feeling. Strong answers draw the line where actions become hard to undo or start speaking in their name: sending messages, spending money, posting publicly.",
  "script": "Ninety seconds in pairs, timer on screen. Circulate and listen for whether the lines people draw have reasons attached. After the chime take three answers and press each one: why there? The pairs whose line is anything that spends money or speaks as me have found the principle. Name it back to the room: unsupervised is a privilege you grant based on stakes and reversibility, exactly the judgement an employer will one day pay you for.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🔐",
  "heading": "Free tools, and what they cost",
  "body": "When a powerful tool is free, you are usually paying with something other than money: your prompts, your documents, your patterns, your profile. Many free AI tools reserve the right to train future models on what you type into them, which is why pasting your personal statement, health details or a friend's private message into one is a bigger decision than it feels. But this trade is not one sided, because you have legal rights over your own data. In the UK you can ask any company what it holds on you, demand corrections, and in many cases require deletion. Rights you do not know about are rights you do not have.",
  "script": "Make it concrete immediately: ask who has read the terms of any AI tool they use. Nobody has, and that is the point, the trade happens in documents nobody reads. Then the empowering half, spend real time on it: subject access requests are free, deletion requests are real, and companies are legally obliged to respond. The register here is not fear, it is ownership. Their data is an asset they are currently trading blind, and today they stop being blind. If anyone asks about school or exam AI policies, the principle transfers: know what you are handing over before you hand it over.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "prompt": "Before this lesson started today, what had you already traded for tools you did not pay for? Follow the data, then decide: which single trade would you renegotiate?",
  "mode": "groups",
  "seconds": 90,
  "lookFor": "Specificity. Weak answers say my data vaguely. Strong answers name the actual trades: location history for maps, listening habits for playlists, prompts for AI drafts, face data for filters, and can say which trade is worth it and which is not.",
  "script": "Groups of three or four, ninety seconds. The word renegotiate matters, keep them off the false choice between accept everything and delete everything. Every group should surface at least one trade they think is fair and one they would change. Collect one of each per group. Close the cycle with the same calibration point as agents: the goal is not refusing the deal, it is knowing the price and deciding on your own terms.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "Field work, on paper",
  "body": "Six items on the worksheet: AI outputs, agent decisions and data trades. Run each one through the standard, use it, check it, own it, and give a verdict: use and defend, check further, or do not submit. Fifteen minutes. Every verdict needs the reasoning underneath it, because a verdict you cannot defend is the exact thing this lesson exists to end.",
  "script": "Hand out the worksheets, fifteen minutes, bookmark strips on the tables for anyone who wants the three moves in front of them. Support students work items one to three with you, they are recognition items with clear tells. Stretch question for early finishers: item four describes an agent action, what single change to its permissions would move your verdict? Circulate and harvest one piece of sharp reasoning to read out before the exit checks.",
  "phase": "practise",
  "minutes": 15
 },
 {
  "type": "choice",
  "question": "Exit check one. You used AI to draft a paragraph of your personal statement. When is it ready to submit?",
  "options": [
   {
    "text": "When every claim in it is true, checked, and you could defend any line of it in an interview",
    "correct": true,
    "feedback": "Right. The standard is not did AI touch this, it is can you stand behind it under questioning. Use it, check it, own it, and your name goes on it honestly."
   },
   {
    "text": "As soon as it reads well, because good writing is the goal",
    "correct": false,
    "feedback": "Reading well is exactly what generated text does whether or not it is true. Fluency is the one signal you must ignore. The check makes it submittable, not the polish."
   },
   {
    "text": "Never, because using AI on it at all is cheating",
    "correct": false,
    "feedback": "Blanket refusal is not the standard the adult world uses. The line is between assisted work you checked and own, and generated work you cannot defend. Learn the line, it follows you into every job."
   }
  ],
  "script": "First of two exit checks, these two are the printed quiz so run them in silence, individually. This one tests whether the tool survived contact with a real situation they care about. A wrong answer on option two tells you who is still reading fluency as accuracy, mark them for follow up.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check two. A free AI app's terms say your prompts may be used to train future models. What is the accurate way to read that deal?",
  "options": [
   {
    "text": "The tool is not free, you pay in data, so decide what you paste into it and remember you hold legal rights over your own data",
    "correct": true,
    "feedback": "Exactly. Know the price, pay it deliberately or not at all, and remember the rights that stay with you: you can ask what a company holds and demand deletion. Trading blind is the only losing move."
   },
   {
    "text": "It is a scam and nobody should ever use free tools",
    "correct": false,
    "feedback": "It is not a scam, it is a price written where few people read. Refusing every free tool is not mastery. Knowing the price and choosing on your own terms is."
   },
   {
    "text": "It does not matter, companies have your data anyway",
    "correct": false,
    "feedback": "That is learned helplessness, and it is false. What you paste is still your choice, and UK data rights, access, correction, deletion, are real and enforceable. Resignation is the outcome profiling depends on."
   }
  ],
  "script": "Second exit check. The third option is the one to watch across the room, resignation is the most common adult failure on data and it hides inside sounding worldly. Anyone choosing it needs the rights half of the lesson again: the deal only works on people who believe they have no say.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like DiGi",
  "text": "Use it, check it, own it: never submit what you cannot defend.",
  "script": "No chanting at KS5, just weight. Read it once, then ask them to write it at the top of whatever notebook or notes app follows them to university or work, because this sentence is doing its real work in three years, the night before something that matters is due.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What leaves the room with you",
  "points": [
   "Prompting is a skill: context, constraints, a clear job, then iterate. The first answer is a draft.",
   "Hallucination is the design, not a defect. Confidence tells you nothing, so checking is permanent, and bias means the errors lean in inherited directions.",
   "Agents act in your name. Supervision is calibrated by stakes and reversibility, never blanket trust or blanket refusal.",
   "Free tools charge in data. Know the price, paste deliberately, and use the legal rights you hold over your own data."
  ],
  "script": "Four points, four voices, pick readers around the room. Then return to the opening hands question: who here has submitted AI assisted work without checking every claim? Ask what their answer will be next time and let the silence be the answer. That changed standard is the outcome, and the exit quizzes going out now are the evidence of it.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "digi",
  "heading": "DiGi signs off",
  "lines": [
   "Twenty modules, and here is where they were all heading. ⭐",
   "You were never being taught to fear any of this. You were being taught to run it: the feeds, the platforms, the tools, and now the most powerful tools ever handed to a seventeen year old.",
   "So use it like a professional, check it like an editor, and own it like your name is on it. Because from here on, it always is.",
   "That is not my standard anymore. It is yours. Go build something worth defending."
  ],
  "script": "Let DiGi close, the lines appear on their own, do not talk over them. Collect the exit quizzes as it plays. The last line is deliberate: at KS5 the handover from taught standard to owned standard is the whole point of the programme, and this is the moment it happens. Send them out on it.",
  "phase": "close",
  "minutes": 2
 }
]$m20$::jsonb,
  '[]'::jsonb,
  $m20${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 1,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m20$::jsonb,
  $m20${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your young adult learned to move from using AI to mastering it: prompting well, verifying outputs because confident errors are built into how these tools work, supervising AI that can act on their behalf, and understanding what free tools take in data plus the legal rights they hold over their own. The standard we gave them: use it, check it, own it, never submit what you cannot defend.",
 "try_this": "Ask them to show you one AI tool they actually use, then ask them to show you how they would check something it produced. Watching them verify is the whole lesson in thirty seconds, and they will enjoy being the expert.",
 "family_question": "What do you think our family has traded, without noticing, for the free apps on our phones?",
 "no_login_required": true
}$m20$::jsonb,
  $m20${
 "learning_objective": "Pupils can use an AI tool skilfully, verify its output against independent sources, calibrate supervision of AI agents by stakes and reversibility, and explain the data trade behind free tools alongside the legal rights they hold over their own data.",
 "timing": "55 minutes: starter 8, cycle one 14, cycle two 6, cycle three 4, practise 15, prove 4, close 4",
 "misconceptions": [
  "Hallucinations are rare glitches the next update will fix (plausible generation is the design itself, so confident errors are permanent and checking is a lasting part of the skill, not a temporary chore)",
  "Using AI on work is cheating, full stop (the real line is between assisted work you have checked and can defend, and generated work you cannot, which is the standard universities and employers actually apply)",
  "Free tools are free, and companies have your data anyway so it does not matter (you pay in prompts, patterns and profiling, what you paste is still your choice, and UK data rights of access, correction and deletion are real and enforceable)"
 ],
 "differentiation": {
  "support": "Work items one to three of the worksheet as a guided group with the bookmark strip visible. Anchor every judgement in the same two questions: can you find this claim somewhere the AI did not write, and could you defend it out loud? Accept verbal reasoning and scribe where needed.",
  "stretch": "Early finishers take the agent item and redesign its permissions: which single change to what the agent may do alone would move your verdict, and why? Strongest students draft a one paragraph AI use policy for a sixth former that a head of year would actually sign off."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. The four domains and the three move standard are on the pack as diagrams, evidence item one is printed as a message card, and both discussions run with a watch instead of the on screen timer. The stat is read aloud from the teacher copy, the exit checks are the printed quiz, and the commitment stem is completed on the exit card. Nothing in the hour requires a screen.",
 "keywords": [
  {
   "word": "prompt",
   "definition": "The instruction you give an AI tool. The quality of what comes back is set by the quality of what you put in."
  },
  {
   "word": "hallucination",
   "definition": "A confident, plausible, false output. Not a glitch: a natural result of how these models generate text."
  },
  {
   "word": "bias",
   "definition": "A slant inherited from the data a model was trained on. It reflects whose voices were in that data and whose were not."
  },
  {
   "word": "agent",
   "definition": "AI that acts rather than just answers: it can browse, book, buy, email and execute tasks on your behalf."
  },
  {
   "word": "profiling",
   "definition": "Building a picture of who you are from your data, usually to predict and shape what you buy, watch and believe."
  }
 ],
 "tool": {
  "heading": "Use it, check it, own it",
  "lines": [
   "Use it like a professional",
   "Check it like an editor",
   "Own it like your name is on it"
  ],
  "strapline": "Never submit what you cannot defend."
 },
 "worksheet": {
  "title": "Field notebook: AI outputs, agents and data trades",
  "directions": "Run each item through use it, check it, own it, give a verdict, and write the reasoning underneath, because a verdict without reasoning does not count.",
  "verdict_options": [
   "Use and defend",
   "Check further",
   "Do not submit"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "You asked an AI tool to summarise a chapter you had already read closely. You compare its summary against your own notes and the original text, and everything matches.",
   "expected_verdict": "Use and defend",
   "teaching_point": "Recognition: this is what checked looks like. Verification against a source the AI did not write is the move, and once done, using the output is professional, not lazy."
  },
  {
   "n": 2,
   "item": "An AI drafted paragraph for your EPQ cites a 2019 study with named authors, a journal and a page number. It reads perfectly. You have not searched for the study.",
   "expected_verdict": "Check further",
   "teaching_point": "Recognition: a fully formatted citation is generated by the same process as a fabricated one, so polish is not evidence. One search moves this to use and defend or do not submit."
  },
  {
   "n": 3,
   "item": "Your coursework is due in an hour. The AI has given you a statistics section with three figures you cannot find anywhere, but the numbers look plausible and the writing is strong.",
   "expected_verdict": "Do not submit",
   "teaching_point": "Apply: deadline pressure is exactly when the standard earns its keep. Unfindable figures are indefensible figures, and submitting them hands your assessor proof you never checked."
  },
  {
   "n": 4,
   "item": "You gave an AI agent access to your email to chase university open day bookings. Overnight it drafted five messages and queued them to send at 9am, including one negotiating a date change with an admissions office.",
   "expected_verdict": "Check further",
   "teaching_point": "Apply: drafting was reversible and fine, sending in your name is not. Calibrate by stakes and reversibility: read every message before anything leaves under your signature."
  },
  {
   "n": 5,
   "item": "A free AI tool offers to polish your personal statement. Its terms say uploads may be used to train future models. Your draft includes your address, your health history and a story about a named friend.",
   "expected_verdict": "Do not submit",
   "teaching_point": "Apply: the tool is paid for in data, and this paste hands over your details and someone else's private story. Strip it or use a tool whose terms you have actually read, then decide."
  },
  {
   "n": 6,
   "item": "Leah says: if the AI got something wrong, that is the AI's fault, not mine. I just submit what it gives me. Do you agree? Explain your reasoning.",
   "expected_verdict": "Do not submit",
   "teaching_point": "Explain: the accountability question. Your name on the work makes the errors yours, no tutor, employer or admissions office accepts the tool did it. Own it is the whole third move."
  }
 ],
 "commitment_stem": "My commitment: the next time AI helps with work that matters, before my name goes on it I will check ..."
}$m20$::jsonb,
  $m20${
 "required": false
}$m20$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;

-- Module 21: Digital identity and the future of work
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks5-21-digital-identity-future-work', 'Digital identity and the future of work', 'KS5', 'Years 12 to 13', 'teacher',
  '{1,3}'::int[], ARRAY['Careers','Citizenship']::text[], ARRAY['Manage AI']::text[],
  'WEF Future of Jobs and AILit human skills', 'I can name the human skills I am building that AI cannot replace.', 'DiGi with motion graphics', 21,
  $m21$[
 {
  "type": "title",
  "eyebrow": "KS5 · Years 12 to 13 · Module 21",
  "title": "Digital identity and the future of work",
  "body": "Two questions that decide the next ten years: what does the internet say about you, and what can you do that AI cannot?",
  "script": "Have this up as they arrive. Open plainly: in the next few years every one of you will be searched by a stranger who decides something about your life. An admissions tutor, an employer, a landlord. Today is about what they find, and about the second question underneath it: in a world where everyone has AI, what is actually worth being good at? No doom today, no hype either. Honest answers.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can name the human skills I am building that AI cannot replace.",
  "why": "The job market you are walking into is being reshaped by AI faster than any careers guidance can keep up with, and your online record is already working for you or against you before you enter a single interview room. Today you get two practical tools: an audit of the identity you are building in public, and a test that tells you which of your skills climb in value when everyone has the same AI.",
  "gains": [
   "Audit what a stranger finds when they search your name, and build that record deliberately",
   "Describe honestly which work tasks AI compresses and which it expands",
   "Run the endurance test on any skill: more valuable or less valuable when everyone has AI",
   "Name the human skills that endure: judgement, taste, trust, accountability, asking the right question"
  ],
  "script": "Read the outcome and the why, then ask for a quick temperature check: hands up who is mostly optimistic about AI and work, hands up who is mostly worried. Count both roughly and say you will ask again at the end. Tell them directly: both camps are half right, and by the end of the hour you will know which half.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Words for today",
  "words": [
   {
    "word": "portfolio",
    "meaning": "The body of work and record that shows what you can do. Your searchable online presence is one, whether you built it on purpose or not."
   },
   {
    "word": "automation",
    "meaning": "A machine doing a defined task without a person. Cheap, fast and tireless at the routine layer of work."
   },
   {
    "word": "agent",
    "meaning": "AI that does not just answer but acts: it plans steps, uses tools and completes tasks. It still needs a person to direct it and own the result."
   },
   {
    "word": "judgement",
    "meaning": "Knowing what good looks like and deciding when the answer is not obvious. AI produces options. Judgement chooses between them."
   }
  ],
  "script": "Move through these briskly, they are adults. Pause on portfolio: most of them think a portfolio is something artists make. Reframe it now: everyone in this room already has one, it is called page one of a search for your name, and the only question is whether you are its author or its accident. Agent is worth ten extra seconds too: the shift from AI that answers to AI that acts is the shift this lesson is about.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Retrieval from last module. AI drafted a paragraph of your coursework. You read it, it sounded right, you submitted it, and the error in it was yours to answer for. Of use it, check it, own it, which one did you actually skip?",
  "options": [
   {
    "text": "Check it. Reading for whether it sounds right is not checking whether it is right",
    "correct": true,
    "feedback": "Exactly. Sounding right is what these tools are best at, which is precisely why sounding right is not a check. Verifying against a source is. Notice you still owned the error either way: own it is not optional."
   },
   {
    "text": "Use it. You should not have used AI at all",
    "correct": false,
    "feedback": "Using the tool was not the failure. Last module was never about avoiding AI, it was about using it with the checks that make it safe to sign your name to."
   },
   {
    "text": "Own it. The error was the AI's fault, not yours",
    "correct": false,
    "feedback": "You did own it, whether you wanted to or not. That is the point of own it: the accountability never transfers to the tool. What you skipped was the check that would have caught the error first."
   }
  ],
  "script": "Thirty seconds of silent thinking before any hands. Cold call two people for reasoning, not letters. The bridge to today is in the feedback: accountability never transfers to the tool. Hold that sentence, because in about twenty minutes it becomes the reason some skills get MORE valuable in an AI world.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🔎",
  "heading": "You already have a portfolio. You may not have written it",
  "body": "Before any interview, before any offer, someone will search your name. Admissions tutors do it, employers do it, and surveys of recruiters consistently find that what they see changes decisions in both directions: people get rejected for what turns up, and people get shortlisted for it too. Page one of that search is your portfolio. It is made of what you posted, what others posted about you, and what you never got round to taking down. The record exists either way. The only choice you actually have is whether it is deliberate.",
  "script": "Deliver this straight, no scare tactics, they have heard digital footprint talks since Year 5 and they tune them out. The line that lands at this age is the both directions point: this is not only about old posts costing you offers, it is that a visible record of real work WINS offers. The empty search result is not safe, it is just blank space someone else's imagination fills. Then set up the next slide: let us look at what a search actually turns up.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Exhibit one",
  "platform": "feed",
  "handle": "footy_banter_kj",
  "avatar": "🎮",
  "meta": "Posted 4 years ago · Public · Page one of a name search",
  "text": "absolute shambles from our keeper today 😂😂 genuinely might be the worst person ever born, hope he never shows his face at training again",
  "image": "⚽",
  "stats": "❤ 43   ↻ 2   💬 17",
  "prompt": "The account owner is now 18 and applying for medicine. The tutor searched the name. What story does page one tell, and who is its author?",
  "script": "Take answers on both questions. The story: someone casually vicious about a teammate, frozen at their worst moment, aged fourteen. The author: nobody. That is the real answer, this portfolio has no author, it assembled itself from moments. Then the honest complication: the tutor knows fourteen year olds post rubbish. One old post rarely ends an application. But it starts a story, and the applicant is not in the room to finish it. The fix is not deleting your way to a blank page, it is building enough deliberate record that the accidents become footnotes.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The identity audit",
  "caption": "Thirty minutes, once a term. You are the author of your record or you are its accident.",
  "steps": [
   {
    "emoji": "🔍",
    "title": "Search yourself",
    "text": "Your name, in a private browsing window, the way a stranger would. Images too. What is actually on page one?"
   },
   {
    "emoji": "⚖️",
    "title": "Assess the story",
    "text": "Read it as the tutor would: what does this person care about, how do they treat people, what have they made?"
   },
   {
    "emoji": "🧱",
    "title": "Build deliberately",
    "text": "Remove what you can that you regret, then add real evidence: projects, writing, things you have actually done."
   }
  ],
  "script": "Walk the three steps as they build. Step one: the private window matters, logged in results flatter you. Step two is the skill: read your own record as a stranger with a decision to make. Step three is where most footprint lessons stop short: removal is half the job at best. The applicant who wins is not the one with nothing findable, it is the one whose findable record shows real work and real character. Tell them plainly: this audit is on the worksheet as a commitment, and it costs thirty minutes a term.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "prompt": "If a stranger searched your name in the next ten minutes, what story would page one tell, and how much of it did you write on purpose?",
  "mode": "pairs",
  "seconds": 60,
  "lookFor": "Honesty over performance. The strongest answers separate the record they authored from the record that accumulated, and notice how little of it was deliberate.",
  "script": "Sixty seconds in pairs, timer on screen. Nobody has to confess anything specific, the question is about authorship, not content. After the chime take two or three responses. The pattern you will hear: almost nobody has written their own page one on purpose. Name that as the opportunity, not the failure: in this room, being deliberate about your record puts you ahead of nearly everyone your age.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "⚙️",
  "heading": "What AI actually does to work",
  "body": "Here is the honest middle that the headlines miss on both sides. AI mostly does not delete whole jobs, it reshapes them task by task: the routine layer of a job compresses while the judgement layer grows. A junior lawyer's document search compresses, the decision about what the documents mean expands. A designer's production work compresses, taste about what is worth making expands. Whole roles do disappear and new ones appear, but the biggest change for most people is that their job description quietly rewrites itself underneath them. The doom story and the hype story are both simpler than the truth, and both are excuses not to prepare.",
  "script": "This is the pivot of the lesson, give it full weight. Ask first: who has heard AI will take all the jobs? Who has heard AI will just make everyone more productive and nothing will really change? Both hands will go up. Then the reframe: stop thinking in jobs, start thinking in tasks. Every job is a bundle of tasks, and AI unbundles it. Use the lawyer and designer examples, then invite one more from the room: pick any job, we will unbundle it live. Next slide puts real numbers on this.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "stat",
  "figure": "170 million",
  "claim": "New roles employers expect to be created worldwide by 2030, against 92 million displaced. That is churn on a huge scale, not collapse: a net gain of 78 million jobs, with the mix of tasks changing inside almost all of them.",
  "source": "World Economic Forum, Future of Jobs Report 2025",
  "script": "Let the figure land, then walk the honest framing out loud, because this number is misused by both camps. The doom camp quotes the 92 million displaced and stops. The hype camp quotes the net gain and stops. The truth needs both numbers: enormous churn, more jobs at the end of it, and the same report finds employers expect around two fifths of core skills to change by 2030. So the question for this room was never will there be jobs. It is which skills survive the churn, and that is exactly where we go next.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "What compresses, what expands",
  "caption": "AI unbundles every job. Watch which layer of the work each task lives in.",
  "steps": [
   {
    "emoji": "📉",
    "title": "Routine production compresses",
    "text": "First drafts, lookups, boilerplate, standard analysis. Cheaper every month, for everyone, everywhere."
   },
   {
    "emoji": "🧭",
    "title": "Judgement expands",
    "text": "Someone must decide whether the output is right, whether it is good, and whether it should ship at all."
   },
   {
    "emoji": "🤝",
    "title": "Trust and accountability expand",
    "text": "A human name goes on the work. Clients, patients and voters do not accept the model made me do it."
   },
   {
    "emoji": "❓",
    "title": "Framing expands",
    "text": "AI answers the question it is given. The person who asks the right question sets the direction for everything downstream."
   }
  ],
  "script": "Walk the four layers as they build. The first one is the uncomfortable truth: if the most valuable thing you can do is produce competent standard work quickly, you are competing with something that does it in seconds for pennies. Then the three layers that grow, and connect each back to something they know: judgement is check it from last module made into a career, accountability is own it made into a career. Land the last one hard: agents will do more and more of the doing. Deciding what is worth doing does not compress, it becomes the whole job.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "prompt": "Pick a career someone at your table is genuinely considering. Unbundle it: which of its tasks compress, and which expand?",
  "mode": "groups",
  "seconds": 90,
  "lookFor": "Task level thinking rather than job level verdicts. Weak answers say medicine is safe or coding is doomed. Strong answers split one career into its compressing and expanding tasks.",
  "script": "Groups of three or four, ninety seconds, real careers only, not hypotheticals. Circulate and listen for anyone still giving whole job verdicts, and nudge them: unbundle it. Take one career per group afterwards and unbundle the trickiest one on the board. If someone raises coding, treat it honestly: typing routine code compresses fast, knowing what to build, whether it works and whether it should exist keeps expanding. Same shape in every field.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🌱",
  "heading": "The skills that endure",
  "body": "Across the research and across every industry, the same cluster of human skills keeps climbing in value: judgement, knowing what good looks like when the options all look plausible. Taste, knowing what is worth making before anyone asks for it. Trust building, being the person others stake their own reputation on. Accountability, putting your name on the outcome and standing there when it is questioned. And asking the right question, because a tool that can answer almost anything makes the choice of question the most powerful move on the board. None of these are talents you are born with. All of them are built the same way as any skill: reps, feedback, and time.",
  "script": "Slow down for this slide, it is the heart of the outcome. Read the five and give each one a face from their world: judgement is the editor, taste is the producer everyone wants, trust is the teammate who gets picked, accountability is the captain, the right question is the person who changes a meeting in one sentence. Then kill the fixed mindset before it forms: these sound like personality traits and they are not. They are trainable, and every essay, rehearsal, match and part time shift is a rep. The next slide gives them the test to know which skills are worth the reps.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The endurance test",
  "caption": "One question sorts every skill: does it get more valuable or less valuable when everyone has AI?",
  "steps": [
   {
    "emoji": "🎯",
    "title": "Name the skill",
    "text": "Be specific. Not writing, but producing a clean first draft, or judging whether a piece of writing works."
   },
   {
    "emoji": "🌍",
    "title": "Give everyone AI",
    "text": "Imagine every rival, every classmate, every applicant has the same tools you do. Because they will."
   },
   {
    "emoji": "📈",
    "title": "Watch the price",
    "text": "If the skill is what the tools do, its value falls. If the skill directs, judges or answers for the tools, its value climbs."
   }
  ],
  "verdicts": [
   "More valuable",
   "Less valuable",
   "Changes shape"
  ],
  "script": "This is the tool of the module, walk it slowly as it builds. Step one matters most: vague skills give useless verdicts, which is why writing is a trap answer, it is really several skills in a coat. Step two is the leveller: the tools are not your advantage, everyone gets them. Step three gives the verdict, and point at the third chip: changes shape is the most common honest verdict for big skills, part compresses and part climbs. Run one together now: memorising facts for quick recall. Let them argue it, then land it: mostly less valuable, except where instant recall feeds live judgement.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "Run the endurance test on writing. Everyone has AI that drafts fluently in seconds. What is the honest verdict?",
  "options": [
   {
    "text": "It changes shape: producing average prose gets cheaper, but judging and shaping writing climbs in value",
    "correct": true,
    "feedback": "Right, and notice what you did: you unbundled the skill before giving the verdict. The person who can tell strong writing from plausible writing, and shape one into the other, is more valuable than ever precisely because fluent average text is now free."
   },
   {
    "text": "Less valuable: AI writes better than most people already, so writing is finished",
    "correct": false,
    "feedback": "That is the doom shortcut, and it fails step one of the test: writing is not one skill. Producing average prose does compress. Knowing what good writing is, and making it happen, climbs, and you cannot judge writing you never learned to do."
   },
   {
    "text": "More valuable: employers will always prefer fully human writing",
    "correct": false,
    "feedback": "That is the comfort shortcut. Employers mostly cannot tell and increasingly do not ask. The honest answer is a split verdict: the production layer compresses while the judgement layer climbs."
   }
  ],
  "script": "Whole class response, then reasoning from two or three pupils. The teaching is in why the wrong answers are wrong: one is doom, one is comfort, and both skip step one of the test by treating writing as a single skill. If anyone asks so why are we still made to write essays, answer it honestly: because judgement over writing is built by doing writing. You cannot referee a game you never played.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "tryit",
  "heading": "Run the test yourself",
  "body": "Six items on the worksheet: skills and tasks, from drafting cover letters to building trust with a client. Run the endurance test on each one and give a verdict: more valuable, less valuable, or changes shape. Every verdict needs a reason, and a verdict without a reason does not count. Twelve minutes. The final item is a claim to argue with, and it deserves your best two sentences.",
  "script": "Hand out the worksheet. Twelve minutes, timer visible, bookmark strips on tables for anyone who wants the three steps in front of them. Support: work items one and two with the group, the verdicts are cleaner there. Stretch: early finishers apply the test to their own strongest subject, unbundled properly. Circulate for one excellent reason to read aloud at the end, especially any honest changes shape verdict with a real split inside it.",
  "phase": "practise",
  "minutes": 12
 },
 {
  "type": "choice",
  "question": "Exit check. In 2030 an employer is choosing between two graduates. Both have the same qualifications and the same AI tools. What actually separates them?",
  "options": [
   {
    "text": "Judgement, trust and a visible record of real work: the things the shared tools cannot supply",
    "correct": true,
    "feedback": "Exactly. When the tools are the same on both sides of the table, they cancel out. What is left is everything this lesson named: judgement, taste, trust, accountability, the right questions, and a searchable record that proves it."
   },
   {
    "text": "Whichever one has learned to use the newest AI tools first",
    "correct": false,
    "feedback": "Tool skills matter but they are the fastest skills to copy: everyone has the same tools within months. Advantages that everyone can download are not advantages for long."
   },
   {
    "text": "Whichever one is willing to work the longest hours",
    "correct": false,
    "feedback": "Hours spent producing routine output compete directly with automation, and that is a race a human loses on price. Value comes from the layers that expand, not from more time in the layer that compresses."
   }
  ],
  "script": "First of two exit checks and these two form the printed quiz, so no discussion until both are answered. This one tests whether the whole argument landed: same tools on both sides cancel out. A wrong answer here, especially the first option, tells you who still thinks the tool is the advantage.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Exit check. Which of these gets MORE valuable when everyone has AI?",
  "options": [
   {
    "text": "Knowing which question to ask, and standing behind the answer with your name on it",
    "correct": true,
    "feedback": "Right. Framing and accountability sit above the tools: AI answers the question it is given and never owns the result. Both climb in value precisely because everything underneath them got cheap."
   },
   {
    "text": "Producing a competent first draft very quickly",
    "correct": false,
    "feedback": "That is the clearest example of a compressing task: competent first drafts now cost seconds and pennies. Speed at the routine layer is the value that falls first."
   },
   {
    "text": "Recalling standard facts faster than the people around you",
    "correct": false,
    "feedback": "Instant recall of standard facts is exactly what everyone now carries in their pocket. Knowledge still matters, but as fuel for judgement, not as a party trick the tools do better."
   }
  ],
  "script": "Second exit check, answered independently. This is the endurance test itself in one question. Collect both answers before any discussion, they are your evidence for who met the outcome. Then, if time allows, ask one volunteer to explain the correct answer using the three steps of the test out loud.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "quote",
  "label": "Say it like DiGi",
  "text": "Everyone gets the same AI. Nobody else gets my judgement, my taste, or my name on the work. That is the portfolio I am building.",
  "script": "They are too old to chant it like Year 7, so do not ask them to. Put it up, read it once, and ask them to read it once back, together, deadpan is fine. It still works. This is the sentence you want surfacing in a UCAS statement or an interview answer two years from now.",
  "phase": "close",
  "minutes": 1
 },
 {
  "type": "recap",
  "heading": "What to take with you",
  "points": [
   "Your searchable record is a portfolio whether you author it or not. Audit it once a term: search, assess, build deliberately.",
   "AI reshapes work task by task: routine production compresses while judgement, trust and framing expand. Churn, not collapse.",
   "The endurance test sorts any skill: does it get more valuable or less valuable when everyone has AI?",
   "The skills that endure are buildable: judgement, taste, trust, accountability, and asking the right question. Every rep counts."
  ],
  "script": "Return to the temperature check from the start: who was optimistic, who was worried. Ask it once more and let them notice the shift, most rooms move toward the middle, which is exactly where the truth lives. Then four pupils read one recap point each. Exit cards out: everyone writes their commitment line, one deliberate step for their record and one human skill they are choosing to build.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi signs off",
  "lines": [
   "Here is what I know, being made of the stuff everyone keeps arguing about. ⭐",
   "I can draft, search, summarise and calculate all day. I cannot decide what is worth doing, and I never answer for the result. That part was always yours.",
   "So build the record you would be proud to have found, and build the skills that climb when tools like me are everywhere: judgement, taste, trust, your name on the work.",
   "The future of work is not you versus me. It is you, directing everything I can do, with everything only you can. Go build that. I will be right here."
  ],
  "script": "Let DiGi close, the lines appear on their own. There is something quietly powerful about the AI character telling the room what it cannot do, so do not talk over it. Collect exit cards and quizzes on the way out, they are your evidence against the outcome. If the room is up for it, last word from you: see you next module.",
  "phase": "close",
  "minutes": 2
 }
]$m21$::jsonb,
  '[]'::jsonb,
  $m21${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 1,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
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
}$m21$::jsonb,
  $m21${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your young adult learned to treat their online record as a portfolio an admissions tutor or employer will actually read, and to test any skill with one question: does it get more valuable or less valuable when everyone has AI? The honest answer from the evidence is churn, not collapse, and the skills that climb are human ones: judgement, taste, trust and accountability.",
 "try_this": "Sit together and search each of your names in a private browsing window, then compare notes: what story does page one tell about each of you, and who wrote it?",
 "family_question": "Which skill in our family gets MORE valuable now that everyone has AI?",
 "no_login_required": true
}$m21$::jsonb,
  $m21${
 "learning_objective": "Pupils can audit and deliberately build their online record as a portfolio, describe how AI reshapes work at the task level, and use the endurance test to name the human skills they are building that AI cannot replace.",
 "timing": "55 minutes: starter 8, cycle one (identity as portfolio) 9, cycle two (the jobs landscape) 10, cycle three (skills that endure) 7, practise 12, prove 4, close 5",
 "misconceptions": [
  "AI will take all the jobs, so there is no point preparing (the WEF Future of Jobs data shows churn, not collapse: 170 million roles created against 92 million displaced by 2030, with tasks changing inside jobs far more than jobs vanishing)",
  "A clean or empty search result is the safe online identity (a blank page is not safe, it is space a stranger's imagination fills, and applicants win with a deliberate record of real work, not with absence)",
  "Human skills like judgement and taste are personality traits you either have or you do not (they are trainable skills built through reps and feedback, which is exactly why essays, rehearsals and part time work still matter)"
 ],
 "differentiation": {
  "support": "Work worksheet items one and two with the group, where the verdicts are cleanest, and keep the bookmark strip with the three steps of the endurance test on the table. Accept verbal reasons scribed by a partner.",
  "stretch": "Early finishers run the endurance test on their own strongest subject, unbundled into at least three separate tasks with a verdict and reason for each, then draft the first line of the deliberate record they would want an admissions tutor to find."
 },
 "paper_fallback": "The whole lesson runs from the printed pack: the tutor search scenario is on the sheet as a described exhibit, the identity audit and endurance test diagrams are printed as the bookmark, discussions run on a watch or wall clock, worksheet verdicts are written not clicked, and the two exit questions are the printed quiz page. Nothing in the lesson requires a live search or a device.",
 "keywords": [
  {
   "word": "portfolio",
   "definition": "The body of work and record that shows what you can do. Your searchable online presence is one, whether you built it on purpose or not."
  },
  {
   "word": "automation",
   "definition": "A machine doing a defined task without a person. Cheap, fast and tireless at the routine layer of work."
  },
  {
   "word": "agent",
   "definition": "AI that does not just answer but acts: it plans steps, uses tools and completes tasks. It still needs a person to direct it and own the result."
  },
  {
   "word": "judgement",
   "definition": "Knowing what good looks like and deciding when the answer is not obvious. AI produces options. Judgement chooses between them."
  }
 ],
 "tool": {
  "heading": "The endurance test",
  "lines": [
   "Name the skill, specifically.",
   "Now give everyone the same AI.",
   "Does its value climb or fall?"
  ],
  "strapline": "Build the skills that climb: judgement, taste, trust, your name on the work."
 },
 "worksheet": {
  "title": "The endurance test: which skills survive?",
  "directions": "Run the endurance test on each item and give a verdict with a reason, because a verdict without a reason does not count.",
  "verdict_options": [
   "More valuable",
   "Less valuable",
   "Changes shape"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "Producing a clean, competent first draft of a standard cover letter in twenty minutes.",
   "expected_verdict": "Less valuable",
   "teaching_point": "Routine production is the first layer to compress: competent standard drafts now cost seconds. If speed at the routine layer is the whole skill, its price falls."
  },
  {
   "n": 2,
   "item": "Being the person a client trusts to tell them the truth about their project, even when the truth is unwelcome.",
   "expected_verdict": "More valuable",
   "teaching_point": "Trust is built between people over time and cannot be downloaded. When output is cheap and plentiful, the trusted judge of it becomes the scarce thing."
  },
  {
   "n": 3,
   "item": "Writing, all of it: from coursework essays to journalism.",
   "expected_verdict": "Changes shape",
   "teaching_point": "Step one of the test: unbundle vague skills. Producing average prose compresses, while judging, shaping and standing behind writing climbs. Big skills usually split."
  },
  {
   "n": 4,
   "item": "Learning to code for a career in software.",
   "expected_verdict": "Changes shape",
   "teaching_point": "Typing routine code compresses fast, but knowing what to build, whether it works and whether it should exist keeps expanding. You direct the tools better because you learned the craft."
  },
  {
   "n": 5,
   "item": "In a meeting where everyone is waiting for the AI summary, being the one who asks the question nobody thought to ask.",
   "expected_verdict": "More valuable",
   "teaching_point": "Framing sits above the tools. AI answers the question it is given, so the person who chooses the question sets the direction for everything downstream."
  },
  {
   "n": 6,
   "item": "Sam says: there is no point revising or building skills, because AI will be better than us at everything by the time we graduate. Do you agree? Run the endurance test and explain your reasoning.",
   "expected_verdict": "More valuable",
   "teaching_point": "Doom is as lazy as hype. The evidence shows churn with a net gain in jobs, and the skills that climb (judgement, taste, trust, accountability, framing) are built through exactly the practice Sam wants to skip."
  }
 ],
 "commitment_stem": "My commitment: this week I will search my own name and take one deliberate step to build the record I want found, and the human skill I am choosing to build first is..."
}$m21$::jsonb,
  $m21${
 "required": false
}$m21$::jsonb
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  efcw_strands = excluded.efcw_strands, statutory_hooks = excluded.statutory_hooks,
  ailit_domains = excluded.ailit_domains, evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome, character_cast = excluded.character_cast,
  sort_order = excluded.sort_order, slides = excluded.slides, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes, dsl_note = excluded.dsl_note;
