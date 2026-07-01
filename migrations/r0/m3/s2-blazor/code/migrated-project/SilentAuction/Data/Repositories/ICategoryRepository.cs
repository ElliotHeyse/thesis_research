using SilentAuction.Data.Entities;

namespace SilentAuction.Data.Repositories;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(int categoryId);
    Task<bool> AddAsync(Category category);
    Task<bool> UpdateAsync(Category category);
    Task<bool> DeleteAsync(int categoryId);
}
