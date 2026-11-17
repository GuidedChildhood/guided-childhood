// OUR SCHOOL WEEK: the second fridge sheet, beside the star chart.
//
// Justin, 17 November 2026, from his own house: "checking homework ready and
// done, reading record ... we sometimes miss deadlines checking class dojo or
// app from school, emails from schools and homework", plus the front seat
// fight and the morning that starts with a request for the TV. Plan:
// plans/2026-11-17-family-week-pack.md.
//
// One sheet for the whole family, one column per child, so the school week is
// in one place a parent and every child can see from the kettle:
//
//   reading each night ticked, and what is due written in, per child per day
//
//   what school already told us, printed in: the app's school catch reads
//   forwarded school emails and photos of letters into school_actions, and
//   every dated item for this week (and every weekly kit day) prints into the
//   right day and the right child's column. That is the link: forward the
//   ClassDojo or school email once, and it is on the fridge on Monday.
//
//   the front seat rota, filled in before the week starts, the children's
//   names taking turns, so the car stops being the place it gets decided
//
//   the morning order (TV comes after dressed, breakfast, teeth, hair and
//   shoes) and the leaving time, in big numbers by the door
//
//   the Sunday ten minutes: Dojo and the school app, the emails, the bags
//
// Signed out, it prints blank with pen lines: the free download.

import { HAPPY, RainbowArc } from '@/components/kid/HappyNewsBits'
import SheetScale from '@/components/printables/SheetScale'
import { PrintBrandMark } from '@gc/shared/components/PrintBrand'
import {
  PAGE_W, PAGE_H, DAY_INK, DAY_BG, TickBox, PenLine, panel, panelTitle, eyebrow, small,
} from '@/components/printables/StarChartSheet'

/** One thing school told us, placed on the sheet. */
export type SchoolItem = {
  /** 0 Monday to 4 Friday. Weekend items are not printed. */
  day: number
  /** Index into `kids`, or null for the whole family. */
  child: number | null
  text: string
}

const SCHOOL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const
const ROTA_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
// Three columns for the blank sheet: the commonest family with more than one
// at school, and still room to write.
const BLANK_COLUMNS = 3
const MAX_KIDS = 4

const MORNING = ['Dressed', 'Breakfast', 'Teeth', 'Hair and shoes', 'Then TV, if there is time']

/** The front seat by turns: the names in order, round and round, weekdays and weekend. */
export function frontSeatRota(kids: string[]): (string | null)[] {
  if (kids.length < 2) return ROTA_DAYS.map(() => null)
  return ROTA_DAYS.map((_, i) => kids[i % kids.length])
}

