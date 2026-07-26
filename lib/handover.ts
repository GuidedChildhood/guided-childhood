// A parent who never answers the child phone handover ask is asked this many
// times, then only ever sees the quiet prompt already on the Quests page. An
// overlay on login is the most intrusive surface we have, and the fastest way
// to make it hated is to let it ask forever.
export const MAX_HANDOVER_ASKS = 3
