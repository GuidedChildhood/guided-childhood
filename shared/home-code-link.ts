// THE HOME CODE'S SHAPE, SHARED BY BOTH APPS.
//
// The code on the parent note is stored and printed as HOME-XXXX (migration
// 230) and shown to a parent as the four characters alone. The schools app
// prints it, the parents app reads it back, and a QR carries it between
// them, so the one rule about what is prefix and what is code lives here
// rather than in two files that can drift.
//
// Deliberately no imports: the guards load this under plain node.

/** HOME-7K3F becomes 7K3F. Anything already short comes back unchanged. */
export const shortHomeCode = (code: string) => code.replace(/^HOME-?/i, '')
