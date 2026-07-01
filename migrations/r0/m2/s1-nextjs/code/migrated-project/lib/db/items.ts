import { RowDataPacket, ResultSetHeader } from "mysql2";
import { getPool } from "./pool";
import type {
  Bidder,
  ItemDetail,
  ItemFormValues,
  ItemListRow,
  Lot,
  LotAssignmentChange,
  LotDetail,
  LotFormValues,
  LotListRow,
} from "./types";

export async function getItems(): Promise<ItemListRow[]> {
  const [unassigned] = await getPool().query<RowDataPacket[]>(
    `SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID,
            d.BusinessName, l.Description AS LotDescription
     FROM Item i
     LEFT JOIN Donor d ON i.DonorID = d.DonorID
     LEFT JOIN Lot l ON i.LotID = l.LotID
     WHERE i.LotID IS NULL
     ORDER BY i.ItemID ASC`
  );
  const [assigned] = await getPool().query<RowDataPacket[]>(
    `SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID,
            d.BusinessName, l.Description AS LotDescription
     FROM Item i
     LEFT JOIN Donor d ON i.DonorID = d.DonorID
     LEFT JOIN Lot l ON i.LotID = l.LotID
     WHERE i.LotID IS NOT NULL
     ORDER BY i.ItemID ASC`
  );
  return [...(unassigned as ItemListRow[]), ...(assigned as ItemListRow[])];
}

export async function getLotDescriptions(): Promise<
  Pick<Lot, "LotID" | "Description">[]
> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT LotID, Description FROM Lot"
  );
  return rows as Pick<Lot, "LotID" | "Description">[];
}

export async function getItemsByLotId(lotId: number): Promise<ItemListRow[]> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID,
            d.BusinessName, d.ContactName
     FROM Item i
     LEFT JOIN Donor d ON i.DonorID = d.DonorID
     WHERE i.LotID = ?
     ORDER BY i.ItemID ASC`,
    [lotId]
  );
  return rows as ItemListRow[];
}

export async function getItemById(itemId: number): Promise<ItemDetail | null> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID,
            d.BusinessName, d.ContactName, d.ContactEmail, d.ContactTitle,
            l.Description AS LotDescription, l.CategoryID
     FROM Item i
     LEFT JOIN Donor d ON i.DonorID = d.DonorID
     LEFT JOIN Lot l ON i.LotID = l.LotID
     WHERE i.ItemID = ?`,
    [itemId]
  );
  return (rows[0] as ItemDetail) ?? null;
}

export async function getLotForBiddingSheet(
  lotId: number
): Promise<Lot | null> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT LotID, Description, CategoryID, WinningBid, WinningBidder, Delivered, Image
     FROM Lot WHERE LotID = ?`,
    [lotId]
  );
  return (rows[0] as Lot) ?? null;
}

export async function getCategoryForBiddingSheet(categoryId: number) {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT CategoryID, Description FROM Category WHERE CategoryID = ?",
    [categoryId]
  );
  return rows[0] ?? null;
}

export async function modifyItems(
  modifiedItems: LotAssignmentChange[]
): Promise<boolean> {
  if (modifiedItems.length === 0) return true;

  const params: (number | null)[] = [];
  let sql = "UPDATE Item SET LotID = CASE";
  let paramIndex = 1;

  const itemIds: number[] = [];
  for (const modified of modifiedItems) {
    sql += ` WHEN ItemID = ? THEN `;
    params.push(modified.itemID);
    if (modified.newLotID === -1) {
      sql += "NULL";
    } else {
      sql += "?";
      params.push(modified.newLotID);
    }
    itemIds.push(modified.itemID);
    paramIndex++;
  }

  sql += " ELSE LotID END WHERE ItemID IN (";
  sql += itemIds.map(() => "?").join(", ");
  sql += ")";

  params.push(...itemIds);

  try {
    await getPool().query(sql, params);
    return true;
  } catch {
    return false;
  }
}

export async function addItem(values: ItemFormValues): Promise<boolean> {
  try {
    await getPool().query(
      "INSERT INTO Item (Description, RetailValue, DonorID, LotID) VALUES (?, ?, ?, ?)",
      [values.description, values.retailValue, values.donorID, values.lotID]
    );
    return true;
  } catch {
    return false;
  }
}

export async function updateItem(
  itemId: number,
  values: ItemFormValues
): Promise<boolean> {
  try {
    await getPool().query(
      `UPDATE Item SET Description = ?, RetailValue = ?, DonorID = ?, LotID = ?
       WHERE ItemID = ?`,
      [
        values.description,
        values.retailValue,
        values.donorID,
        values.lotID,
        itemId,
      ]
    );
    return true;
  } catch {
    return false;
  }
}

export async function deleteItem(itemId: number): Promise<boolean> {
  try {
    const [result] = await getPool().query<ResultSetHeader>(
      "DELETE FROM Item WHERE ItemID = ?",
      [itemId]
    );
    return result.affectedRows > 0;
  } catch {
    return false;
  }
}

export async function getLots(): Promise<LotListRow[]> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT l.LotID, l.Description, l.WinningBid, w.Name AS Winner, l.Delivered,
            c.Description AS Category
     FROM Lot l
     LEFT JOIN Bidder w ON l.WinningBidder = w.BidderID
     LEFT JOIN Category c ON l.CategoryID = c.CategoryID
     ORDER BY l.LotID ASC`
  );
  return rows as LotListRow[];
}

export async function getLot(lotId: number): Promise<LotDetail | null> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT l.LotID, l.Description, l.CategoryID, l.WinningBid, l.WinningBidder,
            l.Delivered, l.Image, w.Name AS Winner, c.Description AS CategoryDescription
     FROM Lot l
     LEFT JOIN Bidder w ON l.WinningBidder = w.BidderID
     LEFT JOIN Category c ON l.CategoryID = c.CategoryID
     WHERE l.LotID = ?`,
    [lotId]
  );
  return (rows[0] as LotDetail) ?? null;
}

export async function getBidders(): Promise<Bidder[]> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT BidderID, Name FROM Bidder"
  );
  return rows as Bidder[];
}

export async function addLot(values: LotFormValues): Promise<boolean> {
  try {
    await getPool().query(
      `INSERT INTO Lot (Description, CategoryID, WinningBid, WinningBidder, Delivered, Image)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        values.description,
        values.categoryId,
        values.highestBid,
        values.bidderId,
        values.delivered ? 1 : 0,
        values.image,
      ]
    );
    return true;
  } catch {
    return false;
  }
}

export async function updateLot(
  lotId: number,
  values: LotFormValues
): Promise<boolean> {
  try {
    await getPool().query(
      `UPDATE Lot SET Description = ?, CategoryID = ?, WinningBid = ?,
       WinningBidder = ?, Delivered = ?, Image = ?
       WHERE LotID = ?`,
      [
        values.description,
        values.categoryId,
        values.highestBid,
        values.bidderId,
        values.delivered ? 1 : 0,
        values.image,
        lotId,
      ]
    );
    return true;
  } catch {
    return false;
  }
}

export async function deleteLot(lotId: number): Promise<boolean> {
  try {
    const [result] = await getPool().query<ResultSetHeader>(
      "DELETE FROM Lot WHERE LotID = ?",
      [lotId]
    );
    return result.affectedRows > 0;
  } catch {
    return false;
  }
}
