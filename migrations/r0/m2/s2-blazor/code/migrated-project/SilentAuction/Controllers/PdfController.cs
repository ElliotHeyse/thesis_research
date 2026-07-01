using Microsoft.AspNetCore.Mvc;
using SilentAuction.Models;
using SilentAuction.Services;

namespace SilentAuction.Controllers;

[ApiController]
[Route("api/pdf")]
[IgnoreAntiforgeryToken]
public class PdfController(
    DonorService donorService,
    ItemService itemService,
    LotService lotService,
    CategoryService categoryService,
    PdfService pdfService) : ControllerBase
{
    [HttpPost("donor-letters")]
    public async Task<IActionResult> DonorLetters([FromForm] int[] donorIds)
    {
        if (donorIds.Length == 0)
        {
            return Redirect("/donors/letters?error=no_selection");
        }

        var donors = new List<Data.Entities.Donor>();
        foreach (var donorId in donorIds)
        {
            var donor = await donorService.GetDonorAsync(donorId);
            if (donor is not null)
            {
                donors.Add(donor);
            }
        }

        if (donors.Count == 0)
        {
            return Redirect("/donors/letters?error=no_selection");
        }

        var pdf = await pdfService.GenerateDonorLettersPdfAsync(donors);
        return File(pdf, "application/pdf", "donor-letters.pdf");
    }

    [HttpPost("tax-receipts")]
    public async Task<IActionResult> TaxReceipts([FromForm] int[] donorIds)
    {
        if (donorIds.Length == 0)
        {
            return Redirect("/donors/receipts?error=no_selection");
        }

        var donorsWithItems = new List<DonorWithItems>();
        foreach (var donorId in donorIds)
        {
            var donor = await donorService.GetDonorAsync(donorId);
            if (donor is null)
            {
                continue;
            }

            var items = await donorService.GetItemsByDonorIdAsync(donorId);
            donorsWithItems.Add(new DonorWithItems { Donor = donor, Items = items });
            await donorService.MarkReceiptSentAsync(donorId);
        }

        if (donorsWithItems.Count == 0)
        {
            return Redirect("/donors/receipts?error=no_selection");
        }

        var pdf = await pdfService.GenerateTaxReceiptsPdfAsync(donorsWithItems);
        return File(pdf, "application/pdf", "tax-receipts.pdf");
    }

    [HttpGet("bidding-sheet/{itemId:int}")]
    public async Task<IActionResult> BiddingSheet(
        int itemId,
        [FromQuery] decimal? startingBid,
        [FromQuery] decimal? bidIncrement,
        [FromQuery] int? rows)
    {
        var item = await itemService.GetItemByIdAsync(itemId);
        if (item is null)
        {
            return Redirect("/lots/items");
        }

        Data.Entities.Lot? lot = null;
        Data.Entities.Category? category = null;
        if (item.LotID.HasValue)
        {
            lot = await lotService.GetLotForBiddingSheetAsync(item.LotID.Value);
            if (lot?.CategoryID is not null)
            {
                category = await categoryService.GetCategoryForBiddingSheetAsync(lot.CategoryID.Value);
            }
        }

        var retailValue = item.RetailValue;
        var resolvedStartingBid = startingBid ?? (retailValue > 0 ? retailValue * 0.5m : 10.00m);
        var resolvedIncrement = bidIncrement ?? 5.00m;
        var resolvedRows = rows ?? 15;

        var pdf = await pdfService.GenerateBiddingSheetPdfAsync(
            item, lot, category, resolvedStartingBid, resolvedIncrement, resolvedRows);

        return File(pdf, "application/pdf", $"bidding-sheet-item-{itemId}.pdf");
    }
}
