// THE APP SAFETY PAGES: one public page per app, and one per app and age.
//
// Justin, 19 November 2026: free tool pages, made from data, as the main way
// parents find us through Google and AI search
// (plans/2026-11-19-seo-and-app-safety-pages-plan.md, Phase 2). The facts live
// in lib/app-safety/apps.ts, one entry per app, and every fact carries the link
// to the company or rating body page it came from. Anything nobody could open
// at the source is marked `checked: false` and listed in `uncertain`, and the
// page shows TODO-JP-REVIEW until Justin has checked it. Evidence or silence.

export type Sourced<T> = {
  value: T
  /** Where it was read. A company's own terms or help page, pegi.info, or a store listing. */
  url: string
  /** False when the source could not be opened to confirm it. The page then flags it. */
  checked: boolean
}

export type AppCategory = 'social' | 'video' | 'gaming' | 'messaging' | 'ai' | 'creative' | 'music'

export type AppEntry = {
  /** The URL word: /is-<slug>-safe. */
  slug: string
  name: string
  maker: string
  category: AppCategory
  /** One plain sentence: what the app is, for a parent who has never opened it. */
  whatItIs: string
  minAge: {
    /** The minimum age the terms set, or null when they set none (Minecraft, YouTube Kids). */
    value: number | null
    /** What the fact box shows: "13", "None set", "18, held by an adult". */
    label: string
    /**
     * The age the advice is worked out from. Usually the minimum age. Where
     * the terms set none it is the age the maker's own rules change (Minecraft's
     * child account ends at 13), and 0 where children use it on an adult's
     * account by design (Netflix Kids profiles).
     */
    gapAge: number
    /** Optional: the age a service is built up to (YouTube Kids, 12). */
    maxAge?: number
    /**
     * 'rating' when the line comes from an age rating (PEGI 18 for Call of
     * Duty and GTA, PEGI 16 for EA SPORTS FC 27) rather than from the maker's
     * own account rules, so the age pages say "under that rating" and never
     * that the maker set it.
     */
    basis?: 'rating'
    /** The rule in one clause, for the free check: "TikTok sets its own minimum age at 13". */
    rule: string
    /** What the terms allow under that age (a supervised account, parent consent), or ''. */
    note: string
    sourceName: string
    sourceUrl: string
    checked: boolean
  }
  ratings: {
    appStore: Sourced<string>
    googlePlay: Sourced<string>
    /** 'none' when the app has no PEGI game rating, which is most social apps. */
    pegi: Sourced<string>
    /** Said after the ratings when the store listings are for a different
     *  edition from the one the page is about (Call of Duty: Mobile). */
    note?: string
  }
  /** Three to five, described as design ("strangers can send message requests"), never as harm. */
  risks: { title: string; detail: string; sourceUrl: string }[]
  controls: { name: string; what: string; sourceUrl: string }[]
  /** The setting named in the direct answer, when the first control's name does not read well there. */
  leadControl?: string
  setupSteps: { sourceUrl: string; steps: string[] }
  /** What a child under the minimum age can use instead, if the maker offers anything. */
  underAge: { text: string; sourceUrl: string }
  /** Plain statements of what could not be confirmed at the source. Shown as TODO-JP-REVIEW. */
  uncertain: string[]
  /** Apps a parent of this app's user is likely to look at next. Slugs. */
  similar: string[]
  /** When the entry was last checked against its sources. */
  checked: string
}

/** The ages the age pages cover. */
export const AGES = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const
export type Age = (typeof AGES)[number]

/** The marker the review list is built from. One spelling, so a search finds every one. */
export const REVIEW_MARK = 'TODO-JP-REVIEW'

/** "a 9 year old", "an 8 year old", "an 11 year old". */
export function aAge(age: number): string {
  return `${age === 8 || age === 11 || age === 18 ? 'an' : 'a'} ${age} year old`
}
