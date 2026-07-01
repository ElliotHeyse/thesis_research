using Microsoft.EntityFrameworkCore;
using SilentAuction.Components;
using SilentAuction.Data;
using SilentAuction.Data.Repositories;
using SilentAuction.Pdf;
using SilentAuction.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var connectionString = builder.Configuration.GetConnectionString("SilentAuction")
    ?? throw new InvalidOperationException("Connection string 'SilentAuction' not found.");

var serverVersion = ServerVersion.Parse("8.0.0-mysql");

builder.Services.AddDbContext<SilentAuctionDbContext>(options =>
    options.UseMySql(connectionString, serverVersion));

builder.Services.AddScoped<IDonorRepository, DonorRepository>();
builder.Services.AddScoped<IItemRepository, ItemRepository>();
builder.Services.AddScoped<ILotRepository, LotRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IAuctionRepository, AuctionRepository>();

builder.Services.AddScoped<DonorService>();
builder.Services.AddScoped<ItemService>();
builder.Services.AddScoped<LotService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<AuctionService>();
builder.Services.AddScoped<PdfService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();
app.UseAntiforgery();

app.MapStaticAssets();

app.MapPost("/api/pdf/donor-letters", async (HttpContext ctx, PdfService pdfService) =>
{
    var form = await ctx.Request.ReadFormAsync();
    var donorIds = form["donorIds"].Select(id => int.TryParse(id, out var n) ? n : 0).Where(id => id > 0).ToList();
    if (donorIds.Count == 0)
        return Results.Redirect("/donors/letters?error=no_selection");

    var pdf = await pdfService.GenerateDonorLettersAsync(donorIds);
    if (pdf is null)
        return Results.Redirect("/donors/letters?error=no_selection");

    return Results.File(pdf, "application/pdf", "donor-letters.pdf");
}).DisableAntiforgery();

app.MapPost("/api/pdf/tax-receipts", async (HttpContext ctx, PdfService pdfService) =>
{
    var form = await ctx.Request.ReadFormAsync();
    var donorIds = form["donorIds"].Select(id => int.TryParse(id, out var n) ? n : 0).Where(id => id > 0).ToList();
    if (donorIds.Count == 0)
        return Results.Redirect("/donors/receipts?error=no_selection");

    var pdf = await pdfService.GenerateTaxReceiptsAsync(donorIds);
    if (pdf is null)
        return Results.Redirect("/donors/receipts?error=no_selection");

    return Results.File(pdf, "application/pdf", "tax-receipts.pdf");
}).DisableAntiforgery();

app.MapGet("/api/pdf/bidding-sheet/{itemId:int}", async (
    int itemId,
    decimal? startingBid,
    decimal? bidIncrement,
    int? rows,
    PdfService pdfService) =>
{
    var pdf = await pdfService.GenerateBiddingSheetAsync(itemId, startingBid, bidIncrement, rows);
    if (pdf is null)
        return Results.Redirect("/lots/items?error=notfound");

    return Results.File(pdf, "application/pdf", $"bidding-sheet-item-{itemId}.pdf");
}).DisableAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
