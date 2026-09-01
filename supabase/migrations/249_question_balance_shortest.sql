-- 249: question balance, the last rank. After 245 to 248 the right answer
-- was the longest option in 20 to 33 percent of questions, but in the
-- older stages it was almost never the shortest (Independent: 1 of 60),
-- which is a pattern of its own. This extends the shortest distractor on
-- 43 questions by a clause, same misconception so the feedback stands,
-- so the right answer's length rank is spread across all three places.

update public.lessons set slides = public.gc_swap_option_text(slides, $j$[
{"q":"What is the single thing every feed algorithm is optimising for?","old":"Your happiness","new":"Your happiness and wellbeing"},
{"q":"Who actually reads their privacy settings?","old":"Only lawyers can understand them, so there is no point trying","new":"Only lawyers can understand them, so there is no point in trying at all"},
{"q":"The person who posted the polished photo looks in their own mirror. What is true?","old":"They see the polished version. That is their real face","new":"They see the polished version. That is their real face now"},
{"q":"What belongs with your people rather than the bot?","old":"Homework questions only","new":"Homework questions, and only those"},
{"q":"What changes once you can actually see the machine?","old":"Nothing. Seeing it does not switch it off","new":"Nothing. Seeing it does not switch it off or slow it"},
{"q":"A chat you like has turned into two hundred pings a night and you dread opening it. What is the strong move?","old":"Keep up with every message so nobody thinks you are rude","new":"Keep up with every message so nobody in the chat thinks you are rude"},
{"q":"You have made a brilliant edit using someone else's drawing and you are about to post it. What is the strong move?","old":"Do not post it at all, it is not your drawing","new":"Do not post it at all, because it is not your drawing"},
{"q":"Who counts for more than any follower number?","old":"Nobody, followers are the truest measure","new":"Nobody, followers are the truest measure there is"},
{"q":"Which of these is an ending you install?","old":"There is no such thing, autoplay cannot be beaten","new":"There is no such thing, because autoplay cannot be beaten"}
]$j$::jsonb)
where stage_id = 'explorer' and status = 'live' and slides is not null;

update public.lessons set slides = public.gc_swap_option_text(slides, $j$[
{"q":"Who should the overnight rule apply to?","old":"Only phones with games installed, the rest are harmless","new":"Only phones with games installed, since the rest are harmless"},
{"q":"Your teenager keeps waking to a phone buzzing by the bed and cannot drop back off. What is the single most effective move to suggest?","old":"Keep the phone by the bed, just on silent.","new":"Keep the phone by the bed, just switched to silent."},
{"q":"What do mute, block and report do that silence cannot?","old":"Make it worse by showing weakness to the other person","new":"Make it worse by showing weakness to the other person involved"},
{"q":"The community is the ONLY place they feel understood. What is the gentle worry inside that sentence?","old":"That the community is definitely dangerous and should be left","new":"That the community is definitely dangerous and should be left at once"},
{"q":"What do the nine hours actually buy you?","old":"Nothing measurable, sleep is just a pause","new":"Nothing measurable, sleep is just a pause between days"},
{"q":"When a private message gets screenshotted and shared to embarrass someone, whose fault is it?","old":"The person who wrote the message, they should have known better","new":"The person who wrote the message, because they should have known better"},
{"q":"Which prompt belongs to the learner?","old":"Make this sound like a teenager wrote it","new":"Make this sound like a teenager wrote it, please"},
{"q":"A too perfect post comes up while you scroll together. What is the lightest thing to ask?","old":"Nothing, just tell them to stop comparing.","new":"Nothing, just tell them to stop comparing themselves."},
{"q":"Most teens keep their perspective on companion bots. What is the parent's job, then?","old":"Install a companion bot yourself to compete with it","new":"Install a companion bot yourself to compete with it for their time"},
{"q":"Which single request is the loudest alarm in any online friendship?","old":"Asking their favourite subject","new":"Asking their favourite subject at school"},
{"q":"Why does the savage joke cost more than tonight's laughs pay?","old":"Because jokes about teachers are illegal and get reported","new":"Because jokes about teachers are illegal and always get reported"},
{"q":"Avoiding accounts altogether is unrealistic. What is the useful response to the contract?","old":"Sign everything without reading, like everyone else does","new":"Sign everything without reading, like everyone else does anyway"},
{"q":"Who gains when a fake clip goes round the group chat?","old":"The people in the clip, who get the attention","new":"The people in the clip, who get all of the attention"},
{"q":"Your friend said you were partly out of line, and it stung. What did the friend give you that the bot could not?","old":"Nothing, the sting means they were wrong about you","new":"Nothing, because the sting means they were wrong about you"},
{"q":"Why does panicking about the companion app push it underground?","old":"Because apps can hear panic through the microphone","new":"Because apps can hear panic through the microphone and adapt"},
{"q":"After the falling out, why did the chatbot say you were completely right?","old":"Chatbots are legally required to side with you","new":"Chatbots are legally required to side with whoever is typing"},
{"q":"A bigger account messages asking to repost your edit WITH your name on it. What is that?","old":"An insult, they should not need to ask","new":"An insult, because they should not even need to ask"},
{"q":"What is the sign that the feed changed, rather than the child?","old":"There is no difference, the child is the feed","new":"There is no difference, because the child is the feed now"}
]$j$::jsonb)
where stage_id = 'shaper' and status = 'live' and slides is not null;

