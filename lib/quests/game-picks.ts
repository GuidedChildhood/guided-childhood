// Curated premium games and creative apps, by stage. Parents pick from
// these to turn a game into a reward a child earns with stars, or a shared
// family activity. Weighted to educational, creative and screen positive
// picks, with brilliant offline games in the mix so it is never only more
// screens. Copy rule: no dashes anywhere.

export type GameKind = 'digital' | 'tabletop' | 'creative' | 'outdoor'

export interface GamePick {
  title: string
  kind: GameKind
  category: string
  platform: string
  why: string
  // Best played together: a parent, a sibling or a friend in the room, not
  // alone with headphones on. These are the ones that turn screen time into
  // talking time, so we badge them and let a parent filter to them. The
  // whole point of the deal is that time on a device should still connect a
  // child to people, not wall them off.
  together?: boolean
}

export type StageKey = 'foundation' | 'builder' | 'explorer' | 'shaper' | 'independent'

export const STAGE_LABELS: Record<StageKey, { name: string; ages: string }> = {
  foundation:  { name: 'Foundation',  ages: 'Ages 4 to 7' },
  builder:     { name: 'Builder',     ages: 'Ages 8 to 10' },
  explorer:    { name: 'Explorer',    ages: 'Ages 11 to 13' },
  shaper:      { name: 'Shaper',      ages: 'Ages 13 to 15' },
  independent: { name: 'Independent', ages: 'Ages 16 and up' },
}

export const AGE_BAND_TO_STAGE: Record<string, StageKey> = {
  '4-7': 'foundation', '8-10': 'builder', '11-13': 'explorer', '13-15': 'shaper', '16+': 'independent',
}

