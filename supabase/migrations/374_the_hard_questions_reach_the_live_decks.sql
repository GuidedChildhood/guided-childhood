-- 374: the hard questions reach the live decks.
--
-- On 21 September 2026 (commit 992a5d49, "eighty hard questions") the
-- lessons gained teacher_notes.hard_questions: four per lesson, the questions
-- a class actually asks and the answer a teacher can give. They went into
-- content/modules and no migration carried them, the same gap the extension
-- marks had (migration 369). On 13 October 2026 a read of production found
-- 13 decks where the only difference from the files is that this key is
-- missing. The teacher who gets asked "is Father Christmas real" in EYFS, or
-- "what if I have already sent money" in the scams lesson, has nothing on
-- the live deck to answer with.
--
-- WHAT MOVES. One key, teacher_notes.hard_questions, on the 13 rows below,
-- 52 questions in all, exactly as content/modules has them. Nothing else: no
-- other key in the notes, no other column, no slide, no other lesson. The 21
-- scheme decks that carry the key already are not touched.
--
-- GUARDED, per deck, before anything is written. Each deck must exist, hold
-- its notes as an object, and have the slide count the files have. A deck
-- that already carries hard questions must carry exactly these (a rerun);
-- any other value is a hand edit this will not overwrite. Any miss aborts
-- the whole migration rather than leaving a deck quietly short. The write
-- itself only touches a row whose key is absent and whose count matches.
--
-- Checked read only against production on 13 October 2026: all 13 decks have
-- the files' slide count and no hard questions, and the 21 that carry them
-- carry exactly the files' (md5 of each, all equal).
--
-- PROVED before commit: every row equals its state at the start of this
-- migration, every column and every key of the notes, except that each of
-- the 13 gained hard_questions equal to the files'. Any other change fails it.
--
-- Independent of 373, which writes teacher_notes.passport_stage and guards
-- only that key: either can apply first. Idempotent: a second run finds the
-- questions in place, writes nothing and passes the same proof. Backed up
-- first.
--
-- Generated from content/modules by scripts/gen-374.mjs, never by hand.

begin;

create table if not exists schools.school_lessons_backup_374 as
  select module_id, teacher_notes, now() as backed_up_at
  from schools.school_lessons
  where module_id in ('eyfs-01-screens-kindness', 'ks1-02-kind-screens-calm-bodies', 'ks1-03-real-pretend-computer', 'ks2-04-screen-routines', 'ks2-05-gaming-time-spend', 'ks2-06-how-algorithms-work', 'ks2-08-kind-safe-online', 'ks2-09-copyright-ownership', 'ks3-13-scams-fraud-money', 'ks4-15-manipulation-persuasion', 'ks4-19-readiness-at-16', 'ks5-20-ai-mastery-data-rights', 'ks5-21-digital-identity-future-work');

alter table schools.school_lessons_backup_374 enable row level security;

-- Every row as it stands now, for the proof at the end.
create temp table before_374 on commit drop as select * from schools.school_lessons;

