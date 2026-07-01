import { NextResponse } from "next/server";
import { handleServiceError, parseDonorIdsFromBody } from "@/lib/api/helpers";
import { pdfResponse, renderTaxReceiptsPdf } from "@/lib/pdf/pdf.service";
import * as donorService from "@/lib/services/donor.service";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let donorIds: number[];
    if (contentType.includes("application/json")) {
      const body = await request.json();
      donorIds = parseDonorIdsFromBody(body);
    } else {
      const form = await request.formData();
      donorIds = parseDonorIdsFromBody(form);
    }

    if (donorIds.length === 0) {
      return NextResponse.redirect(new URL("/donors/receipts?error=no_selection", request.url));
    }

    const receipts = await donorService.generateReceipts(donorIds);
    if (receipts.length === 0) {
      return NextResponse.redirect(new URL("/donors/receipts?error=no_selection", request.url));
    }

    const buffer = await renderTaxReceiptsPdf(receipts);
    return pdfResponse(buffer, "tax-receipts.pdf");
  } catch (error) {
    return handleServiceError(error);
  }
}
