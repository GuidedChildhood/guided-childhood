-- Guided Childhood — Migration 180
--
-- Platform specific scripts, batch one: Snapchat, TikTok, Instagram, WhatsApp.
--
-- Justin, 9 August 2026: "we really need many more moments and scripts for
-- social media and AI as this is core ... every possible issue with Instagram,
-- Facebook, TikTok and all top 10 social media platforms ... then a button to
-- send convert to child tips."
--
-- WHAT THE LIBRARY ACTUALLY HAD. 296 scripts, 27 of them social media. Read by
-- title, Instagram appears in two and TikTok in one. Snapchat, WhatsApp,
-- YouTube, Discord, Roblox, Facebook, X and Twitch appear in none. The library
-- is strong on themes (comparison, sleep, pile ons) and silent on the four apps
-- a parent is actually holding when they go looking. A parent does not search
-- for "social comparison", they search for "streaks".
--
-- Social media by stage was foundation 0, builder 1, explorer 9, shaper 11,
-- independent 5, so the gradual on ramp Justin asked for had no bottom rung.
-- This adds two at builder.
--
-- for_your_child is filled on ALL SIXTEEN. It was filled on 24 of 296, and it
-- is the send to child material, so every new row carries one.
--
-- THE RESEARCH, and where each script came from:
--   Snapchat  streaks read as compulsory and hurt when dropped, Snap Map shares
--             location, and the real bind is that plans happen there.
--   TikTok    engagement pulls a child deeper into whatever they linger on; an
--             account posing as a fourteen year old was served suicide related
--             posts within minutes in one newspaper investigation.
--   WhatsApp  anyone holding the number can add a child to a group with no
--             request to accept. Settings, Privacy, Groups, defaults to
--             Everyone. Remove and re add is a known exclusion tactic.
--   Instagram Teen Accounts default under 18s to private with messages limited
--             to followers, under 16s need a parent to loosen it, and unwanted
--             adult DMs are the documented contact route.
--
-- THE PHILOSOPHY, AND THE COMPLICATION. Heitner's mentoring over monitoring is
-- the match: blocking and spying drives it underground and does not prepare a
-- child for the adult version of the same space. But Livingstone's survey found
-- restriction of peer to peer contact WAS associated with reduced risk while
-- active co use was not necessarily, so none of these claim that talking always
-- beats a setting. The words come first and the setting sits in `tonight`, and
-- where a setting is simply the right move the script says so.
--
-- law_flag is full_ban_u16 on the three social platforms so Stage 4 content
-- follows the flag without a rewrite (docs/11). WhatsApp is messaging, so none.
--
-- Four of sixteen are free, one per platform, so the free tier gains a real
-- taste rather than a locked list.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements only.
-- Re running replaces the sixteen rows rather than duplicating them.

delete from public.scripts where sort_order between 9600 and 9615;

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
values

-- ── Snapchat ──────────────────────────────────────────────────────────────

('builder', 'social-media',
 'Everyone is on Snapchat and they are not',
 'Your child is eight to ten and says they are being left out of plans because the arranging happens on Snapchat. This is usually true, which is what makes it hard.',
 'You are not making that up, and I am not going to pretend it does not matter. Plans really do happen there and being outside that is a horrible feeling. Snapchat is thirteen and up, so the answer for now is no, and that is on the app rather than on you. So the question I actually want to solve is how you hear about things. Who would text you?',
 'If they are real friends they will tell you anyway.',
 'The complaint is exclusion, not the app, and answering the app question leaves the real one untouched. Naming the age limit as the app''s rule rather than a personal verdict takes the argument off you. Then solving the actual problem, how plans reach them, treats the child as someone with a real difficulty rather than someone asking for something silly.',
 'Pick one friend tonight and sort a way for them to reach your child directly, a call on your phone or a text, so being off Snapchat stops meaning being uninvited.',
 'If they say every single person in the class has it, ask them to name five. It is usually fewer than they think, and the counting is calmer than arguing.',
 'In a fortnight, ask whether they heard about the last thing that got arranged. That answer tells you if the workaround is real.',
 'Being left out is rubbish and you are allowed to say so. Snapchat says thirteen and up, so it is not you, it is the rule. Tell one friend you are not on it and ask them to text you when something is happening.',
 'full_ban_u16', true, 9600),

