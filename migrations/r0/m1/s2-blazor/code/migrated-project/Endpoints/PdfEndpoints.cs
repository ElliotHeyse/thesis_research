using migrated_project.Services;

namespace migrated_project.Endpoints;

public static class PdfEndpoints
{
    public static void MapPdfEndpoints(this WebApplication app)
    {
        app.MapPost("/api/pdf/letters", async (HttpContext ctx, DonorService donorService, PdfService pdfService) =>
        {
            var donorIds = ParseDonorIds(ctx);
            if (donorIds.Count == 0)
                return Results.Redirect("/donors/letters?error=no_selection");

            var donors = new List<Models.Donor>();
            foreach (var id in donorIds)
            {
                var donor = await donorService.GetByIdAsync(id);
                if (donor is not null)
                    donors.Add(donor);
            }

            if (donors.Count == 0)
                return Results.Redirect("/donors/letters?error=no_selection");

            var pdf = pdfService.GenerateDonorLetters(donors);
            return Results.File(pdf, "application/pdf", "donor-letters.pdf");
        }).DisableAntiforgery();

        app.MapPost("/api/pdf/receipts", async (HttpContext ctx, DonorService donorService, PdfService pdfService) =>
        {
            var donorIds = ParseDonorIds(ctx);
            if (donorIds.Count == 0)
                return Results.Redirect("/donors/receipts?error=no_selection");

            var donorData = new List<(Models.Donor Donor, List<Models.Item> Items)>();
            foreach (var id in donorIds)
            {
                var donor = await donorService.GetByIdAsync(id);
                if (donor is not null)
                {
                    var items = await donorService.GetItemsByDonorIdAsync(id);
                    if (items.Count > 0)
                    {
                        donorData.Add((donor, items));
                        await donorService.MarkReceiptSentAsync(id);
                    }
                }
            }

            if (donorData.Count == 0)
                return Results.Redirect("/donors/receipts?error=no_selection");

            var pdf = pdfService.GenerateTaxReceipts(donorData);
            return Results.File(pdf, "application/pdf", "tax-receipts.pdf");
        }).DisableAntiforgery();

        app.MapGet("/api/pdf/bidding-sheet/{itemId:int}", async (
            int itemId,
            ItemService itemService,
            PdfService pdfService,
            decimal? startingBid,
            decimal? bidIncrement,
            int? rows) =>
        {
            var item = await itemService.GetForBiddingSheetAsync(itemId);
            if (item is null)
                return Results.NotFound();

            var retail = item.RetailValue;
            var start = startingBid ?? (retail > 0 ? retail * 0.5m : 10.00m);
            var increment = bidIncrement ?? 5.00m;
            var rowCount = rows ?? 15;

            var pdf = pdfService.GenerateBiddingSheet(item, start, increment, rowCount);
            return Results.File(pdf, "application/pdf", $"bidding-sheet-item-{itemId}.pdf");
        });
    }

    private static List<int> ParseDonorIds(HttpContext ctx)
    {
        if (!ctx.Request.HasFormContentType)
            return [];

        return ctx.Request.Form["donorIds"]
            .Select(v => int.TryParse(v, out var id) ? id : 0)
            .Where(id => id > 0)
            .Distinct()
            .ToList();
    }
}
