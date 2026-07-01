import { RowDataPacket, ResultSetHeader } from "mysql2";
import { getPool } from "./pool";
import type {
  AuctionItem,
} from "./types";

export async function getAuctionItems(): Promise<AuctionItem[]> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT i.ItemID, i.Description, i.RetailValue, l.CategoryID
     FROM Item i
     LEFT JOIN Lot l ON i.LotID = l.LotID`
  );
  return rows as AuctionItem[];
}

export { getCategoryDescriptions } from "./categories";
