"""
test_auction.py — Auction feature group (A1).

A1 browse-by-category exercises the item -> lot -> category join. Items appear
grouped under their category heading; items with no lot have a NULL CategoryID
and are not rendered at all. We assert both a grouped item + its heading
(presence) and an unassigned item (absence), which is the join-correctness check.
"""

import routes
import seeds
from helpers import fetch_text, contains, absent


# --- A1 Auction browse by category (Pattern 1 + absence) -----------------
def test_a1_auction_browse_by_category():
    text = fetch_text(routes.url("auction_browse"))
    # a lotted item shows under its category heading
    contains(text, seeds.AUCTION_PRESENT_HEADING, seeds.AUCTION_PRESENT_ITEM)
    # an unassigned item (no lot -> NULL category) is absent from the auction
    absent(text, seeds.AUCTION_ABSENT_ITEM)
