-- =============================================================================
-- Silent Auction — dummy seed data
-- =============================================================================
-- Wipes existing rows then inserts fresh dummy data (see TRUNCATE block below).
--
-- Prerequisites:
--   1. Database `silent_auction` exists (see `./database.sql` file).
--   2. Tables: Donor, Bidder, Category, Lot, Item (and optionally Bid).
--
-- Notes:
--   - Table names match schema (PascalCase). The merged PHP app queries
--     lowercase names (donor, item, …); on Windows MySQL these resolve to the
--     same tables. On Linux, ensure lower_case_table_names or rename tables.
--   - TaxReceipt: 0 = not sent, 1 = sent. Donors 3, 7, 11 have items but no
--     receipt yet (good for testing pending receipts / tax receipt flow).
--   - Items 1–8, 22–25 have no LotID (appear in Lots → Items for assignment).
--   - Lots 1–4 have winning bidders; lots 5–8 are open / undelivered.
-- =============================================================================

USE silent_auction;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Bid;
TRUNCATE TABLE Item;
TRUNCATE TABLE Lot;
TRUNCATE TABLE Category;
TRUNCATE TABLE Bidder;
TRUNCATE TABLE Donor;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- Donors (15)
-- -----------------------------------------------------------------------------
INSERT INTO Donor (DonorID, BusinessName, ContactName, ContactEmail, ContactTitle, Address, City, State, ZipCode, TaxReceipt) VALUES
(1,  'Norfolk Book Nook',           'Sarah Mitchell',      'sarah@norfolkbooknook.com',    'Owner',              '1200 Colley Ave',           'Norfolk',     'VA', '23507', 1),
(2,  'Taylor Family Dental',        'Dr. James Chen',      'jchen@taylorfamilydental.com', 'Dentist',            '800 W 21st St',             'Norfolk',     'VA', '23517', 1),
(3,  'Hampton Roads Fitness',       'Maria Lopez',         'maria@hrfitness.com',          'Manager',            '450 Granby St',             'Norfolk',     'VA', '23510', 0),
(4,  NULL,                          'Robert & Linda Hayes','hayes.family@gmail.com',       NULL,                 '221 Maplewood Dr',          'Norfolk',     'VA', '23505', 1),
(5,  'Coastal Spa & Salon',         'Amanda Wright',       'amanda@coastalspa.com',        'Director',           '300 Monticello Ave',        'Norfolk',     'VA', '23510', 0),
(6,  'Ghent Pizza Company',         'Tony Russo',          'tony@ghentpizza.com',          'Owner',              '1900 Llewellyn Ave',        'Norfolk',     'VA', '23517', 1),
(7,  'Blue Ocean Adventures',       'Kevin Park',          'kevin@blueoceanadv.com',       'Captain',            '100 Waterside Dr',          'Norfolk',     'VA', '23510', 0),
(8,  NULL,                          'Jennifer Walsh',      'jwalsh@yahoo.com',             NULL,                 '88 Riverview Ter',          'Norfolk',     'VA', '23503', 0),
(9,  'MacArthur Center Jewelers',   'David Kim',           'dkim@macjewelers.com',         'Store Manager',      '300 Monticello Ave Ste 210','Norfolk',     'VA', '23510', 1),
(10, 'Old Dominion Auto Care',      'Marcus Johnson',      'marcus@odautocare.com',        'Service Manager',    '5200 E Virginia Beach Blvd', 'Norfolk',     'VA', '23502', 0),
(11, 'Waterside Yoga Studio',       'Elena Vasquez',       'elena@watersideyoga.com',      'Instructor',         '150 Main St',               'Norfolk',     'VA', '23510', 0),
(12, NULL,                          'Thomas & Sue Brennan','tsbrennan@outlook.com',        NULL,                 '14 Oak Lane',               'Chesapeake',  'VA', '23320', 1),
(13, 'Ghent Frame & Gallery',       'Paula Nguyen',        'paula@ghentframe.com',         'Owner',              '2100 Colonial Ave',          'Norfolk',     'VA', '23517', 0),
(14, 'Seven Bistro',                'Chef Antoine Dubois', 'chef@sevenbistro.com',         'Executive Chef',     '111 W Tazewell St',         'Norfolk',     'VA', '23510', 0),
(15, 'Taylor PTA Parent Volunteer', 'Michelle Foster',     'mfoster.taylorpta@gmail.com',  'Volunteer',          '1122 W Princess Anne Rd',   'Norfolk',     'VA', '23507', 0);

