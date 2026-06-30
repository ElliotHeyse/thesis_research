"""
test_categories.py — Categories feature group (C1-C4).

Straightforward CRUD asserted on list state. Create/edit are GET writes to
edit_category.php (trigger key: Description) that redirect to categories.php.
delete_category() has no guard and the schema has no FK, so a category deletes
even while lots still reference it (C4).
"""

import routes
import seeds
from helpers import fetch_text, fetch_raw, contains


# --- C1 Category list (Pattern 1: content) -------------------------------
def test_c1_category_list():
    text = fetch_text(routes.url("category_list"))
    contains(text, seeds.CATEGORY_SAMPLE["description"])


# --- C2 Create category (GET write -> list) ------------------------------
def test_c2_create_category():
    fetch_raw(routes.url("category_create", Description="QA Test Category"))
    text = fetch_text(routes.url("category_list"))
    contains(text, "QA Test Category")


# --- C3 Edit category (GET write -> list) --------------------------------
def test_c3_edit_category():
    fetch_raw(routes.url("category_edit", CategoryID=1, Description="Edited Category QA"))
    text = fetch_text(routes.url("category_list"))
    contains(text, "Edited Category QA")


# --- C4 Delete category (deletes even when referenced by lots; no FK) -----
def test_c4_delete_category(db):
    category_id = seeds.CATEGORY_WITH_LOTS_ID  # category 1, referenced by lots
    fetch_raw(routes.url("category_delete", CategoryID=category_id, confirm=1))
    count = db.scalar(
        "SELECT COUNT(*) FROM Category WHERE CategoryID=%s", (category_id,)
    )
    assert count == 0, "legacy deletes a category even if lots reference it (no FK)"
