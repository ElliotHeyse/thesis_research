using SilentAuction.Data.Entities;
using SilentAuction.Data.Repositories;
using SilentAuction.Models;
using SilentAuction.Validation;

namespace SilentAuction.Services;

public class LotService(ILotRepository lotRepository, IItemRepository itemRepository)
{
    public Task<List<LotListDto>> GetAllAsync() => lotRepository.GetAllWithWinnerAndCategoryAsync();
    public Task<LotDetailDto?> GetByIdAsync(int id) => lotRepository.GetByIdAsync(id);
    public Task<List<BidderOptionDto>> GetBiddersAsync() => lotRepository.GetBiddersAsync();
    public Task<List<Item>> GetItemsByLotIdAsync(int lotId) => itemRepository.GetByLotIdAsync(lotId);

    public async Task<OperationResult> CreateAsync(LotFormModel model)
    {
        var errors = LotValidator.Validate(model);
        if (errors.Count > 0)
            return OperationResult.Fail(OperationStatus.ValidationError, "validation");

        var lot = MapToEntity(model);
        var ok = await lotRepository.AddAsync(lot);
        return ok ? OperationResult.Ok("created") : OperationResult.Fail(OperationStatus.Failed, "create_failed");
    }

    public async Task<OperationResult> UpdateAsync(int lotId, LotFormModel model)
    {
        var existing = await lotRepository.GetByIdAsync(lotId);
        if (existing is null)
            return OperationResult.Fail(OperationStatus.NotFound, "notfound");

        var errors = LotValidator.Validate(model);
        if (errors.Count > 0)
            return OperationResult.Fail(OperationStatus.ValidationError, "validation");

        var lot = new Lot
        {
            LotID = lotId,
            Description = model.Description.Trim(),
            CategoryID = model.CategoryID,
            WinningBid = model.WinningBid,
            WinningBidder = model.WinningBidder,
            Delivered = model.Delivered,
            Image = string.IsNullOrWhiteSpace(model.Image) ? null : model.Image.Trim()
        };

        var ok = await lotRepository.UpdateAsync(lot);
        return ok ? OperationResult.Ok("updated") : OperationResult.Fail(OperationStatus.Failed, "update_failed");
    }

    public async Task<OperationResult> DeleteAsync(int lotId)
    {
        var existing = await lotRepository.GetByIdAsync(lotId);
        if (existing is null)
            return OperationResult.Fail(OperationStatus.NotFound, "notfound");

        var ok = await lotRepository.DeleteAsync(lotId);
        return ok ? OperationResult.Ok("deleted") : OperationResult.Fail(OperationStatus.Failed, "delete_failed");
    }

    private static Lot MapToEntity(LotFormModel model) => new()
    {
        Description = model.Description.Trim(),
        CategoryID = model.CategoryID,
        WinningBid = model.WinningBid,
        WinningBidder = model.WinningBidder,
        Delivered = model.Delivered,
        Image = string.IsNullOrWhiteSpace(model.Image) ? null : model.Image.Trim()
    };
}
