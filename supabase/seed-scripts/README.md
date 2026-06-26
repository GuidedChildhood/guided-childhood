# Script library expansion

This folder expands the parent conversation script library from 17 to **101 scripts**, so the product matches the "100+ scripts" promise made on the starter pack, scripts, and device checklist pages.

The scripts mirror the Good Inside model: a real moment, the words to say, the thing not to say, why it works, and one action for tonight. Every script uses the same `scripts` table schema already defined in `migrations/001_initial.sql`, so nothing new needs building. Content lives in the database, not the code, which keeps it easy to add more over time.

## Files

| File | Stage | Ages | New scripts | sort_order |
|------|-------|------|-------------|------------|
| `foundation.sql` | Foundation | 4 to 7 | 17 | 101 to 117 |
| `builder.sql` | Builder | 8 to 10 | 17 | 201 to 217 |
| `explorer.sql` | Explorer | 11 to 13 | 17 | 301 to 317 |
| `shaper.sql` | Shaper | 13 to 15 | 17 | 401 to 417 |
| `independent.sql` | Independent | 16 plus | 16 | 501 to 516 |
| **Total** | | | **84** | |

Combined with the original 17 in `seed.sql`, the library is **101 scripts**.

## How to load

Run in the Supabase SQL editor, in this order:

1. `migrations/001_initial.sql` (schema, if not already applied)
2. `seed.sql` (the original 17 scripts and stages)
3. `seed-scripts-expansion.sql` (this expansion: all 84 new scripts in one file)

`seed-scripts-expansion.sql` at the parent level is the five files above concatenated, so you can paste one file instead of five. The individual files are kept for editing and review.

## Conventions

- British English. No dashes used as punctuation, in line with the house voice rules.
- All new scripts are `is_free = false` (members only), preserving the existing free sample of 3.
- Apostrophes are SQL-escaped (doubled) and the whole expansion has been validated by parsing and inserting all 84 rows without error.
- `law_flag` is `none` except where a script relates to under-16 social media restrictions, so the `social_media_law` flag can vary that content without a rewrite.

## Adding more later

To add a script, append a new value tuple to the relevant stage file (or a new file), give it the next `sort_order`, double any apostrophes, and re-run that file in Supabase. No code deploy is needed.
