-- Guided Childhood — Migration 152
--
-- The three holes in the library, written properly.
--
-- Found by reading every title across all 233 scripts rather than guessing at
-- what was missing. The library is genuinely strong on the algorithm, deepfakes
-- of classmates, AI chatbots as friends, gambling mechanics, accidental porn,
-- radicalising content, doxxing, crypto scams and image sharing law. These
-- three had nothing.
--
-- WHY THESE THREE AND NOT A HUNDRED MORE. Volume was never the problem, as this
-- morning proved: 235 scripts were sitting in the database invisible behind an
-- RLS policy. Adding to a library that already has 233 only helps where there
-- is an actual gap, and a gap that matters.
--
-- EVERY FACT IN HERE WAS CHECKED TODAY RATHER THAN RECALLED, because these are
-- the three most consequential scripts in the library and a wrong instruction
-- in any of them costs a child something real:
--
--   1. Sextortion. NCA campaign guidance: overwhelmingly organised crime groups
--      overseas, money motivated rather than sexual, targeting teenage boys.
--      Victims routinely feel responsible and are not. Report to a trusted
--      adult, the police, or the CEOP Safety Centre.
--   2. Report Remove, the Childline and IWF service that gets an image taken
--      down for an under 18. Verified as live: iwf.org.uk/our-technology/
--      report-remove.
--   3. The under 16 ban. Announced 15 June 2026 and NOT YET LAW. Regulations
--      need both Houses, first ones due before the end of 2026, in force
--      expected SPRING 2027, under the Children's Wellbeing and Schools Act
--      2026, enforced by Ofcom. The script says so plainly, because a script
--      that implies the ban has landed would be wrong for months and would
--      make a parent act early for no reason.
--
-- law_flag on the third is full_ban_u16, so docs/11's social_media_law switch
-- can vary it when the date actually arrives without anyone rewriting it.
--
-- Sort orders 1401 to 1403, clear of the 1359 high water mark.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

-- Idempotent by title. The scripts table has no unique constraint, which is how
-- a re-run of a seed silently doubled a library once already, so each insert
-- checks for itself first rather than trusting anyone to run this only once.

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
select 'shaper', 'staying-safe',
  'Someone has a photo and is demanding money',
  'Your teenager, most often a boy, has sent an image to someone they believed was a girl their own age. That account is now threatening to send it to their friends and family unless they pay.',
  $sy$Thank you for telling me. I need you to hear the next bit before anything else: you are not in trouble, and this is not your fault. This is a crime, it is done to thousands of people, and the people doing it are organised criminals who do this for money. We are not paying them. We are not deleting anything yet, because the messages are evidence. I am going to sit here with you while we block them and report it, and then we will get the picture taken down.$sy$,
  $nt$Why on earth would you send that? Just pay it and let us never speak of this again.$nt$,
  $wy$Shame is the whole weapon, which is why the first words out of your mouth matter more here than in almost any other script. The National Crime Agency runs a campaign on this precisely because it targets teenage boys and because victims consistently believe they caused it. They did not. Naming it as organised crime, done for money, moves it from something they did to something done to them.

Paying is the one thing that reliably makes it worse: it confirms the account is live and willing, and demands continue. Deleting everything is the other instinct to resist, because the messages and the account name are what a report is built from.

And the fear driving all of it, that the image is now permanent, is the part you can actually fix. Report Remove, run by Childline and the Internet Watch Foundation, takes reports from under 18s, gives the image a digital fingerprint so it can be found across the internet, and issues takedown notices. That is a concrete thing to do tonight rather than a reassurance.$wy$,
  $tn$Tonight, together: screenshot the messages and the profile, then block, then report at ceop.police.uk. Then go to childline.org.uk and search Report Remove to get the image taken down. If they are distressed, Childline is 0800 1111, any hour.$tn$,
  'none', false, 1401
