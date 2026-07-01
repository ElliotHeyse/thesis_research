import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import {
  getCategoryForBiddingSheet,
  getItemById,
  getLotForBiddingSheet,
} from "@/lib/db/items";
import { buildBiddingSheetHtml } from "@/lib/pdf/templates";
import { renderPdfFromHtml } from "@/lib/pdf/render";

export async function GET(request: NextRequest) {
  const itemIdRaw = request.nextUrl.searchParams.get("ItemID");

  if (!itemIdRaw) {
    redirect("/lots/items");
  }

  const itemId = Number(itemIdRaw);
  const item = await getItemById(itemId);

  if (!item) {
    redirect("/lots/items");
  }

  let lot = null;
  let category = null;

  if (item.LotID) {
    lot = await getLotForBiddingSheet(item.LotID);
    if (lot?.CategoryID) {
      category = await getCategoryForBiddingSheet(lot.CategoryID);
    }
  }

  const retailValue = Number(item.RetailValue ?? 0);
  const startingBidParam = request.nextUrl.searchParams.get("startingBid");
  const startingBid = startingBidParam
    ? Number(startingBidParam)
    : retailValue > 0
      ? retailValue * 0.5
      : 10;

  const bidIncrement = request.nextUrl.searchParams.get("bidIncrement")
    ? Number(request.nextUrl.searchParams.get("bidIncrement"))
    : 5;

  const numberOfBidRows = request.nextUrl.searchParams.get("rows")
    ? Number(request.nextUrl.searchParams.get("rows"))
    : 15;

  const html = buildBiddingSheetHtml({
    item,
    lot,
    category: category as { Description: string } | null,
    startingBid,
    bidIncrement,
    numberOfBidRows,
  });

  return renderPdfFromHtml(html, `bidding-sheet-item-${itemId}.pdf`);
}
