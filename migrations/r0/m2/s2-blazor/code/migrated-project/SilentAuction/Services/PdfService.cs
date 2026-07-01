using System.Net;
using System.Text;
using PuppeteerSharp;
using PuppeteerSharp.Media;
using SilentAuction.Data.Entities;
using SilentAuction.Models;

namespace SilentAuction.Services;

public class PdfService(IWebHostEnvironment env)
{
    public async Task<byte[]> GenerateDonorLettersPdfAsync(IReadOnlyList<Donor> donors)
    {
        var html = BuildDonorLettersHtml(donors);
        return await HtmlToPdfAsync(html);
    }

    public async Task<byte[]> GenerateTaxReceiptsPdfAsync(IReadOnlyList<DonorWithItems> donorsWithItems)
    {
        var html = BuildTaxReceiptsHtml(donorsWithItems);
        return await HtmlToPdfAsync(html);
    }

    public async Task<byte[]> GenerateBiddingSheetPdfAsync(
        ItemDetailRow item,
        Lot? lot,
        Category? category,
        decimal startingBid,
        decimal bidIncrement,
        int numberOfBidRows)
    {
        var html = BuildBiddingSheetHtml(item, lot, category, startingBid, bidIncrement, numberOfBidRows);
        return await HtmlToPdfAsync(html);
    }

    private async Task<byte[]> HtmlToPdfAsync(string html)
    {
        var browserFetcher = new BrowserFetcher();
        await browserFetcher.DownloadAsync();

        await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions { Headless = true });
        await using var page = await browser.NewPageAsync();
        await page.SetContentAsync(html);

