-- Guided Childhood — Migration 157
-- The scripts copy sweep: every situation becomes a scenario, none of them a
-- claim about the reader's own child.
--
-- Counted on the live table: 236 scripts, 179 of them opening with an assertion
-- ("Your child has been sneaking screen time"), 0 phrased as a scenario, 2
-- assuming a gender the app does not know.
--
-- Why it matters more than a style note. A parent opens the scripts library to
-- browse, most often before anything has happened. "Your child agrees to 45
-- minutes and is still playing an hour later" tells them it did. At best that
-- is a small jolt of something untrue. At worst a parent reads a list of things
-- that have supposedly happened to their child and comes away with a picture of
-- a family in trouble, which is the opposite of what this library is for.
--
-- The rewrite is deliberately conservative. The moment, the detail and the
-- rhythm are kept exactly as Justin wrote them, and only the framing changes:
-- "your child" becomes "a child", and an opener becomes "when" where the
-- sentence needs one. Nothing is shortened, no new advice is introduced, and
-- say_this, not_this, why_it_works and tonight are untouched, because those are
-- the words to use once the moment IS real and second person is right there.
--
-- Hyphens in the old copy are closed up on the way past ("age-inappropriate"
-- becomes "age inappropriate"), which brings these rows in line with the no
-- dashes rule they were already breaking.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only. Keyed by id, so re running is a no op.

-- ── Builder ─────────────────────────────────────────────────────────────────

