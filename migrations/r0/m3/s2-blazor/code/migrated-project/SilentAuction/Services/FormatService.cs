using System.Globalization;
using SilentAuction.Data.Entities;

namespace SilentAuction.Services;

public static class FormatService
{
    public static string FormatOrDash(string? value) =>
        string.IsNullOrWhiteSpace(value) ? "-" : value;

    public static string FormatYesNo(bool value) => value ? "Yes" : "No";

    public static string FormatCurrency(decimal? amount) =>
        amount is null ? "-" : $"${amount.Value.ToString("N2", CultureInfo.InvariantCulture)}";

    public static string GetDonorDisplayName(Donor donor) =>
        !string.IsNullOrWhiteSpace(donor.BusinessName) ? donor.BusinessName : donor.ContactName;

    public static string GetDonorDisplayName(string? businessName, string contactName) =>
        !string.IsNullOrWhiteSpace(businessName) ? businessName : contactName;
}
