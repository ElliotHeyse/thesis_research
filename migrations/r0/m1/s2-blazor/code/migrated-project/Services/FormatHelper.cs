namespace migrated_project.Services;

public static class FormatHelper
{
    public static string OrDash(string? value) =>
        string.IsNullOrWhiteSpace(value) ? "—" : value;

    public static string OrDash(object? value) =>
        value switch
        {
            null => "—",
            string s when string.IsNullOrWhiteSpace(s) => "—",
            decimal d => d.ToString("0.##"),
            _ => value.ToString() ?? "—"
        };

    public static string Currency(decimal? value) =>
        value.HasValue ? $"${value.Value:N2}" : "—";

    public static string YesNo(bool value) => value ? "Yes" : "No";
}
