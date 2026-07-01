namespace SilentAuction.Models;

public class DonorFormModel
{
    public string? BusinessName { get; set; }
    public string ContactName { get; set; } = string.Empty;
    public string? ContactEmail { get; set; }
    public string? ContactTitle { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public bool TaxReceipt { get; set; }
}

public class ItemFormModel
{
    public string Description { get; set; } = string.Empty;
    public decimal RetailValue { get; set; }
    public int DonorID { get; set; }
    public int? LotID { get; set; }
}

public class LotFormModel
{
    public string Description { get; set; } = string.Empty;
    public int? CategoryID { get; set; }
    public decimal? WinningBid { get; set; }
    public int? WinningBidder { get; set; }
    public bool Delivered { get; set; }
    public string? Image { get; set; }
}

public class CategoryFormModel
{
    public string Description { get; set; } = string.Empty;
}