-- The questions, as content/modules has them, with each deck's slide count.
create temp table hq_374 (module_id text primary key, n int not null, hq jsonb not null) on commit drop;
insert into hq_374 (module_id, n, hq) values
  ('eyfs-01-screens-kindness', 20, '[
    {
      "question": "Is Father Christmas real then?",
      "answer": "That one belongs to your family, and I am not going to answer it for them. Ask at home tonight. What we are learning here is the asking, and you have just done it beautifully."
    },
    {
      "question": "Are cartoons telling fibs?",
      "answer": "No, and that is a lovely question. A cartoon is a story somebody made for you on purpose, like a picture book. A fib is when somebody wants you to believe a wrong thing. Stories are made up and kind. Fibs are made up and unkind."
    },
    {
      "question": "My big brother says it is real.",
      "answer": "Your brother might be right and he might be wrong, and either way you did the clever thing by wondering. Stop, look, ask a grown up. A grown up who is not sure can say so, and that is a good answer too."
    },
    {
      "question": "What if my grown up is busy?",
      "answer": "Then you wait and ask when they are not, and the picture will still be there. Nobody has to decide about something surprising straight away. Waiting is allowed."
    }
  ]'::jsonb),

  ('ks1-02-kind-screens-calm-bodies', 20, '[
    {
      "question": "Why do I feel grumpy after my tablet when I was happy on it?",
      "answer": "Because the happy and the grumpy are both real, they just arrive at different times. Your body works hard while a screen is exciting, and the tired shows up when you stop. That is not you being naughty. That is a body doing its job."
    },
    {
      "question": "Is it telling tales if I tell you about a video?",
      "answer": "No. Telling tales is trying to get somebody into trouble. Telling a grown up about a feeling or something that frightened you is keeping yourself safe. They are two different things and you will always be right to do the second one."
    },
    {
      "question": "My grown up gets cross when I ask.",
      "answer": "Thank you for saying that, it is a hard thing to say out loud. Then we find you a different grown up. There is one in this building, and we will make sure you know who."
    },
    {
      "question": "Are screens bad?",
      "answer": "No. Screens can make you laugh and learn and talk to somebody you miss. We are not learning that screens are bad. We are learning to notice what they leave behind in your body, so you are the one in charge of it."
    }
  ]'::jsonb),

  ('ks1-03-real-pretend-computer', 20, '[
    {
      "question": "How do I know you are real?",
      "answer": "Brilliant question and the answer is that you are in the room with me. That is the strongest test there is. The reason the detective question matters is that a picture on a screen never gives you that."
    },
    {
      "question": "Can a computer make a picture of me?",
      "answer": "It can make a picture that looks a lot like you, and that is exactly why we practise this. It cannot make a picture of something you actually did. Looking real and being real are two different things."
    },
    {
      "question": "Is a photo always real?",
      "answer": "It used to be a very good clue and it is not any more. A computer can now make something that looks exactly like a photo. So we ask the question instead of trusting our eyes, and that is the whole skill."
    },
    {
      "question": "Is pretend the same as fibbing?",
      "answer": "No. Pretend is playing, and everybody knows it is a game. A fib wants you to believe a wrong thing. A cartoon is pretend and it is not tricking anybody, because it never pretended to be real in the first place."
    }
  ]'::jsonb),

  ('ks2-04-screen-routines', 29, '[
    {
      "question": "My parents have their phones in bed. Why is it different for me?",
      "answer": "Honestly, it is not, and they would probably tell you the same. The pull works on adults too. Nothing here says only children need a routine. If you want to take the cool down lap home and offer it to the whole house, that is a better version of this lesson than the one I planned."
    },
    {
      "question": "So this is just a way of taking my phone off me?",
      "answer": "No, and if it were I would say so. There is no rule here about how long you get. A routine is you deciding, once, in a calm moment, instead of arguing about it every night when you are tired. You keep the phone. You get the argument back."
    },
    {
      "question": "All my friends are online at night. I will miss everything.",
      "answer": "That is the real cost and I am not going to pretend it is nothing. Being out of the conversation is a genuine loss. What you are weighing it against is sleep you never get back. Only you can do that sum, but do it awake, not at eleven at night."
    },
    {
      "question": "I can stop whenever I want.",
      "answer": "Tonight you probably can. The problem is the night you are tired, and that is the night willpower is lowest and the app is exactly the same strength. A routine is what you set up for that night, by the version of you who is not tired yet."
    }
  ]'::jsonb),

  ('ks2-05-gaming-time-spend', 31, '[
    {
      "question": "My mum buys me skins. Is she doing something wrong?",
      "answer": "Not at all. Nothing in this lesson says spending on a game is bad. What we are practising is running the three spotters before the money moves, so it is a decision rather than a reflex. A present somebody chose to give you is already a decision."
    },
    {
      "question": "It is my money though.",
      "answer": "It is, and nobody here is taking it off you. That is exactly why the spotters matter. They are for you, not for a grown up, and they work best on the offer that is shouting loudest at you right now."
    },
    {
      "question": "Loot boxes are just a surprise, like a kinder egg.",
      "answer": "A kinder egg costs the same every time and you know what you are getting for it. A loot box is priced on not knowing, and the not knowing is the product. That is the difference, and it is worth about thirty seconds of your attention before you tap."
    },
    {
      "question": "Only people with no willpower get hooked.",
      "answer": "These games are designed by very good teams, tested on millions of players, and they work on adults with jobs and mortgages. Getting pulled in is not a character flaw. It is the design succeeding, which is why we go after the design rather than the person."
    }
  ]'::jsonb),

  ('ks2-06-how-algorithms-work', 29, '[
    {
      "question": "It is reading my mind. It knew what I was thinking about.",
      "answer": "It feels exactly like that and it is not what is happening. It is reading what you did: what you slowed down on, what you watched twice, what you did not scroll past. You are giving it the answer without meaning to, and once you can see that it stops being spooky."
    },
    {
      "question": "I never like or comment, so it knows nothing about me.",
      "answer": "The like button is the smallest signal there is. Stopping is the big one. Watching to the end is the big one. You can say nothing all year and still teach it plenty."
    },
    {
      "question": "So the app is evil?",
      "answer": "No, and that is worth being clear about. It is not out to get you. It is doing one job very well, which is holding your attention, because that is what it is paid for. Knowing that is not the same as being angry at it."
    },
    {
      "question": "Why does it never run out?",
      "answer": "Because there is no end to reach. A book has a last page and a feed does not, on purpose. Nothing tells you when you are done, so the stopping has to come from you, and that is what makes it hard rather than anything about you."
    }
  ]'::jsonb),

  ('ks2-08-kind-safe-online', 30, '[
    {
      "question": "Is telling you just snitching?",
      "answer": "Snitching is trying to get somebody into trouble. Telling is trying to get somebody out of it. If you are not sure which one you are doing, ask yourself who you are trying to help, and you will know."
    },
    {
      "question": "I did not type anything, so I did not do anything.",
      "answer": "Not typing is better than typing, and it is not nothing. A pile on performs for whoever is watching, and the watchers are the reason it keeps going. The three moves ask a bit more of you: add nothing, save the evidence, tell somebody who can help."
    },
    {
      "question": "If I delete the messages it goes away.",
      "answer": "It goes away from your phone and it stays everywhere else, and you have just deleted the thing that proves what happened. Save it first. Screenshot it, then tell somebody. You can always delete afterwards."
    },
    {
      "question": "What if the person doing it is my friend?",
      "answer": "That is the hardest version and it is the most common one, so it is worth saying out loud. You can care about somebody and still say that what they are doing is wrong. Those two things fit together, even though it does not feel like it in the moment."
    }
  ]'::jsonb),

  ('ks2-09-copyright-ownership', 29, '[
    {
      "question": "If it is on the internet it is free, isn''t it?",
      "answer": "Free to look at is not the same as free to use. Somebody made it and they still own it, exactly the way you still own the comic in your tray. Make it, credit it, ask first covers nearly every case you will meet."
    },
    {
      "question": "It was only an idea. I did not take anything.",
      "answer": "Ask the person whose idea it was how it felt. An idea somebody told you is still theirs, and crediting them costs you one sentence. Writing it down is not what makes it belong to them."
    },
    {
      "question": "An AI made it, so nobody made it.",
      "answer": "People made every single thing it learned from, and most of them were never asked. That is the wrinkle and it is genuinely unsettled, including for adults. You are allowed to use the tool and still know where the material came from."
    },
    {
      "question": "My teacher uses pictures off the internet.",
      "answer": "Fair point, and schools do have some permissions you do not have at home. That is not a reason the rule does not exist, and it is a very good reason to ask what the permission actually is."
    }
  ]'::jsonb),

  ('ks3-13-scams-fraud-money', 31, '[
    {
      "question": "Scams only get old people though.",
      "answer": "The opposite is closer to the truth for the online ones. Younger people are online more, move faster, and are targeted through the platforms they actually use. Being young is not protection, and neither is being quick."
    },
    {
      "question": "I am good with tech. I would spot it.",
      "answer": "So is nearly everybody who gets caught, and confidence is one of the things a good scam counts on. These do not work by fooling stupid people. They work by rushing a busy person, which at some point is all of us."
    },
    {
      "question": "It came from my friend''s account, so it is fine.",
      "answer": "It came from their account. Whether it came from them is a different question, and a taken over account is one of the most common ways this reaches you. If the message rushes you or asks for something odd, check with them another way before you do anything."
    },
    {
      "question": "What if I have already sent money?",
      "answer": "Tell an adult today and contact the bank today, because speed genuinely changes what can be recovered. You are not in trouble and you are not stupid. The embarrassment is the thing the scam is relying on to buy itself time."
    }
  ]'::jsonb),

  ('ks4-15-manipulation-persuasion', 30, '[
    {
      "question": "Adverts do not work on me.",
      "answer": "That belief is measured, and the people who hold it most strongly are not the ones it fails on. Persuasion does not need you to be convinced. It needs you to be familiar, and familiarity happens whether you approve of it or not."
    },
    {
      "question": "Rage bait is just people with strong opinions.",
      "answer": "Some of it is. The test is not how strong the opinion is, it is whether the thing was built to be argued with. If the reply button is where all the value is, somebody designed it that way and is being paid for your annoyance."
    },
    {
      "question": "Influencers genuinely like the stuff they post.",
      "answer": "Often they do, and that is not the issue. The issue is whether you were told about the money. An undisclosed ad is not a lie about the product, it is a lie about the relationship, which is the part doing the persuading."
    },
    {
      "question": "So I should not buy anything?",
      "answer": "No. Buy whatever you want. Name the technique first, and then decide, because a decision made after you have spotted the urgency is yours in a way the one made during it is not."
    }
  ]'::jsonb),

  ('ks4-19-readiness-at-16', 34, '[
    {
      "question": "So social media is safe at 16?",
      "answer": "No. Sixteen is when the door opens, not when the risk ends, and nothing about the platforms changes on your birthday. That is exactly why you write the plan before you arrive rather than after."
    },
    {
      "question": "My mates who got on early will be better at it than me.",
      "answer": "The evidence points the other way. They arrived on adult settings with no plan and no adult knowing, which is practice at the worst version. Arriving deliberately, with defaults you chose, is a real advantage."
    },
    {
      "question": "Why write an exit rule for something I have not started?",
      "answer": "Because the moment you need it is the moment you are least able to write it. Everything in this lesson is a decision made by the calm version of you, for the version who is upset at midnight. That is the whole design."
    },
    {
      "question": "What if my plan turns out to be wrong?",
      "answer": "Then you change it, and that is the first week audit doing its job. A plan you revise after looking at your own feed is not a failed plan. It is the only kind that survives contact with the real thing."
    }
  ]'::jsonb),

  ('ks5-20-ai-mastery-data-rights', 30, '[
    {
      "question": "Hallucinations will be fixed in the next version, won''t they?",
      "answer": "They have got less frequent and they have not gone, and the confident wrong answer is the dangerous one because it looks exactly like the right one. Plan for verification as a permanent part of the workflow rather than a temporary inconvenience."
    },
    {
      "question": "Is using AI on my work cheating?",
      "answer": "It depends entirely on what is being assessed, which is why the honest answer is to ask rather than to assume. If the task is the thinking, outsourcing the thinking is cheating yourself before it is cheating anybody else."
    },
    {
      "question": "They already have my data, so what does it matter?",
      "answer": "Resignation is convenient for the companies and it is not accurate. You hold real rights here, including access and erasure, and they work. Whether you use them is a choice, but it is a choice, which is different from nothing."
    },
    {
      "question": "Why supervise an agent if it is more accurate than me?",
      "answer": "Accuracy is only half of it. The other half is what happens when it is wrong, which is why the dial is stakes and reversibility rather than confidence. A reversible low stakes task needs very little from you. Sending money does not."
    }
  ]'::jsonb),

  ('ks5-21-digital-identity-future-work', 29, '[
    {
      "question": "AI is taking all the jobs, so what is the point?",
      "answer": "It is taking tasks, and jobs are bundles of tasks that get rebundled. That has happened before and it is happening faster now. The useful question is not whether your job survives, it is which of your tasks are exposed and what you are building that is not."
    },
    {
      "question": "Is a completely empty search result the safest thing?",
      "answer": "It is the safest and it is also the emptiest, and by the time somebody is searching for you they were hoping to find something. A deliberate record beats a blank one. The goal is a portfolio, not an absence."
    },
    {
      "question": "Judgement and taste are just personality. You either have them or you do not.",
      "answer": "They are practised, and you can see the practice in anybody who has them. That is the entire argument for the endurance test: it points you at what is worth putting your hours into, on the assumption the tools keep improving."
    },
    {
      "question": "Does anything I post now actually follow me?",
      "answer": "Some of it will and you cannot reliably predict which. That is an argument for building deliberately rather than for posting nothing, because the record that follows you is the one you get to shape starting now."
    }
  ]'::jsonb);

