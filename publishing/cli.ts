// THE GUIDED PLANET, from the command line.
//
//   npm run planet -- <command> [issue]
//
//   check <n>      the editorial gate only: sources, citations, copy rules
//   render <n>     everything: three PDFs, previews, the online edition, checks
//   status <n>     where the issue is in the workflow, and what it waits on
//   cycle          the monthly routine: do the next automatic step for every
//                  open issue, stop at each approval gate (automation/cycle.ts)
//   package <n>    the distribution package, only after FINAL APPROVED
//   higgsfield <n> the illustration brief and the credit estimate, no spend
//   links <n>      every link in the issue, fetched
//
// Nothing here publishes anything. Publication is `publish`, which refuses to
// run unless the store holds a final approval for this exact PDF.

import { renderEdition, loadIssue, printSummary } from './pdf-engine/render'
import { validateIssue } from './engine/validate'

const [cmd, arg] = process.argv.slice(2)
const n = Number(arg)

async function main() {
  switch (cmd) {
    case 'check': {
      const f = validateIssue(loadIssue(n))
      for (const x of f) console.log(`${x.level === 'error' ? 'FAIL' : 'warn'}  p${x.page ?? '-'} ${x.rule}: ${x.detail}`)
      const bad = f.filter(x => x.level === 'error').length
      console.log(bad ? `\nFAIL  ${bad} to fix` : '\nPASS  the editorial gate is clean')
      process.exit(bad ? 1 : 0)
    }
    case 'render': {
      const r = await renderEdition(n)
      printSummary(r)
      process.exit(r.ok ? 0 : 1)
    }
    default: {
      const mod = await import('./automation/commands')
      await mod.run(cmd, arg)
    }
  }
}

main().catch(e => { console.error(e instanceof Error ? e.message : e); process.exit(1) })