where not exists (select 1 from public.scripts where title = 'Someone has a photo and is demanding money');

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
select 'explorer', 'staying-safe',
  'Their feed has started showing them self harm',
  'You have seen something on your child''s phone, or they have told you, that their feed is serving them posts about self harm, starving, or not wanting to be here. They may have looked once, or not at all.',
  $sy$I saw what is on your feed and I am really glad I know. You are not in trouble and I am not taking your phone. Can you tell me what it was like seeing that, not why you were looking, just what it did to you? Then I want to do two things with you. One is teach that app to stop, because there are buttons that work. The other is ask you something straight, and I am asking because I love you, not because I think something is wrong with you.$sy$,
  $nt$Right, that is it, give me the phone. Why would you even look at this stuff?$nt$,
  $wy$Confiscating the phone at this moment teaches one lesson, which is never let them see. That is the opposite of what you need, because you need to be the person they show things to.

"Why were you looking" is the question that lands as an accusation, and it is often not even the right question. Feeds serve this content to people who never sought it. "What was it like" gets an answer and does not assign blame.

The feed itself is fixable and worth doing together rather than for them, because it hands them the control: on TikTok and Instagram, holding a post gives Not interested, and reporting it for suicide or self harm content does more than hiding it. A feed retrained in front of them is a demonstration that the machine can be pushed back on.

Then ask directly. Asking a young person plainly whether they have thought about hurting themselves does not put the idea there. Samaritans guidance on how this is discussed exists precisely because the silence around it is more dangerous than the question.$wy$,
  $tn$Tonight, sit beside them and use Not interested and Report on three posts, so they see it work. Then ask the direct question. If the answer is yes, or you are unsure, that is a GP appointment this week, not a wait and see. NHS 111 any time, Childline 0800 1111, and Samaritans 116 123 for you too.$tn$,
  'none', false, 1402
where not exists (select 1 from public.scripts where title = 'Their feed has started showing them self harm');

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
select 'explorer', 'family-rules',
  'The account they already have is going to have to go',
  'Your under 16 has an account on a platform that will be closed to them. The rules were announced in June 2026 and are expected to take effect in spring 2027, so you have months of warning and they may already have heard about it at school.',
  $sy$You will have heard something about this. Here is what is actually true so far: the government has said under 16s will not be allowed on these apps, it is not in force yet, and it is expected some time next spring. So nothing changes today. I wanted you to hear it from me rather than from a rumour at school, and I want to say plainly whose side I am on. I did not make this rule. I am not going to pretend I am sad about all of it. But losing where your friends are is a real loss and I am not going to tell you it is not.$sy$,
  $nt$Good. That is exactly what you need. Maybe now you will do something useful with your time.$nt$,
  $wy$This is the rare conversation where you and your child are on the same side of something neither of you chose, and saying so out loud is worth more than any argument about screens. A parent who is visibly pleased about the loss becomes part of the loss.

The reason to have it months early is that the version that goes badly is the one where an account disappears on a Tuesday with no warning. Time turns a confiscation into a plan.

And the loss is genuine rather than sentimental. What goes is not the scrolling, it is the group chat, the running joke, the way plans get made. Naming that accurately is what makes the rest of the conversation credible, and it points at the only useful preparation: moving the friendships somewhere else before the door closes, not after.

Be honest about the timing too. It has been announced, not passed. Regulations still have to go through Parliament. A parent who says it is happening tomorrow and is then wrong for a year has spent trust they will need on the day.$wy$,
  $tn$Tonight, ask one question: if that app went tomorrow, which three people would you actually lose touch with? Then get those three into a group chat somewhere that is not going anywhere, and swap numbers. Do it now while it is easy rather than in a rush later.$tn$,
  'full_ban_u16', false, 1403
where not exists (select 1 from public.scripts where title = 'The account they already have is going to have to go');

-- Check: expect three rows.
--   select sort_order, stage_id, category, title from public.scripts
--   where sort_order between 1401 and 1403 order by sort_order;
