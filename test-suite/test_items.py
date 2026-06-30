"""
test_items.py — Items feature group (I1-I6).

Legacy notes encoded here:
- The item list is one page; the lot column is a <select> and each row links to
  bidding_sheet.php?ItemID=<id>.
- I2 bulk lot assignment is a POST to items.php with save_lot_changes set and
  LotID[<itemId>]=<newLotId>. The sentinel newLotId == -1 maps to SQL NULL
  (item set to "no lot"). This is the highest-risk dynamic-SQL feature.
- Create/edit are GET writes to edit_item.php (trigger key: Description), donor
  is required; LotID "NULL" means unassigned.
- Bidding sheet is pure input->output: default starting bid = 50% retail,
  default increment $5, default 15 rows; explicit params override.
"""

import routes
import seeds
from helpers import fetch_text, fetch_raw, pdf_text, contains


# --- I1 Item list (Pattern 1: content + link target) ---------------------
def test_i1_item_list():
    text = fetch_text(routes.url("item_list"))
    contains(text, seeds.ITEM_SAMPLE["retail"], seeds.ITEM_SAMPLE["donor_business"])
    # the bidding-sheet link target lives in the markup (stripped from text)
    raw = fetch_raw(routes.url("item_list")).text
    assert f"bidding_sheet.php?ItemID={seeds.ITEM_SAMPLE['id']}" in raw


# --- I2 Bulk lot assignment (Pattern 4: POST + DB re-read) ---------------
def test_i2_bulk_assign_to_null_sentinel(db):
    item_id = seeds.ITEM_ASSIGNED_ID  # item 1, currently in lot 1
    before = db.scalar("SELECT LotID FROM Item WHERE ItemID=%s", (item_id,))
    assert before == 1, "precondition: item 1 starts in lot 1"

    fetch_raw(
        routes.url("items_bulk"),
        method="POST",
        data={"save_lot_changes": "1", f"LotID[{item_id}]": "-1"},
    )
    after = db.scalar("SELECT LotID FROM Item WHERE ItemID=%s", (item_id,))
    assert after is None, "newLotID -1 must persist as SQL NULL (no-lot sentinel)"


def test_i2_bulk_assign_to_lot(db):
    item_id = seeds.ITEM_UNASSIGNED_ID  # item 21, currently unassigned (NULL)
    before = db.scalar("SELECT LotID FROM Item WHERE ItemID=%s", (item_id,))
    assert before is None, "precondition: item 21 starts unassigned"

    fetch_raw(
        routes.url("items_bulk"),
        method="POST",
        data={"save_lot_changes": "1", f"LotID[{item_id}]": "5"},
    )
    after = db.scalar("SELECT LotID FROM Item WHERE ItemID=%s", (item_id,))
    assert after == 5, "assigning a lot must persist the new LotID"


# --- I3 Create item (GET write -> list) ----------------------------------
def test_i3_create_item():
    params = {
        "Description": "QA Test Item Widget",
        "RetailValue": "12.34",
        "DonorID": 1,
        "LotID": "NULL",
    }
    resp = fetch_raw(routes.url("item_create", **params))
    assert resp.status_code in (301, 302)
    assert "success=created" in resp.headers.get("Location", "")

    text = fetch_text(routes.url("item_list"))
    contains(text, "QA Test Item Widget", "12.34")


# --- I4 Edit item (GET write -> list) ------------------------------------
def test_i4_edit_item():
    item_id = 1
    params = {
        "Description": "Edited Item Desc QA",
        "RetailValue": "90.00",
        "DonorID": 14,
        "LotID": "1",
    }
    resp = fetch_raw(routes.url("item_edit", ItemID=item_id, **params))
    assert resp.status_code in (301, 302)
    assert "success=updated" in resp.headers.get("Location", "")

    text = fetch_text(routes.url("item_list"))
    contains(text, "Edited Item Desc QA")


# --- I5 Delete item (GET confirm -> gone) --------------------------------
def test_i5_delete_item(db):
    item_id = 1
    fetch_raw(routes.url("item_delete", ItemID=item_id, confirm=1))
    count = db.scalar("SELECT COUNT(*) FROM Item WHERE ItemID=%s", (item_id,))
    assert count == 0, "item must be deleted (no guard on items)"


# --- I6 Bidding sheet PDF (Pattern 3: PDF text, input->output) ------------
def test_i6_bidding_sheet_defaults():
    text = pdf_text(routes.url("bidding_sheet_pdf", ItemID=seeds.ITEM_SAMPLE["id"]))
    # retail 90.00 -> 50% default starting bid 45.00; default increment $5.00
    contains(text, seeds.ITEM_SAMPLE["default_starting_bid"])
    contains(text, seeds.ITEM_SAMPLE["default_increment"])


def test_i6_bidding_sheet_explicit_params():
    text = pdf_text(
        routes.url(
            "bidding_sheet_pdf",
            ItemID=seeds.ITEM_SAMPLE["id"],
            startingBid=20,
            bidIncrement=2,
            rows=10,
        )
    )
    contains(text, "$20.00", "$2.00")
