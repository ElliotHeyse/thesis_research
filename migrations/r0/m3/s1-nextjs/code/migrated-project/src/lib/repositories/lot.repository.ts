import { execute, query, queryOne } from "@/lib/db/pool";
import type { Bidder, Lot, LotInput } from "@/lib/types";

export async function findAllLots(): Promise<Lot[]> {
  return query<Lot>(
    `SELECT l.LotID, l.Description, l.WinningBid, w.Name AS Winner, l.Delivered,
            c.Description AS Category
     FROM Lot l
     LEFT JOIN Bidder w ON l.WinningBidder = w.BidderID
     LEFT JOIN Category c ON l.CategoryID = c.CategoryID
     ORDER BY l.LotID ASC`,
  );
}

export async function findLotById(lotId: number): Promise<Lot | null> {
  return queryOne<Lot>(
    `SELECT LotID, Description, CategoryID, WinningBid, WinningBidder, Delivered, Image
     FROM Lot WHERE LotID = ?`,
    [lotId],
  );
}

export async function findAllBidders(): Promise<Bidder[]> {
  return query<Bidder>("SELECT BidderID, Name FROM Bidder");
}

export async function createLot(values: LotInput): Promise<void> {
  await execute(
    `INSERT INTO Lot (Description, CategoryID, WinningBid, WinningBidder, Delivered, Image)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      values.description,
      values.categoryID ?? null,
      values.winningBid ?? null,
      values.winningBidder ?? null,
      values.delivered ? 1 : 0,
      values.image ?? null,
    ],
  );
}

export async function updateLot(lotId: number, values: LotInput): Promise<void> {
  await execute(
    `UPDATE Lot SET Description = ?, CategoryID = ?, WinningBid = ?, WinningBidder = ?,
            Delivered = ?, Image = ?
     WHERE LotID = ?`,
    [
      values.description,
      values.categoryID ?? null,
      values.winningBid ?? null,
      values.winningBidder ?? null,
      values.delivered ? 1 : 0,
      values.image ?? null,
      lotId,
    ],
  );
}

export async function deleteLot(lotId: number): Promise<void> {
  await execute("DELETE FROM Lot WHERE LotID = ?", [lotId]);
}
