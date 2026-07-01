using Microsoft.EntityFrameworkCore;
using SilentAuction.Data.Entities;

namespace SilentAuction.Data.Repositories;

public class CategoryRepository(SilentAuctionDbContext db) : ICategoryRepository
{
    public async Task<List<Category>> GetAllAsync() =>
        await db.Categories.ToListAsync();

    public async Task<Category?> GetByIdAsync(int categoryId) =>
        await db.Categories.FindAsync(categoryId);

    public async Task<bool> AddAsync(Category category)
    {
        db.Categories.Add(category);
        return await SaveAsync();
    }

    public async Task<bool> UpdateAsync(Category category)
    {
        db.Categories.Update(category);
        return await SaveAsync();
    }

    public async Task<bool> DeleteAsync(int categoryId)
    {
        var category = await db.Categories.FindAsync(categoryId);
        if (category is null) return false;
        db.Categories.Remove(category);
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
