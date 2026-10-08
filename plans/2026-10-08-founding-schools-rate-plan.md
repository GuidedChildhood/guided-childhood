# Founding schools rate (8 October 2026)

Justin, 8 October 2026: "yes on founding rate", the recommendation in
`plans/2026-10-07-school-price-against-elim.md`.

- The first 50 schools: any primary at £195 a year, held for as long as they
  stay. List prices and the secondary bands do not change.
- Capped in code, the way the parent founder rate is: a new band,
  `founding_primary`, counted from `schools.invoice_requests` like the pilot's
  five places, and the server action refuses it once 50 are taken.
- `/pricing` names the offer and the places left; the invoice form offers the
  band while places remain and starts on it, so a pilot that converts at term
  end lands on it. The parent app's invoice cron gets the label.
- Nothing else moves: no new table, no migration.
