import {
  handleServiceError,
  jsonOk,
  parseDonorIdsFromBody,
  parseJsonBody,
} from "@/lib/api/helpers";
import { pdfResponse, renderDonorLettersPdf, renderTaxReceiptsPdf } from "@/lib/pdf/pdf.service";
import * as donorService from "@/lib/services/donor.service";

export async function GET() {
  try {
    const donors = await donorService.listDonors();
    return jsonOk(donors);
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let data: unknown;
    if (contentType.includes("application/json")) {
      data = await parseJsonBody(request);
    } else {
      const form = await request.formData();
      data = Object.fromEntries(form.entries());
      if (form.get("TaxReceipt") === "on") {
        (data as Record<string, unknown>).taxReceipt = true;
      }
    }
    await donorService.createDonor(data);
    return jsonOk({ success: true }, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
