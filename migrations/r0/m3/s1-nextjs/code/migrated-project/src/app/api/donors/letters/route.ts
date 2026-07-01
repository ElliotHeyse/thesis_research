import { NextResponse } from "next/server";
import { handleServiceError, parseDonorIdsFromBody } from "@/lib/api/helpers";
import { pdfResponse, renderDonorLettersPdf } from "@/lib/pdf/pdf.service";
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
      return NextResponse.redirect(new URL("/donors/letters?error=no_selection", request.url));
    }

    const donors = await donorService.prepareLettersPdfData(donorIds);
    if (donors.length === 0) {
      return NextResponse.redirect(new URL("/donors/letters?error=no_selection", request.url));
    }

    const buffer = await renderDonorLettersPdf(donors);
    return pdfResponse(buffer, "donor-letters.pdf");
  } catch (error) {
    return handleServiceError(error);
  }
}
