using Microsoft.EntityFrameworkCore;
using SilentAuction.Data.Entities;

namespace SilentAuction.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Donor> Donors => Set<Donor>();
    public DbSet<Bidder> Bidders => Set<Bidder>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Lot> Lots => Set<Lot>();
    public DbSet<Item> Items => Set<Item>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Donor>(entity =>
        {
            entity.ToTable("Donor");
            entity.HasKey(e => e.DonorID);
            entity.Property(e => e.BusinessName).HasMaxLength(75);
            entity.Property(e => e.ContactName).HasMaxLength(75);
            entity.Property(e => e.ContactEmail).HasMaxLength(200);
            entity.Property(e => e.ContactTitle).HasMaxLength(75);
            entity.Property(e => e.Address).HasMaxLength(75);
            entity.Property(e => e.City).HasMaxLength(30);
            entity.Property(e => e.State).HasMaxLength(2);
            entity.Property(e => e.ZipCode).HasMaxLength(5);
        });

        modelBuilder.Entity<Bidder>(entity =>
        {
            entity.ToTable("Bidder");
            entity.HasKey(e => e.BidderID);
            entity.Property(e => e.Name).HasMaxLength(75);
            entity.Property(e => e.Address).HasMaxLength(75);
            entity.Property(e => e.CellNumber).HasMaxLength(10);
            entity.Property(e => e.HomeNumber).HasMaxLength(10);
            entity.Property(e => e.Email).HasMaxLength(200);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Category");
            entity.HasKey(e => e.CategoryID);
            entity.Property(e => e.Description).HasMaxLength(75);
        });

        modelBuilder.Entity<Lot>(entity =>
        {
            entity.ToTable("Lot");
            entity.HasKey(e => e.LotID);
            entity.Property(e => e.Description).HasMaxLength(75);
            entity.Property(e => e.WinningBid).HasPrecision(10, 2);
            entity.Property(e => e.Image).HasMaxLength(500);
            entity.HasOne(e => e.Category)
                .WithMany(c => c.Lots)
                .HasForeignKey(e => e.CategoryID);
            entity.HasOne(e => e.WinningBidderNavigation)
                .WithMany(b => b.WonLots)
                .HasForeignKey(e => e.WinningBidder);
        });

        modelBuilder.Entity<Item>(entity =>
        {
            entity.ToTable("Item");
            entity.HasKey(e => e.ItemID);
            entity.Property(e => e.Description).HasMaxLength(75);
            entity.Property(e => e.RetailValue).HasPrecision(10, 2);
            entity.HasOne(e => e.Donor)
                .WithMany(d => d.Items)
                .HasForeignKey(e => e.DonorID);
            entity.HasOne(e => e.Lot)
                .WithMany(l => l.Items)
                .HasForeignKey(e => e.LotID);
        });
    }
}
