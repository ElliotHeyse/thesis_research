"""
test_donors.py — Donors feature group (D1-D4, D6, D7, D9, D10).

Assertions reference the fixed seed (see seeds.py). The reset_seed fixture
(conftest.py, autouse) restores that dataset before each test, so the create /
edit / delete writes below are isolated and order-independent.

Legacy notes encoded here:
- Create/edit are GET requests to edit_donor.php; the write runs server-side and
  302-redirects to index.php?success=... . The query carries DB-column names.
- The TaxReceipt checkbox is "on"/absent: TaxReceipt=on -> stored 1.
- delete_donor() has an APP-level guard (donor_has_items), not a DB FK.
- D10's receipt PDF is a POST (donorIds[]) that also flips TaxReceipt 0->1.
"""

import routes
import seeds
from helpers import fetch_text, fetch_raw, pdf_text, contains, absent


# --- D1 Donor list (Pattern 1: content) ----------------------------------
def test_d1_donor_list():
    text = fetch_text(routes.url("donor_list"))
    contains(text, seeds.DONOR_RECEIPTED["business"], seeds.DONOR_RECEIPTED["email"])


# --- D2 Create donor (GET write -> redirect -> list) ---------------------
def test_d2_create_donor():
    params = {
        "BusinessName": "QA Test Donor Co",
        "ContactName": "Quinn Tester",
        "ContactEmail": "quinn@qatestdonor.example",
        "ContactTitle": "Coordinator",
        "Address": "1 Test Way",
        "City": "Norfolk",
        "State": "VA",
        "ZipCode": "23500",
    }
    resp = fetch_raw(routes.url("donor_create", **params))
    assert resp.status_code in (301, 302), "create should redirect"
    assert "success=created" in resp.headers.get("Location", "")

    text = fetch_text(routes.url("donor_list"))
    contains(text, "QA Test Donor Co", "quinn@qatestdonor.example")


# --- D3 Edit donor (GET write; TaxReceipt checkbox path) -----------------
def test_d3_edit_donor(db):
    donor_id = 3  # Hampton Roads Fitness, TaxReceipt=0 in seed
    before = db.scalar("SELECT TaxReceipt FROM Donor WHERE DonorID=%s", (donor_id,))
    assert before == 0, "precondition: donor 3 starts un-receipted"

    params = {
        "BusinessName": "Hampton Roads Fitness",
        "ContactName": "Maria Lopez-Edited",
        "ContactEmail": "maria@hrfitness.com",
        "ContactTitle": "Manager",
        "Address": "450 Granby St",
        "City": "Norfolk",
        "State": "VA",
        "ZipCode": "23510",
        "TaxReceipt": "on",  # tick the manual receipt checkbox
    }
    resp = fetch_raw(routes.url("donor_edit", DonorID=donor_id, **params))
    assert resp.status_code in (301, 302)
    assert "success=updated" in resp.headers.get("Location", "")

    text = fetch_text(routes.url("donor_list"))
    contains(text, "Maria Lopez-Edited")

    after = db.scalar("SELECT TaxReceipt FROM Donor WHERE DonorID=%s", (donor_id,))
    assert after == 1, "ticking TaxReceipt must store 1"


# --- D4 Delete donor: no-items succeeds, with-items blocked --------------
def test_d4_delete_donor_without_items(db):
    donor_id = seeds.DONOR_NO_ITEMS["id"]  # 12, no items
    fetch_raw(routes.url("donor_delete", DonorID=donor_id, confirm=1))
    count = db.scalar("SELECT COUNT(*) FROM Donor WHERE DonorID=%s", (donor_id,))
    assert count == 0, "donor with no items must be deleted"


def test_d4_delete_donor_blocked_with_items(db):
    donor_id = seeds.DONOR_RECEIPTED["id"]  # 1, has items 21 & 26
    fetch_raw(routes.url("donor_delete", DonorID=donor_id, confirm=1))
    count = db.scalar("SELECT COUNT(*) FROM Donor WHERE DonorID=%s", (donor_id,))
    assert count == 1, "donor with items must NOT be deleted (app-level guard)"


# --- D6 Pending receipts (Pattern 2: presence AND absence) ---------------
def test_d6_pending_receipts():
    text = fetch_text(routes.url("pending_receipts"))
    # eligible donor: present with its total value (distinctive)
    contains(text, seeds.PENDING_SAMPLE["name"], seeds.PENDING_SAMPLE["total"])
    # a second eligible donor's total, to confirm the report aggregates per row
    contains(text, "Seven Bistro", "$335.00")
    # ineligible (already receipted) donor must be absent
    absent(text, seeds.DONOR_RECEIPTED["business"], seeds.DONOR_RECEIPTED["email"])


# --- D7 Donor letters — selection (Pattern 1) ----------------------------
def test_d7_letters_selection():
    text = fetch_text(routes.url("letters_select"))
    # selection lists ALL donors (eligible or not)
    contains(text, "Seven Bistro", seeds.DONOR_RECEIPTED["business"])


# --- D9 Tax receipts — selection (Pattern 2) -----------------------------
def test_d9_receipts_selection():
    text = fetch_text(routes.url("receipts_select"))
    # only eligible (items + no receipt) donors listed
    contains(text, "Seven Bistro")
    absent(text, seeds.DONOR_RECEIPTED["business"])


# --- D10 Tax receipt PDF + mark sent (Pattern 4: PDF + DB side-effect) ----
def test_d10_receipt_marks_sent(db):
    donor_id = seeds.RECEIPT_DONOR["id"]  # 14, eligible (TaxReceipt=0)
    before = db.scalar("SELECT TaxReceipt FROM Donor WHERE DonorID=%s", (donor_id,))
    assert before == 0, "precondition: donor should start un-receipted"

    text = pdf_text(
        routes.url("receipts_print"),
        method="POST",
        data={"donorIds[]": [donor_id]},
    )
    contains(text, seeds.RECEIPT_DONOR["business"], "335.00")

    after = db.scalar("SELECT TaxReceipt FROM Donor WHERE DonorID=%s", (donor_id,))
    assert after == 1, "fetching the receipt must flip TaxReceipt 0->1"
