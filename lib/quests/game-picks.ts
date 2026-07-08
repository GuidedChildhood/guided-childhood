// Curated premium games and creative apps, by stage. Parents pick from
// these to turn a game into a reward a child earns with stars, or a shared
// family activity. Weighted hard to educational, creative and screen
// positive picks, with brilliant offline games in the mix so it is never
// only more screens.
//
// The bias is deliberate and research backed. Screen time mostly harms by
// crowding out real play, sleep and face to face talk, and the youngest
// children learn far more from a shared real world interaction than from a
// screen alone (the joint media engagement evidence). So the list leans to
// titles that pull a child toward making, moving and playing WITH people,
// and the together flag marks the ones best played with a parent, sibling
// or friend in the room. Every pick is verified real and free of the
// manipulative upsell and loot box tricks (Prodigy and open Roblox were
// left off on purpose). Copy rule: no dashes anywhere.

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
    { title: 'Khan Academy Kids', kind: 'digital', category: 'reading', platform: 'iPad, iPhone, Android', why: 'Completely free and free of ads, it covers early reading, numbers and feelings through gentle characters, so nothing pushes your child to spend or stay on longer.' },
    { title: 'Toca Boca World', kind: 'digital', category: 'story', platform: 'iPad, iPhone, Android', why: 'There are no rules and no points, just an imaginative dolls house your child directs, which is brilliant fuel for the role play they then act out with a sibling.', together: true },
    { title: 'Pok Pok Playroom', kind: 'digital', category: 'art', platform: 'iPad, iPhone', why: 'A calm Montessori style digital toybox with no scores or timers, it rewards curiosity and quiet tinkering rather than fast reactions, and it won an Apple Design Award.' },
    { title: 'Sago Mini World', kind: 'digital', category: 'story', platform: 'iPad, iPhone, Android', why: 'Soft open play worlds with no winning or losing invite little ones to make up their own stories, which often carries straight over into pretend play off the screen.' },
    { title: 'ScratchJr', kind: 'digital', category: 'coding', platform: 'iPad, Android tablet', why: 'Your child snaps picture blocks together to make characters move and talk, learning the logic of coding as storytelling long before they can read fluently.' },
    { title: 'DragonBox Numbers', kind: 'digital', category: 'maths', platform: 'iPad, iPhone, Android', why: 'Numbers become friendly creatures your child builds and combines, so early number sense grows through play rather than drills.' },
    { title: 'LEGO Duplo', kind: 'creative', category: 'building', platform: 'physical', why: 'Big chunky bricks are one of the best open ended toys ever made, building fine motor skills and patience while you sit and build together on the floor.', together: true },
    { title: 'Magna Tiles', kind: 'creative', category: 'building', platform: 'physical', why: 'Magnetic tiles snap into towers and shapes that teach geometry and balance by hand, and they pull the whole family into one shared project on the rug.', together: true },
    { title: 'Orchard Toys Shopping List', kind: 'tabletop', category: 'word', platform: 'board game', why: 'A much loved British board game for the youngest players, it builds memory, turn taking and everyday words in a round short enough for a four year old to finish.', together: true },
    { title: 'Hopscotch and pavement chalk', kind: 'outdoor', category: 'maths', platform: 'outside', why: 'Free, active and social, drawing and hopping a numbered grid teaches counting and balance while getting your child outside and moving with friends.', together: true },
  ],
  builder: [
    { title: 'Minecraft (Creative or Education)', kind: 'digital', category: 'building', platform: 'iPad, Switch, PC, Xbox', why: 'In Creative mode there are no enemies or scores, just a vast box of blocks where children design and build together, and the Education edition adds coding and chemistry.', together: true },
    { title: 'Scratch', kind: 'digital', category: 'coding', platform: 'PC, Mac, browser', why: 'Made by MIT and used in classrooms worldwide, it lets your child build their own games and animations and share them, turning screen time into making rather than consuming.' },
    { title: 'Stardew Valley', kind: 'digital', category: 'strategy', platform: 'Switch, PC, iPad, mobile', why: 'A gentle farming and community game with no pressure to spend, it teaches planning and care and plays beautifully as a game you take on side by side with your child.', together: true },
    { title: 'GarageBand', kind: 'creative', category: 'music', platform: 'iPad, Mac', why: 'A full music studio that is genuinely easy to start, it lets a child lay down a real tune in an afternoon and often sparks interest in a real instrument.' },
    { title: 'Osmo Coding and Genius Kit', kind: 'digital', category: 'coding', platform: 'iPad, Fire tablet', why: 'Your child moves real wooden tiles in front of the tablet, so the play stays tactile and shared at a table rather than lost inside the glass.', together: true },
    { title: 'LEGO building sets', kind: 'creative', category: 'building', platform: 'physical', why: 'Following instructions and then inventing beyond them builds focus and pride, and a big build is a lovely rainy afternoon spent together.', together: true },
    { title: 'Ticket to Ride: First Journey', kind: 'tabletop', category: 'strategy', platform: 'board game', why: 'A family friendly route building game that quietly teaches geography and forward planning, it fits in half an hour and the whole family can play.', together: true },
    { title: 'Rush Hour', kind: 'tabletop', category: 'strategy', platform: 'board game', why: 'A single player logic puzzle in a small box, it grows harder as your child improves and builds real problem solving without any screen at all.' },
    { title: "Tinybop Explorer's Library", kind: 'digital', category: 'science', platform: 'iPad', why: 'Beautifully made interactive models of the body, plants and machines invite children to poke, explore and ask questions like a young scientist, with no ads or scores.' },
    { title: 'Geocaching', kind: 'outdoor', category: 'nature', platform: 'app plus outside', why: 'A worldwide treasure hunt that uses a phone only to send you outdoors, it turns a family walk into an adventure of maps, clues and real discoveries.', together: true },
  ],
  explorer: [
    { title: 'Kerbal Space Program', kind: 'digital', category: 'science', platform: 'PC, Mac, console', why: 'Your child builds and flies their own rockets under real physics, learning gravity, thrust and orbits through joyful trial and error rather than a textbook.' },
    { title: 'Human Resource Machine', kind: 'digital', category: 'coding', platform: 'Switch, PC, Mac, iPad', why: 'A charming puzzle game that is secretly real programming, it teaches the core ideas of code step by step with warmth and humour.' },
    { title: 'Baba Is You', kind: 'digital', category: 'strategy', platform: 'Switch, PC, Mac, iPad', why: 'You win by pushing the words that make the rules, a genuine workout in logic and lateral thinking, and it earned a BAFTA nomination.' },
    { title: 'Chants of Sennaar', kind: 'digital', category: 'word', platform: 'PC, console, mobile', why: 'A gorgeous game about decoding lost languages, it makes your child feel like a linguist and archaeologist through patient observation and deduction.' },
    { title: 'Minecraft with redstone', kind: 'digital', category: 'building', platform: 'PC, Switch, iPad, Xbox', why: 'At this age the redstone system becomes a real introduction to logic circuits and engineering, and building with friends online can be a social and creative joy.', together: true },
    { title: 'Tinkercad', kind: 'creative', category: 'building', platform: 'browser', why: 'A free and approachable 3D design tool, it lets your child model real objects they can print or build, bridging the screen and the workbench.' },
    { title: 'BBC micro:bit', kind: 'creative', category: 'coding', platform: 'physical plus browser', why: 'A tiny programmable circuit board designed for schools, it turns code into blinking lights and real gadgets your child makes with their hands.' },
    { title: 'Catan or Carcassonne', kind: 'tabletop', category: 'strategy', platform: 'board game', why: 'Modern classics of family strategy, they reward negotiation and planning and reading other players, and they get everyone talking around a table.', together: true },
    { title: 'BandLab', kind: 'creative', category: 'music', platform: 'browser, iOS, Android', why: 'A free studio for making and sharing music, it channels the urge to be online into something genuinely creative your child can be proud of.' },
    { title: 'Orienteering', kind: 'outdoor', category: 'nature', platform: 'outside plus map', why: 'A sport of navigating the countryside with map and compass, it builds fitness, confidence and real spatial skill far from any screen.', together: true },
  ],
  shaper: [
    { title: "Sid Meier's Civilization VI", kind: 'digital', category: 'strategy', platform: 'PC, Mac, Switch, iPad', why: 'A deep game of building a civilisation across history, it rewards long term planning and teaches geography, science and trade, and it suits a clear time limit because it is so absorbing.' },
    { title: 'Cities: Skylines', kind: 'digital', category: 'building', platform: 'PC, Mac, PS, Xbox', why: 'Your teenager designs and runs a living city, learning the real tradeoffs of transport, budgets and the environment through hands on urban planning.' },
    { title: 'Portal 2', kind: 'digital', category: 'science', platform: 'PC, Mac, PS, Xbox', why: 'A brilliant physics puzzle game with a famous two player mode, it is one of the best games there is for solving problems side by side with a friend or a parent.', together: true },
    { title: 'Outer Wilds', kind: 'digital', category: 'science', platform: 'PC, Mac, PS, Xbox, Switch', why: 'An award winning game of pure curiosity where you explore a tiny solar system and uncover its secrets, with no combat and no grinding, only wonder.' },
    { title: 'Chicory: A Colorful Tale', kind: 'digital', category: 'art', platform: 'PC, Mac, PS, Switch', why: 'A warm adventure where you paint colour back into the world, it celebrates creativity and gently explores the feelings that come with making art.' },
    { title: 'Blender', kind: 'creative', category: 'art', platform: 'PC, Mac, Linux', why: 'The free professional grade tool for 3D art and animation, it can turn a teenager\'s spare time into a genuine portfolio and a possible career path.' },
    { title: 'Ableton Learning Music', kind: 'creative', category: 'music', platform: 'browser', why: 'A free interactive course that teaches how music actually works in the browser, it is a perfect on ramp before a full music studio.' },
    { title: 'Codecademy', kind: 'digital', category: 'coding', platform: 'browser, iOS, Android', why: 'Free structured lessons in real professional languages, they turn idle scrolling time into a skill a teenager can build a future on.' },
    { title: 'Wingspan', kind: 'tabletop', category: 'strategy', platform: 'board game', why: 'A beautiful card and strategy game about birds that slips real natural history in alongside clever play, and it is a calm and social evening for the family.', together: true },
    { title: 'Raspberry Pi projects', kind: 'creative', category: 'coding', platform: 'physical', why: 'A cheap real computer a teenager can program to build retro consoles, weather stations or robots, it makes the screen a workbench rather than a feed.' },
  ],
  independent: [
    { title: 'Factorio', kind: 'digital', category: 'engineering', platform: 'PC, Mac, Switch', why: 'A deep game of designing and automating factories, it is essentially systems engineering as play, teaching optimisation and logistics, and it rewards a clear time limit.' },
    { title: 'Opus Magnum', kind: 'digital', category: 'coding', platform: 'PC, Mac, Linux', why: 'A gorgeous engineering puzzle where you program mechanical arms to build compounds, then refine them for elegance, which is exactly how good engineers think.' },
    { title: 'Godot Engine', kind: 'creative', category: 'coding', platform: 'PC, Mac, Linux', why: 'A free and fully featured engine for making your own games, it lets a young adult go from playing games to actually building and shipping them.' },
    { title: 'Return of the Obra Dinn', kind: 'digital', category: 'strategy', platform: 'PC, Mac, PS, Xbox, Switch', why: 'A one of a kind deduction game where you reconstruct what happened to a lost ship, it is a masterclass in careful reasoning and evidence.' },
    { title: 'Gris', kind: 'digital', category: 'art', platform: 'PC, Mac, PS, Switch, mobile', why: 'A wordless and visually stunning game about grief and recovery, it shows how games can be quiet, moving art rather than noise.' },
    { title: 'Lichess', kind: 'digital', category: 'strategy', platform: 'browser, PC, mobile', why: 'A completely free and ad free chess site with lessons and puzzles, it builds patience and calculation and connects to a real community and real over the board play.' },
    { title: 'Harvard CS50', kind: 'digital', category: 'coding', platform: 'browser', why: 'A free world class programming course from Harvard, it can take a motivated young adult from curious to genuinely employable.' },
    { title: 'Ableton Live', kind: 'creative', category: 'music', platform: 'PC, Mac', why: 'A professional music studio used on real records, it turns a passion for listening into the skill of making and finishing tracks.' },
    { title: 'Arduino projects', kind: 'creative', category: 'engineering', platform: 'physical', why: 'Cheap programmable electronics kits, they let a young adult invent real working devices and learn electronics and code hands on.' },
    { title: 'Gloomhaven or Pandemic Legacy', kind: 'tabletop', category: 'strategy', platform: 'board game', why: 'Rich cooperative campaign games played around a table over many evenings, they deliver deep strategy and hours of genuine face to face teamwork.', together: true },
  ],
}
