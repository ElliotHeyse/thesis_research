# Installation and reproduction guide

This repository holds the research object and the outputs of a controlled migration experiment: one legacy PHP application migrated six times by an agentic coding tool, across two target stacks and three degrees of planning direction.

The guide has two halves.

- **[Part 1: Restore](#part-1-restore)** gets the repository and the frozen PHP application (the test oracle) running on your machine.
- **[Part 2: Reproduce](#part-2-reproduce)** gives the protocol for re-running any of the six migration cells from a cold start.

The six migrated applications carry their own build and run instructions, so this guide does not repeat them. It covers only what those READMEs cannot: pointing each one at your database. That coverage is uneven, since two cells have no README at all and one has untouched `create-next-app` boilerplate, so [1.7](#17-point-a-migrated-project-at-your-database) fills the gaps.

---

## Prerequisites

| Requirement                  | Needed for                   | Notes                                                                    |
| ---------------------------- | ---------------------------- | ------------------------------------------------------------------------ |
| MySQL 8 or later             | Everything                   | Local server on `localhost:3306`                                         |
| PHP 8.0 or later             | The oracle                   | Extensions: `pdo_mysql`, `dom`, `mbstring`; `gd` recommended for Dompdf  |
| Composer                     | The oracle                   | `vendor/` is not committed                                               |
| Git                          | Everything                   |                                                                          |
| Cursor                       | Part 2 only                  | The experiment used Cursor 3.0.0                                         |
| Bun                          | The three Next.js cells      | Replaces Node.js as the toolchain                                        |
| .NET SDK 10                  | The three Blazor cells       | The projects target `net10.0`                                            |
| SonarQube or SonarQube Cloud | Part 2, static analysis only | Plus the scanner for each stack; see [Static analysis](#static-analysis) |

---

# Part 1: Restore

## 1.1 Clone the repository

```bash
git clone <repository-url> thesis_research
cd thesis_research
```

## 1.2 Know what the clone does not contain

Several things needed to run or reproduce anything are deliberately excluded from version control. Nothing below is an error in your clone; each one has a step in this guide.

| Missing after clone                                       | Why                               | Restored by                                          |
| --------------------------------------------------------- | --------------------------------- | ---------------------------------------------------- |
| `original-immutable/silent_auction_merged/vendor/`        | Gitignored dependency tree        | [1.5](#15-install-php-dependencies)                  |
| `original-immutable/silent_auction_merged/config/env.php` | Contains credentials              | [1.4](#14-configure-the-database-connection)         |
| `migrations/**/code/original-php-project/`                | Gitignored in template and cells  | [2.3](#23-scaffold-a-migration-cell)                 |
| `migrations/r0/**/code/.cursor/`                          | Gitignored per cell               | [2.3](#23-scaffold-a-migration-cell)                 |
| Next.js `.env.local` and its example files                | Caught by the `.env*` ignore rule | [1.7](#17-point-a-migrated-project-at-your-database) |
| `node_modules/`, `.next/`, `bin/`, `obj/`                 | Build output                      | Each migrated project's own README                   |

Two folders referenced by older documentation, `plan/` and `test-suite/`, are in neither the repository nor the working tree. See [Known gaps](#known-gaps-and-caveats).

## 1.3 Create and seed the database

The schema and seed data live in `original-immutable/data/`. The DDL declares **no foreign-key constraints** — every referential rule in this application lives in PHP code, which is the property that makes it interesting as a research object.

```bash
mysql -u root -p < original-immutable/data/database.sql
mysql -u root -p < original-immutable/data/seed.sql
```

PowerShell has no `<` input redirection, so on Windows use `source` instead:

```powershell
mysql -u root -p -e "source original-immutable/data/database.sql"
mysql -u root -p -e "source original-immutable/data/seed.sql"
```

`database.sql` runs `CREATE DATABASE IF NOT EXISTS silent_auction` and creates six tables: `Donor`, `Bidder`, `Category`, `Lot`, `Item` and `Bid`. It never drops anything, so it is safe to re-run.

`seed.sql` truncates all six tables, inserts the fixture rows (15 donors, 10 bidders, 6 categories, 12 lots, 30 items, 10 bids) and resets the `AUTO_INCREMENT` counters. Re-running it is the **reset-and-reseed** step used between migration runs and before every test session.

### Create the MySQL users

The repository ships no user or grant statements, so create them yourself. The application resolves one of three credential pairs per call site through `db_connect()`, but only two are ever used — see [1.4](#14-configure-the-database-connection).

```sql
CREATE USER 'auction_ro'@'localhost' IDENTIFIED BY '<your-password>';
CREATE USER 'auction_rw'@'localhost' IDENTIFIED BY '<your-password>';

GRANT SELECT ON silent_auction.* TO 'auction_ro'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON silent_auction.* TO 'auction_rw'@'localhost';

FLUSH PRIVILEGES;
```

A single privileged user reused for all three pairs also works for local development.

## 1.4 Configure the database connection

Copy the template and fill it in. The file is a plain set of PHP globals, not environment variables.

```bash
cp original-immutable/silent_auction_merged/config/env.php.example \
   original-immutable/silent_auction_merged/config/env.php
```

| Key                             | Value                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| `$servername`                   | `localhost` (append `:3307` or similar for a non-default port)                     |
| `$database`                     | `silent_auction`                                                                   |
| `$username_ro` / `$password_ro` | Read-only user. Used by every `SELECT` in `silent_auction_merged/data/`            |
| `$username_rw` / `$password_rw` | Read/write user. Used by every `INSERT`, `UPDATE` and `DELETE`                     |
| `$username_fc` / `$password_fc` | Full control. Declared in the config but **never called** anywhere in the codebase |

There is no port key: `silent_auction_merged/data/db_connect.php` builds the DSN as `mysql:host=$servername;dbname=$database`.

## 1.5 Install PHP dependencies

```bash
cd original-immutable/silent_auction_merged
composer install
```

The only runtime dependency is Dompdf, used in-process to render donor letters, tax receipts and bidding sheets. PHPUnit is a dev dependency.

## 1.6 Run and verify the oracle

From `original-immutable/silent_auction_merged`:

```bash
composer dev
```

That is `php -S localhost:8000`. Open <http://localhost:8000/index.php>.

`includes/paths.php` defines `BASE_URL` as an empty string, which assumes the application is served from the document root. This is correct for the built-in server. To serve it from a subpath under Apache, set `BASE_URL` to that prefix — but note that `original-immutable/` is read-only (see below), so make such a change in a copy.

| Area    | URL          |
| ------- | ------------ |
| Home    | `/index.php` |
| Donors  | `/donors/`   |
| Lots    | `/lots/`     |
| Auction | `/auction/`  |

The test suite is 14 PHPUnit files covering UI helpers and formatting utilities. It needs no database, so it is a fast check that PHP and the autoloader are wired up correctly:

```bash
composer test
```

### `original-immutable/` is read-only

The folder is the frozen control of the experiment. A repository rule, [`.cursor/rules/original-immutable-protected.mdc`](.cursor/rules/original-immutable-protected.mdc), forbids any agent from editing, renaming, moving or deleting anything under it. Reading, searching and executing are allowed.

`config/env.php` is the one file you create inside it, and it is gitignored. If you need to change anything else, copy the application out first.

## 1.7 Point a migrated project at your database

Build and run steps belong to each migrated project's own README. What no README can cover is your credentials: the committed configuration files hard-code the original author's local MySQL password, so every cell needs one edit before it will connect.

> **This is a deviation from the recorded run conditions.** The experiment was executed against a specific local database user whose credentials were supplied to the agent in plain text, and the agents wrote those values into configuration files. That is itself a reported finding of the study rather than an accident. Changing the credentials does not affect behavioural equivalence, but it does mean your working tree no longer matches the committed artefacts byte for byte.

| Cell           | Edit                                                               | Setting                                                                                 |
| -------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `m1-s1-nextjs` | Create `code/migrated-project/.env.local`                          | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`                               |
| `m2-s1-nextjs` | Create `code/migrated-project/.env.local`                          | `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` |
| `m3-s1-nextjs` | Create `code/migrated-project/.env.local`                          | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`                               |
| `m1-s2-blazor` | `code/migrated-project/appsettings.json`                           | `ConnectionStrings:DefaultConnection`                                                   |
| `m2-s2-blazor` | `code/migrated-project/SilentAuction/appsettings.Development.json` | `ConnectionStrings:DefaultConnection`                                                   |
| `m3-s2-blazor` | `code/migrated-project/SilentAuction/appsettings.json`             | `ConnectionStrings:SilentAuction`                                                       |

Cell paths are `migrations/r0/m{1,2,3}/s{1-nextjs,2-blazor}/`.

Two notes on the Next.js cells. The `.env*` ignore rule means the example files are not in the repository, which is why the variable names are listed above and why the `cp .env.local.example .env.local` step in the `m3-s1` README cannot work from a fresh clone. And the pool factories fall back to a hard-coded default when a variable is absent, so an incomplete `.env.local` fails quietly rather than loudly: `m1-s1` falls back to the author's password in `code/migrated-project/lib/db.ts`, and `m3-s1` falls back to an empty password in `code/migrated-project/src/lib/db/pool.ts`.

The Blazor connection strings can also be overridden without editing a file, for example `ConnectionStrings__DefaultConnection` as an environment variable.

Three cells need run instructions this guide has to supply. `m2-s2-blazor` and `m3-s2-blazor` have no README:

```bash
cd code/migrated-project/SilentAuction
dotnet run
```

`m1-s1-nextjs` has the untouched `create-next-app` boilerplate README, which mentions neither the database nor Bun as the required toolchain:

```bash
cd code/migrated-project
bun install
bun dev
```

---

# Part 2: Reproduce

## 2.1 The design

The experiment crosses two factors and runs each combination once, as a single one-shot operation from a cold start. Each combination is a **migration cell**, identified as `r0-m{methodology}-s{stack}-{stack name}`.

|                              | s1 — Next.js (App Router, bun) | s2 — Blazor Server (.NET) |
| ---------------------------- | ------------------------------ | ------------------------- |
| **m1 — no planning**         | `r0-m1-s1-nextjs`              | `r0-m1-s2-blazor`         |
| **m2 — autonomous planning** | `r0-m2-s1-nextjs`              | `r0-m2-s2-blazor`         |
| **m3 — directed planning**   | `r0-m3-s1-nextjs`              | `r0-m3-s2-blazor`         |

The methodology axis varies how much planning direction the agent receives and who supplies its structure:

- **m1** — the prompt is issued in **agent mode**. The model edits immediately and produces no plan.
- **m2** — the prompt is issued in **plan mode**. The model produces a plan of its own devising, which is then executed as a separate step.
- **m3** — plan mode again, but the prompt supplies the _shape_ of the plan rather than its content: identify the application's features first, then organise the build by layer. It does not tell the agent what the application does.

Everything else is held fixed. The database schema is never migrated, the prompt is word-for-word identical apart from the stack clause and the methodology clause, and each cell is run exactly once with no follow-up turn.

## 2.2 What the reproduction requires

Reproducing a cell means producing a **new** migration, not rebuilding the committed one. The recorded outputs in `migrations/r0/` are one sample each; a fresh run will differ, which is a property of the technique rather than a defect in the protocol.

Set up the database first (Part 1, sections [1.3](#13-create-and-seed-the-database) to [1.5](#15-install-php-dependencies)) — the oracle must be installed and runnable, because the migrated application is compared against it.

## 2.3 Scaffold a migration cell

`migrations/template/` is the starting point for every cell. A repository skill, [`.cursor/skills/scaffold-migration-cell/SKILL.md`](.cursor/skills/scaffold-migration-cell/SKILL.md), automates the copy, but it reads its prompts from a `plan/` path that no longer exists, so use the prompts in [2.5](#25-the-six-prompts) instead.

Choose a target path that does not collide with a recorded cell, for example `migrations/r1/m1/s1-nextjs/`, then:

**1. Copy the template.** Recursively, preserving dotfiles.

```bash
cp -r migrations/template/ migrations/r1/m1/s1-nextjs/
```

**2. Supply the legacy source.** The prompt refers to `@original-php-project/`, and that folder is gitignored everywhere, so it does not arrive with the clone. Populate it from the frozen copy:

```bash
cp -r original-immutable/silent_auction_merged/ \
      migrations/r1/m1/s1-nextjs/code/original-php-project/silent_auction_merged/
```

Copy it _after_ running `composer install` and creating `config/env.php`, so the agent sees the same tree the recorded runs saw. That tree included `vendor/` and a populated `config/env.php`. Both are readable by the agent, and the second is one route by which credentials reached the generated code.

**3. Confirm the agent rules are in place.** The template carries all three at `code/.cursor/rules/`. They are gitignored inside cells but tracked in the template, so the copy brings them along. Verify:

```
migrations/r1/m1/s1-nextjs/code/.cursor/rules/cold-start-no-git.mdc
migrations/r1/m1/s1-nextjs/code/.cursor/rules/open-files-only.mdc
migrations/r1/m1/s1-nextjs/code/.cursor/rules/database-schema.mdc
```

**4. Set your credentials in the schema rule.** `database-schema.mdc` contains a **Local connection** table with host, port, user, password and database name. Replace the user and password with your own. Anything you leave there is context the agent can copy into generated code.

**5. Uncomment `.cursor/` in the cell's `.gitignore`.** The template ships it commented out so that the rules stay tracked; a cell needs it active so that its copy stays out of version control.

```gitignore
.cursor/
original-php-project/
```

**6. Delete `code/migrated-project/temp.txt`.** It exists only so that `@migrated-project` resolves as an attachment in the chat before the folder has any content. Remove it before submitting the prompt.

## 2.4 Bound the agent

**Open the cell's `code/` folder as the workspace root in Cursor** — not the repository root, and not the cell folder. The `open-files-only` rule draws its boundary at the workspace root, so opening anything higher lets the agent reach sibling cells, `original-immutable/` and the recorded outputs, and the run is no longer a cold start.

The three rules and what each one is for:

| Rule                | Effect                                                                                                                                                      | Why the experiment needs it                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `cold-start-no-git` | Forbids every git read or inspection command, and any inference from commit, branch or stash history. The working tree on disk is the only source of truth. | Stops a later cell reconstructing an earlier cell's work through version-control history                                     |
| `open-files-only`   | Restricts all read, search and edit operations to the opened workspace root. Forbids parent folders, sibling cells and repository-level paths.              | Guarantees every cell sees the same context                                                                                  |
| `database-schema`   | Supplies the frozen DDL, the naming conventions and the local connection settings. Forbids `CREATE`, `ALTER` and `DROP` on existing tables.                 | Makes the frozen-schema constraint machine-readable, and gives every cell the same starting information about the data layer |

The schema rule supplies the schema, **not** the behaviour. The application's referential rules — most notably that a donor cannot be deleted while items still reference it — are absent from the DDL and can only be discovered by reading the legacy PHP. Supplying them would answer the research question by construction.

Leave the chat's model selection in auto mode to match the recorded runs. This was an uncontrolled factor in the original experiment; fixing the model instead is a deliberate improvement, but it makes your run non-comparable to the recorded one.

## 2.5 The six prompts

Copied verbatim from the `conversation-log.md` of each recorded cell. Use them exactly as written, including the `@` attachments, which must resolve to the cell's `original-php-project/` and `migrated-project/` folders. Only the stack clause and the methodology clause differ between them.

### m1 — no planning (agent mode)

Next.js:

```text
Migrate the php application at @original-php-project/ to Next.js (App Router) using bun. Produce a full-stack implementation — frontend and backend — that is a working application equivalent to the existing one, using the existing database per the provided schema (do not modify the database). Migrate the functionality of the current app. The migrated code lives in @migrated-project, @original-php-project/ stays and remains unaltered.
```

Blazor:

```text
Migrate the php application at @original-php-project/ to Blazor Server (.NET). Produce a full-stack implementation — frontend and backend — that is a working application equivalent to the existing one, using the existing database per the provided schema (do not modify the database). Migrate the functionality of the current app. The migrated code lives in @migrated-project/, @original-php-project/ stays and remains unaltered.
```

### m2 — autonomous planning (plan mode)

Next.js:

```text
Migrate the php application at @original-php-project/ to Next.js (App Router) using bun. Produce a full-stack implementation — frontend and backend — that is a working application equivalent to the existing one, using the existing database per the provided schema (do not modify the database). Plan the migration of the current app's functionality. The migrated code lives in @migrated-project, @original-php-project/ stays and remains unaltered.
```

Blazor:

```text
Migrate the php application at @original-php-project/ to Blazor Server (.NET). Produce a full-stack implementation — frontend and backend — that is a working application equivalent to the existing one, using the existing database per the provided schema (do not modify the database). Plan the migration of the current app's functionality. The migrated code lives in @migrated-project, @original-php-project/ stays and remains unaltered.
```

### m3 — directed planning (plan mode)

Next.js:

```text
Migrate the php application at @original-php-project/ to Next.js (App Router) using bun. Produce a full-stack implementation — frontend and backend — that is a working application equivalent to the existing one, using the existing database per the provided schema (do not modify the database). Plan the migration as follows: first, analyse the current application and identify all of its features yourself. Then plan the build along a layered structure — data access, then business logic, then API routes, then views — so that the plan covers exactly the features you identified and organises the work by layer. The migrated code lives in @migrated-project/, @original-php-project/ stays and remains unaltered.
```

Blazor:

```text
Migrate the php application at @original-php-project/ to Blazor Server (.NET). Produce a full-stack implementation — frontend and backend — that is a working application equivalent to the existing one, using the existing database per the provided schema (do not modify the database). Plan the migration as follows: first, analyse the current application and identify all of its features yourself. Then plan the build along a layered structure — data access, then business logic, then page routing, then views — so that the plan covers exactly the features you identified and organises the work by layer. The migrated code lives in @migrated-project/, @original-php-project/ stays and remains unaltered.
```

The only difference between the two m3 prompts, beyond the stack clause, is the third layer: `API routes` on Next.js against `page routing` on Blazor.

## 2.6 Run the cell

Each cell follows the same seven steps.

1. **Reset.** Reseed `silent_auction` from `original-immutable/data/seed.sql`, so the migration begins against identical rows.
2. **Cold start.** Open a fresh Cursor window on the cell's `code/` folder, containing an untouched `original-php-project/` and an empty `migrated-project/`, with the three rules active. No other cell's output, plan or transcript may be reachable.
3. **Prompt.** Submit the verbatim prompt for that cell — agent mode for m1, plan mode for m2 and m3. Start timing at submission.
4. **Plan (m2 and m3 only).** Stop the planning clock when the agent presents its plan. **Accept it without amendment.** Editing the plan moves the cell along the continuum of direction by an amount that cannot be recorded, and turns m3 into a measurement of the developer rather than of the methodology.
5. **Execute.** Let the agent implement the migration in a single operation loop. Stop the execution clock at its final turn. Issue no follow-up turn, correction or clarification, however obviously broken the result is. The one-shot stop condition is what makes the measurement a clean lower bound.
6. **Reseed and test.** Reseed the database a second time, then execute the scenario suite by hand. Roughly 25 to 30 minutes per cell.
7. **Analyse.** Run SonarQube over the generated codebase under the Sonar way profile and export every finding.

Steps 4 and 5 are where the protocol is easiest to break. If you find yourself typing a second message to the agent, the run is over and the result is whatever was on disk at the final turn.

## 2.7 Log the run

Record the run in the cell's `conversation-log.md`, which the template pre-structures. Two shapes are in use, matching the two timing models:

- **m1** records `pre-generation (spec): None (no planning)` and a single `generation:` duration.
- **m2 and m3** record a `complete run:` total, then `#### Plan creation` and `#### Plan execution` subsections, each with its own `**Duration:**`.

Log the prompt verbatim, the mode, the starting condition (`None/Cold`), the durations as `hh:mm:ss.ss`, a one-line description of what changed, and the agent's final reply in full. For m2 and m3, include the plan the agent produced — it is the primary evidence for that methodology.

Durations are wall-clock and cover the agent process only. Planning runs from prompt submission to plan presentation; execution runs from plan acceptance to the agent's final turn. Human effort before and after is not part of the figure, and the original study is explicit that this boundary favours the methodologies that consume the most human input.

## 2.8 Measurement

Four criteria were evaluated. The instruments are described here; the recorded results, the full scenario matrix and the per-rule analyser exports are in the thesis appendices, not in this repository.

### Correctness and completeness

Correctness is defined as **observed behavioural equivalence over a defined set of scenarios**, not as proven equivalence. The suite is 35 scenarios derived from the application's feature inventory, executed by hand against a freshly reseeded database, with the oracle running side by side for comparison.

Two scoring rules make the result auditable:

- **Any outcome that is not a strict pass counts as a failure.** A scenario that works but renders without its styling is a failure. This removes evaluator discretion from the score.
- **Record the number of distinct root causes alongside the raw failure count.** One defect that breaks four scenarios is a different engineering fact from four independent defects.

Presentation is judged at separable levels rather than as a single verdict on "styling", because the levels fail independently: the **global** level (design tokens, typography, brand chrome, base styles), the **component** level (subnav tabs, action buttons, data tables and their states), the **primitives** level (buttons, fields, empty states, confirm-delete) and **assets**, scored separately again because a missing image is a resolution failure with a different cause.

The suite itself is in the thesis, appendix 8.3, together with the per-cell outcomes and observed causes. It is not committed here.

### Static analysis

One tool, one profile, every codebase: SonarQube under the **Sonar way** quality profile and quality gate for the language, with no rule enabled, disabled or reweighted per stack.

The Next.js cells carry a `sonar-project.properties` at `code/migrated-project/`, configured for SonarQube Cloud and excluding `node_modules/`, `.next/` and coverage output. `@sonar/scan` is a project dependency, so from the project directory, with `SONAR_TOKEN` in the environment:

```bash
bunx sonar-scanner
```

Change `sonar.projectKey`, `sonar.organization` and `sonar.projectName` to your own before scanning; the committed values point at the original author's SonarQube Cloud organisation.

The Blazor cells have no committed scanner configuration. Use the MSBuild scanner, which wraps the build:

```bash
dotnet tool install --global dotnet-sonarscanner
dotnet-sonarscanner begin /k:"<project-key>" /d:sonar.token="<token>"
dotnet build
dotnet-sonarscanner end /d:sonar.token="<token>"
```

Two properties of the tool constrain how the output may be read. A single finding can be attributed to more than one software quality, so summing per-dimension counts double-counts those findings and a de-duplicated total has to be reported alongside them. And the analysis is language-aware, so a raw count across stacks compares the TypeScript rule set against the C# one. Normalise by size, report occurrences per 1,000 lines of code, and treat comparison **within** a stack as more reliable than comparison across stacks.

Per-rule exports and the result tables are in the thesis, appendix 8.5.

### Security

Treated as its own dimension rather than folded into general quality. A single scanner under-reports, since static analysers disagree substantially with one another over the same files, so read any clean result as a lower bound rather than as a clearance.

### Efficiency

Agent wall-clock duration, split into planning and execution as described in [2.7](#27-log-the-run). The original study compares this against a bottom-up estimate of manual reimplementation rather than an executed control migration; that derivation is in the thesis, appendix 8.7.

---

## Known gaps and caveats

**`plan/` and `test-suite/` are not in this repository.** Both are referenced by older documentation and by the scaffold skill. `plan/` held the research design and the canonical prompt definitions; the prompts survive in this guide and in each cell's `conversation-log.md`. `test-suite/` held the manual test results. The 35-scenario matrix is therefore not reproducible from the repository alone — take it from the thesis appendix 8.3.

**The recorded runs left the model in auto mode.** Any difference between two recorded cells may be a difference in model rather than in methodology, and the two cannot be separated from the data collected. Fixing the model removes that confound but makes your run non-comparable to the recorded one.

**Each cell was run once.** Non-determinism is a property of the technique, so a fresh run will produce a different codebase, plausibly with a different defect profile. Differences between single samples are not statistically supported effects. The findings that survive this best are those repeating within a stack across all three methodologies.

**The scenario suite was executed by a single evaluator, by hand, with no blinding.** Presentation scoring in particular is a judgement, made auditable by the level decomposition and the strict-pass rule rather than made objective by them.

**Editing credentials breaks byte-for-byte parity** with the committed artefacts, as noted in [1.7](#17-point-a-migrated-project-at-your-database).

## Troubleshooting

**Tables not found on Linux or macOS.** The DDL declares tables in PascalCase (`Donor`, `Item`) while the PHP data layer queries them in lowercase. MySQL on Windows is case-insensitive about table names and this never surfaces; on a case-sensitive filesystem it does. Set `lower_case_table_names=1` on the server before creating the database, or rename the tables.

**`Connection failed` on every page of the oracle.** `config/env.php` is missing or its credentials do not match the users you created. `db_connect.php` echoes the PDO message directly, so the reason will be on the page.

**PDF downloads fail in the oracle.** Dompdf needs `dom` and `mbstring`; image handling in tax receipts also wants `gd`.

**PDF generation fails in `m2-s1-nextjs`.** That cell generates PDFs through Puppeteer, which needs its Chromium download approved once: `bun pm trust puppeteer`.

**A migrated Next.js app connects to the wrong database, or to none.** The pool factories fall back to hard-coded defaults when an environment variable is missing, so a typo in `.env.local` fails quietly. Check the variable names for that specific cell in the table in [1.7](#17-point-a-migrated-project-at-your-database) — they differ between cells.
