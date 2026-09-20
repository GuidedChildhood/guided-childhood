"""Generate shared/schools-rshe-2026.ts from the audited requirement data.

The generated file is committed. This generator is the thing to edit, so the
data module and GDC_SCHOOLS_COVERAGE_MATRIX.csv can never say different things
about the same requirement.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from verdicts import V, NOT_LESSON
from kcsie_anchors import A
from evidence import E, BY_DESIGN

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
REQ = json.load(open(os.path.join(HERE, "requirements.json")))
BY = {(s["phase"], s["strand"]): s for s in REQ}

BLOCK = {"Relationships education": "Relationships education",
         "RSE": "Relationships and sex education",
         "Health and wellbeing": "Health and wellbeing"}

def esc(s):
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")

rows = []
for rid, key, n, cov, mods, ev, gap in V:
    sect = BY[key]
    if rid in BY_DESIGN:
        verdict, note = "BY_DESIGN", BY_DESIGN[rid]
    elif cov == "FULL":
        verdict, note = "FULL", ""
    elif cov == "NONE":
        verdict, note = "GAP", gap
    else:                       # PARTIAL and INDIRECT are both work in progress
        verdict, note = "PARTIAL", gap
    modules = [m.strip() for m in mods.split(";") if m.strip()] if verdict != "GAP" else []
    rows.append({
        "id": rid, "phase": key[0], "block": BLOCK[sect["block"]], "strand": sect["strand"],
        "item": n, "text": sect["items"][str(n)], "kcsie": A.get(rid, ""),
        "verdict": verdict, "modules": modules, "evidence": E.get(rid, []), "note": note,
    })

counts = {v: sum(1 for r in rows if r["verdict"] == v) for v in ("FULL", "PARTIAL", "GAP", "BY_DESIGN")}

HEAD = """// THE SEPTEMBER 2026 STATUTORY REQUIREMENTS, AS DATA.
//
// Every digital and online requirement of the DfE Relationships Education,
// Relationships and Sex Education (RSE) and Health Education statutory
// guidance, July 2025, in force 1 September 2026. Fifty seven rows: the
// thirty nine items in the four online strands, plus the eighteen items in
// other strands with a substantial digital element.
//
// WHY THIS FILE EXISTS. Until 19 September 2026 the whole compliance story
// rendered from RSHE_2025_TOPICS in schools-curriculum.ts, a list of ten
// themes someone wrote. The guidance has twenty eight strands and one hundred
// and ninety five numbered items. Nothing downstream could be more accurate
// than that list, and the list had never been checked against the document.
// The audit (GDC_SCHOOLS_2026_COMPLIANCE_AUDIT.md) checked it, and this file
// is what replaced it.
//
// `text` is quoted verbatim from the guidance and carries its hyphens. Leave
// them: the house rule about dashes governs our copy, not a quotation from a
// statutory document, and editing quoted text breaks the audit trail.
//
// `kcsie` records where Keeping Children Safe in Education 2026 names the same
// harm, by paragraph. Thirty six of the fifty seven have one. A requirement
// named by the curriculum guidance AND the safeguarding guidance is the kind a
// DSL asks about, which is why the column exists.
//
// `evidence` is the contract: short phrases that must appear in the named
// modules' live slide text. scripts/check-rshe-coverage.mjs holds the file to
// it, so a lesson edit that quietly drops a requirement fails CI rather than
// being discovered by a customer.
//
// GENERATED. Edit scripts/gen-rshe-2026.py and regenerate; do not hand edit.

export type Rshe2026Verdict = 'FULL' | 'PARTIAL' | 'GAP' | 'BY_DESIGN'

export type Rshe2026Requirement = {
  /** Stable id, e.g. RSHE-S-OSA-15. Phase, strand, item. */
  id: string
  phase: 'primary' | 'secondary'
  block: 'Relationships education' | 'Relationships and sex education' | 'Health and wellbeing'
  strand: string
  /** The item number inside its strand, as the guidance numbers it. */
  item: number
  /** Verbatim from the guidance. Hyphens are the document's own. */
  text: string
  /** Where KCSIE 2026 names the same harm, by paragraph. Empty if it does not. */
  kcsie: string
  verdict: Rshe2026Verdict
  /** Module ids that teach it. Empty for GAP, by rule. */
  modules: string[]
  /** Phrases that must appear in those modules' slide text. */
  evidence: string[]
  /** For BY_DESIGN, where it belongs and what we teach towards it. For
   *  PARTIAL and GAP, the named clause that is missing. */
  note: string
}

export const RSHE_2026_SOURCE = {
  title: 'Relationships Education, Relationships and Sex Education (RSE) and Health Education',
  publisher: 'Department for Education',
  published: 'July 2025',
  inForce: '1 September 2026',
  /** The RSHE document body carries no commencement date. This is the citation
   *  that does, and it is a second statutory document. */
  inForceCitation: 'Keeping Children Safe in Education 2026, paragraph 159: the guidance is "revised for introduction September 2026"',
  /** The whole subject, for the denominator. This scheme is a digital literacy
   *  and online safety spine and covers the online part of it, never all 195. */
  itemsInGuidance: 195,
  strandsInGuidance: 28,
  reviewed: '2026-09-20',
  reviewedBy: 'Full coverage audit against the live schools.school_lessons rows on 19 September 2026, re-run on 20 September after migrations 312 to 316 closed every gap it found',
} as const

"""

lines = [HEAD, "export const RSHE_2026: Rshe2026Requirement[] = ["]
for r in rows:
    lines.append("  {")
    lines.append(f"    id: '{r['id']}', phase: '{r['phase']}', item: {r['item']},")
    lines.append(f"    block: '{esc(r['block'])}',")
    lines.append(f"    strand: '{esc(r['strand'])}',")
    lines.append(f"    text: '{esc(r['text'])}',")
    lines.append(f"    kcsie: '{esc(r['kcsie'])}',")
    lines.append(f"    verdict: '{r['verdict']}',")
    lines.append(f"    modules: [{', '.join(chr(39)+m+chr(39) for m in r['modules'])}],")
    lines.append(f"    evidence: [{', '.join(chr(39)+esc(p)+chr(39) for p in r['evidence'])}],")
    lines.append(f"    note: '{esc(r['note'])}',")
    lines.append("  },")
lines.append("]")
lines.append("")
lines.append("""/** Counts, computed rather than written down, so a page cannot print a number
 *  the array does not support. */
export const RSHE_2026_COUNTS = {
  full: RSHE_2026.filter(r => r.verdict === 'FULL').length,
  partial: RSHE_2026.filter(r => r.verdict === 'PARTIAL').length,
  gap: RSHE_2026.filter(r => r.verdict === 'GAP').length,
  byDesign: RSHE_2026.filter(r => r.verdict === 'BY_DESIGN').length,
  total: RSHE_2026.length,
}

/** The requirements still to close. The ratchet in
 *  scripts/check-rshe-coverage.mjs holds this number down and never lets it
 *  rise, which is the whole point of writing the audit as a guard. */
export const RSHE_2026_OUTSTANDING = RSHE_2026.filter(
  r => r.verdict === 'PARTIAL' || r.verdict === 'GAP',
)

export function requirementsFor(moduleId: string): Rshe2026Requirement[] {
  return RSHE_2026.filter(r => r.modules.includes(moduleId))
}
""")

out = os.path.join(ROOT, "shared/schools-rshe-2026.ts")
open(out, "w").write("\n".join(lines))
print("wrote", out)
print("counts:", counts, "total", len(rows))
print("with evidence:", sum(1 for r in rows if r["evidence"]))
