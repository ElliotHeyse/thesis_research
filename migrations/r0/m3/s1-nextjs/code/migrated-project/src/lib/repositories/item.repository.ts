import { execute, query, queryOne } from "@/lib/db/pool";
import type {
  CategoryDescription,
  Item,
  ItemInput,
  Lot,
  LotAssignment,
  LotDescription,
} from "@/lib/types";

const itemListSql = `SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID,
  d.BusinessName, l.Description AS LotDescription
  FROM Item i
  LEFT JOIN Donor d ON i.DonorID = d.DonorID
  LEFT JOIN Lot l ON i.LotID = l.LotID`;

export async function findAllItems(): Promise<Item[]> {
  const unassigned = await query<Item>(
    `${itemListSql} WHERE i.LotID IS NULL ORDER BY i.ItemID ASC`,
  );
  const assigned = await query<Item>(
    `${itemListSql} WHERE i.LotID IS NOT NULL ORDER BY i.ItemID ASC`,
  );
  return [...unassigned, ...assigned];
}

export async function findLotDescriptions(): Promise<LotDescription[]> {
  return query<LotDescription>("SELECT LotID, Description FROM Lot");
}

export async function findItemsByLotId(lotId: number): Promise<Item[]> {
  return query<Item>(
    `SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID,
            d.BusinessName, d.ContactName
     FROM Item i
     LEFT JOIN Donor d ON i.DonorID = d.DonorID
     WHERE i.LotID = ?
     ORDER BY i.ItemID ASC`,
    [lotId],
  );
}

export async function findItemById(itemId: number): Promise<Item | null> {
  return queryOne<Item>(
    `SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID,
            d.BusinessName, d.ContactName, d.ContactEmail, d.ContactTitle,
            l.Description AS LotDescription, l.CategoryID
     FROM Item i
     LEFT JOIN Donor d ON i.DonorID = d.DonorID
     LEFT JOIN Lot l ON i.LotID = l.LotID
     WHERE i.ItemID = ?`,
    [itemId],
  );
}

export async function findLotForBiddingSheet(lotId: number): Promise<Lot | null> {
  return queryOne<Lot>(
    `SELECT LotID, Description, CategoryID, WinningBid, WinningBidder, Delivered, Image
     FROM Lot WHERE LotID = ?`,
    [lotId],
  );
}

export async function findCategoryForBiddingSheet(
  categoryId: number,
): Promise<CategoryDescription | null> {
  return queryOne<CategoryDescription>(
    "SELECT CategoryID, Description FROM Category WHERE CategoryID = ?",
    [categoryId],
  );
}

export async function bulkUpdateLotAssignments(
  modifiedItems: LotAssignment[],
): Promise<void> {
  if (modifiedItems.length === 0) return;

  const params: (string | number | null)[] = [];
  let sql = "UPDATE Item SET LotID = CASE";
  let paramIndex = 1;

  for (const item of modifiedItems) {
    sql += ` WHEN ItemID = ? THEN `;
    params.push(item.itemID);

    if (item.newLotID === -1) {
      sql += "NULL";
    } else {
      sql += `?`;
      params.push(item.newLotID);
    }
    paramIndex++;
    void paramIndex;
  }

  const inPlaceholders = modifiedItems.map(() => "?").join(", ");
  sql += ` ELSE LotID END WHERE ItemID IN (${inPlaceholders})`;
  for (const item of modifiedItems) {
    params.push(item.itemID);
  }

  await execute(sql, params);
}

export async function createItem(values: ItemInput): Promise<void> {
  await execute(
    "INSERT INTO Item (Description, RetailValue, DonorID, LotID) VALUES (?, ?, ?, ?)",
    [values.description, values.retailValue, values.donorID, values.lotID ?? null],
  );
}

export async function updateItem(
  itemId: number,
  values: ItemInput,
): Promise<void> {
  await execute(
    `UPDATE Item SET Description = ?, RetailValue = ?, DonorID = ?, LotID = ?
     WHERE ItemID = ?`,
    [
      values.description,
      values.retailValue,
      values.donorID,
      values.lotID ?? null,
      itemId,
    ],
  );
}

export async function deleteItem(itemId: number): Promise<void> {
  await execute("DELETE FROM Item WHERE ItemID = ?", [itemId]);
}
