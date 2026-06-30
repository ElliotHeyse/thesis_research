"""
routes.py — the per-stack URL/param mapping layer.

Separates "what to request" (differs per stack) from "what must be true"
(the assertion, stack-agnostic). Tests ask this module for a URL; they never
hard-code one. When a migrated stack restructures routing (e.g. PHP
`donors/edit_donor.php?DonorID=5` -> Next.js `/donors/5/edit`), record it HERE.
That restructuring is normalized away, NOT scored as a correctness failure.

Only the legacy `php` column is filled in. Add a `nextjs` lambda per route once
you see how that cell structured its routes; `url()` raises a helpful error if a
mapping is missing for the active TARGET.

Legacy specifics worth remembering (the example stubs used to get these wrong):
- ID params are PascalCase: `DonorID`, `ItemID`, `LotID`, `CategoryID`.
- Creates/edits are GET requests to `edit_*.php`; the write happens server-side
  and 302-redirects to the list. The query string carries DB-column field names.
- Only two real POSTs: `receipts_print.php` (donorIds[]) and `items.php` (bulk
  lot assignment via save_lot_changes + LotID[<itemId>]).
"""

import os

TARGET = os.environ.get("TARGET", "php")

BASE_URL = {
    "php": os.environ.get("PHP_BASE_URL", "http://localhost:8080"),
    "nextjs": os.environ.get("NEXTJS_BASE_URL", "http://localhost:3000"),
}[TARGET]

# Each route is a callable(**params) -> path string, keyed per stack.
# Keeping these as lambdas lets param placement differ (query vs path segment)
# when a migrated stack is added later.
_ROUTES = {
    # --- Donors -----------------------------------------------------------
    "donor_list": {"php": lambda: "/donors/index.php"},
    "donor_create": {
        # GET write; trigger key is ContactName or BusinessName.
        "php": lambda **p: f"/donors/edit_donor.php?{_qs(p)}",
    },
    "donor_edit": {
        "php": lambda DonorID, **p: f"/donors/edit_donor.php?DonorID={DonorID}&{_qs(p)}",
    },
    "donor_delete": {
        "php": lambda DonorID, **p: f"/donors/delete_donor.php?DonorID={DonorID}&{_qs(p)}",
    },
    "pending_receipts": {"php": lambda: "/donors/pending_receipts.php"},
    "letters_select": {"php": lambda: "/donors/letters.php"},
    "receipts_select": {"php": lambda: "/donors/receipts.php"},
    "receipts_print": {
        # POST target; body carries donorIds[] (array). GET -> redirect.
        "php": lambda: "/donors/receipts_print.php",
    },
    # --- Items ------------------------------------------------------------
    "item_list": {"php": lambda: "/lots/items.php"},
    "items_bulk": {
        # POST target; body carries save_lot_changes + LotID[<itemId>]=<newLotId>.
        "php": lambda: "/lots/items.php",
    },
    "item_create": {
        "php": lambda **p: f"/lots/edit_item.php?{_qs(p)}",
    },
    "item_edit": {
        "php": lambda ItemID, **p: f"/lots/edit_item.php?ItemID={ItemID}&{_qs(p)}",
    },
    "item_delete": {
        "php": lambda ItemID, **p: f"/lots/delete_item.php?ItemID={ItemID}&{_qs(p)}",
    },
    "bidding_sheet_pdf": {
        "php": lambda ItemID, **p: f"/lots/bidding_sheet.php?ItemID={ItemID}&{_qs(p)}",
    },
    # --- Lots -------------------------------------------------------------
    "lot_list": {"php": lambda: "/lots/lots.php"},
    "lot_create": {
        "php": lambda **p: f"/lots/edit_lot.php?{_qs(p)}",
    },
    "lot_edit": {
        "php": lambda LotID, **p: f"/lots/edit_lot.php?LotID={LotID}&{_qs(p)}",
    },
    "lot_delete": {
        "php": lambda LotID, **p: f"/lots/delete_lot.php?LotID={LotID}&{_qs(p)}",
    },
    "lot_details": {
        "php": lambda LotID: f"/lots/lot_details.php?LotID={LotID}",
    },
    # --- Categories -------------------------------------------------------
    "category_list": {"php": lambda: "/lots/categories.php"},
    "category_create": {
        "php": lambda **p: f"/lots/edit_category.php?{_qs(p)}",
    },
    "category_edit": {
        "php": lambda CategoryID, **p: f"/lots/edit_category.php?CategoryID={CategoryID}&{_qs(p)}",
    },
    "category_delete": {
        "php": lambda CategoryID, **p: f"/lots/delete_category.php?CategoryID={CategoryID}&{_qs(p)}",
    },
    # --- Auction ----------------------------------------------------------
    "auction_browse": {"php": lambda: "/auction/index.php"},
}


def _qs(params: dict) -> str:
    from urllib.parse import urlencode

    return urlencode({k: v for k, v in params.items() if v is not None})


def url(name: str, **params) -> str:
    """Resolve a logical route name + params to a full URL for the active TARGET."""
    try:
        builder = _ROUTES[name][TARGET]
    except KeyError as e:
        raise KeyError(
            f"No route mapping for '{name}' on TARGET='{TARGET}'. "
            f"Add it to routes.py (this is expected when a stack restructures URLs)."
        ) from e
    path = builder(**params)
    return BASE_URL.rstrip("/") + path
