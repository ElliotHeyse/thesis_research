import path from "path";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import {
  getDonor,
  getItemsByDonorId,
  markReceiptSent,
} from "@/lib/db/donors";
import { buildTaxReceiptsHtml } from "@/lib/pdf/templates";
import { renderPdfFromHtml } from "@/lib/pdf/render";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const donorIds = formData.getAll("donorIds").map((id) => Number(id));

  if (donorIds.length === 0) {
    redirect("/donors/receipts?error=no_selection");
  }

  const donorsAndItems = [];
  for (const donorId of donorIds) {
    const donor = await getDonor(donorId);
    if (donor) {
      const items = await getItemsByDonorId(donorId);
      donorsAndItems.push({ donor, items });
      await markReceiptSent(donorId);
    }
  }

  if (donorsAndItems.length === 0) {
    redirect("/donors/receipts?error=no_selection");
  }

  const logoPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "Tiger-icon-hi-res.svg"
  );

  const html = buildTaxReceiptsHtml(donorsAndItems, logoPath);
  return renderPdfFromHtml(html, "tax-receipts.pdf");
}
