using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SilentAuction.Data.Entities;
using SilentAuction.Models;
using SilentAuction.Services;

namespace SilentAuction.Pdf;

public static class PdfDocuments
{
    static PdfDocuments()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public static byte[] GenerateDonorLetters(IReadOnlyList<Donor> donors)
    {
        return Document.Create(container =>
        {
            foreach (var donor in donors)
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.Letter);
                    page.Margin(40);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Content().Column(col =>
                    {
                        col.Item().Text($"{donor.ContactName}");
                        if (!string.IsNullOrWhiteSpace(donor.BusinessName))
                            col.Item().Text(donor.BusinessName);
                        col.Item().Text(donor.Address);
                        col.Item().Text($"{donor.City}, {donor.State} {donor.ZipCode}");
                        col.Item().PaddingTop(20).Text($"Dear {donor.ContactName}:");
                        col.Item().PaddingTop(10).Text(
                            "W. H. Taylor Elementary School PTA will hold its annual Silent Auction, one of our major fundraising events. The Silent Auction provides much needed funds for many student enrichment programs and special requests from school staff. In previous years, Auction proceeds have funded classroom supplies, activities and fieldtrips, the PTA Cultural arts program, computers, and specialized reading programs. The Taylor PTA, in coordination with the Food Bank of Southeastern Virginia and Eastern Shore, helps provide children in our school at risk for hunger with backpacks full of enough food to tide the family over on weekends.");
                        col.Item().PaddingTop(8).Text(
                            "Community support like yours is what helps make Taylor Elementary one of the most outstanding elementary schools in Norfolk. We plan to reach out to all Taylor families and to advertise to the greater Hampton Roads community for this year's Auction.");
                        col.Item().PaddingTop(8).Text("Should you agree to make a contribution, we will be happy to display your promotional material during the Silent Auction. Additionally, all Silent Auction contributors will receive recognition in:");
                        col.Item().PaddingLeft(15).Column(list =>
                        {
                            list.Item().Text("• Taylor Elementary PTA events and newsletter");
                            list.Item().Text("• An exhibit located within our school");
                            list.Item().Text("• Taylor Elementary PTA Website");
                            list.Item().Text("• Taylor PTA Facebook");
                            list.Item().Text("• Marketing posters placed throughout the community");
                        });
                        col.Item().PaddingTop(8).Text(
                            "If you would like to participate in our Auction, please complete the enclosed Contribution Agreement and return it in the enclosed envelope in order to be included in the Auction Program.");
                        col.Item().PaddingTop(8).Text(
                            "If you have any questions, or need additional information, please contact the Silent Auction Committee.");
                        col.Item().PaddingTop(8).Text(
                            "Thank you in advance for your consideration of this request. We greatly appreciate your generosity.");
                        col.Item().PaddingTop(30).Text("Sincerely,");
                        col.Item().PaddingTop(30).Text("Tamara Haines");
                        col.Item().Text("Chairman, Silent Auction Committee");
                        col.Item().Text("W. H. Taylor Elementary School PTA");
                        col.Item().Text("1122 W. Princess Anne Road");
                        col.Item().Text("Norfolk, Virginia 23517");
                    });
                });
            }
        }).GeneratePdf();
    }

    public static byte[] GenerateTaxReceipts(IReadOnlyList<DonorWithItemsDto> data, string? logoPath)
    {
        return Document.Create(container =>
        {
            foreach (var entry in data)
            {
                var donor = entry.Donor;
                var total = entry.Items.Sum(i => i.RetailValue);

                container.Page(page =>
                {
                    page.Size(PageSizes.Letter);
                    page.Margin(40);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Content().Column(col =>
                    {
                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Column(left =>
                            {
                                if (!string.IsNullOrEmpty(logoPath) && File.Exists(logoPath))
                                    left.Item().Width(80).Image(logoPath);
                            });
                            row.RelativeItem().AlignRight().Column(right =>
                            {
                                right.Item().Text("Norfolk Public Schools").Bold();
                                right.Item().Text("W. H. Taylor Elementary School").Bold();
                                right.Item().Text("Home of the Owls");
                                right.Item().Text("Parent Teacher Association");
                                right.Item().Text("1122 W. Princess Anne Road");
                                right.Item().Text("Norfolk, Virginia 23507");
                            });
                        });

                        col.Item().PaddingTop(20).Text(DateTime.Now.ToString("MMMM d, yyyy"));
                        col.Item().PaddingTop(10).Text($"Dear {donor.ContactName}:");
                        col.Item().PaddingTop(10).Text(
                            "Thank you for your support of W. H. Taylor's PTA. Because of your generous donation, our PTA was able to help fund many important services for our school, as well as Taylor Families.");
                        col.Item().PaddingTop(8).Text(
                            "We acknowledge the receipt of your donation that you generously contributed to the W. H. Taylor PTA.");
                        col.Item().PaddingTop(8).Text($"Donor: {FormatService.GetDonorDisplayName(donor)}").Bold();

                        col.Item().PaddingTop(15).Text("Donated Items:").Bold();
                        foreach (var item in entry.Items)
                        {
                            col.Item().Row(r =>
                            {
                                r.RelativeItem().Text(item.Description);
                                r.ConstantItem(120).AlignRight().Text($"Value: {FormatService.FormatCurrency(item.RetailValue)}");
                            });
                        }
                        col.Item().PaddingTop(8).Row(r =>
                        {
                            r.RelativeItem().Text("Total:").Bold();
                            r.ConstantItem(120).AlignRight().Text(FormatService.FormatCurrency(total)).Bold();
                        });

                        col.Item().PaddingTop(30).AlignCenter().Text(
                            "W. H. Taylor Elementary School PTA is a non-profit 501 (c)(3) organization. Your gift(s) are tax deductible.");
                        col.Item().AlignCenter().Text("No goods or services were received in return for this donation.");

                        col.Item().PaddingTop(40).Text("Sincerely,");
                        col.Item().PaddingTop(30).Text("Tamara Haines");
                        col.Item().Text("W. H. Taylor PTA Silent Auction Chairperson");
                    });
                });
            }
        }).GeneratePdf();
    }

    public static byte[] GenerateBiddingSheet(
        ItemDetailDto item,
        Data.Entities.Lot? lot,
        Data.Entities.Category? category,
        decimal startingBid,
        decimal bidIncrement,
        int numberOfRows)
    {
        var donorName = FormatService.GetDonorDisplayName(item.BusinessName, item.ContactName ?? "N/A");

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.Letter);
                page.Margin(40);
                page.DefaultTextStyle(x => x.FontSize(11));

                page.Content().Column(col =>
                {
                    col.Item().Row(row =>
                    {
                        row.RelativeItem().Text($"Item #{item.ItemID}").FontSize(22).Bold();
                        row.RelativeItem().AlignRight().Column(right =>
                        {
                            right.Item().Text("Norfolk Public Schools").Bold();
                            right.Item().Text("W. H. Taylor Elementary School").Bold();
                            right.Item().Text("Home of the Owls");
                            right.Item().Text("Parent Teacher Association");
                        });
                    });

                    col.Item().PaddingTop(20).LineHorizontal(2);

                    col.Item().PaddingTop(15).Row(r => { r.ConstantItem(150).Text("Lot #:").Bold(); r.RelativeItem().Text(item.LotID?.ToString() ?? "N/A"); });
                    col.Item().Row(r => { r.ConstantItem(150).Text("Item Description:").Bold(); r.RelativeItem().Text(item.Description); });
                    if (category is not null)
                        col.Item().Row(r => { r.ConstantItem(150).Text("Category:").Bold(); r.RelativeItem().Text(category.Description); });
                    col.Item().Row(r => { r.ConstantItem(150).Text("Donated by:").Bold(); r.RelativeItem().Text(donorName); });
                    col.Item().Row(r => { r.ConstantItem(150).Text("Retail Value:").Bold(); r.RelativeItem().Text(FormatService.FormatCurrency(item.RetailValue)); });
                    col.Item().Row(r => { r.ConstantItem(150).Text("Starting Bid:").Bold(); r.RelativeItem().Text(FormatService.FormatCurrency(startingBid)); });
                    col.Item().Row(r => { r.ConstantItem(150).Text("Bid Increment:").Bold(); r.RelativeItem().Text(FormatService.FormatCurrency(bidIncrement)); });

                    col.Item().PaddingTop(15).Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.ConstantColumn(120);
                            c.RelativeColumn();
                        });

                        table.Header(h =>
                        {
                            h.Cell().Border(1).Background(Colors.Grey.Lighten3).Padding(8).Text("Bidder Number").Bold();
                            h.Cell().Border(1).Background(Colors.Grey.Lighten3).Padding(8).Text("Bid Amount").Bold();
                        });

                        for (var i = 0; i < numberOfRows; i++)
                        {
                            table.Cell().Border(1).Height(30);
                            table.Cell().Border(1).Height(30);
                        }
                    });
                });
            });
        }).GeneratePdf();
    }
}
