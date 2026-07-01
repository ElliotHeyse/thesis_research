using Microsoft.EntityFrameworkCore;
using migrated_project.Data;
using migrated_project.Models;

namespace migrated_project.Services;

public class AuctionService(AuctionDbContext db)
{
    public async Task<List<AuctionItemRow>> GetItemsAsync(CancellationToken ct = default) =>
        await db.Items
            .Include(i => i.Lot)
            .Select(i => new AuctionItemRow
            {
                ItemID = i.ItemID,
                Description = i.Description,
                RetailValue = i.RetailValue,
                CategoryID = i.Lot != null ? i.Lot.CategoryID : null
            })
            .ToListAsync(ct);

    public async Task<List<Category>> GetCategoriesAsync(CancellationToken ct = default) =>
        await db.Categories.OrderBy(c => c.CategoryID).ToListAsync(ct);
}
