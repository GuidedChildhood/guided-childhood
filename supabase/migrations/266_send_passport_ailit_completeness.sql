-- 266: the completeness pass. SEND adaptations on 21/21, the passport
-- paragraph in every parent note, and honest AI literacy tags.
--
-- The master audit, Report 10, found the scheme's SEND provision was one
-- differentiation sentence per module: real but generic, with nothing for
-- the graduated approach the SEND Code requires and no EAL thinking at
-- all. Report 14 item 10 ordered per module adaptations plus the
-- ailit_domains and parent_note.passport backfills. This migration is all
-- three, and each block below was written from the module's OWN activities
-- (its tool, its worksheet verdicts, its class interactive from migration
-- 259), never from a generic SEND checklist.
--
-- teacher_notes.send has four keys, matching how support staff actually
-- plan: communication (speech, language and communication needs),
-- attention (ADHD and executive function), sensory (autism and sensory
-- regulation), eal (English as an additional language). The teach page
-- renders them beside Support and Stretch.
--
-- parent_note.passport extends the frame migration 219 wrote for eyfs-01
-- to every module, register scaled by key stage (KS1 walks together, KS2
-- earns stamps, KS3 builds the readiness record, KS4 owns the record, KS5
-- closes the chapter), each ending in the module's own ask so a parent has
-- a real question for the dinner table. The passport is always a readiness
-- record and never a licence, and no paragraph below drifts from that.
--
-- ailit_domains: 7 of 21 modules were tagged. The slides were read before
-- tagging and only FIVE more earn a tag honestly: ks2-07 retrieves and
-- applies the feed loop, ks3-11 has "explain what the algorithm is doing
-- with your account" as a stated objective gain, ks3-14 teaches "the feed
-- learns what holds you", ks4-18's pipeline is a recommender chain by
-- definition, and ks4-19 teaches the feed studying a new arrival plus the
-- defaults to manage it. The other nine modules do not teach AI content
-- and stay untagged, because a tag a slide cannot back is exactly the kind
-- of claim this scheme does not make.
--
-- Snapshot first, RLS on the backup, idempotent: jsonb_set and the array
-- assignment overwrite the same keys on a rerun.

create table if not exists schools._backup_lesson_266 as
  select id, module_id, teacher_notes, parent_note, ailit_domains
  from schools.school_lessons;

alter table schools._backup_lesson_266 enable row level security;

-- 1. SEND adaptations, all 21 modules.

