# OH55 Davis / Rosie Extraction

Source files:
- `resources/oral-histories/slq-guide-oh55/oh55-details.html`
- `resources/oral-histories/slq-guide-oh55/oh55-guide-items.json`
- `resources/oral-histories/slq-guide-oh55/oh55-guide-items.tsv`
- `resources/analysis/oh55/oh55-keyword-hits.tsv`
- `resources/analysis/oh55/oh55-keyword-summary.md`

Current extraction state:
- `39` OH55 guide items indexed
- `35` transcript markdown files currently present locally
- `2930` total keyword hits across transcript text plus guide scope-and-content metadata

## High-value findings

| Source | Finding | Why it matters |
| --- | --- | --- |
| `OH55/10 Herbert Olufson` | Guide note says the Olufsons had the longest European family history on the Bloomfield. Transcript directly preserves `the Davis's from Davis Hill` and `Martha Davis from Davis Hill`. | Strongest direct oral-history anchor for a remembered white Davis household in the target area. |
| `OH55/01 Frank O'Rourke` | Transcript places `Davis Hill` on the south side from the mouth back on the Bloomfield. | Best place-memory anchor for Davis Hill. |
| `OH55/04 Sylvia Geraghty` | Transcript says `Nunnville` was about `4 miles this side of Rossville` and `had a cattle station`; also preserves `Violet Nunn`, `Billy Nunn`, and the `George Hislop` household. | Strongest oral-history anchor for the Nunnville foster-household corridor. |
| `OH55/25 Harry Shipton` | Guide scope note says his mother had been in the original Bloomfield Mission and ran away to Shipton's Flat to avoid being sent to Yarrabah. | Strong contextual support for the same removal-avoidance world later described around Julia / Nellie. |
| `OH55/37 Bamboo Friday` | Guide scope note preserves the Shipton's Flat / Rossville / Bloomfield network and Bluja King descent. | Keeps the Friday / King corridor relevant, but still not a direct Davis proof. |
| `OH55/31 Elizabeth Lee` | Guide note preserves long-settler Bloomfield family memory, but does **not** supply the `George Davis + Rosie` proof that another agent claimed. | Useful as context and anti-false-quote control. |
| `OH55/34 Wilma & Ralph Watkin & Louise Dean` | Guide note confirms the Watkin family as a real Helenvale / Rossville household with packhorse and school links. | Supports `Watkin` as a real local surname context, but not yet `Nellie Watkin` parentage. |

## What the extraction did not solve

| Problem | Current result |
| --- | --- |
| `George Davis + Rosie` named directly in OH55 | Not recovered from the transcript set or guide metadata |
| Clean transcript quote proving `Auntie Rosie` in Bamboo Friday | Not safe to use from the current noisy transcript |
| Direct oral-history mention of `George Edgar Davis` | Not found in this extraction |
| Direct oral-history mention of late `Rosie Hippie / Homarlee` | Not found in this extraction |

## Practical use

1. Use `OH55/10` and `OH55/01` as the oral-history base for `Davis Hill` and `Martha Davis`.
2. Use `OH55/04` as the oral-history base for `Nunnville`.
3. Use `OH55/25` and `OH55/37` for removal-avoidance and regional corridor context only.
4. Treat broad `King`, `Friday`, and generic `Rosie` keyword counts carefully; many hits are noise or unrelated uses.
