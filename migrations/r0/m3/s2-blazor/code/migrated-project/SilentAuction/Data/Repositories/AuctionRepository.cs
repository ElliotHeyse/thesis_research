using Microsoft.EntityFrameworkCore;
using SilentAuction.Models;

namespace SilentAuction.Data.Repositories;

public class AuctionRepository(SilentAuctionDbContext db) : IAuctionRepository
{
    public async Task<List<AuctionItemDto>> GetItemsWithCategoryIdAsync() =>
        await db.Items
            .Select(i => new AuctionItemDto
            {
                ItemID = i.ItemID,
                Description = i.Description,
                RetailValue = i.RetailValue,
                CategoryID = i.Lot != null ? i.Lot.CategoryID : null
            })
            .ToListAsync();

    public async Task<List<(int CategoryID, string Description)>> GetCategoryDescriptionsAsync() =>
        await db.Categories
            .Select(c => new ValueTuple<int, string>(c.CategoryID, c.Description))
            .ToListAsync();
}
