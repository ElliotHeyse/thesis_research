using SilentAuction.Data.Repositories;
using SilentAuction.Models;

namespace SilentAuction.Services;

public class AuctionService(IAuctionRepository auctionRepository)
{
    public async Task<List<(string CategoryName, List<AuctionItemDto> Items)>> GetCatalogByCategoryAsync()
    {
        var items = await auctionRepository.GetItemsWithCategoryIdAsync();
        var categories = await auctionRepository.GetCategoryDescriptionsAsync();

        var grouped = items
            .Where(i => i.CategoryID.HasValue)
            .GroupBy(i => i.CategoryID!.Value)
            .ToDictionary(g => g.Key, g => g.ToList());

        return categories
            .Select(c => (c.Description, grouped.GetValueOrDefault(c.CategoryID) ?? []))
            .ToList();
    }
}
