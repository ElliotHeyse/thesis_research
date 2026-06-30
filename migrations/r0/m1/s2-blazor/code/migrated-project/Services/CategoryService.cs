using Microsoft.EntityFrameworkCore;
using migrated_project.Data;
using migrated_project.Models;

namespace migrated_project.Services;

public class CategoryService(AuctionDbContext db)
{
    public async Task<List<Category>> GetAllAsync(CancellationToken ct = default) =>
        await db.Categories.ToListAsync(ct);

    public async Task<Category?> GetByIdAsync(int id, CancellationToken ct = default) =>
        await db.Categories.FindAsync([id], ct);

    public async Task<bool> AddAsync(Category category, CancellationToken ct = default)
    {
        db.Categories.Add(category);
        return await SaveAsync(ct);
    }

    public async Task<bool> UpdateAsync(Category category, CancellationToken ct = default)
    {
        db.Categories.Update(category);
        return await SaveAsync(ct);
    }

    public async Task DeleteAsync(int categoryId, CancellationToken ct = default)
    {
        var category = await db.Categories.FindAsync([categoryId], ct);
        if (category is not null)
        {
            db.Categories.Remove(category);
            await db.SaveChangesAsync(ct);
        }
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
