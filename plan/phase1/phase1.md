# Phase 1: Establish the research object

**Purpose:** Turn the PHP app from "known code" into "a documented, measurable control."  
**Entry condition:** Repo set up; legacy code frozen in a untouchable directory on the main branch.  
**Exit condition:** Scope frozen; feature inventory complete; representative test data prepared.

## Key activities:

### Feature Inventory

**Instructions:** Produce a feature inventory: every in-scope feature, files involved, complexity rating. Doubles as migration checklist _and_ completeness scorecard. Scope: everything except for composer testing (functional for the end-user).

**Results:** [feature-inventory.md](./feature-inventory.md)

### Data Model Documentation

**Instructions** Document the data model: schema export, relationships, representative seed data for testing.

**Results:** [data-model-documentation/](./data-model-documentation/)

- [database.sql](./data-model-documentation/database.sql) (schema)
- [relationships.md](./data-model-documentation/relationships.md)
- [seed.sql](./data-model-documentation/seed.sql) (test data)

### Expected hiccups due to PHP-specific constructs

**Instructions:** Identify PHP-specific constructs likely to resist migration (session handling, global state, raw SQL, others...). These are the _predictions_ of where AI will struggle — comparing prediction vs. reality later is strong analytical material, and may differ by methodology.

**Results:** [php-migration-friction.md](./php-migration-friction.md)
