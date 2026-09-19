# The statutory coverage pipeline

One set of facts, three outputs, so none of them can drift from the others.

```
requirements.json        the 195 items of the July 2025 RSHE guidance, verbatim
verdicts.py              what we teach against each one, with the evidence
kcsie_anchors.py         where KCSIE 2026 names the same harm, by paragraph
evidence.py              the phrases that must appear in the lessons
        |
        +--> gen_ts.py   -> shared/schools-rshe-2026.ts      (the app reads this)
        +--> mkcsv2.py   -> GDC_SCHOOLS_COVERAGE_MATRIX.csv  (the school reads this)
```

## Regenerate

```
python3 scripts/rshe/gen_ts.py     # the data module
python3 scripts/rshe/mkcsv2.py     # the matrix CSV
node scripts/check-rshe-coverage.mjs
```

## After changing any evidence phrase or module list

The guard will fail with a stale attestation, on purpose. A coverage claim
cannot be edited into existence: it has to be checked against the lessons that
are actually in production.

```
npm run rshe-evidence        # prints the SQL
```

Run that SQL against the production database. It returns one TOTAL row and one
row per phrase that was NOT found. If the TOTAL row says zero failures, update
`scripts/fixtures/rshe-evidence.json`: set `generatedAt`, `pairsChecked`,
`failures` and `requirementsHash` (the guard prints the hash it computed when
it fails). If any phrase was not found, the lesson does not say what the data
module claims it says, and the claim is what is wrong.

## Where the source documents came from

Both were supplied by Justin on 19 September 2026 because every UK government
domain is blocked by this environment's network policy. The RSHE text was cross
checked two ways, an extraction from the official PDF and an independent
markdown conversion, and they agree on 28 strands and 195 items with identical
wording. KCSIE 2026 was read in full and is cited by paragraph.

Nothing in this folder is paraphrased from memory. If a source is not here, the
audit says so rather than guessing, which is why four `Computing` hooks are
still marked unverified.
