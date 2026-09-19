import csv, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from verdicts import V, NOT_LESSON
from kcsie_anchors import A

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
REQ = json.load(open(os.path.join(HERE, "requirements.json")))
BY = {(s["phase"], s["strand"]): s for s in REQ}
BLOCK = {"Relationships education": "Relationships education (primary)",
         "RSE": "Relationships and sex education (secondary)",
         "Health and wellbeing": "Health and wellbeing"}

RSHE_SRC = ("DfE Relationships Education, Relationships and Sex Education (RSE) and Health Education, "
            "statutory guidance, July 2025, for introduction September 2026")
RSHE_STATUS = "STATUTORY CURRICULUM (schools must have regard to it; the subjects are compulsory)"
IN_FORCE = ("1 September 2026, confirmed by KCSIE 2026 para 159: schools must have regard to the statutory "
            "guidance, 'revised for introduction September 2026'")

rows = []
for rid, key, n, cov, mods, ev, gap in V:
    sect = BY[key]
    rows.append({
        "requirement_id": rid,
        "source_document": RSHE_SRC,
        "source_status": RSHE_STATUS,
        "in_force": IN_FORCE,
        "phase": "Primary" if key[0] == "primary" else "Secondary",
        "block": BLOCK[sect["block"]],
        "strand": sect["strand"],
        "item_no": n,
        "requirement_text_verbatim": sect["items"][str(n)],
        "also_named_by_kcsie_2026": A.get(rid, ""),
        "satisfiable_by_pupil_lessons": "Yes",
        "coverage": cov,
        "modules_that_teach_it": mods,
        "evidence_in_the_lessons": ev,
        "what_is_missing": gap,
    })

for rid, src, text, cov, mods, ev, gap in NOT_LESSON:
    status = ("STATUTORY SAFEGUARDING" if src.startswith("Keeping")
              else "TECHNICAL / GOVERNANCE STANDARD" if rid.startswith("FILT")
              else "STATUTORY CURRICULUM GUIDANCE, non teaching duty")
    rows.append({
        "requirement_id": rid, "source_document": src, "source_status": status, "in_force": "",
        "phase": "All", "block": "Duties that are not teaching requirements", "strand": "", "item_no": "",
        "requirement_text_verbatim": text, "also_named_by_kcsie_2026": A.get(rid, ""),
        "satisfiable_by_pupil_lessons": "No", "coverage": cov,
        "modules_that_teach_it": mods, "evidence_in_the_lessons": ev, "what_is_missing": gap,
    })

out = os.path.join(ROOT, "GDC_SCHOOLS_COVERAGE_MATRIX.csv")
with open(out, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)

from collections import Counter
teach = [r for r in rows if r["satisfiable_by_pupil_lessons"] == "Yes"]
print("rows:", len(rows), "cols:", len(rows[0]), "| teaching:", len(teach))
print("verdicts:", dict(Counter(r["coverage"] for r in teach)))
print("with a KCSIE anchor:", sum(1 for r in teach if r["also_named_by_kcsie_2026"]))
print("NONE and also named by KCSIE:",
      [r["requirement_id"] for r in teach if r["coverage"] == "NONE" and r["also_named_by_kcsie_2026"]])
