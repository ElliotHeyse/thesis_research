using SilentAuction.Data.Entities;
using SilentAuction.Data.Repositories;
using SilentAuction.Models;
using SilentAuction.Validation;

namespace SilentAuction.Services;

public class ItemService(IItemRepository itemRepository, IDonorRepository donorRepository)
{
    public Task<List<ItemListDto>> GetAllAsync() => itemRepository.GetAllWithDonorAndLotAsync();
    public Task<ItemDetailDto?> GetByIdAsync(int id) => itemRepository.GetByIdWithDetailsAsync(id);
    public Task<List<LotOptionDto>> GetLotOptionsAsync() => itemRepository.GetLotDescriptionsAsync();
    public Task<List<DonorSelectDto>> GetDonorOptionsAsync() => donorRepository.GetForSelectAsync();

    public async Task<OperationResult> SaveLotAssignmentsAsync(Dictionary<int, int?> assignments)
    {
        var normalized = assignments.ToDictionary(
            kvp => kvp.Key,
            kvp => kvp.Value is null or <= 0 ? null : kvp.Value);

        var ok = await itemRepository.BulkUpdateLotAssignmentsAsync(normalized);
        return ok ? OperationResult.Ok("updated") : OperationResult.Fail(OperationStatus.Failed, "update_failed");
    }

    public async Task<OperationResult> CreateAsync(ItemFormModel model)
    {
        var errors = ItemValidator.Validate(model);
        if (errors.Count > 0)
            return OperationResult.Fail(OperationStatus.ValidationError, "validation");

        var item = MapToEntity(model);
        var ok = await itemRepository.AddAsync(item);
        return ok ? OperationResult.Ok("created") : OperationResult.Fail(OperationStatus.Failed, "create_failed");
    }

    public async Task<OperationResult> UpdateAsync(int itemId, ItemFormModel model)
    {
        var existing = await itemRepository.GetByIdWithDetailsAsync(itemId);
        if (existing is null)
            return OperationResult.Fail(OperationStatus.NotFound, "notfound");

        var errors = ItemValidator.Validate(model);
        if (errors.Count > 0)
            return OperationResult.Fail(OperationStatus.ValidationError, "validation");

        var item = new Item
        {
            ItemID = itemId,
            Description = model.Description.Trim(),
            RetailValue = model.RetailValue,
            DonorID = model.DonorID,
            LotID = model.LotID is null or <= 0 ? null : model.LotID
        };

        var ok = await itemRepository.UpdateAsync(item);
        return ok ? OperationResult.Ok("updated") : OperationResult.Fail(OperationStatus.Failed, "update_failed");
    }

    public async Task<OperationResult> DeleteAsync(int itemId)
    {
        var existing = await itemRepository.GetByIdWithDetailsAsync(itemId);
        if (existing is null)
            return OperationResult.Fail(OperationStatus.NotFound, "notfound");

        var ok = await itemRepository.DeleteAsync(itemId);
        return ok ? OperationResult.Ok("deleted") : OperationResult.Fail(OperationStatus.Failed, "delete_failed");
    }

    public async Task<(ItemDetailDto? Item, Lot? Lot, Category? Category)> GetBiddingSheetDataAsync(int itemId)
    {
        var item = await itemRepository.GetByIdWithDetailsAsync(itemId);
        if (item is null) return (null, null, null);

        Lot? lot = null;
        Category? category = null;
        if (item.LotID.HasValue)
        {
            lot = await itemRepository.GetLotForBiddingSheetAsync(item.LotID.Value);
            if (lot?.CategoryID is int catId)
                category = await itemRepository.GetCategoryForBiddingSheetAsync(catId);
        }

        return (item, lot, category);
    }

    public static (decimal StartingBid, decimal Increment, int Rows) GetBiddingSheetDefaults(
        decimal retailValue, decimal? startingBid, decimal? increment, int? rows)
    {
        var start = startingBid ?? (retailValue > 0 ? retailValue * 0.5m : 10.00m);
        var inc = increment ?? 5.00m;
        var rowCount = rows ?? 15;
        return (start, inc, rowCount);
    }

    private static Item MapToEntity(ItemFormModel model) => new()
    {
        Description = model.Description.Trim(),
        RetailValue = model.RetailValue,
        DonorID = model.DonorID,
        LotID = model.LotID is null or <= 0 ? null : model.LotID
    };
}
