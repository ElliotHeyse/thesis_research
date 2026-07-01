import { renderToBuffer } from "@react-pdf/renderer";
import path from "path";
import { DonorLettersDocument } from "@/lib/pdf/donor-letters";
import { TaxReceiptsDocument } from "@/lib/pdf/tax-receipts";
import { BiddingSheetDocument } from "@/lib/pdf/bidding-sheet";
import type { BiddingSheetData } from "@/lib/services/item.service";
import type { Donor, Item } from "@/lib/types";

export async function renderDonorLettersPdf(donors: Donor[]): Promise<Buffer> {
  const buffer = await renderToBuffer(
    <DonorLettersDocument donors={donors} />,
  );
  return Buffer.from(buffer);
}

export async function renderTaxReceiptsPdf(
  receipts: { donor: Donor; items: Item[] }[],
): Promise<Buffer> {
  const logoPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "tiger-logo.svg",
  );
  const buffer = await renderToBuffer(
    <TaxReceiptsDocument receipts={receipts} logoPath={logoPath} />,
  );
  return Buffer.from(buffer);
}

export async function renderBiddingSheetPdf(
  data: BiddingSheetData,
): Promise<Buffer> {
  const buffer = await renderToBuffer(<BiddingSheetDocument data={data} />);
  return Buffer.from(buffer);
}

export function pdfResponse(buffer: Buffer, filename: string): Response {
  const safeName = filename.replace(/[^\w.-]/g, "_");
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Content-Length": String(buffer.length),
    },
  });
}
