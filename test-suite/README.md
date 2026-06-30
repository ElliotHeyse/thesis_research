# Correctness suite — automated harness (PHP + Next.js)

One **assertion set**, two executors: this harness runs assertions automatically against **legacy PHP** and **Next.js**; the _same_ assertions are walked manually against **Blazor Server** (separate checklist, generated from the same source of truth).

## Repo layout

```
thesis_research/
├── original-immutable/
│   └── silent_auction_merged/        # frozen legacy PHP app (the oracle)
├── <migration-cells>/                # migrated stacks (Next.js, etc.) — added per cell
└── test-suite/                       # ← this harness
    ├── venv/                         # local virtualenv (git-ignored)
    ├── requirements.txt
    ├── conftest.py                   # fixtures: per-test seed reset + DB accessor
    ├── helpers.py                    # the 4 capabilities + assert primitives
    ├── routes.py                     # per-stack URL/param mapping layer
    ├── seeds.py                      # shared seed values for assertions
    ├── test_*.py                     # assertions, one module per feature group
    ├── README.md
    ├── .env.example                  # committed config template
    ├── .env                          # your real config (git-ignored)
    └── .gitignore                    # ignores venv/ and .env
```

## Architecture (the one idea that matters)

Separate **"what to request"** (per-stack, expected to differ) from **"what must be true"** (stack-agnostic — the actual assertion).

- `routes.py` — the **per-stack URL/param mapping layer**. Legacy uses `donors/edit_donor.php?DonorID=5`; Next.js may use `/donors/5/edit`. The mapping absorbs that so the _same_ assertion runs against both. **Route restructuring is normalized here, never scored as a correctness failure** (URL shape isn't user-observable behavior). Record divergences here as data about how the AI restructured routing.
- `conftest.py` — pytest fixtures: per-test **DB seed reset** (at the DB layer, stack-agnostic) + a DB accessor for side-effect checks.
- `helpers.py` — the four capabilities: `fetch_text` (GET + normalize HTML to searchable text), `pdf_text` (fetch PDF + extract text), `DB` (direct DB read), and assert primitives (`contains`, `absent`).
- `test_*.py` — the assertions, one module per feature group, expressed as observable facts. **These never contain a raw URL** — they ask `routes` for it.

## Setup (one-time)

```bash
cd test-suite
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # then edit .env with your real values
```

Keep ONE DB driver in `requirements.txt` (PyMySQL for MySQL/MariaDB, or psycopg2-binary for Postgres) and match the driver import in `helpers.py`.

**Prerequisites on your machine:**

- MySQL server running (the app and the seed-reset fixture both use it).
- `mysql` CLI on your PATH (`conftest.py` shells out to it before every test). On Windows, add the MySQL Server `bin` folder (e.g. `C:\Program Files\MySQL\MySQL Server 8.0\bin`) to your user or system PATH, then restart the terminal (or Cursor) so the change is picked up.

## Configuration (.env)

All stack- and machine-specific settings live in `test-suite/.env` (copied from the committed `.env.example`). `conftest.py` loads it before test collection, so `routes.py` sees `TARGET` and the base URLs at import time.

`.env` is git-ignored; `.env.example` is committed as documentation. Real shell env vars override `.env` (loaded with `override=False`), so you can flip target per-run without editing the file.

| Var                                                           | Purpose                                     | Default                                            |
| ------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------- |
| `TARGET`                                                      | which stack to test: `php` or `nextjs`      | `php`                                              |
| `PHP_BASE_URL`                                                | base URL of the running legacy app          | `http://localhost:8080`                            |
| `NEXTJS_BASE_URL`                                             | base URL of a running Next.js cell          | `http://localhost:3000`                            |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | DB connection                               | see `.env.example`                                 |
| `SEED_PATH`                                                   | path to seed.sql, relative to `test-suite/` | `../plan/phase1/data-model-documentation/seed.sql` |

> `SEED_PATH` is relative to the `test-suite/` directory (where you run pytest). Adjust it to wherever your `seed.sql` actually lives under the repo.

## Running the tests

The harness does **not** start the app under test — you run that separately. Use **two terminals**: one for the project being tested, one for pytest.

### What you are testing

| Phase                        | Project location                            | `TARGET` in `.env` | Base URL var      |
| ---------------------------- | ------------------------------------------- | ------------------ | ----------------- |
| Oracle / Phase 2 gate        | `original-immutable/silent_auction_merged/` | `php`              | `PHP_BASE_URL`    |
| Migrated cell (e.g. Next.js) | wherever that cell lives under the repo     | `nextjs`           | `NEXTJS_BASE_URL` |

Point `PHP_BASE_URL` / `NEXTJS_BASE_URL` at whatever host and port you use when starting that stack. The path on disk is only relevant for **how you start** the server, not for pytest itself.

### Terminal 1 — run the project under test

Start the stack you want to exercise. Examples:

**Legacy PHP oracle** (from the app root):

```bash
php -S localhost:8080 -t path/to/silent_auction_merged
```

Initially that is `original-immutable/silent_auction_merged/`. Later, start the migrated cell the same way its README or dev script specifies (e.g. `npm run dev` for Next.js on port 3000). Leave this process running.

Confirm the base URL responds (e.g. open `/donors/index.php` or the cell’s home route in a browser).

### Terminal 2 — run the test suite

```bash
cd test-suite
source venv/bin/activate          # Windows: venv\Scripts\activate
pytest -q                         # quiet summary
# or
pytest -v                         # one line per test
```

Optional: run a single module or test:

```bash
pytest test_donors.py -q
pytest test_donors.py::test_d10_receipt_marks_sent -v
```

**Expected result against the oracle:** `27 passed`.

Each test restores `seed.sql` to the database before it runs, so order does not matter and you can re-run freely.

### Target selection

With `TARGET=php` in `.env`, a bare `pytest` runs against legacy. Override per-run without editing the file:

```bash
TARGET=nextjs pytest -q           # Unix
$env:TARGET="nextjs"; pytest -q   # PowerShell
```

Blazor has no automated target — it's the manual checklist.

## Build order (Phase 2 gate)

1. `cp .env.example .env`; set `SEED_PATH` and DB connection details.
2. Implement `routes.py` for `php` first.
3. Port assertions into `test_*.py` modules (see [test-suite-definition.md](../plan/phase2/test-suite-definition.md)).
4. `TARGET=php pytest` → **all green against legacy**. _This is the Phase 2 exit gate._
5. Later, per Next.js cell: fill that cell's `routes.py` mapping, run `TARGET=nextjs pytest`, capture pass/fail (don't interpret — §6 of the plan).

## Assertion patterns

| Pattern                       | Example feature                | Helper used                        |
| ----------------------------- | ------------------------------ | ---------------------------------- |
| Plain content (data appears)  | D1 donor list                  | `fetch_text` + `contains`          |
| Presence **and** absence      | D6 pending receipts            | `fetch_text` + `contains`/`absent` |
| PDF text                      | I6 bidding sheet defaults      | `pdf_text`                         |
| DB side-effect (before/after) | D10 mark-sent flips TaxReceipt | `fetch_text`/`pdf_text` + `DB`     |

Full test suite definition: [test-suite-definition.md](../plan/phase2/test-suite-definition.md)
