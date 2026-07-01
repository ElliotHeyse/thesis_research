namespace SilentAuction.Data.Entities;

public class Category
{
    public int CategoryID { get; set; }
    public string Description { get; set; } = string.Empty;

    public ICollection<Lot> Lots { get; set; } = [];
}
