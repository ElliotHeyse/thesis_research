using SilentAuction.Data.Entities;
using SilentAuction.Models;

namespace SilentAuction.Data.Repositories;

public interface IDonorRepository
{
    Task<List<Donor>> GetAllAsync();
    Task<Donor?> GetByIdAsync(int donorId);
    Task<List<DonorSelectDto>> GetForSelectAsync();
    Task<List<DonorPendingReceiptDto>> GetWithoutReceiptAsync();
    Task<List<Item>> GetItemsByDonorIdAsync(int donorId);
    Task<bool> DonorHasItemsAsync(int donorId);
    Task<bool> AddAsync(Donor donor);
    Task<bool> UpdateAsync(Donor donor);
    Task<bool> DeleteAsync(int donorId);
    Task<bool> MarkReceiptSentAsync(int donorId);
}
