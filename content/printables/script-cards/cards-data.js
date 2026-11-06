// SAY THIS: THE SCRIPT CARDS' WORDS, IN ONE PLACE.
//
// Shared by print.html, phone.html and listing/images.html so the three can
// never drift. Built 5 November 2026 from the product's own scripts:
//
//   card 1 of each level   lib/content/stages.ts, that stage's script, the
//                          same talk the Passport's stage page asks for
//   cards 2 to 10          rows of the live scripts table (law_flag none),
//                          read from the database on 5 November 2026; the
//                          row id is in each card's proof
//
// THE RULES THE WORDS FOLLOW. "say" is the script's say_this word for word
// (the one change: "wind-down" is written "wind down", because no copy
// carries a dash). "why" is a cut of the row's why_it_works, never a
// rewording, picked to carry no statistic and no promise about a child.
// "front" and "sub" are the moment: the child's words (kind q) or the
// situation (kind m), shortened from the row's situation. "help" is a line
// the script itself gives, kept on the safety cards.
//
// Every script was already a calibrated pathway, never a yes or a no, which
// is why it can be on a card. To change a card, change the script in the app
// first, then here.
//
// Friend tints are brand/GDC_SOCIAL_VISUAL_SYSTEM.md section 4 (accent, soft
// ground, ink); the ages are the app's (lib/content/stages.ts).
window.SAY_THIS = {
  levels: {
    pebble: { n: 1, friend: 'Pebble', stage: 'Foundation', ages: '4 to 7', accent: '#C99A28', soft: '#FBEED0', ink: '#7A5A0E',
      about: 'First screens, first rules, and the big feelings when the screen goes off.' },
    bloop: { n: 2, friend: 'Bloop', stage: 'Builder', ages: '8 to 10', accent: '#6C9E38', soft: '#E4F0D4', ink: '#3F5E1E',
      about: 'Gaming, group chats, the bedroom and the first phone ask, before the habits set.' },
    orbit: { n: 3, friend: 'Orbit', stage: 'Explorer', ages: '11 to 12', accent: '#3E86BC', soft: '#DCEBF7', ink: '#1F4E6E',
      about: 'The first phone, the feed, the class group at night, and what AI actually is.' },
    nova: { n: 4, friend: 'Nova', stage: 'Shaper', ages: '13 to 15', accent: '#7E5AB0', soft: '#ECE3F7', ink: '#4A2F73',
      about: 'When things go wrong online, and keeping the door open while you still can.' },
    cosmo: { n: 5, friend: 'Cosmo', stage: 'Independent', ages: '16 and up', accent: '#CE7328', soft: '#FBE4D0', ink: '#8F4A12',
      about: 'Asking rather than telling, as the phone and the choices become theirs.' },
  },
  cards: [
  {
    "n": 1,
    "level": "pebble",
    "label": "The first screen",
    "kind": "m",
    "front": "Screens are new, and there is no rule yet.",
    "sub": "The First Device Conversation. The talk on the Pebble page of the Passport.",
    "say": "We have a family rule about screens. When the timer goes off, screens go down. Every time, no exceptions. And then we do something together.",
    "why": "Children at this stage cannot regulate device use themselves.",
    "help": null,
    "proof": "lib/content/stages.ts, pebble stage script"
  },
  {
    "n": 2,
    "level": "pebble",
    "label": "The timer goes",
    "kind": "q",
    "front": "I am not finished!",
    "sub": "They cry, argue or melt down as the TV or tablet goes off.",
    "say": "I know that feels really hard. Your brain wants to keep going. That is normal. Let us do a quick wind down together and then I will tell you when we can watch again.",
    "why": "The meltdown is a nervous system response, not a behaviour problem.",
    "help": null,
    "proof": "scripts table, id 8c69f7bd-4149-4581-a950-45df4c7b5cdf (Meltdown when screen time ends)"
  },
  {
    "n": 3,
    "level": "pebble",
    "label": "The timer goes",
    "kind": "q",
    "front": "Not yet! Two more minutes!",
    "sub": "You give the warning, you count down, and the ending still ends in tears.",
    "say": "When this episode finishes, the tablet finishes too. Not me, the tablet. Let us watch the last bit together and see the end come. Then it is your turn to press the button.",
    "why": "The countdown feels like fairness, and for a four year old it is a slow burning threat with a parent attached to it.",
    "help": null,
    "proof": "scripts table, id c6510bcb-5ffa-4bb2-a80d-d0116e6c6be6 (The two minute warning is making it worse)"
  },
  {
    "n": 4,
    "level": "pebble",
    "label": "The phone ask",
    "kind": "q",
    "front": "Why can I not have my own phone?",
    "sub": "Your 5, 6 or 7 year old asks why they cannot have one like their friend.",
    "say": "Your brain is still growing the part that helps you put the phone down. When that part is stronger you will be ready. Right now we share mine when we need it.",
    "why": "Explaining the biology rather than asserting authority keeps the conversation open.",
    "help": null,
    "proof": "scripts table, id e9d06c4a-6f50-45f8-a355-b355a39a69fd (Asking for their own phone)"
  },
  {
    "n": 5,
    "level": "pebble",
    "label": "Everyone else has it",
    "kind": "q",
    "front": "But all my friends play it!",
    "sub": "They ask, for the first time, to play a game because all of their friends are playing it.",
    "say": "I can tell this one really matters because your friends love it. Let me have a proper look at it first, and then we will decide together if it is right for you.",
    "why": "Wanting to belong is one of the strongest drives at this age, so this request is about friendship as much as the game.",
    "help": null,
    "proof": "scripts table, id a979b76f-5385-4311-a749-432617fa4545 (The game their friends play)"
  },
  {
    "n": 6,
    "level": "pebble",
    "label": "Bedtime",
    "kind": "q",
    "front": "Just one more show before bed.",
    "sub": "A screen in the hour before bed has become part of their wind down.",
    "say": "Screens are done for the night now. Your brain needs time to slow down before sleep, and screens make that harder. Let's do something calmer together.",
    "why": "Framing it as brain science rather than a rule removes the battle of wills.",
    "help": null,
    "proof": "scripts table, id 9fa1c85a-3d8c-402c-9531-4459c272ccff (Screens before bed)"
  },
  {
    "n": 7,
    "level": "pebble",
    "label": "After the screen",
    "kind": "q",
    "front": "I am bored. There is nothing to do.",
    "sub": "The device is away, and nothing suggested is good enough.",
    "say": "I hear you. Bored is uncomfortable. Give it ten minutes and see what your brain comes up with.",
    "why": "The uncomfortable gap is real, not performed.",
    "help": null,
    "proof": "scripts table, id dc6bc0ce-cfc7-46a9-a4d3-82728da521d0 (When They Say Everything Is Boring Without a Screen)"
  },
  {
    "n": 8,
    "level": "pebble",
    "label": "Sharing",
    "kind": "q",
    "front": "It is MY turn!",
    "sub": "Two children, one tablet, and the volume is climbing.",
    "say": "Stop, both of you. The tablet sits on the side while we sort this out. It is one turn each, ten minutes, and the timer decides when, not the loudest voice. Who was mid turn? Then that turn finishes first.",
    "why": "A visible timer moves the battle from you against them to everyone against the clock.",
    "help": null,
    "proof": "scripts table, id 954358c1-8839-45f6-a4b9-86552de2b786 (Sibling fight over the device)"
  },
  {
    "n": 9,
    "level": "pebble",
    "label": "Strangers online",
    "kind": "q",
    "front": "Who is that talking in my game?",
    "sub": "Your young child is starting to play games or use apps online.",
    "say": "You know how we have a rule about strangers in real life? We have the same rule online. Someone online you have never met in real life is a stranger, even if they seem friendly. You always come and tell me if someone you don't know tries to talk to you.",
    "why": "The most important outcome is a child who comes to a trusted adult rather than handling something confusing or worrying alone.",
    "help": null,
    "proof": "scripts table, id 9ffe6ecf-eeb0-4fbf-9b10-2a3c2546520d (Strangers online)"
  },
  {
    "n": 10,
    "level": "pebble",
    "label": "Repair",
    "kind": "m",
    "front": "You shouted. They are quiet now.",
    "sub": "And you feel sick about it.",
    "say": "I shouted and that was not okay. It was not your fault. I am working on it. I love you.",
    "why": "No parent avoids the rupture and every parent can do the repair.",
    "help": null,
    "proof": "scripts table, id 16318ed4-a5cd-4288-b4d2-811d4333f499 (After you lost your temper)"
  },
  {
    "n": 11,
    "level": "bloop",
    "label": "The bedroom",
    "kind": "q",
    "front": "Can my phone sleep in my room?",
    "sub": "The Bedroom Rule. The talk on the Bloop page of the Passport.",
    "say": "Where does your phone sleep at night? In our house, phones sleep in the kitchen. The bedroom is for sleep. That is our rule and it will not change.",
    "why": "Set it now, before they have a personal device, and it is just how things work.",
    "help": null,
    "proof": "lib/content/stages.ts, bloop stage script"
  },
  {
    "n": 12,
    "level": "bloop",
    "label": "The timer goes",
    "kind": "q",
    "front": "I cannot stop now, I am mid match!",
    "sub": "They are mid game, other children are relying on them, and leaving now costs them something real.",
    "say": "I know you cannot just walk out of a match, that is not me not listening. So here is what we are going to do from now on. Before you start, we agree how many matches, and you stop at the end of the last one, never in the middle. For this one, tell me how long it has left, and I will hold you to it.",
    "why": "In a team game, leaving mid match takes the other players down with you.",
    "help": null,
    "proof": "scripts table, id c34dec15-0836-4e59-8a60-beb42a1236f4 (They cannot stop in the middle of a match)"
  },
  {
    "n": 13,
    "level": "bloop",
    "label": "Gaming",
    "kind": "q",
    "front": "It is so unfair! I always lose!",
    "sub": "They have just thrown a controller, burst into tears, or shouted after losing a game.",
    "say": "That was really frustrating. Take a minute. I am going to get you a drink.",
    "why": "The emotion is real even when the trigger seems small.",
    "help": null,
    "proof": "scripts table, id dfb0c55a-16b2-48f1-90c2-fe2fc3fb7ae5 (Gaming Rage)"
  },
  {
    "n": 14,
    "level": "bloop",
    "label": "Everyone else has it",
    "kind": "q",
    "front": "Everyone is in the group chat but me.",
    "sub": "Your 8, 9 or 10 year old asks to join a messaging app or game chat because their friends are on it.",
    "say": "I want you to be connected with your friends. Let us look at this together and work out whether it is designed for your age and what the rules would be if you joined.",
    "why": "Blanket refusal at this stage pushes the conversation underground.",
    "help": null,
    "proof": "scripts table, id 5e89270c-0865-40a3-8091-39665a1fafdb (First social platform request)"
  },
  {
    "n": 15,
    "level": "bloop",
    "label": "The phone ask",
    "kind": "q",
    "front": "Am I getting a phone for secondary school?",
    "sub": "Year 6 has started, and the phone question is in the air.",
    "say": "You are probably getting a phone before secondary school, and I want us to plan it together now rather than fight about it in October. So let us decide three things while it is easy. Where it sleeps at night, which is not your bedroom. What it is for to start with. And a promise from me: if you ever show me something bad on it, the phone stays yours. Telling me never costs you the phone.",
    "why": "Every decision is easier before the box is opened.",
    "help": null,
    "proof": "scripts table, id 7c9229cc-875c-46a1-b3cf-596828ae85fb (The Year 6 phone plan, before the box is opened)"
  },
  {
    "n": 16,
    "level": "bloop",
    "label": "Alone with a screen",
    "kind": "q",
    "front": "Can I watch YouTube in my room?",
    "sub": "They want to watch YouTube in their room on their own.",
    "say": "YouTube is built to keep you watching. That is not your fault, it is how it works. For now, can we keep it in the living room so I can see what comes up? When you are older and we both feel confident about it, we can talk about moving it.",
    "why": "The child hears \"I trust you, I do not trust the algorithm.\"",
    "help": null,
    "proof": "scripts table, id 9319b187-438e-4420-876d-ea7092894485 (Asking to watch YouTube unsupervised)"
  },
  {
    "n": 17,
    "level": "bloop",
    "label": "Strangers online",
    "kind": "q",
    "front": "I play with someone online. They are really good.",
    "sub": "They have been playing with people they do not know in real life, and chatting during the game.",
    "say": "Who are you playing with? Tell me about them. I'm not going to stop you playing, but I want to make sure you know the rules about what's safe to share with people you only know online.",
    "why": "Teaching the specific rules around what to share and what to keep private is more durable and more honest.",
    "help": null,
    "proof": "scripts table, id 2bb35db3-51f7-4356-a57f-01c53ce79eea (Online gaming with strangers)"
  },
  {
    "n": 18,
    "level": "bloop",
    "label": "Money in games",
    "kind": "q",
    "front": "Can I buy this skin? It is only 800 coins.",
    "sub": "They are asking to buy in game items and do not fully understand that real money is involved.",
    "say": "Let me show you what that actually costs in real money. That skin costs the same as a trip to the cinema for both of us. I'm not saying never, but I want you to understand what you're asking for before we decide.",
    "why": "Children often genuinely do not connect digital currency to real world money.",
    "help": null,
    "proof": "scripts table, id 0ececca5-ffc7-46e6-93b9-0e613fcaf533 (Requests for in-game purchases)"
  },
  {
    "n": 19,
    "level": "bloop",
    "label": "Group chats",
    "kind": "q",
    "front": "Nothing. I am fine.",
    "sub": "They came home quiet, and something happened in the class group chat.",
    "say": "Something happened in the group chat, didn't it. You don't have to tell me what. But I am here if you do.",
    "why": "Naming what you can see and leaving the door open gets you more than demanding to see the evidence.",
    "help": null,
    "proof": "scripts table, id 7ee064e9-08b1-49b9-9a53-47acb7f4c2ba (When Group Chat Drama Comes Home)"
  },
  {
    "n": 20,
    "level": "bloop",
    "label": "Sneaking",
    "kind": "m",
    "front": "The tablet was on under the covers again.",
    "sub": "Getting up early, using a device after lights out, or hiding what they are doing.",
    "say": "I found out you had the screen on when you were not supposed to. I'm not going to shout, but I do want to understand why. Can you tell me what was going on?",
    "why": "Sneaking usually means the child feels the limit is either unfair or unachievable.",
    "help": null,
    "proof": "scripts table, id a3a6d534-0143-4378-a975-14a89cf4506f (Sneaking screen time)"
  },
  {
    "n": 21,
    "level": "orbit",
    "label": "The feed",
    "kind": "q",
    "front": "Why does it keep showing me this stuff?",
    "sub": "The Algorithm Conversation. The talk on the Orbit page of the Passport.",
    "say": "Did you know your phone is learning what you like? Every video you watch, every post you pause on, it notes it. Let me show you something. Open your feed and we will look at it together.",
    "why": "The parent who can talk about this without alarm is the greatest protective factor.",
    "help": null,
    "proof": "lib/content/stages.ts, orbit stage script"
  },
  {
    "n": 22,
    "level": "orbit",
    "label": "The timer goes",
    "kind": "q",
    "front": "Five more minutes. Please.",
    "sub": "Bedtime has already been extended twice.",
    "say": "I know. And we are done now. Device off. I will come in to say goodnight.",
    "why": "The five more minutes negotiation reflects genuine disappointment, not defiance.",
    "help": null,
    "proof": "scripts table, id d0304dbe-df42-47d2-8feb-e42cc8159643 (The Just Five More Minutes Loop)"
  },
  {
    "n": 23,
    "level": "orbit",
    "label": "The first phone",
    "kind": "q",
    "front": "If I tell you, will you take my phone?",
    "sub": "You want them to tell you when something goes wrong on it, and you fear they will not.",
    "say": "I need you to hear this properly. If you ever see something on your phone that scares you, or someone sends you something horrible, or you get into something you cannot get out of, you come and show me, and the phone stays yours. I will not take it off you for telling me. Telling me is the thing that keeps it.",
    "why": "Children go quiet when telling costs them the phone.",
    "help": null,
    "proof": "scripts table, id 1ae25188-e159-4f53-b549-43f2e037c3bb (The no confiscation promise, said out loud)"
  },
  {
    "n": 24,
    "level": "orbit",
    "label": "Everyone else has it",
    "kind": "q",
    "front": "Everyone else is allowed!",
    "sub": "Their friends are allowed far more than they are.",
    "say": "I believe you that your friends have different rules, and that does feel unfair. Every family decides what works for them, and I am happy to explain the why behind ours.",
    "why": "Acknowledging the unfair feeling while standing by your why teaches them rules can have reasons, not just power.",
    "help": null,
    "proof": "scripts table, id 50f885f7-70ed-46f3-b443-9f74ed73a315 (When rules feel unfair)"
  },
  {
    "n": 25,
    "level": "orbit",
    "label": "Group chats",
    "kind": "q",
    "front": "I cannot mute it. I will miss everything.",
    "sub": "The class group is going off late into the night and they cannot leave it alone.",
    "say": "That group does not stop, and I do not think you can be the one who stops it. So let us take you out of the room instead of you out of the group. What actually happens if you mute it until the morning?",
    "why": "Muting until morning rather than leaving keeps the standing and drops the vigilance.",
    "help": null,
    "proof": "scripts table, id 9dfcab36-6c7e-43a5-99f8-569584d4678b (The class group at eleven at night)"
  },
  {
    "n": 26,
    "level": "orbit",
    "label": "Left out",
    "kind": "q",
    "front": "They took me out of the group.",
    "sub": "They have been removed from a group chat, and it is being done to hurt them.",
    "say": "Being taken out of that group was meant to hurt and it did. I am not going to tell you it does not matter. Removing someone is one of the easiest cruel things there is, which is exactly why people do it. Who did it, and are they doing it to anyone else?",
    "why": "Telling them to leave asks the child being hurt to do the withdrawing.",
    "help": null,
    "proof": "scripts table, id 724e9b61-554f-4693-b5d7-cb59606ed020 (Taken out of the group on purpose)"
  },
  {
    "n": 27,
    "level": "orbit",
    "label": "Something went wrong",
    "kind": "q",
    "front": "Someone keeps being horrible to me online.",
    "sub": "Someone is being cruel to them in messages, comments or posts.",
    "say": "I am really glad you told me. That sounds genuinely awful, and it makes complete sense that you are upset. Can you show me what has been happening so I understand the full picture?",
    "why": "Starting with validation before solutions tells your child their feelings are the priority, not the fix.",
    "help": null,
    "proof": "scripts table, id 9b6b7652-11bb-42be-b57b-23091f2c2f22 (They are being bullied online)"
  },
  {
    "n": 28,
    "level": "orbit",
    "label": "Feelings",
    "kind": "m",
    "front": "Off the phone, upset, and not saying why.",
    "sub": "Irritable, withdrawn or tearful, and they will not talk about what they saw.",
    "say": "You seem like something got to you. I am not going to ask you to tell me what it was. But if something is sitting with you and you want to talk later, I am here. That is it.",
    "why": "Interrogating the child immediately after an emotional response to content closes the door.",
    "help": null,
    "proof": "scripts table, id d4d435c6-9caf-4cba-8417-192a1e66283c (Mood change after phone use)"
  },
  {
    "n": 29,
    "level": "orbit",
    "label": "Money in games",
    "kind": "q",
    "front": "It was only a few pounds.",
    "sub": "Money has gone out on skins, coins, a battle pass or a loot box.",
    "say": "I am not cross, and I want to understand it before we sort it. Show me what you bought and what it does. Then show me what it cost, because I think the game made that quite hard to see, and I want to know whether you knew.",
    "why": "Start with what it does rather than what it cost, and you will find out whether this was a decision or a design.",
    "help": null,
    "proof": "scripts table, id 9ab877b9-6285-43b3-8876-1052e0b903b9 (They have spent real money on the game)"
  },
  {
    "n": 30,
    "level": "orbit",
    "label": "AI",
    "kind": "q",
    "front": "What actually is AI?",
    "sub": "They ask what AI is and how it works.",
    "say": "Think of it as a very clever guesser. It has read a huge amount of writing and learned to predict what words usually come next, so it sounds sure even when it is wrong.",
    "why": "Knowing it guesses helps them treat its answers as a starting point, not the final word.",
    "help": null,
    "proof": "scripts table, id da63a8a5-6bd3-4738-b2d2-3857df98b898 (What AI actually is)"
  },
  {
    "n": 31,
    "level": "nova",
    "label": "Something went wrong",
    "kind": "m",
    "front": "Before anything goes wrong online.",
    "sub": "When Things Go Wrong Online. The talk on the Nova page of the Passport.",
    "say": "If anything ever goes wrong online, and things do go wrong, I am the first call you make, not the last. I will not overreact. I will help.",
    "why": "A child who fears losing their phone is a child who hides problems.",
    "help": null,
    "proof": "lib/content/stages.ts, nova stage script"
  },
  {
    "n": 32,
    "level": "nova",
    "label": "Sleep",
    "kind": "q",
    "front": "I was only on it for a bit.",
    "sub": "They are on their phone after lights out, often until 1 or 2am.",
    "say": "I found out you were on your phone late. I am not angry. I am worried about your sleep because of what I know about how it affects your mood and your brain. I want to sort this together rather than take the phone.",
    "why": "Punishing the symptom with phone removal for a week does not address the underlying drive.",
    "help": null,
    "proof": "scripts table, id abb1acd6-c240-4740-b6db-379b2c901351 (Late night device use)"
  },
  {
    "n": 33,
    "level": "nova",
    "label": "The rules",
    "kind": "q",
    "front": "I am not a little kid anymore!",
    "sub": "They argue the rules are unfair and that they are being treated like a child.",
    "say": "You're right that you're not a small kid anymore, and I do want to give you more control. Let's talk about what you think is reasonable and why, and we can work out something together.",
    "why": "Adolescence is the developmental stage where young people are supposed to be pushing for autonomy.",
    "help": null,
    "proof": "scripts table, id e93312a7-b1e3-4b35-bfdf-eaf4d33d5616 (Negotiating screen time limits)"
  },
  {
    "n": 34,
    "level": "nova",
    "label": "Everyone else has it",
    "kind": "q",
    "front": "Nobody else has rules like this.",
    "sub": "They say theirs is the only strict house, and the rules are making them an outcast.",
    "say": "I hear you, and I'm not going to pretend your friends all have the same limits we have. I also can't parent based on what every other family does. What I can do is explain why I've made the choices I have, and I'm genuinely open to hearing what feels unfair to you.",
    "why": "Explaining your reasoning treats them as someone capable of understanding, which is what teenagers want.",
    "help": null,
    "proof": "scripts table, id 41968e72-793c-48dc-8b86-69c488abf436 (Comparing screen time to friends' limits)"
  },
  {
    "n": 35,
    "level": "nova",
    "label": "Trust",
    "kind": "m",
    "front": "You are tempted to look through their phone.",
    "sub": "Without asking them first.",
    "say": "If I am ever worried enough to look at your phone, I will tell you and we will look together. I would rather you trust me than feel watched behind your back.",
    "why": "Secret searches, once found, end the openness you actually need to keep them safe.",
    "help": null,
    "proof": "scripts table, id f3ab193d-0ae3-4e7e-97dc-a4c387b83e05 (Checking their phone)"
  },
  {
    "n": 36,
    "level": "nova",
    "label": "Images",
    "kind": "q",
    "front": "Someone has a photo of me. They want money.",
    "sub": "They sent an image to someone they believed was their age, and that account is now threatening them.",
    "say": "Thank you for telling me. I need you to hear the next bit before anything else: you are not in trouble, and this is not your fault. This is a crime, it is done to thousands of people, and the people doing it are organised criminals who do this for money. We are not paying them. We are not deleting anything yet, because the messages are evidence. I am going to sit here with you while we block them and report it, and then we will get the picture taken down.",
    "why": "Shame is the whole weapon.",
    "help": "Report Remove, run by Childline and the Internet Watch Foundation, takes reports from under 18s.",
    "proof": "scripts table, id 35ef3a7f-ead3-4c23-a491-771ca4d92a85 (Someone has a photo and is demanding money)"
  },
  {
    "n": 37,
    "level": "nova",
    "label": "Group chats",
    "kind": "q",
    "front": "Someone sent something horrible to the group.",
    "sub": "A violent, sexual or disturbing image or video has been forwarded into a group chat they are in.",
    "say": "Do not forward it and do not delete it yet. You are not in trouble for being sent it, being sent something is not the same as sharing it. Tell me what it was, roughly, and then we will decide together what happens next.",
    "why": "Separating being sent something from sharing it is the sentence that keeps a teenager honest with you.",
    "help": null,
    "proof": "scripts table, id 9a310bc6-ee65-46a5-a5d2-53034d3c7c22 (Something vile got forwarded into the group)"
  },
  {
    "n": 38,
    "level": "nova",
    "label": "Feelings",
    "kind": "q",
    "front": "Have you seen what they wrote under my post?",
    "sub": "Something they posted attracts a wave of negative comments.",
    "say": "That stings and I am sorry it happened. You do not have to read every comment, and a stranger having a bad day does not get to decide how you feel about yourself.",
    "why": "Blame in a raw moment teaches them to hide the next hit instead of bringing it to you.",
    "help": null,
    "proof": "scripts table, id aa5ec40d-e7d0-43d2-a5d0-3d512924c17d (A post got nasty comments)"
  },
  {
    "n": 39,
    "level": "nova",
    "label": "AI",
    "kind": "q",
    "front": "It actually listens to me.",
    "sub": "They are talking to an AI chatbot as though it is a close friend.",
    "say": "It makes sense that it feels good to talk to, it never gets tired or judges you. I just want you to remember it cannot actually care back, even when it sounds like it does.",
    "why": "Honouring why it appeals, while naming the limit, keeps real human connection as the goal without shaming them.",
    "help": null,
    "proof": "scripts table, id d41aac74-8cb0-49fe-81b8-d0b49fee4694 (An AI chatbot as a friend)"
  },
  {
    "n": 40,
    "level": "nova",
    "label": "Family time",
    "kind": "m",
    "front": "Always on the phone, barely there.",
    "sub": "They barely respond when spoken to, and seem more present online than at home.",
    "say": "I feel like I'm losing you to your phone and I miss you. I'm not trying to control what you do, I just want some time where we're actually together. Can we figure out something that works for both of us?",
    "why": "Naming the feeling of missing them rather than attacking the behaviour shifts the conversation from a power struggle to a relationship conversation.",
    "help": null,
    "proof": "scripts table, id 5d51a9d4-3f6d-4699-b1a2-bcc0f98d5b99 (Always on their phone, ignoring family)"
  },
  {
    "n": 41,
    "level": "cosmo",
    "label": "Independence",
    "kind": "q",
    "front": "It is my phone. It is my life.",
    "sub": "Building Independence. The talk on the Cosmo page of the Passport.",
    "say": "You are at the age where you get to decide what kind of digital life you build. What does your online presence say about who you are? Not to me. To the world.",
    "why": "At 16, the goal is not compliance but genuine digital literacy.",
    "help": null,
    "proof": "lib/content/stages.ts, cosmo stage script"
  },
  {
    "n": 42,
    "level": "cosmo",
    "label": "The rules",
    "kind": "m",
    "front": "Sixteen, and the rules have run out.",
    "sub": "You can see the phone costing them sleep, coursework or mood, and you have no lever left.",
    "say": "You are sixteen, so this is yours now and I am not going to pretend otherwise. That means I am asking rather than telling. Is your phone working for you at the moment, honestly? Because from out here it looks like it is winning, and if you think so too I will help with whatever you want to try. If you think I am wrong, tell me and I will drop it.",
    "why": "At sixteen the lever really has gone, and pretending otherwise costs you the only thing you have left, which is being someone they will talk to.",
    "help": null,
    "proof": "scripts table, id ee8a5600-544f-4528-ab54-d8c6d7f83662 (They are sixteen and you have run out of rules)"
  },
  {
    "n": 43,
    "level": "cosmo",
    "label": "Sleep",
    "kind": "m",
    "front": "2am, and the light is still on.",
    "sub": "You get up in the night and your 16 or 17 year old is still awake on their phone.",
    "say": "Nothing tonight. Tomorrow: I saw you were up late last night. I am not checking on you but I am a bit worried. What is going on?",
    "why": "At 16 and 17, surveillance without conversation produces secrecy, not change.",
    "help": null,
    "proof": "scripts table, id 04f0566d-764d-4a28-a065-1cab7cb7c4b8 (The 2am Discovery)"
  },
  {
    "n": 44,
    "level": "cosmo",
    "label": "Talking",
    "kind": "m",
    "front": "You need a real talk. They are half scrolling.",
    "sub": "A real conversation is needed, and they are only half present.",
    "say": "I want to talk to you properly for ten minutes. Can we both put our phones face down? I will go first.",
    "why": "When the parent puts their own phone away first, the request shifts from instruction to invitation.",
    "help": null,
    "proof": "scripts table, id 4daedbb8-8c5c-45dd-9575-409e09ffb70c (Phone-free conversation)"
  },
  {
    "n": 45,
    "level": "cosmo",
    "label": "Talking",
    "kind": "m",
    "front": "They tell their phone everything. You, nothing.",
    "sub": "You find out what is happening in their life through glimpses rather than from them.",
    "say": "I know you have your own life and I am not trying to get in the way of it. I just want to know how you are. Not the detail. Just you.",
    "why": "It asks for mood, not detail.",
    "help": null,
    "proof": "scripts table, id 81c3adca-ad47-4f80-b2bc-f29a6b35a467 (When They Stop Talking to You and Talk to Their Phone)"
  },
  {
    "n": 46,
    "level": "cosmo",
    "label": "The feed",
    "kind": "q",
    "front": "My feed just shows me what is out there.",
    "sub": "They may be mistaking what the algorithm picks for a balanced view of the world.",
    "say": "Do you know how much of what you see on your feeds is actively chosen for you based on keeping you watching? I find it genuinely unsettling when I think about it. What do you reckon your algorithm thinks you want to see?",
    "why": "The question about what the algorithm thinks they want to see invites your young adult to look at their own feed with fresh eyes.",
    "help": null,
    "proof": "scripts table, id de4f68c1-25a7-41c5-9d99-973f78fe9bdc (Recognising algorithm manipulation)"
  },
  {
    "n": 47,
    "level": "cosmo",
    "label": "Doomscrolling",
    "kind": "q",
    "front": "I cannot stop scrolling the news.",
    "sub": "Scrolling upsetting content late at night, and they cannot seem to stop.",
    "say": "There is a name for what you are describing and it is doomscrolling, and it happens to almost everyone. Your brain is wired to scan for threats, and the algorithm knows that, so it feeds you more of what got your attention. The loop is not your fault and you can interrupt it.",
    "why": "Naming doomscrolling as a recognised pattern removes the sense of being uniquely weak or broken.",
    "help": null,
    "proof": "scripts table, id b3055a6a-a365-4ea3-a2da-7255c7364a38 (Doomscrolling conversation)"
  },
  {
    "n": 48,
    "level": "cosmo",
    "label": "Gambling",
    "kind": "q",
    "front": "It is just a free bet on the football.",
    "sub": "Betting apps are heavily marketed to young men especially.",
    "say": "Betting apps are everywhere now, dressed up as a bit of fun with the football. Here is what they do not advertise: they are engineered so the house wins over time, and they are very good at getting young people hooked. You are sharp enough to see the design. What do you reckon the free bet is actually buying them?",
    "why": "Understanding the design protects far longer than a slogan they will tune out.",
    "help": null,
    "proof": "scripts table, id e2702acc-9aa8-453b-9a0e-71ba215d1eb5 (Gambling and betting apps)"
  },
  {
    "n": 49,
    "level": "cosmo",
    "label": "Images",
    "kind": "m",
    "front": "Old enough to date, and to share.",
    "sub": "They need to understand consent and the law around intimate images.",
    "say": "You are an adult or nearly one, so I will speak to you straight. Sharing an intimate image of someone without their consent is not just unkind, it is against the law, and so is pressuring someone to send one. The principle underneath all of it is consent. Are you clear on where those lines are?",
    "why": "Grounding the conversation in consent gives them a principle that covers situations a rule cannot anticipate.",
    "help": null,
    "proof": "scripts table, id 4083e4af-aa73-465b-8779-d77c051214ab (A mature conversation about image sharing and the law)"
  },
  {
    "n": 50,
    "level": "cosmo",
    "label": "AI",
    "kind": "q",
    "front": "Will AI even leave me a job?",
    "sub": "They wonder what AI means for their studies and career.",
    "say": "AI will change a lot of jobs, and that is genuinely uncertain. The people who do well will be the ones who stay curious, keep thinking for themselves, and use it as a tool rather than a crutch.",
    "why": "Naming the uncertainty while pointing to durable human strengths gives them something hopeful and active to do with it.",
    "help": null,
    "proof": "scripts table, id b7900cc8-f455-48fb-97d1-8667ccf013d1 (AI in their future)"
  }
],
}
