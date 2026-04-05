# CLAUDE.md

Project instructions for autoresearch-genealogy.

## Project Structure

- `prompts/` — Autoresearch prompts for Claude Code. Each prompt is a self-contained research task.
- `vault-template/` — Obsidian vault starter kit. Copy into your vault to begin.
- `reference/` — Methodology guides. Not meant to be modified per-project.
- `workflows/` — Step-by-step procedures for common tasks.
- `lean/` — Lean 4 proof engine. Formal verification of genealogical evidence.
  - `lean/Genealogy/` — Core library: types, evidence rules, tactics, verification.
  - `lean/ExampleFamily/` — Worked example with placeholder names. Copy and adapt for your family.

## Prompt Format

Every prompt in `prompts/` follows this structure:

- **Goal**: What the prompt is trying to accomplish
- **Metric**: A measurable quantity that indicates progress
- **Direction**: Whether to maximize or minimize the metric
- **Verify**: A command or check that measures current state
- **Guard**: Safety rails (what the prompt should NOT do)
- **Iterations**: How many autonomous loops to run
- **Protocol**: Step-by-step instructions for each iteration

Prompts use placeholder names: `[SURNAME]`, `[ANCESTOR]`, `[LOCATION]`, `[DATE]`, `[VAULT_PATH]`.

## Vault Template Conventions

- All vault files use YAML frontmatter with at minimum: `type`, `created`, `tags`
- Person files add: `name`, `born`, `died`, `family`, `confidence`, `sources`
- Transcription files add: `source`, `document_type`, `person`, `date`, `ocr_method`, `ocr_quality`
- Region files add: `confidence`
- Wikilinks (`[[File_Name]]`) connect files within the vault
- File names use underscores, not spaces: `John_Smith.md`, not `John Smith.md`

## Style

- No hyphens as punctuation. Use commas, periods, colons, semicolons, or parentheses.
- No emojis.
- Source-first: every claim should cite its source. Unsourced claims should be flagged.
- Log negative results. "Searched X, found nothing" is valuable data.
- Use confidence tiers (Strong Signal / Moderate Signal / Speculative) for all claims.

## Lean 4 Proof Engine

The `lean/` directory contains a formal verification system that mechanizes the genealogical evidence standard. The type checker enforces evidence rules that are otherwise manual.

Key concepts:
- `Claim α`: a value bundled with sources and a justified confidence level. The type checker verifies the evidence supports the stated confidence.
- `Fact α`: either `.established` (one claim), `.discrepancy` (two conflicting claims with a documented resolution), or `.unknown`.
- `VerifiedClaim α`: a `Claim` with a proof that its confidence is justified by its sources.
- `ParentChild`: a parent-child link with proofs of biological constraints (parent born before child, reasonable generation gap).
- `Hypothesis`: an open research question. Unresolved hypotheses contain `sorry` markers. `lake build | grep sorry` counts open questions.
- `SearchCampaign` / `NegativeResult`: logged searches including negative results, tracking coverage of known repositories.

To build: `cd lean && lake build`

To count open questions: `lake build 2>&1 | grep -c sorry`

To run the audit: the `ExampleFamily/Tree.lean` file contains `#eval printAudit familyDB` which runs all consistency checks.

### Lean Conventions

- Library files (`Genealogy/*.lean`) define the type system. Do not modify per-project.
- Family files (`ExampleFamily/*.lean`) encode your specific research. Copy and adapt.
- Every `Source` must have a unique `independent_id`. Sources with different IDs are considered independent.
- Use `sorry` only for genuinely open research questions, never to skip evidence obligations.
- All names in example files must use placeholder format: `[SURNAME]`, `[LOCATION]`, etc.

## Ontological Knowledge System (GOKS)

The `scripts/goks/` package automatically extracts, stores, and cross-references every fact from every source. It uses OpenAI (via Instructor) to extract structured entities, events, relationships, and claims from text.

### Usage

```bash
source .venv-goks/bin/activate
PYTHONPATH=scripts OPENAI_API_KEY=<key> python3 -m goks.cli <command>
```