update public.lessons set slides = public.gc_swap_option_text(slides, $j$[
{"q":"What is the editor's pass?","old":"A rule that AI must never be used for anything that matters, like applications","new":"A rule that AI must never be used for anything that matters, like job applications"},
{"q":"Why lock or delete selectively rather than panic deleting everything?","old":"Deleting anything is impossible once it has been indexed","new":"Deleting anything is impossible once it has been indexed by a search engine"},
{"q":"What does it mean to license your work to someone?","old":"They own it now and can do anything with it forever, that is the deal","new":"They own it now and can do anything with it forever, because that is the deal"},
{"q":"Why does the audit happen logged out, in a private window?","old":"Because searching your own name while logged in breaks the terms of service","new":"Because searching your own name while logged in breaks the terms of service of most sites"},
{"q":"A big story breaks and your feed floods with furious thirty second clips. You want to post about it. What is the strong move?","old":"Assume it is all fake and ignore the story completely until next week","new":"Assume it is all fake and ignore the story completely until next week at the earliest"},
{"q":"A first meeting goes badly: the person was nothing like their profile and pushed to move somewhere private. Whose fault is that, and what is the move?","old":"Partly yours, for trusting someone from the internet in the first place","new":"Partly yours, for trusting someone from the internet in the first place, and for going"},
{"q":"AI drafts your cover letter. It reads beautifully, but one line stretches your experience beyond the truth. What is the strong move?","old":"Bin the draft and start from a blank page. AI has no place in job applications","new":"Bin the draft and start again from a blank page. AI has no place at all in job applications"},
{"q":"What is the one thing to make unmissably clear as you hand over the wheel?","old":"That the wifi password changes weekly, so the rules still hold","new":"That the wifi password changes weekly, so the house rules still hold either way"},
{"q":"What does two step verification actually buy you?","old":"Faster logins on devices you use a lot","new":"Faster logins on the devices you use most, and not much else"},
{"q":"Someone you have talked to for three months suggests finally meeting. They offer to pick you up and drive you to their place. What is the strong move?","old":"Cancel the whole thing. Meeting people from the internet is not worth the risk at any age","new":"Cancel the whole thing. Meeting people from the internet is not worth the risk at any age, however long you have talked"},
{"q":"A clothing brand DMs you: they love your artwork, want to repost it, and ask for the original file. They offer exposure to eighty thousand followers. What is the strong move?","old":"Block them. Any brand sliding into your DMs is a scam, real ones use email","new":"Block them. Any brand sliding into your DMs is a scam, because real ones go through email and agents"},
{"q":"Why does your email get secured before every other account?","old":"Because email holds the most embarrassing things you have written","new":"Because email holds the most embarrassing things you have ever written, going back years"},
{"q":"Why run the byline test on comments too, not just posts?","old":"Because comments have a word limit, so they need more care","new":"Because comments have a word limit, so they need more care to get the tone right"},
{"q":"A voice clip of a politician says something outrageous. It sounds exactly like them. What settles whether it is real?","old":"How authentic the voice sounds","new":"How authentic the voice sounds, down to the accent and pauses"},
{"q":"Your 17 year old wants to sort out their own social media use. What is the most useful thing you can offer?","old":"Nothing, they are old enough to be left entirely to it.","new":"Nothing, they are old enough now to be left entirely to it, and asking would be interfering."},
{"q":"What is the difference between a default and a decision?","old":"Defaults are the free settings and decisions are the ones you pay for","new":"Defaults are the free settings and decisions are the ones you pay for, like premium features"}
]$j$::jsonb)
where stage_id = 'independent' and status = 'live' and slides is not null;