('explorer', 'social-media',
 'The streak they cannot lose',
 'Your child is anxious about Snapstreaks, checking the app before school, on holiday, or handing their phone to a friend to keep a streak alive.',
 'Show me the streaks. How many are you keeping? I am not asking so I can take it away. I am asking because you have been stressed about your phone for a week and I think this is why. Who decided you have to keep these going?',
 'It is just a number, it does not mean anything.',
 'Telling a child the thing they are anxious about is meaningless ends the conversation and teaches them not to bring you the next one. Counting the streaks out loud does the opposite: it makes the obligation visible, and the obligation, rather than the app, is what is doing the damage. The question about who decided it is the one that stays with them, because nobody decided it.',
 'Ask which streaks they would actually miss and which are chores. Letting one chore streak go tonight, on purpose, is the whole lesson, and it is much easier the first time with you sitting there.',
 'If they say their friend will be upset, that is worth taking seriously rather than waving off. Ask what they think their friend would say if they explained. Most of the time the friend is relieved.',
 'Ask again after the next school holiday, which is when streaks turn from a habit into a job.',
 'A streak is two people sending each other nothing to keep a number. If you are dreading it, that is the app doing its job, not you failing at yours. Try letting one go and see if the sky stays up.',
 'full_ban_u16', false, 9601),

('explorer', 'social-media',
 'Snap Map is showing where they are',
 'You have found that your child''s location is visible on Snap Map, either to their whole friends list or to people they have never met in person.',
 'Come and look at this with me. This map is showing where you are right now, and I want to know who you think can see it. Let us go through the list together, because I think it is longer than you realise.',
 'You have been broadcasting your location, do you have any idea how dangerous that is.',
 'Fear makes a child defensive and secretive, and the fix here is genuinely simple, so terror is not needed to get it. Going through the friends list together is the part that teaches, because almost every child finds names on it they cannot place. That discovery does more than any warning, and it is theirs rather than yours.',
 'Turn on Ghost Mode together tonight, then agree who, if anyone, is worth sharing location with. Two or three real friends is a reasonable answer.',
 'If they say everybody can see everybody, that is exactly the point worth making. Ask whether they would read out their address to that same list.',
 'Check the map again in a month. Friends lists grow, and this is one that quietly undoes itself.',
 'Snap Map shows where you are on a map, in real time, to everyone you have added. Scroll your friends list and count how many you have actually met. Ghost Mode turns it off and nobody is told you did it.',
 'full_ban_u16', false, 9602),

('shaper', 'social-media',
 'It disappears, so nothing counts',
 'Something happened on Snapchat, a message, an image, a threat, and your teenager says there is no point telling anyone because it has already gone.',
 'I know it disappears. That does not mean it did not happen and it does not mean nothing can be done. Tell me what it said. If it happens again, press and hold to screenshot or use another phone to photograph the screen, and I will not ask you to prove anything you do not want to.',
 'Why did you not screenshot it?',
 'Asking why they did not gather evidence turns a child who is already upset into a suspect. Giving the instruction for next time, calmly and after the fact, is the same information without the blame. Saying the disappearing does not erase what happened is the sentence that matters, because that belief is exactly what predatory and cruel behaviour on the platform relies on.',
 'Agree a signal tonight, a single word they can text you, that means come and get me and ask nothing until we are home.',
 'If they refuse to say what it said, do not force it. Say you will be up, and leave the door open. Most of it comes out within a day if you have not made it a trial.',
 'Ask in a week whether it stopped, in a way that does not reopen the whole thing. "Is that person still bothering you" is enough.',
 'Things that disappear still happened. Screenshot it or photograph the screen with another phone if you can, but if you did not, tell someone anyway. Nobody sensible will ask you to prove it first.',
 'full_ban_u16', false, 9603),

-- ── TikTok ────────────────────────────────────────────────────────────────

('explorer', 'social-media',
 'The feed got dark and they did not choose it',
 'Your child''s TikTok feed has drifted towards sad, angry, extreme or frightening content, and they did not go looking for it.',
 'Can I see what it is showing you? Not to check up on you, because I want to see what it decided you like. It watches how long you look at things, so pausing on one sad video twice can turn the whole feed sad. That is the app getting it wrong about you, not you being a bit dark.',
 'That is what you get for being on it. I told you.',
 'A child whose feed has gone dark often half believes it reflects something true about them, which is the genuinely harmful part. Naming the mechanism, that lingering is a vote, moves the cause from their character to a system they can operate. That is the difference between shame and a skill.',
 'Sit together and long press three of the worst ones, choose not interested, and search for two things they actually love. The feed shifts within a day and watching it shift is the lesson.',
 'If they say they do not care and it is funny, do not argue the point. Ask how they sleep, and how they feel after an hour of it. Let their own answer do the work.',
 'Look again in a fortnight and ask whether it went back. If it did, the reset is a habit rather than a one off, and that is worth knowing.',
 'TikTok watches how long you look, not what you like. Stop on one sad video twice and it brings you more. Hold a video down and press not interested, then search for stuff you actually enjoy. You can steer it. Most people never try.',
 'full_ban_u16', true, 9604),

