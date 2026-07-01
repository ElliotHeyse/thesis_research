using Microsoft.EntityFrameworkCore;
using SilentAuction.Data.Entities;
using SilentAuction.Models;

namespace SilentAuction.Data.Repositories;

public class DonorRepository(SilentAuctionDbContext db) : IDonorRepository
{
    public async Task<List<Donor>> GetAllAsync() =>
        await db.Donors
            .OrderBy(d => d.BusinessName)
            .ThenBy(d => d.ContactName)
            .ToListAsync();

    public async Task<Donor?> GetByIdAsync(int donorId) =>
        await db.Donors.FindAsync(donorId);

    public async Task<List<DonorSelectDto>> GetForSelectAsync() =>
        await db.Donors
            .OrderBy(d => d.BusinessName)
            .ThenBy(d => d.ContactName)
            .Select(d => new DonorSelectDto
            {
                DonorID = d.DonorID,
                BusinessName = d.BusinessName,
                ContactName = d.ContactName
            })
            .ToListAsync();

    public async Task<List<DonorPendingReceiptDto>> GetWithoutReceiptAsync() =>
        await db.Donors
            .Where(d => !d.TaxReceipt)
            .SelectMany(d => d.Items, (d, i) => new { Donor = d, Item = i })
            .GroupBy(x => x.Donor.DonorID)
            .Select(g => new DonorPendingReceiptDto
            {
                DonorID = g.First().Donor.DonorID,
                BusinessName = g.First().Donor.BusinessName,
                ContactName = g.First().Donor.ContactName,
                ContactEmail = g.First().Donor.ContactEmail,
                ContactTitle = g.First().Donor.ContactTitle,
                Address = g.First().Donor.Address,
                City = g.First().Donor.City,
                State = g.First().Donor.State,
                ZipCode = g.First().Donor.ZipCode,
                TaxReceipt = g.First().Donor.TaxReceipt,
                TotalItems = g.Count(),
                TotalValue = g.Sum(x => x.Item.RetailValue)
            })
            .OrderBy(d => d.ContactName)
            .ThenBy(d => d.BusinessName)
            .ToListAsync();

    public async Task<List<Item>> GetItemsByDonorIdAsync(int donorId) =>
        await db.Items
            .Where(i => i.DonorID == donorId)
            .OrderBy(i => i.Description)
            .ToListAsync();

    public async Task<bool> DonorHasItemsAsync(int donorId) =>
        await db.Items.AnyAsync(i => i.DonorID == donorId);

    public async Task<bool> AddAsync(Donor donor)
    {
        db.Donors.Add(donor);
        return await SaveAsync();
    }

    public async Task<bool> UpdateAsync(Donor donor)
    {
        db.Donors.Update(donor);
        return await SaveAsync();
    }

    public async Task<bool> DeleteAsync(int donorId)
    {
        var donor = await db.Donors.FindAsync(donorId);
        if (donor is null) return false;
        db.Donors.Remove(donor);
        return await SaveAsync();
    }

    public async Task<bool> MarkReceiptSentAsync(int donorId)
    {
        var donor = await db.Donors.FindAsync(donorId);
        if (donor is null) return false;
        donor.TaxReceipt = true;
        return await SaveAsync();
    }

    private async Task<bool> SaveAsync()
    {
        try
        {
            await db.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }
}
