# What the Research Radar can and cannot reach

Probed from the session container on 9 November 2026. Re-probe before trusting
this: a Cloudflare rule or a rate limit can change without notice.

## Working, returned real data

| source | endpoint | note |
|---|---|---|
| Europe PMC | `ebi.ac.uk/europepmc/webservices/rest/search` | the best single source. MEDLINE plus preprints, a real query language, grant data, no key |
| PubMed | `eutils.ncbi.nlm.nih.gov` esearch + esummary | publication types and MeSH. Three requests a second without a key |
| Crossref | `api.crossref.org` | the authoritative DOI record and the real online date |
| medRxiv | `api.biorxiv.org/details/medrxiv` | preprints, one call per window |
| GOV.UK search | `www.gov.uk/api/search.json` | reaches DfE, DHSC and anything Ofcom publishes on GOV.UK |
| DOAJ | `doaj.org/api/search/articles` | open access journals |
| OSF preprints | `api.osf.io/v2/preprints` | works, not yet wired into a stream |
| NIH Reporter | `api.reporter.nih.gov/v2/projects/search` | POST only. Grants, not findings |
| WHO GHO | `ghoapi.azureedge.net` | indicators |
| CDC data | `data.cdc.gov/api/views.json` | datasets |
| UNICEF SDMX | `sdmx.data.unicef.org` | indicators |
| EU open data | `data.europa.eu/api/hub/search` | datasets |
| data.gov.uk | `data.gov.uk/api/3/action/package_search` | needs redirect following |
| UK Parliament | `members-api.parliament.uk` | members, not research |
| arXiv | `export.arxiv.org/api/query` | https only, http 301s |
| GOV.UK content API | `www.gov.uk/api/content/<path>` | one publication with its attachment list. Added 10 November |
| GOV.UK attachments | `assets.publishing.service.gov.uk` | **the route round Ofcom and the ICO.** Serves publication PDFs. A 5 MB DSIT report downloaded and extracted cleanly. Added 10 November |

## Blocked, and what we do instead

| source | status | what we do |
|---|---|---|
| OpenAlex | 429 "Insufficient budget" | the shared proxy address is rate limited. Retried with a mailto and at 20 second spacing, same answer. Crossref and Europe PMC cover substantially the same records |
| Semantic Scholar | 429 | needs an API key. Would work with one |
| Ofcom | 403 Cloudflare | **mostly solved.** Research Ofcom commissioned through a department is read in full through the GOV.UK attachment lane. Ofcom-only material still needs the PDF in Drive |
| ICO | 403 Cloudflare | same route out as Ofcom. The ICO and Ofcom age assurance research was ingested in full this way, 21,851 words |
| Cochrane Library | 403 Cloudflare | Cochrane reviews with a DOI are found through Crossref and Europe PMC |
| eSafety Australia | 503 Cloudflare | refused five times across four sessions, and it is not on GOV.UK, so there is no route round it. Needs the PDF in Drive |
| web.archive.org | reset, then refused | tested on 10 November precisely to get round the four above. Snapshots were confirmed to EXIST through `archive.org/wayback/available`, but every fetch path failed: curl is reset at the egress and the fetch tool refuses the host. **The archive is not a fallback** |
| OECD SDMX | 406 | rejects every `format` value tried on the dataflow endpoint. Not pursued |
| Google Scholar | not attempted | no API, and scraping it is against its terms |

## The two ways a document gets in without a fetch

Both put the record through the same gates as a fetched study: scored, deduped,
versioned, status DISCOVERED, no review claimed. A document is better evidence
than an abstract, because we hold the whole text, and that is recorded as
`fullTextPath` on the record.

```
# a regulator report published on GOV.UK, no manual step at all
node scripts/radar/ingest.mjs --govuk /government/publications/<slug>

# anything else, once the PDF is in Drive and read out to a file
node scripts/radar/ingest.mjs <file.pdf> --title "..." --url ... --publisher Ofcom --published 2026-09-25
```

`npm run radar-drop-test` guards both. It runs against a throwaway register,
because the first version of that test advanced a live record and briefly put an
unreviewed document at the head of the Stage 2 queue.

## What would still improve coverage

1. **A Semantic Scholar API key.** One free key turns a 429 into a working
   source with citation context and reference lists.
2. **The eSafety PDFs in Drive.** It is the one blocked source with no route
   round it. Ofcom and the ICO now largely have one.
3. **A shared contact address in `RADAR_CONTACT`.** Crossref, PubMed and
   OpenAlex all give a higher rate limit to a client that identifies itself, and
   OpenAlex's 429 may well be the shared proxy address rather than us. It must
   be a shared inbox such as `research@guidedchildhood.com`, never a personal
   address: this header goes to every index on every request. Left unset by
   default, and the radar works without it.
