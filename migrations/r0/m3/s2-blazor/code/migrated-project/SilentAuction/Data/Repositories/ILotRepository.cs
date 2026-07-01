using SilentAuction.Data.Entities;
using SilentAuction.Models;

namespace SilentAuction.Data.Repositories;

public interface ILotRepository
{
    Task<List<LotListDto>> GetAllWithWinnerAndCategoryAsync();
    Task<LotDetailDto?> GetByIdAsync(int lotId);
    Task<List<BidderOptionDto>> GetBiddersAsync();
    Task<bool> AddAsync(Lot lot);
    Task<bool> UpdateAsync(Lot lot);
    Task<bool> DeleteAsync(int lotId);
}
