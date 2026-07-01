namespace SilentAuction.Services;

public static class FormatHelper
{
    public static string OrDash(string? value) =>
        string.IsNullOrWhiteSpace(value) ? "—" : value;

    public static string Currency(decimal? value) =>
        value.HasValue ? $"${value.Value:N2}" : "—";

    public static string YesNo(bool value) => value ? "Yes" : "No";

    public static string DonorDisplayName(string? businessName, string? contactName)
    {
        if (!string.IsNullOrWhiteSpace(businessName))
        {
            return businessName;
        }

        return contactName ?? string.Empty;
    }

    public static string DonorSelectLabel(string? businessName, string? contactName)
    {
        var label = DonorDisplayName(businessName, contactName);
        if (!string.IsNullOrWhiteSpace(contactName) && label != contactName)
        {
            return $"{label} ({contactName})";
        }

        return !string.IsNullOrWhiteSpace(contactName) ? contactName : label;
    }
}