-- -----------------------------------------------------------------------------
-- Bidders (10)
-- -----------------------------------------------------------------------------
INSERT INTO Bidder (BidderID, Name, Address, CellNumber, HomeNumber, Email, Paid) VALUES
(1,  'Chris Anderson',      '45 Brambleton Ave',      '7575550101', '7575550102', 'c.anderson@email.com',   1),
(2,  'Patricia Moore',      '902 Redgate Ave',        '7575550201', NULL,         'pmoore@email.com',       1),
(3,  'William Turner',      '77 Lafayette Blvd',      '7575550301', '7575550302', 'wturner@email.com',      0),
(4,  'Angela Brooks',       '12 Mowbray Arch',        '7575550401', NULL,         'abrooks@email.com',      1),
(5,  'Michael Scott',       '400 Boush St',           '7575550501', '7575550502', 'mscott@email.com',       0),
(6,  'Rachel Green',        '55 W 44th St',           '7575550601', NULL,         'rgreen@email.com',       1),
(7,  'Daniel Harris',       '300 E Main St',          '7575550701', '7575550702', 'dharris@email.com',      0),
(8,  'Laura Martinez',      '18 Stockley Gardens',    '7575550801', NULL,         'lmartinez@email.com',    1),
(9,  'Steven Clark',        '600 Church St',          '7575550901', '7575550902', 'sclark@email.com',       0),
(10, 'Karen Phillips',      '220 Larchmont Rd',       '7575551001', NULL,         'kphillips@email.com',    0);

-- -----------------------------------------------------------------------------
-- Categories (6)
-- -----------------------------------------------------------------------------
INSERT INTO Category (CategoryID, Description) VALUES
(1, 'Dining & Entertainment'),
(2, 'Health & Wellness'),
(3, 'Family Fun'),
(4, 'Home & Garden'),
(5, 'Sports & Outdoors'),
(6, 'Services & Lessons');

-- -----------------------------------------------------------------------------
-- Lots (12)
-- -----------------------------------------------------------------------------
INSERT INTO Lot (LotID, Description, CategoryID, WinningBid, WinningBidder, Delivered, Image) VALUES
(1,  'Ghent Dinner for Two',              1, 85.00,  2, 1, NULL),
(2,  'Family Pizza Night Package',        1, 45.00,  4, 1, NULL),
(3,  'Spa Day Retreat',                   2, 120.00, 6, 0, NULL),
(4,  'Yoga Class Bundle (10 sessions)',   2, 75.00,  8, 1, NULL),
(5,  'Kayak Tour for Two',                5, NULL,   NULL, 0, NULL),
(6,  'Kids Art & Craft Workshop',         3, NULL,   NULL, 0, NULL),
(7,  'Professional Portrait Session',     6, 55.00,  1, 0, NULL),
(8,  'Oil Change & Detail Package',       6, NULL,   NULL, 0, NULL),
(9,  'Jewelry Gift Certificate',          1, 150.00, 2, 1, NULL),
(10, 'Fitness Starter Kit',               2, NULL,   NULL, 0, NULL),
(11, 'Garden Planter Set',                4, 35.00,  3, 0, NULL),
(12, 'Private Chef Dinner at Home',       1, 200.00, 6, 0, NULL);

-- -----------------------------------------------------------------------------
-- Items (30)
-- Some unassigned (LotID NULL) for testing lot assignment on Lots → Items
-- -----------------------------------------------------------------------------
INSERT INTO Item (ItemID, Description, RetailValue, DonorID, LotID) VALUES
-- Lot 1: Ghent Dinner for Two
(1,  'Gift card — Seven Bistro (dinner for 2)',     90.00,  14, 1),
(2,  'Wine pairing add-on certificate',            25.00,  14, 1),

-- Lot 2: Family Pizza Night
(3,  'Large pizza weekly for a month',             48.00,  6,  2),
(4,  '2-liter soda party pack',                    12.00,  6,  2),

