import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { getDonor } from "@/lib/db/donors";
import { buildDonorLettersHtml } from "@/lib/pdf/templates";
import { renderPdfFromHtml } from "@/lib/pdf/render";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const donorIds = formData.getAll("donorIds").map((id) => Number(id));

  if (donorIds.length === 0) {
    redirect("/donors/letters?error=no_selection");
  }

  const donors = [];
  for (const donorId of donorIds) {
    const donor = await getDonor(donorId);
    if (donor) donors.push(donor);
  }

  if (donors.length === 0) {
    redirect("/donors/letters?error=no_selection");
  }

  const html = buildDonorLettersHtml(donors);
  return renderPdfFromHtml(html, "donor-letters.pdf");
}
