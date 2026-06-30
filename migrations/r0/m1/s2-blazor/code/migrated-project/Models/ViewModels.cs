namespace migrated_project.Models;

public class ItemListRow
{
    public int ItemID { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal RetailValue { get; set; }
    public int DonorID { get; set; }
    public int? LotID { get; set; }
    public string? BusinessName { get; set; }
    public string? LotDescription { get; set; }
}

public class LotListRow
{
    public int LotID { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal? WinningBid { get; set; }
    public string? Winner { get; set; }
    public bool Delivered { get; set; }
    public string? Category { get; set; }
}

public class DonorPendingReceiptRow
{
    public int DonorID { get; set; }
    public string? BusinessName { get; set; }
    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public bool TaxReceipt { get; set; }
    public int TotalItems { get; set; }
    public decimal TotalValue { get; set; }
}

public class AuctionItemRow
{
    public int ItemID { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal RetailValue { get; set; }
    public int? CategoryID { get; set; }
}

public class ItemLotChange
{
    public int ItemID { get; set; }
    public int NewLotID { get; set; }
}

public class BiddingSheetItem
{
    public int ItemID { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal RetailValue { get; set; }
    public int? LotID { get; set; }
    public string? BusinessName { get; set; }
    public string? ContactName { get; set; }
    public string? LotDescription { get; set; }
    public int? CategoryID { get; set; }
    public string? CategoryDescription { get; set; }
}
