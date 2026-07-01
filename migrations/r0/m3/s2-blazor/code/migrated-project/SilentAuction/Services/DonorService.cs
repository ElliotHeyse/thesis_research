using SilentAuction.Data.Entities;
using SilentAuction.Data.Repositories;
using SilentAuction.Models;
using SilentAuction.Validation;

namespace SilentAuction.Services;

public class DonorService(IDonorRepository donorRepository)
{
    public Task<List<Donor>> GetAllAsync() => donorRepository.GetAllAsync();
    public Task<Donor?> GetByIdAsync(int id) => donorRepository.GetByIdAsync(id);
    public Task<List<DonorPendingReceiptDto>> GetPendingReceiptsAsync() => donorRepository.GetWithoutReceiptAsync();

    public async Task<List<Donor>> GetEligibleForReceiptAsync()
    {
        var all = await donorRepository.GetAllAsync();
        var eligible = new List<Donor>();
        foreach (var donor in all)
        {
            if (donor.TaxReceipt) continue;
            var items = await donorRepository.GetItemsByDonorIdAsync(donor.DonorID);
            if (items.Count > 0) eligible.Add(donor);
        }
        return eligible;
    }

    public async Task<OperationResult> CreateAsync(DonorFormModel model)
    {
        var errors = DonorValidator.Validate(model);
        if (errors.Count > 0)
            return OperationResult.Fail(OperationStatus.ValidationError, "validation");

        var donor = MapToEntity(model);
        var ok = await donorRepository.AddAsync(donor);
        return ok ? OperationResult.Ok("created") : OperationResult.Fail(OperationStatus.Failed, "create_failed");
    }

    public async Task<OperationResult> UpdateAsync(int donorId, DonorFormModel model)
    {
        var existing = await donorRepository.GetByIdAsync(donorId);
        if (existing is null)
            return OperationResult.Fail(OperationStatus.NotFound, "notfound");

        var errors = DonorValidator.Validate(model);
        if (errors.Count > 0)
            return OperationResult.Fail(OperationStatus.ValidationError, "validation");

        MapToEntity(model, existing);
        var ok = await donorRepository.UpdateAsync(existing);
        return ok ? OperationResult.Ok("updated") : OperationResult.Fail(OperationStatus.Failed, "update_failed");
    }

    public async Task<OperationResult> DeleteAsync(int donorId)
    {
        var donor = await donorRepository.GetByIdAsync(donorId);
        if (donor is null)
            return OperationResult.Fail(OperationStatus.NotFound, "notfound");

        if (await donorRepository.DonorHasItemsAsync(donorId))
            return OperationResult.Fail(OperationStatus.HasItems, "has_items");

        var ok = await donorRepository.DeleteAsync(donorId);
        return ok ? OperationResult.Ok("deleted") : OperationResult.Fail(OperationStatus.Failed, "delete_failed");
    }

    public async Task<List<DonorWithItemsDto>> PrepareTaxReceiptsAsync(IEnumerable<int> donorIds)
    {
        var result = new List<DonorWithItemsDto>();
        foreach (var donorId in donorIds)
        {
            var donor = await donorRepository.GetByIdAsync(donorId);
            if (donor is null) continue;
            var items = await donorRepository.GetItemsByDonorIdAsync(donorId);
            await donorRepository.MarkReceiptSentAsync(donorId);
            result.Add(new DonorWithItemsDto { Donor = donor, Items = items });
        }
        return result;
    }

    public async Task<List<Donor>> GetDonorsForLettersAsync(IEnumerable<int> donorIds)
    {
        var result = new List<Donor>();
        foreach (var donorId in donorIds)
        {
            var donor = await donorRepository.GetByIdAsync(donorId);
            if (donor is not null) result.Add(donor);
        }
        return result;
    }

    private static Donor MapToEntity(DonorFormModel model, Donor? existing = null)
    {
        var donor = existing ?? new Donor();
        donor.BusinessName = string.IsNullOrWhiteSpace(model.BusinessName) ? null : model.BusinessName.Trim();
        donor.ContactName = model.ContactName.Trim();
        donor.ContactEmail = model.ContactEmail?.Trim() ?? string.Empty;
        donor.ContactTitle = string.IsNullOrWhiteSpace(model.ContactTitle) ? null : model.ContactTitle.Trim();
        donor.Address = model.Address?.Trim() ?? string.Empty;
        donor.City = model.City?.Trim() ?? string.Empty;
        donor.State = model.State?.Trim() ?? string.Empty;
        donor.ZipCode = model.ZipCode?.Trim() ?? string.Empty;
        donor.TaxReceipt = model.TaxReceipt;
        return donor;
    }
}
