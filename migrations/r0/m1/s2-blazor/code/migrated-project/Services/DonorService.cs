using Microsoft.EntityFrameworkCore;
using migrated_project.Data;
using migrated_project.Models;

namespace migrated_project.Services;

public class DonorService(AuctionDbContext db)
{
    public async Task<List<Donor>> GetAllAsync(CancellationToken ct = default) =>
        await db.Donors
            .OrderBy(d => d.BusinessName).ThenBy(d => d.ContactName)
            .ToListAsync(ct);

    public async Task<Donor?> GetByIdAsync(int id, CancellationToken ct = default) =>
        await db.Donors.FindAsync([id], ct);

    public async Task<List<(int DonorID, string Label)>> GetForSelectAsync(CancellationToken ct = default)
    {
        var donors = await GetAllAsync(ct);
        return donors.Select(d => (d.DonorID, FormatDonorLabel(d))).ToList();
    }

    public async Task<List<DonorPendingReceiptRow>> GetPendingReceiptsAsync(CancellationToken ct = default) =>
        await db.Donors
            .Where(d => !d.TaxReceipt && d.Items.Any())
            .Select(d => new DonorPendingReceiptRow
            {
                DonorID = d.DonorID,
                BusinessName = d.BusinessName,
                ContactName = d.ContactName,
                ContactEmail = d.ContactEmail,
                City = d.City,
                State = d.State,
                TaxReceipt = d.TaxReceipt,
                TotalItems = d.Items.Count,
                TotalValue = d.Items.Sum(i => i.RetailValue)
            })
            .OrderBy(d => d.ContactName).ThenBy(d => d.BusinessName)
            .ToListAsync(ct);

    public async Task<List<Donor>> GetEligibleForReceiptAsync(CancellationToken ct = default) =>
        await db.Donors
            .Where(d => !d.TaxReceipt && d.Items.Any())
            .OrderBy(d => d.BusinessName).ThenBy(d => d.ContactName)
            .ToListAsync(ct);

    public async Task<List<Item>> GetItemsByDonorIdAsync(int donorId, CancellationToken ct = default) =>
        await db.Items
            .Where(i => i.DonorID == donorId)
            .OrderBy(i => i.Description)
            .ToListAsync(ct);

    public async Task<bool> HasItemsAsync(int donorId, CancellationToken ct = default) =>
        await db.Items.AnyAsync(i => i.DonorID == donorId, ct);

    public async Task<bool> AddAsync(Donor donor, CancellationToken ct = default)
    {
        db.Donors.Add(donor);
        return await SaveAsync(ct);
    }

    public async Task<bool> UpdateAsync(Donor donor, CancellationToken ct = default)
    {
        db.Donors.Update(donor);
        return await SaveAsync(ct);
    }

    public async Task<bool> DeleteAsync(int donorId, CancellationToken ct = default)
    {
        if (await HasItemsAsync(donorId, ct))
            return false;

        var donor = await db.Donors.FindAsync([donorId], ct);
        if (donor is null)
            return false;

        db.Donors.Remove(donor);
        return await SaveAsync(ct);
    }

    public async Task MarkReceiptSentAsync(int donorId, CancellationToken ct = default)
    {
        var donor = await db.Donors.FindAsync([donorId], ct);
        if (donor is not null)
        {
            donor.TaxReceipt = true;
            await db.SaveChangesAsync(ct);
        }
    }

    public static string DisplayName(Donor donor) =>
        !string.IsNullOrWhiteSpace(donor.BusinessName) ? donor.BusinessName : donor.ContactName;

    private static string FormatDonorLabel(Donor donor)
    {
        var label = DisplayName(donor);
        if (!string.IsNullOrWhiteSpace(donor.ContactName) && label != donor.ContactName)
            return $"{label} ({donor.ContactName})";
        if (!string.IsNullOrWhiteSpace(donor.ContactName))
            return donor.ContactName;
        return label;
    }

    private async Task<bool> SaveAsync(CancellationToken ct)
    {
        try
        {
            await db.SaveChangesAsync(ct);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
