# Silent Auction — Blazor Server Migration

Blazor Server (.NET 10) port of the Taylor Elementary School PTA Silent Auction PHP application.

## Prerequisites

- .NET 10 SDK
- MySQL with the `silent_auction` database (schema from `plan/phase1/data-model-documentation/database.sql`)

## Configuration

Connection string in `appsettings.json`:

```
Server=localhost;Port=3306;Database=silent_auction;User=root;Password=MysqlEragon44!;
```

Override via `appsettings.Development.json` or environment variable `ConnectionStrings__DefaultConnection`.

## Run

```bash
cd migrated-project
dotnet run
```

Open the URL shown in the console (default `http://localhost:5xxx`).

## Features

| Module | Routes | Notes |
|--------|--------|-------|
| Home | `/` | Module launcher |
| Donors | `/donors`, `/donors/pending-receipts`, `/donors/letters`, `/donors/receipts` | CRUD, PDF letters & tax receipts |
| Lots | `/lots/items`, `/lots/lots`, `/lots/categories` | Items, lots, categories CRUD; bulk lot assignment |
| Auction | `/auction` | Public browse by category |
| Bidders | `/bidders` | Stub (matches PHP) |

### PDF endpoints

- `POST /api/pdf/letters` — donor solicitation letters
- `POST /api/pdf/receipts` — tax receipts (marks donors as sent)
- `GET /api/pdf/bidding-sheet/{itemId}` — printable bidding sheet

## Stack

- Blazor Server (interactive forms)
- Entity Framework Core + Pomelo MySQL provider
- QuestPDF for document generation
- Original `global.css` styling preserved
