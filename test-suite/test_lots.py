"""
test_lots.py — Lots feature group (L1-L5).

Legacy notes encoded here:
- The lot LIST (get_lots) joins the bidder, so the winner NAME shows there.
- The lot DETAIL view (lot_details.php -> get_lot) does NOT join the bidder, so
  it always renders "No winner yet" regardless of the real winner. That drift is
  the equivalence oracle, asserted verbatim in L5.
- add_lot()/update_lot() echo debug output before redirecting, so the create/edit
  responses are not clean 302s; we assert the persisted state via a list re-read
  rather than the redirect.
- delete_lot() has no guard and the schema has no FK, so a lot deletes even when
  it still has items (L4).
"""

import routes
import seeds
from helpers import fetch_text, fetch_raw, contains


# --- L1 Lot list (Pattern 1: content; winner name present) ---------------
def test_l1_lot_list():
    text = fetch_text(routes.url("lot_list"))
    lot = seeds.LOT_SAMPLE
    contains(text, lot["description"], lot["bid"], lot["winner"], lot["category"])
    # an open lot (no winning bid/bidder) still appears
    contains(text, "Kayak Tour for Two")


# --- L2 Create lot (GET write -> list) -----------------------------------
def test_l2_create_lot():
    params = {
        "Description": "QA Test Lot Bundle",
        "CategoryID": 1,
        "HighestBid": "",
        "BidderID": "",
    }
    fetch_raw(routes.url("lot_create", **params))
    text = fetch_text(routes.url("lot_list"))
    contains(text, "QA Test Lot Bundle")


# --- L3 Edit lot (GET write -> list) -------------------------------------
def test_l3_edit_lot():
    params = {
        "Description": "Edited Lot Desc QA",
        "CategoryID": 1,
        "HighestBid": "85",
        "BidderID": 2,
        "Delivered": "on",
    }
    fetch_raw(routes.url("lot_edit", LotID=1, **params))
    text = fetch_text(routes.url("lot_list"))
    contains(text, "Edited Lot Desc QA")


# --- L4 Delete lot (deletes even with items; no FK guard) -----------------
def test_l4_delete_lot_with_items(db):
    lot_id = seeds.LOT_WITH_ITEMS_ID  # lot 1, has items 1 & 2
    fetch_raw(routes.url("lot_delete", LotID=lot_id, confirm=1))
    count = db.scalar("SELECT COUNT(*) FROM Lot WHERE LotID=%s", (lot_id,))
    assert count == 0, "legacy deletes a lot even with items (no FK guard)"


# --- L5 Lot details view (Pattern 1; encodes the no-bidder-join quirk) ----
def test_l5_lot_details():
    text = fetch_text(routes.url("lot_details", LotID=seeds.LOT_SAMPLE["id"]))
    lot = seeds.LOT_SAMPLE
    contains(text, lot["description"], lot["bid"], lot["category"])
    # the detail view never resolves the winner name -> always this literal
    contains(text, lot["details_winner"])
