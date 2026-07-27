-- Guided Childhood — Migration 106
-- A year of community bites, August 2026 through July 2027.
--
-- Migration 099 seeded one question, which is enough to prove the feature and
-- not enough to keep it. A poll that never changes is answered once and then it
-- is furniture.
--
-- Three rules shaped these, and they matter more than the questions themselves.
--
-- ONE. The register rotates. The point of the bite is the reassurance of the
-- crowd, not a monthly audit of everything going wrong, so these are not twelve
-- versions of what is hardest. Some months ask what is working, some ask what
-- is coming, one asks what has actually changed. A product whose whole pitch is
-- warmth cannot ask a worried parent to rank their failures twelve times a year.
--
-- TWO. Every option is a real position a real parent holds, and none of them is
-- an admission of failure. There is always a way to answer honestly when things
-- are going badly (we are in a good place, honestly I stopped counting, nothing
-- reliably and that is why I am here) without it feeling like a confession. A
-- poll where one option is obviously the right answer teaches parents to lie to
-- it, and then the aggregate is worthless and so is what DiGi remembers.
--
-- THREE. The answer has to be diagnostic. Every vote is written to digi_memory,
-- so next month DiGi can pick the thread back up: last month you told me the
-- handover was the hard part, how has that been. A question whose answer tells
-- DiGi nothing is entertainment, and this is not an entertainment feature.
--
-- Anchored to the UK year on purpose. A question about the six week holidays in
-- August, the Christmas list in November, secondary transition in June, reads as
-- written for that moment rather than pulled from a bank, and that is most of
-- the difference between a bite and a survey.
--
-- The API takes the most recent poll dated at or before the current month, so
-- seeding ahead is safe: each one simply waits its turn, and running this late
-- means the earlier ones are quietly superseded rather than piling up.
--
-- THIS RUNS OUT IN JULY 2027. From August 2027 the same last question is served
-- every month, because falling back to the most recent poll is what stops a
-- missing month breaking the feature. It degrades quietly rather than loudly,
-- which is right, and it is also exactly how a stale poll goes unnoticed for
-- half a year. Seed the next twelve before the summer of 2027.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

insert into public.community_polls (month, question, options) values
  ('2026-08-01',
   'Six weeks in. How are screens going this summer?',
   '["Better than term time, we have more hours together","Worse, the days are long and the tablet fills them","About the same, we have found a rhythm","It slipped early on and we have pulled it back","Honestly, I stopped counting weeks ago"]'::jsonb)
on conflict (month) do nothing;

insert into public.community_polls (month, question, options) values
  ('2026-09-01',
   'Back to school. Which screen bit are you least looking forward to?',
   '["Homework on a device with everything else one tap away","The class group chat","Early mornings after a summer of late screens","Comparing what other children are allowed","None of it, we are ready"]'::jsonb)
on conflict (month) do nothing;

insert into public.community_polls (month, question, options) values
  ('2026-10-01',
   'The nights are drawing in. What fills the extra indoor hours?',
   '["Gaming, mostly","YouTube or streaming","We have found decent offline things","A bit of everything, and I would like more offline","It is a negotiation every single evening"]'::jsonb)
on conflict (month) do nothing;

insert into public.community_polls (month, question, options) values
  ('2026-11-01',
   'Is a device on the Christmas list this year?',
   '["Yes, a first phone","Yes, a tablet or a console","They have asked and we have said not yet","No, and it has not come up","We are still deciding"]'::jsonb)
on conflict (month) do nothing;

insert into public.community_polls (month, question, options) values
  ('2026-12-01',
   'How do screens go over Christmas in your house?',
   '["Everyone disappears into a device by Boxing Day","We keep it in check, mostly","New presents mean new rules I have not made yet","We have a Christmas rule that works","Visiting family makes any line hard to hold"]'::jsonb)
on conflict (month) do nothing;

insert into public.community_polls (month, question, options) values
  ('2027-01-01',
   'One thing you would like to change about screens this year?',
   '["Calmer handovers when time is up","Less of it overall","Knowing more about what they are actually on","Getting them off it at bedtime","Feeling less guilty about all of it"]'::jsonb)
on conflict (month) do nothing;

insert into public.community_polls (month, question, options) values
  ('2027-02-01',
   'Half term in the cold. What is the plan?',
   '["Days out, screens will look after themselves","We need indoor ideas that are not a screen","A bit more screen time than usual, and that is fine","I am quietly dreading it","Our routine holds up in the holidays"]'::jsonb)
on conflict (month) do nothing;

insert into public.community_polls (month, question, options) values
  ('2027-03-01',
   'Homework with a device involved. How does it actually go?',
   '["They focus fine","It takes twice as long because of what else is on there","We sit with them, so it works","We print things out to keep it off a screen","Homework is not really a thing at their age yet"]'::jsonb)
on conflict (month) do nothing;

insert into public.community_polls (month, question, options) values
  ('2027-04-01',
   'What actually gets your child off a screen without a row?',
   '["Something outdoors with other children","A job with a reward attached","Making or building something","Us doing it alongside them","Nothing reliably, which is why I am here"]'::jsonb)
on conflict (month) do nothing;

insert into public.community_polls (month, question, options) values
  ('2027-05-01',
   'Test and exam season. Where do screens sit?',
   '["A genuinely useful revision tool","The main distraction","Both, depending on the day","We take the phone away while they revise","Too young for this to be a thing yet"]'::jsonb)
on conflict (month) do nothing;

insert into public.community_polls (month, question, options) values
  ('2027-06-01',
   'Moving up to secondary. How is the phone conversation going?',
   '["They are getting one and we have agreed the rules","They are getting one and we have not talked rules yet","We are holding off and they are not happy","Not our year yet, but it is coming","We are not doing phones for a good while"]'::jsonb)
on conflict (month) do nothing;

insert into public.community_polls (month, question, options) values
  ('2027-07-01',
   'A year of this. What has actually changed in your house?',
   '["The arguments are shorter","They ask instead of demanding","We are more offline than we were","Honestly, not much yet","I am calmer about it, and that changed everything"]'::jsonb)
on conflict (month) do nothing;
