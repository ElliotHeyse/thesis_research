using SilentAuction.Data.Entities;
using SilentAuction.Models;

namespace SilentAuction.Data.Repositories;

public interface IItemRepository
{
    Task<List<ItemListDto>> GetAllWithDonorAndLotAsync();
    Task<ItemDetailDto?> GetByIdWithDetailsAsync(int itemId);
    Task<List<Item>> GetByLotIdAsync(int lotId);
    Task<List<LotOptionDto>> GetLotDescriptionsAsync();
    Task<Lot?> GetLotForBiddingSheetAsync(int lotId);
    Task<Category?> GetCategoryForBiddingSheetAsync(int categoryId);
    Task<bool> BulkUpdateLotAssignmentsAsync(Dictionary<int, int?> assignments);
    Task<bool> AddAsync(Item item);
    Task<bool> UpdateAsync(Item item);
    Task<bool> DeleteAsync(int itemId);
}
