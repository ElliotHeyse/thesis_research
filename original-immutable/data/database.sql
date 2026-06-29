-- Silent Auction database schema
-- Supports silent-auction-part1 (donors, items, tax receipts) and
-- silent-auction-part2 (categories, lots, bidders, auction display).
-- Table/column style follows .agent/rules/databaseformat.md

CREATE DATABASE IF NOT EXISTS silent_auction;
USE silent_auction;

CREATE TABLE Donor (DonorID INT NOT NULL AUTO_INCREMENT, BusinessName VARCHAR(75), ContactName VARCHAR(75), ContactEmail VARCHAR(200), ContactTitle VARCHAR(75), Address VARCHAR(75), City VARCHAR(30), State VARCHAR(2), ZipCode VARCHAR(5), TaxReceipt BOOLEAN, PRIMARY KEY (DonorID));

CREATE TABLE Bidder (BidderID INT NOT NULL AUTO_INCREMENT, Name VARCHAR(75), Address VARCHAR(75), CellNumber VARCHAR(10), HomeNumber VARCHAR(10), Email VARCHAR(200), Paid BOOLEAN, PRIMARY KEY (BidderID));

CREATE TABLE Category (CategoryID INT NOT NULL AUTO_INCREMENT, Description VARCHAR(75), PRIMARY KEY (CategoryID));

CREATE TABLE Lot (LotID INT NOT NULL AUTO_INCREMENT, Description VARCHAR(75), CategoryID INT, WinningBid DECIMAL(10,2), WinningBidder INT, Delivered BOOLEAN, Image VARCHAR(500), PRIMARY KEY (LotID));

CREATE TABLE Item (ItemID INT NOT NULL AUTO_INCREMENT, Description VARCHAR(75), RetailValue DECIMAL(10,2), DonorID INT, LotID INT, PRIMARY KEY (ItemID));

-- Optional: only needed for live self-service bidding (see Planificacion.txt)
CREATE TABLE Bid (LotID INT NOT NULL, BidderID INT NOT NULL, BidTime DATETIME, Bid DECIMAL(10,2), PRIMARY KEY (LotID, BidderID, BidTime));
