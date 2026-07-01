using Microsoft.EntityFrameworkCore;
using SilentAuction.Data.Entities;
using SilentAuction.Models;

namespace SilentAuction.Data.Repositories;

public class ItemRepository(SilentAuctionDbContext db) : IItemRepository
{
    public async Task<List<ItemListDto>> GetAllWithDonorAndLotAsync()
    {
        var unassigned = await QueryItemsList(i => i.LotID == null);
        var assigned = await QueryItemsList(i => i.LotID != null);
        return unassigned.Concat(assigned).ToList();
    }

    private async Task<List<ItemListDto>> QueryItemsList(System.Linq.Expressions.Expression<Func<Item, bool>> predicate) =>
        await db.Items
            .Where(predicate)
            .OrderBy(i => i.ItemID)
            .Select(i => new ItemListDto
            {
                ItemID = i.ItemID,
                Description = i.Description,
                RetailValue = i.RetailValue,
                DonorID = i.DonorID,
                LotID = i.LotID,
                BusinessName = i.Donor.BusinessName,
                LotDescription = i.Lot != null ? i.Lot.Description : null
            })
            .ToListAsync();

    public async Task<ItemDetailDto?> GetByIdWithDetailsAsync(int itemId) =>
        await db.Items
            .Where(i => i.ItemID == itemId)
            .Select(i => new ItemDetailDto
            {
                ItemID = i.ItemID,
                Description = i.Description,
                RetailValue = i.RetailValue,
                DonorID = i.DonorID,
                LotID = i.LotID,
                BusinessName = i.Donor.BusinessName,
                ContactName = i.Donor.ContactName,
                ContactEmail = i.Donor.ContactEmail,
                ContactTitle = i.Donor.ContactTitle,
                LotDescription = i.Lot != null ? i.Lot.Description : null,
                CategoryID = i.Lot != null ? i.Lot.CategoryID : null
            })
            .FirstOrDefaultAsync();

    public async Task<List<Item>> GetByLotIdAsync(int lotId) =>
        await db.Items
            .Include(i => i.Donor)
            .Where(i => i.LotID == lotId)
            .OrderBy(i => i.ItemID)
            .ToListAsync();

    public async Task<List<LotOptionDto>> GetLotDescriptionsAsync() =>
        await db.Lots
            .Select(l => new LotOptionDto { LotID = l.LotID, Description = l.Description })
            .ToListAsync();

    public async Task<Lot?> GetLotForBiddingSheetAsync(int lotId) =>
        await db.Lots.FindAsync(lotId);

    public async Task<Category?> GetCategoryForBiddingSheetAsync(int categoryId) =>
        await db.Categories.FindAsync(categoryId);

    public async Task<bool> BulkUpdateLotAssignmentsAsync(Dictionary<int, int?> assignments)
    {
        if (assignments.Count == 0) return true;

        try
        {
            foreach (var (itemId, lotId) in assignments)
            {
                var item = await db.Items.FindAsync(itemId);
                if (item is null) continue;
                item.LotID = lotId;
            }

            await db.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> AddAsync(Item item)
    {
        db.Items.Add(item);
        return await SaveAsync();
    }

    public async Task<bool> UpdateAsync(Item item)
    {
        db.Items.Update(item);
        return await SaveAsync();
    }

    public async Task<bool> DeleteAsync(int itemId)
    {
        var item = await db.Items.FindAsync(itemId);
        if (item is null) return false;
        db.Items.Remove(item);
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