('explorer', 'social-media',
 'They cannot settle to anything any more',
 'Homework, a film, a conversation. Your child cannot stay with anything, and it started somewhere around the time short video became the main thing they watch.',
 'I have noticed you find it hard to stay with things at the moment and I do not think that is you being lazy. Twenty videos in ten minutes trains your brain to expect something new every thirty seconds, and then a chapter of a book feels broken. It is not broken. It is just slow, and slow takes practice again.',
 'Your attention span is ruined.',
 'Ruined is a verdict about the child and it is not accurate, which makes it both unkind and easy to dismiss. Describing what fast content trains, and saying the slow thing takes practice, gives them something to do about it. Children accept this explanation far more readily than adults expect, because they have usually noticed it themselves.',
 'Pick one slow thing tonight and do it together for twenty minutes with both phones in another room. A film, a walk, a game. The point is finishing something.',
 'If they say they concentrate fine, do not push. Suggest the twenty minutes as an experiment rather than a treatment and let them notice.',
 'Ask in a fortnight whether the slow thing got easier. Usually it does, and hearing themselves say so is worth more than being told.',
 'Watching loads of short videos trains your brain to expect a new thing every few seconds, so books and films start feeling slow. Nothing is wrong with you. Try twenty minutes on one thing with your phone in another room and see if it gets easier.',
 'full_ban_u16', false, 9605),

('shaper', 'social-media',
 'They want to post videos of themselves',
 'Your teenager wants to start posting to TikTok properly, with their face, their voice and their name attached.',
 'I am not going to say no to this. I want to think about it with you though, because posting your face is different from watching. Who is it for? And what happens if a video of yours does the thing you are hoping for and half a million strangers see it?',
 'Absolutely not, you have no idea who is out there.',
 'A flat refusal on something this age appropriate is what pushes an account underground, where you cannot see it at all. Asking who it is for is the useful question, because a child making things for friends and a child chasing strangers are doing two different activities with two different risks. Asking about going viral prepares them for the outcome they are actually hoping for, which nobody usually plans for.',
 'Set the account up together tonight, private to start, and agree to review it in a month. Starting private and opening later is far easier than the reverse.',
 'If they say a private account is pointless, that is a fair point and worth conceding. Say it is a month, not a life sentence, and that you would rather they learned the editing before they learned the comments.',
 'A month later, sit down and look at it together. Ask what the comments have been like. That question opens more than any settings check.',
 'Posting your face is a different thing from watching, and it is fine to want to. Start private, work out what you are making and who for, then decide about opening it. If something takes off, that is a lot of strangers all at once, and it is worth having thought about that first.',
 'full_ban_u16', false, 9606),

-- ── Instagram ─────────────────────────────────────────────────────────────

('explorer', 'social-media',
 'Asking for Instagram, and what a Teen Account actually does',
 'Your child is asking for Instagram and you do not know whether the protections you have heard about are real or marketing.',
 'Let us look at it properly rather than me guessing. If you have an account under eighteen it is a Teen Account, which means private by default and only people who follow you can message you. Under sixteen you cannot loosen those without me. So the question is not whether you get the protected version, you do. The question is whether now is the right time.',
 'Fine, but I will be checking it whenever I want.',
 'Announcing surveillance as the price of a yes sets the relationship up as adversarial from day one and reliably produces a second account. Naming what the protections actually are moves the conversation off whether the app is safe and onto timing, which is the real question and one a child can take part in.',
 'If the answer is yes, set it up together tonight and turn on supervision with them watching, so it is a thing they know about rather than a thing they discover.',
 'If they want the settings loosened, ask which one and why. Sometimes the answer is reasonable, and agreeing to one specific change buys more honesty than holding the whole line.',
 'A month in, ask who has followed them that they do not know. That is the question that finds the drift.',
 'Under eighteen, Instagram makes your account private and only lets people who follow you message you. Under sixteen you need a parent to change that. That is the app, not your parent being difficult.',
 'full_ban_u16', true, 9607),

