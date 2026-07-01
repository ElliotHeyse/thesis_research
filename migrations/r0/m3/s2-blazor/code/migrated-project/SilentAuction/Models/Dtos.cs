namespace SilentAuction.Models;

public class ItemListDto
{
    public int ItemID { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal RetailValue { get; set; }
    public int DonorID { get; set; }
    public int? LotID { get; set; }
    public string? BusinessName { get; set; }
    public string? LotDescription { get; set; }
}

public class ItemDetailDto
{
    public int ItemID { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal RetailValue { get; set; }
    public int DonorID { get; set; }
    public int? LotID { get; set; }
    public string? BusinessName { get; set; }
    public string? ContactName { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactTitle { get; set; }
    public string? LotDescription { get; set; }
    public int? CategoryID { get; set; }
}

public class LotListDto
{
    public int LotID { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal? WinningBid { get; set; }
    public string? Winner { get; set; }
    public bool Delivered { get; set; }
    public string? Category { get; set; }
}

public class LotDetailDto
{
    public int LotID { get; set; }
    public string Description { get; set; } = string.Empty;
    public int? CategoryID { get; set; }
    public string? CategoryDescription { get; set; }
    public decimal? WinningBid { get; set; }
    public int? WinningBidder { get; set; }
    public string? WinnerName { get; set; }
    public bool Delivered { get; set; }
    public string? Image { get; set; }
}

public class DonorPendingReceiptDto
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
    public int TotalItems { get; set; }
    public decimal TotalValue { get; set; }
}

public class AuctionItemDto
{
    public int ItemID { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal RetailValue { get; set; }
    public int? CategoryID { get; set; }
}

public class DonorWithItemsDto
{
    public Data.Entities.Donor Donor { get; set; } = null!;
    public List<Data.Entities.Item> Items { get; set; } = [];
}

public class LotOptionDto
{
    public int LotID { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class BidderOptionDto
{
    public int BidderID { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class DonorSelectDto
{
    public int DonorID { get; set; }
    public string? BusinessName { get; set; }
    public string ContactName { get; set; } = string.Empty;
}
