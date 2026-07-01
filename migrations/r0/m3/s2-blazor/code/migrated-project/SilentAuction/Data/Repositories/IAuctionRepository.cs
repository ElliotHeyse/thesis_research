using SilentAuction.Models;

namespace SilentAuction.Data.Repositories;

public interface IAuctionRepository
{
    Task<List<AuctionItemDto>> GetItemsWithCategoryIdAsync();
    Task<List<(int CategoryID, string Description)>> GetCategoryDescriptionsAsync();
}
