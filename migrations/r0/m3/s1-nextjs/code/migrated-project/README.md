# Silent Auction — Next.js Migration

Bun + Next.js App Router full-stack migration of the Taylor PTA Silent Auction PHP application.

## Requirements

- [Bun](https://bun.sh)
- MySQL with the `silent_auction` database (schema unchanged)

## Setup

```bash
cp .env.local.example .env.local
bun install
```

Ensure MySQL is running and `.env.local` matches your local credentials.

## Run

```bash
bun dev      # development at http://localhost:3000
bun run build && bun start   # production
```

## Architecture

| Layer | Location |
|-------|----------|
| Data access | `src/lib/repositories/` |
| Business logic | `src/lib/services/` + `src/lib/validation/` |
| API routes | `src/app/api/` |
| Views | `src/app/` + `src/components/` |
| PDF generation | `src/lib/pdf/` via `@react-pdf/renderer` |

## Features

- **Donors** — CRUD, pending receipts report, solicitation letters PDF, tax receipts PDF
- **Lots/Items/Categories** — CRUD, bulk lot assignment, bidding sheet PDF
- **Auction** — public browse by category
- No authentication (matches PHP app)
