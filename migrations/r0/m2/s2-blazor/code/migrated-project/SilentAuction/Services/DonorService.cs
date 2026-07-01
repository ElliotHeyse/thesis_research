using Microsoft.EntityFrameworkCore;
using SilentAuction.Data;
using SilentAuction.Data.Entities;
using SilentAuction.Models;

namespace SilentAuction.Services;

public class DonorService(ApplicationDbContext db)
{
    public async Task<List<Donor>> GetDonorsAsync() =>
        await db.Donors
            .OrderBy(d => d.BusinessName)
            .ThenBy(d => d.ContactName)
            .ToListAsync();

    public async Task<Donor?> GetDonorAsync(int donorId) =>
        await db.Donors.FindAsync(donorId);

    public async Task<List<Donor>> GetDonorsForSelectAsync() =>
        await db.Donors
            .OrderBy(d => d.BusinessName)
            .ThenBy(d => d.ContactName)
            .Select(d => new Donor
            {
                DonorID = d.DonorID,
                BusinessName = d.BusinessName,
                ContactName = d.ContactName
            })
            .ToListAsync();

    public async Task<List<PendingReceiptRow>> GetDonorsWithoutReceiptAsync()
    {
        return await db.Donors
            .Where(d => !d.TaxReceipt)
            .SelectMany(d => d.Items, (d, i) => new { Donor = d, Item = i })
            .GroupBy(x => x.Donor.DonorID)
            .Select(g => new PendingReceiptRow
            {
                DonorID = g.First().Donor.DonorID,
                BusinessName = g.First().Donor.BusinessName,
                ContactName = g.First().Donor.ContactName,
                ContactEmail = g.First().Donor.ContactEmail,
                City = g.First().Donor.City,
                State = g.First().Donor.State,
                TaxReceipt = g.First().Donor.TaxReceipt,
                TotalItems = g.Count(),
                TotalValue = g.Sum(x => x.Item.RetailValue)
            })
            .OrderBy(d => d.ContactName)
            .ThenBy(d => d.BusinessName)
            .ToListAsync();
    }

    public async Task<List<Donor>> GetDonorsEligibleForReceiptAsync()
    {
        return await db.Donors
            .Include(d => d.Items)
            .Where(d => !d.TaxReceipt && d.Items.Any())
            .OrderBy(d => d.BusinessName)
            .ThenBy(d => d.ContactName)
            .ToListAsync();
    }

    public async Task<List<Item>> GetItemsByDonorIdAsync(int donorId) =>
        await db.Items
            .Where(i => i.DonorID == donorId)
            .OrderBy(i => i.Description)
            .ToListAsync();

    public async Task<bool> DonorHasItemsAsync(int donorId) =>
        await db.Items.AnyAsync(i => i.DonorID == donorId);

    public async Task<bool> AddDonorAsync(DonorFormModel model)
    {
        db.Donors.Add(new Donor
        {
            BusinessName = model.BusinessName,
            ContactName = model.ContactName,
            ContactEmail = model.ContactEmail ?? string.Empty,
            ContactTitle = model.ContactTitle,
            Address = model.Address ?? string.Empty,
            City = model.City ?? string.Empty,
            State = model.State ?? string.Empty,
            ZipCode = model.ZipCode ?? string.Empty,
            TaxReceipt = false
        });

        return await SaveChangesAsync();
    }

    public async Task<bool> UpdateDonorAsync(int donorId, DonorFormModel model)
    {
        var donor = await db.Donors.FindAsync(donorId);
        if (donor is null)
        {
            return false;
        }

        donor.BusinessName = model.BusinessName;
        donor.ContactName = model.ContactName;
        donor.ContactEmail = model.ContactEmail ?? string.Empty;
        donor.ContactTitle = model.ContactTitle;
        donor.Address = model.Address ?? string.Empty;
        donor.City = model.City ?? string.Empty;
        donor.State = model.State ?? string.Empty;
        donor.ZipCode = model.ZipCode ?? string.Empty;
        donor.TaxReceipt = model.TaxReceipt;

        return await SaveChangesAsync();
    }

    public async Task<bool> DeleteDonorAsync(int donorId)
    {
        if (await DonorHasItemsAsync(donorId))
        {
            return false;
        }

        var donor = await db.Donors.FindAsync(donorId);
        if (donor is null)
        {
            return false;
        }

        db.Donors.Remove(donor);
        return await SaveChangesAsync();
    }

    public async Task<bool> MarkReceiptSentAsync(int donorId)
    {
        var donor = await db.Donors.FindAsync(donorId);
        if (donor is null)
        {
            return false;
        }

        donor.TaxReceipt = true;
        return await SaveChangesAsync();
    }

    private async Task<bool> SaveChangesAsync()
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
