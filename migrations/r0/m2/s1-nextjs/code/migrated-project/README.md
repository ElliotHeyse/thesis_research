# Silent Auction — Next.js Migration

Taylor Elementary PTA Silent Auction management app, migrated from PHP to **Next.js App Router** with **Bun**.

## Requirements

- [Bun](https://bun.sh)
- MySQL `silent_auction` database (existing schema, no migrations)

## Setup

```bash
bun install
bun pm trust puppeteer   # first time only — downloads Chromium for PDF generation
```

Copy `.env.local` values if needed (defaults match local harness):

```
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=MysqlEragon44!
DATABASE_NAME=silent_auction
```

Replace `public/assets/Tiger-icon-hi-res.svg` with the official PTA logo (`Tiger-icon-hi-res.webp`) if available.

## Run

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Donors** — CRUD, pending receipts report, solicitation letters PDF, tax receipts PDF
- **Lots** — Items (bulk lot assignment), lots, categories CRUD, bidding sheet PDF
- **Auction** — Public catalog grouped by category

## Stack

- Next.js 16 App Router (React Server Components + Server Actions)
- mysql2 connection pool
- Zod validation
- Puppeteer HTML-to-PDF
