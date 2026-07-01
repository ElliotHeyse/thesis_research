using Microsoft.EntityFrameworkCore;
using SilentAuction.Data;
using SilentAuction.Data.Entities;
using SilentAuction.Models;

namespace SilentAuction.Services;

public class ItemService(ApplicationDbContext db)
{
    public async Task<List<ItemListRow>> GetItemsAsync()
    {
        var unassigned = await db.Items
            .Where(i => i.LotID == null)
            .OrderBy(i => i.ItemID)
            .Select(i => new ItemListRow
            {
                ItemID = i.ItemID,
                Description = i.Description,
                RetailValue = i.RetailValue,
                DonorID = i.DonorID,
                LotID = i.LotID,
                BusinessName = i.Donor.BusinessName,
                LotDescription = null
            })
            .ToListAsync();

        var assigned = await db.Items
            .Where(i => i.LotID != null)
            .OrderBy(i => i.ItemID)
            .Select(i => new ItemListRow
            {
                ItemID = i.ItemID,
                Description = i.Description,
                RetailValue = i.RetailValue,
                DonorID = i.DonorID,
                LotID = i.LotID,
                BusinessName = i.Donor.BusinessName,
                LotDescription = i.Lot!.Description
            })
            .ToListAsync();

        unassigned.AddRange(assigned);
        return unassigned;
    }

    public async Task<List<Lot>> GetLotDescriptionsAsync() =>
        await db.Lots
            .Select(l => new Lot { LotID = l.LotID, Description = l.Description })
            .ToListAsync();

    public async Task<ItemDetailRow?> GetItemByIdAsync(int itemId) =>
        await db.Items
            .Where(i => i.ItemID == itemId)
            .Select(i => new ItemDetailRow
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

    public async Task<bool> ModifyItemsAsync(IReadOnlyList<LotAssignmentChange> changes)
    {
        if (changes.Count == 0)
        {
            return true;
        }

        var itemIds = changes.Select(c => c.ItemID).ToList();
        var items = await db.Items.Where(i => itemIds.Contains(i.ItemID)).ToListAsync();

        foreach (var change in changes)
        {
            var item = items.FirstOrDefault(i => i.ItemID == change.ItemID);
            if (item is null)
            {
                continue;
            }

            item.LotID = change.NewLotID == -1 ? null : change.NewLotID;
        }

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

    public async Task<bool> AddItemAsync(ItemFormModel model)
    {
        db.Items.Add(new Item
        {
            Description = model.Description,
            RetailValue = model.RetailValue!.Value,
            DonorID = model.DonorID!.Value,
            LotID = model.LotID
        });

        return await SaveChangesAsync();
    }

    public async Task<bool> UpdateItemAsync(int itemId, ItemFormModel model)
    {
        var item = await db.Items.FindAsync(itemId);
        if (item is null)
        {
            return false;
        }

        item.Description = model.Description;
        item.RetailValue = model.RetailValue!.Value;
        item.DonorID = model.DonorID!.Value;
        item.LotID = model.LotID;

        return await SaveChangesAsync();
    }

    public async Task<bool> DeleteItemAsync(int itemId)
    {
        var item = await db.Items.FindAsync(itemId);
        if (item is null)
        {
            return false;
        }

        db.Items.Remove(item);
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