update schools.school_lessons l
set teacher_notes = jsonb_set(l.teacher_notes, '{send}', v.send, true)
from (values
  ('eyfs-01-screens-kindness', jsonb_build_object(
    'communication', 'The three body actions already replace words. For children with speech, language and communication needs, run the whole worksheet through pointing at the circle sheet faces, and accept every mode of showing as a full answer.',
    'attention', 'One picture at a time on screen, everything else covered. The star pause is the reset: use it between every item, not only where the plan says so.',
    'sensory', 'The star breath is the calmest moment in the scheme. A child who finds eyes closed hard keeps them open and watches the star, and sitting at the edge of the carpet with a fidget is participation.',
    'eal', 'Real and made up are the only two words that matter today. Teach them with objects first, a toy dinosaur and a picture of a dinosaur, then let the lesson reuse them.')),
  ('ks1-02-kind-screens-calm-bodies', jsonb_build_object(
    'communication', 'Feel it, name it and tell can all be shown rather than said: a hand on the tummy, a point at a feelings face, a walk to the trusted adult. Accept the action as the answer.',
    'attention', 'Chunk the lesson by the three steps and move bodies between each: stand, shake, sit. The wiggle is part of the plan, not the enemy of it.',
    'sensory', 'The calm bodies content doubles as regulation. Keep the star breath slide ready to revisit at any point, and let a child step to the calm corner without losing their place in the lesson.',
    'eal', 'Pre teach four feeling words with faces before the lesson: happy, sad, cross, wobbly. The feelings detective worksheet works entirely in pictures while the words settle.')),
  ('ks1-03-real-pretend-computer', jsonb_build_object(
    'communication', 'The verdicts are pointable: real, pretend and computer made as three picture cards on every desk, so the class interactive and the worksheet both work by pointing.',
    'attention', 'Reveal one detective picture at a time and vote immediately. Waiting through six pictures is the hard part; six tiny rounds is the same lesson made possible.',
    'sensory', 'Warn the class before the reveal moments, they get loud. A child who covers their ears keeps their verdict card raised instead of shouting.',
    'eal', 'Real, pretend and computer made are the three phrases to pre teach, using the same pictures the lesson opens with. WOW needs no translation.')),
  ('ks2-04-screen-routines', jsonb_build_object(
    'communication', 'The class tally answers by moving a token, not by speaking. Put sentence stems on the board for the routine share: my warn is, my finish is, my swap is.',
    'attention', 'The cool down lap is an executive function scaffold by design. Let the pupils who find stopping hardest write the warn step for the class: they are the experts in what does not work.',
    'sensory', 'Autoplay and its pull are described, never demonstrated. Keep it that way for this class: a room full of sound and motion would be teaching the opposite of the lesson.',
    'eal', 'Warn, finish and swap are the three words to pre teach. The routine detective verdicts, ready, lap or trap, work as thumbs once the three words are solid.')),
  ('ks2-05-gaming-time-spend', jsonb_build_object(
    'communication', 'The three spotter questions become three cards on the desk, and a pupil answers a whole case by holding up the question that catches it.',
    'attention', 'One case at a time, verdict immediately, feedback straight after. Give a restless pupil the case reader job: the voice that reads the trap is the voice that learns to spot it.',
    'sensory', 'Mystery chest reveals are exciting by design and the room will spike. Take the verdict vote BEFORE each reveal so the thinking happens in the quiet.',
    'eal', 'Pre teach rush, hidden and random with one picture each. Prices and odds are numbers, and numbers read the same in every language: lean on them.')),
  ('ks2-06-how-algorithms-work', jsonb_build_object(
    'communication', 'The be the algorithm activity scores videos with numbers, no sentences needed. Sentence stem for the plenary: the feed learned that I like.',
    'attention', 'The feed loop interactive moves fast on purpose. Run it twice: once to feel the pull, once with a pupil as the caller saying stop at each step of the loop.',
    'sensory', 'The paper version of the algorithm teaches the identical loop with no motion at all, and the player honours reduced motion where the projector browser sets it. Choose the version this room needs.',
    'eal', 'Watch, learn, serve: three verbs, pre taught, acted out with a ball. I throw, you catch, you throw back more. The whole model lives in those three verbs.')),
  ('ks2-07-privacy-reputation', jsonb_build_object(
    'communication', 'The editor''s desk verdicts are share or keep back: two cards, pointable. The three share test questions go on the wall as icons: a megaphone, a map pin, future me.',
    'attention', 'Six items is a long desk. Deal them as six separate envelopes and open one at a time: the same worksheet becomes six small wins.',
    'sensory', 'The assembly shout is loud in imagery only. Keep the real room quiet: verdicts by card, never by calling out.',
    'eal', 'Pre teach share, private and the vault using the lesson''s own vault list. The map pin icon carries where I am without a single extra word.')),
  ('ks2-08-kind-safe-online', jsonb_build_object(
    'communication', 'The three moves become three gesture cards: a flat hand for do not pile on, a camera for save the evidence, an arm up for tell. A pupil who says nothing can still make every move.',
    'attention', 'The scenarios are short on purpose. Vote after each, feedback immediately, and give the pupil who struggles to wait the evidence spotter job for the class.',
    'sensory', 'A pile on scenario can feel loud even on paper. Read it in a flat calm voice, and let any pupil turn their card face down to say this one is close to home without saying a word.',
    'eal', 'Pile on and tell someone who can help need pre teaching as whole phrases, not words. The three gestures carry the meaning while the phrases settle.')),
  ('ks2-09-copyright-ownership', jsonb_build_object(
    'communication', 'Mine, credit and ask first are three verdict cards, and the whole casebook runs on them. The commitment line gets a sentence stem: I will name the maker by.',
    'attention', 'Run the casebook as a gallery walk rather than a sit down worksheet: six cases on six tables, a verdict card left at each. Movement becomes the engine instead of the obstacle.',
    'sensory', 'No loud moments in this one, and the gallery walk version also suits a class that needs the room calm and predictable.',
    'eal', 'Maker, credit and copy are the three words to pre teach. The AI made case follows the same three: the computer was the tool, the prompt writer is the maker, the source deserves the credit.')),
  ('ks3-10-mood-and-screens', jsonb_build_object(
    'communication', 'The audit is one word a day by design: better, worse or nothing. That is a complete answer for every pupil, including those for whom a paragraph would be the barrier.',
    'attention', 'A week long audit is a real executive load. Shrink the loop where needed: one app, three days, and the reminder set up in the lesson rather than remembered at home.',
    'sensory', 'The class tally is anonymous tokens, not hands up. Keep it that way in this room: nobody''s week is read aloud unless they offer it.',
    'eal', 'Better, worse, nothing: pre teach the three words with arrows, up, down, flat. The whole week of data can speak in arrows while the words are settling.')),
  ('ks3-11-social-workarounds', jsonb_build_object(
    'communication', 'Each workaround file ends in a pointable verdict, and the naming task gets a word bank on the board: filters, contact limits, tuned recommendations, real help.',
    'attention', 'One file at a time. Give the pupil who finishes first the counsel job: argue the other side of one verdict before the feedback lands.',
    'sensory', 'The topic can make a room performatively loud. The files are written in Orbit''s flat register on purpose: match it and the room follows.',
    'eal', 'Workaround, protection and switch are the three words to pre teach. The age setting diagram carries the whole idea: one switch, four protections wired to it.')),
  ('ks3-12-misinfo-deepfakes', jsonb_build_object(
    'communication', 'The three checks are three questions on three cards. A pupil runs a whole case by laying down the card that decided their verdict: that IS naming the check.',
    'attention', 'The spread race lands in seconds and the debrief is where the learning lives. After the race, hand the most pulled in pupil the brake: they call the pause on the next case before anyone shares.',
    'sensory', 'The spread race animates fast by design. Reduced motion shows the end states instantly, and the paper fallback, a headline card passed hand to hand, makes the same point at human speed.',
    'eal', 'Believe, pause and do not share pre teach as traffic lights: green, amber, red. The three checks become who, where else and what feeling, and the feeling question needs no fluency at all.')),
  ('ks3-13-scams-fraud-money', jsonb_build_object(
    'communication', 'The three tells are a word bank, and every verdict names its tell by pointing at the bank: it rushes, it wants something odd, it is too good to be true.',
    'attention', 'One scam case at a time with the vote immediate. The pupil who calls answers out becomes the rush spotter: catching urgency working on the class is the lesson working.',
    'sensory', 'Scam scripts are read flat, never performed. The panic a scam manufactures should be described in the room, not manufactured in it.',
    'eal', 'Rush, odd and too good need pre teaching with one example each. Scam scripts cross languages almost unchanged, and a pupil who has seen one in another language holds evidence worth the whole class hearing.')),
  ('ks3-14-bodies-image-pressure', jsonb_build_object(
    'communication', 'The image check questions carry sentence stems on the sheet, and the best friend question can be answered to the page rather than the room. Nobody reads an answer aloud unless they offer.',
    'attention', 'The signal meter is one dial and one decision at a time. Let a pupil drive the dial for the class: hands busy, mind on the argument.',
    'sensory', 'This is the lesson where a quiet room matters most. DiGi''s flat calm register is the model: no gasps at reveals, no jokes to break tension, and any pupil may pass on any question without explanation.',
    'eal', 'Edited, filter and profit are the words to pre teach. The core question lands in any language once profit is solid: who earns when you feel worse?')),
  ('ks4-15-manipulation-persuasion', jsonb_build_object(
    'communication', 'The four techniques are a word bank, urgency, outrage, flattery, FOMO, and every case answer is one word from it. Precision beats paragraphs here for everyone.',
    'attention', 'Cases land one at a time with the vote immediate. Appoint a technique spotter for the room: catching the teacher using urgency to hurry the plenary is a win, so award it.',
    'sensory', 'Outrage content is discussed, never performed. Read the outrage case flattest of all: a room learning that fury can be examined calmly is the lesson.',
    'eal', 'Pre teach the four techniques as feelings first, rushed, angry, special, left out, then as names. Follow the money translates itself: who gets paid?')),
  ('ks4-16-consent-images-law', jsonb_build_object(
    'communication', 'The three questions are printed as a card each pupil keeps. Answers in this lesson may be written, pointed or silent: the knowledge is for them, not for display.',
    'attention', 'Short scenarios, immediate votes, and the law facts in their exact scripted words. A pupil who blurts is redirected to the options question, which is always a safe place to land.',
    'sensory', 'Stillness in this room is information, not disengagement. No cold calling in this module, ever, and any pupil may keep their card face down throughout.',
    'eal', 'Consent needs exact pre teaching: a yes freely given, that can be taken back. Report Remove is a name, teach it as one: the confidential route that takes images down.')),
  ('ks4-17-sextortion', jsonb_build_object(
    'communication', 'The three lifelines are three short imperatives, and the worksheet asks only which comes first. One circled answer is full marks: this lesson measures knowing the exit, nothing else.',
    'attention', 'The calm register does the regulating here. Keep every segment as short as scripted, and run the star breath slide as scripted rather than trading it for time: it is load bearing.',
    'sensory', 'Maximum calm by design: no music, no reveals, no group work pressure. A pupil who stares at the desk for the whole lesson has still been reached, and the script assumes exactly that.',
    'eal', 'Pre teach all three lifelines as whole phrases: do not pay, do not keep it secret, report it. It is not your fault must be exact in any language the pupil thinks in. Say it, write it, never paraphrase it.')),
  ('ks4-18-radicalisation-misogyny', jsonb_build_object(
    'communication', 'The pipeline check is three questions with a word bank: angry, watching, against. The pipeline diagram speaks for pupils who will not speak on this topic: label it, do not debate it.',
    'attention', 'The spread race and the recommendation chain move fast on purpose, and the debrief is slow on purpose. Protect the slow half: that is where a pupil steps out of the pipeline.',
    'sensory', 'If the room polarises it gets loud. The scripted move, returning to the shared enemy, the recruiter who profits, is also the sensory move: it drops the temperature every time.',
    'eal', 'Pipeline and groom need careful pre teaching: groom here means slowly changing what you believe. The three check questions translate cleanly and carry the lesson.')),
  ('ks4-19-readiness-at-16', jsonb_build_object(
    'communication', 'The arrival plan is a form, not an essay: defaults, first week audit, exit rule, each box with its stem. A plan of three ticked defaults is a complete plan.',
    'attention', 'Writing a plan for a future self is peak executive load. Anchor it: the class tally shows the room''s most chosen default first, and starting from the crowd''s answer is allowed.',
    'sensory', 'The day you turn 16 slide raises the temperature more than it looks. Give it silence rather than discussion, then move to the plan: the plan is the regulation.',
    'eal', 'Default, audit and exit rule are settings words, worth pre teaching on a real settings screen. The plan boxes accept any language: it is their plan for their arrival.')),
  ('ks5-20-ai-mastery-data-rights', jsonb_build_object(
    'communication', 'The field notebook logs verdicts and one line of evidence per case, and the defence has a frame printed on the sheet: source, date, second place it appears.',
    'attention', 'Cases one at a time, and the checking discipline IS the executive skill being taught: the notebook is the scaffold. A pupil racing the verdicts gives their evidence line first on the next case.',
    'sensory', 'The debates can run hot on AI takes. The scripted move is to the evidence line, which cools every argument to what can be shown.',
    'eal', 'Prompt, output, source and data trade are the four to pre teach. A pupil fluent in another language holds a real advantage: run one check in it and show the class what the English results never surfaced.')),
  ('ks5-21-digital-identity-future-work', jsonb_build_object(
    'communication', 'The endurance test takes one word answers: the skill, then climbs or falls. The name search is private by default and its findings are shared by choice only.',
    'attention', 'Run the test once as a class on the scripted example before anyone runs it alone. Keep the worked example visible: the structure holds the thinking while the thinking is hard.',
    'sensory', 'A calm, adult room. The tally is tokens rather than hands up, and the name search is a home task by design: the classroom stays device free.',
    'eal', 'Endurance, value and record need pre teaching in the work sense: what lasts, what it is worth, what is written about you. Human skills named in any language count: judgement is judgement everywhere.'))
) as v(module_id, send)
where l.module_id = v.module_id;

