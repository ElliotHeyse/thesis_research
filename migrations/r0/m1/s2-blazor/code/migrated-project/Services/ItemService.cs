using Microsoft.EntityFrameworkCore;
using migrated_project.Data;
using migrated_project.Models;

namespace migrated_project.Services;

public class ItemService(AuctionDbContext db)
{
    public async Task<List<ItemListRow>> GetAllAsync(CancellationToken ct = default)
    {
        var unassigned = await QueryItems(null, ct);
        var assigned = await QueryItems(notNull: true, ct);
        return unassigned.Concat(assigned).ToList();
    }

    private async Task<List<ItemListRow>> QueryItems(bool? notNull, CancellationToken ct)
    {
        var query = db.Items
            .Include(i => i.Donor)
            .Include(i => i.Lot)
            .AsQueryable();

        query = notNull switch
        {
            null => query.Where(i => i.LotID == null),
            true => query.Where(i => i.LotID != null),
            _ => query
        };

        return await query
            .OrderBy(i => i.ItemID)
            .Select(i => new ItemListRow
            {
                ItemID = i.ItemID,
                Description = i.Description,
                RetailValue = i.RetailValue,
                DonorID = i.DonorID,
                LotID = i.LotID,
                BusinessName = i.Donor!.BusinessName,
                LotDescription = i.Lot != null ? i.Lot.Description : null
            })
            .ToListAsync(ct);
    }

    public async Task<List<(int LotID, string Description)>> GetLotDescriptionsAsync(CancellationToken ct = default) =>
        await db.Lots
            .OrderBy(l => l.LotID)
            .Select(l => new ValueTuple<int, string>(l.LotID, l.Description))
            .ToListAsync(ct);

    public async Task<Item?> GetByIdAsync(int id, CancellationToken ct = default) =>
        await db.Items.FindAsync([id], ct);

    public async Task<BiddingSheetItem?> GetForBiddingSheetAsync(int itemId, CancellationToken ct = default)
    {
        var item = await db.Items
            .Include(i => i.Donor)
            .Include(i => i.Lot)
            .FirstOrDefaultAsync(i => i.ItemID == itemId, ct);

        if (item is null)
            return null;

        Category? category = null;
        if (item.Lot?.CategoryID is int categoryId)
            category = await db.Categories.FindAsync([categoryId], ct);

        return new BiddingSheetItem
        {
            ItemID = item.ItemID,
            Description = item.Description,
            RetailValue = item.RetailValue,
            LotID = item.LotID,
            BusinessName = item.Donor?.BusinessName,
            ContactName = item.Donor?.ContactName,
            LotDescription = item.Lot?.Description,
            CategoryID = item.Lot?.CategoryID,
            CategoryDescription = category?.Description
        };
    }

    public async Task<bool> ModifyLotAssignmentsAsync(IEnumerable<ItemLotChange> changes, CancellationToken ct = default)
    {
        foreach (var change in changes)
        {
            var item = await db.Items.FindAsync([change.ItemID], ct);
            if (item is null)
                continue;

            item.LotID = change.NewLotID == -1 ? null : change.NewLotID;
        }

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

    public async Task<bool> AddAsync(Item item, CancellationToken ct = default)
    {
        db.Items.Add(item);
        return await SaveAsync(ct);
    }

    public async Task<bool> UpdateAsync(Item item, CancellationToken ct = default)
    {
        db.Items.Update(item);
        return await SaveAsync(ct);
    }

    public async Task<bool> DeleteAsync(int itemId, CancellationToken ct = default)
    {
        var item = await db.Items.FindAsync([itemId], ct);
        if (item is null)
            return false;

        db.Items.Remove(item);
        return await SaveAsync(ct);
    }

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
