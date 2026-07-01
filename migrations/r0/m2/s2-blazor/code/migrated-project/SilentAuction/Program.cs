using Microsoft.EntityFrameworkCore;
using SilentAuction.Components;
using SilentAuction.Data;
using SilentAuction.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 0))));

builder.Services.AddScoped<DonorService>();
builder.Services.AddScoped<ItemService>();
builder.Services.AddScoped<LotService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<AuctionService>();
builder.Services.AddScoped<PdfService>();
builder.Services.AddScoped<FlashMessageService>();

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
app.MapControllers();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
