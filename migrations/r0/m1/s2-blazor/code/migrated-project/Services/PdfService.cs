using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using migrated_project.Models;

namespace migrated_project.Services;

public class PdfService
{
    public byte[] GenerateDonorLetters(IReadOnlyList<Donor> donors)
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
                        col.Item().PaddingTop(30).Text($"Dear {donor.ContactName}:");
                        col.Item().PaddingTop(15).Text(body =>
                        {
                            body.Span("W. H. Taylor Elementary School PTA will hold its annual Silent Auction, one of our major fundraising events. The Silent Auction provides much needed funds for many student enrichment programs and special requests from school staff. In previous years, Auction proceeds have funded classroom supplies, activities and fieldtrips, the PTA Cultural arts program, computers, and specialized reading programs. The Taylor PTA, in coordination with the Food Bank of Southeastern Virginia and Eastern Shore, helps provide children in our school at risk for hunger with backpacks full of enough food to tide the family over on weekends.");
                            body.EmptyLine();
                            body.Span("Community support like yours is what helps make Taylor Elementary one of the most outstanding elementary schools in Norfolk. We plan to reach out to all Taylor families and to advertise to the greater Hampton Roads community for this year's Auction.");
                            body.EmptyLine();
                            body.Span("Should you agree to make a contribution, we will be happy to display your promotional material during the Silent Auction. Additionally, all Silent Auction contributors will receive recognition in:");
                            body.EmptyLine();
                            body.Span("• Taylor Elementary PTA events and newsletter");
                            body.EmptyLine();
                            body.Span("• An exhibit located within our school");
                            body.EmptyLine();
                            body.Span("• Taylor Elementary PTA Website");
                            body.EmptyLine();
                            body.Span("• Taylor PTA Facebook");
                            body.EmptyLine();
                            body.Span("• Marketing posters placed throughout the community");
                            body.EmptyLine();
                            body.Span("If you would like to participate in our Auction, please complete the enclosed Contribution Agreement and return it in the enclosed envelope in order to be included in the Auction Program.");
                            body.EmptyLine();
                            body.Span("If you have any questions, or need additional information, please contact the Silent Auction Committee.");
                            body.EmptyLine();
                            body.Span("Thank you in advance for your consideration of this request. We greatly appreciate your generosity.");
                        });
                        col.Item().PaddingTop(30).Text("Sincerely,\n\n\nTamara Haines\nChairman, Silent Auction Committee\nW. H. Taylor Elementary School PTA\n1122 W. Princess Anne Road\nNorfolk, Virginia 23517");
                    });
                });
            }
        }).GeneratePdf();
    }

    public byte[] GenerateTaxReceipts(IReadOnlyList<(Donor Donor, List<Item> Items)> donorData)
    {
        return Document.Create(container =>
        {
            foreach (var (donor, items) in donorData)
            {
                var total = items.Sum(i => i.RetailValue);
                container.Page(page =>
                {
                    page.Size(PageSizes.Letter);
                    page.Margin(40);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Content().Column(col =>
                    {
                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Text("🦉").FontSize(24);
                            row.RelativeItem().AlignRight().Column(header =>
                            {
                                header.Item().Text("Norfolk Public Schools").Bold();
                                header.Item().Text("W. H. Taylor Elementary School").Bold();
                                header.Item().Text("Home of the Owls");
                                header.Item().Text("Parent Teacher Association");
                                header.Item().Text("1122 W. Princess Anne Road");
                                header.Item().Text("Norfolk, Virginia 23507");
                            });
                        });

                        col.Item().PaddingTop(20).Text(DateTime.Now.ToString("MMMM d, yyyy"));
                        col.Item().PaddingTop(15).Text($"Dear {donor.ContactName}:");
                        col.Item().PaddingTop(10).Text("Thank you for your support of W. H. Taylor's PTA. Because of your generous donation, our PTA was able to help fund many important services for our school, as well as Taylor Families.");
                        col.Item().PaddingTop(5).Text("We acknowledge the receipt of your donation that you generously contributed to the W. H. Taylor PTA.");
                        col.Item().PaddingTop(5).Text($"Donor: {DonorService.DisplayName(donor)}").Bold();

                        col.Item().PaddingTop(15).Text("Donated Items:").Bold();
                        col.Item().PaddingTop(5).Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn(3);
                                c.RelativeColumn(1);
                            });

                            foreach (var item in items)
                            {
                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(4)
                                    .Text(item.Description);
                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(4)
                                    .AlignRight().Text($"Value: ${item.RetailValue:N2}");
                            }

                            table.Cell().PaddingTop(8).Text("Total:").Bold();
                            table.Cell().PaddingTop(8).AlignRight().Text($"${total:N2}").Bold();
                        });

                        col.Item().PaddingTop(30).AlignCenter().Text("W. H. Taylor Elementary School PTA is a non-profit 501 (c)(3) organization. Your gift(s) are tax deductible.");
                        col.Item().AlignCenter().Text("No goods or services were received in return for this donation.");

                        col.Item().PaddingTop(40).Text("Sincerely,\n\n\nTamara Haines\nW. H. Taylor PTA Silent Auction Chairperson");
                    });
                });
            }
        }).GeneratePdf();
    }

    public byte[] GenerateBiddingSheet(BiddingSheetItem item, decimal startingBid, decimal bidIncrement, int rows)
    {
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
                        row.RelativeItem().AlignRight().Column(header =>
                        {
                            header.Item().Text("Norfolk Public Schools").Bold().FontSize(14);
                            header.Item().Text("W. H. Taylor Elementary School").Bold().FontSize(14);
                            header.Item().Text("Home of the Owls");
                            header.Item().Text("Parent Teacher Association");
                        });
                    });

                    col.Item().PaddingTop(20).LineHorizontal(2);

                    col.Item().PaddingTop(15).Text($"Lot #: {(item.LotID?.ToString() ?? "N/A")}");
                    col.Item().Text($"Item Description: {item.Description}");
                    if (!string.IsNullOrWhiteSpace(item.CategoryDescription))
                        col.Item().Text($"Category: {item.CategoryDescription}");

                    var donorName = !string.IsNullOrWhiteSpace(item.BusinessName)
                        ? item.BusinessName
                        : item.ContactName ?? "N/A";
                    col.Item().Text($"Donated by: {donorName}");
                    col.Item().Text($"Retail Value: ${item.RetailValue:N2}");
                    col.Item().Text($"Starting Bid: ${startingBid:N2}");
                    col.Item().Text($"Bid Increment: ${bidIncrement:N2}");

                    col.Item().PaddingTop(15).Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.ConstantColumn(120);
                            c.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background(Colors.Grey.Lighten3).Border(1).Padding(8).Text("Bidder Number").Bold();
                            header.Cell().Background(Colors.Grey.Lighten3).Border(1).Padding(8).Text("Bid Amount").Bold();
                        });

                        for (var i = 0; i < rows; i++)
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
