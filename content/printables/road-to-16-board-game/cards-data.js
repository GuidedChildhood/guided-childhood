// The 48 choice cards, one set per zone. Every one is a real choice question
// from the lessons, with the lesson's own options shortened and its right
// answer marked (a, the index of the right option). src names the module file
// in content/modules or the migration that seeds the family lesson. The game
// is for ages 6 to 12, so the Nova and Cosmo zones use the lessons that are
// safe for a younger player to read (no image or blackmail lessons).
window.CHOICE = {
  pebble: [
    ['An advert with a big button pops up. What do you do?', ['Tap the big button to see', 'Paws off, look up, and ask', 'Tap it quickly before anyone sees'], 1, 'eyfs-31-paws-off-ask-first'],
    ['You tapped buy by mistake. What now?', ['Hide the tablet and say nothing', 'Tap buy again to undo it', 'Tell a grown up straight away'], 2, 'eyfs-31-paws-off-ask-first'],
    ['Your grown up says stop in the middle. What then?', ['Keep going to the very end', 'Stop, because a grown up\'s stop counts too', 'Hide the tablet under a cushion'], 1, 'eyfs-30-the-screen-never-says-stop'],
    ['You see a picture of a cat driving a bus. What can you do?', ['Believe it, because you can see it', 'Stop, look, and ask a grown up if it is real', 'Show everyone it is true'], 1, 'eyfs-01-screens-kindness'],
    ['Someone in your game says: hi! What is your name? What do you do?', ['Tell them, because they sound friendly', 'Do not answer, and go and show your grown up', 'Tell them your first name only'], 1, 'migration 076, Who is behind the screen'],
    ['You showed your grown up a message from a stranger. What happens next?', ['They are glad you showed them, and they help', 'You lose the game as a punishment', 'You get told off'], 0, 'migration 076, Who is behind the screen'],
    ['You tapped something by accident and the screen looks strange. If you tell, what happens?', ['I get in trouble for tapping', 'My grown up is glad I told them, and they help', 'The tablet goes away for ever'], 1, 'migration 074, The stop and tell rule'],
    ['Why does a five minute warning help?', ['It gives my body time to get ready for the ending', 'It means I get extra screen time', 'It makes the game go faster'], 0, 'migration 076, When the screen goes to sleep'],
    ['Someone in a game asks for your password. What now?', ['Keep it private and tell a grown up', 'Tell them, because free coins are fun', 'Tell them half of it'], 0, 'ks1-32-private-like-a-toothbrush'],
    ['A talking speaker asks where you live. What do you do?', ['Tell it, because it is only a machine', 'Keep it private and ask a grown up', 'Tell it, because it sounds friendly'], 1, 'ks1-33-who-is-on-the-other-side'],
  ],
  bloop: [
    ['A player says: I am seven too! Do we know them?', ['Yes, they said they are seven', 'No, they are still someone we do not know', 'Yes, because they are in our game'], 1, 'ks1-33-who-is-on-the-other-side'],
    ['Something on a screen makes you feel scared inside. Who do you tell?', ['Nobody, I keep it a secret', 'A grown up I trust, straight away', 'Only my friend'], 1, 'ks1-02-kind-screens-calm-bodies'],
    ['A quiz in a game asks for your full name and school to show your results. What do you do?', ['Fill it in, quizzes are just for fun', 'Skip those boxes, close it and tell your grown up', 'Use a nickname but your real school'], 1, 'migration 076, What we keep private online'],
    ['A pop up says: FREE ROBUX! 30 seconds left! Enter your password. How many tricks?', ['One: it is rushing me', 'None, free offers are real', 'Three: rushing, promising and asking'], 2, 'migration 076, Spot the trick'],
    ['It is 8pm, bed is at half past, and you want one more episode. What is the strong move?', ['Watch it, one cannot hurt', 'Screen to the charging spot, then a book or a chat', 'Watch it with the brightness down'], 1, 'migration 076, Screens and sleep'],
    ['The timer goes, but you are halfway through a level. What is the strong move?', ['Ignore the timer', 'Finish at the save point you agreed, then stop', 'Ask for ten more minutes'], 1, 'migration 074, Why stopping feels hard'],
    ['Nearly time to stop, and the game flashes: ONE MORE MATCH FOR DOUBLE COINS. What is going on?', ['The game is being kind', 'The game spotted a stopping point and is paying you to skip it', 'You will fall behind if you stop'], 1, 'ks2-05-gaming-time-spend'],
    ['A skin you want has a timer: 09:59 left. You have birthday money. What do you do?', ['Buy it fast before it goes', 'It is rushing me, so I pause and ask first', 'Never buy anything in a game'], 1, 'ks2-05-gaming-time-spend'],
    ['You sent a silly photo to a group chat and deleted it two minutes later. What is true?', ['It is gone everywhere', 'It might still be on other phones', 'It vanishes after five minutes'], 1, 'ks2-07-privacy-reputation'],
    ['Unkind posts about one pupil are stacking up in a group chat. What are the three moves?', ['Screenshot it and send it round', 'Do not pile on, save the evidence, tell someone who can help', 'Say nothing and wait'], 1, 'ks2-08-kind-safe-online'],
  ],
  orbit: [
    ['A friend shows you nasty messages and says: promise you will not tell. What do you do?', ['Keep the secret', 'Help save the evidence and tell a trusted grown up', 'Message the bully yourself'], 1, 'ks2-08-kind-safe-online'],
    ['A friend says telling a teacher about bullying is snitching. What is true?', ['Telling gets someone out of trouble', 'Only tell if it happens to you', 'Staying quiet is braver'], 0, 'ks2-08-kind-safe-online'],
    ['Your feed has become all football videos. Why?', ['It read your mind', 'It is a coincidence', 'It learned from what you watched and watched again'], 2, 'ks2-06-how-algorithms-work'],
    ['The helper in Ellis\'s game asked him not to tell his mum about their chats. What should Ellis do?', ['Keep it secret, he promised', 'Tell a trusted grown up', 'Just stop playing the game'], 1, 'ks2-23-when-a-machine-talks-like-a-friend'],
    ['What is the number 13 on a social app actually about?', ['Whether a company can collect and use your information', 'Whether you are sensible enough', 'How many friends you need'], 0, 'ks2-26-why-thirteen'],
    ['A game backup question asks: what is your pet\'s name? What do you know?', ['Pets do not use the internet, so it is fine', 'Pet names are keys, so pick a different question if you have shared it', 'My password is strong, so it does not matter'], 1, 'ks2-07-privacy-reputation'],
    ['The group chat starts on Maya. Leaving feels dramatic. What is the first move?', ['A laughing face so you fit in', 'No reaction, then message Maya privately to check she is okay', 'Tell everyone off in the chat'], 1, 'migration 076, When the group chat turns'],
    ['Why is screenshot and tell better than delete and hope?', ['Evidence lets a grown up act, and nobody handles it alone', 'Screenshots are more fun', 'Deleting gets you in trouble'], 0, 'migration 076, When the group chat turns'],
    ['You want to stop after one episode tonight. Which plan works?', ['Promise yourself really hard', 'Turn autoplay off before you start', 'Watch with the sound off'], 1, 'migration 076, Built to be bottomless'],
    ['What is every feed built to get more of?', ['Showing you the truth', 'Your watch time', 'Your happiness'], 1, 'migration 074, The feed is built to hold you'],
  ],
  nova: [
    ['What does a follower count actually measure?', ['How many real friends you have', 'How many accounts tapped follow: reach, not friendship', 'How good your posts are'], 1, 'migration 076, Followers are not friends'],
    ['A friend\'s account says: this app doubled my money in a day. What do you know?', ['Friends do not scam friends', 'The account may be stolen, and the warning signs count whoever sends it', 'Block your friend for ever'], 1, 'ks3-13-scams-fraud-money'],
    ['A chat with an AI has started to matter more than it should. What is the move?', ['Stop using it and tell nobody', 'Tell someone you trust, because telling is never trouble', 'Ask the app what to do'], 1, 'ks3-22-when-an-ai-acts-like-a-friend'],
    ['Why do arguments online grow faster than out loud?', ['People are nastier online', 'Three brakes are missing: no face, an audience, a record', 'There are more people online'], 1, 'ks3-27-when-it-turns-on-you'],
    ['A friend sends a guide to making an account with a grown up\'s birthday. What is the real risk?', ['Getting caught', 'The filters, contact limits and help tools for your age switch off', 'There is no risk'], 1, 'ks3-11-social-workarounds'],
    ['A creator posts a glowing review with a discount code and no ad label. What do you know?', ['It is just their honest opinion', 'They likely earn from each sale, so weigh it like an advert', 'Codes are always the best deal'], 1, 'ks4-15-manipulation-persuasion'],
    ['A game sends: your streak ends in 2 hours! What do you do with that message?', ['Keep it on, streaks matter', 'Switch it off: the app is calling you back for itself', 'Turn the sound up'], 1, 'migration 076, Take back your notifications'],
    ['A phone keeps buzzing beside someone\'s bed at night. What is the best move?', ['Put it on silent by the bed', 'Charge it in another room overnight', 'Scroll until tired'], 1, 'migration 110'],
    ['One question tells you if a homework tool is helping you learn. Which is it?', ['What is this task actually teaching me?', 'Am I allowed to use it?', 'Would my teacher be cross?'], 0, 'ks3-24-is-it-doing-my-thinking'],
    ['If a picture was made by AI, is it always a lie?', ['Yes, always', 'No: made by AI tells you how it was made, not whether it is honest', 'Only if it looks strange'], 1, 'ks3-12-misinfo-deepfakes'],
  ],
  cosmo: [
    ['Why is one password used for ten accounts worse than one weak password on one account?', ['It is not worse', 'One leaked site becomes a key to every account', 'Long passwords are harder to type'], 1, 'migration 076, Your accounts, your locks'],
    ['You keep losing an hour to your phone at 1am. What is the design move?', ['Try harder to stop', 'Charge it outside the bedroom, so the 1am choice never comes', 'Turn the brightness down'], 1, 'migration 076, Design your own defaults'],
    ['The night before your 16th birthday. What is the strongest position to be in?', ['No plan, just see what the apps show you', 'A plan: settings decided, a check booked for day seven, a rule for stopping', 'A borrowed account, so you already know your way'], 1, 'ks4-19-readiness-at-16'],
    ['A game sells 500 gems for £4.99, and a crate costs 80 gems. What is wrong with that?', ['The gems are too cheap', 'The pack never divides evenly, so there is always a leftover', 'Nothing is wrong'], 1, 'ks4-28-the-money-and-the-odds'],
    ['Something upsetting appears in your feed that you never searched for. What does it say about you?', ['Nothing. It is a guess about what holds attention', 'That you looked at something you should not have', 'That a person is targeting you'], 0, 'ks4-29-did-not-go-looking'],
    ['A free AI app says your typing may be used to train it. What is the deal?', ['It is a scam, never use it', 'You pay in data, so choose what you paste in', 'It does not matter'], 1, 'ks5-20-ai-mastery-data-rights'],
    ['When everyone has the same AI tools, what gets more valuable?', ['Writing a first draft fast', 'Knowing which question to ask, and standing behind the answer', 'Remembering facts faster'], 1, 'ks5-21-digital-identity-future-work'],
    ['Scams mostly catch old people, so teenagers do not need to worry. True?', ['True, teenagers are too sharp', 'False: scammers target teenagers because they believe this', 'True, scammers ignore children'], 1, 'ks3-13-scams-fraud-money'],
  ],
}
