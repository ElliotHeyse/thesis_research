import { NextRequest, NextResponse } from "next/server";
import { generateBiddingSheetPdf } from "@/lib/pdf/generate";

export async function GET(request: NextRequest) {
  const itemId = Number(request.nextUrl.searchParams.get("itemId"));
  if (!itemId || isNaN(itemId)) {
    return NextResponse.redirect(new URL("/lots/items", request.url));
  }

  const startingBid = request.nextUrl.searchParams.get("startingBid");
  const bidIncrement = request.nextUrl.searchParams.get("bidIncrement");
  const rows = request.nextUrl.searchParams.get("rows");

  const pdf = await generateBiddingSheetPdf(itemId, {
    startingBid: startingBid ? Number(startingBid) : undefined,
    bidIncrement: bidIncrement ? Number(bidIncrement) : undefined,
    rows: rows ? Number(rows) : undefined,
  });

  if (!pdf) {
    return NextResponse.redirect(new URL("/lots/items", request.url));
  }

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="bidding-sheet-item-${itemId}.pdf"`,
    },
  });
}