-- Lot 3: Spa Day
(5,  'Full-day spa pass',                          130.00, 5,  3),
(6,  'Aromatherapy upgrade',                       20.00,  5,  3),

-- Lot 4: Yoga bundle
(7,  '10-class yoga pass',                         80.00,  11, 4),

-- Lot 5: Kayak (open lot)
(8,  '2-hour kayak rental for two',                70.00,  7,  5),
(9,  'Waterproof phone pouch (2)',                 15.00,  7,  5),

-- Lot 6: Kids workshop
(10, 'Saturday kids art workshop',                 40.00,  13, 6),
(11, 'Art supplies gift basket',                   30.00,  13, 6),

-- Lot 7: Portrait session
(12, '1-hour studio portrait session',             60.00,  13, 7),

-- Lot 8: Auto care
(13, 'Synthetic oil change',                       55.00,  10, 8),
(14, 'Interior detail service',                    75.00,  10, 8),

-- Lot 9: Jewelry
(15, '$150 jewelry store credit',                  150.00, 9,  9),

-- Lot 10: Fitness
(16, '3-month gym membership',                     120.00, 3,  10),
(17, 'Personal training session (1 hr)',           65.00,  3,  10),

-- Lot 11: Garden
(18, 'Ceramic planter trio',                       40.00,  4,  11),
(19, 'Herb garden starter kit',                    25.00,  4,  11),

-- Lot 12: Private chef
(20, 'In-home chef dinner for 4',                  220.00, 14, 12),

-- Unassigned items (assign via Lots → Items)
(21, 'Signed children''s book set (Taylor library)', 45.00,  1,  NULL),
(22, 'Dental cleaning certificate',                95.00,  2,  NULL),
(23, 'Family board game bundle',                   55.00,  8,  NULL),
(24, 'PTA spirit wear gift basket',                35.00,  15, NULL),
(25, 'Handmade quilt (parent volunteer)',          80.00,  15, NULL),
(26, 'Bookstore $50 gift card',                     50.00,  1,  NULL),
(27, 'Couples massage (60 min)',                  110.00,  5,  NULL),
(28, 'Sunset sailing excursion',                   180.00,  7,  NULL),
(29, 'Custom framing — up to 16x20',               85.00,  13, NULL),
(30, 'Auto detailing — exterior only',             60.00,  10, NULL);

-- -----------------------------------------------------------------------------
-- Bids (optional — sample live-bid history on lots 1, 3, 9)
-- -----------------------------------------------------------------------------
INSERT INTO Bid (LotID, BidderID, BidTime, Bid) VALUES
(1, 1, '2026-05-15 18:05:00', 50.00),
(1, 2, '2026-05-15 18:12:00', 65.00),
(1, 4, '2026-05-15 18:20:00', 75.00),
(1, 2, '2026-05-15 18:28:00', 85.00),
(3, 6, '2026-05-15 19:00:00', 90.00),
(3, 8, '2026-05-15 19:08:00', 105.00),
(3, 6, '2026-05-15 19:15:00', 120.00),
(9, 2, '2026-05-16 11:30:00', 100.00),
(9, 4, '2026-05-16 11:45:00', 125.00),
(9, 2, '2026-05-16 12:00:00', 150.00);

-- -----------------------------------------------------------------------------
-- Reset AUTO_INCREMENT after explicit IDs (if tables were empty)
-- -----------------------------------------------------------------------------
ALTER TABLE Donor    AUTO_INCREMENT = 16;
ALTER TABLE Bidder   AUTO_INCREMENT = 11;
ALTER TABLE Category AUTO_INCREMENT = 7;
ALTER TABLE Lot      AUTO_INCREMENT = 13;
ALTER TABLE Item     AUTO_INCREMENT = 31;

-- -----------------------------------------------------------------------------
-- Quick verification queries (optional — run after insert)
-- -----------------------------------------------------------------------------
-- SELECT COUNT(*) AS donors FROM Donor;
-- SELECT COUNT(*) AS pending_receipt_donors FROM Donor d
--   INNER JOIN Item i ON d.DonorID = i.DonorID
--   WHERE d.TaxReceipt = 0 GROUP BY d.DonorID;
-- SELECT ItemID, Description, LotID FROM Item WHERE LotID IS NULL;