-- ── the guards ─────────────────────────────────────────────────────────────

do $$
declare bad text;
begin
  select string_agg(h.module_id || case
           when l.module_id is null then ' is missing'
           when jsonb_typeof(l.teacher_notes) is distinct from 'object' then ' has no notes object'
           else ' has ' || jsonb_array_length(l.slides) || ' slides, not ' || h.n end, '; ')
    into bad
    from hq_374 h
    left join schools.school_lessons l using (module_id)
   where l.module_id is null
      or jsonb_typeof(l.teacher_notes) is distinct from 'object'
      or jsonb_array_length(l.slides) <> h.n;
  if bad is not null then raise exception '374 aborted, a deck is not the one read: %', bad; end if;

  select string_agg(h.module_id, ', ')
    into bad
    from hq_374 h
    join schools.school_lessons l using (module_id)
   where l.teacher_notes ? 'hard_questions'
     and l.teacher_notes -> 'hard_questions' is distinct from h.hq;
  if bad is not null then raise exception '374 aborted, a deck carries hard questions the files do not: %', bad; end if;
end $$;

-- ── the questions ──────────────────────────────────────────────────────────

update schools.school_lessons l
   set teacher_notes = jsonb_set(l.teacher_notes, '{hard_questions}', h.hq, true)
  from hq_374 h
 where l.module_id = h.module_id
   and not (l.teacher_notes ? 'hard_questions')
   and jsonb_array_length(l.slides) = h.n;

-- ── the proof ──────────────────────────────────────────────────────────────

do $$
declare bad text;
begin
  if (select count(*) from schools.school_lessons) <> (select count(*) from before_374)
     or exists (select module_id from before_374 except select module_id from schools.school_lessons) then
    raise exception '374: the set of lessons changed';
  end if;

  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l join before_374 b using (module_id)
   where (to_jsonb(l) - 'teacher_notes') is distinct from (to_jsonb(b) - 'teacher_notes')
      or (l.teacher_notes - 'hard_questions') is distinct from (b.teacher_notes - 'hard_questions');
  if bad is not null then raise exception '374: a column, or a key of the notes, other than hard_questions moved in %', bad; end if;

  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join before_374 b using (module_id)
    left join hq_374 h using (module_id)
   where (l.teacher_notes -> 'hard_questions') is distinct from coalesce(h.hq, b.teacher_notes -> 'hard_questions');
  if bad is not null then raise exception '374: hard questions are not what the files hold in %', bad; end if;
end $$;

commit;
