import { query, execute } from "@/lib/db";
import type { AuctionItem, Category, Item, ItemFormValues, Lot } from "@/lib/types";
import { RowDataPacket } from "mysql2/promise";

export async function getItems(): Promise<Item[]> {
  const unassigned = await query<Item & RowDataPacket>(
    `SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID,
            d.BusinessName, l.Description AS LotDescription
     FROM item i
     LEFT JOIN donor d ON i.DonorID = d.DonorID
     LEFT JOIN lot l ON i.LotID = l.LotID
     WHERE i.LotID IS NULL
     ORDER BY i.ItemID ASC`,
  );

  const assigned = await query<Item & RowDataPacket>(
    `SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID,
            d.BusinessName, l.Description AS LotDescription
     FROM item i
     LEFT JOIN donor d ON i.DonorID = d.DonorID
     LEFT JOIN lot l ON i.LotID = l.LotID
     WHERE i.LotID IS NOT NULL
     ORDER BY i.ItemID ASC`,
  );

  return [...unassigned, ...assigned];
}

export async function getItemById(itemId: number): Promise<Item | null> {
  const rows = await query<Item & RowDataPacket>(
    `SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID,
            d.BusinessName, d.ContactName, d.ContactEmail, d.ContactTitle,
            l.Description AS LotDescription, l.CategoryID
     FROM item i
     LEFT JOIN donor d ON i.DonorID = d.DonorID
     LEFT JOIN lot l ON i.LotID = l.LotID
     WHERE i.ItemID = ?`,
    [itemId],
  );
  return rows[0] ?? null;
}

export async function getItemsByLotId(lotId: number): Promise<Item[]> {
  return query<Item & RowDataPacket>(
    `SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID,
            d.BusinessName, d.ContactName
     FROM item i
     LEFT JOIN donor d ON i.DonorID = d.DonorID
     WHERE i.LotID = ?
     ORDER BY i.ItemID ASC`,
    [lotId],
  );
}

export async function getLotForBiddingSheet(lotId: number): Promise<Lot | null> {
  const rows = await query<Lot & RowDataPacket>(
    `SELECT LotID, Description, CategoryID, WinningBid, WinningBidder, Delivered, Image
     FROM lot WHERE LotID = ?`,
    [lotId],
  );
  return rows[0] ?? null;
}

export async function getCategoryForBiddingSheet(
  categoryId: number,
): Promise<Category | null> {
  const rows = await query<Category & RowDataPacket>(
    "SELECT CategoryID, Description FROM category WHERE CategoryID = ?",
    [categoryId],
  );
  return rows[0] ?? null;
}

export async function modifyItems(
  modifiedItems: { itemID: number; newLotID: number }[],
): Promise<boolean> {
  if (modifiedItems.length === 0) {
    return true;
  }

  const itemIds = modifiedItems.map((m) => m.itemID);
  let sql = "UPDATE item SET LotID = CASE";
  const params: (string | number)[] = [];

  modifiedItems.forEach((item, index) => {
    sql += ` WHEN ItemID = ? THEN `;
    params.push(item.itemID);
    if (item.newLotID === -1) {
      sql += "NULL";
    } else {
      sql += "?";
      params.push(item.newLotID);
    }
  });

  sql += " ELSE LotID END WHERE ItemID IN (";
  sql += itemIds.map(() => "?").join(", ");
  sql += ")";

  params.push(...itemIds);

  try {
    await execute(sql, params);
    return true;
  } catch {
    return false;
  }
}

export async function addItem(values: ItemFormValues): Promise<boolean> {
  try {
    const lotID =
      !values.lotID || values.lotID === "NULL" ? null : Number(values.lotID);

    await execute(
      "INSERT INTO item (Description, RetailValue, DonorID, LotID) VALUES (?, ?, ?, ?)",
      [values.description, values.retailValue, Number(values.donorID), lotID],
    );
    return true;
  } catch {
    return false;
  }
}

export async function updateItem(
  itemId: number,
  values: ItemFormValues,
): Promise<boolean> {
  try {
    const lotID =
      !values.lotID || values.lotID === "NULL" ? null : Number(values.lotID);

    await execute(
      `UPDATE item SET Description = ?, RetailValue = ?, DonorID = ?, LotID = ?
       WHERE ItemID = ?`,
      [
        values.description,
        values.retailValue,
        Number(values.donorID),
        lotID,
        itemId,
      ],
    );
    return true;
  } catch {
    return false;
  }
}

export async function deleteItem(itemId: number): Promise<boolean> {
  try {
    await execute("DELETE FROM item WHERE ItemID = ?", [itemId]);
    return true;
  } catch {
    return false;
  }
}

export async function getAuctionItems(): Promise<AuctionItem[]> {
  return query<AuctionItem & RowDataPacket>(
    `SELECT i.ItemID, i.Description, i.RetailValue, l.CategoryID
     FROM item i
     LEFT JOIN lot l ON i.LotID = l.LotID`,
  );
}