Commands:
- `goks status` — show database stats
- `goks ingest <file> --source-id <id>` — extract and store all facts from a file
- `goks ingest-all <directory>` — process all markdown files in a directory
- `goks person <name>` — show all known information about a person
- `goks search <query>` — search all entities
- `goks contradictions` — list all detected discrepancies

### When Processing New Information

1. **Always ingest new sources through GOKS** before manual analysis
2. Check `goks contradictions` for any new discrepancies created
3. If a claim is upgraded to Strong (2+ independent primary sources), update the corresponding Lean file
4. Every entity mentioned in any source should have a database record: persons, locations, animals, ships, clans, medical conditions, traditional names, racial classifications, occupations, everything
5. Log negative results too: "searched X, found nothing" is data

### Database

Location: `research.db` (project root). Extended SQLite with tables for entities, events, claims, aliases, discrepancies, relationships, sources, documents, chunks, and ingestion tracking.

### Extraction Pipeline

File → chunk (2000 chars, 300 overlap) → OpenAI GPT-4o-mini via Instructor → validated Pydantic models → deduplication → SQLite storage → contradiction detection → confidence tracking

## Research Workflow

The standard process for investigating a new research question:

### 1. Query the database first

```bash
source .venv-goks/bin/activate && export $(cat .env | xargs)
PYTHONPATH=scripts python3 -m goks.cli person "<name>"
PYTHONPATH=scripts python3 -m goks.cli search "<query>"
```

Or query `research.db` directly with Python/sqlite3 for complex joins across entities, claims, events, relationships, aliases, and discrepancies.

### 2. Launch parallel research agents

Use the Agent tool to run multiple web searches concurrently. Each agent should:
- Search specific sources (Trove, QSA, CIFHS, BDM, FamilySearch, FindAGrave, etc.)
- Save ALL findings to `resources/web-sources/<topic>/` as markdown files
- Report both positive and negative results

### 3. Encode findings in Lean

Add new `Source` definitions to the relevant `lean/DavisFamily/Sources.lean` (or equivalent family file). Update hypotheses with new `evidence_for` / `evidence_against` entries. Run `lake build` to verify compilation.

### 4. Create a vault note

Write a synthesis note to `vault-template/<Topic>_<Date>.md` with YAML frontmatter, confidence tiers, and source citations.

### 5. Ingest into GOKS

```bash
source .venv-goks/bin/activate && export $(cat .env | xargs)
PYTHONPATH=scripts python3 -m goks.cli ingest vault-template/<note>.md --source-id <id>
PYTHONPATH=scripts python3 -m goks.cli ingest-all resources/web-sources/<topic>/
```

Duplicate protection is built in: `is_ingested()` checks file path + MD5 hash. Changed files are re-ingested; unchanged files are skipped.

### 6. Check for contradictions

```bash
PYTHONPATH=scripts python3 -m goks.cli contradictions
```

Review new discrepancies. If a claim reaches Strong confidence (2+ independent primary sources), update the Lean file.

## Environment Setup

### API Key

Store the OpenAI API key in `.env` at the project root (already in `.gitignore`):

```
OPENAI_API_KEY=sk-...
```

Load it with:

```bash
source .venv-goks/bin/activate && export $(cat .env | xargs)
```

### Key Data Locations

- `research.db` — GOKS SQLite database (entities, claims, events, relationships, discrepancies)
- `resources/web-sources/` — Downloaded web pages and source extracts, organized by topic
- `resources/oral-histories/` — OH55 series transcripts (ASR quality varies)
- `resources/certificate-search/` — BDM certificate search results
- `vault-template/` — Research notes and synthesis documents
- `lean/DavisFamily/` — Formal verification of the Davis/Brackenridge family evidence
- `.env` — API keys (not committed to git)

### Useful GOKS Queries

