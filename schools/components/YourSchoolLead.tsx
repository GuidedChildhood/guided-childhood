'use client'

import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  readYourSchool, leadLine, bare, schoolRows,
  YOUR_SCHOOL_EVENT, YOUR_SCHOOL_LABEL, type YourSchool,
} from '@gc/shared/schools-your-school'

// THE NAME, READ OFF THIS SCREEN.
//
// The lesson pages and the print pack are server components: they cannot
// see the browser, and they should not, because nothing about a school's
// staff should reach the server. So each of them renders one of these small
// client islands where the name belongs, and the island reads the browser.
// Before the store is read (and on the server) it renders nothing, so a page
// with no name typed looks exactly as it did before this existed.

/** The store, and whether this screen has read it yet. Until it has, a page
 *  draws nothing rather than draw the empty state and then swap in the
 *  school's details a moment later. */
export function useYourSchoolState(): { school: YourSchool | null; ready: boolean } {
  const [state, setState] = useState<{ school: YourSchool | null; ready: boolean }>({ school: null, ready: false })
  useEffect(() => {
    const read = () => setState({ school: readYourSchool(), ready: true })
    read()
    window.addEventListener(YOUR_SCHOOL_EVENT, read)
    window.addEventListener('storage', read)
    return () => {
      window.removeEventListener(YOUR_SCHOOL_EVENT, read)
      window.removeEventListener('storage', read)
    }
  }, [])
  return state
}

export function useYourSchool(): YourSchool | null {
  return useYourSchoolState().school
}

/**
 * One sentence for the prep page and the run sheet: who the lead is on this
 * screen, or, when nothing is typed, where to type it. The second case is a
 * link and not silence, because a flagged lesson is exactly the moment a
 * teacher discovers the box exists. It points at the safeguarding crosswalk
 * rather than the Hub because the crosswalk is open: the free taster is a
 * flagged lesson, and a link from it into the gated Hub was a dead end for
 * exactly the visitor it was written for.
 */
export function LeadLine({ style }: { style?: React.CSSProperties }) {
  const v = useYourSchool()
  return (
    <span style={style}>
      {v ? (
        <>In this school that is <strong>{bare(leadLine(v))}</strong>.</>
      ) : (
        <>Type your safeguarding lead&rsquo;s name once on <Link href="/hub/dsl#your-school" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the safeguarding page</Link> and it appears here and on the slide that asks for it.</>
      )}
    </span>
  )
}

/**
 * The printed teacher sheet: the name only, no link, because paper has no
 * link to follow and a blank is the honest state of a sheet printed from a
 * screen that has not been told. The deputy and the route follow when typed,
 * because the sheet is on the desk at the moment a child says something.
 */
export function LeadOnPaper({ style }: { style?: React.CSSProperties }) {
  const v = useYourSchool()
  if (!v) return null
  return (
    <p style={style}>
      Your safeguarding lead, as typed on the screen this was printed from: <strong>{bare(leadLine(v))}</strong>.
      {v.deputyName ? <> If they are out: <strong>{bare(v.deputyName)}</strong>.</> : null}
      {v.reportRoute ? <> Record it: {bare(v.reportRoute)}.</> : null}
    </p>
  )
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--coral-dark)',
}
const term: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
  margin: 0, paddingTop: '3px',
}
const value: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)',
  lineHeight: 1.5, margin: 0,
}
const box: React.CSSProperties = {
  border: '1.5px solid var(--ink)', borderRadius: 'var(--radius-tile)',
  padding: '14px 18px', margin: '0 0 22px', background: '#fff',
}

/** The school's details as label and value rows: typed values, or ruled
 *  lines to write on. Shared by the screen and the paper so they match. */
function FactsBox({ rows, aside }: { rows: { label: string; value: string }[] | null; aside?: React.ReactNode }) {
  const blank = [YOUR_SCHOOL_LABEL.leadName, YOUR_SCHOOL_LABEL.deputyName, YOUR_SCHOOL_LABEL.reportRoute, YOUR_SCHOOL_LABEL.policyTitle]
  return (
    <div className="gc-print-card" style={box}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-3)', marginBottom: '10px' }}>
        <span style={eyebrow}>This school</span>
        {aside}
      </div>
      <dl className="gc-facts" style={{ margin: 0 }}>
        {rows
          ? rows.map(r => (
              <Fragment key={r.label}>
                <dt style={term}>{r.label}</dt>
                <dd style={value}>{r.value}</dd>
              </Fragment>
            ))
          : blank.map(label => (
              <Fragment key={label}>
                <dt style={term}>{label}</dt>
                {/* A line to write on: tall enough for handwriting, ruled in ink. */}
                <dd style={{ ...value, borderBottom: '1px solid var(--ink-muted)', minHeight: '1.9em' }} aria-label="blank, to write in" />
              </Fragment>
            ))}
      </dl>
    </div>
  )
}

/**
 * The school's own details at the top of a page a DSL files: the crosswalk
 * and the staff briefings. Typed on this screen, they print as typed. Not
 * typed, the paper gets ruled lines to write them in, because a filed copy
 * should name its school either way, and a pen is an honest way to adapt one.
 *
 *   paper  printed only, because the screen shows the form (the crosswalk)
 *   page   on screen too when typed, with a way to change it; when nothing
 *          is typed, the screen says where to type it (the briefings)
 */
export function SchoolFacts({ mode, changeHref }: { mode: 'paper' | 'page'; changeHref?: string }) {
  const { school, ready } = useYourSchoolState()
  if (!ready) return null
  const rows = school ? schoolRows(school) : null

  if (mode === 'paper') {
    return <div className="gc-print-only"><FactsBox rows={rows} /></div>
  }

  if (rows) {
    return (
      <FactsBox
        rows={rows}
        aside={changeHref ? (
          <Link className="no-print" href={changeHref} style={{ ...term, paddingTop: 0, color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
            Change
          </Link>
        ) : null}
      />
    )
  }

  return (
    <>
      <p className="no-print" style={{ ...value, color: 'var(--ink-soft)', borderLeft: '3px solid var(--coral)', paddingLeft: '12px', margin: '0 0 22px' }}>
        Type your safeguarding lead, their deputy and how a concern is recorded once
        {changeHref ? <> on <Link href={changeHref} style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the Hub</Link></> : null}
        , and every briefing below names them.
      </p>
      <div className="gc-print-only"><FactsBox rows={null} /></div>
    </>
  )
}

/**
 * Under each briefing's disclosure paragraph: who to take it to in this
 * school, and how it is recorded. Nothing when nothing is typed, because the
 * top of the page already carries the lines to write on.
 */
export function DisclosureRoute({ style, labelStyle }: { style?: React.CSSProperties; labelStyle?: React.CSSProperties }) {
  const v = useYourSchool()
  if (!v) return null
  return (
    <p style={style}>
      <span style={labelStyle}>In this school: </span>
      take it to {bare(leadLine(v))}
      {v.deputyName ? <>, or {bare(v.deputyName)} if they are out</> : null}.
      {v.reportRoute ? <> Record it: {bare(v.reportRoute)}.</> : null}
    </p>
  )
}
