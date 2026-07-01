using SilentAuction.Data.Entities;
using SilentAuction.Models;
using SilentAuction.Services;

namespace SilentAuction.Pdf;

public class PdfService(DonorService donorService, ItemService itemService, IWebHostEnvironment env)
{
    public async Task<byte[]?> GenerateDonorLettersAsync(IEnumerable<int> donorIds)
    {
        var donors = await donorService.GetDonorsForLettersAsync(donorIds);
        if (donors.Count == 0) return null;
        return PdfDocuments.GenerateDonorLetters(donors);
    }

    public async Task<byte[]?> GenerateTaxReceiptsAsync(IEnumerable<int> donorIds)
    {
        var data = await donorService.PrepareTaxReceiptsAsync(donorIds);
        if (data.Count == 0) return null;

        var logoPath = Path.Combine(env.WebRootPath, "assets", "Tiger-icon-hi-res.webp");
        return PdfDocuments.GenerateTaxReceipts(data, logoPath);
    }

    public async Task<byte[]?> GenerateBiddingSheetAsync(
        int itemId, decimal? startingBid, decimal? increment, int? rows)
    {
        var (item, lot, category) = await itemService.GetBiddingSheetDataAsync(itemId);
        if (item is null) return null;

        var (start, inc, rowCount) = ItemService.GetBiddingSheetDefaults(
            item.RetailValue, startingBid, increment, rows);

        return PdfDocuments.GenerateBiddingSheet(item, lot, category, start, inc, rowCount);
    }
}