        return await page.PdfDataAsync(new PdfOptions
        {
            Format = PaperFormat.Letter,
            PrintBackground = true
        });
    }

    private string BuildDonorLettersHtml(IReadOnlyList<Donor> donors)
    {
        var sb = new StringBuilder();
        sb.Append("""
            <!DOCTYPE html>
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
            <body>
            """);

        foreach (var donor in donors)
        {
            sb.Append("<div class=\"letter\"><div class=\"recipient-info\">");
            sb.Append(H(donor.ContactName)).Append("<br>");
            if (!string.IsNullOrWhiteSpace(donor.BusinessName))
            {
                sb.Append(H(donor.BusinessName)).Append("<br>");
            }

            sb.Append(H(donor.Address)).Append("<br>");
            sb.Append(H(donor.City)).Append(", ").Append(H(donor.State)).Append(' ').Append(H(donor.ZipCode));
            sb.Append("</div><div class=\"salutation\">Dear ").Append(H(donor.ContactName)).Append(":</div>");
            sb.Append("""
                <div class="body">
                    <p>W. H. Taylor Elementary School PTA will hold its annual Silent Auction, one of our major fundraising events. The Silent Auction provides much needed funds for many student enrichment programs and special requests from school staff. In previous years, Auction proceeds have funded classroom supplies, activities and fieldtrips, the PTA Cultural arts program, computers, and specialized reading programs. The Taylor PTA, in coordination with the Food Bank of Southeastern Virginia and Eastern Shore, helps provide children in our school at risk for hunger with backpacks full of enough food to tide the family over on weekends.</p>
                    <p>Community support like yours is what helps make Taylor Elementary one of the most outstanding elementary schools in Norfolk. We plan to reach out to all Taylor families and to advertising to the greater Hampton Roads community for this year's Auction.</p>
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
                </div>
                """);
        }

        sb.Append("</body></html>");
        return sb.ToString();
    }

    private string BuildTaxReceiptsHtml(IReadOnlyList<DonorWithItems> donorsWithItems)
    {
        var logoDataUri = GetLogoDataUri();
        var sb = new StringBuilder();
        sb.Append("""
            <!DOCTYPE html>
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
            <body>
            """);

        foreach (var entry in donorsWithItems)
        {
            var donor = entry.Donor;
            var totalValue = entry.Items.Sum(i => i.RetailValue);
            sb.Append("<div class=\"receipt\"><table class=\"header-table\"><tr><td>");
            if (!string.IsNullOrEmpty(logoDataUri))
            {
                sb.Append("<img src=\"").Append(logoDataUri).Append("\" alt=\"Logo\" class=\"logo\">");
            }

            sb.Append("""
                </td><td class="header-text">
                    <h1>Norfolk Public Schools</h1>
                    <h1>W. H. Taylor Elementary School</h1>
                    <h2>Home of the Owls</h2>
                    <h2>Parent Teacher Association</h2>
                    <h3>1122 W. Princess Anne Road</h3>
                    <h3>Norfolk, Virginia 23507</h3>
                </td></tr></table>
                """);

            sb.Append("<div style=\"margin-bottom: 20px;\">").Append(DateTime.Now.ToString("MMMM d, yyyy")).Append("</div>");
            sb.Append("<div style=\"margin-bottom: 20px;\">Dear ").Append(H(donor.ContactName)).Append(":</div>");
            sb.Append("""
                <div style="margin-bottom: 20px; line-height: 1.5;">
                    <p>Thank you for your support of W. H. Taylor's PTA. Because of your generous donation, our PTA was able to help fund many important services for our school, as well as Taylor Families.</p>
                    <p>We acknowledge the receipt of your donation that you generously contributed to the W. H. Taylor PTA.</p>
                """);
            sb.Append("<p><strong>Donor: ").Append(H(FormatHelper.DonorDisplayName(donor.BusinessName, donor.ContactName))).Append("</strong></p></div>");
            sb.Append("<div><strong>Donated Items:</strong><table class=\"items-table\">");

            foreach (var item in entry.Items)
            {
                sb.Append("<tr><td>").Append(H(item.Description)).Append("</td>");
                sb.Append("<td style=\"text-align: right;\">Value: $").Append(item.RetailValue.ToString("N2")).Append("</td></tr>");
            }

            sb.Append("<tr><td style=\"padding-top: 10px;\"><strong>Total:</strong></td>");
            sb.Append("<td style=\"text-align: right; padding-top: 10px;\"><strong>$").Append(totalValue.ToString("N2")).Append("</strong></td></tr>");
            sb.Append("""
                </table></div>
                <div class="footer-note">
                    <p>W. H. Taylor Elementary School PTA is a non-profit 501 (c)(3) organization. Your gift(s) are tax deductible.</p>
                    <p>No goods or services were received in return for this donation.</p>
                </div>
                <div class="signature">
                    Sincerely,<br><br><br>
                    Tamara Haines<br>
                    W. H. Taylor PTA Silent Auction Chairperson<br>
                </div>
                </div>
                """);
        }

        sb.Append("</body></html>");
        return sb.ToString();
    }

    private string BuildBiddingSheetHtml(
        ItemDetailRow item,
        Lot? lot,
        Category? category,
        decimal startingBid,
        decimal bidIncrement,
        int numberOfBidRows)
    {
        var retailValue = item.RetailValue;
        var donorName = !string.IsNullOrWhiteSpace(item.BusinessName)
            ? item.BusinessName
            : item.ContactName ?? "N/A";

        var sb = new StringBuilder();
        sb.Append("<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Bidding Sheet</title>");
        sb.Append("<style>");
        sb.Append("body{margin:0;font-family:DejaVu Sans,sans-serif;}");
        sb.Append(".bidding-sheet{padding:40px;}");
        sb.Append(".header-table{width:100%;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #333;}");
        sb.Append(".header-table td{vertical-align:top;}");
        sb.Append(".item-number{font-size:28px;font-weight:bold;color:#333;}");
        sb.Append(".header-text{text-align:right;}");
        sb.Append(".header-text h1{margin:0;font-size:18px;}");
        sb.Append(".header-text h2{margin:0;font-size:16px;font-weight:normal;}");
        sb.Append(".item-info{margin-bottom:25px;}");
        sb.Append(".info-row{margin-bottom:12px;font-size:14px;}");
        sb.Append(".info-label{font-weight:bold;display:inline-block;width:150px;}");
        sb.Append(".bidding-table{width:100%;border-collapse:collapse;margin-top:20px;margin-bottom:20px;}");
        sb.Append(".bidding-table th{background-color:#f5f5f5;border:1px solid #333;padding:12px;text-align:left;font-weight:bold;}");
        sb.Append(".bidding-table td{border:1px solid #333;padding:10px;height:40px;}");
        sb.Append("</style></head><body><div class=\"bidding-sheet\">");
        sb.Append("<table class=\"header-table\"><tr><td><div class=\"item-number\">Item #").Append(item.ItemID);
        sb.Append("</div></td><td class=\"header-text\">");
        sb.Append("<h1>Norfolk Public Schools</h1><h1>W. H. Taylor Elementary School</h1>");
        sb.Append("<h2>Home of the Owls</h2><h2>Parent Teacher Association</h2>");
        sb.Append("</td></tr></table><div class=\"item-info\">");

        sb.Append("<div class=\"info-row\"><span class=\"info-label\">Lot #:</span><span>");
        sb.Append(item.LotID.HasValue ? item.LotID.Value.ToString() : "N/A");
        sb.Append("</span></div>");
        sb.Append("<div class=\"info-row\"><span class=\"info-label\">Item Description:</span><span>").Append(H(item.Description)).Append("</span></div>");

        if (category is not null)
        {
            sb.Append("<div class=\"info-row\"><span class=\"info-label\">Category:</span><span>").Append(H(category.Description)).Append("</span></div>");
        }

        sb.Append("<div class=\"info-row\"><span class=\"info-label\">Donated by:</span><span>").Append(H(donorName)).Append("</span></div>");
        sb.Append("<div class=\"info-row\"><span class=\"info-label\">Retail Value:</span><span>$").Append(retailValue.ToString("N2")).Append("</span></div>");
        sb.Append("<div class=\"info-row\"><span class=\"info-label\">Starting Bid:</span><span>$").Append(startingBid.ToString("N2")).Append("</span></div>");
        sb.Append("<div class=\"info-row\"><span class=\"info-label\">Bid Increment:</span><span>$").Append(bidIncrement.ToString("N2")).Append("</span></div>");
        sb.Append("</div><table class=\"bidding-table\"><thead><tr><th style=\"width:150px;\">Bidder Number</th><th>Bid Amount</th></tr></thead><tbody>");

        for (var i = 0; i < numberOfBidRows; i++)
        {
            sb.Append("<tr><td></td><td></td></tr>");
        }

        sb.Append("</tbody></table></div></body></html>");
        return sb.ToString();
    }

    private string? GetLogoDataUri()
    {
        var logoPath = Path.Combine(env.WebRootPath, "assets", "Tiger-icon-hi-res.webp");
        if (!File.Exists(logoPath))
        {
            return null;
        }

        var bytes = File.ReadAllBytes(logoPath);
        return $"data:image/webp;base64,{Convert.ToBase64String(bytes)}";
    }

    private static string H(string? value) => WebUtility.HtmlEncode(value ?? string.Empty);
}
