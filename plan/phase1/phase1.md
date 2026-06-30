# Phase 1: Establish the research object

**Purpose:** Turn the PHP app from "code you know" into "a documented, measurable control."  
**Entry condition:** Repo set up; legacy code frozen in an untouchable directory (`original-immutable/`).  
**Exit condition:** Scope frozen (Decision 2.1); feature inventory complete; representative test data prepared.

**Note:** This phase is lighter than usual since the code is already known — but the feature inventory's quality caps the completeness measurement's quality, so don't skip it.

## Key activities:

### Feature Inventory

**Instructions:** Produce a feature inventory: every in-scope feature, files involved, complexity rating. Doubles as migration checklist _and_ completeness scorecard. Scope per Decision 2.1: everything except composer testing (functional for the end-user). _Held back from the agent_ — in M3 the agent must discover features itself, so the inventory is a control, not an input.

**Results:** [feature-inventory.md](./feature-inventory.md)

### Data Model Documentation

**Instructions:** Document the data model: schema export, relationships, representative seed data for testing.

**Results:** [data-model-documentation/](./data-model-documentation/)

- [database.sql](./data-model-documentation/database.sql) (schema)
- [relationships.md](./data-model-documentation/relationships.md)
- [seed.sql](./data-model-documentation/seed.sql) (test data)

### Expected hiccups due to PHP-specific constructs

**Instructions:** Record PHP-specific constructs likely to resist migration (GET-form mutations, side-effect-on-read, the `-1`→NULL sentinel, dynamic CASE SQL). These are the _predictions_ of where AI will struggle — comparing prediction vs. reality later is strong analytical material, and may differ by methodology (does directed planning overcome what one-shot couldn't?).

**Results:** [php-migration-friction.md](./php-migration-friction.md)
