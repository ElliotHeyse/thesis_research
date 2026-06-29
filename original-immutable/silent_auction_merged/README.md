# Silent Auction System (Merged)

Unified silent auction management application combining donor management, item/lot administration, and public auction display.

## Project Structure

- **config/**: Database configuration (`env.php.example` → copy to `env.php`)
- **includes/**: Header, footer, navigation, UI helpers, `paths.php` (`BASE_URL`)
- **data/**: Database access functions (`db_donors.php`, `db_items.php`, `db_lots.php`, etc.)
- **donors/**: Donor CRUD, pending receipts, letters, tax receipts
- **lots/**: Items, lots, categories, bidding sheets
- **auction/**: Public auction display
- **bidders/**: Placeholder (future work)
- **templates/**: Printable donor letters and tax receipts
- **css/**, **utils/**, **assets/**

## Features

### Donors

- Donor list, create, edit, delete (with item FK guard)
- Pending tax receipt report
- Donor solicitation letters (PDF download)
- Tax receipt generation (marks `TaxReceipt = 1` in database after generation)

### Lots

- Item list with lot assignment
- Item create, edit, delete
- Lot and category management
- Bidding sheet generation

### Auction

- Public browse by category

## Installation

1. Set up a web server with PHP and PDO MySQL support.
2. Copy `config/env.php.example` to `config/env.php` and fill in database credentials.
3. Place the PTA logo at `assets/Tiger-icon-hi-res.webp` (referenced in header and tax receipts).
4. Access via `/mi_proyecto/proyecto_php/silent_auction_merged/` (adjust `BASE_URL` in `includes/paths.php` if your deployment path differs).

## Usage

| Area    | URL         |
| ------- | ----------- |
| Home    | `index.php` |
| Donors  | `donors/`   |
| Lots    | `lots/`     |
| Auction | `auction/`  |

## Notes

- This merged app consolidates donor management and lot/auction features into a single codebase.
- `config/env.php` should not be committed (use the example file as a template).