('shaper', 'social-media',
 'The second account you were not meant to find',
 'You have discovered your teenager has another Instagram account, often a smaller private one for close friends.',
 'I know about the other account. I am not going to make a huge thing of it, and I would rather understand it than punish it. Most people I know your age have one. What goes on there that does not go on the main one?',
 'You lied to me. Give me your phone.',
 'A second account is usually not deception, it is an audience problem: the main account has family, teachers and people from primary on it, so a smaller one is where they are less performed. Treating that as a lie collapses the actual distinction and guarantees a third account you will not find. Asking what goes there gets you the truth about the risk, which is who is on the smaller list.',
 'Ask to see who follows the second account. Not the posts, the followers. That list is where the actual risk lives, and asking only for that is a much easier yes.',
 'If they refuse outright, do not force it tonight. Say you are not asking for the messages and you are not deleting it, and ask again in a couple of days. Forcing this one costs more than it gains.',
 'Come back in a month and ask whether the smaller list has grown. It usually has, and that is the conversation, not the account itself.',
 'Loads of people have a second account because the main one has your nan on it. That is fair enough. The bit that matters is who is on the smaller list, because that is the one where you say more.',
 'full_ban_u16', false, 9608),

('shaper', 'social-media',
 'A message from someone they do not know',
 'An adult or a stranger has messaged your teenager on Instagram, and it may have been friendly, flattering, or gone on for a while before you heard about it.',
 'Thank you for telling me. That took something, and you are not in trouble for any of it. Can I see the messages from the start? I want to see how it began, because the beginning is usually the part that tells you what it was.',
 'How could you be so stupid, you have been talking to a grown man.',
 'Grooming works by being kind first and by making the child feel it was their choice, which is exactly why blame lands so hard and silences them so completely. Reading from the beginning together is both the practical step, because that is where the pattern shows, and the reassuring one, because they see for themselves that it was designed rather than deserved.',
 'Report and block from inside the app together tonight, and keep the screenshots first. If anything sexual was said or asked for, report it to CEOP at ceop.police.uk.',
 'If they defend the person, expect that and do not argue about whether the person is nice. Stay on the facts: an adult messaging a teenager they do not know is the part that is wrong, whatever else is true.',
 'Check in a fortnight, quietly, whether anyone new has tried. Reported accounts come back under new names.',
 'If someone you do not know messages you and it feels nice, that is normal and it is also how it starts. Keep the messages, show an adult, and let them be the one who decides if it is nothing.',
 'full_ban_u16', false, 9609),

-- ── WhatsApp ──────────────────────────────────────────────────────────────

('builder', 'social-media',
 'Added to a group by someone they do not know',
 'Your child has been added to a WhatsApp group full of strangers, or with content in it that has nothing to do with them.',
 'You did not do anything wrong here. Anyone who has your number can add you to a group and you do not get asked first, which is a rubbish way for it to work. Let us leave it, and then let us change the setting so it cannot happen again.',
 'Why are you in a group like that? Who gave them your number?',
 'This one genuinely is not the child''s doing. The app''s default lets anyone holding the number add them with no request to accept, so an interrogation punishes a child for a setting. Saying the default is rubbish, out loud, is what makes them willing to show you the next one instead of leaving it and saying nothing.',
 'Tonight, Settings, then Privacy, then Groups, and change it from Everyone to My Contacts. Two taps and this stops being possible.',
 'If they want to stay in it because a friend is there, ask who added them. If nobody can say, that is the answer.',
 'Ask in a month whether it has happened again. If it has, the setting did not save, which is worth knowing.',
 'Anyone with your number can put you in a WhatsApp group without asking. That is the app, not you. Leave it and get a grown up to change Settings, Privacy, Groups to My Contacts.',
 'none', true, 9610),

('explorer', 'social-media',
 'Taken out of the group on purpose',
 'Your child has been removed from a group chat, or added and removed repeatedly, and it is being done to hurt them.',
 'Being taken out of that group was meant to hurt and it did. I am not going to tell you it does not matter. Removing someone is one of the easiest cruel things there is, which is exactly why people do it. Who did it, and are they doing it to anyone else?',
 'Just leave the group, then they cannot do it to you.',
 'Telling them to leave asks the child being hurt to do the withdrawing, which reads as being told the problem is theirs to absorb. It also removes your only view of it. Asking whether it is happening to others matters because exclusion in a class group is rarely aimed at one child, and that is the fact a school can act on.',
 'Screenshot the removals tonight, with dates. If it keeps happening, that record is what makes a school conversation about a pattern rather than about a feeling.',
 'If they beg you not to tell the school, take that seriously and say so. Agree a line together, something like if it happens twice more, and hold to it.',
 'Two weeks later, ask about the group without naming the person. "How is the chat" gets more than "has X done it again".',
 'Getting removed from a chat is a real thing to be upset about, not a small thing. Screenshot it with the date. If it keeps happening, that list is what gets it taken seriously.',
 'none', false, 9611),