export const GAME_PICKS: Record<StageKey, GamePick[]> = {
  foundation: [
    { title: 'ScratchJr', kind: 'digital', category: 'coding', platform: 'iPad, Android', why: 'Your child snaps colourful blocks together to make characters move and talk, which is real coding thinking before they can even read fluently.' },
    { title: 'Toca Life World', kind: 'digital', category: 'story', platform: 'iPad, iPhone, Android', why: 'It is an open playhouse with no rules or scores, so children invent their own little stories and characters all afternoon.' },
    { title: 'Osmo Genius Starter Kit', kind: 'digital', category: 'science', platform: 'iPad, Fire tablet', why: 'The screen reads real wooden tiles and drawings on the table, so hands stay busy and the tablet becomes a shared game.' },
    { title: 'Sago Mini World', kind: 'digital', category: 'art', platform: 'iPad, iPhone, Android', why: 'Gentle, ad free and calm, it lets very young children explore and tinker without ever feeling rushed or sold to.' },
    { title: 'Dobble', kind: 'tabletop', category: 'word', platform: 'card game', why: 'A fast spotting game that sharpens quick looking and naming, and it packs in a tin for the cafe or the car.' },
    { title: 'Endless Alphabet', kind: 'digital', category: 'word', platform: 'iPad, iPhone, Android', why: 'Silly monsters act out each word so letters and meanings stick through laughter rather than drilling.' },
    { title: 'DragonBox Numbers', kind: 'digital', category: 'science', platform: 'iPad, Android', why: 'Numbers become friendly creatures your child stacks and splits, building a real feel for how amounts work.' },
    { title: 'Rush Hour Junior', kind: 'tabletop', category: 'strategy', platform: 'board game', why: 'A single player traffic puzzle that quietly teaches planning ahead, with cards that grow harder as they get sharper.' },
    { title: 'LEGO Classic', kind: 'creative', category: 'building', platform: 'any', why: 'A big box of bricks and no instructions is still one of the best hours a small child can spend making something.' },
    { title: 'Pok Pok Playroom', kind: 'digital', category: 'art', platform: 'iPad, iPhone', why: 'Beautifully made digital toys with no points or timers, designed by parents for open, curious play.' },
  ],
  builder: [
    { title: 'Minecraft', kind: 'digital', category: 'building', platform: 'iPad, Switch, PC, Xbox', why: 'In Creative mode your child builds whole worlds from imagination, planning and problem solving without any pressure to win.' },
    { title: 'Scratch', kind: 'digital', category: 'coding', platform: 'PC, Mac, browser', why: 'They make their own games and animations with drag and drop code, and can share them with a friendly worldwide community.' },
    { title: 'Prodigy Math', kind: 'digital', category: 'science', platform: 'iPad, Android, browser', why: 'Maths practice wrapped in a proper adventure game, so daily sums feel like earning your next spell.' },
    { title: 'DragonBox Algebra 5+', kind: 'digital', category: 'science', platform: 'iPad, Android', why: 'It teaches the moves of algebra through pictures years before school does, and children rarely notice they are doing maths.' },
    { title: 'Ticket to Ride', kind: 'tabletop', category: 'strategy', platform: 'board game', why: 'Claiming train routes across a map teaches planning and a little geography, and the whole family can play together.' },
    { title: 'Carcassonne', kind: 'tabletop', category: 'strategy', platform: 'board game', why: 'You build a medieval landscape tile by tile, making small clever choices that add up, in about forty easy minutes.' },
    { title: 'Monument Valley', kind: 'digital', category: 'art', platform: 'iPad, iPhone, Android', why: 'A calm, gorgeous puzzle of impossible buildings that feels more like moving through a painting than playing a phone game.' },
    { title: 'GarageBand', kind: 'creative', category: 'music', platform: 'iPad, Mac', why: 'Real instruments and beats at your fingertips let a child write actual songs, no lessons or expensive kit needed.' },
    { title: 'Stardew Valley', kind: 'digital', category: 'story', platform: 'Switch, PC, iPad, mobile', why: 'A gentle farming life with no violence, rewarding patience, kindness and steady care of a little place over time.' },
    { title: 'Lightbot', kind: 'digital', category: 'coding', platform: 'iPad, Android, browser', why: 'You guide a robot with simple commands and loops, a lovely first taste of the logic behind programming.' },
  ],
  explorer: [
    { title: 'Kerbal Space Program', kind: 'digital', category: 'science', platform: 'PC, Mac', why: 'Building rockets that actually obey physics teaches real orbital science through cheerful trial and many funny failures.' },
    { title: 'Baba Is You', kind: 'digital', category: 'coding', platform: 'Switch, PC, Mac, iPad', why: 'You win by pushing the words that make the rules, which is programming logic disguised as the cleverest puzzle around.' },
    { title: 'Human Resource Machine', kind: 'digital', category: 'coding', platform: 'Switch, PC, Mac, iPad', why: 'A charming puzzle that quietly teaches how computers really follow instructions, one small program at a time.' },
    { title: 'The Legend of Zelda: Breath of the Wild', kind: 'digital', category: 'story', platform: 'Switch', why: 'A vast, calm open world that rewards curiosity and your own ideas rather than following one narrow path.' },
    { title: 'Roblox Studio', kind: 'digital', category: 'building', platform: 'PC, Mac', why: 'This is the maker side of Roblox, where your child designs and codes their own games instead of only playing others.' },
    { title: 'Procreate', kind: 'creative', category: 'art', platform: 'iPad', why: 'A professional drawing studio in an iPad that has launched countless young artists into taking their sketching seriously.' },
    { title: 'Catan', kind: 'tabletop', category: 'strategy', platform: 'board game', why: 'Trading and building settlements teaches negotiation and planning, and every game plays out completely differently.' },
    { title: 'Lichess', kind: 'digital', category: 'strategy', platform: 'browser, iPad, Android', why: 'Free, ad free chess with kind tutorials and puzzles, the best brain workout a screen can offer.' },
    { title: 'Portal 2', kind: 'digital', category: 'science', platform: 'PC, Mac, PS, Xbox', why: 'Witty physics puzzles with a two player mode that turns solving problems together into a real team effort.' },
    { title: 'Minecraft', kind: 'digital', category: 'building', platform: 'PC, Switch, iPad, Xbox', why: 'Now with redstone circuits and command blocks, it grows into a genuine playground for engineering and invention.' },
  ],
  shaper: [
    { title: "Sid Meier's Civilization VI", kind: 'digital', category: 'strategy', platform: 'PC, Mac, Switch, iPad', why: 'You steer a whole civilisation through history, weighing science, culture and diplomacy in decisions with real consequences.' },
    { title: 'The Witness', kind: 'digital', category: 'science', platform: 'PC, Mac, PS, iPad', why: 'A silent island of hand drawn puzzles that teaches you to look closely and think for yourself, with no hints handed over.' },
    { title: 'Cities: Skylines', kind: 'digital', category: 'building', platform: 'PC, Mac, PS, Xbox', why: 'Designing a living city means juggling traffic, money and happy residents, a real lesson in how systems connect.' },
    { title: 'Blender', kind: 'creative', category: 'art', platform: 'PC, Mac', why: 'A free tool used by real studios lets a teenager model, animate and sculpt in 3D as far as their patience will take them.' },
    { title: 'Wingspan', kind: 'tabletop', category: 'strategy', platform: 'board game', why: 'A beautiful game about birds that rewards careful engine building and quietly teaches a lot of natural history.' },
    { title: 'Kerbal Space Program', kind: 'digital', category: 'science', platform: 'PC, Mac', why: 'At this age the real physics behind the rockets clicks, turning play into a proper grasp of gravity and orbits.' },
    { title: 'GarageBand', kind: 'creative', category: 'music', platform: 'iPad, Mac', why: 'A full home studio for writing, recording and mixing, the tool many working producers actually started out on.' },
    { title: 'The Legend of Zelda: Tears of the Kingdom', kind: 'digital', category: 'building', platform: 'Switch', why: 'Its build anything system rewards genuine engineering creativity, letting players invent machines to solve problems their own way.' },
    { title: 'Portal 2', kind: 'digital', category: 'science', platform: 'PC, Mac, PS, Xbox', why: 'Sharp, funny physics puzzles that reward clear thinking and shine in the two player co operative mode.' },
    { title: 'Lichess', kind: 'digital', category: 'strategy', platform: 'browser, iPad, Android', why: 'Serious chess practice, free and ad free, with study tools deep enough to grow with a committed teenager.' },
  ],
  independent: [
    { title: 'Outer Wilds', kind: 'digital', category: 'science', platform: 'PC, Mac, PS, Xbox, Switch', why: 'A gentle mystery about curiosity itself, solved entirely by exploring and understanding rather than fighting anything.' },
    { title: 'Factorio', kind: 'digital', category: 'building', platform: 'PC, Mac, Switch', why: 'Designing sprawling automated factories is genuine engineering and systems thinking dressed up as a deeply satisfying game.' },
    { title: 'Opus Magnum', kind: 'digital', category: 'coding', platform: 'PC, Mac', why: 'You build little machines to solve each puzzle, then refine them for elegance, which is exactly how good engineers think.' },
    { title: "Sid Meier's Civilization VI", kind: 'digital', category: 'strategy', platform: 'PC, Mac, Switch, iPad', why: 'Deep enough to reward real long term strategy, it teaches history and trade offs across many hours of thoughtful play.' },
    { title: 'Blender', kind: 'creative', category: 'art', platform: 'PC, Mac', why: 'The same free 3D software behind short films and studios, ready for a serious young maker to build a real portfolio.' },
    { title: 'Ableton Live', kind: 'creative', category: 'music', platform: 'PC, Mac', why: 'A professional music studio used on real records, giving a dedicated teenager the tools to actually produce and finish tracks.' },
    { title: 'Return of the Obra Dinn', kind: 'digital', category: 'story', platform: 'PC, Mac, PS, Xbox, Switch', why: 'A brilliant detective puzzle solved purely by careful observation and reasoning, unlike anything else they will have played.' },
    { title: 'Wingspan', kind: 'tabletop', category: 'strategy', platform: 'board game', why: 'An elegant, calm strategy game about birds that plays beautifully with friends or family away from any screen.' },
    { title: 'Stardew Valley', kind: 'digital', category: 'story', platform: 'PC, Mac, Switch, mobile', why: 'A quiet, kind farming life that rewards patience and care, and a lovely thing to share with a friend online.' },
    { title: 'Lichess', kind: 'digital', category: 'strategy', platform: 'browser, PC, mobile', why: 'World class chess training for free with no ads, ready to take a keen mind as far as it wants to go.' },
  ],
}
