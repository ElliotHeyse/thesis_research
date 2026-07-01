import { query } from "@/lib/db/pool";
import type { AuctionItem, CategoryDescription } from "@/lib/types";

export async function findDisplayItems(): Promise<AuctionItem[]> {
  return query<AuctionItem>(
    `SELECT i.ItemID, i.Description, i.RetailValue, l.CategoryID
     FROM Item i
     LEFT JOIN Lot l ON i.LotID = l.LotID`,
  );
}

export async function findCategoryDescriptions(): Promise<CategoryDescription[]> {
  return query<CategoryDescription>(
    "SELECT CategoryID, Description FROM Category",
  );
}
