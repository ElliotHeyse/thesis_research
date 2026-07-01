import { query, execute } from "@/lib/db";
import type {
  Bidder,
  Lot,
  LotDetail,
  LotFormValues,
  LotListRow,
} from "@/lib/types";
import { RowDataPacket } from "mysql2/promise";

export async function getLots(): Promise<LotListRow[]> {
  return query<LotListRow & RowDataPacket>(
    `SELECT l.LotID, l.Description, l.WinningBid, w.Name AS Winner, l.Delivered,
            c.Description AS Category
     FROM lot l
     LEFT JOIN bidder w ON l.WinningBidder = w.BidderID
     LEFT JOIN category c ON l.CategoryID = c.CategoryID
     ORDER BY l.LotID ASC`,
  );
}

export async function getLot(lotId: number): Promise<Lot | null> {
  const rows = await query<Lot & RowDataPacket>(
    `SELECT LotID, Description, CategoryID, WinningBid, WinningBidder, Delivered, Image
     FROM lot WHERE LotID = ?`,
    [lotId],
  );
  return rows[0] ?? null;
}

export async function getLotDetail(lotId: number): Promise<LotDetail | null> {
  const rows = await query<LotDetail & RowDataPacket>(
    `SELECT l.LotID, l.Description, l.CategoryID, l.WinningBid, l.WinningBidder,
            l.Delivered, l.Image, w.Name AS Winner, c.Description AS CategoryDescription
     FROM lot l
     LEFT JOIN bidder w ON l.WinningBidder = w.BidderID
     LEFT JOIN category c ON l.CategoryID = c.CategoryID
     WHERE l.LotID = ?`,
    [lotId],
  );
  return rows[0] ?? null;
}

export async function getBidders(): Promise<Bidder[]> {
  return query<Bidder & RowDataPacket>("SELECT BidderID, Name FROM bidder");
}

export async function addLot(values: LotFormValues): Promise<boolean> {
  try {
    const categoryId =
      !values.categoryId || values.categoryId === "NULL"
        ? null
        : Number(values.categoryId);
    const highestBid =
      !values.highestBid || values.highestBid === "NULL"
        ? null
        : Number(values.highestBid);
    const bidderId =
      !values.bidderId || values.bidderId === "NULL"
        ? null
        : Number(values.bidderId);
    const image =
      !values.image || values.image === "NULL" ? null : values.image;

    await execute(
      `INSERT INTO lot (Description, CategoryID, WinningBid, WinningBidder, Delivered, Image)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        values.description,
        categoryId,
        highestBid,
        bidderId,
        values.delivered ? 1 : 0,
        image,
      ],
    );
    return true;
  } catch {
    return false;
  }
}

export async function updateLot(
  lotId: number,
  values: LotFormValues,
): Promise<boolean> {
  try {
    const categoryId =
      !values.categoryId || values.categoryId === "NULL"
        ? null
        : Number(values.categoryId);
    const highestBid =
      !values.highestBid || values.highestBid === "NULL"
        ? null
        : Number(values.highestBid);
    const bidderId =
      !values.bidderId || values.bidderId === "NULL"
        ? null
        : Number(values.bidderId);
    const image =
      !values.image || values.image === "NULL" ? null : values.image;

    await execute(
      `UPDATE lot SET Description = ?, CategoryID = ?, WinningBid = ?,
       WinningBidder = ?, Delivered = ?, Image = ? WHERE LotID = ?`,
      [
        values.description,
        categoryId,
        highestBid,
        bidderId,
        values.delivered ? 1 : 0,
        image,
        lotId,
      ],
    );
    return true;
  } catch {
    return false;
  }
}

export async function deleteLot(lotId: number): Promise<boolean> {
  try {
    await execute("DELETE FROM lot WHERE LotID = ?", [lotId]);
    return true;
  } catch {
    return false;
  }
}

export async function getLotDescriptions(): Promise<
  Pick<Lot, "LotID" | "Description">[]
> {
  return query<Pick<Lot, "LotID" | "Description"> & RowDataPacket>(
    "SELECT LotID, Description FROM lot",
  );
}