update public.scripts set situation = 'When a child agrees to 45 minutes and is still playing an hour later.' where id = 'de0bbf64-2c3d-4138-a3b1-382ca8a1bcc0';
update public.scripts set situation = 'When a child wants to watch YouTube in their room on their own.' where id = '9319b187-438e-4420-876d-ea7092894485';
update public.scripts set situation = 'When a child knows their screen time is up but flatly refuses to stop, either ignoring you, arguing, or having a meltdown.' where id = 'da50f66c-c4d1-4269-aa49-8b95a8831ce3';
update public.scripts set situation = 'When a child is consistently choosing screens over playing outside or doing physical activity, and is resistant when you suggest going out.' where id = 'feb4d5b5-9adc-47db-bcd6-770e834213ee';
update public.scripts set situation = 'When a child has been sneaking screen time, either getting up early, using a device after lights out, or hiding what they are doing.' where id = 'a3a6d534-0143-4378-a975-14a89cf4506f';
update public.scripts set situation = 'When a child wants to game before doing homework and argues they will do it later, or says they need to finish a game before they can concentrate.' where id = 'ce0f0e66-1d30-436f-9cff-01115b9f4778';
update public.scripts set situation = 'When a child comes off a gaming session noticeably more aggressive, rude, or emotionally dysregulated than before they started.' where id = '32118977-d144-4ed7-9cc0-383e86e8520d';
update public.scripts set situation = 'When a child mentions they have been playing games online with people they do not know in real life and chatting with them during gameplay.' where id = '2bb35db3-51f7-4356-a57f-01c53ce79eea';
update public.scripts set situation = 'When a child is asking to buy in game items, passes, or currency and does not fully understand that real money is involved.' where id = '0ececca5-ffc7-46e6-93b9-0e613fcaf533';
update public.scripts set situation = 'When screens creep into the bedroom and a child is harder to settle and wake.' where id = 'ded831b8-927e-4688-92fe-43cc6c8645c3';
update public.scripts set situation = 'When a child is picking up messages from media about how bodies should look, and starting to repeat them.' where id = 'e7764a9e-d7c9-4f48-bfbc-812e66ea53c2';
update public.scripts set situation = 'When a child is asking to create a social media account under the minimum age, insisting that all their friends have one.' where id = '20272456-fbc5-443e-b4e4-f0894082e6f4';
update public.scripts set situation = 'When a child has clicked a suspicious link in a message, email, or game, or before it ever happens.' where id = '115d35b5-6b6b-4111-805b-8f8d456c57de';
update public.scripts set situation = 'When a child does not fully understand what counts as personal information, or why sharing it online could be dangerous.' where id = 'efc5f6cf-a826-49ce-9a50-dd28c5b1d901';
update public.scripts set situation = 'When someone a child knows only online asks to meet in real life, or before it ever comes up.' where id = '7b9fcb23-22ee-450b-8803-c9afc663b5fd';
update public.scripts set situation = 'When parental controls need setting up without a child feeling spied on.' where id = 'a47c6520-77a6-4ce6-be8f-9371300e6d0e';
update public.scripts set situation = 'When a child walks in the door and the first thing they say is can I go on my game.' where id = 'e7d498ab-af80-4dff-a201-b966c4dec42a';
update public.scripts set situation = 'It is 10am on Saturday. A child has been on a device since they woke up and nobody noticed until now.' where id = '49887f14-b39c-46ab-b5fa-863056ef7902';
update public.scripts set situation = 'A child keeps checking their phone during dinner, after being asked twice already.' where id = '5661aa94-401f-49ff-a717-55c549a4c6fe';
update public.scripts set situation = 'A child wants the device, the homework is not done, and it has been back and forth for twenty minutes.' where id = 'cc1d6801-cd9e-4c67-a67c-ab4a442e4935';
update public.scripts set situation = 'When a child arrives home visibly upset or quiet, and it turns out something happened in the class group chat.' where id = '7ee064e9-08b1-49b9-9a53-47acb7f4c2ba';
update public.scripts set situation = 'When a child has just thrown a controller, burst into tears, or shouted after losing a game.' where id = 'dfb0c55a-16b2-48f1-90c2-fe2fc3fb7ae5';
update public.scripts set situation = 'It is Sunday evening. A child suddenly reveals they have not started a piece of work due tomorrow, after a weekend on their device.' where id = '591d0d32-0103-4780-94e4-e829c5c2e1a1';
update public.scripts set situation = 'When a child has not eaten since breakfast because they have been absorbed in a game.' where id = '621a96ec-e8de-4eb4-aa95-1130002d2e71';
update public.scripts set situation = 'It is 8:15am. A child has not packed their bag and cannot find their PE kit, their reading book, or their homework.' where id = '5ffa85c7-0d43-4ac7-95e9-6166fa122e9d';
update public.scripts set situation = 'A text arrives from school, in the middle of a working day, to say a child has no lunch.' where id = '7dce6060-e5a5-4a6b-95da-7bf7d74edff2';
update public.scripts set situation = 'When a child is picked up and is either completely silent or erupting at everything from the moment they get in the car.' where id = 'c28315da-7d8a-4a80-80be-5cc2b1f89259';
update public.scripts set situation = 'A child wants crisps or biscuits, something more nutritious would be better, and this happens every afternoon.' where id = '317718da-c05e-4236-af02-ce9880e3ac16';
update public.scripts set situation = 'The washing is being done and a child''s clothes are on the floor, on the chair, or in a pile next to the washing bag but not in it.' where id = '3f16171f-28cc-42aa-a8f5-2bf828abcf96';
update public.scripts set situation = 'Dinner is cooked. A child looks at it, says they hate it, and wants something else.' where id = '4a33b5d5-fb15-41f8-a40f-c72b388dcf9b';
update public.scripts set situation = 'Homework is a nightly source of conflict. A child avoids it, refuses it, or melts down the moment it is mentioned.' where id = '70e8017b-ccb9-409c-8339-4629074e67cb';
update public.scripts set situation = 'Two children are arguing over whose turn it is, who had it longer, or who broke whose thing.' where id = '8a8dd4cc-d48b-4e40-80e1-886c7ce22dce';
update public.scripts set situation = 'A child is in bed but calling out, coming downstairs, or has been awake for over an hour.' where id = '0062a466-15a0-45fe-b289-19d45f6c2e87';
update public.scripts set situation = 'Despite the agreement, a child has been on their device before school, discovered too late to do anything before they left.' where id = '977367b4-09ad-4642-a5d9-79f0cab86fd6';
update public.scripts set situation = 'When a child comes off their phone irritable, withdrawn, or tearful and will not talk about what they saw.' where id = 'd4d435c6-9caf-4cba-8417-192a1e66283c';
update public.scripts set situation = 'When a child is involved in a group chat incident where screenshots were shared or someone was excluded.' where id = '80212ecf-9f54-4cfc-b631-630ae719e624';
update public.scripts set situation = 'A child keeps their phone on the table or picks it up repeatedly during family meals, even after being asked not to.' where id = '07ab2111-5c25-4e58-87c4-dfbd9dd148aa';
update public.scripts set situation = 'When a child reaches for a screen the moment they feel bored, anxious, upset, or frustrated, and becomes difficult when access is removed.' where id = 'ed42047a-e593-4aa2-8f51-feb30e3e29b7';
update public.scripts set situation = 'A child is supposed to be doing homework on a laptop or tablet, but keeps switching tabs, checking messages, or watching videos.' where id = '344ae342-1b92-4846-8ea4-492a1c2bd11d';
update public.scripts set situation = 'When a child has watched episode after episode for hours with no sign of stopping, having said they would only watch one or two.' where id = 'ab1f2c84-d1c1-4558-99c2-26600ca325e6';
update public.scripts set situation = 'When a child is staying up far later than agreed gaming, either losing track of time or pushing for just one more game.' where id = 'da562baa-6cac-4877-9dc5-4ec2b3e3676d';
update public.scripts set situation = 'When a child has formed genuine friendships with people they only know through gaming and talks about them as real friends, even though they have never met.' where id = '1c2d9bc0-de5f-4ba9-b8b9-f1b46d3f684f';
update public.scripts set situation = 'When a child gets extremely frustrated and angry losing at games, sometimes to the point of shouting, crying, or throwing things.' where id = 'e317e8b0-62ed-406b-bd25-40d787702197';
update public.scripts set situation = 'When a child refuses to do anything except game, has dropped hobbies they used to love, is neglecting friends, and becomes extremely agitated if gaming is limited.' where id = '84be5223-7bc8-41e2-8fb2-030a981f8f08';
update public.scripts set situation = 'When a child is visibly upset about having fewer followers or likes than peers, and talks about their self worth in those numbers.' where id = '398907a1-2e68-4fc4-afae-b679e68fd8a3';
update public.scripts set situation = 'When a child is posting photos, videos, or comments that feel impulsive or attention seeking, and look like something they will regret.' where id = 'd447b64b-37b2-454d-b09c-3f3e8983a6fe';
update public.scripts set situation = 'When a child has seen disturbing, distressing, or age inappropriate content on TikTok and is either upset, fascinated, or pretending they are fine when they are clearly not.' where id = 'd6ae5be5-4189-4700-986f-d28faddcdd1b';
update public.scripts set situation = 'When a child is following and engaging with a large number of accounts of people they have never met, including adults and influencers.' where id = 'a30887b1-d84d-446d-a457-3f6f7aedb54a';
update public.scripts set situation = 'When a child is checking social media late at night and their sleep is visibly suffering, affecting their mood and school work.' where id = '4d01040e-556a-481f-a341-07838807f111';
update public.scripts set situation = 'Building the awareness to recognise when an adult online is behaving in ways that do not feel right, without frightening a child.' where id = '5ff5a74c-147f-467d-b084-a430b97fbb5e';
update public.scripts set situation = 'When a child uses weak passwords, shares passwords with friends, or does not understand why password security matters.' where id = '6d30d4af-b701-42d8-9147-150778509bd7';
update public.scripts set situation = 'When a child is not thinking about the fact that what they send or post can be screenshotted and shared well beyond who it was meant for.' where id = 'eee35f36-7de7-435a-968d-727ad21e01a5';
update public.scripts set situation = 'When a child has met a manipulated or AI generated image or video and is either fooled by it or unsure how to tell what is real.' where id = '2e40edf9-b2d2-4759-8fef-c94b0d4a6215';
update public.scripts set situation = 'When a child says someone is being cruel to them online, in messages, comments, or posts.' where id = '9b6b7652-11bb-42be-b57b-23091f2c2f22';
update public.scripts set situation = 'When a child sees screenshots showing they were deliberately left out of a group chat or plan.' where id = 'd4dcf09a-1f2e-4966-b624-248cd2e5098e';
update public.scripts set situation = 'When it comes to light that a child has been sending cruel messages or taking part in targeting another child online.' where id = '1fe2979a-3fd7-4836-8730-1025b1a6473e';
update public.scripts set situation = 'When the child being cruel online is someone they consider a friend at school.' where id = '176bfdff-aa02-47bc-a038-ae4cc4ac308d';
update public.scripts set situation = 'When a child has been bullied online but is refusing to report it to the school or to the platform.' where id = '5a13de69-c526-4c84-a91c-83378236a7f3';
update public.scripts set situation = 'When a child consistently comes away from their phone in a worse mood than when they picked it up.' where id = 'c28b46c0-166e-487c-8dd2-939206891eb9';
update public.scripts set situation = 'When a child is staying up late on their phone and struggling to sleep, affecting their mood and concentration the next day.' where id = '37bf2b23-71ea-4b09-9e18-c716b68b80a6';

