using Microsoft.EntityFrameworkCore;
using SilentAuction.Data.Entities;
using SilentAuction.Models;

namespace SilentAuction.Data.Repositories;

public class LotRepository(SilentAuctionDbContext db) : ILotRepository
{
    public async Task<List<LotListDto>> GetAllWithWinnerAndCategoryAsync() =>
        await db.Lots
            .OrderBy(l => l.LotID)
            .Select(l => new LotListDto
            {
                LotID = l.LotID,
                Description = l.Description,
                WinningBid = l.WinningBid,
                Winner = l.Winner != null ? l.Winner.Name : null,
                Delivered = l.Delivered,
                Category = l.Category != null ? l.Category.Description : null
            })
            .ToListAsync();

    public async Task<LotDetailDto?> GetByIdAsync(int lotId) =>
        await db.Lots
            .Where(l => l.LotID == lotId)
            .Select(l => new LotDetailDto
            {
                LotID = l.LotID,
                Description = l.Description,
                CategoryID = l.CategoryID,
                CategoryDescription = l.Category != null ? l.Category.Description : null,
                WinningBid = l.WinningBid,
                WinningBidder = l.WinningBidder,
                WinnerName = l.Winner != null ? l.Winner.Name : null,
                Delivered = l.Delivered,
                Image = l.Image
            })
            .FirstOrDefaultAsync();

    public async Task<List<BidderOptionDto>> GetBiddersAsync() =>
        await db.Bidders
            .Select(b => new BidderOptionDto { BidderID = b.BidderID, Name = b.Name })
            .ToListAsync();

    public async Task<bool> AddAsync(Lot lot)
    {
        db.Lots.Add(lot);
        return await SaveAsync();
    }

    public async Task<bool> UpdateAsync(Lot lot)
    {
        db.Lots.Update(lot);
        return await SaveAsync();
    }

    public async Task<bool> DeleteAsync(int lotId)
    {
        var lot = await db.Lots.FindAsync(lotId);
        if (lot is null) return false;
        db.Lots.Remove(lot);
        return await SaveAsync();
    }

    private async Task<bool> SaveAsync()
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
