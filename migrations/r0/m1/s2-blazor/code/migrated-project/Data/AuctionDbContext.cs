using Microsoft.EntityFrameworkCore;
using migrated_project.Models;

namespace migrated_project.Data;

public class AuctionDbContext(DbContextOptions<AuctionDbContext> options) : DbContext(options)
{
    public DbSet<Donor> Donors => Set<Donor>();
    public DbSet<Bidder> Bidders => Set<Bidder>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Lot> Lots => Set<Lot>();
    public DbSet<Item> Items => Set<Item>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Donor>(e =>
        {
            e.ToTable("Donor");
            e.HasKey(d => d.DonorID);
            e.Property(d => d.BusinessName).HasMaxLength(75);
            e.Property(d => d.ContactName).HasMaxLength(75);
            e.Property(d => d.ContactEmail).HasMaxLength(200);
            e.Property(d => d.ContactTitle).HasMaxLength(75);
            e.Property(d => d.Address).HasMaxLength(75);
            e.Property(d => d.City).HasMaxLength(30);
            e.Property(d => d.State).HasMaxLength(2);
            e.Property(d => d.ZipCode).HasMaxLength(5);
        });

        modelBuilder.Entity<Bidder>(e =>
        {
            e.ToTable("Bidder");
            e.HasKey(b => b.BidderID);
            e.Property(b => b.Name).HasMaxLength(75);
            e.Property(b => b.Address).HasMaxLength(75);
            e.Property(b => b.CellNumber).HasMaxLength(10);
            e.Property(b => b.HomeNumber).HasMaxLength(10);
            e.Property(b => b.Email).HasMaxLength(200);
        });

        modelBuilder.Entity<Category>(e =>
        {
            e.ToTable("Category");
            e.HasKey(c => c.CategoryID);
            e.Property(c => c.Description).HasMaxLength(75);
        });

        modelBuilder.Entity<Lot>(e =>
        {
            e.ToTable("Lot");
            e.HasKey(l => l.LotID);
            e.Property(l => l.Description).HasMaxLength(75);
            e.Property(l => l.WinningBid).HasPrecision(10, 2);
            e.Property(l => l.Image).HasMaxLength(500);
            e.HasOne(l => l.Category)
                .WithMany(c => c.Lots)
                .HasForeignKey(l => l.CategoryID);
            e.HasOne(l => l.Winner)
                .WithMany(b => b.WonLots)
                .HasForeignKey(l => l.WinningBidder);
        });

        modelBuilder.Entity<Item>(e =>
        {
            e.ToTable("Item");
            e.HasKey(i => i.ItemID);
            e.Property(i => i.Description).HasMaxLength(75);
            e.Property(i => i.RetailValue).HasPrecision(10, 2);
            e.HasOne(i => i.Donor)
                .WithMany(d => d.Items)
                .HasForeignKey(i => i.DonorID);
            e.HasOne(i => i.Lot)
                .WithMany(l => l.Items)
                .HasForeignKey(i => i.LotID);
        });
    }
}