export default function SchoolWeekSheet({ kids, weekLabel, items = [] }: {
  /** First names, oldest first or as the family lists them. Empty prints blank columns. */
  kids: string[]
  weekLabel: string | null
  items?: SchoolItem[]
}) {
  const named = kids.filter(Boolean).slice(0, MAX_KIDS)
  const columns: (string | null)[] = named.length > 0 ? named : Array.from({ length: BLANK_COLUMNS }, () => null)
  const rota = frontSeatRota(named)
  const family = (day: number) => items.filter(it => it.day === day && it.child === null)
  const forKid = (day: number, child: number) => items.filter(it => it.day === day && it.child === child)
  const anyCaught = items.length > 0

  return (
    <div className="school-week-wrap" style={{ marginTop: 24, breakBefore: 'page', pageBreakBefore: 'always' }}>
    <style>{`@media print { .school-week-wrap { margin-top: 0 !important } }`}</style>
    <SheetScale sheetWidth={PAGE_W} sheetHeight={PAGE_H}>
      <div className="print-sheet fridge-page school-week-page" style={{
        width: PAGE_W, height: PAGE_H, boxSizing: 'border-box', background: 'var(--white)',
        border: '1.5px solid var(--border)', borderRadius: 'var(--radius-btn)', padding: 20,
        display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div data-print-brand><PrintBrandMark label="Family week" /></div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 34, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.02 }}>
              Our school week
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-soft)', marginTop: 5 }}>
              {weekLabel ? `Week beginning ${weekLabel}` : 'Week beginning ____________'}
            </div>
          </div>
          <div style={{ position: 'relative', width: 130, flexShrink: 0 }}>
            <RainbowArc width={130} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/digi-squad/DiGi-star.png" alt="" style={{ position: 'absolute', left: 40, bottom: 0, width: 50, height: 50, objectFit: 'contain' }} />
          </div>
        </div>

        {/* THE WEEK, a row per school day and a column per child. */}
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ background: 'var(--ink)', color: 'var(--white)', textAlign: 'left', padding: '6px 10px', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 900, width: 96, borderTopLeftRadius: 10, border: '1px solid var(--ink)' }}>
                This week
              </th>
              {columns.map((n, i) => (
                <th key={i} style={{ background: 'var(--butter)', color: 'var(--ink)', padding: '6px 8px', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 900, border: '1px solid var(--ink)', borderTopRightRadius: i === columns.length - 1 ? 10 : 0, textAlign: 'left' }}>
                  {n ?? <span style={{ display: 'flex', alignItems: 'flex-end', gap: 4, fontSize: 11, fontWeight: 700 }}>Name <PenLine /></span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCHOOL_DAYS.map((d, day) => (
              <tr key={d}>
                <td style={{ background: DAY_BG[day], border: '1px solid var(--border)', padding: '6px 8px', verticalAlign: 'top' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 13, color: DAY_INK[day] }}>{d}</div>
                  {family(day).map((it, k) => (
                    <div key={k} style={{ fontSize: 10, lineHeight: 1.25, color: 'var(--ink)', fontWeight: 700, marginTop: 3 }}>{it.text}</div>
                  ))}
                </td>
                {columns.map((_, c) => (
                  <td key={c} style={{ border: '1px solid var(--border)', padding: '6px 8px', verticalAlign: 'top', height: 92 }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
                      <span style={{ ...small, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--ink)', fontWeight: 700, fontSize: 11 }}><TickBox />Reading</span>
                      <span style={{ ...small, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--ink)', fontWeight: 700, fontSize: 11 }}><TickBox />Homework</span>
                    </div>
                    {forKid(day, c).map((it, k) => (
                      <div key={k} style={{ fontSize: 10.5, lineHeight: 1.25, color: 'var(--ink)', fontWeight: 700, background: HAPPY.butterLt, borderRadius: 5, padding: '2px 5px', marginBottom: 3 }}>{it.text}</div>
                    ))}
                    <div style={{ display: 'grid', gap: 3 }}>
                      {Array.from({ length: Math.max(1, 2 - forKid(day, c).length) }, (_, k) => <PenLine key={k} />)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* THE FRONT SEAT, decided on paper before Monday. */}
        <div style={{ border: '2px solid var(--ink)', borderRadius: 14, padding: '8px 12px', background: 'var(--cream)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <div style={panelTitle}>Front seat this week</div>
            <div style={{ ...small, fontSize: 10.5 }}>Taking turns, written before Monday. No arguing at the car door.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
            {ROTA_DAYS.map((d, i) => (
              <div key={d} style={{ background: 'var(--white)', border: `1.5px solid ${DAY_INK[i]}`, borderRadius: 9, padding: '4px 5px', textAlign: 'center', minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, color: DAY_INK[i], letterSpacing: '0.08em', textTransform: 'uppercase' }}>{d}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 12, color: 'var(--ink)', minHeight: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {rota[i] ?? <PenLine />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1, minHeight: 0 }}>
          {/* The morning, in order, and the time the door opens. */}
          <div style={{ ...panel, background: 'var(--butter-lt)' }}>
            <div style={eyebrow}>Every school morning</div>
            <div style={panelTitle}>Ready, then the TV</div>
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 4 }}>
              {MORNING.map((step, i) => (
                <li key={step} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: i === MORNING.length - 1 ? 800 : 600, color: 'var(--ink)' }}>
                  <span aria-hidden style={{ flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: 'var(--white)', border: '1.5px solid var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, color: 'var(--ink)' }}>We leave at</span>
              <span style={{ width: 44, height: 36, border: '2px solid var(--ink)', borderRadius: 8, background: 'var(--white)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20 }}>:</span>
              <span style={{ width: 44, height: 36, border: '2px solid var(--ink)', borderRadius: 8, background: 'var(--white)' }} />
            </div>
          </div>

          {/* The Sunday ten minutes, and the way the app saves most of them. */}
          <div style={panel}>
            <div style={eyebrow}>Sunday night, ten minutes</div>
            <div style={panelTitle}>Nothing missed this week</div>
            {['ClassDojo and the school app checked', 'School emails read', 'Homework due written in above', 'Reading records back in bags', 'PE kit washed and packed'].map(t => (
              <div key={t} style={{ ...small, color: 'var(--ink)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}><TickBox />{t}</div>
            ))}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 'auto' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/qr/school-week.svg" alt="QR code to the school section of the app" style={{ width: 58, height: 58, flexShrink: 0, background: 'var(--white)', borderRadius: 6 }} />
              <p style={{ ...small, fontSize: 10.5 }}>
                {anyCaught
                  ? <><strong style={{ color: 'var(--ink)' }}>Printed in from school:</strong> the dates the app caught from your forwarded emails. Scan to add more.</>
                  : <><strong style={{ color: 'var(--ink)' }}>Grown up:</strong> forward school emails to the app, or snap a letter, and the dates print here next week.</>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SheetScale>
    </div>
  )
}
