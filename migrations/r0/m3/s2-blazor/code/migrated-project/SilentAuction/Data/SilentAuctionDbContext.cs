using Microsoft.EntityFrameworkCore;
using SilentAuction.Data.Entities;

namespace SilentAuction.Data;

public class SilentAuctionDbContext(DbContextOptions<SilentAuctionDbContext> options) : DbContext(options)
{
    public DbSet<Donor> Donors => Set<Donor>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<Lot> Lots => Set<Lot>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Bidder> Bidders => Set<Bidder>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Donor>(e =>
        {
            e.ToTable("Donor");
            e.HasKey(x => x.DonorID);
            e.Property(x => x.BusinessName).HasMaxLength(75);
            e.Property(x => x.ContactName).HasMaxLength(75).IsRequired();
            e.Property(x => x.ContactEmail).HasMaxLength(200).IsRequired();
            e.Property(x => x.ContactTitle).HasMaxLength(75);
            e.Property(x => x.Address).HasMaxLength(75).IsRequired();
            e.Property(x => x.City).HasMaxLength(30).IsRequired();
            e.Property(x => x.State).HasMaxLength(2).IsRequired();
            e.Property(x => x.ZipCode).HasMaxLength(5).IsRequired();
        });

        modelBuilder.Entity<Item>(e =>
        {
            e.ToTable("Item");
            e.HasKey(x => x.ItemID);
            e.Property(x => x.Description).HasMaxLength(75).IsRequired();
            e.Property(x => x.RetailValue).HasColumnType("decimal(10,2)");
            e.HasOne(x => x.Donor).WithMany(d => d.Items).HasForeignKey(x => x.DonorID);
            e.HasOne(x => x.Lot).WithMany(l => l.Items).HasForeignKey(x => x.LotID).IsRequired(false);
        });

        modelBuilder.Entity<Lot>(e =>
        {
            e.ToTable("Lot");
            e.HasKey(x => x.LotID);
            e.Property(x => x.Description).HasMaxLength(75).IsRequired();
            e.Property(x => x.WinningBid).HasColumnType("decimal(10,2)");
            e.Property(x => x.Image).HasMaxLength(500);
            e.HasOne(x => x.Category).WithMany(c => c.Lots).HasForeignKey(x => x.CategoryID).IsRequired(false);
            e.HasOne(x => x.Winner).WithMany().HasForeignKey(x => x.WinningBidder).IsRequired(false);
        });

        modelBuilder.Entity<Category>(e =>
        {
            e.ToTable("Category");
            e.HasKey(x => x.CategoryID);
            e.Property(x => x.Description).HasMaxLength(75).IsRequired();
        });

        modelBuilder.Entity<Bidder>(e =>
        {
            e.ToTable("Bidder");
            e.HasKey(x => x.BidderID);
            e.Property(x => x.Name).HasMaxLength(75).IsRequired();
            e.Property(x => x.Address).HasMaxLength(75).IsRequired();
            e.Property(x => x.CellNumber).HasMaxLength(10).IsRequired();
            e.Property(x => x.HomeNumber).HasMaxLength(10);
            e.Property(x => x.Email).HasMaxLength(200).IsRequired();
        });
    }
}
