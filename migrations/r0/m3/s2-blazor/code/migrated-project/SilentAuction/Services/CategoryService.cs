using SilentAuction.Data.Entities;
using SilentAuction.Data.Repositories;
using SilentAuction.Models;
using SilentAuction.Validation;

namespace SilentAuction.Services;

public class CategoryService(ICategoryRepository categoryRepository)
{
    public Task<List<Category>> GetAllAsync() => categoryRepository.GetAllAsync();
    public Task<Category?> GetByIdAsync(int id) => categoryRepository.GetByIdAsync(id);

    public async Task<OperationResult> CreateAsync(CategoryFormModel model)
    {
        var errors = CategoryValidator.Validate(model);
        if (errors.Count > 0)
            return OperationResult.Fail(OperationStatus.ValidationError, "validation");

        var ok = await categoryRepository.AddAsync(new Category { Description = model.Description.Trim() });
        return ok ? OperationResult.Ok("created") : OperationResult.Fail(OperationStatus.Failed, "create_failed");
    }

    public async Task<OperationResult> UpdateAsync(int categoryId, CategoryFormModel model)
    {
        var existing = await categoryRepository.GetByIdAsync(categoryId);
        if (existing is null)
            return OperationResult.Fail(OperationStatus.NotFound, "notfound");

        var errors = CategoryValidator.Validate(model);
        if (errors.Count > 0)
            return OperationResult.Fail(OperationStatus.ValidationError, "validation");

        existing.Description = model.Description.Trim();
        var ok = await categoryRepository.UpdateAsync(existing);
        return ok ? OperationResult.Ok("updated") : OperationResult.Fail(OperationStatus.Failed, "update_failed");
    }

    public async Task<OperationResult> DeleteAsync(int categoryId)
    {
        var existing = await categoryRepository.GetByIdAsync(categoryId);
        if (existing is null)
            return OperationResult.Fail(OperationStatus.NotFound, "notfound");

        var ok = await categoryRepository.DeleteAsync(categoryId);
        return ok ? OperationResult.Ok("deleted") : OperationResult.Fail(OperationStatus.Failed, "delete_failed");
    }
}
