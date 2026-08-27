# AI-assisted migration of a legacy PHP web application

Research artefact for a bachelor's thesis in Multimedia & Creative Technologies at Howest (2025–2026). The repository holds one frozen legacy PHP application and the six recorded outputs of a controlled migration experiment: the same app, migrated once per cell by Cursor 3.0.0, across two target stacks and three degrees of planning direction.

Author: Elliot Heyse.

## Research question

To what extent is AI-assisted code migration a valid and qualitatively sound approach for modernizing legacy web applications, and what are the implications for the role of the developer and the IT organization?

The artefacts in this repository are the research object and the raw one-shot outputs against which that question was measured. This file maps what is here. How to restore the oracle and how to re-run a cell are in [INSTALL.md](INSTALL.md).

## Experiment

A two-by-three factorial design, one run per cell, each a single one-shot operation from a cold start. Every combination is a **migration cell**, identified as `r0-m{methodology}-s{stack}-{stack name}`. `r0` means raw agent output: no follow-up turn, correction or clarification.

|                              | s1 — Next.js (App Router, bun) | s2 — Blazor Server (.NET 10) |
| ---------------------------- | ------------------------------ | ---------------------------- |
| **m1 — no planning**         | `r0-m1-s1-nextjs`              | `r0-m1-s2-blazor`            |
| **m2 — autonomous planning** | `r0-m2-s1-nextjs`              | `r0-m2-s2-blazor`            |
| **m3 — directed planning**   | `r0-m3-s1-nextjs`              | `r0-m3-s2-blazor`            |

Methodology varies how much planning direction the agent receives and who supplies its structure:

- **m1** — the prompt is issued in **agent mode**. The model edits immediately and produces no plan.
- **m2** — the prompt is issued in **plan mode**. The model produces a plan of its own devising, which is then executed as a separate step.
- **m3** — plan mode again, but the prompt supplies the _shape_ of the plan rather than its content: identify the application's features first, then organise the build by layer. It does not tell the agent what the application does.

What was held fixed: the unmodified PHP source as test oracle; the MySQL schema (never migrated); the prompt, word-for-word identical apart from the stack clause and the methodology clause; three agent rules (`cold-start-no-git`, `open-files-only`, `database-schema`); one run per cell; Cursor 3.0.0. The underlying model was left in auto mode.

## Repository layout

```text
.
├── original-immutable/          Frozen test oracle (read-only)
│   ├── data/                    Schema and seed SQL
│   └── silent_auction_merged/   Procedural PHP application
├── migrations/
│   ├── template/                Cold-start scaffold for a new cell
│   └── r0/                      The six recorded runs
│       └── m{1,2,3}/s{1-nextjs,2-blazor}/
│           ├── conversation-log.md
│           └── code/migrated-project/
├── INSTALL.md                   Restore the oracle; reproduce a cell
└── .cursor/                     Repo-level rules (oracle is protected)
```

## The research object

[`original-immutable/silent_auction_merged/`](original-immutable/silent_auction_merged/) is a web-based management tool for a school PTA silent auction. It is procedural PHP with no framework, no ORM and no front-end build step: roughly 3,100 non-blank lines across 65 files, plus a hand-written stylesheet. Persistence is MySQL (`silent_auction`) with six tables — `Donor`, `Bidder`, `Category`, `Lot`, `Item`, `Bid` — and **no foreign-key constraints**. Every referential rule lives in application code. Schema and seed data are in [`original-immutable/data/`](original-immutable/data/).

| Area    | What it covers                                                                             |
| ------- | ------------------------------------------------------------------------------------------ |
| Donors  | CRUD, pending tax-receipt report, solicitation letters and tax receipts as PDFs            |
| Lots    | Items, lots and categories (CRUD); bulk item-to-lot assignment; per-item bidding-sheet PDF |
| Auction | Public catalogue grouped by category                                                       |
| Bidders | Stub page only; bidder records are selectable when editing a lot                           |

The folder is the frozen control of the experiment. A repository rule, [`.cursor/rules/original-immutable-protected.mdc`](.cursor/rules/original-immutable-protected.mdc), forbids any agent from editing, renaming, moving or deleting anything under it. The one file you create inside it is gitignored `config/env.php`; see [INSTALL.md](INSTALL.md) §1.4.

## Recorded outputs

Each cell lives at `migrations/r0/m{1,2,3}/s{1-nextjs,2-blazor}/`:

| Path                         | Contents                                                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `conversation-log.md`        | Verbatim prompt, Cursor mode, wall-clock duration, and (for m2/m3) the plan the agent produced                       |
| `code/migrated-project/`     | The generated application, committed as left by the agent                                                            |
| `code/original-php-project/` | Gitignored. A copy of the oracle, supplied at run time so the prompt's `@original-php-project/` attachment resolves  |
| `code/.cursor/rules/`        | Gitignored in cells; tracked in [`migrations/template/`](migrations/template/). Restored when scaffolding a new cell |

Cell READMEs are uneven. `m1-s1-nextjs` still has the untouched `create-next-app` boilerplate; `m2-s2-blazor` and `m3-s2-blazor` have no README. Database wiring for every cell — including those three — is in [INSTALL.md](INSTALL.md) §1.7. Build and run steps that a cell _does_ document belong to that cell's own README.

The prompts used in the recorded runs are copied verbatim in [INSTALL.md](INSTALL.md) §2.5 and in each `conversation-log.md`.

## Restore and reproduce

[INSTALL.md](INSTALL.md) is the operational guide.

- **Part 1: Restore** — clone, create and seed `silent_auction`, configure the oracle, install PHP dependencies, run the PHP app as the test oracle, and point a recorded migrated project at your database.
- **Part 2: Reproduce** — scaffold a _new_ cell from `migrations/template/`, bound the agent, submit the verbatim prompt, log the run, and measure. Reproducing a cell means producing a new migration, not rebuilding the committed one. A fresh run will differ; that is a property of the technique.

## What a clone does not contain

Deliberately excluded from version control, and restored by [INSTALL.md](INSTALL.md): Composer `vendor/`, `config/env.php`, per-cell `original-php-project/` and `.cursor/`, Next.js `.env.local` files, and build output (`node_modules/`, `.next/`, `bin/`, `obj/`).

Not in this repository at all:

- `plan/` and `test-suite/` — research-design documents and the manual test results. The six prompts survive in [INSTALL.md](INSTALL.md) §2.5 and in each cell's `conversation-log.md`.
- The thesis, the 35-scenario evaluation matrix, SonarQube exports, interview transcripts, and the derived manual-reimplementation baseline. Those measurements are not reconstructed from this clone.
