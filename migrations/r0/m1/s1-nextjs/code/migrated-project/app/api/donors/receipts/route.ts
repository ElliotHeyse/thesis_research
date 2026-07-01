import { NextRequest, NextResponse } from "next/server";
import { generateTaxReceiptsPdf } from "@/lib/pdf/generate";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const donorIds = formData
    .getAll("donorIds")
    .map((id) => Number(id))
    .filter((id) => !isNaN(id));

  if (donorIds.length === 0) {
    return NextResponse.redirect(
      new URL("/donors/receipts?error=no_selection", request.url),
    );
  }

  const pdf = await generateTaxReceiptsPdf(donorIds);
  if (!pdf) {
    return NextResponse.redirect(
      new URL("/donors/receipts?error=no_selection", request.url),
    );
  }

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="tax-receipts.pdf"',
    },
  });
}