-- 2. The passport paragraph in every parent note. eyfs-01 keeps its own.

update schools.school_lessons l
set parent_note = jsonb_set(coalesce(l.parent_note, '{}'::jsonb), '{passport}', to_jsonb(v.passport), true)
from (values
  ('ks1-02-kind-screens-calm-bodies', 'Today also filled a little of your child''s passport page. The passport is the journey to sixteen that home and school walk together: lessons fill it at school, jobs and little wins fill it at home, and each stage of growing up ends with a stamp. Ask your child to show you Pebble''s three steps.'),
  ('ks1-03-real-pretend-computer', 'Today also filled a little of your child''s passport page. The passport is the journey to sixteen that home and school walk together: lessons fill it at school, jobs and little wins fill it at home, and each stage of growing up ends with a stamp. Ask your child to teach you the detective question.'),
  ('ks2-04-screen-routines', 'Today added to your child''s passport page. The passport is the journey to sixteen that home and school build together: lessons fill pages at school, responsibilities and wins fill them at home, and each stage ends with a stamp that is earned, never just a birthday reached. Ask your child what their cool down lap is.'),
  ('ks2-05-gaming-time-spend', 'Today added to your child''s passport page. The passport is the journey to sixteen that home and school build together: lessons fill pages at school, responsibilities and wins fill them at home, and each stage ends with a stamp that is earned, never just a birthday reached. Ask your child to run the three spend spotters on a game you both know.'),
  ('ks2-06-how-algorithms-work', 'Today added to your child''s passport page. The passport is the journey to sixteen that home and school build together: lessons fill pages at school, responsibilities and wins fill them at home, and each stage ends with a stamp that is earned, never just a birthday reached. Ask your child to draw you the feed loop.'),
  ('ks2-07-privacy-reputation', 'Today added to your child''s passport page. The passport is the journey to sixteen that home and school build together: lessons fill pages at school, responsibilities and wins fill them at home, and each stage ends with a stamp that is earned, never just a birthday reached. Ask your child to run the share test with you on something before you post it.'),
  ('ks2-08-kind-safe-online', 'Today added to your child''s passport page. The passport is the journey to sixteen that home and school build together: lessons fill pages at school, responsibilities and wins fill them at home, and each stage ends with a stamp that is earned, never just a birthday reached. Ask your child to show you the three moves.'),
  ('ks2-09-copyright-ownership', 'Today added to your child''s passport page. The passport is the journey to sixteen that home and school build together: lessons fill pages at school, responsibilities and wins fill them at home, and each stage ends with a stamp that is earned, never just a birthday reached. Ask your child whose name belongs on the last thing your family shared.'),
  ('ks3-10-mood-and-screens', 'This lesson filled part of your teenager''s passport page. The passport is the readiness record home and school build on the road to sixteen: skills proven at school, trust earned at home, each stage stamped when it is ready rather than when a birthday arrives. Ask them how the mood audit week is going, and consider running one yourself alongside them.'),
  ('ks3-11-social-workarounds', 'This lesson filled part of your teenager''s passport page. The passport is the readiness record home and school build on the road to sixteen: skills proven at school, trust earned at home, each stage stamped when it is ready rather than when a birthday arrives. Ask them to explain Orbit''s rule: behind every rule is a protection.'),
  ('ks3-12-misinfo-deepfakes', 'This lesson filled part of your teenager''s passport page. The passport is the readiness record home and school build on the road to sixteen: skills proven at school, trust earned at home, each stage stamped when it is ready rather than when a birthday arrives. Ask them to run the three checks with you on the next surprising thing either of you sees.'),
  ('ks3-13-scams-fraud-money', 'This lesson filled part of your teenager''s passport page. The passport is the readiness record home and school build on the road to sixteen: skills proven at school, trust earned at home, each stage stamped when it is ready rather than when a birthday arrives. Ask them for the three tells, then show them the last dodgy message you received.'),
  ('ks3-14-bodies-image-pressure', 'This lesson filled part of your teenager''s passport page. The passport is the readiness record home and school build on the road to sixteen: skills proven at school, trust earned at home, each stage stamped when it is ready rather than when a birthday arrives. Ask them about the image check, and let them ask you the best friend question back.'),
  ('ks4-15-manipulation-persuasion', 'This module counts toward the final pages of the passport, the readiness record your teenager has been building since their first stamp. It is proof of judgement, never a licence, and that difference is the whole design: at sixteen the record is theirs. Ask them to name the technique the next advert in the room is using.'),
  ('ks4-16-consent-images-law', 'This module counts toward the final pages of the passport, the readiness record your teenager has been building since their first stamp. It is proof of judgement, never a licence, and that difference is the whole design: at sixteen the record is theirs. Ask them what the three questions are, and let the conversation be short if they want it short: they know the answers now.'),
  ('ks4-17-sextortion', 'This module counts toward the final pages of the passport, the readiness record your teenager has been building since their first stamp. It is proof of judgement, never a licence, and that difference is the whole design: at sixteen the record is theirs. You do not need to quiz them on this one. One sentence from you does more: if anything ever goes wrong online, you can tell me, and you will not be in trouble.'),
  ('ks4-18-radicalisation-misogyny', 'This module counts toward the final pages of the passport, the readiness record your teenager has been building since their first stamp. It is proof of judgement, never a licence, and that difference is the whole design: at sixteen the record is theirs. Ask them who profits when content makes people angry, and listen to how precisely they can answer.'),
  ('ks4-19-readiness-at-16', 'This module writes one of the last pages of the passport, and it is the one the whole journey pointed at: the arrival plan for full access. The passport is proof of readiness, never a licence, and the plan they wrote today is theirs. Ask to see it, and tell them which default you would set first.'),
  ('ks5-20-ai-mastery-data-rights', 'The passport''s final chapter. Since Reception it has recorded readiness proven at school and trust earned at home, and it ends not with permission granted but with judgement owned. Ask them how they check an AI''s work before their name goes on it, and try their method on something of yours.'),
  ('ks5-21-digital-identity-future-work', 'The passport''s final chapter. Since Reception it has recorded readiness proven at school and trust earned at home, and it ends not with permission granted but with judgement owned. Ask them which human skill they are betting on, and tell them the one that has carried you.')
) as v(module_id, passport)
where l.module_id = v.module_id;

-- 3. Honest AI literacy tags: only the five modules whose slides earn one.

update schools.school_lessons l
set ailit_domains = v.domains
from (values
  ('ks2-07-privacy-reputation', array['Engage with AI']),
  ('ks3-11-social-workarounds', array['Engage with AI', 'Manage AI']),
  ('ks3-14-bodies-image-pressure', array['Engage with AI']),
  ('ks4-18-radicalisation-misogyny', array['Engage with AI']),
  ('ks4-19-readiness-at-16', array['Engage with AI', 'Manage AI'])
) as v(module_id, domains)
where l.module_id = v.module_id;
