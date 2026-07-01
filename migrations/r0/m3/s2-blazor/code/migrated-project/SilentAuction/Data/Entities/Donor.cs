namespace SilentAuction.Data.Entities;

public class Donor
{
    public int DonorID { get; set; }
    public string? BusinessName { get; set; }
    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string? ContactTitle { get; set; }
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public bool TaxReceipt { get; set; }

    public ICollection<Item> Items { get; set; } = [];
}