-- ── Explorer and Shaper ─────────────────────────────────────────────────────

update public.scripts set situation = 'When a child is spending time on platforms where heavily filtered and edited images are the norm, and is starting to compare themselves to them.' where id = '72f81271-e4c5-4ce8-87e5-9a70b94ef2d3';
update public.scripts set situation = 'When a child announces they want to start their own YouTube channel.' where id = '0ed2272b-c519-4966-b467-1a83d2e89878';
update public.scripts set situation = 'When a child asks what AI is and how it works.' where id = 'da63a8a5-6bd3-4738-b2d2-3857df98b898';
update public.scripts set situation = 'When a child shares something online that turns out to be untrue.' where id = '528d8dfd-dc7e-4a43-9d73-76b9e635c88a';
update public.scripts set situation = 'When a child has broken a digital agreement the family made together.' where id = '102e6d27-e24a-4b52-a343-f00c9dac9230';
update public.scripts set situation = 'When a child complains that their friends are allowed far more than they are.' where id = '50f885f7-70ed-46f3-b443-9f74ed73a315';
update public.scripts set situation = 'When a child expects the usual screen limits to vanish on holiday.' where id = 'c75420c2-3573-4f23-b1b8-ed2ed797f08d';
update public.scripts set situation = 'When a child keeps their phone beside them while doing homework.' where id = '3b45d704-f91e-4590-b4a4-de963ba31887';
update public.scripts set situation = 'When a child is caught copying homework answers straight from the internet.' where id = '94f2753f-2658-479c-9943-368caaf418ab';
update public.scripts set situation = 'When a child is constantly pulled out of class by notifications.' where id = '44bc05ef-2357-4fc5-8dd3-05d1c828a609';
update public.scripts set situation = 'When a child has online friends they have never met in person.' where id = '6064c5da-04ed-44b1-9034-2adb71083efd';
update public.scripts set situation = 'When a child meets someone in a game and wants to keep in touch off the platform.' where id = 'ef5e5eed-4460-42e3-b514-059c946923af';
update public.scripts set situation = 'When a child comes home from school, gives one word answers, and disappears to their room with their phone.' where id = '1a7a5a9f-612a-402b-a969-9a78daefe529';
update public.scripts set situation = 'A child is going to be late for school because they will not put their phone down, and it is escalating on both sides.' where id = 'c3619c8e-25cc-41aa-983e-0bce3af46b42';
update public.scripts set situation = 'It is bedtime. Bedtime has already been extended twice. A child says five more minutes again.' where id = 'd0304dbe-df42-47d2-8feb-e42cc8159643';
update public.scripts set situation = 'It is Sunday evening. A child''s mood has dropped and they are buried in their phone. School tomorrow.' where id = 'a9bf10d2-6b27-4f8f-8135-5db8fd4f6709';
update public.scripts set situation = 'When a child is furious that they are the only one without the app, the game, or the device that everyone else apparently has.' where id = 'd5b8686b-e5e4-47ab-af2e-34d60f90f84a';
update public.scripts set situation = 'When something worrying turns up on a child''s phone or in their search history. Violence, adult content, or something else entirely.' where id = '1f245e3b-1a06-4d2f-a8a9-61f41381f5f5';
update public.scripts set situation = 'A child''s phone has been broken, lost, or stolen. They are devastated and possibly panicking about being out of contact with their friends.' where id = '23b67479-6361-4b83-a4fe-17dd511ef671';
update public.scripts set situation = 'When a child pulls out their phone whenever something uncomfortable happens: a family gathering, a social situation that feels hard, silence in the car.' where id = 'e07cdbcf-18cc-4c67-a428-8f24d4f6ad33';
update public.scripts set situation = 'When a child is watching something on Netflix or YouTube that feels wrong for their age, and they say all their friends watch it.' where id = '0dcf9c40-795c-4a82-993d-1ada42350315';
update public.scripts set situation = 'At 9pm it comes to light that a child has not done homework that is due tomorrow.' where id = '3289e426-e919-4068-9300-1fb1f46ea8d4';
update public.scripts set situation = 'When a child is going to sleep late, waking in the night, or waking too early, and their mood and behaviour during the day are suffering.' where id = 'c35ce7cf-ac08-4269-b7a7-1513054403de';
update public.scripts set situation = 'A child''s bedroom is in a state. They have been asked to tidy it multiple times. It is still a mess.' where id = '25d13488-c666-479d-add8-32a1f58bf30b';
update public.scripts set situation = 'When a child''s feed is serving them posts about self harm, starving, or not wanting to be here. They may have looked once, or not at all.' where id = '3bde6eeb-de85-4eeb-86c2-0bf4e1915bf3';
update public.scripts set situation = 'When a child is about to use a screen for the first time, or is asking for their own device.' where id = 'a87be8a1-302c-4fe0-b761-42a65859fa64';
update public.scripts set situation = 'When a child cries, argues, or has a meltdown as the TV or tablet goes off.' where id = '8c69f7bd-4149-4581-a950-45df4c7b5cdf';
update public.scripts set situation = 'When a child asks, for the first time, to play a game because all of their friends are playing it.' where id = 'a979b76f-5385-4311-a749-432617fa4545';
update public.scripts set situation = 'When a child is getting access to a games console for the first time and the expectations need setting before they start playing.' where id = '38166969-307d-4dd8-b550-13d3e2565284';
update public.scripts set situation = 'When the signs in a child feel beyond what a conversation at home can address, and professional support becomes the question.' where id = 'fa227e32-353b-4b95-9bba-8ff0c1184bfd';
update public.scripts set situation = 'It is 7:45am. A child will not turn off the TV before school, after being asked three times.' where id = '1e4a4e41-aeeb-4fbd-8b7b-dd6d01959aeb';
update public.scripts set situation = 'Tablet time has ended. A child has dissolved into tears or rage.' where id = 'a37056c4-6284-42c1-93a8-a2d9a23c6b89';
update public.scripts set situation = 'The device is away or screen time is limited, and a child says everything is boring. Nothing suggested is good enough.' where id = 'dc6bc0ce-cfc7-46a9-a4d3-82728da521d0';
update public.scripts set situation = 'It is 8am. A child is refusing to brush their teeth, after being asked three times, and everyone is already late.' where id = '344083e8-8c80-41b6-b695-f71929b786f1';
update public.scripts set situation = 'A child is on their third meltdown this week about what to wear, and the morning is running late again.' where id = '61085a50-9984-4a81-8502-2eeef283f3e7';
update public.scripts set situation = 'A child has just been dropped at school. The morning was hard, the day has to carry on, and it is still sitting there.' where id = '3e8c5043-3899-4942-8701-d0d1d393d5b4';
update public.scripts set situation = 'A child is clinging on at the school gate. They are crying or refusing to go in. The teacher is waiting.' where id = '9a204bbb-6f14-4620-bc09-a03dfcd67afb';
update public.scripts set situation = 'A child is raiding the cupboards the moment they come in, an hour before dinner.' where id = 'f50384f7-890b-4fe6-a39a-45826d58ff59';
update public.scripts set situation = 'Something nutritious has been made. A child is asking for nuggets, pasta, or something beige.' where id = '598209f3-032b-438b-a205-a210f6d0fcdd';
update public.scripts set situation = 'Two children have been arguing since they came home. Four interventions in, nothing is working.' where id = 'c311eaae-b508-4e33-b0c6-532ba8bfaa2a';
update public.scripts set situation = 'It is bedtime. A child is still downstairs, asking for one more thing: one more drink, one more hug, one more question.' where id = '77240adf-5ea4-48b6-a7b3-4884941eef41';
update public.scripts set situation = 'It is 11pm. A child is downstairs again or calling out for a drink, a cuddle, or because they had a bad dream.' where id = 'e2d57cdc-e7bf-4d9c-aa79-d86190c6fec5';
update public.scripts set situation = 'When a real conversation is needed and a teenager is half present and scrolling.' where id = '4daedbb8-8c5c-45dd-9575-409e09ffb70c';
update public.scripts set situation = 'When a teenager refuses to put the phone down for dinner, homework, or sleep.' where id = 'f4501a1a-6bee-4736-8edf-8b838172eac8';
update public.scripts set situation = 'When a teenager is clearly anxious about something happening on social media but will not say what.' where id = '4d2faa7b-2b46-46c2-8b05-efc7b2ae049c';
update public.scripts set situation = 'When a teenager is using their phone after lights out, often until 1 or 2am.' where id = 'abb1acd6-c240-4740-b6db-379b2c901351';
update public.scripts set situation = 'When a teenager is asking about or affected by the UK social media age restrictions.' where id = '3ad6d204-7630-4a62-9015-836d35076f90';
update public.scripts set situation = 'When a teenager is perpetually on their phone, barely responds when spoken to, and seems more present with their online world than with the family.' where id = '5d51a9d4-3f6d-4699-b1a2-bcc0f98d5b99';
update public.scripts set situation = 'When a teenager argues the screen time rules are unfair, that their friends have no limits, and that they are being treated like a child.' where id = 'e93312a7-b1e3-4b35-bfdf-eaf4d33d5616';
update public.scripts set situation = 'When a teenager disappears into their phone or console whenever there is tension at home, something goes wrong at school, or they seem low.' where id = '0798a26e-2709-4a36-8e6f-da04d83a8441';
update public.scripts set situation = 'When a teenager says everyone else has unlimited screen time, that theirs is the only strict house, and that the rules are making them a social outcast.' where id = '41968e72-793c-48dc-8b86-69c488abf436';
update public.scripts set situation = 'When a teenager is spending a lot of time in gaming communities where misogynistic, racist, or bullying language is normalised, and has started using similar language themselves.' where id = '6383c880-5d7a-4a51-a72d-8a9a08395e03';
update public.scripts set situation = 'When a teenager is spending money on loot boxes, battle passes, or other randomised reward systems in games and does not seem to see the similarity to gambling.' where id = '623f8aa1-7192-4dce-bb5f-2c40a9d74f95';
update public.scripts set situation = 'When a teenager wants to pursue competitive gaming professionally, talks about it constantly, and uses it to justify excessive gaming hours.' where id = 'e7a18f7d-b08b-4771-994d-427828556c78';
update public.scripts set situation = 'When a teenager seems to be using gaming heavily to manage anxiety, avoiding social situations, school stress, or anything that feels threatening.' where id = 'd8589682-088d-4a20-8358-16a1c0a84954';
update public.scripts set situation = 'When a teenager seems to be making decisions, attending events, or styling themselves entirely around what will look good online rather than what they actually enjoy.' where id = '265a7fff-c697-42e8-bb93-11574bf0e543';
update public.scripts set situation = 'When a teenager is either the target of an online pile on, or has taken part in one against someone else.' where id = 'f22f1654-678f-41cb-a6ae-bce3b6c4b9dd';
update public.scripts set situation = 'When a teenager is anxious about not being at events, not being included, or missing out on an exciting social life that appears to be happening without them.' where id = 'feed58f2-aaa5-421d-af6e-e4168c844616';
update public.scripts set situation = 'When a teenager has sent or received intimate images, or says they are being pressured to.' where id = '02f70035-4861-417f-9760-8cfb4892cb4d';
update public.scripts set situation = 'When a teenager is heavily influenced by influencers, comparing their appearance, lifestyle, or achievements to filtered and sponsored content.' where id = '7b4c940e-22c9-493c-969f-dd509947c052';

