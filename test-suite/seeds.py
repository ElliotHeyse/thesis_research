"""
seeds.py — single source of truth for values from the fixed seed.

These mirror plan/phase1/data-model-documentation/seed.sql. The conftest
`reset_seed` fixture restores that exact dataset before every test, so any value
here is guaranteed present at test start. Keeping them in one module stops the
per-feature test files from drifting and makes the seed dependency explicit.

Pick distinguishing values for assertions: assert a COMBINATION (e.g. a business
name AND its email) so a lone substring can't match by accident.
"""

# --- Donors ----------------------------------------------------------------
# A receipted donor (TaxReceipt=1): present on the full list, ABSENT from the
# pending-receipts / tax-receipt-eligible views.
DONOR_RECEIPTED = {
    "id": 1,
    "business": "Norfolk Book Nook",
    "email": "sarah@norfolkbooknook.com",
    "tax_receipt": "Yes",
    "has_items": True,  # items 21, 26 -> delete is blocked
}

# A donor with NO items and TaxReceipt=1 -> the only safely deletable donor.
DONOR_NO_ITEMS = {
    "id": 12,
    "contact": "Thomas & Sue Brennan",  # BusinessName is NULL -> contact shown
}

# Donors eligible for a tax receipt: TaxReceipt=0 AND has >=1 item.
# (DonorID, BusinessName-or-contact, item count, total retail value as rendered)
ELIGIBLE_DONORS = [
    (3, "Hampton Roads Fitness", 2, "$185.00"),
    (5, "Coastal Spa & Salon", 3, "$260.00"),
    (7, "Blue Ocean Adventures", 3, "$265.00"),
    (8, "Jennifer Walsh", 1, "$55.00"),
    (10, "Old Dominion Auto Care", 3, "$190.00"),
    (11, "Waterside Yoga Studio", 1, "$80.00"),
    (13, "Ghent Frame & Gallery", 4, "$215.00"),
    (14, "Seven Bistro", 3, "$335.00"),
    (15, "Taylor PTA Parent Volunteer", 2, "$115.00"),
]
ELIGIBLE_DONOR_IDS = [d[0] for d in ELIGIBLE_DONORS]
INELIGIBLE_DONOR_IDS = [1, 2, 4, 6, 9, 12]  # receipted (1) or no items (12)

# A donor used to exercise the D6 pending-receipts row content.
PENDING_SAMPLE = {"name": "Hampton Roads Fitness", "items": "2", "total": "$185.00"}

# A donor used for the D10 receipt PDF + mark-sent side-effect.
RECEIPT_DONOR = {
    "id": 14,
    "business": "Seven Bistro",
    "contact": "Chef Antoine Dubois",
    "total": "$335.00",
}

# --- Items -----------------------------------------------------------------
# Item 1 belongs to Seven Bistro, retail 90.00, currently in lot 1.
ITEM_SAMPLE = {
    "id": 1,
    "retail": "90.00",
    "donor_business": "Seven Bistro",
    # bidding-sheet defaults: starting bid = 50% of retail, $5 increment, 15 rows
    "default_starting_bid": "$45.00",
    "default_increment": "$5.00",
}
# An item currently assigned to a lot (lot 1). Used for the I2 -1 -> NULL sentinel.
ITEM_ASSIGNED_ID = 1
# An unassigned item (LotID NULL) used for the reverse assign case.
ITEM_UNASSIGNED_ID = 21

# --- Lots ------------------------------------------------------------------
# Lot 1 has a winning bid + bidder + category; delivered.
LOT_SAMPLE = {
    "id": 1,
    "description": "Ghent Dinner for Two",
    "bid": "$85.00",
    "winner": "Patricia Moore",  # shown on the LIST (joins bidder)
    "delivered": "Yes",
    "category": "Dining & Entertainment",
    # Quirk: lot_details.php does NOT join the bidder, so the DETAIL view always
    # renders this regardless of the actual winner. This is the oracle.
    "details_winner": "No winner yet",
}
# An open lot (no winning bid/bidder) -> list renders "-" for those cells.
LOT_OPEN_ID = 5
# A lot with items, used to prove delete succeeds with no FK guard.
LOT_WITH_ITEMS_ID = 1

# --- Categories ------------------------------------------------------------
CATEGORY_SAMPLE = {"id": 1, "description": "Dining & Entertainment"}
# A category referenced by lots, used to prove delete succeeds with no FK guard.
CATEGORY_WITH_LOTS_ID = 1

# --- Auction ---------------------------------------------------------------
# Item 7 ("10-class yoga pass") is in lot 4 -> category 2 "Health & Wellness".
AUCTION_PRESENT_ITEM = "10-class yoga pass"
AUCTION_PRESENT_HEADING = "Health & Wellness"
# Item 22 has no lot -> CategoryID NULL -> never rendered on the auction page.
AUCTION_ABSENT_ITEM = "Dental cleaning certificate"
