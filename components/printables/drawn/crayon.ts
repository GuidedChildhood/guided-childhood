// The crayon colours on their own, with no React in the file, so a server
// component (the parent home) can borrow a fill without pulling in the
// example context that lives in HappyPaper.tsx.
//
// The values moved to shared/happy-news.ts on 20 September 2026 so the
// schools app draws the same crayons. One home, one value: this file only
// passes them on.
export { CRAYON } from '@gc/shared/happy-news'
