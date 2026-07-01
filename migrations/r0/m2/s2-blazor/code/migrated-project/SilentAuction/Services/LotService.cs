using Microsoft.EntityFrameworkCore;
using SilentAuction.Data;
using SilentAuction.Data.Entities;
using SilentAuction.Models;

namespace SilentAuction.Services;

public class LotService(ApplicationDbContext db)
{
    public async Task<List<LotListRow>> GetLotsAsync() =>
        await db.Lots
            .OrderBy(l => l.LotID)
            .Select(l => new LotListRow
            {
                LotID = l.LotID,
                Description = l.Description,
                WinningBid = l.WinningBid,
                Winner = l.WinningBidderNavigation != null ? l.WinningBidderNavigation.Name : null,
                Delivered = l.Delivered,
                Category = l.Category != null ? l.Category.Description : null
            })
            .ToListAsync();

    public async Task<Lot?> GetLotAsync(int lotId) =>
        await db.Lots.FindAsync(lotId);

    public async Task<LotDetailRow?> GetLotDetailAsync(int lotId) =>
        await db.Lots
            .Where(l => l.LotID == lotId)
            .Select(l => new LotDetailRow
            {
                LotID = l.LotID,
                Description = l.Description,
                CategoryID = l.CategoryID,
                WinningBid = l.WinningBid,
                WinningBidder = l.WinningBidder,
                Delivered = l.Delivered,
                Image = l.Image,
                Winner = l.WinningBidderNavigation != null ? l.WinningBidderNavigation.Name : null,
                CategoryDescription = l.Category != null ? l.Category.Description : null
            })
            .FirstOrDefaultAsync();

    public async Task<List<Bidder>> GetBiddersAsync() =>
        await db.Bidders
            .Select(b => new Bidder { BidderID = b.BidderID, Name = b.Name })
            .ToListAsync();

    public async Task<Lot?> GetLotForBiddingSheetAsync(int lotId) =>
        await db.Lots.FindAsync(lotId);

    public async Task<bool> AddLotAsync(LotFormModel model)
    {
        db.Lots.Add(new Lot
        {
            Description = model.Description,
            CategoryID = model.CategoryID,
            WinningBid = model.HighestBid,
            WinningBidder = model.BidderID,
            Delivered = model.Delivered,
            Image = string.IsNullOrWhiteSpace(model.Image) ? null : model.Image
        });

        return await SaveChangesAsync();
    }

    public async Task<bool> UpdateLotAsync(int lotId, LotFormModel model)
    {
        var lot = await db.Lots.FindAsync(lotId);
        if (lot is null)
        {
            return false;
        }

        lot.Description = model.Description;
        lot.CategoryID = model.CategoryID;
        lot.WinningBid = model.HighestBid;
        lot.WinningBidder = model.BidderID;
        lot.Delivered = model.Delivered;
        lot.Image = string.IsNullOrWhiteSpace(model.Image) ? null : model.Image;

        return await SaveChangesAsync();
    }

    public async Task<bool> DeleteLotAsync(int lotId)
    {
        var lot = await db.Lots.FindAsync(lotId);
        if (lot is null)
        {
            return false;
        }

        db.Lots.Remove(lot);
        return await SaveChangesAsync();
    }

    private async Task<bool> SaveChangesAsync()
    {
        try
        {
            await db.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }
}
