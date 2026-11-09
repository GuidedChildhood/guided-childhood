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

## Blocked, and what we do instead

| source | status | what we do |
|---|---|---|
| OpenAlex | 429 "Insufficient budget" | the shared proxy address is rate limited. Retried with a mailto and at 20 second spacing, same answer. Crossref and Europe PMC cover substantially the same records |
| Semantic Scholar | 429 | needs an API key. Would work with one |
| Ofcom | 403 Cloudflare | Ofcom material that reaches GOV.UK is still found. Anything Ofcom-only needs the PDF putting in Drive |
| ICO | 403 Cloudflare | same |
| Cochrane Library | 403 Cloudflare | Cochrane reviews with a DOI are found through Crossref and Europe PMC |
| eSafety Australia | Cloudflare, no answer | refused four times across three sessions. Needs the PDF in Drive |
| OECD SDMX | 406 | rejects every `format` value tried on the dataflow endpoint. Not pursued |
| Google Scholar | not attempted | no API, and scraping it is against its terms |

## The two things that would most improve coverage

1. **A Semantic Scholar API key.** One free key turns a 429 into a working
   source with citation context and reference lists.
2. **The Ofcom and eSafety PDFs in Drive.** Four Cloudflare-blocked regulators
   are the biggest hole, and they are the most UK-relevant sources we have.
   Drive reads work, so a PDF dropped in a folder is readable.
