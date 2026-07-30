-- Guided Childhood — Migration 126
--
-- The last place the names lived: DiGi's own stored answers.
--
-- 123 fixed the authored content, the lesson scripts and the daily moments.
-- 125 finished the three phrasings it missed. Neither touched what DiGi had
-- already SAID, and it turns out DiGi had been attributing its framing by name
-- in the answers it wrote:
--
--   "Dr Becky Kennedy's work shows a meltdown at screen off is ..."
--   "Catherine Knibbs' work shows secrecy is the risk multiplier ..."
--
-- Those sit in digi_questions.response and digi_conversations.messages, which
-- is the history a parent scrolls back through. So the name came off the lesson
-- and stayed in the chat, which is the same endorsement problem in a place
-- nobody thought to look.
--
-- Found by sweeping EVERY text and jsonb column in the schema for both names
-- rather than checking the tables the migrations happened to mention. That is
-- the only way this surfaced, and it is worth doing again after any change like
-- this one.
--
-- Justin confirmed these rows are all test data, so rewriting them costs
-- nothing real. On a live account this would be a harder call: a stored answer
-- is a record of what was actually said to someone, and quietly editing it is
-- its own kind of dishonesty. Worth stopping to ask again if it ever comes up
-- on production data.
--
-- The fix at source is NOT here. DiGi names these people because its system
-- prompts do, and 123 keeps those deliberately: they steer the model toward
-- connection before correction and the nervous system framing, and stripping
-- them would make the output worse for no protection, since a parent never sees
-- a prompt. What a parent sees is the ANSWER, so the answer is what is guarded.
-- If new answers start naming clinicians again, the prompt is where to look.
--
-- Every pattern below is possessive, which is why apostrophes appear at all.
-- They are built with chr(39) rather than written as a doubled quote, per the
-- house rule: a doubled quote in a migration has cost this project most of an
-- afternoon before.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements. Plain
-- replaces, and a no op on a database where these rows do not exist.

update public.digi_questions
set response = replace(replace(replace(replace(replace(replace(
      response,
      'Dr Becky Kennedy' || chr(39) || 's work on co-regulation shows ', 'The research on co-regulation shows '),
      'Dr Becky Kennedy' || chr(39) || 's frame fits this exactly: ',    'The research fits this exactly: '),
      'Dr Becky Kennedy' || chr(39) || 's frame fits here: ',            'The research fits here: '),
      'Dr Becky Kennedy' || chr(39) || 's frame is that ',               'The evidence here is that '),
      'Dr Becky Kennedy' || chr(39) || 's work shows ',                  'The research shows '),
      'Catherine Knibbs' || chr(39) || ' work shows ',                   'The research shows ')
where response like '%Becky%' or response like '%Knibbs%';

update public.digi_conversations
set messages = replace(replace(replace(replace(replace(replace(
      messages::text,
      'Dr Becky Kennedy' || chr(39) || 's work on co-regulation shows ', 'The research on co-regulation shows '),
      'Dr Becky Kennedy' || chr(39) || 's frame fits this exactly: ',    'The research fits this exactly: '),
      'Dr Becky Kennedy' || chr(39) || 's frame fits here: ',            'The research fits here: '),
      'Dr Becky Kennedy' || chr(39) || 's frame is that ',               'The evidence here is that '),
      'Dr Becky Kennedy' || chr(39) || 's work shows ',                  'The research shows '),
      'Catherine Knibbs' || chr(39) || ' work shows ',                   'The research shows ')::jsonb
where messages::text like '%Becky%' or messages::text like '%Knibbs%';

-- expert_knowledge.source_name and .url still hold these names, on purpose.
-- 123 sets out why and it is right: that is the internal provenance of a
-- finding, shown only on the insights board, and a record of where something
-- came from is the opposite of a problem. Stripping it would make the product
-- LESS accountable while looking more careful. Left alone deliberately, and
-- noted here so the next sweep does not read them as something missed.
