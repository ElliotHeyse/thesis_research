import * as itemRepo from "@/lib/repositories/item.repository";
import type { BiddingSheetOptions, Item, LotAssignment } from "@/lib/types";
import { parseItemInput } from "@/lib/validation/item.schema";

export async function listItemsWithLots() {
  const [items, lots] = await Promise.all([
    itemRepo.findAllItems(),
    itemRepo.findLotDescriptions(),
  ]);
  return { items, lots };
}

export async function getItem(itemId: number) {
  return itemRepo.findItemById(itemId);
}

export async function createItem(data: unknown) {
  const parsed = parseItemInput(data);
  await itemRepo.createItem({
    description: parsed.description,
    retailValue: parsed.retailValue,
    donorID: parsed.donorID,
    lotID: parsed.lotID,
  });
}

export async function updateItem(itemId: number, data: unknown) {
  const parsed = parseItemInput(data);
  await itemRepo.updateItem(itemId, {
    description: parsed.description,
    retailValue: parsed.retailValue,
    donorID: parsed.donorID,
    lotID: parsed.lotID,
  });
}

export async function deleteItem(itemId: number) {
  await itemRepo.deleteItem(itemId);
}

export async function bulkAssignLots(
  assignments: Record<string, string | number>,
) {
  const items = await itemRepo.findAllItems();
  const itemsById = new Map(items.map((i) => [i.ItemID, i]));
  const modifiedItems: LotAssignment[] = [];

  for (const [itemIdStr, newLotIdRaw] of Object.entries(assignments)) {
    const itemId = Number(itemIdStr);
    const newLotId = Number(newLotIdRaw);
    if (!Number.isFinite(itemId) || !Number.isFinite(newLotId)) continue;

    const item = itemsById.get(itemId);
    if (!item) continue;

    const currentNormalized =
      item.LotID === null || item.LotID === undefined ? -1 : item.LotID;
    if (currentNormalized !== newLotId) {
      modifiedItems.push({ itemID: itemId, newLotID: newLotId });
    }
  }

  await itemRepo.bulkUpdateLotAssignments(modifiedItems);
}

export async function getBiddingSheetData(
  itemId: number,
  options: BiddingSheetOptions = {},
) {
  const item = await itemRepo.findItemById(itemId);
  if (!item) return null;

  let lot = null;
  let category = null;
  if (item.LotID) {
    lot = await itemRepo.findLotForBiddingSheet(item.LotID);
    if (lot?.CategoryID) {
      category = await itemRepo.findCategoryForBiddingSheet(lot.CategoryID);
    }
  }

  const retailValue = Number(item.RetailValue ?? 0);
  const startingBid =
    options.startingBid ??
    (retailValue > 0 ? retailValue * 0.5 : 10);
  const bidIncrement = options.bidIncrement ?? 5;
  const rows = options.rows ?? 15;

  return { item, lot, category, startingBid, bidIncrement, rows };
}

export type BiddingSheetData = NonNullable<
  Awaited<ReturnType<typeof getBiddingSheetData>>
>;

export type { Item };
