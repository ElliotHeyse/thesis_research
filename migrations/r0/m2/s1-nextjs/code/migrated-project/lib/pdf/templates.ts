import type { Donor, Item } from "@/lib/db/types";
import { escapeHtml } from "@/lib/pdf/render";

export function buildDonorLettersHtml(donors: Donor[]): string {
  const letters = donors
    .map(
      (donor) => `
    <div class="letter">
        <div class="recipient-info">
            ${escapeHtml(donor.ContactName)}<br>
            ${
              donor.BusinessName
                ? `${escapeHtml(donor.BusinessName)}<br>`
                : ""
            }
            ${escapeHtml(donor.Address)}<br>
            ${escapeHtml(donor.City)}, ${escapeHtml(donor.State)} ${escapeHtml(donor.ZipCode)}
        </div>

        <div class="salutation">
            Dear ${escapeHtml(donor.ContactName)}:
        </div>

        <div class="body">
            <p>W. H. Taylor Elementary School PTA will hold its annual Silent Auction, one of our major fundraising events. The Silent Auction provides much needed funds for many student enrichment programs and special requests from school staff. In previous years, Auction proceeds have funded classroom supplies, activities and fieldtrips, the PTA Cultural arts program, computers, and specialized reading programs. The Taylor PTA, in coordination with the Food Bank of Southeastern Virginia and Eastern Shore, helps provide children in our school at risk for hunger with backpacks full of enough food to tide the family over on weekends.</p>

            <p>Community support like yours is what helps make Taylor Elementary one of the most outstanding elementary schools in Norfolk. We plan to reach out to all Taylor families and to advertise to the greater Hampton Roads community for this year's Auction.</p>

            <p>Should you agree to make a contribution, we will be happy to display your promotional material during the Silent Auction. Additionally, all Silent Auction contributors will receive recognition in:</p>
            <ul>
                <li>Taylor Elementary PTA events and newsletter</li>
                <li>An exhibit located within our school</li>
                <li>Taylor Elementary PTA Website</li>
                <li>Taylor PTA Facebook</li>
                <li>Marketing posters placed throughout the community</li>
            </ul>

            <p>If you would like to participate in our Auction, please complete the enclosed Contribution Agreement and return it in the enclosed envelope in order to be included in the Auction Program.</p>

            <p>If you have any questions, or need additional information, please contact the Silent Auction Committee.</p>

            <p>Thank you in advance for your consideration of this request. We greatly appreciate your generosity.</p>
        </div>

        <div class="closing">
            Sincerely,<br><br><br>
            Tamara Haines<br>
            Chairman, Silent Auction Committee<br>
            W. H. Taylor Elementary School PTA<br>
            1122 W. Princess Anne Road<br>
            Norfolk, Virginia 23517
        </div>
    </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Donor Letters</title>
    <style>
        body { margin: 0; font-family: DejaVu Sans, sans-serif; }
        .letter { padding: 40px; page-break-after: always; }
        .letter:last-child { page-break-after: auto; }
        .recipient-info { margin-bottom: 40px; }
        .salutation { margin-bottom: 20px; }
        .body { line-height: 1.6; text-align: justify; }
        .closing { margin-top: 40px; }
    </style>
</head>
<body>${letters}</body>
</html>`;
}

export function buildTaxReceiptsHtml(
  donorsAndItems: { donor: Donor; items: Item[] }[],
  logoPath: string
): string {
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const receipts = donorsAndItems
    .map(({ donor, items }) => {
      let totalValue = 0;
      const itemRows = items
        .map((item) => {
          totalValue += Number(item.RetailValue);
          return `<tr>
                    <td>${escapeHtml(item.Description)}</td>
                    <td style="text-align: right;">Value: $${Number(item.RetailValue).toFixed(2)}</td>
                </tr>`;
        })
        .join("");

      const donorLabel = donor.BusinessName || donor.ContactName;

      return `<div class="receipt">
        <table class="header-table">
            <tr>
                <td>
                    ${
                      logoPath
                        ? `<img src="file://${logoPath.replace(/\\/g, "/")}" alt="Logo" class="logo">`
                        : ""
                    }
                </td>
                <td class="header-text">
                    <h1>Norfolk Public Schools</h1>
                    <h1>W. H. Taylor Elementary School</h1>
                    <h2>Home of the Owls</h2>
                    <h2>Parent Teacher Association</h2>
                    <h3>1122 W. Princess Anne Road</h3>
                    <h3>Norfolk, Virginia 23507</h3>
                </td>
            </tr>
        </table>

        <div style="margin-bottom: 20px;">${dateStr}</div>
        <div style="margin-bottom: 20px;">Dear ${escapeHtml(donor.ContactName)}:</div>
        <div style="margin-bottom: 20px; line-height: 1.5;">
            <p>Thank you for your support of W. H. Taylor's PTA. Because of your generous donation, our PTA was able to help fund many important services for our school, as well as Taylor Families.</p>
            <p>We acknowledge the receipt of your donation that you generously contributed to the W. H. Taylor PTA.</p>
            <p><strong>Donor: ${escapeHtml(donorLabel)}</strong></p>
        </div>
        <div>
            <strong>Donated Items:</strong>
            <table class="items-table">
                ${itemRows}
                <tr>
                    <td style="padding-top: 10px;"><strong>Total:</strong></td>
                    <td style="text-align: right; padding-top: 10px;"><strong>$${totalValue.toFixed(2)}</strong></td>
                </tr>
            </table>
        </div>
        <div class="footer-note">
            <p>W. H. Taylor Elementary School PTA is a non-profit 501 (c)(3) organization. Your gift(s) are tax deductible.</p>
            <p>No goods or services were received in return for this donation.</p>
        </div>
        <div class="signature">
            Sincerely,<br><br><br>
            Tamara Haines<br>
            W. H. Taylor PTA Silent Auction Chairperson<br>
        </div>
    </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tax Receipts</title>
    <style>
        body { margin: 0; font-family: DejaVu Sans, sans-serif; }
        .receipt { padding: 40px; page-break-after: always; }
        .receipt:last-child { page-break-after: auto; }
        .header-table { width: 100%; margin-bottom: 40px; }
        .header-table td { vertical-align: top; }
        .logo { width: 100px; }
        .header-text { text-align: right; }
        .header-text h1 { margin: 0; font-size: 18px; }
        .header-text h2 { margin: 0; font-size: 16px; font-weight: normal; }
        .header-text h3 { margin: 0; font-size: 14px; font-weight: normal; }
        .items-table { width: 100%; margin-top: 10px; border-collapse: collapse; }
        .items-table td { padding: 5px 0; border-bottom: 1px solid #eee; }
        .footer-note { margin-top: 40px; text-align: center; font-size: 0.9em; color: #555; }
        .signature { margin-top: 60px; }
    </style>
</head>
<body>${receipts}</body>
</html>`;
}

export function buildBiddingSheetHtml(params: {
  item: {
    ItemID: number;
    Description?: string | null;
    RetailValue?: number | null;
    LotID?: number | null;
    BusinessName?: string | null;
    ContactName?: string | null;
  };
  lot: { LotID: number; Description?: string } | null;
  category: { Description: string } | null;
  startingBid: number;
  bidIncrement: number;
  numberOfBidRows: number;
}): string {
  const { item, lot, category, startingBid, bidIncrement, numberOfBidRows } =
    params;
  const retailValue = Number(item.RetailValue ?? 0);

  let donorName = "N/A";
  if (item.BusinessName) {
    donorName = escapeHtml(item.BusinessName);
  } else if (item.ContactName) {
    donorName = escapeHtml(item.ContactName);
  }

  const lotRow =
    item.LotID && lot
      ? `<div class="info-row"><span class="info-label">Lot #:</span><span>${escapeHtml(lot.LotID)}</span></div>`
      : item.LotID
        ? `<div class="info-row"><span class="info-label">Lot #:</span><span>${escapeHtml(item.LotID)}</span></div>`
        : `<div class="info-row"><span class="info-label">Lot #:</span><span>N/A</span></div>`;

  const categoryRow = category
    ? `<div class="info-row"><span class="info-label">Category:</span><span>${escapeHtml(category.Description)}</span></div>`
    : "";

  const bidRows = Array.from({ length: numberOfBidRows })
    .map(() => "<tr><td></td><td></td></tr>")
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bidding Sheet - Item ${escapeHtml(item.ItemID)}</title>
    <style>
        body { margin: 0; font-family: DejaVu Sans, sans-serif; }
        .bidding-sheet { padding: 40px; }
        .header-table { width: 100%; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #333; }
        .header-table td { vertical-align: top; }
        .item-number { font-size: 28px; font-weight: bold; color: #333; }
        .header-text { text-align: right; }
        .header-text h1 { margin: 0; font-size: 18px; }
        .header-text h2 { margin: 0; font-size: 16px; font-weight: normal; }
        .item-info { margin-bottom: 25px; }
        .info-row { margin-bottom: 12px; font-size: 14px; }
        .info-label { font-weight: bold; display: inline-block; width: 150px; }
        .bidding-table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; }
        .bidding-table th { background-color: #f5f5f5; border: 1px solid #333; padding: 12px; text-align: left; font-weight: bold; }
        .bidding-table td { border: 1px solid #333; padding: 10px; height: 40px; }
    </style>
</head>
<body>
    <div class="bidding-sheet">
        <table class="header-table">
            <tr>
                <td><div class="item-number">Item #${escapeHtml(item.ItemID)}</div></td>
                <td class="header-text">
                    <h1>Norfolk Public Schools</h1>
                    <h1>W. H. Taylor Elementary School</h1>
                    <h2>Home of the Owls</h2>
                    <h2>Parent Teacher Association</h2>
                </td>
            </tr>
        </table>
        <div class="item-info">
            ${lotRow}
            <div class="info-row"><span class="info-label">Item Description:</span><span>${escapeHtml(item.Description ?? "N/A")}</span></div>
            ${categoryRow}
            <div class="info-row"><span class="info-label">Donated by:</span><span>${donorName}</span></div>
            <div class="info-row"><span class="info-label">Retail Value:</span><span>$${retailValue.toFixed(2)}</span></div>
            <div class="info-row"><span class="info-label">Starting Bid:</span><span>$${startingBid.toFixed(2)}</span></div>
            <div class="info-row"><span class="info-label">Bid Increment:</span><span>$${bidIncrement.toFixed(2)}</span></div>
        </div>
        <table class="bidding-table">
            <thead><tr><th style="width: 150px;">Bidder Number</th><th>Bid Amount</th></tr></thead>
            <tbody>${bidRows}</tbody>
        </table>
    </div>
</body>
</html>`;
}
