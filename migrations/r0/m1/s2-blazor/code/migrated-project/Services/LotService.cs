using Microsoft.EntityFrameworkCore;
using migrated_project.Data;
using migrated_project.Models;
using migrated_project.Models.Forms;

namespace migrated_project.Services;

public class LotService(AuctionDbContext db)
{
    public async Task<List<LotListRow>> GetAllAsync(CancellationToken ct = default) =>
        await db.Lots
            .Include(l => l.Winner)
            .Include(l => l.Category)
            .OrderBy(l => l.LotID)
            .Select(l => new LotListRow
            {
                LotID = l.LotID,
                Description = l.Description,
                WinningBid = l.WinningBid,
                Winner = l.Winner != null ? l.Winner.Name : null,
                Delivered = l.Delivered,
                Category = l.Category != null ? l.Category.Description : null
            })
            .ToListAsync(ct);

    public async Task<Lot?> GetByIdAsync(int id, CancellationToken ct = default) =>
        await db.Lots
            .Include(l => l.Winner)
            .Include(l => l.Category)
            .FirstOrDefaultAsync(l => l.LotID == id, ct);

    public async Task<List<(int BidderID, string Name)>> GetBiddersAsync(CancellationToken ct = default) =>
        await db.Bidders
            .OrderBy(b => b.Name)
            .Select(b => new ValueTuple<int, string>(b.BidderID, b.Name))
            .ToListAsync(ct);

    public async Task<bool> AddAsync(Lot lot, CancellationToken ct = default)
    {
        db.Lots.Add(lot);
        return await SaveAsync(ct);
    }

    public async Task<bool> UpdateAsync(Lot lot, CancellationToken ct = default)
    {
        db.Lots.Update(lot);
        return await SaveAsync(ct);
    }

    public async Task DeleteAsync(int lotId, CancellationToken ct = default)
    {
        var lot = await db.Lots.FindAsync([lotId], ct);
        if (lot is not null)
        {
            db.Lots.Remove(lot);
            await db.SaveChangesAsync(ct);
        }
    }

    public Lot FromForm(LotFormModel model) => new()
    {
        LotID = model.LotID ?? 0,
        Description = model.Description,
        CategoryID = model.CategoryID,
        WinningBid = model.HighestBid,
        WinningBidder = model.BidderID,
        Delivered = model.Delivered,
        Image = string.IsNullOrWhiteSpace(model.Image) ? null : model.Image.Trim()
    };

    private async Task<bool> SaveAsync(CancellationToken ct)
    {
        try
        {
            await db.SaveChangesAsync(ct);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
