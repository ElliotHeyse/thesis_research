namespace SilentAuction.Services;

public static class PageDataLoader
{
    public static async Task<T?> LoadAsync<T>(Func<Task<T>> loader)
    {
        try
        {
            return await loader();
        }
        catch
        {
            return default;
        }
    }
}