```bash
# Show database stats
PYTHONPATH=scripts python3 -m goks.cli status

# Look up a person
PYTHONPATH=scripts python3 -m goks.cli person "Rosie"

# Search entities
PYTHONPATH=scripts python3 -m goks.cli search "Reynolds Mowbray"

# List contradictions
PYTHONPATH=scripts python3 -m goks.cli contradictions

# Direct SQL for complex queries
python3 -c "
import sqlite3
conn = sqlite3.connect('research.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()
for r in cur.execute('SELECT * FROM claims WHERE text_span LIKE \"%Reynolds%\"').fetchall():
    print(dict(r))
"
```

### Database Schema Reference

The `research.db` SQLite database has these core tables:

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `entities` | `id`, `type`, `canonical_name`, `metadata` | Every person, place, document, clan, etc. |
| `claims` | `subject_id`, `predicate`, `object_value`, `confidence`, `text_span` | Factual assertions (e.g. birth_year = 1869) |
| `events` | `type`, `date_value`, `description`, `location_id` | Births, deaths, marriages, removals, etc. |
| `participants` | `event_id`, `entity_id`, `role` | Links entities to events |
| `relationships` | `type`, `entity_a_id`, `entity_b_id`, `confidence` | parent_child, same_as, associated, etc. |
| `aliases` | `entity_id`, `name_form`, `year`, `location` | All known name variants |
| `discrepancies` | `claim_a_id`, `claim_b_id`, `subject_id`, `predicate`, `status` | Detected contradictions |
| `sources` | `name`, `tier`, `repository`, `independent_id` | Source provenance |
| `documents` | `path`, `title`, `content`, `content_hash` | Ingested files |
| `chunks` | `document_id`, `chunk_index`, `content` | Text chunks for extraction |
| `ingestion_log` | `file_path`, `file_hash`, `status` | Tracks what has been ingested (dedup) |
| `persons` | `name`, `confidence`, `birth_year_est`, `death_year_est`, `notes` | High-level person summaries |
| `hypotheses` | `statement`, `status`, `evidence_for`, `evidence_against`, `decisive_record` | Open research questions |

Entity types include: `person`, `location`, `document`, `surname`, `clan`, `organization`, `ship`, `medical`, `occupation`, `classification`, `language_group`, `custom`, and others.

Claim confidence values: `strong`, `moderate`, `speculative`.

### Common SQL Patterns

```sql
-- Find all claims about a person
SELECT c.predicate, c.object_value, c.confidence
FROM claims c JOIN entities e ON c.subject_id = e.id
WHERE e.canonical_name LIKE '%Rosie%';

-- Find relationships between two people
SELECT r.type, a.canonical_name, b.canonical_name, r.confidence
FROM relationships r
JOIN entities a ON r.entity_a_id = a.id
JOIN entities b ON r.entity_b_id = b.id
WHERE a.canonical_name LIKE '%Reynolds%' OR b.canonical_name LIKE '%Reynolds%';

-- Find events at a location
SELECT ev.type, ev.date_value, ev.description
FROM events ev JOIN entities loc ON ev.location_id = loc.id
WHERE loc.canonical_name LIKE '%Port Douglas%';

-- Find all name forms for a person
SELECT a.name_form, a.year, a.location
FROM aliases a JOIN entities e ON a.entity_id = e.id
WHERE e.canonical_name LIKE '%Rosie%' ORDER BY a.year;

-- Search text spans for a keyword
SELECT e.canonical_name, c.predicate, c.object_value
FROM claims c JOIN entities e ON c.subject_id = e.id
WHERE c.text_span LIKE '%Reynolds%';

-- Check what files have been ingested
SELECT file_path, status FROM ingestion_log
WHERE file_path LIKE '%reynolds%';
```

## When Contributing

- All examples must use placeholder names. Zero real family names.
- Every prompt must include all 7 fields (Goal, Metric, Direction, Verify, Guard, Iterations, Protocol).
- Vault templates must have valid YAML frontmatter.
- Lean code must compile with `lake build` (warnings for `sorry` are acceptable, errors are not).
- Test that prompts work end-to-end before submitting.
