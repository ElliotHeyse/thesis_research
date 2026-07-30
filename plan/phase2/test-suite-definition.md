# Correctness test suite — definition

**Purpose:** Define which in-scope features get automated vs manual coverage so functional equivalence (Decision 2.3) can be judged identically across all 6 migration cells at R0 and R1.

**Related:** [research-project-plan.md §2 Decision 2.3](../research-project-plan.md#decision-23--definition-of-functional-equivalence-resolved--phase-2) · [feature-inventory.md](../phase1/feature-inventory.md) · [seed.sql](../phase1/data-model-documentation/seed.sql) · [php-migration-friction.md](../phase1/php-migration-friction.md) · [methodology-protocols.md](./methodology-protocols.md)

**Scope:** 38 end-user features in [feature-inventory.md](../phase1/feature-inventory.md). PHPUnit dev tests and platform config (P1–P5) are setup checks, not suite cases. **Suite-green** = all automated cases below pass **and** manual checklist complete.

**Oracle:** Legacy PHP app on [seed.sql](../phase1/data-model-documentation/seed.sql); migrated stacks must match legacy observable behaviour (including known quirks).

**Tech stack for testing:** Python + pytest + requests + BeautifulSoup + pdfplumber + a thin DB driver

**Status:** FROZEN — Phase 2. Runnable implementation → next activity (“Build test suite against legacy PHP”).

---

## Automated coverage (HTTP + normalized-HTML / PDF-text, against fixed seed)

### Donors

- D1 Donor list — seeded donors appear with expected fields; tax-receipt column reflects seeded TaxReceipt state.
- D2 Create donor — GET the create URL with valid params → donor appears on list; assert success-flash state and redirect target.
- D3 Edit donor — edit seeded donor → changed values appear; the manual-TaxReceipt checkbox path reflects in state.
- D4 Delete donor — two cases: delete a donor with no items → gone; attempt delete on a donor with seeded items → blocked, record persists (the FK guard — high-value).
- D6 Pending receipts report — only donors with items and TaxReceipt=0 appear; item count and total value match seeded data; ineligible donors absent (presence + absence).
- D7 Donor letters — selection — selection page lists expected donors.
- D9 Tax receipts — selection — only eligible donors (items, no receipt yet) listed; ineligible absent.
- D10 Tax receipts — PDF + mark sent — fetch receipt → assert itemized donation values in PDF text; assert DB side-effect (TaxReceipt flips 0→1) via direct DB check before/after. This is your one read-path-with-side-effect; the before/after DB assertion is the clean way to catch it. PDF visual fidelity.

### Items

- I1 Item list — seeded items appear with donor name, lot, and the bidding-sheet link target.
- I2 Bulk lot assignment — POST batch update → assert each item's lot changed; specifically assert the -1 → NULL sentinel (item set to "no lot" persists as null/unassigned on re-read). Highest-risk dynamic-SQL feature; assert it directly.
- I3 Create item — valid create (description, retail, required donor, optional lot) → appears on list.
- I4 Edit item — change reflected on re-read.
- I5 Delete item — confirm → record gone.
- I6 Bidding sheet PDF — fetch with no params → assert defaults in PDF text (50% retail / $5 / 15 rows); fetch with explicit startingBid/bidIncrement/rows → assert those values. Pure input→output, ideal for automation. PDF visual fidelity.

### Lots

- L1 Lot list — seeded lots show winning bid, winner name, delivered flag, category. (Note the inventory's drift flag: get_lot may not join bidder, so winner name may be blank — assert whatever the legacy app actually outputs, since that's your equivalence baseline. The legacy behavior is the oracle, bugs included.)
- L2 Create lot — appears on list. (L2 row was truncated in the inventory but follows the create pattern.)
- L3 Edit lot — change reflected.
- L4 Delete lot — record gone (no FK guard in legacy — assert it deletes even with items, matching legacy).
- L5 Lot details view — description, bid, winner, delivered, category render with seeded values.

### Categories

- C1 Category list — seeded categories with id/description.
- C2 Create category, C3 Edit category, C4 Delete category — straightforward CRUD, assert on list state.

### Auction

- A1 Auction browse by category — items grouped under correct category headings (the lot→category join); assert each seeded item appears under its expected heading and not elsewhere. Good join-correctness check.

---

That's 27 features with direct automated coverage (D1–D4, D6, D7-list, D9, D10, I1–I6, L1–L5, C1–C4, A1) — the entire functional core, including three of four high-risk H-complexity features (D10, I2, I6) at the content level.

## Manual testing (in browser)

### Presentation / cross-cutting UI — verify by eye, indirectly exercised by the automated pages:

- S2 Page layout, S3 Main nav (active highlighting), S4 Flash rendering, S5 Global styling, S8 UI primitives — these are how pages look, not what data they show. Active-section highlighting (S3) and flash appearance (S4) are presentational; your automated tests assert the flash state via redirect/content, but whether it renders styled correctly is manual.
- S1 Home hub — trivial; manual glance that the three module links are present and go where expected.

### Genuinely manual (content automation can't fully cover):

- D8 Donor letters — PDF — multi-page solicitation letters. You can auto-assert key text (donor name, body content) in PDF text, but page-breaking and per-donor multi-page layout is the actual risk here and is visual — manual. (So D8 is partially automated, fully verified manually.)
- The PDF visual fidelity for D10 and I6 — text values are automated; whether the PDF looks right (logo, layout, the local logo-path risk flagged in your notes) is a manual glance.
- D7 letters POST handoff — the selection→print POST flow: assert the selection page automatically, but walk the actual print trigger manually if the POST returns a PDF stream rather than a navigable page.

---

Config/platform (P1–P5) — not test cases; verified operationally (does it connect, does the base URL resolve, is the logo present). Treat as setup checklist, not suite.
