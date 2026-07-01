using Microsoft.EntityFrameworkCore;
using migrated_project.Components;
using migrated_project.Data;
using migrated_project.Endpoints;
using migrated_project.Services;
using QuestPDF.Infrastructure;

QuestPDF.Settings.License = LicenseType.Community;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AuctionDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 36))));

builder.Services.AddScoped<DonorService>();
builder.Services.AddScoped<ItemService>();
builder.Services.AddScoped<LotService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<AuctionService>();
builder.Services.AddSingleton<PdfService>();

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
}

app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.MapPdfEndpoints();

app.Run();
