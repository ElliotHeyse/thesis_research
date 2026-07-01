using Microsoft.EntityFrameworkCore;
using SilentAuction.Data;
using SilentAuction.Data.Entities;
using SilentAuction.Models;

namespace SilentAuction.Services;

public class CategoryService(ApplicationDbContext db)
{
    public async Task<List<Category>> GetCategoriesAsync() =>
        await db.Categories.ToListAsync();

    public async Task<Category?> GetCategoryAsync(int categoryId) =>
        await db.Categories.FindAsync(categoryId);

    public async Task<Category?> GetCategoryForBiddingSheetAsync(int categoryId) =>
        await db.Categories
            .Where(c => c.CategoryID == categoryId)
            .Select(c => new Category { CategoryID = c.CategoryID, Description = c.Description })
            .FirstOrDefaultAsync();

    public async Task<bool> AddCategoryAsync(CategoryFormModel model)
    {
        db.Categories.Add(new Category { Description = model.Description });
        return await SaveChangesAsync();
    }

    public async Task<bool> UpdateCategoryAsync(int categoryId, CategoryFormModel model)
    {
        var category = await db.Categories.FindAsync(categoryId);
        if (category is null)
        {
            return false;
        }

        category.Description = model.Description;
        return await SaveChangesAsync();
    }

    public async Task<bool> DeleteCategoryAsync(int categoryId)
    {
        var category = await db.Categories.FindAsync(categoryId);
        if (category is null)
        {
            return false;
        }

        db.Categories.Remove(category);
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

public class AuctionService(ApplicationDbContext db)
{
    public async Task<List<AuctionItemRow>> GetItemsAsync() =>
        await db.Items
            .Select(i => new AuctionItemRow
            {
                ItemID = i.ItemID,
                Description = i.Description,
                RetailValue = i.RetailValue,
                CategoryID = i.Lot != null ? i.Lot.CategoryID : null
            })
            .ToListAsync();

    public async Task<List<Category>> GetCategoryDescriptionsAsync() =>
        await db.Categories
            .Select(c => new Category { CategoryID = c.CategoryID, Description = c.Description })
            .ToListAsync();
}
