import { handleServiceError, parseIdParam } from "@/lib/api/helpers";
import { pdfResponse, renderBiddingSheetPdf } from "@/lib/pdf/pdf.service";
import * as itemService from "@/lib/services/item.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const id = parseIdParam((await params).id);
    if (!id) {
      return new Response("Invalid ID", { status: 400 });
    }

    const url = new URL(request.url);
    const startingBid = url.searchParams.get("startingBid");
    const bidIncrement = url.searchParams.get("bidIncrement");
    const rows = url.searchParams.get("rows");

    const data = await itemService.getBiddingSheetData(id, {
      startingBid: startingBid ? Number(startingBid) : undefined,
      bidIncrement: bidIncrement ? Number(bidIncrement) : undefined,
      rows: rows ? Number(rows) : undefined,
    });

    if (!data) {
      return new Response("Item not found", { status: 404 });
    }

    const buffer = await renderBiddingSheetPdf(data);
    return pdfResponse(buffer, `bidding-sheet-item-${id}.pdf`);
  } catch (error) {
    return handleServiceError(error);
  }
}
