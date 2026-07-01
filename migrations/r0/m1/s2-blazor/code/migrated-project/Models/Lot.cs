namespace migrated_project.Models;

public class Lot
{
    public int LotID { get; set; }
    public string Description { get; set; } = string.Empty;
    public int? CategoryID { get; set; }
    public decimal? WinningBid { get; set; }
    public int? WinningBidder { get; set; }
    public bool Delivered { get; set; }
    public string? Image { get; set; }

    public Category? Category { get; set; }
    public Bidder? Winner { get; set; }
    public ICollection<Item> Items { get; set; } = [];
}
