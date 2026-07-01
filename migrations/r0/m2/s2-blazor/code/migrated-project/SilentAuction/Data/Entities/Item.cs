namespace SilentAuction.Data.Entities;

public class Item
{
    public int ItemID { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal RetailValue { get; set; }
    public int DonorID { get; set; }
    public int? LotID { get; set; }

    public Donor Donor { get; set; } = null!;
    public Lot? Lot { get; set; }
}
