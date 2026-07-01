namespace SilentAuction.Data.Entities;

public class Bidder
{
    public int BidderID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string CellNumber { get; set; } = string.Empty;
    public string? HomeNumber { get; set; }
    public string Email { get; set; } = string.Empty;
    public bool Paid { get; set; }
}