('explorer', 'social-media',
 'The class group at eleven at night',
 'The class WhatsApp group is going off late into the night and your child cannot leave it alone, or cannot leave it at all.',
 'That group does not stop, and I do not think you can be the one who stops it. So let us take you out of the room instead of you out of the group. What actually happens if you mute it until the morning?',
 'Just turn your phone off. It is not that difficult.',
 'It is that difficult, because the cost of muting is missing what happened, and being the person who did not know is a real social cost the adult saying this has forgotten. Muting until morning rather than leaving keeps the standing and drops the vigilance, which is the part destroying the sleep.',
 'Mute it tonight until eight in the morning, together, and put the phone somewhere outside the bedroom. Muting only works if the phone is not in reach.',
 'If they say they will miss something, agree that they will. Ask what the worst thing they would miss actually is. Usually it is knowing, rather than anything they would have done.',
 'Ask in a week how they slept. If the answer is better, they will keep the mute without you asking.',
 'Muting is not leaving. Nobody gets told you muted it. You can catch up in the morning and still be in the group, and you get to sleep.',
 'none', false, 9612),

('shaper', 'social-media',
 'Something vile got forwarded into the group',
 'A violent, sexual or otherwise disturbing image or video has been forwarded into a group chat your teenager is in.',
 'Do not forward it and do not delete it yet. You are not in trouble for being sent it, being sent something is not the same as sharing it. Tell me what it was, roughly, and then we will decide together what happens next.',
 'Delete it right now and do not mention it to anyone.',
 'Delete it and say nothing is the instinct, and it removes the record while leaving whatever it was circulating. Separating being sent something from sharing it is the sentence that keeps a teenager honest with you, because their real fear is being treated as part of it. Forwarding on is what turns a witness into a participant, sometimes legally, which is why the first instruction is do not forward.',
 'Tonight, work out who sent it into the group. If it involves anyone under eighteen in a sexual image, do not keep a copy, report it to CEOP at ceop.police.uk and let the school know.',
 'If they say everyone has seen it and it is too late, that is not the point and is worth saying gently. The question is whether it stops with them.',
 'Come back in a week and ask whether it is still going round. These things have a long tail in a year group.',
 'Being sent something is not the same as sharing it. Do not forward it on, that is the bit that turns you into part of it. Tell an adult, even late, even if everyone has seen it already.',
 'none', false, 9613),

('shaper', 'social-media',
 'Screenshots of a private chat going round',
 'Something your teenager wrote in a private message has been screenshotted and shared with people it was never meant for.',
 'That was private and someone made it public, and that is a thing that was done to you. Before we deal with who did it, tell me what is actually in it, because I would rather hear it from you than from a school office.',
 'Well, that is what happens when you put things in writing.',
 'True and useless. It tells a teenager who is already exposed that they had it coming, which ends the conversation exactly when you need it open. Hearing the content first is genuinely practical, because your options differ enormously depending on whether it is embarrassing, cruel about someone else, or an image.',
 'Work out tonight how far it has gone and whether anyone else is named in it. If someone else is in it, they may need to hear it from your teenager before they hear it from anyone else.',
 'If they want to retaliate with screenshots of their own, say no clearly and explain why. Adding to it moves them from the wronged person to one of the people doing it.',
 'Ask in a fortnight whether it died down. Most do, and knowing that in advance helps them survive the week it does not feel that way.',
 'Anything you type can be screenshotted, including in chats that say they delete. That does not make it your fault when someone does it. Tell someone early, and do not post their messages back.',
 'none', false, 9614),

('independent', 'social-media',
 'Cleaning up what is already out there',
 'Your teenager is approaching sixteen and beyond, thinking about jobs, university or moving on, and there are years of posts behind them.',
 'You have had these accounts since you were twelve and you are not the same person. That is not a warning, it is just true. Shall we go back through the old stuff together and decide what still represents you? Not because anyone is looking, but because you get to choose what stays.',
 'You had better clean that up before anyone sees it.',
 'Framing it as damage control makes them defensive about a twelve year old''s posts, which nobody should have to defend. Framing it as choosing what represents them now gives the same result and gives them the authorship. It also teaches the habit as ordinary maintenance rather than as panic before an application.',
 'Do one year of it tonight, oldest first. An hour clears more than they expect and the oldest year is usually the easiest to be ruthless with.',
 'If they say nobody cares about old posts, they are mostly right. Say so, and do it anyway for the reason that it is theirs to curate.',
 'Suggest doing this once a year, around a birthday, so it becomes maintenance rather than an emergency.',
 'You have been posting since you were twelve and you are not that person now. Going back through and deleting what does not sound like you is not panic, it is just tidying. Start with the oldest year, it is the easiest.',
 'full_ban_u16', false, 9615);