-- ── Shaper and Independent ──────────────────────────────────────────────────

update public.scripts set situation = 'When a teenager does not have their accounts set to private and is sharing location data, personal details, or content that identifies their school, address, or routine.' where id = 'cf7fbf0a-8ae0-4a21-bb0d-9a3bfaeb654b';
update public.scripts set situation = 'When a teenager seems to be online constantly, seeking validation or connection through social media in a way that suggests genuine loneliness rather than healthy social use.' where id = 'd3de7223-ebad-498c-999a-7f9cad11f8d7';
update public.scripts set situation = 'When a teenager is expressing increasingly extreme views, using language from ideological communities online, or following accounts that promote divisive or harmful political content.' where id = '8d4fc7a7-e72b-43e5-ac23-65c55f9286af';
update public.scripts set situation = 'When a teenager has been targeted by an online scam, whether a fake job offer, a prize too good to be true, a romantic scam, or a request for money.' where id = 'ab03742d-be82-4117-bae1-26009cdaec94';
update public.scripts set situation = 'When a teenager says intimate images of them, or of someone they know, have been shared without consent, or before it ever happens.' where id = 'e5b1b956-fc0b-49f0-9be5-6f03cd8a12c3';
update public.scripts set situation = 'When a teenager may be in contact with someone online who is not who they claim to be, or when a serious safety conversation is due at this age.' where id = '1f8e3c34-0e7f-4de5-bba8-23815960f7fa';
update public.scripts set situation = 'When a teenager is using or considering a dating app without a clear picture of the privacy and safety risks involved.' where id = '64d5fd0f-b9d9-4e38-9f8f-ea558250ca34';
update public.scripts set situation = 'When a teenager shares or believes things they have seen online without checking whether they are true or who is behind them.' where id = 'f1a75d11-aeeb-4bc9-b865-6fc554b36868';
update public.scripts set situation = 'When a teenager pushes back on the phone staying out of the bedroom at night, arguing they are old enough to manage it.' where id = '5048e112-92c3-449a-89ea-b8f066ed08df';
update public.scripts set situation = 'When a child finds out someone is spreading false or embarrassing stories about them online or in group chats.' where id = 'efa24635-8d36-4148-a500-043194388505';
update public.scripts set situation = 'When a child is targeted by several people at once in a group chat, and feels ganged up on.' where id = '4c82567d-8cb7-4592-874f-672838c47332';
update public.scripts set situation = 'When a child is thinking about, or has already shared, screenshots or posts to get back at someone who hurt them.' where id = 'afeaf0ca-79d4-42b8-b01c-ada0a7b120d4';
update public.scripts set situation = 'When a child is visibly anxious or distressed after seeing upsetting news, world events, or scary content online.' where id = 'a0da0481-30c4-4673-beb9-a6ec49aaa7f2';
update public.scripts set situation = 'When a child feels their life is boring or inadequate after time watching influencer content.' where id = 'f689cd61-a947-4b4c-8c49-6f5bdda06e47';
update public.scripts set situation = 'When a child is spending more time on social media but feeling more isolated, as though everyone else has a fuller social life.' where id = '76d8eee4-6650-43ac-a181-e91cff7ab14c';
update public.scripts set situation = 'When a child says they want to use their phone less but keeps picking it back up within minutes.' where id = '8fc889d4-8142-4d03-a2db-c92897d8fb5b';
update public.scripts set situation = 'When a child checks their phone compulsively every few minutes and gets visibly anxious when they cannot.' where id = 'd5d17fd2-6d6e-420e-8f63-ea90337ee28a';
update public.scripts set situation = 'When a child gets no likes, is ignored in a group chat, or has a post land badly, and their whole day is affected.' where id = '57a18521-a403-44d1-a40e-86964b6ec1bb';
update public.scripts set situation = 'When a child makes comments about their own body that are clearly influenced by the body types they are seeing in social media content.' where id = '8e161c3e-38d3-4e7e-87ad-cc8c98a58693';
update public.scripts set situation = 'When a child is watching gaming or fitness content featuring extremely muscular or idealised physiques, and making comments about their own body in comparison.' where id = '13797927-ee43-4828-b440-165ccfbe7a65';
update public.scripts set situation = 'When a child starts eating noticeably less, or commenting on their food intake, after watching what I eat in a day or similar content.' where id = '10f76dfe-b2e5-4196-8008-f484c5afbf22';
update public.scripts set situation = 'When a child is routinely using editing apps to change their appearance in photos before sharing them online.' where id = '3def3edc-1073-4603-907a-d0edcef950d8';
update public.scripts set situation = 'When a child''s social media feed is full of diet tips, detox content, and before and after transformation posts.' where id = '9ccf44e6-c99a-4553-a759-d0be39677279';
update public.scripts set situation = 'When a child is becoming self conscious about how they look on video calls, either refusing to turn their camera on or obsessively checking their own image.' where id = '6cb661cb-5e31-4dc7-9c8e-d47b75005262';
update public.scripts set situation = 'When a child wants to post their personal opinions where anyone can read them.' where id = '99131c15-e00a-44dd-8b36-e8eb80232965';
update public.scripts set situation = 'When a child does not yet understand that what they post online tends to stay there.' where id = '135c4be1-9746-49ef-8ac5-6f8124afd2c5';
update public.scripts set situation = 'When a child seems to be becoming a different person in how they act online.' where id = 'c8823233-501d-4e6c-9e6f-60063f4fbbbb';
update public.scripts set situation = 'When a child is gaining followers and clearly loves the attention.' where id = 'e6987024-7a60-4e03-acec-bb9d0f569934';
update public.scripts set situation = 'When something a child posted attracts a wave of negative comments.' where id = 'aa5ec40d-e7d0-43d2-a5d0-3d512924c17d';
update public.scripts set situation = 'When a child deletes their account entirely after a bad experience.' where id = 'b3630666-b15a-4ad7-99a1-91c446cc27f9';
update public.scripts set situation = 'When a child turns out to be using a fake name or an anonymous account.' where id = '75f3ef14-bf19-4cd2-8257-01786ea6695d';
update public.scripts set situation = 'When someone copies or reposts a child''s content as their own.' where id = '5f291317-41bb-42b6-9063-e8ca72c3ba15';
update public.scripts set situation = 'When a child turns out to have used AI to write a piece of homework.' where id = '1316fcf3-a690-4865-b3aa-87316bf8416b';
update public.scripts set situation = 'When a child is talking to an AI chatbot as though it is a close friend.' where id = 'd41aac74-8cb0-49fe-81b8-d0b49fee4694';
update public.scripts set situation = 'When fake AI images of classmates are being made or shared in a child''s world.' where id = 'fa9a02fc-9c87-4dfc-8f26-c320d5b23085';
update public.scripts set situation = 'When a child cannot always tell which images online are AI generated.' where id = 'feb81c6b-4457-445c-a5b2-766caa4d92bb';
update public.scripts set situation = 'When a child is unsure whether using AI in their art or writing counts as cheating.' where id = 'e5039a01-f16c-4bfa-ad80-aff6f50ada2d';
update public.scripts set situation = 'When a child needs to understand that voices can now be faked to trick people.' where id = '8fa7a8a8-86d2-445c-8c13-318f0a4b9603';
update public.scripts set situation = 'When a child is feeding personal information into AI tools without thinking.' where id = '696c69a4-e35d-4e1d-97cf-c9ba95fed045';
update public.scripts set situation = 'When checking a child''s phone without asking them first is tempting.' where id = 'f3ab193d-0ae3-4e7e-97dc-a4c387b83e05';
update public.scripts set situation = 'When a child has shown they can be trusted and the rules could loosen.' where id = '58c01706-cb4e-49b7-88cb-eb8f1e4e00b1';
update public.scripts set situation = 'When a child is upset about a new phone ban at school.' where id = '9f4edf63-2662-4753-b864-1e981ff9ef94';
update public.scripts set situation = 'When online drama spills over and starts affecting a child at school.' where id = 'a0bceda6-d604-470f-87c6-b3ce41d8e3d7';
update public.scripts set situation = 'When a teacher gets in touch about a child''s behaviour online.' where id = '2184436e-3468-4b6c-a2b7-b106f864dc4b';
update public.scripts set situation = 'When a child is using AI to help with marked coursework.' where id = 'b7c1a1ee-0960-4902-bbea-f9d184156a65';
update public.scripts set situation = 'When a child''s grades are slipping as their screen time climbs.' where id = '907318a3-f189-4213-ae23-fe55948076b1';
update public.scripts set situation = 'When a child develops a romantic interest in someone they met online.' where id = '9fc004d8-ee24-4738-af26-ccd2021e6159';
update public.scripts set situation = 'When a child is spending far more time with online friends than face to face ones.' where id = '27ad1019-1fae-44fd-af31-6c9cd3a68b7d';
update public.scripts set situation = 'When drama within a child''s friend group is playing out in group chats.' where id = '3fbcb203-3655-4243-9ccc-0be14d184f5e';
update public.scripts set situation = 'When a child says they feel closer to online friends than to friends at school.' where id = '79d3b62e-1f4b-4398-a6f1-9ddfd6e391a6';
update public.scripts set situation = 'In the car together. A teenager has been on their phone since they got in and has not looked up.' where id = '16449a28-4fc8-4a23-a554-950c06bd1291';
update public.scripts set situation = 'When a teenager comes out of their room visibly flat or irritable after time on their phone or social media.' where id = '052e43f8-5872-463f-9ad7-07e5a11fd2c7';
update public.scripts set situation = 'It is 2pm on Sunday. A teenager has not left their room since breakfast, and nobody knows what they are doing.' where id = '2ff91204-632c-4cde-8f95-25178fb03261';
update public.scripts set situation = 'When a teenager goes quiet or says something self critical after time on Instagram, and looks to be comparing themselves to what they are seeing.' where id = '15ed6149-1bbf-4560-98d3-4e090cc1a51f';
update public.scripts set situation = 'When a teenager turns out to have been messaging someone online that nobody at home knows. It could be innocent. It could be more than that.' where id = '6a44c3c6-fad2-4b37-ad0e-d0c7954c6a21';
update public.scripts set situation = 'When a teenager is furious that their friend is allowed something the family has decided against, and sees the approach as unfair or embarrassing.' where id = 'd3491fe5-fd55-4ea8-8c1e-10e033bc6423';
update public.scripts set situation = 'When a teenager has seen something online that has upset or disturbed them. They may come to you, or you may just notice they seem off.' where id = '60dc0a70-cfb2-4737-bd17-ae61416618d1';
update public.scripts set situation = 'When a child speaks to you in a way that is genuinely unkind, and the response was not your best. Or you held it together and it is still stinging.' where id = '2ad2ee7f-66cc-4313-aac8-6ff2385e60cb';
update public.scripts set situation = 'When a teenager, most often a boy, has sent an image to someone they believed was a girl their own age, and that account is now threatening to send it to their friends and family unless they pay.' where id = '35ef3a7f-ead3-4c23-a491-771ca4d92a85';
