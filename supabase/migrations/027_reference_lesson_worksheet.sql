-- Guided Childhood Schools: worksheet items for the reference lesson
-- Run AFTER 026_schools_repair.sql. Safe to run repeatedly.
-- Dashboard safe: flat statement, no semicolons inside strings.
--
-- Adds the six invented practice items the independent practice segment
-- and the printable paper pack render. Content lives in the database,
-- never in the app (rule 6).

update public.school_lessons
set teacher_notes = teacher_notes || '{
  "worksheet_items": [
    {
      "n": 1,
      "item": "A post says: BREAKING. School holidays cut to two weeks from September. Share before they hide it!",
      "expected_verdict": "do_not_share",
      "teaching_point": "No source, manufactured urgency, and it aims straight at your feelings. Fails check one and check three."
    },
    {
      "n": 2,
      "item": "A video shows a famous singer admitting all her concerts are mimed. The voice sounds slightly flat and the account posting it was created last week.",
      "expected_verdict": "pause",
      "teaching_point": "Voices can be generated. A brand new account posting a shocking confession fails check one, and check two finds no other coverage."
    },
    {
      "n": 3,
      "item": "A screenshot of a group chat: my cousin works at the council and says the swimming pool is closing for good.",
      "expected_verdict": "pause",
      "teaching_point": "Second hand and uncheckable as it stands. Check two: what do other places say? The council website settles it in one search."
    },
    {
      "n": 4,
      "item": "The local paper reports a new skate park was approved, naming the council meeting and the date it happened.",
      "expected_verdict": "believe",
      "teaching_point": "Named source, checkable details, no emotional push. The checks exist so that things like this CAN be believed quickly."
    },
    {
      "n": 5,
      "item": "A dramatic photo of a shark swimming down a flooded high street after last night storm.",
      "expected_verdict": "do_not_share",
      "teaching_point": "The classic recycled fake. Spectacular, feelings first, appears after every storm. Check three fires, check two finds the same photo from years ago."
    },
    {
      "n": 6,
      "item": "An art account posts a beautiful picture clearly labelled: made with AI.",
      "expected_verdict": "believe",
      "teaching_point": "The honest nuance item. AI made is a method, not a lie. Labelled AI art pretends nothing, so the checks pass."
    }
  ]
}'::jsonb
where module_id = 'ks3-12-misinfo-deepfakes';
